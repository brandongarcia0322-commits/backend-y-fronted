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
    <div className="relative w-full h-[85vh] sm:h-[88vh] lg:h-[92vh] flex items-center justify-center overflow-hidden select-none">
      <div className="relative w-full h-full flex items-center justify-center">
        {itemList.map((imgSrc, index) => {
          const offset = getCardOffset(index)
          const isCenter = offset === 0

          const translateY = `${offset * 50}%`
          const scale = isCenter ? 1 : 0.82
          const opacity = isCenter ? 1 : 0.2
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-none overflow-hidden bg-white cursor-grab active:cursor-grabbing touch-none transform-gpu flex items-center justify-center"
            >
              <div className="w-full h-full relative flex items-center justify-center">
                <Image
                  src={imgSrc}
                  alt={`Vista ${index + 1}`}
                  fill
                  priority={isCenter}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain pointer-events-none"
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
            className={`w-2 transition-all duration-300 rounded-none ${
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