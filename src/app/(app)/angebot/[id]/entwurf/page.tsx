'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, Mic, Camera, X, Check, ChevronRight,
  Loader2, AlertCircle, RefreshCw,
} from 'lucide-react'
import { AudioPlayer } from '@/components/AudioPlayer'
import type { RueckfrageItem } from '@/lib/mengen/rueckfragen-generator'
import type { ExtrahierteDaten } from '@/lib/mengen/types'
import type { EntwurfAufnahme, ErkanntPosition, VollExtraktionCache } from '@/lib/types'
import { extrahiereRaumdaten } from '@/lib/extraktion-masse'
import RueckfragenScreen, { type RueckfragenAntwort } from '@/components/aufnahme/RueckfragenScreen'
// DC-028: dieselbe Raum-Gruppierung wie im fertigen Angebot (AngebotDetail.tsx)
// und in der Entwurfsansicht — gleicher Code-Pfad, damit diese Sammelansicht
// strukturell nie von der finalen Darstellung abweichen kann.
import { gruppiereNachRaum } from '@/lib/angebot-gruppierung'

// Bereits berechnete quote_items — vollständig geladen (nicht nur die Anzahl),
// damit sie sich zusammen mit frischen Vorschau-Positionen raum-gruppieren
// lassen (Nachtrag-Fall: Rückkehr nach "Entwurf erstellen").
interface BestehendeQuotePosition {
  id: string
  title: string
  description: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  position: number
}

// Ein Eintrag im gepoolten Sammel-Bestand für die Raum-Gruppierung dieser
// Ansicht: entweder eine echte, bereits berechnete Position (pending=false)
// oder eine frische Vorschau-Position aus einer noch nicht "fertiggestellten"
// Aufnahme (pending=true) — beide zusammen ergeben die Raum-Karten.
interface SammelPoolItem {
  id: string
  title: string
  description: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  position: number
  pending: boolean
}

function baueSammelPool(
  bestehende: BestehendeQuotePosition[],
  neueAufnahmen: AufnahmeWithUrl[],
  wartetSeitMap: Map<string, number>,
  jetzt: number,
): SammelPoolItem[] {
  const pool: SammelPoolItem[] = bestehende.map(item => ({ ...item, pending: false }))
  // Pending-Markierung nur, wenn es schon einen echten, berechneten Bestand
  // gibt, an dem "neu" erkennbar ist — beim allerersten Aufnehmen (noch nichts
  // berechnet) wäre "wird berechnet" auf jeder Position nur Lärm, keine
  // hilfreiche Unterscheidung.
  const markierePending = bestehende.length > 0
  let laufendePosition = pool.length
  for (const aufnahme of neueAufnahmen) {
    // DC-030-Nachtrag (Product Designer, 2026-08-21): eine frisch begonnene
    // Aufnahme soll in der Raum-Karte erst auftauchen, sobald die geprüfte
    // Extraktion da ist — nicht vorher mit einer möglicherweise falschen
    // Vorschau-Zeile. Sonst löst Schritt 2 das Problem auf der einzelnen
    // Aufnahmekarte, führt es hier aber in kleinerer Form wieder ein.
    const { status, positionen } = kartenAnsicht(aufnahme, wartetSeitMap.get(aufnahme.id), jetzt)
    if (status !== 'bereit') continue
    for (const p of positionen) {
      if (!p.erkannt) continue
      pool.push({
        id: `preview-${aufnahme.id}-${laufendePosition}`,
        title: p.titel,
        description: null,
        quantity: p.menge,
        unit: p.einheit,
        unit_price: p.einzelpreis,
        total_price: p.gesamtpreis,
        position: laufendePosition,
        pending: markierePending,
      })
      laufendePosition++
    }
  }
  return pool
}

type AufnahmeWithUrl = EntwurfAufnahme & { audio_signed_url?: string; foto_signed_url?: string }

type Screen = 'timeline' | 'fertigstellen_loading' | 'rueckfragen' | 'done' | 'zurueck_bestaetigen'

function detectGeraet(): string {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'web'
}

function fmtZeit(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

const RAUMNAMEN = ['Wohnzimmer', 'Schlafzimmer', 'Kinderzimmer', 'Arbeitszimmer', 'Esszimmer', 'Gästezimmer', 'Badezimmer', 'Bad', 'Küche', 'Flur', 'Diele', 'Keller', 'Garage', 'Treppenhaus', 'Büro', 'Abstellraum']
const TITEL_TRENNER = /\s+[-–—]\s+/

function raumAusTitel(titel: string): string | null {
  const treffer = titel.match(TITEL_TRENNER)
  return treffer ? titel.slice(treffer.index! + treffer[0].length).trim() : null
}

function erkenneEinzelraum(transkript: string | null, positionen: ErkanntPosition[]): string | null {
  const ausTiteln = [...new Set(positionen.map(p => raumAusTitel(p.titel)).filter(Boolean) as string[])]
  if (ausTiteln.length === 1) return ausTiteln[0]
  const text = (transkript ?? '').toLocaleLowerCase('de-DE')
  const ausText = RAUMNAMEN.filter(name => new RegExp(`\\b${name.toLocaleLowerCase('de-DE')}\\b`, 'i').test(text))
  return ausText.length === 1 ? ausText[0] : null
}

// PM-008: extrahiereRaumdaten() lebt jetzt in @/lib/extraktion-masse (mit
// Tests) statt hier inline — nur fürs schnelle Vorschau-Gefühl direkt nach
// der Aufnahme, die echte Berechnung läuft komplett getrennt davon
// (GPT-Extraktion + Mengen-Engine) und war hiervon nie betroffen. War vorher
// UNGETESTETER Code direkt in der Seite; der 12-Zeichen-Kontextfenster-Bug
// (PM-008-Nachtest) wäre mit einem Test gegen einen echten Transkript-Fall
// vermutlich schon vorher aufgefallen — jetzt zentral + getestet wie die
// übrigen Rohtext-Parser in dieser Datei.
function formatMass(wert: number) {
  return wert.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function geschaetzteSekunden(positionen: number) {
  return Math.max(10, Math.ceil((positionen * 2) / 5) * 5)
}

// ── CoS-002 Schritt 2 (Head of Product Engineering, 2026-08-21) ────────────
// Product Designer, DC-030: die Karte soll für Sprachaufnahmen so lange
// gar keine Positionen zeigen, bis die vollständige, geprüfte Extraktion
// da ist (voll_extraktion, siehe volle-extraktion-cache.ts) — lieber
// "Verarbeitung…" länger stehen lassen als eine Zahl zeigen, die später
// wieder abweichen kann (genau das Problem hinter DC-021/DC-022). Sandys
// Gate-Anforderung (DC-030-Nachtrag): "Entwurf erstellen" darf sich aus
// demselben Grund erst freischalten, wenn diese Prüfung durch ist, sonst
// entsteht ein zweites, separates Wartefenster am Button.
//
// Absicherung gegen Dauerblockade: volle-extraktion-cache.ts schreibt bei
// jedem Fehlschlag (Rate-Limit, GPT-/Netzwerkfehler) explizit eine
// `__fehlgeschlagen`-Markierung statt die Zeile unverändert zu lassen —
// aber falls selbst DAS mal nicht ankommt (z. B. Server-Absturz mitten in
// after()), sorgt dieser Timeout zusätzlich dafür, dass die Karte nach
// spätestens ~30s auf die schnelle Vorschau zurückfällt, statt für immer
// zu warten. 30s = das in docs/cos-002-architektur-vorschlag.md genannte
// ~25s-Timeout-Budget der Edge Function plus kleiner Sicherheitsabstand.
const VOLL_EXTRAKTION_TIMEOUT_MS = 30_000
// Ab wann der zusätzliche "prüft genau, dauert kurz"-Hinweis erscheint —
// laut Designer die heutige gefühlte Normalzeit für die schnelle Vorschau.
const VOLL_EXTRAKTION_HINWEIS_MS = 5_000

type KartenAnsichtStatus = 'wartet_transkription' | 'wartet_pruefung' | 'bereit'

// Eine einzige Stelle, die entscheidet, was eine Aufnahme gerade anzeigen
// soll — Badge-Zustand UND Positionsliste kommen beide von hier, damit sie
// nie auseinanderlaufen können (dieselbe Lehre wie bei CoS-002 selbst).
function kartenAnsicht(
  aufnahme: AufnahmeWithUrl,
  wartetSeit: number | undefined,
  jetzt: number,
): { status: KartenAnsichtStatus; positionen: ErkanntPosition[] } {
  const schnelleVorschau = (aufnahme.erkannte_positionen as ErkanntPosition[] | undefined) ?? []
  // Foto (Zettel-Scan) und Notiz haben kein voll_extraktion-Gegenstück
  // (volle-extraktion-cache.ts läuft nur für typ 'sprache') — für sie bleibt
  // die schnelle Vorschau die einzige Quelle, wie schon vor CoS-002.
  if (aufnahme.typ !== 'sprache') return { status: 'bereit', positionen: schnelleVorschau }
  if (aufnahme.verarbeitung_status !== 'fertig') return { status: 'wartet_transkription', positionen: [] }
  const voll = aufnahme.voll_extraktion as VollExtraktionCache | null | undefined
  if (voll?.positionen) return { status: 'bereit', positionen: voll.positionen }
  if (voll?.__fehlgeschlagen) return { status: 'bereit', positionen: schnelleVorschau } // Fail-open
  if (wartetSeit !== undefined && jetzt - wartetSeit > VOLL_EXTRAKTION_TIMEOUT_MS) {
    return { status: 'bereit', positionen: schnelleVorschau } // Fail-open nach Timeout
  }
  return { status: 'wartet_pruefung', positionen: [] }
}

// Anzeige-Status fürs bestehende StatusBadge/Chip-Farbschema: solange
// 'wartet_pruefung', bewusst wie 'verarbeitung' behandeln (Designer, DC-030
// — Option 3), obwohl verarbeitung_status in der DB längst 'fertig' ist.
function anzeigeStatus(aufnahme: AufnahmeWithUrl, wartetSeit: number | undefined, jetzt: number): EntwurfAufnahme['verarbeitung_status'] {
  if (aufnahme.typ !== 'sprache') return aufnahme.verarbeitung_status
  return kartenAnsicht(aufnahme, wartetSeit, jetzt).status === 'wartet_pruefung' ? 'verarbeitung' : aufnahme.verarbeitung_status
}

// ── Aufnahme Card ─────────────────────────────────────────────────────────────

function AufnahmeCard({ aufnahme, wartetSeit, onDelete, onRetry }: { aufnahme: AufnahmeWithUrl; wartetSeit?: number; onDelete?: () => void; onRetry?: () => void }) {
  const [fotoGross, setFotoGross] = useState(false)
  const jetzt = Date.now()
  const { status: kartenStatus, positionen } = kartenAnsicht(aufnahme, wartetSeit, jetzt)
  const badgeStatus = anzeigeStatus(aufnahme, wartetSeit, jetzt)
  const erkannte = positionen.filter(p => p.erkannt)
  const einzelraum = erkenneEinzelraum(aufnahme.transkript, erkannte)
  const raumdaten = extrahiereRaumdaten(aufnahme.transkript)
  // DC-030: der zusätzliche "prüft genau"-Hinweis erscheint erst nach einer
  // kurzen Wartezeit, nicht sofort — sonst wirkt jede Aufnahme unnötig langsam.
  const zeigePruefHinweis = kartenStatus === 'wartet_pruefung' && wartetSeit !== undefined && jetzt - wartetSeit > VOLL_EXTRAKTION_HINWEIS_MS
  // Zettel-Scan = Foto mit Vision-Transkript (bzw. gerade in Verarbeitung)
  const istZettel = aufnahme.typ === 'foto' && (aufnahme.transkript != null || aufnahme.foto_beschreibung === 'Aufmaß-Zettel')

  return (
    <div className="bg-white rounded-2xl border border-[#2C2C2C]/6 overflow-hidden">

      {/* Sprach-Aufnahme oder Zettel-Scan */}
      {(aufnahme.typ === 'sprache' || istZettel) && (
        <div className="px-4 pt-3.5 pb-4">
          {/* Kopfzeile: Zeit + Status + Löschen */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[#2C2C2C]/30 font-semibold text-[12px]">{fmtZeit(aufnahme.erstellt_am)} Uhr</span>
              {istZettel && <span className="text-[11px] font-extrabold text-[#2C2C2C]/40 bg-[#2C2C2C]/5 px-2 py-0.5 rounded-full">📷 Zettel</span>}
              <StatusBadge status={badgeStatus} />
            </div>
            {onDelete && (
              <button onClick={onDelete} className="p-1 text-[#2C2C2C]/20 hover:text-red-400 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status: lädt / Fehler */}
          {badgeStatus === 'verarbeitung' && (
            <div className="flex flex-col gap-1 mb-3">
              <div className="flex items-center gap-2 text-[#2C2C2C]/40 text-[13px] font-semibold">
                <Loader2 size={14} className="animate-spin" />
                Wird ausgewertet…
              </div>
              {/* DC-030 (Product Designer, 2026-08-20): bewusst vage — keine
                  Sekundenzahl, kein Fortschrittsbalken. Eine falsche
                  Zeitangabe wäre dasselbe Vertrauensproblem nur eine Ebene
                  tiefer (siehe DC-022). */}
              {zeigePruefHinweis && (
                <div className="text-[#2C2C2C]/35 text-[12px] font-semibold pl-[22px]">prüft genau, dauert kurz</div>
              )}
            </div>
          )}
          {aufnahme.verarbeitung_status === 'fehler' && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 text-red-500 text-[13px] font-semibold">
                <AlertCircle size={14} />
                {istZettel ? 'Zettel nicht lesbar — bitte neu fotografieren' : 'Verarbeitung fehlgeschlagen'}
              </div>
              {onRetry && aufnahme.typ === 'sprache' && (
                <button
                  onClick={onRetry}
                  className="ml-auto flex items-center gap-1.5 bg-[#2C2C2C] text-white text-[12px] font-extrabold px-3 py-1.5 rounded-xl active:scale-95 transition-all"
                >
                  <RefreshCw size={12} strokeWidth={2.5} />
                  Nochmal versuchen
                </button>
              )}
            </div>
          )}

          {/* Ruhige, fachlich gegliederte Zusammenfassung */}
          {erkannte.length > 0 && (
            <div className="mb-3 space-y-3">
              {einzelraum && (
                <div>
                  <div className="font-syne font-extrabold text-[16px] text-[#2C2C2C]">{einzelraum}</div>
                  <div className="flex items-center gap-1.5 mt-1 text-[12px] font-bold text-[#1A7A38]"><Check size={13} strokeWidth={3} /> Raum erkannt</div>
                </div>
              )}
              {raumdaten.laenge && raumdaten.breite && (
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#2C2C2C]/35 mb-1">Maße</div>
                  <div className="text-[14px] font-bold text-[#2C2C2C]">
                    {formatMass(raumdaten.laenge)} × {formatMass(raumdaten.breite)}{raumdaten.hoehe ? ` × ${formatMass(raumdaten.hoehe)}` : ''} m
                  </div>
                </div>
              )}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#2C2C2C]/35 mb-1.5">Leistungen</div>
                <div className="flex flex-col gap-1.5">
                  {erkannte.map((p, i) => {
                    const treffer = p.titel?.match(TITEL_TRENNER)
                    const titelDisplay = treffer ? p.titel.slice(0, treffer.index).trim() : p.titel
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={13} strokeWidth={3} className="text-[#1A7A38] shrink-0" />
                        <span className="text-[13px] font-semibold text-[#2C2C2C]">{titelDisplay}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              {(raumdaten.fenster > 0 || raumdaten.tueren > 0) && (
                <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-[#2C2C2C]/6 pt-2.5 text-[12px] font-semibold text-[#2C2C2C]/65">
                  {raumdaten.fenster > 0 && <span>Fenster: <b className="text-[#2C2C2C]">{raumdaten.fenster}</b></span>}
                  {raumdaten.tueren > 0 && <span>{raumdaten.tueren === 1 ? 'Tür' : 'Türen'}: <b className="text-[#2C2C2C]">{raumdaten.tueren}</b></span>}
                </div>
              )}
            </div>
          )}

          {/* Audio-Player */}
          {aufnahme.audio_signed_url && (
            <AudioPlayer src={aufnahme.audio_signed_url} dauer={aufnahme.audio_dauer_sekunden} />
          )}

          {/* Zettel-Thumbnail */}
          {istZettel && aufnahme.foto_signed_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={aufnahme.foto_signed_url}
              alt="Aufmaß-Zettel"
              className="w-full max-h-32 object-cover rounded-xl cursor-pointer border border-[#2C2C2C]/8"
              onClick={() => setFotoGross(true)}
            />
          )}
        </div>
      )}

      {/* Notiz */}
      {aufnahme.typ === 'notiz' && (
        <div className="px-4 pt-3.5 pb-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[#2C2C2C] font-semibold text-[14px] leading-relaxed flex-1">
              {aufnahme.notiz_text}
            </p>
            {onDelete && (
              <button onClick={onDelete} className="p-1 text-[#2C2C2C]/20 hover:text-red-400 transition-colors shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Foto (Baustellendoku — ohne Zettel-Scan) */}
      {aufnahme.typ === 'foto' && !istZettel && aufnahme.foto_signed_url && (
        <>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aufnahme.foto_signed_url}
              alt={aufnahme.foto_beschreibung ?? 'Foto'}
              className="w-full object-cover max-h-48 cursor-pointer"
              onClick={() => setFotoGross(true)}
            />
            {onDelete && (
              <button onClick={onDelete} className="absolute top-2 right-2 bg-black/40 rounded-lg p-1.5">
                <X size={14} color="white" />
              </button>
            )}
          </div>
          {aufnahme.foto_beschreibung && (
            <p className="px-4 py-2.5 text-[#2C2C2C]/60 font-semibold text-[13px]">{aufnahme.foto_beschreibung}</p>
          )}
        </>
      )}

      {fotoGross && aufnahme.foto_signed_url && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setFotoGross(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={aufnahme.foto_signed_url} alt="Foto" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-4 right-4 text-white p-2"><X size={24} /></button>
        </div>
      )}
    </div>
  )
}

// ── DC-028: schlanke Aufnahme-Chip-Leiste ───────────────────────────────────
// Ersetzt die vorherige volle AufnahmeCard als primäre Timeline-Darstellung —
// die Raum-Karten (RaumKarte) übernehmen jetzt den Inhalt, die Chips bleiben
// als Nachweis/Zugriff auf die einzelne Aufnahme (Audio, Löschen, Retry).

function chipStatusFarbe(status: string): string {
  if (status === 'fertig') return 'bg-[#1A7A38]'
  if (status === 'fehler') return 'bg-red-500'
  return 'bg-[#F5C400]'
}

function AufnahmeChip({ aufnahme, wartetSeit, onOpen }: { aufnahme: AufnahmeWithUrl; wartetSeit?: number; onOpen: () => void }) {
  const jetzt = Date.now()
  const badgeStatus = anzeigeStatus(aufnahme, wartetSeit, jetzt)
  const { positionen } = kartenAnsicht(aufnahme, wartetSeit, jetzt)
  const erkannte = positionen.filter(p => p.erkannt)
  const einzelraum = erkenneEinzelraum(aufnahme.transkript, erkannte)
  const istZettel = aufnahme.typ === 'foto' && (aufnahme.transkript != null || aufnahme.foto_beschreibung === 'Aufmaß-Zettel')
  const label = aufnahme.typ === 'notiz'
    ? (aufnahme.notiz_text ?? '').slice(0, 18) || 'Notiz'
    : istZettel ? '📷 Zettel'
    : einzelraum ?? (aufnahme.typ === 'foto' ? 'Foto' : null)

  return (
    <button
      onClick={onOpen}
      className={`shrink-0 flex items-center gap-2 rounded-full border px-3.5 py-2 transition-colors ${
        aufnahme.verarbeitung_status === 'fehler'
          ? 'border-red-200 bg-red-50'
          : 'border-[#2C2C2C]/8 bg-white hover:border-[#2C2C2C]/20'
      }`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${chipStatusFarbe(badgeStatus)} ${badgeStatus === 'verarbeitung' ? 'animate-pulse' : ''}`} />
      <span className="font-bold text-[12px] text-[#2C2C2C] whitespace-nowrap">{fmtZeit(aufnahme.erstellt_am)} Uhr</span>
      {label && (
        <span className="font-semibold text-[12px] text-[#2C2C2C]/45 whitespace-nowrap">· {label}</span>
      )}
    </button>
  )
}

// ── DC-028: Raum-Karte ───────────────────────────────────────────────────────
// Zeigt genau eine Raum-Gruppe aus gruppiereNachRaum() — gleiche Funktion,
// gleiche Emoji-/Namens-Logik wie im fertigen Angebot (AngebotDetail.tsx).
// Frische, noch nicht berechnete Positionen sind per pendingById erkennbar
// und bekommen eine "Wird berechnet"-Markierung statt eines Preises.

function RaumKarte({
  raumName, emoji, items, pendingById,
}: {
  raumName: string
  emoji: string
  items: { id: string; titleDisplay: string; quantity: number; unit: string }[]
  pendingById: Map<string, boolean>
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#2C2C2C]/6 px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[17px]">{emoji}</span>
        <span className="font-syne font-extrabold text-[15px] text-[#2C2C2C]">{raumName}</span>
        <span className="ml-auto text-[11px] font-bold text-[#2C2C2C]/35">
          {items.length} {items.length === 1 ? 'Position' : 'Positionen'}
        </span>
      </div>
      <div className="flex flex-col">
        {items.map(item => {
          const pending = pendingById.get(item.id) ?? false
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 py-2 border-t border-[#2C2C2C]/6 first:border-t-0"
            >
              <span className={`text-[13px] font-semibold ${pending ? 'italic text-[#2C2C2C]/55' : 'text-[#2C2C2C]'}`}>
                {item.titleDisplay}
              </span>
              {pending ? (
                <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wide text-[#8B7000] bg-[#F5C400]/20 px-2 py-0.5 rounded-full">
                  Wird berechnet
                </span>
              ) : (
                <span className="shrink-0 text-[12px] font-bold text-[#2C2C2C]/45">{item.quantity} {item.unit}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'fertig') return (
    <span className="text-[11px] font-extrabold text-[#1A7A38] bg-[#EDFAF0] px-2 py-0.5 rounded-full">✓ Fertig</span>
  )
  if (status === 'verarbeitung') return (
    <span className="text-[11px] font-extrabold text-[#8B7000] bg-[#F5C400]/15 px-2 py-0.5 rounded-full">Verarbeitung…</span>
  )
  if (status === 'fehler') return (
    <span className="text-[11px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Fehler</span>
  )
  return null
}

// ── Notiz Modal ───────────────────────────────────────────────────────────────

function NotizModal({ onSave, onClose }: { onSave: (text: string) => void; onClose: () => void }) {
  const [text, setText] = useState('')
  return (
    <div className="fixed inset-0 z-40 flex items-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl">
        <div className="flex justify-center mb-3"><div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" /></div>
        <h3 className="font-syne font-extrabold text-[#2C2C2C] text-[20px] mb-3">Notiz hinzufügen</h3>
        <textarea
          autoFocus value={text} onChange={e => setText(e.target.value)} rows={3}
          placeholder="Schnell was festhalten…"
          className="w-full bg-[#F7F7F5] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-[#F5C400] mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border-2 border-[#2C2C2C]/15 rounded-xl py-3 font-extrabold text-[#2C2C2C] text-[15px]">Abbrechen</button>
          <button onClick={() => { if (text.trim()) { onSave(text.trim()); onClose() } }} disabled={!text.trim()}
            className="flex-1 bg-[#2C2C2C] text-white rounded-xl py-3 font-extrabold text-[15px] disabled:opacity-40">
            Speichern ✓
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Hauptseite ────────────────────────────────────────────────────────────────

export default function EntwurfPage() {
  const params = useParams()
  const angebotId = params.id as string
  const router = useRouter()
  const supabase = createClient()

  const [aufnahmen, setAufnahmen] = useState<AufnahmeWithUrl[]>([])
  const [quoteInfo, setQuoteInfo] = useState<{ customer?: { name: string } | null; entwurf_gespeichert_am?: string; quote_items?: BestehendeQuotePosition[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState<Screen>('timeline')

  const [recording, setRecording] = useState(false)
  const [recordingDauer, setRecordingDauer] = useState(0)
  
  const [showNotiz, setShowNotiz] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Positionen werden berechnet…')
  const [fehler, setFehler] = useState('')
  // PM-010, Whisper-Vorschlag (2026-08-17): unrealistische Raummaße (z.B.
  // "350 m" statt "3,50 m") blockieren nie den Flow, aber werden hier kurz
  // gezeigt, bevor automatisch zum Angebot weitergegangen wird — sonst sieht
  // man die Warnung nie (Navigation passiert sofort nach Erfolg).
  const [massWarnungen, setMassWarnungen] = useState<string[]>([])
  const [deleteBestaetigen, setDeleteBestaetigen] = useState<string | null>(null)
  // DC-028: welche Aufnahme gerade als Detail-Sheet offen ist (Chip antippen) —
  // ersetzt die vorherige feste Liste aus AufnahmeCard-Kästen in der Timeline.
  const [aufnahmeDetail, setAufnahmeDetail] = useState<string | null>(null)
  const [rueckfragen, setRueckfragen] = useState<RueckfrageItem[]>([])
  const [basisExtraktion, setBasisExtraktion] = useState<ExtrahierteDaten | null>(null)
  // PM-007: `null` als Wert = „diese Frage wurde bewusst übersprungen".
  const [gesammelteAntworten, setGesammelteAntworten] = useState<Record<string, RueckfragenAntwort | null>>({})
  const [zettelUploading, setZettelUploading] = useState(false)

  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  // DC-031: wird kurz vor mediaRef.current?.stop() auf true gesetzt, wenn die
  // Aufnahme verworfen statt hochgeladen werden soll (Abbrechen-Button, oder
  // Navigation weg von der Seite während einer laufenden Aufnahme) — mr.onstop
  // prüft das und überspringt dann handleAudioStop()/den Upload.
  const skipUploadRef = useRef(false)
  const dauerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const geraet = useRef('')
  const zettelInputRef = useRef<HTMLInputElement>(null)
  // CoS-010: Schutz gegen Doppel-Tap/Doppel-Klick auf "Positionen berechnen".
  // Der "Fertigstellen"-Button hatte kein disabled/Ladezustand — zwischen
  // Klick und dem Umschalten auf den Ladebildschirm (setScreen ist async)
  // blieb er kurz weiter klickbar. Ein zweiter Tap in diesem Fenster löst
  // eine zweite, praktisch gleichzeitige Anfrage an generiere-positionen
  // aus; beide lesen "gibt's das schon" BEVOR die andere geschrieben hat,
  // beide fügen dieselben Positionen ein → komplettes Angebot exakt 2×.
  // Das erklärt PM-014, ohne dass eine echte Server-seitige Race-Condition
  // (zwei verschiedene Tabs/Geräte gleichzeitig) nötig ist.
  const fertigstellenLaufendRef = useRef(false)
  // CoS-002 Schritt 2 (2026-08-21): merkt sich pro Aufnahme, seit wann sie auf
  // voll_extraktion wartet (verarbeitung_status schon 'fertig', aber noch
  // keine geprüfte Extraktion da) — Basis für den 30s-Timeout-Fallback und
  // den "prüft genau"-Hinweis nach 5s, siehe kartenAnsicht()/VOLL_EXTRAKTION_*.
  const vollExtraktionWartetSeitRef = useRef<Map<string, number>>(new Map())
  const [, setVollExtraktionTick] = useState(0)
  // CoS-002 Schritt 3, Mehrfach-Aufnahmen-Fall (2026-08-21, Sandys Auftrag
  // "mach komplett rund, das auch noch schließen"): merkt sich die zuletzt
  // spekulativ angestoßene Aufnahmen-Menge (als sortierter ID-String), damit
  // der Vorab-Kombi-Aufruf pro tatsächlich geänderter Menge nur EINMAL
  // feuert, siehe Effekt weiter unten und src/lib/kombinierte-extraktion-cache.ts.
  const kombiVorabGefeuertRef = useRef<string>('')

  // ── Daten laden ──────────────────────────────────────────────────────────

  useEffect(() => {
    geraet.current = detectGeraet()
    loadData()

    const channel = supabase
      .channel(`entwurf-${angebotId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'entwurf_aufnahmen',
        filter: `angebot_id=eq.${angebotId}`,
      }, (payload) => {
        setAufnahmen(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new as AufnahmeWithUrl } : a))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angebotId])

  // CoS-002 Schritt 2 (2026-08-21): sobald eine Sprachaufnahme 'fertig' wird,
  // aber noch kein voll_extraktion da ist, hier den Startzeitpunkt des
  // Wartens vermerken (einmalig — spätere Aufrufe überschreiben ihn nicht).
  // Realtime-Updates (Effekt oben) lösen diesen Effekt über die
  // aufnahmen-Abhängigkeit erneut aus, sobald voll_extraktion eintrifft;
  // der Eintrag bleibt dann einfach ungenutzt stehen (harmlos).
  useEffect(() => {
    const jetzt = Date.now()
    for (const a of aufnahmen) {
      if (a.typ !== 'sprache' || a.verarbeitung_status !== 'fertig') continue
      const voll = a.voll_extraktion as VollExtraktionCache | null | undefined
      const bereit = !!(voll && (voll.positionen || voll.__fehlgeschlagen))
      if (!bereit && !vollExtraktionWartetSeitRef.current.has(a.id)) {
        vollExtraktionWartetSeitRef.current.set(a.id, jetzt)
      }
    }
  }, [aufnahmen])

  // Erzwingt alle 1s einen Re-Render, SOLANGE mindestens eine Aufnahme auf
  // voll_extraktion wartet — damit der 5s-Hinweis und der 30s-Timeout-Fallback
  // (kartenAnsicht()) auch ohne neues Realtime-Event sichtbar werden.
  useEffect(() => {
    const wartendGerade = aufnahmen.some(a => {
      if (a.typ !== 'sprache' || a.verarbeitung_status !== 'fertig') return false
      const voll = a.voll_extraktion as VollExtraktionCache | null | undefined
      return !(voll && (voll.positionen || voll.__fehlgeschlagen))
    })
    if (!wartendGerade) return
    const interval = setInterval(() => setVollExtraktionTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [aufnahmen])

  async function loadData() {
    setLoading(true)
    const [{ data: quote }, { data: rows }] = await Promise.all([
      supabase.from('quotes').select('entwurf_gespeichert_am, customer:customers(name), quote_items(id, title, description, quantity, unit, unit_price, total_price, position)').eq('id', angebotId).single(),
      supabase.from('entwurf_aufnahmen').select('*').eq('angebot_id', angebotId).order('erstellt_am', { ascending: true }),
    ])

    setQuoteInfo(quote as typeof quoteInfo)

    if (rows?.length) {
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

  // ── Fertigstellen ────────────────────────────────────────────────────────

  async function fertigstellen(
    antworten: Record<string, RueckfragenAntwort | null> = {},
    rueckfragenUeberspringen = false,
  ) {
    // Läuft schon eine Berechnung (Doppel-Tap)? Dann diese zweite ignorieren.
    if (fertigstellenLaufendRef.current) return
    fertigstellenLaufendRef.current = true

    const alleAntworten = { ...gesammelteAntworten, ...antworten }
    if (Object.keys(antworten).length > 0) setGesammelteAntworten(alleAntworten)
    setScreen('fertigstellen_loading')
    setFehler('')
    setMassWarnungen([])
    setLoadingMsg('Alle Aufnahmen werden zusammengeführt…')

    const nochwarten = aufnahmen.some(a => a.typ === 'sprache' && a.verarbeitung_status === 'verarbeitung')
    if (nochwarten) {
      setLoadingMsg('Warte auf Transkription…')
      await new Promise(r => setTimeout(r, 3000))
    }

    setLoadingMsg('Positionen werden berechnet…')

    try {
      // Explizit die IDs der neuen Aufnahmen mitschicken — kein Timestamp-Vergleich im Backend nötig
      const neueIds = neueAufnahmen.filter(a => a.verarbeitung_status === 'fertig').map(a => a.id)

      const res = await fetch('/api/entwurf/generiere-positionen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          angebot_id: angebotId,
          aufnahmen_ids: neueIds,
          antworten: alleAntworten,
          basis_extraktion: basisExtraktion,
          rueckfragen_ueberspringen: rueckfragenUeberspringen,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as {
          error?: string
          fehlende_positionen?: Array<{ beschreibung: string; einheit: string }>
        }
        const fehlende = err.fehlende_positionen ?? []
        setFehler(fehlende.length > 0
          ? `Preis fehlt in deiner Preisdatenbank: ${fehlende.map(p => `${p.beschreibung} (${p.einheit})`).join(', ')}`
          : (err.error ?? 'Fehler beim Berechnen'))
        setScreen('timeline')
        return
      }

      const data = await res.json() as {
        positionen_count?: number
        rueckfragen?: RueckfrageItem[]
        keine_neuen?: boolean
        requires_input?: boolean
        basis_extraktion?: ExtrahierteDaten
        warnungen?: string[]
      }

      // Keine neuen Aufnahmen seit letzter Generierung → direkt zur Angebots-Ansicht
      if (data.keine_neuen) {
        router.push(`/angebot/${angebotId}`)
        return
      }

      const offeneRueckfragen = (data.rueckfragen ?? []).filter(r => r.frage)
      if (data.requires_input && offeneRueckfragen.length > 0) {
        setBasisExtraktion(data.basis_extraktion ?? null)
        setRueckfragen(offeneRueckfragen)
        setScreen('rueckfragen')
      } else if (data.warnungen && data.warnungen.length > 0) {
        // PM-010: nicht sofort weiterleiten, sonst sieht sie die Warnung nie —
        // erst zeigen, sie entscheidet selbst, ob sie trotzdem weiter will.
        setMassWarnungen(data.warnungen)
        setScreen('timeline')
      } else {
        router.push(`/angebot/${angebotId}`)
      }
    } catch {
      setFehler('Netzwerkfehler. Bitte nochmal versuchen.')
      setScreen('timeline')
    } finally {
      // Freigeben, damit ein bewusster erneuter Aufruf (z.B. nach
      // Rückfragen-Antworten oder nach einem Fehler) wieder möglich ist —
      // die Sperre soll nur GLEICHZEITIGE Doppel-Anfragen verhindern.
      fertigstellenLaufendRef.current = false
    }
  }

  // ── Aufnahme ─────────────────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true },
      })
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
        .find(m => MediaRecorder.isTypeSupported(m)) ?? ''
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        if (skipUploadRef.current) { skipUploadRef.current = false; return }
        await handleAudioStop(new Blob(chunksRef.current, { type: mimeType || mr.mimeType || 'audio/webm' }))
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
      setRecordingDauer(0)
      dauerTimerRef.current = setInterval(() => setRecordingDauer(d => d + 1), 1000)
    } catch {
      setFehler('Mikrofon-Zugriff nicht möglich. Bitte in den Browser-Einstellungen erlauben.')
    }
  }, [])

  function stopRecording() {
    mediaRef.current?.stop()
    setRecording(false)
    if (dauerTimerRef.current) clearInterval(dauerTimerRef.current)
  }

  // DC-031: Aufnahme abbrechen — Mikro sofort freigeben, NICHTS hochladen.
  // Anders als stopRecording() (stoppt UND lädt hoch).
  function cancelRecording() {
    skipUploadRef.current = true
    mediaRef.current?.stop()
    setRecording(false)
    if (dauerTimerRef.current) clearInterval(dauerTimerRef.current)
  }

  // PM-008: Ein früherer "Fertigstellen"-Versuch OHNE erkannte Positionen setzt
  // fehler = "Keine Positionen erkannt" und bleibt als rotes Banner stehen — auch
  // nachdem eine noch verarbeitende Aufnahme fertig wird und durchaus Positionen
  // liefert. Dann zeigt der Screen gleichzeitig das rote Fehler- und das grüne
  // Erfolgs-Banner ("✓ X Positionen erkannt"), was wie eine Race-Condition
  // aussieht, aber keine ist: `fehler` wurde einfach nie geräumt, weil nur
  // fertigstellen() (Zeile ~409) und die Upload-Fehlerpfade setFehler aufrufen,
  // nicht die Erfolgspfade. Hier gezielt NUR diese eine Meldung räumen, sobald
  // eine Aufnahme tatsächlich Positionen liefert — andere Fehler (Netzwerk,
  // fehlender Preis) sollen stehen bleiben, bis der Nutzer sie schließt oder
  // erneut auf Fertigstellen tippt.
  function raeumeStaleKeinePositionenFehler(positionen: ErkanntPosition[] | undefined) {
    if ((positionen ?? []).some(p => p.erkannt)) {
      setFehler(prev => prev === 'Keine Positionen erkannt' ? '' : prev)
    }
  }

  async function handleAudioStop(blob: Blob) {
    const tempId = `temp-${Date.now()}`
    const tempEntry: AufnahmeWithUrl = {
      id: tempId, angebot_id: angebotId, typ: 'sprache',
      audio_url: null, audio_dauer_sekunden: recordingDauer,
      transkript: null, erkannte_positionen: [], verarbeitung_status: 'verarbeitung',
      notiz_text: null, foto_url: null, foto_beschreibung: null,
      in_pdf: false, erstellt_am: new Date().toISOString(), geraet: geraet.current, sortierung: 0,
    }
    setAufnahmen(prev => [...prev, tempEntry])

    const fd = new FormData()
    fd.append('angebot_id', angebotId)
    const ext = blob.type.includes('mp4') || blob.type.includes('m4a') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm'
    fd.append('audio', blob, `aufnahme.${ext}`)
    fd.append('dauer_sekunden', String(recordingDauer))
    fd.append('geraet', geraet.current)

    // Ein Request macht alles (Upload + Whisper + Chips parallel im Backend).
    // Fire-and-forget: das Mikro ist sofort wieder frei, die Card zeigt den Status.
    fetch('/api/entwurf/aufnahme/upload', { method: 'POST', body: fd })
      .then(async res => {
        const data = await res.json().catch(() => ({})) as {
          id?: string; transkript?: string; positionen?: ErkanntPosition[]; error?: string
        }
        if (res.ok && data.id) {
          setAufnahmen(prev => prev.map(a => a.id === tempId ? {
            ...a, id: data.id!, transkript: data.transkript ?? null,
            erkannte_positionen: data.positionen ?? [], verarbeitung_status: 'fertig',
          } : a))
          raeumeStaleKeinePositionenFehler(data.positionen)
        } else if (data.id) {
          // Aufnahme existiert, aber keine Sprache erkannt → Fehler-Card mit Retry
          setAufnahmen(prev => prev.map(a => a.id === tempId ? { ...a, id: data.id!, verarbeitung_status: 'fehler' } : a))
        } else {
          setAufnahmen(prev => prev.filter(a => a.id !== tempId))
          setFehler(data.error ?? 'Upload fehlgeschlagen. Bitte nochmal versuchen.')
        }
      })
      .catch(() => {
        setAufnahmen(prev => prev.map(a => a.id === tempId ? { ...a, verarbeitung_status: 'fehler' } : a))
      })
  }

  // ── Zettel-Scan: Foto vom handschriftlichen Aufmaß → Vision liest ab ─────
  async function handleZettelUpload(file: File) {
    setZettelUploading(true)
    setFehler('')
    const tempId = `temp-zettel-${Date.now()}`
    const tempEntry: AufnahmeWithUrl = {
      id: tempId, angebot_id: angebotId, typ: 'foto',
      audio_url: null, audio_dauer_sekunden: null,
      transkript: null, erkannte_positionen: [], verarbeitung_status: 'verarbeitung',
      notiz_text: null, foto_url: null, foto_beschreibung: 'Aufmaß-Zettel',
      in_pdf: false, erstellt_am: new Date().toISOString(), geraet: geraet.current, sortierung: 0,
    }
    setAufnahmen(prev => [...prev, tempEntry])

    const fd = new FormData()
    fd.append('angebot_id', angebotId)
    fd.append('foto', file)
    fd.append('geraet', geraet.current)

    try {
      const res = await fetch('/api/entwurf/scan', { method: 'POST', body: fd })
      const data = await res.json() as { id?: string; transkript?: string; positionen?: ErkanntPosition[]; foto_url?: string | null; error?: string }

      if (!res.ok || !data.id) {
        setAufnahmen(prev => prev.filter(a => a.id !== tempId))
        setFehler(data.error ?? 'Zettel konnte nicht gelesen werden')
        return
      }

      // Signed-URL fürs Thumbnail holen
      let signedUrl: string | undefined
      if (data.foto_url) {
        const urlRes = await fetch('/api/entwurf/signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: [{ bucket: 'entwurf-fotos', path: data.foto_url }] }),
        })
        const urlData = await urlRes.json().catch(() => ({})) as { urls?: Record<string, string> }
        signedUrl = urlData.urls?.[data.foto_url]
      }

      setAufnahmen(prev => prev.map(a => a.id === tempId ? {
        ...a,
        id: data.id!,
        transkript: data.transkript ?? null,
        erkannte_positionen: data.positionen ?? [],
        verarbeitung_status: 'fertig',
        foto_url: data.foto_url ?? null,
        foto_signed_url: signedUrl,
      } : a))
      raeumeStaleKeinePositionenFehler(data.positionen)
    } catch {
      setAufnahmen(prev => prev.filter(a => a.id !== tempId))
      setFehler('Netzwerkfehler beim Zettel-Upload. Bitte nochmal versuchen.')
    } finally {
      setZettelUploading(false)
    }
  }

  function verarbeiteAufnahme(aufnahmeId: string) {
    fetch('/api/entwurf/aufnahme/verarbeite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aufnahme_id: aufnahmeId }),
    }).then(async res => {
      if (res.ok) {
        const data = await res.json() as { transkript?: string; positionen?: ErkanntPosition[] }
        setAufnahmen(prev => prev.map(a =>
          a.id === aufnahmeId ? { ...a, transkript: data.transkript ?? null, erkannte_positionen: data.positionen ?? [], verarbeitung_status: 'fertig' } : a
        ))
        raeumeStaleKeinePositionenFehler(data.positionen)
      } else {
        setAufnahmen(prev => prev.map(a => a.id === aufnahmeId ? { ...a, verarbeitung_status: 'fehler' } : a))
      }
    }).catch(() => {
      setAufnahmen(prev => prev.map(a => a.id === aufnahmeId ? { ...a, verarbeitung_status: 'fehler' } : a))
    })
  }

  function retryAufnahme(aufnahmeId: string) {
    setAufnahmen(prev => prev.map(a => a.id === aufnahmeId ? { ...a, verarbeitung_status: 'verarbeitung' } : a))
    verarbeiteAufnahme(aufnahmeId)
  }

  async function deleteAufnahme(aufnahmeId: string) {
    setDeleteBestaetigen(null)
    // Storage-Dateien mitlöschen, sonst bleiben verwaiste Audio/Foto-Dateien liegen
    const aufnahme = aufnahmen.find(a => a.id === aufnahmeId)
    if (aufnahme?.audio_url) {
      await supabase.storage.from('entwurf-audio').remove([aufnahme.audio_url])
    }
    if (aufnahme?.foto_url) {
      await supabase.storage.from('entwurf-fotos').remove([aufnahme.foto_url])
    }
    await supabase.from('entwurf_aufnahmen').delete().eq('id', aufnahmeId)
    setAufnahmen(prev => prev.filter(a => a.id !== aufnahmeId))
    // Wenn das die letzte Aufnahme war, gespeichert-Zeitstempel zurücksetzen
    const verbleibend = aufnahmen.filter(a => a.id !== aufnahmeId && a.typ === 'sprache')
    if (verbleibend.length === 0) {
      await supabase.from('quotes').update({ entwurf_gespeichert_am: null }).eq('id', angebotId)
    }
  }

  async function saveNotiz(text: string) {
    const res = await fetch('/api/entwurf/notiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ angebot_id: angebotId, text, geraet: geraet.current }),
    })
    if (res.ok) {
      const data = await res.json() as AufnahmeWithUrl
      setAufnahmen(prev => [...prev, data])
    }
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  const kundenname = (quoteInfo?.customer as { name?: string } | null)?.name
  const hatBestehendPositionen = (quoteInfo?.quote_items?.length ?? 0) > 0
  // DC-031: "Zurück" landete bisher IMMER auf /angebot/[id] — für ein frisches,
  // leeres Angebot (0 €, kein Kunde, keine Positionen — der Fall direkt nach
  // "+ Neues Angebot") ist das eine verwirrende Sackgasse. Nur wenn dieses
  // Angebot schon einen Kunden ODER bereits berechnete Positionen hat (also
  // wirklich schon "etwas ist", z. B. der Nachtrags-Fall über den
  // "Aufnahme"-Link in einem bestehenden Angebot), geht's zurück dorthin —
  // sonst zurück zum Dashboard, wo der Nutzer eigentlich herkam.
  const zielZurueck = (!kundenname && !hatBestehendPositionen) ? '/dashboard' : `/angebot/${angebotId}`
  // "Verwertbar" = fließt in die Angebots-Generierung: Sprache + Zettel-Scans
  // (typ 'foto' mit Transkript bzw. gerade in Verarbeitung). Reine Doku-Fotos nicht.
  const sprachen = aufnahmen.filter(a =>
    a.typ === 'sprache' ||
    (a.typ === 'foto' && (a.transkript != null || a.verarbeitung_status === 'verarbeitung' || a.verarbeitung_status === 'fehler'))
  )
  const alleTranskribiertOderFehler = sprachen.length > 0 && sprachen.every(a => a.verarbeitung_status === 'fertig' || a.verarbeitung_status === 'fehler')
  const nochVerarbeitung = sprachen.some(a => a.verarbeitung_status === 'verarbeitung' || a.verarbeitung_status === 'ausstehend')
  const letzteGenerierung = quoteInfo?.entwurf_gespeichert_am
  const neueAufnahmen = letzteGenerierung
    ? sprachen.filter(a => new Date(a.erstellt_am) > new Date(letzteGenerierung))
    : sprachen
  // CoS-002 Schritt 2 / DC-030-Nachtrag (2026-08-21): "Entwurf erstellen"
  // darf sich erst freischalten, wenn für jede neue Sprachaufnahme entweder
  // die geprüfte Extraktion da ist ODER endgültig feststeht, dass sie nicht
  // mehr kommt (Fehlschlag/Timeout — kartenAnsicht() behandelt beides als
  // 'bereit', fail-open). Sonst könnte ein schneller Nutzer klicken, bevor
  // voll_extraktion da ist, und würde ein ZWEITES, separates Warten am
  // Button erleben statt nur des einen auf der Karte (Sandys Rückfrage,
  // von der Designerin als harte Anforderung bestätigt).
  const jetztFuerWarten = Date.now()
  const nochVollExtraktion = neueAufnahmen.some(a =>
    kartenAnsicht(a, vollExtraktionWartetSeitRef.current.get(a.id), jetztFuerWarten).status === 'wartet_pruefung')
  // erkannteAnzahl zählt jetzt aus derselben Quelle wie die Karten-Anzeige
  // (kartenAnsicht) statt direkt aus der schnellen Chip-Vorschau — während
  // nochVollExtraktion ist das pro wartender Aufnahme 0 (siehe Banner unten,
  // das dafür einen eigenen, ehrlichen Zwischenzustand zeigt statt einer
  // möglicherweise falschen Zahl).
  const erkannteAnzahl = neueAufnahmen.reduce((sum, aufnahme) =>
    sum + kartenAnsicht(aufnahme, vollExtraktionWartetSeitRef.current.get(aufnahme.id), jetztFuerWarten).positionen.filter(p => p.erkannt).length, 0)
  const bearbeitungszeit = geschaetzteSekunden(erkannteAnzahl)
  // DC-009: 0 erkannte Positionen ist kein "bereit für den Entwurf" — vorher
  // stand hier trotzdem "✓ 0 Positionen erkannt", grün, mit aktivem Button.
  // Der Button erscheint jetzt nur noch, wenn wirklich etwas zu berechnen da ist.
  const kannFertigstellen = neueAufnahmen.length > 0 && !nochVerarbeitung && !nochVollExtraktion && erkannteAnzahl > 0
  const nichtsErkannt = alleTranskribiertOderFehler && !nochVollExtraktion && neueAufnahmen.length > 0 && !nochVerarbeitung && erkannteAnzahl === 0

  // CoS-002 Schritt 3, Mehrfach-Aufnahmen-Fall (2026-08-21): sobald "Entwurf
  // erstellen" für MEHRERE neue Aufnahmen klickbar wird (kannFertigstellen),
  // spekulativ den kombinierten Vorab-Aufruf anstoßen — bevor der Nutzer
  // tatsächlich klickt (siehe src/lib/kombinierte-extraktion-cache.ts).
  // Fire-and-forget: Antwort wird bewusst nicht ausgewertet, ein Fehlschlag
  // ist harmlos (generiere-positionen fällt beim Klick automatisch auf den
  // bisherigen frischen Kombi-Aufruf zurück). Während einer Rückfragen-Runde
  // (basisExtraktion gesetzt) nicht sinnvoll nutzbar — dort nicht feuern.
  useEffect(() => {
    if (basisExtraktion) return
    if (!kannFertigstellen || neueAufnahmen.length < 2) return
    const ids = neueAufnahmen.filter(a => a.verarbeitung_status === 'fertig').map(a => a.id).sort()
    if (ids.length < 2) return
    const key = ids.join(',')
    if (kombiVorabGefeuertRef.current === key) return
    kombiVorabGefeuertRef.current = key
    fetch('/api/entwurf/vorab-kombinieren', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ angebot_id: angebotId, aufnahmen_ids: ids }),
    }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kannFertigstellen, aufnahmen, quoteInfo, basisExtraktion])

  // ── DC-028: Raum-gruppierter Sammel-Bestand ──────────────────────────────
  // Pool aus bereits berechneten quote_items (echt) + Vorschau-Positionen
  // frischer, noch nicht "fertiggestellter" Aufnahmen (vorläufig) — dieselbe
  // Gruppierungsfunktion wie im fertigen Angebot, damit diese Ansicht
  // strukturell nie von der finalen Darstellung abweichen kann.
  const sammelPool = baueSammelPool(quoteInfo?.quote_items ?? [], neueAufnahmen, vollExtraktionWartetSeitRef.current, jetztFuerWarten)
  const pendingById = new Map(sammelPool.map(item => [item.id, item.pending]))
  const gruppen = gruppiereNachRaum(sammelPool)
  const gesamtPositionen = sammelPool.length

  type BannerTon = 'success' | 'mixed' | 'neutral'
  const bannerZustand: { ton: BannerTon; text: string } | null = (() => {
    // "Systemischer Fund" Punkt 3 / DC-010 (Head of Product Engineering,
    // 2026-08-20): der widersprüchliche rote+grüne Doppel-Banner entsteht,
    // weil dieser Banner aus `erkannteAnzahl` berechnet wird — Zahlen aus der
    // SCHNELLEN Chip-Vorschau (extrahiereChips) — während `fehler` u.a. vom
    // Server aus der UNABHÄNGIGEN, vollständigen Berechnung
    // (generiere-positionen → "Keine Positionen erkannt", 400) gesetzt wird.
    // Zwei getrennte GPT-Aufrufe auf denselben Text können strukturell
    // divergieren (exakt das in DC-028 als offene Architektur-Frage benannte
    // Problem) — das erklärt auch, warum es nur manchmal auftrat (PD-006:
    // 2 von 3 Fassaden-Durchläufen) und in einem späteren Nachtest ausblieb:
    // reine GPT-Nichtdeterminismus-Frage, keine echte Race-Condition wie
    // ursprünglich vermutet. `raeumeStaleKeinePositionenFehler` räumt einen
    // stehen gebliebenen Fehler nur auf, wenn DANACH eine Aufnahme fertig
    // verarbeitet wird — bleibt aber wirkungslos, wenn gar keine weitere
    // Aufnahme mehr verarbeitet wird (genau der PD-006-Fall). Fix hier folgt
    // Sandys eigener, schon in PD-006 formulierter Design-Regel: Fehler- und
    // Erfolgs-Banner dürfen nie gleichzeitig stehen — im Zweifel gewinnt der
    // zuletzt bestätigte, verlässlichere Zustand (hier: der Fehler aus der
    // echten Server-Berechnung, nicht die schnelle Vorschau-Zahl).
    if (fehler) return null
    if (!alleTranskribiertOderFehler || aufnahmen.length === 0 || recording) return null
    if (nichtsErkannt) {
      return { ton: 'neutral', text: 'Noch nichts erkannt — nochmal versuchen? Lauter oder mit mehr Details sprechen hilft oft.' }
    }
    // CoS-002 Schritt 2 / DC-030: eigener, ehrlicher Zwischenzustand statt
    // einer Zahl aus erkannteAnzahl, die während des Wartens auf
    // voll_extraktion künstlich niedrig (0 pro wartender Aufnahme) wäre.
    if (nochVollExtraktion) {
      return { ton: 'neutral', text: 'Wird geprüft — dauert kurz.' }
    }
    if (neueAufnahmen.length === 0) {
      return { ton: 'success', text: 'Alle Aufnahmen bereits verarbeitet — neue Aufnahme hinzufügen um mehr Positionen zu ergänzen.' }
    }
    if (hatBestehendPositionen) {
      return {
        ton: 'mixed',
        text: `${gesamtPositionen} ${gesamtPositionen === 1 ? 'Position' : 'Positionen'} — ${erkannteAnzahl} ${erkannteAnzahl === 1 ? 'neu, wird berechnet.' : 'neu, werden berechnet.'}`,
      }
    }
    return { ton: 'success', text: `${erkannteAnzahl} ${erkannteAnzahl === 1 ? 'Position' : 'Positionen'} erkannt — bereit für den Entwurf.` }
  })()

  // ── Zurück-Bestätigung Screen ─────────────────────────────────────────────

  function handleBackClick() {
    // DC-031: Eine laufende Aufnahme darf nicht einfach im Hintergrund
    // weiterlaufen (Mikro bliebe offen) — beim Verlassen der Seite wird sie
    // verworfen, nicht hochgeladen (der Nutzer wollte ja gerade zurück, nicht
    // fertig aufnehmen).
    if (recording) cancelRecording()
    // Wenn Aufnahmen vorhanden aber noch keine Positionen generiert → nachfragen
    const hatUnverarbeiteteAufnahmen = sprachen.length > 0 && !hatBestehendPositionen
    if (hatUnverarbeiteteAufnahmen) {
      setScreen('zurueck_bestaetigen')
    } else {
      router.push(zielZurueck)
    }
  }

  if (screen === 'zurueck_bestaetigen') {
    return (
      <div className="fixed inset-0 z-40 flex items-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setScreen('timeline')} />
        <div className="relative w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 shadow-2xl">
          <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" /></div>
          <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[20px] mb-2">Aufnahmen noch nicht ausgewertet</h2>
          <p className="text-[#2C2C2C]/50 font-semibold text-[14px] mb-6 leading-relaxed">
            Du hast {sprachen.length} {sprachen.length === 1 ? 'Aufnahme' : 'Aufnahmen'} — aber noch keine Positionen berechnet. Jetzt auswerten?
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setScreen('timeline'); fertigstellen() }}
              className="w-full bg-[#F5C400] text-[#2C2C2C] rounded-2xl py-4 font-extrabold text-[16px]"
            >
              Positionen berechnen →
            </button>
            <button
              onClick={() => router.push(zielZurueck)}
              className="w-full border-2 border-[#2C2C2C]/15 text-[#2C2C2C]/60 rounded-2xl py-3.5 font-extrabold text-[14px]"
            >
              Trotzdem zurück ohne Berechnen
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Rückfragen Screen ─────────────────────────────────────────────────────

  if (screen === 'rueckfragen' && rueckfragen.length > 0) {
    return (
      <RueckfragenScreen
        fragen={rueckfragen}
        onFertig={antworten => fertigstellen(antworten)}
        onUeberspringen={() => fertigstellen({}, true)}
        onZurueck={() => setScreen('timeline')}
      />
    )
  }

  // ── Loading Screen ────────────────────────────────────────────────────────

  if (screen === 'fertigstellen_loading') {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col items-center justify-center gap-4 px-5">
        <Loader2 size={36} color="#F5C400" className="animate-spin" />
        <div className="text-center">
          <p className="font-extrabold text-[#2C2C2C] text-[18px] mb-1">Angebot wird erstellt</p>
          <p className="text-[#2C2C2C]/50 font-semibold text-[14px]">{loadingMsg}</p>
        </div>
      </div>
    )
  }

  // ── Timeline Screen ───────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#2C2C2C]/8 px-4 pt-safe-top">
        <div className="flex items-center justify-between h-14">
          <button onClick={handleBackClick} className="flex items-center gap-1.5 text-[#2C2C2C]/60">
            <ArrowLeft size={18} />
            <span className="font-semibold text-[14px]">Zurück</span>
          </button>

          <div className="text-center">
            <div className="font-extrabold text-[#2C2C2C] text-[14px]">
              {kundenname ?? 'Aufmaß'}
            </div>
            {aufnahmen.length > 0 && (
              <div className="text-[11px] text-[#2C2C2C]/40 font-semibold">
                {gruppen
                  ? `${gruppen.raeume.length} ${gruppen.raeume.length === 1 ? 'Raum' : 'Räume'} · ${gesamtPositionen} ${gesamtPositionen === 1 ? 'Position' : 'Positionen'}`
                  : `${aufnahmen.length} ${aufnahmen.length === 1 ? 'Aufnahme' : 'Aufnahmen'}`}
              </div>
            )}
          </div>

          <div className="w-[72px]" />
        </div>
      </div>

      {/* Intro wenn noch keine Aufnahmen */}
      {!loading && aufnahmen.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-16 px-6 text-center">
          <div className="text-5xl mb-4">🎙</div>
          <div className="font-syne font-extrabold text-[#2C2C2C] text-[22px] mb-2">
            Einfach lossprechen
          </div>
          <div className="text-[#2C2C2C]/40 font-semibold text-[15px] leading-relaxed max-w-xs">
            Beschreib die Baustelle — Räume, Maße, was gemacht werden soll. Oder fotografier einfach deinen Aufmaß-Zettel. 📷
          </div>
          <div className="mt-6 flex flex-col gap-2 text-left w-full max-w-xs">
            {[
              '"Wohnzimmer 5×4 Meter, Wände und Decke streichen"',
              '"Bad komplett neu fliesen, ca. 8 Quadratmeter"',
              '"Flur Laminat verlegen, 12 qm, alte Fliesen raus"',
            ].map((hint, i) => (
              <div key={i} className="flex items-start gap-2 bg-white rounded-xl px-3 py-2.5 border border-[#2C2C2C]/5">
                <span className="text-[#F5C400] font-black shrink-0">→</span>
                <span className="text-[#2C2C2C]/60 font-semibold text-[13px] italic">{hint}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fehler */}
      {fehler && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-red-700 font-semibold text-[13px]">{fehler}</p>
          <button onClick={() => setFehler('')} className="ml-auto text-red-400"><X size={14} /></button>
        </div>
      )}

      {/* PM-010: Plausibilitäts-Warnung bei unrealistischen Raummaßen — blockiert nie, nur ein Hinweis */}
      {massWarnungen.length > 0 && (
        <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              {massWarnungen.map((w, i) => (
                <p key={i} className="text-amber-800 font-semibold text-[13px]">{w}</p>
              ))}
            </div>
            <button onClick={() => setMassWarnungen([])} className="ml-auto text-amber-400 shrink-0"><X size={14} /></button>
          </div>
          <button
            onClick={() => router.push(`/angebot/${angebotId}`)}
            className="self-start text-amber-700 font-bold text-[13px] underline"
          >
            Trotzdem weiter zum Angebot
          </button>
        </div>
      )}

      {/* Timeline */}
      <div className="flex-1 px-4 py-4 pb-36">
        {loading && (
          <div className="flex justify-center pt-12">
            <Loader2 size={24} className="animate-spin text-[#2C2C2C]/30" />
          </div>
        )}

        {/* DC-028: raum-gruppierter Sammel-Bestand — dieselbe Gruppierung wie im
            fertigen Angebot. Ohne erkennbare Räume (gruppen === null) Fallback
            auf die vorherige, ungruppierte Aufnahme-Liste — lieber nichts
            erfinden als eine Raum-Struktur vortäuschen, die nicht da ist. */}
        {gruppen ? (
          <>
            <div className="flex flex-col gap-3">
              {gruppen.raeume.map(raum => (
                <RaumKarte key={raum.raumName} raumName={raum.raumName} emoji={raum.emoji} items={raum.items} pendingById={pendingById} />
              ))}
              {gruppen.allgemein.length > 0 && (
                <RaumKarte raumName="Allgemein" emoji="📋" items={gruppen.allgemein} pendingById={pendingById} />
              )}
            </div>

            {/* Einzelne Aufnahmen — schlanke Chip-Leiste statt großer Kästen.
                Antippen öffnet die Details (Transkript, Audio, Löschen, Retry). */}
            <div className="mt-5">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2C2C2C]/35 mb-2">
                Aufnahmen ({aufnahmen.length})
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {aufnahmen.map(a => (
                  <AufnahmeChip key={a.id} aufnahme={a} wartetSeit={vollExtraktionWartetSeitRef.current.get(a.id)} onOpen={() => setAufnahmeDetail(a.id)} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {hatBestehendPositionen && (
              <div className="bg-[#2C2C2C] rounded-2xl px-4 py-3 flex items-center gap-3">
                <Check size={16} className="text-[#F5C400] shrink-0" strokeWidth={2.5} />
                <div>
                  <p className="text-white font-extrabold text-[13px]">
                    {quoteInfo?.quote_items?.length} Positionen bereits berechnet
                  </p>
                  <p className="text-white/50 font-semibold text-[12px] mt-0.5">
                    Neue Aufnahmen werden als weitere Positionen ergänzt.
                  </p>
                </div>
              </div>
            )}
            {aufnahmen.map(a => (
              <AufnahmeCard key={a.id} aufnahme={a} wartetSeit={vollExtraktionWartetSeitRef.current.get(a.id)} onDelete={() => setDeleteBestaetigen(a.id)} onRetry={() => retryAufnahme(a.id)} />
            ))}
          </div>
        )}

        {/* Aufnahme-Indikator */}
        {recording && (
          <div className="mt-3 bg-white rounded-2xl border border-[#2C2C2C]/5 px-4 py-3 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="font-extrabold text-[#2C2C2C] text-[14px]">
              Aufnahme läuft — {recordingDauer}s
            </span>
            <span className="text-[#2C2C2C]/40 font-semibold text-[12px]">Nochmal tippen zum Stoppen</span>
          </div>
        )}

        {/* Status wenn alle Aufnahmen fertig — nicht während laufender Aufnahme.
            DC-009: 0 erkannte Positionen ist kein grüner Erfolg mehr, sondern ein
            neutraler Hinweis. DC-010: eine einzige Quelle (gesamtPositionen /
            erkannteAnzahl) statt zwei separat geführter Zähler. */}
        {bannerZustand && (
          <div className={`mt-3 rounded-2xl border px-4 py-3 flex items-center gap-2 ${
            bannerZustand.ton === 'success' ? 'bg-[#EDFAF0] border-[#1A7A38]/20'
            : bannerZustand.ton === 'mixed' ? 'bg-[#F5C400]/10 border-[#F5C400]/40'
            : 'bg-[#2C2C2C]/5 border-[#2C2C2C]/10'
          }`}>
            {bannerZustand.ton === 'neutral'
              ? <AlertCircle size={14} className="text-[#2C2C2C]/40 shrink-0" />
              : <Check size={14} className={`shrink-0 ${bannerZustand.ton === 'mixed' ? 'text-[#8B7000]' : 'text-[#1A7A38]'}`} />}
            <span className={`text-[13px] font-semibold ${
              bannerZustand.ton === 'success' ? 'text-[#1A7A38]' : bannerZustand.ton === 'mixed' ? 'text-[#8B7000]' : 'text-[#2C2C2C]/60'
            }`}>{bannerZustand.text}</span>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pt-3 pb-8 flex flex-col gap-3" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>

        {/* Positionen-berechnen-Button — NICHT während laufender Aufnahme (verwirrt:
            erst fertig aufnehmen, dann berechnen) */}
        {kannFertigstellen && !recording && (
          <button
            onClick={() => fertigstellen()}
            className="w-full bg-[#F5C400] text-[#2C2C2C] rounded-2xl py-4 font-extrabold text-[16px] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-lg shadow-[#F5C400]/30"
          >
            <span className="flex flex-col items-center leading-tight">
              <span>✓ {erkannteAnzahl} {hatBestehendPositionen ? 'neue ' : ''}{erkannteAnzahl === 1 ? 'Position' : 'Positionen'} erkannt</span>
              <span className="text-[12px] font-bold opacity-65 mt-1">{hatBestehendPositionen ? 'Entwurf aktualisieren' : 'Entwurf erstellen'} · ca. {bearbeitungszeit} Sekunden</span>
            </span>
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        )}

        {/* Aufnahme-Button */}
        {recording ? (
          <div className="flex items-center gap-2">
            {/* DC-031: Aufnahme abbrechen, ohne sie hochzuladen — vorher gab es
                während einer laufenden Aufnahme keine Möglichkeit, sie zu
                verwerfen; "Tippen zum Stoppen" hat immer hochgeladen. */}
            <button
              onClick={cancelRecording}
              aria-label="Aufnahme abbrechen"
              className="shrink-0 w-14 h-[60px] flex items-center justify-center rounded-2xl bg-white border-2 border-[#2C2C2C]/10 text-[#2C2C2C]/50 active:scale-95 transition-all"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
            <button
              onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-3 rounded-2xl font-extrabold text-[17px] bg-red-500 text-white py-5 shadow-xl shadow-red-300 scale-[1.02] transition-all select-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              Tippen zum Stoppen — {recordingDauer}s
            </button>
          </div>
        ) : (
          <div className="flex items-end justify-center gap-8">
            {/* Zettel scannen */}
            <div className="flex flex-col items-center gap-2 pb-[3px]">
              <button
                onClick={() => zettelInputRef.current?.click()}
                disabled={zettelUploading}
                className="w-14 h-14 rounded-full bg-white border-2 border-[#2C2C2C]/10 flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                {zettelUploading
                  ? <Loader2 size={22} className="animate-spin text-[#2C2C2C]/40" />
                  : <Camera size={22} strokeWidth={2} className="text-[#2C2C2C]" />}
              </button>
              <span className="text-[#2C2C2C]/40 font-semibold text-[12px]">Zettel</span>
            </div>

            {/* Aufnehmen */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={startRecording}
                
                className="w-20 h-20 rounded-full bg-[#2C2C2C] flex items-center justify-center shadow-2xl shadow-black/30 active:scale-95 transition-all disabled:opacity-50"
              >
                <Mic size={32} strokeWidth={2} className="text-white" />
              </button>
              <span className="text-[#2C2C2C]/40 font-semibold text-[13px]">
                {nichtsErkannt ? 'Nochmal aufnehmen' : aufnahmen.length > 0 ? 'Weitere Aufnahme' : 'Aufnehmen'}
              </span>
            </div>

            {/* Platzhalter für Symmetrie */}
            <div className="w-14 pb-[3px]" />
          </div>
        )}
        <input
          ref={zettelInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleZettelUpload(f); e.target.value = '' }}
        />
      </div>

      {showNotiz && <NotizModal onSave={saveNotiz} onClose={() => setShowNotiz(false)} />}

      {/* DC-028: Aufnahme-Detail-Sheet — aufgerufen über die Chip-Leiste, zeigt
          dieselbe AufnahmeCard wie vorher (Transkript, Audio, Löschen, Retry),
          nur nicht mehr fest in der Timeline, sondern bei Bedarf. */}
      {aufnahmeDetail && (() => {
        const a = aufnahmen.find(x => x.id === aufnahmeDetail)
        if (!a) return null
        return (
          <div className="fixed inset-0 z-40 flex items-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAufnahmeDetail(null)} />
            <div className="relative w-full max-h-[85dvh] overflow-y-auto bg-[#F7F7F5] rounded-t-3xl px-4 pt-4 pb-8 shadow-2xl">
              {/* DC-031: eigener, eindeutiger Schließen-Button — die einzige
                  vorherige Möglichkeit, dieses Sheet zu schließen, ohne die
                  Aufnahme zu löschen, war ein Tap auf den dunklen Hintergrund
                  (nicht erkennbar). Bewusst als Text statt als "X", weil die
                  Karte selbst schon ein "X" hat — das aber löscht, nicht
                  schließt (siehe onDelete unten). Zwei optisch gleiche X in
                  einem Sheet mit unterschiedlicher Bedeutung wäre die nächste
                  Falle gewesen. */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-16" />
                <div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" />
                <button
                  onClick={() => setAufnahmeDetail(null)}
                  className="w-16 text-right text-[#2C2C2C]/40 font-semibold text-[13px]"
                >
                  Schließen
                </button>
              </div>
              <AufnahmeCard
                aufnahme={a}
                wartetSeit={vollExtraktionWartetSeitRef.current.get(a.id)}
                onDelete={() => { setAufnahmeDetail(null); setDeleteBestaetigen(a.id) }}
                onRetry={() => retryAufnahme(a.id)}
              />
            </div>
          </div>
        )
      })()}

      {/* Lösch-Bestätigung Bottom-Sheet */}
      {deleteBestaetigen && (
        <div className="fixed inset-0 z-40 flex items-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteBestaetigen(null)} />
          <div className="relative w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 shadow-2xl">
            <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" /></div>
            <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[20px] mb-2">Aufnahme löschen?</h2>
            <p className="text-[#2C2C2C]/50 font-semibold text-[14px] mb-6 leading-relaxed">
              Die Aufnahme wird endgültig gelöscht. Bereits berechnete Positionen im Angebot bleiben erhalten.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => deleteAufnahme(deleteBestaetigen)}
                className="w-full bg-red-500 text-white rounded-2xl py-4 font-extrabold text-[16px] active:scale-[0.98] transition-all"
              >
                Löschen
              </button>
              <button
                onClick={() => setDeleteBestaetigen(null)}
                className="w-full border-2 border-[#2C2C2C]/15 text-[#2C2C2C]/60 rounded-2xl py-3.5 font-extrabold text-[14px]"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
