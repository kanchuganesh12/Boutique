import { Link } from 'react-router-dom'
import { sized } from '../../lib/image'
import { Button } from '../ui/Button'

export type Tile = { label: string; image?: string | null; to: string }

const CARD = 'flex flex-col bg-white p-5'

function CardTitle({ children }: { children: string }) {
  return <h2 className="mb-3 font-sans text-[21px] font-bold leading-tight">{children}</h2>
}

/** Amazon home "quad" card: a heading, a 2×2 grid of labelled images and a "See more" link. */
export function QuadCard({ title, tiles, moreLabel = 'See more', moreTo }: { title: string; tiles: Tile[]; moreLabel?: string; moreTo: string }) {
  if (!tiles.length) return null
  return (
    <div className={CARD}>
      <CardTitle>{title}</CardTitle>
      <ul className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3">
        {tiles.slice(0, 4).map((t) => (
          <li key={t.to + t.label}>
            <Link to={t.to} className="group block">
              <span className="block aspect-square overflow-hidden bg-[#f7f7f7]">
                <img src={sized(t.image ?? undefined, 300)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </span>
              <span className="mt-1 line-clamp-1 text-xs text-ink group-hover:text-link-hover">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to={moreTo} className="a-link mt-4 text-[13px]">
        {moreLabel}
      </Link>
    </div>
  )
}

/** Single large image card. */
export function FeatureCard({ title, tile, moreLabel = 'Shop now' }: { title: string; tile: Tile; moreLabel?: string }) {
  return (
    <div className={CARD}>
      <CardTitle>{title}</CardTitle>
      <Link to={tile.to} className="block flex-1 overflow-hidden bg-[#f7f7f7]">
        <img src={sized(tile.image ?? undefined, 600)} alt={tile.label} loading="lazy" className="aspect-square h-full w-full object-cover" />
      </Link>
      <Link to={tile.to} className="a-link mt-4 text-[13px]">
        {moreLabel}
      </Link>
    </div>
  )
}

export function SignInCard({ tile }: { tile?: Tile }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-5">
        <h2 className="mb-3 font-sans text-[21px] font-bold leading-tight">Sign in for your best experience</h2>
        <Button to="/account" className="w-full">
          Sign in securely
        </Button>
      </div>
      {tile ? (
        <Link to={tile.to} className="group relative block flex-1 overflow-hidden bg-white">
          <img src={sized(tile.image ?? undefined, 600)} alt="" loading="lazy" className="h-full max-h-[260px] w-full object-cover" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <span className="block text-lg font-bold">{tile.label}</span>
            <span className="text-sm group-hover:underline">Explore now ›</span>
          </span>
        </Link>
      ) : null}
    </div>
  )
}

export const CARD_ROW = 'container-boutique relative grid grid-cols-1 gap-5 pb-5 sm:grid-cols-2 lg:grid-cols-4'
