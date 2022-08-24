import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { CoreTag } from 'components/Tags'
import Details from './Details'
import ActionPanel from './Actions/ActionPanel'
import { DesktopColumnSchema, MobileColumnSchema } from '../types'

import { PLEDGE_API } from 'config/constants/endpoints'
import { useWeb3React } from '@web3-react/core'
import StakeTokenImage from 'views/Stake/components/FarmTable/StakeTokenImage'

export interface NewRowProps {
  details: any
}

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 16px;
  margin: 16px 0px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`
const CellInner = styled.div`
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`
const AmountText = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const ThemeText = styled.span`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
`

const StyledTr = styled.tr`
  cursor: pointer;
  border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
`

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

const FarmMobileCell = styled.td`
  padding-top: 24px;
`
const getCoinListApi = async (account: string) => {
  const res = await fetch(`${PLEDGE_API}/pledge/coin_list`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const NewRow: React.FC<NewRowProps> = (props) => {
  console.log('props', props)
  const { details } = props
  const hasStakedAmount = false
  const { account } = useWeb3React()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const { t } = useTranslation()
  const [primarySrc, setPrimarySrc] = useState('')
  const [secondarySrc, setSecondarySrc] = useState('')
  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
    async function init() {
      const _data = await getCoinListApi(account)
      if (_data.status) {
        let primary = _data.result.find((item) => item.coin_name == details['coin_name'])
        let secondary = _data.result.find((item) => item.coin_name == details['coin_name2'])
        setPrimarySrc(primary['img'])
        setSecondarySrc(secondary['img'])
      }
    }

    init()
  }, [hasStakedAmount, account])

  const { isDesktop, isMobile } = useMatchBreakpointsContext()

  const isSmallerScreen = !isDesktop
  const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)

  const handleRenderRow = () => {
    return (
      <CellInner>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex justifyContent="flex-start" alignItems="center" flex="auto">
            <StakeTokenImage
              primarySrc={primarySrc}
              secondarySrc={secondarySrc}
              width={40}
              height={40}
            ></StakeTokenImage>
            <Text>{details['coin_name2']}</Text>
          </Flex>

          {details['is_t'] ? <CoreTag marginRight="16px" scale="sm" /> : null}
        </Flex>
        <Flex mt="15px" justifyContent="space-around" alignItems="center" onClick={toggleActionPanel}>
          <Flex width="40%" flexDirection="column" alignItems="flex-start">
            <Text>已赚取{details['coin_name']}</Text>
            <AmountText earned={Number(details['order_sum_j'])}>{Number(details['order_sum_j']).toFixed(4)}</AmountText>
          </Flex>
          <Flex width="30%" flexDirection="column" alignItems="flex-start">
            <Text>年利化率</Text>
            <ThemeText>{Number(details['year_profit'] * 100).toFixed(2)}</ThemeText>
          </Flex>
          <Box width="30%">
            <Details actionPanelToggled={actionPanelExpanded} />
          </Box>
        </Flex>
      </CellInner>
    )
  }

  return (
    <Container>
      {handleRenderRow()}
      <ActionPanel
        details={details}
        userDataReady={true}
        expanded={actionPanelExpanded}
        // change_coin_num={change_coin_num}
        // out_coin_num={out_coin_num}
        // in_coin_num={in_coin_num}
        // y_coin_num={y_coin_num}
        // end_day={end_day}
      />
    </Container>
  )
}

export default NewRow
