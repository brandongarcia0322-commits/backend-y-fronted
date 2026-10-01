'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/lib/supabase/client'
import { 
  User, 
  MapPin, 
  Package, 
  LogOut, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ShoppingBag,
  Clock
} from 'lucide-react'

interface Address {
  phone: string
  street: string
  number_ext: string
  number_int: string
  neighborhood: string
  city: string
  state: string
  postal_code: string
}

interface OrderItem {
  id: string
  product_title: string
  price: number
  quantity: number
  image_url: string
}

interface Order {
  id: string
  status: string
  total: number
  created_at: string
  order_items: OrderItem[]
}

export default function CuentaPage() {
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'perfil' | 'direccion' | 'pedidos'>('perfil')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Datos de usuario y dirección
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [address, setAddress] = useState<Address>({
    phone: '',
    street: '',
    number_ext: '',
    number_int: '',
    neighborhood: '',
    city: '',
    state: '',
    postal_code: ''
  })

  // Historial de pedidos
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function loadAccountData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        setUserId(user.id)
        setEmail(user.email || '')

        // 1. Cargar Perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFirstName(profile.first_name || '')
          setLastName(profile.last_name || '')
        }

        // 2. Cargar Dirección
        const { data: addressData } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (addressData) {
          setAddress({
            phone: addressData.phone || '',
            street: addressData.street || '',
            number_ext: addressData.number_ext || '',
            number_int: addressData.number_int || '',
            neighborhood: addressData.neighborhood || '',
            city: addressData.city || '',
            state: addressData.state || '',
            postal_code: addressData.postal_code || ''
          })
        }

        // 3. Cargar Pedidos con sus Items
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (ordersData) {
          setOrders(ordersData as Order[])
        }

      } catch (err) {
        console.error('Error al cargar datos de cuenta:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAccountData()
  }, [supabase, router])

  // Guardar Perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email,
        updated_at: new Date().toISOString()
      })

      if (error) throw error
      setSuccess('Perfil actualizado con éxito.')
    } catch (err: any) {
      setError(err.message || 'Error actualizando perfil.')
    } finally {
      setSaving(false)
    }
  }

  // Guardar Dirección
  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)

    try {
      const { error } = await supabase.from('addresses').upsert({
        user_id: userId,
        ...address,
        updated_at: new Date().toISOString()
      })

      if (error) throw error
      setSuccess('Dirección de envío guardada correctamente.')
    } catch (err: any) {
      setError(err.message || 'Error guardando dirección.')
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
        <Loader2 className="size-6 animate-spin text-neutral-400" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="border-b border-neutral-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl italic text-black font-bold">Mi Cuenta</h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Gestiona tus datos personales, direcciones de envío y compras.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 w-fit"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>

        {/* MENÚ DE PESTAÑAS (TABS) */}
        <div className="flex border-b border-neutral-100 mt-6 gap-2 sm:gap-6 overflow-x-auto pb-1">
          <button
            onClick={() => { setActiveTab('perfil'); setSuccess(null); setError(null); }}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'perfil'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <User className="size-4" />
            Información Personal
          </button>

          <button
            onClick={() => { setActiveTab('direccion'); setSuccess(null); setError(null); }}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'direccion'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <MapPin className="size-4" />
            Dirección de Envío
          </button>

          <button
            onClick={() => { setActiveTab('pedidos'); setSuccess(null); setError(null); }}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'pedidos'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <Package className="size-4" />
            Historial de Compras ({orders.length})
          </button>
        </div>

        {/* BANNER NOTIFICACIÓN */}
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600 border border-red-200/60">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* CONTENIDO DE PESTAÑAS */}
        <div className="mt-8">
          
          {/* 1. INFORMACIÓN PERSONAL */}
          {activeTab === 'perfil' && (
            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="bg-neutral-50/80 rounded-2xl p-6 sm:p-8 space-y-5 border border-neutral-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Nombre(s)
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Apellido(s)
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-500 outline-none cursor-not-allowed border border-neutral-200/60"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" /> Guardar Cambios</>}
                </button>
              </div>
            </motion.form>
          )}

          {/* 2. DIRECCIÓN DE ENVÍO */}
          {activeTab === 'direccion' && (
            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleUpdateAddress} className="space-y-6">
              <div className="bg-neutral-50/80 rounded-2xl p-6 sm:p-8 space-y-5 border border-neutral-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Teléfono de contacto
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="ej. 3312345678"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Código Postal (CP)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. 44100"
                      value={address.postal_code}
                      onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Calle / Avenida
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Av. Vallarta"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Num. Exterior
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={address.number_ext}
                      onChange={(e) => setAddress({ ...address, number_ext: e.target.value })}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Num. Interior
                    </label>
                    <input
                      type="text"
                      placeholder="Apt 4B (Opcional)"
                      value={address.number_int}
                      onChange={(e) => setAddress({ ...address, number_int: e.target.value })}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Colonia / Zona
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Americana"
                      value={address.neighborhood}
                      onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Ciudad / Municipio
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Guadalajara"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Estado
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Jalisco"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black outline-none border border-neutral-200 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" /> Guardar Dirección</>}
                </button>
              </div>
            </motion.form>
          )}

          {/* 3. HISTORIAL DE COMPRAS */}
          {activeTab === 'pedidos' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-neutral-50/80 rounded-2xl border border-neutral-100 p-8">
                  <ShoppingBag className="size-12 mx-auto text-neutral-300 mb-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black">Aún no tienes compras</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    Explora nuestro catálogo y realiza tu primer pedido para visualizarlo aquí.
                  </p>
                  <Link
                    href="/"
                    className="inline-block mt-6 rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition-all"
                  >
                    Ver Productos
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-neutral-50/80 rounded-2xl p-6 border border-neutral-200/80 space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200/60 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">ID Pedido</span>
                        <p className="text-xs font-mono font-bold text-black uppercase">{order.id.slice(0, 8)}...</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Fecha</span>
                        <p className="text-xs font-medium text-black">
                          {new Date(order.created_at).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Estado</span>
                        <span className="block w-fit mt-0.5 rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          {order.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total</span>
                        <p className="text-sm font-bold text-black">${order.total.toLocaleString('es-MX')} MXN</p>
                      </div>
                    </div>

                    {/* ITEMS DEL PEDIDO */}
                    <div className="space-y-3 pt-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-neutral-100">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.product_title}
                              width={48}
                              height={48}
                              className="size-12 rounded-lg object-cover bg-neutral-100"
                            />
                          ) : (
                            <div className="size-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                              <Package className="size-5 text-neutral-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black truncate">{item.product_title}</p>
                            <p className="text-[11px] text-neutral-500">
                              Cantidad: {item.quantity} × ${item.price.toLocaleString('es-MX')} MXN
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))
              )}
            </motion.div>
          )}

        </div>

      </div>
    </main>
  )
}