import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import CommonInput from './components/CommonInput'
import { Input, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Link from 'next/link'
import Container from 'components/Layout/Container'
import Page from '../Page'
import { AppHeader, AppBody } from '../../components/App'
import { CardBody, CardFooter, Button } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useTokenCreate } from './hook/useCoinFactory'
import useTheme from 'hooks/useTheme'
import tokens from 'config/constants/tokens'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { Field } from 'state/swap/actions'
const StyledInput = styled(Input)`
  z-index: 9999;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`
const Body = styled(CardBody)``
const Issuance = () => {
  const [zhName, setZhName] = useState('')
  const [enName, setEnName] = useState('')
  const [publishNum, setPublishNum] = useState(null)
  const [decimal, setDecimal] = useState(null)
  const [receiptAddr, setReceiptAddr] = useState('')
  const { theme } = useTheme()
  const router = useRouter()
  const { handle: handleCreateToken, pendingTx: pendingCreateTokenTranctionTx } = useTokenCreate()
  const [ttcNum, setTTCNum] = useState(0)
  const handleChange = (input) => {
    handleCreateToken(receiptAddr, zhName, enName, publishNum, decimal, () => {
      setZhName('')
      setEnName('')
      setPublishNum(null)
      setDecimal(null)
      setReceiptAddr('')
    })
    // setDecimalValue(input);
  }

  // const {handle:handleCreateToken,pendingTx:pendingCreateTokenTranctionTx}=useTokenCreate(
  //   '0x2F744BE3E68798BDa7e4E7c2c634542fa385280f',
  //   'CNB',
  //   'CNB',100,10)

  const { t } = useTranslation()
  //初始化 BNB-TTC
  const initInputCurrencyId = '0x55d398326f99059fF775485246999027B3197955'
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
  useEffect(() => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '20')
    setTTCNum(Number(formattedAmounts[Field.OUTPUT]))
  }, [])
  return (
    <Page>
      <AppBody>
        <AppHeader title={'发行标准合约代币'} subtitle="" noConfig />
        <Body>
          <CommonInput
            value={zhName}
            label="英文全称"
            placeholder="请输入"
            onUserInput={(val) => {
              setZhName(val)
              console.log(zhName)
            }}
          ></CommonInput>
          <CommonInput
            value={enName}
            label="英文简称"
            placeholder="请输入"
            onUserInput={(val) => {
              setEnName(val)
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={publishNum}
            label="发行量"
            placeholder="请输入"
            onUserInput={(val) => {
              setPublishNum(val)
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={decimal}
            label="精度"
            placeholder="请输入"
            onUserInput={(val) => {
              setDecimal(val)
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={receiptAddr}
            label="接收地址"
            placeholder="请输入"
            onUserInput={(val) => {
              setReceiptAddr(val)
              console.log(val)
            }}
          ></CommonInput>
          <Text mt="10px" color={theme.colors.text}>
            支付费用：
            <Text mt="10px" display="inline-block" color={theme.colors.primary}>
              {ttcNum} TTC
            </Text>
          </Text>
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Button id="join-pool-button" width="100%" disabled={pendingCreateTokenTranctionTx} onClick={handleChange}>
            确定发行
          </Button>
          <Link href="/issuance/contact" passHref>
            <Text mt="10px" color={theme.colors.primary}>
              发行自定义合约
            </Text>
          </Link>
        </CardFooter>
      </AppBody>
    </Page>
  )
}

export default Issuance
