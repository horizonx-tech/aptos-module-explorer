import { AptosClient } from 'aptos'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'
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
    values: { nodeUrl },
  } = useSettings()
  const client = useMemo(
    () => (nodeUrl ? new AptosClient(nodeUrl) : undefined),
    [nodeUrl],
  )
  return (
    <AptosClientContext.Provider value={{ client }}>
      {children}
    </AptosClientContext.Provider>
  )
}
