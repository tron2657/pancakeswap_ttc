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
  const [zhName, setZhName] = useState('')
  const [enName, setEnName] = useState('')
  const [publishNum, setPublishNum] = useState(null)
  const [decimal, setDecimal] = useState(null)
  const [receiptAddr, setReceiptAddr] = useState('')

  const { t } = useTranslation()
  return (
    <Page>
      <AppBody>
        <AppHeader title={'发行标准合约代币'} subtitle="" noConfig />
        <Body>
          <CommonInput
            value={zhName}
            label="英文全称"
            placeholder="请输入"
            onUserInput={(val) => {
              setZhName(val)
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={enName}
            label="英文简称"
            placeholder="请输入"
            onUserInput={(val) => {
              setEnName(val)
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={publishNum}
            label="发行量"
            placeholder="请输入"
            onUserInput={(val) => {
              setPublishNum(val)
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={decimal}
            label="精度"
            placeholder="请输入"
            onUserInput={(val) => {
              setDecimal(val)
              console.log(val)
            }}
          ></CommonInput>
          <CommonInput
            value={receiptAddr}
            label="接收地址"
            placeholder="请输入"
            onUserInput={(val) => {
              setReceiptAddr(val)
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
