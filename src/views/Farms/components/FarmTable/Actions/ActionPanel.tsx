import { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LinkExternal, Text, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { format } from 'date-fns'
import { useTTCNumber } from 'views/Farms/hooks/useApprove'
import { Field } from 'state/swap/actions'
import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
    opacity: 0;
    
  }
  to {
    max-height: auto;
    opacity: 1;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: auto;
    opacity: 1;
  }
  to {
    max-height: 0px;
    opacity: 0;
  }
`

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards;
        `
      : css`
          ${collapseAnimation} 300ms linear forwards;
        `};

  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 0 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
  /* margin-top: 24px; */
  padding: 24px 0;
`

const ValueContainer = styled.div``

const ValueWrapper = styled.div<{ isBlock?: any }>`
  display: ${({ isBlock }) => (isBlock ? 'block' : 'flex')};
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
  line-height: 1.2;
`
const ThemeValueWrapper = styled.div<{ isBlock?: any }>`
  color: ${({ theme }) => theme.colors.text};
  text-align: ${({ isBlock }) => (isBlock ? 'left' : 'right')};
  margin-right: 14px;
  line-height: 1.2;
  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

export interface ActionPanelProps {
  details: any
  userDataReady: boolean
  expanded: boolean
}
const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({ details, userDataReady, expanded }) => {
  const farm = details
  console.log('props', details)
  const { isDesktop } = useMatchBreakpointsContext()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')

  useEffect(() => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    setTTCNum(ttc_num)
    console.log('ttc_num===', ttc_num)
  }, [])
  return (
    // style={{ height: farm['order_list'].length >= 2 ? '500px' : 'auto', overflow: 'auto' }}
    <Container expanded={expanded}>
      <ActionContainer>
        <HarvestAction farm={farm} />
        <StakedAction farm={farm} />
        <InfoContainer>
          <ValueContainer>
            {/* {farm.isCommunity && farm.auctionHostingEndDate && (
            <ValueWrapper>
              <Text>{t('Auction Hosting Ends')}</Text>
              <Text paddingLeft="4px">
                {new Date(farm.auctionHostingEndDate).toLocaleString(locale, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </ValueWrapper>
          )} */}
            {!isDesktop && (
              <>
                <ValueWrapper>
                  <Text>{t('总产出')}</Text>
                  <ThemeValueWrapper>{farm['change_coin_num']}</ThemeValueWrapper>
                </ValueWrapper>
                <ValueWrapper>
                  <Text>{t('已产出')}</Text>
                  <ThemeValueWrapper>{farm['y_coin_num']}</ThemeValueWrapper>
                </ValueWrapper>
                <ValueWrapper>
                  <Text>{t('剩余')}</Text>
                  <ThemeValueWrapper>{farm['out_coin_num']}</ThemeValueWrapper>
                </ValueWrapper>
                <ValueWrapper>
                  <Text>{t('质押总计')}</Text>
                  <ThemeValueWrapper>{farm['in_coin_num']}</ThemeValueWrapper>
                </ValueWrapper>
                <ValueWrapper>
                  <Text>{t('开始时间')}</Text>
                  <ThemeValueWrapper>
                    {format(Number(farm['start_time']) * 1000, 'yyyy-MM-dd HH:mm:ss')}
                  </ThemeValueWrapper>
                </ValueWrapper>
                <ValueWrapper>
                  <Text>{t('结束时间')}</Text>
                  <ThemeValueWrapper>
                    {format(Number(farm['end_time']) * 1000, 'yyyy-MM-dd HH:mm:ss')}
                  </ThemeValueWrapper>
                </ValueWrapper>
                <ValueWrapper>
                  <Text>{t('质押时长')}</Text>
                  <ThemeValueWrapper>{farm['day']}天</ThemeValueWrapper>
                </ValueWrapper>
                <ValueWrapper isBlock={true}>
                  <Text>{t('说明')}</Text>
                  <ThemeValueWrapper isBlock={true}>{farm['info']}</ThemeValueWrapper>
                </ValueWrapper>
                {/* <Text>{farm['info']}</Text> */}
              </>
            )}
          </ValueContainer>
          {/* {isActive && (
          <StakeContainer>
            <StyledLinkExternal href={`/add/${liquidityUrlPathParts}`}>
              {t('Get %symbol%', { symbol: lpLabel })}
            </StyledLinkExternal>
          </StakeContainer>
        )}
        <StyledLinkExternal href={bsc}>{t('View Contract')}</StyledLinkExternal>
        <StyledLinkExternal href={info}>{t('See Pair Info')}</StyledLinkExternal> */}
        </InfoContainer>
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
