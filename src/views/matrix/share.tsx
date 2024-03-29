import React, { createContext, useRef, useState, useEffect } from 'react'
import { copyText } from 'utils/copyText'
import { CopyButton } from './components/CopyButton'
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

const ArrowLeft = styled.div`
  width: 22px;
  height: 23px;
  background: url('/images/matrix/arrow-l.png') no-repeat;
  background-size: 100% 100%;
`
const ArrowRight = styled.div`
  width: 22px;
  height: 23px;
  background: url('/images/matrix/arrow-r.png') no-repeat;
  background-size: 100% 100%;
`

const getInitDataApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/trx/index?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const bindUserCodeApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/user/app_reg?address=${account}`, {
    method: 'post',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const getMyListApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/user/my_s?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const getMySportListApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/buy/my_spot?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const MatrixSharePage = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const [initData, setInitData] = useState({})
  const [list, setList] = useState([])
  const [copyLink, setCopyLink] = useState('')
  const [mySport, setMySport] = useState(0)
  const levelObj = {
    1: t('In the team'),
    2: t('White reward'),
    3: t('Yellow reward'),
    4: t('Red reward'),
    5: t('Blue reward'),
    6: t('Gold Award'),
  }

  useEffect(() => {
    async function init() {
      if (account) {
        const _initData = await bindUserCodeApi(account)
        const sport = await getMySportListApi(account)
        setMySport(sport.result.length)
        const _copyLink = window.location.origin + '/matrix/' + _initData.result.user_sn
        setInitData(_initData)
        setCopyLink(_copyLink)
        const data = await getMyListApi(account)
        let _list = data.result
        setList(_list)
        console.log(list)
        // setList(_list.result)
      }
    }
    init()
  }, [account])
  return (
    <StyleMatrixLayout>
      <Box position="relative">
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            {t('My share link')}
          </Text>
          <ArrowLeft></ArrowLeft>
        </Flex>
        {mySport ? (
          <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
            <Text color="#fff" fontSize="16px" fontWeight="600" mr="5px">
              {copyLink}
            </Text>
            <CopyButton
              buttonColor="#D77C0C"
              width="24px"
              text={copyLink}
              tooltipMessage={t('Copied')}
              tooltipRight={40}
              tooltipTop={20}
            />
          </Flex>
        ) : (
          <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
            <Link href="/matrix" passHref>
              <Text color="#D77C0C" fontSize="16px" fontWeight="600" mr="5px">
                {t('Generate a sharing link after purchasing NFT cards')}
              </Text>
            </Link>
          </Flex>
        )}
      </Box>
      <Box>
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            {t('My invitation list')}
          </Text>
          <ArrowLeft></ArrowLeft>
        </Flex>

        <Flex flexWrap="wrap" flexDirection="column" alignItems="center" justifyContent="center">
          {list.length ? (
            list.map((item) => {
              return (
                <Text color="#fff" fontSize="14px" textAlign="center" ml="10px" mb="12px">
                  {item.eth_address}
                </Text>
              )
            })
          ) : (
            <Text color="#fff" fontSize="14px" textAlign="center" ml="10px" mb="12px">
              {t('No data')}
            </Text>
          )}
        </Flex>
      </Box>
      <Box>
        <Text color="#fff" fontSize="24px" textAlign="center" mt="40px" mb="24px">
          {t('Golden full network end')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('3 white NFTs to synthesize 1 yellow NFT')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('3 yellow NFTs to 1 red NFT')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          {t('3 red NFTs to synthesize 1 Blue NFT')}
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center">
          {t('3 Blue NFTs combined with 1 gold NFT')}
        </Text>
      </Box>

      <Box mt="25px">
        <Text color="#D77C0C" fontSize="16px" fontWeight="bold" textAlign="center">
          {t('Fair, just, open and transparent, no fund pool')}
        </Text>
      </Box>
    </StyleMatrixLayout>
  )
}

export default MatrixSharePage
