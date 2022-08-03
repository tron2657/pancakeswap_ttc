import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { MaxUint256 } from '@ethersproject/constants'
import { useAppDispatch } from 'state'
import { useERC20 } from 'hooks/useContract'
import { updateUserAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import { useCake, useSousChef, useVaultPoolContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'
import { TTC_API } from 'config/constants/endpoints'

export const useApproveUsdt = (toAddress: string, setLastUpdated: () => void) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const usdtContract = '0x55d398326f99059fF775485246999027B3197955'
  const { account } = useWeb3React()
  const usdtContractApprover = useERC20(usdtContract)

  const handleUsdtApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(usdtContractApprover, 'approve', [toAddress, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {/* {t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol })} */}
        </ToastDescriptionWithTx>,
      )
      setLastUpdated()
      // dispatch(updateUserAllowance({ sousId, account }))
    }
  }, [account, dispatch, usdtContract, t, toastSuccess, callWithGasPrice, fetchWithCatchTxError])

  return { handleUsdtApprove, pendingTx }
}
export const useApproveTTC = (toAddress: string, setLastUpdated: () => void) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const TTCContract = '0x152ad7Dc399269FA65D19BD7A790Ea8aa5b23DaD'
  const { account } = useWeb3React()
  const TTCContractApprover = useERC20(TTCContract)

  const handleTTCApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(TTCContractApprover, 'approve', [toAddress, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {/* {t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol })} */}
        </ToastDescriptionWithTx>,
      )
      setLastUpdated()
      // dispatch(updateUserAllowance({ sousId, account }))
    }
  }, [account, dispatch, TTCContract, t, toastSuccess, callWithGasPrice, fetchWithCatchTxError])

  return { handleTTCApprove, pendingTx }
}
// Approve CAKE auto pool
export const useVaultApprove = (setLastUpdated: () => void) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: cakeContract } = useCake()

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(cakeContract, 'approve', [vaultPoolContract.address, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now stake in the %symbol% vault!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )
      setLastUpdated()
    }
  }

  return { handleApprove, pendingTx }
}

export const useCheckUsdtApprovalStatus = (toAddress) => {
  const usdtContract = '0x55d398326f99059fF775485246999027B3197955'
  const { account } = useWeb3React()
  const usdtContractApprover = useERC20(usdtContract)

  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: usdtContractApprover,
            methodName: 'allowance',
            params: [account, toAddress],
          }
        : null,
    [account, usdtContractApprover, toAddress],
  )

  const { data, mutate } = useSWRContract(key)

  return { isUsdtApproved: data ? data.gt(0) : false, setUsdtLastUpdated: mutate }
}
export const useCheckTTCApprovalStatus = (toAddress) => {
  const TTCContract = '0x152ad7Dc399269FA65D19BD7A790Ea8aa5b23DaD'
  const usdtContractApprover = useERC20(TTCContract)

  const { account } = useWeb3React()
  // const { reader: cakeContract } = useCake()
  // const vaultPoolContract = useVaultPoolContract()

  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: usdtContractApprover,
            methodName: 'allowance',
            params: [account, toAddress],
          }
        : null,
    [account, usdtContractApprover, toAddress],
  )

  const { data, mutate } = useSWRContract(key)

  return { isTTCApproved: data ? data.gt(0) : false, setTTCLastUpdated: mutate }
}
