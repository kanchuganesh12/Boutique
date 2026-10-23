import { useQueries } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { api } from '../lib/api'
import { useShopStore } from '../lib/store'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Seo } from '../components/ui/Seo'
import { ProductGrid, ProductGridSkeleton } from '../components/product/ProductGrid'

export default function WishlistPage() {
  const wishlist = useShopStore((s) => s.wishlist)
  // Each product is cached by ['product', slug], so these share cache with product pages.
  const results = useQueries({
    queries: wishlist.map((slug) => ({ queryKey: ['product', slug], queryFn: () => api.product(slug), staleTime: 5 * 60_000 })),
  })
  const loading = results.some((r) => r.isLoading)
  const products = results.flatMap((r) => (r.data ? [r.data] : []))

  return (
    <div className="container-boutique pb-16 pt-6 md:pt-10">
      <Seo title="Wishlist" />
      <h1 className="mb-2 font-sans text-[28px] font-normal">Your Wish List</h1>
      <p className="mb-8 text-muted">{wishlist.length ? `${wishlist.length} saved ${wishlist.length === 1 ? 'piece' : 'pieces'}` : 'Your saved pieces live here.'}</p>
      {!wishlist.length ? (
        <EmptyState icon={Heart} title="Nothing saved yet" action={<Button to="/collections/best-sellers">Explore best sellers</Button>}>
          Tap the heart on any piece to save it for later.
        </EmptyState>
      ) : loading ? (
        <ProductGridSkeleton count={Math.min(wishlist.length, 8)} />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
