'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'register'

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const supabase = createClient()
  const isLogin = mode === 'login'

  // Campos del formulario
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Estados de control
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fieldClass =
    'w-full rounded-xl bg-sand/70 px-5 py-4 text-sm text-ink outline-none transition-all placeholder:text-ink/45 focus:bg-white focus:ring-2 focus:ring-ink/20'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isLogin) {
      // 1. Validar coincidencia de correos
      if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
        setError('Los correos electrónicos no coinciden.')
        return
      }

      // 2. Validar coincidencia de contraseñas
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.')
        return
      }

      // 3. Longitud mínima de contraseña
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.')
        return
      }

      setLoading(true)

      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: `${firstName.trim()} ${lastName.trim()}`,
            },
          },
        })

        if (signUpError) {
          // Captura si el correo ya existe en Supabase
          if (
            signUpError.message.toLowerCase().includes('already registered') ||
            signUpError.message.toLowerCase().includes('already in use') ||
            signUpError.status === 422
          ) {
            setError('Este correo electrónico ya está registrado. Intenta iniciar sesión.')
          } else {
            setError(signUpError.message)
          }
          return
        }

        if (data.user && data.session) {
          setSuccess('Cuenta creada exitosamente. Redirigiendo...')
          setTimeout(() => router.push('/'), 1500)
        } else {
          setSuccess('Registro completado. Revisa tu correo electrónico para verificar tu cuenta.')
        }
      } catch (err) {
        setError('Ocurrió un error inesperado al procesar tu registro.')
      } finally {
        setLoading(false)
      }
    } else {
      // Inicio de sesión
      setLoading(true)
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (signInError) {
          setError('Credenciales inválidas. Verifica tu correo y contraseña.')
          return
        }

        router.push('/')
        router.refresh()
      } catch (err) {
        setError('Ocurrió un error al iniciar sesión.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <main className="min-h-[100svh] w-full bg-white flex flex-col justify-center items-center px-6 py-20 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="font-serif text-4xl italic tracking-tight text-ink sm:text-5xl">
            {isLogin ? 'Bienvenido' : 'Crea tu cuenta'}
          </h1>
          <p className="mt-3 text-sm text-ink/55">
            {isLogin
              ? 'Inicia sesión para continuar comprando.'
              : 'Únete a la comunidad de Textiles Reyes.'}
          </p>
        </div>

        {/* Banners de Error / Éxito */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600 border border-red-200/60"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-700 border border-emerald-200/60"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
          {!isLogin && (
            <>
              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre(s)"
                  className={fieldClass}
                />
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido(s)"
                  className={fieldClass}
                />
              </div>

              {/* Correo y Confirmación */}
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className={fieldClass}
              />
              <input
                required
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Confirmar correo electrónico"
                className={fieldClass}
              />

              {/* Contraseña y Confirmación */}
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className={fieldClass}
              />
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className={fieldClass}
              />
            </>
          )}

          {isLogin && (
            <>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className={fieldClass}
              />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className={fieldClass}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex items-center justify-center rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all hover:bg-ink/90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : isLogin ? (
              'Iniciar sesión'
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        {/* Pie con Enlace */}
        <p className="mt-8 text-center text-sm text-ink/55">
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <Link
            href={isLogin ? '/registro' : '/login'}
            className="font-medium text-ink underline underline-offset-4"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </Link>
        </p>
      </motion.div>
    </main>
  )
}