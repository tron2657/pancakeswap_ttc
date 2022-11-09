

import { useCallback } from 'react'
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

const useTransferMx = (contractAddress: string, toAddress: string) => {
  const masterChefContract = useMasterchef()
  const { callWithGasPrice } = useCallWithGasPrice()
  const transferContract = contractAddress
  const StakeContractApprover = useERC20(transferContract)
  const handleTransfer = useCallback(
    async (amount: string) => {
      const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
      console.log('value==', value)
      // return stakeFarm(masterChefContract, pid, amount)
      return callWithGasPrice(StakeContractApprover, 'transfer', [toAddress, value])
      // return callWithGasPrice(StakeContractApprover, 'burn', [value])
    },
    [contractAddress, toAddress],
  )

  return { onTransfer: handleTransfer }
}

export default useTransferMx
