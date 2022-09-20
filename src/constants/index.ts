import { WalletType } from '@horizonx/aptos-wallet-connector'

export const PUBLIC_NODE_URLS = [
  'https://fullnode.devnet.aptoslabs.com/v1',
  'https://fullnode.testnet.aptoslabs.com/v1',
]

export const WALLET_URLS: Record<WalletType, string> = {
  aptos: 'https://petra.app',
  fewcha: 'https://fewcha.app/',
  martian: 'https://martianwallet.xyz/',
  pontem: 'https://pontem.network/',
}
