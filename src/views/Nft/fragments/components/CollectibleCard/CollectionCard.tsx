import { Card, CardBody, Flex, Text, Heading, ProfileAvatar } from '@pancakeswap/uikit'

import Image from 'next/image'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled, { css } from 'styled-components'
import { RoundedImage } from 'views/Nft/market/Collection/IndividualNFTPage/shared/styles'
import PreviewImage from 'views/Nft/market/components/CollectibleCard/PreviewImage'

interface HotCollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  cardId?: string
  tokenId?: string
  collectionName: string
  description: string
  url?: string
  disabled?: boolean
}

export const CollectionAvatar = styled(ProfileAvatar)`
  left: 0;
  position: absolute;
  top: -32px;
  border: 4px white solid;
`

const StyledHotCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 8px;
  /* border-bottom-left-radius: 56px; */
  transition: opacity 200ms;

  & > div {
    border-radius: 8px;
    /* border-bottom-left-radius: 56px; */
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ disabled }) =>
      disabled
        ? ''
        : css`
            &:hover {
              cursor: pointer;
              opacity: 0.6;
            }
          `}
  }

  .img-small {
    border-radius: 4px;
  }
`

const StyledImage = styled(Image)`
  border-radius: 4px;
`

const CollectionCard: React.FC<HotCollectionCardProps> = ({
  bgSrc,
  avatarSrc,
  cardId,
  tokenId,
  collectionName,
  description,
  url,
  disabled,
  children,
}) => {
  const renderBody = () => (
    <CardBody p="8px">
      {/* <StyledImage src={bgSrc} height={278} width={375} /> */}
      {/* <img className="img-small" height={278} width={375} src={bgSrc ? bgSrc : ''} /> */}
      <RoundedImage height={355} width={375} src={bgSrc} as={PreviewImage} />
      <Flex
        position="relative"
        // height="95px"
        justifyContent="center"
        alignItems="flex-start"
        py="8px"
        flexDirection="column"
      >
        {/* <CollectionAvatar src={avatarSrc} width={96} height={96} /> */}

        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Text bold fontSize="16px" mr="4px">
            #{cardId} -{tokenId}
          </Text>
          <Text bold fontSize="16px" mr="4px">
            {collectionName}
          </Text>
        </Flex>
        <Text color="textSubtle" fontSize="12px" mr="4px">
          {description}
        </Text>
        {/* <Heading color={disabled ? 'textDisabled' : 'body'} as="h3" scale="xxl" mb={children ? '8px' : '0'}>
          {collectionName}
        </Heading> */}
        {children}
      </Flex>
    </CardBody>
  )

  return (
    <StyledHotCollectionCard disabled={disabled} data-test="hot-collection-card">
      {url ? (
        <NextLinkFromReactRouter to={url}>{renderBody()}</NextLinkFromReactRouter>
      ) : (
        <div style={{ cursor: 'default' }}>{renderBody()}</div>
      )}
    </StyledHotCollectionCard>
  )
}

export default CollectionCard
