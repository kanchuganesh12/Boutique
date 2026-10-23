import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { ProductGrid } from '../product/ProductGrid'
import { SectionHeading } from '../ui/SectionHeading'

type Props = { occasions: Record<string, Product[]> }

const TABS = [
  { key: 'party-wear', label: 'Party Wear' },
  { key: 'holy-communion', label: 'Holy Communion' },
]

export function OccasionTabs({ occasions }: Props) {
  const [active, setActive] = useState(TABS[0].key)
  const products = occasions[active] ?? []

  return (
    <section className="section-y bg-ivory">
      <div className="container-boutique">
        <SectionHeading eyebrow="Shop by occasion" title="Occasion Collections" subtitle="Looks styled for the moments you gather for." />
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Occasions">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active === tab.key}
              onClick={() => setActive(tab.key)}
              className={`min-h-11 rounded-full px-4 py-2 text-xs font-semibold tracking-label uppercase transition sm:px-6 sm:text-sm ${
                active === tab.key
                  ? 'bg-primary text-white'
                  : 'border border-border text-muted hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" key={active} className="fade-in">
          <ProductGrid products={products.slice(0, 8)} />
        </div>
        <div className="mt-10 text-center">
          <Link to={`/collections/${active}`} className="text-sm font-semibold uppercase tracking-label text-primary underline-offset-4 hover:underline">
            View all {TABS.find((t) => t.key === active)?.label} →
          </Link>
        </div>
      </div>
    </section>
  )
}
