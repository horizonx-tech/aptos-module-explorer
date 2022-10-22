import {
  connect as connectWallet,
  ERRORS,
  lastConnectedWalletType,
  WalletInterface,
} from '@horizonx/aptos-wallet-connector'
import { Account } from '@horizonx/aptos-wallet-connector/dist/wallets'
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { WALLET_INFO } from 'src/constants'

export const useWallet = () => useContext(WalletContext)

const SUPPORTED_WALLETS = ['aptos', 'martian', 'pontem', 'fewcha'] as const
export type SupportedWalletType = typeof SUPPORTED_WALLETS[number]

const isSupportedWallet = (arg: any): arg is SupportedWalletType =>
  SUPPORTED_WALLETS.includes(arg)

type WalletContextInterface = {
  connect: (type: SupportedWalletType) => Promise<
    | {
        client: WalletInterface<SupportedWalletType>
        account: Account | undefined
        chainId: number | undefined
      }
    | undefined
  >
  disconnect: VoidFunction
  signer?: WalletInterface
  account?: Account
  chainId?: number
}

const WalletContext = createContext<WalletContextInterface>({
  connect: async () => Promise.reject('context not ready'),
  disconnect: async () => Promise.reject('context not ready'),
})

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<WalletInterface>()
  const [account, setAccount] = useState<Account>()
  const [chainId, setChainId] = useState<number>()

  const connect = async (type: SupportedWalletType) => {
    const client = await connectWallet(type).catch((e) => {
      if (e === ERRORS.NOT_INSTALLED)
        window.open(WALLET_INFO[type].url, '_blank', 'noopener')
      return undefined
    })
    if (!client) return
    const [connectedAccount, connectedChainId] = await Promise.all([
      client.account(),
      client.chainId().catch(() => undefined),
    ])
    setClient(client)
    setAccount(connectedAccount)
    setChainId(connectedChainId)
    return { client, account: connectedAccount, chainId: connectedChainId }
  }

  const disconnect = async () => {
    if (client) await client.disconnect().catch(() => {})
    setClient(undefined)
    setAccount(undefined)
    setChainId(undefined)
  }

  useEffect(() => {
    if (!client) return
    const removeListeners: VoidFunction[] = []
    if (client.onAccountChanged) {
      const removeListener = client.onAccountChanged(async (account) => {
        if (account) return setAccount(account)
        client.connect().then(setAccount, disconnect)
      })
      removeListeners.push(removeListener)
    }
    if (client.onNetworkChanged) {
      const removeListener = client.onNetworkChanged(({ chainId }) =>
        setChainId(chainId),
      )
      removeListeners.push(removeListener)
    }
    return () => {
      removeListeners.forEach((removeListener) => removeListener())
    }
  }, [client])

  useEffect(() => {
    const type = lastConnectedWalletType()
    if (isSupportedWallet(type)) connect(type)
  }, [])

  return (
    <WalletContext.Provider
      value={{ connect, disconnect, account, chainId, signer: client }}
    >
      {children}
    </WalletContext.Provider>
  )
}
