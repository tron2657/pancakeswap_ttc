import { useCallback, useMemo } from 'react'
import { logError } from 'utils/sentry'
import { calculateGasMargin } from '../../../utils'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
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
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import tokens from 'config/constants/tokens'
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

  return { customIfAccess: data ? data : false, setCustomIfAccessUpdated: mutate }
}

export const useObtainEarnedToken = () => {
  const { library } = useActiveWeb3React()
  const { account } = useWeb3React()
  const tokenContract = getTtcMiningContract(library.getSigner())

  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: tokenContract,
            methodName: 'obtainEarnedToken',
            params: [],
          }
        : null,
    [account, tokenContract],
  )

  const { data, mutate } = useSWRContract(key)

  if (data && data._hex) return { obtainEarnedToken: Number(data._hex), setObtainEarnedToken: mutate }
  return { obtainEarnedToken: 0, setObtainEarnedToken: mutate }
}

export const useDailyProduce = () => {
  const { library } = useActiveWeb3React()
  const { account } = useWeb3React()
  const tokenContract = getTtcMiningContract(library.getSigner())

  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: tokenContract,
            methodName: 'dailyProduce',
            params: [account],
          }
        : null,
    [account, tokenContract],
  )

  const { data, mutate } = useSWRContract(key)

  if (data && data._hex) return { dailyProduce: Number(data._hex), setDailyProduce: mutate }

  return { dailyProduce: Number(0), setDailyProduce: mutate }
}

export const useTotal = () => {
  const { library } = useActiveWeb3React()
  const { account } = useWeb3React()
  const tokenContract = getTtcMiningContract(library.getSigner())

  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: tokenContract,
            methodName: 'total',
            params: [],
          }
        : null,
    [account, tokenContract],
  )

  const { data, mutate } = useSWRContract(key)
  if (data && data._hex) return { total: Number(data._hex), setTotal: mutate }
  return { total: Number(0), setTotal: mutate }
}

export const useTotalSupply = () => {
  const { library } = useActiveWeb3React()
  const { account } = useWeb3React()
  const tokenContract = getTtcMiningContract(library.getSigner())

  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: tokenContract,
            methodName: 'totalSupply',
            params: [],
          }
        : null,
    [account, tokenContract],
  )

  const { data, mutate } = useSWRContract(key)
  if (data && data._hex) return { totalSupply: Number(data._hex), setTotalSupply: mutate }
  return { totalSupply: Number(0), setTotalSupply: mutate }
}

// Approve Mining Contract
export const useMiningApprove = (setLastUpdated: () => void) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { library } = useActiveWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const TTCContract = tokens.ttc.address
  const TTCContractApprover = useERC20(TTCContract)
  const tokenContract = getTtcMiningContract(library.getSigner())

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
  const TTCContract = tokens.ttc.address
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

export const useDrawMiningCallback = (setLastUpdated: () => void) => {
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { library } = useActiveWeb3React()
  const { toastError } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const tokenContract = getTtcMiningContract(library.getSigner())
  const { obtainEarnedToken } = useObtainEarnedToken()
  // if(obtainEarnedToken<=0)
  // {
  //   toastError("You haven't been rewarded yet");
  // }
  const handleMining = useCallback(async () => {
    const estimatedGas = await tokenContract.estimateGas.withdrawFromAddress(obtainEarnedToken).catch((error) => {
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
}
