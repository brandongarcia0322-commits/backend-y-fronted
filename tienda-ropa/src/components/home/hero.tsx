'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { ImagePlaceholder } from '@/components/image-placeholder'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <ImagePlaceholder tone="dark" label="Imagen principal" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/80"
        >
          Streetwear · Serigrafía · Personalización
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease, delay: 0.35 }}
          className="mt-4 font-serif text-[15vw] italic leading-[0.85] text-white sm:text-[11vw] lg:text-[9rem]"
        >
          Textiles Reyes
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.6 }}
          className="mt-6 max-w-md text-sm text-white/75 sm:text-base"
        >
          Prendas premium hechas para la calle. Diseña, imprime y viste tu
          propia identidad.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.75 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/productos"
            className="rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition-transform hover:scale-[1.03]"
          >
            Ver temporada
          </Link>
          <Link
            href="/cotiza"
            className="rounded-full border border-white/40 px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-ink"
          >
            Cotiza tu diseño
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="size-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
