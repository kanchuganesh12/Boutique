import { useQuery } from '@tanstack/react-query'
import { MapPin, Phone } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Button } from '../components/ui/Button'
import { Seo } from '../components/ui/Seo'
import { Skeleton } from '../components/ui/Skeleton'

type Page = { title: string; intro: string; sections: { heading: string; body: string }[] }

// Placeholder copy; source from a CMS when content owners need to edit it.
const PAGES: Record<string, Page> = {
  about: {
    title: 'Our Story',
    intro: 'A boutique of handpicked weaves, curated colours and everyday elegance — made for celebration and comfort.',
    sections: [
      { heading: 'Made by hand', body: 'We work directly with over 120 weaver families across Varanasi, Kota and Kanchipuram, so craft stays alive and fair wages reach the loom.' },
      { heading: 'Designed in-house', body: 'Every blouse, kurta and set is cut and finished by our in-house atelier, with fit tested on real bodies.' },
      { heading: 'Built to last', body: 'Natural fibres, honest prices and pieces you’ll pass down — not fast fashion.' },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    intro: 'We ship across India from our Bengaluru studio.',
    sections: [
      { heading: 'Timelines', body: 'Ready-to-ship orders dispatch within 1–2 business days and arrive in 2–7 days. Pre-orders ship on the expected date shown on the product page.' },
      { heading: 'Charges', body: 'Free shipping on orders above ₹2,999. A flat ₹99 applies below that.' },
    ],
  },
  returns: {
    title: 'Returns & Refunds',
    intro: 'Not quite right? Most styles can be returned within 7 days of delivery.',
    sections: [
      { heading: 'Eligibility', body: 'Items must be unworn with tags attached. Customised and pre-order pieces are not eligible.' },
      { heading: 'Refunds', body: 'Refunds are issued to the original payment method within 5–7 business days of receiving the return.' },
    ],
  },
  faq: {
    title: 'FAQ',
    intro: 'Answers to what customers ask us most.',
    sections: [
      { heading: 'Do sarees come with a blouse piece?', body: 'Yes — most sarees include a 0.8 m unstitched blouse piece. Check product details.' },
      { heading: 'Can I get a blouse stitched?', body: 'Chat with a stylist on WhatsApp for made-to-measure options.' },
      { heading: 'Is cash on delivery available?', body: 'Yes, on most PIN codes. Check delivery on any product page.' },
    ],
  },
  privacy: { title: 'Privacy Policy', intro: 'We only collect what we need to fulfil your order and never sell your data.', sections: [] },
  terms: { title: 'Terms of Service', intro: 'By shopping with us you agree to our standard terms of sale.', sections: [] },
  contact: {
    title: 'Contact Us',
    intro: 'Our stylists are available Monday to Saturday, 10am–7pm IST.',
    sections: [
      { heading: 'WhatsApp', body: '+91 98765 43210 — the fastest way to reach us.' },
      { heading: 'Email', body: 'hello@boutique.example' },
    ],
  },
  careers: { title: 'Careers', intro: 'We’re a small team that loves craft. Write to careers@boutique.example to say hello.', sections: [] },
}

export default function InfoPage({ slug: fixedSlug }: { slug?: string }) {
  const params = useParams()
  const slug = fixedSlug ?? params.slug ?? ''
  const page = PAGES[slug] ?? { title: 'Policies', intro: 'This page is being written.', sections: [] }

  return (
    <div className="container-boutique pb-16 pt-6 md:pt-10">
      <Seo title={page.title} description={page.intro} />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: page.title }]} />
      <div className="max-w-3xl">
        <h1 className="font-sans text-[28px] font-normal">{page.title}</h1>
        <p className="mt-4 text-lg text-muted">{page.intro}</p>
        <div className="mt-10 space-y-8">
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-sans text-lg font-bold">{s.heading}</h2>
              <p className="mt-2 leading-relaxed text-ink/80">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StoresPage() {
  const { data: stores, isLoading } = useQuery({ queryKey: ['stores'], queryFn: api.stores, staleTime: 10 * 60_000 })
  return (
    <div className="container-boutique pb-16 pt-6 md:pt-10">
      <Seo title="Stores" description="Visit our boutiques to try on weaves with our stylists." />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Stores' }]} />
      <h1 className="font-sans text-[28px] font-normal">Visit our stores</h1>
      <p className="mt-3 max-w-xl text-lg text-muted">Try on weaves in person, get draping help, and book a styling appointment.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56" />)
          : stores?.map((s) => (
              <article key={s.id} className="flex flex-col rounded-lg border border-border bg-white p-6">
                <MapPin className="mb-3 h-6 w-6 text-primary" strokeWidth={1.5} />
                <h2 className="font-sans text-lg font-bold">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {s.address}
                  <br />
                  {s.city} {s.pincode}
                </p>
                {s.phone ? (
                  <a href={`tel:${s.phone}`} className="mt-3 flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" /> {s.phone}
                  </a>
                ) : null}
                {s.maps_url ? (
                  <Button variant="secondary" className="mt-5" onClick={() => window.open(s.maps_url!, '_blank', 'noopener')}>
                    Get directions
                  </Button>
                ) : null}
              </article>
            ))}
      </div>
    </div>
  )
}
