'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mic, MicOff, Camera, Trash2, Plus, ChevronRight, BookOpen, X, Loader2, Play } from 'lucide-react'
import type { GeneratedQuestion } from '@/app/api/angebot-generieren/route'
import type { PriceItem, MengenrabattTier } from '@/lib/types'
import type { EmpfehlungDefault } from '@/lib/empfehlungen-defaults'

interface DraftItem {
  title: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  kategorie?: string
  base_price?: number
  mengenrabatt_tiers?: MengenrabattTier[]
}

type Step = 'input' | 'loading' | 'rückfragen' | 'review'
type Mode = 'voice' | 'photo'

// Gewerk-spezifische Beispielhints
const VOICE_HINTS: Record<string, string[]> = {
  maler: [
    'Wohnzimmer streichen, 40 m² Wände, zweimal Anstrich...',
    'Küche tapezieren, Raufaser drauf und drüber...',
    'Fenster und Türen lackieren, 4 Stück...',
    'Decke abkleben und Anstrich, 18 m²...',
    'Fassade außen, WDVS-System, 120 m²...',
  ],
  fliesenleger: [
    'Bad komplett neu, Boden 8 qm, Wände 20 qm...',
    'Küchenspiegel Fliesen, 3 laufende Meter...',
    'Dusche bodengleich, Abdichtung plus Wandfliesen...',
    'Flur Steinzeugfliesen, 15 m², Altbelag raus...',
  ],
  elektriker: [
    'Wohnung neu verkabeln, 3 Zimmer, neue Unterverteilung...',
    'Steckdosen nachrüsten, 6 Stück, Küche und Bad...',
    'LED-Beleuchtung installieren, 5 Räume...',
    'Wallbox montieren, 11 kW, Zuleitung verlegen...',
  ],
  sanitaer: [
    'Bad komplett sanieren, Dusche und WC neu...',
    'Heizkörper tauschen, 5 Stück, inkl. Entlüftung...',
    'Therme austauschen, Gasanschluss und Inbetriebnahme...',
  ],
  zimmerer: [
    'Dachstuhl reparieren, 2 Sparren tauschen...',
    'Carport aufstellen, 5×3 m, Holzständerbau...',
    'Terrassenboden verlegen, Lärche, 30 m²...',
  ],
}

const DEFAULT_HINTS = [
  'Beim Müller soll ich das Bad fliesen, Boden 6 qm, Wände 12 qm...',
  'Wohnzimmer renovieren, Wände streichen und neuer Boden...',
  'Küche rausreißen und neu aufbauen, Elektro und Sanitär...',
]

export default function NeuesAngebotPage() {
  const visionEnabled = process.env.NEXT_PUBLIC_VISION_ENABLED === 'true'
  const [mode, setMode] = useState<Mode>('voice')
  const [step, setStep] = useState<Step>('input')
  const [recording, setRecording] = useState(false)
  const [micBlocked, setMicBlocked] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [zusammenfassung, setZusammenfassung] = useState('')
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [antworten, setAntworten] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [items, setItems] = useState<DraftItem[]>([])
  const [notes, setNotes] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]
  })
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')
  const [rateLimitMsg, setRateLimitMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [customerSuggestions, setCustomerSuggestions] = useState<{ id: string; name: string; phone: string | null; email: string | null; address?: string | null; source?: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [externalContactId, setExternalContactId] = useState<{ source: string; id: string } | null>(null)
  const [showPricePicker, setShowPricePicker] = useState(false)
  const [priceItems, setPriceItems] = useState<PriceItem[]>([])
  const [priceSearch, setPriceSearch] = useState('')
  const [regionalFaktor, setRegionalFaktor] = useState(0)
  const [mindestauftragswert, setMindestauftragswert] = useState(0)
  const [empfehlungen, setEmpfehlungen] = useState<EmpfehlungDefault[]>([])
  const [suggestionToast, setSuggestionToast] = useState<EmpfehlungDefault | null>(null)
  const [gewerk, setGewerk] = useState('')
  const [briefpapiere, setBriefpapiere] = useState<{ id: string; name: string; ist_standard: boolean }[]>([])
  const [selectedBriefpapier, setSelectedBriefpapier] = useState<string | null>(null)
  const [showBriefpapierPicker, setShowBriefpapierPicker] = useState(false)

  // Starthilfe
  const [showFirstTimeCard, setShowFirstTimeCard] = useState(false)
  const [hintIdx, setHintIdx] = useState(0)
  const [ttsLoading, setTtsLoading] = useState(false)
  const [afterFirstHint, setAfterFirstHint] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Session / Mehrfach-Eingabe
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [eingaben, setEingaben] = useState<{ nr: number; transkript: string; anzahl: number }[]>([])
  const [showEingaben, setShowEingaben] = useState(false)

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // ── On mount: Einstellungen + Starthilfe-Check ──────────────────────────
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: co } = await supabase
        .from('companies')
        .select('id, regionaler_preisfaktor_prozent, angebot_gueltig_tage, mindestauftragswert, gewerke, has_seen_voice_hint')
        .eq('user_id', user.id)
        .single()

      if (co) {
        type CoType = typeof co & { has_seen_voice_hint?: boolean; gewerke?: string[] }
        const c = co as CoType
        const days = c.angebot_gueltig_tage ?? 30
        const d = new Date(); d.setDate(d.getDate() + days)
        setValidUntil(d.toISOString().split('T')[0])
        setRegionalFaktor(c.regionaler_preisfaktor_prozent ?? 0)
        setMindestauftragswert(c.mindestauftragswert ?? 0)
        if (c.gewerke?.[0]) setGewerk(c.gewerke[0].toLowerCase())

        // Starthilfe nur beim allerersten Mal
        if (!c.has_seen_voice_hint) {
          setShowFirstTimeCard(true)
        }

        const { data: empf } = await supabase
          .from('positions_empfehlungen')
          .select('trigger_category, empfehlung_title, empfehlung_unit, empfehlung_unit_price')
          .eq('company_id', co.id)
        setEmpfehlungen(empf ?? [])

        // Briefpapiere laden
        const { data: bps } = await supabase
          .from('briefpapiere')
          .select('id, name, ist_standard')
          .eq('betrieb_id', co.id)
          .order('ist_standard', { ascending: false })
        if (bps && bps.length > 0) {
          setBriefpapiere(bps)
          const std = bps.find((b: { ist_standard: boolean }) => b.ist_standard)
          setSelectedBriefpapier(std?.id ?? bps[0].id)
        }
      }
    }
    init()

    // Hint-Rotation starten
    hintIntervalRef.current = setInterval(() => {
      setHintIdx(i => i + 1)
    }, 4000)
    return () => {
      if (hintIntervalRef.current) clearInterval(hintIntervalRef.current)
    }
  }, [])

  function getHints() {
    for (const [key, hints] of Object.entries(VOICE_HINTS)) {
      if (gewerk.includes(key)) return hints
    }
    return DEFAULT_HINTS
  }

  async function dismissFirstTimeCard() {
    setShowFirstTimeCard(false)
    await supabase.from('companies').update({ has_seen_voice_hint: true }).eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
  }

  async function playTtsDemo() {
    setTtsLoading(true)
    try {
      const res = await fetch('/api/tts-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gewerk }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src) }
      audioRef.current = new Audio(url)
      audioRef.current.play()
    } catch {
      // TTS fehlgeschlagen — einfach ignorieren
    } finally {
      setTtsLoading(false)
    }
  }

  // ── Aufnahme ───────────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setError('')
    setRateLimitMsg('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
        .find(m => MediaRecorder.isTypeSupported(m)) ?? ''
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        // mr.mimeType kann nach stop() leer sein (iOS-Bug) → gespeicherte mimeType nutzen
        const blobType = mimeType || mr.mimeType || 'audio/webm'
        await processAudio(new Blob(chunksRef.current, { type: blobType }))
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
    } catch {
      setMicBlocked(true)
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRef.current?.stop()
    setRecording(false)
  }, [])

  // ── Audio → Whisper → KI ──────────────────────────────────────────────────
  async function processAudio(blob: Blob) {
    setStep('loading')
    setLoadingMsg('Läuft noch...')

    let text = transcript
    if (blob.type !== 'text/plain') {
      setLoadingMsg('Transkribiere Aufnahme...')
      const fd = new FormData()
      const audioExt = blob.type.includes('mp4') || blob.type.includes('m4a') ? 'm4a'
        : blob.type.includes('ogg') ? 'ogg'
        : blob.type.includes('mp3') ? 'mp3'
        : 'webm'
      fd.append('audio', blob, `aufnahme.${audioExt}`)
      const tController = new AbortController()
      const tTimeout = setTimeout(() => tController.abort(), 55000)
      let r: Response
      try {
        r = await fetch('/api/transkribieren', { method: 'POST', body: fd, signal: tController.signal })
      } catch {
        clearTimeout(tTimeout)
        setError('Transkription hat zu lange gedauert — bitte nochmal versuchen.')
        setStep('input')
        return
      }
      clearTimeout(tTimeout)
      const data = await r.json()
      if (!r.ok) {
        if (r.status === 429) { setRateLimitMsg(data.error ?? 'Du bist heute sehr fleißig! 🔨 Kurze Pause — gleich geht\'s weiter.'); setStep('input'); return }
        setError(data.error ?? 'Transkription fehlgeschlagen.')
        setStep('input')
        return
      }
      text = data.text
      setTranscript(text)
    }

    await analyseText(text)
  }

  async function analyseText(text: string) {
    setLoadingMsg('KI analysiert Aufmaß...')
    let r: Response | null = null
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) { setLoadingMsg('Nochmal versuchen...'); await new Promise(res => setTimeout(res, 3000)) }
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 55000)
      try {
        r = await fetch('/api/angebot-generieren', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }), signal: controller.signal })
        clearTimeout(timeout)
        if (r.ok) break
      } catch { clearTimeout(timeout); if (attempt === 1) { setError('Analyse fehlgeschlagen.'); setStep('input'); return } }
    }
    if (!r?.ok) { const d = r ? await r.json().catch(() => ({})) : {}; if (r?.status === 429) { setRateLimitMsg(d.error ?? 'Du bist heute sehr fleißig! 🔨 Kurze Pause — gleich geht\'s weiter.'); setStep('input'); return } setError(d.error ?? 'Analyse fehlgeschlagen.'); setStep('input'); return }

    const result = await r.json()
    const newItems = result.items ?? []

    // Session: bei mehrfacher Eingabe Items ergänzen statt ersetzen
    if (sessionId && items.length > 0) {
      const toAdd = newItems.filter((ni: DraftItem) => !items.some((ex: DraftItem) => ex.title.toLowerCase() === ni.title.toLowerCase()))
      setItems(prev => [...prev, ...toAdd])
      setEingaben(prev => [...prev, { nr: prev.length + 1, transkript: text, anzahl: toAdd.length }])
      setStep('review')

      // Eingabe in DB speichern
      if (sessionId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: co } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
          if (co) {
            await supabase.from('angebot_eingaben').insert({
              angebot_id: sessionId,
              company_id: co.id,
              eingabe_nummer: eingaben.length + 1,
              transkript: text,
              erkannte_positionen: toAdd,
              geraet: 'web',
            })
          }
        }
      }
      return
    }

    setItems(newItems)
    setNotes(result.notizen ?? '')
    setZusammenfassung(result.zusammenfassung ?? '')

    // Erste Eingabe nach Starthilfe
    if (!afterFirstHint) {
      setAfterFirstHint(true)
    }

    const normalizeTyp = (typ: string): GeneratedQuestion['typ'] => {
      const t = (typ ?? '').toLowerCase()
      if (t.includes('ja') || t.includes('bool') || t.includes('yes')) return 'ja_nein'
      if (t.includes('zahl') || t.includes('numb') || t.includes('int') || t.includes('float')) return 'zahl'
      if (t.includes('wahl') || t.includes('select') || t.includes('choice')) return 'auswahl'
      return 'ja_nein'
    }
    const normalized = (result.rückfragen ?? []).map((q: GeneratedQuestion) => ({ ...q, typ: normalizeTyp(q.typ) }))
    if (normalized.length > 0) { setQuestions(normalized); setCurrentQ(0); setCurrentAnswer(''); setStep('rückfragen') }
    else setStep('review')
  }

  // ── Rückfragen ─────────────────────────────────────────────────────────────
  async function handleAnswer(antwort: string) {
    const q = questions[currentQ]
    const neueAntworten = { ...antworten, [q.frage]: antwort }
    setAntworten(neueAntworten)
    setCurrentAnswer('')
    if (currentQ + 1 < questions.length) setCurrentQ(currentQ + 1)
    else await verfeinern(neueAntworten)
  }

  function skipQuestion() {
    const q = questions[currentQ]
    const neueAntworten = { ...antworten, [q.frage]: 'keine Angabe' }
    setAntworten(neueAntworten)
    setCurrentAnswer('')
    if (currentQ + 1 < questions.length) setCurrentQ(currentQ + 1)
    else verfeinern(neueAntworten)
  }

  async function verfeinern(neueAntworten: Record<string, string>) {
    setStep('loading'); setLoadingMsg('Berechne Gesamtkosten...')
    const r = await fetch('/api/angebot-verfeinern', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, antworten: neueAntworten, aufmaß: transcript }) })
    if (!r.ok) { setStep('review'); return }
    const result = await r.json()
    const zusatzItems = (result.items ?? []).filter((ni: DraftItem) => !items.some(ex => ex.title.toLowerCase() === ni.title.toLowerCase()))
    setItems(prev => [...prev, ...zusatzItems])
    if (result.notizen) setNotes(prev => prev ? `${prev}\n${result.notizen}` : result.notizen)
    setStep('review')
  }

  // ── Foto-Analyse ───────────────────────────────────────────────────────────
  async function processPhoto(file: File) {
    setStep('loading'); setLoadingMsg('KI analysiert Foto...')
    const fd = new FormData(); fd.append('image', file)
    const r = await fetch('/api/foto-analyse', { method: 'POST', body: fd })
    if (!r.ok) { setError('Foto-Analyse fehlgeschlagen.'); setStep('input'); return }
    const result = await r.json()
    setTranscript(result.beschreibung ?? 'Foto-Analyse')
    setItems(result.items ?? [])
    if (result.rückfragen?.length > 0) { setQuestions(result.rückfragen); setCurrentQ(0); setCurrentAnswer(''); setStep('rückfragen') }
    else setStep('review')
  }

  // ── Items editieren ────────────────────────────────────────────────────────
  function applyMengenrabatt(basePrice: number, quantity: number, tiers?: MengenrabattTier[]): number {
    if (!tiers || tiers.length === 0 || basePrice === 0) return basePrice
    const applicable = tiers.filter(t => quantity >= t.ab).sort((a, b) => b.ab - a.ab)
    if (!applicable.length) return basePrice
    return Math.round(basePrice * (1 - applicable[0].rabatt_prozent / 100) * 100) / 100
  }

  function updateItem(idx: number, field: keyof DraftItem, value: string | number) {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item
      const updated = { ...item, [field]: (field === 'quantity' || field === 'unit_price') ? Number(value) : value }
      if (field === 'quantity' && item.base_price !== undefined && item.mengenrabatt_tiers) {
        updated.unit_price = applyMengenrabatt(item.base_price, Number(value), item.mengenrabatt_tiers)
      }
      return updated
    }))
  }
  function removeItem(idx: number) { setItems(prev => prev.filter((_, i) => i !== idx)) }
  function addItem() { setItems(prev => [...prev, { title: 'Neue Position', description: '', quantity: 1, unit: 'Stk', unit_price: 0 }]) }

  async function openPricePicker() {
    if (!priceItems.length) {
      const userId = (await supabase.auth.getUser()).data.user?.id ?? ''
      const { data: co } = await supabase.from('companies').select('id, regionaler_preisfaktor_prozent').eq('user_id', userId).single()
      if (co) {
        const { data } = await supabase.from('price_items').select('*').eq('company_id', co.id).order('category').order('title')
        setPriceItems(data ?? [])
        setRegionalFaktor((co as { id: string; regionaler_preisfaktor_prozent?: number }).regionaler_preisfaktor_prozent ?? 0)
      }
    }
    setPriceSearch(''); setShowPricePicker(true)
  }

  function addFromPrice(p: PriceItem) {
    const adjustedPrice = p.unit_price > 0 && regionalFaktor !== 0 ? Math.round(p.unit_price * (1 + regionalFaktor / 100) * 100) / 100 : p.unit_price
    const tiers = p.mengenrabatt ?? undefined
    const initialPrice = applyMengenrabatt(adjustedPrice, 1, tiers)
    setItems(prev => {
      const next = [...prev, { title: p.title, description: p.description ?? '', quantity: 1, unit: p.unit, unit_price: initialPrice, kategorie: p.category, base_price: adjustedPrice, mengenrabatt_tiers: tiers }]
      const alreadyTitles = new Set(next.map(i => i.title))
      const match = empfehlungen.find(e => e.trigger_category === p.category && !alreadyTitles.has(e.empfehlung_title))
      if (match) {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
        setSuggestionToast(match)
        toastTimerRef.current = setTimeout(() => setSuggestionToast(null), 8000)
      }
      return next
    })
    setShowPricePicker(false)
  }

  // ── Speichern (= Session abschließen) ──────────────────────────────────────
  const [limitError, setLimitError] = useState('')

  async function handleSave() {
    setSaving(true); setLimitError('')
    const r = await fetch('/api/quotes/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, notes, customerName, customerEmail, customerPhone, customerAddress, externalContactId, validUntil, briefpapier_id: selectedBriefpapier }) })
    const data = await r.json()
    if (!r.ok) {
      setSaving(false)
      if (data.error === 'limit_reached') setLimitError(data.message)
      else setError(data.error ?? 'Speichern fehlgeschlagen')
      return
    }
    // Eingaben-Session verknüpfen wenn vorhanden
    if (eingaben.length > 0 && data.id) {
      await supabase.from('angebot_eingaben').update({ angebot_id: data.id }).is('angebot_id', null)
    }
    router.push(`/angebot/${data.id}`)
  }

  // Weiteres Einsprehen zu laufender Session
  async function addSessionInput() {
    setStep('input')
    setTranscript('')
  }

  const totalNet = items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const q = questions[currentQ]
  const hints = getHints()
  const currentHint = hints[hintIdx % hints.length]

  // ─────────────────────────────────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col items-center justify-center gap-5 px-5">
        <div className="text-6xl animate-bounce">🔨</div>
        <div className="font-black text-[#2C2C2C] text-xl text-center">{loadingMsg}</div>
        <div className="text-[#2C2C2C]/40 font-semibold text-sm">Einen Moment...</div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RÜCKFRAGEN
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 'rückfragen' && q) {
    const progress = (currentQ / questions.length) * 100
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col">
        <div className="bg-[#2C2C2C] px-5 pt-12 pb-5">
          <div className="text-white/50 text-xs font-semibold mb-3">Frage {currentQ + 1} von {questions.length}</div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#F5C400] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          {zusammenfassung && <div className="mt-3 text-white/40 text-xs font-semibold line-clamp-2">{zusammenfassung}</div>}
        </div>
        <div className="flex-1 flex flex-col px-5 pt-8">
          <div className="font-black text-[#2C2C2C] text-2xl leading-tight mb-8">{q.frage}</div>
          {(q.typ === 'ja_nein' || !['zahl', 'auswahl', 'text'].includes(q.typ)) && (
            <div className="flex flex-col gap-3">
              <button onClick={() => handleAnswer('Ja')} className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5">Ja</button>
              <button onClick={() => handleAnswer('Nein')} className="w-full bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-xl rounded-2xl py-5">Nein</button>
            </div>
          )}
          {q.typ === 'auswahl' && q.optionen && (
            <div className="flex flex-col gap-3">
              {q.optionen.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)} className="w-full bg-white border-2 border-[#2C2C2C]/15 text-[#2C2C2C] font-bold text-lg rounded-2xl py-4 text-left px-5 flex items-center justify-between">
                  {opt}<ChevronRight size={18} color="#2C2C2C" className="opacity-30" />
                </button>
              ))}
            </div>
          )}
          {q.typ === 'zahl' && (
            <div>
              <div className="flex items-center gap-3 bg-white border-2 border-[#2C2C2C] rounded-2xl px-5 py-4 mb-4">
                <input type="number" inputMode="decimal" placeholder={String(q.standard ?? '0')} value={currentAnswer} onChange={e => setCurrentAnswer(e.target.value)} autoFocus className="flex-1 text-3xl font-black text-[#2C2C2C] bg-transparent focus:outline-none w-full" />
                {q.einheit && <span className="text-[#2C2C2C]/40 font-bold text-lg shrink-0">{q.einheit}</span>}
              </div>
              <button onClick={() => handleAnswer(currentAnswer || String(q.standard ?? '0'))} disabled={!currentAnswer && q.standard === undefined} className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 disabled:opacity-40">Weiter</button>
            </div>
          )}
          {q.typ === 'text' && (
            <div>
              <textarea placeholder="Deine Antwort..." value={currentAnswer} onChange={e => setCurrentAnswer(e.target.value)} rows={3} autoFocus className="w-full bg-white border-2 border-[#2C2C2C] rounded-2xl px-5 py-4 text-[#2C2C2C] font-semibold text-lg focus:outline-none resize-none mb-4" />
              <button onClick={() => handleAnswer(currentAnswer)} disabled={!currentAnswer.trim()} className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 disabled:opacity-40">Weiter</button>
            </div>
          )}
          <button onClick={skipQuestion} className="mt-5 text-center text-[#2C2C2C]/30 font-semibold text-sm w-full">Überspringen</button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REVIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 'review') {
    const grouped: Record<string, DraftItem[]> = {}
    items.forEach(item => {
      const cat = item.kategorie ?? 'Sonstiges'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(item)
    })

    const isIncomplete = items.length < 3 || totalNet < 200

    return (
      <div className="min-h-dvh bg-[#F7F7F5] pb-32">
        <div className="bg-[#2C2C2C] px-5 pt-12 pb-5">
          <button onClick={() => setStep('input')} className="text-white/50 text-xs font-semibold">← Neu aufnehmen</button>
          <div className="text-white font-black text-xl mt-1">Angebot prüfen</div>
          {zusammenfassung && <div className="mt-2 text-white/50 text-xs font-semibold line-clamp-2">{zusammenfassung}</div>}

          {/* Eingabe-Protokoll */}
          {eingaben.length > 0 && (
            <button onClick={() => setShowEingaben(v => !v)} className="mt-3 text-[#F5C400] text-xs font-black flex items-center gap-1">
              🎙 {eingaben.length} Spracheingabe{eingaben.length > 1 ? 'n' : ''} · {items.length} Positionen
              <ChevronRight size={13} className={`transition-transform ${showEingaben ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {/* Eingabe-Protokoll aufgeklappt */}
        {showEingaben && eingaben.length > 0 && (
          <div className="px-5 pt-3 flex flex-col gap-2">
            {eingaben.map(e => (
              <div key={e.nr} className="bg-white rounded-2xl p-3 border border-[#2C2C2C]/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">🎙</span>
                  <span className="font-black text-[#2C2C2C] text-xs">Eingabe {e.nr}</span>
                  <span className="text-[#2C2C2C]/40 text-xs font-semibold">· {e.anzahl} Positionen erkannt</span>
                </div>
                <p className="text-xs text-[#2C2C2C]/60 font-semibold line-clamp-2">{e.transkript}</p>
              </div>
            ))}
          </div>
        )}

        <div className="px-5 pt-5 flex flex-col gap-4">
          {/* Kundendaten */}
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="font-black text-[#2C2C2C] mb-3">Kunde</div>
            <div className="relative">
              <input placeholder="Name (optional)" value={customerName}
                onChange={async e => {
                  const val = e.target.value
                  setCustomerName(val)
                  setExternalContactId(null)
                  if (val.trim().length < 2) { setCustomerSuggestions([]); setShowSuggestions(false); return }
                  const userId = (await supabase.auth.getUser()).data.user?.id ?? ''
                  const { data: co } = await supabase.from('companies').select('id').eq('user_id', userId).single()
                  const providers = ['lexoffice', 'sevdesk', 'fastbill', 'billomat', 'papierkram', 'easybill']
                  const [ownResult, ...extResults] = await Promise.all([
                    co ? supabase.from('customers').select('id,name,phone,email,address').eq('company_id', co.id).ilike('name', `${val}%`).limit(5) : Promise.resolve({ data: [] }),
                    ...providers.map(p => fetch(`/api/integrations/${p}/contacts?q=${encodeURIComponent(val)}`).then(r => r.ok ? r.json() : { contacts: [] }).catch(() => ({ contacts: [] }))),
                  ])
                  const own = (ownResult.data ?? []).map((c: { id: string; name: string; phone: string | null; email: string | null; address: string | null }) => ({ ...c, source: 'own' }))
                  const ext = extResults.flatMap((r: { contacts?: { id: string; name: string; phone: string | null; email: string | null; address: string | null; source: string }[] }) => r.contacts ?? []).filter((ec: { name: string }) => !own.some((oc: { name: string }) => oc.name.toLowerCase() === ec.name.toLowerCase()))
                  const merged = [...own, ...ext]
                  setCustomerSuggestions(merged); setShowSuggestions(merged.length > 0)
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className={inputCls}
              />
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border-2 border-[#F5C400] shadow-lg z-50 overflow-hidden">
                  {customerSuggestions.map(c => (
                    <button key={c.id} type="button" onMouseDown={() => { setCustomerName(c.name); setCustomerPhone(c.phone ?? ''); setCustomerEmail(c.email ?? ''); setCustomerAddress(c.address ?? ''); if (c.source && c.source !== 'own') setExternalContactId({ source: c.source, id: c.id }); else setExternalContactId(null); setShowSuggestions(false) }}
                      className="w-full text-left px-4 py-3 border-b border-[#2C2C2C]/5 last:border-0 active:bg-[#F5C400]/10">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2C2C2C] text-sm">{c.name}</span>
                        {c.source && c.source !== 'own' && <span className="text-[10px] font-black bg-[#2C2C2C]/10 text-[#2C2C2C] px-1.5 py-0.5 rounded uppercase">{c.source.slice(0, 2)}</span>}
                      </div>
                      {(c.phone || c.email || c.address) && <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{c.address || c.phone || c.email}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input placeholder="Telefon (optional)" type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className={`${inputCls} mt-3`} />
            <input placeholder="E-Mail (optional)" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={`${inputCls} mt-3`} />
            <input placeholder="Adresse (optional)" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className={`${inputCls} mt-3`} />
          </div>

          {/* Positionen */}
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="font-black text-[#2C2C2C]">Positionen</div>
              <div className="flex gap-2">
                <button onClick={openPricePicker} className="flex items-center gap-1.5 bg-[#2C2C2C]/8 rounded-lg px-2.5 py-1.5">
                  <BookOpen size={14} color="#2C2C2C" strokeWidth={2.5} />
                  <span className="text-xs font-black text-[#2C2C2C]">Preisliste</span>
                </button>
                <button onClick={addItem} className="bg-[#F5C400] rounded-lg p-1.5">
                  <Plus size={18} color="#2C2C2C" strokeWidth={3} />
                </button>
              </div>
            </div>
            {Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat}>
                <div className="px-4 py-1.5 bg-[#F7F7F5] border-t border-[#2C2C2C]/5">
                  <span className="text-xs font-black text-[#2C2C2C]/40 uppercase tracking-wide">{cat}</span>
                </div>
                {catItems.map(item => {
                  const idx = items.indexOf(item)
                  return (
                    <div key={idx} className="border-t border-[#2C2C2C]/5 px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <input value={item.title} onChange={e => updateItem(idx, 'title', e.target.value)} className="w-full font-bold text-[#2C2C2C] bg-transparent focus:outline-none text-sm border-b border-transparent focus:border-[#F5C400] pb-0.5" />
                          <div className="flex gap-2 mt-2 items-center">
                            <input type="number" inputMode="decimal" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} className="w-16 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 focus:outline-none" min={0} step="0.01" />
                            <input value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} className="w-16 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 focus:outline-none" />
                            <div className="flex items-center gap-1 ml-auto">
                              <input type="number" inputMode="decimal" value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', e.target.value)} className="w-20 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 text-right focus:outline-none" min={0} step="0.01" />
                              <span className="text-xs text-[#2C2C2C]/40 font-semibold">€</span>
                            </div>
                          </div>
                          <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5 text-right">= {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')} €</div>
                          {item.base_price !== undefined && item.unit_price < item.base_price && (
                            <div className="text-xs text-green-600 font-bold mt-0.5 text-right">Mengenrabatt: {Math.round((1 - item.unit_price / item.base_price) * 100)} %</div>
                          )}
                        </div>
                        <button onClick={() => removeItem(idx)} className="mt-0.5 p-1 shrink-0">
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Mindestauftragswert */}
          {mindestauftragswert > 0 && totalNet < mindestauftragswert && totalNet > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
              <div className="font-black text-amber-800 text-sm mb-1">Mindestauftragswert nicht erreicht</div>
              <p className="text-xs text-amber-700 font-semibold mb-3">Aktuell {totalNet.toFixed(2).replace('.', ',')} € — Mindest {mindestauftragswert.toFixed(2).replace('.', ',')} €.</p>
              <button type="button" onClick={() => setItems(prev => [...prev, { title: 'Kleinstauftragspauschale', description: 'Mindestauftragspauschale', quantity: 1, unit: 'pauschal', unit_price: Math.round((mindestauftragswert - totalNet) * 100) / 100 }])}
                className="bg-amber-400 text-amber-900 font-black text-xs rounded-xl px-4 py-2">
                + Pauschale hinzufügen
              </button>
            </div>
          )}

          {/* Notizen */}
          <textarea placeholder="Anmerkungen (optional)" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full bg-white border border-[#2C2C2C]/5 rounded-2xl px-4 py-3 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:border-[#F5C400] resize-none" />

          {/* Briefpapier-Auswahl (nur wenn mehrere vorhanden) */}
          {briefpapiere.length > 1 && (
            <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
              <div className="font-black text-[#2C2C2C] mb-2 flex items-center justify-between">
                <span>Briefpapier</span>
                <button onClick={() => setShowBriefpapierPicker(!showBriefpapierPicker)}
                  className="text-xs font-semibold text-[#2C2C2C]/40">ändern</button>
              </div>
              <div className="text-sm font-semibold text-[#2C2C2C]/60">
                {briefpapiere.find(b => b.id === selectedBriefpapier)?.name ?? 'Standard'}
              </div>
              {showBriefpapierPicker && (
                <div className="mt-2 space-y-1.5">
                  {briefpapiere.map(bp => (
                    <button key={bp.id} onClick={() => { setSelectedBriefpapier(bp.id); setShowBriefpapierPicker(false) }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${selectedBriefpapier === bp.id ? 'border-[#F5C400] bg-[#FFF9E6] text-[#2C2C2C]' : 'border-[#2C2C2C]/10 text-[#2C2C2C]/60'}`}>
                      {bp.ist_standard && '⭐ '}{bp.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gültigkeitsdatum */}
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="font-black text-[#2C2C2C] mb-3">Gültig bis</div>
            <div className="flex gap-2 flex-wrap mb-3">
              {[7, 14, 30, 60].map(days => {
                const d = new Date(); d.setDate(d.getDate() + days); const val = d.toISOString().split('T')[0]
                return <button key={days} onClick={() => setValidUntil(val)} className={`px-3 py-1.5 rounded-xl text-sm font-bold ${validUntil === val ? 'bg-[#F5C400] text-[#2C2C2C]' : 'bg-[#F7F7F5] text-[#2C2C2C]/60'}`}>{days} Tage</button>
              })}
            </div>
            <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-2.5 font-semibold focus:outline-none focus:border-[#F5C400]" />
          </div>

          {/* Summe */}
          <div className="bg-[#2C2C2C] rounded-2xl p-4">
            <div className="flex justify-between text-white/50 font-semibold text-sm mb-1">
              <span>Netto</span><span>{totalNet.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="text-white/30 text-xs font-semibold mb-2">+ MwSt. gemäß Einstellungen</div>
            <div className="flex justify-between text-white font-black text-2xl border-t border-white/10 pt-2">
              <span>Netto gesamt</span><span>{totalNet.toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>

          {/* Weitere Eingabe hinzufügen (Session-Konzept) */}
          <button onClick={addSessionInput}
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-[#2C2C2C]/15 text-[#2C2C2C]/70 font-bold text-sm rounded-2xl py-3.5">
            <Mic size={18} strokeWidth={2.5} />
            Weiteres Aufmaß einsprechen
          </button>
        </div>

        {/* Preisdatenbank-Picker */}
        {showPricePicker && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
            <div className="bg-white w-full rounded-t-3xl max-h-[75vh] flex flex-col">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#2C2C2C]/5">
                <div className="font-black text-[#2C2C2C] text-lg">Preisliste</div>
                <button onClick={() => setShowPricePicker(false)} className="p-1.5"><X size={20} color="#2C2C2C" /></button>
              </div>
              <div className="px-4 py-3 border-b border-[#2C2C2C]/5">
                <input placeholder="Suchen..." value={priceSearch} onChange={e => setPriceSearch(e.target.value)} autoFocus className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-2.5 font-semibold text-base focus:outline-none focus:border-[#F5C400]" />
              </div>
              <div className="overflow-y-auto flex-1">
                {priceItems.filter(p => !priceSearch || p.title.toLowerCase().includes(priceSearch.toLowerCase()) || p.category.toLowerCase().includes(priceSearch.toLowerCase())).map(p => (
                  <button key={p.id} onClick={() => addFromPrice(p)} className="w-full text-left px-5 py-3.5 border-b border-[#2C2C2C]/5 last:border-0 active:bg-[#F5C400]/10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0"><div className="font-bold text-[#2C2C2C] text-sm">{p.title}</div><div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{p.category}</div></div>
                      <div className="text-right shrink-0"><div className="font-black text-[#2C2C2C] text-sm">{p.unit_price.toFixed(2).replace('.', ',')} €</div><div className="text-xs text-[#2C2C2C]/40 font-semibold">/ {p.unit}</div></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empfehlungs-Toast */}
        {suggestionToast && (
          <div className="fixed bottom-24 left-4 right-4 z-50">
            <div className="bg-[#2C2C2C] rounded-2xl p-4 shadow-2xl flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[#F5C400] text-xs font-black mb-0.5 uppercase">Auch oft benötigt</div>
                <div className="text-white font-black text-sm">{suggestionToast.empfehlung_title}</div>
                <div className="text-white/40 text-xs font-semibold mt-0.5">
                  {suggestionToast.empfehlung_unit_price > 0 ? `${suggestionToast.empfehlung_unit_price.toFixed(2).replace('.', ',')} € / ${suggestionToast.empfehlung_unit}` : suggestionToast.empfehlung_unit}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => { setItems(prev => [...prev, { title: suggestionToast.empfehlung_title, description: '', quantity: 1, unit: suggestionToast.empfehlung_unit, unit_price: suggestionToast.empfehlung_unit_price }]); if (toastTimerRef.current) clearTimeout(toastTimerRef.current); setSuggestionToast(null) }}
                  className="bg-[#F5C400] text-[#2C2C2C] font-black text-xs px-3 py-2 rounded-xl">+ Hinzufügen</button>
                <button onClick={() => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); setSuggestionToast(null) }} className="text-white/30 font-bold text-xs text-right">Später</button>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#F7F7F5] border-t border-[#2C2C2C]/10">
          {limitError && (
            <div className="mb-3 bg-[#2C2C2C] text-white rounded-2xl p-4">
              <div className="font-black text-sm mb-2">Monatslimit erreicht</div>
              <div className="text-white/70 text-xs font-semibold leading-relaxed mb-3">{limitError}</div>
              <a href="/preise" className="block w-full bg-[#F5C400] text-[#2C2C2C] font-black text-base rounded-xl py-3 text-center">Jetzt auf Pro upgraden →</a>
            </div>
          )}

          {/* Unvollständigkeits-Warnung */}
          {isIncomplete && !limitError && (
            <div className="mb-3 flex items-start gap-2 bg-[#2C2C2C]/5 rounded-2xl px-4 py-3">
              <span className="text-sm mt-0.5">🤔</span>
              <div>
                <div className="font-black text-[#2C2C2C] text-xs">Kurze Prüfung — alles erfasst?</div>
                <div className="text-[#2C2C2C]/50 text-xs font-semibold">Anfahrt, Entsorgung, Abdeckarbeiten?</div>
              </div>
            </div>
          )}

          {!limitError && (
            <button onClick={handleSave} disabled={saving || items.length === 0}
              className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 disabled:opacity-50">
              {saving ? 'Speichere...' : 'Angebot fertigstellen'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INPUT (Sprache / Foto)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col">
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-0">
        <button onClick={() => router.push('/dashboard')} className="text-white/50 text-sm font-semibold">← Dashboard</button>
        <div className="text-white font-black text-xl mt-1 mb-4">Neues Angebot</div>
        <div className="flex">
          <button onClick={() => setMode('voice')} className={`flex-1 py-3 font-black text-sm border-b-2 transition-colors ${mode === 'voice' ? 'border-[#F5C400] text-[#F5C400]' : 'border-transparent text-white/40'}`}>🎙 Sprache</button>
          {visionEnabled && <button onClick={() => setMode('photo')} className={`flex-1 py-3 font-black text-sm border-b-2 transition-colors ${mode === 'photo' ? 'border-[#F5C400] text-[#F5C400]' : 'border-transparent text-white/40'}`}>📷 Foto</button>}
        </div>
      </div>

      {/* ── ERSTE-MAL KARTE ────────────────────────────────────────────────── */}
      {showFirstTimeCard && mode === 'voice' && (
        <div className="mx-5 mt-5 bg-white rounded-2xl p-5 border border-[#2C2C2C]/5 shadow-sm">
          <div className="font-black text-[#2C2C2C] text-lg mb-1">🎙 So funktioniert&apos;s</div>
          <div className="text-[#2C2C2C]/60 font-semibold text-sm mb-4 leading-relaxed">
            Sprich einfach wie du es einem Kollegen erklären würdest:
          </div>
          <div className="bg-[#F7F7F5] rounded-xl px-4 py-3 mb-4">
            <p className="text-[#2C2C2C] font-semibold text-sm leading-relaxed italic">
              &ldquo;Beim Müller soll ich das Bad fliesen, Boden 6 Quadratmeter, Wände 12 Quadratmeter. Alte Fliesen müssen vorher runter. Und ne bodengleiche Dusche.&rdquo;
            </p>
          </div>
          <p className="text-[#2C2C2C]/40 text-xs font-semibold mb-4">Das reicht. Die KI versteht den Rest.</p>
          <div className="flex gap-3">
            <button
              onClick={playTtsDemo}
              disabled={ttsLoading}
              className="flex items-center gap-2 bg-[#2C2C2C]/8 text-[#2C2C2C] font-bold text-sm px-4 py-2.5 rounded-xl disabled:opacity-50"
            >
              {ttsLoading ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} strokeWidth={2.5} />}
              Beispiel anhören
            </button>
            <button onClick={dismissFirstTimeCard}
              className="flex-1 bg-[#F5C400] text-[#2C2C2C] font-black text-sm px-4 py-2.5 rounded-xl">
              Verstanden →
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-8">
        {mode === 'voice' && !micBlocked && (
          <>
            <div className="text-center">
              <div className="font-black text-[#2C2C2C] text-2xl mb-2">Aufmaß einsprechen</div>
              {/* Rotierender Hint-Text */}
              {!showFirstTimeCard && (
                <div className="text-[#2C2C2C]/40 font-semibold text-xs max-w-xs leading-relaxed text-center px-2 min-h-[2.5rem] flex items-center justify-center">
                  &ldquo;{currentHint}&rdquo;
                </div>
              )}
              <div className="text-[#2C2C2C]/25 text-[10px] font-semibold mt-1">Kein perfekter Satz nötig. Einfach drauflos.</div>
            </div>

            <button
              onPointerDown={startRecording}
              onPointerUp={stopRecording}
              onPointerLeave={stopRecording}
              className={`w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all select-none ${recording ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-[#F5C400] active:scale-95'}`}
            >
              {recording ? <MicOff size={52} color="white" strokeWidth={2} /> : <Mic size={52} color="#2C2C2C" strokeWidth={2} />}
            </button>
            <div className="font-bold text-sm text-[#2C2C2C]/50">
              {recording ? '🔴 Läuft — loslassen zum Stoppen' : 'Gedrückt halten und sprechen'}
            </div>

            {/* Nach erster Aufnahme: Hinweis */}
            {afterFirstHint && (
              <div className="bg-[#F5C400]/15 border border-[#F5C400]/30 rounded-2xl px-4 py-3 w-full text-center">
                <p className="text-[#2C2C2C] font-bold text-sm">Gut gemacht. Einfach weitersprechen — nächster Raum, vergessene Position, egal wann.</p>
              </div>
            )}

            <div className="w-full">
              <div className="text-center text-[#2C2C2C]/25 font-bold text-xs mb-3">ODER TEXT EINGEBEN</div>
              <textarea placeholder="Aufmaß tippen..." value={transcript} onChange={e => setTranscript(e.target.value)} rows={4}
                className="w-full bg-white border-2 border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400] resize-none" />
              {transcript.trim() && (
                <button onClick={() => analyseText(transcript)} className="w-full mt-3 bg-[#2C2C2C] text-white font-black text-lg rounded-xl py-4">
                  Angebot generieren
                </button>
              )}
            </div>
          </>
        )}

        {mode === 'voice' && micBlocked && (
          <>
            <div className="text-center">
              <div className="text-4xl mb-3">⌨️</div>
              <div className="font-black text-[#2C2C2C] text-2xl mb-2">Aufmaß eintippen</div>
              <div className="text-[#2C2C2C]/50 font-semibold text-sm max-w-xs leading-relaxed">Mikrofon nicht verfügbar — kein Problem.</div>
            </div>
            <div className="w-full">
              <textarea placeholder="z.B.: Wohnzimmer 30m², Schlafzimmer 20m², alles streichen inkl. Decke..." value={transcript} onChange={e => setTranscript(e.target.value)} rows={6} autoFocus
                className="w-full bg-white border-2 border-[#2C2C2C]/10 rounded-2xl px-4 py-4 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400] resize-none" />
              <button onClick={() => analyseText(transcript)} disabled={!transcript.trim()}
                className="w-full mt-3 bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 disabled:opacity-40">Angebot generieren</button>
              <button onClick={() => setMicBlocked(false)} className="w-full mt-2 text-center text-[#2C2C2C]/30 font-semibold text-sm py-2">Mikrofon nochmal versuchen</button>
            </div>
          </>
        )}

        {mode === 'photo' && (
          <>
            <div className="text-center">
              <div className="font-black text-[#2C2C2C] text-2xl mb-2">Baustelle fotografieren</div>
              <div className="text-[#2C2C2C]/50 font-semibold text-sm max-w-xs">KI erkennt Räume und schlägt Positionen vor.</div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={e => { const file = e.target.files?.[0]; if (!file) return; setPhotoPreview(URL.createObjectURL(file)); processPhoto(file) }} />
            {photoPreview
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photoPreview} alt="" className="w-full rounded-2xl object-cover max-h-64" />
              : <button onClick={() => fileInputRef.current?.click()} className="w-36 h-36 rounded-full bg-[#F5C400] flex items-center justify-center shadow-2xl"><Camera size={52} color="#2C2C2C" strokeWidth={2} /></button>
            }
            <button onClick={() => fileInputRef.current?.click()} className="text-[#2C2C2C]/40 font-bold text-sm">
              {photoPreview ? 'Anderes Foto wählen' : 'Foto aufnehmen oder aus Galerie'}
            </button>
          </>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold w-full text-center">{error}</div>}
        {rateLimitMsg && <div className="bg-[#FFF9E6] border border-[#F5C400]/40 text-[#92400E] rounded-xl px-4 py-3 text-sm font-semibold w-full text-center">{rateLimitMsg}</div>}
      </div>
    </div>
  )
}

const inputCls = "w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
