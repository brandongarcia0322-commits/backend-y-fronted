'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Hero } from '@/components/home/hero'
import { Lookbook } from '@/components/home/lookbook'
import { EditorialCard } from '@/components/editorial-card'
import { ProductCard } from '@/components/product-card'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { products } from '@/lib/products'

export default function HomePage() {
  const season = products.slice(0, 4)
  const featured = products.slice(4, 8)

  // HOOKS PARA ANIMACIÓN
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35])

  return (
    <main ref={containerRef} className="relative w-full bg-black">
      
      {/* CAPA 1: HERO FIJO CON EFECTO PROFUNDIDAD */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="h-full w-full">
          <Hero />
        </motion.div>
      </div>

      {/* CAPA 2: TELÓN BEIGE QUE SUBE Y CUBRE AL HERO */}
      <div className="relative z-10 bg-[#f5f5f0] min-h-screen rounded-t-[32px] md:rounded-t-[48px] shadow-[0_-25px_60px_rgba(0,0,0,0.7)] pt-6">
        
        {/* Cuadrícula de Productos de Temporada */}
        <section id="temporada" className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {season.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.08} y={30}>
                <EditorialCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>

        <Lookbook />

        {/* Lo más vendido */}
        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-4xl italic tracking-tight text-ink sm:text-5xl">
                Lo más vendido
              </h2>
              <Link
                href="/productos"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-ink"
              >
                todo
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.06} y={30}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>

        <SiteFooter />
      </div>

    </main>
  )
}