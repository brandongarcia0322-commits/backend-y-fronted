'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Check, ArrowLeft } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { formatMXN } from '@/lib/products'

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const [done, setDone] = useState(false)

  const shipping = items.length > 0 ? 150 : 0
  const total = subtotal + shipping

  const fieldClass =
    'w-full rounded-xl bg-sand px-4 py-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink/45 focus:ring-2 focus:ring-ink/15'

  if (done) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 pt-16 text-center">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex size-16 items-center justify-center rounded-full bg-ink text-white"
        >
          <Check className="size-7" />
        </motion.span>
        <h1 className="mt-8 font-serif text-4xl italic text-ink">
          ¡Pedido confirmado!
        </h1>
        <p className="mt-3 max-w-sm text-sm text-ink/55">
          Recibimos tu compra. Te enviaremos la confirmación y el seguimiento
          por correo.
        </p>
        <Link
          href="/productos"
          className="mt-8 rounded-full bg-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white"
        >
          Seguir comprando
        </Link>
      </main>
    )
  }

  return (
    <main className="pt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-sm text-ink/60 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Seguir comprando
        </Link>

        <h1 className="mt-6 font-serif text-5xl italic tracking-tight text-ink">
          Checkout
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-sand px-8 py-20 text-center">
            <p className="font-serif text-2xl italic text-ink">
              Tu carrito está vacío
            </p>
            <Link
              href="/productos"
              className="mt-6 inline-flex rounded-full bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                clear()
                setDone(true)
              }}
              className="flex flex-col gap-8"
            >
              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  Contacto
                </legend>
                <div className="mt-4 grid gap-3">
                  <input required placeholder="Correo electrónico" type="email" className={fieldClass} />
                  <input required placeholder="Teléfono" type="tel" className={fieldClass} />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  Envío
                </legend>
                <div className="mt-4 grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required placeholder="Nombre" className={fieldClass} />
                    <input required placeholder="Apellido" className={fieldClass} />
                  </div>
                  <input required placeholder="Dirección" className={fieldClass} />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input required placeholder="Ciudad" className={fieldClass} />
                    <input required placeholder="Estado" className={fieldClass} />
                    <input required placeholder="C.P." className={fieldClass} />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  Pago
                </legend>
                <div className="mt-4 grid gap-3">
                  <input required placeholder="Número de tarjeta" inputMode="numeric" className={fieldClass} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required placeholder="MM / AA" className={fieldClass} />
                    <input required placeholder="CVV" inputMode="numeric" className={fieldClass} />
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                className="rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all hover:bg-ink/90"
              >
                Pagar {formatMXN(total)}
              </button>
            </form>

            {/* Summary */}
            <aside className="h-fit rounded-2xl bg-sand p-6 lg:sticky lg:top-24">
              <h2 className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Resumen
              </h2>
              <ul className="mt-5 space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4"
                    >
                      <div className="size-16 shrink-0 overflow-hidden rounded-lg">
                        <ImagePlaceholder hint={false} />
                      </div>
                      <div className="flex flex-1 justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.1em] text-ink">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-ink/50">
                            {item.size} · {item.color} · x{item.qty}
                          </p>
                        </div>
                        <p className="text-sm text-ink/70">
                          {formatMXN(item.price * item.qty)}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
                <div className="flex justify-between text-ink/60">
                  <span>Subtotal</span>
                  <span>{formatMXN(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink/60">
                  <span>Envío</span>
                  <span>{formatMXN(shipping)}</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-medium text-ink">
                  <span>Total</span>
                  <span>{formatMXN(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
