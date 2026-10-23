import type {
  Collection,
  Facets,
  HomePayload,
  Navigation,
  Order,
  OrderPayload,
  Product,
  ProductListResponse,
  PromoResult,
  Review,
  Store,
} from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    let detail = `Request failed: ${res.status}`
    try {
      const body = await res.json()
      if (typeof body?.detail === 'string') detail = body.detail
    } catch {
      // non-JSON error body
    }
    throw new ApiError(detail, res.status)
  }
  return res.json() as Promise<T>
}

export type ProductQuery = Record<string, string | number | undefined>

function toQuery(params: ProductQuery) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v))
  })
  const q = qs.toString()
  return q ? `?${q}` : ''
}

export const api = {
  health: () => request<{ status: string }>('/health'),
  navigation: () => request<Navigation>('/navigation'),
  home: () => request<HomePayload>('/home'),
  products: (params: ProductQuery = {}) =>
    request<ProductListResponse>(`/products${toQuery(params)}`),
  facets: (params: ProductQuery = {}) => request<Facets>(`/products/facets${toQuery(params)}`),
  product: (slug: string) => request<Product>(`/products/${slug}`),
  related: (slug: string) => request<Product[]>(`/products/${slug}/related`),
  bestSellers: () => request<Product[]>('/products/best-sellers'),
  newArrivals: () => request<Product[]>('/products/new-arrivals'),
  stores: () => request<Store[]>('/stores'),
  collection: (slug: string) => request<Collection>(`/collections/${slug}`),
  reviews: (productSlug?: string) =>
    request<Review[]>(`/reviews${toQuery({ product_slug: productSlug })}`),
  search: (q: string) =>
    request<{ products: Product[]; categories: { name: string; slug: string }[] }>(
      `/search?q=${encodeURIComponent(q)}`,
    ),
  subscribe: (email: string) =>
    request<{ ok: boolean; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  validatePromo: (code: string, subtotal: number) =>
    request<PromoResult>('/promo/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),
  createOrder: (payload: OrderPayload) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  order: (id: string) => request<Order>(`/orders/${id}`),
}
