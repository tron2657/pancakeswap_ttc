import { useState, useEffect } from 'react'
import { Text } from '@pancakeswap/uikit'

import MatrixPage from '../../views/matrix'
const initData = {}
import { TTC_API } from 'config/constants/endpoints'

import { useWeb3React } from '@web3-react/core'
const getInitDataApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/trx/index?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const CurrentMatrixPage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const { account } = useWeb3React()
  //   getInitDataApi(account)
  //     .then((res) => {
  //       console.log(res)
  //       //   setData(res.result)
  //     })
  //     .catch((error) => {})
  useEffect(() => {
    async function init() {
      if (account) {
        const _data = await getInitDataApi(account)

        if (_data.status) {
          console.log('initData====', _data)
          setData(_data.result)
          setLoading(false)
        }
      }
    }
    init()
  }, [account])
  return loading ? <Text>加载中...</Text> : <MatrixPage initData={data} account={account} />
}

export default CurrentMatrixPage
