import React, { useState, useEffect, FC } from 'react'

import styled from 'styled-components'
import { Text, Box, Flex, CardBody, CardFooter, Button, AddIcon } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import FullPositionCard from '../../components/PositionCard'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import PageLoader from 'components/Loader/PageLoader'
import { useCheckTTCApprovalStatus, useApproveTTC, useTTCNumber } from 'views/Farms/hooks/useApprove'
import { Field } from 'state/swap/actions'
import { getBalanceNumber } from 'utils/formatBalance'

import { PLEDGE_API } from 'config/constants/endpoints'
import { format } from 'date-fns'
import useTokenBalance from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import tokens from 'config/constants/tokens'
import StakeTokenImage from './components/FarmTable/StakeTokenImage'

const getRegtApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/user/app_reg`, {
    method: 'post',
    body: JSON.stringify({
      address: account,
      ttc_num: 0,
    }),
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const getListDataApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/pledge/pledge_add_list?address=${account}`, {
    method: 'post',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const handleReceiveApi = async (account: string, ttc_num: string, id: any) => {
  const res = await fetch(`${PLEDGE_API}/pledge/put_add_order?address=${account}&ttc_num=${ttc_num}&id=${id}`, {
    method: 'post',
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}
const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`
const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 24px;
  margin-bottom: 15px;
`
const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
  /* margin-top: 24px; */
  /* padding: 24px 0; */
`

const ValueContainer = styled.div``

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0px;
`
const ThemeValueWrapper = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  text-align: right;
  margin-right: 14px;
  /* font-size: 14px; */
  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`
const getCoinListApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/pledge/coin_list`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const RenderTokenImages = ({ account, details }) => {
  const [primarySrc, setPrimarySrc] = useState('')
  const [secondarySrc, setSecondarySrc] = useState('')
  useEffect(() => {
    async function init() {
      const _data = await getCoinListApi(account)
      if (_data.status) {
        let primary = _data.result.find((item) => item.coin_name == details['coin_name'])
        let secondary = _data.result.find((item) => item.coin_name == details['coin_name2'])
        setPrimarySrc(primary['img'])
        setSecondarySrc(secondary['img'])
      }
    }
    init()
  }, [])
  return (
    <Flex justifyContent="flex-start" alignItems="center" flex="auto">
      <StakeTokenImage primarySrc={primarySrc} secondarySrc={secondarySrc} width={40} height={40}></StakeTokenImage>
    </Flex>
  )
}

const StakeManage = () => {
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState(null)
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')
  //   const { balance: lpBalance } = useTokenBalance()
  const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)

  const handleReceive = async (amount: string, ttcNum: string, id: any) => {
    const ttc_num = formattedAmounts[Field.OUTPUT]
    if (getBalanceNumber(ttcBalance) < Number(ttc_num)) {
      toastError(t('Insufficient TTC handling fee'))
      return
    }
    const data = await handleReceiveApi(account, ttc_num, id)
    if (data.status) {
      toastSuccess(t(data.msg))
      refresh()
      // setSecondsRemaining(120)
      // openCountDown()
    } else {
      toastError(t(data.msg))
    }
  }

  const refresh = async () => {
    const _data = await getListDataApi(account)
    await getRegtApi(account)
    if (_data.status) {
      console.log('initData====', _data)
      setList(_data.result)
      setLoading(false)
    }
  }

  useEffect(() => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    setTTCNum(ttc_num)
    console.log('ttc_num===', ttc_num)
    async function init() {
      if (account) {
        setLoading(true)
        const _data = await getListDataApi(account)
        await getRegtApi(account)
        if (_data.status) {
          console.log('initData====', _data)
          setList(_data.result)
          setLoading(false)
        }
      }
    }
    init()
  }, [account, ttcNum])

  return loading ? (
    <PageLoader></PageLoader>
  ) : (
    <Page>
      <AppBody>
        <AppHeader title={t('您的糖浆池')} subtitle={t('添加糖浆池 发起质押活动')} noConfig />
        <Body>
          {list.length ? (
            list.map((item) => {
              item['loading'] = false
              return (
                <Container>
                  <ActionContainer>
                    <Flex justifyContent="space-between" alignItems="center">
                      {/* <Box width="50px">
                      <img src="/images/tokens/0x152ad7Dc399269FA65D19BD7A790Ea8aa5b23DaD.png" alt="logo" />
                    </Box> */}
                      <RenderTokenImages details={item} account={account}></RenderTokenImages>
                      <Text>
                        质押{item.coin_name}赚取{item.coin_name2}
                        <Text color="textSubtle" fontSize="14px" display="inline-block">
                          ({new Date().getTime() < item.start_time ? '未开始' : ''}
                          {new Date().getTime() > item.end_time ? '已结束' : ''})
                        </Text>
                      </Text>
                    </Flex>
                    <InfoContainer>
                      <ValueContainer>
                        <>
                          <ValueWrapper>
                            <Text>{t('已质押总量')}</Text>
                            <ThemeValueWrapper>{item.in_coin_num}</ThemeValueWrapper>
                          </ValueWrapper>
                          <ValueWrapper>
                            <Text>{t('已产出')}</Text>
                            <ThemeValueWrapper>{item.y_coin_num}</ThemeValueWrapper>
                          </ValueWrapper>
                          <ValueWrapper>
                            <Text>{t('活动时间')}</Text>
                            <ThemeValueWrapper>
                              {format(Number(item.start_time) * 1000, 'yyyy-MM-dd HH:mm:ss')}-
                              {format(Number(item.end_time) * 1000, 'yyyy-MM-dd HH:mm:ss')}
                            </ThemeValueWrapper>
                          </ValueWrapper>
                          <ValueWrapper>
                            <Text>{t('质押时长')}</Text>
                            <ThemeValueWrapper>{item.day}天</ThemeValueWrapper>
                          </ValueWrapper>
                          <ValueWrapper>
                            <Text>{t('每质押100LT产出')}</Text>
                            <ThemeValueWrapper>{item.profit * 100}TTC</ThemeValueWrapper>
                          </ValueWrapper>
                          <ValueWrapper>
                            <Text>{t('年化收益率')}</Text>
                            <ThemeValueWrapper>
                              {item.year_profit}%
                              {/* {format(Number(farm['end_time']) * 1000, 'yyyy-MM-dd HH:mm:ss')} */}
                            </ThemeValueWrapper>
                          </ValueWrapper>
                          <Text mt="12px" fontSize="16px">
                            {t('产出规则')}
                          </Text>
                          <Text mt="6px" fontSize="14px">
                            {t('质押到期后连本带息一起领取')}
                          </Text>
                        </>
                      </ValueContainer>
                    </InfoContainer>

                    <Button
                      mt="24px"
                      width="100%"
                      onClick={() => {
                        handleReceive(account, ttcNum, item.id)
                      }}
                      variant="secondary"
                      disabled={item.status != 3}
                    >
                      {t('提取剩余TTC')}
                    </Button>
                  </ActionContainer>
                </Container>
              )
            })
          ) : (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t('未找到糖浆池?')}
              </Text>
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Link href="/stake/create" passHref>
            <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="white" />}>
              {t('创建糖浆池')}
            </Button>
          </Link>
        </CardFooter>
      </AppBody>
    </Page>
  )
}
export default StakeManage
