import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '../../types'
import { useShopStore } from '../../lib/store'
import { DrawerShell } from './Header'

type Props = { categories: Category[] }

export function MobileNav({ categories }: Props) {
  const open = useShopStore((s) => s.isMobileNavOpen)
  const setOpen = useShopStore((s) => s.setMobileNavOpen)
  const [expanded, setExpanded] = useState<string | null>('shop')

  return (
    <DrawerShell open={open} onClose={() => setOpen(false)} side="left" title="Menu">
      <nav className="p-2">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-semibold uppercase tracking-label"
          onClick={() => setExpanded(expanded === 'shop' ? null : 'shop')}
        >
          Shop
          <ChevronDown className={`h-4 w-4 transition ${expanded === 'shop' ? 'rotate-180' : ''}`} />
        </button>
        {expanded === 'shop' ? (
          <ul className="pb-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/collections/${c.slug}`}
                  className="block px-5 py-2.5 text-sm text-muted hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          to="/account"
          className="block px-3 py-3 text-sm font-semibold uppercase tracking-label"
          onClick={() => setOpen(false)}
        >
          My Orders
        </Link>
        <Link
          to="/stores"
          className="block px-3 py-3 text-sm font-semibold uppercase tracking-label"
          onClick={() => setOpen(false)}
        >
          Stores
        </Link>
      </nav>
    </DrawerShell>
  )
}
