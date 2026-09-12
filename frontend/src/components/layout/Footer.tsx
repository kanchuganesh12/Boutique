import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'

const SHOP = [
  { label: 'Sarees', to: '/collections/sarees' },
  { label: 'Kurtas', to: '/collections/kurtas' },
  { label: 'Salwar Sets', to: '/collections/salwar-sets' },
  { label: 'Blouses', to: '/collections/blouses' },
  { label: 'Kids', to: '/collections/kids' },
]

const HELP = [
  { label: 'Shipping', to: '/policies/shipping' },
  { label: 'Returns', to: '/policies/returns' },
  { label: 'FAQ', to: '/policies/faq' },
  { label: 'Contact', to: '/contact' },
]

const ABOUT = [
  { label: 'Our Story', to: '/about' },
  { label: 'Stores', to: '/stores' },
  { label: 'Careers', to: '/careers' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [message, setMessage] = useState('')

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.subscribe(email)
      setStatus('ok')
      setMessage(res.message)
      setEmail('')
    } catch {
      setStatus('err')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <footer className="border-t border-border bg-ivory-deep">
      <div className="container-boutique section-y grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="mb-4 font-display text-xl">Shop</h3>
          <ul className="space-y-2 text-sm text-muted">
            {SHOP.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-xl">Help</h3>
          <ul className="space-y-2 text-sm text-muted">
            {HELP.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-xl">About</h3>
          <ul className="space-y-2 text-sm text-muted">
            {ABOUT.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-display text-xl">Connect</h3>
          <p className="mb-3 text-sm text-muted">Join for early access to festive drops.</p>
          <form onSubmit={subscribe} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="min-h-11 flex-1 rounded-md border border-border bg-white px-3 text-sm"
            />
            <Button type="submit">Subscribe</Button>
          </form>
          {status !== 'idle' ? (
            <p className={`mt-2 text-sm ${status === 'ok' ? 'text-primary' : 'text-sale'}`}>{message}</p>
          ) : null}
        </div>
      </div>
      <div className="border-t border-border py-4">
        <div className="container-boutique flex flex-col gap-2 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Boutique. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/policies/privacy">Privacy</Link>
            <Link to="/policies/terms">Terms</Link>
            <Link to="/policies/shipping">Shipping</Link>
            <Link to="/policies/returns">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
