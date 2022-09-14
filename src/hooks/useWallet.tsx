import { connect, WalletInterface, WalletType } from '@horizonx/aptos-wallet-connector'
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { WALLET_URLS } from 'src/constants'

export const useWallet = () => useContext(WalletContext)

type WalletContextInterface = {
  connect: (
    type: WalletType,
  ) => Promise<WalletInterface<WalletType> | undefined>
  disconnect: VoidFunction
  signer?: WalletInterface
  account?: string
}

const WalletContext = createContext<WalletContextInterface>({
  connect: async () => Promise.reject('context not ready'),
  disconnect: async () => Promise.reject('context not ready'),
})

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<WalletInterface>()
  const [account, setAccount] = useState<string>()
  useEffect(() => {
    if (!client?.onAccountChanged) return
    return client.onAccountChanged(setAccount)
  }, [client])
  return (
    <WalletContext.Provider
      value={{
        connect: async (type) => {
          const client = await connect(type).catch(() => {
            window.open(WALLET_URLS[type], '_blank', 'noopener')
            return undefined
          })
          const connectedAccount = await client?.account()
          setClient(client)
          setAccount(connectedAccount)
          return client
        },
        disconnect: async () => {
          if (client) await client.disconnect().catch(() => {})
          setClient(undefined)
          setAccount(undefined)
        },
        account,
        signer: client,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
