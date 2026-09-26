'use client'

import { motion } from 'motion/react'

const items = [
  '@Textiles.REYES',
  'Serigrafía',
  'DTF · Vinil',
  'Personalización',
  'Loose Fit',
  'Hecho en México',
]

export function Marquee() {
  const row = [...items, ...items]
  return (
    <section
      aria-hidden
      className="border-y border-ink/10 bg-sand py-5 overflow-hidden"
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-serif text-2xl italic tracking-tight text-ink/80 sm:text-3xl"
          >
            {item}
            <span className="text-ink/25">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  )
}
