type Props = { items: string[] }

export function TrustMarquee({ items }: Props) {
  if (!items.length) return null
  const loop = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border bg-ivory-deep py-3" aria-label="Why shop with us">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-8 hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 text-[11px] font-medium uppercase tracking-label text-accent"
          >
            {item}
            <span className="mx-8 text-primary/40" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
