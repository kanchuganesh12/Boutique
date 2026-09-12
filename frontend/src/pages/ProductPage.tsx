import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../lib/api'
import { formatINR, useShopStore } from '../lib/store'
import { Button } from '../components/ui/Button'
import { Heart } from 'lucide-react'

export function ProductPage() {
  const { slug = '' } = useParams()
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.product(slug),
  })
  const [size, setSize] = useState<string>()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const addItem = useShopStore((s) => s.addItem)
  const wishlist = useShopStore((s) => s.wishlist)
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)

  if (isLoading) {
    return <div className="container-boutique section-y text-muted">Loading product…</div>
  }
  if (isError || !product) {
    return (
      <div className="container-boutique section-y">
        <p>Product not found.</p>
        <Link to="/" className="text-primary underline">
          Home
        </Link>
      </div>
    )
  }

  const onSale = product.sale_price != null && product.sale_price < product.price
  const selectedSize = size || product.sizes[0]

  return (
    <div className="container-boutique section-y page-bottom-spacer">
      <Helmet>
        <title>{product.name} | Boutique</title>
      </Helmet>
      <nav className="mb-6 flex flex-wrap gap-x-1 text-sm text-muted">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/collections/${product.category_slug}`} className="capitalize">
          {product.category_slug}
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-ivory-deep">
            <img
              src={product.images[activeImg]?.url}
              alt={product.images[activeImg]?.alt || product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`h-20 w-16 shrink-0 overflow-hidden rounded border ${
                  i === activeImg ? 'border-primary' : 'border-border'
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">SKU {product.sku}</p>
          <p className="mt-4 text-xl">
            {onSale ? (
              <>
                <span className="font-bold text-sale">{formatINR(product.sale_price as number)}</span>{' '}
                <span className="text-base text-muted line-through">{formatINR(product.price)}</span>
              </>
            ) : (
              <span className="font-bold">{formatINR(product.price)}</span>
            )}
          </p>
          {product.pre_order?.is_pre_order ? (
            <p className="mt-2 text-sm text-preorder">
              Pre-Order — expected {product.pre_order.expected_date}
            </p>
          ) : null}

          <p className="mt-6 text-muted">{product.description}</p>

          {product.sizes.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-label">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-h-11 min-w-11 rounded-md border px-3 text-sm ${
                      selectedSize === s ? 'border-primary bg-primary text-white' : 'border-border'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button type="button" className="h-11 w-11" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button type="button" className="h-11 w-11" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <Button className="!hidden flex-1 md:!inline-flex" onClick={() => addItem(product, selectedSize, qty)}>
              Add to Cart
            </Button>
            <button
              type="button"
              aria-label="Wishlist"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border"
              onClick={() => toggleWishlist(product.slug)}
            >
              <Heart
                className={`h-5 w-5 ${wishlist.includes(product.slug) ? 'fill-primary text-primary' : ''}`}
              />
            </button>
          </div>

          <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
            <details open>
              <summary className="cursor-pointer font-semibold">Delivery & Returns</summary>
              <p className="mt-2 text-muted">
                Complimentary shipping above ₹2,999. Easy 7-day returns on eligible styles.
              </p>
            </details>
            <details>
              <summary className="cursor-pointer font-semibold">Fabric & Care</summary>
              <p className="mt-2 text-muted">
                {product.fabric || 'See label'} · {product.care || 'Follow care instructions'}
              </p>
            </details>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[40] border-t border-border bg-ivory p-3 shadow-lg safe-bottom md:hidden">
        <Button className="w-full" onClick={() => addItem(product, selectedSize, qty)}>
          Add to Cart — {formatINR(product.sale_price ?? product.price)}
        </Button>
      </div>
    </div>
  )
}
