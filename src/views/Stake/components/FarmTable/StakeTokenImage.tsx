import React, { useState } from 'react'
import { TokenPairImageProps, variants } from '@pancakeswap/uikit/src/components/Image/types'
import Wrapper from '@pancakeswap/uikit/src/components/Image/Wrapper'
import { StyledPrimaryImage, StyledSecondaryImage } from '@pancakeswap/uikit/src/components/Image/styles'

const StakeTokenImage: React.FC<TokenPairImageProps> = ({
  primarySrc,
  secondarySrc,
  width,
  height,
  variant = variants.DEFAULT,
  primaryImageProps = {},
  secondaryImageProps = {},
  ...props
}) => {
  const secondaryImageSize = Math.floor(width / 2)

  return (
    <Wrapper position="relative" width={width} height={height} {...props}>
      <StyledPrimaryImage variant={variant} src={primarySrc} width={width} height={height} {...primaryImageProps} />
      <StyledSecondaryImage
        variant={variant}
        src={secondarySrc}
        width={secondaryImageSize}
        height={secondaryImageSize}
        {...secondaryImageProps}
      />
    </Wrapper>
  )
}

export default StakeTokenImage
