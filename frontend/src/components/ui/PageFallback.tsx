import { ProductGridSkeleton } from '../product/ProductGrid'
import { Skeleton } from './Skeleton'

export function PageFallback() {
  return (
    <div className="container-boutique section-y">
      <Skeleton className="mb-3 h-4 w-40" />
      <Skeleton className="mb-8 h-10 w-72" />
      <ProductGridSkeleton count={8} />
    </div>
  )
}
