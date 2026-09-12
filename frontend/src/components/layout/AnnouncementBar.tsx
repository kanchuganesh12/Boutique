import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

type Props = {
  messages: string[]
}

export function AnnouncementBar({ messages }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (messages.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, 4000)
    return () => window.clearInterval(id)
  }, [messages.length])

  if (dismissed || !messages.length) return null

  return (
    <div className="relative bg-ink px-10 py-2 text-center text-xs tracking-label text-ivory uppercase">
      <p key={index} className="animate-[fade_0.4s_ease]">
        {messages[index]}
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/80 hover:text-white"
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
      </button>
      <style>{`@keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
