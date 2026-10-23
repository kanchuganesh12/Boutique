import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useState, type ReactNode } from 'react'
import type { Facets } from '../../types'
import { swatchColor } from '../product/swatch'
import { AVAILABILITY_LABEL, PRICE_RANGES, type FilterKey } from './filters'

type Props = {
  facets?: Facets
  params: URLSearchParams
  onChange: (updates: Partial<Record<FilterKey, string | undefined>>) => void
}

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="py-2.5">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left text-sm font-bold">
        {title}
        <ChevronDown className={clsx('h-4 w-4 transition', open && 'rotate-180')} />
      </button>
      {open ? <div className="pt-1.5">{children}</div> : null}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx('flex w-full items-center gap-2 py-1 text-left text-sm hover:text-link-hover', active && 'font-bold')}
    >
      <span
        className={clsx(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border text-[11px] leading-none text-white',
          active ? 'border-link bg-link' : 'border-[#888c8c] bg-white',
        )}
        aria-hidden
      >
        {active ? '✓' : null}
      </span>
      {children}
    </button>
  )
}

function Radio({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={clsx('block w-full py-1 text-left text-sm hover:text-link-hover', active && 'font-bold')}
    >
      {active ? '‹ ' : null}
      {children}
    </button>
  )
}

export function FilterPanel({ facets, params, onChange }: Props) {
  const toggle = (key: FilterKey, value: string) => onChange({ [key]: params.get(key) === value ? undefined : value })
  const priceMin = params.get('price_min') ?? ''
  const priceMax = params.get('price_max') ?? ''

  return (
    <div>
      <Group title="Price">
        <div role="radiogroup" aria-label="Price">
          {PRICE_RANGES.map((r) => {
            const active = priceMin === String(r.min ?? '') && priceMax === String(r.max ?? '')
            return (
              <Radio
                key={r.label}
                active={active}
                onClick={() =>
                  onChange(
                    active
                      ? { price_min: undefined, price_max: undefined }
                      : { price_min: r.min?.toString(), price_max: r.max?.toString() },
                  )
                }
              >
                {r.label}
              </Radio>
            )
          })}
        </div>
      </Group>

      {facets?.sizes.length ? (
        <Group title="Size">
          <div className="flex flex-wrap gap-1.5">
            {facets.sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={params.get('size') === s}
                onClick={() => toggle('size', s)}
                className={clsx(
                  'min-w-10 rounded-md border px-2 py-1 text-sm',
                  params.get('size') === s ? 'border-link bg-[#edfdff] font-bold' : 'border-border bg-white hover:bg-[#f7fafa]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </Group>
      ) : null}

      {facets?.colors.length ? (
        <Group title="Colour">
          <div>
            {facets.colors.map((c) => (
              <Chip key={c} active={params.get('color') === c} onClick={() => toggle('color', c)}>
                <span className="h-3.5 w-3.5 rounded-full border border-ink/15" style={{ background: swatchColor(c) }} aria-hidden />
                {c}
              </Chip>
            ))}
          </div>
        </Group>
      ) : null}

      {facets?.fabrics.length ? (
        <Group title="Fabric">
          <div role="radiogroup" aria-label="Fabric">
            {facets.fabrics.map((f) => (
              <Radio key={f} active={params.get('fabric') === f} onClick={() => toggle('fabric', f)}>
                {f}
              </Radio>
            ))}
          </div>
        </Group>
      ) : null}

      {facets?.occasions.length ? (
        <Group title="Occasion">
          <div>
            {facets.occasions.map((o) => (
              <Chip key={o} active={params.get('occasion') === o} onClick={() => toggle('occasion', o)}>
                {o}
              </Chip>
            ))}
          </div>
        </Group>
      ) : null}

      {facets && facets.availability.length > 1 ? (
        <Group title="Availability">
          <div role="radiogroup" aria-label="Availability">
            {facets.availability.map((a) => (
              <Radio key={a} active={params.get('availability') === a} onClick={() => toggle('availability', a)}>
                {AVAILABILITY_LABEL[a] ?? a}
              </Radio>
            ))}
          </div>
        </Group>
      ) : null}
    </div>
  )
}
