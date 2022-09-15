import { useEffect, useState } from 'react'
import {
    ArrowForwardIcon,
    Flex,
    Text,
    Button,
    useMatchBreakpointsContext,
    useModal,
    Image,
    Card,
    Box
} from '@pancakeswap/uikit'
import { CardBody, CardFooter } from '@pancakeswap/uikit'

import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'

import { NextLinkFromReactRouter } from 'components/NextLink'
import { ViewMode } from 'state/user/actions'
import styled from 'styled-components'
import { useGetShuffledCollections } from 'state/nftMarket/hooks'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import {
    useNftStageContract,
    useNftStageMarketContract,
    useNftCardContract,
    useNftCardMarketContract,
} from 'hooks/useContract'
import SellModal from '../sellModal'

export const ITEMS_PER_PAGE = 9

const SORT_FIELD = {
    createdAt: 'createdAt',
    volumeBNB: 'totalVolumeBNB',
    items: 'numberTokensListed',
    supply: 'totalSupply',
    lowestPrice: 'lowestPrice',
    highestPrice: 'highestPrice',
}

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`
const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

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

const NftCardDetail = ({ tokenId, nft }) => {
    const { account } = useWeb3React()
    const router = useRouter()

    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpointsContext()
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const nftStageMarketContract = useNftStageMarketContract()
    const nftStageContract = useNftStageContract()
    const nftCardContract = useNftCardContract()
    const nftCardMarketContract = useNftCardMarketContract()
    const [isLoading, setIsLoading] = useState(false)
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
            const url = await nftCardContract.baseURI()
            const metaData = await getMetaData(url + '/' + tokenId + '.json')
            setMetaData(metaData)
        }
        if (account) {
            handleGetMetaData()
        }

    }, [account])



    const RenderSellBtn = ({ nft, metaData, callback }) => {
        const [onPresentSellModal, closePresentSellModal] = useModal(
            <SellModal tokenId={tokenId} customOnDismiss={callback} />,
        )
        return (
            <Button width="100%" padding="0 12px" onClick={onPresentSellModal} mt={20}>
                {t('Sell')}
            </Button>
        )
    }

    const backRouter = () => {
        router.push('/nfts/myNft')
    }

    return (
        <>
            <Page>
                <Box width="100%">
                    <StyledCard>
                        <Box padding="20px">
                            <img className="blindbox-img" src="/images/blindbox.jpg"></img>
                            <Text color="text" mt={15} fontSize={36}>
                            #{nft.itemId}-{tokenId}
                            </Text>
                            <Text color="primary" mt={15} fontSize={20}>
                                {metaData?.name}
                            </Text>
                            {/* <Flex alignItems="center">
                                <Text color="textSubtle" mt={15} fontSize={16}>
                                    TTC
                                </Text>
                                <Text color="text" mt={15} ml={10} fontSize={22} fontWeight={600}>
                                    0.22
                                </Text>
                            </Flex> */}
                            <Text color="textSubtle" mt={15} fontSize={16}>
                                描述
                            </Text>
                            <Text color="text" mt={15} fontSize={16}>
                                {metaData?.description}
                            </Text>
                            <RenderSellBtn callback={backRouter}></RenderSellBtn>
                            {/* <Button as="a" width="100%" mt={30}>
                                {t('Buy')}
                            </Button> */}
                        </Box>
                        {/* <Image className="share" src="/images/blindbox.jpg" alt="Share" width={558} height={558} /> */}
                    </StyledCard>
                </Box>

            </Page>
        </>
    )
}

export default NftCardDetail
