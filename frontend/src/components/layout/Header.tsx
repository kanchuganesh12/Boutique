import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '../../types'
import { useShopStore } from '../../lib/store'
import { MiniCart } from './MiniCart'
import { SearchOverlay } from './SearchOverlay'
import { MobileNav } from './MobileNav'

type Props = {
  categories: Category[]
}

const NAV = [
  { label: 'Sarees', slug: 'sarees' },
  { label: 'Kurtas', slug: 'kurtas' },
  { label: 'Salwar Sets', slug: 'salwar-sets' },
  { label: 'Blouses', slug: 'blouses' },
  { label: 'Dupattas', slug: 'dupattas' },
  { label: 'Kids', slug: 'kids' },
]

export function Header({ categories }: Props) {
  const [compact, setCompact] = useState(false)
  const [mega, setMega] = useState<string | null>(null)
  const itemCount = useShopStore((s) => s.itemCount())
  const wishlist = useShopStore((s) => s.wishlist)
  const setMiniCartOpen = useShopStore((s) => s.setMiniCartOpen)
  const setSearchOpen = useShopStore((s) => s.setSearchOpen)
  const setMobileNavOpen = useShopStore((s) => s.setMobileNavOpen)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-[40] border-b border-border bg-ivory/95 backdrop-blur transition-all duration-200 ${
          compact ? 'shadow-md' : ''
        }`}
      >
        <div
          className={`container-boutique grid grid-cols-[1fr_auto_1fr] items-center gap-3 ${
            compact ? 'py-2' : 'py-3 md:py-4'
          }`}
        >
          <div className="flex items-center gap-1 justify-self-start">
            <button
              type="button"
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center md:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {NAV.map((item) => (
                <div
                  key={item.slug}
                  className="relative"
                  onMouseEnter={() => setMega(item.slug)}
                  onMouseLeave={() => setMega(null)}
                >
                  <Link
                    to={`/collections/${item.slug}`}
                    className="px-2 py-2 text-xs font-semibold uppercase tracking-label text-ink hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <Link to="/" className="justify-self-center text-center" aria-label="Boutique home">
            <span className="block font-display text-3xl leading-none tracking-wide text-ink md:text-4xl lg:text-5xl">
              Boutique
            </span>
          </Link>

          <div className="flex items-center justify-self-end gap-0.5">
            <button
              type="button"
              aria-label="Search"
              className="flex h-11 w-11 items-center justify-center"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative flex h-11 w-11 items-center justify-center">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>
            <Link to="/account" aria-label="Account" className="hidden h-11 w-11 items-center justify-center sm:flex">
              <User className="h-5 w-5" />
            </Link>
            <button
              type="button"
              aria-label="Open cart"
              className="relative flex h-11 w-11 items-center justify-center"
              onClick={() => setMiniCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {mega ? (
          <div
            className="absolute inset-x-0 top-full z-[50] hidden border-b border-border bg-white shadow-lg md:block"
            onMouseEnter={() => setMega(mega)}
            onMouseLeave={() => setMega(null)}
          >
            <div className="container-boutique grid grid-cols-[1fr_240px] gap-8 py-8">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-label text-muted">
                  Shop {NAV.find((n) => n.slug === mega)?.label}
                </p>
                <ul className="grid grid-cols-3 gap-2">
                  {categories
                    .filter((c) => c.slug === mega || !['new-arrivals', 'best-sellers'].includes(c.slug))
                    .slice(0, 9)
                    .map((c) => (
                      <li key={c.id}>
                        <Link
                          to={`/collections/${c.slug}`}
                          className="block rounded-md px-2 py-2 text-sm hover:bg-ivory-deep hover:text-primary"
                          onClick={() => setMega(null)}
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  <li>
                    <Link
                      to={`/collections/${mega}?price_max=3000`}
                      className="block rounded-md px-2 py-2 text-sm text-muted hover:text-primary"
                    >
                      Under ₹3,000
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/collections/${mega}?price_min=6000`}
                      className="block rounded-md px-2 py-2 text-sm text-muted hover:text-primary"
                    >
                      Above ₹6,000
                    </Link>
                  </li>
                </ul>
              </div>
              <Link to={`/collections/${mega}`} className="overflow-hidden rounded-lg">
                <img
                  src={
                    categories.find((c) => c.slug === mega)?.image ||
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=480&h=480&fit=crop'
                  }
                  alt=""
                  className="aspect-square h-full w-full object-cover"
                />
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <MiniCart />
      <SearchOverlay />
      <MobileNav categories={categories} />
    </>
  )
}

export function DrawerShell({
  open,
  onClose,
  side = 'right',
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  title: string
  children: React.ReactNode
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={onClose} />
      <aside
        className={`absolute top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-lg ${
          side === 'right' ? 'right-0' : 'left-0'
        }`}
        role="dialog"
        aria-modal
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="font-display text-2xl">{title}</h2>
          <button type="button" aria-label="Close" className="flex h-11 w-11 items-center justify-center" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  )
}
