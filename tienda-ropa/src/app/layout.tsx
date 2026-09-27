import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Playfair_Display, Inter, Anton } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { CartProvider } from '@/components/cart-provider'
import { SiteHeader } from '@/components/site-header'

// Fuentes de Google
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

// Fuente local Brigends Expanded (para font-display)
const display = localFont({
  src: './fonts/BrigendsExpanded.otf',
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Textiles Reyes – Premium Streetwear & Serigrafía',
  description:
    'Textiles Reyes. Prendas premium, serigrafía y personalización. Cotiza tu diseño y compra la temporada.',
  generator: 'v0.dev',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`light ${inter.variable} ${playfair.variable} ${anton.variable} ${display.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        <CartProvider>
          <SiteHeader />
          {children}
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}