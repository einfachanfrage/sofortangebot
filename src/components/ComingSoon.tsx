'use client'
import { useState } from 'react'

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || loading) return
    setLoading(true)
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setDone(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1E1E1E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, Arial, sans-serif',
      position: 'relative',
    }}>

      {/* Logo */}
      <div style={{
        position: 'absolute', top: 24, left: 24,
        fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px',
      }}>
        <span style={{ color: '#FFFFFF' }}>sofort</span>
        <span style={{ color: '#F5C400' }}>angebot</span>
      </div>

      {/* Mitte */}
      <div style={{ textAlign: 'center', maxWidth: 480, width: '100%' }}>

        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 52px)',
          fontWeight: 900,
          color: '#FFFFFF',
          margin: '0 0 16px',
          lineHeight: 1.1,
          letterSpacing: '-1px',
        }}>
          Schluss mit stundenlangen Angeboten.
        </h1>

        <p style={{
          fontSize: 16,
          color: '#AAAAAA',
          margin: '0 0 32px',
          lineHeight: 1.65,
        }}>
          Einfach aufs Handy sprechen — sofortangebot rechnet,<br />
          schreibt und schickt. Für Maler, Bodenleger und alle,<br />
          die keine Zeit verlieren wollen.
        </p>

        {/* Gelbe Linie */}
        <div style={{
          width: 60, height: 2,
          background: '#F5C400',
          margin: '0 auto 32px',
        }} />

        <p style={{ fontSize: 14, color: '#888888', margin: '0 0 16px' }}>
          Früher Zugang — trag dich ein:
        </p>

        {!done ? (
          <div style={{
            display: 'flex', gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <input
              type="email"
              placeholder="deine@email.de"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                background: '#2E2E2E',
                border: 'none',
                borderRadius: 10,
                padding: '13px 18px',
                color: '#FFFFFF',
                fontSize: 15,
                outline: 'none',
                width: 240,
              }}
            />
            <button
              onClick={submit}
              disabled={loading}
              style={{
                background: '#F5C400',
                border: 'none',
                borderRadius: 10,
                padding: '13px 22px',
                color: '#1E1E1E',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? '…' : 'Zugang sichern →'}
            </button>
          </div>
        ) : (
          <p style={{ color: '#F5C400', fontSize: 16, fontWeight: 700, margin: 0 }}>
            ✓ Du bist dabei.
          </p>
        )}

        <p style={{ fontSize: 11, color: '#444444', marginTop: 18 }}>
          Kein Spam. Einmalige Nachricht wenn es losgeht.
        </p>
      </div>
    </div>
  )
}
