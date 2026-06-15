'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  ArrowLeft, Mic, MicOff, StickyNote, Camera, X, Check, ChevronRight,
  MoreHorizontal, Loader2, AlertCircle, ZoomIn,
} from 'lucide-react'
import { AudioPlayer } from '@/components/AudioPlayer'
import type { EntwurfAufnahme, ErkanntPosition } from '@/lib/types'

type AufnahmeWithUrl = EntwurfAufnahme & { audio_signed_url?: string; foto_signed_url?: string }

function detectGeraet(): string {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'web'
}

function fmtZeit(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function fmtWaehrung(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}

function fmtRelativ(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return 'gerade eben'
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`
  return new Date(iso).toLocaleDateString('de-DE')
}

// ── Timeline Card ────────────────────────────────────────────────────────────

function AufnahmeCard({ aufnahme }: { aufnahme: AufnahmeWithUrl }) {
  const [expanded, setExpanded] = useState(false)
  const [fotoGross, setFotoGross] = useState(false)

  const positionen = aufnahme.erkannte_positionen as ErkanntPosition[]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#2C2C2C]/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">
            {aufnahme.typ === 'sprache' ? '🎙' : aufnahme.typ === 'notiz' ? '📝' : '📷'}
          </span>
          <span className="text-[#2C2C2C]/40 font-semibold text-[13px]">
            {fmtZeit(aufnahme.erstellt_am)} Uhr
          </span>
          {aufnahme.typ === 'sprache' && (
            <StatusBadge status={aufnahme.verarbeitung_status} />
          )}
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="p-1 text-[#2C2C2C]/30 hover:text-[#2C2C2C]/60"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="px-4 pb-4">
        {/* SPRACHE */}
        {aufnahme.typ === 'sprache' && (
          <>
            {aufnahme.transkript && (
              <p className="text-[#2C2C2C] font-semibold text-[14px] leading-snug mb-3 italic">
                &ldquo;{aufnahme.transkript}&rdquo;
              </p>
            )}
            {aufnahme.audio_signed_url && (
              <div className="mb-3">
                <AudioPlayer src={aufnahme.audio_signed_url} dauer={aufnahme.audio_dauer_sekunden} />
              </div>
            )}
            {aufnahme.verarbeitung_status === 'verarbeitung' && (
              <div className="flex items-center gap-2 text-[#2C2C2C]/40 text-[13px] font-semibold">
                <Loader2 size={14} className="animate-spin" />
                Wird verarbeitet...
              </div>
            )}
            {aufnahme.verarbeitung_status === 'fehler' && (
              <div className="flex items-center gap-2 text-red-500 text-[13px] font-semibold">
                <AlertCircle size={14} />
                Verarbeitung fehlgeschlagen
              </div>
            )}
            {positionen.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="text-[11px] font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-0.5">
                  Erkannt
                </div>
                {positionen.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[13px] ${p.erkannt ? 'text-[#1A7A38]' : 'text-[#2C2C2C]/30'}`}>
                        {p.erkannt ? '✓' : '⚠'}
                      </span>
                      <span className="text-[13px] font-semibold text-[#2C2C2C]">
                        {p.titel} {p.menge} {p.einheit}
                      </span>
                    </div>
                    <span className="text-[13px] font-extrabold text-[#2C2C2C]/60 tabular-nums">
                      {p.erkannt ? fmtWaehrung(p.gesamtpreis) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* NOTIZ */}
        {aufnahme.typ === 'notiz' && (
          <p className="text-[#2C2C2C] font-semibold text-[15px] leading-relaxed">
            {aufnahme.notiz_text}
          </p>
        )}

        {/* FOTO */}
        {aufnahme.typ === 'foto' && (
          <>
            {aufnahme.foto_signed_url && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aufnahme.foto_signed_url}
                  alt={aufnahme.foto_beschreibung ?? 'Foto'}
                  className="w-full rounded-xl object-cover max-h-48 cursor-pointer"
                  onClick={() => setFotoGross(true)}
                />
                <button
                  onClick={() => setFotoGross(true)}
                  className="absolute top-2 right-2 bg-black/30 rounded-lg p-1.5"
                >
                  <ZoomIn size={14} color="white" />
                </button>
              </div>
            )}
            {aufnahme.foto_beschreibung && (
              <p className="text-[#2C2C2C]/60 font-semibold text-[13px] mt-2">
                {aufnahme.foto_beschreibung}
              </p>
            )}
          </>
        )}
      </div>

      {/* Foto Vollbild */}
      {fotoGross && aufnahme.foto_signed_url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setFotoGross(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aufnahme.foto_signed_url}
            alt="Foto"
            className="max-w-full max-h-full object-contain"
          />
          <button className="absolute top-4 right-4 text-white p-2">
            <X size={24} />
          </button>
        </div>
      )}

      {/* Expand menu */}
      {expanded && (
        <div className="border-t border-[#2C2C2C]/5 px-4 py-2">
          <button className="text-red-500 font-semibold text-[13px] py-1">
            Eintrag löschen
          </button>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'fertig') return (
    <span className="text-[11px] font-extrabold text-[#1A7A38] bg-[#EDFAF0] px-2 py-0.5 rounded-full">
      ✓ Fertig
    </span>
  )
  if (status === 'verarbeitung') return (
    <span className="text-[11px] font-extrabold text-[#8B7000] bg-[#F5C400]/15 px-2 py-0.5 rounded-full">
      Verarbeitung...
    </span>
  )
  if (status === 'fehler') return (
    <span className="text-[11px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
      Fehler
    </span>
  )
  return null
}

// ── Notiz Modal ──────────────────────────────────────────────────────────────

function NotizModal({ onSave, onClose }: { onSave: (text: string) => void; onClose: () => void }) {
  const [text, setText] = useState('')
  return (
    <div className="fixed inset-0 z-40 flex items-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" />
        </div>
        <h3 className="font-syne font-extrabold text-[#2C2C2C] text-[20px] mb-3">
          Notiz hinzufügen
        </h3>
        <textarea
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          placeholder="Schnell was festhalten..."
          className="w-full bg-[#F7F7F5] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-[#F5C400] mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-[#2C2C2C]/15 rounded-xl py-3 font-extrabold text-[#2C2C2C] text-[15px]"
          >
            Abbrechen
          </button>
          <button
            onClick={() => { if (text.trim()) { onSave(text.trim()); onClose() } }}
            disabled={!text.trim()}
            className="flex-1 bg-[#2C2C2C] text-white rounded-xl py-3 font-extrabold text-[15px] disabled:opacity-40"
          >
            Speichern ✓
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Fertigstellen Sheet ──────────────────────────────────────────────────────

function FertigstellenSheet({
  aufnahmen,
  angebotId,
  onClose,
}: {
  aufnahmen: AufnahmeWithUrl[]
  angebotId: string
  onClose: () => void
}) {
  const router = useRouter()
  const sprachen = aufnahmen.filter(a => a.typ === 'sprache')
  const notizen = aufnahmen.filter(a => a.typ === 'notiz')
  const positionen = aufnahmen.flatMap(a => (a.erkannte_positionen as ErkanntPosition[]) ?? [])
  const summe = positionen.reduce((s, p) => s + (p.gesamtpreis ?? 0), 0)

  return (
    <div className="fixed inset-0 z-40 flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" />
        </div>
        <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[24px] mb-1">
          Angebot fertigstellen
        </h2>
        <p className="text-[#2C2C2C]/40 font-semibold text-[14px] mb-5">
          {sprachen.length} Aufnahme{sprachen.length !== 1 ? 'n' : ''} · {notizen.length} Notiz{notizen.length !== 1 ? 'en' : ''} · {positionen.length} Positionen
          {summe > 0 && ` · ${fmtWaehrung(summe)} Netto`}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push(`/angebot/${angebotId}`)}
            className="w-full bg-[#2C2C2C] text-white rounded-2xl px-5 py-4 flex items-center justify-between"
          >
            <div className="text-left">
              <div className="font-extrabold text-[15px]">📋 Angebot prüfen & bearbeiten</div>
              <div className="text-white/50 text-[13px] font-semibold mt-0.5">
                Positionen prüfen, Preise anpassen
              </div>
            </div>
            <ChevronRight size={18} className="text-white/50" />
          </button>

          <button
            onClick={() => router.push(`/angebot/${angebotId}?aktion=senden`)}
            className="w-full bg-[#F5C400] text-[#2C2C2C] rounded-2xl px-5 py-4 flex items-center justify-between"
          >
            <div className="text-left">
              <div className="font-extrabold text-[15px]">📤 Direkt versenden</div>
              <div className="text-[#2C2C2C]/50 text-[13px] font-semibold mt-0.5">
                Sofort an Kunden schicken
              </div>
            </div>
            <ChevronRight size={18} className="text-[#2C2C2C]/50" />
          </button>
        </div>

        <p className="text-center text-[#2C2C2C]/30 font-semibold text-[12px] mt-5">
          Du kannst das Angebot danach noch bearbeiten bevor du es abschickst.
        </p>
      </div>
    </div>
  )
}

// ── Hauptseite ───────────────────────────────────────────────────────────────

export default function EntwurfPage() {
  const params = useParams()
  const angebotId = params.id as string
  const router = useRouter()
  const supabase = createClient()

  const [aufnahmen, setAufnahmen] = useState<AufnahmeWithUrl[]>([])
  const [quoteInfo, setQuoteInfo] = useState<{ customer?: { name: string } | null; entwurf_gespeichert_am?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const [recording, setRecording] = useState(false)
  const [recordingDauer, setRecordingDauer] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [showNotiz, setShowNotiz] = useState(false)
  const [showFertigstellen, setShowFertigstellen] = useState(false)
  const [autosaveText, setAutosaveText] = useState('')

  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const dauerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const geraet = useRef('')

  // ── Daten laden ────────────────────────────────────────────────────────────
  useEffect(() => {
    geraet.current = detectGeraet()
    loadData()

    // Realtime-Subscription
    const channel = supabase
      .channel(`entwurf-${angebotId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'entwurf_aufnahmen',
        filter: `angebot_id=eq.${angebotId}`,
      }, (payload) => {
        setAufnahmen(prev => prev.map(a =>
          a.id === payload.new.id ? { ...a, ...payload.new as AufnahmeWithUrl } : a
        ))
      })
      .subscribe()

    // Autosave bei Verlassen
    const onHide = () => {
      if (document.hidden) {
        navigator.sendBeacon?.(`/api/entwurf/autosave`, JSON.stringify({ angebot_id: angebotId }))
      }
    }
    document.addEventListener('visibilitychange', onHide)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', onHide)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angebotId])

  async function loadData() {
    setLoading(true)
    const [{ data: quote }, { data: rows }] = await Promise.all([
      supabase.from('quotes').select('entwurf_gespeichert_am, customer:customers(name)').eq('id', angebotId).single(),
      supabase.from('entwurf_aufnahmen').select('*').eq('angebot_id', angebotId).order('erstellt_am', { ascending: true }),
    ])

    setQuoteInfo(quote as typeof quoteInfo)

    if (rows?.length) {
      // Signed URLs laden
      const paths: Array<{ bucket: string; path: string }> = []
      for (const r of rows) {
        if (r.audio_url) paths.push({ bucket: 'entwurf-audio', path: r.audio_url as string })
        if (r.foto_url) paths.push({ bucket: 'entwurf-fotos', path: r.foto_url as string })
      }

      let urls: Record<string, string> = {}
      if (paths.length) {
        const res = await fetch('/api/entwurf/signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths }),
        })
        const data = await res.json()
        urls = data.urls ?? {}
      }

      setAufnahmen(rows.map(r => ({
        ...r,
        erkannte_positionen: (r.erkannte_positionen as ErkanntPosition[]) ?? [],
        audio_signed_url: r.audio_url ? urls[r.audio_url as string] : undefined,
        foto_signed_url: r.foto_url ? urls[r.foto_url as string] : undefined,
      } as AufnahmeWithUrl)))
    }
    setLoading(false)
  }

  function showAutosave() {
    setAutosaveText('✓ Gespeichert')
    setTimeout(() => setAutosaveText(''), 2000)
  }

  // ── Aufnahme ───────────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
        .find(m => MediaRecorder.isTypeSupported(m)) ?? ''
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blobType = mimeType || mr.mimeType || 'audio/webm'
        await handleAudioStop(new Blob(chunksRef.current, { type: blobType }))
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
      setRecordingDauer(0)
      dauerTimerRef.current = setInterval(() => setRecordingDauer(d => d + 1), 1000)
    } catch {
      alert('Mikrofon-Zugriff nicht möglich.')
    }
  }, [])

  function stopRecording() {
    mediaRef.current?.stop()
    setRecording(false)
    if (dauerTimerRef.current) clearInterval(dauerTimerRef.current)
  }

  async function handleAudioStop(blob: Blob) {
    setUploading(true)

    // Optimistic: Platzhalter in Timeline
    const tempId = `temp-${Date.now()}`
    const tempEntry: AufnahmeWithUrl = {
      id: tempId,
      angebot_id: angebotId,
      typ: 'sprache',
      audio_url: null,
      audio_dauer_sekunden: recordingDauer,
      transkript: null,
      erkannte_positionen: [],
      verarbeitung_status: 'ausstehend',
      notiz_text: null,
      foto_url: null,
      foto_beschreibung: null,
      in_pdf: false,
      erstellt_am: new Date().toISOString(),
      geraet: geraet.current,
      sortierung: 0,
    }
    setAufnahmen(prev => [...prev, tempEntry])

    // Upload
    const fd = new FormData()
    fd.append('angebot_id', angebotId)
    const ext = blob.type.includes('mp4') || blob.type.includes('m4a') ? 'm4a'
      : blob.type.includes('ogg') ? 'ogg' : 'webm'
    fd.append('audio', blob, `aufnahme.${ext}`)
    fd.append('dauer_sekunden', String(recordingDauer))
    fd.append('geraet', geraet.current)

    const uploadRes = await fetch('/api/entwurf/aufnahme/upload', { method: 'POST', body: fd })
    if (!uploadRes.ok) { setUploading(false); return }
    const { id: aufnahmeId } = await uploadRes.json() as { id: string }

    // Platzhalter ersetzen
    setAufnahmen(prev => prev.map(a =>
      a.id === tempId
        ? { ...a, id: aufnahmeId, verarbeitung_status: 'verarbeitung' }
        : a
    ))
    setUploading(false)
    showAutosave()

    // Verarbeitung im Hintergrund starten
    fetch('/api/entwurf/aufnahme/verarbeite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aufnahme_id: aufnahmeId }),
    }).then(async res => {
      if (res.ok) {
        const data = await res.json() as { transkript?: string; positionen?: ErkanntPosition[] }
        setAufnahmen(prev => prev.map(a =>
          a.id === aufnahmeId
            ? {
                ...a,
                transkript: data.transkript ?? null,
                erkannte_positionen: data.positionen ?? [],
                verarbeitung_status: 'fertig',
              }
            : a
        ))
      } else {
        setAufnahmen(prev => prev.map(a =>
          a.id === aufnahmeId ? { ...a, verarbeitung_status: 'fehler' } : a
        ))
      }
    })
  }

  // ── Notiz speichern ────────────────────────────────────────────────────────
  async function saveNotiz(text: string) {
    const res = await fetch('/api/entwurf/notiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ angebot_id: angebotId, text, geraet: geraet.current }),
    })
    if (res.ok) {
      const data = await res.json() as AufnahmeWithUrl
      setAufnahmen(prev => [...prev, data])
      showAutosave()
    }
  }

  // ── Foto hochladen ─────────────────────────────────────────────────────────
  async function handleFoto(file: File) {
    const fd = new FormData()
    fd.append('angebot_id', angebotId)
    fd.append('foto', file)
    fd.append('geraet', geraet.current)

    const res = await fetch('/api/entwurf/foto', { method: 'POST', body: fd })
    if (res.ok) {
      await loadData() // Signed URL nachladen
      showAutosave()
    }
  }

  // ── Rendering ──────────────────────────────────────────────────────────────
  const kundenname = (quoteInfo?.customer as { name?: string } | null)?.name
  const gespeichertAm = quoteInfo?.entwurf_gespeichert_am
    ? fmtRelativ(quoteInfo.entwurf_gespeichert_am)
    : null

  const allePositionen = aufnahmen.flatMap(a => (a.erkannte_positionen as ErkanntPosition[]) ?? [])
  const gesamtNetto = allePositionen.reduce((s, p) => s + (p.gesamtpreis ?? 0), 0)

  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#2C2C2C]/8 px-4 pt-safe-top">
        <div className="flex items-center justify-between h-14">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-[#2C2C2C]/60">
            <ArrowLeft size={18} />
            <span className="font-semibold text-[14px]">Dashboard</span>
          </Link>

          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-[#F5C400]" />
              <span className="font-extrabold text-[#2C2C2C] text-[14px]">Entwurf</span>
            </div>
            {autosaveText && (
              <span className="text-[11px] text-[#1A7A38] font-semibold">{autosaveText}</span>
            )}
          </div>

          <button
            onClick={() => setShowFertigstellen(true)}
            className="flex items-center gap-1 bg-[#F5C400] text-[#2C2C2C] font-extrabold text-[13px] px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
          >
            Fertigstellen
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Subheader */}
        <div className="pb-3">
          {kundenname && (
            <div className="font-extrabold text-[#2C2C2C] text-[15px]">{kundenname}</div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[#2C2C2C]/40 font-semibold text-[12px]">
              {gespeichertAm ? `Gespeichert ${gespeichertAm}` : 'Noch nicht gespeichert'}
            </span>
            {gesamtNetto > 0 && (
              <span className="font-extrabold text-[#2C2C2C] text-[13px]">
                {fmtWaehrung(gesamtNetto)} Netto
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="flex-1 px-4 py-4 overflow-y-auto pb-32">
        {loading && (
          <div className="flex justify-center pt-12">
            <Loader2 size={24} className="animate-spin text-[#2C2C2C]/30" />
          </div>
        )}

        {!loading && aufnahmen.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 text-center px-6">
            <div className="text-5xl mb-4">🎙</div>
            <div className="font-syne font-extrabold text-[#2C2C2C] text-[22px] mb-2">
              Fang einfach an
            </div>
            <div className="text-[#2C2C2C]/40 font-semibold text-[15px] leading-relaxed">
              Drück auf Aufnehmen und beschreib die Baustelle.<br />
              Kein perfekter Satz nötig.
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {aufnahmen.map(a => (
            <AufnahmeCard key={a.id} aufnahme={a} />
          ))}
        </div>

        {/* Aufnahme-Indikator */}
        {(recording || uploading) && (
          <div className="mt-3 bg-white rounded-2xl border border-[#2C2C2C]/5 px-4 py-3 flex items-center gap-3">
            {recording ? (
              <>
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="font-extrabold text-[#2C2C2C] text-[14px]">
                  Läuft — {recordingDauer}s — loslassen zum Stoppen
                </span>
              </>
            ) : (
              <>
                <Loader2 size={16} className="animate-spin text-[#2C2C2C]/40" />
                <span className="font-semibold text-[#2C2C2C]/60 text-[14px]">Wird hochgeladen...</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#2C2C2C]/8 px-4 py-3 pb-safe-bottom flex items-center gap-3">
        {/* Notiz */}
        <button
          onClick={() => setShowNotiz(true)}
          className="flex-1 flex flex-col items-center gap-1 py-2 text-[#2C2C2C]/50 hover:text-[#2C2C2C] transition-colors"
        >
          <StickyNote size={22} />
          <span className="text-[11px] font-extrabold">Notiz</span>
        </button>

        {/* Aufnehmen — Haupt-Button */}
        <button
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerLeave={stopRecording}
          disabled={uploading}
          className={`flex-[3] flex flex-col items-center gap-1 py-3 rounded-2xl font-extrabold text-[15px] transition-all active:scale-95 select-none ${
            recording
              ? 'bg-red-500 text-white shadow-lg shadow-red-200'
              : 'bg-[#2C2C2C] text-white'
          } disabled:opacity-50`}
        >
          {recording
            ? <><MicOff size={22} /><span className="text-[11px]">Loslassen</span></>
            : <><Mic size={22} /><span className="text-[11px]">Aufnehmen</span></>
          }
        </button>

        {/* Foto */}
        <label className="flex-1 flex flex-col items-center gap-1 py-2 text-[#2C2C2C]/50 hover:text-[#2C2C2C] transition-colors cursor-pointer">
          <Camera size={22} />
          <span className="text-[11px] font-extrabold">Foto</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFoto(file)
              e.target.value = ''
            }}
          />
        </label>
      </div>

      {/* Modals */}
      {showNotiz && <NotizModal onSave={saveNotiz} onClose={() => setShowNotiz(false)} />}
      {showFertigstellen && (
        <FertigstellenSheet
          aufnahmen={aufnahmen}
          angebotId={angebotId}
          onClose={() => setShowFertigstellen(false)}
        />
      )}
    </div>
  )
}
