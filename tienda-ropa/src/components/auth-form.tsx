'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ImagePlaceholder } from '@/components/image-placeholder'

type Mode = 'login' | 'register'

export function AuthForm({ mode }: { mode: Mode }) {
  const [submitted, setSubmitted] = useState(false)
  const isLogin = mode === 'login'

  const fieldClass =
    'w-full rounded-xl bg-sand px-5 py-4 text-sm text-ink outline-none transition-all placeholder:text-ink/45 focus:ring-2 focus:ring-ink/15'

  return (
    <main className="grid min-h-[100svh] lg:grid-cols-2">
      {/* Visual */}
      <div className="relative hidden lg:block">
        <ImagePlaceholder tone="dark" label="Editorial Textiles Reyes" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-12">
          <p className="font-serif text-5xl italic text-white">
            Textiles Reyes
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Streetwear premium hecho para expresar tu identidad.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-6 py-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <h1 className="font-serif text-5xl italic tracking-tight text-ink">
            {isLogin ? 'Bienvenido' : 'Crea tu cuenta'}
          </h1>
          <p className="mt-3 text-sm text-ink/55">
            {isLogin
              ? 'Inicia sesión para continuar comprando.'
              : 'Únete a la comunidad de Textiles Reyes.'}
          </p>

          {submitted ? (
            <p className="mt-10 rounded-xl bg-sand px-5 py-4 text-sm text-ink">
              {isLogin
                ? 'Sesión iniciada (demo).'
                : 'Cuenta creada (demo). ¡Bienvenido!'}
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
              className="mt-10 flex flex-col gap-3"
            >
              {!isLogin && (
                <input required placeholder="Nombre completo" className={fieldClass} />
              )}
              <input required type="email" placeholder="Correo electrónico" className={fieldClass} />
              <input required type="password" placeholder="Contraseña" className={fieldClass} />
              <button
                type="submit"
                className="mt-3 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all hover:bg-ink/90"
              >
                {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
              </button>
            </form>
          )}

          <p className="mt-8 text-sm text-ink/55">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <Link
              href={isLogin ? '/registro' : '/login'}
              className="font-medium text-ink underline underline-offset-4"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
