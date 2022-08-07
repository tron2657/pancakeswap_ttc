import { useState, useEffect } from 'react'
import Mining from '../views/Mining'
import PageLoader from 'components/Loader/PageLoader'
import { DIVI_API } from 'config/constants/endpoints'
import { useWeb3React } from '@web3-react/core'
// import { useTTCNumber } from '../views/Mining/hook/useJoinMining'
// import { Field } from 'state/swap/actions'

const getInitDataApi = async (account: string) => {
  const res = await fetch(`${DIVI_API}/trx/index?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const MiningPage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const { account } = useWeb3React()
  // const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  useEffect(() => {
    async function init() {
      if (account) {
        const _data = await getInitDataApi(account)

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
  return loading ? <PageLoader></PageLoader> : <Mining initData={data} account={account}></Mining>
}

export default MiningPage
