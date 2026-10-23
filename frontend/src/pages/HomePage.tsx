import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Seo } from '../components/ui/Seo'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { Hero } from '../components/home/Hero'
import { CARD_ROW, FeatureCard, QuadCard, SignInCard, type Tile } from '../components/home/HomeCards'
import { ProductCarousel } from '../components/product/ProductCarousel'
import { CURATED_SLUGS } from '../lib/queries'
import type { Product } from '../types'

const productTiles = (products: Product[] = []): Tile[] =>
  products.map((p) => ({ label: p.name, image: p.images[0]?.url, to: `/products/${p.slug}` }))

export default function HomePage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['home'],
    queryFn: api.home,
    staleTime: 60_000,
  })

  const departments = (data?.categories ?? []).filter((c) => !CURATED_SLUGS.includes(c.slug))
  const categoryTiles = departments.map((c) => ({ label: c.name, image: c.image, to: `/collections/${c.slug}` }))
  const priceTiles = (data?.collections ?? [])
    .filter((c) => c.type === 'price')
    .map((c) => ({ label: c.name, image: c.image, to: `/collections/${c.slug}` }))
  const collectionName = (slug: string) => data?.collections.find((c) => c.slug === slug)?.name ?? slug.replace(/-/g, ' ')
  const occasions = Object.entries(data?.occasions ?? {})

  return (
    <div className="bg-page pb-6">
      <Seo
        title="Boutique"
        description="Handcrafted ethnic womenswear — Banarasi and Kota sarees, kurtas, salwar sets, designer blouses and kidswear."
      />
      {/* Hero is static content, so it renders immediately while data loads. */}
      <Hero />

      {isError ? (
        <div className="container-boutique relative">
          <div className="bg-white">
            <ErrorState onRetry={() => refetch()} message="We couldn’t load our latest collections." />
          </div>
        </div>
      ) : (
        <>
          <div className={`${CARD_ROW} z-10 -mt-[90px] sm:-mt-[160px] lg:-mt-[330px]`}>
            {data ? (
              <>
                <QuadCard title="Shop by department" tiles={categoryTiles} moreLabel="Explore all departments" moreTo="/search" />
                <QuadCard title="Best Sellers in ethnic wear" tiles={productTiles(data.best_sellers)} moreTo="/collections/best-sellers" />
                <QuadCard title="Shop by budget" tiles={priceTiles} moreLabel="See all deals" moreTo="/collections/under-3000" />
                <SignInCard tile={categoryTiles[4] ? { ...categoryTiles[4], label: `New in ${categoryTiles[4].label}` } : undefined} />
              </>
            ) : isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-5">
                  <Skeleton className="mb-3 h-6 w-2/3" />
                  <Skeleton className="aspect-square" />
                </div>
              ))
            ) : null}
          </div>

          <ProductCarousel
            title="Today’s best sellers"
            products={data?.best_sellers}
            loading={isLoading}
            viewAllTo="/collections/best-sellers"
            variant="strip"
            className="pb-5"
          />

          {data ? (
            <div className={CARD_ROW}>
              <QuadCard title="New arrivals for you" tiles={productTiles(data.new_arrivals)} moreTo="/collections/new-arrivals" />
              {occasions.map(([slug, products]) => (
                <QuadCard key={slug} title={`Dress for ${collectionName(slug)}`} tiles={productTiles(products)} moreTo={`/collections/${slug}`} />
              ))}
              {categoryTiles[0] ? <FeatureCard title={`Handwoven ${categoryTiles[0].label.toLowerCase()}`} tile={categoryTiles[0]} /> : null}
            </div>
          ) : null}

          <ProductCarousel
            title="New releases"
            products={data?.new_arrivals}
            loading={isLoading}
            viewAllTo="/collections/new-arrivals"
            className="pb-5"
          />

          {Object.entries(data?.spotlights ?? {})
            .filter(([slug]) => slug !== 'best-sellers')
            .map(([slug, products]) => (
            <ProductCarousel
              key={slug}
              title={`Top picks in ${collectionName(slug)}`}
              products={products}
              viewAllTo={`/collections/${slug === 'designer-blouses' ? 'blouses' : slug}`}
              variant="strip"
              className="pb-5"
            />
          ))}
        </>
      )}
    </div>
  )
}
