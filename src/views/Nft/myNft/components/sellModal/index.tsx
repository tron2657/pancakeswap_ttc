import { InjectedModalProps, Modal, Flex, Text, Button, Link, Input, Box, AutoRenewIcon } from '@pancakeswap/uikit'
import { useRef, useCallback, useState } from 'react'
import useTheme from 'hooks/useTheme'
import { escapeRegExp } from 'utils'
import {
  useNftStageContract,
  useNftStageMarketContract,
  useNftCardContract,
  useNftCardMarketContract,
  useTokenContract,
} from 'hooks/useContract'
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

import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import tokens from 'config/constants/tokens'
interface InviteModalProps extends InjectedModalProps {
  tokenId: String
  customOnDismiss: () => void
}
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const SellModal: React.FC<InviteModalProps> = ({ tokenId, customOnDismiss, onDismiss }) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [price, setPrice] = useState('')
  const ttc_contract = useTokenContract(tokens.ttc.address)
  const nftStageContract = useNftStageContract()
  const nftStageMarketContract = useNftStageMarketContract()
  const nftCardContract = useNftCardContract()
  const nftCardMarketContract = useNftCardMarketContract()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { isTTCApproved, setTTCLastUpdated } = useCheckTTCApprovalStatus(
    ttc_contract.address,
    nftCardMarketContract.address,
  )

  const { handleTTCApprove: handleTTCApprove, pendingTx: pendingTTCTx } = useApproveTTC(
    ttc_contract.address,
    nftCardMarketContract.address,
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
        return callWithGasPrice(nftCardContract, 'setApprovalForAll', [nftCardMarketContract.address, true])
      })
      if (receipt?.status) {
        toastSuccess(
          t('Contract Enabled'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {/* {t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol })} */}
          </ToastDescriptionWithTx>,
        )
        handleSell()
        // dispatch(updateUserAllowance({ sousId, account }))
      }
    } else {
      handleSell()
    }
    // handleSell()
    // handleDismiss()
  }

  const handleSell = async () => {
    let _price = Number(price) * Math.pow(10, 18)
    console.log('log======_price', _price)
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(nftCardMarketContract, 'createMarketItem', [
        nftCardContract.address,
        tokenId,
        _price.toString(),
      ])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('您已成功挂售!', { symbol: 'TTC' })}
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
    <Modal title={t('输入挂卖')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Flex flexDirection="column" maxWidth="350px">
        <Flex alignItems="center" mb="16px" justifyContent="space-between">
          <Box mr="16px">
            <Input
              ref={inputRef}
              type="text"
              pattern="^[0-9]*[.,]?[0-9]*$"
              value={price}
              inputMode="decimal"
              placeholder="请输入价格"
              onChange={handleInputChange}
            />
          </Box>
        </Flex>

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

export default SellModal
