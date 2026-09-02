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
}

const withMDX = createMDX({})

export default withSentryConfig(withMDX(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  autoInstrumentMiddleware: false,
})
