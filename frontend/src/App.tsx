import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { RootLayout } from './layouts/RootLayout'
import { HomePage } from './pages/HomePage'
import { CollectionPage } from './pages/CollectionPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage, CheckoutPage, SimplePage } from './pages/CartPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
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
              <Route path="products/:slug" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route
                path="wishlist"
                element={
                  <SimplePage title="Wishlist">
                    <p>Saved pieces appear here. Heart any product card to add it.</p>
                  </SimplePage>
                }
              />
              <Route
                path="account"
                element={
                  <SimplePage title="Account">
                    <p>Login / register and My Orders will live here. Guest checkout is supported.</p>
                  </SimplePage>
                }
              />
              <Route
                path="about"
                element={
                  <SimplePage title="Our Story">
                    <p>
                      We are a boutique of handpicked weaves, curated colors, and everyday elegance —
                      dress the moment with pieces made for celebration and comfort.
                    </p>
                  </SimplePage>
                }
              />
              <Route
                path="stores"
                element={
                  <SimplePage title="Stores">
                    <p>Visit us in Bengaluru, Hyderabad, and Chennai. Full addresses are on the homepage.</p>
                  </SimplePage>
                }
              />
              <Route
                path="policies/:slug"
                element={
                  <SimplePage title="Policies">
                    <p>Shipping, returns, privacy, and terms — placeholder policy content.</p>
                  </SimplePage>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
