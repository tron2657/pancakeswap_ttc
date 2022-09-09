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
import {
  useNftStageContract,
  useNftStageMarketContract,
  useNftCardContract,
  useNftCardMarketContract,
  useTokenContract,
} from 'hooks/useContract'

export const useApproveTTC = (contractAddress: string, toAddress: string, setLastUpdated: () => void) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const TTCContract = contractAddress
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

export const useCheckTTCApprovalStatus = (contractAddress, toAddress) => {
  const TTCContract = contractAddress
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
  console.log('===setTTCLastUpdated', data)
  return { isTTCApproved: data ? data.gt(0) : false, setTTCLastUpdated: mutate }
}

export const useCheckNftApprovalForAllStatus = () => {
  const nftCardContract = useNftCardContract()
  const nftCardMarketContract = useNftCardMarketContract()
  const { account } = useWeb3React()
  // const { reader: cakeContract } = useCake()
  // const vaultPoolContract = useVaultPoolContract()
  const key = useMemo<UseSWRContractKey>(
    () =>
      account
        ? {
            contract: nftCardContract,
            methodName: 'isApprovedForAll',
            params: [account, nftCardMarketContract.address],
          }
        : null,
    [account, nftCardContract, nftCardMarketContract],
  )

  const { data, mutate } = useSWRContract(key)
  console.log('===setTTCLastUpdated', data)
  return { isApprovedForAll: data ? data : false, setNftApprovalAllLastUpdated: mutate }
}

export const useSetApproveAll = (setLastUpdated: () => void) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const nftCardContract = useNftCardContract()
  const nftCardMarketContract = useNftCardMarketContract()
  const { account } = useWeb3React()

  const handleSetApproveAll = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(nftCardContract, 'setApprovalForAll', [nftCardMarketContract.address, true])
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
  }, [account, dispatch, nftCardContract, t, toastSuccess, callWithGasPrice, fetchWithCatchTxError])

  return { handleSetApproveAll, pendingTx }
}
