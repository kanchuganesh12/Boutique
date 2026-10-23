import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useNavigation } from '../lib/queries'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { MiniCart } from '../components/layout/MiniCart'
import { MobileNav } from '../components/layout/MobileNav'
import { Toast, WhatsAppFloat } from '../components/layout/Floaters'
import { QuickView } from '../components/product/QuickView'
import { PageFallback } from '../components/ui/PageFallback'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export function RootLayout() {
  const { data } = useNavigation()
  const categories = data?.categories ?? []
  const collections = data?.collections ?? []

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <ScrollToTop />
      <Header categories={categories} />
      <main id="main" className="min-w-0 flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MiniCart />
      <MobileNav categories={categories} collections={collections} />
      <QuickView />
      <WhatsAppFloat />
      <Toast />
    </div>
  )
}
