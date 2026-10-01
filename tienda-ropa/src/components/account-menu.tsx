'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { LogOut, ChevronRight } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AccountMenuProps {
  open: boolean
  onClose: () => void
}

export function AccountMenu({ open, onClose }: AccountMenuProps) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // 1. Obtener usuario actual al montar
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // 2. Escuchar cambios de autenticación en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    onClose()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Telón sutil para cerrar al hacer clic afuera */}
          <div 
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]" 
            onClick={onClose} 
          />

          {/* Menú Flotante */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-4 sm:right-6 lg:right-8 top-16 z-50 w-64 rounded-2xl border border-ink/10 bg-white/95 p-2 shadow-2xl backdrop-blur-xl text-black"
          >
            {user ? (
              /* SESIÓN ACTIVA */
              <div className="space-y-1">
                <div className="px-3 py-2 border-b border-ink/5 mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Sesión Activa
                  </p>
                  <p className="text-xs font-semibold text-black truncate">
                    {user.user_metadata?.first_name 
                      ? `${user.user_metadata.first_name} ${user.user_metadata?.last_name || ''}`
                      : user.email}
                  </p>
                </div>

                <Link
                  href="/cuenta"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-neutral-100/80"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-black">Mi cuenta</span>
                    <span className="text-[10px] text-neutral-400">Gestiona tu perfil y pedidos</span>
                  </div>
                  <ChevronRight className="size-4 text-neutral-400" />
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-red-50/80 group"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-red-600">Cerrar sesión</span>
                    <span className="text-[10px] text-red-400/80">Salir de tu cuenta</span>
                  </div>
                  <LogOut className="size-4 text-red-500 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ) : (
              /* SIN SESIÓN */
              <div className="space-y-1">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex flex-col gap-0.5 rounded-xl p-3 transition-colors hover:bg-neutral-100/80"
                >
                  <span className="text-xs font-bold text-black">Iniciar sesión</span>
                  <span className="text-[10px] text-neutral-400">Accede a tu cuenta</span>
                </Link>

                <Link
                  href="/registro"
                  onClick={onClose}
                  className="flex flex-col gap-0.5 rounded-xl p-3 transition-colors hover:bg-neutral-100/80"
                >
                  <span className="text-xs font-bold text-black">Crear cuenta</span>
                  <span className="text-[10px] text-neutral-400">Únete a Textiles Reyes</span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}