import { X } from 'lucide-react'
import clsx from 'clsx'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'

const EXIT_MS = 220

/** Keeps content mounted for the exit animation. */
function usePresence(open: boolean) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (open) {
      setMounted(true)
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    const t = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [open])
  return { mounted, visible }
}

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  hideTitle,
}: Props & { side?: 'left' | 'right' | 'bottom'; hideTitle?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { mounted, visible } = usePresence(open)
  useFocusTrap(ref, open, onClose)
  if (!mounted) return null

  const hidden =
    side === 'right' ? 'translate-x-full' : side === 'left' ? '-translate-x-full' : 'translate-y-full'

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div
        className={clsx('absolute inset-0 bg-ink/45 transition-opacity duration-200', visible ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          'absolute flex flex-col bg-ivory shadow-lg transition-transform duration-200 ease-out safe-bottom',
          side === 'bottom'
            ? 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl'
            : 'top-0 h-full max-w-full safe-top',
          side === 'right' && 'right-0 w-full sm:max-w-md',
          side === 'left' && 'left-0 w-[85vw] sm:max-w-[365px]',
          visible ? 'translate-x-0 translate-y-0' : hidden,
        )}
      >
        <div className={clsx('flex items-center justify-between border-b border-border px-4 py-3', hideTitle && 'sr-only')}>
          <h2 className="text-xl">{title}</h2>
          <button type="button" aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ivory-deep" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? <div className="border-t border-border bg-ivory p-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}

export function Modal({ open, onClose, title, children, footer, size = 'md', hideTitle }: Props & { size?: 'md' | 'lg' | 'full'; hideTitle?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { mounted, visible } = usePresence(open)
  useFocusTrap(ref, open, onClose)
  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className={clsx('absolute inset-0 bg-ink/50 transition-opacity duration-200', visible ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden bg-ivory shadow-lg transition duration-200 ease-out safe-bottom',
          'rounded-t-2xl sm:rounded-lg',
          size === 'md' && 'sm:max-w-lg',
          size === 'lg' && 'sm:max-w-4xl',
          size === 'full' && 'h-full max-h-none rounded-none sm:max-w-none sm:rounded-none',
          visible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-6 opacity-0 sm:scale-95',
        )}
      >
        <div className={clsx('flex items-center justify-between px-4 py-3', !hideTitle && 'border-b border-border')}>
          <h2 className={clsx('text-xl', hideTitle && 'sr-only')}>{title}</h2>
          <button type="button" aria-label="Close" className="ml-auto flex h-11 w-11 items-center justify-center rounded-full hover:bg-ivory-deep" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? <div className="border-t border-border p-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
