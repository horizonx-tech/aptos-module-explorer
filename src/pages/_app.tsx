import type { AppProps } from 'next/app'
import { Favicons } from 'src/components/parts/meta/Favicons'
import { SEO } from 'src/components/parts/meta/SEO'
import { COMMON_SEO_DATA } from 'src/constants/seo'
import { AptosClientContextProvider } from 'src/hooks/useAptosClient'
import { LoadingContextProvider } from 'src/hooks/useLoading'
import { SettingsContextProvider } from 'src/hooks/useSettings'
import { WalletContextProvider } from 'src/hooks/useWallet'
import 'src/styles/fonts.css'
import { GlobalStyles } from 'src/styles/global-styles'
import 'src/styles/reset.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <SEO {...COMMON_SEO_DATA} />
      <Favicons />
      <LoadingContextProvider>
        <WalletContextProvider>
          <SettingsContextProvider>
            <AptosClientContextProvider>
              <Component {...pageProps} />
            </AptosClientContextProvider>
          </SettingsContextProvider>
        </WalletContextProvider>
      </LoadingContextProvider>
    </>
  )
}

export default MyApp
