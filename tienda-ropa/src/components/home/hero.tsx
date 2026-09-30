'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-black">
      {/* 1. IMAGEN DE FONDO */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Fondo Textiles Reyes"
          fill
          priority
          quality={90}
          className="object-cover object-center"
        />
        {/* Capa oscura para dar legibilidad al logo */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      </div>

      {/* 2. CONTENIDO CENTRAL (LOGO) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <Image
            src="/logo.png"
            alt="Textiles Reyes Logo"
            width={600}
            height={350}
            priority
            style={{ width: 'auto', height: 'auto' }}
            className="max-w-[280px] sm:max-w-[450px] lg:max-w-[620px] object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* 3. INDICADOR DE SCROLL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 z-10"
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