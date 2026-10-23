import clsx from 'clsx'
import { formatINR } from '../../lib/store'
import type { Product } from '../../types'

export function discountPercent(p: Pick<Product, 'price' | 'sale_price'>) {
  if (p.sale_price == null || p.sale_price >= p.price) return 0
  return Math.round(((p.price - p.sale_price) / p.price) * 100)
}

/** Amazon-style price: superscript symbol, large whole number, then "M.R.P." strike-through. */
export function PriceAmount({ amount, size = 'sm', className }: { amount: number; size?: 'sm' | 'lg'; className?: string }) {
  const whole = formatINR(amount).replace('₹', '')
  return (
    <span className={clsx('inline-flex items-start leading-none text-ink', className)}>
      <span className={clsx('relative', size === 'lg' ? 'top-[3px] text-[13px]' : 'top-[2px] text-[12px]')}>₹</span>
      <span className={size === 'lg' ? 'text-[28px]' : 'text-[21px]'}>{whole}</span>
    </span>
  )
}

export function Price({
  product,
  size = 'sm',
  className,
}: {
  product: Pick<Product, 'price' | 'sale_price'>
  size?: 'sm' | 'lg'
  className?: string
}) {
  const off = discountPercent(product)
  return (
    <div className={clsx('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      {off && size === 'lg' ? <span className="text-[28px] font-light leading-none text-deal">-{off}%</span> : null}
      <PriceAmount amount={product.sale_price ?? product.price} size={size} />
      {off ? (
        <span className={clsx('text-muted', size === 'lg' ? 'basis-full text-xs' : 'text-xs')}>
          M.R.P: <span className="line-through">{formatINR(product.price)}</span>
          {size === 'sm' ? ` (${off}% off)` : null}
        </span>
      ) : null}
    </div>
  )
}
