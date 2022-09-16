import {
  InjectedModalProps,
  Modal,
  Flex,
  Text,
  Button,
  Grid,
  ButtonMenu,
  ButtonMenuItem,
  Link,
  Message,
  Box,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { useRef, useCallback, useState } from 'react'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import useTokenBalance from 'hooks/useTokenBalance'
import tokens from 'config/constants/tokens'
import { escapeRegExp } from 'utils'
import { useNftStageContract, useNftStageMarketContract, useTokenContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import {
  useCheckTTCApprovalStatus,
  useApproveTTC,
  useCheckNftApprovalForAllStatus,
  useSetApproveAll,
} from '../../hook/useApprove'
import { RoundedImage } from 'views/Nft/market/Collection/IndividualNFTPage/shared/styles'
import PreviewImage from 'views/Nft/market/components/CollectibleCard/PreviewImage'

import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getBalanceNumber } from 'utils/formatBalance'
interface InviteModalProps extends InjectedModalProps {
  nft: any
  metaData: any
  customOnDismiss: () => void
}

const BorderedBox = styled(Box)`
  margin: 16px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  /* grid-template-columns: 1fr 1fr;
  grid-row-gap: 8px; */
`
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const BuyModal: React.FC<InviteModalProps> = ({ nft, metaData, customOnDismiss, onDismiss }) => {
  console.log('log=====nft', nft)
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [price, setPrice] = useState('')
  const ttc_contract = useTokenContract(tokens.ttc.address)
  const nftStageContract = useNftStageContract()
  const nftStageMarketContract = useNftStageMarketContract()
  const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)
  const { balance: usdtBalance } = useTokenBalance(tokens.ttc.address)
  console.log('log=====balance', ttcBalance.toNumber())
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { isTTCApproved, setTTCLastUpdated } = useCheckTTCApprovalStatus(
    ttc_contract.address,
    nftStageMarketContract.address,
  )

  const { handleTTCApprove: handleTTCApprove, pendingTx: pendingTTCTx } = useApproveTTC(
    ttc_contract.address,
    nftStageMarketContract.address,
    setTTCLastUpdated,
  )

  const { isApprovedForAll, setNftApprovalAllLastUpdated } = useCheckNftApprovalForAllStatus()

  const { handleSetApproveAll: handleSetApproveAll, pendingTx: pendingApproveAllTx } =
    useSetApproveAll(setNftApprovalAllLastUpdated)
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setPrice(nextUserInput)
    }
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    enforcer(event.target.value.replace(/,/g, '.'))
  }
  const handleConfirmClick = async () => {
    if (!isApprovedForAll) {
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(nftStageContract, 'setApprovalForAll', [nftStageMarketContract.address, true])
      })
      if (receipt?.status) {
        toastSuccess(
          t('Contract Enabled'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {/* {t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol })} */}
          </ToastDescriptionWithTx>,
        )
        handleBuy()
        // dispatch(updateUserAllowance({ sousId, account }))
      }
    } else {
      handleBuy()
    }
    // handleSell()
    // handleDismiss()
  }

  const handleBuy = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(nftStageMarketContract, 'createMarketSale', [
        nftStageContract.address,
        nft['itemId'].toNumber(),
      ])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('您已成功购买!', { symbol: 'TTC' })}
        </ToastDescriptionWithTx>,
      )
      handleDismiss()
    }
  }

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  return (
    <Modal title={t('购买碎片')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Flex flexDirection="column" maxWidth="350px">
        <Flex alignItems="center" mb="16px" justifyContent="space-between">
          <Box mr="16px">
            <Flex mt={20} justifyContent="space-between" alignItems="center">
              <Flex alignItems="center" flex={1}>
                {/* <img className="img-small" src={metaData ? metaData.image : '/images/blindbox.jpg'} width={50} /> */}
                <RoundedImage height={40} width={40} src={metaData ? metaData.image : ''} as={PreviewImage} />

                <Box ml={10}>
                  <Text color="textSubtle" fontSize={12}>
                    #{nft['itemId'].toNumber()}-{nft['tokenId'].toNumber()}
                  </Text>
                  <Text color="text" fontSize={12}>
                    {metaData ? metaData.description : ''}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        <BorderedBox>
          <Flex justifyContent="space-between" alignItems="center">
            <Text small color="textSubtle">
              {t('Pay with')}
            </Text>
            <Text small color="text" fontSize={16}>
              TTC
            </Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text small color="textSubtle">
              {t('Total payment')}
            </Text>
            <Text display="inline" color="text" fontSize={16}>
              {Number(nft['price'].toString()) / Math.pow(10, 18)}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text small color="textSubtle">
              {t('%symbol% in wallet', { symbol: 'TTC' })}
            </Text>
            {!account ? (
              <Flex justifySelf="flex-end">
                <ConnectWalletButton scale="sm" />
              </Flex>
            ) : (
              getBalanceNumber(ttcBalance).toFixed(8)
            )}
          </Flex>
        </BorderedBox>
        {/* <Message p="8px" variant="danger" >
          <Text>
            {t('Not enough %symbol% to purchase this NFT', {
              symbol: 'TTC',
            })}
          </Text>
        </Message> */}
        <Flex flexDirection="column" pt="16px" alignItems="center">
          {isTTCApproved ? (
            <Button
              width="100%"
              isLoading={pendingTx}
              endIcon={pendingTx ? <AutoRenewIcon color="currentColor" spin /> : null}
              onClick={handleConfirmClick}
            >
              {t('Confirm')}
            </Button>
          ) : (
            <Button
              mt="8px"
              width="100%"
              isLoading={pendingTTCTx}
              disabled={pendingTTCTx}
              onClick={handleTTCApprove}
              endIcon={pendingTTCTx ? <AutoRenewIcon color="currentColor" spin /> : null}
            >
              {t('授权')}
            </Button>
          )}
        </Flex>
      </Flex>
    </Modal>
  )
}

export default BuyModal
