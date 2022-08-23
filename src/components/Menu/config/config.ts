import {
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  MiningIcon,
  MiningFillIcon,
  EarnFillIcon,
  EarnIcon,
  TrophyIcon,
  TrophyFillIcon,
  NftIcon,
  NftFillIcon,
  MoreIcon,
} from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { perpLangMap } from 'utils/getPerpetualLanguageCode'
import { DropdownMenuItems } from '@pancakeswap/uikit/src/components/DropdownMenu/types'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean } & {
  items?: ConfigMenuDropDownItemsType[]
}

const config: (t: ContextApi['t'], languageCode?: string) => ConfigMenuItemsType[] = (t, languageCode) => [
  {
    label: t('Trade'),
    icon: SwapIcon,
    fillIcon: SwapFillIcon,
    href: '/swap',
    showItemsOnMobile: false,
    items: [
      {
        label: t('Swap'),
        href: '/swap',
      },
      // {
      //   label: t('Limit'),
      //   href: '/limit-orders',
      // },
      {
        label: t('Liquidity'),
        href: '/liquidity',
      },
      // {
      //   label: t('Perpetual'),
      //   href: `https://perp.ttcswap.finance/${perpLangMap(languageCode)}/futures/BTCUSDT`,
      //   type: DropdownMenuItemType.EXTERNAL_LINK,
      // },
    ],
  },
  {
    label: t('Mining'),
    href: '/mining',
    icon: MiningIcon,
    fillIcon: MiningFillIcon,
    showItemsOnMobile: false,
    items: [
      {
        label: t('Mining'),
        href: '/mining',
      },

    ],
  },
  {
    label: t('Earn'),
    href: '/farms',
    icon: EarnIcon,
    fillIcon: EarnFillIcon,
    showItemsOnMobile: false,
    items: [
      {
        label: t('Farms'),
        href: '/farms',
      },
      {
        label: t('Pools'),
        href: '/stake',
      },
    ],
  },
  // {
  //   label: t('Win'),
  //   href: '/prediction',
  //   icon: TrophyIcon,
  //   fillIcon: TrophyFillIcon,
  //   items: [
  //     {
  //       label: t('Trading Competition'),
  //       href: '/competition',
  //       hideSubNav: true,
  //     },
  //     {
  //       label: t('Prediction (BETA)'),
  //       href: '/prediction',
  //     },
  //     {
  //       label: t('Lottery'),
  //       href: '/lottery',
  //     },
  //   ],
  // },
  {
    label: t('NFT'),
    href: `${nftsBaseUrl}/fragments`,
    icon: NftIcon,
    fillIcon: NftFillIcon,
    showItemsOnMobile: false,
    items: [
      {
        label: '碎片市场',
        href: `${nftsBaseUrl}/fragments`,
      },
      {
        label: 'NFT市场',
        href: `${nftsBaseUrl}/market`,
      },
      // {
      //   label: t('Overview'),
      //   href: `${nftsBaseUrl}`,
      // },
      // {
      //   label: t('Collections'),
      //   href: `${nftsBaseUrl}/collections`,
      // },
      // {
      //   label: t('Activity'),
      //   href: `${nftsBaseUrl}/activity`,
      // },
    ],
  },
  {
    label: t('More'),
    href: '/info',
    icon: MoreIcon,
    hideSubNav: true,

    items: [
      {
        label: t('One-click coin issuance'),
        href: '/issuance',
      },
      {
        label: t('Contract detection'),
        href: '/issuance/detection',
      },
      {
        label: t('Matrix NFT'),
        href: '/matrix',
      },
      {
        label: t('Voting'),
        href: '/voting',
      },
      // {
      //   type: DropdownMenuItemType.DIVIDER,
      // },
      // {
      //   label: t('Leaderboard'),
      //   href: '/teams',
      // },
      // {
      //   type: DropdownMenuItemType.DIVIDER,
      // },
      // {
      //   label: t('Blog'),
      //   href: 'https://medium.com/pancakeswap',
      //   type: DropdownMenuItemType.EXTERNAL_LINK,
      // },
      // {
      //   label: t('Docs'),
      //   href: 'https://docs.ttcswap.finance',
      //   type: DropdownMenuItemType.EXTERNAL_LINK,
      // },
    ],
  },
]

export default config
