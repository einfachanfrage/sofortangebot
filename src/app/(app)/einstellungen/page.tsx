'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Company } from '@/lib/types'
import { GEWERKE } from '@/lib/gewerke'
import { KLEINMATERIAL_CONFIG } from '@/lib/gewerke-config'
import { Check, Upload, X, Loader2, Building2, Receipt, Wrench, Image, ExternalLink, LogOut, FileCheck2, Download, Bell, Smartphone, Car } from 'lucide-react'
import { AccountDeleteModal } from '@/components/AccountDeleteModal'
import BottomNav from '@/components/BottomNav'
import { PwaBottomSheet } from '@/components/PwaBottomSheet'
import { PushBanner } from '@/components/PushBanner'
import { ConfirmSheet } from '@/components/ConfirmSheet'
import { Toast } from '@/components/Toast'
import { Input, Textarea } from '@/components/Input'

export default function EinstellungenPage() {
  const [activeTab, setActiveTab] = useState<'betrieb' | 'angebote' | 'app'>('betrieb')
  const [company, setCompany] = useState<Company | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [ustId, setUstId] = useState('')
  const [iban, setIban] = useState('')
  const [agbUrl, setAgbUrl] = useState('')
  const [vatRate, setVatRate] = useState<19 | 7 | 0>(19)
  const [paymentDays, setPaymentDays] = useState(14)
  const [gewerke, setGewerke] = useState<string[]>([])
  const [regionalFaktor, setRegionalFaktor] = useState(0)
  const [regionalManual, setRegionalManual] = useState(false)
  const [angebotGueltigTage, setAngebotGueltigTage] = useState(30)
  const [materialpreisHinweis, setMaterialpreisHinweis] = useState(false)
  const [mindestauftragswert, setMindestauftragswert] = useState(0)
  const [kleinAktiv, setKleinAktiv] = useState(true)
  const [kleinBetrag, setKleinBetrag] = useState(25)
  const [kleinSchwelle, setKleinSchwelle] = useState(200)
  const [kleinBezeichnung, setKleinBezeichnung] = useState('Kleinmaterial und Verbrauchsmaterial')
  const [anfahrtAktiv, setAnfahrtAktiv] = useState(false)
  const [anfahrtBetrag, setAnfahrtBetrag] = useState(45)
  const [anfahrtBezeichnung, setAnfahrtBezeichnung] = useState('An- und Abfahrt')
  const [eRechnungAktiv, setERechnungAktiv] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoError, setLogoError] = useState('')
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [showPwaSheet, setShowPwaSheet] = useState(false)
  const [showExportSheet, setShowExportSheet] = useState(false)
  const [exportToast, setExportToast] = useState(false)
  const [showPushBanner, setShowPushBanner] = useState(false)
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [isStandalone, setIsStandalone] = useState(false)
  const [woerterbuch, setWoerterbuch] = useState<{ id: string; begriff: string; position_id: string; gewerk_id: string | null; match_count: number; bestaetigt_count: number; status: string }[]>([])
  const [woerterbuchStats, setWoerterbuchStats] = useState<{ total: number; bestaetigt: number; lernend: number } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('companies').select('*').eq('user_id', user.id).single()
      if (data) {
        setCompany(data)
        setName(data.name ?? '')
        setAddress(data.address ?? '')
        setTaxNumber(data.tax_number ?? '')
        setUstId(data.ust_id ?? '')
        setIban(data.iban ?? '')
        setAgbUrl(data.agb_url ?? '')
        setVatRate((data.vat_rate ?? 19) as 19 | 7 | 0)
        setPaymentDays(data.payment_days ?? 14)
        setGewerke(data.gewerke ?? [])
        setLogoUrl(data.logo_url ?? null)
        const faktor = data.regionaler_preisfaktor_prozent ?? 0
        const presets = [20, 10, 0, -10, -15]
        setRegionalFaktor(faktor)
        setRegionalManual(!presets.includes(faktor))
        setAngebotGueltigTage(data.angebot_gueltig_tage ?? 30)
        setMaterialpreisHinweis(data.materialpreis_hinweis_aktiv ?? false)
        setMindestauftragswert(data.mindestauftragswert ?? 0)
        setERechnungAktiv(data.e_rechnung_aktiv !== false)
        // Kleinmaterial: Betriebs-Config oder Gewerk-Default
        const gewerkDefault = KLEINMATERIAL_CONFIG[(data.gewerke ?? [])[0] ?? ''] ?? { aktiv: true, betrag_eur: 25, schwelle_eur: 200, bezeichnung: 'Kleinmaterial und Verbrauchsmaterial' }
        const kc = (data.kleinmaterial_config ?? null) as { aktiv?: boolean; betrag_eur?: number; schwelle_eur?: number; bezeichnung?: string } | null
        setKleinAktiv(kc?.aktiv ?? gewerkDefault.aktiv)
        setKleinBetrag(kc?.betrag_eur ?? gewerkDefault.betrag_eur)
        setKleinSchwelle(kc?.schwelle_eur ?? gewerkDefault.schwelle_eur)
        setKleinBezeichnung(kc?.bezeichnung ?? gewerkDefault.bezeichnung)
        // An- und Abfahrt (Standard: aus)
        const ac = (data.anfahrt_config ?? null) as { aktiv?: boolean; betrag_eur?: number; bezeichnung?: string } | null
        setAnfahrtAktiv(ac?.aktiv ?? false)
        setAnfahrtBetrag(ac?.betrag_eur ?? 45)
        setAnfahrtBezeichnung(ac?.bezeichnung ?? 'An- und Abfahrt')
      }
    }
    load()
    // Push & PWA status
    if ('Notification' in window) {
      setPushPermission(Notification.permission)
    } else {
      setPushPermission('unsupported')
    }
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
    )
    // Wörterbuch laden
    fetch('/api/ki/woerterbuch').then(r => r.json()).then(d => {
      if (d.eintraege) setWoerterbuch(d.eintraege)
      if (d.statistik) setWoerterbuchStats(d.statistik)
    }).catch(() => {})
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('companies').update({
      name, address, tax_number: taxNumber, ust_id: ustId || null,
      iban, agb_url: agbUrl || null,
      vat_rate: vatRate, payment_days: paymentDays, gewerke,
      regionaler_preisfaktor_prozent: regionalFaktor,
      angebot_gueltig_tage: angebotGueltigTage,
      materialpreis_hinweis_aktiv: materialpreisHinweis,
      mindestauftragswert: mindestauftragswert,
      e_rechnung_aktiv: eRechnungAktiv,
      kleinmaterial_config: {
        aktiv: kleinAktiv,
        betrag_eur: kleinBetrag,
        schwelle_eur: kleinSchwelle,
        bezeichnung: kleinBezeichnung.trim() || 'Kleinmaterial und Verbrauchsmaterial',
      },
      anfahrt_config: {
        aktiv: anfahrtAktiv,
        betrag_eur: anfahrtBetrag,
        bezeichnung: anfahrtBezeichnung.trim() || 'An- und Abfahrt',
      },
    }).eq('user_id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleLogoUpload(file: File) {
    setLogoError('')
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      setLogoError('Nur PNG, JPG, WebP oder SVG erlaubt.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoError('Datei zu groß (max. 5 MB).')
      return
    }
    setLogoUploading(true)
    const fd = new FormData()
    fd.append('logo', file)
    const r = await fetch('/api/upload-logo', { method: 'POST', body: fd })
    const data = await r.json()
    setLogoUploading(false)
    if (!r.ok) { setLogoError(data.error ?? 'Upload fehlgeschlagen'); return }
    setLogoUrl(data.url + '?t=' + Date.now())
  }

  async function removeLogo() {
    setLogoUrl(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('companies').update({ logo_url: null }).eq('user_id', user.id)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24 md:pb-12">
      <div className="md:max-w-5xl md:mx-auto">
      {/* Header */}
      <div className="bg-[#2C2C2C] md:bg-transparent px-5 md:px-8 pt-12 md:pt-8 pb-4">
        <div className="text-[#F5C400] md:text-[#2C2C2C] text-2xl font-syne font-black">Einstellungen</div>
      </div>

      {/* Tabs */}
      <div className="px-5 md:px-8 pb-4 bg-[#2C2C2C] md:bg-transparent">
        <div className="flex gap-1 bg-white/10 md:bg-[#2C2C2C]/8 rounded-2xl p-1">
          {([
            { id: 'betrieb', label: 'Betrieb' },
            { id: 'angebote', label: 'Angebote' },
            { id: 'app', label: 'App' },
          ] as { id: typeof activeTab; label: string }[]).map(tab => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl font-black text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#F5C400] text-[#2C2C2C]'
                  : 'text-white/60 md:text-[#2C2C2C]/40 hover:text-white/80 md:hover:text-[#2C2C2C]/60'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB: BETRIEB ─────────────────────────────────────────────────────── */}
      {activeTab === 'betrieb' && (
      <form onSubmit={handleSave} className="px-5 md:px-8 flex flex-col gap-5 md:gap-6">

        {/* Desktop: 2-Spalten Grid für Betrieb + Logo */}
        <div className="md:grid md:grid-cols-2 md:gap-6 flex flex-col gap-5">

          {/* Betrieb */}
          <Card icon={<Building2 size={16} />} title="Betrieb">
            <Field label="Firmenname">
              <Input value={name} onChange={e => setName(e.target.value)}
                placeholder="Malerbetrieb Müller" />
            </Field>
            <Field label="Adresse">
              <Textarea value={address} onChange={e => setAddress(e.target.value)}
                rows={3}
                placeholder={'Musterstraße 1\n12345 Musterstadt'} />
            </Field>
            <Field label="Steuernummer">
              <Input value={taxNumber} onChange={e => setTaxNumber(e.target.value)}
                placeholder="12/345/67890" />
            </Field>
            <Field label="USt-IdNr. (optional)">
              <Input value={ustId} onChange={e => setUstId(e.target.value)}
                placeholder="DE123456789" />
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1">
                Falls vorhanden, erscheint die USt-ID statt der Steuernummer auf dem Angebot.
              </p>
            </Field>
            <Field label="IBAN">
              <Input value={iban} onChange={e => setIban(e.target.value)}
                placeholder="DE89 3704 0044 0532 0130 00" />
            </Field>
            <Field label="Link zu deinen AGB (optional)">
              <Input value={agbUrl} onChange={e => setAgbUrl(e.target.value)}
                placeholder="https://meinewebseite.de/agb" type="url" />
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1">
                Wenn hinterlegt, müssen Kunden deinen AGB beim Unterschreiben zustimmen.
              </p>
            </Field>
          </Card>

          {/* Logo */}
          <Card icon={<Image size={16} />} title="Firmenlogo">
            <p className="text-xs text-[#2C2C2C]/40 font-semibold -mt-2 mb-3">
              PNG, JPG, WebP oder SVG · max. 5 MB · empfohlen 400×200 px
            </p>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}
            />
            {logoUrl ? (
              <div className="flex flex-col gap-3">
                <div className="relative inline-block w-fit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Logo"
                    className="h-20 object-contain rounded-xl border-2 border-[#2C2C2C]/10 p-2 bg-white" />
                  <button type="button" onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
                <button type="button" onClick={() => logoInputRef.current?.click()}
                  className="text-xs font-bold text-[#2C2C2C]/40 text-left">
                  Anderes Logo wählen →
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="w-full border-2 border-dashed border-[#2C2C2C]/20 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-[#F5C400] transition-colors disabled:opacity-50">
                {logoUploading
                  ? <Loader2 size={24} color="#F5C400" className="animate-spin" />
                  : <Upload size={24} color="#2C2C2C" strokeWidth={1.5} className="opacity-30" />
                }
                <span className="font-bold text-[#2C2C2C]/50 text-sm">
                  {logoUploading ? 'Wird hochgeladen...' : 'Logo hochladen'}
                </span>
              </button>
            )}
            {logoError && (
              <div className="mt-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs font-semibold">
                {logoError}
              </div>
            )}
          </Card>

          {/* Gewerk */}
          <Card icon={<Wrench size={16} />} title="Gewerk">
            <p className="text-xs text-[#2C2C2C]/40 font-semibold -mt-2 mb-3">
              Aktuell unterstützt für Maler & Lackierer und Bodenbeläge & Parkett.
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { emoji: '🖌', label: 'Maler & Lackierer', desc: 'Streichen, Spachteln, Tapezieren, Lackieren' },
                { emoji: '🏠', label: 'Bodenbeläge & Parkett', desc: 'Laminat, Vinyl, Parkett, Teppich' },
              ].map(g => (
                <div key={g.label} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 border-2 border-[#F5C400] bg-[#F5C400]/5">
                  <span className="text-lg">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-[#2C2C2C]">{g.label}</div>
                    <div className="text-xs text-[#2C2C2C]/40 font-semibold">{g.desc}</div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-[#F5C400] bg-[#F5C400] flex items-center justify-center shrink-0">
                    <Check size={11} color="#2C2C2C" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-3">
              Weitere Gewerke folgen — Fliesen, Trockenbau, Elektro & mehr.
            </p>
          </Card>
        </div>

        {/* Save Button */}
        <button type="submit" disabled={saving}
          className="w-full md:max-w-xs bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-2xl py-4 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {saved
            ? <><Check size={18} strokeWidth={3} /> Gespeichert</>
            : saving ? 'Speichert…' : 'Speichern'
          }
        </button>
      </form>
      )}

      {/* ── TAB: ANGEBOTE ────────────────────────────────────────────────────── */}
      {activeTab === 'angebote' && (
      <form onSubmit={handleSave} className="px-5 md:px-8 flex flex-col gap-5 md:gap-6">

        {/* Desktop: 2-Spalten Grid für Steuer + E-Rechnung */}
        <div className="md:grid md:grid-cols-2 md:gap-6 flex flex-col gap-5">

          {/* Rechnungsstellung */}
          <Card icon={<Receipt size={16} />} title="Steuer & Rechnungslegung">
            <Field label="Mehrwertsteuer">
              <div className="flex gap-2">
                {([
                  { value: 19, label: '19 %' },
                  { value: 7,  label: '7 %'  },
                  { value: 0,  label: 'Kleinunternehmer' },
                ] as { value: 19 | 7 | 0; label: string }[]).map(opt => (
                  <button key={opt.value} type="button" onClick={() => setVatRate(opt.value)}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                      vatRate === opt.value
                        ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                        : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {vatRate === 0 ? (
                <p className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5">
                  Kein Ausweis von Umsatzsteuer gemäß § 19 UStG. Auf Angeboten erscheint der Pflichthinweis automatisch.
                </p>
              ) : (
                <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                  {vatRate} % MwSt. wird auf Angeboten ausgewiesen (Netto + MwSt. = Brutto).
                </p>
              )}
            </Field>
            <Field label="Zahlungsziel">
              <div className="flex gap-2">
                {[7, 14, 30].map(days => (
                  <button key={days} type="button" onClick={() => setPaymentDays(days)}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                      paymentDays === days
                        ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                        : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                    }`}>
                    {days} Tage
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                Steht als Zahlungsfrist auf jedem Angebot.
              </p>
            </Field>
            <Field label="Angebot Gültigkeitsdauer">
              <div className="flex gap-2">
                {[14, 30, 60, 90].map(days => (
                  <button key={days} type="button" onClick={() => setAngebotGueltigTage(days)}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                      angebotGueltigTage === days
                        ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                        : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                    }`}>
                    {days} Tage
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                Standard-Gültigkeitsdauer für neue Angebote.
              </p>
            </Field>
            <Field label="Materialpreis-Hinweis">
              <button type="button" onClick={() => setMaterialpreisHinweis(v => !v)}
                className={`flex items-center gap-3 w-full rounded-xl border-2 px-3 py-3 transition-colors ${
                  materialpreisHinweis ? 'border-[#F5C400] bg-[#F5C400]/10' : 'border-[#2C2C2C]/10 bg-[#F7F7F5]'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  materialpreisHinweis ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/20'}`}>
                  {materialpreisHinweis && <Check size={11} color="#2C2C2C" strokeWidth={3} />}
                </div>
                <span className={`font-bold text-sm ${materialpreisHinweis ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/50'}`}>
                  Hinweis auf Angeboten drucken
                </span>
              </button>
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                Fügt folgenden Text ein: „Preise basieren auf aktuellen Materialkosten und können bei Lieferantenpreisänderungen angepasst werden."
              </p>
            </Field>
            <Field label="Mindestauftragswert">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={mindestauftragswert || ''}
                  onChange={e => setMindestauftragswert(Number(e.target.value) || 0)}
                  placeholder="0"
                  min={0}
                  step={10}
                />
                <span className="font-bold text-[#2C2C2C]/50 shrink-0">€ netto</span>
              </div>
              {mindestauftragswert > 0 ? (
                <p className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5">
                  Bei Angeboten unter {mindestauftragswert} € erscheint eine Warnung mit Vorschlag zur Kleinstauftragspauschale.
                </p>
              ) : (
                <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                  0 € = deaktiviert. Kein Mindestauftragswert.
                </p>
              )}
            </Field>
          </Card>

          {/* E-Rechnung */}
          <Card icon={<FileCheck2 size={16} />} title="E-Rechnung & Compliance">
            {!taxNumber && !ustId && (
              <div className="flex items-start gap-2 bg-[#F5C400]/15 border border-[#F5C400]/40 rounded-xl px-3 py-3 -mt-1">
                <span className="text-sm mt-0.5">⚠️</span>
                <p className="text-xs font-semibold text-[#2C2C2C]/70 leading-relaxed">
                  Für E-Rechnungen bitte <strong>Steuernummer</strong> oder <strong>USt-IdNr.</strong> im Betrieb-Bereich ergänzen.
                </p>
              </div>
            )}
            <Field label="E-Rechnungen automatisch erstellen">
              <button type="button" onClick={() => setERechnungAktiv(v => !v)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 transition-colors ${
                  eRechnungAktiv ? 'bg-[#F5C400] border-[#F5C400]' : 'bg-[#2C2C2C]/10 border-transparent'
                }`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  eRechnungAktiv ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <p className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5 leading-relaxed">
                {vatRate === 0
                  ? 'Als Kleinunternehmer (§ 19 UStG) bist du aktuell noch nicht verpflichtet. Ab 2027 gilt die Pflicht für alle.'
                  : 'Bei aktivem Toggle: PDFs von Geschäftskunden enthalten automatisch eine eingebettete ZUGFeRD-XML (Factur-X EN 16931). Kompatibel mit DATEV, Lexoffice, sevDesk.'}
              </p>
            </Field>
            <p className="text-xs text-[#2C2C2C]/30 font-semibold leading-relaxed border-t border-[#2C2C2C]/5 pt-3">
              Sofortangebot unterstützt dich bei der technischen Erstellung von E-Rechnungen. Für steuerrechtliche Fragen wende dich bitte an deinen Steuerberater.
            </p>
          </Card>

        </div>

        <Card icon={<Receipt size={16} />} title="Regionaler Preisfaktor">
          <p className="text-xs text-[#2C2C2C]/40 font-semibold -mt-2 mb-3">
            Aufschlag oder Abschlag auf alle berechneten Preise — je nach Region.
          </p>
          <div className="flex flex-col gap-2">
            {([
              { value: 20,  label: '+20 %', desc: 'München · Hamburg · Frankfurt' },
              { value: 10,  label: '+10 %', desc: 'Berlin · Köln · Düsseldorf' },
              { value: 0,   label: '± 0 %', desc: 'Mittlere Großstadt' },
              { value: -10, label: '−10 %', desc: 'Kleinstädte / ländlich West' },
              { value: -15, label: '−15 %', desc: 'Ländlich Ost' },
            ] as { value: number; label: string; desc: string }[]).map(opt => (
              <button key={opt.value} type="button"
                onClick={() => { setRegionalFaktor(opt.value); setRegionalManual(false) }}
                className={`flex items-center justify-between w-full rounded-xl border-2 px-3 py-2.5 transition-colors ${
                  !regionalManual && regionalFaktor === opt.value
                    ? 'border-[#F5C400] bg-[#F5C400]/10'
                    : 'border-[#2C2C2C]/10 bg-[#F7F7F5]'
                }`}>
                <span className={`font-black text-sm ${!regionalManual && regionalFaktor === opt.value ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/50'}`}>
                  {opt.label}
                </span>
                <span className={`text-xs font-semibold ${!regionalManual && regionalFaktor === opt.value ? 'text-[#2C2C2C]/60' : 'text-[#2C2C2C]/30'}`}>
                  {opt.desc}
                </span>
              </button>
            ))}
            <button type="button"
              onClick={() => setRegionalManual(true)}
              className={`flex items-center justify-between w-full rounded-xl border-2 px-3 py-2.5 transition-colors ${
                regionalManual ? 'border-[#F5C400] bg-[#F5C400]/10' : 'border-[#2C2C2C]/10 bg-[#F7F7F5]'
              }`}>
              <span className={`font-black text-sm ${regionalManual ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/50'}`}>Manuell</span>
              {regionalManual && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={regionalFaktor}
                    onChange={e => setRegionalFaktor(Number(e.target.value))}
                    onClick={e => e.stopPropagation()}
                    className="w-16 text-right bg-white border-2 border-[#F5C400] rounded-lg px-2 py-1 text-sm font-black text-[#2C2C2C] focus:outline-none"
                    min={-50}
                    max={100}
                    step={1}
                  />
                  <span className="text-sm font-bold text-[#2C2C2C]/60">%</span>
                </div>
              )}
            </button>
          </div>
          {regionalFaktor !== 0 ? (
            <p className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5">
              Preise basieren auf Regionalfaktor: {regionalFaktor > 0 ? '+' : ''}{regionalFaktor} %. Wird automatisch auf alle Positionen angewendet.
            </p>
          ) : (
            <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
              Kein Aufschlag — Standardpreise ohne Regionalanpassung.
            </p>
          )}
        </Card>

        {/* Kleinmaterial-Pauschale */}
        <Card icon={<Wrench size={16} />} title="Kleinmaterial-Pauschale">
          <p className="text-xs text-[#2C2C2C]/40 font-semibold -mt-2 mb-3">
            Wird automatisch als Position ergänzt, wenn der Netto-Auftragswert über der Schwelle liegt — einmal pro Angebot.
          </p>
          <button type="button" onClick={() => setKleinAktiv(v => !v)}
            className={`flex items-center gap-3 w-full rounded-xl border-2 px-3 py-3 transition-colors ${
              kleinAktiv ? 'border-[#F5C400] bg-[#F5C400]/10' : 'border-[#2C2C2C]/10 bg-[#F7F7F5]'
            }`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              kleinAktiv ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/20'}`}>
              {kleinAktiv && <Check size={11} color="#2C2C2C" strokeWidth={3} />}
            </div>
            <span className={`font-bold text-sm ${kleinAktiv ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/50'}`}>
              Automatisch zum Angebot hinzufügen
            </span>
          </button>
          {kleinAktiv && (
            <>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Pauschale">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={kleinBetrag || ''}
                      onChange={e => setKleinBetrag(Number(e.target.value) || 0)}
                      min={0}
                      step={5}
                    />
                    <span className="font-bold text-[#2C2C2C]/50 shrink-0">€</span>
                  </div>
                </Field>
                <Field label="Ab Auftragswert">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={kleinSchwelle || ''}
                      onChange={e => setKleinSchwelle(Number(e.target.value) || 0)}
                      min={0}
                      step={50}
                    />
                    <span className="font-bold text-[#2C2C2C]/50 shrink-0">€</span>
                  </div>
                </Field>
              </div>
              <Field label="Bezeichnung auf dem Angebot">
                <Input
                  type="text"
                  value={kleinBezeichnung}
                  onChange={e => setKleinBezeichnung(e.target.value)}
                  placeholder="Kleinmaterial und Verbrauchsmaterial"
                />
              </Field>
              <p className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5">
                Beispiel: Ab {kleinSchwelle} € Auftragswert wird „{kleinBezeichnung.trim() || 'Kleinmaterial und Verbrauchsmaterial'}" mit {kleinBetrag} € netto ergänzt.
              </p>
            </>
          )}
        </Card>

        {/* An- und Abfahrt-Pauschale */}
        <Card icon={<Car size={16} />} title="An- und Abfahrt">
          <p className="text-xs text-[#2C2C2C]/40 font-semibold -mt-2 mb-3">
            Wird als feste Position zu jedem Angebot hinzugefügt — unabhängig vom Auftragswert.
          </p>
          <button type="button" onClick={() => setAnfahrtAktiv(v => !v)}
            className={`flex items-center gap-3 w-full rounded-xl border-2 px-3 py-3 transition-colors ${
              anfahrtAktiv ? 'border-[#F5C400] bg-[#F5C400]/10' : 'border-[#2C2C2C]/10 bg-[#F7F7F5]'
            }`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              anfahrtAktiv ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/20'}`}>
              {anfahrtAktiv && <Check size={11} color="#2C2C2C" strokeWidth={3} />}
            </div>
            <span className={`font-bold text-sm ${anfahrtAktiv ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/50'}`}>
              Automatisch zum Angebot hinzufügen
            </span>
          </button>
          {anfahrtAktiv && (
            <>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Pauschale">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={anfahrtBetrag || ''}
                      onChange={e => setAnfahrtBetrag(Number(e.target.value) || 0)}
                      min={0}
                      step={5}
                    />
                    <span className="font-bold text-[#2C2C2C]/50 shrink-0">€</span>
                  </div>
                </Field>
                <Field label="Bezeichnung">
                  <Input
                    type="text"
                    value={anfahrtBezeichnung}
                    onChange={e => setAnfahrtBezeichnung(e.target.value)}
                    placeholder="An- und Abfahrt"
                  />
                </Field>
              </div>
              <p className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5">
                „{anfahrtBezeichnung.trim() || 'An- und Abfahrt'}" wird mit {anfahrtBetrag} € netto zu jedem Angebot ergänzt.
              </p>
            </>
          )}
        </Card>

        <div className="flex flex-col gap-3">
          <Link href="/preise"
            className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4 hover:border-[#F5C400]/50 transition-colors group">
            <div>
              <span className="font-bold text-[#2C2C2C]">Preisdatenbank</span>
              <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">Stunden- und Einheitspreise verwalten</div>
            </div>
            <ExternalLink size={16} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60" />
          </Link>
          <Link href="/einstellungen/nummern"
            className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4 hover:border-[#F5C400]/50 transition-colors group">
            <div>
              <span className="font-bold text-[#2C2C2C]">Angebotsnummern</span>
              <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">GoBD-konform · Präfix, Format, Jahreswechsel</div>
            </div>
            <ExternalLink size={16} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60" />
          </Link>
          <Link href="/einstellungen/briefpapier"
            className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4 hover:border-[#F5C400]/50 transition-colors group">
            <div>
              <span className="font-bold text-[#2C2C2C]">Briefpapier & Design</span>
              <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">Varianten, Farben, Logo, Fußzeile</div>
            </div>
            <ExternalLink size={16} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60" />
          </Link>
        </div>

        <button type="submit" disabled={saving}
          className="w-full md:max-w-xs bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-2xl py-4 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {saved
            ? <><Check size={18} strokeWidth={3} /> Gespeichert</>
            : saving ? 'Speichert…' : 'Speichern'
          }
        </button>
      </form>
      )}

      {/* ── TAB: APP ─────────────────────────────────────────────────────────── */}
      {activeTab === 'app' && (
      <div className="px-5 md:px-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {/* PWA installieren */}
          <button
            type="button"
            onClick={() => setShowPwaSheet(true)}
            className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4 hover:border-[#F5C400]/50 transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-[#2C2C2C]/40" />
              <div>
                <span className="font-bold text-[#2C2C2C] text-sm block">App auf Homescreen</span>
                <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">
                  {isStandalone ? '✅ Bereits installiert' : 'Schneller starten ohne Browser'}
                </div>
              </div>
            </div>
            {!isStandalone && <ExternalLink size={16} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60 shrink-0" />}
          </button>

          {/* Push Notifications */}
          {pushPermission !== 'unsupported' && (
            <button
              type="button"
              onClick={() => {
                if (pushPermission === 'granted') return
                setShowPushBanner(true)
              }}
              className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4 hover:border-[#F5C400]/50 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-[#2C2C2C]/40" />
                <div>
                  <span className="font-bold text-[#2C2C2C] text-sm block">Benachrichtigungen</span>
                  <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">
                    {pushPermission === 'granted'
                      ? '✅ Aktiviert'
                      : pushPermission === 'denied'
                        ? '🚫 Blockiert (Browser-Einstellungen)'
                        : 'Bei Unterschrift & Ablauf benachrichtigt werden'}
                  </div>
                </div>
              </div>
              {pushPermission === 'default' && <ExternalLink size={16} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60 shrink-0" />}
            </button>
          )}
        </div>

        {/* Mein Wörterbuch */}
        {woerterbuchStats && (woerterbuchStats.total > 0) && (
          <div className="bg-white rounded-2xl p-5 border border-[#2C2C2C]/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#F5C400]/20 rounded-lg flex items-center justify-center text-sm">⚡</div>
              <div className="font-black text-[#2C2C2C]">Mein Wörterbuch</div>
              <div className="ml-auto flex gap-2 text-xs font-bold text-[#2C2C2C]/40">
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{woerterbuchStats.bestaetigt} bestätigt</span>
                <span className="bg-[#F5C400]/10 text-[#2C2C2C]/60 px-2 py-0.5 rounded-full">{woerterbuchStats.lernend} lernend</span>
              </div>
            </div>
            <p className="text-xs text-[#2C2C2C]/40 font-semibold mb-4">
              Die KI hat diese Begriffe aus deinen Angeboten gelernt. Bestätigte Begriffe werden sofort erkannt — ohne KI-Call.
            </p>
            <div className="flex flex-col gap-2">
              {woerterbuch.map(e => (
                <div key={e.id} className="flex items-center gap-3 py-2 border-b border-[#2C2C2C]/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#2C2C2C] text-sm truncate">{e.begriff}</div>
                    <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">
                      {e.match_count}× verwendet · {e.gewerk_id ?? 'Alle Gewerke'}
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                    e.status === 'bestaetigt'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-[#F5C400]/10 text-[#2C2C2C]/50'
                  }`}>
                    {e.status === 'bestaetigt' ? '✓ Bestätigt' : '… Lernend'}
                  </span>
                  <button
                    onClick={async () => {
                      await fetch('/api/ki/woerterbuch', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: e.id }) })
                      setWoerterbuch(prev => prev.filter(x => x.id !== e.id))
                      setWoerterbuchStats(prev => prev ? { ...prev, total: prev.total - 1, [e.status === 'bestaetigt' ? 'bestaetigt' : 'lernend']: prev[e.status === 'bestaetigt' ? 'bestaetigt' : 'lernend'] - 1 } : null)
                    }}
                    className="text-[#2C2C2C]/20 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                    title="Aus Wörterbuch entfernen"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrationen */}
        <Link href="/einstellungen/integrationen"
          className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4 hover:border-[#F5C400]/50 transition-colors group">
          <div>
            <span className="font-bold text-[#2C2C2C] text-sm block">Buchhaltung verbinden</span>
            <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">Lexoffice, sevDesk & mehr</div>
          </div>
          <ExternalLink size={16} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60" />
        </Link>

        <div className="flex flex-col gap-1 mt-2">
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-[#2C2C2C]/50 font-bold text-sm py-3 hover:text-[#2C2C2C] transition-colors">
            <LogOut size={16} />
            Ausloggen
          </button>
          <button
            type="button"
            onClick={() => setShowExportSheet(true)}
            className="flex items-center gap-2 text-[#2C2C2C]/50 font-bold text-sm py-3 hover:text-[#2C2C2C] transition-colors"
          >
            <Download size={16} />
            Meine Daten exportieren
          </button>
          <AccountDeleteModal />
        </div>
      </div>
      )}
      </div>

      {/* Daten-Export Bestätigung */}
      <ConfirmSheet
        open={showExportSheet}
        title="Daten exportieren?"
        text="Wir bereiten einen Export all deiner Daten vor und senden ihn an deine E-Mail-Adresse."
        confirmLabel="Export anfordern"
        onConfirm={async () => {
          setShowExportSheet(false)
          await fetch('/api/account/export', { method: 'POST' })
          setExportToast(true)
          setTimeout(() => setExportToast(false), 4000)
        }}
        onCancel={() => setShowExportSheet(false)}
      />
      {exportToast && <Toast message="Export wird per E-Mail gesendet ✓" />}

      {/* PWA / Push overlays — always mounted */}
      {showPwaSheet && <PwaBottomSheet onClose={() => setShowPwaSheet(false)} />}
      {showPushBanner && (
        <PushBanner
          onClose={() => setShowPushBanner(false)}
          onGranted={() => setPushPermission('granted')}
        />
      )}

      <BottomNav />
    </div>
  )
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#2C2C2C]/5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-[#2C2C2C]/5 rounded-lg flex items-center justify-center text-[#2C2C2C]/50">
          {icon}
        </div>
        <div className="font-black text-[#2C2C2C]">{title}</div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#2C2C2C]/40 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
