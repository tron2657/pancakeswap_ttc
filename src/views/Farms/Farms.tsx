import { useEffect, useState, useRef, createContext } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, Toggle, Text, Button, ArrowForwardIcon, Flex, Link } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farms/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useTranslation } from 'contexts/Localization'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { useRouter } from 'next/router'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import { useAppDispatch } from 'state'
import FarmTabButtons from './components/FarmTabButtons'
import { PLEDGE_API } from 'config/constants/endpoints'
import PageLoader from 'components/Loader/PageLoader'
import { useFetchPledgeList, usePledgeListParams } from 'state/pledge/hooks'
import NewRow from './components/FarmTable/newRow'
import useSyncCallback from './hooks/useSyncCallback'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const NUMBER_OF_FARMS_VISIBLE = 12

export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
const getPledgeListApi = async (
  account: string,
  is_user: any,
  sort: any,
  lp_type: any,
  is_status: any,
  coin_name: any,
) => {
  const res = await fetch(
    `${PLEDGE_API}/pledge/pledge_list?address=${account}&is_user=${is_user}&sort=${sort}&lp_type=${lp_type}&is_status=${is_status}&coin_name=${coin_name}`,
    {
      method: 'post',
    },
  )
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const initFarms = [
  {
    lpAddresses: {
      '56': '0xc3bea295b8d866f53df0a3dd2ebbd9286b81e968',
      '97': '',
    },
    lpSymbol: 'TTC-ETI LP',
    pid: 98,
    multiplier: '0.5X',
    isCommunity: false,
    quoteTokenPriceBusd: '0',
    tokenPriceBusd: '0',
    token: {
      decimals: 18,
      symbol: 'TTC',
      name: 'TTC',
      chainId: 56,
      address: '0x152ad7Dc399269FA65D19BD7A790Ea8aa5b23DaD',
      projectLink: 'https://ttcswap.finance/',
    },
    quoteToken: {
      decimals: 18,
      symbol: 'ETI',
      name: 'ETI',
      chainId: 56,
      address: '0xe943616228239E078Dc4436150602E0426E684AD',
      projectLink: 'https://ttcswap.finance/',
    },
    userData: {
      allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      tokenBalance: '0',
      stakedBalance: '0',
      earnings: '0',
    },
    tokenAmountTotal: '150.17725882459289804',
    quoteTokenAmountTotal: '2303.618871772640714239',
    lpTotalInQuoteToken: '0',
    lpTotalSupply: '541051764096897709923',
    tokenPriceVsQuote: '15.33933226510192553762118672421533086837493113803719700089658347412555471438982781',
    poolWeight: '0.00519210799584631360332294911734164070612668743509865005192107995846313603322949',
    apr: null,
    lpRewardsApr: 0.88,
    liquidity: '0',
  },
]

const Farms = ({ initData, children }) => {
  console.log('initData===', initData)
  const { pathname } = useRouter()
  const { t } = useTranslation()
  const { data: farmsLP, userDataLoaded, poolLength, regularCakePerBlock } = useFarms()
  const cakePrice = usePriceCakeBusd()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(1)
  const [viewMode, setViewMode] = useUserFarmsViewMode()
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState(1)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loading, setLoading] = useState(true)
  const [plegdeList, setPlegdeList] = useState([])
  const chosenFarmsLength = useRef(0)
  const dispatch = useAppDispatch()
  // const [rowData, setRowData] = useState([])
  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived
  const fetchPledgeList = useFetchPledgeList()

  // const fetchPledgeListParams = usePledgeListParams()

  let _params = {
    sort: 4,
    is_user: 0,
    lp_type: 0,
    is_status: 1,
    coin_name: '',
  }
  const [postParams, setPostParams] = useState(_params)
  usePollFarmsWithUserData()

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

  // const [params, setParams] = usePledgeListParams(_params)

  const params = usePledgeListParams()

  const activeFarms = farmsLP.filter(
    (farm) => farm.pid !== 0 && farm.multiplier !== '0X' && (!poolLength || poolLength > farm.pid),
  )
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')
  const archivedFarms = farmsLP

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    // setPostParams({ ..._params, ...{ coin_name: event.target.value } })
    updateData()
  }

  const handleStakeOnly = (e) => {
    console.log('update==', e.target.checked)
    setStakedOnly(!stakedOnly)
    // stakedOnly ? (_params.is_user = 1) : (_params.is_user = 0)
    // setPostParams({ ..._params, ...{ is_user: e.target.checked ? 1 : 0 } })
    updateData()
    // console.log('update==sort=====', _params.sort)
  }

  const changeStatus = (activeIndex) => {
    setStatus(activeIndex)
    updateData()
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
    async function init() {
      if (account) {
        const _data = await getPledgeListApi(account, stakedOnly ? 1 : 0, sortOption, 1, status, query)
        if (_data.status) {
          // _data.result.map((item) => {
          //   // // item = { ...item, ...chosenFarmsMemoized[0] }
          //   // const _farm = initFarms.find((f) => f.lpSymbol == 'TTC-ETI LP')
          //   // console.log('initFarms', initFarms)
          //   // Object.assign(item, _farm)
          //   // Object.assign(item, initData)
          // })
          setPlegdeList(_data.result)

          setLoading(false)
        }
      }
    }
    init()

    // dispatch(
    //   fetchPledgeListAsync({
    //     account: '123',
    //     params: { sort: sortOption, is_user: stakedOnly ? 1 : 0, is_status: 1, lp_type: 0, coin_name: query },
    //   }),
    // )
  }, [isIntersecting, account])

  const getRowDate = async () => {
    const _data = await getPledgeListApi(account, stakedOnly ? 1 : 0, sortOption, 1, status, query)
    _data.result.map((item) => {
      // const _farm = initFarms.find((f) => f.lpSymbol == 'TTC-ETI LP')
      // console.log('typeof item', typeof item, typeof _farm)
      // Object.assign(item, _farm)
      Object.assign(item, initData)
    })
    setPlegdeList(_data.result)
    console.log('fetchPledgeList===update==new ', plegdeList)
  }
  const deepCopy = (obj) => {
    if (typeof obj === 'function') {
      throw new TypeError('请传入正确的数据类型格式')
    }
    try {
      let data = JSON.stringify(obj)
      let newData = JSON.parse(data)
      return newData
    } catch (e) {
      console.log(e)
    }
  }
  // const rowData = plegdeList.map((farm) => {
  //   const { token, quoteToken } = farm
  //   const tokenAddress = token.address
  //   const quoteTokenAddress = quoteToken.address
  //   const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')
  //   console.log('farm===', farm)
  //   const row: RowProps = {
  //     apr: {
  //       value: farm.year_profit,
  //       pid: farm.pid,
  //       multiplier: farm.multiplier,
  //       lpLabel: 'TTC-ETI',
  //       lpSymbol: farm.coin_name + '_' + farm.coin_name2,
  //       tokenAddress,
  //       quoteTokenAddress,
  //       cakePrice,
  //       originalValue: farm.apr,
  //       change_coin_num: farm.change_coin_num,
  //       out_coin_num: farm.out_coin_num,
  //       in_coin_num: farm.in_coin_num,
  //       y_coin_num: farm.y_coin_num,
  //       end_day: farm.end_time,
  //     },
  //     farm: {
  //       label: farm.coin_name + '_' + farm.coin_name2,
  //       pid: farm.pid,
  //       token: farm.token,
  //       quoteToken: farm.quoteToken,
  //     },
  //     earned: {
  //       // earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
  //       earnings: farm.order_sum_j,
  //       pid: farm.pid,
  //     },
  //     liquidity: {
  //       liquidity: farm.liquidity,
  //     },
  //     multiplier: {
  //       multiplier: farm.multiplier,
  //     },
  //     type: farm.isCommunity ? 'community' : 'core',
  //     details: farm,
  //     change_coin_num: farm.change_coin_num,
  //     out_coin_num: 22,
  //     in_coin_num: 33,
  //     y_coin_num: 44,
  //     end_day: 55,
  //   }

  //   return row
  // })

  // const renderContent = (): JSX.Element => {
  //   console.log('fetchPledgeList===update 111', plegdeList)

  //   if (viewMode === ViewMode.TABLE && rowData.length) {
  //     const columns = DesktopColumnSchema.map((column) => ({
  //       id: column.id,
  //       name: column.name,
  //       label: column.label,
  //       sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
  //         switch (column.name) {
  //           case 'farm':
  //             return b.id - a.id
  //           case 'apr':
  //             if (a.original.apr.value && b.original.apr.value) {
  //               return Number(a.original.apr.value) - Number(b.original.apr.value)
  //             }

  //             return 0
  //           case 'earned':
  //             return a.original.earned.earnings - b.original.earned.earnings
  //           default:
  //             return 1
  //         }
  //       },
  //       sortable: column.sortable,
  //     }))
  //     console.log('columns===', columns)
  //     return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
  //   }

  //   return <FlexLayout>{children}</FlexLayout>
  // }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
    // _params.sort = option.value
    // setPostParams(_params)
    updateData()
  }
  const updateData = useSyncCallback(() => {
    console.log('update====sortOption', sortOption)
    console.log('update====stakedOnly', stakedOnly)
    console.log('update====setQuery', query)
    getRowDate()
  })
  // const loadProducts = useCallback((sort: any) => dispatch(setPlegeListParams({ sort: sort })), [dispatch])

  return loading ? (
    <PageLoader></PageLoader>
  ) : (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('Farms')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('Stake LP tokens to earn.')}
        </Heading>
        <NextLinkFromReactRouter to="/add/BNB/BNB" prefetch={false}>
          <Button p="0" variant="text">
            <Text color="primary" bold fontSize="16px" mr="4px">
              {t('去添加流动性')}
            </Text>
            <ArrowForwardIcon color="primary" />
          </Button>
        </NextLinkFromReactRouter>
      </PageHeader>
      <Page>
        <ControlContainer>
          <ViewControls>
            {/* <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} /> */}
            <ToggleWrapper>
              <Toggle id="staked-only-farms" checked={stakedOnly} onChange={handleStakeOnly} scale="sm" />
              <Text> {t('Staked only')}</Text>
            </ToggleWrapper>

            <FarmTabButtons changeActive={changeStatus} />
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Text textTransform="uppercase">{t('Sort by')}</Text>
              <Select
                options={[
                  {
                    label: t('Hot'),
                    value: 1,
                  },
                  {
                    label: t('APR'),
                    value: 2,
                  },
                  {
                    label: t('质押总计'),
                    value: 3,
                  },
                  {
                    label: t('最新'),
                    value: 4,
                  },
                  // {
                  //   label: t('Hot'),
                  //   value: 'hot',
                  // },
                  // {
                  //   label: t('APR'),
                  //   value: 'apr',
                  // },
                  // {
                  //   label: t('Multiplier'),
                  //   value: 'multiplier',
                  // },
                  // {
                  //   label: t('Earned'),
                  //   value: 'earned',
                  // },
                  // {
                  //   label: t('Liquidity'),
                  //   value: 'liquidity',
                  // },
                  // {
                  //   label: t('Latest'),
                  //   value: 'latest',
                  // },
                ]}
                onOptionChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text textTransform="uppercase">{t('Search')}</Text>
              <SearchInput onChange={handleChangeQuery} placeholder="Search Farms" />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {/* {isInactive && (
          <FinishedTextContainer>
            <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
              {t("Don't see the farm you are staking?")}
            </Text>
            <Flex>
              <FinishedTextLink href="/migration" fontSize={['16px', null, '20px']} color="failure">
                {t('Go to migration page')}
              </FinishedTextLink>
              <Text fontSize={['16px', null, '20px']} color="failure" padding="0px 4px">
                or
              </Text>
              <FinishedTextLink
                external
                color="failure"
                fontSize={['16px', null, '20px']}
                href="https://v1-farms.ttcswap.finance/farms/history"
              >
                {t('check out v1 farms')}.
              </FinishedTextLink>
            </Flex>
          </FinishedTextContainer>
        )} */}
        {/* {console.log('plegdeList===', plegdeList)} */}
        {/* {renderContent()} */}
        {plegdeList.map((item) => {
          Object.assign(item, initData)
          console.log('item====', initData)
          return <NewRow details={item}></NewRow>
        })}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        <div ref={observerRef} />
        <StyledImage src="/images/decorations/ttcpan.png" alt="Pancake illustration" width={120} height={103} />
      </Page>
    </>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Farms
