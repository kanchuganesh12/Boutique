import clsx from 'clsx'
import type { ReactNode } from 'react'

type Tone = 'new' | 'bestseller' | 'preorder' | 'sale' | 'neutral' | 'success'

const TONES: Record<Tone, string> = {
  new: 'bg-nav-2 text-white',
  bestseller: 'bg-[#c45500] text-white',
  preorder: 'bg-preorder text-white',
  sale: 'bg-deal text-white',
  neutral: 'bg-ivory-deep text-muted',
  success: 'bg-success/10 text-success',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-bold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export const badgeTone = (b: string): Tone =>
  b === 'New' ? 'new' : b === 'Best Seller' ? 'bestseller' : b === 'Pre-Order' ? 'preorder' : 'neutral'
