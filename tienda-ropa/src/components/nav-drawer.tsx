'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { X, Shirt, Sparkles, FileText, ArrowUpRight } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
}

const links = [
  {
    href: '/productos',
    label: 'Productos',
    desc: 'Catálogo completo',
  },
  {
    href: '/#temporada',
    label: 'Temporada',
    desc: 'Serigrafía en tendencia',
  },
  {
    href: '/cotiza',
    label: 'Cotiza',
    desc: 'Personaliza tu diseño',
  },
]

export function NavDrawer({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Cerrar menú"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
          />
          <motion.aside
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-md flex-col bg-white p-6 sm:p-8"
            variants={{
              hidden: { x: '-100%' },
              visible: { x: 0 },
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink/50">
                Menú
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex size-9 items-center justify-center rounded-full border border-ink/10 transition-colors hover:bg-sand"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-10 flex flex-col">
{links.map(({ href, label, desc }, i) => (                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={href}
                    onClick={onClose}
                    className="group flex items-center gap-4 border-b border-ink/8 py-5 transition-colors"
                  >
                   
                    <span className="flex-1">
                      <span className="block font-serif text-2xl tracking-tight text-ink">
                        {label}
                      </span>
                      <span className="block text-xs uppercase tracking-[0.18em] text-ink/45">
                        {desc}
                      </span>
                    </span>
                    <ArrowUpRight className="size-5 text-ink/30 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <p className="mt-auto text-[11px] uppercase tracking-[0.2em] text-ink/40">
              @Textiles.REYES
            </p>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
