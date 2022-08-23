import CreateStake from '../../views/Stake/create/index'
import { useState, useEffect } from 'react'

import { PLEDGE_API } from 'config/constants/endpoints'
import PageLoader from 'components/Loader/PageLoader'
import { useWeb3React } from '@web3-react/core'
const getInitDataApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/trx/index?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const getCoinListApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/pledge/coin_list`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const getRegtApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/user/app_reg`, {
    method: 'post',
    body: JSON.stringify({
      address: account,
      ttc_num: 0,
    }),
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const CreateStakePage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [coinList, setCoinList] = useState([])
  const { account } = useWeb3React()
  useEffect(() => {
    async function init() {
      if (account) {
        await getRegtApi(account)
        const _data = await getInitDataApi(account)
        // const _list_data = await getCoinListApi(account)
        if (_data.status) {
          // onCurrencySelection(Field.INPUT, inputCurrency)
          // onCurrencySelection(Field.OUTPUT, outputCurrency)
          // onUserInput(Field.INPUT, '0.015')
          // const ttc_num = formattedAmounts[Field.OUTPUT]

          // console.log('ttc_num===', ttc_num)
          console.log('initData====', _data)
          setData(_data.result)

          setLoading(false)
        }
      }
    }
    init()
  }, [account])
  return loading ? <PageLoader></PageLoader> : <CreateStake initData={data}></CreateStake>
}
export default CreateStakePage
