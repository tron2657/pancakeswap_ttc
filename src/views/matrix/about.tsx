import React, { createContext, useRef, useState, useEffect } from 'react'
import { copyText } from 'utils/copyText'
import styled from 'styled-components'
import { Button, Heading, Text, LogoIcon, Box, Flex, IconButton, CopyIcon } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'
import { TTC_API } from 'config/constants/endpoints'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const StyleMatrixLayout = styled.div`
  /* align-items: center;
  display: flex;
  flex-direction: column; */
  /* height: calc(100vh - 64px); */
  /* justify-content: center; */
  background: #1e1e1e;
  padding-bottom: 60px;
  .btn-gradient {
    background: linear-gradient(179deg, #a86c00 0%, #e6bf5d 59%, #b67e00 100%);
    border-radius: 14px;
    width: 283px;
    height: 46px;
    display: block;
    margin: 20px auto;
  }
`

const MatrixAboutage = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const [initData, setInitData] = useState({})
  const [list, setList] = useState([])

  return (
    <StyleMatrixLayout>
      <Box padding="20px">
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('TTC matrix NFT application ecological synthesis dividend mechanism:')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('Synthetic white NFT: take 3 * 30usdt = 90usdt')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('Synthetic yellow NFT: take 9 * 26usdt = 234 usdt')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t(
            'There will be evaluation invitation and recommendation. No recommendation will be automatically synthesized (see the recommendation evaluation mechanism)',
          )}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('Synthetic red NFT: take 27 * 4usdt = 108usdt')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('Synthetic blue NFT: take 81 * 5usdt = 405usdt')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('合成金色NFT：拿243个*7USDT=1701USDT')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t(
            'Total: 2538usdt (recommended by full invitation, according to the current price, the synthetic gold NFT can end with about 8-9 TTCs)',
          )}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('Recommended assessment mechanism:')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t(
            '1. Directly push or indirectly push three addresses, and get 30% of the dividends synthesized in the later period',
          )}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t(
            '2. Directly push or indirectly push 5 addresses, and get 60% of the dividends synthesized in the later period',
          )}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t(
            '3. Directly push or indirectly push 6 addresses, and get 90% of the dividends synthesized in the later period',
          )}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center"></Text>
      </Box>
      <Box mt="25px">
        <Text color="#D77C0C" fontSize="16px" fontWeight="bold" textAlign="center">
          {t('Fair, just, open and transparent, no fund pool')}
        </Text>
      </Box>
    </StyleMatrixLayout>
  )
}

export default MatrixAboutage
