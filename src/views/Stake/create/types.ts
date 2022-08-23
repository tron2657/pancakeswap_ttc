import { Choice } from './Choices'

export interface FormState {
  name: string
  body: string
  choices: Choice[]
  startDate: Date
  startTime: Date
  endDate: Date
  endTime: Date
  snapshot: number
  outPut: number
  duration: number
  coin_name: string,
  coin_contract: string,
  coin_name2: string,
  coin_contract2: string,
  coin1_coin2_price: string,
  id: any,
  coin_num: number
}
