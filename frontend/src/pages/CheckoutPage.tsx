import { Check, Lock, ShoppingBag } from 'lucide-react'
import clsx from 'clsx'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useShopStore } from '../lib/store'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Field, inputClasses } from '../components/ui/Field'
import { Seo } from '../components/ui/Seo'
import { OrderSummary } from '../components/cart/OrderSummary'

const STATES = [
  'Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
]

type Form = {
  contact_email: string
  contact_name: string
  phone: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  pincode: string
  payment: 'upi' | 'cod'
}

const STEPS = ['Contact', 'Delivery', 'Payment'] as const

function validate(step: number, f: Form) {
  const e: Partial<Record<keyof Form, string>> = {}
  if (step === 0) {
    if (!/^\S+@\S+\.\S+$/.test(f.contact_email)) e.contact_email = 'Enter a valid email'
    if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a 10-digit mobile number'
  }
  if (step === 1) {
    if (f.contact_name.trim().length < 2) e.contact_name = 'Enter your full name'
    if (f.address_line1.trim().length < 5) e.address_line1 = 'Enter your street address'
    if (!f.city.trim()) e.city = 'Enter your city'
    if (!f.state) e.state = 'Select a state'
    if (!/^[1-9]\d{5}$/.test(f.pincode)) e.pincode = 'Enter a 6-digit PIN code'
  }
  return e
}

export default function CheckoutPage() {
  const items = useShopStore((s) => s.items)
  const promo = useShopStore((s) => s.promo)
  const clearCart = useShopStore((s) => s.clearCart)
  const addOrder = useShopStore((s) => s.addOrder)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [form, setForm] = useState<Form>({
    contact_email: '',
    contact_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    payment: 'upi',
  })

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const next = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(step, form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      return
    }
    placeOrder()
  }

  const placeOrder = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const order = await api.createOrder({
        contact_email: form.contact_email,
        contact_name: form.contact_name,
        phone: form.phone,
        address_line1: form.address_line1,
        address_line2: form.address_line2 || undefined,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        promo_code: promo?.code,
        guest: true,
        items: items.map((i) => ({
          product_id: i.product.id,
          sku: i.product.sku,
          name: i.product.name,
          size: i.size,
          quantity: i.quantity,
          unit_price: i.product.sale_price ?? i.product.price,
        })),
      })
      addOrder({
        id: order.id,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        itemCount: items.reduce((n, i) => n + i.quantity, 0),
        thumb: items[0]?.product.images[0]?.url,
      })
      clearCart()
      navigate(`/order/${order.id}`, { replace: true })
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Could not place your order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!items.length) {
    return (
      <div className="container-boutique section-y">
        <Seo title="Checkout" />
        <EmptyState icon={ShoppingBag} title="Your bag is empty" action={<Button to="/">Continue shopping</Button>}>
          Add something you love, then come back to check out.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="container-boutique pb-16 pt-6 md:pt-10">
      <Seo title="Checkout" />
      <h1 className="font-sans text-[28px] font-normal">Checkout</h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <Lock className="h-3.5 w-3.5" /> Secure guest checkout — demo store, no payment is taken.
      </p>

      <ol className="my-8 flex items-center gap-2 text-sm" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled={i > step}
              onClick={() => setStep(i)}
              aria-current={i === step ? 'step' : undefined}
              className={clsx(
                'flex items-center gap-2 font-medium disabled:cursor-default',
                i === step ? 'text-ink' : i < step ? 'text-primary' : 'text-muted',
              )}
            >
              <span
                className={clsx(
                  'flex h-7 w-7 items-center justify-center rounded-full border text-xs',
                  i < step ? 'border-primary bg-primary text-white' : i === step ? 'border-ink' : 'border-border',
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 ? <span className={clsx('h-px flex-1', i < step ? 'bg-primary' : 'bg-border')} /> : null}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
        <form onSubmit={next} noValidate className="space-y-6">
          {step > 0 ? (
            <Done title="Contact" onEdit={() => setStep(0)}>
              {form.contact_email} · {form.phone}
            </Done>
          ) : null}
          {step > 1 ? (
            <Done title="Delivery" onEdit={() => setStep(1)}>
              {form.contact_name}, {form.address_line1}, {form.city}, {form.state} {form.pincode}
            </Done>
          ) : null}

          <section className="rounded-lg border border-border bg-white p-5 sm:p-6">
            <h2 className="mb-5 font-sans text-lg font-bold">{STEPS[step]}</h2>

            {step === 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" type="email" autoComplete="email" required value={form.contact_email} onChange={set('contact_email')} error={errors.contact_email} className="sm:col-span-2" hint="We’ll send your order confirmation here." />
                <Field label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} required value={form.phone} onChange={set('phone')} error={errors.phone} hint="For delivery updates on WhatsApp/SMS." />
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" autoComplete="name" required value={form.contact_name} onChange={set('contact_name')} error={errors.contact_name} className="sm:col-span-2" />
                <Field label="Address" autoComplete="address-line1" required value={form.address_line1} onChange={set('address_line1')} error={errors.address_line1} placeholder="House no., street, area" className="sm:col-span-2" />
                <Field label="Apartment, landmark (optional)" autoComplete="address-line2" value={form.address_line2} onChange={set('address_line2')} className="sm:col-span-2" />
                <Field label="PIN code" inputMode="numeric" autoComplete="postal-code" maxLength={6} required value={form.pincode} onChange={set('pincode')} error={errors.pincode} />
                <Field label="City" autoComplete="address-level2" required value={form.city} onChange={set('city')} error={errors.city} />
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="mb-1.5 block text-sm font-medium">
                    State <span className="text-sale">*</span>
                  </label>
                  <select id="state" autoComplete="address-level1" value={form.state} onChange={set('state')} aria-invalid={errors.state ? true : undefined} className={inputClasses}>
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state ? <p className="mt-1 text-xs text-sale">{errors.state}</p> : null}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <fieldset className="space-y-3">
                <legend className="sr-only">Payment method</legend>
                {[
                  { value: 'upi', title: 'UPI', text: 'Google Pay, PhonePe, Paytm — pay on the next screen (demo).' },
                  { value: 'cod', title: 'Cash on delivery', text: 'Pay in cash or UPI when your order arrives.' },
                ].map((m) => (
                  <label
                    key={m.value}
                    className={clsx(
                      'flex cursor-pointer items-start gap-3 rounded-md border p-4 transition',
                      form.payment === m.value ? 'border-primary bg-primary/5' : 'border-border hover:border-ink/30',
                    )}
                  >
                    <input type="radio" name="payment" value={m.value} checked={form.payment === m.value} onChange={set('payment')} className="mt-1 accent-[var(--color-primary)]" />
                    <span>
                      <span className="block font-semibold">{m.title}</span>
                      <span className="text-sm text-muted">{m.text}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            ) : null}

            {submitError ? (
              <p role="alert" className="mt-4 rounded-md bg-sale/10 px-3 py-2 text-sm text-sale">
                {submitError}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="text-sm font-semibold text-muted underline underline-offset-4">
                  Back
                </button>
              ) : (
                <span />
              )}
              <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
                {step === STEPS.length - 1 ? (
                  <>
                    <Lock className="h-4 w-4" /> Place order
                  </>
                ) : (
                  `Continue to ${STEPS[step + 1].toLowerCase()}`
                )}
              </Button>
            </div>
          </section>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary showItems />
        </aside>
      </div>
    </div>
  )
}

function Done({ title, children, onEdit }: { title: string; children: ReactNode; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white/60 p-4 text-sm">
      <div>
        <p className="flex items-center gap-2 font-semibold">
          <Check className="h-4 w-4 text-success" /> {title}
        </p>
        <p className="mt-1 text-muted">{children}</p>
      </div>
      <button type="button" onClick={onEdit} className="a-link text-sm">
        Edit
      </button>
    </div>
  )
}
