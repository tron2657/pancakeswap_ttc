import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Button, Text, Box, Flex, useModal, Image } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'

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
    /* width: 283px; */
    height: 46px;
    display: block;
    margin: 20px auto;
  }
  .border-btn {
    background: transparent;
    border: 1px solid #e6bf5d;
    display: block;
    margin: 0 auto;
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
const MatrixLayOut = ({ initData, account, showShare, children }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <StyleMatrixLayout>
      {showShare ? (
        <Link href="/matrix/share" passHref>
          <Image className="share" src="/images/matrix/share.png" alt="Share" width={32} height={32} />
        </Link>
      ) : null}
      <MatrixTop>
        {/* <BoxWrapper className="box-1">
          <Text color="#fff" fontSize="23px" letterSpacing="3px" fontWeight="600">
            矩阵NFT
          </Text>
        </BoxWrapper> */}
        <BoxWrapper className="box-2">
          <Text
            color="#fff"
            className="text-shadow"
            letterSpacing="3px"
            lineHeight="1"
            fontSize="46px"
            fontWeight="600"
          >
            MATRIX 2.0
          </Text>
          <p>
            <Text display="inline-block" color="#fff" fontSize="20px" fontWeight="600">
              {initData?.spot_price}USDT
            </Text>
            <Text display="inline-block" color="#FF8900" fontSize="20px" fontWeight="600">
              {t('Buy NFT cards')}
            </Text>
          </p>
        </BoxWrapper>
        <Text color="#D77C0C" fontSize="20px" fontWeight="600" mt="10px">
          {t('Public row of the whole network')} {t('Skip row')}
        </Text>
        <Text color="#fff" fontSize="16px" fontWeight="600" mt="26px">
          {t('Endless circulation and hematopoiesis')}
        </Text>
      </MatrixTop>
      {children}
    </StyleMatrixLayout>
  )
}

export default MatrixLayOut
