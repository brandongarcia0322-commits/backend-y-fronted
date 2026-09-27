'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { carouselImages } from '@/lib/products'

const EASE = [0.22, 1, 0.36, 1] as const

// Si por alguna razón carouselImages viene vacío o indefinido, usamos una lista de respaldo
const imagesList = carouselImages && carouselImages.length > 0
  ? carouselImages
  : ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg']

// Duplicamos las imágenes para lograr el bucle infinito sin cortes
const loopImages = [...imagesList, ...imagesList]

export function Lookbook() {
  return (
    <section className="bg-white py-14 md:py-20">
      {/* Texto arriba, pegado al margen izquierdo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-6 px-4 md:mb-8 md:px-8"
      >
        <p className="text-[11px] font-semibold tracking-[0.25em] text-neutral-400 uppercase">
          LOOKBOOK
        </p>
        <h2 className="mt-2 font-serif text-2xl italic md:text-3xl text-ink">
          @textiles.REYES
        </h2>
      </motion.div>

      {/* Carrusel infinito con animación de REALCE */}
      <div className="relative w-full overflow-hidden py-6">
        <motion.div
          className="flex w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 40,
            ease: 'linear',
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {loopImages.map((src, i) => (
            <div
              key={`${src}-${i}`}
              /* EFECTO DE REALCE: Eleva la tarjeta (-translate-y-3), aumenta sombra y escala al hacer hover */
              className="group relative h-[62vh] w-[50vw] shrink-0 overflow-hidden bg-neutral-100 sm:w-[33.333vw] md:h-[78vh] md:w-[20vw] mx-1.5 md:mx-2.5 rounded-2xl border border-black/5 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl hover:border-black/20 hover:z-20 cursor-pointer"
            >
              {/* Imagen con Zoom suave de realce */}
              <Image
                src={src}
                alt={`Lookbook Textiles Reyes ${((i % imagesList.length) + 1)}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                priority={i < 5}
              />

              {/* Capa de sombreado y etiqueta que aparece en hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <span className="text-white text-[11px] font-bold uppercase tracking-widest translate-y-3 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                  Ver Look <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}