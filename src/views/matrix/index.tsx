import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Text, Box, Flex, useModal, Image } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'
import useToast from 'hooks/useToast'
import CountdownCircle from './components/CountdownCircle'
import { TTC_API } from 'config/constants/endpoints'
import InviteModal from './components/inviteModal'
import useTokenBalance from 'hooks/useTokenBalance'
import tokens from 'config/constants/tokens'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useApproveUsdt, useApproveTTC, useCheckTTCApprovalStatus, useCheckUsdtApprovalStatus } from './hook/useApprove'
import { getBalanceNumber } from 'utils/formatBalance'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
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
  height: 90px;
  line-height: 90px;
  text-align: center;
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

const getInviteListApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/user/my_log?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const postBuySpotApi = async (account: string, ttc_num: string) => {
  const res = await fetch(`${TTC_API}/buy/buy_spot?address=${account}&ttc_num=${ttc_num}`, {
    method: 'post',
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const handleConfirmClick = async (data: any) => {
  console.log(data)
}

const usdtAddress = '0x55d398326f99059fF775485246999027B3197955'

const MatrixPage = ({ initData, account, code }) => {
  const { chainId } = useActiveWeb3React()
  //   const code = router.query.user_sn || ''
  console.log('router===code', code)
  const { t } = useTranslation()
  const [onPresentMobileModal, closePresentMobileModal] = useModal(
    <InviteModal code={code} customOnDismiss={handleConfirmClick} />,
  )
  //   const [collections] = await Promise.all([])
  const [inviteList, setInviteList] = useState([])
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  const { toastSuccess, toastError } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [bid, setBid] = useState('')
  console.log('initData====', initData)
  const { isUsdtApproved, setUsdtLastUpdated } = useCheckUsdtApprovalStatus(initData.from_address)
  const { isTTCApproved, setTTCLastUpdated } = useCheckTTCApprovalStatus(initData.from_address)
  const { handleUsdtApprove: handleUsdtApprove, pendingTx: pendingUsdtTx } = useApproveUsdt(
    initData.from_address,
    setUsdtLastUpdated,
  )
  const { handleTTCApprove: handleTTCApprove, pendingTx: pendingTTCTx } = useApproveTTC(
    initData.from_address,
    setTTCLastUpdated,
  )
  const { balance: usdtBalance } = useTokenBalance(usdtAddress)
  const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)
  console.log('usdtBalance', getBalanceNumber(usdtBalance))
  console.log('ttcBalance', getBalanceNumber(ttcBalance))

  //初始化 BNB-TTC
  const initInputCurrencyId = 'BNB'
  const initOutputCurrencyId = tokens.ttc.address
  const { independentField, typedValue, recipient } = useSwapState()
  const inputCurrency = useCurrency(initInputCurrencyId)
  const outputCurrency = useCurrency(initOutputCurrencyId)
  const { v2Trade, parsedAmount } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency,
    outputCurrency,
    recipient,
  )
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const showWrap: boolean = false
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const trade = showWrap ? undefined : v2Trade
  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const handleParticepate = async () => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.0015')
    console.log('INPUT====', formattedAmounts[Field.INPUT])
    console.log('OUTPUT====', formattedAmounts[Field.OUTPUT])
    console.log('立即卡位')
    if (getBalanceNumber(usdtBalance) <= 0) {
      toastError('USDT余额不足')
      return
    }
    if (getBalanceNumber(ttcBalance) <= 0) {
      toastError('TTC代币余额不足')
      return
    }
    const ttc_num = formattedAmounts[Field.OUTPUT]
    const data = await postBuySpotApi(account, ttc_num)
    if (data.status) {
      toastSuccess(t(data.msg))
    } else {
      toastError(t(data.msg))
    }
  }

  useEffect(() => {
    async function init() {
      //   onPresentMobileModal()
      console.log(initData.is_band)
      if (!initData.is_band) {
        onPresentMobileModal()
      } else {
        closePresentMobileModal()
      }
      const invite = await getInviteListApi(account)
      setInviteList(invite.result)
    }
    init()
  }, [account])

  useEffect(() => {
    if (secondsRemaining) {
      const intervalId = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1)
      }, 1000)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [])

  return (
    <StyleMatrixLayout>
      <Link href="/matrix/share" passHref>
        <Image className="share" src="/images/matrix/share.png" alt="Share" width={32} height={32} />
      </Link>
      <MatrixTop>
        <BoxWrapper className="box-1">
          <Text color="#fff" fontSize="23px" letterSpacing="3px" fontWeight="600">
            矩阵NFT
          </Text>
        </BoxWrapper>
        <BoxWrapper className="box-2">
          <Text
            color="#fff"
            className="text-shadow"
            letterSpacing="3px"
            lineHeight="1"
            fontSize="46px"
            fontWeight="600"
          >
            MATRIX
          </Text>
          <p>
            <Text display="inline-block" color="#fff" fontSize="20px" fontWeight="600">
              500BUSD
            </Text>
            <Text display="inline-block" color="#FF8900" fontSize="20px" fontWeight="600">
              起步卡位！
            </Text>
          </p>
        </BoxWrapper>
        <Text color="#D77C0C" fontSize="20px" fontWeight="600" mt="10px">
          全网公排 跳排
        </Text>
        <Text color="#fff" fontSize="16px" fontWeight="600" mt="26px">
          出局不出圈 三三裂变 生生不息 循环造血
        </Text>
      </MatrixTop>
      {/* {account ? (
        !isUsdtApproved ? (
          <Button className="btn-gradient" type="button" disabled={pendingUsdtTx} onClick={handleUsdtApprove}>
            {t('批准')}
          </Button>
        ) : !isTTCApproved ? (
          <Button className="btn-gradient" type="button" disabled={pendingTTCTx} onClick={handleTTCApprove}>
            {t('批准')}
          </Button>
        ) : (
          <Button onClick={handleParticepate} type="button" className="btn-gradient" scale="sm">
            立即卡位
          </Button>
        )
      ) : (
        <ConnectWalletButton />
      )} */}
      <Flex justifyContent="space-around" alignItems="center">
        {!isUsdtApproved ? (
          <Button
            width="45%"
            className="btn-gradient"
            type="button"
            disabled={pendingUsdtTx}
            onClick={handleUsdtApprove}
          >
            {t('批准USDT')}
          </Button>
        ) : null}
        {!isTTCApproved ? (
          <Button width="45%" className="btn-gradient" type="button" disabled={pendingTTCTx} onClick={handleTTCApprove}>
            {t('批准TTC')}
          </Button>
        ) : null}
      </Flex>
      {isTTCApproved && isUsdtApproved ? (
        <Button
          width="70%"
          onClick={handleParticepate}
          disabled={secondsRemaining > 0}
          type="button"
          className="btn-gradient"
          scale="sm"
        >
          <Flex justifyContent="center" alignItems="center">
            立即卡位
            {secondsRemaining > 0 ? <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={false} /> : null}
          </Flex>
        </Button>
      ) : null}

      <Link href="/matrix/mine" passHref>
        <Text color="#fff" fontSize="16px" textAlign="center">
          我的点位
        </Text>
      </Link>
      <Box>
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            9阶出局制
          </Text>
          <ArrowLeft></ArrowLeft>
        </Flex>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          一个9阶下面三个3阶
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          一个3阶下面三个1阶
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          一个1阶下面三个B阶
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center">
          一个B阶下面三个A阶
        </Text>
      </Box>
      <Box>
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            资金分配
          </Text>
          <ArrowLeft></ArrowLeft>
        </Flex>
        <Flex flexWrap="wrap" justifyContent="space-between">
          {inviteList.map((item) => {
            return (
              <Box width="32%" background="#FFFFFF" mb="10px">
                <Text color="#CA9A33" fontSize="16px" textAlign="center">
                  {item.name}
                </Text>
                <LinnerWrapper>
                  <Text
                    className="txt"
                    color="#fff"
                    fontSize="32px"
                    fontWeight="bold"
                    textAlign="center"
                    display="inline"
                  >
                    {item.num}
                  </Text>
                </LinnerWrapper>
              </Box>
            )
          })}

          {/* <Box width="32%" background="#FFFFFF" mb="10px">
            <Text color="#CA9A33" fontSize="16px" textAlign="center">
              3阶
            </Text>
            <LinnerWrapper>
              <Text className="txt" color="#fff" fontSize="32px" fontWeight="bold" textAlign="center" display="inline">
                100
              </Text>
            </LinnerWrapper>
          </Box>
          <Box width="32%" background="#FFFFFF" mb="10px">
            <Text color="#CA9A33" fontSize="16px" textAlign="center">
              1阶
            </Text>
            <LinnerWrapper>
              <Text className="txt" color="#fff" fontSize="32px" fontWeight="bold" textAlign="center" display="inline">
                80
              </Text>
            </LinnerWrapper>
          </Box>
          <Box width="32%" background="#FFFFFF">
            <Text color="#CA9A33" fontSize="16px" textAlign="center">
              B岗位
            </Text>
            <LinnerWrapper>
              <Text className="txt" color="#fff" fontSize="32px" fontWeight="bold" textAlign="center" display="inline">
                40
              </Text>
            </LinnerWrapper>
          </Box>
          <Box width="32%" background="#FFFFFF">
            <Text color="#CA9A33" fontSize="16px" textAlign="center">
              A岗位
            </Text>
            <LinnerWrapper>
              <Text className="txt" color="#fff" fontSize="32px" fontWeight="bold" textAlign="center" display="inline">
                50
              </Text>
            </LinnerWrapper>
          </Box>
          <Box width="32%" background="#FFFFFF">
            <Text color="#CA9A33" fontSize="16px" textAlign="center">
              分享奖
            </Text>
            <LinnerWrapper>
              <Text className="txt" color="#fff" fontSize="32px" fontWeight="bold" textAlign="center" display="inline">
                90
              </Text>
            </LinnerWrapper>
          </Box> */}
        </Flex>
      </Box>
      <Box mt="25px">
        <Text color="#D77C0C" fontSize="16px" fontWeight="bold" textAlign="center">
          公平 公正 公开 透明 无资金池
        </Text>
      </Box>
      <BorderWrapper>
        <Text color="#D77C0C" display="inline" fontSize="16px" fontWeight="bold" textAlign="center">
          准备一点
          <Text color="#fff" display="inline" fontSize="16px" fontWeight="bold" textAlign="center">
            TTC
          </Text>
          做手续费
        </Text>
      </BorderWrapper>
    </StyleMatrixLayout>
  )
}

export default MatrixPage
