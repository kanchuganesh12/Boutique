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
    <div className="relative bg-ink py-2 pl-4 pr-12 text-center text-[10px] tracking-label text-ivory uppercase sm:px-10 sm:pr-12 sm:text-xs">
      <p key={index} className="line-clamp-2 animate-[fade_0.4s_ease]">
        {messages[index]}
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ivory/80 hover:text-white sm:right-3"
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
      </button>
      <style>{`@keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
