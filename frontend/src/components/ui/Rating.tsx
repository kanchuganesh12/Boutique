import { Star } from 'lucide-react'
import clsx from 'clsx'

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1', className)}>
      <span className="flex" aria-label={`${value.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            aria-hidden
            className={clsx('h-3.5 w-3.5', n <= Math.round(value) ? 'fill-[#ffa41c] text-[#de7921]' : 'text-[#de7921]')}
          />
        ))}
      </span>
      {count != null ? <span className="a-link text-xs">{count.toLocaleString('en-IN')}</span> : null}
    </span>
  )
}
