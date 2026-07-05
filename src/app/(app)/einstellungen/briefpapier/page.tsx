'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Briefpapier } from '@/lib/types'
import { Plus, Star, Copy, Trash2, Pencil } from 'lucide-react'
import BottomNav from '@/components/BottomNav'

export default function BriefpapierUebersicht() {
  const supabase = createClient()
  const router = useRouter()
  const [briefpapiere, setBriefpapiere] = useState<Briefpapier[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: company } = await supabase.from('companies').select('id, name, address, logo_url').eq('user_id', user.id).single()
    if (!company) return
    setCompanyId(company.id)

    const { data, error } = await supabase
      .from('briefpapiere')
      .select('*')
      .eq('betrieb_id', company.id)
      .order('ist_standard', { ascending: false })
      .order('erstellt_am', { ascending: true })

    if (error) { setDbError(true); setLoading(false); return }

    if (!data || data.length === 0) {
      // Standard-Briefpapier aus Firmenprofil anlegen
      const { data: neu, error: insertErr } = await supabase.from('briefpapiere').insert({
        betrieb_id: company.id,
        name: 'Standard',
        ist_standard: true,
        firmenname: company.name,
        logo_url: company.logo_url,
      }).select().single()
      if (insertErr) { setDbError(true); setLoading(false); return }
      setBriefpapiere(neu ? [neu] : [])
    } else {
      setBriefpapiere(data)
    }
    setLoading(false)
  }

  async function setStandard(id: string) {
    if (!companyId) return
    await supabase.from('briefpapiere').update({ ist_standard: false }).eq('betrieb_id', companyId)
    await supabase.from('briefpapiere').update({ ist_standard: true }).eq('id', id)
    load()
  }

  async function duplizieren(bp: Briefpapier) {
    if (briefpapiere.length >= 5) return
    const { data: neu } = await supabase.from('briefpapiere').insert({
      betrieb_id: bp.betrieb_id,
      name: `${bp.name} – Kopie`,
      ist_standard: false,
      firmenname: bp.firmenname,
      zusatz: bp.zusatz,
      strasse: bp.strasse,
      plz: bp.plz,
      ort: bp.ort,
      telefon: bp.telefon,
      email: bp.email,
      website: bp.website,
      logo_url: bp.logo_url,
      logo_position: bp.logo_position,
      logo_groesse: bp.logo_groesse,
      akzentfarbe: bp.akzentfarbe,
      fusszeile_links: bp.fusszeile_links,
      fusszeile_mitte: bp.fusszeile_mitte,
      fusszeile_rechts: bp.fusszeile_rechts,
      schrift: bp.schrift,
    }).select().single()
    if (neu) router.push(`/einstellungen/briefpapier/${neu.id}`)
  }

  async function loeschen(id: string) {
    await supabase.from('briefpapiere').delete().eq('id', id)
    setBriefpapiere(prev => prev.filter(b => b.id !== id))
  }

  async function neu() {
    if (!companyId || briefpapiere.length >= 5) return
    const { data, error } = await supabase.from('briefpapiere').insert({
      betrieb_id: companyId,
      name: 'Neue Variante',
      ist_standard: false,
    }).select().single()
    if (error) { setDbError(true); return }
    if (data) router.push(`/einstellungen/briefpapier/${data.id}`)
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24">
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6">
        <Link href="/einstellungen" className="text-white/50 text-sm font-semibold">← Einstellungen</Link>
        <h1 className="text-xl font-syne font-black text-white mt-1">Briefpapier & Design</h1>
      </div>

      <div className="max-w-xl mx-auto px-5 pt-5 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-[#2C2C2C]/30 text-sm">Lädt…</div>
        ) : dbError ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <div className="text-2xl mb-3">⚠️</div>
            <div className="font-black text-amber-800 text-base mb-2">Tabelle nicht eingerichtet</div>
            <p className="text-amber-700 text-sm leading-relaxed mb-4">
              Die Briefpapier-Funktion muss einmalig in der Datenbank eingerichtet werden.
            </p>
            <div className="bg-amber-100 rounded-xl p-4 text-left">
              <div className="text-[11px] font-black text-amber-800 uppercase tracking-wider mb-2">Schritt: SQL in Supabase ausführen</div>
              <p className="text-amber-700 text-xs leading-relaxed">
                Öffne das Supabase Dashboard → SQL Editor → führe die Datei{' '}
                <code className="bg-amber-200 px-1 rounded">supabase/migrations/20260614132752_create_briefpapiere.sql</code>{' '}
                aus dem Projektordner aus.
              </p>
            </div>
          </div>
        ) : (
          <>
            {briefpapiere.map(bp => (
              <div key={bp.id} className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {bp.ist_standard && <Star size={13} className="text-[#F5C400] fill-[#F5C400]" />}
                      <span className="font-black text-[#2C2C2C] text-sm">{bp.name}</span>
                    </div>
                    <div className="flex gap-3 mt-1.5 text-[10px] text-[#2C2C2C]/30">
                      <span>Logo: {bp.logo_url ? '✓' : '—'}</span>
                      <span>Fußzeile: {(bp.fusszeile_links || bp.fusszeile_mitte || bp.fusszeile_rechts) ? '✓' : '—'}</span>
                      <span style={{ color: bp.akzentfarbe }}>■ {bp.akzentfarbe}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/einstellungen/briefpapier/${bp.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-[#F7F7F5] rounded-xl px-3 py-2 text-[#2C2C2C]"
                  >
                    <Pencil size={11} /> Bearbeiten
                  </Link>
                  <button
                    onClick={() => duplizieren(bp)}
                    disabled={briefpapiere.length >= 5}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-[#F7F7F5] rounded-xl px-3 py-2 text-[#2C2C2C] disabled:opacity-40"
                  >
                    <Copy size={11} /> Duplizieren
                  </button>
                  {!bp.ist_standard && (
                    <>
                      <button
                        onClick={() => setStandard(bp.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-[#FFF9E6] rounded-xl px-3 py-2 text-[#92400E]"
                      >
                        <Star size={11} /> Standard
                      </button>
                      <button
                        onClick={() => loeschen(bp.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 rounded-xl px-3 py-2 text-red-600"
                      >
                        <Trash2 size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {briefpapiere.length < 5 && (
              <button
                onClick={neu}
                className="w-full border-2 border-dashed border-[#2C2C2C]/15 rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#2C2C2C]/30 hover:border-[#F5C400]/50 transition-colors"
              >
                <Plus size={16} /> Neue Variante erstellen
              </button>
            )}
            {briefpapiere.length >= 5 && (
              <p className="text-center text-xs text-[#2C2C2C]/30">Max. 5 Varianten erreicht</p>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
