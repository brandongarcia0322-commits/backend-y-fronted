import Link from 'next/link'
import { Headphones, Mail } from 'lucide-react'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { Reveal } from '@/components/reveal'

function Instagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.26-.1-.45-.15-.65.15-.2.3-.75.94-.92 1.14-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.65-1.57-.9-2.15-.24-.56-.48-.48-.65-.49h-.56c-.2 0-.5.07-.77.37-.26.3-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.15.2 2.03 3.1 4.92 4.35.69.3 1.22.47 1.64.6.69.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.56-.34zM12 2a10 10 0 0 0-8.53 15.26L2 22l4.85-1.27A10 10 0 1 0 12 2zm0 18.2c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-2.88.76.77-2.8-.2-.31A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  )
}

export function SiteFooter() {
  const socials = [
    { href: '#', label: 'Instagram', Icon: Instagram },
    { href: '#', label: 'WhatsApp', Icon: WhatsApp },
    { href: '#', label: 'Correo', Icon: Mail },
  ]

  return (
    <footer className="bg-white">
      <Reveal>
        <div className="relative isolate mx-4 mb-4 overflow-hidden rounded-3xl sm:mx-6 lg:mx-8">
          <div className="absolute inset-0">
            <ImagePlaceholder tone="dark" label="Imagen editorial" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative grid gap-12 px-6 py-16 sm:px-12 sm:py-24 md:grid-cols-2 md:py-32">
            <div>
              <h3 className="font-serif text-2xl text-white sm:text-3xl">
                Atención al cliente
              </h3>
              <a
                href="mailto:hola@textilesreyes.mx"
                className="mt-6 inline-flex size-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink"
                aria-label="Contactar atención al cliente"
              >
                <Headphones className="size-5" />
              </a>
            </div>
            <div className="md:text-right">
              <h3 className="font-serif text-2xl text-white sm:text-3xl">
                Nuestras Redes Sociales
              </h3>
              <div className="mt-6 flex gap-3 md:justify-end">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="inline-flex size-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="flex flex-col items-center gap-4 px-6 pb-10 pt-4 sm:flex-row sm:justify-between sm:px-8">
        <span className="font-serif text-lg italic text-ink">
          Textiles Reyes
        </span>
        <nav className="flex gap-6 text-xs uppercase tracking-[0.18em] text-ink/50">
          <Link href="/productos" className="hover:text-ink">
            Productos
          </Link>
          <Link href="/cotiza" className="hover:text-ink">
            Cotiza
          </Link>
          <Link href="/login" className="hover:text-ink">
            Cuenta
          </Link>
        </nav>
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/40">
          © 2026 Textiles Reyes
        </span>
      </div>
    </footer>
  )
}
