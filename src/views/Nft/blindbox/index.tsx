import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Flex,
  Grid,
  Heading,
  Text,
  ProfileAvatar,
  BnbUsdtPairTokenIcon,
  Table,
  Th,
  Card,
  Box,
  Image,
  AutoRenewIcon,
  useModal,
} from '@pancakeswap/uikit'
import Link from 'next/link'
import { CardBody, CardFooter, Button } from '@pancakeswap/uikit'
import Page from '../../Page'
import styled from 'styled-components'
import { useNftStageContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useTranslation } from 'contexts/Localization'
import { MaxUint256 } from '@ethersproject/constants'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import BigNumber from 'bignumber.js'
import SellModal from './components/sellModal'

const Body = styled(CardBody)``

const StyledCard = styled(Card)`
  align-self: baseline;
  width: 100%;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
  .blindbox-img {
    border-radius: 16px;
  }
  .img-small {
    border-radius: 4px;
    width: 40px;
    height: 40px;
  }
`

const BlindBox = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [nftList, setNftList] = useState([])
  const [canOpen, setCanOpen] = useState(false)
  const [isOpened, setIsOpend] = useState(false)
  const nftStageContract = useNftStageContract()
  const handleOpneBox = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(nftStageContract, 'openBox', [])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('您成功获得一张碎片NFT!', { symbol: 'TTC' })}
        </ToastDescriptionWithTx>,
      )
      checkOpend()
      getAllToken()
    }
  }

  const checkAccount = async () => {
    try {
      const whitelistedStatus = await nftStageContract.whiteList(account)
      console.log('whitelistedStatus==', whitelistedStatus)
      setCanOpen(whitelistedStatus)
    } catch (error) {
      console.error('Failed to check if account is whitelisted', error)
    }
  }

  const getAllToken = async () => {
    const items = await nftStageContract.getAllToken(account, 10)
    setNftList(items)
  }

  const getMetaData = async (url) => {
    const res = await fetch(url, {
      method: 'get',
    })
    if (res.ok) {
      const json = await res.json()
      console.log('items==res==', json)
      return json
    }
  }

  const checkOpend = async () => {
    const _isOpened = await nftStageContract.addressToOpenBox(account)
    console.log('log==_isOpened==', _isOpened)
    setIsOpend(_isOpened)
  }
  useEffect(() => {
    if (account) {
      checkOpend()
      checkAccount()
      getAllToken()
    }
    // Refresh UI if user logs out
  }, [account])

  const RenderItems = ({ item, callback }) => {
    console.log('log===RenderItems', item)
    const [metaData, setMetaData] = useState(null)
    useEffect(() => {
      const handleGetMetaData = async () => {
        const url = await nftStageContract.tokenURI(item)
        const metaData = await getMetaData(url)
        setMetaData(metaData)
      }
      if (account) {
        handleGetMetaData()
      }
    }, [account])

    const [onPresentSellModal, closePresentSellModal] = useModal(
      <SellModal tokenId={item.toString()} customOnDismiss={callback} />,
    )
    return (
      <Flex mt={20} justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" flex={1}>
          <img className="img-small" src={metaData ? metaData.image : '/images/blindbox.jpg'} />
          <Box ml={10}>
            <Text color="textSubtle" fontSize={12}>
              #{item.toNumber()}
            </Text>
            <Text color="text" fontSize={12}>
              {metaData ? metaData.description : ''}
            </Text>
          </Box>
        </Flex>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          {/* <Box>
            <Text display="inline" color="textSubtle" fontSize={12}>
              TTC
            </Text>
            <Text display="inline" color="text" fontSize={12}>
              0.22
            </Text>
          </Box> */}
          <Button scale="sm" onClick={onPresentSellModal}>
            {t('挂卖')}
          </Button>
        </Flex>
      </Flex>
    )
  }
  return (
    <Page>
      {canOpen ? (
        <Box width="100%">
          <StyledCard>
            <Box padding="20px">
              <img className="blindbox-img" src="/images/blindbox.jpg"></img>
              <Button
                width="100%"
                mt={20}
                onClick={handleOpneBox}
                isLoading={pendingTx}
                disabled={isOpened}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              >
                <Flex justifyContent="center" alignItems="center">
                  {isOpened ? '已开启' : '开启盲盒'}
                </Flex>
              </Button>
              <Text color="textSubtle" mt={15} fontSize={12}>
                每个地址仅能开启一次
              </Text>
            </Box>
            {/* <Image className="share" src="/images/blindbox.jpg" alt="Share" width={558} height={558} /> */}
          </StyledCard>
        </Box>
      ) : (
        <></>
      )}
      <Box width="100%">
        <StyledCard>
          <Box padding="20px">
            <Text color="text" fontSize={16} fontWeight={600}>
              我的碎片
            </Text>
            {nftList.map((item) => {
              return <RenderItems item={item} callback={getAllToken}></RenderItems>
            })}
            <Link href="/nfts/synthesis" passHref>
              <Button width="100%" mt={20}>
                <Flex justifyContent="center" alignItems="center">
                  合成NFT
                </Flex>
              </Button>
            </Link>
          </Box>
          {/* <Image className="share" src="/images/blindbox.jpg" alt="Share" width={558} height={558} /> */}
        </StyledCard>
      </Box>
    </Page>
  )
}

export default BlindBox
