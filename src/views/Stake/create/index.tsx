import { ChangeEvent, FormEvent, useEffect, useState, useMemo } from 'react'
import {
  AutoRenewIcon,
  Box,
  Breadcrumbs,
  Button,
  Card,
  ButtonMenu,
  ButtonMenuItem,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  LinkExternal,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import PageLoader from 'components/Loader/PageLoader'
import { ToastDescriptionWithTx } from 'components/Toast'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import times from 'lodash/times'
import isEmpty from 'lodash/isEmpty'
import { useInitialBlock } from 'state/block/hooks'
import { SnapshotCommand } from 'state/types'
import useToast from 'hooks/useToast'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { signMessage } from 'utils/web3React'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import { DatePicker, TimePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ReactMarkdown from 'components/ReactMarkdown'
import { PageMeta } from 'components/Layout/Page'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { sendSnapshotData, Message, generateMetaData, generatePayloadData } from 'views/Voting//helpers'
import Layout from '../components/Layout'
import { FormErrors, Label, SecondaryLabel } from './styles'
import Choices, { Choice, makeChoice, MINIMUM_CHOICES } from './Choices'
import { combineDateAndTime, getFormErrors } from './helpers'
import { FormState } from './types'
import { ADMINS, VOTE_THRESHOLD } from 'views/Voting/config'
import VoteDetailsModal from 'views/Voting/components/VoteDetailsModal'
import { AppBody, AppHeader } from 'components/App'
import Select, { OptionProps } from 'components/Select/Select'
import { PLEDGE_API } from 'config/constants/endpoints'
// import SelectCoinModal from './selectCoinModal'
import { getBalanceNumber } from 'utils/formatBalance'
import useTokenBalance from 'hooks/useTokenBalance'
import useSyncCallback from '../hooks/useSyncCallback'
import tokens from 'config/constants/tokens'
import { useApproveTTC, useCheckTTCApprovalStatus, useTTCNumber } from '../hooks/useApprove'
import { Field } from 'state/swap/actions'
import useCatchTxError from 'hooks/useCatchTxError'
import ActionButton from './ActionButton'

const getCoinListApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/pledge/coin_list`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const handlePreCreateApi = async (account) => {
  const res = await fetch(`${PLEDGE_API}/pledge/pledge?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}

const handleCreateApi = async (params) => {
  const res = await fetch(
    `${PLEDGE_API}/pledge/pledge_add?address=${params.address}&coin1_coin2_price=${params.coin1_coin2_price}&coin_contract=${params.coin_contract}&coin_contract2=${params.coin_contract2}&coin_hash=${params.coin_hash}&coin_name=${params.coin_name}&coin_name2=${params.coin_name2}&coin_num=${params.coin_num}?day=${params.day}&end_time=${params.end_time}&start_time=${params.start_time}&lp_type=${params.lp_type}&text=${params.text}&ttc_num=${params.ttc_num}&type=${params.type}`,
    {
      method: 'post',
      // body: JSON.stringify(params),
    },
  )
  if (res.ok) {
    const json = await res.json()

    return json
  }
  console.error('Failed to fetch', res.statusText)
  return null
}

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`
const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;

  & > button {
    width: 100%;
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`
const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const RenderSelect = ({ contract }) => {
  console.log('contract===', contract)
  const { balance: lpBalance } = useTokenBalance(contract)
  return <SecondaryLabel>余额：{getBalanceNumber(lpBalance)}</SecondaryLabel>
}

const RenderLabelToken = ({ coinList, coin_name2, coin_name }) => {
  const { t } = useTranslation()
  return <SecondaryLabel>{t(`每质押100枚${coinList[0].value.field} ${coin_name2}产出${coin_name}数量`)}</SecondaryLabel>
}
// const ActionButton = () => {
//   return (

//   )
// }

const CreateProposal = ({ initData, createPost }) => {
  const [state, setState] = useState<FormState>(() => ({
    name: '',
    body: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
    outPut: 0,
    duration: 1,
    coin_name: '',
    coin_contract: '',
    coin_name2: '',
    coin_contract2: '',
    coin1_coin2_price: '',
    id: '',
    coin_num: 0,
    balance: 0,
  }))
  // const [onPresentMobileModal, closePresentMobileModal] = useModal(
  //   <InviteModal coinList={code} customOnDismiss={callback} />,
  // )
  const { balance: ttcBalance } = useTokenBalance(tokens.ttc.address)
  const { isTTCApproved, setTTCLastUpdated } = useCheckTTCApprovalStatus(tokens.ttc.address, initData['from_address3'])
  const { handleTTCApprove: handleTTCApprove, pendingTx: pendingTTCTx } = useApproveTTC(
    tokens.ttc.address,
    initData['from_address3'],
    setTTCLastUpdated,
  )
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { push } = useRouter()
  const { library, connector } = useWeb3Provider()
  const { toastSuccess, toastError } = useToast()
  const [onPresentVoteDetailsModal] = useModal(<VoteDetailsModal block={state.snapshot} />)
  const {
    name,
    body,
    id,
    outPut,
    coin_contract,
    coin_name,
    coin_name2,
    choices,
    startDate,
    startTime,
    endDate,
    endTime,
    duration,
    coin_contract2,
    coin1_coin2_price,
    balance,
    snapshot,
  } = state
  const formErrors = getFormErrors(state, t)
  const durations = [
    // {
    //   val: 1,
    //   name: '1天',
    // },
    {
      val: 7,
      name: '7天',
    },
    {
      val: 30,
      name: '30天',
    },
    {
      val: 90,
      name: '90天',
    },
    {
      val: 365,
      name: '1年',
    },
  ]
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectDuration, setselectDuration] = useState(1)
  const sortByItems = [{ label: t('选择质押币种'), value: { field: '', direction: '' } }]
  const [coinList, setCoinList] = useState([])
  const [balanceContract, setBalanceContract] = useState('')
  const [yearProfit, setYearProfit] = useState(0)

  const accountEllipsis = (account: string) => {
    return account ? `${account.substring(0, 4)}......${account.substring(account.length - 4)}` : null
  }

  // const handlePreCreate = () => {

  // }
  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    console.log(
      'proposal===',
      body,
      combineDateAndTime(startDate, startTime),
      combineDateAndTime(endDate, endTime),
      duration,
    )
    return
    try {
      setIsLoading(true)
      const proposal = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.PROPOSAL,
        payload: {
          name,
          body,
          snapshot,
          start: combineDateAndTime(startDate, startTime),
          end: combineDateAndTime(endDate, endTime),
          choices: choices
            .filter((choice) => choice.value)
            .map((choice) => {
              return choice.value
            }),
          metadata: generateMetaData(),
          type: 'single-choice',
        },
      })
      console.log(
        'proposal===',
        body,
        combineDateAndTime(startDate, startTime),
        combineDateAndTime(endDate, endTime),
        duration,
      )
      const sig = await signMessage(connector, library, account, proposal)

      if (sig) {
        const msg: Message = { address: account, msg: proposal, sig }

        // Save proposal to snapshot
        const data = await sendSnapshotData(msg)

        // Redirect user to newly created proposal page
        push(`/voting/proposal/${data.ipfsHash}`)

        toastSuccess(t('Proposal created!'))
      } else {
        toastError(t('Error'), t('Unable to sign payload'))
      }
    } catch (error) {
      toastError(t('Error'), (error as Error)?.message)
      console.error(error)
      setIsLoading(false)
    }
  }

  const updateValue = (key: string, value: string | Choice[] | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
    if (inputName == 'coin1_coin2_price') {
      getYearProfit(value, duration)
    }
    // console.log('_year_profit==', outPut, duration)
    // let _year_profit = ((outPut / 100) * duration) / 365
    // setYearProfit(_year_profit * 100)
  }

  const getYearProfit = (put, day) => {
    console.log('_year_profit==', put, day)
    let _year_profit = ((1 + put / 100) / day) * 365
    setYearProfit(_year_profit * 100)
  }

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleChoiceChange = (newChoices: Choice[]) => {
    updateValue('choices', newChoices)
  }

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
  }

  const handleSelectChange = (newOption: OptionProps, coin_ame: string, coin_contract_addr: string) => {
    console.log('handleSelectChange==', newOption, name)
    updateValue(coin_ame, newOption.value.direction)
    updateValue(coin_contract_addr, newOption.value.field)

    if (coin_ame === 'coin_name') {
      setBalanceContract(newOption.value.field)
    }
  }
  const handleTabClick = (newIndex: number) => {
    setActiveIndex(newIndex)
    setselectDuration(durations[newIndex].val)
    updateValue('duration', durations[newIndex].val.toString())
    getYearProfit(coin1_coin2_price, durations[newIndex].val)
  }

  const handlePreCreate = async () => {
    const data = await handlePreCreateApi(account)
    if (data.status == 1) {
      updateValue('createPost', data.result)
      // setCreatePost(data.result)
      console.log('createPost===', data.result)
      // updateValue('putAddress', data.result.put_address)
    }
  }

  const options = useMemo(() => {
    return {
      hideIcons:
        account && ADMINS.includes(account.toLowerCase())
          ? []
          : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [account])

  useEffect(() => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    setTTCNum(ttc_num)
    console.log('ttc_num===', ttc_num)
    if (initialBlock > 0) {
      setState((prevState) => ({
        ...prevState,
        snapshot: initialBlock,
      }))
    }
    async function init() {
      if (account) {
        setLoading(true)
        const _data = await getCoinListApi(account)
        if (_data.status) {
          let _list = []
          _data.result.map((item) => {
            // const { balance: lpBalance } = useTokenBalance(item.contract_address)
            let _option = {
              label: `${item.coin_name} ( ${accountEllipsis(item.contract_address)})`,
              value: { field: item.contract_address, direction: item.coin_name, balance: 0 },
            }
            _list.push(_option)
          })
          setCoinList(_list)
          setBalanceContract(_list[0].value.field)
          updateValue('coin_contract', _list[0].value.field)
          setLoading(false)
        }
      }
    }
    init()
  }, [initialBlock, setState])

  return loading ? (
    <PageLoader></PageLoader>
  ) : (
    <Container py="40px">
      <AppBody>
        <AppHeader backTo="/stake/manage" title={t('创建糖浆池')} subtitle={t('创建糖浆池 发起质押活动')} noConfig />
        <Body>
          <form onSubmit={handleSubmit}>
            <Box mb="24px">
              <Flex justifyContent="space-between">
                <SecondaryLabel>{t('质押币种')}</SecondaryLabel>
                {/* <RenderSelect contract={balanceContract} /> */}
                {/* {balanceContract} */}
              </Flex>
              <Select
                options={coinList}
                zIndex={99}
                onOptionChange={(newOption: OptionProps) => {
                  handleSelectChange(newOption, 'coin_name2', 'coin_contract2')
                }}
              />
            </Box>
            <Box mb="24px">
              <Flex justifyContent="space-between">
                <SecondaryLabel>{t('产出币种')}</SecondaryLabel>
                <RenderSelect contract={balanceContract} />
                {/* {balanceContract} */}
              </Flex>

              <Select
                options={coinList}
                zIndex={89}
                onOptionChange={(newOption: OptionProps) => {
                  handleSelectChange(newOption, 'coin_name', 'coin_contract')
                }}
              />
            </Box>
            <Box mb="24px">
              <SecondaryLabel>{t('质押总产出')}</SecondaryLabel>
              <Input
                id="outPut"
                name="outPut"
                value={outPut}
                type="number"
                scale="lg"
                onChange={handleChange}
                required
              />

              {formErrors.outPut && fieldsState.outPut && <FormErrors errors={formErrors.outPut} />}
            </Box>
            <Box mb="24px">
              <SecondaryLabel>{t('Start Date')}</SecondaryLabel>
              <DatePicker
                name="startDate"
                onChange={handleDateChange('startDate')}
                selected={startDate}
                placeholderText="YYYY-MM-DD"
              />
              {formErrors.startDate && fieldsState.startDate && <FormErrors errors={formErrors.startDate} />}
            </Box>
            <Box mb="24px">
              <SecondaryLabel>{t('Start Time')}</SecondaryLabel>
              <TimePicker
                name="startTime"
                onChange={handleDateChange('startTime')}
                selected={startTime}
                placeholderText="00:00"
              />
              {formErrors.startTime && fieldsState.startTime && <FormErrors errors={formErrors.startTime} />}
            </Box>
            <Box mb="24px">
              <SecondaryLabel>{t('End Date')}</SecondaryLabel>
              <DatePicker
                name="endDate"
                onChange={handleDateChange('endDate')}
                selected={endDate}
                placeholderText="YYYY/MM/DD"
              />
              {formErrors.endDate && fieldsState.endDate && <FormErrors errors={formErrors.endDate} />}
            </Box>
            <Box mb="24px">
              <SecondaryLabel>{t('End Time')}</SecondaryLabel>
              <TimePicker
                name="endTime"
                onChange={handleDateChange('endTime')}
                selected={endTime}
                placeholderText="00:00"
              />
              {formErrors.endTime && fieldsState.endTime && <FormErrors errors={formErrors.endTime} />}
            </Box>
            <Box mb="24px">
              <SecondaryLabel>{t('质押时长')}</SecondaryLabel>
              <FullWidthButtonMenu
                // disabled={!compounding}
                activeIndex={activeIndex}
                onItemClick={handleTabClick}
                scale="sm"
              >
                {durations.map((item) => {
                  return <ButtonMenuItem>{item.name}</ButtonMenuItem>
                })}
                {/* <ButtonMenuItem>{t('1D')}</ButtonMenuItem>
          <ButtonMenuItem>{t('7D')}</ButtonMenuItem>
          <ButtonMenuItem>{t('30D')}</ButtonMenuItem>
          <ButtonMenuItem>{t('90D')}</ButtonMenuItem>
          <ButtonMenuItem>{t('一年')}</ButtonMenuItem> */}
              </FullWidthButtonMenu>
            </Box>
            <Box mb="24px">
              <Flex justifyContent="space-between">
                {/* <RenderLabelToken coinList={coinList} coin_name2={coin_name2} coin_name={coin_name}></RenderLabelToken> */}
                <SecondaryLabel>
                  {t(
                    `每质押100枚${coin_name2 ? coin_name2 : coinList[0].value.direction}产出${
                      coin_name ? coin_name : coinList[0].value.direction
                    }数量`,
                  )}
                </SecondaryLabel>
                <SecondaryLabel>
                  {t('年利化率：')}
                  {yearProfit.toFixed(4)}%
                </SecondaryLabel>
              </Flex>
              <Input
                id="coin1_coin2_price"
                name="coin1_coin2_price"
                type="number"
                value={coin1_coin2_price}
                scale="lg"
                onChange={handleChange}
              />
            </Box>
            <Box mb="24px">
              <SecondaryLabel>{t('备注')}</SecondaryLabel>

              <Input id="body" name="body" type="text-area" value={body} scale="lg" onChange={handleChange} />
            </Box>
            {account ? (
              <>
                {/* <Button
                  type="submit"
                  width="100%"
                  isLoading={isLoading}
                  endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                  // disabled={!isEmpty(formErrors)}
                  mb="16px"
                >
                  {t('创建')}
                   address: account,
        coin_num: outPut,
        coin_hash: receipt.transactionHash,
        coin_name: coin_name,
        coin_contract: coin_contract,
        coin_name2: coin_name2,
        coin_contract2: coin_contract2,
        ttc_num: ttc_num,
        type: coin_name2 == coin_name ? 1 : 2,
        lp_type: 2,
        coin1_coin2_price: yearProfit / 100,
        text: body,
        day: duration,
        id: '',
                </Button> */}
                <ActionButton
                  address={account}
                  coin_num={outPut}
                  coin_name={coin_name ? coin_name : coinList[0].value.direction}
                  coin_contract={coin_contract ? coin_contract : coinList[0].value.field}
                  text={body}
                  day={duration}
                  coin_name2={coin_name2 ? coin_name2 : coinList[0].value.direction}
                  coin_contract2={coin_contract2 ? coin_contract2 : coinList[0].value.field}
                  coin1_coin2_price={coin1_coin2_price}
                  start_time={combineDateAndTime(startDate, startTime)}
                  end_time={combineDateAndTime(endDate, endTime)}
                  disabled={!endDate || !outPut || !startDate || !coin1_coin2_price}
                  initData={initData}
                  createPost={createPost}
                ></ActionButton>
              </>
            ) : (
              <ConnectWalletButton width="100%" type="button" />
            )}
          </form>
          <Text color="#666" bold fontSize="12px" textTransform="uppercase">
            创建后合约将冻结对应产出量的代币
          </Text>
          <DatePickerPortal />
        </Body>
      </AppBody>
    </Container>
  )
}

export default CreateProposal
