import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function DressTheMoment() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[4/5] md:aspect-[21/9]">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1800&h=700&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-boutique max-w-xl text-ivory">
            <h2 className="font-display text-4xl md:text-5xl">Dress the Moment</h2>
            <p className="mt-3 text-ivory/85">
              Sarees, sets, and handpicked trends made for joyful celebrations.
            </p>
            <div className="mt-6">
              <Button>
                <Link to="/collections/party-wear">Shop the Edit</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
