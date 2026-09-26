'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart-provider'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { formatMXN, type Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  const { toggleFavorite, isFavorite } = useCart()
  const fav = isFavorite(product.id)

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
          <ImagePlaceholder label={product.name} />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(product.id)
          }}
          aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              fav ? 'fill-ink text-ink' : 'text-ink/60',
            )}
          />
        </button>
      </div>
      <div className="pt-3">
        <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-ink/70">{formatMXN(product.price)}</p>
      </div>
    </Link>
  )
}
