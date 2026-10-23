import { RefreshCw } from 'lucide-react'
import { Button } from './Button'

export function ErrorState({ onRetry, message = 'We couldn’t load this page.' }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="container-boutique section-y">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-white p-10 text-center">
        <p className="font-sans text-xl font-bold">Something went wrong</p>
        <p className="mt-2 text-muted">{message} Please check your connection and try again.</p>
        <div className="mt-6 flex justify-center gap-3">
          {onRetry ? (
            <Button onClick={onRetry}>
              <RefreshCw className="h-4 w-4" /> Try again
            </Button>
          ) : null}
          <Button to="/" variant="secondary">
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
