import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import { useProfile } from 'state/profile/hooks'
import PageLoader from 'components/Loader/PageLoader'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useRouter } from 'next/router'
import Header from './Header'
import ProfileCreationProvider from './contexts/ProfileCreationProvider'
import { DIVI_API } from 'config/constants/endpoints'

import Steps from './Steps'

const isAddressApi = async (account: string) => {
  const res = await fetch(`${DIVI_API}/user/is_address?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const ProfileCreation = () => {
  const { account } = useWeb3React()
  const { isInitialized, isLoading, hasProfile } = useProfile()
  const router = useRouter()
  const [isNode, setIsNode] = useState(false)
  useEffect(() => {
    if (account && hasProfile) {
      router.push(`${nftsBaseUrl}/profile/${account.toLowerCase()}`)
    }
    async function init() {
      if (account) {
        const _data = await isAddressApi(account)
        if (_data.status) {
          setIsNode(_data.result)
        }
      }
    }
    init()
  }, [account, hasProfile, router])

  if (!isInitialized || isLoading) {
    return <PageLoader />
  }

  return (
    <>
      <ProfileCreationProvider>
        <Page>
          <Header isNode={isNode} />
          {/* <Steps /> */}
        </Page>
      </ProfileCreationProvider>
    </>
  )
}

export default ProfileCreation
