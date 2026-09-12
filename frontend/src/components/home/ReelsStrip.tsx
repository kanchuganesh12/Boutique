import { MessageCircle } from 'lucide-react'

const REELS = [
  {
    id: 1,
    thumb: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=700&fit=crop',
    label: 'Wedding week looks',
  },
  {
    id: 2,
    thumb: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=700&fit=crop',
    label: 'Saree drape tips',
  },
  {
    id: 3,
    thumb: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=700&fit=crop',
    label: 'Festive salwar edit',
  },
  {
    id: 4,
    thumb: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=700&fit=crop',
    label: 'Blouse styling',
  },
]

export function ReelsStrip() {
  return (
    <section className="section-y bg-ivory">
      <div className="container-boutique">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">Real voices. Real looks. Real stories.</h2>
          <p className="mt-2 text-muted">Swipe through customer reels and shop the looks.</p>
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {REELS.map((r) => (
            <button
              key={r.id}
              type="button"
              className="relative w-[42%] shrink-0 snap-start overflow-hidden rounded-lg sm:w-48"
            >
              <img src={r.thumb} alt="" className="aspect-[9/16] w-full object-cover" loading="lazy" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/20">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </span>
              </span>
              <span className="absolute bottom-3 left-3 right-3 text-left text-sm font-medium text-white drop-shadow">
                {r.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
