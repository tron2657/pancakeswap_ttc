import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Flex,
  Grid,
  Heading,
  Text,
  Td,
  ProfileAvatar,
  BnbUsdtPairTokenIcon,
  Table,
  Th,
  Card,
  Box,
  Image,
  useMatchBreakpointsContext,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { CardBody, CardFooter, Button } from '@pancakeswap/uikit'
import { AppHeader, AppBody } from '../../../components/App'
import useTheme from 'hooks/useTheme'
import {
  useNftStageContract,
  useNftStageMarketContract,
  useNftCardContract,
  useNftCardMarketContract,
} from 'hooks/useContract'

import Page from '../../Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from 'contexts/Localization'
import { ToastDescriptionWithTx } from 'components/Toast'

const Body = styled(CardBody)`
  background-color: #eee;
`

const InnerBox = styled.div`
  align-self: baseline;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 24px;
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

const FlexWrapper = styled(Flex)`
  .img-wrapper {
    width: 40px;
    height: 40px;
    background: #eeeeee;
    border-radius: 8px;
  }
`

const Synthesis = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const nftStageMarketContract = useNftStageMarketContract()
  const nftStageContract = useNftStageContract()
  const nftCardContract = useNftCardContract()
  const nftCardMarketContract = useNftCardMarketContract()
  const [nftCardList, setNftCardList] = useState([])

  const getAllNftCard = async () => {
    const nftCards = await nftCardContract.getAllToken(nftStageContract.address, 100)
    console.log('log====nftCards', nftCards)
    setNftCardList(nftCards)
  }

  useEffect(() => {
    if (account) {
      getAllNftCard()
    }
  }, [account])

  const RenderNftStage = ({ itemId }) => {
    const [metaData, setMetaData] = useState(null)
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
    useEffect(() => {
      const handleGetMetaData = async () => {
        // const url = await nftStageContract.tokenURI(itemId)
        // const metaData = await getMetaData(url)

        const url = await nftStageContract.baseURI()
        const metaData = await getMetaData(url + '/' + itemId + '.json')
        setMetaData(metaData)
      }
      if (account) {
        handleGetMetaData()
      }
    }, [account])
    return <img className="img-small" src={metaData ? metaData.image : '/images/blindbox.jpg'} />
  }

  const RenderStageItems = ({ itemId }) => {
    console.log('log====itemId', itemId.toNumber())
    const [stageList, setStageLis] = useState([])
    const [needStageList, setNeedStageLis] = useState([])
    const { toastSuccess } = useToast()
    const { callWithGasPrice } = useCallWithGasPrice()
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

    const getAllNftStage = async (itemId) => {
      const items = await nftStageContract.getCardAllSubNft(itemId, account, 100)
      console.log('log====getAllNftStage', items)
      setStageLis(items)
    }

    const getCardToStageData = async (cardId) => {
      const stages = await nftCardContract.getCardToStageData(cardId)
      console.log('log====stages', cardId, stages)
      setNeedStageLis(stages)
    }

    const handleComposeNft = async () => {
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(nftStageContract, 'composeNft', [nftCardContract.address, itemId.toNumber()])
      })
      if (receipt?.status) {
        toastSuccess(
          t('Contract Enabled'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('您成功合成一张NFT!', { symbol: 'TTC' })}
          </ToastDescriptionWithTx>,
        )
      }
      getAllNftStage(itemId.toNumber())
    }

    useEffect(() => {
      if (account) {
        getCardToStageData(itemId.toNumber())
        getAllNftStage(itemId.toNumber())
      }
    }, [account])
    return (
      <Box>
        <Flex mt={20} justifyContent="flex-start" flexWrap="wrap" alignItems="center">
          {needStageList.map((item, index) => {
            return (
              <FlexWrapper flexDirection="column" justifyContent="center" alignItems="center" mb={10} mr={10}>
                <Box className="img-wrapper">
                  {/* <img className="img-small" src="/images/blindbox.jpg" /> */}
                  {/* <RenderNftStage itemId={item}></RenderNftStage> */}
                  {stageList.map((stage, indexStage) => {
                    return indexStage == index ? <RenderNftStage itemId={stage}></RenderNftStage> : null
                  })}
                </Box>
                <Box>
                  <Text color="text" fontSize={12}>
                    0{index + 1}
                  </Text>
                </Box>
              </FlexWrapper>
            )
          })}
        </Flex>
        <Button
          width="100%"
          mt={10}
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={needStageList.length != stageList.length}
          onClick={handleComposeNft}
        >
          <Flex justifyContent="center" alignItems="center">
            合成
          </Flex>
        </Button>
      </Box>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title={'合成NFT'} subtitle="每个NFT由9个对应的碎片合成" backTo="/nfts/blindbox" noConfig />
        {nftCardList.map((item) => {
          return (
            <Body>
              <InnerBox>
                <Text bold mb="24px" color="secondary">
                  #{item.toString()}
                </Text>
                <RenderStageItems itemId={item}></RenderStageItems>
              </InnerBox>
            </Body>
          )
        })}
      </AppBody>
    </Page>
  )
}

export default Synthesis
