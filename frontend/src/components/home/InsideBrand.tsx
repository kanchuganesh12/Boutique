import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function InsideBrand() {
  const images = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=500&fit=crop',
  ]

  return (
    <section className="section-y bg-ivory-deep">
      <div className="container-boutique grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl md:text-4xl">Inside Boutique</h2>
          <p className="mt-4 max-w-md text-muted">
            Step into our world of handpicked weaves, curated colors, and everyday elegance.
          </p>
          <div className="mt-6">
            <Button>
              <Link to="/about">Shop All</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`w-full rounded-lg object-cover ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
