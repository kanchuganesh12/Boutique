import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary'
  children: ReactNode
}

export function Button({ variant = 'primary', className, children, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold tracking-label uppercase transition duration-200',
        variant === 'primary' &&
          'bg-primary text-white shadow-sm hover:bg-primary-hover hover:-translate-y-0.5',
        variant === 'secondary' &&
          'border border-primary bg-transparent text-primary hover:bg-primary hover:text-white',
        variant === 'tertiary' &&
          'rounded-none border-0 bg-transparent px-0 text-primary underline-offset-4 hover:underline',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
