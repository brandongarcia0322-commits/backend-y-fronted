'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/lib/products'

interface EditorialCardProps {
  product: Product
}

export function EditorialCard({ product }: EditorialCardProps) {
  const imageUrl =
    (product as any).image ||
    (product as any).images?.[0] ||
    '/placeholder.svg'

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white"    >
      <Link href={`/productos/${product.id}`} className="block h-full w-full">
        {/* Imagen principal con efecto de Zoom */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          unoptimized
        />

        {/* Degradado oscuro: Oculto en escritorio, aparece al hacer hover. En móvil es visible para que se pueda leer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 ease-out" />

        {/* Información (Texto y Precio): Se desliza hacia arriba al pasar el cursor */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex items-end justify-between transition-all duration-300 ease-out opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
              {product.category || 'SERIGRAFÍA'}
            </span>
            <h3 className="font-display text-sm md:text-lg uppercase tracking-wider text-white line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs md:text-sm font-bold text-white/90">
              ${product.price} <span className="text-[10px] font-normal text-neutral-300">MXN</span>
            </p>
          </div>

          {/* Botón flotante */}
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:bg-white group-hover:text-black transition-colors duration-300 shrink-0 ml-2">
            <span className="text-lg font-light">+</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}