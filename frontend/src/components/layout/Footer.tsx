import { ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

const COLUMNS = [
  {
    title: 'The Label',
    links: [
      { label: 'About Boutique', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Our Stores', to: '/stores' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'Sarees', to: '/collections/sarees' },
      { label: 'Kurtas', to: '/collections/kurtas' },
      { label: 'Salwar Sets', to: '/collections/salwar-sets' },
      { label: 'Designer Blouses', to: '/collections/blouses' },
      { label: 'Kids Wear', to: '/collections/kids' },
    ],
  },
  {
    title: 'Client Care',
    links: [
      { label: 'My Profile', to: '/account' },
      { label: 'Track an Order', to: '/account#orders' },
      { label: 'Shipping', to: '/policies/shipping' },
      { label: 'Returns & Exchanges', to: '/policies/returns' },
      { label: 'Help & FAQ', to: '/policies/faq' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.subscribe(email)
      setStatus('ok')
      setMessage(res.message)
      setEmail('')
    } catch {
      setStatus('err')
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="mt-auto">
      {/* Newsletter band */}
      <div className="bg-blush">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-serif text-2xl italic text-brand md:text-3xl">Join the Boutique circle</h3>
            <p className="mt-1 text-sm text-muted">First look at new collections, festive edits and members-only offers.</p>
          </div>
          <div className="w-full md:max-w-md">
            <form
              onSubmit={subscribe}
              className="flex h-12 items-center rounded-full border border-border bg-white pl-5 pr-1 focus-within:border-brand"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-10 shrink-0 rounded-full bg-brand px-5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-60"
              >
                {loading ? '…' : 'Subscribe'}
              </button>
            </form>
            {status !== 'idle' ? (
              <p role="status" className={`mt-2 pl-5 text-sm ${status === 'ok' ? 'text-success' : 'text-sale'}`}>
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="bg-[#2a131d] text-[#f3e6ea]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-8 gap-y-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-serif text-3xl italic tracking-wide text-white">
              Boutique
            </Link>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#c9a3b0]">Ethnic &middot; Couture</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#cdb6be]">
              Handpicked ethnic wear for every celebration, crafted with care and delivered to your door.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a3b0]">{col.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[#f3e6ea] transition-colors hover:text-white hover:underline hover:underline-offset-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-5 text-xs text-[#bfa5ae] md:flex-row md:pr-24 md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Boutique. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Link to="/policies/terms" className="hover:text-white">Terms</Link>
              <Link to="/policies/privacy" className="hover:text-white">Privacy</Link>
              <Link to="/policies/shipping" className="hover:text-white">Shipping</Link>
              <Link to="/policies/returns" className="hover:text-white">Refunds</Link>
            </div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 self-start uppercase tracking-wider hover:text-white md:self-auto"
            >
              Back to top
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25">
                <ArrowUp className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
