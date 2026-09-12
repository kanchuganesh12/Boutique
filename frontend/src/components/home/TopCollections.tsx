import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '../../types'

type Props = { categories: Category[] }

export function TopCollections({ categories }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <section className="section-y bg-ivory">
      <div className="container-boutique">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">Top Collections</h2>
          <p className="mt-2 text-muted">
            Curated collections crafted for comfort, tradition, and family moments.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            className="absolute -left-2 top-1/3 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-white shadow-md lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            className="absolute -right-2 top-1/3 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-white shadow-md lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scroller}
            className="grid grid-cols-2 gap-4 sm:flex sm:snap-x sm:snap-mandatory sm:gap-6 sm:overflow-x-auto sm:pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/collections/${c.slug}`}
                className="group sm:w-36 sm:shrink-0 sm:snap-start"
              >
                <div className="mx-auto aspect-square overflow-hidden rounded-full bg-ivory-deep">
                  <img
                    src={c.image || ''}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 truncate text-center text-sm font-medium group-hover:text-primary">
                  {c.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
