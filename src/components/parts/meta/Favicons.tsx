import Head from 'next/head'

export const Favicons = () => (
  <Head>
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/favicons/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/favicons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/favicons/favicon-16x16.png"
    />
    <link rel="manifest" href="/site.webmanifest" />
    <link
      rel="mask-icon"
      href="/favicons/safari-pinned-tab.svg"
      color="#62efd3"
    />
    <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
    <meta
      name="apple-mobile-web-app-title"
      content="Aptos Module/Resource Explorer"
    />
    <meta name="application-name" content="Aptos Module/Resource Explorer" />
    <meta name="msapplication-TileColor" content="#62efd3" />
    <meta name="msapplication-config" content="/browserconfig.xml" />
    <meta name="theme-color" content="#121113" />
  </Head>
)
