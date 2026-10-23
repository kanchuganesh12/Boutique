import clsx from 'clsx'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

export const inputClasses =
  'min-h-11 w-full rounded-md border border-border bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 aria-[invalid=true]:border-sale'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: ReactNode
}

export function Field({ label, error, hint, className, id, ...rest }: FieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {rest.required ? <span className="text-sale"> *</span> : null}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-err` : undefined}
        className={inputClasses}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-err`} className="mt-1 text-xs text-sale">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; hideLabel?: boolean }

export function Select({ label, hideLabel, className, id, children, ...rest }: SelectProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <label htmlFor={selectId} className={clsx('whitespace-nowrap text-sm text-muted', hideLabel && 'sr-only')}>
        {label}
      </label>
      <select id={selectId} className={clsx(inputClasses, 'w-auto pr-8')} {...rest}>
        {children}
      </select>
    </div>
  )
}
