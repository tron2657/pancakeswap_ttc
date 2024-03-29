import Fragment from 'views/Nft/fragments'
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
const FragmentPage = () => {
  return (
    <Wrapper>
      <Fragment></Fragment>
    </Wrapper>
  )
}

export default FragmentPage
