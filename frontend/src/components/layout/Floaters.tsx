import { MessageCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useShopStore } from '../../lib/store'

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-[55] flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
      aria-label="Chat with our stylists on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Our stylists are just a message away</span>
    </a>
  )
}

export function Toast() {
  const toast = useShopStore((s) => s.toast)
  const clearToast = useShopStore((s) => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(clearToast, 2200)
    return () => window.clearTimeout(id)
  }, [toast, clearToast])

  if (!toast) return null

  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory shadow-lg"
    >
      {toast}
    </div>
  )
}
