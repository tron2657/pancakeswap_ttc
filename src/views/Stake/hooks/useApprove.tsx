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
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import tokens from 'config/constants/tokens'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { Field } from 'state/swap/actions'

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
  console.log('===setUsdtLastUpdated', data)
  return { isUsdtApproved: data ? data.gt(0) : false, setUsdtLastUpdated: mutate }
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
export const useTTCNumber = () => {
  const { library } = useActiveWeb3React()
  const { account } = useWeb3React()
  //初始化 BNB-TTC
  const initInputCurrencyId = 'BNB'
  const initOutputCurrencyId = tokens.ttc.address
  const { independentField, typedValue, recipient } = useSwapState()
  const inputCurrency = useCurrency(initInputCurrencyId)
  const outputCurrency = useCurrency(initOutputCurrencyId)
  const { v2Trade, parsedAmount } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency,
    outputCurrency,
    recipient,
  )
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const showWrap: boolean = false
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const trade = showWrap ? undefined : v2Trade
  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }
  // onCurrencySelection(Field.INPUT, inputCurrency)
  // onCurrencySelection(Field.OUTPUT, outputCurrency)
  // onUserInput(Field.INPUT, BNB_num)
  // const ttc_num = formattedAmounts[Field.OUTPUT]
  // const key = useMemo<string>(
  //   () =>
  //   ttc_num,
  //   [ttc_num],
  // )

  return {
    onCurrencySelection: onCurrencySelection,
    inputCurrency: inputCurrency,
    outputCurrency: outputCurrency,
    onUserInput: onUserInput,
    formattedAmounts: formattedAmounts,
  }
}
