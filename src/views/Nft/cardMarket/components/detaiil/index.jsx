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
    AutoRenewIcon,
    Box
} from '@pancakeswap/uikit'
import { CardBody, CardFooter } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import useTokenBalance from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import tokens from 'config/constants/tokens'
import useCatchTxError from 'hooks/useCatchTxError'
import {
    useCheckTTCApprovalStatus,
    useApproveTTC,
    useCheckNftApprovalForAllStatus,
    useSetApproveAll,
} from '../../hook/useApprove'
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
    useTokenContract
} from 'hooks/useContract'
import BuyModal from '../buyModal'

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
    console.log('log===nft', nft)
    const { account } = useWeb3React()
    const router = useRouter()
    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpointsContext()
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    // const nftStageMarketContract = useNftStageMarketContract()
    // const nftStageContract = useNftStageContract()
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
            // const url = await nftCardContract.tokenURI(tokenId)
            // const metaData = await getMetaData(url)
            const url = await nftCardContract.baseURI()
            const metaData = await getMetaData(url + '/' + tokenId + '.json')

            setMetaData(metaData)
        }
        if (account) {
            handleGetMetaData()
        }

    }, [account])




    const RenderBuyBtn = ({ nft, metaData, callback }) => {
        const ttc_contract = useTokenContract(tokens.ttc.address)
        const nftCardContract = useNftCardContract()
        const nftCardMarketContract = useNftCardMarketContract()

        const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)
        const { balance: usdtBalance } = useTokenBalance(tokens.ttc.address)

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
                return callWithGasPrice(nftCardMarketContract, 'createMarketSale', [
                    nftCardContract.address,
                    nft['itemId'],
                ])
            })
            if (receipt?.status) {
                toastSuccess(
                    t('Contract Enabled'),
                    <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                        {t('您已成功购买!', { symbol: 'TTC' })}
                    </ToastDescriptionWithTx>,
                )
                router.push('/nfts/market')
            }
        }
        return (
            <Flex flexDirection="column" pt="16px" alignItems="center">
                {isTTCApproved ? (
                    <Button
                        width="100%"
                        isLoading={pendingTx}
                        endIcon={pendingTx ? <AutoRenewIcon color="currentColor" spin /> : null}
                        onClick={handleConfirmClick}
                    >
                        {t('Buy')}
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
        )
    }

    return (
        <>
            <Page>
                <Box width="100%">
                    <StyledCard>
                        <Box padding="20px">
                            <img className="blindbox-img" src={metaData ? metaData.image : ''}></img>
                            <Text color="text" mt={15} fontSize={36}>
                                #{nft.itemId}-{tokenId}
                            </Text>
                            <Text color="primary" mt={15} fontSize={20}>
                                {metaData?.name}
                            </Text>
                            <Flex alignItems="center">
                                <Text color="textSubtle" mt={15} fontSize={16}>
                                    TTC
                                </Text>
                                <Text color="text" mt={15} ml={10} fontSize={22} fontWeight={600}>
                                    {Number(nft.price) / Math.pow(10, 18)}
                                </Text>
                            </Flex>
                            <Text color="textSubtle" mt={15} fontSize={16}>
                                描述
                            </Text>
                            <Text color="text" mt={15} fontSize={16}>
                                {metaData?.description}
                            </Text>
                            {/* <RenderSellBtn></RenderSellBtn> */}
                            {
                                nft.seller != account ? <RenderBuyBtn nft={nft} metaData={metaData} callback={() => { }}></RenderBuyBtn> : <></>
                            }


                        </Box>
                        {/* <Image className="share" src="/images/blindbox.jpg" alt="Share" width={558} height={558} /> */}
                    </StyledCard>
                </Box>

            </Page>
        </>
    )
}

export default NftCardDetail
