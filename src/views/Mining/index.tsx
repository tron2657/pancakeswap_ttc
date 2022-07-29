import { useEffect, useCallback, useState, useMemo, useRef, createContext } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Card, Text, Button, ArrowForwardIcon, Flex, Link } from '@pancakeswap/uikit'
import { ChainId } from 'ttcswap-sdk'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import { Token } from 'ttcswap-sdk'
import useCatchTxError from 'hooks/useCatchTxError'
import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farms/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useRouter } from 'next/router'
import PageHeader from 'components/PageHeader'
import CardHeading from './components/CardHeading'

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
const NUMBER_OF_FARMS_VISIBLE = 12

const Mining: React.FC = ({ children }) => {
  const { pathname } = useRouter()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { t } = useTranslation()
  const { data: farmsLP, userDataLoaded, poolLength, regularCakePerBlock } = useFarms()
  const cakePrice = usePriceCakeBusd()
  const [query, setQuery] = useState('')
  const { account } = useWeb3React()
  const isApproved = account
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)
  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <Button mt="8px" width="100%" disabled={pendingTx} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    ) : (
      <Button mt="8px" width="100%" disabled={pendingTx} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }
  const handleApprove = useCallback(async () => {}, [fetchWithCatchTxError])

  const MiningToken = new Token(
    56,
    '0xDdFa329d373b3EC762Ec3D238712508BBC8F0b3D',
    6,
    'TTC',
    'TTC',
    'https://ttcswap.finance/',
  )

  const MiningQuoteToken = new Token(
    56,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'Wrapped BNB',
    'https://www.binance.com/',
  )
  useEffect(() => {}, [])

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('流动性挖矿')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('持有TTC-USDT LP 代币产出EI')}
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
                {0.001999}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text small color="textSubtle">
                {t('每日产出')}:
              </Text>
              <Text small bold>
                {0.001999}
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
                {0.001999}
              </Text>
            </Flex>
            {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
            <Text small mt={'8px'} color="textSubtle">
              {t('产出规则： ')}
            </Text>
            <Text small color="textSubtle">
              {t('ProduceRuleDesc')}
            </Text>
          </FarmCardInnerContainer>
        </StyledCard>
      </Page>
    </>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Mining
