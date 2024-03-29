import { ContextApi } from 'contexts/Localization/types'
import { format, parseISO, isValid } from 'date-fns'
import useTokenBalance from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { MINIMUM_CHOICES } from './Choices'
import { FormState } from './types'

export const combineDateAndTime = (date: Date, time: Date) => {
  if (!isValid(date) || !isValid(time)) {
    return null
  }

  const dateStr = format(date, 'yyyy-MM-dd')
  const timeStr = format(time, 'HH:mm:ss')

  return parseISO(`${dateStr}T${timeStr}`).getTime() / 1e3
}

export const getFormErrors = (formData: FormState, t: ContextApi['t']) => {
  const { name,
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
    balance,
    coin1_coin2_price, snapshot } = formData

  const errors: { [key: string]: string[] } = {}
  const { balance: lpBalance } = useTokenBalance(coin_contract)

  if (!outPut) {
    errors.outPut = [t('%field% is required', { field: '质押总产出' })]
  }

  if (outPut > getBalanceNumber(lpBalance)) {
    console.log('outPut===lpBalance', coin_contract, outPut, getBalanceNumber(lpBalance))
    errors.outPut = [t('质押总产出不能大于您的产出代币余额', { field: '质押总产出' })]
  }

  if (!body) {
    errors.body = [t('%field% is required', { field: 'Body' })]
  }

  if (choices.length < MINIMUM_CHOICES) {
    errors.choices = [t('Please create a minimum of %num% choices', { num: MINIMUM_CHOICES })]
  }

  const hasEmptyChoice = choices.some((choice) => !choice.value)
  if (choices.length === MINIMUM_CHOICES && hasEmptyChoice) {
    errors.choices = Array.isArray(errors.choices)
      ? [...errors.choices, t('Choices must not be empty')]
      : (errors.choices = [t('Choices must not be empty')])
  }

  if (!isValid(startDate)) {
    errors.startDate = [t('Please select a valid date')]
  }

  if (!isValid(startTime)) {
    errors.startTime = [t('Please select a valid time')]
  }

  if (!isValid(endDate)) {
    errors.endDate = [t('Please select a valid date')]
  }

  if (!isValid(endTime)) {
    errors.endTime = [t('Please select a valid time')]
  }

  const startDateTimestamp = combineDateAndTime(startDate, startTime)
  const endDateTimestamp = combineDateAndTime(endDate, endTime)

  if (endDateTimestamp < startDateTimestamp) {
    errors.endDate = Array.isArray(errors.endDate)
      ? [...errors.endDate, t('End date must be after the start date')]
      : (errors.endDate = [t('End date must be after the start date')])
  }

  if (snapshot === 0) {
    errors.snapshot = [t('Invalid snapshot')]
  }

  return errors
}
