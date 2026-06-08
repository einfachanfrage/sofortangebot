'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mic, MicOff, Camera, Trash2, Plus, ChevronRight } from 'lucide-react'
import type { GeneratedQuestion } from '@/app/api/angebot-generieren/route'

interface DraftItem {
  title: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  kategorie?: string
}

type Step = 'input' | 'loading' | 'rückfragen' | 'review'
type Mode = 'voice' | 'photo'

export default function NeuesAngebotPage() {
  const visionEnabled = process.env.NEXT_PUBLIC_VISION_ENABLED === 'true'
  const [mode, setMode] = useState<Mode>('voice')
  const [step, setStep] = useState<Step>('input')
  const [recording, setRecording] = useState(false)
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
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // ── Aufnahme ───────────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Wähle den besten unterstützten Format
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
        .find(m => MediaRecorder.isTypeSupported(m)) ?? ''
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
        await processAudio(blob)
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
    } catch {
      setError('Mikrofon-Zugriff verweigert. Bitte Berechtigung erteilen.')
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
      fd.append('audio', blob, 'aufnahme.webm')
      const r = await fetch('/api/transkribieren', { method: 'POST', body: fd })
      const data = await r.json()
      if (!r.ok) { setError(data.error ?? 'Transkription fehlgeschlagen.'); setStep('input'); return }
      text = data.text
      setTranscript(text)
    }

    await analyseText(text)
  }

  async function analyseText(text: string) {
    setLoadingMsg('KI analysiert Aufmaß...')
    const r = await fetch('/api/angebot-generieren', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!r.ok) { const d = await r.json(); setError(d.error ?? 'Analyse fehlgeschlagen.'); setStep('input'); return }

    const result = await r.json()
    setItems(result.items ?? [])
    setNotes(result.notizen ?? '')
    setZusammenfassung(result.zusammenfassung ?? '')

    // Typ normalisieren — Llama gibt manchmal andere Werte zurück als GPT-4o
    const normalizeTyp = (typ: string): GeneratedQuestion['typ'] => {
      const t = (typ ?? '').toLowerCase()
      if (t.includes('ja') || t.includes('bool') || t.includes('yes') || t.includes('nein')) return 'ja_nein'
      if (t.includes('zahl') || t.includes('numb') || t.includes('int') || t.includes('float')) return 'zahl'
      if (t.includes('wahl') || t.includes('select') || t.includes('choice') || t.includes('enum')) return 'auswahl'
      return 'ja_nein' // Fallback: immer Ja/Nein zeigen wenn unklar
    }

    const normalized = (result.rückfragen ?? []).map((q: GeneratedQuestion) => ({
      ...q,
      typ: normalizeTyp(q.typ),
    }))

    if (normalized.length > 0) {
      setQuestions(normalized)
      setCurrentQ(0)
      setCurrentAnswer('')
      setStep('rückfragen')
    } else {
      setStep('review')
    }
  }

  // ── Rückfragen beantworten ─────────────────────────────────────────────────
  async function handleAnswer(antwort: string) {
    const q = questions[currentQ]
    const neueAntworten = { ...antworten, [q.frage]: antwort }
    setAntworten(neueAntworten)
    setCurrentAnswer('')

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1)
    } else {
      // Alle Fragen beantwortet → KI verfeinert das Angebot
      await verfeinern(neueAntworten)
    }
  }

  function skipQuestion() {
    const q = questions[currentQ]
    const neueAntworten = { ...antworten, [q.frage]: 'keine Angabe' }
    setAntworten(neueAntworten)
    setCurrentAnswer('')

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1)
    } else {
      verfeinern(neueAntworten)
    }
  }

  async function verfeinern(neueAntworten: Record<string, string>) {
    setStep('loading')
    setLoadingMsg('Berechne Gesamtkosten...')

    const r = await fetch('/api/angebot-verfeinern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, antworten: neueAntworten, aufmaß: transcript }),
    })
    if (!r.ok) {
      // Bei Fehler trotzdem weiter mit bisherigen Items
      setStep('review')
      return
    }
    const result = await r.json()

    // Neue Items aus Verfeinerung an bestehende anhängen
    const zusatzItems = (result.items ?? []).filter((ni: DraftItem) =>
      !items.some(ex => ex.title.toLowerCase() === ni.title.toLowerCase())
    )
    setItems(prev => [...prev, ...zusatzItems])
    if (result.notizen) setNotes(prev => prev ? `${prev}\n${result.notizen}` : result.notizen)
    setStep('review')
  }

  // ── Foto-Analyse ───────────────────────────────────────────────────────────
  async function processPhoto(file: File) {
    setStep('loading')
    setLoadingMsg('KI analysiert Foto...')
    const fd = new FormData()
    fd.append('image', file)
    const r = await fetch('/api/foto-analyse', { method: 'POST', body: fd })
    if (!r.ok) { setError('Foto-Analyse fehlgeschlagen.'); setStep('input'); return }
    const result = await r.json()
    const text = result.beschreibung ?? 'Foto-Analyse'
    setTranscript(text)
    setItems(result.items ?? [])
    if (result.rückfragen?.length > 0) {
      setQuestions(result.rückfragen)
      setCurrentQ(0)
      setCurrentAnswer('')
      setStep('rückfragen')
    } else {
      setStep('review')
    }
  }

  // ── Items editieren ────────────────────────────────────────────────────────
  function updateItem(idx: number, field: keyof DraftItem, value: string | number) {
    setItems(prev => prev.map((item, i) => i !== idx ? item
      : { ...item, [field]: (field === 'quantity' || field === 'unit_price') ? Number(value) : value }
    ))
  }
  function removeItem(idx: number) { setItems(prev => prev.filter((_, i) => i !== idx)) }
  function addItem() { setItems(prev => [...prev, { title: 'Neue Position', description: '', quantity: 1, unit: 'Stk', unit_price: 0 }]) }

  // ── Speichern ──────────────────────────────────────────────────────────────
  const [limitError, setLimitError] = useState('')

  async function handleSave() {
    setSaving(true)
    setLimitError('')

    const r = await fetch('/api/quotes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, notes, customerName, customerEmail, customerPhone }),
    })

    const data = await r.json()

    if (!r.ok) {
      setSaving(false)
      if (data.error === 'limit_reached') {
        setLimitError(data.message)
      } else {
        setError(data.error ?? 'Speichern fehlgeschlagen')
      }
      return
    }

    router.push(`/angebot/${data.id}`)
  }

  const totalNet = items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const q = questions[currentQ]

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
        {/* Header */}
        <div className="bg-[#2C2C2C] px-5 pt-12 pb-5">
          <div className="text-white/50 text-xs font-semibold mb-3">
            Frage {currentQ + 1} von {questions.length}
          </div>
          {/* Fortschrittsbalken */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F5C400] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {zusammenfassung && (
            <div className="mt-3 text-white/40 text-xs font-semibold line-clamp-2">
              {zusammenfassung}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col px-5 pt-8">
          {/* Frage */}
          <div className="font-black text-[#2C2C2C] text-2xl leading-tight mb-8">
            {q.frage}
          </div>

          {/* Antwort-UI je nach Typ */}
          {(q.typ === 'ja_nein' || !['zahl','auswahl','text'].includes(q.typ)) && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleAnswer('Ja')}
                className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform"
              >
                Ja
              </button>
              <button
                onClick={() => handleAnswer('Nein')}
                className="w-full bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform"
              >
                Nein
              </button>
            </div>
          )}

          {q.typ === 'auswahl' && q.optionen && (
            <div className="flex flex-col gap-3">
              {q.optionen.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="w-full bg-white border-2 border-[#2C2C2C]/15 text-[#2C2C2C] font-bold text-lg rounded-2xl py-4 text-left px-5 active:scale-95 transition-transform flex items-center justify-between"
                >
                  {opt}
                  <ChevronRight size={18} color="#2C2C2C" className="opacity-30" />
                </button>
              ))}
            </div>
          )}

          {q.typ === 'zahl' && (
            <div>
              <div className="flex items-center gap-3 bg-white border-2 border-[#2C2C2C] rounded-2xl px-5 py-4 mb-4">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={String(q.standard ?? '0')}
                  value={currentAnswer}
                  onChange={e => setCurrentAnswer(e.target.value)}
                  autoFocus
                  className="flex-1 text-3xl font-black text-[#2C2C2C] bg-transparent focus:outline-none w-full"
                />
                {q.einheit && (
                  <span className="text-[#2C2C2C]/40 font-bold text-lg shrink-0">{q.einheit}</span>
                )}
              </div>
              <button
                onClick={() => handleAnswer(currentAnswer || String(q.standard ?? '0'))}
                disabled={!currentAnswer && q.standard === undefined}
                className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform disabled:opacity-40"
              >
                Weiter
              </button>
            </div>
          )}

          {q.typ === 'text' && (
            <div>
              <textarea
                placeholder="Deine Antwort..."
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                rows={3}
                autoFocus
                className="w-full bg-white border-2 border-[#2C2C2C] rounded-2xl px-5 py-4 text-[#2C2C2C] font-semibold text-lg focus:outline-none resize-none mb-4"
              />
              <button
                onClick={() => handleAnswer(currentAnswer)}
                disabled={!currentAnswer.trim()}
                className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform disabled:opacity-40"
              >
                Weiter
              </button>
            </div>
          )}

          {/* Überspringen */}
          <button
            onClick={skipQuestion}
            className="mt-5 text-center text-[#2C2C2C]/30 font-semibold text-sm w-full"
          >
            Überspringen
          </button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REVIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 'review') {
    // Items nach Kategorie gruppieren
    const grouped: Record<string, DraftItem[]> = {}
    items.forEach(item => {
      const cat = item.kategorie ?? 'Sonstiges'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(item)
    })

    return (
      <div className="min-h-dvh bg-[#F7F7F5] pb-32">
        <div className="bg-[#2C2C2C] px-5 pt-12 pb-5">
          <button onClick={() => setStep('input')} className="text-white/50 text-xs font-semibold">← Neu aufnehmen</button>
          <div className="text-white font-black text-xl mt-1">Angebot prüfen</div>
          {zusammenfassung && (
            <div className="mt-2 text-white/50 text-xs font-semibold line-clamp-2">{zusammenfassung}</div>
          )}
        </div>

        <div className="px-5 pt-5 flex flex-col gap-4">
          {/* Kundendaten */}
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="font-black text-[#2C2C2C] mb-3">Kunde</div>
            <input placeholder="Name (optional)" value={customerName} onChange={e => setCustomerName(e.target.value)} className={inputCls} />
            <input placeholder="Telefon (optional)" type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className={`${inputCls} mt-3`} />
            <input placeholder="E-Mail (optional)" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={`${inputCls} mt-3`} />
          </div>

          {/* Positionen — nach Kategorie */}
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="font-black text-[#2C2C2C]">Positionen</div>
              <button onClick={addItem} className="bg-[#F5C400] rounded-lg p-1.5">
                <Plus size={18} color="#2C2C2C" strokeWidth={3} />
              </button>
            </div>

            {Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat}>
                <div className="px-4 py-1.5 bg-[#F7F7F5] border-t border-[#2C2C2C]/5">
                  <span className="text-xs font-black text-[#2C2C2C]/40 uppercase tracking-wide">{cat}</span>
                </div>
                {catItems.map((item) => {
                  const idx = items.indexOf(item)
                  return (
                    <div key={idx} className="border-t border-[#2C2C2C]/5 px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <input
                            value={item.title}
                            onChange={e => updateItem(idx, 'title', e.target.value)}
                            className="w-full font-bold text-[#2C2C2C] bg-transparent focus:outline-none text-sm border-b border-transparent focus:border-[#F5C400] pb-0.5"
                          />
                          <div className="flex gap-2 mt-2 items-center">
                            <input type="number" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} className="w-16 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 focus:outline-none" min={0} step="0.01" />
                            <input value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} className="w-16 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 focus:outline-none" />
                            <div className="flex items-center gap-1 ml-auto">
                              <input type="number" value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', e.target.value)} className="w-20 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 text-right focus:outline-none" min={0} step="0.01" />
                              <span className="text-xs text-[#2C2C2C]/40 font-semibold">€</span>
                            </div>
                          </div>
                          <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5 text-right">
                            = {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')} €
                          </div>
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

          {/* Notizen */}
          <textarea
            placeholder="Anmerkungen (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-white border border-[#2C2C2C]/5 rounded-2xl px-4 py-3 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:border-[#F5C400] resize-none"
          />

          {/* Summe */}
          <div className="bg-[#2C2C2C] rounded-2xl p-4">
            <div className="flex justify-between text-white/50 font-semibold text-sm mb-1">
              <span>Netto</span><span>{totalNet.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between text-white font-black text-2xl">
              <span>Gesamt</span><span>{totalNet.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="text-white/30 text-xs font-semibold mt-1">zzgl. MwSt. — wird im PDF ausgewiesen</div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#F7F7F5] border-t border-[#2C2C2C]/10">
          {limitError && (
            <div className="mb-3 bg-[#2C2C2C] text-white rounded-2xl p-4">
              <div className="font-black text-sm mb-2">Monatslimit erreicht</div>
              <div className="text-white/70 text-xs font-semibold leading-relaxed mb-3">{limitError}</div>
              <a href="/preise" className="block w-full bg-[#F5C400] text-[#2C2C2C] font-black text-base rounded-xl py-3 text-center active:scale-95 transition-transform">
                Jetzt auf Pro upgraden →
              </a>
            </div>
          )}
          {!limitError && (
            <button onClick={handleSave} disabled={saving || items.length === 0}
              className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform disabled:opacity-50"
            >
              {saving ? 'Speichere...' : 'Angebot speichern'}
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
          <button onClick={() => setMode('voice')} className={`flex-1 py-3 font-black text-sm border-b-2 transition-colors ${mode === 'voice' ? 'border-[#F5C400] text-[#F5C400]' : 'border-transparent text-white/40'}`}>
            🎙 Sprache
          </button>
          {visionEnabled && (
            <button onClick={() => setMode('photo')} className={`flex-1 py-3 font-black text-sm border-b-2 transition-colors ${mode === 'photo' ? 'border-[#F5C400] text-[#F5C400]' : 'border-transparent text-white/40'}`}>
              📷 Foto
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-8">
        {mode === 'voice' && (
          <>
            <div className="text-center">
              <div className="font-black text-[#2C2C2C] text-2xl mb-2">Aufmaß einsprechen</div>
              <div className="text-[#2C2C2C]/50 font-semibold text-sm max-w-xs leading-relaxed">
                Einfach loslaufen und alles ansprechen was du siehst. Die KI fragt nach was fehlt.
              </div>
            </div>

            <button
              onPointerDown={startRecording}
              onPointerUp={stopRecording}
              onPointerLeave={stopRecording}
              className={`w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all select-none ${
                recording ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-[#F5C400] active:scale-95'
              }`}
            >
              {recording
                ? <MicOff size={52} color="white" strokeWidth={2} />
                : <Mic size={52} color="#2C2C2C" strokeWidth={2} />
              }
            </button>
            <div className="font-bold text-sm text-[#2C2C2C]/50">
              {recording ? '🔴 Läuft — loslassen zum Stoppen' : 'Gedrückt halten und sprechen'}
            </div>

            <div className="w-full">
              <div className="text-center text-[#2C2C2C]/25 font-bold text-xs mb-3">ODER TEXT EINGEBEN</div>
              <textarea
                placeholder="Aufmaß tippen..."
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                rows={4}
                className="w-full bg-white border-2 border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400] resize-none"
              />
              {transcript.trim() && (
                <button
                  onClick={() => analyseText(transcript)}
                  className="w-full mt-3 bg-[#2C2C2C] text-white font-black text-lg rounded-xl py-4 active:scale-95 transition-transform"
                >
                  Angebot generieren
                </button>
              )}
            </div>
          </>
        )}

        {mode === 'photo' && (
          <>
            <div className="text-center">
              <div className="font-black text-[#2C2C2C] text-2xl mb-2">Baustelle fotografieren</div>
              <div className="text-[#2C2C2C]/50 font-semibold text-sm max-w-xs">KI erkennt Räume, Flächen und schlägt Positionen vor.</div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                setPhotoPreview(URL.createObjectURL(file))
                processPhoto(file)
              }}
            />

            {photoPreview
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photoPreview} alt="" className="w-full rounded-2xl object-cover max-h-64" />
              : (
                <button onClick={() => fileInputRef.current?.click()} className="w-36 h-36 rounded-full bg-[#F5C400] flex items-center justify-center shadow-2xl active:scale-95 transition-transform">
                  <Camera size={52} color="#2C2C2C" strokeWidth={2} />
                </button>
              )
            }
            <button onClick={() => fileInputRef.current?.click()} className="text-[#2C2C2C]/40 font-bold text-sm">
              {photoPreview ? 'Anderes Foto wählen' : 'Foto aufnehmen oder aus Galerie'}
            </button>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold w-full text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

const inputCls = "w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
