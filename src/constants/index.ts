import { WalletType } from '@horizonx/aptos-wallet-connector'
import { StaticImageData } from 'next/image'
import fewchaIcon from 'public/images/icon_fewcha.png'
import martianIcon from 'public/images/icon_martian.png'
import petraIcon from 'public/images/icon_petra.png'
import pontemIcon from 'public/images/icon_pontem.png'

export const CHAIN_INFO: Record<number, { name: string; nodeUrls: string[] }> =
  {
    [32]: {
      name: 'Aptos Devnet',
      nodeUrls: ['https://fullnode.devnet.aptoslabs.com/v1'],
    },
    [2]: {
      name: 'Aptos Testnet',
      nodeUrls: ['https://fullnode.testnet.aptoslabs.com/v1'],
    },
  }

export const PUBLIC_NODE_URLS = Object.values(CHAIN_INFO).flatMap(
  ({ nodeUrls }) => nodeUrls,
)

export const WALLET_INFO: Record<
  WalletType,
  {
    url: string
    label: string
    imageSrc: StaticImageData | string
  }
> = {
  martian: {
    imageSrc: martianIcon,
    label: 'Martian Wallet',
    url: 'https://martianwallet.xyz/',
  },
  aptos: {
    imageSrc: petraIcon,
    label: 'Petra Wallet',
    url: 'https://petra.app',
  },
  fewcha: {
    imageSrc: fewchaIcon,
    label: 'Fewcha Wallet',
    url: 'https://fewcha.app/',
  },
  pontem: {
    imageSrc: pontemIcon,
    label: 'Pontem Wallet',
    url: 'https://pontem.network/',
  },
}
