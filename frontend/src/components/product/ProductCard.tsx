import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { formatINR, useShopStore } from '../../lib/store'
import { Button } from '../ui/Button'
import clsx from 'clsx'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addItem = useShopStore((s) => s.addItem)
  const wishlist = useShopStore((s) => s.wishlist)
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)
  const loved = wishlist.includes(product.slug)
  const primary = product.images[0]
  const secondary = product.images[1]
  const onSale = product.sale_price != null && product.sale_price < product.price
  const discount = onSale
    ? Math.round(((product.price - (product.sale_price as number)) / product.price) * 100)
    : 0

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-ivory-deep">
        <Link to={`/products/${product.slug}`} className="block h-full w-full">
          {primary && (
            <img
              src={primary.url}
              alt={primary.alt || product.name}
              className={clsx(
                'absolute inset-0 h-full w-full object-cover transition duration-300',
                secondary && 'group-hover:opacity-0',
              )}
              loading="lazy"
            />
          )}
          {secondary && (
            <img
              src={secondary.url}
              alt={secondary.alt || product.name}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-300 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {onSale && (
            <span className="rounded-sm bg-sale px-1.5 py-0.5 text-[11px] font-semibold tracking-label text-white">
              -{discount}%
            </span>
          )}
          {product.badges.map((b) => (
            <span
              key={b}
              className={clsx(
                'rounded-sm px-1.5 py-0.5 text-[11px] font-semibold tracking-label text-white',
                b === 'New' && 'bg-badge-new',
                b === 'Best Seller' && 'bg-primary',
                b === 'Pre-Order' && 'bg-preorder',
              )}
            >
              {b}
            </span>
          ))}
        </div>

        <button
          type="button"
          aria-label={loved ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:text-primary"
        >
          <Heart className={clsx('h-4 w-4', loved && 'fill-primary text-primary')} />
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-md:pointer-events-auto max-md:translate-y-0 max-md:opacity-100">
          <Button
            className="w-full"
            onClick={() => addItem(product, product.sizes[0])}
            type="button"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-[14px] font-medium leading-snug text-ink">
            {product.name}
            {product.variant_hint ? (
              <span className="text-muted"> · {product.variant_hint}</span>
            ) : null}
            <span className="hidden text-muted sm:inline"> | {product.sku}</span>
          </h3>
        </Link>
        <p className="text-sm">
          {onSale ? (
            <>
              <span className="font-bold text-sale">{formatINR(product.sale_price as number)}</span>{' '}
              <span className="text-muted line-through">{formatINR(product.price)}</span>
            </>
          ) : (
            <span className="font-bold text-ink">{formatINR(product.price)}</span>
          )}
        </p>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-lg bg-ivory-deep" />
      <div className="mt-3 h-4 w-3/4 rounded bg-ivory-deep" />
      <div className="mt-2 h-3 w-1/2 rounded bg-ivory-deep" />
    </div>
  )
}
