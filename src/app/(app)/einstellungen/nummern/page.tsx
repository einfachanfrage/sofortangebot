'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Nummernkreis, VergebeneNummer } from '@/lib/types'
import { ArrowLeft, Download, Info } from 'lucide-react'
import BottomNav from '@/components/BottomNav'

type Typ = 'angebot' | 'rechnung'

function buildPreview(k: Nummernkreis): string {
  let s = ''
  if (k.prefix) s += k.prefix + k.trennzeichen
  if (k.jahr_aktiv) s += k.jahr_aktiv + k.trennzeichen
  s += String(k.naechste_nummer).padStart(k.min_stellen, '0')
  return s
}

export default function NummernPage() {
  const supabase = createClient()
  const router = useRouter()
  const [tab, setTab] = useState<Typ>('angebot')
  const [kreis, setKreis] = useState<Record<Typ, Nummernkreis | null>>({ angebot: null, rechnung: null })
  const [form, setForm] = useState<Record<Typ, Partial<Nummernkreis>>>({ angebot: {}, rechnung: {} })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [warning, setWarning] = useState('')
  const [showAudit, setShowAudit] = useState(false)
  const [auditRows, setAuditRows] = useState<(VergebeneNummer & { kunde?: string })[]>([])
  const [auditLoading, setAuditLoading] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (!company) return
    setCompanyId(company.id)

    // Nummernkreise laden oder anlegen
    const { data: rows } = await supabase
      .from('nummernkreise')
      .select('*')
      .eq('betrieb_id', company.id)

    // Falls noch keine vorhanden: Standard anlegen via RPC
    if (!rows || rows.length === 0) {
      await supabase.rpc('init_nummernkreise', { p_betrieb_id: company.id })
      const { data: fresh } = await supabase.from('nummernkreise').select('*').eq('betrieb_id', company.id)
      applyRows(fresh ?? [])
    } else {
      applyRows(rows)
    }
  }

  function applyRows(rows: Nummernkreis[]) {
    const a = rows.find(r => r.typ === 'angebot') ?? null
    const r = rows.find(r => r.typ === 'rechnung') ?? null
    setKreis({ angebot: a, rechnung: r })
    setForm({
      angebot: a ? { ...a } : defaultKreis('angebot'),
      rechnung: r ? { ...r } : defaultKreis('rechnung'),
    })
  }

  function defaultKreis(typ: Typ): Partial<Nummernkreis> {
    return {
      typ,
      prefix: typ === 'angebot' ? 'AG' : 'RE',
      jahr_aktiv: new Date().getFullYear(),
      trennzeichen: '-',
      naechste_nummer: 1,
      min_stellen: 3,
    }
  }

  function setField(field: keyof Nummernkreis, value: unknown) {
    const updated = { ...form[tab], [field]: value }
    setForm(prev => ({ ...prev, [tab]: updated }))
    setWarning('')

    // Warnung wenn Startnummer kleiner als bereits vergeben
    if (field === 'naechste_nummer' && kreis[tab]) {
      const current = kreis[tab]!.naechste_nummer
      if ((value as number) < current) {
        setWarning(`Achtung: Nr. ${value} wurde möglicherweise bereits vergeben. Lücken sind nicht GoBD-konform.`)
      }
    }
  }

  async function save() {
    if (!companyId) return
    setSaving(true)
    setSaved(false)
    const f = form[tab]
    const existing = kreis[tab]

    if (existing) {
      await supabase.from('nummernkreise').update({
        prefix: f.prefix ?? '',
        jahr_aktiv: f.jahr_aktiv ?? null,
        trennzeichen: f.trennzeichen ?? '-',
        naechste_nummer: f.naechste_nummer ?? 1,
        min_stellen: f.min_stellen ?? 3,
        letztes_update: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('nummernkreise').insert({
        betrieb_id: companyId,
        typ: tab,
        prefix: f.prefix ?? '',
        jahr_aktiv: f.jahr_aktiv ?? null,
        trennzeichen: f.trennzeichen ?? '-',
        naechste_nummer: f.naechste_nummer ?? 1,
        min_stellen: f.min_stellen ?? 3,
      })
    }

    await load()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function loadAudit() {
    if (!companyId) return
    setAuditLoading(true)
    setShowAudit(true)
    const { data } = await supabase
      .from('vergebene_nummern')
      .select('*, quotes(customer:customers(name))')
      .eq('betrieb_id', companyId)
      .order('vergeben_am', { ascending: false })
      .limit(200)

    setAuditRows((data ?? []).map((r: VergebeneNummer & { quotes?: { customer?: { name?: string } } | null }) => ({
      ...r,
      kunde: r.quotes?.customer?.name ?? '—',
    })))
    setAuditLoading(false)
  }

  function exportCsv() {
    const header = 'Nummer,Typ,Vergeben am,Kunde,Storniert'
    const rows = auditRows.map(r =>
      [r.nummer, r.typ, new Date(r.vergeben_am).toLocaleDateString('de-DE'), r.kunde ?? '—', r.storniert ? 'Ja' : 'Nein'].join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'nummern-audit.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const f = form[tab]
  const previewKreis: Nummernkreis = {
    id: '', betrieb_id: '', typ: tab, letztes_update: '',
    prefix: f.prefix ?? '',
    jahr_aktiv: f.jahr_aktiv ?? null,
    trennzeichen: f.trennzeichen ?? '-',
    naechste_nummer: f.naechste_nummer ?? 1,
    min_stellen: f.min_stellen ?? 3,
  }
  const preview = buildPreview(previewKreis)

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#2C2C2C]/8 px-4 pt-10 pb-4 flex items-center gap-3">
        <Link href="/einstellungen" className="text-[#2C2C2C]/40">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-black text-[#2C2C2C]">Angebotsnummern</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-5 space-y-4">

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-[#2C2C2C]/5">
          {(['angebot', 'rechnung'] as Typ[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSaved(false); setWarning('') }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${tab === t ? 'bg-[#2C2C2C] text-white' : 'text-[#2C2C2C]/40'}`}
            >
              {t === 'angebot' ? 'Angebote' : 'Rechnungen'}
            </button>
          ))}
        </div>

        {/* Vorschau */}
        <div className="bg-[#FFF9E6] border border-[#F5C400]/40 rounded-2xl px-6 py-5 text-center">
          <div className="text-xs font-semibold text-[#92400E]/60 mb-1">Nächste Nummer</div>
          <div className="text-3xl font-black text-[#2C2C2C] tracking-wide">{preview}</div>
        </div>

        {/* Formular */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 divide-y divide-[#2C2C2C]/5">

          {/* Kürzel */}
          <div className="px-5 py-4">
            <label className="block text-xs font-bold text-[#2C2C2C]/50 mb-1.5">Kürzel (Präfix)</label>
            <input
              value={f.prefix ?? ''}
              onChange={e => setField('prefix', e.target.value.slice(0, 5).toUpperCase())}
              placeholder="AG"
              maxLength={5}
              className="w-full bg-[#F7F7F5] rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F5C400]/50"
            />
            <p className="text-[10px] text-[#2C2C2C]/30 mt-1">Leer lassen wenn kein Kürzel gewünscht</p>
          </div>

          {/* Jahreszahl */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[#2C2C2C]">Jahreszahl in Nummer</div>
              <div className="text-[10px] text-[#2C2C2C]/40 mt-0.5">Empfohlen — erleichtert die Ablage</div>
            </div>
            <button
              onClick={() => setField('jahr_aktiv', f.jahr_aktiv ? null : new Date().getFullYear())}
              className={`w-11 h-6 rounded-full transition-colors ${f.jahr_aktiv ? 'bg-[#F5C400]' : 'bg-[#2C2C2C]/15'}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${f.jahr_aktiv ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Trennzeichen */}
          <div className="px-5 py-4">
            <label className="block text-xs font-bold text-[#2C2C2C]/50 mb-2">Trennzeichen</label>
            <div className="flex gap-2">
              {['-', '/', ''].map(t => (
                <button
                  key={t === '' ? 'none' : t}
                  onClick={() => setField('trennzeichen', t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${f.trennzeichen === t ? 'border-[#F5C400] bg-[#FFF9E6] text-[#2C2C2C]' : 'border-[#2C2C2C]/10 text-[#2C2C2C]/40'}`}
                >
                  {t === '' ? 'Keins' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Mindeststellen */}
          <div className="px-5 py-4">
            <label className="block text-xs font-bold text-[#2C2C2C]/50 mb-2">Mindest-Stellen</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setField('min_stellen', n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${f.min_stellen === n ? 'border-[#F5C400] bg-[#FFF9E6] text-[#2C2C2C]' : 'border-[#2C2C2C]/10 text-[#2C2C2C]/40'}`}
                >
                  {String(1).padStart(n, '0')}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#2C2C2C]/30 mt-1">Bestimmt führende Nullen (001 oder 0001)</p>
          </div>

          {/* Startnummer */}
          <div className="px-5 py-4">
            <label className="block text-xs font-bold text-[#2C2C2C]/50 mb-1.5">Nächste Nummer</label>
            <input
              type="number"
              min={1}
              value={f.naechste_nummer ?? 1}
              onChange={e => setField('naechste_nummer', parseInt(e.target.value) || 1)}
              className="w-full bg-[#F7F7F5] rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F5C400]/50"
            />
            <p className="text-[10px] text-[#2C2C2C]/30 mt-1">Nur ändern wenn du vorherige Angebote übernehmen willst</p>
            {warning && (
              <div className="flex items-start gap-2 mt-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                <Info size={13} className="text-orange-500 mt-0.5 shrink-0" />
                <span className="text-[11px] text-orange-700">{warning}</span>
              </div>
            )}
          </div>
        </div>

        {/* Speichern */}
        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-[#2C2C2C] text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50"
        >
          {saving ? 'Wird gespeichert…' : saved ? `✓ Nächste Nummer: ${preview}` : 'Einstellungen speichern'}
        </button>

        {/* Audit-Trail */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 overflow-hidden">
          <button
            onClick={() => showAudit ? setShowAudit(false) : loadAudit()}
            className="w-full px-5 py-4 flex items-center justify-between text-left"
          >
            <span className="text-sm font-bold text-[#2C2C2C]">Alle Nummern anzeigen</span>
            <span className="text-[#2C2C2C]/30 text-xs">{showAudit ? '▲' : '▼'}</span>
          </button>

          {showAudit && (
            <div>
              <div className="flex justify-end px-4 pb-3">
                <button onClick={exportCsv} className="flex items-center gap-1.5 text-xs font-semibold text-[#2C2C2C]/50 border border-[#2C2C2C]/10 rounded-xl px-3 py-1.5">
                  <Download size={12} /> CSV exportieren
                </button>
              </div>
              {auditLoading ? (
                <div className="text-center py-6 text-sm text-[#2C2C2C]/30">Lädt…</div>
              ) : auditRows.length === 0 ? (
                <div className="text-center py-6 text-sm text-[#2C2C2C]/30">Noch keine Nummern vergeben</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F7F7F5]">
                      <tr>
                        {['Nummer', 'Typ', 'Vergeben am', 'Kunde', 'Status'].map(h => (
                          <th key={h} className="px-3 py-2 text-left font-bold text-[#2C2C2C]/40">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2C2C2C]/5">
                      {auditRows.map(r => (
                        <tr key={r.id}>
                          <td className="px-3 py-2 font-mono font-bold text-[#2C2C2C]">{r.nummer}</td>
                          <td className="px-3 py-2 capitalize text-[#2C2C2C]/60">{r.typ}</td>
                          <td className="px-3 py-2 text-[#2C2C2C]/60">{new Date(r.vergeben_am).toLocaleDateString('de-DE')}</td>
                          <td className="px-3 py-2 text-[#2C2C2C]/60">{r.kunde}</td>
                          <td className="px-3 py-2">
                            {r.storniert
                              ? <span className="bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-[10px] font-bold">Storniert</span>
                              : <span className="bg-green-100 text-green-600 rounded-full px-2 py-0.5 text-[10px] font-bold">Aktiv</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  )
}
