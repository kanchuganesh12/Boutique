import clsx from 'clsx'
import type { Product } from '../../types'
import { ProductCard, ProductCardSkeleton } from './ProductCard'

const GRID = 'grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export function ProductGrid({
  products,
  columns,
  className,
}: {
  products: Product[]
  columns?: 3 | 4
  className?: string
}) {
  return (
    <div className={clsx(GRID, columns === 3 && 'lg:grid-cols-3 xl:grid-cols-4', className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8, columns }: { count?: number; columns?: 3 | 4 }) {
  return (
    <div className={clsx(GRID, columns === 3 && 'lg:grid-cols-3 xl:grid-cols-4')}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
