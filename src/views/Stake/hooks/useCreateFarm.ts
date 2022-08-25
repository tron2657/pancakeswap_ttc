// import { useCallback } from 'react'
// import { stakeFarm } from 'utils/calls'
// import { useMasterchef } from 'hooks/useContract'
// // import { ToastDescriptionWithTx } from 'components/Toast'
// // import { Contract } from '@ethersproject/contracts'
// // import { MaxUint256 } from '@ethersproject/constants'
// // import { useAppDispatch } from 'state'
// // import { useERC20 } from 'hooks/useContract'
// // import { updateUserAllowance } from 'state/actions'
// // import { useWeb3React } from '@web3-react/core'
// // import { useTranslation } from 'contexts/Localization'
// // import { useCake, useSousChef, useVaultPoolContract } from 'hooks/useContract'
// // import useToast from 'hooks/useToast'
// // import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
// // import useCatchTxError from 'hooks/useCatchTxError'
// // import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'
// const useStakeFarms = (pid: number) => {
//   const masterChefContract = useMasterchef()

//   const handleStake = useCallback(
//     async (amount: string) => {
//       return stakeFarm(masterChefContract, pid, amount)
//     },
//     [masterChefContract, pid],
//   )

//   return { onStake: handleStake }
// }


// export default useStakeFarms


// // export const useHandleStake = (contractAddress: string, toAddress: string, amount: number) => {
// //   const { toastSuccess } = useToast()
// //   const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
// //   const { callWithGasPrice } = useCallWithGasPrice()
// //   const { t } = useTranslation()
// //   const dispatch = useAppDispatch()
// //   const transferContract = contractAddress
// //   const { account } = useWeb3React()
// //   const StakeContractApprover = useERC20(transferContract)

// //   const handleStake = useCallback(async () => {
// //     const receipt = await fetchWithCatchTxError(() => {
// //       return callWithGasPrice(StakeContractApprover, 'transfer', [toAddress, MaxUint256])
// //     })
// //     if (receipt?.status) {
// //       toastSuccess(
// //         t('Contract Enabled'),
// //         //   <ToastDescriptionWithTx txHash={ receipt.transactionHash } >
// //         //   {/* {t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol })} */ }
// //         // < /ToastDescriptionWithTx>,
// //       )
// //       // setLastUpdated()
// //       // dispatch(updateUserAllowance({ sousId, account }))
// //     }
// //   }, [account, dispatch, transferContract, t, toastSuccess, callWithGasPrice, fetchWithCatchTxError])

// //   return { handleStake, pendingTx }
// // }


import { useCallback, useState, useEffect } from 'react'
import { stakeFarm } from 'utils/calls'
import BigNumber from 'bignumber.js'
import { useMasterchef } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Contract } from '@ethersproject/contracts'
import { MaxUint256 } from '@ethersproject/constants'
import { useAppDispatch } from 'state'
import { useERC20 } from 'hooks/useContract'
import { updateUserAllowance } from 'state/actions'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useCake, useSousChef, useVaultPoolContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { PLEDGE_API } from 'config/constants/endpoints'
import { init } from '@sentry/nextjs'



const useCreateFarms = (contractAddress: string, toAddress: string) => {
    const masterChefContract = useMasterchef()
    const { account } = useWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()
    // const [post, setPost] = useState({})
    // useEffect(() => {
    //     async function initData() {
    //         const _post = await handlePreCreate(account)
    //         setPost(_post)
    //     }
    //     initData()
    // }, [post]);
    const transferContract = contractAddress
    const CreateContractApprover = useERC20(transferContract)
    const handleCreate = useCallback(
        async (amount: string) => {
            const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
            // return stakeFarm(masterChefContract, pid, amount)
            return callWithGasPrice(CreateContractApprover, 'transfer', [toAddress, value])
        },
        [contractAddress, toAddress],
    )

    return { onCreate: handleCreate }
}

export default useCreateFarms
