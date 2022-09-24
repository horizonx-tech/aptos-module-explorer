import Head from 'next/head'
import { FC } from 'react'

type MetaItem = {
  name: string
  content: string
}

export type SEOProps = {
  path?: string
  image?: string
  description?: string
  pageTitle?: string
  siteTitle?: string
  siteUrl?: string
  author?: string
  meta?: MetaItem[]
  noindex?: boolean
}

export const SEO: FC<SEOProps> = (props) => {
  const {
    path,
    pageTitle,
    description,
    image = '',
    siteTitle,
    siteUrl,
    author,
    meta = [],
    noindex = false,
  } = props
  const pageUrl = `${siteUrl}/${path}`
  const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle
  const siteImage = image.startsWith('https')
    ? image
    : `${siteUrl}/${image.replace(/^\//, '')}`
  const metaData = [
    { name: 'description', content: description },
    { name: 'image', content: siteImage },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: siteImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:creator', content: author },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: siteImage },
  ].concat(meta)
  if (noindex) metaData.push({ name: 'robots', content: 'noindex' })

  const linkData = []
  if (path) {
    metaData.push({ property: 'og:url', content: pageUrl })
    linkData.push({ rel: 'canonical', href: pageUrl })
  }
  return (
    <Head>
      <title>{title}</title>
      {metaData.map((item) => (
        <meta key={item.name || item.property} {...item} />
      ))}
      {linkData.map((item) => (
        <link key={item.href} {...item} />
      ))}
    </Head>
  )
}
