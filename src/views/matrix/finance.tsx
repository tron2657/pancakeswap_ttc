import React, { createContext, useRef, useState, useEffect } from 'react'

import styled from 'styled-components'
import { Button, Image, Heading, Text, LogoIcon, Box, Flex, AutoRenewIcon } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'
import { TTC_API } from 'config/constants/endpoints'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useApproveUsdt, useApproveTTC, useCheckTTCApprovalStatus, useCheckUsdtApprovalStatus } from './hook/useApprove'
import useTokenBalance from 'hooks/useTokenBalance'
import tokens from 'config/constants/tokens'
import useToast from 'hooks/useToast'
import { useTTCNumber } from 'views/Farms/hooks/useApprove'
import useTransferMx from './hook/useTransferMx'
import useCatchTxError from 'hooks/useCatchTxError'
import queryString from 'query-string'

import { Field } from 'state/swap/actions'
import { getBalanceNumber } from 'utils/formatBalance'
import { ToastDescriptionWithTx } from 'components/Toast'
import format from 'date-fns/format'

const handleParticipateApi = async (account: string, ttc_num: string, coin_hash: any, coin_num: any) => {
  let _data = {
    address: account,
    ttc_num: ttc_num,
    coin_hash: coin_hash,
    coin_num: coin_num,
  }
  const res = await fetch(`${TTC_API}/pledge/pledge_buy`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: queryString.stringify(_data),
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}
const handleExtractApi = async (account: string, ttc_num: string, eti_num: any) => {
  let _data = {
    address: account,
    ttc_num: ttc_num,
    eti_num: eti_num,
  }
  const res = await fetch(`${TTC_API}/pledge/put_order`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: queryString.stringify(_data),
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}
const StyleMatrixLayout = styled.div`
  /* align-items: center;
  display: flex;
  flex-direction: column; */
  /* height: calc(100vh - 64px); */
  /* justify-content: center; */
  background: #1e1e1e;
  padding-bottom: 60px;
  padding-top: 30px;
  position: relative;
  .btn-gradient {
    background: linear-gradient(179deg, #a86c00 0%, #e6bf5d 59%, #b67e00 100%);
    border-radius: 14px;
    /* width: 283px; */
    height: 46px;
    display: block;
    margin: 20px auto;
  }
  .btn-border {
    background: transparent;
    border: 1px solid #a86c00;
    border-radius: 14px;
    /* width: 283px; */
    height: 46px;
    display: block;
    margin: 20px auto;
  }
  .share {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 9;
  }
`
const MatrixTop = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background: linear-gradient(190deg, #1e1e1e 50%, #f9b223 100%); */
  background: url('/images/matrix/matrix-bg.png') no-repeat;
  background-size: 100% 100%;
  backdrop-filter: blur(10px) brightness(110%);
  padding: 55px 0 35px 0;
  position: relative;
  .box-1 {
    position: absolute;
    top: 10px;
    right: 30px;
  }
`
const BoxWrapper = styled.div`
  background: linear-gradient(174deg, #a86c00 0%, #e6bf5d 59%, #b67e00 100%);
  border-radius: 8px;
  border: 2px solid #ffffff;
  padding: 10px 30px;
  .text-shadow {
    text-shadow: 2px 2px 4px #7a572b;
  }
`
const LinnerWrapper = styled.div`
  background: linear-gradient(174deg, #a86c00 0%, #e6bf5d 59%, #b67e00 100%);
  border: 2px solid #ffffff;
  height: 130px;
  line-height: 90px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .txt {
    text-shadow: 0px 0px 4px rgba(225, 118, 255, 0.64);
  }
`
const BorderWrapper = styled.div`
  border-radius: 23px;
  border: 1px dashed #d77c0c;
  padding: 5px 25px;
  text-align: center;
  width: 60%;
  margin: 25px auto 0 auto;
`

const ArrowLeft = styled.div`
  width: 22px;
  height: 23px;
  background: url('/images/matrix/arrow-l.png') no-repeat;
  background-size: 100% 100%;
`
const ArrowRight = styled.div`
  width: 22px;
  height: 23px;
  background: url('/images/matrix/arrow-r.png') no-repeat;
  background-size: 100% 100%;
`
const DotActive = styled.div`
  width: 10px;
  height: 10px;
  background: #875b04;
  box-shadow: 0px 1px 0px 0px #e19700;
  border-radius: 50%;
`

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #ffffff;
  box-shadow: 0px 1px 0px 0px #e19700;
  border-radius: 50%;
`
const getMyListApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/pledge/pledge_list?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const getMxInfoApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/pledge/pledge_info?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const MatrixFinancePage = ({ initData, account, callback }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState(false)
  const [extrctLoading, setExtractLoading] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [ttcNum, setTTCNum] = useState('')

  const [list, setList] = useState([
    // {
    //   add_time: 1667894177,
    //   price: 100,
    // },
  ])
  const dotList = [1, 2, 3]
  const levelObj = {
    1: t('In the team'),
    2: t('White reward'),
    3: t('Yellow reward'),
    4: t('Red reward'),
    5: t('Blue reward'),
    6: t('Gold Award'),
  }
  const [mySnode, setMySnode] = useState(null)
  const [mxInfo, setMxInfo] = useState(null)
  const { isUsdtApproved, setUsdtLastUpdated } = useCheckUsdtApprovalStatus(initData.from_address)
  const { isTTCApproved, setTTCLastUpdated } = useCheckTTCApprovalStatus(initData.from_address2)
  const { handleUsdtApprove: handleUsdtApprove, pendingTx: pendingUsdtTx } = useApproveUsdt(
    initData.from_address,
    setUsdtLastUpdated,
  )
  const { handleTTCApprove: handleTTCApprove, pendingTx: pendingTTCTx } = useApproveTTC(
    initData.from_address2,
    setTTCLastUpdated,
  )
  const usdtAddress = '0x9e7bDCfB92d81D03a0f8a0EaFc9e4D327f152a27'

  const { balance: usdtBalance } = useTokenBalance(usdtAddress)
  const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)
  const { onTransfer } = useTransferMx(usdtAddress, '0x0000000000000000000000000000000000000004')

  const handleParticepate = async () => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]

    if (getBalanceNumber(ttcBalance) < Number(ttc_num)) {
      toastError(t('Insufficient TTC handling fee'))
      return
    }
    if (getBalanceNumber(usdtBalance) < 500) {
      toastError(t('MX 余额不足'))
      return
    }
    console.log('ttc_num==', ttc_num)
    if (ttc_num == '') return
    setLoading(true)
    const amount = '500'
    const receipt = await fetchWithCatchTxError(() => {
      setLoading(false)
      return onTransfer(amount)
    })
    // console.log('receipt.transactionHash', receipt.transactionHash)
    if (receipt?.status) {
      await postStake(amount, ttc_num, receipt.transactionHash)
      toastSuccess(
        `${t('Transferd')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been Transferd ')}
        </ToastDescriptionWithTx>,
      )
    }
  }
  const postStake = async (amount: string, ttcNum: string, coin_hash: any) => {
    const data = await handleParticipateApi(account, ttcNum, coin_hash, amount)
    if (data.status) {
      toastSuccess(t(data.msg))
      // setSecondsRemaining(120)
      // openCountDown()
    } else {
      toastError(t(data.msg))
    }
  }

  const handleExtract = async () => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    if (getBalanceNumber(ttcBalance) < Number(ttc_num)) {
      toastError(t('Insufficient TTC handling fee'))
      return
    }
    if (mxInfo.eti_coin <= 0) {
      toastError(t('可提取ETI不足'))
      return
    }
    postExtract(ttc_num, mxInfo.eti_coin)
    console.log('ttc_num==', ttc_num)
  }
  const postExtract = async (ttcNum: string, eti_num: any) => {
    setExtractLoading(true)
    const data = await handleExtractApi(account, ttcNum, eti_num)
    setExtractLoading(false)
    if (data.status) {
      toastSuccess(t(data.msg))
      // setSecondsRemaining(120)
      // openCountDown()
    } else {
      toastError(t(data.msg))
    }
  }
  useEffect(() => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    async function init() {
      if (account) {
        const mx_info = await getMxInfoApi(account)
        console.log('log==', mx_info)
        setMxInfo(mx_info.result)
        // const data = await getMyListApi(account)
        let _list = mx_info.result.list
        if (_list) {
          setList(_list)
        }
        console.log(list)
        // setList(_list.result)
      }
    }
    init()
  }, [account])
  return (
    <StyleMatrixLayout>
      <MatrixTop>
        {/* <BoxWrapper className="box-1">
          <Text color="#fff" fontSize="23px" letterSpacing="3px" fontWeight="600">
            矩阵NFT
          </Text>
        </BoxWrapper> */}
        <BoxWrapper className="box-2">
          <Text
            color="#fff"
            className="text-shadow"
            letterSpacing="3px"
            lineHeight="1"
            fontSize="26px"
            fontWeight="600"
          >
            销毁MX赚取ETI
          </Text>
          {/* <p>
            <Text display="inline-block" color="#fff" fontSize="20px" fontWeight="600"></Text>
            <Text display="inline-block" color="#FF8900" fontSize="20px" fontWeight="600"></Text>
          </p> */}
        </BoxWrapper>
        <Text color="#D77C0C" fontSize="20px" fontWeight="600" mt="10px">
          {t('固定销毁500MX')}
        </Text>
        <Text color="#fff" fontSize="16px" fontWeight="600" mt="26px">
          {t('每个地址只能参与一次')}
        </Text>
        <Text color="#fff" fontSize="16px" fontWeight="600" mt="26px">
          {t('销毁500MX，赚取价值3000U的ETI')}
        </Text>
        <Text color="#fff" fontSize="16px" fontWeight="600" mt="26px">
          {t('1年产完')}
        </Text>
      </MatrixTop>
      <Box>
        <Text mb="5px" color="#CA9A33" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          {t('MX余额')}： {getBalanceNumber(usdtBalance)}U
        </Text>
        <Text mb="5px" color="#CA9A33" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          {t('剩余待产')}： {mxInfo?.out_coin_num}个
        </Text>
        <Text mb="20px" color="#CA9A33" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          {t('ETI奖励')}： {mxInfo?.eti_coin}个
        </Text>
      </Box>
      {!isTTCApproved ? (
        <Button width="45%" className="btn-gradient" type="button" disabled={pendingTTCTx} onClick={handleTTCApprove}>
          {t('Approve TTC')}
        </Button>
      ) : (
        <Flex justifyContent="space-around" alignItems="center">
          <Button
            width="40%"
            onClick={handleParticepate}
            disabled={loading}
            type="button"
            className="btn-border"
            scale="sm"
            isLoading={loading}
          >
            <Flex justifyContent="center" alignItems="center">
              {t('参与')}
              {loading ? <AutoRenewIcon color="currentColor" spin /> : null}
            </Flex>
          </Button>
          <Button
            width="40%"
            onClick={handleExtract}
            disabled={extrctLoading}
            type="button"
            className="btn-gradient"
            scale="sm"
            isLoading={extrctLoading}
          >
            <Flex justifyContent="center" alignItems="center">
              {t('提取ETI')}
              {extrctLoading ? <AutoRenewIcon color="currentColor" spin /> : null}
            </Flex>
          </Button>
        </Flex>
      )}

      <BorderWrapper>
        <Text color="#D77C0C" display="inline" fontSize="16px" fontWeight="bold" textAlign="center">
          {t('Be prepared')}
          <Text color="#fff" display="inline" fontSize="16px" fontWeight="bold" textAlign="center">
            TTC
          </Text>
          {t('Handling fee')}
        </Text>
      </BorderWrapper>
      <Box mt="25px">
        <Text color="#D77C0C" fontSize="16px" fontWeight="bold" textAlign="center">
          {t('Fair, just, open and transparent, no fund pool')}
        </Text>
      </Box>
      <Box mt="25px" padding="0 20px">
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            {t('最近奖励记录')}
          </Text>
          <ArrowLeft></ArrowLeft>
        </Flex>
        {list.length > 0 ? (
          list.map((item) => {
            return (
              <Flex justifyContent="space-between" alignItems="center" mb="15px">
                <Text color="#fff" fontSize="16px" textAlign="center">
                  {format(item['add_time'] * 1000, 'yyyy-MM-dd')}
                </Text>
                <Text color="#fff" fontSize="16px" textAlign="center">
                  {item['reat'] == 1 ? '+' : '-'} {item.price} ETI
                </Text>
              </Flex>
            )
          })
        ) : (
          <Text color="#fff" fontSize="16px" fontWeight="bold" textAlign="center">
            {t('暂无数据')}
          </Text>
        )}
      </Box>
    </StyleMatrixLayout>
  )
}

export default MatrixFinancePage
