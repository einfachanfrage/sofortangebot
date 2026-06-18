'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mic, MicOff, Camera, Trash2, Plus, ChevronRight, BookOpen, X, Loader2, Play } from 'lucide-react'
import type { GeneratedQuestion } from '@/app/api/angebot-generieren/route'
import type { PriceItem, MengenrabattTier } from '@/lib/types'
import type { EmpfehlungDefault } from '@/lib/empfehlungen-defaults'
import type { ExtraktionResponse } from '@/app/api/angebot-extrahieren/route'
import type { BerechnetePosition, Konfidenz } from '@/lib/mengen/types'
import KalkulationsBewertungCard from '@/components/KalkulationsBewertungCard'
import AufnahmeHinweisSheet, { getHinweisCount, incrementHinweisCount } from '@/components/AufnahmeHinweisSheet'
import { matchePositionen } from '@/lib/ki-flow'
import RueckfragenScreen from '@/components/aufnahme/RueckfragenScreen'
import { generiereRueckfragen } from '@/lib/mengen/rueckfragen-generator'
import type { RueckfrageItem } from '@/lib/mengen/rueckfragen-generator'
import { verarbeiteAntworten } from '@/lib/mengen/antworten-verarbeiter'
import { berechneMengen } from '@/lib/mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '@/lib/mengen/vollstaendigkeits-check'
import { analysiereKontext } from '@/lib/kontext-analyzer'
import { starteStilleErkennung } from '@/lib/stille-erkennung'
import type { StilleErkennung } from '@/lib/stille-erkennung'
import type { KIRueckfrageRaw } from '@/lib/kontext-analyzer'
import { validiereAngebot } from '@/lib/angebot-validierung'
import type { ValidationResult } from '@/lib/angebot-validierung'
import type { KIRueckfrage } from '@/lib/mengen/types'

interface DraftItem {
  title: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  kategorie?: string
  base_price?: number
  mengenrabatt_tiers?: MengenrabattTier[]
  konfidenz?: Konfidenz
  berechnungsweg?: string
  annahmen?: string[]
  kontext_genutzt?: boolean
  aus_woerterbuch?: boolean
  position_id?: string | null
  manuell_geaendert?: boolean
  implizit_erkannt?: boolean
}

type Step = 'input' | 'loading' | 'vage_rueckfragen' | 'mengen_rueckfragen' | 'rückfragen' | 'review'
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
  const [transcriptOriginal, setTranscriptOriginal] = useState('')
  const [hatNormalisierung, setHatNormalisierung] = useState(false)
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
  // Vage-Rückfragen (neues Dialog-System)
  const [vageRueckfragen, setVageRueckfragen] = useState<RueckfrageItem[]>([])

  // Mengen-Engine State
  const [mengenRueckfragen, setMengenRueckfragen] = useState<string[]>([])
  const [mengenAntworten, setMengenAntworten] = useState<Record<number, string>>({})
  const [berechnetePositionen, setBerechnetePositionen] = useState<BerechnetePosition[]>([])
  const [mengenWarnungen, setMengenWarnungen] = useState<string[]>([])
  const [extraktionCache, setExtraktionCache] = useState<ExtraktionResponse | null>(null)
  const [kalkulationsBewertung, setKalkulationsBewertung] = useState<import('@/lib/mengen/types').KalkulationsBewertung | null>(null)
  const [validierung, setValidierung] = useState<ValidationResult | null>(null)
  const [kiAnnahmen, setKiAnnahmen] = useState<string[]>([])
  const [implizitPositionen, setImplizitPositionen] = useState<string[]>([])
  const [implizitFlags, setImplizitFlags] = useState<Record<string, unknown>>({})
  const [korrekturnAnzahl, setKorrekturenAnzahl] = useState(0)
  const [annahmenOffen, setAnnahmenOffen] = useState(false)
  const [briefpapiere, setBriefpapiere] = useState<{ id: string; name: string; ist_standard: boolean }[]>([])
  const [selectedBriefpapier, setSelectedBriefpapier] = useState<string | null>(null)
  const [showBriefpapierPicker, setShowBriefpapierPicker] = useState(false)

  // Starthilfe (alt)
  const [showFirstTimeCard, setShowFirstTimeCard] = useState(false)
  const [hintIdx, setHintIdx] = useState(0)
  const [ttsLoading, setTtsLoading] = useState(false)
  const [afterFirstHint, setAfterFirstHint] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Aufnahme-Hinweis Bottom Sheet
  const [hinweisOffen, setHinweisOffen] = useState(false)
  const [hinweisSchliessbar, setHinweisSchliessbar] = useState(false)
  const [tooltipSichtbar, setTooltipSichtbar] = useState(false)

  // Session / Mehrfach-Eingabe
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [eingaben, setEingaben] = useState<{ nr: number; transkript: string; anzahl: number }[]>([])
  const [showEingaben, setShowEingaben] = useState(false)

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const stilleRef = useRef<StilleErkennung | null>(null)
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

        // Starthilfe nur beim allerersten Mal (altes System)
        if (!c.has_seen_voice_hint) {
          setShowFirstTimeCard(true)
        }

        // Neues Aufnahme-Hinweis-System (localStorage-basiert)
        const count = getHinweisCount()
        if (count < 3) {
          setHinweisOffen(true)
          incrementHinweisCount()
          if (count === 0) {
            // Erste 2 Sekunden nicht schließbar
            setTimeout(() => setHinweisSchliessbar(true), 2000)
          } else {
            // 2. und 3. Mal: sofort schließbar, nach 1 Sek. automatisch schließen
            setHinweisSchliessbar(true)
            setTimeout(() => setHinweisOffen(false), 1000)
          }
        }

        // ⓘ Tooltip einmalig anzeigen (wenn Nutzer es noch nie gesehen)
        const tooltipSeen = localStorage.getItem('aufnahme_tooltip_seen')
        if (!tooltipSeen) {
          setTooltipSichtbar(true)
          setTimeout(() => {
            setTooltipSichtbar(false)
            localStorage.setItem('aufnahme_tooltip_seen', '1')
          }, 3000)
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,       // ideal für Whisper
          channelCount: 1,         // Mono spart Daten
          echoCancellation: true,  // Halleffekte in leeren Räumen
          noiseSuppression: true,  // Baustellenlärm reduzieren
          autoGainControl: true,   // variierender Mikrofonabstand
        }
      })
      // Priorität: opus (bestes Sprach-Format) → mp4 (iOS) → Fallback
      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/mp4;codecs=mp4a',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
      ].find(m => MediaRecorder.isTypeSupported(m)) ?? ''
      const mr = new MediaRecorder(stream, mimeType ? { mimeType, audioBitsPerSecond: 128000 } : {})
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
      // Stille-Erkennung: nach 2s Stille automatisch stoppen
      stilleRef.current = starteStilleErkennung(stream, () => {
        if (mediaRef.current?.state === 'recording') {
          mediaRef.current.stop()
          setRecording(false)
        }
      })
    } catch {
      setMicBlocked(true)
    }
  }, [])

  const stopRecording = useCallback(() => {
    stilleRef.current?.stop()
    stilleRef.current = null
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
      if (data.text_original && data.text_original !== data.text) {
        setTranscriptOriginal(data.text_original)
        setHatNormalisierung(true)
      }
    }

    await analyseText(text)
  }

  async function analyseText(text: string) {
    setLoadingMsg('Positionen analysiert...')
    if (!afterFirstHint) setAfterFirstHint(true)

    // Bug 1: Expliziter State-Reset — kein alter Kontext darf übernommen werden
    setExtraktionCache(null)
    setVageRueckfragen([])
    setBerechnetePositionen([])
    setMengenWarnungen([])
    setImplizitPositionen([])
    setImplizitFlags({})
    setKorrekturenAnzahl(0)
    setKiAnnahmen([])
    setValidierung(null)
    setGewerk('')

    // ── Schritt 1: Extraktion + lokale Mengenberechnung ──────────────────────
    let extRes: ExtraktionResponse | null = null
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 55000)
      const r = await fetch('/api/angebot-extrahieren', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (r.ok) {
        extRes = await r.json() as ExtraktionResponse
      } else {
        const d = await r.json().catch(() => ({})) as { error?: string }
        if (r.status === 429) { setRateLimitMsg(d.error ?? 'Kurze Pause — gleich geht\'s weiter.'); setStep('input'); return }
        // Extraktion fehlgeschlagen → Fallback auf alten Flow
      }
    } catch { /* Fallback auf alten Flow */ }

    if (extRes) {
      // Kontext-Analyse: Auto-Anreicherung + kontextbezogene Rückfragen ergänzen
      // Immer anwenden — nicht nur wenn hinweise.length > 0 (Rückfragen kämen sonst nie an)
      const { extraktion_angereichert } = analysiereKontext(extRes.extraktion)
      extRes = { ...extRes, extraktion: extraktion_angereichert }

      setExtraktionCache(extRes)
      if (extRes.bewertung) setKalkulationsBewertung(extRes.bewertung)

      // Annahmen aus KI-Extraktion speichern
      const kiAnnahmenListe = (extRes.extraktion.annahmen ?? []).filter(a => !a.startsWith('Automatisch erkannt:'))
      if (kiAnnahmenListe.length > 0) setKiAnnahmen(kiAnnahmenListe)

      // Implizit-Ergebnisse speichern
      if (extRes.implizit_positionen?.length > 0) setImplizitPositionen(extRes.implizit_positionen)
      if (extRes.implizit_flags && Object.keys(extRes.implizit_flags).length > 0) setImplizitFlags(extRes.implizit_flags)
      if (extRes.korrekturen_erkannt > 0) setKorrekturenAnzahl(extRes.korrekturen_erkannt)

      // Rückfragen zusammenführen: KI (mit Priorität) + lokale Vage-Erkennung
      // Max 3, sortiert nach Priorität
      const kiRueckfragen = (extRes.extraktion.rueckfragen ?? []) as KIRueckfrage[]
      const lokal = generiereRueckfragen(extRes.extraktion)

      // KI-Rückfragen in lokales Format konvertieren
      const SCHNELL_FENSTER: import('@/lib/mengen/rueckfragen-generator').SchnellAntwort[] = [
        { label: 'Standard 1,20×1,00 m', wert: [1.2, 1.0], einheit: 'm' },
        { label: '0,60×0,80 m', wert: [0.6, 0.8], einheit: 'm' },
        { label: '1,00×1,00 m', wert: [1.0, 1.0], einheit: 'm' },
        { label: '1,50×1,20 m', wert: [1.5, 1.2], einheit: 'm' },
      ]
      const SCHNELL_TUER: import('@/lib/mengen/rueckfragen-generator').SchnellAntwort[] = [
        { label: 'Standard 0,90×2,10 m', wert: [0.9, 2.1], einheit: 'm' },
        { label: '0,80×2,00 m', wert: [0.8, 2.0], einheit: 'm' },
        { label: '1,00×2,10 m', wert: [1.0, 2.1], einheit: 'm' },
      ]

      const kiAlsLokal: Array<RueckfrageItem & { _prioritaet: number }> = kiRueckfragen.filter(r => r.frage != null).map(r => {
        const frageText = r.frage.toLowerCase()
        const istFenster = frageText.includes('fenster')
        const istTuer = frageText.includes('tür') || frageText.includes('tuer')
        const istMasse = istFenster || istTuer || r.typ === 'masse_einzel'

        const typ: RueckfrageItem['typ'] = istMasse ? 'masse_einzel'
          : r.typ === 'meter' ? 'anzahl'
          : r.typ as RueckfrageItem['typ']

        const basisSchnell = (r.schnell_antworten ?? [])
          .filter(a => a.wert !== null && typeof a.wert === 'number')
          .map(a => ({ label: a.label, wert: a.wert as number, einheit: r.typ === 'hoehe' || r.typ === 'meter' ? 'm' : 'Stk' }))

        const schnell_antworten = basisSchnell.length > 0 ? basisSchnell
          : istFenster ? SCHNELL_FENSTER
          : istTuer ? SCHNELL_TUER
          : []

        return {
          id: r.id,
          frage: r.frage,
          kontext: r.betrifft,
          typ,
          schnell_antworten,
          einheit: r.typ === 'hoehe' || r.typ === 'meter' ? 'm' : undefined,
          _prioritaet: r.prioritaet,
        }
      })

      // Alle zusammenführen, deduplizieren nach id, nach Priorität sortieren, max 3
      const alleRueckfragen = [
        ...kiAlsLokal,
        ...lokal.filter(l => !kiAlsLokal.some(k => k.id === l.id)),
      ]
        .sort((a, b) => ((a as RueckfrageItem & { _prioritaet?: number })._prioritaet ?? 99) - ((b as RueckfrageItem & { _prioritaet?: number })._prioritaet ?? 99))
        .slice(0, 3)

      if (alleRueckfragen.length > 0) {
        setVageRueckfragen(alleRueckfragen)
        setStep('vage_rueckfragen')
        return
      }

      await weiterMitMengen(text, extRes)
      return
    }

    // ── Fallback: alter Flow ohne Mengen-Engine ───────────────────────────────
    await analyseTextFallback(text)
  }

  // Mengen-Berechnung nach Extraktion (mit optionalen Vage-Antworten)
  async function weiterMitMengen(
    text: string,
    extRes: ExtraktionResponse,
    vageAntworten?: Record<string, { wert: number | number[]; einheit: string }>
  ) {
    let mengen = extRes.mengen

    if (vageAntworten && Object.keys(vageAntworten).length > 0) {
      // Extraktion mit Nutzer-Antworten anreichern und Mengen neu berechnen
      setLoadingMsg('Mengen werden berechnet...')
      const angereichert = verarbeiteAntworten(
        extRes.extraktion as Parameters<typeof verarbeiteAntworten>[0],
        vageAntworten
      )
      const mengenRoh = berechneMengen(angereichert.gewerk, angereichert)
      const { positionen } = pruefeUndErgaenzeVollstaendigkeit(angereichert.gewerk, mengenRoh.positionen, text)
      mengen = { ...mengenRoh, positionen }
    }

    await generiereAngebot(text, mengen.positionen)
  }

  // Handler: Vage-Rückfragen beantwortet
  async function handleVageRueckfragenFertig(
    antworten: Record<string, { wert: number | number[]; einheit: string }>
  ) {
    setStep('loading')
    setLoadingMsg('Mengen werden berechnet...')
    if (extraktionCache) {
      await weiterMitMengen(transcript, extraktionCache, antworten)
    } else {
      await analyseTextFallback(transcript)
    }
  }

  // Handler: Vage-Rückfragen übersprungen
  async function handleVageUeberspringen() {
    setStep('loading')
    setLoadingMsg('Positionen analysiert...')
    if (extraktionCache) {
      await weiterMitMengen(transcript, extraktionCache)
    } else {
      await analyseTextFallback(transcript)
    }
  }

  async function generiereAngebot(text: string, positionen: BerechnetePosition[]) {
    setLoadingMsg('Preise zuordnen...')

    // Session-Modus: Items ergänzen statt ersetzen
    if (sessionId && items.length > 0) {
      const newItems = positionen.map(p => ({
        title: p.beschreibung,
        description: (p.annahmen ?? []).join(', '),
        quantity: p.menge,
        unit: p.einheit,
        unit_price: 0,
        konfidenz: p.konfidenz,
        berechnungsweg: p.berechnungsweg,
        annahmen: p.annahmen,
      }))
      const toAdd = newItems.filter(ni => !items.some(ex => (ex.title ?? '').toLowerCase() === (ni.title ?? '').toLowerCase()))
      setItems(prev => [...prev, ...toAdd])
      setEingaben(prev => [...prev, { nr: prev.length + 1, transkript: text, anzahl: toAdd.length }])
      setStep('review')
      return
    }

    // Kontextuelles Matching parallel zur GPT-Generierung starten
    const extraktion = extraktionCache?.extraktion
    const matchingPromise = extraktion && positionen.length > 0
      ? matchePositionen(positionen, extraktion).catch(() => null)
      : Promise.resolve(null)

    let r: Response | null = null
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) { setLoadingMsg('Nochmal versuchen...'); await new Promise(res => setTimeout(res, 3000)) }
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 55000)
      try {
        r = await fetch('/api/angebot-generieren', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, berechnete_positionen: positionen }),
          signal: controller.signal,
        })
        clearTimeout(timeout)
        if (r.ok) break
      } catch { clearTimeout(timeout); if (attempt === 1) { setError('Analyse fehlgeschlagen.'); setStep('input'); return } }
    }
    if (!r?.ok) {
      const d = r ? await r.json().catch(() => ({})) as { error?: string } : {}
      if (r?.status === 429) { setRateLimitMsg(d.error ?? 'Kurze Pause — gleich geht\'s weiter.'); setStep('input'); return }
      setError(d.error ?? 'Analyse fehlgeschlagen.')
      setStep('input')
      return
    }

    const [result, matchingErgebnis] = await Promise.all([r.json(), matchingPromise])


    // Konfidenz + Matching aus Engine in Items mergen
    const engineByTitle = new Map(positionen.filter(p => p.beschreibung != null).map(p => [p.beschreibung.toLowerCase(), p]))
    const matchByTitle = matchingErgebnis
      ? new Map(matchingErgebnis.map((m, i) => [positionen[i]?.beschreibung?.toLowerCase() ?? '', m]))
      : new Map()

    const enrichedItems: DraftItem[] = (result.items ?? []).map((item: DraftItem) => {
      const eng = engineByTitle.get(item.title?.toLowerCase() ?? '')
      const match = matchByTitle.get(item.title?.toLowerCase() ?? '')
      const base = eng
        ? { ...item, konfidenz: eng.konfidenz, berechnungsweg: eng.berechnungsweg, annahmen: eng.annahmen }
        : item
      if (match && match.position_id && match.confidence >= 0.65 && match.unit_price_db) {
        return {
          ...base,
          unit_price: match.unit_price_db,
          position_id: match.position_id,
          kontext_genutzt: match.kontext_genutzt,
          aus_woerterbuch: match.aus_woerterbuch ?? false,
        }
      }
      return base
    })

    // Validierung: Wandfläche < Bodenfläche, Menge 0, etc.
    setLoadingMsg('Angebot prüfen...')
    const val = validiereAngebot(enrichedItems)
    setValidierung(val)

    setItems(enrichedItems)
    setNotes(result.notizen ?? '')
    setZusammenfassung(result.zusammenfassung ?? '')
    setBerechnetePositionen(positionen)
    setMengenWarnungen(extraktionCache?.mengen.warnungen ?? [])

    const normalizeTyp = (typ: string): GeneratedQuestion['typ'] => {
      const t = (typ ?? '').toLowerCase()
      if (t.includes('ja') || t.includes('bool') || t.includes('yes')) return 'ja_nein'
      if (t.includes('zahl') || t.includes('numb') || t.includes('int') || t.includes('float')) return 'zahl'
      if (t.includes('wahl') || t.includes('select') || t.includes('choice')) return 'auswahl'
      return 'ja_nein'
    }
    setStep('review')
  }

  async function analyseTextFallback(text: string) {
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
    if (!r?.ok) { const d = r ? await r.json().catch(() => ({})) as { error?: string } : {}; if (r?.status === 429) { setRateLimitMsg(d.error ?? 'Kurze Pause — gleich geht\'s weiter.'); setStep('input'); return } setError(d.error ?? 'Analyse fehlgeschlagen.'); setStep('input'); return }

    const result = await r.json()
    const newItems: DraftItem[] = result.items ?? []

    if (sessionId && items.length > 0) {
      const toAdd = newItems.filter(ni => !items.some(ex => (ex.title ?? '').toLowerCase() === (ni.title ?? '').toLowerCase()))
      setItems(prev => [...prev, ...toAdd])
      setEingaben(prev => [...prev, { nr: prev.length + 1, transkript: text, anzahl: toAdd.length }])
      setStep('review')
      return
    }

    setItems(newItems)
    setNotes(result.notizen ?? '')
    setZusammenfassung(result.zusammenfassung ?? '')

    const normalizeTyp = (typ: string): GeneratedQuestion['typ'] => {
      const t = (typ ?? '').toLowerCase()
      if (t.includes('ja') || t.includes('bool') || t.includes('yes')) return 'ja_nein'
      if (t.includes('zahl') || t.includes('numb') || t.includes('int') || t.includes('float')) return 'zahl'
      if (t.includes('wahl') || t.includes('select') || t.includes('choice')) return 'auswahl'
      return 'ja_nein'
    }
    setStep('review')
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
    const zusatzItems = (result.items ?? []).filter((ni: DraftItem) => !items.some(ex => (ex.title ?? '').toLowerCase() === (ni.title ?? '').toLowerCase()))
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
      // Preisänderung an gematchter Position → Learning-Bestätigung ausschließen
      if (field === 'unit_price' && item.position_id && Number(value) !== item.unit_price) {
        updated.manuell_geaendert = true
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
    setSaving(true); setLimitError(''); setError('')
    try {
      const r = await fetch('/api/quotes/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, notes, customerName, customerEmail, customerPhone, customerAddress, externalContactId, validUntil, briefpapier_id: selectedBriefpapier }) })
      const data = await r.json()
      if (!r.ok) {
        if (data.error === 'limit_reached') setLimitError(data.message)
        else setError(data.error ?? 'Speichern fehlgeschlagen')
        return
      }
      if (!data.id) {
        setError('Kein Angebot zurückgegeben. Nochmal versuchen.')
        return
      }
      // Eingaben-Session verknüpfen wenn vorhanden
      if (eingaben.length > 0) {
        await supabase.from('angebot_eingaben').update({ angebot_id: data.id }).is('angebot_id', null)
      }
      // Lernmatch für alle gematchten Positionen bestätigen (fire-and-forget)
      const gewerk = extraktionCache?.extraktion?.gewerk ?? ''
      const lernEintraege = items
        .filter(it => it.position_id && !it.manuell_geaendert)
        .map(it => ({ beschreibung_original: it.title, position_id: it.position_id!, gewerk_id: gewerk }))
      if (lernEintraege.length > 0) {
        fetch('/api/ki/lernend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eintraege: lernEintraege }) }).catch(() => {})
      }
      router.push(`/angebot/${data.id}`)
    } catch {
      setError('Verbindungsfehler. Bitte nochmal versuchen.')
    } finally {
      setSaving(false)
    }
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
    const SCHRITT_EMOJI: Record<string, string> = {
      'Aufnahme': '🎙',
      'Transkri': '🎙',
      'Positionen': '🔍',
      'analysiert': '🔍',
      'Rückfrage': '❓',
      'Mengen': '📐',
      'Preise': '💰',
      'zugeordnet': '💰',
      'Angebot prüfen': '✅',
      'Nochmal': '🔄',
    }
    const emoji = Object.entries(SCHRITT_EMOJI).find(([k]) => loadingMsg.includes(k))?.[1] ?? '🔨'

    const SCHRITTE = [
      { schluessel: ['Aufnahme', 'Transkri'], label: 'Aufnahme verarbeiten' },
      { schluessel: ['Positionen', 'analysiert', 'Aufmaß'], label: 'Positionen erkennen' },
      { schluessel: ['Mengen'], label: 'Mengen berechnen' },
      { schluessel: ['Preise', 'zugeordnet'], label: 'Preise zuordnen' },
      { schluessel: ['Angebot prüfen'], label: 'Angebot prüfen' },
    ]
    const aktuellerSchritt = SCHRITTE.findIndex(s => s.schluessel.some(k => loadingMsg.includes(k)))

    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col items-center justify-center gap-5 px-5">
        <div className="text-6xl animate-bounce">{emoji}</div>
        <div className="font-black text-[#2C2C2C] text-xl text-center">{loadingMsg}</div>
        {aktuellerSchritt >= 0 && (
          <div className="flex gap-1.5 mt-1">
            {SCHRITTE.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                i < aktuellerSchritt ? 'w-6 bg-[#F5C400]' :
                i === aktuellerSchritt ? 'w-8 bg-[#2C2C2C]' :
                'w-4 bg-[#2C2C2C]/15'
              }`} />
            ))}
          </div>
        )}
        <div className="text-[#2C2C2C]/40 font-semibold text-sm">Einen Moment...</div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VAGE-RÜCKFRAGEN (neues Dialog-System für unklare Mengenangaben)
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 'vage_rueckfragen' && vageRueckfragen.length > 0) {
    return (
      <RueckfragenScreen
        fragen={vageRueckfragen}
        onFertig={handleVageRueckfragenFertig}
        onUeberspringen={handleVageUeberspringen}
      />
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

          {/* Annahmen-Übersicht */}
          {kiAnnahmen.length > 0 && (
            <button
              onClick={() => setAnnahmenOffen(v => !v)}
              className="mt-3 text-white/50 text-xs font-semibold flex items-center gap-1 hover:text-white/70 transition-colors"
            >
              ⓘ {kiAnnahmen.length} Annahme{kiAnnahmen.length > 1 ? 'n' : ''} getroffen
              <ChevronRight size={12} className={`transition-transform ${annahmenOffen ? 'rotate-90' : ''}`} />
            </button>
          )}
          {annahmenOffen && kiAnnahmen.length > 0 && (
            <div className="mt-2 bg-white/10 rounded-xl px-3 py-2 flex flex-col gap-1">
              {kiAnnahmen.map((a, i) => (
                <div key={i} className="text-white/60 text-xs font-semibold">· {a}</div>
              ))}
            </div>
          )}

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

        {/* Validierungsfehler */}
        {validierung && validierung.fehler.length > 0 && (
          <div className="mx-5 mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-col gap-1">
            <div className="font-black text-red-700 text-sm flex items-center gap-1.5">⚠️ Bitte prüfen</div>
            {validierung.fehler.map((f, i) => (
              <div key={i} className="text-red-600 text-xs font-semibold">{f.nachricht}</div>
            ))}
          </div>
        )}
        {validierung && validierung.fehler.length === 0 && validierung.warnungen.length > 0 && (
          <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex flex-col gap-1">
            <div className="font-black text-amber-700 text-sm flex items-center gap-1.5">💡 Hinweise</div>
            {validierung.warnungen.map((w, i) => (
              <div key={i} className="text-amber-600 text-xs font-semibold">{w}</div>
            ))}
          </div>
        )}

        {/* Korrektur-Banner */}
        {korrekturnAnzahl > 0 && (
          <div className="mx-5 mt-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3">
            <div className="font-black text-blue-700 text-sm">
              ⓘ {korrekturnAnzahl} Korrektur{korrekturnAnzahl > 1 ? 'en' : ''} erkannt und angewendet
            </div>
            <div className="text-blue-600 text-xs font-semibold mt-0.5">
              Nur der zuletzt genannte Wert wird verwendet.
            </div>
          </div>
        )}

        {/* Implizit-Flags Badges */}
        {Object.keys(implizitFlags).length > 0 && (
          <div className="mx-5 mt-3 flex flex-wrap gap-2">
            {!!implizitFlags.nassbereich && (
              <span className="text-[11px] font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">🚿 Nassbereich</span>
            )}
            {!!implizitFlags.altbau && (
              <span className="text-[11px] font-black bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">🏚 Altbau</span>
            )}
            {!!implizitFlags.bewohnt && (
              <span className="text-[11px] font-black bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">👥 Bewohnt</span>
            )}
            {!!implizitFlags.denkmalschutz && (
              <span className="text-[11px] font-black bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">🏛 Denkmalschutz</span>
            )}
            {!!implizitFlags.fussbodenheizung && (
              <span className="text-[11px] font-black bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200">🔥 Fußbodenheizung</span>
            )}
            {!!implizitFlags.brandschutz && (
              <span className="text-[11px] font-black bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200">🛡 Brandschutz</span>
            )}
            {!!implizitFlags.smart_home && (
              <span className="text-[11px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">🏠 Smart Home</span>
            )}
          </div>
        )}

        {/* Implizit ergänzte Positionen Banner */}
        {implizitPositionen.length > 0 && (
          <div className="mx-5 mt-3 bg-[#F5C400]/10 border border-[#F5C400]/30 rounded-2xl px-4 py-3">
            <div className="font-black text-[#8B7000] text-sm flex items-center gap-1.5">✨ Automatisch erkannt</div>
            <div className="flex flex-col gap-1 mt-1.5">
              {implizitPositionen.map((p, i) => (
                <div key={i} className="text-[#8B7000] text-xs font-semibold">· {p}</div>
              ))}
            </div>
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
                    <div
                      key={idx}
                      className={`border-t border-[#2C2C2C]/5 px-4 py-3 ${
                        item.konfidenz === 'low' ? 'border-l-2 border-l-orange-400' :
                        item.konfidenz === 'medium' ? 'border-l-2 border-l-amber-400' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <input value={item.title} onChange={e => updateItem(idx, 'title', e.target.value)} className="w-full font-bold text-[#2C2C2C] bg-transparent focus:outline-none text-sm border-b border-transparent focus:border-[#F5C400] pb-0.5" />
                          <div className="flex gap-2 mt-2 items-center">
                            <input type="number" inputMode="decimal" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} className={`w-16 text-sm font-semibold text-[#2C2C2C] rounded-lg px-2 py-1 focus:outline-none ${item.konfidenz === 'low' ? 'bg-orange-50 ring-1 ring-orange-300' : 'bg-[#F7F7F5]'}`} min={0} step="0.01" autoFocus={item.konfidenz === 'low'} />
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
                          {/* Konfidenz-Hinweis */}
                          {item.konfidenz === 'low' && (
                            <div className="text-[11px] text-orange-600 font-semibold mt-1">⚠ Bitte Menge prüfen</div>
                          )}
                          {item.konfidenz === 'medium' && item.annahmen && item.annahmen.length > 0 && (
                            <div className="text-[11px] text-amber-600 font-semibold mt-1">Annahme: {item.annahmen.join(', ')} — anpassen?</div>
                          )}
                          {item.berechnungsweg && item.konfidenz !== 'low' && (
                            <details className="mt-1">
                              <summary className="text-[11px] text-[#2C2C2C]/30 font-semibold cursor-pointer">ⓘ Berechnung</summary>
                              <div className="text-[11px] text-[#2C2C2C]/50 font-semibold mt-0.5 pl-3">{item.berechnungsweg}</div>
                            </details>
                          )}
                          {item.kontext_genutzt && (
                            <span
                              className="inline-block mt-1 text-[10px] font-black text-[#2C2C2C]/30 bg-[#2C2C2C]/5 px-1.5 py-0.5 rounded"
                              title="Diese Position wurde durch den Gesamtkontext des Auftrags erkannt"
                            >
                              🔗 Kontext
                            </span>
                          )}
                          {item.aus_woerterbuch && (
                            <span
                              className="inline-block mt-1 ml-1 text-[10px] font-black text-[#2C2C2C]/30 bg-[#2C2C2C]/5 px-1.5 py-0.5 rounded"
                              title="Aus deinem persönlichen Wörterbuch — kein KI-Call nötig"
                            >
                              ⚡ Gelernt
                            </span>
                          )}
                          {item.implizit_erkannt && (
                            <span
                              className="inline-block mt-1 ml-1 text-[10px] font-black text-[#F5C400] bg-[#F5C400]/15 px-1.5 py-0.5 rounded"
                              title="Automatisch ergänzt — aus dem Kontext erkannt"
                            >
                              ✨ Automatisch
                            </span>
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

          {/* KI-Kalkulationsbewertung */}
          {kalkulationsBewertung && (
            <KalkulationsBewertungCard bewertung={kalkulationsBewertung} />
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
                {priceItems.filter(p => !priceSearch || (p.title ?? '').toLowerCase().includes(priceSearch.toLowerCase()) || (p.category ?? '').toLowerCase().includes(priceSearch.toLowerCase())).map(p => (
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
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')} className="text-white/50 text-sm font-semibold">← Dashboard</button>
          {/* ⓘ Button — immer sichtbar */}
          <div className="relative">
            <button
              onClick={() => { setHinweisOffen(true); setHinweisSchliessbar(true) }}
              className="p-1.5 text-white/40 hover:text-white/70 transition-colors"
              aria-label="Beispiele anzeigen"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
            {tooltipSichtbar && (
              <div className="absolute right-0 top-full mt-1.5 bg-[#F5C400] text-[#2C2C2C] text-xs font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                Beispiele anzeigen
                <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#F5C400] rotate-45" />
              </div>
            )}
          </div>
        </div>
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
              onClick={recording ? stopRecording : startRecording}
              className={`w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all select-none ${recording ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-[#F5C400] active:scale-95'}`}
            >
              {recording ? <MicOff size={52} color="white" strokeWidth={2} /> : <Mic size={52} color="#2C2C2C" strokeWidth={2} />}
            </button>
            <div className="font-bold text-sm text-[#2C2C2C]/50">
              {recording ? '🔴 Läuft — nochmal tippen zum Stoppen' : 'Tippen zum Starten'}
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

      {/* Aufnahme-Hinweis Bottom Sheet */}
      <AufnahmeHinweisSheet
        open={hinweisOffen}
        onClose={() => setHinweisOffen(false)}
        schliessbar={hinweisSchliessbar}
        gewerk={gewerk || undefined}
      />
    </div>
  )
}

const inputCls = "w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
