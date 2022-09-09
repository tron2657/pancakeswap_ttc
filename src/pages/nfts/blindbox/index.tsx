import BlindBox from 'views/Nft/blindbox'
import { Text, Flex, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'

import { Spinner } from '@pancakeswap/uikit'
// min-height: calc(100vh - 64px);

const Wrapper = styled.div`
  /* display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; */
  min-height: calc(100vh - 104px);
`
const BlindBoxPage = () => {
  return (
    <Wrapper>
      <BlindBox></BlindBox>
    </Wrapper>
  )
}

export default BlindBoxPage
