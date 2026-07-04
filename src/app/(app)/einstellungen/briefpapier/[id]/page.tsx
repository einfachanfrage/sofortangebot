'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
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
  const firmenname = bp.firmenname || company?.name || 'Musterfirma'
  const akzent = bp.akzentfarbe || '#F5C400'
  const adresse = [bp.strasse, bp.plz && bp.ort ? `${bp.plz} ${bp.ort}` : bp.ort].filter(Boolean).join('\n')

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
export default function BriefpapierEditor() {
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

  useEffect(() => { load() }, [id])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: co } = await supabase.from('companies').select('*').eq('user_id', user.id).single()
    setCompany(co)
    const { data } = await supabase.from('briefpapiere').select('*').eq('id', id).single()
    if (data) setBp(data)
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
        <Link href="/einstellungen/briefpapier" className="text-white/50 text-sm font-semibold">← Briefpapier</Link>
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

          {/* Firmeninfo */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 px-5 py-4 space-y-3">
            <div className="text-xs font-black text-[#2C2C2C]/50 uppercase tracking-wider">Firmeninfo</div>
            {[
              { label: 'Firmenname', field: 'firmenname' as const, placeholder: 'Musterfirma GmbH' },
              { label: 'Zusatz', field: 'zusatz' as const, placeholder: 'Inh. Max Mustermann' },
              { label: 'Straße', field: 'strasse' as const, placeholder: 'Musterstraße 1' },
              { label: 'PLZ', field: 'plz' as const, placeholder: '12345' },
              { label: 'Ort', field: 'ort' as const, placeholder: 'Berlin' },
              { label: 'Telefon', field: 'telefon' as const, placeholder: '+49 30 1234567' },
              { label: 'E-Mail', field: 'email' as const, placeholder: 'info@firma.de' },
              { label: 'Website', field: 'website' as const, placeholder: 'www.firma.de' },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="block text-[10px] font-bold text-[#2C2C2C]/40 mb-1">{label}</label>
                <Input
                  value={(bp[field] as string) ?? ''}
                  onChange={e => setField(field, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

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
