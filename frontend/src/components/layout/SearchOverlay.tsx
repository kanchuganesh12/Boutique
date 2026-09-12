import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { formatINR, useShopStore } from '../../lib/store'
import type { Product } from '../../types'
import { DrawerShell } from './Header'

export function SearchOverlay() {
  const open = useShopStore((s) => s.isSearchOpen)
  const setOpen = useShopStore((s) => s.setSearchOpen)
  const [q, setQ] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const popular = ['Sarees', 'Kurtas', 'Best Sellers', 'Blouses']

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(async () => {
      if (!q.trim()) {
        setProducts([])
        return
      }
      try {
        const res = await api.search(q)
        setProducts(res.products)
      } catch {
        setProducts([])
      }
    }, 250)
    return () => window.clearTimeout(t)
  }, [q, open])

  return (
    <DrawerShell open={open} onClose={() => setOpen(false)} side="right" title="Search">
      <div className="p-4 space-y-6">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search sarees, kurtas, SKUs…"
          className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
        />
        {!q && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-label text-muted">Popular</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                  onClick={() => setQ(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        <ul className="space-y-3">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                to={`/products/${p.slug}`}
                className="flex gap-3 rounded-md p-2 hover:bg-ivory-deep"
                onClick={() => setOpen(false)}
              >
                <img src={p.images[0]?.url} alt="" className="h-16 w-12 rounded object-cover" />
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-sm text-muted">{formatINR(p.sale_price ?? p.price)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </DrawerShell>
  )
}
