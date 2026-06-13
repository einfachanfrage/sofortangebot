'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Eye, EyeOff, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface Keys {
  lexoffice_api_key: string
  sevdesk_api_key: string
  fastbill_email: string
  fastbill_api_key: string
  billomat_subdomain: string
  billomat_api_key: string
  papierkram_api_key: string
  easybill_api_key: string
}

const EMPTY: Keys = {
  lexoffice_api_key: '',
  sevdesk_api_key: '',
  fastbill_email: '',
  fastbill_api_key: '',
  billomat_subdomain: '',
  billomat_api_key: '',
  papierkram_api_key: '',
  easybill_api_key: '',
}

const SOFTWARES = [
  {
    id: 'lexoffice',
    name: 'Lexoffice',
    color: '#0066CC',
    short: 'LO',
    fields: [{ key: 'lexoffice_api_key' as keyof Keys, label: 'API-Key', placeholder: 'Deinen Lexoffice API-Key hier einfügen' }],
    steps: [
      'Öffne Lexoffice im Browser: app.lexoffice.de',
      'Klicke oben rechts auf dein Profilbild → „Einstellungen"',
      'Im linken Menü: „Integrationen" → „API-Zugänge"',
      'Klicke auf „Neuen Zugang erstellen"',
      'Kopiere den angezeigten API-Key und füge ihn hier ein',
    ],
  },
  {
    id: 'sevdesk',
    name: 'sevDesk',
    color: '#E84B3C',
    short: 'SD',
    fields: [{ key: 'sevdesk_api_key' as keyof Keys, label: 'API-Token', placeholder: 'Deinen sevDesk API-Token hier einfügen' }],
    steps: [
      'Öffne sevDesk im Browser: my.sevdesk.de',
      'Klicke oben rechts auf dein Profilbild → „Einstellungen"',
      'Im linken Menü: „Benutzer" → deinen Namen anklicken',
      'Scrolle runter bis „API-Token"',
      'Kopiere den Token und füge ihn hier ein',
    ],
  },
  {
    id: 'fastbill',
    name: 'FastBill',
    color: '#FF6B00',
    short: 'FB',
    fields: [
      { key: 'fastbill_email' as keyof Keys, label: 'FastBill E-Mail-Adresse', placeholder: 'deine@email.de' },
      { key: 'fastbill_api_key' as keyof Keys, label: 'API-Key', placeholder: 'Deinen FastBill API-Key hier einfügen' },
    ],
    steps: [
      'Öffne FastBill im Browser: app.fastbill.com',
      'Klicke oben rechts auf dein Profilbild → „Einstellungen"',
      'Gehe zu „Account" → „API-Daten"',
      'Kopiere deinen API-Key',
      'Trage hier deine FastBill E-Mail-Adresse und den API-Key ein',
    ],
  },
  {
    id: 'billomat',
    name: 'Billomat',
    color: '#4CAF50',
    short: 'BM',
    fields: [
      { key: 'billomat_subdomain' as keyof Keys, label: 'Billomat-Subdomain', placeholder: 'z.B. meinbetrieb (aus meinbetrieb.billomat.net)' },
      { key: 'billomat_api_key' as keyof Keys, label: 'API-Key', placeholder: 'Deinen Billomat API-Key hier einfügen' },
    ],
    steps: [
      'Öffne Billomat im Browser: deine-subdomain.billomat.net',
      'Klicke oben rechts auf dein Profilbild → „Einstellungen"',
      'Gehe zu „API" im linken Menü',
      'Kopiere deinen API-Key',
      'Trage hier deine Subdomain (der Teil vor .billomat.net) und den API-Key ein',
    ],
  },
  {
    id: 'papierkram',
    name: 'Papierkram',
    color: '#795548',
    short: 'PK',
    fields: [{ key: 'papierkram_api_key' as keyof Keys, label: 'API-Token', placeholder: 'Deinen Papierkram API-Token hier einfügen' }],
    steps: [
      'Öffne Papierkram im Browser: app.papierkram.de',
      'Klicke oben rechts auf dein Profilbild → „Einstellungen"',
      'Gehe zu „API-Token" im linken Menü',
      'Klicke auf „Token erstellen" falls noch keiner vorhanden',
      'Kopiere den Token und füge ihn hier ein',
    ],
  },
  {
    id: 'easybill',
    name: 'Easybill',
    color: '#009688',
    short: 'EB',
    fields: [{ key: 'easybill_api_key' as keyof Keys, label: 'API-Key', placeholder: 'Deinen Easybill API-Key hier einfügen' }],
    steps: [
      'Öffne Easybill im Browser: app.easybill.de',
      'Klicke oben rechts auf dein Profilbild → „Mein Konto"',
      'Gehe zu „API-Zugangsdaten"',
      'Kopiere deinen API-Key',
      'Füge ihn hier ein',
    ],
  },
]

export default function IntegrationenPage() {
  const [keys, setKeys] = useState<Keys>(EMPTY)
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState<Record<string, 'idle' | 'testing' | 'ok' | 'fehler'>>({})
  const [testMsg, setTestMsg] = useState<Record<string, string>>({})
  const supabase = createClient()

  async function testVerbindung(swId: string, apiKey: string) {
    if (!apiKey.trim()) return
    setTestStatus(prev => ({ ...prev, [swId]: 'testing' }))
    setTestMsg(prev => ({ ...prev, [swId]: '' }))
    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anbieter: swId, apiKey }),
      })
      const data = await res.json()
      if (data.ok) {
        setTestStatus(prev => ({ ...prev, [swId]: 'ok' }))
        setTestMsg(prev => ({ ...prev, [swId]: `✓ Verbindung erfolgreich${data.version ? ` — ${data.version}` : ''}` }))
      } else {
        setTestStatus(prev => ({ ...prev, [swId]: 'fehler' }))
        setTestMsg(prev => ({ ...prev, [swId]: data.fehler ?? 'Verbindung fehlgeschlagen' }))
      }
    } catch {
      setTestStatus(prev => ({ ...prev, [swId]: 'fehler' }))
      setTestMsg(prev => ({ ...prev, [swId]: 'Netzwerkfehler' }))
    }
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('companies').select(
        'lexoffice_api_key,sevdesk_api_key,fastbill_email,fastbill_api_key,billomat_api_key,billomat_subdomain,papierkram_api_key,easybill_api_key'
      ).eq('user_id', user.id).single()
      if (data) {
        setKeys({
          lexoffice_api_key: data.lexoffice_api_key ?? '',
          sevdesk_api_key: data.sevdesk_api_key ?? '',
          fastbill_email: data.fastbill_email ?? '',
          fastbill_api_key: data.fastbill_api_key ?? '',
          billomat_subdomain: data.billomat_subdomain ?? '',
          billomat_api_key: data.billomat_api_key ?? '',
          papierkram_api_key: data.papierkram_api_key ?? '',
          easybill_api_key: data.easybill_api_key ?? '',
        })
      }
    }
    load()
  }, [])

  function isConnected(sw: typeof SOFTWARES[0]) {
    return sw.fields.every(f => keys[f.key].trim().length > 0)
  }

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('companies').update({
      lexoffice_api_key: keys.lexoffice_api_key.trim() || null,
      sevdesk_api_key: keys.sevdesk_api_key.trim() || null,
      fastbill_email: keys.fastbill_email.trim() || null,
      fastbill_api_key: keys.fastbill_api_key.trim() || null,
      billomat_api_key: keys.billomat_api_key.trim() || null,
      billomat_subdomain: keys.billomat_subdomain.trim() || null,
      papierkram_api_key: keys.papierkram_api_key.trim() || null,
      easybill_api_key: keys.easybill_api_key.trim() || null,
    }).eq('user_id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-16">
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6">
        <Link href="/einstellungen" className="text-white/50 text-sm font-semibold">← Einstellungen</Link>
        <div className="text-white font-black text-xl mt-1">Buchhaltung verbinden</div>
        <div className="text-white/40 text-sm font-semibold mt-1">Einmal einrichten — danach per Knopfdruck übertragen</div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-3">

        {SOFTWARES.map(sw => {
          const connected = isConnected(sw)
          const open = expanded === sw.id
          return (
            <div key={sw.id} className={`bg-white rounded-2xl border-2 overflow-hidden transition-colors ${connected ? 'border-green-200' : 'border-[#2C2C2C]/5'}`}>

              {/* Header */}
              <button
                className="w-full flex items-center gap-3 px-4 py-4 text-left"
                onClick={() => setExpanded(open ? null : sw.id)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-white text-sm"
                  style={{ backgroundColor: sw.color }}
                >
                  {sw.short}
                </div>
                <div className="flex-1">
                  <div className="font-black text-[#2C2C2C]">{sw.name}</div>
                  <div className={`text-xs font-bold mt-0.5 ${connected ? 'text-green-600' : 'text-[#2C2C2C]/30'}`}>
                    {connected ? '● Verbunden' : '○ Nicht verbunden'}
                  </div>
                </div>
                {open ? <ChevronUp size={18} color="#2C2C2C" className="opacity-30" /> : <ChevronDown size={18} color="#2C2C2C" className="opacity-30" />}
              </button>

              {/* Expanded content */}
              {open && (
                <div className="px-4 pb-4 border-t border-[#2C2C2C]/5 pt-4">

                  {/* Anleitung */}
                  <div className="bg-[#F7F7F5] rounded-xl p-3 mb-4">
                    <div className="text-xs font-black text-[#2C2C2C]/50 uppercase tracking-wide mb-2">So findest du deinen Key</div>
                    <div className="flex flex-col gap-2">
                      {sw.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-black text-white text-[10px] mt-0.5"
                            style={{ backgroundColor: sw.color }}
                          >
                            {i + 1}
                          </div>
                          <span className="text-xs font-semibold text-[#2C2C2C]/70 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Eingabefelder */}
                  <div className="flex flex-col gap-3">
                    {sw.fields.map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-bold text-[#2C2C2C]/50 mb-1.5 uppercase tracking-wide">{field.label}</label>

                        <div className="relative">
                          <input
                            type={showKey[field.key] ? 'text' : 'password'}
                            value={keys[field.key]}
                            onChange={e => setKeys(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:border-[#F5C400] pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowKey(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                          >
                            {showKey[field.key]
                              ? <EyeOff size={15} color="#2C2C2C" className="opacity-30" />
                              : <Eye size={15} color="#2C2C2C" className="opacity-30" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    {(sw.id === 'lexoffice' || sw.id === 'sevdesk') && isConnected(sw) && (
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => testVerbindung(sw.id, keys[sw.fields[0].key])}
                          disabled={testStatus[sw.id] === 'testing'}
                          className="text-xs font-bold text-[#2C2C2C]/50 bg-[#F7F7F5] rounded-xl px-3 py-2 disabled:opacity-50"
                        >
                          {testStatus[sw.id] === 'testing' ? 'Teste...' : 'Verbindung testen'}
                        </button>
                        {testMsg[sw.id] && (
                          <p className={`mt-2 text-xs font-semibold ${testStatus[sw.id] === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
                            {testMsg[sw.id]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {saved ? <><Check size={20} strokeWidth={3} /> Gespeichert</> : saving ? 'Speichere...' : 'Speichern'}
        </button>
      </div>
    </div>
  )
}
