import { Minus, Plus } from 'lucide-react'
import clsx from 'clsx'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = 'md',
  label = 'Quantity',
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  label?: string
}) {
  const btn = clsx(
    'flex items-center justify-center text-ink transition hover:bg-[#f0f2f2] disabled:opacity-40',
    size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
  )
  return (
    <div className="inline-flex items-center rounded-full border-[3px] border-cta bg-white" role="group" aria-label={label}>
      <button type="button" className={btn} aria-label="Decrease" disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-7 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} aria-label="Increase" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
