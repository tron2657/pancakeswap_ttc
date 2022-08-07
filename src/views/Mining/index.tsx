import { useEffect, useState, createContext } from 'react'
import { Heading, Card, Text, Button, ArrowForwardIcon, Flex, useModal, AutoRenewIcon } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled from 'styled-components'
import useCatchTxError from 'hooks/useCatchTxError'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import PageHeader from 'components/PageHeader'
import CardHeading from './components/CardHeading'
import tokens from 'config/constants/tokens'
import fetchFarms from 'state/farmsV1/fetchFarms'
import getFarmsPrices from 'state/farmsV1/getFarmsPrices'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarmFromPid } from 'state/farmsV1/hooks'

import {
  useJoinMiningCallback,
  useCheckCustomIfAccessStatus,
  useDrawMiningCallback,
  useObtainEarnedToken,
  useTotalSupply,
  useDailyProduce,
  useTotal,
  useTTCNumber,
} from './hook/useJoinMining'

import { useCheckTTCApprovalStatus, useApproveTTC } from './hook/useApprove'
import { DIVI_API } from 'config/constants/endpoints'
import useToast from 'hooks/useToast'
import { Field } from 'state/swap/actions'
import TTCModal from './components/ttcModal'
import useTokenBalance from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import CountdownCircle from 'views/matrix/components/CountdownCircle'

const handleParticipateApi = async (account: string, ttc_num: string) => {
  const res = await fetch(`${DIVI_API}/user/app_reg?address=${account}&ttc_num=${ttc_num}`, {
    method: 'post',
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const handleReceiveApi = async (account: string, ttc_num: string) => {
  const res = await fetch(`${DIVI_API}/buy/buy_spot?address=${account}&ttc_num=${ttc_num}`, {
    method: 'post',
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
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

const MiningCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`
const StyledCard = styled(Card)`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const Mining = ({ initData, account, callback }) => {
  console.log(initData, account)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()

  // const { chainId, library } = useActiveWeb3React()

  // const [isJoinMining, setIsJoinMining] = useState(false)

  // const { customIfAccess, setCustomIfAccessUpdated } = useCheckCustomIfAccessStatus()

  // // const { handleMining: handleMining, pendingTx: pendingTranctionTx } = useJoinMiningCallback(setCustomIfAccessUpdated)

  // const { obtainEarnedToken, setObtainEarnedToken } = useObtainEarnedToken()

  // const { totalSupply, setTotalSupply } = useTotalSupply()
  // const { total, setTotal } = useTotal()
  // const { dailyProduce, setDailyProduce } = useDailyProduce()

  const [loading, setLoading] = useState(false)
  const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)
  const { balance: lpBalance } = useTokenBalance('0x3fb910f48B36E692740dE377652a034a8448B753')
  console.log('lpBalance', getBalanceNumber(lpBalance))
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const { isTTCApproved, setTTCLastUpdated } = useCheckTTCApprovalStatus(initData.ttc_contract, initData.from_address2)

  const { handleTTCApprove: handleTTCApprove, pendingTx: pendingTTCTx } = useApproveTTC(
    initData.ttc_contract,
    initData.from_address2,
    setTTCLastUpdated,
  )
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')

  //处理关闭弹窗
  const handleConfirmClick = (data) => {
    console.log('handleConfirmClick==ttc_num', data)
    setTTCNum(data)
    initData.is_band == 1 ? handleDrawMining(data) : handleMining(data)
  }

  //打开TTC手续费弹窗
  const handleOpenTTCModal = () => {
    onPresentMobileModal()
  }
  //参与分红
  const handleMining = async (ttc_num) => {
    console.log('ttc_num===', ttcNum)
    if (getBalanceNumber(lpBalance) <= 0) {
      toastError('lp代币余额为0')
      return
    }
    if (getBalanceNumber(ttcBalance) < Number(ttc_num)) {
      toastError('TTC余额不足')
      return
    }
    setLoading(true)
    const data = await handleParticipateApi(account, ttc_num)
    setLoading(false)
    if (data.status) {
      toastSuccess(t(data.msg))
      callback()
      // setSecondsRemaining(120)
      // openCountDown()
    } else {
      toastError(t(data.msg))
    }
  }

  //领取分红
  const handleDrawMining = async (ttc_num) => {
    if (getBalanceNumber(ttcBalance) < Number(ttc_num)) {
      toastError('TTC余额不足')
      return
    }
    setLoading(true)
    const data = await handleReceiveApi(account, ttc_num)
    setLoading(false)
    if (data.status) {
      toastSuccess(t(data.msg))
      setSecondsRemaining(120)
      openCountDown()
    } else {
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

  // const { handleMining: handleDrawMining, pendingTx: pendingDrawTranctionTx } =
  //   useDrawMiningCallback(setCustomIfAccessUpdated)
  const [onPresentMobileModal, closePresentMobileModal] = useModal(<TTCModal customOnDismiss={handleConfirmClick} />)

  const renderApprovalOrStakeButton = () => {
    return !isTTCApproved ? (
      <Button
        mt="8px"
        width="100%"
        isLoading={pendingTTCTx}
        disabled={pendingTTCTx}
        onClick={handleTTCApprove}
        endIcon={pendingTTCTx ? <AutoRenewIcon color="currentColor" spin /> : null}
      >
        {t('批准TTC 参与分红')}
      </Button>
    ) : initData.is_band == 1 ? (
      // <Button mt="8px" width="100%" disabled={!initData.eti_coin} onClick={handleOpenTTCModal}>
      //   {t('MiningDraw')}
      // </Button>
      <Button
        width="100%"
        marginLeft="auto"
        onClick={handleOpenTTCModal}
        disabled={secondsRemaining > 0 || initData.is_band != 1 || initData.eti_coin == 0}
        isLoading={loading}
        endIcon={loading ? <AutoRenewIcon color="currentColor" spin /> : null}
      >
        <Flex justifyContent="center" alignItems="center">
          {t('MiningDraw')}
          {secondsRemaining > 0 ? <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={false} /> : null}
        </Flex>
      </Button>
    ) : (
      <Button
        mt="8px"
        width="100%"
        onClick={handleOpenTTCModal}
        isLoading={loading}
        endIcon={loading ? <AutoRenewIcon color="currentColor" spin /> : null}
      >
        <Flex justifyContent="center" alignItems="center">
          {t('MiningJoin')}
          {secondsRemaining > 0 ? <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={false} /> : null}
        </Flex>
      </Button>
    )
  }

  const MiningToken = tokens.ttc

  const MiningQuoteToken = tokens.usdt

  useEffect(() => {
    if (account) {
      onCurrencySelection(Field.INPUT, inputCurrency)
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      onUserInput(Field.INPUT, '0.015')
      const ttc_num = formattedAmounts[Field.OUTPUT]
      setTTCNum(ttc_num)
      console.log('ttc_num===', ttc_num)
    }
  }, [account])

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('Liquidity dividend')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('Hold TTC-USDT LP tokens to produce ETI')}
        </Heading>
        <NextLinkFromReactRouter to="/farms/auction" prefetch={false}>
          <Button p="0" variant="text">
            <Text color="primary" bold fontSize="16px" mr="4px">
              {t('TTC-USDT liquidity')}
            </Text>
            <ArrowForwardIcon color="primary" />
          </Button>
        </NextLinkFromReactRouter>
      </PageHeader>
      <Page>
        <StyledCard>
          <FarmCardInnerContainer>
            <CardHeading
              lpLabel={'TTC-USDT'}
              multiplier={'farm.multiplier'}
              isCommunityFarm={true}
              token={MiningToken}
              quoteToken={MiningQuoteToken}
            />

            <Flex justifyContent="space-between">
              <Text small color="textSubtle">
                {t('Total')}:
              </Text>
              <Text small bold>
                {initData.coin_sum}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text small color="textSubtle">
                {t('Daily Output')}:
              </Text>
              <Text small bold>
                {initData.day_put_num}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text small color="primary">
                {t('ETI')}{' '}
                <Text color="textSubtle" as="span">
                  {t('Earned')}:
                </Text>
              </Text>
              <Text small bold>
                {initData.eti_coin}
                {/* {(obtainEarnedToken / Math.pow(10, 18)).toFixed(8)} */}
              </Text>
            </Flex>
            {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
            <Text small mt={'8px'} color="textSubtle">
              {t('Dividend rules: ')}
            </Text>
            <Text small color="textSubtle">
              {t('Pancake adds TTC: USDT liquidity participates in mining dividends, no lock-up and no pledge')}
            </Text>
            <Text small color="textSubtle">
              {t('The minimum airdrop ETI is 0.01 permanent binding address')}
            </Text>
            {/* <Text small color="textSubtle">
              {t('ProduceRuleDesc3')}
            </Text> */}
            <Text small color="textSubtle">
              {t('Earn dividends at 20:00 every day after participation')}
            </Text>
          </FarmCardInnerContainer>
        </StyledCard>
      </Page>
    </>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Mining
