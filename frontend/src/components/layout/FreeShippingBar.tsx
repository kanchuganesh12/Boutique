import { CircleCheck } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD, formatINR } from '../../lib/store'

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div className="text-sm">
      {remaining > 0 ? (
        <>
          <p>
            Add <span className="font-bold text-price">{formatINR(remaining)}</span> of eligible items to your order to qualify for FREE Delivery.
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e3e6e6]" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-[#067d62] transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
        </>
      ) : (
        <p className="flex items-start gap-1.5 text-[#067d62]">
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 fill-[#067d62] text-white" />
          <span>
            Your order is eligible for FREE Delivery. <span className="text-ink">Choose FREE Delivery option at checkout.</span>
          </span>
        </p>
      )}
    </div>
  )
}
