import React, { createContext, useRef, useState, useEffect } from 'react'

import styled from 'styled-components'
import { Button, Image, Heading, Text, LogoIcon, Box, Flex } from '@pancakeswap/uikit'
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
  padding-top: 30px;
  position: relative;
  .btn-gradient {
    background: linear-gradient(179deg, #a86c00 0%, #e6bf5d 59%, #b67e00 100%);
    border-radius: 14px;
    width: 283px;
    height: 46px;
    display: block;
    margin: 20px auto;
  }
  .share {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 9;
  }
`
const MatrixTop = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background: linear-gradient(190deg, #1e1e1e 50%, #f9b223 100%); */
  background: url('/images/matrix/matrix-bg.png') no-repeat;
  background-size: 100% 100%;
  backdrop-filter: blur(10px) brightness(110%);
  padding: 55px 0 35px 0;
  position: relative;
  .box-1 {
    position: absolute;
    top: 10px;
    right: 30px;
  }
`
const BoxWrapper = styled.div`
  background: linear-gradient(174deg, #a86c00 0%, #e6bf5d 59%, #b67e00 100%);
  border-radius: 8px;
  border: 2px solid #ffffff;
  padding: 10px 30px;
  .text-shadow {
    text-shadow: 2px 2px 4px #7a572b;
  }
`
const LinnerWrapper = styled.div`
  background: linear-gradient(174deg, #a86c00 0%, #e6bf5d 59%, #b67e00 100%);
  border: 2px solid #ffffff;
  height: 130px;
  line-height: 90px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .txt {
    text-shadow: 0px 0px 4px rgba(225, 118, 255, 0.64);
  }
`
const BorderWrapper = styled.div`
  border-radius: 23px;
  border: 1px dashed #d77c0c;
  padding: 5px 25px;
  text-align: center;
  width: 60%;
  margin: 25px auto 0 auto;
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
const DotActive = styled.div`
  width: 10px;
  height: 10px;
  background: #875b04;
  box-shadow: 0px 1px 0px 0px #e19700;
  border-radius: 50%;
`

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #ffffff;
  box-shadow: 0px 1px 0px 0px #e19700;
  border-radius: 50%;
`
const getMyListApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/buy/my_spot_new?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const getMySNodeApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/user/my_s_node?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const getMyNftApi = async (account: string) => {
  const res = await fetch(`${TTC_API}/user/my_new_c?address=${account}`, {
    method: 'get',
  })
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}
const MatrixMinePage = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const [list, setList] = useState([
    {
      son: 3,
      level: 2,
      dot: [],
    },
    {
      son: 1,
      level: 1,
      dot: [],
    },
    {
      son: 1,
      level: 1,
      dot: [],
    },
  ])
  const dotList = [1, 2, 3]
  const levelObj = {
    1: t('In the team'),
    2: t('White reward'),
    3: t('Yellow reward'),
    4: t('Red reward'),
    5: t('Blue reward'),
    6: t('Gold Award'),
  }
  const [mySnode, setMySnode] = useState(null)
  const [myNft, setMyNft] = useState(null)
  useEffect(() => {
    async function init() {
      if (account) {
        const new_nft = await getMyNftApi(account)
        console.log('log==', new_nft)
        setMyNft(new_nft.result)
        const data = await getMyListApi(account)
        let _list = data.result
        const s_node = await getMySNodeApi(account)
        setMySnode(s_node.result)

        // list.forEach((element) => {
        //   let _arr = new Array(element.son)
        //   for (let index = 0; index < _arr.length; index++) {
        //     _arr[index] = index
        //   }
        //   element['dot'] = _arr
        // })
        setList(_list)
        console.log(list)
        // setList(_list.result)
      }
    }
    init()
  }, [account])
  return (
    <StyleMatrixLayout>
      <Box>
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            {t('Network-wide NFT')}
          </Text>
          <ArrowLeft></ArrowLeft>
        </Flex>
        <Text mb="5px" color="#CA9A33" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          {t('The whole network ends golden')}： {myNft?.num1}个
        </Text>
        <Text mb="5px" color="#CA9A33" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          {t('Whole network golden mesh')}： {myNft?.num2}个
        </Text>
        <Text mb="20px" color="#CA9A33" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          {t('Whole network blue mesh')}： {myNft?.num3}个
        </Text>
      </Box>
      <Box>
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            {t('My cards')}
          </Text>
          <ArrowLeft></ArrowLeft>
        </Flex>
        {/* <Text mb="5px" color="#fff" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          两代内点位数 {mySnode?.num1}
        </Text>
        <Text mb="20px" color="#fff" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          三代内点位数 {mySnode?.num2}
        </Text> */}
        <Text mb="5px" color="#CA9A33" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          {mySnode?.num1} & {mySnode?.num2}
        </Text>
        <Text mb="20px" color="#CA9A33" fontSize="18px" textAlign="center" ml="10px" mr="10px">
          {t('The current number of net body NFT participation')}： {myNft?.num4}个
        </Text>
        {list.length ? (
          <Flex flexWrap="wrap" justifyContent="center">
            {list.map((item) => {
              return (
                <Box width="50%" background="#FFFFFF" padding="10px 0" margin="5px 1%">
                  <Text color="#CA9A33" fontSize="16px" mb="10px" textAlign="center">
                    {levelObj[item.level]} {item['name']}
                  </Text>
                  <LinnerWrapper>
                    <Flex justifyContent="center" mb="12px">
                      <Dot></Dot>
                    </Flex>
                    <Flex justifyContent="center">
                      {dotList.map((num) => {
                        return (
                          <Box mr="5px" ml="5px">
                            {item['son'] >= num ? <Dot></Dot> : <DotActive></DotActive>}
                          </Box>
                        )
                      })}
                    </Flex>
                  </LinnerWrapper>
                </Box>
              )
            })}
          </Flex>
        ) : (
          <Text color="#fff" fontSize="14px" textAlign="center" ml="10px" mb="12px">
            {t('No data')}
          </Text>
        )}
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

export default MatrixMinePage
