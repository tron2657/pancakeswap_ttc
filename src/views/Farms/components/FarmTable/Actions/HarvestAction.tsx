import { useState, useEffect } from 'react'
import { Button, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { FarmWithStakedValue } from '../../types'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { PLEDGE_API } from 'config/constants/endpoints'
import { useTTCNumber } from 'views/Farms/hooks/useApprove'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'

const OverFlowBox = styled.div``

const handleReceiveApi = async (account: string, ttc_num: string, id: any) => {
  const res = await fetch(`${PLEDGE_API}/pledge/put_order?address=${account}&ttc_num=${ttc_num}&id=${id}`, {
    method: 'post',
    // body: JSON.stringify({ account: account, ttc_num: ttc_num, id: id }),
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
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  const handleReceive = async (id) => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    console.log('account==', account, 'ttcNum===', ttc_num, 'id===', id)

    setLoading(true)
    const data = await handleReceiveApi(account, ttc_num, id)
    setLoading(false)
    if (data.status) {
      toastSuccess(t(data.msg))
      // setSecondsRemaining(120)
      // openCountDown()
    } else {
      toastError(t(data.msg))
    }
  }

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
              {/* disabled={Number(farm['order_sum_j']) == 0 || loading} */}

              <Button
                disabled={Number(item['j_num']) == 0}
                onClick={() => {
                  handleReceive(item['id'])
                }}
                ml="4px"
              >
                {t('领取')}
              </Button>
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
