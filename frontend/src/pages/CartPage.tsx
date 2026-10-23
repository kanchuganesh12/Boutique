import { useQuery } from '@tanstack/react-query'
import { ShoppingCart } from 'lucide-react'
import { api } from '../lib/api'
import { cartTotals, formatINR, selectItemCount, selectSubtotal, useShopStore } from '../lib/store'
import { sized } from '../lib/image'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Seo } from '../components/ui/Seo'
import { CartLine } from '../components/layout/CartLine'
import { FreeShippingBar } from '../components/layout/FreeShippingBar'
import { OrderSummary } from '../components/cart/OrderSummary'
import { ProductCarousel } from '../components/product/ProductCarousel'

export default function CartPage() {
  const items = useShopStore((s) => s.items)
  const saved = useShopStore((s) => s.savedForLater)
  const moveToCart = useShopStore((s) => s.moveToCart)
  const removeSaved = useShopStore((s) => s.removeSaved)
  const count = useShopStore(selectItemCount)
  const subtotal = useShopStore(selectSubtotal)
  const promo = useShopStore((s) => s.promo)
  const { total } = cartTotals(subtotal, promo)
  const { data: bestSellers, isLoading } = useQuery({ queryKey: ['best-sellers'], queryFn: api.bestSellers, staleTime: 5 * 60_000 })

  const subtotalLabel = (
    <>
      Subtotal ({count} {count === 1 ? 'item' : 'items'}): <span className="font-bold">{formatINR(subtotal)}</span>
    </>
  )

  return (
    <div className="page-bottom-spacer bg-page pb-6">
      <Seo title="Shopping Cart" />
      <div className="container-boutique pt-4">
        {items.length === 0 ? (
          <div className="bg-white p-5">
            <EmptyState icon={ShoppingCart} title="Your Boutique Cart is empty" action={<Button to="/collections/new-arrivals">Shop today’s deals</Button>}>
              Your shopping cart is waiting. Give it purpose — fill it with sarees, kurtas, salwar sets and more.
            </EmptyState>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            <section className="bg-white px-5 pb-4 pt-5" aria-label="Shopping Cart">
              <div className="flex items-end justify-between border-b border-border pb-1">
                <div>
                  <h1 className="font-sans text-[28px] font-normal leading-tight">Shopping Cart</h1>
                </div>
                <span className="hidden text-sm text-muted sm:block">Price</span>
              </div>
              <ul className="divide-y divide-border [&>li]:py-4">
                {items.map((item) => (
                  <CartLine key={`${item.product.slug}-${item.size}`} item={item} />
                ))}
              </ul>
              <p className="border-t border-border pt-3 text-right text-lg">{subtotalLabel}</p>
            </section>

            <aside className="space-y-5 lg:self-start">
              <div className="bg-white p-5">
                <FreeShippingBar subtotal={subtotal} />
                <p className="mt-3 text-lg">{subtotalLabel}</p>
                <Button to="/checkout" className="mt-3 w-full max-md:hidden">
                  Proceed to Buy
                </Button>
              </div>
              <OrderSummary>
                <p className="mt-3 text-xs text-muted">Guest checkout · UPI, cards &amp; Pay on Delivery · Easy 7-day returns</p>
              </OrderSummary>
            </aside>
          </div>
        )}

        {saved.length ? (
          <section className="mt-5 bg-white p-5" aria-label="Saved for later">
            <h2 className="mb-4 border-b border-border pb-2 font-sans text-xl font-bold">
              Saved for later ({saved.length} {saved.length === 1 ? 'item' : 'items'})
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {saved.map((i) => (
                <li key={`${i.product.slug}-${i.size}`} className="rounded-lg border border-border p-3">
                  <img src={sized(i.product.images[0]?.url, 300)} alt="" className="aspect-[3/4] w-full object-cover" />
                  <p className="a-link mt-2 line-clamp-2 text-sm">{i.product.name}</p>
                  <p className="mt-1 text-sm font-bold">{formatINR(i.product.sale_price ?? i.product.price)}</p>
                  <Button variant="secondary" onClick={() => moveToCart(i.product.slug, i.size)} className="mt-2 w-full">
                    Move to cart
                  </Button>
                  <button type="button" onClick={() => removeSaved(i.product.slug, i.size)} className="a-link mt-1.5 text-xs">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <ProductCarousel
        title={items.length ? 'Customers who shopped for items in your cart also bought' : 'Best Sellers'}
        products={bestSellers?.filter((p) => !items.some((i) => i.product.slug === p.slug))}
        loading={isLoading}
        viewAllTo="/collections/best-sellers"
        className="pt-5"
      />

      {items.length ? (
        <div className="fixed inset-x-0 bottom-0 z-[40] border-t border-border bg-white p-3 shadow-lg safe-bottom md:hidden">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-muted">Total</p>
              <p className="font-bold">{formatINR(total)}</p>
            </div>
            <Button to="/checkout" className="flex-1">
              Proceed to Buy ({count} {count === 1 ? 'item' : 'items'})
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
