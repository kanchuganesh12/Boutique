import { ChevronRight, CircleUserRound, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Category, Collection } from '../../types'
import { useShopStore } from '../../lib/store'
import { CURATED_SLUGS } from '../../lib/queries'
import { Drawer } from '../ui/Overlay'

type Props = { categories: Category[]; collections: Collection[] }

/** Amazon-style "All" menu: dark greeting header, then sectioned link lists. */
export function MobileNav({ categories, collections }: Props) {
  const open = useShopStore((s) => s.isMobileNavOpen)
  const setOpen = useShopStore((s) => s.setMobileNavOpen)
  const close = () => setOpen(false)

  const sections = [
    {
      title: 'Trending',
      links: [
        { label: 'Best Sellers', to: '/collections/best-sellers' },
        { label: 'New Releases', to: '/collections/new-arrivals' },
      ],
    },
    {
      title: 'Shop by Department',
      links: categories
        .filter((c) => !CURATED_SLUGS.includes(c.slug))
        .map((c) => ({ label: c.name, to: `/collections/${c.slug}` })),
    },
    {
      title: 'Collections',
      links: collections
        .filter((c) => c.type === 'occasion' || c.type === 'curated')
        .slice(0, 6)
        .map((c) => ({ label: c.name, to: `/collections/${c.slug}` })),
    },
    {
      title: 'Help & Settings',
      links: [
        { label: 'Your Account', to: '/account' },
        { label: 'Your Orders', to: '/account#orders' },
        { label: 'Your Wish List', to: '/wishlist' },
        { label: 'Store Locator', to: '/stores' },
        { label: 'Customer Service', to: '/contact' },
      ],
    },
  ].filter((s) => s.links.length)

  return (
    <Drawer open={open} onClose={close} side="left" title="Menu" hideTitle>
      <div className="flex items-center justify-between bg-nav-2 px-5 py-3.5 text-white">
        <Link to="/account" onClick={close} className="flex items-center gap-2.5 text-lg font-bold">
          <CircleUserRound className="h-7 w-7" /> Hello, sign in
        </Link>
        <button type="button" aria-label="Close menu" onClick={close} className="flex h-9 w-9 items-center justify-center">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="pb-6" aria-label="All departments">
        {sections.map((s, i) => (
          <div key={s.title} className={i ? 'border-t border-border' : undefined}>
            <p className="px-8 pb-1 pt-4 text-lg font-bold text-ink">{s.title}</p>
            <ul>
              {s.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} onClick={close} className="flex items-center justify-between px-8 py-3 text-sm text-ink hover:bg-[#eaeded]">
                    {l.label}
                    <ChevronRight className="h-4 w-4 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </Drawer>
  )
}
