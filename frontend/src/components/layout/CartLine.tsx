import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { CartItem } from '../../types'
import { FREE_SHIPPING_THRESHOLD, formatINR, unitPrice, useShopStore } from '../../lib/store'
import { sized } from '../../lib/image'
import { QuantityStepper } from '../ui/QuantityStepper'
import { PriceAmount } from '../ui/Price'

export function CartLine({ item, compact, onNavigate }: { item: CartItem; compact?: boolean; onNavigate?: () => void }) {
  const updateQty = useShopStore((s) => s.updateQty)
  const removeItem = useShopStore((s) => s.removeItem)
  const saveForLater = useShopStore((s) => s.saveForLater)
  const { product, size, quantity } = item
  const price = unitPrice(product)
  const preOrder = product.pre_order?.is_pre_order

  return (
    <li className="flex gap-3 sm:gap-4">
      <Link to={`/products/${product.slug}`} onClick={onNavigate} className="shrink-0 overflow-hidden bg-[#f7f7f7]">
        <img
          src={sized(product.images[0]?.url, 360)}
          alt={product.name}
          className={compact ? 'h-24 w-18 object-cover' : 'h-36 w-27 object-cover sm:h-44 sm:w-33'}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/products/${product.slug}`}
            onClick={onNavigate}
            className={clsx('line-clamp-2 hover:text-link-hover hover:underline', compact ? 'text-sm' : 'text-base sm:text-lg')}
          >
            {product.name}
          </Link>
          {!compact ? <PriceAmount amount={price * quantity} className="max-sm:hidden [&>span:last-child]:font-bold [&>span:last-child]:text-lg" /> : null}
        </div>
        {compact ? <p className="text-sm font-bold">{formatINR(price * quantity)}</p> : null}
        <p className={clsx('text-xs', preOrder ? 'text-muted' : 'text-success')}>
          {preOrder ? `Pre-order · ships ${product.pre_order?.expected_date}` : 'In stock'}
        </p>
        {!compact && price * quantity >= FREE_SHIPPING_THRESHOLD ? <p className="text-xs text-muted">Eligible for FREE Shipping</p> : null}
        {size || product.color ? (
          <p className="mt-0.5 text-xs">
            {size ? (
              <>
                <span className="font-bold">Size:</span> {size}{' '}
              </>
            ) : null}
            {product.color ? (
              <>
                <span className="font-bold">Colour:</span> {product.color}
              </>
            ) : null}
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
          <QuantityStepper size="sm" value={quantity} onChange={(n) => updateQty(product.slug, size, n)} />
          <span className="text-border" aria-hidden>|</span>
          <button type="button" onClick={() => removeItem(product.slug, size)} className="a-link">
            Delete
          </button>
          {!compact ? (
            <>
              <span className="text-border" aria-hidden>|</span>
              <button type="button" onClick={() => saveForLater(product.slug, size)} className="a-link">
                Save for later
              </button>
            </>
          ) : null}
        </div>
        {!compact ? <p className="mt-2 text-sm font-bold sm:hidden">{formatINR(price * quantity)}</p> : null}
      </div>
    </li>
  )
}
