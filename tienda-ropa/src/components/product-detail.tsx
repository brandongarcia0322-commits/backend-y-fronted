'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Plus, Minus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart-provider'
import type { Product } from '@/lib/products'
import ProductVerticalShowcase from '@/components/product-vertical-showcase'
import { MiniProductCarousel } from '@/components/mini-product-carousel'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const images = (product as any)?.images?.length > 0 
    ? (product as any).images 
    : [(product as any)?.image || '/placeholder.svg']

  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('Blanco')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const specs = (product as any)?.specs || [
    'ALGODÓN PEINADO 180 G/M² PREMIUM',
    'CORTE LOOSE FIT CONTEMPORÁNEO',
    'SERIGRAFÍA DE ALTA DENSIDAD',
    'COSTURAS REFORZADAS DOBLE AGUJA',
    'ETIQUETA TEJIDA TEXTILES REYES',
    'PREENCOGIDO, NO DESTIÑE'
  ]

  return (
    <div className="min-h-screen bg-white text-black py-4 px-4 sm:px-8 lg:px-12 font-sans">
      {/* 1. SECCIÓN PRINCIPAL: PRENDA Y BOTÓN DE COMPRA */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[90vh]">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-3 space-y-6 lg:pt-4">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            &lt; Back
          </Link>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black leading-tight">
              {product?.name || 'PLAYERA GRÁFICA LOOSE FIT'}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-black mt-2">
              ENVÍO GRATIS A TODO MÉXICO
            </p>
          </div>

          <ul className="space-y-2 text-xs font-bold text-neutral-800 uppercase tracking-tight leading-relaxed">
            {specs.map((spec: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="select-none">•</span>
                <span>{spec}</span>
              </li>
            ))}
          </ul>

          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 pt-2">
            {product?.name || 'TEXTILES REYES'}, EDICIÓN LIMITADA.
          </p>
        </div>

        {/* COLUMNA CENTRAL: IMAGEN PRINCIPAL */}
        <div className="lg:col-span-6 flex items-center justify-center h-full w-full">
          <ProductVerticalShowcase 
            images={images && images.length > 0 ? images : [(product as any)?.image || '/placeholder.svg']} 
          />
        </div>

        {/* COLUMNA DERECHA: SELECCIÓN DE TALLA Y COMPRA */}
        <div className="lg:col-span-3 space-y-5 bg-white p-6 sm:p-7 rounded-3xl border border-black/10 shadow-xl lg:sticky lg:top-8">
          
          {/* PRECIO */}
          <div className="flex items-baseline justify-between border-b border-black/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              PRECIO
            </span>
            <div className="text-right">
              <span className="font-sans text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                ${product?.price ?? 1290}
              </span>
              <span className="text-xs font-bold text-neutral-500 ml-1.5">MXN</span>
            </div>
          </div>

          {/* TALLA */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em]">
              <span className="text-black">TALLA</span>
              <span className="text-neutral-500 font-mono">{selectedSize}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['S', 'M', 'G', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "h-10 rounded-xl font-bold text-xs uppercase border transition-all flex items-center justify-center",
                    selectedSize === size
                      ? "bg-black text-white border-black shadow-md scale-105"
                      : "bg-neutral-50 text-black border-black/10 hover:border-black/30"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CANTIDAD */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-black block">
              CANTIDAD
            </span>
            <div className="flex items-center justify-between border border-black/15 rounded-2xl p-1 bg-neutral-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-200 transition-colors"
              >
                <Minus className="w-3.5 h-3.5 text-black" />
              </button>
              <span className="font-bold text-sm font-mono">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>

          {/* COLOR */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em]">
              <span className="text-black">COLOR</span>
              <span className="text-neutral-500 font-medium">{selectedColor.toUpperCase()}</span>
            </div>
            <div className="flex gap-2.5">
              {[
                { name: 'Blanco', class: 'bg-white border-black/20' },
                { name: 'Negro', class: 'bg-black border-black' },
                { name: 'Azul', class: 'bg-blue-900 border-blue-900' },
              ].map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform relative flex items-center justify-center",
                    color.class,
                    selectedColor === color.name ? "scale-110 ring-2 ring-black ring-offset-2" : "opacity-80 hover:opacity-100"
                  )}
                >
                  {selectedColor === color.name && (
                    <Check className={cn("w-3.5 h-3.5", color.name === 'Blanco' ? 'text-black' : 'text-white')} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* BOTÓN PRINCIPAL */}
          <button
            onClick={() => addItem && addItem({ ...product, quantity } as any)}
            className="w-full py-3.5 rounded-2xl bg-black text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" /> AGREGAR AL CARRITO
          </button>

          <button className="w-full text-center text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors pt-1">
            IR A REALIZAR COMPRA
          </button>

        </div>

      </div>

      {/* 2. CARRUSEL MINIATURA CON EFECTO HUMO (Ubicado justo abajo de la camisa) */}
      <MiniProductCarousel />
    </div>
  )
}