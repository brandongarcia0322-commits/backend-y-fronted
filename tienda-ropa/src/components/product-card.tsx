'use client'

import type { Product } from '@/lib/products'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
}


export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = (product as any).image || (product as any).images?.[0] || '/placeholder.svg'
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-neutral-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-black/20"
    >
      <Link href={`/productos/${product.id}`} className="block">
        {/* Contenedor de Imagen con Zoom de Realce */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <Image
           src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            unoptimized
          />
          {/* Degradado y botón de acción flotante en hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              Ver detalle <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </div>
        </div>

        {/* Información del producto */}
        <div className="p-4 flex flex-col space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
            {product.category || 'TEXTILES REYES'}
          </span>
          <h3 className="font-display text-base md:text-lg uppercase tracking-wider text-ink line-clamp-1 group-hover:text-black transition-colors">
            {product.name}
          </h3>
          <p className="font-bold text-sm text-neutral-900 pt-1">
            ${product.price} <span className="text-[10px] text-neutral-400 font-normal">MXN</span>
          </p>
        </div>
      </Link>
    </motion.div>
  )
}