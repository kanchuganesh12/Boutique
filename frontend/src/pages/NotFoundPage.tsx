import { Compass } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Seo } from '../components/ui/Seo'

export default function NotFoundPage() {
  return (
    <div className="container-boutique section-y">
      <Seo title="Page not found" />
      <EmptyState
        icon={Compass}
        title="This page has wandered off"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/">Go home</Button>
            <Button to="/collections/new-arrivals" variant="secondary">
              New arrivals
            </Button>
          </div>
        }
      >
        The link may be broken or the page may have moved.
      </EmptyState>
    </div>
  )
}
