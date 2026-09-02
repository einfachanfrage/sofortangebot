'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

export function AccountDeleteModal() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleDelete() {
    if (confirm !== 'LÖSCHEN') {
      setError('Bitte gib LÖSCHEN ein um fortzufahren.')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/account/delete', { method: 'POST' })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Fehler beim Löschen. Bitte versuche es erneut.')
      setLoading(false)
      return
    }
    router.push('/?deleted=1')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-red-500 font-bold text-sm py-3 hover:text-red-600 transition-colors"
      >
        <AlertTriangle size={16} />
        Account unwiderruflich löschen
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl border-2 border-anthracite max-w-sm w-full p-8 shadow-xl">
            <div className="text-3xl mb-4">⚠️</div>
            <h2 className="font-black text-xl text-anthracite mb-3">Bist du sicher?</h2>
            <p className="text-sm font-semibold text-anthracite/60 mb-4 leading-relaxed">
              Diese Aktion löscht:
            </p>
            <ul className="text-sm font-semibold text-anthracite/70 space-y-1.5 mb-5">
              {[
                'Alle deine Angebote und Rechnungen',
                'Alle Kundendaten',
                'Deine Betriebseinstellungen',
                'Deinen Account',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="text-red-400 font-black">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs font-bold text-red-500 mb-5 bg-red-50 rounded-xl px-3 py-2">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>

            <label className="block text-xs font-black text-anthracite/40 mb-1.5 uppercase tracking-wide">
              Gib LÖSCHEN ein um zu bestätigen
            </label>
            <input
              type="text"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="LÖSCHEN"
              className="w-full bg-bg border-2 border-anthracite/10 rounded-xl px-4 py-3 text-anthracite font-semibold text-base focus:outline-none focus:border-red-400 mb-4"
            />

            {error && (
              <p className="text-sm text-red-600 font-semibold mb-3">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setOpen(false); setConfirm(''); setError('') }}
                className="flex-1 bg-bg text-anthracite font-black rounded-xl py-3 active:scale-95 transition-transform"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading || confirm !== 'LÖSCHEN'}
                className="flex-1 bg-red-500 text-white font-black rounded-xl py-3 active:scale-95 transition-transform disabled:opacity-40"
              >
                {loading ? 'Löschen...' : 'Account löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
