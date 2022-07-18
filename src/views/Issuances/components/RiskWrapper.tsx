import { Text, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

interface InfoWrapperProps {
  riskTex: string
  state: number
}
const RiskWrapper = ({ riskTex, state }: InfoWrapperProps) => {
  const { t } = useTranslation()
  //   const handleState = async (state) => {
  //     if (state == 1) {
  //       return <img width="18px" src="/images/error.png" alt="" />
  //     }
  //     if (state == 2) {
  //       return <img src="/images/warn.png" alt="" />
  //     }
  //     if (state == 0) {
  //       return <img src="/images/success.png" alt="" />
  //     }
  //   }
  return (
    <Flex justifyContent="flex-start" alignItems="center" mt="15px">
      {state == 1 && <img width="14px" src="/images/error.png" alt="" />}
      {state == 2 && <img width="14px" src="/images/warn.png" alt="" />}
      {state == 0 && <img width="14px" src="/images/success.png" alt="" />}

      <Text color="#111A34">{riskTex}</Text>
    </Flex>
  )
}

export default RiskWrapper
