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
      /* EFECTO DE REALCE: Elevación (-translate-y-3), bordes redondeados (rounded-2xl) y sombra profunda al hover */
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-sand border border-black/5 transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl hover:border-black/20"
    >
      {/* Zoom suave a la imagen en Hover */}
      <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110">
        <ImagePlaceholder label={product.name} />
      </div>

      {/* Degradado e información con elevación en hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 transition-all duration-300">
        <div className="flex items-end justify-between gap-3">
          <div className="text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
              {product.category}
            </p>
            <p className="mt-1 font-serif text-xl italic leading-tight group-hover:translate-x-1 transition-transform duration-300">
              {product.name}
            </p>
            <p className="mt-1 text-sm text-white/90 font-medium">
              {formatMXN(product.price)}
            </p>
          </div>

          {/* Botón Flotante para Agregar al Carrito */}
          <button
            type="button"
            aria-label={`Agregar ${product.name} al carrito`}
            onClick={(e) => {
              e.preventDefault()
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                color: product.colors?.[0]?.name || 'Gris',
                size: 'M',
                qty: 1,
              })
            }}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 hover:scale-110 shadow-md hover:shadow-lg"
          >
            <Plus className="size-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}