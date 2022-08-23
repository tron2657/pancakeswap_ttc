import { useContext } from 'react'
import { FarmsPageLayout, FarmsContext } from 'views/Stake'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useWeb3React } from '@web3-react/core'
import { useFetchPledgeList } from 'state/pledge/hooks'
import { useAppDispatch } from 'state'
const FarmsPage = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  console.log('chosenFarmsMemoized===', chosenFarmsMemoized)
  const cakePrice = usePriceCakeBusd()
  console.log(chosenFarmsMemoized)
  const fetchPledgeList = useFetchPledgeList()
  // useEffect(() => {
  //   dispatch(fetchPledgeListAsync(account)).then(() => {
  //     console.log('_pledgeList==222222', fetchPledgeList)
  //   })
  // }, [account])

  return <></>
}

FarmsPage.Layout = FarmsPageLayout

export default FarmsPage
