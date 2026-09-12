import { MapPin } from 'lucide-react'
import type { Store } from '../../types'

type Props = { stores: Store[] }

export function StoreLocations({ stores }: Props) {
  return (
    <section className="section-y bg-ivory-deep">
      <div className="container-boutique">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">Visit Our Stores</h2>
          <p className="mt-2 text-muted">Try on weaves in person with our stylists.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {stores.map((s) => (
            <article key={s.id} className="rounded-lg border border-border bg-ivory p-6">
              <MapPin className="mb-3 h-5 w-5 text-primary" strokeWidth={1.5} />
              <h3 className="font-display text-xl">{s.name}</h3>
              <p className="mt-2 text-sm text-muted">
                {s.address}
                <br />
                {s.city} {s.pincode}
              </p>
              {s.maps_url ? (
                <a
                  href={s.maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-label text-primary underline-offset-4 hover:underline"
                >
                  Get Directions
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
