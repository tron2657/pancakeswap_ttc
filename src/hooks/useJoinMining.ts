import { useCallback } from 'react'
import { logError } from 'utils/sentry'
import { calculateGasMargin } from '../utils'
import { useWeb3React } from '@web3-react/core'
import {getTtcMiningContract} from "utils/contractHelpers"

import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { useCallWithGasPrice } from './useCallWithGasPrice'
import useToast from './useToast'
import { useTranslation } from '../contexts/Localization'


export function useCustomIfAccessCallback()
{
  const { account } = useWeb3React()
 
  const {  library } = useActiveWeb3React()
  const { toastError } = useToast()
 
  const tokenContract = getTtcMiningContract(library.getSigner() )
  return [  tokenContract.customIfAccess(account)]

  
}
 
// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useJoinMiningCallback(
): [() => Promise<void>] {
 
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const {  library } = useActiveWeb3React()
  const { toastError } = useToast()
 
  const tokenContract = getTtcMiningContract(library.getSigner() )
 

  const approve = useCallback(async (): Promise<void> => {
    
    const estimatedGas = await tokenContract.estimateGas.updateAddressToAmount().catch((error) => {
      // general fallback for tokens who restrict approval amounts
 
      toastError(error.data.message)
      return tokenContract.estimateGas.updateAddressToAmount()
    })

    // eslint-disable-next-line consistent-return
    return callWithGasPrice(
      tokenContract,
      'updateAddressToAmount',
      [],
      {
        gasLimit: calculateGasMargin(estimatedGas),
      },
    )
      .then((response) => {
         
      })
      .catch((error: any) => {
 
        logError(error)
        console.error('Failed to approve token', error)
        if (error?.code !== 4001) {
          toastError(t('Error'), error.message)
        }
        throw error
      })
  }, [ t, toastError])

  return [ approve]
}
 





// import { useCallback } from 'react';

// // import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import {getTtcMiningContract} from "utils/contractHelpers"
// import useToast from './useToast'


// export function useJoinMiningCallback():[()=>Promise<void>]{

//     const { toastError } = useToast()
//     // const {  library } = useActiveWeb3React()
 
      
//     const contract=getTtcMiningContract(library.getSigner());

//     const joinGame=useCallback(async():Promise<void>=>{
//         // contract.updateAddressToAmount().then(()=>{


//         // }).catch((error)=>{
//         //   toastError('xxxxx', 'dsfadfa')
//         // });
        
//     })
//     return joinGame;



// }

