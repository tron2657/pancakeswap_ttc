import { useState, useEffect } from 'react'
import MatrixFinancePage from '../../views/matrix/finance'
import MatrixPageLayout from '../../views/matrix/layout'
import PageLoader from 'components/Loader/PageLoader'
import { useWeb3React } from '@web3-react/core'
import { PLEDGE_API, TTC_API } from 'config/constants/endpoints'
import queryString from 'query-string'

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

const getRegtApi = async (account: string) => {
  let _data = {
    address: account,
  }
  const res = await fetch(`${PLEDGE_API}/user/app_reg`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: queryString.stringify(_data),
    // body: JSON.stringify({
    //   address: account,
    //   ttc_num: 0,
    // }),
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const CurrentMatrixFinancePage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const { account } = useWeb3React()
  useEffect(() => {
    async function init() {
      if (account) {
        await getRegtApi(account)
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
  const handleInit = async () => {
    if (account) {
      const _data = await getInitDataApi(account)

      if (_data.status) {
        console.log('initData====', _data)
        setData(_data.result)
        // setLoading(false)
      }
    }
  }
  return loading ? (
    <PageLoader></PageLoader>
  ) : (
    // <MatrixPageLayout initData={data} account={account} showShare={true}>
    //   <MatrixFinancePage />
    // </MatrixPageLayout>
    <MatrixFinancePage initData={data} account={account} callback={handleInit} />
  )
}

export default CurrentMatrixFinancePage
