import { Headphones, RefreshCw, ShieldCheck } from 'lucide-react'

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    text: 'Safe transactions on every order.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    text: '7-day, no-questions returns on eligible styles.',
  },
  {
    icon: Headphones,
    title: 'Support Online',
    text: 'Our stylists are a message away.',
  },
]

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-ivory-deep py-12">
      <div className="container-boutique grid gap-8 md:grid-cols-3 md:gap-6">
        {ITEMS.map((item, i) => (
          <div
            key={item.title}
            className={`flex flex-col items-center text-center ${
              i > 0 ? 'md:border-l md:border-border' : ''
            }`}
          >
            <item.icon className="mb-3 h-8 w-8 text-primary" strokeWidth={1.5} />
            <h3 className="font-display text-xl">{item.title}</h3>
            <p className="mt-1 max-w-xs text-sm text-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
