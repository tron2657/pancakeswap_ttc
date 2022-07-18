import { useState, useEffect } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Input, Text, Flex, BnbUsdtPairTokenIcon, ButtonMenu, ButtonMenuItem, Progress } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from '../Page'
import useTheme from 'hooks/useTheme'
import { AppHeader, AppBody } from '../../components/App'
import { CardBody, CardFooter, Button } from '@pancakeswap/uikit'
const Body = styled(CardBody)``
import Container from 'components/Layout/Container'
import ClearInput from './components/ClearInput'
import ArcProgress from 'react-arc-progress'
import InfoWrapper from './components/InfoWrapper'
import RiskWrapper from './components/RiskWrapper'
const Detection = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [address, setAddress] = useState('')
  const [progress, setProgress] = useState(0.7)
  const [text, setText] = useState('70%')
  const customText = [
    { text: text, size: '28px', color: '#290E60', x: 120, y: 98 },
    { text: 'time remaining', size: '18px', color: '#BEC1C3', x: 120, y: 128 },
    { text: '高风险', size: '18px', color: '#EA4E54', x: 120, y: 188 },
    { text: '第492次查询', size: '16px', color: '#290E60', x: 120, y: 218 },
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const handleClick = () => {}

  const handleTabClick = (newIndex: number) => {
    setActiveIndex(newIndex)
  }
  useEffect(() => {
    const _text = progress * 100 + '%'
    setText(_text)
    return () => {}
  }, [text])

  const Tabs = styled.div`
    /* background-color: ${({ theme }) => theme.colors.dropdown}; */
    /* border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder}; */
    padding: 16px 24px;
  `

  const TabsComponent: React.FC = () => (
    <Tabs>
      <ButtonMenu scale="sm" onItemClick={handleTabClick} activeIndex={activeIndex} fullWidth>
        <ButtonMenuItem>持币人信息</ButtonMenuItem>
        <ButtonMenuItem>LP持币信息</ButtonMenuItem>
      </ButtonMenu>
    </Tabs>
  )
  const Wrapper = styled.div`
    width: 55%;
    display: flex;
    align-items: center;
  `
  const ProgressWrapper = styled.div`
    width: 80%;
  `

  return (
    <Page>
      <AppBody>
        <AppHeader title={'合约检测'} subtitle="" noConfig />
        <Body>
          <Flex alignItems="center" mb="15px">
            <BnbUsdtPairTokenIcon ml="8px" />
            BSC
          </Flex>
          <ClearInput
            value={address}
            placeholder="请输入合约地址"
            onUserInput={(val) => {
              setAddress(val)
            }}
          ></ClearInput>
          <Flex alignItems="flex-start" mt="15px">
            <BnbUsdtPairTokenIcon ml="8px" />
            <Text fontSize="14px" color="#F3B552">
              检测结果仅代表链上数据分析值，不作为任何投资建议或担保
            </Text>
          </Flex>
          <Flex justifyContent="center" mt="15px">
            <ArcProgress
              progress={progress}
              size={250}
              arcStart={180}
              arcEnd={360}
              thickness={18}
              customText={customText}
              fillColor="#EA4E54"
              observer={(current) => {
                const { percentage, currentText } = current
                console.log('observer:', percentage, currentText)
              }}
              animationEnd={({ progress, text }) => {
                console.log('animationEnd', progress, text)
              }}
            />
          </Flex>
          <Flex justifyContent="space-between" mb="15px">
            <Text color="#111A34">基本信息</Text>
            <Button scale="xs" variant="secondary">
              复制报告
            </Button>
          </Flex>
          <InfoWrapper
            title="Token 合约地址"
            titleColor="#BEC1C3"
            valueColor="#6A609F"
            value="0xc4f…f2b8"
          ></InfoWrapper>
          <InfoWrapper title="总量" titleColor="#BEC1C3" valueColor="#6A609F" value="10000"></InfoWrapper>
          <InfoWrapper title="流通总量" titleColor="#BEC1C3" valueColor="#111A34" value="10000"></InfoWrapper>
          <InfoWrapper title="精度" titleColor="#BEC1C3" valueColor="#111A34" value="10000"></InfoWrapper>
          <TabsComponent></TabsComponent>
          <InfoWrapper title="持币地址数" titleColor="#979797" valueColor="#111A34" value="10000"></InfoWrapper>
          <Flex justifyContent="space-between" alignItems="center" mb="15px">
            <Text color="#979797">Top 10 持币占比</Text>
            <Wrapper>
              <Text color="#111A34" mr="10px">
                70%
              </Text>
              <ProgressWrapper>
                <Progress primaryStep={70} scale="md" />
              </ProgressWrapper>
            </Wrapper>
          </Flex>
          <Text color="#111A34" mb="15px" mt="40px">
            TOP 10 持币明细
          </Text>
          {[10, 10, 10, 10, 10, 10].map((item) => {
            return (
              <InfoWrapper
                title="0x…ef86"
                titleColor="#979797"
                valueColor="#979797"
                value="745,984.38(74.6%)"
              ></InfoWrapper>
            )
          })}
          <Text color="#111A34" mb="15px" mt="40px">
            风险检查
          </Text>
          <RiskWrapper state={0} riskTex="所有都不能簒写余额"></RiskWrapper>
          <RiskWrapper state={1} riskTex="貔貅检测失败"></RiskWrapper>
          <RiskWrapper state={2} riskTex="未抛弃管理权限"></RiskWrapper>
          <Text color="#111A34" mb="15px" mt="40px">
            交易&流动性
          </Text>
          <InfoWrapper title="买入性" titleColor="#BEC1C3" valueColor="#EA4E54" value="15%"></InfoWrapper>
          <InfoWrapper title="卖出费" titleColor="#BEC1C3" valueColor="#EA4E54" value="15%"></InfoWrapper>
          <InfoWrapper title="活跃(交易)地址" titleColor="#BEC1C3" valueColor="#111A34" value="15"></InfoWrapper>
          <InfoWrapper title="24h交易数" titleColor="#BEC1C3" valueColor="#111A34" value="15"></InfoWrapper>
          <Button mt="24px" width="100%" onClick={handleClick}>
            开始检测
          </Button>
        </Body>
      </AppBody>
    </Page>
  )
}

export default Detection
