import { FC } from 'react'
import { CHAIN_INFO } from 'src/constants'

export const InvalidChainWarning: FC<{
  chainId: number
}> = ({ chainId }) => (
  <p>
    {`You need to change the chain of your wallet to ${chainId} (${CHAIN_INFO[chainId]?.name}).`}
  </p>
)
