import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Flex,
  Text,
  Box,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Modal,
  LinkExternal,
  CalculateIcon,
  IconButton,
  Skeleton,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { useCheckTTCApprovalStatus, useApproveTTC, useTTCNumber } from 'views/Farms/hooks/useApprove'
import { Field } from 'state/swap/actions'
import { getBalanceNumber } from 'utils/formatBalance'

import useRoiCalculatorReducer, {
  CalculatorMode,
  DefaultCompoundStrategy,
  EditingCurrency,
} from '../../../components/RoiCalculatorModal/useRoiCalculatorReducer'
import useTokenBalance from 'hooks/useTokenBalance'
const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`
const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;

  & > button {
    width: 100%;
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`
const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`
const RoiCardWrapper = styled(Box)`
  background: linear-gradient(180deg, #53dee9, #7645d9);
  padding: 1px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.default};
`

const RoiCardInner = styled(Box)`
  height: 120px;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`
interface DepositModalProps {
  onConfirm: (amount: string, ttcNum: string, duration: any, id: any) => void
  onDismiss?: () => void

  detail: object
}

const DepositModal: React.FC<DepositModalProps> = ({ onConfirm, onDismiss, detail }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const { t } = useTranslation()

  const lpTokensToStake = new BigNumber(val)
  // const fullBalanceNumber = new BigNumber(fullBalance)

  // const { compounding, activeCompoundingIndex, stakingDuration, editingCurrency } = state.controls
  const durations = [
    // {
    //   val: 1,
    //   name: '1天',
    // },
    {
      val: 7,
      name: '7天',
    },
    {
      val: 30,
      name: '30天',
    },
    {
      val: 90,
      name: '90天',
    },
    {
      val: 365,
      name: '1年',
    },
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectDuration, setSelectDuration] = useState(detail['day'])
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')
  const { balance: lpBalance } = useTokenBalance(detail['coin_contract2'])
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(lpBalance)
  }, [lpBalance])
  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleTabClick = (newIndex: number) => {
    // setActiveIndex(newIndex)
    // setselectDuration(durations[newIndex].val)
  }

  const handlePlwdge = () => {}

  // if (showRoiCalculator) {
  //   return (
  //     <RoiCalculatorModal
  //       linkLabel={t('Get %symbol%', { symbol: lpLabel })}
  //       stakingTokenBalance={stakedBalance.plus(max)}
  //       stakingTokenSymbol={tokenName}
  //       stakingTokenPrice={lpPrice.toNumber()}
  //       earningTokenPrice={cakePrice.toNumber()}
  //       apr={apr}
  //       multiplier={multiplier}
  //       displayApr={displayApr}
  //       linkHref={addLiquidityUrl}
  //       isFarm
  //       initialValue={val}
  //       onBack={() => setShowRoiCalculator(false)}
  //     />
  //   )
  // }

  useEffect(() => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    setTTCNum(ttc_num)
    console.log('ttc_num===', ttc_num)
    let active = durations.findIndex((item) => item.val == detail['day'])
    setActiveIndex(active)
  }, [])

  return (
    <Modal title={`${t('Stake')}${detail['coin_name2']}`} onDismiss={onDismiss}>
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={getBalanceNumber(lpBalance).toString()}
        symbol={'tokenName'}
        addLiquidityUrl={'addLiquidityUrl'}
        inputTitle={t('Stake')}
      />

      <Flex justifyContent="space-between" mt="8px ">
        <Button scale="xs" p="4px 16px" width="auto" variant="tertiary" onClick={() => {}}>
          {t('已质押：')}
          {detail['in_coin_num']}TTC
        </Button>
      </Flex>
      <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
        {t('Staked for')}
      </Text>
      <Flex mb="28px ">
        <FullWidthButtonMenu
          // disabled={!compounding}
          activeIndex={activeIndex}
          onItemClick={handleTabClick}
          scale="sm"
        >
          {durations.map((item) => {
            return <ButtonMenuItem>{item.name}</ButtonMenuItem>
          })}
          {/* <ButtonMenuItem>{t('1D')}</ButtonMenuItem>
          <ButtonMenuItem>{t('7D')}</ButtonMenuItem>
          <ButtonMenuItem>{t('30D')}</ButtonMenuItem>
          <ButtonMenuItem>{t('90D')}</ButtonMenuItem>
          <ButtonMenuItem>{t('一年')}</ButtonMenuItem> */}
        </FullWidthButtonMenu>
      </Flex>
      <Flex>
        <RoiCardWrapper>
          <RoiCardInner>
            <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
              {t('ROI at current rates')}
            </Text>
            <Text fontSize="12px" color="textSubtle">
              {Number(val) * Number(detail['profit'])}
            </Text>
          </RoiCardInner>
        </RoiCardWrapper>
      </Flex>
      <ModalActions>
        {/* <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button> */}
        {pendingTx ? (
          <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
            {t('Confirming')}
          </Button>
        ) : (
          <Button
            width="100%"
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val, ttcNum, selectDuration, detail['id'])
              onDismiss?.()
              setPendingTx(false)
            }}
          >
            {t('Confirm')}
          </Button>
        )}
      </ModalActions>
      <Flex justifyContent="space-between">
        <Text color="textSubtle" bold fontSize="12px" textTransform="uppercase">
          {t('预期年利化率')}
        </Text>
        <Text color="textSubtle" bold fontSize="12px" textTransform="uppercase">
          {Number(detail['year_profit']) * 100}%
        </Text>
      </Flex>
      {/* <LinkExternal href={addLiquidityUrl} style={{ alignSelf: 'center' }}>
        {t('Get %symbol%', { symbol: tokenName })}
      </LinkExternal> */}
    </Modal>
  )
}

export default DepositModal
