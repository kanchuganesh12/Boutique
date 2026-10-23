import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export type Crumb = { label: string; to?: string }

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-1 text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <Fragment key={`${c.label}-${i}`}>
            {i > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
            <li className={i === items.length - 1 ? 'line-clamp-1 text-ink' : undefined}>
              {c.to ? (
                <Link to={c.to} className="capitalize hover:text-link-hover hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span className="capitalize" aria-current="page">
                  {c.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
