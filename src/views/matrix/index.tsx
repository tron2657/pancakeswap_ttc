import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Text, Box, Flex, useModal, Image, AutoRenewIcon } from '@pancakeswap/uikit'
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
import { CopyButton } from './components/CopyButton'
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
  .border-btn {
    background: transparent;
    border: 1px solid #e6bf5d;
    color: #e6bf5d;
    display: block;
    margin: 0 auto;
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
const getMyListApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/buy/my_spot_new?address=${account}`, {
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

const usdtAddress = '0x55d398326f99059fF775485246999027B3197955'

const MatrixPage = ({ initData, account, code, callback }) => {
  const { chainId } = useActiveWeb3React()
  //   const code = router.query.user_sn || ''
  console.log('router===code', code)
  const { t } = useTranslation()
  const [onPresentMobileModal, closePresentMobileModal] = useModal(
    <InviteModal code={code} customOnDismiss={callback} />,
  )
  //   const [collections] = await Promise.all([])
  const [mySport, setMySport] = useState([])
  const [inviteList, setInviteList] = useState([])
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(1)
  const { toastSuccess, toastError } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [bid, setBid] = useState('')
  console.log('initData====', initData)
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
    if (!initData.is_band) {
      onPresentMobileModal()
      return
    }

    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    console.log('ttc_num====', ttc_num)
    // console.log('INPUT====', formattedAmounts[Field.INPUT])
    // console.log('OUTPUT====', formattedAmounts[Field.OUTPUT])
    console.log('立即卡位')
    if (getBalanceNumber(usdtBalance) < Number(initData.spot_price)) {
      toastError(t('Usdt balance is insufficient'))
      return
    }
    if (getBalanceNumber(ttcBalance) < Number(ttc_num)) {
      toastError(t('Insufficient TTC handling fee'))
      return
    }
    setLoading(true)
    const data = await postBuySpotApi(account, ttc_num)
    if (data.status) {
      toastSuccess(t(data.msg))
      setLoading(false)
      setSecondsRemaining(120)
      openCountDown()
    } else {
      setLoading(false)
      toastError(t(data.msg))
    }
  }

  const openCountDown = () => {
    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev == 1) {
          clearInterval(intervalId)
        }
        return prev - 1
      })
    }, 1000)
    // clearInterval(intervalId)
  }

  // const handleConfirmClick = async (data: any) => {
  //   callback()
  //   console.log(data)
  // }

  useEffect(() => {
    async function init() {
      //   onPresentMobileModal()
      console.log(initData.is_band)
      if (!initData.is_band) {
        onPresentMobileModal()
      } else {
        closePresentMobileModal()
      }
      const sport = await getMyListApi(account)
      setMySport(sport.result)
      // if (sport.result.lenght) {
      //   setStatus(sport.result[0].status)
      // }

      // const invite = await getInviteListApi(account)
      const invite = [
        {
          num: 180,
          name: t('Share rewards'),
        },
        {
          num: 30,
          name: t('White reward'),
        },
        {
          num: 26,
          name: t('Yellow reward'),
        },
        {
          num: 4,
          name: t('Red reward'),
        },
        {
          num: 5,
          name: t('Blue reward'),
        },
        {
          num: 7,
          name: t('Gold Award'),
        },
      ]
      setInviteList(invite)
    }
    init()
  }, [account])

  return (
    <StyleMatrixLayout>
      <Flex justifyContent="space-around" alignItems="center">
        {!isUsdtApproved ? (
          <Button
            width="45%"
            className="btn-gradient"
            type="button"
            disabled={pendingUsdtTx || (mySport.length && mySport[0].status == 0)}
            onClick={handleUsdtApprove}
          >
            {t('Approve usdt')}
          </Button>
        ) : null}
        {!isTTCApproved ? (
          <Button
            width="45%"
            className="btn-gradient"
            type="button"
            disabled={pendingTTCTx || (mySport.length && mySport[0].status == 0)}
            onClick={handleTTCApprove}
          >
            {t('Approve TTC')}
          </Button>
        ) : null}
      </Flex>
      {isTTCApproved && isUsdtApproved ? (
        <Button
          width="70%"
          onClick={handleParticepate}
          disabled={secondsRemaining > 0 || (mySport.length && mySport[0].status == 0)}
          type="button"
          className="btn-gradient"
          scale="sm"
          isLoading={loading}
        >
          <Flex justifyContent="center" alignItems="center">
            {t('Buy NFT')}
            {loading ? <AutoRenewIcon color="currentColor" spin /> : null}
            {secondsRemaining > 0 ? <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={false} /> : null}
          </Flex>
        </Button>
      ) : null}

      <Link href="/matrix/mine" passHref>
        {/* <Text color="#fff" fontSize="16px" textAlign="center">
          我的点位
        </Text> */}
        <Button className="border-btn" type="button" scale="sm">
          {mySport.length ? (mySport[0].status == 0 ? t('Out') : t('View my NFT')) : t('my NFT 0')}
          {/* 我的点位 {mySport} 个 */}
        </Button>
      </Link>
      <Box mt="10px">
        <Text color="#fff" fontSize="14px" textAlign="center">
          {t('Please add MX (matrix) contract address for card slot, and air drop 131 pieces')}
        </Text>
        <Flex mt="10px" flexWrap="wrap" justifyContent="center" alignItems="center">
          <Text color="#fff" fontSize="14px" fontWeight="600" mr="5px">
            0x9e7bDCfB92d81D03a0f8a0EaFc9e4D327f152a27
          </Text>
          <CopyButton
            buttonColor="#D77C0C"
            width="24px"
            text="0x9e7bDCfB92d81D03a0f8a0EaFc9e4D327f152a27"
            tooltipMessage={t('Copied')}
            tooltipRight={40}
            tooltipTop={20}
          />
        </Flex>
      </Box>
      <Box mt="10px">
        <Link href="/matrix/finance" passHref>
          {/* <Text color="#fff" fontSize="16px" textAlign="center">
          我的点位
        </Text> */}
          <Button className="border-btn" type="button" scale="sm">
            MX销毁收益
          </Button>
        </Link>
      </Box>
      <Box mb="20px">
        <Link href="/matrix/about" passHref>
          <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
            <ArrowRight></ArrowRight>
            <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
              {t('Golden full network end')}
            </Text>
            <ArrowLeft></ArrowLeft>
          </Flex>
        </Link>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('3 white NFTs to synthesize 1 yellow NFT')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('3 yellow NFTs to 1 red NFT')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('3 red NFTs to synthesize 1 Blue NFT')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center">
          {t('3 Blue NFTs combined with 1 gold NFT')}
        </Text>
      </Box>
      <Link href="/matrix/about" passHref>
        {/* <Text color="#fff" fontSize="16px" textAlign="center">
          我的点位
        </Text> */}
        <Button className="border-btn" type="button" scale="sm">
          {t('View rules')}
        </Button>
      </Link>
      <Box>
        <Link href="/matrix/about" passHref>
          <Flex justifyContent="center" alignItems="center" mt="20px" mb="24px">
            <ArrowRight></ArrowRight>
            <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
              {t('Synthetic reward')}
            </Text>
            <ArrowLeft></ArrowLeft>
          </Flex>
        </Link>
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
                    <span style={{ fontSize: '12px' }}>
                      USDT{t('of')} <span style={{ fontSize: '16px' }}>TTC</span>
                    </span>
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
          {t('Fair, just, open and transparent, no fund pool')}
        </Text>
      </Box>
      <BorderWrapper>
        <Text color="#D77C0C" display="inline" fontSize="16px" fontWeight="bold" textAlign="center">
          {t('Be prepared')}
          <Text color="#fff" display="inline" fontSize="16px" fontWeight="bold" textAlign="center">
            TTC
          </Text>
          {t('Handling fee')}
        </Text>
      </BorderWrapper>
    </StyleMatrixLayout>
  )
}

export default MatrixPage
