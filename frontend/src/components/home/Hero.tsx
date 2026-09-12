import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

const SLIDES = [
  {
    id: 1,
    eyebrow: 'Festive Edit',
    title: 'Premium Collection',
    support: 'Handpicked weaves for celebrations that matter.',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&h=900&fit=crop',
    cta: 'Shop Now',
    to: '/collections/best-sellers',
  },
  {
    id: 2,
    eyebrow: 'New Arrivals',
    title: 'Dress the Moment',
    support: 'Sarees, sets, and blouses made for joyful days.',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&h=900&fit=crop',
    cta: 'Explore New',
    to: '/collections/new-arrivals',
  },
  {
    id: 3,
    eyebrow: 'Designer Cuts',
    title: 'Blouse Studio',
    support: 'Cutwork and twine details, ready to pair.',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600&h=900&fit=crop',
    cta: 'Shop Blouses',
    to: '/collections/blouses',
  },
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="relative overflow-hidden bg-ivory-deep" onMouseEnter={() => {}}>
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/5] lg:aspect-[16/10]">
          <img
            src={slide.image}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-10 md:px-12 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-label text-accent">{slide.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
            Discover Our
            <br />
            {slide.title}
          </h1>
          <p className="mt-4 max-w-md text-muted">{slide.support}</p>
          <div className="mt-8">
            <Button>
              <Link to={slide.to}>{slide.cta}</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white"
              onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-primary' : 'bg-border'}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white"
              onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
