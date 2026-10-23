import { useQuery } from '@tanstack/react-query'
import { CircleUserRound } from 'lucide-react'
import { api } from '../../lib/api'
import { Rating } from '../ui/Rating'

export function Reviews({ productSlug }: { productSlug: string }) {
  // Fall back to store-wide reviews when a product has none yet.
  const { data: own } = useQuery({ queryKey: ['reviews', productSlug], queryFn: () => api.reviews(productSlug) })
  const { data: all } = useQuery({ queryKey: ['reviews'], queryFn: () => api.reviews(), enabled: own?.length === 0 })
  const reviews = own?.length ? own : all ?? []
  if (!reviews.length) return null
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const share = (stars: number) => Math.round((reviews.filter((r) => Math.round(r.rating) === stars).length / reviews.length) * 100)

  return (
    <section id="reviews" className="py-6" aria-label="Customer reviews">
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div>
          <h2 className="font-sans text-2xl font-bold">Customer reviews</h2>
          <div className="mt-2 flex items-center gap-2">
            <Rating value={avg} className="[&_svg]:h-5 [&_svg]:w-5" />
            <span className="text-lg">{avg.toFixed(1)} out of 5</span>
          </div>
          <p className="mt-1 text-sm text-muted">{own?.length ? `${reviews.length} global ratings` : 'Store-wide ratings'}</p>
          <ul className="mt-4 space-y-2.5">
            {[5, 4, 3, 2, 1].map((stars) => (
              <li key={stars} className="flex items-center gap-3 text-sm">
                <span className="a-link w-12 shrink-0">{stars} star</span>
                <span className="h-5 flex-1 overflow-hidden rounded border border-[#e3e6e6] bg-[#f0f2f2] shadow-inner">
                  <span className="block h-full bg-[#de7921]" style={{ width: `${share(stars)}%` }} />
                </span>
                <span className="a-link w-9 shrink-0 text-right">{share(stars)}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-lg font-bold">Top reviews from India</h3>
          <ul className="mt-3 space-y-6">
            {reviews.slice(0, 6).map((r) => (
              <li key={r.id}>
                <p className="flex items-center gap-2 text-[13px]">
                  <CircleUserRound className="h-8 w-8 text-[#c7c7c7]" strokeWidth={1.25} />
                  {r.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Rating value={r.rating} />
                  {r.verified ? <span className="text-xs font-bold text-[#c45500]">Verified Purchase</span> : null}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
