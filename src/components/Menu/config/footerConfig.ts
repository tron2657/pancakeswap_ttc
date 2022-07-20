import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://docs.ttcswap.finance/contact-us',
        isHighlighted: true,
      },
      {
        label: t('Brand'),
        href: 'https://docs.ttcswap.finance/brand',
      },
      {
        label: t('Blog'),
        href: 'https://medium.com/pancakeswap',
      },
      {
        label: t('Community'),
        href: 'https://docs.ttcswap.finance/contact-us/telegram',
      },
      {
        label: t('Litepaper'),
        href: 'https://v2litepaper.ttcswap.finance/',
      },
      {
        label: '—',
      },
      {
        label: t('Online Store'),
        href: 'https://pancakeswap.creator-spring.com/',
      },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://docs.ttcswap.finance/contact-us/customer-support',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://docs.ttcswap.finance/help/troubleshooting',
      },
      {
        label: t('Guides'),
        href: 'https://docs.ttcswap.finance/get-started',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/pancakeswap',
      },
      {
        label: t('Documentation'),
        href: 'https://docs.ttcswap.finance',
      },
      {
        label: t('Bug Bounty'),
        href: 'https://docs.ttcswap.finance/code/bug-bounty',
      },
      {
        label: t('Audits'),
        href: 'https://docs.ttcswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited',
      },
      {
        label: t('Careers'),
        href: 'https://docs.ttcswap.finance/hiring/become-a-chef',
      },
    ],
  },
]
