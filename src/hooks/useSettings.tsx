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

export const useSettings = () => useContext(SettingsContext)

type Settings = Partial<{
  nodeUrl: string
  account: string
  moduleName: string
}>

type SettingsContextInterface = {
  values: Settings
  updateValues: (newValues: Settings) => void
}

const SettingsContext = createContext<SettingsContextInterface>({
  values: {},
  updateValues: () => {},
})

export const SettingsContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [values, setValues] = useState<Settings>({
    // nodeUrl: 'https://fullnode.devnet.aptoslabs.com/v1',
  })

  const updateValues = useCallback(
    (newValues: Settings) => setValues({ ...values, ...newValues }),
    [values],
  )
  useEffect(() => {
    const { nodeUrl, account, moduleName } = parse(
      window.location.search.replace('?', ''),
    ) as Settings
    setValues({ nodeUrl, account, moduleName })
  }, [])

  useEffect(() => {
    const params = Object.entries(values)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    const query = params.length ? `?${params.join('&')}` : ''
    window.history.replaceState(null, '', query)
  }, [values])
  return (
    <SettingsContext.Provider value={{ values, updateValues }}>
      {children}
    </SettingsContext.Provider>
  )
}
