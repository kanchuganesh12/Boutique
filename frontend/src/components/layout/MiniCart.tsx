import { ShoppingBag } from 'lucide-react'
import { cartTotals, formatINR, selectSubtotal, useShopStore } from '../../lib/store'
import { Button } from '../ui/Button'
import { Drawer } from '../ui/Overlay'
import { EmptyState } from '../ui/EmptyState'
import { CartLine } from './CartLine'
import { FreeShippingBar } from './FreeShippingBar'

export function MiniCart() {
  const open = useShopStore((s) => s.isMiniCartOpen)
  const setOpen = useShopStore((s) => s.setMiniCartOpen)
  const items = useShopStore((s) => s.items)
  const promo = useShopStore((s) => s.promo)
  const subtotal = useShopStore(selectSubtotal)
  const totals = cartTotals(subtotal, promo)
  const close = () => setOpen(false)
  const count = items.reduce((n, i) => n + i.quantity, 0)

  return (
    <Drawer
      open={open}
      onClose={close}
      title={count ? `Cart (${count})` : 'Cart'}
      footer={
        items.length ? (
          <div className="space-y-3">
            {totals.discount ? (
              <div className="flex justify-between text-sm text-success">
                <span>Promo {promo?.code}</span>
                <span>−{formatINR(totals.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-[15px]">
              <span>Subtotal</span>
              <span className="font-bold text-price">{formatINR(subtotal - totals.discount)}</span>
            </div>
            <p className="text-xs text-muted">Shipping & taxes calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button to="/cart" variant="secondary" onClick={close}>
                Go to Cart
              </Button>
              <Button to="/checkout" onClick={close}>
                Proceed to Buy
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            action={
              <Button to="/collections/new-arrivals" onClick={close}>
                Shop new releases
              </Button>
            }
          >
            Discover handcrafted sarees, kurtas and sets made for every celebration.
          </EmptyState>
        </div>
      ) : (
        <div className="space-y-5 p-4">
          <FreeShippingBar subtotal={subtotal} />
          <ul className="space-y-5">
            {items.map((item) => (
              <CartLine key={`${item.product.slug}-${item.size}`} item={item} compact onNavigate={close} />
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  )
}
