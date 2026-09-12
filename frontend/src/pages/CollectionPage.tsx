import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { ProductCard, ProductCardSkeleton } from '../components/product/ProductCard'

export function CollectionPage() {
  const { slug = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const sort = params.get('sort') || 'featured'
  const priceMin = params.get('price_min') || undefined
  const priceMax = params.get('price_max') || undefined

  const categorySlugs = [
    'sarees',
    'kurtas',
    'salwar-sets',
    'blouses',
    'dupattas',
    'kids',
    'bottom-wear',
    'twine-cut-work',
  ]
  const isCategory = categorySlugs.includes(slug)

  const { data, isLoading } = useQuery({
    queryKey: ['products', slug, sort, priceMin, priceMax],
    queryFn: () =>
      api.products({
        category: isCategory ? slug : undefined,
        collection: isCategory ? undefined : slug,
        sort,
        price_min: priceMin,
        price_max: priceMax,
        limit: 24,
      }),
  })

  return (
    <div className="container-boutique section-y">
      <Helmet>
        <title>{slug.replace(/-/g, ' ')} | Boutique</title>
      </Helmet>
      <nav className="mb-4 text-sm text-muted">
        <Link to="/">Home</Link> / <span className="capitalize text-ink">{slug.replace(/-/g, ' ')}</span>
      </nav>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl capitalize sm:text-4xl">{slug.replace(/-/g, ' ')}</h1>
          <p className="mt-2 text-muted">
            {data ? `${data.total} styles` : 'Loading…'} crafted for comfort and celebration.
          </p>
        </div>
        <label className="flex w-full flex-col gap-1 text-sm text-muted sm:w-auto sm:flex-row sm:items-center">
          Sort
          <select
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-ink sm:ml-2 sm:w-auto"
            value={sort}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              next.set('sort', e.target.value)
              setParams(next)
            }}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="best_selling">Best Selling</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.items.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-ivory-deep p-12 text-center">
          <p className="font-display text-2xl">No pieces match</p>
          <p className="mt-2 text-muted">Try clearing filters or browsing another collection.</p>
          <Link to="/" className="mt-4 inline-block text-primary underline">
            Back home
          </Link>
        </div>
      )}
    </div>
  )
}
