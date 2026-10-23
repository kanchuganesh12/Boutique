import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { sized } from '../../lib/image'
import { Button } from '../ui/Button'

type Slide = {
  eyebrow: string
  title: string
  support: string
  desktop: string
  cta: string
  to: string
  align: 'left' | 'right'
}

// Editorial content; move to a CMS/API when merchandisers need to edit it.
const SLIDES: Slide[] = [
  {
    eyebrow: 'Festive Edit 2026',
    title: 'Woven for the moments that matter',
    support: 'Handloom Banarasi and tissue silks, finished by master weavers.',
    desktop: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=2000&h=860&fit=crop',
    cta: 'Shop the festive edit',
    to: '/collections/party-wear',
    align: 'left',
  },
  {
    eyebrow: 'Just landed',
    title: 'New arrivals, fresh from the atelier',
    support: 'Breathable kurtas and sets in linen, Kota and cotton for every day.',
    desktop: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=2000&h=860&fit=crop',
    cta: 'Discover new in',
    to: '/collections/new-arrivals',
    align: 'right',
  },
  {
    eyebrow: 'Signature craft',
    title: 'Designer blouses, cut to celebrate',
    support: 'Twine cutwork and hand embroidery to pair with your heirloom drapes.',
    desktop: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=2000&h=860&fit=crop',
    cta: 'Shop blouses',
    to: '/collections/blouses',
    align: 'left',
  },
]

const INTERVAL = 7000

/** Amazon-style banner carousel: full-bleed images that fade into the page background, with side arrows. */
export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = SLIDES.length

  const go = useCallback((i: number) => setIndex((i + count) % count), [count])

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => go(index + 1), INTERVAL)
    return () => window.clearTimeout(id)
  }, [index, paused, go])

  return (
    <section
      className="relative mx-auto max-w-[1500px] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div className="relative h-[240px] sm:h-[340px] lg:h-[600px]">
        {SLIDES.map((s, i) => {
          const active = i === index
          return (
            <div
              key={s.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              className={clsx('absolute inset-0 transition-opacity duration-700', active ? 'opacity-100' : 'pointer-events-none opacity-0')}
            >
              <img
                src={sized(s.desktop, 1500)}
                srcSet={`${sized(s.desktop, 900)} 900w, ${sized(s.desktop, 1500)} 1500w, ${sized(s.desktop, 2000)} 2000w`}
                sizes="100vw"
                alt=""
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-nav/70 via-nav/20 to-transparent" />
              <div className="absolute inset-x-0 top-0 px-6 pt-5 sm:px-14 sm:pt-8 lg:px-24 lg:pt-10">
                <div className={clsx('max-w-xl text-white transition duration-700', active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0')}>
                  <p className="mb-1 text-xs font-bold text-buy sm:text-sm">{s.eyebrow}</p>
                  {i === 0 ? (
                    <h1 className="text-xl leading-tight sm:text-3xl lg:text-4xl">{s.title}</h1>
                  ) : (
                    <h2 className="text-xl leading-tight sm:text-3xl lg:text-4xl">{s.title}</h2>
                  )}
                  <p className="mt-2 hidden text-sm text-white/85 sm:block sm:text-base">{s.support}</p>
                  <Button to={s.to} tabIndex={active ? 0 : -1} className="mt-3 max-sm:min-h-8 max-sm:text-xs">
                    {s.cta}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
        {/* Fade into the grey page so the card grid can overlap the banner */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-page" />
      </div>

      {(['prev', 'next'] as const).map((d) => (
        <button
          key={d}
          type="button"
          aria-label={d === 'prev' ? 'Previous slide' : 'Next slide'}
          onClick={() => go(index + (d === 'prev' ? -1 : 1))}
          className={clsx(
            'absolute top-0 hidden h-[250px] w-20 items-center justify-center text-white focus-visible:outline-white sm:flex',
            d === 'prev' ? 'left-0' : 'right-0',
          )}
        >
          {d === 'prev' ? <ChevronLeft className="h-12 w-12" strokeWidth={1.25} /> : <ChevronRight className="h-12 w-12" strokeWidth={1.25} />}
        </button>
      ))}
    </section>
  )
}
