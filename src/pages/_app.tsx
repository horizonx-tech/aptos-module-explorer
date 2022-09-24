import type { AppProps } from 'next/app'
import { SEO } from 'src/components/parts/meta/SEO'
import { COMMON_SEO_DATA } from 'src/constants/seo'
import { AptosClientContextProvider } from 'src/hooks/useAptosClient'
import { SettingsContextProvider } from 'src/hooks/useSettings'
import { WalletContextProvider } from 'src/hooks/useWallet'
import { GlobalStyles } from 'src/styles/global-styles'
import 'src/styles/reset.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <SEO {...COMMON_SEO_DATA} />
      <WalletContextProvider>
        <SettingsContextProvider>
          <AptosClientContextProvider>
            <Component {...pageProps} />
          </AptosClientContextProvider>
        </SettingsContextProvider>
      </WalletContextProvider>
    </>
  )
}

export default MyApp
