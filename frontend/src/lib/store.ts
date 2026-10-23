import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Order, Product, PromoResult } from '../types'

export const FREE_SHIPPING_THRESHOLD = 2999
export const SHIPPING_FEE = 99

export type OrderSummary = Pick<Order, 'id' | 'total' | 'status' | 'created_at'> & {
  itemCount: number
  thumb?: string
}

type CartState = {
  items: CartItem[]
  savedForLater: CartItem[]
  wishlist: string[]
  recentSearches: string[]
  promo: PromoResult | null
  orders: OrderSummary[]
  quickView: Product | null
  isMiniCartOpen: boolean
  isSearchOpen: boolean
  isMobileNavOpen: boolean
  toast: string | null
  /** Increments on every add-to-cart so the header badge can animate. */
  cartPulse: number
  addItem: (product: Product, size?: string, quantity?: number) => void
  updateQty: (slug: string, size: string | undefined, quantity: number) => void
  removeItem: (slug: string, size?: string) => void
  saveForLater: (slug: string, size?: string) => void
  moveToCart: (slug: string, size?: string) => void
  removeSaved: (slug: string, size?: string) => void
  clearCart: () => void
  toggleWishlist: (slug: string) => void
  addRecentSearch: (q: string) => void
  clearRecentSearches: () => void
  setPromo: (promo: PromoResult | null) => void
  addOrder: (order: OrderSummary) => void
  setQuickView: (product: Product | null) => void
  setMiniCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
  showToast: (message: string) => void
  clearToast: () => void
}

const same = (i: CartItem, slug: string, size?: string) => i.product.slug === slug && i.size === size

export const unitPrice = (p: Product) => p.sale_price ?? p.price

export const useShopStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      savedForLater: [],
      wishlist: [],
      recentSearches: [],
      promo: null,
      orders: [],
      quickView: null,
      isMiniCartOpen: false,
      isSearchOpen: false,
      isMobileNavOpen: false,
      toast: null,
      cartPulse: 0,
      addItem: (product, size, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => same(i, product.slug, size))
          const items = existing
            ? state.items.map((i) =>
                same(i, product.slug, size) ? { ...i, quantity: i.quantity + quantity } : i,
              )
            : [...state.items, { product, size, quantity }]
          return {
            items,
            isMiniCartOpen: true,
            quickView: null,
            toast: 'Added to Cart',
            cartPulse: state.cartPulse + 1,
          }
        })
      },
      updateQty: (slug, size, quantity) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !same(i, slug, size))
              : state.items.map((i) => (same(i, slug, size) ? { ...i, quantity } : i)),
        }))
      },
      removeItem: (slug, size) => {
        set((state) => ({ items: state.items.filter((i) => !same(i, slug, size)) }))
      },
      saveForLater: (slug, size) => {
        set((state) => {
          const item = state.items.find((i) => same(i, slug, size))
          if (!item) return state
          return {
            items: state.items.filter((i) => !same(i, slug, size)),
            savedForLater: [item, ...state.savedForLater.filter((i) => !same(i, slug, size))],
            toast: 'Saved for later',
          }
        })
      },
      moveToCart: (slug, size) => {
        set((state) => {
          const item = state.savedForLater.find((i) => same(i, slug, size))
          if (!item) return state
          return {
            savedForLater: state.savedForLater.filter((i) => !same(i, slug, size)),
            items: [...state.items.filter((i) => !same(i, slug, size)), item],
            toast: 'Moved to Cart',
            cartPulse: state.cartPulse + 1,
          }
        })
      },
      removeSaved: (slug, size) => {
        set((state) => ({ savedForLater: state.savedForLater.filter((i) => !same(i, slug, size)) }))
      },
      clearCart: () => set({ items: [], promo: null }),
      toggleWishlist: (slug) => {
        set((state) => {
          const loved = state.wishlist.includes(slug)
          return {
            wishlist: loved ? state.wishlist.filter((s) => s !== slug) : [...state.wishlist, slug],
            toast: loved ? 'Removed from Wish List' : 'Added to Wish List',
          }
        })
      },
      addRecentSearch: (q) => {
        const term = q.trim()
        if (!term) return
        set((state) => ({
          recentSearches: [
            term,
            ...state.recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase()),
          ].slice(0, 6),
        }))
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
      setPromo: (promo) => set({ promo }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders].slice(0, 50) })),
      setQuickView: (product) => set({ quickView: product }),
      setMiniCartOpen: (open) => set({ isMiniCartOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
      showToast: (message) => set({ toast: message }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'boutique-shop',
      version: 2,
      partialize: (s) => ({
        items: s.items,
        savedForLater: s.savedForLater,
        wishlist: s.wishlist,
        recentSearches: s.recentSearches,
        promo: s.promo,
        orders: s.orders,
      }),
      migrate: (persisted) => persisted as CartState,
    },
  ),
)

/* Derived selectors — use these instead of storing computed values. */
export const selectItemCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0)
export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + unitPrice(i.product) * i.quantity, 0)

export function cartTotals(subtotal: number, promo: PromoResult | null) {
  const discount = promo ? Math.min(promo.discount, subtotal) : 0
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  return { subtotal, discount, shipping, total: subtotal - discount + shipping }
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
