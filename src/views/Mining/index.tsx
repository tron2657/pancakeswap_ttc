import { useEffect, useState, createContext } from 'react'
import { Heading, Card, Text, Button, ArrowForwardIcon, Flex } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled from 'styled-components'
import useCatchTxError from 'hooks/useCatchTxError'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import PageHeader from 'components/PageHeader'
import CardHeading from './components/CardHeading'
import tokens from 'config/constants/tokens'
import fetchFarms from 'state/farmsV1/fetchFarms'
import getFarmsPrices from 'state/farmsV1/getFarmsPrices'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarmFromPid } from 'state/farmsV1/hooks'

import {
  useJoinMiningCallback,
  useCheckCustomIfAccessStatus,
  useDrawMiningCallback,
  useObtainEarnedToken,
  useTotalSupply,
  useDailyProduce,
} from './hook/useJoinMining'
const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const MiningCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`
const StyledCard = styled(Card)`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const Mining: React.FC = ({ children }) => {
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { t } = useTranslation()

  const { account, chainId, library } = useActiveWeb3React()

  const [isJoinMining, setIsJoinMining] = useState(false)

  const { customIfAccess, setCustomIfAccessUpdated } = useCheckCustomIfAccessStatus()

  const { handleMining: handleMining, pendingTx: pendingTranctionTx } = useJoinMiningCallback(setCustomIfAccessUpdated)

  const { obtainEarnedToken, setObtainEarnedToken } = useObtainEarnedToken()

  const { totalSupply, setTotalSupply } = useTotalSupply()

  const { dailyProduce, setDailyProduce } = useDailyProduce()

  const { handleMining: handleDrawMining, pendingTx: pendingDrawTranctionTx } =
    useDrawMiningCallback(setCustomIfAccessUpdated)

  const renderApprovalOrStakeButton = () => {
    return customIfAccess ? (
      <Button mt="8px" width="100%" disabled={pendingDrawTranctionTx} onClick={handleDrawMining}>
        {t('MiningDraw')}
      </Button>
    ) : (
      <Button mt="8px" width="100%" disabled={pendingTranctionTx} onClick={handleMining}>
        {t('MiningJoin')}
      </Button>
    )
  }

  const MiningToken = tokens.ttc

  const MiningQuoteToken = tokens.usdt

  useEffect(() => {
    if (account) {
    }
  }, [account])

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('流动性挖矿')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('持有TTC-USDT LP 代币产出ETI')}
        </Heading>
        <NextLinkFromReactRouter to="/farms/auction" prefetch={false}>
          <Button p="0" variant="text">
            <Text color="primary" bold fontSize="16px" mr="4px">
              {t('TTC-USDT流动性')}
            </Text>
            <ArrowForwardIcon color="primary" />
          </Button>
        </NextLinkFromReactRouter>
      </PageHeader>
      <Page>
        <StyledCard>
          <FarmCardInnerContainer>
            <CardHeading
              lpLabel={'TTC-USDT'}
              multiplier={'farm.multiplier'}
              isCommunityFarm={true}
              token={MiningToken}
              quoteToken={MiningQuoteToken}
            />

            <Flex justifyContent="space-between">
              <Text small color="textSubtle">
                {t('总量')}:
              </Text>
              <Text small bold>
                {totalSupply}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text small color="textSubtle">
                {t('每日产出')}:
              </Text>
              <Text small bold>
                {(dailyProduce / Math.pow(10, 18)).toFixed(8)}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text small color="primary">
                {t('ETI')}{' '}
                <Text color="textSubtle" as="span">
                  {t('已赚取')}:
                </Text>
              </Text>
              <Text small bold>
                {(obtainEarnedToken / Math.pow(10, 18)).toFixed(8)}
              </Text>
            </Flex>
            {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
            <Text small mt={'8px'} color="textSubtle">
              {t('分红规则： ')}
            </Text>
            <Text small color="textSubtle">
              {t('ProduceRuleDesc1')}
            </Text>
            <Text small color="textSubtle">
              {t('ProduceRuleDesc2')}
            </Text>
            <Text small color="textSubtle">
              {t('ProduceRuleDesc3')}
            </Text>
            <Text small color="textSubtle">
              {t('ProduceRuleDesc4')}
            </Text>
          </FarmCardInnerContainer>
        </StyledCard>
      </Page>
    </>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Mining
