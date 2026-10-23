import { useQuery } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { formatINR } from '../lib/store'
import { Button } from '../components/ui/Button'
import { Seo } from '../components/ui/Seo'
import { Skeleton } from '../components/ui/Skeleton'
import { ErrorState } from '../components/ui/ErrorState'

export default function OrderConfirmationPage() {
  const { id = '' } = useParams()
  const { data: order, isLoading, isError, refetch } = useQuery({ queryKey: ['order', id], queryFn: () => api.order(id) })

  if (isLoading) {
    return (
      <div className="container-boutique section-y max-w-2xl space-y-4">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
  if (isError || !order) return <ErrorState onRetry={() => refetch()} message="We couldn’t load this order." />

  const shortId = order.id.slice(-8).toUpperCase()

  return (
    <div className="container-boutique section-y max-w-2xl">
      <Seo title="Order confirmed" />
      <div className="fade-in text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" strokeWidth={1.5} />
        <h1 className="mt-4 font-sans text-[28px] font-normal">Thank you, {order.contact_name.split(' ')[0]}!</h1>
        <p className="mt-2 text-muted">
          Your order <strong className="text-ink">#{shortId}</strong> is confirmed. A confirmation has been sent to {order.contact_email}.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-border bg-white p-6">
        <h2 className="font-sans text-lg font-bold">Order details</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-4 py-3">
              <span>
                {i.name}
                <span className="block text-xs text-muted">
                  {i.size ? `Size ${i.size} · ` : ''}Qty {i.quantity}
                </span>
              </span>
              <span className="font-medium">{formatINR(i.unit_price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatINR(order.subtotal)}</dd>
          </div>
          {order.discount ? (
            <div className="flex justify-between text-success">
              <dt>Discount {order.promo_code ? `(${order.promo_code})` : ''}</dt>
              <dd>−{formatINR(order.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd>{order.shipping ? formatINR(order.shipping) : 'Free'}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatINR(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-6 rounded-md bg-ivory-deep p-4 text-sm">
          <p className="font-semibold">Delivering to</p>
          <p className="text-muted">
            {order.contact_name}, {order.address_line1}
            {order.address_line2 ? `, ${order.address_line2}` : ''}, {order.city}, {order.state} {order.pincode}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/account#orders" variant="secondary">
          View my orders
        </Button>
        <Button to="/collections/new-arrivals">Continue shopping</Button>
      </div>
    </div>
  )
}
