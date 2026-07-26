'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'

interface ApiVersion {
  id: string
  anbieter: string
  aktuelle_version: string | null
  letzter_erfolgreicher_test: string | null
  letzter_test: string | null
  letzter_fehler: string | null
  letzter_fehler_am: string | null
  status: string
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'ok') return <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">🟢 OK</span>
  if (status === 'fehler') return <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-full">🔴 Fehler</span>
  return <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2C2C2C]/40 bg-[#F7F7F5] px-2 py-1 rounded-full">⚪ Unbekannt</span>
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function ApiStatusPage() {
  const supabase = createClient()
  const router = useRouter()
  const [rows, setRows] = useState<ApiVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data } = await supabase.from('api_versionen').select('*').order('anbieter')
    setRows(data ?? [])
    setLoading(false)
  }

  async function runTest() {
    setTesting(true)
    setTestResult(null)
    const res = await fetch('/api/admin/api-health-check', {
      method: 'POST',
    })
    const data = await res.json()
    const ok = data.ergebnisse?.filter((r: { ok: boolean }) => r.ok).length ?? 0
    const total = data.ergebnisse?.length ?? 0
    setTestResult(`${ok}/${total} APIs erreichbar`)
    await load()
    setTesting(false)
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24">
      <div className="bg-white border-b border-[#2C2C2C]/8 px-4 pt-10 pb-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-[#2C2C2C]/40"><ArrowLeft size={20} /></Link>
        <h1 className="text-lg font-black text-[#2C2C2C] flex-1">API-Status</h1>
        <button
          onClick={runTest}
          disabled={testing}
          className="flex items-center gap-1.5 text-xs font-bold bg-[#2C2C2C] text-white rounded-xl px-3 py-2 disabled:opacity-50"
        >
          <RefreshCw size={12} className={testing ? 'animate-spin' : ''} />
          Jetzt testen
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-5 space-y-3">
        {testResult && (
          <div className="bg-[#FFF9E6] border border-[#F5C400]/40 rounded-xl px-4 py-3 text-sm font-semibold text-[#92400E]">
            Test abgeschlossen: {testResult}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-[#2C2C2C]/30 text-sm">Lädt…</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 divide-y divide-[#2C2C2C]/5">
            {rows.map(row => (
              <div key={row.id} className={`px-5 py-4 ${row.status === 'fehler' ? 'bg-red-50/50' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-[#2C2C2C] capitalize">{row.anbieter}</span>
                  <StatusBadge status={row.status} />
                </div>
                <div className="text-[11px] text-[#2C2C2C]/40 space-y-0.5">
                  <div>Version: {row.aktuelle_version ?? '—'}</div>
                  <div>Letzter Test: {fmt(row.letzter_test)}</div>
                  {row.letzter_fehler && (
                    <div className="text-red-500 font-semibold">⚠ {row.letzter_fehler}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-[#2C2C2C]/30 pt-2">
          Automatisch jeden Montag 08:00 Uhr getestet
        </p>
      </div>
    </div>
  )
}
