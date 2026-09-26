'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Search, X } from 'lucide-react'
import { products, formatMXN } from '@/lib/products'
import { ImagePlaceholder } from '@/components/image-placeholder'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (id: string) => void
}

export function SearchOverlay({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6)
  }, [query])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Cerrar búsqueda"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="absolute inset-x-0 top-0 bg-white p-6 sm:p-10"
            variants={{ hidden: { y: '-100%' }, visible: { y: 0 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3 border-b border-ink/15 pb-4">
                <Search className="size-5 text-ink/50" />
                {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca por nombre de la prenda…"
                  className="w-full bg-transparent font-serif text-2xl tracking-tight outline-none placeholder:text-ink/25"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="flex size-9 items-center justify-center rounded-full border border-ink/10 transition-colors hover:bg-sand"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-6 min-h-[80px]">
                {query && results.length === 0 && (
                  <p className="text-sm text-ink/45">
                    Sin resultados para “{query}”.
                  </p>
                )}
                <ul className="flex flex-col">
                  {results.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    >
                      <button
                        type="button"
                        onClick={() => onSelect(p.id)}
                        className="group flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition-colors hover:bg-sand"
                      >
                        <div className="size-14 shrink-0 overflow-hidden rounded-lg">
                          <ImagePlaceholder hint={false} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-ink">{p.name}</p>
                          <p className="text-xs uppercase tracking-[0.16em] text-ink/45">
                            {p.category}
                          </p>
                        </div>
                        <span className="text-sm text-ink/70">
                          {formatMXN(p.price)}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
