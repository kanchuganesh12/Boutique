import { Link } from 'react-router-dom'
import { formatINR, useShopStore } from '../../lib/store'
import { Button } from '../ui/Button'
import { DrawerShell } from './Header'

export function MiniCart() {
  const open = useShopStore((s) => s.isMiniCartOpen)
  const setOpen = useShopStore((s) => s.setMiniCartOpen)
  const items = useShopStore((s) => s.items)
  const updateQty = useShopStore((s) => s.updateQty)
  const removeItem = useShopStore((s) => s.removeItem)
  const subtotal = useShopStore((s) => s.subtotal())

  return (
    <DrawerShell open={open} onClose={() => setOpen(false)} title="Your Bag">
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-muted">Your bag is empty.</p>
          <Button onClick={() => setOpen(false)}>Continue shopping</Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 space-y-4 p-4">
            {items.map((item) => {
              const price = item.product.sale_price ?? item.product.price
              return (
                <li key={`${item.product.slug}-${item.size}`} className="flex gap-3">
                  <img
                    src={item.product.images[0]?.url}
                    alt=""
                    className="h-24 w-20 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    {item.size ? <p className="text-xs text-muted">Size: {item.size}</p> : null}
                    <p className="mt-1 text-sm font-semibold">{formatINR(price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded border border-border"
                        onClick={() => updateQty(item.product.slug, item.size, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded border border-border"
                        onClick={() => updateQty(item.product.slug, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-muted underline"
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
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>
              <Link to="/checkout">Checkout</Link>
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => setOpen(false)}>
              <Link to="/cart">View Cart</Link>
            </Button>
          </div>
        </div>
      )}
    </DrawerShell>
  )
}
