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
      <Box>
        <Text color="#fff" fontSize="24px" textAlign="center" mt="40px" mb="24px">
        进120u，20u做后期MX底池分配，100u参与全网分红。
        分红比例分别是：
        九阶28%拿243次 
        三阶20%拿81次
        一阶16%拿27次
        B岗8%拿9次
        A岗10%拿3次
        推荐奖18%推荐人每次拿。





        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
        注：
A岗位拿3次，分别对应下面3位新人进场的跳排点位，有10%的岗位工资。        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
        B岗位拿9次，分别拿对应下面的9为新人进场的跳排点位，有8%的岗位工资。

        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
        一阶、三阶、九阶，当发展层每个新人进场的时候都拿，16%、20%、和28%。
一阶拿本盘面27（人）次。
三阶拿3个盘面27×3＝81次。
九阶拿9个盘面27×9＝243次。
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center">
          一个B阶下面三个A阶
        </Text>
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
