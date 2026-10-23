import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { Product } from '../../types'
import { FREE_SHIPPING_THRESHOLD, unitPrice, useShopStore } from '../../lib/store'
import { CARD_SIZES, sized, srcSet } from '../../lib/image'
import { Price, discountPercent } from '../ui/Price'
import { Skeleton } from '../ui/Skeleton'

type Props = {
  product: Product
  /** Eager-load images for above-the-fold cards. */
  priority?: boolean
}

/** Single-size products can go straight to the cart; anything else needs a size first. */
export const needsSizeChoice = (p: Product) => p.sizes.length > 1

export const deliveryDate = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

export function DeliveryLine({ product, className }: { product: Product; className?: string }) {
  if (product.pre_order?.is_pre_order) {
    return <p className={clsx('text-xs text-muted', className)}>Pre-order · ships {product.pre_order.expected_date}</p>
  }
  if (!product.in_stock) return <p className={clsx('text-xs text-muted', className)}>Currently unavailable.</p>
  const free = unitPrice(product) >= FREE_SHIPPING_THRESHOLD
  return (
    <p className={clsx('text-xs text-ink', className)}>
      {free ? 'FREE delivery' : '₹99 delivery'} <span className="font-bold">{deliveryDate(4)}</span>
    </p>
  )
}

export function ProductCard({ product, priority }: Props) {
  const addItem = useShopStore((s) => s.addItem)
  const loved = useShopStore((s) => s.wishlist.includes(product.slug))
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)
  const setQuickView = useShopStore((s) => s.setQuickView)
  const [primary] = product.images
  const off = discountPercent(product)
  const href = `/products/${product.slug}`
  const soldOut = !product.in_stock && !product.pre_order?.is_pre_order

  const onAdd = () => {
    if (needsSizeChoice(product)) setQuickView(product)
    else addItem(product, product.sizes[0])
  }

  return (
    <article className="group relative flex h-full flex-col bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f7f7]">
        <Link to={href} className="block h-full w-full" tabIndex={-1} aria-hidden>
          {primary && (
            <img
              src={sized(primary.url, 640)}
              srcSet={srcSet(primary.url, [320, 480, 640, 800])}
              sizes={CARD_SIZES}
              width={600}
              height={800}
              alt={primary.alt || product.name}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
            />
          )}
        </Link>

        {product.is_best_seller ? (
          <span className="pointer-events-none absolute left-0 top-0 bg-[#c45500] px-2 py-0.5 text-xs text-white">Best seller</span>
        ) : product.is_new ? (
          <span className="pointer-events-none absolute left-0 top-0 bg-nav-2 px-2 py-0.5 text-xs text-white">New</span>
        ) : null}

        <button
          type="button"
          aria-label={loved ? `Remove ${product.name} from wish list` : `Add ${product.name} to wish list`}
          aria-pressed={loved}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-muted shadow-sm hover:text-deal"
        >
          <Heart key={String(loved)} className={clsx('h-[18px] w-[18px]', loved && 'heart-pop fill-deal text-deal')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-2">
        <Link to={href} className="block">
          <h3 className="line-clamp-2 font-sans text-[15px] font-normal leading-snug text-ink hover:text-link-hover">
            {product.name}
          </h3>
        </Link>
        {product.fabric || product.color ? (
          <p className="truncate text-xs text-muted">{[product.color, product.fabric].filter(Boolean).join(' · ')}</p>
        ) : null}
        {off ? (
          <span className="self-start rounded-sm bg-deal px-1.5 py-1 text-xs font-bold leading-none text-white">Limited time deal</span>
        ) : null}
        <Price product={product} />
        <DeliveryLine product={product} />
        {!soldOut ? (
          <div className="mt-auto pt-2">
            <button
              type="button"
              onClick={onAdd}
              className="min-h-8 rounded-full border border-cta-hover bg-cta px-3 text-[13px] text-ink hover:bg-cta-hover"
            >
              {needsSizeChoice(product) ? 'See options' : 'Add to cart'}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4]" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/3" />
    </div>
  )
}
