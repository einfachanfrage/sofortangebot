import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,

  // DSGVO: keine persönlichen Daten
  beforeSend(event) {
    if (event.user) {
      delete event.user.email
      delete event.user.ip_address
      delete event.user.username
    }
    return event
  },

  ignoreErrors: [
    'Network request failed',
    'Load failed',
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'AbortError',
  ],
})
