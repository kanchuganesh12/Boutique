import { ArrowRight, Clock, Search, TrendingUp, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { formatINR, unitPrice, useShopStore } from '../../lib/store'
import { sized } from '../../lib/image'
import { Modal } from '../ui/Overlay'
import { Skeleton } from '../ui/Skeleton'

const TRENDING = ['Banarasi saree', 'Kota', 'Cutwork blouse', 'Party wear', 'Kids lehenga', 'Linen']

function useDebounced<T>(value: T, ms = 250) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return v
}

/** Bold the parts of `text` that match `q`. */
function Highlight({ text, q }: { text: string; q: string }): ReactNode {
  const term = q.trim()
  if (!term) return text
  const idx = text.toLowerCase().indexOf(term.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/20 text-inherit">{text.slice(idx, idx + term.length)}</mark>
      {text.slice(idx + term.length)}
    </>
  )
}

export function SearchOverlay() {
  const open = useShopStore((s) => s.isSearchOpen)
  const setOpen = useShopStore((s) => s.setSearchOpen)
  const recent = useShopStore((s) => s.recentSearches)
  const addRecent = useShopStore((s) => s.addRecentSearch)
  const clearRecent = useShopStore((s) => s.clearRecentSearches)
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const term = useDebounced(q.trim())

  const { data, isFetching } = useQuery({
    queryKey: ['search', term],
    queryFn: () => api.search(term),
    enabled: open && term.length > 1,
    staleTime: 60_000,
  })
  const { data: popular } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: api.bestSellers,
    enabled: open,
    staleTime: 5 * 60_000,
  })

  const close = () => setOpen(false)
  const submit = (value: string) => {
    const v = value.trim()
    if (!v) return
    addRecent(v)
    close()
    navigate(`/search?q=${encodeURIComponent(v)}`)
  }

  const showResults = term.length > 1

  return (
    <Modal open={open} onClose={close} title="Search" size="lg" hideTitle>
      <div className="px-4 pb-6 sm:px-6">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            submit(q)
          }}
          className="relative"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sarees, kurtas, fabrics, SKUs…"
            aria-label="Search products"
            className="h-14 w-full rounded-full border border-border bg-white pl-12 pr-12 [&::-webkit-search-cancel-button]:hidden text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          {q ? (
            <button type="button" aria-label="Clear search" onClick={() => setQ('')} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-ivory-deep">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </form>

        {!showResults ? (
          <div className="mt-6 space-y-7">
            {recent.length ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-label text-muted">Recent</p>
                  <button type="button" onClick={clearRecent} className="text-xs text-muted underline">
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button key={r} type="button" onClick={() => submit(r)} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                      <Clock className="h-3.5 w-3.5 text-muted" /> {r}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-label text-muted">Trending</p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((t) => (
                  <button key={t} type="button" onClick={() => setQ(t)} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                    <TrendingUp className="h-3.5 w-3.5 text-accent" /> {t}
                  </button>
                ))}
              </div>
            </div>
            {popular?.length ? (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-label text-muted">Popular right now</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {popular.slice(0, 4).map((p) => (
                    <Link key={p.id} to={`/products/${p.slug}`} onClick={close} className="group">
                      <span className="block aspect-[3/4] overflow-hidden rounded-md bg-ivory-deep">
                        <img src={sized(p.images[0]?.url, 300)} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                      </span>
                      <span className="mt-1.5 line-clamp-1 block text-sm">{p.name}</span>
                      <span className="text-sm font-semibold">{formatINR(unitPrice(p))}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-6" aria-live="polite">
            {data?.categories.length ? (
              <div className="mb-5 flex flex-wrap gap-2">
                {data.categories.map((c) => (
                  <Link key={c.slug} to={`/collections/${c.slug}`} onClick={close} className="rounded-full bg-ivory-deep px-3 py-1.5 text-sm hover:text-primary">
                    in <Highlight text={c.name} q={term} />
                  </Link>
                ))}
              </div>
            ) : null}
            {isFetching && !data ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-20 w-15" />
                    <div className="flex-1 space-y-2 pt-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.products.length ? (
              <>
                <ul className="divide-y divide-border">
                  {data.products.map((p) => (
                    <li key={p.id}>
                      <Link to={`/products/${p.slug}`} onClick={() => { addRecent(term); close() }} className="flex items-center gap-4 rounded-md px-2 py-2.5 hover:bg-ivory-deep">
                        <img src={sized(p.images[0]?.url, 160)} alt="" className="h-20 w-15 rounded object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-[15px] font-medium">
                            <Highlight text={p.name} q={term} />
                          </p>
                          <p className="text-xs text-muted">
                            {p.fabric} · <Highlight text={p.sku} q={term} />
                          </p>
                          <p className="mt-1 text-sm font-semibold">{formatINR(unitPrice(p))}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => submit(term)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-label text-primary">
                  See all results for “{term}” <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="py-10 text-center">
                <p className="font-display text-2xl">No results for “{term}”</p>
                <p className="mt-2 text-sm text-muted">Try a fabric (silk, cotton), a category, or a trending search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
