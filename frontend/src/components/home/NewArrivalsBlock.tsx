import { Link } from 'react-router-dom'
import type { Collection, Product } from '../../types'
import { ProductCarousel } from '../product/ProductCarousel'
import { ProductCard } from '../product/ProductCard'

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
        title="New Arrivals"
        subtitle="Fresh weaves and cuts, just in from the atelier."
        products={newArrivals}
        viewAllTo="/collections/new-arrivals"
      />
      <div className="container-boutique pb-10">
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
          {Object.entries(spotlights).map(([key, products]) => (
            <div key={key}>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-3xl capitalize">
                  {key.replace(/-/g, ' ')}
                </h2>
                <Link
                  to={`/collections/${key === 'designer-blouses' ? 'blouses' : 'best-sellers'}`}
                  className="text-sm font-semibold uppercase tracking-label text-primary"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
