import { FC, useEffect, useState } from 'react'
import Farms, { FarmsContext } from './Farms'
import { useWeb3React } from '@web3-react/core'
import { PLEDGE_API } from 'config/constants/endpoints'
import { useFetchPledgeList } from 'state/pledge/hooks'
import { fetchPledgeListAsync, setInitData, setPlegeList } from 'state/pledge/reducer'
import { useAppDispatch } from 'state'
import PageLoader from 'components/Loader/PageLoader'
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

const getRegtApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/user/app_reg?address=${account}&ttc_num=0`, {
    method: 'post',
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

export const FarmsPageLayout: FC = ({ children }) => {
  const { account } = useWeb3React()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const dispatch = useAppDispatch()

  const fetchPledgeList = useFetchPledgeList()
  useEffect(() => {
    async function init() {
      if (account) {
        setLoading(true)
        await getRegtApi(account)
        const _data = await getInitDataApi(account)
        if (_data.status) {
          console.log('initData====', _data)
          setData(_data.result)
          dispatch(setInitData(_data.result))
          setLoading(false)
        }
      }
    }
    init()
  }, [account])
  return loading ? <PageLoader></PageLoader> : <Farms initData={data}>{children}</Farms>
}

export { FarmsContext }
