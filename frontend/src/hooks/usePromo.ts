import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { selectSubtotal, useShopStore } from '../lib/store'

/** Apply/remove a promo code and keep its discount in sync with the cart subtotal. */
export function usePromo() {
  const promo = useShopStore((s) => s.promo)
  const setPromo = useShopStore((s) => s.setPromo)
  const showToast = useShopStore((s) => s.showToast)
  const subtotal = useShopStore(selectSubtotal)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const apply = async (code: string) => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    try {
      setPromo(await api.validatePromo(code, subtotal))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not apply code')
    } finally {
      setLoading(false)
    }
  }

  // Re-validate when the cart changes (percentage discounts move; minimums may no longer be met).
  const code = promo?.code
  useEffect(() => {
    if (!code || subtotal === 0) return
    let cancelled = false
    api
      .validatePromo(code, subtotal)
      .then((res) => !cancelled && setPromo(res))
      .catch(() => {
        if (cancelled) return
        setPromo(null)
        showToast(`Code ${code} no longer applies`)
      })
    return () => {
      cancelled = true
    }
  }, [code, subtotal, setPromo, showToast])

  return { promo, apply, remove: () => setPromo(null), error, loading }
}
