import { Text, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

interface InfoWrapperProps {
  title: string
  value: string | number
  titleColor: string
  valueColor: string
}
const InfoWrapper = ({ title, value, titleColor, valueColor }: InfoWrapperProps) => {
  const { t } = useTranslation()
  return (
    <Flex justifyContent="space-between" mt="15px">
      <Text color={titleColor}>{title}</Text>
      <Text color={valueColor}>{value}</Text>
    </Flex>
  )
}

export default InfoWrapper
