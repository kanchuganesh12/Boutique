import { useSearchParams } from 'react-router-dom'
import { useNavigation } from '../lib/queries'
import { Seo } from '../components/ui/Seo'
import { ProductListing } from '../components/listing/ProductListing'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q')?.trim() ?? ''
  const category = params.get('category') ?? ''
  const { data: nav } = useNavigation()
  const department = nav?.categories.find((c) => c.slug === category)?.name
  const label = [q, department && `in ${department}`].filter(Boolean).join(' ') || 'All products'

  return (
    <>
      <Seo title={q ? `Search: ${q}` : 'Search'} />
      <ProductListing key={`${q}|${category}`} base={{ q, category: category || undefined }} label={label} />
    </>
  )
}
