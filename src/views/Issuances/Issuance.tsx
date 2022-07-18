import { useState, useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import CommonInput from './components/CommonInput'
import { Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Link from 'next/link'
import Container from 'components/Layout/Container'
import Page from '../Page'
import { AppHeader, AppBody } from '../../components/App'
import { CardBody, CardFooter, Button } from '@pancakeswap/uikit'
const StyledInput = styled(Input)`
  z-index: 9999;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`
const Body = styled(CardBody)``
const Issuance = () => {
  const [searchText, setSearchText] = useState('')
  const { t } = useTranslation()
  return (
    <Page>
      <AppBody>
        <AppHeader title={'发行标准合约代币'} subtitle="" noConfig />
        <Body>
          <CommonInput
            value={searchText}
            label="英文全称"
            placeholder="请输入"
            onUserInput={(val) => {
              setSearchText(val)
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={searchText}
            label="英文简称"
            placeholder="请输入"
            onUserInput={(val) => {
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={searchText}
            label="发行量"
            placeholder="请输入"
            onUserInput={(val) => {
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={searchText}
            label="精度"
            placeholder="请输入"
            onUserInput={(val) => {
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={searchText}
            label="接收地址"
            placeholder="请输入"
            onUserInput={(val) => {
              console.log(val)
            }}
          ></CommonInput>
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Link href="/issuance/contact" passHref>
            <Button id="join-pool-button" width="100%">
              确定发行
            </Button>
          </Link>
        </CardFooter>
      </AppBody>
    </Page>
  )
}

export default Issuance
