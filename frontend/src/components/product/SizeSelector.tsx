import clsx from 'clsx'

export function SizeSelector({
  sizes,
  value,
  onChange,
  error,
  onOpenGuide,
}: {
  sizes: string[]
  value?: string
  onChange: (s: string) => void
  error?: boolean
  onOpenGuide?: () => void
}) {
  return (
    <fieldset>
      <div className="mb-2 flex items-center justify-between">
        <legend className="text-sm">
          Size:{value ? <span className="ml-1 font-bold">{value}</span> : null}
        </legend>
        {onOpenGuide ? (
          <button type="button" onClick={onOpenGuide} className="a-link text-sm">
            Size guide
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={value === s}
            onClick={() => onChange(s)}
            className={clsx(
              'min-h-9 min-w-12 rounded-lg border px-3 text-sm transition',
              value === s
                ? 'border-link bg-[#edfdff] font-bold shadow-[0_0_0_1px_var(--color-link)]'
                : 'border-[#888c8c] bg-white hover:bg-[#f7fafa]',
              error && !value && 'border-sale',
            )}
          >
            {s}
          </button>
        ))}
      </div>
      {error && !value ? (
        <p className="mt-2 text-sm text-sale" role="alert">
          Please select a size.
        </p>
      ) : null}
    </fieldset>
  )
}
