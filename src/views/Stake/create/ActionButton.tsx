import { useEffect, useState, useMemo } from 'react'
import { AutoRenewIcon, Button, Text, useModal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { PLEDGE_API } from 'config/constants/endpoints'
// import SelectCoinModal from './selectCoinModal'
import { getBalanceNumber } from 'utils/formatBalance'
import useTokenBalance from 'hooks/useTokenBalance'
import useSyncCallback from '../hooks/useSyncCallback'
import tokens from 'config/constants/tokens'
import { useApproveTTC, useCheckTTCApprovalStatus, useTTCNumber } from '../hooks/useApprove'
import { Field } from 'state/swap/actions'
import useCatchTxError from 'hooks/useCatchTxError'
import useCreateFarms from '../hooks/useCreateFarm'
import { setPlegeListParams } from 'state/pledge/reducer'

const handlePreCreateApi = async (account) => {
  const res = await fetch(`${PLEDGE_API}/pledge/pledge?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}

const handleCreateApi = async (params) => {
  const res = await fetch(
    `${PLEDGE_API}/pledge/pledge_add?address=${params.address}&id=${params.id}&coin1_coin2_price=${params.coin1_coin2_price}&coin_contract=${params.coin_contract}&coin_contract2=${params.coin_contract2}&coin_hash=${params.coin_hash}&coin_name=${params.coin_name}&coin_name2=${params.coin_name2}&coin_num=${params.coin_num}&day=${params.day}&end_time=${params.end_time}&start_time=${params.start_time}&lp_type=${params.lp_type}&text=${params.text}&ttc_num=${params.ttc_num}&type=${params.type}`,
    {
      method: 'post',
      // body: JSON.stringify(params),
    },
  )
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}

export interface ActionButtonProps {
  address: any
  coin_num: any
  coin_name: any
  coin_contract: any
  coin_name2: any
  coin_contract2: any
  coin1_coin2_price: any
  text: any
  day: any
  start_time: any
  end_time: any
  initData: any
  disabled: boolean
}

const ActionButton: React.FunctionComponent<ActionButtonProps> = ({
  address,
  coin_num,
  coin_name,
  coin_contract,
  coin_name2,
  coin_contract2,
  start_time,
  end_time,
  coin1_coin2_price,
  text,
  day,
  disabled,
  initData,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState('')
  const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)
  const { isTTCApproved, setTTCLastUpdated } = useCheckTTCApprovalStatus(tokens.ttc.address, initData['from_address3'])
  const { handleTTCApprove: handleTTCApprove, pendingTx: pendingTTCTx } = useApproveTTC(
    tokens.ttc.address,
    initData['from_address3'],
    setTTCLastUpdated,
  )
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  console.log('coin_contract2===', coin_contract2)
  const { onCreate } = useCreateFarms(coin_contract2, initData['from_address3'])

  const handlePreCreate = async () => {
    const data = await handlePreCreateApi(account)
    if (data.status == 1) {
      return data.result.id
      // setId(data.result.id)
      //   updateValue('id', data.result.id)
    } else {
      return ''
    }
  }

  const handleCreate = async () => {
    const id = await handlePreCreate()
    const ttc_num = formattedAmounts[Field.OUTPUT]
    if (getBalanceNumber(ttcBalance) < Number(ttcNum)) {
      toastError('TTC余额不足')
      return
    }
    setIsLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onCreate(coin_num)
    })
    if (receipt?.status) {
      let params = {
        address: account,
        coin_num: coin_num,
        coin_hash: receipt.transactionHash,
        coin_name: coin_name,
        coin_contract: coin_contract,
        coin_name2: coin_name2,
        coin_contract2: coin_contract2,
        ttc_num: ttc_num,
        type: coin_name2 == coin_name ? 1 : 2,
        lp_type: 2,
        coin1_coin2_price: coin1_coin2_price,
        text: text,
        day: day,
        id: id,
        start_time: start_time,
        end_time: end_time,
      }
      console.log('post==params', params)
      await postCreate(params)
      toastSuccess(
        `${t('Created')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )

      // dispatch(fetchPledgeListAsync({ account: account, params: statePledgeListParams }))
      // dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }

  const postCreate = async (params) => {
    const data = await handleCreateApi(params)
    if (data.status) {
      toastSuccess(t(data.msg))
      setIsLoading(false)
      // setSecondsRemaining(120)
      // openCountDown()
    } else {
      toastError(t(data.msg))
    }
  }

  return (
    <>
      {isTTCApproved ? (
        <Button
          type="submit"
          width="100%"
          isLoading={isLoading}
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
          // disabled={!isEmpty(formErrors)}
          disabled={isLoading || disabled}
          onClick={handleCreate}
          mb="16px"
        >
          {t('创建')}
        </Button>
      ) : (
        <Button width="100%" disabled={pendingTTCTx} onClick={handleTTCApprove} variant="secondary">
          {t('Enable')}
        </Button>
      )}
    </>
  )
}

export default ActionButton
