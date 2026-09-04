'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Quote, QuoteItem, Company, Customer, Baustelle, EntwurfAufnahme } from '@/lib/types'
import { DRAFT_STATUSES, SENT_STATUSES, waehlbareStatus, getStatusInfo } from '@/lib/status'
import { statusPatch, type AblehnungsGrund } from '@/lib/status-uebergang'
import { aktualisiereProzentZuschlaege, istProzentZuschlag } from '@/lib/zuschlag-basis'
import {
  Download, Share2, Trash2, FileText, Link2, Phone, Check, Pencil, X,
  Plus, ChevronDown, Copy, Mic, Loader2, Image as ImageIcon,
  Camera, AlertTriangle, GripVertical, MoreHorizontal, Percent, Tag, Settings,
} from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { gruppiereNachStruktur } from '@/lib/angebot-struktur'
import type { EmpfehlungDefault } from '@/lib/empfehlungen-defaults'
import { ermittleHandaenderungen } from '@/lib/manuelle-positionen'
import { normalisierePreistext } from '@/lib/preis-matcher'
import VorschauUndVersand from '@/components/VorschauUndVersand'
import { ConfirmSheet } from '@/components/ConfirmSheet'
import { Toast } from '@/components/Toast'
import { RaumGrundrissEditor } from '@/components/RaumGrundrissEditor'
import {
  type RaumDimension, type RaumModus,
  berechneQuantityFuerItem, berechneRaumMasse,
} from '@/lib/raum-geometrie'
import { materialFuerPosition } from '@/lib/material-mapping'
import { getOrCreateErstbaustelle } from '@/lib/baustellen'

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null; share_token?: string; sent_via?: string[] }
  company: Company | null
  quoteNumber: string
}

interface EditItem {
  id: string
  position: number
  title: string
  description: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  price_item_id?: string | null
  confidence?: number
  berechnungsweg?: string | null
  annahmen?: string[]
  /** DC-027: true = vom Tool ergänzt (nicht gesagt) -> "Vorschlag"-Badge. */
  automatisch_ergaenzt?: boolean
}

// DC-003: eigene STATUS_CONFIG/DRAFT_STATUSES/SENT_STATUSES kamen bisher raus
// aus src/lib/status.ts — eine von fünf Kopien im Produkt, die sich beim
// selben Status in Label UND Farbe widersprachen. Jetzt importiert, keine
// lokale Kopie mehr.

const VIA_LABELS: Record<string, string> = {
  email: '✉️ E-Mail', whatsapp: '💬 WhatsApp', link: '🔗 Link',
  lexware: 'Lexware Office', lexoffice: 'Lexoffice', sevdesk: 'sevDesk', fastbill: 'FastBill',
  billomat: 'Billomat', papierkram: 'Papierkram', easybill: 'Easybill',
}

const UNITS = ['m²', 'lfdm', 'Stk', 'Stunde', 'pauschal', 'm³', 'kg', 'ltr', 'Rolle', 'Satz']

function fmt(n: number) { return n.toFixed(2).replace('.', ',') + ' €' }
function fmtZahl(n: number) { return n.toFixed(2).replace('.', ',') }
function round2(n: number) { return Math.round(n * 100) / 100 }

// ── Raum-Dimensionen ──────────────────────────────────────────────────────────
// RaumDimension, Geometrie + Mengen-Berechnung liegen jetzt in @/lib/raum-geometrie

// Ein einzelnes inline-editierbares Zahlenfeld
function InlineNum({ value, label, suffix, onCommit }: { value: number | undefined; label: string; suffix?: string; onCommit: (val: number | undefined) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value ?? ''))

  function commit() {
    const n = parseFloat(draft.replace(',', '.'))
    onCommit(isNaN(n) || n <= 0 ? undefined : n)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
        autoFocus
        className="w-12 text-center bg-yellow/20 border border-yellow rounded text-[12px] font-extrabold text-anthracite outline-none px-1 py-0.5"
      />
    )
  }
  const missing = value == null
  return (
    <button
      onClick={() => { setDraft(String(value ?? '')); setEditing(true) }}
      className={`text-[12px] font-extrabold rounded px-1.5 py-0.5 transition-colors ${
        missing ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200' : 'text-anthracite bg-anthracite/6 hover:bg-yellow/20'
      }`}
      title={missing ? `${label} fehlt — tippen zum Eintragen` : label}
    >
      {missing ? '!' : `${String(value).replace('.', ',')}${suffix ?? ''}`}
    </button>
  )
}

function RaumDimensionenZeile({
  dim,
  onChange,
  onGrundriss,
  wandRelevant = true,
}: {
  raumName?: string
  dim: RaumDimension
  onChange: (patch: Partial<RaumDimension>) => void
  onGrundriss: () => void
  /** Hat der Raum Wand-/Deckenarbeiten? Bei reinem Boden nur das Boden-Feld zeigen. */
  wandRelevant?: boolean
}) {
  // Vorhandene Raummaße haben Vorrang. Der Flächenmodus ist nur für Fälle,
  // in denen wirklich ausschließlich fertige Flächen genannt wurden.
  // 'wand' kommt ausschließlich aus der Aufnahme (Fassade/Einzelwand, siehe
  // DC-024) — kein Fallback hierher, das entscheidet nie die Zeilen-Logik
  // selbst, nur ein explizit gesetztes dim.modus.
  const modus: RaumModus = dim.modus
    ?? (((dim.breite ?? 0) > 0 && (dim.laenge ?? 0) > 0)
      ? 'rechteck'
      : (((dim.wandflaeche ?? 0) > 0 || (dim.bodenflaeche ?? 0) > 0) ? 'flaeche' : 'rechteck'))
  const masse = berechneRaumMasse(dim)
  const istWand = modus === 'wand'

  // „So gerechnet"-Zeile für den Wand-Chip (DC-024-Konzept) — reine
  // Anzeige-Ableitung aus dem bereits berechneten Netto-Wert, dupliziert
  // keine Öffnungs-Konstanten aus raum-geometrie.ts.
  const wandRechnungText = (() => {
    if (!istWand || !dim.laenge || dim.laenge <= 0 || masse.wandflaeche == null) return null
    const brutto = round2(dim.laenge * masse.hoehe)
    const abzug = round2(brutto - masse.wandflaeche)
    const oeffnungen: string[] = []
    if ((dim.tueren ?? 0) > 0) oeffnungen.push(`${dim.tueren} ${dim.tueren === 1 ? 'Tür' : 'Türen'}`)
    if ((dim.fenster ?? 0) > 0) oeffnungen.push(`${dim.fenster} Fenster`)
    const basis = `${fmtZahl(dim.laenge)} m × ${fmtZahl(masse.hoehe)} m`
    if (abzug > 0 && oeffnungen.length > 0) {
      return `${basis} − ${oeffnungen.join(', ')} (${fmtZahl(abzug)} m²) = ${fmtZahl(masse.wandflaeche)} m²`
    }
    return `${basis} = ${fmtZahl(masse.wandflaeche)} m²`
  })()

  return (
    <div className="px-4 pb-2 pt-0.5 flex flex-col gap-1.5">
      {/* Modus-Umschalter — bei einer Wand/Fassade kein Umschalter, das
          entscheidet die Aufnahme, nicht der Handwerker (DC-024). Statt
          drei bedeutungslosen Tabs nur ein kurzer Hinweis + Ausstieg für
          den Fall, dass die Erkennung danebenlag. */}
      {istWand ? (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-anthracite/35">Wand / Fassade</span>
          <button
            onClick={() => onChange({ modus: 'rechteck' })}
            className="text-[10px] font-bold text-anthracite/35 hover:text-anthracite/60 underline decoration-dotted transition-colors"
          >
            Kein Wand-Objekt? Als Raum bearbeiten
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 self-start bg-anthracite/5 rounded-lg p-0.5">
          {/* DC-036 (Sandy, 2026-08-29): "Raumform" hat den Grundriss-Zeichner
              (Vorlagen L-/U-Form + freies Wand-für-Wand, siehe
              RaumGrundrissEditor) dahinter versteckt, ohne dass der Name das
              verrät — wer eine Nische oder einen Erker hat, sucht eher nach
              "unregelmäßig" als nach "Form". Umbenannt, damit die Zeile
              selbst schon zeigt, wofür sie da ist. */}
          {([
            { id: 'rechteck', label: 'Raummaße' },
            { id: 'flaeche', label: 'Flächen eingeben' },
            { id: 'grundriss', label: '📐 Unregelmäßig' },
          ] as { id: RaumModus; label: string }[]).map(m => (
            <button
              key={m.id}
              onClick={() => m.id === 'grundriss' ? onGrundriss() : onChange({ modus: m.id })}
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md transition-colors ${
                modus === m.id ? 'bg-white text-anthracite shadow-sm' : 'text-anthracite/40 hover:text-anthracite/70'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Felder je nach Modus */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {modus === 'rechteck' && (
          <>
            <InlineNum value={dim.breite} label="Breite" onCommit={v => onChange({ breite: v })} />
            <span className="text-[11px] text-anthracite/30 font-bold">×</span>
            <InlineNum value={dim.laenge} label="Länge" onCommit={v => onChange({ laenge: v })} />
            <span className="text-[11px] text-anthracite/40 font-semibold">m</span>
          </>
        )}

        {modus === 'flaeche' && (
          <>
            {wandRelevant && (
              <>
                <span className="text-[11px] text-anthracite/40 font-semibold">Wandfläche fertig</span>
                <InlineNum value={dim.wandflaeche} label="Wandfläche (fertig, ohne Fenster/Türen)" suffix=" m²" onCommit={v => onChange({ wandflaeche: v })} />
                <span className="text-anthracite/20 mx-0.5">·</span>
              </>
            )}
            <span className="text-[11px] text-anthracite/40 font-semibold">Boden-/Deckenfläche</span>
            <InlineNum value={dim.bodenflaeche} label="Bodenfläche" suffix=" m²" onCommit={v => onChange({ bodenflaeche: v })} />
          </>
        )}

        {modus === 'grundriss' && (
          <button onClick={onGrundriss} className="flex items-center gap-1.5 text-[12px] font-extrabold text-anthracite bg-anthracite/6 hover:bg-yellow/20 rounded px-2 py-0.5 transition-colors">
            📐 {dim.grundriss?.length ? `${dim.grundriss.filter(w => w.laenge > 0).length} Wände · ${masse.bodenflaeche ?? '?'} m²` : 'Grundriss zeichnen'}
          </button>
        )}

        {/* Wand-Chip (DC-024): nur Länge + Höhe einer einzelnen Wand, kein
            Breite-Feld (das gibt es bei einer Wand konzeptionell nicht,
            also auch kein „!" mehr dafür). Türen/Fenster wie gehabt. */}
        {istWand && (
          <>
            <span className="text-[11px] text-anthracite/40 font-semibold">Wandlänge</span>
            <InlineNum value={dim.laenge} label="Wandlänge" suffix=" m" onCommit={v => onChange({ laenge: v })} />
            <span className="text-anthracite/20 mx-0.5">·</span>
            <span className="text-[11px] text-anthracite/40 font-semibold">Wandhöhe</span>
            <InlineNum value={dim.hoehe} label="Wandhöhe" suffix=" m" onCommit={v => onChange({ hoehe: v })} />
            <span className="text-anthracite/20 mx-0.5">·</span>
            <span className="text-[11px] text-anthracite/40 font-semibold">Türen</span>
            {/* waende[]-Extraktion kennt gar kein Türen-Feld (siehe
                generiere-positionen/route.ts) — fehlend heißt hier "wurde nie
                gefragt", nicht "echte Lücke", und die allermeisten Fassaden
                haben ohnehin keine Tür. Default 0 statt "!", damit genau die
                Art Fehlanzeige nicht zurückkommt, die DC-024 beheben soll.
                Tippen zum Eintragen bleibt möglich, falls doch eine Tür da ist. */}
            <InlineNum value={dim.tueren ?? 0} label="Türen" onCommit={v => onChange({ tueren: v })} />
            <span className="text-anthracite/20 mx-0.5">·</span>
            <span className="text-[11px] text-anthracite/40 font-semibold">Fenster</span>
            <InlineNum value={dim.fenster} label="Fenster" onCommit={v => onChange({ fenster: v })} />
          </>
        )}

        {/* Höhe/Öffnungen nur bei Wandarbeiten (Wandfläche braucht Höhe; Fenster/Türen
            werden von der Wandfläche abgezogen). Reiner Bodenauftrag braucht sie nicht.
            Für 'wand' oben bereits als eigener Block gerendert. */}
        {!istWand && wandRelevant && !(modus === 'flaeche' && (dim.wandflaeche ?? 0) > 0) && (
          <>
            <span className="text-anthracite/20 mx-0.5">·</span>
            <span className="text-[11px] text-anthracite/40 font-semibold">Raumhöhe</span>
            <InlineNum value={dim.hoehe} label="Deckenhöhe" suffix=" m" onCommit={v => onChange({ hoehe: v })} />
            <span className="text-anthracite/20 mx-0.5">·</span>
            <span className="text-[11px] text-anthracite/40 font-semibold">Türen</span>
            <InlineNum value={dim.tueren} label="Türen" onCommit={v => onChange({ tueren: v })} />
            <span className="text-anthracite/20 mx-0.5">·</span>
            <span className="text-[11px] text-anthracite/40 font-semibold">Fenster</span>
            <InlineNum value={dim.fenster} label="Fenster" onCommit={v => onChange({ fenster: v })} />
          </>
        )}
      </div>

      {/* „So gerechnet" — direkt am Wand-Chip, dasselbe Vertrauens-Element,
          das in der Positionsansicht schon gut funktioniert (DC-023-Nebenfund),
          jetzt eine Stufe früher statt erst dort. */}
      {wandRechnungText && (
        <div className="text-[11px] font-bold text-anthracite/60 bg-yellow/10 border border-yellow/25 rounded-lg px-2.5 py-1.5 w-fit">
          So gerechnet: <span className="text-anthracite font-extrabold">{wandRechnungText}</span>
        </div>
      )}
    </div>
  )
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// DC-039: Live-Suche für "+ Position" gegen die schon geladene
// Preisdatenbank (priceItems) — reine Vorfilterung/Sortierung, kein
// Netzwerk-Aufruf. normalisierePreistext kommt aus dem bestehenden
// Preis-Matcher (preis-matcher.ts), der fürs KI-Extraktions-Matching
// gebaut wurde — Synonyme/Normalisierung hier bewusst wiederverwendet statt
// neu erfunden.
type PreisKatalogEintrag = { id: string; title: string; unit: string; unit_price: number }
function sucheVorschlaege(query: string, katalog: PreisKatalogEintrag[]): PreisKatalogEintrag[] {
  const q = normalisierePreistext(query)
  if (!q) return []
  const qWoerter = q.split(' ').filter(Boolean)
  if (qWoerter.length === 0) return []
  const bewertet = katalog.map(eintrag => {
    const t = normalisierePreistext(eintrag.title)
    if (!t) return { eintrag, score: 0 }
    let score = 0
    if (t.startsWith(q)) score = 1
    else if (t.includes(q)) score = 0.9
    else {
      const tWoerter = t.split(' ')
      const treffer = qWoerter.filter(w => tWoerter.some(tw => tw.startsWith(w))).length
      score = treffer === 0 ? 0 : 0.5 * (treffer / qWoerter.length)
    }
    return { eintrag, score }
  }).filter(x => x.score > 0)
  bewertet.sort((a, b) => b.score - a.score)
  return bewertet.slice(0, 6).map(x => x.eintrag)
}

// ── Sortierbare Position ──────────────────────────────────────────────────────
function SortableItem({ item, titleOverride, editingId, setEditingId, updateEditItem, removeEditItem, vatRate, onUnitPick, onInfo, onAddMaterial, onAddPrice, priceItems, onPreisVorschlag, onNeuePosition }: {
  item: EditItem
  titleOverride?: string
  editingId: string | null
  setEditingId: (id: string | null) => void
  updateEditItem: (id: string, field: keyof EditItem, value: string | number) => void
  removeEditItem: (id: string) => void
  vatRate: number
  onUnitPick: (id: string) => void
  onInfo: (id: string) => void
  onAddMaterial: (item: EditItem) => void
  onAddPrice: (item: EditItem) => void
  priceItems: PreisKatalogEintrag[]
  onPreisVorschlag: (itemId: string, vorschlag: { title: string; unit: string; unit_price: number; price_item_id: string }) => void
  onNeuePosition: (itemId: string, title: string, unit: string, unitPrice: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const isEditing = editingId === item.id
  const isUnsure = (item.confidence ?? 1) < 0.7
  // DC-041: bei einer raumgruppierten Position (Titel trägt intern ein
  // " — Raumname"-Suffix, siehe angebot-gruppierung.ts) zeigt/bearbeitet
  // das Eingabefeld NUR den sichtbaren Basis-Titel (`titleOverride`), nicht
  // den vollen Rohtitel — sonst stünde z. B. bei einem gerade per "Raum
  // hinzufügen" angelegten Platzhalter wortwörtlich "— Schlafzimmer" im
  // Titelfeld. `raumSuffix` merkt sich den abgeschnittenen Teil, damit er
  // beim Speichern automatisch wieder drangehängt wird und die
  // Raum-Zuordnung erhalten bleibt.
  const basisTitel = titleOverride ?? item.title
  const dashMatch = item.title.match(/\s+[-–—]\s+.+$/)
  const raumSuffix = (titleOverride !== undefined && dashMatch && item.title.slice(0, dashMatch.index!).trim() === titleOverride)
    ? dashMatch[0]
    : ''
  const materialVorschlag = materialFuerPosition(basisTitel)
  const preisFehlt = !item.price_item_id && item.unit_price <= 0

  // DC-039: nur eine frisch per "+ Position" angelegte, noch nicht mit der
  // Preisdatenbank verknüpfte Zeile bekommt die Such-Vorschläge — bei einer
  // bestehenden/KI-erkannten Position soll beim Antippen nicht plötzlich ein
  // Dropdown aufgehen.
  const istNeueSuchePosition = item.id.startsWith('new-') && !item.price_item_id
  const [sucheOffen, setSucheOffen] = useState(false)
  const [neuAnlegenModus, setNeuAnlegenModus] = useState(false)
  const [neuEinheit, setNeuEinheit] = useState('m²')
  const [neuPreisText, setNeuPreisText] = useState('')
  const vorschlaege = istNeueSuchePosition && sucheOffen ? sucheVorschlaege(basisTitel, priceItems) : []

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-t border-anthracite/5 px-4 py-3 relative ${isUnsure ? 'border-l-4 border-l-yellow' : ''}`}
      onClick={() => !isEditing && setEditingId(item.id)}
    >
      {isUnsure && (
        <div className="flex items-center gap-1 mb-1">
          <AlertTriangle size={11} className="text-yellow" strokeWidth={3} />
          <span className="text-[10px] font-black text-yellow">KI unsicher — bitte prüfen</span>
        </div>
      )}

      {isEditing ? (
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0 relative">
            <input
              value={basisTitel}
              onChange={e => { updateEditItem(item.id, 'title', e.target.value + raumSuffix); if (istNeueSuchePosition) setNeuAnlegenModus(false) }}
              onFocus={() => istNeueSuchePosition && setSucheOffen(true)}
              onBlur={() => setTimeout(() => setSucheOffen(false), 150)}
              placeholder={istNeueSuchePosition ? 'Was wurde gemacht? z. B. Wand streichen…' : undefined}
              className="w-full font-bold text-anthracite bg-transparent focus:outline-none text-sm border-b border-yellow pb-0.5 mb-2"
              autoFocus
            />

            {/* DC-039: Live-Vorschläge aus der Preisdatenbank für eine neue,
                noch unverknüpfte Position — Auswahl übernimmt Titel/Einheit/
                Preis sofort, sonst inline "neu anlegen". */}
            {istNeueSuchePosition && sucheOffen && !neuAnlegenModus && basisTitel.trim() && (
              <div
                className="absolute left-0 right-0 top-full z-20 -mt-1 bg-white rounded-xl shadow-lg border border-anthracite/10 max-h-64 overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                {vorschlaege.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    // DC-039-Fix: onMouseDown+preventDefault statt onClick —
                    // ein normaler Klick lässt das Titelfeld ZUERST den Fokus
                    // verlieren (Tastatur schließt sich auf dem Handy, Seite
                    // reflowed), bevor der Klick registriert wird, wodurch
                    // der Tipp ins Leere ging (Sandys gemeldeter Bug:
                    // "wird angezeigt, aber Klick tut nichts"). preventDefault
                    // beim mousedown verhindert den Fokusverlust komplett.
                    onMouseDown={e => { e.preventDefault(); onPreisVorschlag(item.id, { title: v.title, unit: v.unit, unit_price: v.unit_price, price_item_id: v.id }); setSucheOffen(false) }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-yellow/10 border-b border-anthracite/5 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-bold text-anthracite truncate">{v.title}</div>
                      <div className="text-[10px] font-semibold text-anthracite/40">{v.unit}</div>
                    </div>
                    <div className="text-[12.5px] font-black text-anthracite shrink-0">
                      {v.unit_price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); setNeuEinheit('m²'); setNeuPreisText(''); setNeuAnlegenModus(true) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left bg-bg hover:bg-yellow/15"
                >
                  <span className="w-5 h-5 rounded-full bg-yellow flex items-center justify-center text-[12px] font-black shrink-0">+</span>
                  <span className="text-[11.5px] font-bold text-anthracite">Neue Position „{basisTitel.trim()}" anlegen</span>
                </button>
              </div>
            )}

            {istNeueSuchePosition && neuAnlegenModus && (
              <div className="bg-bg rounded-xl p-3 mb-2" onClick={e => e.stopPropagation()}>
                <div className="text-[11.5px] font-bold text-anthracite mb-2">„{basisTitel.trim()}" neu anlegen</div>
                <div className="flex gap-2 mb-2">
                  <select
                    value={neuEinheit}
                    onChange={e => setNeuEinheit(e.target.value)}
                    className="bg-white rounded-lg px-2 py-2 text-[12px] font-bold flex-1 focus:outline-none focus:ring-2 focus:ring-yellow"
                  >
                    <option value="m²">m²</option>
                    <option value="lfdm">lfdm</option>
                    <option value="Stk">Stk</option>
                    <option value="pauschal">pauschal</option>
                    <option value="Std">Std</option>
                  </select>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Preis pro Einheit"
                    value={neuPreisText}
                    onChange={e => setNeuPreisText(e.target.value)}
                    className="bg-white rounded-lg px-2 py-2 text-[12px] font-bold flex-1 focus:outline-none focus:ring-2 focus:ring-yellow"
                  />
                </div>
                <button
                  type="button"
                  disabled={!(Number(neuPreisText.replace(',', '.')) > 0)}
                  onMouseDown={e => {
                    e.preventDefault()
                    onNeuePosition(item.id, basisTitel.trim(), neuEinheit, Number(neuPreisText.replace(',', '.')))
                    setNeuAnlegenModus(false)
                    setSucheOffen(false)
                  }}
                  className="w-full bg-anthracite text-white rounded-lg py-2 text-[12px] font-black disabled:opacity-30"
                >
                  ✓ Anlegen &amp; übernehmen
                </button>
                <div className="text-[10px] font-semibold text-anthracite/40 mt-1.5 text-center">
                  Wird direkt in deiner Preisdatenbank gespeichert.
                </div>
              </div>
            )}

            <textarea
              value={item.description ?? ''}
              onChange={e => updateEditItem(item.id, 'description', e.target.value)}
              onClick={e => e.stopPropagation()}
              placeholder="Untertitel (z.B. Farbe, Material, Detail) — leer lassen zum Ausblenden"
              rows={1}
              className="w-full text-xs font-semibold text-anthracite/60 bg-bg rounded-lg px-2 py-1.5 mb-2 focus:outline-none focus:ring-1 focus:ring-yellow resize-none"
            />
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="number"
                inputMode="decimal"
                value={item.quantity}
                onChange={e => updateEditItem(item.id, 'quantity', e.target.value)}
                className="w-16 text-sm font-semibold text-anthracite bg-bg rounded-lg px-2 py-1 focus:outline-none"
                min={0} step="0.01"
              />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onUnitPick(item.id) }}
                className="text-sm font-black text-anthracite bg-yellow/20 rounded-lg px-2 py-1 focus:outline-none"
              >
                {item.unit || 'Einheit'} ▾
              </button>
              <div className="flex items-center gap-1 ml-auto">
                <input
                  type="number"
                  inputMode="decimal"
                  value={item.unit_price}
                  onChange={e => updateEditItem(item.id, 'unit_price', e.target.value)}
                  className="w-20 text-sm font-semibold text-anthracite bg-bg rounded-lg px-2 py-1 text-right focus:outline-none"
                  min={0} step="0.01"
                />
                <span className="text-xs text-anthracite/40 font-bold">€</span>
              </div>
            </div>
            <div className="text-xs text-anthracite/40 font-semibold mt-1 text-right">
              = {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')} €
              {vatRate > 0 && (
                <span className="ml-2 text-anthracite/25">
                  (brutto {((item.quantity * item.unit_price) * (1 + vatRate / 100)).toFixed(2).replace('.', ',')} €)
                </span>
              )}
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); removeEditItem(item.id) }} className="mt-0.5 p-1 shrink-0">
            <X size={16} color="#ef4444" />
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="font-bold text-anthracite text-sm">{titleOverride ?? item.title}</div>
              {/* DC-027: dezent statt Alarm-Rot/-Gelb wie "KI unsicher" oben —
                  eine vom Tool mitgedachte Position ist meistens fachlich
                  richtig, soll neugierig machen ("kurz checken"), nicht wie
                  ein Fehler wirken. */}
              {item.automatisch_ergaenzt && (
                <span className="text-[10px] font-bold bg-anthracite/5 text-anthracite/40 rounded-full px-2 py-0.5 shrink-0">
                  Vorschlag
                </span>
              )}
            </div>
            {item.description && <div className="text-xs text-anthracite/50 font-semibold mt-0.5">{item.description}</div>}
            <div className="text-xs text-anthracite/40 font-semibold mt-1 flex items-center gap-1">
              <span>{item.quantity} {item.unit} × {fmt(item.unit_price)}</span>
              {item.berechnungsweg && (
                <button
                  onClick={e => { e.stopPropagation(); onInfo(item.id) }}
                  title="Rechenweg anzeigen"
                  className="w-4 h-4 rounded-full bg-anthracite/8 hover:bg-yellow/40 text-anthracite/60 font-black text-[10px] leading-none flex items-center justify-center transition-colors"
                >
                  i
                </button>
              )}
            </div>
            {preisFehlt && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2">
                <AlertTriangle size={14} className="shrink-0 text-red-500" />
                <span className="flex-1 text-[11px] font-bold text-red-700">Preis fehlt in deiner Preisdatenbank</span>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onAddPrice(item) }}
                  className="shrink-0 rounded-lg bg-anthracite px-2.5 py-1.5 text-[11px] font-black text-white"
                >
                  Preis anlegen
                </button>
              </div>
            )}
            {materialVorschlag && (
              <button
                onClick={e => { e.stopPropagation(); onAddMaterial(item) }}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-anthracite/60 bg-anthracite/5 hover:bg-yellow/25 rounded-full px-2 py-0.5 transition-colors"
              >
                ＋ {materialVorschlag.name}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="font-black text-anthracite">{fmt(item.quantity * item.unit_price)}</div>
            <button
              onClick={e => { e.stopPropagation(); removeEditItem(item.id) }}
              className="p-1.5 text-anthracite/20 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
            <div className="cursor-grab touch-none text-anthracite/20 active:cursor-grabbing" {...attributes} {...listeners} onClick={e => e.stopPropagation()}>
              <GripVertical size={16} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function AngebotDetail({ quote, company, quoteNumber }: Props) {
  const [showDeleteSheet, setShowDeleteSheet] = useState(false)
  const [toast, setToast] = useState('')
  const [editMode, setEditMode] = useState(DRAFT_STATUSES.includes(quote.status))
  const [editItems, setEditItems] = useState<EditItem[]>(quote.items)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)
  const [showStatusPicker, setShowStatusPicker] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string>(quote.status)
  const [showRevisionDialog, setShowRevisionDialog] = useState(false)
  const [creatingRevision, setCreatingRevision] = useState(false)
  const [sentVia, setSentVia] = useState<string[]>(quote.sent_via ?? [])
  const [activeTab, setActiveTab] = useState<'positionen' | 'notizen'>('positionen')
  const [showExtras, setShowExtras] = useState(false)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [surchargeAmount, setSurchargeAmount] = useState(0)
  const [surchargeLabel, setSurchargeLabel] = useState('Zuschlag')
  const [internalNotes, setInternalNotes] = useState('')
  // CoS-021/DC-034 (2026-08-25, Sandys Entscheidung "ein Foto-Pool statt
  // zwei"): Fotos kommen jetzt aus derselben Quelle wie die Aufmaß-Aufnahme
  // (entwurf_aufnahmen, typ='foto') statt aus dem separaten
  // quote_photos-Upload — siehe loadPhotos() unten für die Begründung.
  const [photos, setPhotos] = useState<EntwurfAufnahme[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<EntwurfAufnahme | null>(null)
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null)
  const [pendingPhotoCaption, setPendingPhotoCaption] = useState('')
  // useMemo statt direkt in der JSX: sonst würde jeder Tastenanschlag beim
  // Beschreibung-Eintippen (eigener Re-Render) eine neue Blob-URL erzeugen
  // und die alte nie freigeben. Revoke beim Wechsel/Schließen unten.
  const pendingPhotoPreviewUrl = useMemo(
    () => (pendingPhotoFile ? URL.createObjectURL(pendingPhotoFile) : null),
    [pendingPhotoFile],
  )
  useEffect(() => {
    return () => { if (pendingPhotoPreviewUrl) URL.revokeObjectURL(pendingPhotoPreviewUrl) }
  }, [pendingPhotoPreviewUrl])
  const [empfehlungen, setEmpfehlungen] = useState<EmpfehlungDefault[]>([])
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set())
  const [hasChanges, setHasChanges] = useState(false)
  const [autosaveLabel, setAutosaveLabel] = useState('')
  const [showVorschau, setShowVorschau] = useState(false)
  const [vorschauInitialTab, setVorschauInitialTab] = useState<'vorschau' | 'senden'>('vorschau')
  const [unitPickerItemId, setUnitPickerItemId] = useState<string | null>(null)
  const [infoItemId, setInfoItemId] = useState<string | null>(null)
  // CoS-043: `category` gehoert mit dazu — an ihr haengt, auf welche
  // Leistungen ein objektbezogener Zuschlag (Denkmalschutz, Sondermasse,
  // exotische Holzart) gerechnet wird. Ohne sie wuerde er still auf das
  // ganze Angebot laufen.
  const [priceItems, setPriceItems] = useState<{ id: string; title: string; unit_price: number; unit: string; category?: string | null }[]>([])
  const [priceItemToAdd, setPriceItemToAdd] = useState<EditItem | null>(null)
  const [newDatabasePrice, setNewDatabasePrice] = useState('')
  const [newDatabaseUnit, setNewDatabaseUnit] = useState('m²')
  const [addingDatabasePrice, setAddingDatabasePrice] = useState(false)
  const [databasePriceError, setDatabasePriceError] = useState('')
  // ── Pro-Angebot-Optionen (Zahnrad) — null/'' = aus Betriebs-Einstellungen erben
  const [showOptionen, setShowOptionen] = useState(false)
  const [showAktionen, setShowAktionen] = useState(false)
  const [optStruktur, setOptStruktur] = useState<'' | 'raeume' | 'arbeitsablauf' | 'gewerk'>((quote.angebot_struktur ?? '') as '')
  const [optKopftext, setOptKopftext] = useState(quote.kopftext ?? '')
  const [optFusstext, setOptFusstext] = useState(quote.fusstext ?? '')
  const [optBriefpapierId, setOptBriefpapierId] = useState(quote.briefpapier_id ?? '')
  const [optZahlungsziel, setOptZahlungsziel] = useState<string>(quote.zahlungsziel_tage != null ? String(quote.zahlungsziel_tage) : '')
  const [optGueltigBis, setOptGueltigBis] = useState(quote.valid_until ? quote.valid_until.slice(0, 10) : '')
  const [optDokumentTyp, setOptDokumentTyp] = useState<'angebot' | 'kostenvoranschlag'>(quote.dokument_typ ?? 'angebot')
  const [optSkontoProzent, setOptSkontoProzent] = useState<string>(quote.skonto_prozent != null ? String(quote.skonto_prozent) : '')
  const [optSkontoTage, setOptSkontoTage] = useState<string>(quote.skonto_tage != null ? String(quote.skonto_tage) : '')
  const [optWiderruf, setOptWiderruf] = useState<'' | 'ja' | 'nein'>(quote.widerruf_beilegen == null ? '' : (quote.widerruf_beilegen ? 'ja' : 'nein'))
  const [optPreis, setOptPreis] = useState<'' | 'netto' | 'brutto'>((quote.preis_darstellung ?? '') as '')
  const [briefpapiere, setBriefpapiere] = useState<{ id: string; name: string }[]>([])
  const [optSaving, setOptSaving] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(quote.customer ?? null)
  const [showKundenSuche, setShowKundenSuche] = useState(false)
  const [kundenSucheQuery, setKundenSucheQuery] = useState('')
  const [kundenListe, setKundenListe] = useState<Customer[]>([])
  // DC-029, korrigiert 2026-09-02 (Sandys Auftrag "IMMER eine Baustelle
  // auswählbar, bei JEDEM Angebot Kunde+Baustelle"): Zeile/Sheet ist jetzt
  // immer sichtbar, sobald ein Kunde zugewiesen ist — auch mit nur einer
  // (automatischen Erst-)Baustelle. Ursprünglich ("unsichtbar, bis es
  // gebraucht wird") erst ab der zweiten Baustelle sichtbar; das war
  // DC-029s eigenes Prinzip, Sandy will es hier bewusst nicht.
  const [currentBaustelleId, setCurrentBaustelleId] = useState<string | null>(quote.baustelle_id ?? null)
  const [kundenBaustellen, setKundenBaustellen] = useState<(Baustelle & { angebote_anzahl: number })[]>([])
  const [showBaustelleSheet, setShowBaustelleSheet] = useState(false)
  const [neueBaustelleName, setNeueBaustelleName] = useState('')
  const [neueBaustelleAdresse, setNeueBaustelleAdresse] = useState('')
  const [savingBaustelle, setSavingBaustelle] = useState(false)
  // Die Server-Seite liefert raum_details bereits mit dem Angebot. Direkt daraus
  // initialisieren, damit bekannte Maße beim ersten Render nicht als fehlend
  // aufblitzen, während die zusätzliche Detailabfrage noch läuft.
  const [raumDetails, setRaumDetails] = useState<Record<string, RaumDimension>>(
    (quote.raum_details as Record<string, RaumDimension> | null | undefined) ?? {},
  )
  const [grundrissRaum, setGrundrissRaum] = useState<string | null>(null)
  const [showRaumPicker, setShowRaumPicker] = useState(false)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const raumDetailsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // ── On mount: Fotos + interne Notizen + Empfehlungen laden ────────────────
  useEffect(() => {
    loadPhotos()
    loadQuoteExtras()
    loadEmpfehlungen()
    loadPriceItems()
    loadBriefpapiere()
    if (currentCustomer) loadBaustellen(currentCustomer.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // DC-029: Baustellen des aktuell zugewiesenen Kunden laden (inkl. Anzahl
  // Angebote je Baustelle, für die Auswahl-Zeile/das Sheet unten).
  async function loadBaustellen(customerId: string) {
    const { data } = await supabase
      .from('baustellen')
      .select('id, company_id, customer_id, name, adresse, ist_erstbaustelle, created_at, quotes(id)')
      .eq('customer_id', customerId)
      .order('ist_erstbaustelle', { ascending: false })
      .order('created_at', { ascending: true })
    setKundenBaustellen(
      (data ?? []).map(b => ({
        ...(b as unknown as Baustelle),
        angebote_anzahl: (b as unknown as { quotes: { id: string }[] | null }).quotes?.length ?? 0,
      }))
    )
  }

  // Pro-Angebot-Optionen speichern (leer = erben → null)
  async function speichereOptionen() {
    setOptSaving(true)
    const num = (s: string) => { const n = parseFloat(s.replace(',', '.')); return Number.isFinite(n) ? n : null }
    await supabase.from('quotes').update({
      angebot_struktur: optStruktur || null,
      kopftext: optKopftext.trim() || null,
      fusstext: optFusstext.trim() || null,
      briefpapier_id: optBriefpapierId || null,
      zahlungsziel_tage: optZahlungsziel ? Math.round(num(optZahlungsziel) ?? 0) || null : null,
      valid_until: optGueltigBis || null,
      dokument_typ: optDokumentTyp,
      skonto_prozent: num(optSkontoProzent),
      skonto_tage: optSkontoTage ? Math.round(num(optSkontoTage) ?? 0) || null : null,
      widerruf_beilegen: optWiderruf === '' ? null : optWiderruf === 'ja',
      preis_darstellung: optPreis || null,
    }).eq('id', quote.id)
    setOptSaving(false)
    setShowOptionen(false)
    setToast('Einstellungen gespeichert')
    router.refresh()
  }

  async function loadBriefpapiere() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: co } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (!co) return
    const { data } = await supabase.from('briefpapier').select('id, name').eq('betrieb_id', co.id)
    if (data) setBriefpapiere(data as { id: string; name: string }[])
  }

  async function loadPriceItems() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: co } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (!co) return
    const allPriceItems: { id: string; title: string; unit_price: number; unit: string; category?: string | null }[] = []
    const pageSize = 1000
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from('price_items')
        .select('id, title, unit_price, unit, category')
        .eq('company_id', co.id)
        .order('title')
        .range(from, from + pageSize - 1)
      if (error) break
      allPriceItems.push(...((data ?? []) as { id: string; title: string; unit_price: number; unit: string; category?: string | null }[]))
      if (!data || data.length < pageSize) break
    }
    setPriceItems(allPriceItems)
  }

  // Materialpreis aus der Preisdatenbank (bester Namens-Treffer), sonst 0
  function materialPreis(name: string): number {
    const n = name.toLowerCase().replace(/\s*\(material\)/, '').trim()
    const hit = priceItems.find(p => {
      const t = p.title.toLowerCase()
      return t === n || t.includes(n) || n.includes(t)
    })
    return hit?.unit_price ?? 0
  }

  // CoS-021/DC-034: Fotos kommen aus entwurf_aufnahmen (typ='foto') — der
  // Tabelle, die auch die Aufmaß-Aufnahme befüllt. Vorher gab es hier einen
  // zweiten, komplett getrennten Upload-Weg (quote_photos), dessen "Ins
  // PDF"-Schalter zwar anzeigte, aber nie wirklich etwas bewirkte (kein
  // PDF-Code hat das Flag je gelesen — siehe src/lib/angebot-fotos.ts).
  // Ein Foto-Pool statt zwei; Muster/Signed-URL-Abruf identisch zu
  // entwurf/page.tsx loadData().
  async function loadPhotos() {
    setPhotosLoading(true)
    const { data: rows } = await supabase
      .from('entwurf_aufnahmen')
      .select('*')
      .eq('angebot_id', quote.id)
      .eq('typ', 'foto')
      .order('sortierung', { ascending: true })
      .order('erstellt_am', { ascending: true })

    if (rows?.length) {
      const paths = rows
        .filter(r => r.foto_url)
        .map(r => ({ bucket: 'entwurf-fotos', path: r.foto_url as string }))
      let urls: Record<string, string> = {}
      if (paths.length) {
        const res = await fetch('/api/entwurf/signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths }),
        })
        if (res.ok) urls = (await res.json()).urls ?? {}
      }
      setPhotos(rows.map(r => ({
        ...r,
        foto_signed_url: r.foto_url ? urls[r.foto_url as string] : undefined,
      })) as EntwurfAufnahme[])
    } else {
      setPhotos([])
    }
    setPhotosLoading(false)
  }

  async function loadQuoteExtras() {
    const { data } = await supabase
      .from('quotes')
      .select('internal_notes, discount_percent, discount_amount, surcharge_amount, surcharge_label, raum_details')
      .eq('id', quote.id)
      .single()
    if (data) {
      setInternalNotes(data.internal_notes ?? '')
      setDiscountPercent(data.discount_percent ?? 0)
      setDiscountAmount(data.discount_amount ?? 0)
      setSurchargeAmount(data.surcharge_amount ?? 0)
      setSurchargeLabel(data.surcharge_label ?? 'Zuschlag')
      if ((data.discount_percent ?? 0) > 0 || (data.discount_amount ?? 0) > 0 || (data.surcharge_amount ?? 0) > 0) {
        setShowExtras(true)
      }
      if (data.raum_details && typeof data.raum_details === 'object') {
        setRaumDetails(data.raum_details as Record<string, RaumDimension>)
      }
    }
  }

  function handleRaumDimChange(raumName: string, patch: Partial<RaumDimension>) {
    setRaumDetails(prev => {
      const updated = { ...prev, [raumName]: { ...prev[raumName], ...patch } }

      // Live-Neuberechnung der betroffenen Items
      setEditItems(items => items.map(item => {
        // Nur Items dieses Raums
        const suffix = ` — ${raumName}`
        if (!item.title.endsWith(suffix)) return item
        const titleDisplay = item.title.slice(0, item.title.length - suffix.length)
        const newQty = berechneQuantityFuerItem(titleDisplay, item.unit, updated[raumName])
        if (newQty == null) return item
        const qty = Math.round(newQty * 100) / 100
        // Untertitel NICHT überschreiben — Menge wird separat angezeigt
        return { ...item, quantity: qty, total_price: qty * item.unit_price }
      }))
      setHasChanges(true)

      // Debounced persist
      if (raumDetailsTimer.current) clearTimeout(raumDetailsTimer.current)
      raumDetailsTimer.current = setTimeout(() => {
        supabase.from('quotes').update({ raum_details: updated }).eq('id', quote.id)
      }, 1000)

      return updated
    })
  }

  async function loadEmpfehlungen() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: co } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (!co) return
    const { data } = await supabase
      .from('positions_empfehlungen')
      .select('*')
      .eq('company_id', co.id)
    setEmpfehlungen(data ?? [])
  }

  // ── KI-Vorschläge berechnen ───────────────────────────────────────────────
  const currentCategories = new Set((editMode ? editItems : quote.items).map(i => {
    const item = i as EditItem & { kategorie?: string }
    return item.kategorie ?? ''
  }))
  const currentTitles = new Set((editMode ? editItems : quote.items).map(i => i.title.toLowerCase()))

  const activeHints = empfehlungen
    .filter(e => currentCategories.has(e.trigger_category) && !currentTitles.has(e.empfehlung_title.toLowerCase()) && !dismissedHints.has(e.empfehlung_title))
    .slice(0, 2)

  // ── Autosave interne Notizen ───────────────────────────────────────────────
  function scheduleAutosaveNotes(val: string) {
    setInternalNotes(val)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      await supabase.from('quotes').update({ internal_notes: val }).eq('id', quote.id)
      setAutosaveLabel('Gespeichert')
      setTimeout(() => setAutosaveLabel(''), 2000)
    }, 1500)
  }

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setEditItems(items => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex).map((item, idx) => ({ ...item, position: idx + 1 }))
      })
      setHasChanges(true)
    }
  }

  // ── Spracheingabe ──────────────────────────────────────────────────────────
  // ── Fotos ──────────────────────────────────────────────────────────────────
  // Lädt über denselben Endpunkt hoch, den auch die Aufmaß-Aufnahme nutzt
  // (POST /api/entwurf/foto) — die Beschreibung landet in foto_beschreibung
  // und erscheint damit automatisch als Bildunterschrift im PDF, falls das
  // Foto dort mit aufgenommen wird (siehe src/lib/angebot-fotos.ts).
  async function handlePhotoUpload(file: File, beschreibung?: string) {
    setPhotoUploading(true)
    const fd = new FormData()
    fd.append('angebot_id', quote.id)
    fd.append('foto', file)
    if (beschreibung?.trim()) fd.append('beschreibung', beschreibung.trim())
    const res = await fetch('/api/entwurf/foto', { method: 'POST', body: fd })
    if (res.ok) {
      showToast('Foto hinzugefügt ✓')
      await loadPhotos()
    } else {
      showToast('Upload fehlgeschlagen')
    }
    setPhotoUploading(false)
  }

  // Nur maximal 8 Fotos werden überhaupt ins PDF übernommen (harte Grenze
  // in src/lib/angebot-fotos.ts, MAX_FOTOS — ein Angebots-PDF ist ein
  // Dokument, kein Fotoalbum). Ohne diese Vorab-Warnung könnte man hier
  // z.B. 12 Fotos anhaken und stillschweigend würden nur die ersten 8
  // im PDF landen — das wäre wieder eine Zusage, die das Produkt nicht
  // einlöst (genau der Fehler beim alten Schalter, den wir gerade beheben).
  async function togglePhotoInPdf(photo: EntwurfAufnahme) {
    const newVal = !photo.in_pdf
    if (newVal && photos.filter(p => p.in_pdf).length >= 8) {
      showToast('Maximal 8 Fotos im PDF — zuerst eins abwählen')
      return
    }
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, in_pdf: newVal } : p))
    setLightboxPhoto(prev => (prev && prev.id === photo.id ? { ...prev, in_pdf: newVal } : prev))
    const res = await fetch('/api/entwurf/foto', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aufnahme_id: photo.id, in_pdf: newVal }),
    })
    if (!res.ok) {
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, in_pdf: !newVal } : p))
      setLightboxPhoto(prev => (prev && prev.id === photo.id ? { ...prev, in_pdf: !newVal } : prev))
      showToast('Konnte nicht gespeichert werden')
    }
  }

  // Kein eigener DELETE-Endpunkt für Aufnahme-Fotos — dasselbe direkte
  // Client-Muster wie deleteAufnahme() in entwurf/page.tsx (RLS-geschützt):
  // erst die Datei aus dem Storage, dann die Zeile.
  async function deletePhoto(photo: EntwurfAufnahme) {
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    setLightboxPhoto(null)
    if (photo.foto_url) {
      await supabase.storage.from('entwurf-fotos').remove([photo.foto_url])
    }
    await supabase.from('entwurf_aufnahmen').delete().eq('id', photo.id)
  }

  // ── Edit-Modus ─────────────────────────────────────────────────────────────
  // CoS-026: Prozent-Zuschläge, die der Handwerker hier SELBST angefasst hat,
  // rechnet danach niemand mehr um — dieselbe Regel wie in CoS-014, nur für
  // die Dauer dieser Bearbeitung. Ohne das würde der Effekt unten seine
  // gerade eingetippte Zahl im nächsten Render wieder überschreiben.
  const handZuschlaege = useRef<Set<string>>(new Set())

  function updateEditItem(id: string, field: keyof EditItem, value: string | number) {
    setEditItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: (field === 'quantity' || field === 'unit_price') ? Number(value) : value }
      updated.total_price = updated.quantity * updated.unit_price
      if (istProzentZuschlag(updated.unit) || istProzentZuschlag(item.unit)) handZuschlaege.current.add(id)
      return updated
    }))
    setHasChanges(true)
  }

  // CoS-026: Ein Zuschlag steht auf einer Bemessungsgrundlage — ändert sich
  // die Grundlage (Menge korrigiert, Position gelöscht, neue dazugestellt),
  // muss der Betrag mitgehen. Vorher blieb er auf der alten Zahl stehen und
  // das Angebot zeigte still einen falschen Gesamtpreis. Bewusst hier und
  // nicht erst beim Speichern: der Handwerker soll die Summe wandern sehen,
  // während er tippt, nicht erst hinterher.
  useEffect(() => {
    if (!editMode) return
    // CoS-043: Die Kategorie kommt aus der Preisdatenbank ueber price_item_id.
    // Nur damit kann ein objektbezogener Zuschlag auf sein eigenes Gewerk
    // eingegrenzt werden statt auf alles.
    const kategorieVon = (item: EditItem) =>
      item.price_item_id ? (priceItems.find(p => p.id === item.price_item_id)?.category ?? null) : null
    const naechste = aktualisiereProzentZuschlaege(editItems, item => handZuschlaege.current.has(item.id), kategorieVon)
    // Gleiche Instanz = nichts zu tun. Genau darauf ist die Funktion gebaut,
    // sonst würde dieser Effekt sich selbst endlos neu auslösen.
    if (naechste !== editItems) setEditItems(naechste)
  }, [editItems, editMode, priceItems])

  function removeEditItem(id: string) {
    setEditItems(prev => prev.filter(item => item.id !== id))
    setEditingItemId(null)
    setHasChanges(true)
  }

  async function addMissingDatabasePrice() {
    if (!priceItemToAdd) return
    const unitPrice = Number(newDatabasePrice.replace(',', '.'))
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      setDatabasePriceError('Bitte einen Preis größer als 0 eingeben.')
      return
    }

    setAddingDatabasePrice(true)
    setDatabasePriceError('')
    const response = await fetch(`/api/quotes/${quote.id}/items/${priceItemToAdd.id}/preis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit_price: unitPrice, unit: newDatabaseUnit }),
    })
    const result = await response.json().catch(() => ({})) as {
      error?: string
      price_item_id?: string
      unit_price?: number
      total_price?: number
      unit?: string
    }
    if (!response.ok || !result.price_item_id) {
      setDatabasePriceError(result.error ?? 'Preis konnte nicht gespeichert werden.')
      setAddingDatabasePrice(false)
      return
    }

    setEditItems(previous => previous.map(item => item.id === priceItemToAdd.id ? {
      ...item,
      price_item_id: result.price_item_id,
      unit_price: result.unit_price ?? unitPrice,
      total_price: result.total_price ?? item.quantity * unitPrice,
      unit: result.unit ?? newDatabaseUnit,
    } : item))
    setPriceItems(previous => [...previous, {
      id: result.price_item_id!,
      title: priceItemToAdd.title.replace(/\s+—\s+.+$/, '').trim(),
      unit: result.unit ?? newDatabaseUnit,
      unit_price: unitPrice,
    }])
    setPriceItemToAdd(null)
    setNewDatabasePrice('')
    setNewDatabaseUnit('m²')
    setAddingDatabasePrice(false)
    showToast('Preis in Preisdatenbank und Angebot übernommen ✓')
    router.refresh()
  }

  // DC-039: Vorschlag aus der Preisdatenbank (oder gerade neu angelegter
  // Preis) auf eine Position übernehmen — Titel, Einheit, Preis UND die
  // Verknüpfung (price_item_id) in einem Schritt, damit die Position beim
  // Speichern korrekt als "aus der Preisdatenbank" erkennbar bleibt.
  function applyPreisVorschlag(itemId: string, vorschlag: { title: string; unit: string; unit_price: number; price_item_id: string }) {
    setEditItems(prev => prev.map(item => {
      if (item.id !== itemId) return item
      // DC-041: die Preisdatenbank kennt keine Räume — der Vorschlagstitel
      // ist immer roomless. Ein vorhandenes " — Raumname"-Suffix der
      // aktuellen Position (z. B. weil die Position innerhalb eines Raums
      // per "+ Position" oder als Raum-Platzhalter angelegt wurde) bleibt
      // beim Übernehmen erhalten, sonst würde die Position aus ihrem Raum
      // herausfallen und unter "Allgemein" landen.
      const dashMatch = item.title.match(/\s+[-–—]\s+.+$/)
      const raumSuffix = dashMatch ? dashMatch[0] : ''
      // VOB-010 (2026-09-01): Bei einem Prozent-Zuschlag aus dem Katalog IST
      // der „Preis" der Prozentsatz — er gehört in die Menge, nicht in den
      // Einzelpreis. Sonst stünde „1 % × 25,00 € = 25,00 €" im Angebot, also
      // wieder genau der Euro-Betrag, den dieser Fix beseitigen soll. Den
      // Einzelpreis (Euro je Prozentpunkt) rechnet der Effekt weiter unten
      // aus der Bemessungsgrundlage — dieselbe Regel wie bei den automatisch
      // erzeugten Zuschlägen.
      const updated = istProzentZuschlag(vorschlag.unit)
        ? { ...item, title: vorschlag.title + raumSuffix, unit: vorschlag.unit, quantity: vorschlag.unit_price, unit_price: 0, price_item_id: vorschlag.price_item_id }
        : { ...item, title: vorschlag.title + raumSuffix, unit: vorschlag.unit, unit_price: vorschlag.unit_price, price_item_id: vorschlag.price_item_id }
      updated.total_price = updated.quantity * updated.unit_price
      return updated
    }))
    setHasChanges(true)
  }

  // DC-039: komplett neuer Titel ohne Treffer in der Preisdatenbank — legt
  // sofort einen echten price_items-Eintrag an (nicht erst beim "Speichern"
  // des Angebots), damit er ab sofort für jede künftige Position
  // durchsuchbar ist, genau wie Sandy es beschrieben hat.
  //
  // Läuft über `POST /api/preise` statt direkt über den Browser-Client:
  // Prüfung (Preis, Länge, Tippfehler-Grenze), Rubrik und Dubletten-Schutz
  // stehen damit an EINER Stelle statt in jeder Oberfläche mit einem
  // Eingabefeld — dieselbe Regel, die auch der „Preis fehlt"-Ablauf nutzt.
  async function legeNeuenPreisAn(itemId: string, titel: string, einheit: string, preis: number) {
    const antwort = await fetch('/api/preise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titel, einheit, preis }),
    })
    const ergebnis = await antwort.json().catch(() => ({})) as {
      error?: string
      bestehend?: boolean
      price_item?: { id: string; title: string; unit: string; unit_price: number }
    }
    if (!antwort.ok || !ergebnis.price_item) {
      showToast(ergebnis.error ?? 'Preis konnte nicht angelegt werden — bitte nochmal versuchen.')
      return
    }

    const eintrag = ergebnis.price_item
    setPriceItems(prev => prev.some(p => p.id === eintrag.id)
      ? prev
      : [...prev, { id: eintrag.id, title: eintrag.title, unit: eintrag.unit, unit_price: eintrag.unit_price }])
    applyPreisVorschlag(itemId, {
      title: eintrag.title, unit: eintrag.unit, unit_price: eintrag.unit_price, price_item_id: eintrag.id,
    })
    showToast(ergebnis.bestehend
      ? `„${eintrag.title}" gab es schon — übernommen ✓`
      : `„${eintrag.title}" in Preisdatenbank angelegt ✓`)
  }

  function addEditItem() {
    const newItem: EditItem = {
      id: `new-${Date.now()}`,
      position: (editItems[editItems.length - 1]?.position ?? 0) + 1,
      title: '',
      description: null,
      quantity: 1,
      unit: 'Stk',
      unit_price: 0,
      total_price: 0,
    }
    setEditItems(prev => [...prev, newItem])
    setEditingItemId(newItem.id)
    setHasChanges(true)
  }

  // Material-Position zu einer Arbeits-Position ergänzen (Preis aus DB, sonst 0)
  function addMaterialFor(laborItem: EditItem) {
    const mat = materialFuerPosition(laborItem.title)
    if (!mat) return
    const suffixMatch = laborItem.title.match(/\s+(—\s+.+)$/)
    const suffix = suffixMatch ? ` ${suffixMatch[1]}` : ''
    const titel = `${mat.name}${suffix}`
    // Schon vorhanden? Nicht doppelt anlegen
    if (editItems.some(i => i.title.toLowerCase() === titel.toLowerCase())) return
    const preis = materialPreis(mat.name)
    const menge = laborItem.quantity
    const newItem: EditItem = {
      id: `new-mat-${Date.now()}`,
      position: laborItem.position + 1,
      title: titel,
      description: 'Produkt / Farbe eintragen',
      quantity: menge,
      unit: mat.unit,
      unit_price: preis,
      total_price: menge * preis,
    }
    // Direkt hinter der Arbeits-Position einfügen
    setEditItems(prev => {
      const idx = prev.findIndex(i => i.id === laborItem.id)
      if (idx === -1) return [...prev, newItem]
      return [...prev.slice(0, idx + 1), newItem, ...prev.slice(idx + 1)]
    })
    setEditingItemId(newItem.id)
    setHasChanges(true)
  }

  function addRaumPosition(raumName: string) {
    const vorhandeneRaeume = new Set(
      editItems.map(i => { const m = i.title.match(/ — (.+)$/); return m?.[1] ?? null }).filter(Boolean)
    )
    let finalName = raumName
    if (vorhandeneRaeume.has(raumName)) {
      let n = 2
      while (vorhandeneRaeume.has(`${raumName} ${n}`)) n++
      finalName = `${raumName} ${n}`
    }
    const newItem: EditItem = {
      id: `new-${Date.now()}`,
      position: (editItems[editItems.length - 1]?.position ?? 0) + 1,
      title: ` — ${finalName}`,
      description: null,
      quantity: 1,
      unit: 'm²',
      unit_price: 0,
      total_price: 0,
    }
    setEditItems(prev => [...prev, newItem])
    setEditingItemId(newItem.id)
    setShowRaumPicker(false)
    setHasChanges(true)
  }

  function addHintItem(hint: EmpfehlungDefault) {
    const newItem: EditItem = {
      id: `new-${Date.now()}`,
      position: (editItems[editItems.length - 1]?.position ?? 0) + 1,
      title: hint.empfehlung_title,
      description: null,
      quantity: 1,
      unit: hint.empfehlung_unit,
      unit_price: hint.empfehlung_unit_price,
      total_price: hint.empfehlung_unit_price,
    }
    setEditItems(prev => [...prev, newItem])
    setDismissedHints(prev => new Set([...prev, hint.empfehlung_title]))
    if (!editMode) setEditMode(true)
    setHasChanges(true)
    showToast(`${hint.empfehlung_title} hinzugefügt ✓`)
  }

  async function saveEdits(nextStatus?: string) {
    setSaving(true)
    try {
      if (editItems.some(item => !item.title.trim())) {
        throw new Error('Bitte gib jeder Position eine Bezeichnung.')
      }
      // DC-010: leeres Angebot (0 Positionen oder kein Kunde) darf nicht
      // fertiggestellt werden können — der Button ist dafür unten schon
      // deaktiviert, dieser Check ist das Sicherheitsnetz, falls
      // fertigstellen() doch mal ohne die Button-Prüfung aufgerufen wird.
      if (nextStatus === 'bereit') {
        if (editItems.length === 0) {
          throw new Error('Bitte füge mindestens eine Position hinzu, bevor du das Angebot fertigstellst.')
        }
        if (!currentCustomer) {
          throw new Error('Bitte weise einen Kunden zu, bevor du das Angebot fertigstellst.')
        }
      }
      // CoS-014 (2026-08-24): Festhalten, WAS der Handwerker hier von Hand
      // angefasst hat — geändert, gelöscht oder selbst hinzugefügt. Eine
      // spätere Neu-Berechnung legt genau diese Positionen nicht erneut an.
      // Bewusst vor dem Schreiben ermittelt, weil danach der Vorher-Stand
      // (`quote.items`) nicht mehr rekonstruierbar wäre. Wichtig: nur
      // tatsächliche Unterschiede zählen — der Speichervorgang schreibt
      // ohnehin JEDE Zeile neu, ohne diesen Vergleich wäre nach einmal
      // „Bearbeiten → Speichern" das ganze Angebot eingefroren.
      const handaenderungen = ermittleHandaenderungen(quote.items, editItems)

      for (const item of editItems) {
        if (item.id.startsWith('new-')) {
          const { error } = await supabase.from('quote_items').insert({
            quote_id: quote.id, position: item.position, title: item.title.trim(),
            description: item.description, quantity: item.quantity, unit: item.unit,
            unit_price: item.unit_price, total_price: item.total_price,
            // DC-039: Die Verknüpfung zur Preisdatenbank ging beim Speichern
            // bisher verloren — die Spalte gibt es, gesetzt hat sie hier
            // niemand. Danach galt die Position wieder als "Preis kommt von
            // nirgendwo", obwohl sie gerade aus dem Katalog gewählt wurde.
            price_item_id: item.price_item_id ?? null,
          })
          if (error) throw error
        } else {
          const { error } = await supabase.from('quote_items').update({
            title: item.title.trim(), description: item.description, quantity: item.quantity,
            unit: item.unit, unit_price: item.unit_price, total_price: item.total_price,
            position: item.position,
            // DC-039, siehe oben: gilt genauso für eine bestehende Position,
            // der der Handwerker gerade einen Preis aus dem Katalog zugewiesen hat.
            price_item_id: item.price_item_id ?? null,
          }).eq('id', item.id)
          if (error) throw error
        }
      }
      const deletedIds = quote.items.filter(orig => !editItems.some(e => e.id === orig.id)).map(i => i.id)
      if (deletedIds.length) {
        const { error } = await supabase.from('quote_items').delete().in('id', deletedIds)
        if (error) throw error
      }

      const totalNet = editItems.reduce((s, i) => s + i.total_price, 0)
      const discountValue = discountPercent > 0 ? totalNet * (discountPercent / 100) : discountAmount
      const netAfterDiscount = totalNet - discountValue
      const netWithSurcharge = netAfterDiscount + surchargeAmount
      const totalVat = company && company.vat_rate > 0 ? netWithSurcharge * (company.vat_rate / 100) : 0
      const bisherGeschuetzt = quote.manuell_bearbeitete_positionen ?? []
      const alleGeschuetzt = [...bisherGeschuetzt]
      for (const titel of handaenderungen) {
        if (!alleGeschuetzt.some(v => v.toLocaleLowerCase('de-DE').trim() === titel.toLocaleLowerCase('de-DE').trim())) {
          alleGeschuetzt.push(titel)
        }
      }

      const { error: quoteError } = await supabase.from('quotes').update({
        total_net: totalNet, total_vat: totalVat, total_gross: netWithSurcharge + totalVat,
        discount_percent: discountPercent, discount_amount: discountAmount,
        surcharge_amount: surchargeAmount, surcharge_label: surchargeLabel,
        ...(alleGeschuetzt.length !== bisherGeschuetzt.length ? { manuell_bearbeitete_positionen: alleGeschuetzt } : {}),
        ...(nextStatus ? { status: nextStatus } : {}),
      }).eq('id', quote.id)
      if (quoteError) throw quoteError

      // DC-033 (2026-08-25): Hier — und nur hier — bekommt ein Angebot seine
      // Nummer. Beim Anlegen wäre falsch: Entwürfe entstehen bei jeder
      // Aufnahme, auch bei Fehlversuchen; jeder davon würde sonst eine Nummer
      // verbrauchen und eine Lücke hinterlassen, die man bei einer Prüfung
      // erklären müsste. Der Aufruf ist gefahrlos wiederholbar (eine einmal
      // vergebene Nummer wird nie überschrieben) und darf das Fertigstellen
      // nicht blockieren: Klappt die Vergabe nicht, ist das Angebot trotzdem
      // fertig — es zeigt dann wie bisher die Ersatzbezeichnung.
      if (nextStatus === 'bereit' && !quote.angebotsnummer) {
        try {
          const res = await fetch(`/api/quotes/${quote.id}/nummer`, { method: 'POST' })
          if (!res.ok) showToast('Angebotsnummer konnte nicht vergeben werden')
        } catch {
          showToast('Angebotsnummer konnte nicht vergeben werden')
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (nextStatus) setCurrentStatus(nextStatus as any)
      setEditMode(false)
      setEditingItemId(null)
      setHasChanges(false)
      showToast(nextStatus === 'bereit' ? 'Angebot fertiggestellt ✓' : 'Entwurf gespeichert ✓')
      router.refresh()
    } catch (error) {
      console.error('Entwurf konnte nicht gespeichert werden', error)
      showToast(error instanceof Error && error.message.startsWith('Bitte')
        ? error.message
        : 'Speichern fehlgeschlagen – bitte erneut versuchen')
    } finally {
      setSaving(false)
    }
  }

  async function fertigstellen() {
    await saveEdits('bereit')
  }

  // ── Einheit schnell ändern (ohne Bearbeiten-Modus) ────────────────────────
  async function quickUnitChange(itemId: string, newUnit: string) {
    setEditItems(prev => prev.map(i => i.id === itemId ? { ...i, unit: newUnit } : i))
    setUnitPickerItemId(null)
    if (!itemId.startsWith('new-')) {
      await supabase.from('quote_items').update({ unit: newUnit }).eq('id', itemId)
      // CoS-014: auch dieser Schnellweg (ohne Bearbeiten-Modus) ist eine
      // Handänderung und muss eine Neu-Berechnung überstehen.
      const titel = quote.items.find(i => i.id === itemId)?.title
      if (titel) {
        const bisher = quote.manuell_bearbeitete_positionen ?? []
        const schonDrin = bisher.some(v => v.toLocaleLowerCase('de-DE').trim() === titel.toLocaleLowerCase('de-DE').trim())
        if (!schonDrin) {
          await supabase.from('quotes').update({ manuell_bearbeitete_positionen: [...bisher, titel] }).eq('id', quote.id)
        }
      }
    }
  }

  // ── Positionen gruppieren (Ansichtsmodus) ────────────────────────────────

  // ── Summenberechnung ───────────────────────────────────────────────────────
  const baseNet = editMode
    ? editItems.reduce((s, i) => s + i.quantity * i.unit_price, 0)
    : quote.total_net
  const discountValue = discountPercent > 0 ? baseNet * (discountPercent / 100) : discountAmount
  const netAfterDiscount = baseNet - discountValue
  const netWithSurcharge = netAfterDiscount + surchargeAmount
  const totalVat = company && company.vat_rate > 0 ? netWithSurcharge * (company.vat_rate / 100) : 0
  const totalGross = netWithSurcharge + totalVat
  const isKleinunternehmer = company?.vat_rate === 0

  // ── Helpers ────────────────────────────────────────────────────────────────
  const INTEGRATIONS = [
    { id: 'lexware', label: 'Lexware Office', short: 'LW', color: '#003DA5', active: !!company?.lexware_api_key },
    { id: 'lexoffice', label: 'Lexoffice', short: 'LO', color: '#0066CC', active: !!company?.lexoffice_api_key },
    { id: 'sevdesk', label: 'sevDesk', short: 'SD', color: '#E84B3C', active: !!company?.sevdesk_api_key },
    { id: 'fastbill', label: 'FastBill', short: 'FB', color: '#FF6B00', active: !!company?.fastbill_api_key && !!company?.fastbill_email },
    { id: 'billomat', label: 'Billomat', short: 'BM', color: '#4CAF50', active: !!company?.billomat_api_key && !!company?.billomat_subdomain },
    { id: 'papierkram', label: 'Papierkram', short: 'PK', color: '#795548', active: !!company?.papierkram_api_key },
    { id: 'easybill', label: 'Easybill', short: 'EB', color: '#009688', active: !!company?.easybill_api_key },
  ]
  const activeIntegrations = INTEGRATIONS.filter(i => i.active)

  const status = getStatusInfo(currentStatus)

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }
  function trackVia(via: string) {
    if (sentVia.includes(via)) return
    setSentVia(prev => [...prev, via])
    fetch(`/api/quotes/${quote.id}/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ via }) }).catch(() => {})
  }

  // DC-042 (Sandy, 2026-08-31): Der Statuswechsel schreibt jetzt mehr als nur
  // den Status — Archivieren bewahrt den echten Ausgang, „Abgelehnt" kann
  // einen Grund tragen. Was genau geschrieben wird, steht als reine Funktion
  // in `status-uebergang.ts` und ist dort getestet; hier bleibt nur der
  // Aufruf. Den Grund fragt später die Oberfläche ab (Product Designer) —
  // solange sie das nicht tut, bleibt das Feld ehrlich leer statt geraten.
  async function changeStatus(newStatus: string, grund?: AblehnungsGrund) {
    setCurrentStatus(newStatus as typeof currentStatus)
    setShowStatusPicker(false)
    await supabase.from('quotes').update(statusPatch(currentStatus, newStatus, { grund })).eq('id', quote.id)
    showToast(`Status: ${getStatusInfo(newStatus).label} ✓`)
  }

  async function handleDuplicate() {
    const r = await fetch('/api/quotes/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: quote.items.map(i => ({ title: i.title, description: i.description, quantity: i.quantity, unit: i.unit, unit_price: i.unit_price, berechnungsweg: i.berechnungsweg ?? null, annahmen: i.annahmen ?? [], price_item_id: i.price_item_id ?? null, automatisch_ergaenzt: i.automatisch_ergaenzt ?? false })), notes: quote.notes, customerName: quote.customer?.name ?? '', customerEmail: quote.customer?.email ?? '', customerPhone: quote.customer?.phone ?? '', customerAddress: quote.customer?.address ?? '' }) })
    if (r.ok) { const { id } = await r.json(); showToast('Dupliziert ✓'); router.push(`/angebot/${id}`) }
    else showToast('Duplizieren fehlgeschlagen')
  }

  async function handleDelete() {
    setShowDeleteSheet(false)
    await supabase.from('quotes').delete().eq('id', quote.id)
    router.push('/angebote')
  }

  async function handleRevisionErstellen() {
    setCreatingRevision(true)
    const r = await fetch(`/api/quotes/${quote.id}/revise`, { method: 'POST' })
    setCreatingRevision(false)
    setShowRevisionDialog(false)
    if (r.ok) {
      const { id } = await r.json()
      router.push(`/angebot/${id}`)
    } else {
      showToast('Fehler beim Erstellen der Überarbeitung')
    }
  }

  function handleEditClick() {
    if (SENT_STATUSES.includes(currentStatus)) {
      setShowRevisionDialog(true)
    } else {
      handZuschlaege.current = new Set()
      setEditItems(quote.items)
      setEditMode(true)
      if (currentStatus === 'bereit') {
        setCurrentStatus('draft')
        supabase.from('quotes').update({ status: 'draft' }).eq('id', quote.id)
        // DC-003: dieser Statuswechsel passierte bisher lautlos — man klickt
        // "Bearbeiten" und merkt erst beim nächsten Blick auf den Badge, dass
        // "Fertiggestellt" jetzt wieder "Entwurf" ist.
        showToast('Zurück zu Entwurf, weil bearbeitet ✓')
      }
    }
  }

  function copyLink() {
    const token = quote.share_token ?? quote.id
    navigator.clipboard.writeText(`${window.location.origin}/angebot/${token}/unterschreiben`)
    trackVia('link')
    showToast('Link kopiert ✓')
  }

  const [lexwareKontakte, setLexwareKontakte] = useState<{ id: string; name: string; address: string | null; phone: string | null; email: string | null; source: string }[]>([])

  async function handleKundenSuche(q: string) {
    setKundenSucheQuery(q)
    setLexwareKontakte([])
    if (!q.trim()) { setKundenListe([]); return }
    const { data: co } = await supabase.from('companies').select('id').eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '').single()
    if (!co) return
    const { data } = await supabase.from('customers').select('*').eq('company_id', co.id).ilike('name', `%${q}%`).limit(6)
    setKundenListe(data ?? [])
    // Gleichzeitig Lexware-Kontakte suchen
    fetch(`/api/integrations/lexware/contacts?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(d => setLexwareKontakte(d.contacts ?? []))
      .catch(() => {})
  }

  async function handleKundeZuweisen(kunde: typeof kundenListe[0] | null) {
    // CoS-012/DC-029: sobald ein Kunde zugewiesen wird, automatisch dessen
    // Erstbaustelle mitsetzen; beim Entfernen des Kunden auch die Baustelle
    // wieder leeren (baustelle_id gehört ohne Kunde nirgendwo hin).
    let baustelleId: string | null = null
    if (kunde) {
      const { data: co } = await supabase.from('companies').select('id').eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '').single()
      if (co) baustelleId = await getOrCreateErstbaustelle(supabase, co.id, kunde.id)
    }
    const { error: zuweisenError } = await supabase
      .from('quotes')
      .update({ customer_id: kunde?.id ?? null, baustelle_id: baustelleId })
      .eq('id', quote.id)
    if (zuweisenError?.message?.includes('baustelle_id')) {
      // Spalte fehlt noch (Migration nicht ausgeführt) — ohne nochmal versuchen.
      await supabase.from('quotes').update({ customer_id: kunde?.id ?? null }).eq('id', quote.id)
    }
    setCurrentCustomer(kunde)
    setCurrentBaustelleId(baustelleId)
    if (kunde) { loadBaustellen(kunde.id) } else { setKundenBaustellen([]) }
    setShowKundenSuche(false)
    setKundenSucheQuery('')
    setKundenListe([])
    setLexwareKontakte([])
    showToast(kunde ? `Kunde: ${kunde.name} ✓` : 'Kunde entfernt')
  }

  async function handleLexwareKontaktImportieren(k: typeof lexwareKontakte[0]) {
    const { data: co } = await supabase.from('companies').select('id').eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '').single()
    if (!co) return
    // Anlegen in lokaler DB + Lexware-Kontakt-ID verknüpfen
    const { data: neu } = await supabase.from('customers').insert({
      company_id: co.id,
      name: k.name,
      address: k.address,
      phone: k.phone,
      email: k.email,
      lexoffice_contact_id: k.id,
    }).select().single()
    if (neu) {
      // CoS-012/DC-029, Designer-Antwort 2: Lexware-Import ist einer von
      // mehreren Wegen, wie customer_id gesetzt wird — dieselbe Regel wie
      // bei der normalen Kundenzuweisung, nicht separat behandelt.
      const baustelleId = await getOrCreateErstbaustelle(supabase, co.id, neu.id)
      const { error: importError } = await supabase
        .from('quotes')
        .update({ customer_id: neu.id, baustelle_id: baustelleId })
        .eq('id', quote.id)
      if (importError?.message?.includes('baustelle_id')) {
        await supabase.from('quotes').update({ customer_id: neu.id }).eq('id', quote.id)
      }
      setCurrentCustomer(neu as Customer)
      setCurrentBaustelleId(baustelleId)
      loadBaustellen(neu.id)
      setShowKundenSuche(false)
      setKundenSucheQuery('')
      setKundenListe([])
      setLexwareKontakte([])
      showToast(`${k.name} aus Lexware importiert ✓`)
    }
  }

  // DC-029: gewählte Baustelle diesem Angebot zuweisen (Sheet unten).
  async function handleBaustelleWaehlen(baustelleId: string) {
    const { error } = await supabase.from('quotes').update({ baustelle_id: baustelleId }).eq('id', quote.id)
    if (error) { showToast('Baustelle konnte nicht zugewiesen werden'); return }
    setCurrentBaustelleId(baustelleId)
    setShowBaustelleSheet(false)
    showToast('Baustelle zugewiesen ✓')
  }

  // DC-029: neue Baustelle für den aktuellen Kunden anlegen und direkt
  // diesem Angebot zuweisen (Formular unten im Sheet, „+ Baustelle anlegen
  // & zuweisen").
  async function handleNeueBaustelleAnlegen() {
    if (!currentCustomer || !neueBaustelleName.trim()) return
    setSavingBaustelle(true)
    const { data: co } = await supabase.from('companies').select('id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '').single()
    if (!co) { setSavingBaustelle(false); showToast('Betrieb nicht gefunden'); return }
    const { data: neu, error } = await supabase.from('baustellen').insert({
      company_id: co.id,
      customer_id: currentCustomer.id,
      name: neueBaustelleName.trim(),
      adresse: neueBaustelleAdresse.trim() || null,
      ist_erstbaustelle: false,
    }).select('id').single()
    setSavingBaustelle(false)
    if (error || !neu) { showToast('Baustelle konnte nicht angelegt werden'); return }
    setNeueBaustelleName('')
    setNeueBaustelleAdresse('')
    await loadBaustellen(currentCustomer.id)
    await handleBaustelleWaehlen(neu.id)
  }

  async function handleExport(provider: string, label: string) {
    setExporting(provider)
    const r = await fetch(`/api/integrations/${provider}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quoteId: quote.id }) })
    setExporting(null)
    if (r.ok) { trackVia(provider); showToast(`Zu ${label} übertragen ✓`) }
    else { const err = await r.json(); showToast(err.error ?? 'Export fehlgeschlagen') }
  }

  const displayItems = editItems
  const kundeIstUnternehmen = quote.customer?.ist_unternehmen === true || !!quote.customer?.ustid
  const istZugferd = company?.e_rechnung_aktiv !== false && kundeIstUnternehmen

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-bg pb-10" onClick={() => setEditingItemId(null)}>

      {/* Toast */}
      <Toast message={toast} />

      {/* DC-029: Baustelle-Wahl-Sheet — relevant, sobald die Zeile oben
          sichtbar ist (kundenBaustellen.length > 0, seit 2026-09-02). */}
      {showBaustelleSheet && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center" onClick={e => e.stopPropagation()}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowBaustelleSheet(false)} />
          <div className="relative w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-3xl px-5 pt-4 pb-8 md:pb-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-center mb-4 md:hidden"><div className="w-10 h-1 rounded-full bg-anthracite/20" /></div>
            <h2 className="font-syne font-extrabold text-anthracite text-[20px] mb-4">Baustelle wählen</h2>
            <div className="flex flex-col gap-2 mb-4">
              {kundenBaustellen.map(b => (
                <button
                  key={b.id}
                  onClick={() => handleBaustelleWaehlen(b.id)}
                  className={`flex items-center gap-3 text-left px-3 py-3 rounded-2xl border-2 transition-colors ${
                    b.id === currentBaustelleId ? 'border-yellow bg-yellow/10' : 'border-anthracite/10'
                  }`}
                >
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    b.id === currentBaustelleId ? 'border-yellow' : 'border-anthracite/25'
                  }`}>
                    {b.id === currentBaustelleId && <div className="w-[9px] h-[9px] rounded-full bg-yellow" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-anthracite">{b.name}</div>
                    <div className="text-xs text-anthracite/45 font-semibold mt-0.5">
                      {b.angebote_anzahl === 0 ? 'Noch kein Angebot' : `${b.angebote_anzahl} ${b.angebote_anzahl === 1 ? 'Angebot' : 'Angebote'}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border border-dashed border-anthracite/20 rounded-2xl p-3">
              <input
                type="text"
                value={neueBaustelleName}
                onChange={e => setNeueBaustelleName(e.target.value)}
                placeholder="Name (z. B. Bad OG links)"
                className="w-full border border-anthracite/10 rounded-xl px-3 py-2 text-sm font-semibold mb-2 focus:outline-none focus:border-yellow"
              />
              <input
                type="text"
                value={neueBaustelleAdresse}
                onChange={e => setNeueBaustelleAdresse(e.target.value)}
                placeholder="Adresse (optional)"
                className="w-full border border-anthracite/10 rounded-xl px-3 py-2 text-sm font-semibold mb-2 focus:outline-none focus:border-yellow"
              />
              <button
                onClick={handleNeueBaustelleAnlegen}
                disabled={!neueBaustelleName.trim() || savingBaustelle}
                className="w-full bg-anthracite text-white font-black rounded-xl py-2.5 text-sm disabled:opacity-50"
              >
                {savingBaustelle ? 'Wird angelegt…' : '+ Baustelle anlegen & zuweisen'}
              </button>
            </div>
            <button onClick={() => setShowBaustelleSheet(false)} className="mt-3 w-full text-center text-xs font-bold text-anthracite/40 py-2">
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Revision-Dialog */}
      {showRevisionDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-5" onClick={() => setShowRevisionDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-100 rounded-xl p-2"><AlertTriangle size={20} className="text-amber-600" /></div>
              <div className="font-black text-anthracite text-base">Angebot wurde versendet</div>
            </div>
            <p className="text-sm text-anthracite/60 font-semibold mb-5 leading-relaxed">
              Dieses Angebot wurde bereits an den Kunden geschickt. Eine Überarbeitung erstellt eine neue Version
              ({quoteNumber}-R{(quote.revision ?? 1) + 1}) als Entwurf — das Original bleibt erhalten.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRevisionErstellen}
                disabled={creatingRevision}
                className="flex items-center justify-center gap-2 bg-anthracite text-white font-black rounded-xl py-3 text-sm disabled:opacity-50"
              >
                {creatingRevision ? <Loader2 size={15} className="animate-spin" /> : <Copy size={15} />}
                Überarbeitung erstellen (Rev. {(quote.revision ?? 1) + 1})
              </button>
              <button
                onClick={() => { setShowRevisionDialog(false); setEditItems(quote.items); setEditMode(true) }}
                className="text-anthracite/50 font-bold text-sm py-2"
              >
                Trotzdem direkt bearbeiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center" onClick={() => setLightboxPhoto(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxPhoto.foto_signed_url} alt="" className="max-w-full max-h-[70vh] object-contain rounded-xl" />
          {lightboxPhoto.foto_beschreibung && (
            <div className="text-white/70 text-sm font-semibold mt-3 px-6 text-center max-w-md">{lightboxPhoto.foto_beschreibung}</div>
          )}
          <div className="flex gap-4 mt-4" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => togglePhotoInPdf(lightboxPhoto)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${lightboxPhoto.in_pdf ? 'bg-yellow text-anthracite' : 'bg-white/10 text-white'}`}
            >
              <FileText size={15} /> {lightboxPhoto.in_pdf ? 'Im PDF ✓' : 'Ins PDF'}
            </button>
            <button
              onClick={() => deletePhoto(lightboxPhoto)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-300 font-bold text-sm"
            >
              <Trash2 size={15} /> Löschen
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-anthracite md:bg-transparent px-5 md:px-8 pt-12 md:pt-8 pb-0">
        <Link href="/angebote" className="text-white/50 md:text-anthracite/40 text-sm font-semibold">← Angebote</Link>
        <div className="flex items-start justify-between mt-1 pb-4">
          <div>
            <div className="text-white md:text-anthracite font-syne font-black text-xl flex items-center gap-2 flex-wrap">
              Angebot {quoteNumber}
              {(quote.revision ?? 1) > 1 && (
                <span className="text-xs font-bold bg-amber-400 text-anthracite rounded-full px-2 py-0.5">
                  Rev. {quote.revision}
                </span>
              )}
              {quote.customer && <span className="font-semibold opacity-50"> · {quote.customer.name}</span>}
            </div>
            {/* Echtzeit-Gesamtsumme */}
            <div className="text-yellow font-black text-2xl mt-1">{fmt(totalGross)}</div>
            {/* DC-003-Nachtrag (Sandy, 2026-08-24, live getestet): Status-Button
                stand vorher in der schmalen Icon-Reihe rechts, zwischen Zahnrad
                und Bearbeiten/Speichern — dort sah er wie ein drittes Icon aus
                ("dieser kleine Punkt ist zum Status ändern?! da kommt kein
                Schwein drauf"). Jetzt eine eigene, klar als Button erkennbare
                Zeile direkt unter der Summe: sichtbarer Rahmen (macht ihn von
                einem reinen Info-Badge unterscheidbar), größerer Punkt,
                Chevron als Tap-Hinweis. */}
            <button
              onClick={() => setShowStatusPicker(true)}
              className={`flex items-center gap-1.5 text-sm font-bold pl-2.5 pr-2 py-1.5 rounded-full border border-current/20 mt-2 active:opacity-70 transition-opacity ${status.bg} ${status.text}`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: status.dot }} />
              {status.label}
              <ChevronDown size={14} strokeWidth={3} />
            </button>
            <div className="text-white/40 text-xs font-semibold mt-2">
              {isKleinunternehmer ? 'kein MwSt-Ausweis · ' : `inkl. ${company?.vat_rate ?? 0}% MwSt · `}
              {company?.payment_days ?? 14} Tage Zahlungsziel
            </div>
            {autosaveLabel && <div className="text-white/30 text-xs font-semibold mt-0.5">{autosaveLabel}</div>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowOptionen(true)} title="Einstellungen für dieses Angebot"
              className="bg-white/10 md:bg-anthracite/5 text-white md:text-anthracite/60 rounded-xl p-2 hover:bg-yellow/30 transition-colors">
              <Settings size={16} />
            </button>
            {!editMode ? (
              <button onClick={handleEditClick}
                className="bg-white/10 text-white rounded-xl p-2">
                <Pencil size={16} strokeWidth={2.5} />
              </button>
            ) : (
              <button onClick={() => saveEdits()} disabled={saving}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 font-black text-sm transition-colors ${hasChanges ? 'bg-yellow text-anthracite' : 'bg-white/10 text-white/40'} disabled:opacity-50`}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
                Speichern
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-white/10">
          <button
            onClick={() => setActiveTab('positionen')}
            className={`flex-1 py-3 font-black text-sm border-b-2 transition-colors ${activeTab === 'positionen' ? 'border-yellow text-yellow' : 'border-transparent text-white/40'}`}
          >
            Positionen
          </button>
          <button
            onClick={() => setActiveTab('notizen')}
            className={`flex-1 py-3 font-black text-sm border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'notizen' ? 'border-yellow text-yellow' : 'border-transparent text-white/40'}`}
          >
            {/* CoS-021/DC-034: "Notizen & Fotos" war die konkrete
                Verwirrungsquelle aus Sandys Feedback — klang nach einem
                einzigen Bereich, war aber zwei getrennte Systeme mit
                getrennten Fotos. Jetzt: Fotos zuerst (der jetzt echte,
                gemeinsame Foto-Pool aus der Aufmaß-Aufnahme), "Notiz"
                bewusst im Singular (ein einzelnes privates Textfeld, siehe
                Kommentar bei "Interne Notiz" unten). */}
            <Camera size={14} strokeWidth={2.5} />
            Fotos & Notiz
            {photos.length > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'notizen' ? 'bg-yellow text-anthracite' : 'bg-white/20 text-white'}`}>{photos.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Einheit-Picker Modal */}
      {showRaumPicker && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowRaumPicker(false)}>
          <div className="bg-white w-full rounded-t-3xl px-5 pt-4 pb-10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-anthracite/20" /></div>
            <div className="font-syne font-black text-anthracite text-[18px] mb-4">Raum hinzufügen</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { name: 'Wohnzimmer', emoji: '🛋' },
                { name: 'Schlafzimmer', emoji: '🛏' },
                { name: 'Küche', emoji: '🍳' },
                { name: 'Bad', emoji: '🚿' },
                { name: 'Flur', emoji: '🚪' },
                { name: 'Kinderzimmer', emoji: '🧸' },
                { name: 'Arbeitszimmer', emoji: '💼' },
                { name: 'Keller', emoji: '📦' },
                { name: 'Balkon', emoji: '🌿' },
                { name: 'Garage', emoji: '🚗' },
                { name: 'Treppenhaus', emoji: '📐' },
                { name: 'Esszimmer', emoji: '🍽' },
              ].map(r => (
                <button key={r.name} onClick={() => addRaumPosition(r.name)}
                  className="flex items-center gap-2.5 bg-bg hover:bg-yellow/15 rounded-2xl px-4 py-3 text-left transition-colors">
                  <span className="text-xl">{r.emoji}</span>
                  <span className="font-extrabold text-anthracite text-[14px]">{r.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Anderer Raum…"
                className="flex-1 bg-bg rounded-xl px-4 py-3 font-semibold text-[14px] text-anthracite focus:outline-none focus:ring-2 focus:ring-yellow"
                onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) addRaumPosition((e.target as HTMLInputElement).value.trim()) }}
              />
              <button
                onClick={e => {
                  const input = (e.currentTarget.previousSibling as HTMLInputElement)
                  if (input.value.trim()) addRaumPosition(input.value.trim())
                }}
                className="bg-anthracite text-white rounded-xl px-4 font-extrabold text-[14px]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {unitPickerItemId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setUnitPickerItemId(null)}>
          <div className="bg-white w-full rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="font-black text-anthracite text-lg mb-4">Einheit ändern</div>
            <div className="grid grid-cols-3 gap-2">
              {UNITS.map(u => (
                <button key={u} onClick={() => quickUnitChange(unitPickerItemId, u)}
                  className={`py-3 rounded-2xl border-2 font-black text-sm transition-colors ${
                    displayItems.find(i => i.id === unitPickerItemId)?.unit === u
                      ? 'border-yellow bg-yellow/10 text-anthracite'
                      : 'border-anthracite/8 text-anthracite/60'
                  }`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status-Picker Modal */}
      {showStatusPicker && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowStatusPicker(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="font-black text-anthracite text-lg mb-4">Status ändern</div>
            <div className="flex flex-col gap-2">
              {/* DC-003: vorher fix ['bereit','sent','accepted','rejected','archived']
                  ohne Weg zurück zu 'draft' — waehlbareStatus() bietet den, aber
                  bewusst nur ab 'bereit', siehe Kommentar in src/lib/status.ts. */}
              {waehlbareStatus(currentStatus).map(key => {
                const cfg = getStatusInfo(key)
                return (
                  <button key={key} onClick={() => changeStatus(key)}
                    className={`flex items-center justify-between w-full rounded-2xl px-4 py-3.5 border-2 ${currentStatus === key ? 'border-yellow bg-yellow/10' : 'border-anthracite/8'}`}>
                    <span className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                      <span className="flex flex-col items-start">
                        <span className="font-bold text-anthracite">{cfg.label}</span>
                        {key === 'draft' && (
                          <span className="text-[11px] font-semibold text-anthracite/40">zurück zum Bearbeiten</span>
                        )}
                      </span>
                    </span>
                    {currentStatus === key && <Check size={18} color="var(--color-anthracite)" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* KI-Vorschläge Bar */}
      {activeHints.length > 0 && activeTab === 'positionen' && (
        <div className="px-5 pt-4 flex flex-col gap-2">
          {activeHints.map(hint => (
            <div key={hint.empfehlung_title} className="flex items-center gap-3 bg-yellow/15 border border-yellow/40 rounded-2xl px-4 py-3">
              <span className="text-lg">💡</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-anthracite">{hint.empfehlung_title} fehlt</span>
                {hint.empfehlung_unit_price > 0 && (
                  <span className="text-xs text-anthracite/50 font-semibold ml-2">{fmt(hint.empfehlung_unit_price)}/{hint.empfehlung_unit}</span>
                )}
              </div>
              <button onClick={() => addHintItem(hint)}
                className="bg-yellow text-anthracite font-black text-xs px-3 py-1.5 rounded-xl shrink-0">
                + Hinzufügen
              </button>
              <button onClick={() => setDismissedHints(prev => new Set([...prev, hint.empfehlung_title]))}
                className="text-anthracite/30 shrink-0">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: POSITIONEN ─────────────────────────────────────────────── */}
      {activeTab === 'positionen' && (
        <div className="px-5 md:px-8 pt-4 md:grid md:grid-cols-[1fr_340px] md:gap-6 md:items-start flex flex-col gap-4">

          {/* Linke Spalte */}
          <div className="flex flex-col gap-4">
            {/* Versandweg-Badges */}
            {sentVia.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sentVia.map(via => (
                  <span key={via} className="text-xs font-bold bg-white border border-anthracite/10 text-anthracite/60 px-2.5 py-1 rounded-full">
                    {VIA_LABELS[via] ?? via}
                  </span>
                ))}
              </div>
            )}

            {/* Kunde */}
            <div className="bg-white rounded-2xl p-4 border border-anthracite/5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-anthracite/40 uppercase tracking-wide">Kunde</div>
                <button onClick={() => setShowKundenSuche(v => !v)} className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${currentCustomer ? 'text-yellow' : 'bg-yellow text-anthracite hover:bg-[#D4A800]'}`}>
                  {currentCustomer ? 'Ändern' : '+ Kunde'}
                </button>
              </div>
              {showKundenSuche && (
                <div className="mb-3">
                  <input
                    autoFocus
                    type="text"
                    value={kundenSucheQuery}
                    onChange={e => handleKundenSuche(e.target.value)}
                    placeholder="Kundenname suchen..."
                    className="w-full border border-anthracite/10 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-yellow"
                  />
                  {(kundenListe.length > 0 || lexwareKontakte.length > 0) && (
                    <div className="mt-1 border border-anthracite/10 rounded-xl overflow-hidden">
                      {kundenListe.length > 0 && (
                        <>
                          <div className="px-3 py-1.5 text-[10px] font-black text-anthracite/30 uppercase tracking-wide bg-bg">Meine Kunden</div>
                          {kundenListe.map(k => (
                            <button key={k.id} onClick={() => handleKundeZuweisen(k)}
                              className="w-full text-left px-3 py-2.5 text-sm font-semibold hover:bg-bg border-b border-anthracite/5 last:border-0">
                              <div className="font-bold text-anthracite">{k.name}</div>
                              {k.address && <div className="text-xs text-anthracite/40 truncate">{k.address.split('\n')[0]}</div>}
                            </button>
                          ))}
                        </>
                      )}
                      {lexwareKontakte.length > 0 && (
                        <>
                          <div className="px-3 py-1.5 text-[10px] font-black text-[#003DA5]/60 uppercase tracking-wide bg-[#003DA5]/5">Lexware Office</div>
                          {lexwareKontakte.map(k => (
                            <button key={k.id} onClick={() => handleLexwareKontaktImportieren(k)}
                              className="w-full text-left px-3 py-2.5 text-sm font-semibold hover:bg-bg border-b border-anthracite/5 last:border-0">
                              <div className="font-bold text-anthracite">{k.name}</div>
                              {k.address && <div className="text-xs text-anthracite/40 truncate">{k.address.split('\n')[0]}</div>}
                              <div className="text-[10px] text-[#003DA5]/60 font-bold mt-0.5">Importieren & zuweisen</div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                  {currentCustomer && (
                    <button onClick={() => handleKundeZuweisen(null)} className="mt-2 text-xs font-bold text-red-400 hover:text-red-600">
                      Kunde entfernen
                    </button>
                  )}
                </div>
              )}
              {currentCustomer ? (
                <>
                  <div className="font-black text-anthracite">{currentCustomer.name}</div>
                  {currentCustomer.address && <div className="text-sm text-anthracite/60 font-semibold">{currentCustomer.address}</div>}
                  {currentCustomer.phone && (
                    <a href={`tel:${currentCustomer.phone}`} className="flex items-center gap-2 text-sm text-anthracite font-semibold mt-1">
                      <Phone size={14} className="text-yellow" />{currentCustomer.phone}
                    </a>
                  )}
                  {/* DC-029, korrigiert 2026-09-02 (Sandys Auftrag "IMMER
                      Baustelle wählbar, bei JEDEM Angebot Kunde+Baustelle"):
                      sichtbar, sobald der Kunde mindestens eine Baustelle
                      hat — also praktisch immer, auch mit nur der
                      automatischen Erstbaustelle. */}
                  {kundenBaustellen.length > 0 && (() => {
                    const aktuelle = kundenBaustellen.find(b => b.id === currentBaustelleId)
                    return (
                      <button
                        onClick={() => setShowBaustelleSheet(true)}
                        className="mt-2 w-full flex items-center gap-1.5 bg-bg border border-anthracite/10 rounded-xl px-3 py-2 text-xs font-bold text-anthracite text-left"
                      >
                        <span>🏗️</span>
                        <span>{aktuelle?.name ?? 'Baustelle wählen'}</span>
                        {aktuelle && (
                          <span className="text-anthracite/40 font-semibold">
                            · {aktuelle.angebote_anzahl} {aktuelle.angebote_anzahl === 1 ? 'Angebot' : 'Angebote'}
                          </span>
                        )}
                        <span className="ml-auto text-anthracite/30">›</span>
                      </button>
                    )
                  })()}
                </>
              ) : (
                <div className="text-sm text-anthracite/30 font-semibold">Kein Kunde zugewiesen</div>
              )}
            </div>

            {/* Positionen */}
            <div className="bg-white rounded-2xl border border-anthracite/5" onClick={e => e.stopPropagation()}>
              <div className="px-4 pt-4 pb-2">
                <div className="font-black text-anthracite">Positionen</div>
              </div>

              {editItems.some(item => !item.price_item_id && item.unit_price <= 0) && (
                <div className="mx-3 mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 flex gap-2">
                  <AlertTriangle size={17} className="mt-0.5 shrink-0 text-red-500" />
                  <div>
                    <div className="text-xs font-black text-red-700">
                      {editItems.filter(item => !item.price_item_id && item.unit_price <= 0).length === 1
                        ? 'Bei 1 Position fehlt noch der Preis.'
                        : `Bei ${editItems.filter(item => !item.price_item_id && item.unit_price <= 0).length} Positionen fehlen noch Preise.`}
                    </div>
                    <div className="mt-0.5 text-[11px] font-semibold text-red-600/80">
                      Das Angebot bleibt bearbeitbar. Lege den Preis direkt an der markierten Position an.
                    </div>
                  </div>
                </div>
              )}

              {/* Action-Row oben — immer sichtbar */}
              {editMode && (
                <div className="border-t border-b border-anthracite/5 grid grid-cols-3">
                  <Link
                    href={`/angebot/${quote.id}/entwurf`}
                    className="flex flex-col items-center gap-1 py-3 text-anthracite/40 hover:text-anthracite/70 hover:bg-bg transition-colors"
                  >
                    <Mic size={16} strokeWidth={2.5} />
                    <span className="text-[11px] font-black">Aufnahme</span>
                  </Link>
                  <button
                    onClick={addEditItem}
                    className="flex flex-col items-center gap-1 py-3 text-anthracite/40 hover:text-anthracite/70 hover:bg-bg transition-colors border-x border-anthracite/5"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span className="text-[11px] font-black">Position</span>
                  </button>
                  <button
                    onClick={() => setShowRaumPicker(true)}
                    className="flex flex-col items-center gap-1 py-3 text-anthracite/40 hover:text-anthracite/70 hover:bg-bg transition-colors"
                  >
                    <span className="text-[15px] leading-none">🏠</span>
                    <span className="text-[11px] font-black">Raum</span>
                  </button>
                </div>
              )}


              {editMode ? (() => {
                const gruppen = gruppiereNachStruktur(editItems, (optStruktur || company?.angebot_struktur || 'raeume'))
                if (!gruppen) {
                  return (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={editItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        {editItems.map(item => (
                          <SortableItem key={item.id} item={item} editingId={editingItemId} setEditingId={setEditingItemId} updateEditItem={updateEditItem} removeEditItem={removeEditItem} vatRate={company?.vat_rate ?? 0} onUnitPick={setUnitPickerItemId} onInfo={setInfoItemId} onAddMaterial={addMaterialFor} onAddPrice={item => { setPriceItemToAdd(item); setNewDatabasePrice(''); setNewDatabaseUnit(item.unit); setDatabasePriceError('') }} priceItems={priceItems} onPreisVorschlag={applyPreisVorschlag} onNeuePosition={legeNeuenPreisAn} />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )
                }
                const { raeume, allgemein, hatMehrereRaeume } = gruppen
                return (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={editItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                      {raeume.map(raum => {
                        // Wand-/Deckenarbeiten im Raum? Bei reinem Bodenauftrag nur Boden-Feld zeigen.
                        const wandRelevant = raum.items.some(gi =>
                          /wand|wände|decke|tapete|spachtel|glätt|stuck|grundier|voranstrich|streich|akzent|lackier/i.test(gi.titleDisplay ?? '')
                        )
                        return (
                        <div key={raum.raumName}>
                          <div className={`border-t border-anthracite/5 px-4 py-2.5 flex items-center justify-between ${hatMehrereRaeume ? 'bg-bg' : 'bg-yellow/8'}`}>
                            <div className="flex items-center gap-1.5">
                              <span>{raum.emoji}</span>
                              <span className={`font-black uppercase tracking-widest ${hatMehrereRaeume ? 'text-[10px] text-anthracite/50' : 'text-xs text-anthracite'}`}>{raum.raumName}</span>
                            </div>
                            {hatMehrereRaeume && <span className="text-[11px] font-black text-anthracite/40">{fmt(raum.summe)}</span>}
                          </div>
                          <RaumDimensionenZeile
                            raumName={raum.raumName}
                            dim={raumDetails[raum.raumName] ?? {}}
                            onChange={patch => handleRaumDimChange(raum.raumName, patch)}
                            onGrundriss={() => setGrundrissRaum(raum.raumName)}
                            wandRelevant={wandRelevant}
                          />
                          {raum.items.map(gi => {
                            const orig = editItems.find(i => i.id === gi.id)!
                            return <SortableItem key={orig.id} item={orig} titleOverride={gi.titleDisplay} editingId={editingItemId} setEditingId={setEditingItemId} updateEditItem={updateEditItem} removeEditItem={removeEditItem} vatRate={company?.vat_rate ?? 0} onUnitPick={setUnitPickerItemId} onInfo={setInfoItemId} onAddMaterial={addMaterialFor} onAddPrice={item => { setPriceItemToAdd(item); setNewDatabasePrice(''); setNewDatabaseUnit(item.unit); setDatabasePriceError('') }} priceItems={priceItems} onPreisVorschlag={applyPreisVorschlag} onNeuePosition={legeNeuenPreisAn} />
                          })}
                        </div>
                        )
                      })}
                      {allgemein.length > 0 && (
                        <div>
                          <div className="border-t border-anthracite/5 px-4 py-2 bg-bg">
                            <span className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest">📋 Allgemein</span>
                          </div>
                          {allgemein.map(gi => {
                            const orig = editItems.find(i => i.id === gi.id)!
                            return <SortableItem key={orig.id} item={orig} titleOverride={gi.title} editingId={editingItemId} setEditingId={setEditingItemId} updateEditItem={updateEditItem} removeEditItem={removeEditItem} vatRate={company?.vat_rate ?? 0} onUnitPick={setUnitPickerItemId} onInfo={setInfoItemId} onAddMaterial={addMaterialFor} onAddPrice={item => { setPriceItemToAdd(item); setNewDatabasePrice(''); setNewDatabaseUnit(item.unit); setDatabasePriceError('') }} priceItems={priceItems} onPreisVorschlag={applyPreisVorschlag} onNeuePosition={legeNeuenPreisAn} />
                          })}
                        </div>
                      )}
                    </SortableContext>
                  </DndContext>
                )
              })() : (() => {
                const gruppen = gruppiereNachStruktur(displayItems, (optStruktur || company?.angebot_struktur || 'raeume'))

                const renderItem = (title: string, item: EditItem) => (
                  <div key={item.id} className="border-t border-anthracite/5 px-4 py-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-anthracite text-sm">{title}</div>
                        {item.description && <div className="text-xs text-anthracite/50 font-semibold mt-0.5">{item.description}</div>}
                        <div className="text-xs text-anthracite/40 font-semibold mt-1 flex items-center gap-1 flex-wrap">
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => setUnitPickerItemId(item.id)}
                            className="bg-anthracite/6 hover:bg-yellow/20 text-anthracite/60 font-black text-[10px] px-1.5 py-0.5 rounded-md transition-colors"
                          >
                            {item.unit}
                          </button>
                          <span>× {fmt(item.unit_price)}</span>
                          {item.berechnungsweg && (
                            <button
                              onClick={() => setInfoItemId(item.id)}
                              title="Rechenweg anzeigen"
                              className="ml-0.5 w-4 h-4 rounded-full bg-anthracite/8 hover:bg-yellow/40 text-anthracite/60 font-black text-[10px] leading-none flex items-center justify-center transition-colors"
                            >
                              i
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="font-black text-anthracite shrink-0">{fmt(item.total_price)}</div>
                    </div>
                  </div>
                )

                if (!gruppen) {
                  return displayItems.map(item => renderItem(item.title, item))
                }

                const { raeume, allgemein, hatMehrereRaeume } = gruppen

                return (
                  <>
                    {raeume.map(raum => (
                      <div key={raum.raumName}>
                        {/* Raum-Header */}
                        <div className={`border-t border-anthracite/5 px-4 py-2.5 flex items-center justify-between ${
                          hatMehrereRaeume ? 'bg-bg' : 'bg-yellow/8'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <span>{raum.emoji}</span>
                            <span className={`font-black uppercase tracking-widest ${
                              hatMehrereRaeume
                                ? 'text-[10px] text-anthracite/50'
                                : 'text-xs text-anthracite'
                            }`}>{raum.raumName}</span>
                          </div>
                          {hatMehrereRaeume && (
                            <span className="text-[11px] font-black text-anthracite/40">{fmt(raum.summe)}</span>
                          )}
                        </div>

                        {/* Raum-Dimensionen */}
                        <RaumDimensionenZeile
                          raumName={raum.raumName}
                          dim={raumDetails[raum.raumName] ?? {}}
                          onChange={patch => handleRaumDimChange(raum.raumName, patch)}
                          onGrundriss={() => setGrundrissRaum(raum.raumName)}
                        />

                        {/* Positionen ohne Raumzusatz */}
                        {raum.items.map(gi => {
                          const orig = displayItems.find(i => i.id === gi.id)!
                          return renderItem(gi.titleDisplay, orig)
                        })}

                        {/* Zwischensumme je Raum */}
                        {hatMehrereRaeume && (
                          <div className="border-t border-dashed border-anthracite/8 px-4 py-2 flex justify-between">
                            <span className="text-xs text-anthracite/40 font-semibold">Summe {raum.raumName}</span>
                            <span className="text-xs font-black text-anthracite/60">{fmt(raum.summe)}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Allgemeine Positionen ohne Raum */}
                    {allgemein.length > 0 && (
                      <div>
                        <div className="border-t border-anthracite/5 px-4 py-2 bg-bg">
                          <span className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest">📋 Allgemein</span>
                        </div>
                        {allgemein.map(gi => {
                          const orig = displayItems.find(i => i.id === gi.id)!
                          return renderItem(gi.title, orig)
                        })}
                      </div>
                    )}
                  </>
                )
              })()}

            </div>

            {/* Öffentliche Notizen (erscheinen im PDF) */}
            {!editMode && quote.notes && (
              <div className="bg-white rounded-2xl p-4 border border-anthracite/5">
                <div className="text-xs font-bold text-anthracite/40 uppercase tracking-wide mb-2">Anmerkungen</div>
                <div className="text-sm text-anthracite/70 font-semibold">{quote.notes}</div>
              </div>
            )}

            {/* Edit: Rabatt & Zuschläge */}
            {editMode && (
              <div className="bg-white rounded-2xl p-4 border border-anthracite/5">
                <button
                  onClick={() => setShowExtras(v => !v)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2 text-sm font-black text-anthracite/60">
                    <MoreHorizontal size={16} />
                    Rabatt & Zuschläge
                  </div>
                  <ChevronDown size={16} className={`text-anthracite/40 transition-transform ${showExtras ? 'rotate-180' : ''}`} />
                </button>

                {showExtras && (
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-anthracite/40 mb-1 block">Rabatt %</label>
                        <div className="flex items-center gap-1 bg-bg rounded-xl px-3 py-2">
                          <Percent size={14} className="text-anthracite/30" />
                          <input type="number" inputMode="decimal" min={0} max={100} value={discountPercent || ''}
                            onChange={e => { setDiscountPercent(Number(e.target.value)); setDiscountAmount(0) }}
                            placeholder="0" className="flex-1 bg-transparent font-bold text-anthracite text-sm focus:outline-none w-full" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-anthracite/40 mb-1 block">oder absolut €</label>
                        <div className="flex items-center gap-1 bg-bg rounded-xl px-3 py-2">
                          <Tag size={14} className="text-anthracite/30" />
                          <input type="number" inputMode="decimal" min={0} value={discountAmount || ''}
                            onChange={e => { setDiscountAmount(Number(e.target.value)); setDiscountPercent(0) }}
                            placeholder="0" className="flex-1 bg-transparent font-bold text-anthracite text-sm focus:outline-none w-full" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-anthracite/40 mb-1 block">Zuschlag Bezeichnung</label>
                      <input value={surchargeLabel} onChange={e => setSurchargeLabel(e.target.value)}
                        className="w-full bg-bg rounded-xl px-3 py-2 font-bold text-anthracite text-sm focus:outline-none mb-2" />
                      <div className="flex items-center gap-1 bg-bg rounded-xl px-3 py-2">
                        <Tag size={14} className="text-anthracite/30" />
                        <input type="number" inputMode="decimal" min={0} value={surchargeAmount || ''}
                          onChange={e => setSurchargeAmount(Number(e.target.value))}
                          placeholder="0" className="flex-1 bg-transparent font-bold text-anthracite text-sm focus:outline-none w-full" />
                        <span className="text-xs text-anthracite/40 font-bold">€</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edit-Aktionen leben in der Fußleiste (Abbrechen · Speichern · Fertigstellen) */}
          </div>

          {/* Rechte Spalte: Summen + Aktionen */}
          <div className="flex flex-col gap-3">
            {/* Summenblock */}
            <div className="bg-anthracite rounded-2xl p-4">
              <div className="flex justify-between text-white/60 font-semibold text-sm mb-1">
                <span>Nettosumme</span><span>{fmt(baseNet)}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-yellow font-semibold text-sm mb-1">
                  <span>Rabatt {discountPercent > 0 ? `${discountPercent}%` : ''}</span>
                  <span>−{fmt(discountValue)}</span>
                </div>
              )}
              {surchargeAmount > 0 && (
                <div className="flex justify-between text-white/60 font-semibold text-sm mb-1">
                  <span>{surchargeLabel}</span><span>+{fmt(surchargeAmount)}</span>
                </div>
              )}
              {(discountValue > 0 || surchargeAmount > 0) && (
                <div className="flex justify-between text-white/80 font-semibold text-sm mb-1.5 border-t border-white/10 pt-1.5">
                  <span>Netto gesamt</span><span>{fmt(netWithSurcharge)}</span>
                </div>
              )}
              {!isKleinunternehmer && company && company.vat_rate > 0 && (
                <div className="flex justify-between text-white/60 font-semibold text-sm mb-1.5">
                  <span>MwSt. {company.vat_rate}%</span><span>{fmt(totalVat)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-black text-xl border-t border-white/20 pt-2 mt-1">
                <span>GESAMT</span><span>{fmt(totalGross)}</span>
              </div>
              {isKleinunternehmer && (
                <div className="text-white/30 text-xs font-semibold mt-2">Kein MwSt.-Ausweis gem. §19 UStG</div>
              )}
              {quote.valid_until && (
                <div className="text-white/30 text-xs font-semibold mt-1">Gültig bis {fmtDate(quote.valid_until)}</div>
              )}
            </div>

            {/* Aktionen (nur im Lese-Modus) */}
            {!editMode && (
              <>
                {quote.signed_at && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                    <Check size={20} color="#16a34a" strokeWidth={2.5} />
                    <div>
                      <div className="font-black text-green-800 text-sm">Unterschrieben</div>
                      <div className="text-green-700 text-xs font-semibold">{quote.signed_by} · {fmtDate(quote.signed_at)}</div>
                    </div>
                  </div>
                )}

                {/* Aktionen leben ALLE in der Fußleiste (⋯) — kein zweiter Satz Buttons hier */}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: FOTOS & NOTIZ ────────────────────────────────────────────
          CoS-021/DC-034 (2026-08-25): Ex-Tab "Notizen & Fotos" bündelte zwei
          Systeme unter einem Namen, der nach EINEM Bereich klang. Jetzt echt
          ein Bereich: alle Fotos kommen aus entwurf_aufnahmen (derselben
          Tabelle wie die Aufmaß-Aufnahme — ein Foto-Pool statt zwei), Fotos
          zuerst (das ist jetzt die "echte" Dokumentation), die private
          Notiz eigenständig und klar benannt darunter. */}
      {activeTab === 'notizen' && (
        <div className="px-5 md:px-8 pt-5 flex flex-col gap-4 pb-10">

          {/* Fotos */}
          <div className="bg-white rounded-2xl p-4 border border-anthracite/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-black text-anthracite">Fotos vom Aufmaß</div>
                <div className="text-xs text-anthracite/40 font-semibold mt-0.5">
                  {photos.length === 0 ? 'Noch keine Fotos' : `${photos.length} Foto${photos.length !== 1 ? 's' : ''}`} · Tippen zum Vergrößern
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                className="flex items-center gap-2 bg-yellow text-anthracite font-black text-sm px-4 py-2 rounded-xl disabled:opacity-50"
              >
                {photoUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} strokeWidth={2.5} />}
                {photoUploading ? 'Lädt...' : 'Foto hinzufügen'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) { setPendingPhotoFile(file); setPendingPhotoCaption('') }
                  e.target.value = ''
                }}
              />
            </div>

            {photosLoading && (
              <div className="flex items-center justify-center py-8 text-anthracite/30">
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}

            {!photosLoading && photos.length === 0 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-anthracite/15 rounded-2xl py-10 flex flex-col items-center gap-3 text-anthracite/30 hover:border-yellow/50 transition-colors"
              >
                <ImageIcon size={32} strokeWidth={1.5} />
                <span className="font-bold text-sm">Fotos vom Aufmaß hinzufügen</span>
                <span className="text-xs">Kamera oder Galerie</span>
              </button>
            )}

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map(photo => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-bg"
                    onClick={() => setLightboxPhoto(photo)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.foto_signed_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {photo.in_pdf && (
                      <div className="absolute bottom-1 right-1 bg-yellow rounded-md px-1.5 py-0.5">
                        <span className="text-[9px] font-black text-anthracite">PDF</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-anthracite/15 flex items-center justify-center text-anthracite/20 hover:border-yellow/50 transition-colors"
                >
                  <Plus size={24} strokeWidth={1.5} />
                </button>
              </div>
            )}

            {photos.some(p => p.in_pdf) && (
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-anthracite/40 bg-bg rounded-xl px-3 py-2">
                <FileText size={13} />
                {photos.filter(p => p.in_pdf).length} Foto{photos.filter(p => p.in_pdf).length !== 1 ? 's' : ''} werden ins PDF übernommen
              </div>
            )}
          </div>

          {/* Interne Notiz — bewusst Singular und optisch klar getrennt von
              den Fotos oben: anderer Zweck (privater Vermerk für einen
              selbst, nie fürs PDF/den Kunden gedacht) als die Foto-
              Dokumentation, siehe CoS-021 Punkt 2. */}
          <div className="bg-white rounded-2xl p-4 border border-anthracite/5">
            <div className="flex items-center justify-between mb-1">
              <div className="font-black text-anthracite">Interne Notiz</div>
              <span className="text-xs font-semibold text-anthracite/30 bg-anthracite/5 px-2.5 py-1 rounded-full">Nicht im PDF</span>
            </div>
            <div className="text-xs text-anthracite/40 font-semibold mb-3">Nur für dich — der Kunde sieht das nie.</div>
            <textarea
              value={internalNotes}
              onChange={e => scheduleAutosaveNotes(e.target.value)}
              placeholder="Aufmaß-Notizen, Besonderheiten, Hinweise für später..."
              rows={5}
              className="w-full bg-bg rounded-xl px-4 py-3 text-anthracite font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-yellow/40 resize-none"
            />
            {autosaveLabel && <div className="text-xs text-anthracite/30 font-semibold mt-1">{autosaveLabel}</div>}
          </div>
        </div>
      )}

      {/* Foto-Beschreibung vor dem Hochladen — optional, landet in
          foto_beschreibung und damit automatisch als Bildunterschrift im
          PDF, falls das Foto dort mit aufgenommen wird. PATCH /api/entwurf/
          foto kann nur in_pdf ändern, keine Beschreibung nachträglich —
          darum hier abfragen, bevor der Upload überhaupt losgeht. */}
      {pendingPhotoFile && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setPendingPhotoFile(null)}>
          <div className="bg-white w-full rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-anthracite/20" /></div>
            <div className="font-syne font-black text-anthracite text-[18px] mb-4">Foto hinzufügen</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {pendingPhotoPreviewUrl && (
              <img src={pendingPhotoPreviewUrl} alt="" className="w-full max-h-64 object-cover rounded-2xl mb-4" />
            )}
            <input
              type="text"
              value={pendingPhotoCaption}
              onChange={e => setPendingPhotoCaption(e.target.value)}
              placeholder="Beschreibung (optional) — z.B. „Wasserschaden Decke Bad“"
              className="w-full bg-bg rounded-xl px-4 py-3 font-semibold text-[14px] text-anthracite focus:outline-none focus:ring-2 focus:ring-yellow mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setPendingPhotoFile(null)}
                className="flex-1 py-3 rounded-xl bg-bg text-anthracite/60 font-semibold text-sm"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  const file = pendingPhotoFile
                  const caption = pendingPhotoCaption
                  setPendingPhotoFile(null)
                  if (file) handlePhotoUpload(file, caption)
                }}
                className="flex-1 py-3 rounded-xl bg-anthracite text-white font-black text-sm"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer-Bar ──────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3">
        {editMode ? (
          /* ENTWURF-MODUS: Abbrechen | Speichern | Fertigstellen */
          <div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditMode(false); setEditItems(quote.items); setEditingItemId(null); setHasChanges(false) }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white text-anthracite/60 font-semibold text-sm border border-anthracite/10 shrink-0"
              >
                Abbrechen
              </button>
              <button
                onClick={() => saveEdits()}
                disabled={saving || !hasChanges}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-bg text-anthracite font-semibold text-sm border border-anthracite/10 disabled:opacity-40"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                Speichern
              </button>
              <button
                onClick={fertigstellen}
                disabled={saving || editItems.length === 0 || !currentCustomer}
                title={editItems.length === 0 ? 'Mindestens eine Position nötig' : !currentCustomer ? 'Bitte zuerst einen Kunden zuweisen' : undefined}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-anthracite text-white font-bold text-sm disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} strokeWidth={2.5} />}
                Fertigstellen
              </button>
            </div>
            {/* DC-010: Guardrail sichtbar erklären statt nur den Button stumm zu deaktivieren */}
            {!saving && (editItems.length === 0 || !currentCustomer) && (
              <div className="text-xs text-anthracite/40 font-semibold text-center mt-2">
                {editItems.length === 0
                  ? 'Noch keine Position — füge mindestens eine hinzu, um fertigzustellen.'
                  : 'Noch kein Kunde zugewiesen — weise oben einen Kunden zu, um fertigzustellen.'}
              </div>
            )}
          </div>
        ) : (
          /* FERTIGGESTELLT / VERSENDET: Vorschau | Senden */
          <div className="flex gap-2">
            {DRAFT_STATUSES.includes(currentStatus) || currentStatus === 'bereit' ? (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-bg text-anthracite font-semibold text-sm border border-anthracite/10 shrink-0"
              >
                <Pencil size={14} strokeWidth={2.5} /> Bearbeiten
              </button>
            ) : null}
            <button
              onClick={() => { setVorschauInitialTab('vorschau'); setShowVorschau(true) }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-bg text-anthracite font-semibold text-sm border border-anthracite/10"
            >
              <FileText size={15} strokeWidth={2} /> Vorschau
            </button>
            <button
              onClick={() => { setVorschauInitialTab('senden'); setShowVorschau(true) }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-anthracite text-white font-bold text-sm"
            >
              <Share2 size={15} strokeWidth={2.5} /> Senden →
            </button>
            {/* Alle weiteren Aktionen an EINER Stelle */}
            <button
              onClick={() => setShowAktionen(true)}
              title="Weitere Aktionen"
              className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-bg text-anthracite/60 border border-anthracite/10 shrink-0"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ── VorschauUndVersand Bottom Sheet ────────────────────────────── */}
      {showVorschau && company && (
        <VorschauUndVersand
          quote={{
            ...quote,
            items: displayItems as QuoteItem[],
            discount_percent: discountPercent,
            discount_amount: discountAmount,
            surcharge_amount: surchargeAmount,
            surcharge_label: surchargeLabel,
          } as Parameters<typeof VorschauUndVersand>[0]['quote']}
          company={company}
          quoteNumber={quoteNumber}
          initialTab={vorschauInitialTab}
          onClose={() => setShowVorschau(false)}
          onSent={(via) => {
            setCurrentStatus('sent')
            if (!sentVia.includes(via)) setSentVia(prev => [...prev, via])
            showToast(`Angebot gesendet via ${via} ✓`)
            setShowVorschau(false)
          }}
        />
      )}

      <ConfirmSheet
        open={showDeleteSheet}
        title="Angebot löschen?"
        text="Das Angebot wird endgültig gelöscht. Diese Aktion kann nicht rückgängig gemacht werden."
        confirmLabel="Löschen"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteSheet(false)}
      />

      {infoItemId && (() => {
        const it = displayItems.find(i => i.id === infoItemId)
        if (!it) return null
        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setInfoItemId(null)}>
            <div className="bg-white w-full rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="font-black text-anthracite text-lg leading-tight">{it.title}</div>
                <button onClick={() => setInfoItemId(null)} className="text-anthracite/40 font-black text-xl leading-none shrink-0">×</button>
              </div>
              <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1">🧮 So gerechnet</div>
              <div className="bg-bg rounded-2xl p-4 text-sm font-semibold text-anthracite leading-relaxed">
                {it.berechnungsweg || 'Kein Rechenweg hinterlegt.'}
                <div className="mt-2 pt-2 border-t border-anthracite/8 text-anthracite/60 font-bold">
                  = {it.quantity} {it.unit} × {fmt(it.unit_price)} = {fmt(it.total_price)}
                </div>
              </div>
              {(it.annahmen?.length ?? 0) > 0 && (
                <>
                  <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mt-4 mb-1">📌 Annahmen</div>
                  <ul className="text-sm font-semibold text-anthracite/70 list-disc pl-5 space-y-0.5">
                    {it.annahmen!.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>
        )
      })()}

      {/* ── Aktionen-Sheet (⋯) — ALLE Neben-Aktionen an einer Stelle ─────── */}
      {showAktionen && (() => {
        const Zeile = ({ icon, label, onClick, href, danger }: {
          icon: React.ReactNode; label: string; onClick?: () => void; href?: string; danger?: boolean
        }) => {
          const cls = `flex items-center gap-3 w-full text-left rounded-xl px-4 py-3.5 font-bold text-sm transition-colors ${
            danger ? 'text-red-500 hover:bg-red-50' : 'text-anthracite hover:bg-bg'
          }`
          const inhalt = <><span className={danger ? 'text-red-400' : 'text-anthracite/35'}>{icon}</span>{label}</>
          return href
            ? <a href={href} target="_blank" className={cls} onClick={() => setShowAktionen(false)}>{inhalt}</a>
            : <button onClick={() => { setShowAktionen(false); onClick?.() }} className={cls}>{inhalt}</button>
        }
        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowAktionen(false)}>
            <div className="bg-white w-full rounded-t-3xl p-4 pb-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="font-black text-anthracite text-lg">Aktionen</div>
                <button onClick={() => setShowAktionen(false)} className="text-anthracite/40 font-black text-xl leading-none">×</button>
              </div>

              {/* Sandy, 2026-08-25: Der "Aufnahme"-Link (Sprache/Foto/Notiz vom
                  Aufmaß) lebte bisher nur in der Icon-Reihe des Bearbeiten-Modus
                  (editMode && ...) — bei fertiggestellten/versendeten Angeboten
                  verschwand er dadurch komplett, obwohl die Original-Aufnahmen
                  (inkl. Fotos wie "Stromkabel in der Wand") weiter existieren.
                  Jetzt hier auch im Lese-Modus über die Aktionen erreichbar,
                  bewusst NICHT als eigenes Icon in der Kopfzeile (würde neben
                  dem gerade erst aufgeräumten Status-Button wieder Enge
                  schaffen) — passt eher zu "PDF"/"Duplizieren" als
                  Neben-Aktion. Update CoS-021 (2026-08-25): der "Fotos &
                  Notiz"-Tab zeigt inzwischen dieselben Aufnahme-Fotos (ein
                  Pool statt zwei, siehe dortiger Kommentar) — dieser
                  Aktionen-Eintrag bleibt trotzdem sinnvoll, weil er
                  zusätzlich Sprachaufnahme/Transkript/erkannte Positionen
                  zeigt, die der Tab nicht abbildet. */}
              <Zeile icon={<Mic size={17} strokeWidth={2.5} />} label="Aufmaß-Aufnahme ansehen" href={`/angebot/${quote.id}/entwurf`} />
              <Zeile icon={<Download size={17} strokeWidth={2.5} />} label={istZugferd ? 'PDF (ZUGFeRD) herunterladen' : 'PDF herunterladen'} href={`/api/pdf?id=${quote.id}`} />
              <Zeile icon={<Link2 size={17} strokeWidth={2.5} />} label="Link zum Angebot kopieren" onClick={copyLink} />
              <Zeile icon={<Copy size={17} strokeWidth={2.5} />} label="Angebot duplizieren" onClick={handleDuplicate} />
              <Zeile icon={<FileText size={17} strokeWidth={2.5} />} label="CSV Export" href={`/api/csv?id=${quote.id}`} />
              {!!quote.customer?.leitweg_id && (
                <Zeile icon={<Download size={17} strokeWidth={2.5} />} label="XRechnung XML" href={`/api/pdf/xrechnung?id=${quote.id}`} />
              )}

              {activeIntegrations.length > 0 && (
                <>
                  <div className="border-t border-[#EEEEEE] my-2" />
                  <div className="text-[10px] font-black text-anthracite/30 uppercase tracking-widest px-4 py-1.5">Buchhaltung</div>
                  {activeIntegrations.map(int => (
                    <button key={int.id} onClick={() => { setShowAktionen(false); handleExport(int.id, int.label) }}
                      disabled={exporting === int.id}
                      className="flex items-center gap-3 w-full text-left rounded-xl px-4 py-3.5 font-bold text-sm text-anthracite hover:bg-bg disabled:opacity-50">
                      <span className="font-black text-anthracite/35 text-xs w-[17px] text-center">{int.short}</span>
                      {exporting === int.id ? 'Übertrage…' : `Zu ${int.label} übertragen`}
                    </button>
                  ))}
                </>
              )}

              <div className="border-t border-[#EEEEEE] my-2" />
              <Zeile icon={<Trash2 size={17} strokeWidth={2.5} />} label="Angebot löschen" danger onClick={() => setShowDeleteSheet(true)} />
            </div>
          </div>
        )
      })()}

      {/* ── Zahnrad: Einstellungen für DIESES Angebot ────────────────────── */}
      {showOptionen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowOptionen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="font-black text-anthracite text-lg">Einstellungen für dieses Angebot</div>
              <button onClick={() => setShowOptionen(false)} className="text-anthracite/40 font-black text-xl leading-none shrink-0">×</button>
            </div>
            <p className="text-xs text-anthracite/40 font-semibold mb-4">
              Leer = aus den allgemeinen Einstellungen übernehmen. Gilt nur für dieses Angebot.
            </p>

            {/* Dokumenttyp */}
            <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Dokumenttyp</div>
            <div className="flex gap-2 mb-4">
              {([['angebot', 'Angebot'], ['kostenvoranschlag', 'Kostenvoranschlag']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setOptDokumentTyp(v)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                    optDokumentTyp === v ? 'border-yellow bg-yellow/10 text-anthracite' : 'border-anthracite/10 bg-bg text-anthracite/50'
                  }`}>{l}</button>
              ))}
            </div>
            {optDokumentTyp === 'kostenvoranschlag' && (
              <p className="text-xs text-anthracite/40 font-semibold -mt-3 mb-4">
                Unverbindlich — wesentliche Überschreitungen musst du vorab anzeigen (§ 650 BGB). Steht dann auch im PDF.
              </p>
            )}

            {/* Gliederung */}
            <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Gliederung</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {([['', 'Wie eingestellt'], ['raeume', '🏠 Räume'], ['arbeitsablauf', '🧹 Ablauf'], ['gewerk', '🎨 Gewerk']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setOptStruktur(v as '')}
                  className={`px-3 py-2 rounded-xl border-2 font-black text-xs transition-colors ${
                    optStruktur === v ? 'border-yellow bg-yellow/10 text-anthracite' : 'border-anthracite/10 bg-bg text-anthracite/50'
                  }`}>{l}</button>
              ))}
            </div>

            {/* Kopf-/Fußtext */}
            <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Kopftext (Anschreiben)</div>
            <textarea value={optKopftext} onChange={e => setOptKopftext(e.target.value)} rows={2}
              placeholder="Leer = „Gerne unterbreiten wir Ihnen folgendes Angebot:“"
              className="w-full text-xs font-semibold text-anthracite/70 bg-bg rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-yellow resize-y" />
            <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Fußtext (Schlusstext)</div>
            <textarea value={optFusstext} onChange={e => setOptFusstext(e.target.value)} rows={2}
              placeholder="Leer = Standard-Schlusstext"
              className="w-full text-xs font-semibold text-anthracite/70 bg-bg rounded-xl px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-yellow resize-y" />

            {/* Briefpapier */}
            {briefpapiere.length > 0 && (
              <>
                <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Briefpapier</div>
                <select value={optBriefpapierId} onChange={e => setOptBriefpapierId(e.target.value)}
                  className="w-full text-sm font-bold text-anthracite bg-bg rounded-xl px-3 py-2.5 mb-4 focus:outline-none">
                  <option value="">Standard</option>
                  {briefpapiere.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </>
            )}

            {/* Gültigkeit + Zahlungsziel */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Gültig bis</div>
                <input type="date" value={optGueltigBis} onChange={e => setOptGueltigBis(e.target.value)}
                  className="w-full text-sm font-bold text-anthracite bg-bg rounded-xl px-3 py-2.5 focus:outline-none" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Zahlungsziel (Tage)</div>
                <input type="number" inputMode="numeric" value={optZahlungsziel} onChange={e => setOptZahlungsziel(e.target.value)}
                  placeholder={String(company?.payment_days ?? 14)}
                  className="w-full text-sm font-bold text-anthracite bg-bg rounded-xl px-3 py-2.5 focus:outline-none" />
              </div>
            </div>

            {/* Skonto */}
            <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Skonto</div>
            <div className="flex gap-3 items-center mb-4">
              <input type="number" inputMode="decimal" value={optSkontoProzent} onChange={e => setOptSkontoProzent(e.target.value)}
                placeholder="z.B. 2" className="w-20 text-sm font-bold text-anthracite bg-bg rounded-xl px-3 py-2.5 focus:outline-none" />
              <span className="text-xs font-bold text-anthracite/50">% bei Zahlung in</span>
              <input type="number" inputMode="numeric" value={optSkontoTage} onChange={e => setOptSkontoTage(e.target.value)}
                placeholder="z.B. 10" className="w-20 text-sm font-bold text-anthracite bg-bg rounded-xl px-3 py-2.5 focus:outline-none" />
              <span className="text-xs font-bold text-anthracite/50">Tagen</span>
            </div>

            {/* Preisdarstellung */}
            <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Preisdarstellung</div>
            <div className="flex gap-2 mb-1">
              {([['', 'Automatisch'], ['brutto', 'Brutto (Endpreise)'], ['netto', 'Netto']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setOptPreis(v as '')}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-black text-[11px] transition-colors ${
                    optPreis === v ? 'border-yellow bg-yellow/10 text-anthracite' : 'border-anthracite/10 bg-bg text-anthracite/50'
                  }`}>{l}</button>
              ))}
            </div>
            <p className="text-xs text-anthracite/40 font-semibold mb-4">
              Automatisch: Privatkunden sehen Endpreise (brutto), Geschäftskunden netto.
            </p>

            {/* Widerrufsbelehrung */}
            <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-widest mb-1.5">Widerrufsbelehrung anhängen</div>
            <div className="flex gap-2 mb-1">
              {([['', 'Automatisch'], ['ja', 'Ja'], ['nein', 'Nein']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setOptWiderruf(v as '')}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                    optWiderruf === v ? 'border-yellow bg-yellow/10 text-anthracite' : 'border-anthracite/10 bg-bg text-anthracite/50'
                  }`}>{l}</button>
              ))}
            </div>
            <p className="text-xs text-anthracite/40 font-semibold mb-5">
              Automatisch: nur bei Privatkunden (Geschäftskunden haben kein Widerrufsrecht).
            </p>

            <button onClick={speichereOptionen} disabled={optSaving}
              className="w-full bg-yellow text-anthracite rounded-2xl py-3.5 font-extrabold text-[15px] flex items-center justify-center gap-2 disabled:opacity-50">
              {optSaving ? <><Loader2 size={16} className="animate-spin" /> Speichert…</> : <><Check size={16} strokeWidth={3} /> Speichern</>}
            </button>
          </div>
        </div>
      )}

      {grundrissRaum && (
        <RaumGrundrissEditor
          raumName={grundrissRaum}
          initial={raumDetails[grundrissRaum]?.grundriss}
          onClose={() => setGrundrissRaum(null)}
          onSave={(waende) => {
            handleRaumDimChange(grundrissRaum, { modus: 'grundriss', grundriss: waende })
            setGrundrissRaum(null)
          }}
        />
      )}

      {priceItemToAdd && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/45 p-3" onClick={() => !addingDatabasePrice && setPriceItemToAdd(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-anthracite/40">Fehlenden Preis anlegen</div>
                <div className="mt-1 text-base font-black text-anthracite">{priceItemToAdd.title.replace(/\s+—\s+.+$/, '')}</div>
                <div className="mt-0.5 text-xs font-semibold text-anthracite/50">
                  Wird in deiner Preisdatenbank gespeichert und sofort in dieses Angebot übernommen.
                </div>
              </div>
              <button type="button" onClick={() => setPriceItemToAdd(null)} disabled={addingDatabasePrice} className="p-1 text-anthracite/40">
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_120px] gap-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-anthracite/40">Preis</label>
              <label className="block text-[10px] font-black uppercase tracking-widest text-anthracite/40">Einheit</label>
            </div>
            <div className="mt-1.5 grid grid-cols-[1fr_120px] gap-2">
              <div className="flex items-center rounded-xl border-2 border-yellow bg-bg px-3">
              <input
                autoFocus
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={newDatabasePrice}
                onChange={event => { setNewDatabasePrice(event.target.value); setDatabasePriceError('') }}
                onKeyDown={event => { if (event.key === 'Enter') void addMissingDatabasePrice() }}
                placeholder="z. B. 12,50"
                className="min-w-0 flex-1 bg-transparent py-3 text-lg font-black text-anthracite outline-none"
              />
                <span className="text-sm font-black text-anthracite/50">€</span>
              </div>
              <select
                value={newDatabaseUnit}
                onChange={event => { setNewDatabaseUnit(event.target.value); setDatabasePriceError('') }}
                className="rounded-xl border-2 border-anthracite/10 bg-bg px-2 text-sm font-black text-anthracite outline-none focus:border-yellow"
              >
                {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>
            {databasePriceError && <div className="mt-2 text-xs font-bold text-red-600">{databasePriceError}</div>}

            <button
              type="button"
              onClick={() => void addMissingDatabasePrice()}
              disabled={addingDatabasePrice}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow py-3 font-black text-anthracite disabled:opacity-50"
            >
              {addingDatabasePrice ? <><Loader2 size={17} className="animate-spin" /> Speichert…</> : <><Check size={17} strokeWidth={3} /> Preis anlegen & übernehmen</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
