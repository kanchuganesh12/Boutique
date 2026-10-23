import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { sized } from '../../lib/image'
import type { Category } from '../../types'
import { SectionHeading } from '../ui/SectionHeading'

type Props = { categories: Category[] }

export function TopCollections({ categories }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <section className="section-y bg-ivory">
      <div className="container-boutique">
        <SectionHeading title="Top Collections" subtitle="Curated collections crafted for comfort, tradition, and family moments." />

        <div className="relative">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/3 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-white shadow-md lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/3 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-white shadow-md lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scroller}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-6 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/collections/${c.slug}`}
                className="group w-24 shrink-0 snap-start sm:w-36"
              >
                <div className="mx-auto aspect-square overflow-hidden rounded-full bg-ivory-deep">
                  <img
                    src={sized(c.image ?? undefined, 300)}
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
