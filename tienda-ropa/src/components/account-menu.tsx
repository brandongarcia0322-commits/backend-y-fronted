'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { LogIn, UserPlus } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
}

export function AccountMenu({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="fixed inset-0 z-[-1] cursor-default"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-4 top-[68px] w-64 overflow-hidden rounded-2xl border border-ink/8 bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:right-6 lg:right-8"
          >
            <Link
              href="/login"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-sand"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-sand text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                <LogIn className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium">
                  Iniciar sesión
                </span>
                <span className="block text-xs text-ink/45">
                  Accede a tu cuenta
                </span>
              </span>
            </Link>
            <Link
              href="/registro"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-sand"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-sand text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                <UserPlus className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium">Crear cuenta</span>
                <span className="block text-xs text-ink/45">
                  Únete a Textiles Reyes
                </span>
              </span>
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
