'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Upload, Check } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'

const fields = [
  { name: 'nombre', label: 'Nombre', type: 'text' },
  { name: 'telefono', label: 'Teléfono', type: 'tel' },
  { name: 'piezas', label: 'Numero de Piezas', type: 'number' },
  { name: 'corte', label: 'Corte de la Playera', type: 'text' },
  { name: 'color', label: 'Color', type: 'text' },
  { name: 'talla', label: 'Talla', type: 'text' },
] as const

export default function CotizaPage() {
  const [sent, setSent] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  const fieldClass =
    'w-full rounded-xl bg-sand px-5 py-4 text-sm text-ink outline-none transition-all placeholder:text-ink/45 focus:bg-sand-dark focus:ring-2 focus:ring-ink/15'

  return (
    <main className="pt-16">
      <section className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6">
        <h1 className="text-center font-serif text-6xl tracking-tight text-ink sm:text-7xl">
          COTIZA
        </h1>
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-ink/55">
          Cuéntanos sobre tu proyecto y te enviamos una cotización a la medida.
        </p>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-14 flex flex-col items-center rounded-2xl bg-sand px-8 py-16 text-center"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-ink text-white">
                <Check className="size-6" />
              </span>
              <h2 className="mt-6 font-serif text-3xl italic text-ink">
                ¡Cotización enviada!
              </h2>
              <p className="mt-3 max-w-sm text-sm text-ink/55">
                Gracias por confiar en Textiles Reyes. Te contactaremos muy
                pronto con los detalles de tu proyecto.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setFileName(null)
                }}
                className="mt-8 rounded-full border border-ink/15 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Enviar otra
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={onSubmit}
              className="mt-12 flex flex-col gap-3"
            >
              {fields.map((f) => (
                <input
                  key={f.name}
                  name={f.name}
                  type={f.type}
                  required={f.name === 'nombre' || f.name === 'telefono'}
                  placeholder={f.label}
                  className={fieldClass}
                />
              ))}

              <textarea
                name="especificaciones"
                rows={4}
                placeholder="Especificaciones: Aquí especifica dónde quieres tu diseño, el tamaño y el tipo de material que quieres (DTF, Serigrafía, Vinil)"
                className={`${fieldClass} resize-none`}
              />

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sand px-5 py-4 text-sm text-ink/70 transition-colors hover:bg-sand-dark"
                >
                  <Upload className="size-4" />
                  {fileName ?? 'Sube Tu Archivo'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setFileName(e.target.files?.[0]?.name ?? null)
                  }
                />
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-ink px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all hover:bg-ink/90"
                >
                  Enviar
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </section>

      <SiteFooter />
    </main>
  )
}
