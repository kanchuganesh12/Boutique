import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useShopStore } from '../../lib/store'
import { sized } from '../../lib/image'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Overlay'
import { Price } from '../ui/Price'
import { QuantityStepper } from '../ui/QuantityStepper'
import { SizeGuide } from './SizeGuide'
import { SizeSelector } from './SizeSelector'

/** Global quick-view / size picker opened from any product card. */
export function QuickView() {
  const product = useShopStore((s) => s.quickView)
  const setQuickView = useShopStore((s) => s.setQuickView)
  // Keep the last product rendered while the modal animates out.
  const [last, setLast] = useState<Product | null>(product)
  if (product && product !== last) setLast(product)
  const close = () => setQuickView(null)

  return (
    <Modal open={!!product} onClose={close} title={last?.name ?? 'Quick view'} size="lg" hideTitle>
      {last ? <QuickViewBody key={last.slug} product={last} onClose={close} /> : null}
    </Modal>
  )
}

function QuickViewBody({ product: p, onClose }: { product: Product; onClose: () => void }) {
  const addItem = useShopStore((s) => s.addItem)
  const [size, setSize] = useState<string | undefined>(p.sizes.length === 1 ? p.sizes[0] : undefined)
  const [qty, setQty] = useState(1)
  const [img, setImg] = useState(0)
  const [error, setError] = useState(false)
  const [guide, setGuide] = useState(false)

  return (
    <div className="grid gap-6 px-4 pb-6 sm:grid-cols-2 sm:px-6">
      <div>
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-ivory-deep">
          <img src={sized(p.images[img]?.url, 800)} alt={p.images[img]?.alt || p.name} className="h-full w-full object-cover" />
        </div>
        {p.images.length > 1 ? (
          <div className="mt-2 flex gap-2">
            {p.images.map((im, i) => (
              <button
                key={im.url}
                type="button"
                aria-label={`Image ${i + 1}`}
                onClick={() => setImg(i)}
                className={`h-16 w-12 overflow-hidden rounded border-2 ${i === img ? 'border-buy' : 'border-transparent'}`}
              >
                <img src={sized(im.url, 120)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-normal leading-tight">{p.name}</h2>
          <Price product={p} size="lg" className="mt-2" />
          {p.description ? <p className="mt-3 text-sm text-muted">{p.description}</p> : null}
        </div>
        <SizeSelector
          sizes={p.sizes}
          value={size}
          onChange={(s) => {
            setSize(s)
            setError(false)
          }}
          error={error}
          onOpenGuide={() => setGuide(true)}
        />
        <div className="flex gap-3">
          <QuantityStepper value={qty} onChange={setQty} />
          <Button
            className="flex-1"
            onClick={() => {
              if (!size) return setError(true)
              addItem(p, size, qty)
            }}
          >
            {p.pre_order?.is_pre_order ? 'Pre-order' : 'Add to Cart'}
          </Button>
        </div>
        <Link to={`/products/${p.slug}`} onClick={onClose} className="a-link text-sm">
          View full details
        </Link>
      </div>
      <SizeGuide open={guide} onClose={() => setGuide(false)} />
    </div>
  )
}
