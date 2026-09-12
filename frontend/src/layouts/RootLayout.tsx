import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { AnnouncementBar } from '../components/layout/AnnouncementBar'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Toast, WhatsAppFloat } from '../components/layout/Floaters'

export function RootLayout() {
  const { data } = useQuery({
    queryKey: ['home'],
    queryFn: api.home,
    staleTime: 60_000,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar messages={data?.announcements ?? []} />
      <Header categories={data?.categories ?? []} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toast />
    </div>
  )
}
