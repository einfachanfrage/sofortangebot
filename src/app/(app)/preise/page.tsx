'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_PRICES } from '@/lib/default-prices'
import { Trash2, Plus, Check, X, Search, ArrowLeft, ChevronRight, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { PriceItem } from '@/lib/types'
import { getPriceTradeKey, inferPriceCategory, priceItemIdentity } from '@/lib/price-catalog'

// ─── GEWERK METADATA — nur aktive Gewerke ────────────────────────────────────

const GEWERK_META: Record<string, { label: string; emoji: string }> = {
  'Maler':          { label: 'Maler & Lackierer',    emoji: '🖌️' },
  'Boden':          { label: 'Bodenbeläge & Parkett', emoji: '🏠' },
  'Allgemein':      { label: 'Allgemein',             emoji: '📦' },
}

// Nur Maler, Boden und Allgemeines im UI anzeigen
const AKTIVE_GEWERK_KEYS = new Set(['Maler', 'Boden', 'Allgemein'])

// ─── BEREICH DERIVATION ─────────────────────────────────────────────────────

function getGewerkKey(category: string): string {
  return getPriceTradeKey(category)
}

function getBereich(category: string): string {
  const lower = category.toLowerCase()
  if (lower.includes('erschwerniss') || lower.includes('zuschlag')) return 'Zuschläge'
  if (
    lower.includes('anfahrt') || lower.includes('organisation') ||
    lower.includes('vorbereitung') || lower.includes('schutz') ||
    lower.includes('untergrundvorbereitung') || lower.includes('untergrund') ||
    lower.includes('rückbau') || lower.includes('demontage') ||
    lower.includes('entkernung') || lower.includes('baustelleneinrichtung') ||
    lower.includes('abbruchvorbereitung')
  ) return 'Vorbereitung'
  if (
    lower.includes('reinigung') || lower.includes('entsorgung') ||
    lower.includes('stundenleistungen') || lower.includes('aufmaß') ||
    lower.includes('wartung') || lower.includes('inspektion')
  ) return 'Sonstiges'
  // Maler
  if (lower.includes('anstrich')) return 'Anstrich'
  if (lower.includes('tapezier') || lower.includes('oberflächen')) return 'Tapezieren'
  if (lower.includes('lackier') || lower.includes('holzbeschichtung')) return 'Lackieren'
  // Fliesen
  if (lower.includes('wandfliesen') || (lower.includes('wand') && !lower.includes('trennwand'))) return 'Wand'
  if (lower.includes('bodenfliesen') || lower.includes('altbelag')) return 'Boden'
  if (lower.includes('abdichtung')) return 'Abdichtung'
  // Elektro
  if (lower.includes('beleuchtung')) return 'Beleuchtung'
  if (lower.includes('hauptverteilung') || lower.includes('unterverteilung') || lower.includes('zähler')) return 'Verteilung'
  if (lower.includes('daten') || lower.includes('smart') || lower.includes('netzwerk')) return 'Daten & Smart'
  // SHK
  if (lower.includes('heizung') || lower.includes('heizkörper') || lower.includes('wärmepumpe') || lower.includes('solar') || lower.includes('pellet') || lower.includes('fußbodenheizung')) return 'Heizung'
  if (lower.includes('sanitär') || lower.includes('waschbecken') || lower.includes('dusche') || lower.includes('wc') || lower.includes('waschwasser') || lower.includes('abwasser') || lower.includes('trinkwasser') || lower.includes('rohrleitungen')) return 'Sanitär'
  // Trockenbau
  if (lower.includes('trennwände') || lower.includes('vorsatzschalen')) return 'Wände'
  if (lower.includes('decken') || lower.includes('decke')) return 'Decken'
  if (lower.includes('dämmung')) return 'Dämmung'
  if (lower.includes('spachtelung')) return 'Oberflächen'
  // Dach
  if (lower.includes('steildach')) return 'Steildach'
  if (lower.includes('flachdach')) return 'Flachdach'
  if (lower.includes('klempner') || lower.includes('spengler') || lower.includes('dachrinne')) return 'Klempner'
  if (lower.includes('dachdämmung') || lower.includes('dämmung')) return 'Dämmung'
  if (lower.includes('dachfenster')) return 'Dachfenster'
  // Boden / Parkett
  if (lower.includes('parkett')) return 'Parkett'
  if (lower.includes('laminat') || lower.includes('vinyl') || lower.includes('klick')) return 'Laminat & Vinyl'
  if (lower.includes('teppichboden') || lower.includes('teppich')) return 'Teppich'
  if (lower.includes('kork') || lower.includes('linoleum')) return 'Sonstiges'
  // Putz / Fassade
  if (lower.includes('innenputz') || lower.includes('innen')) return 'Innenputz'
  if (lower.includes('außenputz') || lower.includes('fassadenputz') || lower.includes('außen')) return 'Außenputz'
  if (lower.includes('wdvs') || lower.includes('wärmedämm') || lower.includes('dämmverbund')) return 'WDVS'
  // Rohbau
  if (lower.includes('fundament') || lower.includes('erdarbeiten') || lower.includes('aushub')) return 'Fundament'
  if (lower.includes('mauerwerk')) return 'Mauerwerk'
  if (lower.includes('beton') || lower.includes('schalung') || lower.includes('bewehrung')) return 'Beton'
  // Abbruch
  if (lower.includes('vollabbruch') || lower.includes('teilabbruch')) return 'Abbruch'
  if (lower.includes('entkernung')) return 'Entkernung'
  // GaLaBau
  if (lower.includes('bepflanzung') || lower.includes('rasen') || lower.includes('grün')) return 'Bepflanzung'
  if (lower.includes('pflaster') || lower.includes('wege') || lower.includes('terrassenplatten')) return 'Pflaster'
  if (lower.includes('bewässerung') || lower.includes('drainage') || lower.includes('teich')) return 'Wasser'
  // Fenster / Türen
  if (lower.includes('rollladen') || lower.includes('sonnenschutz')) return 'Rollladen'
  if (lower.includes('schiebe') || lower.includes('hebe')) return 'Schiebetür'
  // Schreiner
  if (lower.includes('einbauschränke') || lower.includes('möbel') || lower.includes('küche')) return 'Möbel'
  if (lower.includes('innentüren') || lower.includes('außentüren') || lower.includes('haustür')) return 'Türen'
  if (lower.includes('treppen')) return 'Treppen'
  if (lower.includes('außenbereich')) return 'Außen'
  return 'Hauptleistung'
}

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface EditState {
  title: string
  category: string
  unit_price: string
  unit: string
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function PreisePage() {
  const [items, setItems] = useState<PriceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [selectedGewerk, setSelectedGewerk] = useState<string | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<string>('Alle')
  const [sortMode, setSortMode] = useState<'name' | 'price-asc' | 'price-desc'>('name')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState>({ title: '', category: '', unit_price: '', unit: '' })
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ category: '', title: '', unit: 'm²', unit_price: '' })
  const [importing, setImporting] = useState(false)
  const [mutationError, setMutationError] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: co } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
      if (!co) return
      setCompanyId(co.id)
      const allItems: PriceItem[] = []
      const pageSize = 1000
      for (let from = 0; ; from += pageSize) {
        const { data, error } = await supabase
          .from('price_items')
          .select('*')
          .eq('company_id', co.id)
          .order('title')
          .range(from, from + pageSize - 1)
        if (error) {
          setMutationError('Die Preisdatenbank konnte nicht vollständig geladen werden.')
          break
        }
        allItems.push(...(data ?? []))
        if (!data || data.length < pageSize) break
      }
      setItems(allItems)
      setLoading(false)
    }
    load()
  }, [])

  // ─── DERIVED DATA ─────────────────────────────────────────────────────────

  const gewerke = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of items) {
      const key = getGewerkKey(item.category)
      if (!AKTIVE_GEWERK_KEYS.has(key)) continue
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .map(([key, count]) => ({ key, count, ...(GEWERK_META[key] ?? { label: key, emoji: '📋' }) }))
      .sort((a, b) => b.count - a.count)
  }, [items])

  const gewerkItems = useMemo(() =>
    selectedGewerk ? items.filter(i => getGewerkKey(i.category) === selectedGewerk) : [],
    [items, selectedGewerk]
  )

  const availableUnits = useMemo(() =>
    ['Alle', ...Array.from(new Set(gewerkItems.map(item => item.unit))).sort((a, b) => a.localeCompare(b, 'de'))],
    [gewerkItems]
  )

  const visibleItems = useMemo(() => {
    const base = selectedUnit === 'Alle'
      ? [...gewerkItems]
      : gewerkItems.filter(item => item.unit === selectedUnit)
    return base.sort((a, b) => {
      if (sortMode === 'price-asc') return a.unit_price - b.unit_price || a.title.localeCompare(b.title, 'de')
      if (sortMode === 'price-desc') return b.unit_price - a.unit_price || a.title.localeCompare(b.title, 'de')
      return a.title.localeCompare(b.title, 'de')
    })
  }, [gewerkItems, selectedUnit, sortMode])

  const searchResults = useMemo(() => {
    if (searchQuery.length < 3) return []
    const q = searchQuery.toLowerCase()
    return (selectedGewerk ? gewerkItems : items)
      .filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      .filter(i => selectedUnit === 'Alle' || i.unit === selectedUnit)
      .slice(0, 50)
  }, [items, gewerkItems, searchQuery, selectedGewerk, selectedUnit])

  const isSearching = searchQuery.length >= 3

  // ─── HANDLERS ────────────────────────────────────────────────────────────

  async function handleDelete(id: string) {
    if (!companyId || !window.confirm('Position wirklich aus der Preisdatenbank löschen?')) return
    setMutationError('')
    const { error } = await supabase.from('price_items').delete().eq('id', id).eq('company_id', companyId)
    if (error) {
      setMutationError('Die Position konnte nicht gelöscht werden. Bitte erneut versuchen.')
      return
    }
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function startEdit(item: PriceItem) {
    setEditingId(item.id)
    setEditState({ title: item.title, category: item.category, unit_price: String(item.unit_price), unit: item.unit })
  }

  async function saveEdit(id: string) {
    const unit_price = parseFloat(editState.unit_price)
    const candidate = {
      category: editState.category.trim(),
      title: editState.title.trim(),
      unit: editState.unit.trim(),
    }
    if (!candidate.title || !candidate.category || isNaN(unit_price) || unit_price < 0) {
      setMutationError('Bezeichnung, Kategorie, Einheit und Preis müssen gültig sein.')
      return
    }
    if (items.some(item => item.id !== id && priceItemIdentity(item) === priceItemIdentity(candidate))) {
      setMutationError('Diese Position existiert in derselben Kategorie bereits.')
      return
    }
    setMutationError('')
    const { error } = await supabase.from('price_items').update({
      title: candidate.title,
      category: candidate.category,
      unit_price,
      unit: candidate.unit,
    }).eq('id', id).eq('company_id', companyId)
    if (error) {
      setMutationError('Die Änderung konnte nicht gespeichert werden. Möglicherweise existiert die Position bereits.')
      return
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...candidate, unit_price } : i))
    setEditingId(null)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!companyId || !newItem.title.trim() || !selectedGewerk) return
    const candidate = {
      category: inferPriceCategory(selectedGewerk, newItem.title),
      title: newItem.title.trim(),
      unit: newItem.unit.trim(),
    }
    if (items.some(item => priceItemIdentity(item) === priceItemIdentity(candidate))) {
      setMutationError('Diese Position existiert in derselben Kategorie bereits.')
      return
    }
    setMutationError('')
    const { data, error } = await supabase.from('price_items').insert({
      company_id: companyId,
      ...candidate,
      unit_price: parseFloat(newItem.unit_price) || 0,
    }).select().single()
    if (error) {
      setMutationError('Die Position konnte nicht angelegt werden. Bitte Eingaben prüfen.')
      return
    }
    if (data) {
      setItems(prev => [...prev, data])
      setNewItem({ category: selectedGewerk ?? '', title: '', unit: 'm²', unit_price: '' })
      setAdding(false)
    }
  }

  async function handleImport() {
    if (!companyId) return
    setImporting(true)
    setMutationError('')
    const existingKeys = new Set(items.map(priceItemIdentity))
    const toInsert = DEFAULT_PRICES
      .filter(p => ['Maler', 'Boden'].includes(getPriceTradeKey(p.category)))
      .filter(p => !existingKeys.has(priceItemIdentity(p)))
      .map(p => ({ ...p, company_id: companyId }))

    // Supabase limits single inserts to ~1000 rows — insert in batches
    const BATCH = 400
    const allInserted: PriceItem[] = []
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const { data, error } = await supabase
        .from('price_items')
        .insert(toInsert.slice(i, i + BATCH))
        .select()
      if (error) {
        setMutationError('Die Standardpreise konnten nicht vollständig ergänzt werden.')
        break
      }
      if (data) allInserted.push(...data)
    }
    if (allInserted.length > 0) setItems(prev => [...prev, ...allInserted])
    setImporting(false)
  }

  // ─── SUB-VIEWS ────────────────────────────────────────────────────────────

  function GewerkGrid() {
    return (
      <div className="grid grid-cols-2 gap-2.5 px-5 pt-4">
        {gewerke.map(g => (
          <button
            key={g.key}
            onClick={() => { setSelectedGewerk(g.key); setSelectedUnit('Alle') }}
            className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 text-left active:scale-95 transition-transform"
          >
            <div className="text-3xl mb-2">{g.emoji}</div>
            <div className="font-black text-[#2C2C2C] text-sm leading-tight">{g.label}</div>
            <div className="text-[#2C2C2C]/35 font-semibold text-xs mt-1">{g.count} Positionen</div>
          </button>
        ))}
        {items.length === 0 && !loading && (
          <div className="col-span-2 bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
            <div className="text-4xl mb-3">💰</div>
            <div className="font-black text-[#2C2C2C] mb-1">Keine Preise hinterlegt</div>
            <div className="text-sm text-[#2C2C2C]/50 font-semibold mb-5">Lade marktübliche Preise als Startpunkt.</div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="bg-[#F5C400] text-[#2C2C2C] font-black rounded-xl px-6 py-3 w-full disabled:opacity-50"
            >
              {importing ? 'Importiere...' : 'Standardpreise importieren'}
            </button>
          </div>
        )}
      </div>
    )
  }

  function PositionRow({ item }: { item: PriceItem }) {
    const isEditing = editingId === item.id
    if (isEditing) {
      return (
        <div className="border-b border-[#2C2C2C]/5 bg-[#F5C400]/5 px-4 py-3">
          <input
            value={editState.title}
            onChange={e => setEditState(s => ({ ...s, title: e.target.value }))}
            autoFocus
            className="w-full bg-white border-2 border-[#F5C400] rounded-xl px-3 py-2 text-sm font-bold text-[#2C2C2C] focus:outline-none mb-2"
          />
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <input
                type="number" step="0.01" min="0"
                value={editState.unit_price}
                onChange={e => setEditState(s => ({ ...s, unit_price: e.target.value }))}
                className="w-full bg-white border-2 border-[#F5C400] rounded-xl px-3 py-2 text-sm font-black focus:outline-none pr-6"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#2C2C2C]/40 font-bold">€</span>
            </div>
            <select
              value={editState.unit}
              onChange={e => setEditState(s => ({ ...s, unit: e.target.value }))}
              className="bg-white border-2 border-[#F5C400] rounded-xl px-3 py-2 text-sm font-bold text-[#2C2C2C] focus:outline-none"
            >
              {['m²', 'lfdm', 'Stück', 'Pauschale', 'Stunde', 'm³', 'kg', 'to', 'Stk', 'Std', 'Tag', 'Fahrt', 'km', 'Leerung', '%'].map(u => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => saveEdit(item.id)} className="flex-1 bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-xl py-2">
              <Check size={14} className="inline mr-1" strokeWidth={3} />Speichern
            </button>
            <button onClick={() => setEditingId(null)} className="flex-1 bg-white border-2 border-[#2C2C2C]/10 text-[#2C2C2C] font-bold text-sm rounded-xl py-2">
              <X size={14} className="inline mr-1" />Abbrechen
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className={`flex items-center justify-between border-b border-[#2C2C2C]/5 last:border-0 px-4 py-3 ${item.ist_erschwerniszuschlag ? 'bg-amber-50/40' : ''}`}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {item.ist_erschwerniszuschlag && <span className="text-xs">⚡</span>}
            <span className="font-semibold text-[#2C2C2C] text-sm truncate">{item.title}</span>
          </div>
          <div className="text-xs text-[#2C2C2C]/45 font-semibold mt-0.5">
            {item.zuschlag_typ === 'prozent'
              ? `+${item.unit_price}%`
              : `${item.unit_price.toFixed(2).replace('.', ',')} € / ${item.unit}`}
            {item.erschwerniszuschlag_fuer && <span className="ml-1 text-[#2C2C2C]/30">auf {item.erschwerniszuschlag_fuer}</span>}
          </div>
        </div>
        <div className="flex items-center gap-0.5 ml-3 shrink-0">
          <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-[#F5C400]/20 transition-colors">
            <Pencil size={15} color="#2C2C2C" strokeWidth={2} className="opacity-40" />
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 size={15} color="#ef4444" strokeWidth={2} />
          </button>
        </div>
      </div>
    )
  }

  function SearchResults() {
    return (
      <div className="px-5 pt-2 pb-6">
        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-3">🔍</div>
            <div className="font-black text-[#2C2C2C]">Nichts gefunden</div>
            <div className="text-sm text-[#2C2C2C]/45 font-semibold mt-1 mb-4">"{searchQuery}" ist in keiner Position</div>
            {selectedGewerk && (
              <button
                onClick={() => { setAdding(true); setNewItem(p => ({ ...p, title: searchQuery })) }}
                className="bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-xl px-5 py-2.5"
              >
                + Eigene Position erstellen
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="text-xs font-black text-[#2C2C2C]/35 uppercase tracking-widest mb-3">
              {searchResults.length} Ergebnisse
            </div>
            <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
              {searchResults.map(item => (
                <div key={item.id}>
                  <div className="px-4 pt-2">
                    <span className="text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-wider">
                      {GEWERK_META[getGewerkKey(item.category)]?.emoji} {getGewerkKey(item.category)}
                    </span>
                  </div>
                  <PositionRow item={item} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // ─── MOBILE RENDER ────────────────────────────────────────────────────────

  const MobileLayout = (
    <div className="md:hidden min-h-dvh bg-[#F7F7F5] pb-20">
      {/* Header */}
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-4">
        {selectedGewerk ? (
          <div className="flex items-center justify-between">
            <button onClick={() => { setSelectedGewerk(null); setSelectedUnit('Alle'); setSearchQuery('') }} className="flex items-center gap-1 text-white/50 text-sm font-bold">
              <ArrowLeft size={16} />
              {GEWERK_META[selectedGewerk]?.label ?? selectedGewerk}
            </button>
            <button onClick={() => setAdding(true)} className="bg-[#F5C400] rounded-xl p-2">
              <Plus size={18} color="#2C2C2C" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Link href="/einstellungen" className="text-white/50 text-sm font-semibold">← Einstellungen</Link>
          </div>
        )}
        <div className="text-white font-syne font-black text-xl mt-2 mb-3">
          {selectedGewerk
            ? `${GEWERK_META[selectedGewerk]?.emoji ?? ''} ${GEWERK_META[selectedGewerk]?.label ?? selectedGewerk}`
            : 'Preisdatenbank'}
        </div>
        {/* Search */}
        <div className="relative">
          <Search size={15} color="#2C2C2C" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={selectedGewerk ? `In ${GEWERK_META[selectedGewerk]?.label ?? selectedGewerk} suchen...` : 'Position suchen...'}
            className="w-full bg-white/10 text-white placeholder:text-white/30 font-semibold text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white/15"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} color="white" className="opacity-40" />
            </button>
          )}
        </div>
      </div>

      {/* Neues Item Formular */}
      {adding && (
        <form onSubmit={handleAdd} className="mx-5 mt-4 bg-white rounded-2xl p-4 border-2 border-[#F5C400]">
          <div className="font-black text-[#2C2C2C] mb-3">Neue Position</div>
          <div className="flex flex-col gap-2.5">
            <input
              placeholder="Bezeichnung"
              value={newItem.title}
              onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
              required
              autoFocus
              className={inputCls}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                placeholder="Preis (€)"
                type="number" step="0.01" min="0"
                value={newItem.unit_price}
                onChange={e => setNewItem(p => ({ ...p, unit_price: e.target.value }))}
                required
                className={inputCls}
              />
              <select
                value={newItem.unit}
                onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                className={inputCls}
              >
                {['m²', 'lfdm', 'Stück', 'Pauschale', 'Stunde', 'm³', 'kg', 'Stk', 'Std', 'Tag', 'Fahrt', 'km', '%'].map(u => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setAdding(false)} className="flex-1 border-2 border-[#2C2C2C]/15 rounded-xl py-3 font-bold text-[#2C2C2C] text-sm">Abbrechen</button>
              <button type="submit" className="flex-[2] bg-[#F5C400] rounded-xl py-3 font-black text-[#2C2C2C] text-sm">Speichern</button>
            </div>
          </div>
        </form>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center text-[#2C2C2C]/40 font-semibold py-16">Lädt...</div>
      ) : isSearching ? (
        <SearchResults />
      ) : !selectedGewerk ? (
        <GewerkGrid />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 px-5 pt-4 pb-2">
            <select value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)} className={inputCls}>
              {availableUnits.map(unit => <option key={unit} value={unit}>{unit === 'Alle' ? 'Alle Einheiten' : unit}</option>)}
            </select>
            <select value={sortMode} onChange={e => setSortMode(e.target.value as typeof sortMode)} className={inputCls}>
              <option value="name">A–Z</option>
              <option value="price-asc">Preis aufsteigend</option>
              <option value="price-desc">Preis absteigend</option>
            </select>
          </div>

          {/* Positions List */}
          <div className="px-5 pt-2">
            {visibleItems.length === 0 ? (
              <div className="text-center py-12 text-[#2C2C2C]/40 font-semibold">Keine Positionen</div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                {visibleItems.map(item => <PositionRow key={item.id} item={item} />)}
              </div>
            )}
            <div className="mt-3 text-xs text-[#2C2C2C]/30 font-semibold text-center">
              {visibleItems.length} {visibleItems.length === 1 ? 'Position' : 'Positionen'}
            </div>
          </div>
        </>
      )}
    </div>
  )

  // ─── DESKTOP RENDER ───────────────────────────────────────────────────────

  const DesktopLayout = (
    <div className="hidden md:flex h-screen bg-[#F7F7F5] overflow-hidden">

      {/* COL 1 — GEWERKE (220px) */}
      <div className="w-[220px] shrink-0 flex flex-col border-r border-[#2C2C2C]/8 bg-white">
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-[#2C2C2C]/8">
          <Link href="/einstellungen" className="text-xs font-bold text-[#2C2C2C]/35 hover:text-[#2C2C2C]/60">← Einstellungen</Link>
          <div className="font-syne font-black text-[#2C2C2C] text-base mt-1">Preisdatenbank</div>
        </div>
        {/* Search */}
        <div className="px-3 py-2.5 border-b border-[#2C2C2C]/8">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#2C2C2C]/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Suchen..."
              className="w-full bg-[#F7F7F5] text-[#2C2C2C] text-xs font-semibold rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F5C400]"
            />
          </div>
        </div>
        {/* Gewerk List */}
        <div className="flex-1 overflow-y-auto py-1">
          {gewerke.map(g => (
            <button
              key={g.key}
              onClick={() => { setSelectedGewerk(g.key); setSelectedUnit('Alle'); setSearchQuery('') }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors group
                ${selectedGewerk === g.key
                  ? 'bg-[#F5C400]/15 border-l-[3px] border-[#F5C400]'
                  : 'border-l-[3px] border-transparent hover:bg-[#F7F7F5]'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">{g.emoji}</span>
                <span className={`text-sm font-black truncate ${selectedGewerk === g.key ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/60'}`}>
                  {g.label}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className={`text-xs font-semibold ${selectedGewerk === g.key ? 'text-[#2C2C2C]/45' : 'text-[#2C2C2C]/25'}`}>
                  {g.count}
                </span>
                <ChevronRight size={12} className={`${selectedGewerk === g.key ? 'text-[#2C2C2C]/40' : 'text-[#2C2C2C]/20'}`} />
              </div>
            </button>
          ))}
        </div>
        {/* Import Button */}
        <div className="p-3 border-t border-[#2C2C2C]/8">
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full text-xs font-black text-[#2C2C2C]/40 hover:text-[#2C2C2C]/70 bg-[#F7F7F5] rounded-xl py-2 transition-colors disabled:opacity-50"
          >
            {importing ? '...' : '↻ Standardpreise'}
          </button>
        </div>
      </div>

      {/* POSITIONEN (flex grow) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-3.5 border-b border-[#2C2C2C]/8 bg-white flex items-center justify-between">
          <div className="text-sm font-black text-[#2C2C2C]">
            {isSearching
              ? `${searchResults.length} Suchergebnisse für „${searchQuery}"`
              : selectedGewerk
                ? GEWERK_META[selectedGewerk]?.label
                : 'Alle Positionen'}
            {!isSearching && <span className="ml-2 text-[#2C2C2C]/30 font-semibold text-xs">{visibleItems.length}</span>}
          </div>
          <div className="flex items-center gap-2">
            {selectedGewerk && (
              <>
                <select
                  value={selectedUnit}
                  onChange={e => setSelectedUnit(e.target.value)}
                  className="bg-[#F7F7F5] rounded-xl px-3 py-2 text-xs font-bold text-[#2C2C2C] outline-none"
                >
                  {availableUnits.map(unit => <option key={unit} value={unit}>{unit === 'Alle' ? 'Alle Einheiten' : unit}</option>)}
                </select>
                <select
                  value={sortMode}
                  onChange={e => setSortMode(e.target.value as typeof sortMode)}
                  className="bg-[#F7F7F5] rounded-xl px-3 py-2 text-xs font-bold text-[#2C2C2C] outline-none"
                >
                  <option value="name">A–Z</option>
                  <option value="price-asc">Preis ↑</option>
                  <option value="price-desc">Preis ↓</option>
                </select>
              </>
            )}
            {selectedGewerk && (
              <button
                onClick={() => { setAdding(true); setNewItem(p => ({ ...p, category: selectedGewerk })) }}
                className="flex items-center gap-1.5 bg-[#F5C400] text-[#2C2C2C] font-black text-xs px-3 py-2 rounded-xl"
              >
                <Plus size={13} strokeWidth={3} />
                Position
              </button>
            )}
          </div>
        </div>

        {/* New Item Form (inline) */}
        {adding && (
          <form onSubmit={handleAdd} className="mx-6 mt-4 bg-white rounded-2xl p-4 border-2 border-[#F5C400] shrink-0">
            <div className="flex gap-3 items-end">
              <div className="flex-[3]">
                <label className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-wide">Bezeichnung</label>
                <input
                  value={newItem.title}
                  onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                  autoFocus required
                  placeholder="z.B. Wand streichen 2× Anstrich"
                  className="w-full mt-1 bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-3 py-2 text-sm font-semibold text-[#2C2C2C] focus:outline-none focus:border-[#F5C400]"
                />
              </div>
              <div className="w-24">
                <label className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-wide">Preis €</label>
                <input
                  type="number" step="0.01" min="0" required
                  value={newItem.unit_price}
                  onChange={e => setNewItem(p => ({ ...p, unit_price: e.target.value }))}
                  className="w-full mt-1 bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-3 py-2 text-sm font-bold text-[#2C2C2C] focus:outline-none focus:border-[#F5C400]"
                />
              </div>
              <div className="w-24">
                <label className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-wide">Einheit</label>
                <select
                  value={newItem.unit}
                  onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                  className="w-full mt-1 bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-3 py-2 text-sm font-bold text-[#2C2C2C] focus:outline-none focus:border-[#F5C400]"
                >
                  {['m²', 'lfdm', 'Stück', 'Pauschale', 'Stunde', 'm³', 'kg', 'Stk', 'Std', 'Tag', 'Fahrt', 'km', '%'].map(u => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="submit" className="bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-xl px-4 py-2">
                  <Check size={15} strokeWidth={3} />
                </button>
                <button type="button" onClick={() => setAdding(false)} className="border-2 border-[#2C2C2C]/10 text-[#2C2C2C] font-bold text-sm rounded-xl px-3 py-2">
                  <X size={15} />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Positions Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-16 text-[#2C2C2C]/30 font-semibold">Lädt...</div>
          ) : isSearching ? (
            <div className="p-6">
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-3xl mb-3">🔍</div>
                  <div className="font-black text-[#2C2C2C]">Nichts gefunden</div>
                  <div className="text-sm text-[#2C2C2C]/45 font-semibold mt-1">„{searchQuery}" in keiner Position</div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[1fr_140px_100px_80px] gap-0 px-4 py-2.5 bg-[#F7F7F5] border-b border-[#2C2C2C]/8">
                    <span className="text-[10px] font-black text-[#2C2C2C]/35 uppercase tracking-wide">Bezeichnung</span>
                    <span className="text-[10px] font-black text-[#2C2C2C]/35 uppercase tracking-wide">Gewerk</span>
                    <span className="text-[10px] font-black text-[#2C2C2C]/35 uppercase tracking-wide text-right">Preis</span>
                    <span className="text-[10px] font-black text-[#2C2C2C]/35 uppercase tracking-wide text-center">Einheit</span>
                  </div>
                  {searchResults.map(item => (
                    <DesktopRow key={item.id} item={item} showGewerk />
                  ))}
                </div>
              )}
            </div>
          ) : !selectedGewerk ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-3">👈</div>
              <div className="font-black text-[#2C2C2C]/30">Gewerk wählen</div>
              <div className="text-sm text-[#2C2C2C]/20 font-semibold mt-1">oder oben suchen</div>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="text-center py-12 text-[#2C2C2C]/30 font-semibold">Keine Positionen für diesen Filter</div>
          ) : (
            <div className="p-6 pt-4">
              <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_120px_80px_80px] gap-0 px-4 py-2.5 bg-[#F7F7F5] border-b border-[#2C2C2C]/8">
                  <span className="text-[10px] font-black text-[#2C2C2C]/35 uppercase tracking-wide">Bezeichnung</span>
                  <span className="text-[10px] font-black text-[#2C2C2C]/35 uppercase tracking-wide text-right">Preis</span>
                  <span className="text-[10px] font-black text-[#2C2C2C]/35 uppercase tracking-wide text-center">Einheit</span>
                  <span className="text-[10px] font-black text-[#2C2C2C]/35 uppercase tracking-wide text-right">Aktionen</span>
                </div>
                {visibleItems.map(item => <DesktopRow key={item.id} item={item} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  function DesktopRow({ item, showGewerk }: { item: PriceItem; showGewerk?: boolean }) {
    const isEditing = editingId === item.id
    if (isEditing) {
      return (
        <div className={`grid ${showGewerk ? 'grid-cols-[1fr_140px_100px_80px]' : 'grid-cols-[1fr_120px_80px_80px]'} gap-0 px-4 py-2 border-b border-[#2C2C2C]/5 bg-[#F5C400]/5 items-center`}>
          <input
            value={editState.title}
            onChange={e => setEditState(s => ({ ...s, title: e.target.value }))}
            autoFocus
            className="bg-white border-2 border-[#F5C400] rounded-lg px-2 py-1 text-sm font-semibold text-[#2C2C2C] focus:outline-none mr-2"
          />
          {showGewerk && <span className="text-xs text-[#2C2C2C]/40 font-semibold truncate">{getGewerkKey(item.category)}</span>}
          <div className="flex justify-end">
            <input
              type="number" step="0.01" min="0"
              value={editState.unit_price}
              onChange={e => setEditState(s => ({ ...s, unit_price: e.target.value }))}
              className="w-20 bg-white border-2 border-[#F5C400] rounded-lg px-2 py-1 text-sm font-black text-right text-[#2C2C2C] focus:outline-none"
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(item.id); if (e.key === 'Escape') setEditingId(null) }}
            />
          </div>
          <div className="flex justify-center">
            <select
              value={editState.unit}
              onChange={e => setEditState(s => ({ ...s, unit: e.target.value }))}
              className="w-full bg-white border-2 border-[#F5C400] rounded-lg px-1 py-1 text-xs font-bold text-[#2C2C2C] focus:outline-none"
            >
              {['m²', 'lfdm', 'Stück', 'Pauschale', 'Stunde', 'm³', 'kg', 'Stk', 'Std', 'Tag', 'Fahrt', 'km', '%'].map(u => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-1">
            <button onClick={() => saveEdit(item.id)} className="p-1.5 bg-[#F5C400] rounded-lg">
              <Check size={12} color="#2C2C2C" strokeWidth={3} />
            </button>
            <button onClick={() => setEditingId(null)} className="p-1.5 border border-[#2C2C2C]/15 rounded-lg">
              <X size={12} color="#2C2C2C" />
            </button>
          </div>
        </div>
      )
    }
    return (
      <div
        className={`grid ${showGewerk ? 'grid-cols-[1fr_140px_100px_80px]' : 'grid-cols-[1fr_120px_80px_80px]'} gap-0 px-4 py-2.5 border-b border-[#2C2C2C]/5 last:border-0 items-center hover:bg-[#F7F7F5] group ${item.ist_erschwerniszuschlag ? 'bg-amber-50/30' : ''}`}
      >
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          {item.ist_erschwerniszuschlag && <span className="text-xs shrink-0">⚡</span>}
          {(item.nutzungshaeufigkeit ?? 0) >= 5 && <span className="text-xs shrink-0">🔥</span>}
          <span className="text-sm font-semibold text-[#2C2C2C] truncate">{item.title}</span>
        </div>
        {showGewerk && (
          <span className="text-xs text-[#2C2C2C]/35 font-semibold truncate">
            {GEWERK_META[getGewerkKey(item.category)]?.emoji} {getGewerkKey(item.category)}
          </span>
        )}
        <div className="text-right">
          <span className="text-sm font-black text-[#2C2C2C]">
            {item.zuschlag_typ === 'prozent' ? `+${item.unit_price}%` : `${item.unit_price.toFixed(2).replace('.', ',')} €`}
          </span>
        </div>
        <div className="text-center">
          <span className="text-xs font-semibold text-[#2C2C2C]/45">{item.unit}</span>
        </div>
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => startEdit(item)} className="p-1.5 hover:bg-[#F5C400]/20 rounded-lg transition-colors">
            <Pencil size={13} color="#2C2C2C" strokeWidth={2} className="opacity-50" />
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={13} color="#ef4444" strokeWidth={2} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {mutationError && (
        <div className="fixed left-1/2 top-4 z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-lg">
          {mutationError}
          <button type="button" onClick={() => setMutationError('')} className="float-right ml-3">×</button>
        </div>
      )}
      {MobileLayout}
      {DesktopLayout}
    </>
  )
}

const inputCls = 'w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-3 py-2.5 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:border-[#F5C400]'
