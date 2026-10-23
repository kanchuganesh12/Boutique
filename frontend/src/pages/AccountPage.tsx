import { Heart, MapPin, Package, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatINR, useShopStore } from '../lib/store'
import { sized } from '../lib/image'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Field } from '../components/ui/Field'
import { Seo } from '../components/ui/Seo'

export default function AccountPage() {
  const orders = useShopStore((s) => s.orders)
  const wishlistCount = useShopStore((s) => s.wishlist.length)
  const [sent, setSent] = useState(false)

  return (
    <div className="container-boutique pb-16 pt-6 md:pt-10">
      <Seo title="My Account" />
      <h1 className="mb-8 font-sans text-[28px] font-normal">My Account</h1>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-12">
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-white p-6">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ivory-deep text-primary">
              <User className="h-5 w-5" />
            </span>
            <h2 className="font-sans text-lg font-bold">Sign in</h2>
            <p className="mt-1 text-sm text-muted">Get a one-time code to track orders across devices.</p>
            {sent ? (
              <p className="mt-4 rounded-md bg-success/10 p-3 text-sm text-success">
                Sign-in is coming soon. Your guest orders on this device are listed here.
              </p>
            ) : (
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <Field label="Email or mobile" required autoComplete="username" />
                <Button type="submit" className="w-full">
                  Send code
                </Button>
              </form>
            )}
          </div>
          <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="Account">
            <Link to="/wishlist" className="flex items-center gap-2 rounded-lg border border-border bg-white p-4 hover:border-primary">
              <Heart className="h-4 w-4 text-primary" /> Wishlist ({wishlistCount})
            </Link>
            <Link to="/stores" className="flex items-center gap-2 rounded-lg border border-border bg-white p-4 hover:border-primary">
              <MapPin className="h-4 w-4 text-primary" /> Stores
            </Link>
          </nav>
        </aside>

        <section id="orders" aria-label="My orders">
          <h2 className="mb-4 font-sans text-xl font-bold">My orders</h2>
          {orders.length ? (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link to={`/order/${o.id}`} className="flex items-center gap-4 rounded-lg border border-border bg-white p-4 transition hover:border-primary">
                    {o.thumb ? <img src={sized(o.thumb, 120)} alt="" className="h-20 w-15 rounded object-cover" /> : null}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">Order #{o.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-muted">
                        {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.itemCount}{' '}
                        {o.itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatINR(o.total)}</p>
                      <span className="inline-block rounded-full bg-accent/15 px-2 py-0.5 text-xs capitalize text-ink">{o.status}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Package} title="No orders yet" action={<Button to="/collections/new-arrivals">Start shopping</Button>}>
              Orders you place as a guest on this device will appear here.
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  )
}
