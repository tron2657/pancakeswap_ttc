import { useState, useEffect } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Input, Box, Text, Flex, BnbUsdtPairTokenIcon, ButtonMenu, ButtonMenuItem, Progress } from '@pancakeswap/uikit'
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
  const [tokenInfo, setTokenInfo] = useState(null)
  const [topHoldersPercent, setTopHoldersPercent] = useState(0)
  const [lockPercent, setLockPercent] = useState(0)
  const accountEllipsis = (account: string) => {
    return account ? `${account.substring(0, 4)}......${account.substring(account.length - 4)}` : null
  }
  const handleClick = () => {}

  const handleTabClick = (newIndex: number) => {
    setActiveIndex(newIndex)
  }

  const handleCheck = async () => {
    const data = await checkTokenSecurity()
    if (data.code == 1) {
      // console.log(data.result[address])
      let backData = data.result[address.toLocaleLowerCase()]
      setTokenInfo(backData)
      getTopHoldersPercent(backData)
      getLockPercent(backData)
    }
  }

  const getTopHoldersPercent = (backData) => {
    let holders = backData.holders
    let _total = 0
    holders.forEach((element) => {
      _total += Number(element.percent)
    })
    setTopHoldersPercent(_total * 100)
  }

  const getLockPercent = (backData) => {
    let holders = backData.lp_holders
    let _total = 0
    holders.forEach((element) => {
      if (element.is_locked) {
        _total += Number(element.percent)
      }
    })
    setLockPercent(_total * 100)
  }

  const getDecimals = (num) => {
    return num.split('.')[1].length
  }

  const checkTokenSecurity = async () => {
    const res = await fetch(`https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=${address}`, {
      method: 'get',
    })
    if (res.ok) {
      const json = await res.json()
      return json
    }
    console.error('Failed to fetch NFT collections', res.statusText)
    return null
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
          <Flex alignItems="flex-start" mt="15px" mb="15px">
            <BnbUsdtPairTokenIcon ml="8px" />
            <Text fontSize="14px" color="#F3B552">
              检测结果仅代表链上数据分析值，不作为任何投资建议或担保
            </Text>
          </Flex>
          {tokenInfo ? (
            <Box>
              {/* <Flex justifyContent="center" mt="15px">
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
              </Flex> */}
              <Flex justifyContent="space-between" mb="15px">
                <Text color="#111A34">基本信息</Text>
                {/* <Button scale="xs" variant="secondary">
                  复制报告
                </Button> */}
              </Flex>
              <InfoWrapper
                title="Token 名称"
                titleColor="#BEC1C3"
                valueColor="#6A609F"
                value={`${tokenInfo?.token_symbol} (${tokenInfo?.token_name})`}
              ></InfoWrapper>
              <InfoWrapper
                title="Token 合约创建者地址"
                titleColor="#BEC1C3"
                valueColor="#6A609F"
                value={accountEllipsis(tokenInfo?.creator_address)}
              ></InfoWrapper>
              <InfoWrapper
                title="总量"
                titleColor="#BEC1C3"
                valueColor="#6A609F"
                value={Number(tokenInfo?.total_supply).toFixed(4)}
              ></InfoWrapper>
              <InfoWrapper
                title="流通总量"
                titleColor="#BEC1C3"
                valueColor="#111A34"
                value={Number(tokenInfo?.lp_total_supply).toFixed(4)}
              ></InfoWrapper>
              <InfoWrapper
                title="精度"
                titleColor="#BEC1C3"
                valueColor="#111A34"
                value={getDecimals(tokenInfo?.total_supply)}
              ></InfoWrapper>
              <TabsComponent></TabsComponent>
              {activeIndex == 0 ? (
                <Box>
                  <InfoWrapper
                    title="持币地址数"
                    titleColor="#979797"
                    valueColor="#111A34"
                    value={Number(tokenInfo?.holder_count)}
                  ></InfoWrapper>
                  <Flex justifyContent="space-between" alignItems="center" mb="15px">
                    <Text color="#979797">Top 10 持币占比</Text>
                    <Wrapper>
                      <Text color="#111A34" mr="10px">
                        {Number(topHoldersPercent).toFixed(2)}%
                      </Text>
                      <ProgressWrapper>
                        <Progress primaryStep={topHoldersPercent} scale="md" />
                      </ProgressWrapper>
                    </Wrapper>
                  </Flex>
                  <Text color="#111A34" mb="15px" mt="40px">
                    TOP 10 持币明细
                  </Text>
                  {tokenInfo?.holders.map((item) => {
                    return (
                      <InfoWrapper
                        title={accountEllipsis(item.address)}
                        titleColor="#979797"
                        valueColor="#979797"
                        value={`${Number(item.balance).toFixed(4)}(${(Number(item.percent) * 100).toFixed(2)}%)`}
                      ></InfoWrapper>
                    )
                  })}
                </Box>
              ) : (
                <Box>
                  <InfoWrapper
                    title="LP持币地址数"
                    titleColor="#979797"
                    valueColor="#111A34"
                    value={Number(tokenInfo?.lp_holder_count)}
                  ></InfoWrapper>
                  <InfoWrapper
                    title="LP流通总量"
                    titleColor="#979797"
                    valueColor="#111A34"
                    value={Number(tokenInfo?.lp_total_supply).toFixed(4)}
                  ></InfoWrapper>
                  <Flex justifyContent="space-between" alignItems="center" mb="15px">
                    <Text color="#979797">LP锁仓占比</Text>
                    <Wrapper>
                      <Text color="#111A34" mr="10px">
                        {Number(lockPercent).toFixed(2)}%
                      </Text>
                      <ProgressWrapper>
                        <Progress primaryStep={lockPercent} scale="md" />
                      </ProgressWrapper>
                    </Wrapper>
                  </Flex>
                  <Text color="#111A34" mb="15px" mt="40px">
                    TOP 10 持币明细
                  </Text>
                  {tokenInfo?.lp_holders.map((item) => {
                    return (
                      <InfoWrapper
                        title={accountEllipsis(item.address)}
                        titleColor="#979797"
                        valueColor="#979797"
                        value={`${Number(item.balance).toFixed(4)}(${(Number(item.percent) * 100).toFixed(2)}%)`}
                      ></InfoWrapper>
                    )
                  })}
                </Box>
              )}
              <Text color="#111A34" mb="15px" mt="40px">
                风险检查
              </Text>
              {tokenInfo.is_honeypot == 1 ? (
                <RiskWrapper state={2} riskTex="看起来像貔貅"></RiskWrapper>
              ) : tokenInfo.is_honeypot == 0 ? (
                <RiskWrapper state={0} riskTex="看起来不像貔貅"></RiskWrapper>
              ) : (
                <RiskWrapper state={1} riskTex="貔貅检测失败"></RiskWrapper>
              )}
              {tokenInfo.is_open_source == 1 ? (
                <RiskWrapper state={0} riskTex="合约已开源"></RiskWrapper>
              ) : (
                <RiskWrapper state={2} riskTex="合约未开源"></RiskWrapper>
              )}
              {tokenInfo.owner_change_balance == 1 ? (
                <RiskWrapper state={2} riskTex="所有能簒写余额"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="所有都不能簒写余额"></RiskWrapper>
              )}
              {tokenInfo.is_proxy == 1 ? (
                <RiskWrapper state={2} riskTex="看起来像代理合约"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="看起来不像代理合约"></RiskWrapper>
              )}
              {tokenInfo.personal_slippage_modifiable == 1 ? (
                <RiskWrapper state={2} riskTex="滑点费率能被可修改"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="滑点费率不可修改"></RiskWrapper>
              )}
              {tokenInfo.is_whitelisted == 1 ? (
                <RiskWrapper state={2} riskTex="存在白名单"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="不存在白名单"></RiskWrapper>
              )}
              {tokenInfo.is_blacklisted == 1 ? (
                <RiskWrapper state={2} riskTex="存在黑名单"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="不存在黑名单"></RiskWrapper>
              )}
              {tokenInfo.is_blacklisted == 1 ? (
                <RiskWrapper state={2} riskTex="存在黑名单"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="不存在黑名单"></RiskWrapper>
              )}
              {tokenInfo.can_take_back_ownership == 1 ? (
                <RiskWrapper state={2} riskTex="能找回管理员权限"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="不能找回管理员权限"></RiskWrapper>
              )}
              {tokenInfo.transfer_pausable == 1 ? (
                <RiskWrapper state={2} riskTex="检测到交易暂停方法"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="未检测交易暂停方法"></RiskWrapper>
              )}
              {tokenInfo.trading_cooldown == 1 ? (
                <RiskWrapper state={2} riskTex="检测到易冷却机制"></RiskWrapper>
              ) : (
                <RiskWrapper state={0} riskTex="无交易冷却机制"></RiskWrapper>
              )}
              {/* <RiskWrapper state={1} riskTex="貔貅检测失败"></RiskWrapper>
              <RiskWrapper state={2} riskTex="未抛弃管理权限"></RiskWrapper> */}
              <Text color="#111A34" mb="15px" mt="40px">
                交易&流动性
              </Text>
              <InfoWrapper
                title="买入费"
                titleColor="#BEC1C3"
                valueColor="#EA4E54"
                value={`${Number(tokenInfo?.buy_tax)}%`}
              ></InfoWrapper>
              <InfoWrapper
                title="卖出费"
                titleColor="#BEC1C3"
                valueColor="#EA4E54"
                value={`${Number(tokenInfo?.sell_tax)}%`}
              ></InfoWrapper>
              <InfoWrapper title="活跃(交易)地址" titleColor="#BEC1C3" valueColor="#111A34" value="-"></InfoWrapper>
              <InfoWrapper title="24h交易数" titleColor="#BEC1C3" valueColor="#111A34" value="-"></InfoWrapper>
            </Box>
          ) : null}
          <Button mt="24px" width="100%" onClick={handleCheck}>
            开始检测
          </Button>
        </Body>
      </AppBody>
    </Page>
  )
}

export default Detection
