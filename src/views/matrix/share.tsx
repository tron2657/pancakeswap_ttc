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
  height: 90px;
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
  width: 8px;
  height: 8px;
  background: #875b04;
  box-shadow: 0px 1px 0px 0px #e19700;
  border-radius: 50%;
`

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #ffffff;
  box-shadow: 0px 1px 0px 0px #e19700;
  border-radius: 50%;
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

const MatrixSharePage = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const [initData, setInitData] = useState({})
  const [list, setList] = useState([])
  const [copyLink, setCopyLink] = useState('')
  const levelObj = {
    1: '组队中',
    2: 'A岗',
    3: 'B岗',
    4: '一阶',
    5: '三阶',
    6: '九阶',
  }

  useEffect(() => {
    async function init() {
      if (account) {
        const _initData = await bindUserCodeApi(account)
        const _copyLink = window.location.origin + '/matrix?code=' + _initData.result.user_sn
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
      <MatrixTop>
        <BoxWrapper className="box-1">
          <Text color="#fff" fontSize="23px" letterSpacing="3px" fontWeight="600">
            矩阵NFT
          </Text>
        </BoxWrapper>
        <BoxWrapper className="box-2">
          <Text
            color="#fff"
            className="text-shadow"
            letterSpacing="3px"
            lineHeight="1"
            fontSize="46px"
            fontWeight="600"
          >
            MATRIX
          </Text>
          <p>
            <Text display="inline-block" color="#fff" fontSize="20px" fontWeight="600">
              500BUSD
            </Text>
            <Text display="inline-block" color="#FF8900" fontSize="20px" fontWeight="600">
              起步卡位！
            </Text>
          </p>
        </BoxWrapper>
        <Text color="#D77C0C" fontSize="20px" fontWeight="600" mt="10px">
          全网公排 跳排
        </Text>
        <Text color="#fff" fontSize="16px" fontWeight="600" mt="26px">
          出局不出圈 三三裂变 生生不息 循环造血
        </Text>
      </MatrixTop>
      <Box position="relative">
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            我的分享链接
          </Text>
          <ArrowLeft></ArrowLeft>
        </Flex>

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
      </Box>
      <Box>
        <Flex justifyContent="center" alignItems="center" mt="40px" mb="24px">
          <ArrowRight></ArrowRight>
          <Text color="#fff" fontSize="24px" textAlign="center" ml="10px" mr="10px">
            我的邀请列表
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
              暂无数据
            </Text>
          )}
        </Flex>
      </Box>
      <Box>
        <Text color="#fff" fontSize="24px" textAlign="center" mt="40px" mb="24px">
          9阶出局制
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          一个9阶下面三个3阶
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          一个3阶下面三个1阶
        </Text>
        <Text color="#fff" fontSize="16px" textAlign="center" mb="18px">
          一个1阶下面三个B阶
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

export default MatrixSharePage
