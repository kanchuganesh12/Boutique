import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  viewAllTo,
  align = 'center',
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  viewAllTo?: string
  align?: 'center' | 'split'
}) {
  return (
    <div
      className={clsx(
        'mb-8 flex flex-col gap-3 md:mb-10',
        align === 'split' ? 'md:flex-row md:items-end md:justify-between' : 'items-center text-center',
      )}
    >
      <div className={clsx('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        ) : null}
        <h2 className="font-display text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">{title}</h2>
        {subtitle ? <p className="mt-3 text-muted md:text-[17px]">{subtitle}</p> : null}
      </div>
      {viewAllTo && align === 'split' ? (
        <Link
          to={viewAllTo}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-label text-primary"
        >
          View all <span className="transition group-hover:translate-x-1">→</span>
        </Link>
      ) : null}
    </div>
  )
}
