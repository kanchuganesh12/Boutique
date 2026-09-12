import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

type CartState = {
  items: CartItem[]
  wishlist: string[]
  isMiniCartOpen: boolean
  isSearchOpen: boolean
  isMobileNavOpen: boolean
  toast: string | null
  addItem: (product: Product, size?: string, quantity?: number) => void
  updateQty: (slug: string, size: string | undefined, quantity: number) => void
  removeItem: (slug: string, size?: string) => void
  toggleWishlist: (slug: string) => void
  setMiniCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
  showToast: (message: string) => void
  clearToast: () => void
  itemCount: () => number
  subtotal: () => number
}

export const useShopStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      isMiniCartOpen: false,
      isSearchOpen: false,
      isMobileNavOpen: false,
      toast: null,
      addItem: (product, size, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.slug === product.slug && i.size === size,
          )
          const items = existing
            ? state.items.map((i) =>
                i.product.slug === product.slug && i.size === size
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              )
            : [...state.items, { product, size, quantity }]
          return { items, isMiniCartOpen: true, toast: 'Added to bag' }
        })
      },
      updateQty: (slug, size, quantity) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !(i.product.slug === slug && i.size === size))
              : state.items.map((i) =>
                  i.product.slug === slug && i.size === size ? { ...i, quantity } : i,
                ),
        }))
      },
      removeItem: (slug, size) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.product.slug === slug && i.size === size)),
        }))
      },
      toggleWishlist: (slug) => {
        set((state) => ({
          wishlist: state.wishlist.includes(slug)
            ? state.wishlist.filter((s) => s !== slug)
            : [...state.wishlist, slug],
        }))
      },
      setMiniCartOpen: (open) => set({ isMiniCartOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
      showToast: (message) => set({ toast: message }),
      clearToast: () => set({ toast: null }),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.sale_price ?? i.product.price
          return sum + price * i.quantity
        }, 0),
    }),
    {
      name: 'boutique-shop',
      partialize: (s) => ({ items: s.items, wishlist: s.wishlist }),
    },
  ),
)

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
