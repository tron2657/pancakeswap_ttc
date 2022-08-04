import { useCallback } from 'react'
import { calculateGasMargin } from '../../../utils'
import { getTokenFactory } from 'utils/contractHelpers'
import useCatchTxError from 'hooks/useCatchTxError'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
 

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export const useTokenCreate = (_owner,_name,_symbol,_totalSupply,_decimal) => {

  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { library } = useActiveWeb3React()
  const { toastError } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const tokenContract = getTokenFactory(library.getSigner())

  const handle = useCallback(async () => {

    const estimatedGas = await tokenContract.estimateGas.CreateToken(
        _owner,
        _name,
        _symbol,
        _totalSupply,
        _decimal
    ).catch((error) => {
 
 
      toastError(error.data.message)
      return tokenContract.estimateGas.CreateToken(
        _owner,
        _name,
        _symbol,
        _totalSupply,
        _decimal
      )
    })
    debugger;
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(tokenContract, 'CreateToken', [
        _owner,
        _name,
        _symbol,
        _totalSupply,
        _decimal

      ], {
        gasLimit: calculateGasMargin(estimatedGas),
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Create Token Successed!', { symbol: 'TTC' })}
        </ToastDescriptionWithTx>,
      )
    }
  }, [t, toastSuccess, callWithGasPrice, fetchWithCatchTxError])
 
  return { handle, pendingTx }
 
}

 