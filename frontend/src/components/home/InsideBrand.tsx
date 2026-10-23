import { sized } from '../../lib/image'
import { Button } from '../ui/Button'

const IMAGES = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=500&fit=crop',
]

const STATS = [
  { value: '120+', label: 'Weaver families' },
  { value: '40k', label: 'Happy customers' },
  { value: '4.8★', label: 'Average rating' },
]

export function InsideBrand() {
  return (
    <section className="section-y bg-ivory-deep">
      <div className="container-boutique grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Our story</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">Made by hand, worn with heart</h2>
          <p className="mt-5 max-w-md text-muted md:text-[17px]">
            Every piece begins on a loom in Varanasi, Kota or Kanchipuram. We work directly with weaver
            families, so craft stays alive and you get heirloom quality at honest prices.
          </p>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl text-primary">{s.value}</dd>
                <dd className="text-xs text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <Button to="/about" variant="secondary">
              Read our story
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {IMAGES.map((src, i) => (
            <img
              key={src}
              src={sized(src, 600)}
              alt=""
              className={`w-full rounded-lg object-cover ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'} ${i === 1 ? 'mt-10' : ''}`}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
