'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { formatMXN, type Product } from '@/lib/products'

export function EditorialCard({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group relative block aspect-[3/4] overflow-hidden bg-sand"
    >
      <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
        <ImagePlaceholder label={product.name} />
      </div>

      {/* Hover reveal */}
      <div className="absolute inset-x-0 bottom-0 translate-y-4 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-end justify-between gap-3">
          <div className="text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
              {product.category}
            </p>
            <p className="mt-1 font-serif text-xl italic leading-tight">
              {product.name}
            </p>
            <p className="mt-1 text-sm text-white/80">
              {formatMXN(product.price)}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Agregar ${product.name} al carrito`}
            onClick={(e) => {
              e.preventDefault()
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                color: product.colors[0].name,
                size: 'M',
                qty: 1,
              })
            }}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-110"
          >
            <Plus className="size-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}
