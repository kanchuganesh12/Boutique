import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon?: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-white/60 px-6 py-14 text-center">
      {Icon ? (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ivory-deep text-primary">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </span>
      ) : null}
      <p className="font-sans text-lg font-bold">{title}</p>
      {children ? <div className="mt-2 max-w-md text-muted">{children}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
