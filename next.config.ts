import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  env: {
    // Vision läuft über OpenAI. Der Schalter hing früher an AI_PROVIDER, weil
    // ein Groq-Betrieb vorgesehen war — Groq wird nirgends mehr aufgerufen
    // (2026-09-02), der Zweig war tot.
    NEXT_PUBLIC_VISION_ENABLED: 'true',
  },

  // CoS-037 (03.09.2026): Bisher gab es hier gar keinen headers()-Block —
  // was live ankam, war reines Vercel-Standardverhalten
  // (`max-age=63072000`, ohne Zusätze). Kein bewusster Entscheid, sondern
  // eine Lücke.
  //
  // `includeSubDomains` heißt: Wer einmal auf sofortangebot.app war, dessen
  // Browser verlangt ab dann für ZWEI JAHRE auch von jeder Subdomain
  // gültiges HTTPS — ohne Fallback, ohne Warnung. Bei Vercel bekommt jede
  // Custom-Subdomain automatisch ein Zertifikat, deshalb ist das hier
  // ungefährlich; bei einer später woanders gehosteten `staging.` oder
  // `api.` wäre es das nicht. Wichtig zu wissen, BEVOR so eine Subdomain
  // entsteht — nicht danach.
  //
  // `preload` ist nur eine Absichtserklärung: Wirksam wird die Preload-Liste
  // erst durch die Einreichung auf hstspreload.org, und die ist Sandys
  // Entscheidung, nicht unsere (siehe CoS-037 Schritt 2). Der Header allein
  // bleibt durch einen erneuten Deploy jederzeit rücknehmbar.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

const withMDX = createMDX({})

export default withSentryConfig(withMDX(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  autoInstrumentMiddleware: false,
})
