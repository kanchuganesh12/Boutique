import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { Product } from '../../types'
import { sized } from '../../lib/image'
import { Price } from '../ui/Price'
import { Skeleton } from '../ui/Skeleton'

type Props = {
  title: string
  eyebrow?: string
  subtitle?: string
  products?: Product[]
  loading?: boolean
  viewAllTo?: string
  className?: string
  /** `strip` shows images only (home page rows); `detail` adds name and price. */
  variant?: 'strip' | 'detail'
}

/** Amazon-style horizontally scrolling product row inside a white panel. */
export function ProductCarousel({ title, subtitle, products, loading, viewAllTo, className = 'section-y', variant = 'detail' }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update, products])

  const scroll = (dir: -1 | 1) => {
    const el = scroller.current
    el?.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  if (!loading && !products?.length) return null
  const itemWidth = variant === 'strip' ? 'w-[140px] md:w-[180px]' : 'w-[150px] md:w-[200px]'

  return (
    <section className={className} aria-label={title}>
      <div className="container-boutique">
        <div className="bg-white px-4 py-4 md:px-5">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="font-sans text-[19px] font-bold md:text-[21px]">{title}</h2>
            {viewAllTo ? (
              <Link to={viewAllTo} className="a-link text-sm">
                See more
              </Link>
            ) : null}
            {subtitle ? <p className="basis-full text-sm text-muted">{subtitle}</p> : null}
          </div>

          <div className="relative">
            {(['prev', 'next'] as const).map((d) => {
              const disabled = d === 'prev' ? edges.start : edges.end
              return (
                <button
                  key={d}
                  type="button"
                  aria-label={d === 'prev' ? 'Previous products' : 'Next products'}
                  onClick={() => scroll(d === 'prev' ? -1 : 1)}
                  disabled={disabled}
                  className={clsx(
                    'absolute top-[35%] z-10 hidden h-24 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-border bg-white/95 shadow-md hover:bg-white disabled:pointer-events-none disabled:opacity-0 lg:flex',
                    d === 'prev' ? 'left-0' : 'right-0',
                  )}
                >
                  {d === 'prev' ? <ChevronLeft className="h-7 w-7" /> : <ChevronRight className="h-7 w-7" />}
                </button>
              )
            })}

            <div ref={scroller} onScroll={update} className="no-scrollbar flex gap-3 overflow-x-auto md:gap-4">
              {loading
                ? Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={clsx('shrink-0', itemWidth)}>
                      <Skeleton className="aspect-[3/4]" />
                    </div>
                  ))
                : products!.map((p) => (
                    <Link key={p.id} to={`/products/${p.slug}`} className={clsx('group shrink-0', itemWidth)}>
                      <span className="block aspect-[3/4] overflow-hidden bg-[#f7f7f7]">
                        <img
                          src={sized(p.images[0]?.url, 400)}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover mix-blend-multiply"
                        />
                      </span>
                      {variant === 'detail' ? (
                        <>
                          <span className="a-link mt-2 line-clamp-2 text-sm group-hover:text-link-hover group-hover:underline">{p.name}</span>
                          <Price product={p} className="mt-1" />
                        </>
                      ) : null}
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
