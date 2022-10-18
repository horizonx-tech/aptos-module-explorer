import { AptosClient } from 'aptos'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'
import { getNodeUrls } from 'src/utils/chain'
import { useSettings } from './useSettings'

export const useAptosClient = () => useContext(AptosClientContext)

type AptosClientContextInterface = {
  client?: AptosClient
}

const AptosClientContext = createContext<AptosClientContextInterface>({})

export const AptosClientContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    values: { chainId, nodeUrl },
  } = useSettings()
  const client = useMemo(
    () =>
      nodeUrl
        ? new AptosClient(nodeUrl)
        : new AptosClient(getNodeUrls(chainId)[0]),
    [nodeUrl, chainId],
  )
  return (
    <AptosClientContext.Provider value={{ client }}>
      {children}
    </AptosClientContext.Provider>
  )
}
