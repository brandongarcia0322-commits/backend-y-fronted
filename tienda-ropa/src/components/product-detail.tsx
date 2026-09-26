'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart-provider'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { formatMXN, type Product } from '@/lib/products'

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem, openCart, toggleFavorite, isFavorite } = useCart()

  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(product.colors[0])
  const [activeSlot, setActiveSlot] = useState(0)
  const [pinnedSpec, setPinnedSpec] = useState<number | null>(null)
  const [hoverSpec, setHoverSpec] = useState<number | null>(null)
  const [error, setError] = useState(false)

  const fav = isFavorite(product.id)
  const highlight = hoverSpec ?? pinnedSpec

  function handleAdd(goCheckout = false) {
    if (!size) {
      setError(true)
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: color.name,
      size,
      qty,
    })
    if (goCheckout) {
      router.push('/checkout')
    } else {
      openCart()
    }
  }

  return (
    <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr_1fr]">
      {/* Left: specs */}
      <div className="order-2 px-6 py-12 lg:order-1 lg:py-20">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-sm text-ink/60 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Regresar
        </Link>

        <h1 className="mt-8 font-serif text-5xl italic leading-[0.95] tracking-tight text-ink">
          {product.name}
        </h1>

        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-ink/45">
          {product.category}
        </p>

        <h2 className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-ink">
          Especificaciones
        </h2>
        <ol className="mt-5 space-y-1">
          {product.specs.map((spec, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseEnter={() => setHoverSpec(i)}
                onMouseLeave={() => setHoverSpec(null)}
                onClick={() =>
                  setPinnedSpec((prev) => (prev === i ? null : i))
                }
                className={cn(
                  'flex w-full items-baseline gap-3 rounded-md px-2 py-2 text-left text-sm transition-all duration-300',
                  highlight === i
                    ? 'bg-ink text-white'
                    : 'text-ink/60 hover:text-ink',
                )}
              >
                <span className="tabular-nums opacity-50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {spec}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-5 px-2 text-[11px] uppercase tracking-[0.16em] text-ink/35">
          Pasa el cursor para resaltar · haz clic para fijar
        </p>
      </div>

      {/* Center: gallery */}
      <div className="order-1 flex flex-col gap-3 bg-sand p-3 lg:order-2 lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)]">
        <div className="relative flex-1 overflow-hidden rounded-xl">
          <ImagePlaceholder
            tone="dark"
            label={`${product.name} · vista ${activeSlot + 1}`}
          />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-street text-7xl text-white/10">
            {activeSlot + 1}
          </span>
        </div>
        <div className="flex gap-3">
          {Array.from({ length: product.slots }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveSlot(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                'h-20 flex-1 overflow-hidden rounded-lg ring-offset-2 transition-all',
                activeSlot === i ? 'ring-2 ring-ink' : 'opacity-70',
              )}
            >
              <ImagePlaceholder hint={false} />
            </button>
          ))}
        </div>
      </div>

      {/* Right: purchase */}
      <div className="order-3 px-6 py-12 lg:py-20">
        <div className="flex items-start justify-between">
          <p className="font-serif text-4xl tracking-tight text-ink">
            {formatMXN(product.price)}
          </p>
          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            aria-label="Favorito"
            className="flex size-10 items-center justify-center rounded-full border border-ink/12 transition-colors hover:bg-sand"
          >
            <Heart
              className={cn('size-4', fav ? 'fill-ink text-ink' : 'text-ink/60')}
            />
          </button>
        </div>

        {/* Sizes */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Talla</p>
          <div className="mt-3 flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s)
                  setError(false)
                }}
                className={cn(
                  'flex h-12 min-w-12 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-all',
                  size === s
                    ? 'border-ink bg-ink text-white'
                    : 'border-ink/15 text-ink hover:border-ink',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-600">
              Selecciona una talla para continuar.
            </p>
          )}
        </div>

        {/* Cantidad */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
            Cantidad
          </p>
          <div className="mt-3 flex w-fit items-center rounded-lg border border-ink/15">
            <button
              type="button"
              aria-label="Restar"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex size-11 items-center justify-center text-lg text-ink/70 hover:text-ink"
            >
              −
            </button>
            <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="Sumar"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="flex size-11 items-center justify-center text-lg text-ink/70 hover:text-ink"
            >
              +
            </button>
          </div>
        </div>

        {/* Color */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Color</p>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c)}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  'size-9 rounded-full border transition-all',
                  color.name === c.name
                    ? 'ring-2 ring-ink ring-offset-2'
                    : 'border-ink/15',
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/50">{color.name}</p>
        </div>

        {/* Actions */}
        <button
          type="button"
          onClick={() => handleAdd(false)}
          className="mt-9 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all hover:bg-ink/90"
        >
          <ShoppingBag className="size-4" />
          Agregar al carrito
        </button>
        <button
          type="button"
          onClick={() => handleAdd(true)}
          className="mt-3 w-full text-center text-xs font-semibold uppercase tracking-[0.24em] text-ink/60 transition-colors hover:text-ink"
        >
          Ir a realizar compra
        </button>
      </div>
    </div>
  )
}
