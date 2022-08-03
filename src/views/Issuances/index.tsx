import { SubMenuItems } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PageMeta } from 'components/Layout/Page'
import { useRouter } from 'next/router'

export const IssuancePageLayout = ({ children }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isExact = router.route === '/issuance'

  return (
    <>
      <PageMeta />
      <SubMenuItems
        items={[
          {
            label: t('One-click coin issuance'),
            href: '/issuance',
          },
          // {
          //   label: t('Contract detection'),
          //   href: '/issuance/detection',
          // },
          // {
          //   label: t('Matrix NFT'),
          //   href: '/matrix',
          // },
        ]}
        activeItem={router.route}
      />

      {children}
    </>
  )
}
