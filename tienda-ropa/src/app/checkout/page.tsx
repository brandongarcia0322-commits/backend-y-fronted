'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Check, 
  ArrowLeft, 
  Truck, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Info, 
  Loader2,
  Lock,
  Wifi,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { formatMXN } from '@/lib/products'
import { createClient } from '@/lib/supabase/client'

// Opciones para el punto de entrega gratuito
const PICKUP_LOCATIONS = [
  'Estación Línea 3',
  'Plaza Oblatos',
  'Plaza Forum',
  'Parque Rojo'
]

// Métodos de Pago con formato Rectangular Horizontal
const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Tarjeta Débito/Crédito',
    provider: 'Visa / Mastercard',
    badge: 'VISA / MC',
    bgGradient: 'from-neutral-900 via-zinc-800 to-black',
    accentColor: 'border-amber-400/50 text-amber-200',
    numberMask: '•••• •••• •••• 4242'
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    provider: 'Cuenta o Cuotas',
    badge: 'MERCADO PAGO',
    bgGradient: 'from-sky-500 via-sky-600 to-blue-700',
    accentColor: 'border-sky-300/60 text-sky-100',
    numberMask: '•••• •••• •••• MPAG'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    provider: 'Pago seguro',
    badge: 'PayPal',
    bgGradient: 'from-blue-800 via-indigo-900 to-slate-950',
    accentColor: 'border-blue-400/50 text-blue-200',
    numberMask: '•••• •••• •••• PPAL'
  },
  {
    id: 'applepay',
    name: 'Apple Pay',
    provider: 'Touch / Face ID',
    badge: ' Pay',
    bgGradient: 'from-neutral-800 via-neutral-900 to-black border border-neutral-700',
    accentColor: 'border-white/40 text-white',
    numberMask: '•••• •••• •••• APAY'
  }
]

export default function CheckoutPage() {
  const supabase = createClient()
  const { items, subtotal, clear } = useCart()

  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // Método de Envío ('pickup' | 'delivery')
  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [pickupLocation, setPickupLocation] = useState(PICKUP_LOCATIONS[0])

  // Índice y Método de Pago Seleccionado
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedPayment = PAYMENT_METHODS[selectedIndex].id

  // Datos del Formulario
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: ''
  })

  // Datos de Tarjeta de Crédito/Débito
  const [cardData, setCardData] = useState({
    number: '',
    exp: '',
    cvv: ''
  })

  // Datos Simulados PayPal / Mercado Pago
  const [payAccount, setPayAccount] = useState('')

  // Cálculo del Envío:
  // - Si es Punto de Entrega: Gratis ($0)
  // - Si es Domicilio: $300 base, pero si el Subtotal supera $800 es Gratis ($0)
  const isFreeDelivery = shippingMethod === 'delivery' && subtotal >= 800
  const shippingCost = shippingMethod === 'pickup' 
    ? 0 
    : (isFreeDelivery ? 0 : 300)

  const total = subtotal + shippingCost

  // Navegación del Carrusel
  const handlePrevCard = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : PAYMENT_METHODS.length - 1))
  }

  const handleNextCard = () => {
    setSelectedIndex((prev) => (prev < PAYMENT_METHODS.length - 1 ? prev + 1 : 0))
  }

  // Manejador del Pago y Envío a Supabase
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Registrar pedido en Supabase
      const { error } = await supabase.from('orders').insert({
        user_id: user?.id || null,
        status: 'completado',
        total: total,
        shipping_method: shippingMethod === 'pickup' ? `Punto de Entrega: ${pickupLocation}` : 'Envío a Domicilio',
        payment_method: selectedPayment.toUpperCase(),
        contact_email: email,
        contact_phone: phone,
        shipping_address: shippingMethod === 'delivery' ? {
          name: `${firstName} ${lastName}`,
          ...address
        } : null
      })

      if (error) console.warn('Nota sobre orden:', error.message)

      clear()
      setDone(true)
    } catch (err) {
      console.error('Error al procesar la orden:', err)
      clear()
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  const fieldClass =
    'w-full rounded-xl bg-sand px-4 py-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink/45 focus:ring-2 focus:ring-ink/15'

  if (done) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 pt-16 text-center">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex size-16 items-center justify-center rounded-full bg-ink text-white"
        >
          <Check className="size-7" />
        </motion.span>
        <h1 className="mt-8 font-serif text-4xl italic text-ink">
          ¡Pedido confirmado!
        </h1>
        <p className="mt-3 max-w-sm text-sm text-ink/55">
          {shippingMethod === 'pickup' 
            ? `Recibimos tu compra. El vendedor te contactará al ${phone} para coordinar la entrega en ${pickupLocation}.`
            : 'Recibimos tu compra. Te enviaremos la confirmación y el seguimiento por correo.'
          }
        </p>
        <Link
          href="/productos"
          className="mt-8 rounded-full bg-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all hover:bg-ink/90"
        >
          Seguir comprando
        </Link>
      </main>
    )
  }

  return (
    <main className="pt-16 pb-20 overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-sm text-ink/60 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Seguir comprando
        </Link>

        <h1 className="mt-6 font-serif text-5xl italic tracking-tight text-ink">
          Checkout
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-sand px-8 py-20 text-center">
            <p className="font-serif text-2xl italic text-ink">
              Tu carrito está vacío
            </p>
            <Link
              href="/productos"
              className="mt-6 inline-flex rounded-full bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            {/* Formulario Principal */}
            <form onSubmit={handleSubmitOrder} className="flex flex-col gap-10">
              
              {/* 1. CONTACTO */}
              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] text-ink/50 font-bold">
                  Contacto
                </legend>
                <div className="mt-4 grid gap-3">
                  <input 
                    required 
                    placeholder="Correo electrónico" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass} 
                  />
                  <input 
                    required 
                    placeholder="Teléfono móvil (para coordinación de entrega)" 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={fieldClass} 
                  />
                </div>
              </fieldset>

              {/* 2. OPCIONES DE ENVÍO */}
              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] text-ink/50 font-bold mb-4">
                  Método de Envío
                </legend>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Opción Punto de Entrega */}
                  <button
                    type="button"
                    onClick={() => setShippingMethod('pickup')}
                    className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                      shippingMethod === 'pickup'
                        ? 'border-ink bg-sand/80 ring-2 ring-ink/10'
                        : 'border-ink/10 bg-sand/30 hover:border-ink/30'
                    }`}
                  >
                    <MapPin className="size-5 shrink-0 mt-0.5 text-ink" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink">Punto de Entrega</p>
                      <p className="text-xs text-ink/60 mt-0.5">Gratis ($0 MXN)</p>
                    </div>
                  </button>

                  {/* Opción Envío a Domicilio */}
                  <button
                    type="button"
                    onClick={() => setShippingMethod('delivery')}
                    className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                      shippingMethod === 'delivery'
                        ? 'border-ink bg-sand/80 ring-2 ring-ink/10'
                        : 'border-ink/10 bg-sand/30 hover:border-ink/30'
                    }`}
                  >
                    <Truck className="size-5 shrink-0 mt-0.5 text-ink" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink">A Domicilio</p>
                      <p className="text-xs text-ink/60 mt-0.5">
                        {isFreeDelivery ? (
                          <span className="text-emerald-700 font-semibold">¡GRATIS! (Compra &gt; $800)</span>
                        ) : (
                          '$300 MXN'
                        )}
                      </p>
                    </div>
                  </button>
                </div>

                {/* DESPLEGABLES / CAMPOS SEGÚN ENVÍO */}
                {shippingMethod === 'pickup' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: -6 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 rounded-2xl bg-sand/60 p-5 border border-ink/10"
                  >
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-2">
                        Selecciona el punto de encuentro:
                      </label>
                      <select
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full rounded-xl bg-white px-4 py-3.5 text-sm font-medium text-ink outline-none border border-ink/15 focus:ring-2 focus:ring-ink/20 transition-all cursor-pointer"
                      >
                        {PICKUP_LOCATIONS.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Banner Informativo del Vendedor */}
                    <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 p-4 border border-amber-500/20 text-ink">
                      <Info className="size-5 shrink-0 text-amber-700 mt-0.5" />
                      <p className="text-xs text-ink/80 leading-relaxed">
                        <strong className="font-semibold text-ink">Nota sobre tu entrega:</strong> El vendedor se pondrá en contacto contigo vía WhatsApp o llamada para coordinar el horario y fecha exacta de tu preferencia en <span className="font-semibold">{pickupLocation}</span>.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: -6 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {subtotal < 800 && (
                      <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/60 mb-2">
                        💡 Agrega <strong>{formatMXN(800 - subtotal)}</strong> más a tu carrito para obtener <strong>Envío a Domicilio Gratis</strong>.
                      </p>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input 
                        required={shippingMethod === 'delivery'} 
                        placeholder="Nombre" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={fieldClass} 
                      />
                      <input 
                        required={shippingMethod === 'delivery'} 
                        placeholder="Apellido" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={fieldClass} 
                      />
                    </div>
                    <input 
                      required={shippingMethod === 'delivery'} 
                      placeholder="Dirección completa (Calle y Número)" 
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className={fieldClass} 
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input 
                        required={shippingMethod === 'delivery'} 
                        placeholder="Ciudad" 
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className={fieldClass} 
                      />
                      <input 
                        required={shippingMethod === 'delivery'} 
                        placeholder="Estado" 
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className={fieldClass} 
                      />
                      <input 
                        required={shippingMethod === 'delivery'} 
                        placeholder="C.P." 
                        value={address.postal_code}
                        onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                        className={fieldClass} 
                      />
                    </div>
                  </motion.div>
                )}
              </fieldset>

              {/* 3. MÉTODOS DE PAGO CON CARRUSEL COVERFLOW 3D (TARJETAS RECTANGULARES) */}
              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] text-ink/50 font-bold mb-2">
                  Método de Pago
                </legend>

                {/* CARRUSEL COVERFLOW INTERACTIVO */}
                <div className="relative py-8 my-2 flex flex-col items-center justify-center">
                  
                  {/* Botón Navegación Izquierda */}
                  <button
                    type="button"
                    onClick={handlePrevCard}
                    className="absolute left-1 z-30 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-transform hover:scale-110 active:scale-95 border border-ink/10"
                    aria-label="Tarjeta Anterior"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  {/* Contenedor Coverflow 3D */}
                  <div 
                    className="relative w-full h-56 sm:h-60 flex items-center justify-center overflow-visible"
                    style={{ perspective: '1000px' }}
                  >
                    {PAYMENT_METHODS.map((method, index) => {
                      const diff = index - selectedIndex
                      const isSelected = diff === 0

                      // Cálculos de posición Coverflow 3D
                      let xTranslate = diff * 120
                      let rotateY = diff > 0 ? -25 : diff < 0 ? 25 : 0
                      let rotateZ = diff > 0 ? 3 : diff < 0 ? -3 : 0
                      let scale = isSelected ? 1 : Math.max(0.78, 1 - Math.abs(diff) * 0.15)
                      let opacity = isSelected ? 1 : Math.max(0.4, 1 - Math.abs(diff) * 0.35)
                      let zIndex = 30 - Math.abs(diff) * 5

                      return (
                        <motion.div
                          key={method.id}
                          onClick={() => setSelectedIndex(index)}
                          animate={{
                            x: xTranslate,
                            rotateY: rotateY,
                            rotateZ: rotateZ,
                            scale: scale,
                            opacity: opacity,
                            zIndex: zIndex
                          }}
                          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                          whileHover={{ scale: isSelected ? 1.03 : scale * 1.05 }}
                          className={`absolute cursor-pointer rounded-2xl p-5 border transition-shadow bg-gradient-to-br ${method.bgGradient} w-[280px] h-[170px] sm:w-[340px] sm:h-[200px] flex flex-col justify-between select-none shadow-2xl ${
                            isSelected 
                              ? 'ring-4 ring-black/80 shadow-black/30' 
                              : 'shadow-lg border-white/10'
                          }`}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Parte Superior: Chip + Ícono Contactless + Badge Marca */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {/* Chip Dorado */}
                              <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-yellow-400 to-amber-500 border border-amber-600/40 shadow-inner flex items-center justify-center">
                                <div className="w-6 h-4 border border-amber-800/30 rounded-sm" />
                              </div>
                              <Wifi className="size-5 text-white/70 rotate-90" />
                            </div>

                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${method.accentColor} bg-black/40 backdrop-blur-md`}>
                              {method.badge}
                            </span>
                          </div>

                          {/* Centro: Número de Tarjeta Enmascarado */}
                          <div className="my-auto">
                            <p className="text-sm sm:text-base font-mono tracking-[0.25em] text-white/90">
                              {method.numberMask}
                            </p>
                          </div>

                          {/* Parte Inferior: Nombre y Proveedor */}
                          <div className="flex justify-between items-end border-t border-white/10 pt-2.5">
                            <div>
                              <p className="text-xs font-bold text-white tracking-wide">{method.name}</p>
                              <p className="text-[10px] text-white/70">{method.provider}</p>
                            </div>
                            {isSelected && (
                              <span className="flex size-6 items-center justify-center rounded-full bg-white text-black shadow">
                                <Check className="size-3.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Botón Navegación Derecha */}
                  <button
                    type="button"
                    onClick={handleNextCard}
                    className="absolute right-1 z-30 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-transform hover:scale-110 active:scale-95 border border-ink/10"
                    aria-label="Siguiente Tarjeta"
                  >
                    <ChevronRight className="size-5" />
                  </button>

                  {/* Puntos Indicadores del Carrusel */}
                  <div className="flex items-center gap-2 mt-4 z-30">
                    {PAYMENT_METHODS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedIndex(idx)}
                        className={`size-2 rounded-full transition-all ${
                          idx === selectedIndex ? 'bg-ink w-6' : 'bg-ink/20 hover:bg-ink/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* FORMULARIO DINÁMICO SEGÚN TARJETA SELECCIONADA */}
                <div className="rounded-2xl bg-sand/60 p-6 border border-ink/10 mt-2">
                  
                  {/* OPCIÓN 1: TARJETA CRÉDITO/DÉBITO */}
                  {selectedPayment === 'card' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink mb-2">
                        <CreditCard className="size-4" /> Datos de la tarjeta
                      </div>
                      <input 
                        required 
                        placeholder="Número de tarjeta" 
                        inputMode="numeric" 
                        maxLength={19}
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className={fieldClass} 
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input 
                          required 
                          placeholder="MM / AA" 
                          maxLength={5}
                          value={cardData.exp}
                          onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                          className={fieldClass} 
                        />
                        <input 
                          required 
                          placeholder="CVV" 
                          inputMode="numeric" 
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className={fieldClass} 
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* OPCIÓN 2: MERCADO PAGO */}
                  {selectedPayment === 'mercadopago' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center py-2">
                      <p className="text-xs text-ink/70">
                        Serás redirigido o conectado con tu cuenta de <strong>Mercado Pago</strong> para completar tu transacción de forma 100% segura.
                      </p>
                      <input
                        type="email"
                        placeholder="Correo registrado en Mercado Pago"
                        value={payAccount}
                        onChange={(e) => setPayAccount(e.target.value)}
                        className={fieldClass}
                      />
                    </motion.div>
                  )}

                  {/* OPCIÓN 3: PAYPAL */}
                  {selectedPayment === 'paypal' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center py-2">
                      <p className="text-xs text-ink/70">
                        Ingresa tu correo asociado a <strong>PayPal</strong>. El cobro se sincronizará con tu cuenta al dar clic en pagar.
                      </p>
                      <input
                        type="email"
                        required
                        placeholder="Correo de PayPal"
                        value={payAccount}
                        onChange={(e) => setPayAccount(e.target.value)}
                        className={fieldClass}
                      />
                    </motion.div>
                  )}

                  {/* OPCIÓN 4: APPLE PAY */}
                  {selectedPayment === 'applepay' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4 space-y-2">
                      <p className="text-xs font-medium text-ink">
                        Usa Touch ID o Face ID en tu dispositivo Apple para autorizar la compra por {formatMXN(total)}.
                      </p>
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-ink/60 bg-white/80 px-4 py-2 rounded-full border border-ink/10">
                        <Lock className="size-3.5" /> Autenticación Biométrica Lista
                      </div>
                    </motion.div>
                  )}

                </div>
              </fieldset>

              {/* BOTÓN DE PAGAR */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-3 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all hover:bg-ink/90 disabled:opacity-50 shadow-xl"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    Pagar {formatMXN(total)}
                  </>
                )}
              </button>
            </form>

            {/* Resumen del Carrito */}
            <aside className="h-fit rounded-2xl bg-sand p-6 lg:sticky lg:top-24 border border-ink/5 shadow-sm">
              <h2 className="text-xs uppercase tracking-[0.2em] text-ink/50 font-bold">
                Resumen de Compra
              </h2>
              <ul className="mt-5 space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4"
                    >
                      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-white">
                        <ImagePlaceholder hint={false} />
                      </div>
                      <div className="flex flex-1 justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.1em] text-ink">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-ink/50">
                            {item.size} · {item.color} · x{item.qty}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-ink/80">
                          {formatMXN(item.price * item.qty)}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
                <div className="flex justify-between text-ink/60">
                  <span>Subtotal</span>
                  <span>{formatMXN(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink/60">
                  <span>Envío</span>
                  <span>
                    {shippingCost === 0 ? (
                      <strong className="text-emerald-700 font-bold">GRATIS</strong>
                    ) : (
                      formatMXN(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-3 text-base font-bold text-ink border-t border-ink/10">
                  <span>Total</span>
                  <span>{formatMXN(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}