import { useState } from 'react'
import type { Product } from '../../types'
import { ProductCard } from '../product/ProductCard'

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
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">Occasional Collections</h2>
          <p className="mt-2 text-muted">Looks styled for the moments you gather for.</p>
        </div>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`rounded-full px-3 py-2 text-xs font-semibold tracking-label uppercase transition sm:px-5 sm:text-sm ${
                active === tab.key
                  ? 'bg-primary text-white'
                  : 'border border-border text-muted hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
