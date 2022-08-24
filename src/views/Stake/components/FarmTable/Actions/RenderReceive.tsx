import { useState } from 'react'
import { Button, Heading, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useAppDispatch } from 'state'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { PLEDGE_API } from 'config/constants/endpoints'
import { useTTCNumber } from 'views/Farms/hooks/useApprove'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'

const OverFlowBox = styled.div``

const RenderReceiveBtn = (item, farm) => {
  const { toastSuccess, toastError } = useToast()
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()

  // const { d, h, m, s } = useCountDown(
  //   {
  //     currentTime: new Date().getTime(),
  //     endTime: new Date('2022-08-31').getTime(),
  //   },
  //   () => {},
  // )

  const handleReceive = async () => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')

    const ttc_num = formattedAmounts[Field.OUTPUT]
    console.log('account==', account, 'ttcNum===', ttc_num, 'id===', farm['id'])

    setLoading(true)

    const data = await handleReceiveApi(account, ttc_num, farm['id'])
    setLoading(false)
    if (data.status) {
      toastSuccess(t(data.msg))
      // setSecondsRemaining(120)
      // openCountDown()
    } else {
      toastError(t(data.msg))
    }
  }

  return item['status'] == 3 ? (
    <Button disabled={Number(item['j_num']) == 0 || loading} onClick={handleReceive} ml="4px">
      {t('领取')}
    </Button>
  ) : item['status'] == 4 ? (
    <Button disabled={true} ml="4px">
      {t('已领取')}
    </Button>
  ) : (
    <Button disabled={true} ml="4px">
      {t('待领取')}
      {item['end_day']}
      {t('天')}
    </Button>
  )
}

const handleReceiveApi = async (account: string, ttc_num: string, id: any) => {
  const res = await fetch(`${PLEDGE_API}/pledge/put_order?address=${account}&ttc_num=${ttc_num}&id=${id}`, {
    method: 'post',
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}

export default RenderReceiveBtn
