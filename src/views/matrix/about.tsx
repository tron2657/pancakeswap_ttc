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
          TTC矩阵NFT应用生态合成分红机制：
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          合成白色NFT：拿3个*10USDT=30USDT
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          合成黄色NFT：拿9个*8USDT=72 USDT
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          这里会考核邀请推荐，没有推荐不会自动合成（请看推荐考核机制）
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          合成红色NFT：拿27个*16USDT=432USDT
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          合成蓝色NFT：拿81个*20USDT=1620USDT
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          合成金色NFT：拿243个*28USDT=6804USDT
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          合计：8958USDT （满邀请推荐，根据当前价格，合成金色NFT可拿约8～9个TTC结束）
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          推荐考核机制：
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          1，直推或者间推3个地址，拿后期合成30％分红
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          2，直推或者间推5个地址，拿后期合成60％分红
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          3，直推或者间推6个地址，拿后期合成90％分红
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center"></Text>
      </Box>
      <Box mt="25px">
        <Text color="#D77C0C" fontSize="16px" fontWeight="bold" textAlign="center">
          公平 公正 公开 透明 无资金池
        </Text>
      </Box>
    </StyleMatrixLayout>
  )
}

export default MatrixAboutage
