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
import { useNftStageContract, useNftStageMarketContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useTranslation } from 'contexts/Localization'
import { MaxUint256 } from '@ethersproject/constants'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import BigNumber from 'bignumber.js'
import SellModal from './components/sellModal'
import BlindBoxPriceModal from './components/blindBoxPriceModal'
import { RoundedImage } from 'views/Nft/market/Collection/IndividualNFTPage/shared/styles'
import PreviewImage from 'views/Nft/market/components/CollectibleCard/PreviewImage'

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
  const { toastSuccess, toastError } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [nftList, setNftList] = useState([])
  const [canOpen, setCanOpen] = useState(false)
  const [isOpened, setIsOpend] = useState(false)
  const [blindUri, setBlindUri] = useState('')
  const [hasStage, setHasStage] = useState(false)
  const nftStageContract = useNftStageContract()
  const nftStageMarketContract = useNftStageMarketContract()
  const handleOpneBox = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(nftStageMarketContract, 'openBox', [])
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
      const whitelistedStatus = await nftStageMarketContract.whiteList(account)
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
    const _isOpened = await nftStageMarketContract.addressToOpenBox(account)
    console.log('log==_isOpened==', _isOpened)
    setIsOpend(_isOpened)
  }

  const checkHasStage = async () => {
    const _hasStage = await nftStageMarketContract.hasStage()
    console.log('log==_hasStage==', _hasStage)
    setHasStage(_hasStage)
  }

  const getBlindBoxUri = async () => {
    const uri = await nftStageContract.notRevealedUri()
    console.log('log==uri', uri)
    setBlindUri(uri)
  }
  useEffect(() => {
    if (account) {
      getBlindBoxUri()
      checkOpend()
      checkHasStage()
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
        // const url = await nftStageContract.tokenURI(item)
        // const metaData = await getMetaData(url)
        const url = await nftStageContract.baseURI()
        const metaData = await getMetaData(url + '/' + item.toString() + '.json')
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
          {/* <img className="img-small" src={metaData ? metaData.image : '/images/blindbox.jpg'} /> */}
          <RoundedImage height={40} width={40} src={metaData ? metaData.image : ''} as={PreviewImage} />

          <Box ml={10}>
            <Text color="textSubtle" fontSize={12}>
              #{item.toNumber()}
            </Text>
            <Text color="text" fontSize={12} fontWeight="bold">
              {metaData ? metaData.name : ''}
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

  const RenderOpenBox = () => {
    const [onPresentBlindBoxPriceModal, closeBlindBoxPriceModal] = useModal(
      <BlindBoxPriceModal
        customOnDismiss={() => {
          refreshData()
        }}
      />,
    )

    return (
      <Button
        width="100%"
        mt={20}
        onClick={() => {
          if (!hasStage) {
            toastError('盲盒已开完!')
            return
          }
          onPresentBlindBoxPriceModal()
        }}
        disabled={isOpened}
      >
        <Flex justifyContent="center" alignItems="center">
          {isOpened ? '已开启' : '开启盲盒'}
        </Flex>
      </Button>
    )
  }

  const refreshData = async () => {
    getAllToken()
    checkOpend()
  }
  return (
    <Page>
      {canOpen ? (
        <Box width="100%">
          <StyledCard>
            <Box padding="20px">
              <img className="blindbox-img" src={blindUri}></img>
              <RenderOpenBox></RenderOpenBox>
              {/* <Button
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
              </Button> */}
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
