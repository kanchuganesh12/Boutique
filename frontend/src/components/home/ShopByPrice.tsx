import { Link } from 'react-router-dom'
import { sized } from '../../lib/image'
import type { Collection } from '../../types'
import { SectionHeading } from '../ui/SectionHeading'

type Props = { collections: Collection[] }

export function ShopByPrice({ collections }: Props) {
  const tiles = collections.filter((c) => c.type === 'price').slice(0, 4)

  return (
    <section className="section-y bg-ivory-deep">
      <div className="container-boutique">
        <SectionHeading title="Shop by Price" subtitle="Find the right piece for every budget and occasion." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {tiles.map((t) => (
            <Link
              key={t.id}
              to={`/collections/${t.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg bg-ivory"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={sized(t.image ?? undefined, 600)}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-display text-xl">{t.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted">{t.description}</p>
                <span className="mt-3 text-sm font-semibold uppercase tracking-label text-primary">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
