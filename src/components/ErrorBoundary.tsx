'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  feature?: string
}

interface State {
  hasError: boolean
  eventId: string | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, eventId: null }
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      tags: { feature: this.props.feature ?? 'unknown' },
      contexts: {
        react: { componentStack: errorInfo.componentStack ?? '' },
      },
    })
    this.setState({ eventId })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="font-bold text-[#2C2C2C] mb-1">Etwas ist schiefgelaufen</div>
          <div className="text-sm text-[#2C2C2C]/50 mb-4">Der Fehler wurde automatisch gemeldet.</div>
          <button
            onClick={() => {
              this.setState({ hasError: false, eventId: null })
              window.location.reload()
            }}
            className="bg-[#2C2C2C] text-white font-bold text-sm px-5 py-2.5 rounded-xl"
          >
            Neu laden
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
