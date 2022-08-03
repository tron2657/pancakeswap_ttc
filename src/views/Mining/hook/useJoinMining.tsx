import { useCallback, useMemo } from 'react'
import { logError } from 'utils/sentry'
import { calculateGasMargin } from '../../../utils'
import { useWeb3React } from '@web3-react/core'
import { getTtcMiningContract } from 'utils/contractHelpers'
import useCatchTxError from 'hooks/useCatchTxError'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { MaxUint256 } from '@ethersproject/constants'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'

//check approve
export const useCheckCustomIfAccessStatus = () => {
  const { library } = useActiveWeb3React()
  const { account } = useWeb3React()
  const tokenContract = getTtcMiningContract(library.getSigner())

  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: tokenContract,
            methodName: 'customIfAccess',
            params: [account],
          }
        : null,
    [account, tokenContract],
  )

  const { data, mutate } = useSWRContract(key)
  console.log('useSWRContract=====', mutate)

  return { customIfAccess: data ? data : false, setCustomIfAccessUpdated: mutate }
}

// Approve Mining Contract
export const useMiningApprove = (setLastUpdated: () => void) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { library } = useActiveWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const TTCContract = '0x152ad7Dc399269FA65D19BD7A790Ea8aa5b23DaD'
  const TTCContractApprover = useERC20(TTCContract)
  const tokenContract = getTtcMiningContract(library.getSigner())
  console.log(tokenContract.address)
  const { callWithGasPrice } = useCallWithGasPrice()
  // const { signer: cakeContract } = useCake()
  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(TTCContractApprover, 'approve', [tokenContract.address, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now stake in the Mining!', { symbol: 'TTC' })}
        </ToastDescriptionWithTx>,
      )
      setLastUpdated()
    }
  }

  return { handleApprove, pendingTx }
}

export const useCheckTTCApprovalStatus = () => {
  const TTCContract = '0x152ad7Dc399269FA65D19BD7A790Ea8aa5b23DaD'
  const usdtContractApprover = useERC20(TTCContract)
  const { library } = useActiveWeb3React()
  const tokenContract = getTtcMiningContract(library.getSigner())
  const { account } = useWeb3React()
  // const { reader: cakeContract } = useCake()
  // const vaultPoolContract = useVaultPoolContract()

  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: usdtContractApprover,
            methodName: 'allowance',
            params: [account, tokenContract.address],
          }
        : null,
    [account, usdtContractApprover, tokenContract.address],
  )

  const { data, mutate } = useSWRContract(key)

  return { isTTCApproved: data ? data.gt(0) : false, setTTCLastUpdated: mutate }
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export const useJoinMiningCallback = (setLastUpdated: () => void) => {
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { library } = useActiveWeb3React()
  const { toastError } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const tokenContract = getTtcMiningContract(library.getSigner())

  const handleMining = useCallback(async () => {
    const estimatedGas = await tokenContract.estimateGas.updateAddressToAmount().catch((error) => {
      // general fallback for tokens who restrict approval amounts
      console.log(error)
      toastError(error.data.message)
      return tokenContract.estimateGas.updateAddressToAmount()
    })
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(tokenContract, 'updateAddressToAmount', [], {
        gasLimit: calculateGasMargin(estimatedGas),
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Mining Successed!', { symbol: 'TTC' })}
        </ToastDescriptionWithTx>,
      )
    }
  }, [t, toastSuccess, callWithGasPrice, fetchWithCatchTxError])
  setLastUpdated()
  return { handleMining, pendingTx }
  // const approve = useCallback(async (): Promise<void> => {
  //   const estimatedGas = await tokenContract.estimateGas.updateAddressToAmount().catch((error) => {
  //     // general fallback for tokens who restrict approval amounts
  //     console.log(error)
  //     toastError(error.data.message)
  //     return tokenContract.estimateGas.updateAddressToAmount()
  //   })

  //   // eslint-disable-next-line consistent-return
  //   return callWithGasPrice(tokenContract, 'updateAddressToAmount', [], {
  //     gasLimit: calculateGasMargin(estimatedGas),
  //   })
  //     .then((response) => {

  //     })
  //     .catch((error: any) => {
  //       logError(error)
  //       console.error('Failed to approve token', error)
  //       if (error?.code !== 4001) {
  //         toastError(t('Error'), error.message)
  //       }
  //       throw error
  //     })
  // }, [t, toastError])

  // return [approve]
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
