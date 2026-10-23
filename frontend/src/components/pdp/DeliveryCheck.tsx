import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { inputClasses } from '../ui/Field'

const addDays = (n: number) =>
  new Date(Date.now() + n * 86_400_000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

/** Estimated delivery by PIN code. Metro prefixes ship faster (demo logic until a courier API is wired in). */
export function DeliveryCheck({ preOrder }: { preOrder?: boolean }) {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const check = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setError(true)
      setResult(null)
      return
    }
    setError(false)
    const metro = ['11', '40', '56', '60', '50', '70'].includes(pin.slice(0, 2))
    const base = preOrder ? 12 : metro ? 2 : 5
    setResult(`Delivery by ${addDays(base)} – ${addDays(base + 2)} · Cash on delivery available`)
  }

  return (
    <form onSubmit={check} className="rounded-lg border border-border bg-white p-4">
      <label htmlFor="pin" className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <MapPin className="h-4 w-4 text-primary" /> Check delivery
      </label>
      <div className="flex gap-2">
        <input
          id="pin"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter PIN code"
          aria-invalid={error || undefined}
          className={inputClasses}
        />
        <button type="submit" className="shrink-0 rounded-lg border border-border bg-[#f0f2f2] px-3 text-sm shadow-sm hover:bg-[#e3e6e6]">
          Check
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-sale">Enter a valid 6-digit PIN code.</p> : null}
      {result ? <p className="mt-2 text-sm text-success">{result}</p> : null}
    </form>
  )
}
