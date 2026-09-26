import type { Metadata } from 'next'
import { ProductCard } from '@/components/product-card'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { products } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Productos — Textiles Reyes',
  description: 'Catálogo completo de prendas premium Textiles Reyes.',
}

export default function ProductosPage() {
  return (
    <main className="pt-16">
      <section className="px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/45">
            Catálogo
          </p>
          <h1 className="mt-3 font-serif text-5xl italic tracking-tight text-ink sm:text-7xl">
            Productos
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink/55">
            {products.length} prendas premium listas para personalizar.
          </p>
        </Reveal>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.06} y={30}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
