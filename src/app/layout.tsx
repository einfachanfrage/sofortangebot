import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import './globals.css'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { CookieBanner } from '@/components/CookieBanner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { StagingBanner } from '@/components/StagingBanner'

// DC-049 Schritt 2 (2026-09-10, CI-Handbuch 19.08.2026): Überschriften-Schrift
// von Plus Jakarta Sans auf Bricolage Grotesque umgestellt (600/700/800 statt
// vorher nur 700/800 — 600 "Zwischenüberschrift" kam laut Handbuch neu dazu).
// Die CSS-Variable heißt weiter `--font-syne` (nie tatsächlich Syne gewesen,
// siehe DC-048/DC-049) — bewusst NICHT umbenannt, das würde 40 Dateien
// anfassen, die nur die `.font-syne`-Klasse aus globals.css konsumieren, ohne
// den eigentlichen Font-Wechsel zu betreffen. Umbenennung ist ein separates,
// rein kosmetisches Aufräum-Ticket.
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sofortangebot',
  description: 'Das schnellste Handwerkerangebot. Unter 10 Minuten.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sofortangebot',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2C2C2C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`h-full ${bricolageGrotesque.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <StagingBanner />
        <ServiceWorkerRegister />
        <CookieBanner />
        <ErrorBoundary feature="root">{children}</ErrorBoundary>
      </body>
    </html>
  )
}
