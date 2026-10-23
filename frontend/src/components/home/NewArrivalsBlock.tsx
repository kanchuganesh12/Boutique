import { Link } from 'react-router-dom'
import type { Collection, Product } from '../../types'
import { ProductCarousel } from '../product/ProductCarousel'
import { ProductGrid } from '../product/ProductGrid'

type Props = {
  newArrivals: Product[]
  collections: Collection[]
  spotlights: Record<string, Product[]>
}

export function NewArrivalsBlock({ newArrivals, collections, spotlights }: Props) {
  const chips = collections.filter((c) => c.type !== 'price').slice(0, 10)

  return (
    <>
      <ProductCarousel
        eyebrow="Just in"
        title="New Arrivals"
        subtitle="Fresh weaves and cuts, just in from the atelier."
        products={newArrivals}
        viewAllTo="/collections/new-arrivals"
        className="pt-10 pb-6 lg:pt-20"
      />
      <div className="container-boutique pb-10 lg:pb-16">
        <div className="flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <Link
              key={c.id}
              to={`/collections/${c.slug}`}
              className="rounded-full border border-border bg-white px-4 py-2 text-sm text-muted transition hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <section className="section-y bg-ivory-deep">
        <div className="container-boutique space-y-14">
          {/* Best sellers already have their own carousel above; avoid repeating them. */}
          {Object.entries(spotlights)
            .filter(([key]) => key !== 'best-sellers')
            .map(([key, products]) => (
            <div key={key}>
              <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Spotlight</p>
                  <h2 className="font-display text-3xl capitalize sm:text-4xl">{key.replace(/-/g, ' ')}</h2>
                </div>
                <Link
                  to={`/collections/${key === 'designer-blouses' ? 'blouses' : key}`}
                  className="text-sm font-semibold uppercase tracking-label text-primary"
                >
                  View All
                </Link>
              </div>
              <ProductGrid products={products} columns={3} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
