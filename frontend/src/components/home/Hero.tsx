import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

const BANNER = {
  title: 'Discover Our Premium Collection',
  support: 'Stay Ahead With Our Next Exclusive Launches',
  image:
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&h=900&fit=crop',
  cta: 'Shop Now',
  to: '/collections/best-sellers',
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[16/10] md:aspect-[21/9]">
        <img
          src={BANNER.image}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-ink/70 via-ink/35 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-end pb-6 pt-10 sm:items-center sm:pb-0 sm:pt-0">
          <div className="container-boutique flex w-full justify-end">
            <div className="max-w-[min(100%,20rem)] text-right text-ivory sm:max-w-md md:max-w-lg">
              <h1 className="font-display text-2xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {BANNER.title}
              </h1>
              <p className="mt-2 text-xs text-ivory/85 sm:mt-3 sm:text-base">{BANNER.support}</p>
              <div className="mt-4 flex justify-end sm:mt-6">
                <Button>
                  <Link to={BANNER.to}>{BANNER.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
