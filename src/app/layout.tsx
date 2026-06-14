import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { CookieBanner } from '@/components/CookieBanner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { StagingBanner } from '@/components/StagingBanner'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
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
    <html lang="de" className={`h-full ${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <StagingBanner />
        <ServiceWorkerRegister />
        <CookieBanner />
        <ErrorBoundary feature="root">{children}</ErrorBoundary>
      </body>
    </html>
  )
}
