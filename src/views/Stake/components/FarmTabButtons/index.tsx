import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useState } from 'react'

interface FarmTabButtonsProps {
  changeActive: (arg: any) => void
}

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ changeActive }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [activeIndex, setActiveIndex] = useState(0)
  // switch (router.pathname) {
  //   case '/farms':
  //     activeIndex = 0
  //     break
  //   case '/farms/history':
  //     activeIndex = 1
  //     break
  //   case '/farms/archived':
  //     activeIndex = 2
  //     break
  //   default:
  //     activeIndex = 0
  //     break
  // }
  const onActiveButtonChange = (newIndex: number) => {
    console.log('newIndex', newIndex)
    setActiveIndex(newIndex)
    changeActive(newIndex + 1)
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle" onItemClick={onActiveButtonChange}>
        <ButtonMenuItem>{t('Live')}</ButtonMenuItem>
        <NotificationDot show={false}>
          <ButtonMenuItem id="finished-farms-button">{t('Finished')}</ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
