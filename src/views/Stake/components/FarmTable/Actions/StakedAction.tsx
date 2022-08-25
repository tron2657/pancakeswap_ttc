import { Button, Text, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'state'
import styled from 'styled-components'
// import useHandleStake from '../../../hooks/useStakeFarms'
import DepositModal from '../../DepositModal'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { useCheckTTCApprovalStatus, useApproveTTC } from 'views/Farms/hooks/useApprove'
import tokens from 'config/constants/tokens'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useTokenBalance from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { PLEDGE_API } from 'config/constants/endpoints'
import { useFetchPledgeList } from 'state/pledge/hooks'
const handleParticipateApi = async (
  account: string,
  ttc_num: string,
  day: any,
  coin_hash: any,
  coin_num: any,
  id: any,
) => {
  const res = await fetch(
    `${PLEDGE_API}/pledge/pledge_buy?address=${account}&ttc_num=${ttc_num}&day=${day}&coin_hash=${coin_hash}&coin_num=${coin_num}&id=${id}`,
    {
      method: 'post',
    },
  )
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps {
  farm: any
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ farm }) => {
  console.log('props===', farm)
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { account } = useWeb3React()
  const { onStake } = useStakeFarms(farm['coin_contract2'], farm['from_address3'])
  const router = useRouter()
  // const initData = useFetchInitData()
  // console.log('initData===', initData)
  const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)

  const { isTTCApproved, setTTCLastUpdated } = useCheckTTCApprovalStatus(tokens.ttc.address, farm['from_address3'])
  const { handleTTCApprove: handleTTCApprove, pendingTx: pendingTTCTx } = useApproveTTC(
    tokens.ttc.address,
    farm['from_address3'],
    setTTCLastUpdated,
  )
  // const { handleStake: handleUseStake, pendingTx: pendingStakeTx } = useHandleStake(
  //   farm.ttc_contract,
  //   farm.from_address2,

  //   setTTCLastUpdated,
  // )

  const statePledgeListParams = useFetchPledgeList()
  const handleStake = async (amount: string, ttcNum: string, duration: any, id: any) => {
    console.log('amount==', amount, 'ttcNum===', ttcNum, 'duration===', duration, 'id===', id)
    if (getBalanceNumber(ttcBalance) < Number(ttcNum)) {
      toastError('TTC余额不足')
      return
    }
    const receipt = await fetchWithCatchTxError(() => {
      return onStake(amount)
    })
    if (receipt?.status) {
      postStake(amount, ttcNum, duration, id, receipt.transactionHash)
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )

      // dispatch(fetchPledgeListAsync({ account: account, params: statePledgeListParams }))
      // dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }

  const postStake = async (amount: string, ttcNum: string, duration: any, id: any, transactionHash: any) => {
    const data = await handleParticipateApi(account, ttcNum, duration, transactionHash, amount, id)
    if (data.status) {
      toastSuccess(t(data.msg))
      // setSecondsRemaining(120)
      // openCountDown()
    } else {
      toastError(t(data.msg))
    }
  }

  const [onPresentDeposit] = useModal(<DepositModal onConfirm={handleStake} detail={farm} />)

  const dispatch = useAppDispatch()

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isTTCApproved) {
    // if (stakedBalance.gt(0)) {
    //   return (
    //     <ActionContainer>
    //       <ActionTitles>
    //         <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
    //           {lpSymbol}
    //         </Text>
    //         <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
    //           {t('Staked')}
    //         </Text>
    //       </ActionTitles>
    //       <ActionContent>
    //         <StakedLP
    //           stakedBalance={stakedBalance}
    //           lpSymbol={lpSymbol}
    //           quoteTokenSymbol={quoteToken.symbol}
    //           tokenSymbol={token.symbol}
    //           lpTotalSupply={lpTotalSupply}
    //           tokenAmountTotal={tokenAmountTotal}
    //           quoteTokenAmountTotal={quoteTokenAmountTotal}
    //         />
    //         <IconButtonWrapper>
    //           <IconButton variant="secondary" onClick={onPresentWithdraw} mr="6px">
    //             <MinusIcon color="primary" width="14px" />
    //           </IconButton>
    //           <IconButton
    //             variant="secondary"
    //             onClick={onPresentDeposit}
    //             disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
    //           >
    //             <AddIcon color="primary" width="14px" />
    //           </IconButton>
    //         </IconButtonWrapper>
    //       </ActionContent>
    //     </ActionContainer>
    //   )
    // }

    return (
      <ActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
            {t('Stake')}
          </Text>
          {/* <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
            {lpSymbol}
          </Text> */}
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentDeposit}
            variant="secondary"
            disabled={farm['status'] != 2}
            // disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
          >
            {t('Stake')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  // if (!userDataReady) {
  //   return (
  //     <ActionContainer>
  //       <ActionTitles>
  //         <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
  //           {t('Start Farming')}
  //         </Text>
  //       </ActionTitles>
  //       <ActionContent>
  //         <Skeleton width={180} marginBottom={28} marginTop={14} />
  //       </ActionContent>
  //     </ActionContainer>
  //   )
  // }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Enable Farm')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={pendingTTCTx} onClick={handleTTCApprove} variant="secondary">
          {t('Enable')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
