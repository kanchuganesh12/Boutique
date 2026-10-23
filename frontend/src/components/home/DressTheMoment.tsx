import { sized } from '../../lib/image'
import { Button } from '../ui/Button'

export function DressTheMoment() {
  return (
    <section className="container-boutique section-y">
      <div className="grid overflow-hidden rounded-2xl bg-maroon-deep text-ivory md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto">
          <img
            src={sized('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=1200&fit=crop', 1000)}
            alt="Model in a festive silk saree"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-12 lg:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">The occasion edit</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">Dress the moment</h2>
          <p className="max-w-md text-ivory/80">
            Sarees, sets and handpicked trends for weddings, pujas and every joyful gathering in between —
            styled by our in-house team.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/collections/party-wear" variant="light">
              Party wear
            </Button>
            <Button to="/collections/holy-communion" variant="outline-light">
              Holy communion
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
