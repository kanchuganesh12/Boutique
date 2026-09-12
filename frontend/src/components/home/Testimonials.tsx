import { useRef } from 'react'
import type { Review } from '../../types'

type Props = { reviews: Review[] }

export function Testimonials({ reviews }: Props) {
  const scroller = useRef<HTMLDivElement>(null)

  return (
    <section className="section-y bg-ivory">
      <div className="container-boutique">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">Genuine words from those who wear us</h2>
        </div>
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible"
        >
          {reviews.map((r) => (
            <blockquote
              key={r.id}
              className="w-[85%] shrink-0 snap-start rounded-lg border border-border bg-white p-6 md:w-auto"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory-deep font-semibold text-primary">
                  {r.avatar_initial || r.name[0]}
                </span>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  {r.verified ? (
                    <span className="rounded-full bg-ivory-deep px-2 py-0.5 text-[11px] text-muted">
                      Verified Buyer
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="font-display text-3xl leading-none text-accent">“</p>
              <p className="text-sm text-muted">{r.text}</p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
