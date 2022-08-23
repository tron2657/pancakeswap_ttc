


import { PLEDGE_API } from 'config/constants/endpoints'
import { FarmWithStakedValue } from 'views/Farms/components/types'


const getPledgeListApi = async (account: string) => {
    const res = await fetch(`${PLEDGE_API}/pledge/pledge_list?address=${account}`, {
        method: 'post',
    })
    if (res.ok) {
        const json = await res.json()
        return json
    }
    console.error('Failed to fetch NFT collections', res.statusText)
    return null
}

export const fetchPledgeList = async (account: string) => {
    const _data = await getPledgeListApi(account)
    // if (_data.status) {
    //     _data.result.map((item) => {
    //         // item = { ...item, ...chosenFarmsMemoized[0] }
    //         const _farm = chosenFarmsMemoized.find((f) => f.lpSymbol == 'TTC-ETI LP')
    //         Object.assign(item, _farm)
    //         Object.assign(item, initData)
    //     })

    // }
    return _data.result
}
