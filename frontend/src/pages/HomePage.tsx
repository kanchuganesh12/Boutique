import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { api } from '../lib/api'
import { Hero } from '../components/home/Hero'
import { TopCollections } from '../components/home/TopCollections'
import { DressTheMoment } from '../components/home/DressTheMoment'
import { ShopByPrice } from '../components/home/ShopByPrice'
import { OccasionTabs } from '../components/home/OccasionTabs'
import { InsideBrand } from '../components/home/InsideBrand'
import { NewArrivalsBlock } from '../components/home/NewArrivalsBlock'
import { ReelsStrip } from '../components/home/ReelsStrip'
import { TrustBadges } from '../components/home/TrustBadges'
import { Testimonials } from '../components/home/Testimonials'
import { StoreLocations } from '../components/home/StoreLocations'
import { TrustMarquee } from '../components/layout/TrustMarquee'
import { ProductCarousel } from '../components/product/ProductCarousel'
import { ProductCardSkeleton } from '../components/product/ProductCard'

export function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['home'],
    queryFn: api.home,
  })

  if (isLoading) {
    return (
      <div className="container-boutique section-y grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="container-boutique section-y text-center">
        <p className="text-muted">Unable to load the boutique. Is the API running on port 8000?</p>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Boutique — Ethnic Womenswear</title>
      </Helmet>
      <Hero />
      <TrustMarquee items={data.trust_marquee} />
      <TopCollections categories={data.categories} />
      <DressTheMoment />
      <div className="bg-ivory">
        <ProductCarousel
          title="Best Sellers"
          subtitle="Top-loved products for quality, style, and value"
          products={data.best_sellers}
          viewAllTo="/collections/best-sellers"
        />
      </div>
      <ShopByPrice collections={data.collections} />
      <OccasionTabs occasions={data.occasions} />
      <InsideBrand />
      <div className="bg-ivory">
        <NewArrivalsBlock
          newArrivals={data.new_arrivals}
          collections={data.collections}
          spotlights={data.spotlights}
        />
      </div>
      <ReelsStrip />
      <TrustBadges />
      <Testimonials reviews={data.reviews} />
      <StoreLocations stores={data.stores} />
    </>
  )
}
