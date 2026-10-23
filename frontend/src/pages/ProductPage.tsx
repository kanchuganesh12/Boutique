import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Banknote, Lock, MapPin, RefreshCw, Share2, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { api, ApiError } from '../lib/api'
import { useNavigation } from '../lib/queries'
import { FREE_SHIPPING_THRESHOLD, formatINR, unitPrice, useShopStore } from '../lib/store'
import { Button } from '../components/ui/Button'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Price, PriceAmount, discountPercent } from '../components/ui/Price'
import { Rating } from '../components/ui/Rating'
import { Seo } from '../components/ui/Seo'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { SizeGuide } from '../components/product/SizeGuide'
import { SizeSelector } from '../components/product/SizeSelector'
import { ProductCarousel } from '../components/product/ProductCarousel'
import { swatchColor } from '../components/product/swatch'
import { deliveryDate } from '../components/product/ProductCard'
import { Gallery } from '../components/pdp/Gallery'
import { DeliveryCheck } from '../components/pdp/DeliveryCheck'
import { Reviews } from '../components/pdp/Reviews'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const { data: product, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.product(slug),
  })
  const { data: related, isLoading: relatedLoading } = useQuery({
    queryKey: ['related', slug],
    queryFn: () => api.related(slug),
    enabled: !!product,
  })
  const { data: reviews } = useQuery({ queryKey: ['reviews', slug], queryFn: () => api.reviews(slug) })
  const { data: nav } = useNavigation()
  const navigate = useNavigate()
  // Size choice is keyed by product so it resets when navigating between products.
  const [sizeState, setSizeState] = useState<{ slug: string; size?: string }>({ slug })
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [guide, setGuide] = useState(false)
  const addItem = useShopStore((s) => s.addItem)
  const loved = useShopStore((s) => s.wishlist.includes(slug))
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)
  const showToast = useShopStore((s) => s.showToast)
  const setMiniCartOpen = useShopStore((s) => s.setMiniCartOpen)

  if (isLoading) return <ProductSkeleton />
  if (isError || !product) {
    return error instanceof ApiError && error.status === 404 ? (
      <div className="container-boutique section-y">
        <EmptyState title="We couldn’t find that piece" action={<Button to="/collections/new-arrivals">Shop new arrivals</Button>}>
          It may have sold out or moved. Explore our latest arrivals instead.
        </EmptyState>
      </div>
    ) : (
      <ErrorState onRetry={() => refetch()} />
    )
  }

  const size = sizeState.slug === product.slug ? sizeState.size ?? (product.sizes.length === 1 ? product.sizes[0] : undefined) : undefined
  const setSize = (s: string) => {
    setSizeState({ slug: product.slug, size: s })
    setSizeError(false)
  }
  const isPreOrder = !!product.pre_order?.is_pre_order
  const soldOut = !product.in_stock && !isPreOrder
  const categoryName = nav?.categories.find((c) => c.slug === product.category_slug)?.name ?? product.category_slug

  const addToBag = () => {
    if (!size && product.sizes.length) {
      setSizeError(true)
      document.getElementById('size-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    addItem(product, size, qty)
    return true
  }
  const buyNow = () => {
    if (!addToBag()) return
    setMiniCartOpen(false)
    navigate('/checkout')
  }
  const off = discountPercent(product)
  const freeDelivery = unitPrice(product) >= FREE_SHIPPING_THRESHOLD
  const avgRating = reviews?.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : null
  const details = [
    ['Fabric', product.fabric],
    ['Colour', product.color],
    ['Occasion', product.occasion],
    ['Category', categoryName],
    ['SKU', product.sku],
  ].filter(([, v]) => v)
  const bullets = [
    ...(product.description?.split(/(?<=\.)\s+/).filter(Boolean) ?? []),
    product.fabric && `Fabric: ${product.fabric} — handcrafted by our artisan partners.`,
    `Care: ${product.care || 'Gentle hand wash or dry clean. Store folded in muslin.'}`,
    `Easy 7-day returns on eligible styles. Free delivery on orders above ${formatINR(FREE_SHIPPING_THRESHOLD)}.`,
  ].filter(Boolean) as string[]

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else {
        await navigator.clipboard.writeText(url)
        showToast('Link copied')
      }
    } catch {
      // user cancelled share sheet
    }
  }

  const ctaLabel = soldOut ? 'Currently unavailable' : isPreOrder ? 'Pre-order now' : 'Add to Cart'

  return (
    <div className="container-boutique bg-white pb-10 pt-3">
      <Seo
        title={product.name}
        description={product.description}
        image={product.images[0]?.url}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          sku: product.sku,
          image: product.images.map((i) => i.url),
          description: product.description,
          color: product.color,
          material: product.fabric,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: unitPrice(product),
            availability: soldOut
              ? 'https://schema.org/OutOfStock'
              : isPreOrder
                ? 'https://schema.org/PreOrder'
                : 'https://schema.org/InStock',
          },
        }}
      />
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: categoryName, to: `/collections/${product.category_slug}` },
          { label: product.name },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_270px]">
        <div className="md:sticky md:top-4 md:self-start">
          <Gallery images={product.images} name={product.name} />
        </div>

        <div className="min-w-0">
          <Link to={`/collections/${product.category_slug}`} className="a-link text-sm">
            Visit the Boutique {categoryName} Store
          </Link>
          <h1 className="mt-1 font-sans text-xl font-normal leading-snug md:text-2xl">{product.name}</h1>
          {avgRating != null ? (
            <a href="#reviews" className="mt-1 flex items-center gap-2 text-sm">
              <span>{avgRating.toFixed(1)}</span>
              <Rating value={avgRating} />
              <span className="a-link">{reviews!.length} ratings</span>
            </a>
          ) : null}
          {product.is_best_seller ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs">
              <span className="bg-[#c45500] px-1.5 py-0.5 text-white">#1 Best Seller</span>
              <span>in {categoryName}</span>
            </p>
          ) : null}

          <hr className="my-3 border-border" />

          {off ? <span className="mb-2 inline-block rounded-sm bg-deal px-1.5 py-1 text-xs font-bold leading-none text-white">Limited time deal</span> : null}
          <Price product={product} size="lg" />
          <p className="mt-1 text-sm">Inclusive of all taxes</p>

          {isPreOrder ? (
            <p className="mt-3 flex items-center gap-2 rounded-md border border-border bg-[#f7f7f7] px-3 py-2 text-sm">
              <Sparkles className="h-4 w-4" /> Pre-order — expected to ship {product.pre_order?.expected_date}
            </p>
          ) : null}

          <div className="mt-4">
            <p className="mb-2 flex items-center gap-1.5 text-base font-bold">Offers</p>
            <div className="no-scrollbar flex gap-3 overflow-x-auto">
              {[
                { title: 'Festive Offer', text: 'Use code FESTIVE10 for 10% off your order' },
                { title: 'New Customer', text: 'Use code WELCOME500 for ₹500 off' },
                { title: 'Free Delivery', text: `On orders above ${formatINR(FREE_SHIPPING_THRESHOLD)}` },
              ].map((o) => (
                <div key={o.title} className="w-40 shrink-0 rounded-lg border border-border p-2.5 shadow-sm">
                  <p className="text-sm font-bold">{o.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug">{o.text}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-4 border-border" />

          <ul className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { icon: Truck, text: 'Free Delivery' },
              { icon: RefreshCw, text: '7 days Replacement' },
              { icon: Banknote, text: 'Pay on Delivery' },
              { icon: ShieldCheck, text: 'Authentic Handloom' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex flex-col items-center gap-1.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f2]">
                  <Icon className="h-5 w-5 text-link" strokeWidth={1.5} />
                </span>
                <span className="a-link">{text}</span>
              </li>
            ))}
          </ul>

          <hr className="my-4 border-border" />

          {product.color ? (
            <p className="flex items-center gap-2 text-sm">
              Colour: <span className="font-bold">{product.color}</span>
              <span className="h-4 w-4 rounded-full border border-ink/15" style={{ background: swatchColor(product.color) }} aria-hidden />
            </p>
          ) : null}

          {product.sizes.length > 0 ? (
            <div id="size-picker" className="mt-4">
              <SizeSelector sizes={product.sizes} value={size} onChange={setSize} error={sizeError} onOpenGuide={() => setGuide(true)} />
            </div>
          ) : null}

          <table className="mt-5 text-sm">
            <tbody>
              {details.map(([k, v]) => (
                <tr key={k}>
                  <th className="w-28 py-1 pr-4 text-left align-top font-bold">{k}</th>
                  <td className="py-1">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="my-4 border-border" />

          <h2 className="font-sans text-base font-bold">About this item</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        {/* Buy box */}
        <aside className="md:col-start-2 lg:col-start-auto lg:row-start-1 lg:col-end-4" aria-label="Buying options">
          <div className="rounded-lg border border-border p-4 lg:sticky lg:top-4">
            <PriceAmount amount={unitPrice(product)} size="lg" />
            <p className="mt-2 text-sm">
              {isPreOrder ? (
                <>Ships on <span className="font-bold">{product.pre_order?.expected_date}</span></>
              ) : (
                <>
                  <span className="a-link">{freeDelivery ? 'FREE delivery' : `${formatINR(99)} delivery`}</span>{' '}
                  <span className="font-bold">{deliveryDate(4)}</span>.
                </>
              )}
            </p>
            <p className="mt-2 flex items-start gap-1 text-xs">
              <MapPin className="h-4 w-4 shrink-0" /> <span className="a-link">Deliver to India — check your PIN code below</span>
            </p>

            <p className={`mt-3 text-lg ${soldOut ? 'text-deal' : 'text-success'}`}>
              {soldOut ? 'Currently unavailable.' : isPreOrder ? 'Available for pre-order' : 'In stock'}
            </p>

            {!soldOut ? (
              <>
                <label className="mt-3 inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-[#f0f2f2] px-2 text-[13px] shadow-sm">
                  Quantity:
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="bg-transparent outline-none">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mt-3 space-y-2">
                  <Button className="w-full" onClick={addToBag}>
                    {ctaLabel}
                  </Button>
                  <Button variant="buy" className="w-full" onClick={buyNow}>
                    Buy Now
                  </Button>
                </div>
              </>
            ) : null}

            <p className="mt-3 flex items-center gap-1.5 text-sm text-link">
              <Lock className="h-3.5 w-3.5 text-muted" /> Secure transaction
            </p>
            <dl className="mt-2 grid grid-cols-[80px_1fr] gap-y-1 text-xs">
              <dt className="text-muted">Ships from</dt>
              <dd>Boutique</dd>
              <dt className="text-muted">Sold by</dt>
              <dd className="a-link">Boutique Retail</dd>
              <dt className="text-muted">Returns</dt>
              <dd className="a-link">7-day return/replacement</dd>
              <dt className="text-muted">Payment</dt>
              <dd className="a-link">Secure transaction</dd>
            </dl>

            <div className="mt-4">
              <DeliveryCheck preOrder={isPreOrder} />
            </div>

            <hr className="my-4 border-border" />
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => toggleWishlist(product.slug)} aria-pressed={loved}>
                {loved ? 'In your Wish List' : 'Add to Wish List'}
              </Button>
              <Button variant="secondary" onClick={share} aria-label="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <hr className="mt-8 border-border" />
      <ProductCarousel title="Products related to this item" products={related} loading={relatedLoading} className="py-4 [&_.container-boutique]:px-0" />
      <hr className="border-border" />
      <Reviews productSlug={product.slug} />

      <SizeGuide open={guide} onClose={() => setGuide(false)} />
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="container-boutique pt-4 md:pt-8">
      <Skeleton className="mb-4 h-4 w-60" />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_270px]">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-2/3" />
          <Skeleton className="h-13 w-full" />
        </div>
      </div>
    </div>
  )
}
