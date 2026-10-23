import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import type { ProductImage } from '../../types'
import { sized, srcSet } from '../../lib/image'
import { Modal } from '../ui/Overlay'

/** Desktop: thumbnails + hover zoom. Mobile: swipeable slides with dots. Both: fullscreen lightbox. */
export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [lightbox, setLightbox] = useState(false)
  const track = useRef<HTMLDivElement>(null)

  const goTo = (i: number) => {
    const idx = (i + images.length) % images.length
    setActive(idx)
    const el = track.current
    el?.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="lg:grid lg:grid-cols-[80px_1fr] lg:gap-4">
      {/* Thumbnails (desktop) */}
      <div className="hidden flex-col gap-3 lg:flex">
        {images.map((img, i) => (
          <button
            key={img.url}
            type="button"
            aria-label={`Show image ${i + 1}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={clsx('aspect-[3/4] overflow-hidden rounded-md border-2 transition', i === active ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100')}
          >
            <img src={sized(img.url, 160)} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="relative">
        {/* Desktop main image with zoom */}
        <button
          type="button"
          aria-label="Open fullscreen image"
          onClick={() => setLightbox(true)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
          }}
          onMouseLeave={() => setZoom(null)}
          className="relative hidden aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-lg bg-ivory-deep lg:block"
        >
          <img
            src={sized(images[active]?.url, 1200)}
            srcSet={srcSet(images[active]?.url, [800, 1200, 1600])}
            sizes="45vw"
            alt={images[active]?.alt || name}
            fetchPriority="high"
            className="h-full w-full object-cover transition-transform duration-200"
            style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
          <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
            <Expand className="h-4 w-4" />
          </span>
        </button>

        {/* Mobile swipe track */}
        <div
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget
            setActive(Math.round(el.scrollLeft / el.clientWidth))
          }}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto sm:mx-0 sm:rounded-lg lg:hidden"
        >
          {images.map((img, i) => (
            <button key={img.url} type="button" onClick={() => setLightbox(true)} aria-label={`Open image ${i + 1} fullscreen`} className="aspect-[3/4] w-full shrink-0 snap-center bg-ivory-deep">
              <img
                src={sized(img.url, 800)}
                srcSet={srcSet(img.url, [480, 800, 1200])}
                sizes="100vw"
                alt={img.alt || name}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        {images.length > 1 ? (
          <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
            {images.map((img, i) => (
              <button key={img.url} type="button" aria-label={`Image ${i + 1}`} onClick={() => goTo(i)} className="flex h-6 items-center px-0.5">
                <span className={clsx('block h-1.5 rounded-full transition-all', i === active ? 'w-5 bg-primary' : 'w-1.5 bg-border')} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <Modal open={lightbox} onClose={() => setLightbox(false)} title={name} size="full" hideTitle>
        <div className="relative flex h-full items-center justify-center bg-ivory px-2 pb-6">
          <img src={sized(images[active]?.url, 1600)} alt={images[active]?.alt || name} className="max-h-full max-w-full object-contain" />
          {images.length > 1 ? (
            <>
              <button type="button" aria-label="Previous image" onClick={() => goTo(active - 1)} className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Next image" onClick={() => goTo(active + 1)} className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}
