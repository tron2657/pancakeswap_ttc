import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Flex,
  Grid,
  Heading,
  Text,
  Button,
  Box,
  ProfileAvatar,
  BnbUsdtPairTokenIcon,
  Table,
  Th,
  Card,
  Skeleton,
  useMatchBreakpointsContext,
  useModal,
  Image,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import Link from 'next/link'

import useSWRImmutable from 'swr/immutable'
import orderBy from 'lodash/orderBy'
import { getLeastMostPriceInCollection } from 'state/nftMarket/helpers'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { ViewMode } from 'state/user/actions'
import { Collection } from 'state/nftMarket/types'
import styled from 'styled-components'
import { laggyMiddleware } from 'hooks/useSWRContract'
import { FetchStatus } from 'config/constants/types'
import { useGetShuffledCollections } from 'state/nftMarket/hooks'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import PageLoader from 'components/Loader/PageLoader'
import ToggleView from 'components/ToggleView/ToggleView'
import { CollectionCard } from './components/CollectibleCard'
import { BNBAmountLabel } from './components/CollectibleCard/styles'
import {
  useNftStageContract,
  useNftStageMarketContract,
  useNftCardContract,
  useNftCardMarketContract,
} from 'hooks/useContract'
import BuyModal from './components/buyModal'
import SellModal from './components/sellModal'

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

const getNewSortDirection = (oldSortField: string, newSortField: string, oldSortDirection: boolean) => {
  if (oldSortField !== newSortField) {
    return newSortField !== SORT_FIELD.lowestPrice
  }
  return !oldSortDirection
}

const MyNftCard = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { data: shuffledCollections } = useGetShuffledCollections()
  const { isMobile } = useMatchBreakpointsContext()
  const [sortField, setSortField] = useState(null)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [viewMode, setViewMode] = useState(ViewMode.CARD)
  const [sortDirection, setSortDirection] = useState<boolean>(false)
  const nftStageMarketContract = useNftStageMarketContract()
  const nftStageContract = useNftStageContract()
  const nftCardContract = useNftCardContract()
  const nftCardMarketContract = useNftCardMarketContract()
  const [isLoading, setIsLoading] = useState(false)
  const [nftCardList, setNftCardList] = useState([])

  const [stageList, setStageList] = useState([])
  const { data: collections = [], status } = useSWRImmutable<
    (Collection & Partial<{ lowestPrice: number; highestPrice: number }>)[]
  >(
    shuffledCollections && shuffledCollections.length ? ['collectionsWithPrice', viewMode, sortField] : null,
    async () => {
      if (viewMode === ViewMode.CARD && sortField !== SORT_FIELD.lowestPrice && sortField !== SORT_FIELD.highestPrice)
        return shuffledCollections
      return Promise.all(
        shuffledCollections.map(async (collection) => {
          const [lowestPrice, highestPrice] = await Promise.all([
            getLeastMostPriceInCollection(collection.address, 'asc'),
            getLeastMostPriceInCollection(collection.address, 'desc'),
          ])
          return {
            ...collection,
            lowestPrice,
            highestPrice,
          }
        }),
      )
    },
    {
      use: [laggyMiddleware],
    },
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  const handleSort = useCallback(
    (newField: string) => {
      setPage(1)
      setSortField(newField)
      setSortDirection(getNewSortDirection(sortField, newField, sortDirection))
    },
    [sortDirection, sortField],
  )

  const sortedNftCardList = useMemo(() => {
    const newList = [...nftCardList]
    console.log('log===a', newList)
    return sortField
      ? newList.sort((a, b) => {
          if (a && b) {
            return sortField == SORT_FIELD.lowestPrice
              ? Number(a['price'].toString()) - Number(b['price'].toString())
              : Number(b['price'].toString()) - Number(a['price'].toString())
          }
          return -1
        })
      : newList
  }, [nftCardList, sortDirection, sortField])

  const fetchMarketItems = async () => {
    setIsLoading(true)
    const items = await nftStageMarketContract.fetchMarketItems()
    setStageList(items)
    setIsLoading(false)
  }

  const getAllNftCard = async () => {
    setIsLoading(true)
    const nftCards = await nftCardContract.getAllToken(account, 100)
    console.log('log====nftCards', nftCards)
    setNftCardList(nftCards)
    setIsLoading(false)
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

  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        window.scroll({
          top: 50,
          left: 0,
          behavior: 'smooth',
        })
      }, 50)
    }
  }, [isMobile, page])

  useEffect(() => {
    if (account) {
      getAllNftCard()
    }
  }, [account])

  const sortedCollections = useMemo(() => {
    return orderBy(
      collections,
      (collection) => {
        if (sortField === SORT_FIELD.createdAt) {
          if (collection.createdAt) {
            return Date.parse(collection.createdAt)
          }
          return null
        }
        return parseFloat(collection[sortField])
      },
      sortDirection ? 'desc' : 'asc',
    )
  }, [account, collections, sortField, sortDirection])

  const RenderSellBtn = ({ nft, metaData, callback }) => {
    const [onPresentSellModal, closePresentSellModal] = useModal(
      <SellModal tokenId={nft.toString()} customOnDismiss={callback} />,
    )
    return (
      <Button as="a" scale="sm" height="28px" padding="0 12px" disabled={nft['sold']}>
        {t('Sell')}
      </Button>
    )
  }
  const RenderItem = ({ item, callback }) => {
    console.log('log===item===', item)
    const [metaData, setMetaData] = useState(null)
    useEffect(() => {
      const handleGetMetaData = async () => {
        // const url = await nftCardContract.tokenURI(item)
        const url = await nftCardContract.baseURI()
        const metaData = await getMetaData(url + '/' + item + '.json')
        setMetaData(metaData)
      }
      if (account) {
        handleGetMetaData()
      }
    }, [account])

    return (
      <CollectionCard
        bgSrc={metaData ? metaData.image : ''}
        avatarSrc={metaData ? metaData.image : ''}
        collectionName={metaData ? metaData.name : ''}
        description={metaData ? metaData.description : ''}
        url={
          '/nfts/myNft/' +
          item.toString() +
          '?nft=' +
          JSON.stringify({
            tokenId: item.toString(),
          })
        }
      >
        <Text fontSize="12px" color="textSubtle" mt="5px">
          {t('Price')}
        </Text>
        <Flex alignItems="center" justifyContent="space-between" style={{ width: '100%' }}>
          <Box>
            <Text display="inline" fontSize="12px" color="textSubtle">
              ETI
            </Text>
            {/* <Text display="inline" fontSize="16px" color="text" ml="5px">
              {item.price ? Number(item.price.toString()) / Math.pow(10, 18) : 0}
            </Text> */}
          </Box>
          {/* <BNBAmountLabel amount={collection.totalVolumeBNB ? parseFloat(collection.totalVolumeBNB) : 0} /> */}
          <RenderSellBtn nft={item} metaData={metaData} callback={getAllNftCard}></RenderSellBtn>
        </Flex>
      </CollectionCard>
    )
  }
  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px" data-test="nft-collections-title">
          NFT交易市場
        </Heading>

        <NextLinkFromReactRouter to="/nfts/market" prefetch={false}>
          <Button p="0" variant="text">
            <Text color="primary" bold fontSize="16px" mr="4px">
              回交易市场
            </Text>
            <ArrowForwardIcon color="primary" />
          </Button>
        </NextLinkFromReactRouter>
      </PageHeader>
      <Page>
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              pr={[null, null, '4px']}
              pl={['4px', null, '0']}
              mb="8px"
            >
              {/* <ToggleView
                idPrefix="clickCollection"
                viewMode={viewMode}
                onToggle={(mode: ViewMode) => setViewMode(mode)}
              /> */}
              <Flex width="max-content" style={{ gap: '4px' }} flexDirection="column">
                <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600}>
                  筛选
                </Text>
                <Select
                  options={[
                    {
                      label: t('全部'),
                      value: SORT_FIELD.createdAt,
                    },
                    {
                      label: t('在售'),
                      value: SORT_FIELD.volumeBNB,
                    },
                  ]}
                  placeHolderText={t('Select')}
                  onOptionChange={(option: OptionProps) => handleSort(option.value)}
                />
              </Flex>
              <Flex width="max-content" style={{ gap: '4px' }} flexDirection="column">
                <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600}>
                  {t('Sort By')}
                </Text>
                <Select
                  options={[
                    {
                      label: t('Lowest Price'),
                      value: SORT_FIELD.lowestPrice,
                    },
                    {
                      label: t('Highest Price'),
                      value: SORT_FIELD.highestPrice,
                    },
                  ]}
                  placeHolderText={t('Select')}
                  onOptionChange={(option: OptionProps) => handleSort(option.value)}
                />
              </Flex>
            </Flex>
            <Grid
              gridGap="16px"
              gridTemplateColumns={['1fr', '1fr 1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
              mb="32px"
              data-test="nft-collection-row"
            >
              {/* {sortedCollections.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((collection) => {
               
              })} */}
              {sortedNftCardList.map((item) => {
                return <RenderItem item={item} callback={getAllNftCard}></RenderItem>
              })}
            </Grid>
            <StyledImage src="/images/decorations/ttcpan.png" alt="Pancake illustration" width={120} height={103} />

            {/* <PageButtons>
              <Arrow
                onClick={() => {
                  setPage(page === 1 ? page : page - 1)
                }}
              >
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
              <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
              <Arrow
                onClick={() => {
                  setPage(page === maxPage ? page : page + 1)
                }}
              >
                <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons> */}
          </>
        )}
      </Page>
    </>
  )
}

export default MyNftCard
