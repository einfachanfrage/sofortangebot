'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Quote, QuoteItem, Company, Customer } from '@/lib/types'
import {
  Download, Mail, Share2, Trash2, FileText, Link2, Phone, Check, Pencil, X,
  Plus, ChevronDown, Copy, Mic, MicOff, Loader2, Image, StickyNote,
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
import VorschauUndVersand from '@/components/VorschauUndVersand'
import { ConfirmSheet } from '@/components/ConfirmSheet'
import { Toast } from '@/components/Toast'
import { RaumGrundrissEditor } from '@/components/RaumGrundrissEditor'
import {
  type RaumDimension, type RaumModus,
  berechneQuantityFuerItem, berechneRaumMasse,
} from '@/lib/raum-geometrie'
import { materialFuerPosition } from '@/lib/material-mapping'

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null; share_token?: string; sent_via?: string[] }
  company: Company | null
  quoteNumber: string
}

interface QuotePhoto {
  id: string
  quote_id: string
  url: string
  filename: string
  in_pdf: boolean
  erstellt_am: string
  signed_url?: string
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
  confidence?: number
  berechnungsweg?: string | null
  annahmen?: string[]
}

const STATUS_CONFIG = {
  draft:           { label: 'Entwurf',         bg: 'bg-gray-100',   text: 'text-gray-600'   },
  in_bearbeitung:  { label: 'Entwurf',         bg: 'bg-gray-100',   text: 'text-gray-600'   },
  bereit:          { label: 'Fertiggestellt',  bg: 'bg-[#EDFAF0]',  text: 'text-[#1A7A38]'  },
  sent:            { label: 'Offen',           bg: 'bg-blue-50',    text: 'text-blue-700'   },
  accepted:        { label: 'Beauftragt',      bg: 'bg-green-50',   text: 'text-green-700'  },
  rejected:        { label: 'Abgelehnt',       bg: 'bg-red-50',     text: 'text-red-700'    },
  archived:        { label: 'Archiviert',      bg: 'bg-gray-50',    text: 'text-gray-400'   },
}

const DRAFT_STATUSES = ['draft', 'in_bearbeitung']
const SENT_STATUSES = ['sent', 'accepted', 'rejected']

const VIA_LABELS: Record<string, string> = {
  email: '✉️ E-Mail', whatsapp: '💬 WhatsApp', link: '🔗 Link',
  lexware: 'Lexware Office', lexoffice: 'Lexoffice', sevdesk: 'sevDesk', fastbill: 'FastBill',
  billomat: 'Billomat', papierkram: 'Papierkram', easybill: 'Easybill',
}

const UNITS = ['m²', 'lfdm', 'Stk', 'Stunde', 'pauschal', 'm³', 'kg', 'ltr', 'Rolle', 'Satz']

function fmt(n: number) { return n.toFixed(2).replace('.', ',') + ' €' }

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
        className="w-12 text-center bg-[#F5C400]/20 border border-[#F5C400] rounded text-[12px] font-extrabold text-[#2C2C2C] outline-none px-1 py-0.5"
      />
    )
  }
  const missing = value == null
  return (
    <button
      onClick={() => { setDraft(String(value ?? '')); setEditing(true) }}
      className={`text-[12px] font-extrabold rounded px-1.5 py-0.5 transition-colors ${
        missing ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200' : 'text-[#2C2C2C] bg-[#2C2C2C]/6 hover:bg-[#F5C400]/20'
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
  // Wenn eine Fläche (Wand/Boden) vorliegt aber keine L×B → direkt Flächen-Reiter
  const modus: RaumModus = dim.modus
    ?? ((dim.wandflaeche != null || dim.bodenflaeche != null) ? 'flaeche' : 'rechteck')
  const masse = berechneRaumMasse(dim)

  return (
    <div className="px-4 pb-2 pt-0.5 flex flex-col gap-1.5">
      {/* Modus-Umschalter */}
      <div className="flex items-center gap-1 self-start bg-[#2C2C2C]/5 rounded-lg p-0.5">
        {([
          { id: 'rechteck', label: 'L × B' },
          { id: 'flaeche', label: 'Fläche' },
          { id: 'grundriss', label: 'Grundriss' },
        ] as { id: RaumModus; label: string }[]).map(m => (
          <button
            key={m.id}
            onClick={() => m.id === 'grundriss' ? onGrundriss() : onChange({ modus: m.id })}
            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md transition-colors ${
              modus === m.id ? 'bg-white text-[#2C2C2C] shadow-sm' : 'text-[#2C2C2C]/40 hover:text-[#2C2C2C]/70'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Felder je nach Modus */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {modus === 'rechteck' && (
          <>
            <InlineNum value={dim.breite} label="Breite" onCommit={v => onChange({ breite: v })} />
            <span className="text-[11px] text-[#2C2C2C]/30 font-bold">×</span>
            <InlineNum value={dim.laenge} label="Länge" onCommit={v => onChange({ laenge: v })} />
            <span className="text-[11px] text-[#2C2C2C]/40 font-semibold">m</span>
          </>
        )}

        {modus === 'flaeche' && (
          <>
            {wandRelevant && (
              <>
                <span className="text-[11px] text-[#2C2C2C]/40 font-semibold">Wand</span>
                <InlineNum value={dim.wandflaeche} label="Wandfläche (fertig, ohne Fenster/Türen)" suffix=" m²" onCommit={v => onChange({ wandflaeche: v })} />
                <span className="text-[#2C2C2C]/20 mx-0.5">·</span>
              </>
            )}
            <span className="text-[11px] text-[#2C2C2C]/40 font-semibold">Boden</span>
            <InlineNum value={dim.bodenflaeche} label="Bodenfläche" suffix=" m²" onCommit={v => onChange({ bodenflaeche: v })} />
          </>
        )}

        {modus === 'grundriss' && (
          <button onClick={onGrundriss} className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#2C2C2C] bg-[#2C2C2C]/6 hover:bg-[#F5C400]/20 rounded px-2 py-0.5 transition-colors">
            📐 {dim.grundriss?.length ? `${dim.grundriss.filter(w => w.laenge > 0).length} Wände · ${masse.bodenflaeche ?? '?'} m²` : 'Grundriss zeichnen'}
          </button>
        )}

        {/* Höhe/Öffnungen nur bei Wandarbeiten (Wandfläche braucht Höhe; Fenster/Türen
            werden von der Wandfläche abgezogen). Reiner Bodenauftrag braucht sie nicht. */}
        {wandRelevant && (
          <>
            <span className="text-[#2C2C2C]/20 mx-0.5">·</span>
            <span className="text-[11px] text-[#2C2C2C]/40 font-semibold">H</span>
            <InlineNum value={dim.hoehe} label="Deckenhöhe" suffix=" m" onCommit={v => onChange({ hoehe: v })} />
            <span className="text-[#2C2C2C]/20 mx-0.5">·</span>
            <span className="text-[12px]">🚪</span>
            <InlineNum value={dim.tueren} label="Türen" onCommit={v => onChange({ tueren: v })} />
            <span className="text-[#2C2C2C]/20 mx-0.5">·</span>
            <span className="text-[12px]">🪟</span>
            <InlineNum value={dim.fenster} label="Fenster" onCommit={v => onChange({ fenster: v })} />
          </>
        )}
      </div>
    </div>
  )
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── Sortierbare Position ──────────────────────────────────────────────────────
function SortableItem({ item, titleOverride, editingId, setEditingId, updateEditItem, removeEditItem, vatRate, onUnitPick, onInfo, onAddMaterial }: {
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
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const isEditing = editingId === item.id
  const isUnsure = (item.confidence ?? 1) < 0.7
  const materialVorschlag = materialFuerPosition(titleOverride ?? item.title)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-t border-[#2C2C2C]/5 px-4 py-3 relative ${isUnsure ? 'border-l-4 border-l-[#F5C400]' : ''}`}
      onClick={() => !isEditing && setEditingId(item.id)}
    >
      {isUnsure && (
        <div className="flex items-center gap-1 mb-1">
          <AlertTriangle size={11} className="text-[#F5C400]" strokeWidth={3} />
          <span className="text-[10px] font-black text-[#F5C400]">KI unsicher — bitte prüfen</span>
        </div>
      )}

      {isEditing ? (
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <input
              value={item.title}
              onChange={e => updateEditItem(item.id, 'title', e.target.value)}
              className="w-full font-bold text-[#2C2C2C] bg-transparent focus:outline-none text-sm border-b border-[#F5C400] pb-0.5 mb-2"
              autoFocus
            />
            <textarea
              value={item.description ?? ''}
              onChange={e => updateEditItem(item.id, 'description', e.target.value)}
              onClick={e => e.stopPropagation()}
              placeholder="Untertitel (z.B. Farbe, Material, Detail) — leer lassen zum Ausblenden"
              rows={1}
              className="w-full text-xs font-semibold text-[#2C2C2C]/60 bg-[#F7F7F5] rounded-lg px-2 py-1.5 mb-2 focus:outline-none focus:ring-1 focus:ring-[#F5C400] resize-none"
            />
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="number"
                inputMode="decimal"
                value={item.quantity}
                onChange={e => updateEditItem(item.id, 'quantity', e.target.value)}
                className="w-16 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 focus:outline-none"
                min={0} step="0.01"
              />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onUnitPick(item.id) }}
                className="text-sm font-black text-[#2C2C2C] bg-[#F5C400]/20 rounded-lg px-2 py-1 focus:outline-none"
              >
                {item.unit || 'Einheit'} ▾
              </button>
              <div className="flex items-center gap-1 ml-auto">
                <input
                  type="number"
                  inputMode="decimal"
                  value={item.unit_price}
                  onChange={e => updateEditItem(item.id, 'unit_price', e.target.value)}
                  className="w-20 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 text-right focus:outline-none"
                  min={0} step="0.01"
                />
                <span className="text-xs text-[#2C2C2C]/40 font-bold">€</span>
              </div>
            </div>
            <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1 text-right">
              = {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')} €
              {vatRate > 0 && (
                <span className="ml-2 text-[#2C2C2C]/25">
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
            <div className="font-bold text-[#2C2C2C] text-sm">{titleOverride ?? item.title}</div>
            {item.description && <div className="text-xs text-[#2C2C2C]/50 font-semibold mt-0.5">{item.description}</div>}
            <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1 flex items-center gap-1">
              <span>{item.quantity} {item.unit} × {fmt(item.unit_price)}</span>
              {item.berechnungsweg && (
                <button
                  onClick={e => { e.stopPropagation(); onInfo(item.id) }}
                  title="Rechenweg anzeigen"
                  className="w-4 h-4 rounded-full bg-[#2C2C2C]/8 hover:bg-[#F5C400]/40 text-[#2C2C2C]/60 font-black text-[10px] leading-none flex items-center justify-center transition-colors"
                >
                  i
                </button>
              )}
            </div>
            {materialVorschlag && (
              <button
                onClick={e => { e.stopPropagation(); onAddMaterial(item) }}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#2C2C2C]/60 bg-[#2C2C2C]/5 hover:bg-[#F5C400]/25 rounded-full px-2 py-0.5 transition-colors"
              >
                ＋ {materialVorschlag.name}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="font-black text-[#2C2C2C]">{fmt(item.quantity * item.unit_price)}</div>
            <button
              onClick={e => { e.stopPropagation(); removeEditItem(item.id) }}
              className="p-1.5 text-[#2C2C2C]/20 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
            <div className="cursor-grab touch-none text-[#2C2C2C]/20 active:cursor-grabbing" {...attributes} {...listeners} onClick={e => e.stopPropagation()}>
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
  const [sending, setSending] = useState(false)
  const [emailInput, setEmailInput] = useState(quote.customer?.email ?? '')
  const [showEmail, setShowEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
  const [voiceRecording, setVoiceRecording] = useState(false)
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const [activeTab, setActiveTab] = useState<'positionen' | 'notizen'>('positionen')
  const [showExtras, setShowExtras] = useState(false)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [surchargeAmount, setSurchargeAmount] = useState(0)
  const [surchargeLabel, setSurchargeLabel] = useState('Zuschlag')
  const [internalNotes, setInternalNotes] = useState('')
  const [photos, setPhotos] = useState<QuotePhoto[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<QuotePhoto | null>(null)
  const [empfehlungen, setEmpfehlungen] = useState<EmpfehlungDefault[]>([])
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set())
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [autosaveLabel, setAutosaveLabel] = useState('')
  const [showVorschau, setShowVorschau] = useState(false)
  const [vorschauInitialTab, setVorschauInitialTab] = useState<'vorschau' | 'senden'>('vorschau')
  const [unitPickerItemId, setUnitPickerItemId] = useState<string | null>(null)
  const [infoItemId, setInfoItemId] = useState<string | null>(null)
  const [priceItems, setPriceItems] = useState<{ title: string; unit_price: number; unit: string }[]>([])
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
  const [raumDetails, setRaumDetails] = useState<Record<string, RaumDimension>>({})
  const [grundrissRaum, setGrundrissRaum] = useState<string | null>(null)
  const [showRaumPicker, setShowRaumPicker] = useState(false)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const raumDetailsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
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
  }, [])

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
    const { data } = await supabase.from('price_items').select('title, unit_price, unit').eq('company_id', co.id)
    if (data) setPriceItems(data as { title: string; unit_price: number; unit: string }[])
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

  async function loadPhotos() {
    setPhotosLoading(true)
    const res = await fetch(`/api/quotes/${quote.id}/photos`)
    if (res.ok) setPhotos(await res.json())
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
  const startVoiceRecording = useCallback(async () => {
    setVoiceError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
        .find(m => MediaRecorder.isTypeSupported(m)) ?? ''
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        await processVoiceAddition(new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' }))
      }
      mr.start()
      mediaRef.current = mr
      setVoiceRecording(true)
    } catch {
      setVoiceError('Mikrofon nicht verfügbar')
    }
  }, [editItems])

  const stopVoiceRecording = useCallback(() => {
    mediaRef.current?.stop()
    setVoiceRecording(false)
  }, [])

  async function processVoiceAddition(blob: Blob) {
    setVoiceLoading(true)
    try {
      const fd = new FormData()
      fd.append('audio', blob, 'aufnahme.webm')
      const tRes = await fetch('/api/transkribieren', { method: 'POST', body: fd })
      if (!tRes.ok) { setVoiceError('Transkription fehlgeschlagen'); return }
      const { text } = await tRes.json()

      const aRes = await fetch('/api/angebot-ergänzen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existingItems: editItems.map(i => ({ title: i.title, quantity: i.quantity, unit: i.unit, unit_price: i.unit_price })),
          transcript: text,
        }),
      })
      if (!aRes.ok) { setVoiceError('Analyse fehlgeschlagen'); return }
      const result = await aRes.json()
      const newItems = (result.items ?? []) as Array<{ title: string; description?: string; quantity: number; unit: string; unit_price: number }>

      setEditItems(prev => {
        let updated = [...prev]
        for (const ni of newItems) {
          if (ni.title.startsWith('KORREKTUR:')) {
            const cleanTitle = ni.title.replace('KORREKTUR:', '').trim()
            const idx = updated.findIndex(e => e.title.toLowerCase() === cleanTitle.toLowerCase())
            if (idx >= 0) updated[idx] = { ...updated[idx], quantity: ni.quantity, unit: ni.unit, unit_price: ni.unit_price, total_price: ni.quantity * ni.unit_price }
          } else if (!updated.some(e => e.title.toLowerCase() === ni.title.toLowerCase())) {
            updated = [...updated, { id: `new-${Date.now()}-${Math.random()}`, position: (updated[updated.length - 1]?.position ?? 0) + 1, title: ni.title, description: ni.description ?? null, quantity: ni.quantity, unit: ni.unit, unit_price: ni.unit_price, total_price: ni.quantity * ni.unit_price }]
          }
        }
        return updated
      })
      setHasChanges(true)
    } finally {
      setVoiceLoading(false)
    }
  }

  // ── Fotos ──────────────────────────────────────────────────────────────────
  async function handlePhotoUpload(file: File) {
    if (photos.length >= 10) { showToast('Maximal 10 Fotos'); return }
    setPhotoUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`/api/quotes/${quote.id}/photos`, { method: 'POST', body: fd })
    if (res.ok) {
      const photo = await res.json()
      setPhotos(prev => [...prev, photo])
      showToast('Foto hinzugefügt ✓')
    } else {
      showToast('Upload fehlgeschlagen')
    }
    setPhotoUploading(false)
  }

  async function togglePhotoInPdf(photo: QuotePhoto) {
    const newVal = !photo.in_pdf
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, in_pdf: newVal } : p))
    await fetch(`/api/quotes/${quote.id}/photos`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo_id: photo.id, in_pdf: newVal }),
    })
  }

  async function deletePhoto(photo: QuotePhoto) {
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    setLightboxPhoto(null)
    await fetch(`/api/quotes/${quote.id}/photos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo_id: photo.id }),
    })
  }

  // ── Edit-Modus ─────────────────────────────────────────────────────────────
  function updateEditItem(id: string, field: keyof EditItem, value: string | number) {
    setEditItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: (field === 'quantity' || field === 'unit_price') ? Number(value) : value }
      updated.total_price = updated.quantity * updated.unit_price
      return updated
    }))
    setHasChanges(true)
  }

  function removeEditItem(id: string) {
    setEditItems(prev => prev.filter(item => item.id !== id))
    setEditingItemId(null)
    setHasChanges(true)
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
    for (const item of editItems) {
      if (item.id.startsWith('new-')) {
        await supabase.from('quote_items').insert({
          quote_id: quote.id, position: item.position, title: item.title,
          description: item.description, quantity: item.quantity, unit: item.unit,
          unit_price: item.unit_price, total_price: item.total_price,
        })
      } else {
        await supabase.from('quote_items').update({
          title: item.title, description: item.description, quantity: item.quantity,
          unit: item.unit, unit_price: item.unit_price, total_price: item.total_price,
          position: item.position,
        }).eq('id', item.id)
      }
    }
    const deletedIds = quote.items.filter(orig => !editItems.some(e => e.id === orig.id)).map(i => i.id)
    if (deletedIds.length) await supabase.from('quote_items').delete().in('id', deletedIds)

    const totalNet = editItems.reduce((s, i) => s + i.total_price, 0)
    const discountValue = discountPercent > 0 ? totalNet * (discountPercent / 100) : discountAmount
    const netAfterDiscount = totalNet - discountValue
    const netWithSurcharge = netAfterDiscount + surchargeAmount
    const totalVat = company && company.vat_rate > 0 ? netWithSurcharge * (company.vat_rate / 100) : 0
    await supabase.from('quotes').update({
      total_net: totalNet, total_vat: totalVat, total_gross: netWithSurcharge + totalVat,
      discount_percent: discountPercent, discount_amount: discountAmount,
      surcharge_amount: surchargeAmount, surcharge_label: surchargeLabel,
      ...(nextStatus ? { status: nextStatus } : {}),
    }).eq('id', quote.id)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (nextStatus) setCurrentStatus(nextStatus as any)
    setSaving(false)
    setEditMode(false)
    setEditingItemId(null)
    setHasChanges(false)
    showToast(nextStatus === 'bereit' ? 'Angebot fertiggestellt ✓' : 'Entwurf gespeichert ✓')
    router.refresh()
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

  const status = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.draft

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }
  function trackVia(via: string) {
    if (sentVia.includes(via)) return
    setSentVia(prev => [...prev, via])
    fetch(`/api/quotes/${quote.id}/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ via }) }).catch(() => {})
  }

  async function changeStatus(newStatus: string) {
    setCurrentStatus(newStatus as typeof currentStatus)
    setShowStatusPicker(false)
    await supabase.from('quotes').update({ status: newStatus }).eq('id', quote.id)
    showToast('Status aktualisiert ✓')
  }

  async function handleSendEmail() {
    if (!emailInput.trim()) return
    setSending(true)
    const r = await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quoteId: quote.id, to: emailInput }) })
    setSending(false)
    if (r.ok) {
      setEmailSent(true); setShowEmail(false); setCurrentStatus('sent'); trackVia('email')
      await supabase.from('quotes').update({ status: 'sent' }).eq('id', quote.id)
      showToast('E-Mail versendet ✓')
    } else { showToast('E-Mail fehlgeschlagen') }
  }

  async function handleDuplicate() {
    const r = await fetch('/api/quotes/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: quote.items.map(i => ({ title: i.title, description: i.description, quantity: i.quantity, unit: i.unit, unit_price: i.unit_price })), notes: quote.notes, customerName: quote.customer?.name ?? '', customerEmail: quote.customer?.email ?? '', customerPhone: quote.customer?.phone ?? '', customerAddress: quote.customer?.address ?? '' }) })
    if (r.ok) { const { id } = await r.json(); showToast('Dupliziert ✓'); router.push(`/angebot/${id}`) }
    else showToast('Duplizieren fehlgeschlagen')
  }

  async function handleDelete() {
    setShowDeleteSheet(false)
    setDeleting(true)
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
      setEditItems(quote.items)
      setEditMode(true)
      if (currentStatus === 'bereit') {
        setCurrentStatus('draft')
        supabase.from('quotes').update({ status: 'draft' }).eq('id', quote.id)
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
    await supabase.from('quotes').update({ customer_id: kunde?.id ?? null }).eq('id', quote.id)
    setCurrentCustomer(kunde)
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
      await supabase.from('quotes').update({ customer_id: neu.id }).eq('id', quote.id)
      setCurrentCustomer(neu as Customer)
      setShowKundenSuche(false)
      setKundenSucheQuery('')
      setKundenListe([])
      setLexwareKontakte([])
      showToast(`${k.name} aus Lexware importiert ✓`)
    }
  }

  async function handleExport(provider: string, label: string) {
    setExporting(provider)
    const r = await fetch(`/api/integrations/${provider}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quoteId: quote.id }) })
    setExporting(null)
    if (r.ok) { trackVia(provider); showToast(`Zu ${label} übertragen ✓`) }
    else { const err = await r.json(); showToast(err.error ?? 'Export fehlgeschlagen') }
  }

  const publicPdfUrl = quote.share_token ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/pdf/public?token=${quote.share_token}` : null
  const signingLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://sofortangebot.app'}/angebot/${quote.share_token ?? quote.id}/unterschreiben`
  const whatsappText = encodeURIComponent(`Hallo, anbei mein Angebot ${quoteNumber} über ${fmt(totalGross)}.\n\nOnline ansehen & unterschreiben: ${signingLink}${publicPdfUrl ? `\n\nPDF: ${publicPdfUrl}` : ''}`)

  const displayItems = editItems
  const kundeIstUnternehmen = quote.customer?.ist_unternehmen === true || !!quote.customer?.ustid
  const istZugferd = company?.e_rechnung_aktiv !== false && kundeIstUnternehmen

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-10" onClick={() => { setEditingItemId(null); setShowMoreMenu(false) }}>

      {/* Toast */}
      <Toast message={toast} />

      {/* Revision-Dialog */}
      {showRevisionDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-5" onClick={() => setShowRevisionDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-100 rounded-xl p-2"><AlertTriangle size={20} className="text-amber-600" /></div>
              <div className="font-black text-[#2C2C2C] text-base">Angebot wurde versendet</div>
            </div>
            <p className="text-sm text-[#2C2C2C]/60 font-semibold mb-5 leading-relaxed">
              Dieses Angebot wurde bereits an den Kunden geschickt. Eine Überarbeitung erstellt eine neue Version
              ({quoteNumber}-R{(quote.revision ?? 1) + 1}) als Entwurf — das Original bleibt erhalten.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRevisionErstellen}
                disabled={creatingRevision}
                className="flex items-center justify-center gap-2 bg-[#2C2C2C] text-white font-black rounded-xl py-3 text-sm disabled:opacity-50"
              >
                {creatingRevision ? <Loader2 size={15} className="animate-spin" /> : <Copy size={15} />}
                Überarbeitung erstellen (Rev. {(quote.revision ?? 1) + 1})
              </button>
              <button
                onClick={() => { setShowRevisionDialog(false); setEditItems(quote.items); setEditMode(true) }}
                className="text-[#2C2C2C]/50 font-bold text-sm py-2"
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
          <img src={lightboxPhoto.signed_url ?? lightboxPhoto.url} alt="" className="max-w-full max-h-[70vh] object-contain rounded-xl" />
          <div className="flex gap-4 mt-4" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => togglePhotoInPdf(lightboxPhoto)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${lightboxPhoto.in_pdf ? 'bg-[#F5C400] text-[#2C2C2C]' : 'bg-white/10 text-white'}`}
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
      <div className="bg-[#2C2C2C] md:bg-transparent px-5 md:px-8 pt-12 md:pt-8 pb-0">
        <Link href="/angebote" className="text-white/50 md:text-[#2C2C2C]/40 text-sm font-semibold">← Angebote</Link>
        <div className="flex items-center justify-between mt-1 pb-4">
          <div>
            <div className="text-white md:text-[#2C2C2C] font-syne font-black text-xl flex items-center gap-2 flex-wrap">
              Angebot {quoteNumber}
              {(quote.revision ?? 1) > 1 && (
                <span className="text-xs font-bold bg-amber-400 text-[#2C2C2C] rounded-full px-2 py-0.5">
                  Rev. {quote.revision}
                </span>
              )}
              {quote.customer && <span className="font-semibold opacity-50"> · {quote.customer.name}</span>}
            </div>
            {/* Echtzeit-Gesamtsumme */}
            <div className="text-[#F5C400] font-black text-2xl mt-1">{fmt(totalGross)}</div>
            <div className="text-white/40 text-xs font-semibold">
              {isKleinunternehmer ? 'kein MwSt-Ausweis · ' : `inkl. ${company?.vat_rate ?? 0}% MwSt · `}
              {company?.payment_days ?? 14} Tage Zahlungsziel
            </div>
            {autosaveLabel && <div className="text-white/30 text-xs font-semibold mt-0.5">{autosaveLabel}</div>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowOptionen(true)} title="Einstellungen für dieses Angebot"
              className="bg-white/10 md:bg-[#2C2C2C]/5 text-white md:text-[#2C2C2C]/60 rounded-xl p-2 hover:bg-[#F5C400]/30 transition-colors">
              <Settings size={16} />
            </button>
            <button onClick={() => setShowStatusPicker(true)}
              className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
              {status.label}<ChevronDown size={13} strokeWidth={3} />
            </button>
            {!editMode ? (
              <button onClick={handleEditClick}
                className="bg-white/10 text-white rounded-xl p-2">
                <Pencil size={16} strokeWidth={2.5} />
              </button>
            ) : (
              <button onClick={() => saveEdits()} disabled={saving}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 font-black text-sm transition-colors ${hasChanges ? 'bg-[#F5C400] text-[#2C2C2C]' : 'bg-white/10 text-white/40'} disabled:opacity-50`}>
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
            className={`flex-1 py-3 font-black text-sm border-b-2 transition-colors ${activeTab === 'positionen' ? 'border-[#F5C400] text-[#F5C400]' : 'border-transparent text-white/40'}`}
          >
            Positionen
          </button>
          <button
            onClick={() => setActiveTab('notizen')}
            className={`flex-1 py-3 font-black text-sm border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'notizen' ? 'border-[#F5C400] text-[#F5C400]' : 'border-transparent text-white/40'}`}
          >
            <StickyNote size={14} strokeWidth={2.5} />
            Notizen & Fotos
            {photos.length > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'notizen' ? 'bg-[#F5C400] text-[#2C2C2C]' : 'bg-white/20 text-white'}`}>{photos.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Einheit-Picker Modal */}
      {showRaumPicker && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowRaumPicker(false)}>
          <div className="bg-white w-full rounded-t-3xl px-5 pt-4 pb-10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" /></div>
            <div className="font-syne font-black text-[#2C2C2C] text-[18px] mb-4">Raum hinzufügen</div>
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
                  className="flex items-center gap-2.5 bg-[#F7F7F5] hover:bg-[#F5C400]/15 rounded-2xl px-4 py-3 text-left transition-colors">
                  <span className="text-xl">{r.emoji}</span>
                  <span className="font-extrabold text-[#2C2C2C] text-[14px]">{r.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Anderer Raum…"
                className="flex-1 bg-[#F7F7F5] rounded-xl px-4 py-3 font-semibold text-[14px] text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) addRaumPosition((e.target as HTMLInputElement).value.trim()) }}
              />
              <button
                onClick={e => {
                  const input = (e.currentTarget.previousSibling as HTMLInputElement)
                  if (input.value.trim()) addRaumPosition(input.value.trim())
                }}
                className="bg-[#2C2C2C] text-white rounded-xl px-4 font-extrabold text-[14px]"
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
            <div className="font-black text-[#2C2C2C] text-lg mb-4">Einheit ändern</div>
            <div className="grid grid-cols-3 gap-2">
              {UNITS.map(u => (
                <button key={u} onClick={() => quickUnitChange(unitPickerItemId, u)}
                  className={`py-3 rounded-2xl border-2 font-black text-sm transition-colors ${
                    displayItems.find(i => i.id === unitPickerItemId)?.unit === u
                      ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                      : 'border-[#2C2C2C]/8 text-[#2C2C2C]/60'
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
            <div className="font-black text-[#2C2C2C] text-lg mb-4">Status ändern</div>
            <div className="flex flex-col gap-2">
              {(['bereit', 'sent', 'accepted', 'rejected', 'archived'] as const).map(key => {
                const cfg = STATUS_CONFIG[key]
                return (
                  <button key={key} onClick={() => changeStatus(key)}
                    className={`flex items-center justify-between w-full rounded-2xl px-4 py-3.5 border-2 ${currentStatus === key ? 'border-[#F5C400] bg-[#F5C400]/10' : 'border-[#2C2C2C]/8'}`}>
                    <span className="font-bold text-[#2C2C2C]">{cfg.label}</span>
                    {currentStatus === key && <Check size={18} color="#2C2C2C" strokeWidth={3} />}
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
            <div key={hint.empfehlung_title} className="flex items-center gap-3 bg-[#F5C400]/15 border border-[#F5C400]/40 rounded-2xl px-4 py-3">
              <span className="text-lg">💡</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-[#2C2C2C]">{hint.empfehlung_title} fehlt</span>
                {hint.empfehlung_unit_price > 0 && (
                  <span className="text-xs text-[#2C2C2C]/50 font-semibold ml-2">{fmt(hint.empfehlung_unit_price)}/{hint.empfehlung_unit}</span>
                )}
              </div>
              <button onClick={() => addHintItem(hint)}
                className="bg-[#F5C400] text-[#2C2C2C] font-black text-xs px-3 py-1.5 rounded-xl shrink-0">
                + Hinzufügen
              </button>
              <button onClick={() => setDismissedHints(prev => new Set([...prev, hint.empfehlung_title]))}
                className="text-[#2C2C2C]/30 shrink-0">
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
                  <span key={via} className="text-xs font-bold bg-white border border-[#2C2C2C]/10 text-[#2C2C2C]/60 px-2.5 py-1 rounded-full">
                    {VIA_LABELS[via] ?? via}
                  </span>
                ))}
              </div>
            )}

            {/* Kunde */}
            <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide">Kunde</div>
                <button onClick={() => setShowKundenSuche(v => !v)} className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${currentCustomer ? 'text-[#F5C400]' : 'bg-[#F5C400] text-[#2C2C2C] hover:bg-[#D4A800]'}`}>
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
                    className="w-full border border-[#2C2C2C]/10 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#F5C400]"
                  />
                  {(kundenListe.length > 0 || lexwareKontakte.length > 0) && (
                    <div className="mt-1 border border-[#2C2C2C]/10 rounded-xl overflow-hidden">
                      {kundenListe.length > 0 && (
                        <>
                          <div className="px-3 py-1.5 text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-wide bg-[#F7F7F5]">Meine Kunden</div>
                          {kundenListe.map(k => (
                            <button key={k.id} onClick={() => handleKundeZuweisen(k)}
                              className="w-full text-left px-3 py-2.5 text-sm font-semibold hover:bg-[#F7F7F5] border-b border-[#2C2C2C]/5 last:border-0">
                              <div className="font-bold text-[#2C2C2C]">{k.name}</div>
                              {k.address && <div className="text-xs text-[#2C2C2C]/40 truncate">{k.address.split('\n')[0]}</div>}
                            </button>
                          ))}
                        </>
                      )}
                      {lexwareKontakte.length > 0 && (
                        <>
                          <div className="px-3 py-1.5 text-[10px] font-black text-[#003DA5]/60 uppercase tracking-wide bg-[#003DA5]/5">Lexware Office</div>
                          {lexwareKontakte.map(k => (
                            <button key={k.id} onClick={() => handleLexwareKontaktImportieren(k)}
                              className="w-full text-left px-3 py-2.5 text-sm font-semibold hover:bg-[#F7F7F5] border-b border-[#2C2C2C]/5 last:border-0">
                              <div className="font-bold text-[#2C2C2C]">{k.name}</div>
                              {k.address && <div className="text-xs text-[#2C2C2C]/40 truncate">{k.address.split('\n')[0]}</div>}
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
                  <div className="font-black text-[#2C2C2C]">{currentCustomer.name}</div>
                  {currentCustomer.address && <div className="text-sm text-[#2C2C2C]/60 font-semibold">{currentCustomer.address}</div>}
                  {currentCustomer.phone && (
                    <a href={`tel:${currentCustomer.phone}`} className="flex items-center gap-2 text-sm text-[#2C2C2C] font-semibold mt-1">
                      <Phone size={14} className="text-[#F5C400]" />{currentCustomer.phone}
                    </a>
                  )}
                </>
              ) : (
                <div className="text-sm text-[#2C2C2C]/30 font-semibold">Kein Kunde zugewiesen</div>
              )}
            </div>

            {/* Positionen */}
            <div className="bg-white rounded-2xl border border-[#2C2C2C]/5" onClick={e => e.stopPropagation()}>
              <div className="px-4 pt-4 pb-2">
                <div className="font-black text-[#2C2C2C]">Positionen</div>
              </div>

              {/* Action-Row oben — immer sichtbar */}
              {editMode && (
                <div className="border-t border-b border-[#2C2C2C]/5 grid grid-cols-3">
                  <Link
                    href={`/angebot/${quote.id}/entwurf`}
                    className="flex flex-col items-center gap-1 py-3 text-[#2C2C2C]/40 hover:text-[#2C2C2C]/70 hover:bg-[#F7F7F5] transition-colors"
                  >
                    <Mic size={16} strokeWidth={2.5} />
                    <span className="text-[11px] font-black">Aufnahme</span>
                  </Link>
                  <button
                    onClick={addEditItem}
                    className="flex flex-col items-center gap-1 py-3 text-[#2C2C2C]/40 hover:text-[#2C2C2C]/70 hover:bg-[#F7F7F5] transition-colors border-x border-[#2C2C2C]/5"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span className="text-[11px] font-black">Position</span>
                  </button>
                  <button
                    onClick={() => setShowRaumPicker(true)}
                    className="flex flex-col items-center gap-1 py-3 text-[#2C2C2C]/40 hover:text-[#2C2C2C]/70 hover:bg-[#F7F7F5] transition-colors"
                  >
                    <span className="text-[15px] leading-none">🏠</span>
                    <span className="text-[11px] font-black">Raum</span>
                  </button>
                </div>
              )}

              {editMode && voiceError && <div className="mx-4 mb-2 text-xs text-red-500 font-semibold">{voiceError}</div>}

              {editMode ? (() => {
                const gruppen = gruppiereNachStruktur(editItems, (optStruktur || company?.angebot_struktur || 'raeume'))
                if (!gruppen) {
                  return (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={editItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        {editItems.map(item => (
                          <SortableItem key={item.id} item={item} editingId={editingItemId} setEditingId={setEditingItemId} updateEditItem={updateEditItem} removeEditItem={removeEditItem} vatRate={company?.vat_rate ?? 0} onUnitPick={setUnitPickerItemId} onInfo={setInfoItemId} onAddMaterial={addMaterialFor} />
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
                          <div className={`border-t border-[#2C2C2C]/5 px-4 py-2.5 flex items-center justify-between ${hatMehrereRaeume ? 'bg-[#F7F7F5]' : 'bg-[#F5C400]/8'}`}>
                            <div className="flex items-center gap-1.5">
                              <span>{raum.emoji}</span>
                              <span className={`font-black uppercase tracking-widest ${hatMehrereRaeume ? 'text-[10px] text-[#2C2C2C]/50' : 'text-xs text-[#2C2C2C]'}`}>{raum.raumName}</span>
                            </div>
                            {hatMehrereRaeume && <span className="text-[11px] font-black text-[#2C2C2C]/40">{fmt(raum.summe)}</span>}
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
                            return <SortableItem key={orig.id} item={orig} titleOverride={gi.titleDisplay} editingId={editingItemId} setEditingId={setEditingItemId} updateEditItem={updateEditItem} removeEditItem={removeEditItem} vatRate={company?.vat_rate ?? 0} onUnitPick={setUnitPickerItemId} onInfo={setInfoItemId} onAddMaterial={addMaterialFor} />
                          })}
                        </div>
                        )
                      })}
                      {allgemein.length > 0 && (
                        <div>
                          <div className="border-t border-[#2C2C2C]/5 px-4 py-2 bg-[#F7F7F5]">
                            <span className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest">📋 Allgemein</span>
                          </div>
                          {allgemein.map(gi => {
                            const orig = editItems.find(i => i.id === gi.id)!
                            return <SortableItem key={orig.id} item={orig} titleOverride={gi.title} editingId={editingItemId} setEditingId={setEditingItemId} updateEditItem={updateEditItem} removeEditItem={removeEditItem} vatRate={company?.vat_rate ?? 0} onUnitPick={setUnitPickerItemId} onInfo={setInfoItemId} onAddMaterial={addMaterialFor} />
                          })}
                        </div>
                      )}
                    </SortableContext>
                  </DndContext>
                )
              })() : (() => {
                const gruppen = gruppiereNachStruktur(displayItems, (optStruktur || company?.angebot_struktur || 'raeume'))

                const renderItem = (title: string, item: EditItem) => (
                  <div key={item.id} className="border-t border-[#2C2C2C]/5 px-4 py-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[#2C2C2C] text-sm">{title}</div>
                        {item.description && <div className="text-xs text-[#2C2C2C]/50 font-semibold mt-0.5">{item.description}</div>}
                        <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1 flex items-center gap-1 flex-wrap">
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => setUnitPickerItemId(item.id)}
                            className="bg-[#2C2C2C]/6 hover:bg-[#F5C400]/20 text-[#2C2C2C]/60 font-black text-[10px] px-1.5 py-0.5 rounded-md transition-colors"
                          >
                            {item.unit}
                          </button>
                          <span>× {fmt(item.unit_price)}</span>
                          {item.berechnungsweg && (
                            <button
                              onClick={() => setInfoItemId(item.id)}
                              title="Rechenweg anzeigen"
                              className="ml-0.5 w-4 h-4 rounded-full bg-[#2C2C2C]/8 hover:bg-[#F5C400]/40 text-[#2C2C2C]/60 font-black text-[10px] leading-none flex items-center justify-center transition-colors"
                            >
                              i
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="font-black text-[#2C2C2C] shrink-0">{fmt(item.total_price)}</div>
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
                        <div className={`border-t border-[#2C2C2C]/5 px-4 py-2.5 flex items-center justify-between ${
                          hatMehrereRaeume ? 'bg-[#F7F7F5]' : 'bg-[#F5C400]/8'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <span>{raum.emoji}</span>
                            <span className={`font-black uppercase tracking-widest ${
                              hatMehrereRaeume
                                ? 'text-[10px] text-[#2C2C2C]/50'
                                : 'text-xs text-[#2C2C2C]'
                            }`}>{raum.raumName}</span>
                          </div>
                          {hatMehrereRaeume && (
                            <span className="text-[11px] font-black text-[#2C2C2C]/40">{fmt(raum.summe)}</span>
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
                          <div className="border-t border-dashed border-[#2C2C2C]/8 px-4 py-2 flex justify-between">
                            <span className="text-xs text-[#2C2C2C]/40 font-semibold">Summe {raum.raumName}</span>
                            <span className="text-xs font-black text-[#2C2C2C]/60">{fmt(raum.summe)}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Allgemeine Positionen ohne Raum */}
                    {allgemein.length > 0 && (
                      <div>
                        <div className="border-t border-[#2C2C2C]/5 px-4 py-2 bg-[#F7F7F5]">
                          <span className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest">📋 Allgemein</span>
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
              <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
                <div className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide mb-2">Anmerkungen</div>
                <div className="text-sm text-[#2C2C2C]/70 font-semibold">{quote.notes}</div>
              </div>
            )}

            {/* Edit: Rabatt & Zuschläge */}
            {editMode && (
              <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
                <button
                  onClick={() => setShowExtras(v => !v)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2 text-sm font-black text-[#2C2C2C]/60">
                    <MoreHorizontal size={16} />
                    Rabatt & Zuschläge
                  </div>
                  <ChevronDown size={16} className={`text-[#2C2C2C]/40 transition-transform ${showExtras ? 'rotate-180' : ''}`} />
                </button>

                {showExtras && (
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-[#2C2C2C]/40 mb-1 block">Rabatt %</label>
                        <div className="flex items-center gap-1 bg-[#F7F7F5] rounded-xl px-3 py-2">
                          <Percent size={14} className="text-[#2C2C2C]/30" />
                          <input type="number" inputMode="decimal" min={0} max={100} value={discountPercent || ''}
                            onChange={e => { setDiscountPercent(Number(e.target.value)); setDiscountAmount(0) }}
                            placeholder="0" className="flex-1 bg-transparent font-bold text-[#2C2C2C] text-sm focus:outline-none w-full" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-[#2C2C2C]/40 mb-1 block">oder absolut €</label>
                        <div className="flex items-center gap-1 bg-[#F7F7F5] rounded-xl px-3 py-2">
                          <Tag size={14} className="text-[#2C2C2C]/30" />
                          <input type="number" inputMode="decimal" min={0} value={discountAmount || ''}
                            onChange={e => { setDiscountAmount(Number(e.target.value)); setDiscountPercent(0) }}
                            placeholder="0" className="flex-1 bg-transparent font-bold text-[#2C2C2C] text-sm focus:outline-none w-full" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#2C2C2C]/40 mb-1 block">Zuschlag Bezeichnung</label>
                      <input value={surchargeLabel} onChange={e => setSurchargeLabel(e.target.value)}
                        className="w-full bg-[#F7F7F5] rounded-xl px-3 py-2 font-bold text-[#2C2C2C] text-sm focus:outline-none mb-2" />
                      <div className="flex items-center gap-1 bg-[#F7F7F5] rounded-xl px-3 py-2">
                        <Tag size={14} className="text-[#2C2C2C]/30" />
                        <input type="number" inputMode="decimal" min={0} value={surchargeAmount || ''}
                          onChange={e => setSurchargeAmount(Number(e.target.value))}
                          placeholder="0" className="flex-1 bg-transparent font-bold text-[#2C2C2C] text-sm focus:outline-none w-full" />
                        <span className="text-xs text-[#2C2C2C]/40 font-bold">€</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edit-Aktionen */}
            {editMode && (
              <div className="flex gap-3">
                <button onClick={() => { setEditMode(false); setEditItems(quote.items); setEditingItemId(null); setHasChanges(false) }}
                  className="flex-1 bg-white border-2 border-[#2C2C2C]/20 text-[#2C2C2C] font-black text-base rounded-2xl py-4">
                  Abbrechen
                </button>
                <button onClick={() => saveEdits()} disabled={saving}
                  className="flex-[2] bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-2xl py-4 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? 'Speichert…' : <><Check size={18} strokeWidth={3} /> Speichern</>}
                </button>
              </div>
            )}
          </div>

          {/* Rechte Spalte: Summen + Aktionen */}
          <div className="flex flex-col gap-3">
            {/* Summenblock */}
            <div className="bg-[#2C2C2C] rounded-2xl p-4">
              <div className="flex justify-between text-white/60 font-semibold text-sm mb-1">
                <span>Nettosumme</span><span>{fmt(baseNet)}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-[#F5C400] font-semibold text-sm mb-1">
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

      {/* ── TAB: NOTIZEN & FOTOS ─────────────────────────────────────────── */}
      {activeTab === 'notizen' && (
        <div className="px-5 md:px-8 pt-5 flex flex-col gap-4 pb-10">

          {/* Interne Notizen */}
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-black text-[#2C2C2C]">Interne Notizen</div>
              <span className="text-xs font-semibold text-[#2C2C2C]/30 bg-[#2C2C2C]/5 px-2.5 py-1 rounded-full">Nicht im PDF</span>
            </div>
            <textarea
              value={internalNotes}
              onChange={e => scheduleAutosaveNotes(e.target.value)}
              placeholder="Aufmaß-Notizen, Besonderheiten, Hinweise für später..."
              rows={5}
              className="w-full bg-[#F7F7F5] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C400]/40 resize-none"
            />
            {autosaveLabel && <div className="text-xs text-[#2C2C2C]/30 font-semibold mt-1">{autosaveLabel}</div>}
          </div>

          {/* Fotos */}
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-black text-[#2C2C2C]">Fotos</div>
                <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{photos.length}/10 · Tippen um zu vergrößern</div>
              </div>
              {photos.length < 10 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-sm px-4 py-2 rounded-xl disabled:opacity-50"
                >
                  {photoUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} strokeWidth={2.5} />}
                  {photoUploading ? 'Lädt...' : 'Foto hinzufügen'}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handlePhotoUpload(file)
                  e.target.value = ''
                }}
              />
            </div>

            {photosLoading && (
              <div className="flex items-center justify-center py-8 text-[#2C2C2C]/30">
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}

            {!photosLoading && photos.length === 0 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#2C2C2C]/15 rounded-2xl py-10 flex flex-col items-center gap-3 text-[#2C2C2C]/30 hover:border-[#F5C400]/50 transition-colors"
              >
                <Image size={32} strokeWidth={1.5} />
                <span className="font-bold text-sm">Fotos vom Aufmaß hinzufügen</span>
                <span className="text-xs">Kamera oder Galerie · max. 10 Fotos</span>
              </button>
            )}

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map(photo => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-[#F7F7F5]"
                    onClick={() => setLightboxPhoto(photo)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.signed_url ?? photo.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {photo.in_pdf && (
                      <div className="absolute bottom-1 right-1 bg-[#F5C400] rounded-md px-1.5 py-0.5">
                        <span className="text-[9px] font-black text-[#2C2C2C]">PDF</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
                {photos.length < 10 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-[#2C2C2C]/15 flex items-center justify-center text-[#2C2C2C]/20 hover:border-[#F5C400]/50 transition-colors"
                  >
                    <Plus size={24} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            )}

            {photos.some(p => p.in_pdf) && (
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#2C2C2C]/40 bg-[#F7F7F5] rounded-xl px-3 py-2">
                <FileText size={13} />
                {photos.filter(p => p.in_pdf).length} Foto{photos.filter(p => p.in_pdf).length !== 1 ? 's' : ''} werden ins PDF übernommen
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer-Bar ──────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3">
        {editMode ? (
          /* ENTWURF-MODUS: Position+ | Zwischenspeichern | Fertigstellen */
          <div className="flex gap-2">
            <button
              onClick={addEditItem}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#F7F7F5] text-[#2C2C2C] font-semibold text-sm border border-[#2C2C2C]/10 shrink-0"
            >
              <Plus size={15} strokeWidth={2.5} /> Position
            </button>
            <button
              onClick={() => saveEdits()}
              disabled={saving || !hasChanges}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F7F7F5] text-[#2C2C2C] font-semibold text-sm border border-[#2C2C2C]/10 disabled:opacity-40"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              Speichern
            </button>
            <button
              onClick={fertigstellen}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2C2C2C] text-white font-bold text-sm disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} strokeWidth={2.5} />}
              Fertigstellen
            </button>
          </div>
        ) : (
          /* FERTIGGESTELLT / VERSENDET: Vorschau | Senden */
          <div className="flex gap-2">
            {DRAFT_STATUSES.includes(currentStatus) || currentStatus === 'bereit' ? (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F7F7F5] text-[#2C2C2C] font-semibold text-sm border border-[#2C2C2C]/10 shrink-0"
              >
                <Pencil size={14} strokeWidth={2.5} /> Bearbeiten
              </button>
            ) : null}
            <button
              onClick={() => { setVorschauInitialTab('vorschau'); setShowVorschau(true) }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F7F7F5] text-[#2C2C2C] font-semibold text-sm border border-[#2C2C2C]/10"
            >
              <FileText size={15} strokeWidth={2} /> Vorschau
            </button>
            <button
              onClick={() => { setVorschauInitialTab('senden'); setShowVorschau(true) }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2C2C2C] text-white font-bold text-sm"
            >
              <Share2 size={15} strokeWidth={2.5} /> Senden →
            </button>
            {/* Alle weiteren Aktionen an EINER Stelle */}
            <button
              onClick={() => setShowAktionen(true)}
              title="Weitere Aktionen"
              className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-[#F7F7F5] text-[#2C2C2C]/60 border border-[#2C2C2C]/10 shrink-0"
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
                <div className="font-black text-[#2C2C2C] text-lg leading-tight">{it.title}</div>
                <button onClick={() => setInfoItemId(null)} className="text-[#2C2C2C]/40 font-black text-xl leading-none shrink-0">×</button>
              </div>
              <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1">🧮 So gerechnet</div>
              <div className="bg-[#F7F7F5] rounded-2xl p-4 text-sm font-semibold text-[#2C2C2C] leading-relaxed">
                {it.berechnungsweg || 'Kein Rechenweg hinterlegt.'}
                <div className="mt-2 pt-2 border-t border-[#2C2C2C]/8 text-[#2C2C2C]/60 font-bold">
                  = {it.quantity} {it.unit} × {fmt(it.unit_price)} = {fmt(it.total_price)}
                </div>
              </div>
              {(it.annahmen?.length ?? 0) > 0 && (
                <>
                  <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mt-4 mb-1">📌 Annahmen</div>
                  <ul className="text-sm font-semibold text-[#2C2C2C]/70 list-disc pl-5 space-y-0.5">
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
            danger ? 'text-red-500 hover:bg-red-50' : 'text-[#2C2C2C] hover:bg-[#F7F7F5]'
          }`
          const inhalt = <><span className={danger ? 'text-red-400' : 'text-[#2C2C2C]/35'}>{icon}</span>{label}</>
          return href
            ? <a href={href} target="_blank" className={cls} onClick={() => setShowAktionen(false)}>{inhalt}</a>
            : <button onClick={() => { setShowAktionen(false); onClick?.() }} className={cls}>{inhalt}</button>
        }
        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowAktionen(false)}>
            <div className="bg-white w-full rounded-t-3xl p-4 pb-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="font-black text-[#2C2C2C] text-lg">Aktionen</div>
                <button onClick={() => setShowAktionen(false)} className="text-[#2C2C2C]/40 font-black text-xl leading-none">×</button>
              </div>

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
                  <div className="text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-widest px-4 py-1.5">Buchhaltung</div>
                  {activeIntegrations.map(int => (
                    <button key={int.id} onClick={() => { setShowAktionen(false); handleExport(int.id, int.label) }}
                      disabled={exporting === int.id}
                      className="flex items-center gap-3 w-full text-left rounded-xl px-4 py-3.5 font-bold text-sm text-[#2C2C2C] hover:bg-[#F7F7F5] disabled:opacity-50">
                      <span className="font-black text-[#2C2C2C]/35 text-xs w-[17px] text-center">{int.short}</span>
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
              <div className="font-black text-[#2C2C2C] text-lg">Einstellungen für dieses Angebot</div>
              <button onClick={() => setShowOptionen(false)} className="text-[#2C2C2C]/40 font-black text-xl leading-none shrink-0">×</button>
            </div>
            <p className="text-xs text-[#2C2C2C]/40 font-semibold mb-4">
              Leer = aus den allgemeinen Einstellungen übernehmen. Gilt nur für dieses Angebot.
            </p>

            {/* Dokumenttyp */}
            <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Dokumenttyp</div>
            <div className="flex gap-2 mb-4">
              {([['angebot', 'Angebot'], ['kostenvoranschlag', 'Kostenvoranschlag']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setOptDokumentTyp(v)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                    optDokumentTyp === v ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]' : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                  }`}>{l}</button>
              ))}
            </div>
            {optDokumentTyp === 'kostenvoranschlag' && (
              <p className="text-xs text-[#2C2C2C]/40 font-semibold -mt-3 mb-4">
                Unverbindlich — wesentliche Überschreitungen musst du vorab anzeigen (§ 650 BGB). Steht dann auch im PDF.
              </p>
            )}

            {/* Gliederung */}
            <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Gliederung</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {([['', 'Wie eingestellt'], ['raeume', '🏠 Räume'], ['arbeitsablauf', '🧹 Ablauf'], ['gewerk', '🎨 Gewerk']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setOptStruktur(v as '')}
                  className={`px-3 py-2 rounded-xl border-2 font-black text-xs transition-colors ${
                    optStruktur === v ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]' : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                  }`}>{l}</button>
              ))}
            </div>

            {/* Kopf-/Fußtext */}
            <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Kopftext (Anschreiben)</div>
            <textarea value={optKopftext} onChange={e => setOptKopftext(e.target.value)} rows={2}
              placeholder="Leer = „Gerne unterbreiten wir Ihnen folgendes Angebot:“"
              className="w-full text-xs font-semibold text-[#2C2C2C]/70 bg-[#F7F7F5] rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-[#F5C400] resize-y" />
            <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Fußtext (Schlusstext)</div>
            <textarea value={optFusstext} onChange={e => setOptFusstext(e.target.value)} rows={2}
              placeholder="Leer = Standard-Schlusstext"
              className="w-full text-xs font-semibold text-[#2C2C2C]/70 bg-[#F7F7F5] rounded-xl px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-[#F5C400] resize-y" />

            {/* Briefpapier */}
            {briefpapiere.length > 0 && (
              <>
                <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Briefpapier</div>
                <select value={optBriefpapierId} onChange={e => setOptBriefpapierId(e.target.value)}
                  className="w-full text-sm font-bold text-[#2C2C2C] bg-[#F7F7F5] rounded-xl px-3 py-2.5 mb-4 focus:outline-none">
                  <option value="">Standard</option>
                  {briefpapiere.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </>
            )}

            {/* Gültigkeit + Zahlungsziel */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Gültig bis</div>
                <input type="date" value={optGueltigBis} onChange={e => setOptGueltigBis(e.target.value)}
                  className="w-full text-sm font-bold text-[#2C2C2C] bg-[#F7F7F5] rounded-xl px-3 py-2.5 focus:outline-none" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Zahlungsziel (Tage)</div>
                <input type="number" inputMode="numeric" value={optZahlungsziel} onChange={e => setOptZahlungsziel(e.target.value)}
                  placeholder={String(company?.payment_days ?? 14)}
                  className="w-full text-sm font-bold text-[#2C2C2C] bg-[#F7F7F5] rounded-xl px-3 py-2.5 focus:outline-none" />
              </div>
            </div>

            {/* Skonto */}
            <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Skonto</div>
            <div className="flex gap-3 items-center mb-4">
              <input type="number" inputMode="decimal" value={optSkontoProzent} onChange={e => setOptSkontoProzent(e.target.value)}
                placeholder="z.B. 2" className="w-20 text-sm font-bold text-[#2C2C2C] bg-[#F7F7F5] rounded-xl px-3 py-2.5 focus:outline-none" />
              <span className="text-xs font-bold text-[#2C2C2C]/50">% bei Zahlung in</span>
              <input type="number" inputMode="numeric" value={optSkontoTage} onChange={e => setOptSkontoTage(e.target.value)}
                placeholder="z.B. 10" className="w-20 text-sm font-bold text-[#2C2C2C] bg-[#F7F7F5] rounded-xl px-3 py-2.5 focus:outline-none" />
              <span className="text-xs font-bold text-[#2C2C2C]/50">Tagen</span>
            </div>

            {/* Preisdarstellung */}
            <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Preisdarstellung</div>
            <div className="flex gap-2 mb-1">
              {([['', 'Automatisch'], ['brutto', 'Brutto (Endpreise)'], ['netto', 'Netto']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setOptPreis(v as '')}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-black text-[11px] transition-colors ${
                    optPreis === v ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]' : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                  }`}>{l}</button>
              ))}
            </div>
            <p className="text-xs text-[#2C2C2C]/40 font-semibold mb-4">
              Automatisch: Privatkunden sehen Endpreise (brutto), Geschäftskunden netto.
            </p>

            {/* Widerrufsbelehrung */}
            <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest mb-1.5">Widerrufsbelehrung anhängen</div>
            <div className="flex gap-2 mb-1">
              {([['', 'Automatisch'], ['ja', 'Ja'], ['nein', 'Nein']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setOptWiderruf(v as '')}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                    optWiderruf === v ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]' : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                  }`}>{l}</button>
              ))}
            </div>
            <p className="text-xs text-[#2C2C2C]/40 font-semibold mb-5">
              Automatisch: nur bei Privatkunden (Geschäftskunden haben kein Widerrufsrecht).
            </p>

            <button onClick={speichereOptionen} disabled={optSaving}
              className="w-full bg-[#F5C400] text-[#2C2C2C] rounded-2xl py-3.5 font-extrabold text-[15px] flex items-center justify-center gap-2 disabled:opacity-50">
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
    </div>
  )
}
