import { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from 'state'
import { State } from '../types'
import { setPlegeListParams } from './reducer'


export const useFetchPledgeList = () => {

  const pledgeList = useSelector((state: State) => state.pledge.data.pledgeList)
  console.log('pledgeList====', pledgeList)
  return pledgeList
}

export const usePledgeListParams = () => {
  const params = useSelector((state: State) => state.pledge.data.params)
  console.log('pledgeList====params', params)
  return params
}

export const useFetchInitData = () => {

  const initData = useSelector((state: State) => state.pledge.data.initData)
  console.log('pledgeList====', initData)
  return initData
}
// export function usePledgeListParams(fromParams: object): [object, (newParams: object) => void] {
//   const dispatch = useAppDispatch()

//   const params = useSelector<AppState, AppState['pledge']['data']['params']>(
//     (state) => state.pledge.data.params,
//   )

//   const setParams = useCallback(
//     (newParams: object) => {

//       dispatch(setPlegeListParams(newParams))
//     },
//     [dispatch],
//   )

//   return [params, setParams]
// }
