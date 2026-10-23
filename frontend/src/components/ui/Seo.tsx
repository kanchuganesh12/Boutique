import { Helmet } from 'react-helmet-async'

const SITE = 'Boutique'

export function Seo({
  title,
  description,
  image,
  jsonLd,
}: {
  title: string
  description?: string
  image?: string
  jsonLd?: object
}) {
  const fullTitle = title === SITE ? `${SITE} — Ethnic Womenswear` : `${title} | ${SITE}`
  const url = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : undefined
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      {url ? <link rel="canonical" href={url} /> : null}
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      {image ? <meta property="og:image" content={image} /> : null}
      <meta property="og:type" content={jsonLd ? 'product' : 'website'} />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  )
}
