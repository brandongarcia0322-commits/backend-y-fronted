'use client'

import { motion } from 'motion/react'
import { ImagePlaceholder } from '@/components/image-placeholder'

export function Lookbook() {
  const frames = Array.from({ length: 6 })
  const row = [...frames, ...frames]

  return (
    <section className="overflow-hidden py-16 sm:py-24">
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <p className="font-serif text-3xl italic tracking-tight text-ink sm:text-4xl">
          @Textiles.REYES
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink/45">
          Lookbook en las calles
        </p>
      </div>

      <motion.div
        className="flex w-max gap-3"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {row.map((_, i) => (
          <div
            key={i}
            className="h-[420px] w-[280px] shrink-0 overflow-hidden sm:h-[520px] sm:w-[340px]"
          >
            <ImagePlaceholder tone="dark" label="Foto lookbook" />
          </div>
        ))}
      </motion.div>
    </section>
  )
}
