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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden bg-white rounded-none transition-all duration-300"
    >
      <Link href={`/productos/${product.id}`} className="flex flex-col h-full">
        {/* 
          CORRECCIÓN DE RECORTE:
          - p-4 sm:p-6: Añade margen de respiro para que el cuello y base nunca toquen el borde.
          - flex items-center justify-center: Centra la prenda dentro del recuadro.
        */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-white p-4 sm:p-6 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            /* 
              object-contain evita que se recorte cualquier extremo de la prenda
            */
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />

          {/* Botón Flotante sobrepuesto */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none z-10">
            <span className="pointer-events-auto bg-white text-ink text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-4 py-2.5 rounded-none border border-neutral-200 shadow-md">
              Ver detalle <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </div>
        </div>

        {/* Información del Producto */}
        <div className="p-4 flex flex-col space-y-1 flex-1 bg-white">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
            {product.category || 'TEXTILES REYES'}
          </span>
          <h3 className="font-display text-base md:text-lg uppercase tracking-wider text-ink line-clamp-1">
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