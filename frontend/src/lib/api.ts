import type { HomePayload, Product, ProductListResponse } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(detail || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  health: () => request<{ status: string }>('/health'),
  home: () => request<HomePayload>('/home'),
  products: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') qs.set(k, String(v))
    })
    const q = qs.toString()
    return request<ProductListResponse>(`/products${q ? `?${q}` : ''}`)
  },
  product: (slug: string) => request<Product>(`/products/${slug}`),
  bestSellers: () => request<Product[]>('/products/best-sellers'),
  newArrivals: () => request<Product[]>('/products/new-arrivals'),
  search: (q: string) =>
    request<{ products: Product[]; categories: { name: string; slug: string }[] }>(
      `/search?q=${encodeURIComponent(q)}`,
    ),
  subscribe: (email: string) =>
    request<{ ok: boolean; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
}
