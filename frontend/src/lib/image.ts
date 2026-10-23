/**
 * Responsive image helpers. Product images are served from an image CDN that
 * accepts `w`/`h` query params (Unsplash today; Cloudinary/ImageKit work the same way),
 * so we can request exactly the widths the layout needs.
 */
function withWidth(url: string, width: number) {
  try {
    const u = new URL(url)
    const w = Number(u.searchParams.get('w'))
    const h = Number(u.searchParams.get('h'))
    u.searchParams.set('w', String(width))
    if (w && h) u.searchParams.set('h', String(Math.round((h / w) * width)))
    u.searchParams.set('auto', 'format')
    u.searchParams.set('q', '75')
    return u.toString()
  } catch {
    return url
  }
}

export function srcSet(url: string | undefined, widths = [320, 480, 640, 800, 1200]) {
  if (!url) return undefined
  return widths.map((w) => `${withWidth(url, w)} ${w}w`).join(', ')
}

export function sized(url: string | undefined, width: number) {
  return url ? withWidth(url, width) : undefined
}

/** `sizes` for product cards in the 2/3/4-column grid. */
export const CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
