/** URL-driven listing state: every filter lives in the query string so pages are shareable and back-button friendly. */
export const FILTER_KEYS = ['size', 'color', 'fabric', 'occasion', 'availability', 'price_min', 'price_max'] as const
export type FilterKey = (typeof FILTER_KEYS)[number]

export const PRICE_RANGES = [
  { label: 'Under ₹2,000', min: undefined, max: 1999 },
  { label: '₹2,000 – ₹4,000', min: 2000, max: 4000 },
  { label: '₹4,000 – ₹8,000', min: 4000, max: 8000 },
  { label: 'Above ₹8,000', min: 8000, max: undefined },
] as const

export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'best_selling', label: 'Best selling' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
] as const

export const AVAILABILITY_LABEL: Record<string, string> = {
  'in-stock': 'Ready to ship',
  'pre-order': 'Pre-order',
}

export function activeFilters(params: URLSearchParams) {
  const chips: { key: FilterKey | 'price'; label: string }[] = []
  for (const key of ['size', 'color', 'fabric', 'occasion', 'availability'] as const) {
    const v = params.get(key)
    if (v) chips.push({ key, label: key === 'availability' ? AVAILABILITY_LABEL[v] ?? v : v })
  }
  const min = params.get('price_min')
  const max = params.get('price_max')
  if (min || max) {
    const range = PRICE_RANGES.find((r) => String(r.min ?? '') === (min ?? '') && String(r.max ?? '') === (max ?? ''))
    chips.push({ key: 'price', label: range?.label ?? `₹${min ?? 0} – ${max ? `₹${max}` : 'above'}` })
  }
  return chips
}
