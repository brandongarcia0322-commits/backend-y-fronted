'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, PanInfo } from 'framer-motion'

interface ProductVerticalShowcaseProps {
  images?: string[]
}

const defaultImages = [
  '/foto1.jpg',
  '/foto2.jpg',
  '/foto3.jpg',
]

export default function ProductVerticalShowcase({
  images = defaultImages,
}: ProductVerticalShowcaseProps) {
  const itemList =
    images.length >= 3
      ? images.slice(0, 3)
      : [...images, ...defaultImages].slice(0, 3)

  const [activeIndex, setActiveIndex] = useState(0)

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 30
    if (info.offset.y < -swipeThreshold) {
      setActiveIndex((prev) => (prev + 1) % itemList.length)
    } else if (info.offset.y > swipeThreshold) {
      setActiveIndex((prev) => (prev - 1 + itemList.length) % itemList.length)
    }
  }

  const getCardOffset = (index: number) => {
    const total = itemList.length
    let diff = (index - activeIndex) % total
    if (diff < -1) diff += total
    if (diff > 1) diff -= total
    return diff
  }

  return (
    /* Contenedor: más ancho (max-w-[640px]), más alto (h-[90vh]) */
    <div className="relative w-full max-w-[480px] sm:max-w-[580px] lg:max-w-[640px] h-[72vh] sm:h-[82vh] lg:h-[90vh] min-h-[520px] max-h-[950px] flex items-center justify-center overflow-hidden select-none my-auto">
      <div className="relative w-full h-full flex items-center justify-center">
        {itemList.map((imgSrc, index) => {
          const offset = getCardOffset(index)
          const isCenter = offset === 0

          // Desplazamiento vertical fluido
          const translateY = `${offset * 42}%`
          const scale = isCenter ? 1 : 0.88
          const opacity = isCenter ? 1 : 0.25
          const zIndex = isCenter ? 30 : 10

          return (
            <motion.div
              key={index}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              animate={{
                y: translateY,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
              }}
              transition={{
                type: 'spring',
                stiffness: 230,
                damping: 25,
                mass: 0.8,
              }}
              onClick={() => setActiveIndex(index)}
              style={{ willChange: 'transform, opacity' }}
              /* 
                MEJORAS CLAVE PARA CÉLULAR Y TAMAÑO:
                - touch-none: elimina el lag evitando que el scroll del celular choque con el drag.
                - transform-gpu: acelera el renderizado usando la tarjeta gráfica del móvil.
                - w-[92%] / h-[92%]: la tarjeta ocupa casi todo el espacio físico disponible.
              */
              className="absolute w-[92%] sm:w-[88%] h-[92%] rounded-3xl overflow-hidden bg-neutral-100 shadow-md sm:shadow-2xl cursor-grab active:cursor-grabbing border border-neutral-200/60 origin-center touch-none transform-gpu"
            >
              <div className="w-full h-full relative">
                <Image
                  src={imgSrc}
                  alt={`Vista ${index + 1}`}
                  fill
                  priority={isCenter}
                  sizes="(max-width: 640px) 90vw, 600px"
                  className="object-cover pointer-events-none"
                  unoptimized
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Indicadores laterales */}
      <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
        {itemList.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'h-6 bg-black'
                : 'h-2 bg-black/20 hover:bg-black/40'
            }`}
            aria-label={`Ver foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}