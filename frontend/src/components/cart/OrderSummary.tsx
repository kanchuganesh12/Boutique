import { Tag, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { cartTotals, formatINR, selectSubtotal, useShopStore } from '../../lib/store'
import { usePromo } from '../../hooks/usePromo'
import { sized } from '../../lib/image'
import { inputClasses } from '../ui/Field'

export function OrderSummary({ showItems, children }: { showItems?: boolean; children?: ReactNode }) {
  const items = useShopStore((s) => s.items)
  const subtotal = useShopStore(selectSubtotal)
  const { promo, apply, remove, error, loading } = usePromo()
  const [code, setCode] = useState('')
  const totals = cartTotals(subtotal, promo)

  return (
    <div className="bg-white p-5">
      <h2 className="font-sans text-lg font-bold">Order summary</h2>

      {showItems ? (
        <ul className="mt-4 space-y-3 border-b border-border pb-4">
          {items.map((i) => (
            <li key={`${i.product.slug}-${i.size}`} className="flex items-center gap-3 text-sm">
              <span className="relative shrink-0">
                <img src={sized(i.product.images[0]?.url, 120)} alt="" className="h-16 w-12 rounded object-cover" />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] text-white">
                  {i.quantity}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1">{i.product.name}</span>
                {i.size ? <span className="text-xs text-muted">Size {i.size}</span> : null}
              </span>
              <span className="font-medium">{formatINR((i.product.sale_price ?? i.product.price) * i.quantity)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4">
        {promo ? (
          <div className="flex items-center justify-between rounded-md bg-success/10 px-3 py-2 text-sm text-success">
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>
                <strong>{promo.code}</strong> — {promo.label}
              </span>
            </span>
            <button type="button" aria-label="Remove promo code" onClick={remove} className="flex h-8 w-8 items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              apply(code)
            }}
          >
            <label htmlFor="promo" className="mb-1.5 block text-sm font-medium">
              Promo code
            </label>
            <div className="flex gap-2">
              <input id="promo" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. FESTIVE10" className={inputClasses} aria-invalid={error ? true : undefined} />
              <button type="submit" disabled={loading || !code} className="shrink-0 rounded-lg border border-border bg-[#f0f2f2] px-4 text-sm shadow-sm transition hover:bg-[#e3e6e6] disabled:opacity-40">
                {loading ? '…' : 'Apply'}
              </button>
            </div>
            {error ? <p className="mt-1.5 text-xs text-sale">{error}</p> : <p className="mt-1.5 text-xs text-muted">Try FESTIVE10 or WELCOME500</p>}
          </form>
        )}
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatINR(totals.subtotal)}</dd>
        </div>
        {totals.discount ? (
          <div className="flex justify-between text-success">
            <dt>Discount</dt>
            <dd>−{formatINR(totals.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{totals.shipping === 0 ? <span className="text-success">Free</span> : formatINR(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-lg font-bold text-price">
          <dt>Total</dt>
          <dd>{formatINR(totals.total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  )
}
