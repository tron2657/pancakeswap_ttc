import { useContext, useEffect } from 'react'
import { FarmsPageLayout, FarmsContext } from 'views/Farms'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import { getDisplayApr } from 'views/Farms/Farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useWeb3React } from '@web3-react/core'
import { useFetchPledgeList } from 'state/pledge/hooks'
import { fetchPledgeListAsync } from 'state/pledge/reducer'
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

  return (
    <>
      {chosenFarmsMemoized.map((farm) =>
        farm.lpSymbol != 'TTC-ETI LP' ? null : (
          <FarmCard
            key={farm.pid}
            farm={farm}
            displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
            cakePrice={cakePrice}
            account={account}
            removed={false}
          />
        ),
      )}
    </>
  )
}

FarmsPage.Layout = FarmsPageLayout

export default FarmsPage
