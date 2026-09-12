import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

type Props = {
  title: string
  subtitle?: string
  products: Product[]
  viewAllTo?: string
}

export function ProductCarousel({ title, subtitle, products, viewAllTo }: Props) {
  const scroller = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section className="section-y">
      <div className="container-boutique">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">
            <h2 className="font-display text-3xl text-ink md:text-4xl">{title}</h2>
            {subtitle ? <p className="mt-2 text-muted">{subtitle}</p> : null}
          </div>
          {viewAllTo ? (
            <Link
              to={viewAllTo}
              className="hidden shrink-0 text-sm font-semibold tracking-label uppercase text-primary underline-offset-4 hover:underline md:inline"
            >
              View All
            </Link>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scroll(-1)}
            className="absolute -left-2 top-1/3 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scroll(1)}
            className="absolute -right-2 top-1/3 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scroller}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="w-[42%] shrink-0 snap-start sm:w-[38%] md:w-[28%] lg:w-[23%]"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        {viewAllTo ? (
          <div className="mt-4 text-center md:hidden">
            <Link to={viewAllTo} className="text-sm font-semibold uppercase tracking-label text-primary">
              View All
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
