"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";
import { NavDrawer } from "@/components/nav-drawer";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchOverlay } from "@/components/search-overlay";
import { AccountMenu } from "@/components/account-menu";

export function SiteHeader() {

  const handleLogoClick = (e: React.MouseEvent) => {
  if (pathname === '/') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
 const pathname = usePathname();
 const router = useRouter();
const { count, openCart } = useCart();
const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

const isHome = pathname === '/';
// Si NO es la portada O si ya hizo scroll, el header debe ser visible/sólido
const isSolid = !isHome || scrolled;

  // Escala del texto superior al hacer scroll
  const logoScale = useTransform(scrollY, [40, 140], [1.05, 0.85]);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 260);
  });

  // Cerrar menús desplegables en cambios de ruta
  useEffect(() => {
    setNavOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [pathname]);
  
const iconBtn = cn(
  "relative flex size-10 items-center justify-center rounded-full transition-all duration-500",
  isSolid
    ? "border border-ink/10 bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur text-black"
    : "border border-transparent bg-transparent text-white"
);;

  return (
    <>
      <motion.header
        initial={false}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          isSolid
            ? "border-b border-ink/5 bg-white/80 backdrop-blur-xl"
            : "border-b border-transparent bg-white/0 backdrop-blur-none",
        )}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Lado izquierdo: Solo botón de Menú */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className={iconBtn}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
          </div>

          {/* Centro: El texto "Textiles Reyes" solo aparece cuando se hace scroll */}
         <motion.div
  animate={{
    opacity: isSolid ? 1 : 0,
    y: isSolid ? 0 : -8,
  }}
  transition={{ duration: 0.25, ease: "easeOut" }}
  className={cn(
    "absolute left-1/2 -translate-x-1/2 flex items-center justify-center",
    !isSolid && "pointer-events-none"
  )}
>
  <Link
    href="/"
    onClick={handleLogoClick}
    className="flex items-center justify-center py-1 transition-transform hover:scale-105"
    aria-label="Textiles Reyes — Inicio"
  >
    <Image
      src="/logo.png"
      alt="Textiles Reyes Logo"
      width={180}
      height={50}
      priority
      className="h-7 sm:h-9 w-auto object-contain drop-shadow-sm"
    />
  </Link>
</motion.div>

          {/* Lado derecho: Búsqueda, Cuenta y Carrito */}
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
          setSearchOpen(false);
          router.push(`/productos/${id}`);
        }}
      />
    </>
  );
}
