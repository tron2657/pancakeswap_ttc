import { useState, useEffect } from 'react'
import MatrixMinePage from '../../views/matrix/mine'
import MatrixPageLayout from '../../views/matrix/layout'
import PageLoader from 'components/Loader/PageLoader'
import { useWeb3React } from '@web3-react/core'
import { TTC_API } from 'config/constants/endpoints'
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
const CurrentMatrixMinePage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const { account } = useWeb3React()
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
  return loading ? (
    <PageLoader></PageLoader>
  ) : (
    <MatrixPageLayout initData={data} account={account} showShare={true}>
      <MatrixMinePage />
    </MatrixPageLayout>
  )
}

export default CurrentMatrixMinePage
