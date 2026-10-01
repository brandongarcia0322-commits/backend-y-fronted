'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export function Hero() {
  const { scrollY } = useScroll()

  // 1. Reduce el logo de tamaño 100% a 25% al bajar
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.25])
  
  // 2. Eleva el logo hacia el centro de la barra superior
  const logoY = useTransform(scrollY, [0, 300], [0, -220])
  
  // 3. Desvanece el logo grande justo al llegar arriba para entregar el relevo al header
  const logoOpacity = useTransform(scrollY, [220, 300], [1, 0])
  
  // 4. Ocualta la flecha de scroll rápidamente
  const arrowOpacity = useTransform(scrollY, [0, 100], [1, 0])

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-black">
      {/* IMAGEN DE FONDO */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Fondo Textiles Reyes"
          fill
          priority
          quality={90}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      </div>

      {/* LOGO CON ANIMACIÓN DE SCROLL */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          style={{
            scale: logoScale,
            y: logoY,
            opacity: logoOpacity,
          }}
          className="relative flex items-center justify-center origin-center"
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

      {/* INDICADOR DE SCROLL */}
      <motion.div
        style={{ opacity: arrowOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 z-10 pointer-events-none"
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