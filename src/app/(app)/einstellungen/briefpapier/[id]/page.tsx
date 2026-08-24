'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Briefpapier, Company } from '@/lib/types'
import { Upload } from 'lucide-react'
import { Input } from '@/components/Input'

const FARB_CHIPS = ['#F5C400', '#2563EB', '#16A34A', '#DC2626', '#6B7280', '#1C1C1C']
const SCHRIFTEN = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'opensans', label: 'Open Sans' },
]
const FUSSZEILE_CHIPS = ['Steuernummer', 'IBAN', 'Handwerkskammer', 'USt-IdNr.', 'Geschäftsführer']

// ── Mini Live-Vorschau ─────────────────────────────────────────────────────
function BriefpapierVorschau({ bp, company }: { bp: Partial<Briefpapier>; company: Company | null }) {
  // Firmeninfo kommt aus dem Betrieb (companies), nicht mehr aus dem Briefpapier.
  const firmenname = company?.name || 'Musterfirma'
  const akzent = bp.akzentfarbe || '#F5C400'
  const adresse = company?.address || ''

  const dummyItems = [
    { pos: 1, title: 'Malerarbeiten Innen', qty: 45, unit: 'm²', price: 18, total: 810 },
    { pos: 2, title: 'Grundierung', qty: 2, unit: 'Stk', price: 35, total: 70 },
    { pos: 3, title: 'Abschlussarbeiten', qty: 1, unit: 'pauschal', price: 250, total: 250 },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-[7px] leading-tight" style={{ fontFamily: bp.schrift === 'roboto' ? 'Roboto, sans-serif' : bp.schrift === 'opensans' ? '"Open Sans", sans-serif' : 'Inter, sans-serif' }}>
      <div className="px-5 py-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            {bp.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bp.logo_url} alt="" className="max-h-8 max-w-[80px] object-contain mb-1" />
            ) : (
              <div className="font-black text-[10px] text-[#2C2C2C]">{firmenname}</div>
            )}
            {adresse && <div className="text-[6px] text-gray-400 whitespace-pre-line">{adresse}</div>}
          </div>
          <span className="text-[8px] font-black px-2 py-0.5 rounded" style={{ background: akzent, color: '#2C2C2C' }}>ANGEBOT</span>
        </div>

        {/* Tabelle */}
        <div className="rounded overflow-hidden">
          <div className="flex text-[6px] font-bold text-white px-1.5 py-1" style={{ background: '#2C2C2C' }}>
            <span style={{ width: '6%' }}>#</span>
            <span style={{ width: '40%' }}>Bezeichnung</span>
            <span style={{ width: '12%', textAlign: 'right' }}>Menge</span>
            <span style={{ width: '10%', textAlign: 'center' }}>Einh.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Einzelpr.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Gesamt</span>
          </div>
          {dummyItems.map((item, i) => (
            <div key={i} className={`flex px-1.5 py-1 text-[6px] ${i % 2 !== 0 ? 'bg-[#FAFAF8]' : ''}`}>
              <span style={{ width: '6%' }} className="text-gray-400">{item.pos}</span>
              <span style={{ width: '40%' }} className="font-bold">{item.title}</span>
              <span style={{ width: '12%', textAlign: 'right' }}>{item.qty}</span>
              <span style={{ width: '10%', textAlign: 'center' }}>{item.unit}</span>
              <span style={{ width: '16%', textAlign: 'right' }}>{item.price.toFixed(2)} €</span>
              <span style={{ width: '16%', textAlign: 'right' }} className="font-bold">{item.total.toFixed(2)} €</span>
            </div>
          ))}
        </div>

        {/* Summe */}
        <div className="flex justify-end mt-2">
          <div className="rounded px-2 py-1.5 text-[6px] w-[45%]" style={{ background: '#F7F7F5' }}>
            <div className="flex justify-between mb-0.5"><span className="text-gray-500">Netto</span><span>1.130,00 €</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-500">MwSt. 19%</span><span>214,70 €</span></div>
            <div className="flex justify-between font-black border-t border-gray-300 pt-0.5 text-[7px]"><span>Gesamt</span><span>1.344,70 €</span></div>
          </div>
        </div>

        {/* Footer */}
        {(bp.fusszeile_links || bp.fusszeile_mitte || bp.fusszeile_rechts) && (
          <div className="flex justify-between mt-3 pt-1.5 border-t text-[5px] text-gray-400" style={{ borderColor: akzent }}>
            <span>{bp.fusszeile_links}</span>
            <span>{bp.fusszeile_mitte}</span>
            <span>{bp.fusszeile_rechts}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Hauptseite ─────────────────────────────────────────────────────────────
function BriefpapierEditorInner() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  const router = useRouter()
  const [bp, setBp] = useState<Partial<Briefpapier>>({
    akzentfarbe: '#F5C400',
    logo_position: 'links',
    logo_groesse: 'mittel',
    schrift: 'inter',
  })
  const [company, setCompany] = useState<Company | null>(null)
  const [saving, setSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  // DC-031: kommt von "+ Neue Variante erstellen" (siehe briefpapier/page.tsx),
  // die Zeile existiert also schon in der DB, aber der Nutzer hat noch nichts
  // eingegeben. originalRef hält den geladenen Ausgangsstand fest, damit
  // handleBack() erkennen kann, ob seitdem wirklich etwas geändert wurde.
  const istNeu = searchParams.get('neu') === '1'
  const originalRef = useRef<Partial<Briefpapier> | null>(null)

  useEffect(() => { load() }, [id])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: co } = await supabase.from('companies').select('*').eq('user_id', user.id).single()
    setCompany(co)
    const { data } = await supabase.from('briefpapiere').select('*').eq('id', id).single()
    if (data) { setBp(data); originalRef.current = data }
  }

  // DC-031: Zurück ohne zu speichern — bei einer frisch (leer) angelegten
  // Variante, die unverändert geblieben ist, die Zeile wieder entfernen statt
  // eine leere "Neue Variante" in der Liste liegen zu lassen (gleiches Muster
  // wie DC-010/DC-029 bei leeren Angebots-Entwürfen).
  async function handleBack() {
    const geaendert = originalRef.current && JSON.stringify(bp) !== JSON.stringify(originalRef.current)
    if (istNeu && !geaendert) {
      await supabase.from('briefpapiere').delete().eq('id', id)
    } else if (geaendert && !window.confirm('Änderungen wurden noch nicht gespeichert. Trotzdem verlassen?')) {
      return
    }
    router.push('/einstellungen/briefpapier')
  }

  function setField<K extends keyof Briefpapier>(field: K, value: Briefpapier[K]) {
    setBp(prev => ({ ...prev, [field]: value }))
  }

  async function uploadLogo(file: File) {
    if (!bp.betrieb_id) return
    setLogoUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${bp.betrieb_id}/briefpapiere/${id}/logo.${ext}`

    // Alte Datei löschen
    await supabase.storage.from('company-logos').remove([path])

    const { error } = await supabase.storage.from('company-logos').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('company-logos').getPublicUrl(path)
      setField('logo_url', data.publicUrl)
    }
    setLogoUploading(false)
  }

  async function save() {
    setSaving(true)
    await supabase.from('briefpapiere').update({
      ...bp,
      aktualisiert_am: new Date().toISOString(),
    }).eq('id', id)
    setSaving(false)
    router.push('/einstellungen/briefpapier')
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24">
      {/* Header */}
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6">
        <button onClick={handleBack} className="text-white/50 text-sm font-semibold">← Briefpapier</button>
        <h1 className="text-xl font-syne font-black text-white mt-1">
          {bp.name || 'Briefpapier bearbeiten'}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-5">
        {/* Live-Vorschau */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-[#2C2C2C]/30 mb-2 uppercase tracking-wider">Live-Vorschau</div>
          <BriefpapierVorschau bp={bp} company={company} />
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 px-5 py-4">
            <label className="block text-xs font-bold text-[#2C2C2C]/50 mb-1.5">Name dieser Variante</label>
            <Input
              value={bp.name ?? ''}
              onChange={e => setField('name', e.target.value)}
            />
          </div>

          {/* Firmeninfo — zentral aus dem Betrieb */}
          <Link href="/einstellungen" className="block bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 px-5 py-4 hover:border-[#F5C400]/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs font-black text-[#2C2C2C]/50 uppercase tracking-wider mb-1">Firmenangaben</div>
                <div className="font-bold text-[#2C2C2C] text-sm truncate">{company?.name || 'Noch kein Firmenname'}</div>
                {company?.address && (
                  <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{company.address.replace('\n', ' · ')}</div>
                )}
              </div>
              <span className="text-xs font-black text-[#F5C400] shrink-0 ml-3">Ändern →</span>
            </div>
            <p className="text-[11px] text-[#2C2C2C]/30 font-semibold mt-2 leading-relaxed">
              Name, Adresse & Kontakt werden zentral unter Einstellungen → Betrieb gepflegt und erscheinen automatisch auf jedem Angebot.
            </p>
          </Link>

          {/* Logo */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 px-5 py-4 space-y-3">
            <div className="text-xs font-black text-[#2C2C2C]/50 uppercase tracking-wider">Logo</div>
            {bp.logo_url ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bp.logo_url} alt="Logo" className="h-14 max-w-[140px] object-contain rounded-lg border border-[#2C2C2C]/10" />
                <button onClick={() => setField('logo_url', null)} className="text-xs text-red-500 font-semibold">Entfernen</button>
              </div>
            ) : (
              <button
                onClick={() => logoRef.current?.click()}
                disabled={logoUploading}
                className="w-full border-2 border-dashed border-[#2C2C2C]/15 rounded-xl py-5 flex flex-col items-center gap-2 text-[#2C2C2C]/30 hover:border-[#F5C400]/50 transition-colors"
              >
                <Upload size={20} strokeWidth={1.5} />
                <span className="text-xs font-semibold">{logoUploading ? 'Lädt…' : 'Logo hochladen'}</span>
                <span className="text-[10px]">PNG, JPG, SVG · max. 5 MB</span>
              </button>
            )}
            <input ref={logoRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0])} />

            <div>
              <label className="block text-[10px] font-bold text-[#2C2C2C]/40 mb-1.5">Position</label>
              <div className="flex gap-2">
                {(['links', 'mitte', 'rechts'] as const).map(pos => (
                  <button key={pos} onClick={() => setField('logo_position', pos)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 capitalize transition-colors ${bp.logo_position === pos ? 'border-[#F5C400] bg-[#FFF9E6] text-[#2C2C2C]' : 'border-[#2C2C2C]/10 text-[#2C2C2C]/40'}`}>
                    {pos}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#2C2C2C]/40 mb-1.5">Größe</label>
              <div className="flex gap-2">
                {[{ v: 'klein', l: 'Klein' }, { v: 'mittel', l: 'Mittel' }, { v: 'gross', l: 'Groß' }].map(({ v, l }) => (
                  <button key={v} onClick={() => setField('logo_groesse', v as Briefpapier['logo_groesse'])}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-colors ${bp.logo_groesse === v ? 'border-[#F5C400] bg-[#FFF9E6] text-[#2C2C2C]' : 'border-[#2C2C2C]/10 text-[#2C2C2C]/40'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Akzentfarbe */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 px-5 py-4 space-y-3">
            <div className="text-xs font-black text-[#2C2C2C]/50 uppercase tracking-wider">Akzentfarbe</div>
            <div className="flex gap-2">
              {FARB_CHIPS.map(c => (
                <button
                  key={c}
                  onClick={() => setField('akzentfarbe', c)}
                  style={{ background: c }}
                  className={`w-9 h-9 rounded-full border-2 transition-transform ${bp.akzentfarbe === c ? 'border-[#2C2C2C] scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#2C2C2C]/40">#</span>
              <input
                value={(bp.akzentfarbe ?? '#F5C400').replace('#', '')}
                onChange={e => setField('akzentfarbe', '#' + e.target.value.replace('#', '').slice(0, 6))}
                maxLength={6}
                className="flex-1 bg-[#F7F7F5] rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F5C400]/50"
              />
              <div className="w-8 h-8 rounded-lg border border-[#2C2C2C]/10" style={{ background: bp.akzentfarbe }} />
            </div>
          </div>

          {/* Fußzeile */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 px-5 py-4 space-y-3">
            <div className="text-xs font-black text-[#2C2C2C]/50 uppercase tracking-wider">Fußzeile</div>
            <div className="flex flex-wrap gap-1.5">
              {FUSSZEILE_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => {
                    const fields: (keyof Briefpapier)[] = ['fusszeile_links', 'fusszeile_mitte', 'fusszeile_rechts']
                    const empty = fields.find(f => !bp[f])
                    if (empty) setField(empty, chip)
                  }}
                  className="text-[10px] font-semibold bg-[#F7F7F5] border border-[#2C2C2C]/10 rounded-full px-2.5 py-1 text-[#2C2C2C]/60"
                >
                  + {chip}
                </button>
              ))}
            </div>
            {[
              { label: 'Links', field: 'fusszeile_links' as const },
              { label: 'Mitte', field: 'fusszeile_mitte' as const },
              { label: 'Rechts', field: 'fusszeile_rechts' as const },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-[10px] font-bold text-[#2C2C2C]/40 mb-1">{label}</label>
                <Input
                  value={(bp[field] as string) ?? ''}
                  onChange={e => setField(field, e.target.value)}
                  placeholder={`Fußzeile ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          {/* Schrift */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 px-5 py-4 space-y-3">
            <div className="text-xs font-black text-[#2C2C2C]/50 uppercase tracking-wider">Schrift</div>
            <div className="flex gap-2">
              {SCHRIFTEN.map(s => (
                <button
                  key={s.value}
                  onClick={() => setField('schrift', s.value as Briefpapier['schrift'])}
                  style={{ fontFamily: s.value === 'inter' ? 'Inter' : s.value === 'roboto' ? 'Roboto' : 'Open Sans' }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${bp.schrift === s.value ? 'border-[#F5C400] bg-[#FFF9E6] text-[#2C2C2C]' : 'border-[#2C2C2C]/10 text-[#2C2C2C]/40'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speichern */}
          <button
            onClick={save}
            disabled={saving}
            className="w-full bg-[#2C2C2C] text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50"
          >
            {saving ? 'Speichert…' : 'Änderungen speichern'}
          </button>
        </div>
      </div>
    </div>
  )
}

// DC-031: BriefpapierEditorInner nutzt useSearchParams() (für den ?neu=1-Flag)
// — Next.js verlangt dafür einen Suspense-Rand um die Seite, sonst schlägt
// der Build fehl. Gleiches Muster wie in angebot/neu/page.tsx.
export default function BriefpapierEditor() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#F7F7F5]" />}>
      <BriefpapierEditorInner />
    </Suspense>
  )
}
