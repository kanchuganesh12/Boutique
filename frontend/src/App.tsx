import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { RootLayout } from './layouts/RootLayout'
import HomePage from './pages/HomePage'

// Route-level code splitting: only the homepage ships in the initial bundle.
const CollectionPage = lazy(() => import('./pages/CollectionPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const InfoPage = lazy(() => import('./pages/InfoPage'))
const StoresPage = lazy(() => import('./pages/InfoPage').then((m) => ({ default: m.StoresPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
})

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="collections/:slug" element={<CollectionPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="products/:slug" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order/:id" element={<OrderConfirmationPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="stores" element={<StoresPage />} />
              <Route path="about" element={<InfoPage slug="about" />} />
              <Route path="contact" element={<InfoPage slug="contact" />} />
              <Route path="careers" element={<InfoPage slug="careers" />} />
              <Route path="policies/:slug" element={<InfoPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
