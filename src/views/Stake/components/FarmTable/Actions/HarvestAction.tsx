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

const RenderReceiveBtn = ({ item, farm }) => {
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

  console.log('status=====', item)
  if (item['status'] == 3) {
    return (
      <Button disabled={Number(item['j_num']) == 0 || loading} onClick={handleReceive} ml="4px">
        {t('领取')}
      </Button>
    )
  }
  if (item['status'] == 4) {
    return (
      <Button disabled={true} ml="4px">
        {t('已领取')}
      </Button>
    )
  }
  if (item['status'] <= 3) {
    return (
      <Button disabled={true} ml="4px">
        {t('待领取')}
        {`${item['end_day']}${t('天')}`}
      </Button>
    )
  }
  return (
    <Button disabled={true} ml="4px">
      {t('待领取')}
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

interface HarvestActionProps {
  farm: any
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ farm }) => {
  const { toastSuccess, toastError } = useToast()
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()

  // const handleReceive = async () => {
  //   onCurrencySelection(Field.INPUT, inputCurrency)
  //   onCurrencySelection(Field.OUTPUT, outputCurrency)
  //   onUserInput(Field.INPUT, '0.015')
  //   onUserInput(Field.INPUT, '0.015')
  //   const ttc_num = formattedAmounts[Field.OUTPUT]
  //   console.log('account==', account, 'ttcNum===', ttc_num, 'id===', farm['id'])

  //   setLoading(true)
  //   const data = await handleReceiveApi(account, ttc_num, farm['id'])
  //   setLoading(false)
  //   if (data.status) {
  //     toastSuccess(t(data.msg))
  //     // setSecondsRemaining(120)
  //     // openCountDown()
  //   } else {
  //     toastError(t(data.msg))
  //   }
  // }

  return (
    <OverFlowBox>
      {farm['order_list'].map((item) => {
        return (
          <ActionContainer>
            <ActionTitles>
              <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                TTC
              </Text>
              <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                {t('Earned')}
              </Text>
            </ActionTitles>
            <ActionContent>
              <div>
                <Heading>{item['j_num']}</Heading>
                {/* {earningsBusd > 0 && (
                  <Balance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={earningsBusd}
                    unit=" USD"
                    prefix="~"
                  />
                )} */}
              </div>
              <RenderReceiveBtn item={item} farm={farm}></RenderReceiveBtn>
              {/* <Button
          disabled={earnings.eq(0) || pendingTx || !userDataReady}
          onClick={async () => {
            const receipt = await fetchWithCatchTxError(() => {
              return onReward()
            })
            if (receipt?.status) {
              toastSuccess(
                `${t('Harvested')}!`,
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                  {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
                </ToastDescriptionWithTx>,
              )
              dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
            }
          }}
          ml="4px"
        >
          {pendingTx ? t('Harvesting') : t('Harvest')}
        </Button> */}
            </ActionContent>
          </ActionContainer>
        )
      })}
    </OverFlowBox>
  )
}

export default HarvestAction
