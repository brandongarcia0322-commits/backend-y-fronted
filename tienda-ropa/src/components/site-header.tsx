'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react'
import { Menu, Search, User, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart-provider'
import { NavDrawer } from '@/components/nav-drawer'
import { CartDrawer } from '@/components/cart-drawer'
import { SearchOverlay } from '@/components/search-overlay'
import { AccountMenu } from '@/components/account-menu'

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { count, openCart } = useCart()
  const { scrollY } = useScroll()

  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const logoScale = useTransform(scrollY, [0, 140], [1.18, 0.82])

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 40)
  })

  // Close overlays whenever the route changes (premium re-render flow).
  useEffect(() => {
    setNavOpen(false)
    setSearchOpen(false)
    setAccountOpen(false)
  }, [pathname])

  const iconBtn = cn(
    'relative flex size-10 items-center justify-center rounded-full transition-all duration-500',
    scrolled
      ? 'border border-ink/10 bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur'
      : 'border border-transparent bg-transparent',
  )

  return (
    <>
      <motion.header
        initial={false}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-ink/5 bg-white/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-white/40 backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left cluster */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className={iconBtn}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
            <Link
              href="/cotiza"
              className="hidden rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ink/80 transition-colors hover:text-ink sm:inline-flex"
            >
              Cotiza
            </Link>
            <Link
              href="/#temporada"
              className="hidden rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ink/80 transition-colors hover:text-ink sm:inline-flex"
            >
              Temporada
            </Link>
          </div>

          {/* Center logo */}
          <motion.div
            style={{ scale: logoScale }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          >
            <Link
              href="/"
              className="pointer-events-auto block text-center leading-[0.95]"
              aria-label="Textiles Reyes — Inicio"
            >
              <span className="block font-serif text-base italic tracking-tight text-ink sm:text-lg">
                Textiles
              </span>
              <span className="block font-serif text-base italic tracking-tight text-ink sm:text-lg">
                Reyes
              </span>
            </Link>
          </motion.div>

          {/* Right cluster */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={iconBtn}
              aria-label="Buscar"
            >
              <Search className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              className={iconBtn}
              aria-label="Cuenta"
              aria-expanded={accountOpen}
            >
              <User className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={openCart}
              className={iconBtn}
              aria-label="Carrito"
            >
              <ShoppingBag className="size-[18px]" />
              <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold leading-4 text-white">
                {count}
              </span>
            </button>
          </div>
        </div>

        <AccountMenu open={accountOpen} onClose={() => setAccountOpen(false)} />
      </motion.header>

      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
      <CartDrawer />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(id) => {
          setSearchOpen(false)
          router.push(`/productos/${id}`)
        }}
      />
    </>
  )
}
