import FeaturedShowcase from '@/components/featured-showcase'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/products'

export default function ProductosPage() {
  // 8 productos arriba = 2 filas completas de 4 columnas
  const topProducts = products.slice(0, 8)
  const remainingProducts = products.slice(8)

  return (
    <main className="min-h-screen bg-white py-12 overflow-x-hidden">
      {/* Encabezado */}
      <div className="text-center mb-10 px-4">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 block mb-1">
          CATÁLOGO
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-black">
          PRODUCTOS
        </h1>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-2">
          {products.length} prendas premium listas para personalizar.
        </p>
      </div>

      {/* 1. PRIMERAS 2 FILAS (8 PRODUCTOS) */}
      <div className="px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 2. SHOWCASE DE 3 CUADROS CON DESPLAZAMIENTO */}
      <FeaturedShowcase />

      {/* 3. RESTO DE PRODUCTOS */}
      <div className="px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {remainingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}