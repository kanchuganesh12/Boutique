import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'buy' | 'secondary' | 'tertiary' | 'ghost' | 'light' | 'outline-light'
type Size = 'md' | 'lg'

type CommonProps = {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
  className?: string
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined }
type LinkButtonProps = CommonProps & Omit<LinkProps, 'className'> & { to: LinkProps['to'] }

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: Pick<CommonProps, 'variant' | 'size' | 'className'>) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-full font-normal transition duration-150 disabled:cursor-not-allowed disabled:opacity-60',
    size === 'md' && 'min-h-9 px-4 py-1.5 text-[13px]',
    size === 'lg' && 'min-h-11 px-6 py-2 text-sm',
    variant === 'primary' &&
      'border border-cta-hover bg-cta text-ink shadow-[0_2px_5px_0_rgb(213_217_217_/_0.5)] hover:bg-cta-hover',
    variant === 'buy' &&
      'border border-buy-hover bg-buy text-ink shadow-[0_2px_5px_0_rgb(213_217_217_/_0.5)] hover:bg-buy-hover',
    variant === 'secondary' &&
      'border border-border bg-white text-ink shadow-[0_2px_5px_0_rgb(213_217_217_/_0.5)] hover:bg-[#f7fafa]',
    variant === 'tertiary' &&
      'min-h-0 rounded-none border-0 bg-transparent !px-0 text-link hover:text-link-hover hover:underline',
    variant === 'ghost' && 'bg-white/90 text-ink shadow-sm hover:bg-white',
    variant === 'light' && 'border border-cta-hover bg-cta text-ink shadow-sm hover:bg-cta-hover',
    variant === 'outline-light' && 'border border-white/70 bg-transparent text-white hover:bg-white hover:text-ink',
    className,
  )
}

/** Renders a `<Link>` when `to` is given, otherwise a `<button>`. Never nest a Link inside a Button. */
export function Button(props: ButtonProps | LinkButtonProps) {
  if (props.to !== undefined) {
    const { variant, size, className, children, loading: _loading, ...rest } = props
    return (
      <Link className={buttonClasses({ variant, size, className })} {...rest}>
        {children}
      </Link>
    )
  }
  const { variant, size, className, children, loading, disabled, type = 'button', ...rest } = props
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden
        />
      ) : null}
      {children}
    </button>
  )
}
