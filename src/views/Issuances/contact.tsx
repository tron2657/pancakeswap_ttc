import { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Input, Text, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Page from '../Page'
import { AppHeader, AppBody } from '../../components/App'
import { CardBody, CardFooter, Button } from '@pancakeswap/uikit'
const Body = styled(CardBody)``
const IssuanceContact = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  return (
    <Page>
      <AppBody>
        <AppHeader title={'发行自定义合约代币'} backTo="/issuance" subtitle="" noConfig />
        <Body>
          <Text bold mb="24px" color="secondary">
            请通过以下方式联系我们
          </Text>
          <Flex m="10px auto">
            <Text bold color="textSubtle">
              邮箱：
            </Text>
            <Text color={theme.colors.text}>DaoChainTechnology@hotmail.com</Text>
          </Flex>
          <Flex>
            <Text bold color="textSubtle">
              电报：
            </Text>
            <Text color={theme.colors.text}>https://t.me/DaoChainTechnology</Text>
          </Flex>
        </Body>
      </AppBody>
    </Page>
  )
}

export default IssuanceContact
