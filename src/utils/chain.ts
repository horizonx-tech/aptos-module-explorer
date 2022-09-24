import { CHAIN_INFO, PUBLIC_NODE_URLS } from 'src/constants'

export const getNodeUrls = (chainId: number | undefined) => {
  if (!chainId) return PUBLIC_NODE_URLS
  return CHAIN_INFO[chainId]?.nodeUrls || []
}
