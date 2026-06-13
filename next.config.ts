import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_VISION_ENABLED: process.env.AI_PROVIDER !== 'groq' ? 'true' : 'false',
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  autoInstrumentMiddleware: false,
})
