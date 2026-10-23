import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useDeferredValue, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { Category } from '../../types'
import { api } from '../../lib/api'
import { selectItemCount, useShopStore } from '../../lib/store'
import { CURATED_SLUGS } from '../../lib/queries'

type Props = {
  categories: Category[]
}

export function Header({ categories }: Props) {
  const itemCount = useShopStore(selectItemCount)
  const wishCount = useShopStore((s) => s.wishlist.length)
  const cartPulse = useShopStore((s) => s.cartPulse)
  const setMobileNavOpen = useShopStore((s) => s.setMobileNavOpen)
  const shopCategories = categories.filter((c) => !CURATED_SLUGS.includes(c.slug))

  return (
    <header className="relative z-[40] border-b border-border bg-white text-ink">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-3 gap-y-3 px-3 py-3 md:flex-nowrap md:gap-x-6 md:px-6 md:py-4">
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-blush md:hidden"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex shrink-0 flex-col leading-none" aria-label="Boutique home">
          <span className="font-serif text-[26px] italic tracking-wide text-brand md:text-[30px]">Boutique</span>
          <span className="mt-1 hidden text-[10px] uppercase tracking-[0.3em] text-muted md:block">Ethnic &middot; Couture</span>
        </Link>

        <HeaderSearch categories={shopCategories} className="order-last w-full md:order-none md:mx-auto md:max-w-2xl md:flex-1" />

        <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-2">
          <HeaderIcon to="/account" label="Profile" icon={<User className="h-[22px] w-[22px]" strokeWidth={1.6} />} />
          <HeaderIcon
            to="/wishlist"
            label="Wishlist"
            count={wishCount}
            icon={<Heart className="h-[22px] w-[22px]" strokeWidth={1.6} />}
            className="hidden sm:flex"
          />
          <HeaderIcon
            to="/cart"
            label="Bag"
            ariaLabel={`Bag, ${itemCount} items`}
            count={itemCount}
            pulse={cartPulse}
            icon={<ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.6} />}
          />
        </div>
      </div>

      {/* Sub nav */}
      <nav aria-label="Primary" className="border-t border-border/70">
        <ul className="no-scrollbar mx-auto flex h-11 max-w-[1500px] items-center gap-5 overflow-x-auto px-3 text-[12px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap md:justify-center md:gap-8 md:px-6">
          <SubNavLink to="/collections/new-arrivals" label="New In" highlight />
          <SubNavLink to="/collections/best-sellers" label="Bestsellers" />
          {shopCategories.map((c) => (
            <SubNavLink key={c.slug} to={`/collections/${c.slug}`} label={c.name} />
          ))}
          <SubNavLink to="/stores" label="Our Stores" />
          <SubNavLink to="/contact" label="Help" />
        </ul>
      </nav>
    </header>
  )
}

function HeaderIcon({
  to,
  label,
  ariaLabel,
  icon,
  count = 0,
  pulse = 0,
  className,
}: {
  to: string
  label: string
  ariaLabel?: string
  icon: ReactNode
  count?: number
  pulse?: number
  className?: string
}) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel ?? label}
      className={clsx('group flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-ink hover:text-brand', className)}
    >
      <span className="relative">
        {icon}
        {count > 0 ? (
          <span
            key={pulse}
            className={clsx(
              'absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white',
              pulse > 0 && 'bump',
            )}
          >
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </span>
      <span className="hidden text-[11px] font-medium tracking-wide md:block">{label}</span>
    </Link>
  )
}

function SubNavLink({ to, label, highlight }: { to: string; label: string; highlight?: boolean }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          clsx(
            'relative block py-3 transition-colors hover:text-brand',
            'after:absolute after:inset-x-0 after:bottom-1.5 after:h-[2px] after:origin-center after:scale-x-0 after:bg-brand after:transition-transform hover:after:scale-x-100',
            highlight && 'text-brand',
            isActive && 'text-brand after:scale-x-100',
          )
        }
      >
        {label}
      </NavLink>
    </li>
  )
}

/** Inline search with a department dropdown and live suggestions. */
function HeaderSearch({ categories, className }: { categories: Category[]; className?: string }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const onSearch = pathname === '/search'
  const [q, setQ] = useState(onSearch ? params.get('q') ?? '' : '')
  const [category, setCategory] = useState(onSearch ? params.get('category') ?? '' : '')
  const [open, setOpen] = useState(false)
  const addRecentSearch = useShopStore((s) => s.addRecentSearch)
  const recent = useShopStore((s) => s.recentSearches)
  const form = useRef<HTMLFormElement>(null)
  const term = useDeferredValue(q.trim())

  const { data } = useQuery({
    queryKey: ['suggest', term],
    queryFn: () => api.search(term),
    enabled: term.length >= 2,
    staleTime: 60_000,
  })

  const submit = (value: string) => {
    const query = value.trim()
    addRecentSearch(query)
    setOpen(false)
    setQ(query)
    const qs = new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}) })
    navigate(`/search?${qs}`)
  }

  const suggestions = term.length >= 2 ? (data?.products ?? []).slice(0, 8).map((p) => p.name) : recent
  const categoryName = categories.find((c) => c.slug === category)?.name ?? 'All'

  return (
    <form
      ref={form}
      role="search"
      className={clsx('relative', className)}
      onSubmit={(e) => {
        e.preventDefault()
        submit(q)
      }}
      onBlur={(e) => {
        if (!form.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <div className="flex h-11 items-center overflow-hidden rounded-full border border-border bg-blush/60 text-ink transition focus-within:border-brand focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(138,40,70,0.12)]">
        <Search className="ml-4 h-[18px] w-[18px] shrink-0 text-muted" strokeWidth={1.8} />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="What are you looking for?"
          aria-label="Search products"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 text-[14px] outline-none placeholder:text-muted"
        />
        <label className="relative hidden h-full shrink-0 items-center border-l border-border text-xs font-medium text-muted hover:text-brand sm:flex">
          <span className="pointer-events-none flex items-center gap-1 px-3">
            {categoryName}
            <ChevronDown className="h-3 w-3" />
          </span>
          <select
            aria-label="Search in category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="mr-1 h-9 shrink-0 rounded-full bg-brand px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover"
        >
          Search
        </button>
      </div>

      {open && suggestions.length ? (
        <ul className="absolute inset-x-0 top-full z-[50] mt-2 overflow-hidden rounded-2xl border border-border bg-white py-2 text-ink shadow-xl">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => submit(s)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-blush hover:text-brand"
              >
                <Search className="h-4 w-4 shrink-0 text-muted" />
                <span className="truncate">{s}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  )
}
