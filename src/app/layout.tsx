import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter, IBM_Plex_Mono } from 'next/font/google'
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

// DC-049 Schritt 3 (2026-09-10): IBM Plex Mono, ausschließlich für berechnete
// Maße/Rechenwege (m², lfm, Stk., die Rechenweg-Zeile unter jeder Position) —
// laut Handbuch nie für Preise oder Fließtext. Vorher komplett ungenutzt.
// `--font-mono` überschreibt in globals.css Tailwinds System-Mono-Stack, die
// bestehende `font-mono`-Utility-Klasse (3 Fundstellen) übernimmt den Font
// automatisch mit, ohne dass dort etwas geändert werden musste.
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-plex-mono',
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
    <html lang="de" className={`h-full ${bricolageGrotesque.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-dvh">
        <StagingBanner />
        <ServiceWorkerRegister />
        <CookieBanner />
        <ErrorBoundary feature="root">{children}</ErrorBoundary>
      </body>
    </html>
  )
}
