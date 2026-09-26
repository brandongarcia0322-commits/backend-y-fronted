import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Lookbook } from "@/components/home/lookbook";
import { EditorialCard } from "@/components/editorial-card";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { products } from "@/lib/products";

export default function HomePage() {
  const season = products.slice(0, 4);
  const featured = products.slice(4, 8);

  return (
    <main>
      <Hero />
      <Marquee />

      {/* Temporada */}
      <section id="temporada" className="scroll-mt-20">
        <div className="px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/45">
              Colección
            </p>
            <h2 className="mt-3 font-serif text-5xl italic tracking-tight text-ink sm:text-7xl">
              Temporada
            </h2>
          </Reveal>
        </div>
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
              Ver todo
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

      {/* Cotiza CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-20 text-center sm:py-28">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Personalización
            </p>
            <h2 className="mt-4 font-serif text-4xl italic tracking-tight text-white sm:text-6xl">
              Tu diseño, nuestra prenda
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm text-white/70">
              Serigrafía, DTF y vinil sobre prendas premium. Cotiza tu proyecto
              en minutos y llévalo a la calle.
            </p>
            <Link
              href="/cotiza"
              className="mt-9 inline-flex rounded-full bg-white px-9 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition-transform hover:scale-[1.03]"
            >
              Cotiza ahora
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
