import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { formatINR, useShopStore } from '../lib/store'
import { Button } from '../components/ui/Button'

export function CartPage() {
  const items = useShopStore((s) => s.items)
  const updateQty = useShopStore((s) => s.updateQty)
  const removeItem = useShopStore((s) => s.removeItem)
  const subtotal = useShopStore((s) => s.subtotal())
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 99

  return (
    <div className="container-boutique section-y">
      <Helmet>
        <title>Cart | Boutique</title>
      </Helmet>
      <h1 className="mb-8 font-display text-3xl sm:text-4xl">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">Your cart is empty.</p>
          <Button className="mt-4">
            <Link to="/">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          <ul className="space-y-4">
            {items.map((item) => {
              const price = item.product.sale_price ?? item.product.price
              return (
                <li
                  key={`${item.product.slug}-${item.size}`}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-white p-3 sm:flex-row sm:p-4"
                >
                  <img
                    src={item.product.images[0]?.url}
                    alt=""
                    className="mx-auto h-36 w-28 shrink-0 rounded-md object-cover sm:mx-0 sm:h-28 sm:w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <Link to={`/products/${item.product.slug}`} className="font-medium hover:text-primary">
                      {item.product.name}
                    </Link>
                    {item.size ? <p className="text-sm text-muted">Size: {item.size}</p> : null}
                    <p className="mt-1 font-semibold">{formatINR(price)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="h-9 w-9 rounded border border-border"
                        onClick={() => updateQty(item.product.slug, item.size, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="h-9 w-9 rounded border border-border"
                        onClick={() => updateQty(item.product.slug, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-sm text-muted underline"
                        onClick={() => removeItem(item.product.slug, item.size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <aside className="h-fit rounded-lg border border-border bg-ivory-deep p-5 sm:p-6">
            <h2 className="font-display text-2xl">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : formatINR(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatINR(subtotal + shipping)}</span>
              </div>
            </div>
            <label className="mt-4 block text-sm">
              Promo code
              <input
                className="mt-1 min-h-11 w-full rounded-md border border-border bg-white px-3 py-2"
                placeholder="Enter code"
              />
            </label>
            <Button className="mt-4 w-full">
              <Link to="/checkout">Checkout</Link>
            </Button>
            <p className="mt-3 text-xs text-muted">Guest checkout supported. Easy 7-day returns.</p>
          </aside>
        </div>
      )}
    </div>
  )
}

export function CheckoutPage() {
  return (
    <div className="container-boutique section-y max-w-2xl">
      <Helmet>
        <title>Checkout | Boutique</title>
      </Helmet>
      <h1 className="mb-2 font-display text-3xl sm:text-4xl">Checkout</h1>
      <p className="mb-8 text-muted">
        Design-only checkout — no real payment credentials are collected.
      </p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          alert('Order placed (demo). Thank you!')
        }}
      >
        <input
          required
          placeholder="Full name"
          className="min-h-11 w-full rounded-md border border-border px-3 py-3"
        />
        <input
          required
          type="email"
          placeholder="Email"
          className="min-h-11 w-full rounded-md border border-border px-3 py-3"
        />
        <input
          required
          placeholder="Address"
          className="min-h-11 w-full rounded-md border border-border px-3 py-3"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="City"
            className="min-h-11 rounded-md border border-border px-3 py-3"
          />
          <input
            required
            placeholder="PIN code"
            className="min-h-11 rounded-md border border-border px-3 py-3"
          />
        </div>
        <p className="text-sm text-muted">Payment: Cash on delivery / UPI (demo)</p>
        <Button type="submit" className="w-full">
          Place order
        </Button>
      </form>
    </div>
  )
}

export function SimplePage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-boutique section-y">
      <Helmet>
        <title>{title} | Boutique</title>
      </Helmet>
      <h1 className="mb-4 font-display text-3xl sm:text-4xl">{title}</h1>
      <div className="max-w-2xl text-muted">{children}</div>
    </div>
  )
}
