import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

/** Fades/slides content in when it scrolls into view (disabled by prefers-reduced-motion via global CSS). */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={clsx(
        'transition duration-700 ease-out',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
