'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { ImagePlaceholder } from '@/components/image-placeholder'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0">
        <ImagePlaceholder tone="dark" label="Imagen principal" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55" />

      {/* Contenido Central: Únicamente la imagen de tu logo */}
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* Guarda tu imagen en: tienda-ropa/public/logo.png */}
          <Image
            src="/logo.png"
            alt="Textiles Reyes Logo"
            width={500}
            height={250}
            priority
            className="h-auto w-auto max-w-[280px] object-contain sm:max-w-[420px] lg:max-w-[500px]"
          />
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
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