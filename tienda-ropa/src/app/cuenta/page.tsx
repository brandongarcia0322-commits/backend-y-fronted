'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CuentaPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Datos del perfil
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        setUserId(user.id)
        setEmail(user.email || '')

        // Cargar desde la tabla public.profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFirstName(profile.first_name || '')
          setLastName(profile.last_name || '')
        } else {
          // Fallback a metadatos de auth si aún no existe el perfil
          setFirstName(user.user_metadata?.first_name || '')
          setLastName(user.user_metadata?.last_name || '')
        }
      } catch (err) {
        console.error('Error cargando cuenta:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [supabase, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)

    try {
      // 1. Actualizar tabla public.profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      // 2. Actualizar user_metadata en auth
      await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
        },
      })

      setSuccess('Información actualizada correctamente.')
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar el perfil.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center pt-28">
        <Loader2 className="size-6 animate-spin text-ink/40" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-neutral-100 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-4xl italic text-ink">Mi Cuenta</h1>
            <p className="mt-1 text-sm text-ink/55">Gestiona tus datos personales y preferencias.</p>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 w-fit"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </motion.div>

        {/* Banners de Notificación */}
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

        {/* Formulario de Información Personal */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleUpdateProfile}
          className="mt-8 space-y-6"
        >
          <div className="bg-sand/40 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3 border-b border-neutral-200/60 pb-4">
              <User className="size-5 text-ink/70" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink">
                Información Personal
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                  Nombre(s)
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink outline-none border border-neutral-200/80 focus:ring-2 focus:ring-ink/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                  Apellido(s)
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink outline-none border border-neutral-200/80 focus:ring-2 focus:ring-ink/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm text-ink/60 outline-none cursor-not-allowed border border-neutral-200/40"
              />
              <p className="mt-1 text-[11px] text-ink/40">El correo electrónico no se puede modificar directamente.</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-ink/90 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Save className="size-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </motion.form>

      </div>
    </main>
  )
}