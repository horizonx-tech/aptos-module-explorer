import { AptosClient } from 'aptos'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'
import { getNodeUrls } from 'src/utils/chain'
import { useSettings } from './useSettings'
import { useWallet } from './useWallet'

export const useAptosClient = () => useContext(AptosClientContext)

type AptosClientContextInterface = {
  client?: AptosClient
}

const AptosClientContext = createContext<AptosClientContextInterface>({})

export const AptosClientContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { chainId: walletChainId } = useWallet()
  const {
    values: { chainId, nodeUrl },
  } = useSettings()
  const client = useMemo(
    () =>
      nodeUrl
        ? new AptosClient(nodeUrl)
        : new AptosClient(getNodeUrls(walletChainId || chainId)[0]),
    [walletChainId, nodeUrl, chainId],
  )
  return (
    <AptosClientContext.Provider value={{ client }}>
      {children}
    </AptosClientContext.Provider>
  )
}
