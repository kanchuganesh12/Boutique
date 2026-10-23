export type ProductImage = {
  url: string
  alt?: string
}

export type PreOrderInfo = {
  is_pre_order: boolean
  expected_date?: string | null
}

export type Product = {
  id: string
  sku: string
  name: string
  slug: string
  description?: string
  category_slug: string
  collection_slugs: string[]
  price: number
  sale_price?: number | null
  currency?: string
  images: ProductImage[]
  badges: Array<'New' | 'Best Seller' | 'Pre-Order'>
  sizes: string[]
  fabric?: string | null
  occasion?: string | null
  color?: string | null
  care?: string | null
  variant_hint?: string | null
  pre_order?: PreOrderInfo
  is_best_seller: boolean
  is_new: boolean
  in_stock: boolean
}

export type Category = {
  id: string
  name: string
  slug: string
  image?: string | null
  order: number
}

export type Collection = {
  id: string
  name: string
  slug: string
  description?: string
  image?: string | null
  type: string
  order: number
  price_min?: number | null
  price_max?: number | null
}

export type Store = {
  id: string
  name: string
  address: string
  city: string
  pincode: string
  phone?: string | null
  maps_url?: string | null
}

export type Review = {
  id: string
  name: string
  rating: number
  text: string
  verified: boolean
  avatar_initial?: string | null
  product_slug?: string | null
}

export type HomePayload = {
  categories: Category[]
  collections: Collection[]
  best_sellers: Product[]
  new_arrivals: Product[]
  occasions: Record<string, Product[]>
  spotlights: Record<string, Product[]>
  reviews: Review[]
  stores: Store[]
  announcements: string[]
  trust_marquee: string[]
}

export type ProductListResponse = {
  items: Product[]
  total: number
  page: number
  limit: number
}

export type CartItem = {
  product: Product
  size?: string
  quantity: number
}

export type Navigation = {
  categories: Category[]
  collections: Collection[]
  announcements: string[]
}

export type Facets = {
  colors: string[]
  fabrics: string[]
  occasions: string[]
  sizes: string[]
  availability: string[]
}

export type PromoResult = {
  code: string
  discount: number
  label: string | null
}

export type OrderPayload = {
  contact_email: string
  contact_name: string
  phone?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pincode: string
  items: Array<{
    product_id: string
    sku: string
    name: string
    size?: string
    quantity: number
    unit_price: number
  }>
  promo_code?: string
  guest: boolean
}

export type Order = OrderPayload & {
  id: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  status: string
  created_at: string
}
