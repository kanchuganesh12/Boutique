import { useParams } from 'react-router-dom'
import { useNavigation } from '../lib/queries'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Seo } from '../components/ui/Seo'
import { ProductListing } from '../components/listing/ProductListing'
import { sized } from '../lib/image'

export default function CollectionPage() {
  const { slug = '' } = useParams()
  const { data: nav } = useNavigation()

  // Categories and collections share the /collections/:slug URL space; resolve from navigation data.
  const category = nav?.categories.find((c) => c.slug === slug)
  const collection = nav?.collections.find((c) => c.slug === slug)
  const isCurated = slug === 'new-arrivals' || slug === 'best-sellers'
  const isCategory = !!category && !isCurated
  const name = category?.name ?? collection?.name ?? slug.replace(/-/g, ' ')
  const description = collection?.description || `Handcrafted ${name.toLowerCase()} made for comfort and celebration.`
  const image = category?.image ?? collection?.image

  const base = isCategory ? { category: slug } : { collection: slug }

  return (
    <>
      <Seo title={name} description={description} image={image ?? undefined} />
      <ProductListing
        key={slug}
        base={base}
        label={name}
        header={
          <div className="mb-4 flex items-center gap-4 border-b border-border pb-4">
            {image ? <img src={sized(image, 160)} alt="" className="hidden h-16 w-16 rounded-full object-cover sm:block" /> : null}
            <div>
              <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: name }]} />
              <h1 className="text-2xl capitalize leading-tight">{name}</h1>
              <p className="mt-0.5 max-w-2xl text-sm text-muted">{description}</p>
            </div>
          </div>
        }
      />
    </>
  )
}
