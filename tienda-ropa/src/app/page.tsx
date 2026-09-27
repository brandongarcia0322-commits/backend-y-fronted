import Link from 'next/link'
import { Hero } from '@/components/home/hero'
import { Lookbook } from '@/components/home/lookbook'
import { EditorialCard } from '@/components/editorial-card'
import { ProductCard } from '@/components/product-card'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { products } from '@/lib/products'

export default function HomePage() {
  const season = products.slice(0, 4)
  const featured = products.slice(4, 8)

  return (
    <main>
      <Hero />

      {/* Cuadrícula de Productos de Temporada (Acomodados de orilla a orilla) */}
      <section id="temporada" className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {season.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08} y={30}>
              <EditorialCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <Lookbook />

      {/* Lo más vendido */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-4xl italic tracking-tight text-ink sm:text-5xl">
              Lo más vendido
            </h2>
            <Link
              href="/productos"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-ink"
            >
               todo
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.06} y={30}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Aquí es donde se llama a Atención al Cliente y Redes Sociales */}
      <SiteFooter />
    </main>
  )
}