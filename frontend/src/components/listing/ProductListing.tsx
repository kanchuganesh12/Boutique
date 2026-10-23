import { useInfiniteQuery, useQuery, keepPreviousData } from '@tanstack/react-query'
import { SlidersHorizontal, X, SearchX } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, type ProductQuery } from '../../lib/api'
import { Button } from '../ui/Button'
import { Drawer } from '../ui/Overlay'
import { EmptyState } from '../ui/EmptyState'
import { ErrorState } from '../ui/ErrorState'
import { Select } from '../ui/Field'
import { ProductGrid, ProductGridSkeleton } from '../product/ProductGrid'
import { FilterPanel } from './FilterPanel'
import { FILTER_KEYS, SORTS, activeFilters, type FilterKey } from './filters'

const PAGE_SIZE = 12

/** Filterable, sortable, paginated product grid. `base` scopes it (category, collection or search query). */
export function ProductListing({ base, header, label }: { base: ProductQuery; header?: React.ReactNode; label: string }) {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const sort = params.get('sort') || 'featured'

  const filters: ProductQuery = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) ?? undefined]))
  const query = { ...base, ...filters, sort }

  const listing = useInfiniteQuery({
    queryKey: ['products', query],
    queryFn: ({ pageParam }) => api.products({ ...query, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.limit < last.total ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
  })
  const { data: facets } = useQuery({
    queryKey: ['facets', base],
    queryFn: () => api.facets(base),
    staleTime: 5 * 60_000,
  })

  const update = (updates: Partial<Record<FilterKey | 'sort', string | undefined>>) => {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }
  const clearAll = () => update(Object.fromEntries(FILTER_KEYS.map((k) => [k, undefined])))

  const chips = activeFilters(params)
  const items = listing.data?.pages.flatMap((p) => p.items) ?? []
  const total = listing.data?.pages[0]?.total

  return (
    <div className="pb-16">
      {/* Results bar */}
      <div className="border-b border-border bg-white shadow-[0_2px_4px_-1px_rgb(0_0_0_/_0.12)]">
        <div className="container-boutique flex min-h-11 flex-wrap items-center justify-between gap-2 py-1.5">
          <p className="text-sm" aria-live="polite">
            {total != null ? (
              <>
                {total ? `1-${items.length} of ` : ''}
                {total} {total === 1 ? 'result' : 'results'} for <span className="font-bold text-[#c45500]">“{label}”</span>
              </>
            ) : (
              ' '
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-[#f0f2f2] px-3 text-[13px] shadow-sm lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              {chips.length ? <span className="font-bold text-link">({chips.length})</span> : null}
            </button>
            <Select
              label="Sort by:"
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="[&_label]:hidden sm:[&_label]:block [&_select]:h-8 [&_select]:min-h-0 [&_select]:rounded-lg [&_select]:bg-[#f0f2f2] [&_select]:py-0 [&_select]:text-[13px] [&_select]:shadow-sm"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="container-boutique pt-3">
        {header}
        <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            {chips.length ? (
              <button type="button" onClick={clearAll} className="a-link mb-1 flex items-center gap-1 text-sm">
                ‹ Clear all filters
              </button>
            ) : null}
            <FilterPanel facets={facets} params={params} onChange={update} />
          </aside>

          <div className="min-w-0">
            <h2 className="font-sans text-xl font-bold">Results</h2>
            <p className="mb-3 text-sm text-muted">Check each product page for other buying options.</p>

            {chips.length ? (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {chips.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => update(c.key === 'price' ? { price_min: undefined, price_max: undefined } : { [c.key]: undefined })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[#f0f2f2] px-3 py-1 text-xs hover:bg-[#e3e6e6]"
                  >
                    {c.label} <X className="h-3.5 w-3.5" aria-label="remove" />
                  </button>
                ))}
              </div>
            ) : null}

            {listing.isError ? (
              <ErrorState onRetry={() => listing.refetch()} />
            ) : listing.isLoading ? (
              <ProductGridSkeleton columns={3} />
            ) : items.length ? (
              <>
                <div className={listing.isPlaceholderData ? 'opacity-60 transition' : 'transition'}>
                  <ProductGrid products={items} columns={3} />
                </div>
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="text-sm text-muted">
                    Showing {items.length} of {total}
                  </p>
                  {listing.hasNextPage ? (
                    <Button variant="secondary" loading={listing.isFetchingNextPage} onClick={() => listing.fetchNextPage()} className="min-w-48">
                      Show more results
                    </Button>
                  ) : null}
                </div>
              </>
            ) : (
              <EmptyState
                icon={SearchX}
                title={`No results for “${label}”`}
                action={
                  chips.length ? (
                    <Button onClick={clearAll}>Clear filters</Button>
                  ) : (
                    <Button to="/collections/new-arrivals">Browse new releases</Button>
                  )
                }
              >
                {chips.length ? 'Try removing a filter or two to see more results.' : 'Try checking your spelling or use more general terms.'}
              </EmptyState>
            )}
          </div>
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="bottom"
        title="Filters"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={clearAll}>
              Clear all
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>
              Show {total ?? ''} {total === 1 ? 'result' : 'results'}
            </Button>
          </div>
        }
      >
        <div className="px-4">
          <FilterPanel facets={facets} params={params} onChange={update} />
        </div>
      </Drawer>
    </div>
  )
}
