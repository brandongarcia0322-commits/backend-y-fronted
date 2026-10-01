'use client'

import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { formatMXN } from '@/lib/products'

export function CartDrawer() {
  const router = useRouter()
  const { isOpen, closeCart, items, subtotal, updateQty, removeItem } =
    useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Cerrar carrito"
            onClick={closeCart}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-[90%] max-w-md flex-col bg-white"
            variants={{ hidden: { x: '100%' }, visible: { x: 0 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <button
                type="button"
                onClick={closeCart}
                className="flex items-center gap-2 text-sm text-ink/60 transition-colors hover:text-ink"
              >
                <X className="size-4" />
                Cerrar
              </button>
            </div>

            <h2 className="px-6 pb-6 pt-4 font-serif text-3xl tracking-tight">
              Tu carrito
            </h2>

            <div className="flex-1 overflow-y-auto px-6 no-scrollbar">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 pb-20 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-sand">
                    <ShoppingBag className="size-6 text-ink/50" />
                  </span>
                  <p className="text-sm text-ink/50">
                    Tu carrito está vacío por ahora.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-ink/8">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 py-5"
                      >
                        <div className="size-20 shrink-0 overflow-hidden rounded-lg">
                         <img
  src={(item as any).image || '/t1.jpg'}
  alt={item.name}
  className="h-full w-full object-cover object-center"
/>
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium leading-tight text-ink">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-ink/45">
                                {item.color} · {item.size}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.key)}
                              aria-label="Eliminar"
                              className="text-ink/40 transition-colors hover:text-ink"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center rounded-full border border-ink/12">
                              <button
                                type="button"
                                aria-label="Restar"
                                onClick={() =>
                                  updateQty(item.key, item.qty - 1)
                                }
                                className="flex size-8 items-center justify-center text-ink/70 transition-colors hover:text-ink"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                aria-label="Sumar"
                                onClick={() =>
                                  updateQty(item.key, item.qty + 1)
                                }
                                className="flex size-8 items-center justify-center text-ink/70 transition-colors hover:text-ink"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <span className="text-sm text-ink/70">
                              {item.qty} × {formatMXN(item.price)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-ink/10 px-6 py-6">
              <div className="flex items-center justify-between pb-4">
                <span className="text-sm uppercase tracking-[0.18em] text-ink/60">
                  Total
                </span>
                <span className="font-medium">{formatMXN(subtotal)}</span>
              </div>
              <button
                type="button"
                disabled={items.length === 0}
                onClick={() => {
                  closeCart()
                  router.push('/checkout')
                }}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all duration-500 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Finalizar compra
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}