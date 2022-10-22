import { AptosAccount, AptosClient, Types } from 'aptos'
import { parse } from 'querystring'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { createSigner, Signer } from 'src/utils/signer'

export const useSettings = () => useContext(SettingsContext)

type Settings = Partial<{
  nodeUrl: string
  account: string
  chainId?: number
  moduleName: string
}>

type SettingsContextInterface = {
  values: Settings
  updateValues: (newValues: Settings) => void
  aptosAccount?: {
    signer: (client: AptosClient) => Signer
    address: string
    publicKey: string
  }
  setAptosAccount: (privateKeyHex: Types.HexEncodedBytes | undefined) => void
}

const SettingsContext = createContext<SettingsContextInterface>({
  values: {},
  updateValues: () => {},
  setAptosAccount: () => {},
})

export const SettingsContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [values, setValues] = useState<Settings>({})
  const [aptosAccount, _setAptosAccount] =
    useState<SettingsContextInterface['aptosAccount']>()

  const updateValues = useCallback(
    (newValues: Settings) => setValues({ ...values, ...newValues }),
    [values],
  )
  const setAptosAccount = useCallback(
    (privateKeyHex: Types.HexEncodedBytes | undefined) => {
      if (!privateKeyHex) return _setAptosAccount(undefined)
      const account = AptosAccount.fromAptosAccountObject({ privateKeyHex })
      const address = account.address().toString()
      _setAptosAccount({
        address,
        publicKey: account.pubKey().toString(),
        signer: (client) => createSigner(client, account),
      })
    },
    [values],
  )
  useEffect(() => {
    const { nodeUrl, account, moduleName, chainId } = parse(
      window.location.search.replace('?', ''),
    ) as Settings
    setValues({
      nodeUrl,
      account,
      moduleName,
      chainId: !chainId || Number.isNaN(+chainId) ? undefined : +chainId,
    })
  }, [])

  useEffect(() => {
    const params = Object.entries(values)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    const query = params.length ? `?${params.join('&')}` : ''
    window.history.replaceState(null, '', query)
  }, [values])
  return (
    <SettingsContext.Provider
      value={{
        values,
        updateValues,
        aptosAccount,
        setAptosAccount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
