'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_PRICES } from '@/lib/default-prices'
import { Trash2, Plus, ChevronDown, ChevronUp, Pencil, Check, X } from 'lucide-react'
import Link from 'next/link'
import type { PriceItem, MengenrabattTier } from '@/lib/types'

interface EditState {
  title: string
  category: string
  unit_price: string
  unit: string
  mengenrabatt: MengenrabattTier[]
}

export default function PreisePage() {
  const [items, setItems] = useState<PriceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ category: '', title: '', unit: 'm²', unit_price: '' })
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())
  const [importing, setImporting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState>({ title: '', category: '', unit_price: '', unit: '', mengenrabatt: [] })
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: co } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
      if (!co) return
      setCompanyId(co.id)
      const { data } = await supabase.from('price_items').select('*').eq('company_id', co.id).order('category').order('title')
      setItems(data ?? [])
      if (data && data.length > 0) {
        const cats = [...new Set(data.map((i: PriceItem) => i.category))]
        setExpandedCats(new Set(cats.slice(0, 2)))
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleImportDefaults() {
    if (!companyId) return
    setImporting(true)
    // Neue Standardpreise hinzufügen (Titel-basierter Abgleich)
    const existingTitles = new Set(items.map(i => i.title.toLowerCase()))
    const toInsert = DEFAULT_PRICES
      .filter(p => !existingTitles.has(p.title.toLowerCase()))
      .map(p => ({ ...p, company_id: companyId }))
    if (toInsert.length > 0) {
      const { data } = await supabase.from('price_items').insert(toInsert).select()
      if (data) {
        setItems(prev => {
          const updated = [...prev, ...data]
          const cats = [...new Set(updated.map((i: PriceItem) => i.category))]
          setExpandedCats(new Set(cats))
          return updated
        })
      }
    }
    setImporting(false)
  }

  async function handleUpdateDefaults() {
    if (!companyId) return
    setImporting(true)
    // Alle Standardpreise einfügen (neue) + bestehende Standard-Preise aktualisieren
    const existingByTitle = new Map(items.map(i => [i.title.toLowerCase(), i]))
    const toInsert: typeof DEFAULT_PRICES = []
    const toUpdate: Array<{ id: string; unit_price: number; unit: string; category: string }> = []

    for (const p of DEFAULT_PRICES) {
      const existing = existingByTitle.get(p.title.toLowerCase())
      if (existing) {
        // Nur updaten wenn Preis oder Einheit abweicht
        if (existing.unit_price !== p.unit_price || existing.unit !== p.unit) {
          toUpdate.push({ id: existing.id, unit_price: p.unit_price, unit: p.unit, category: p.category })
        }
      } else {
        toInsert.push(p)
      }
    }

    // Neue einfügen
    if (toInsert.length > 0) {
      const { data } = await supabase.from('price_items')
        .insert(toInsert.map(p => ({ ...p, company_id: companyId }))).select()
      if (data) setItems(prev => [...prev, ...data])
    }

    // Bestehende aktualisieren (einzeln, da kein bulk-update mit verschiedenen Werten)
    for (const u of toUpdate) {
      await supabase.from('price_items')
        .update({ unit_price: u.unit_price, unit: u.unit, category: u.category })
        .eq('id', u.id)
      setItems(prev => prev.map(i => i.id === u.id ? { ...i, unit_price: u.unit_price, unit: u.unit, category: u.category } : i))
    }

    // Alle Kategorien aufklappen damit Nutzer alles sieht
    setItems(prev => {
      const cats = [...new Set(prev.map((i: PriceItem) => i.category))]
      setExpandedCats(new Set(cats))
      return prev
    })
    setImporting(false)
  }

  async function handleDelete(id: string) {
    await supabase.from('price_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function startEdit(item: PriceItem) {
    setEditingId(item.id)
    setEditState({ title: item.title, category: item.category, unit_price: String(item.unit_price), unit: item.unit, mengenrabatt: item.mengenrabatt ?? [] })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id: string) {
    const unit_price = parseFloat(editState.unit_price)
    if (isNaN(unit_price) || unit_price < 0) return
    const { title, category, unit, mengenrabatt } = editState
    const mengenrabattValue = mengenrabatt.length > 0 ? mengenrabatt : null
    await supabase.from('price_items').update({ title, category, unit_price, unit, mengenrabatt: mengenrabattValue }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, title, category, unit_price, unit, mengenrabatt: mengenrabattValue } : i))
    setEditingId(null)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!companyId || !newItem.title || !newItem.category) return
    const { data } = await supabase.from('price_items').insert({
      company_id: companyId,
      category: newItem.category,
      title: newItem.title,
      unit: newItem.unit,
      unit_price: parseFloat(newItem.unit_price) || 0,
    }).select().single()
    if (data) {
      setItems(prev => [...prev, data])
      setNewItem({ category: '', title: '', unit: 'm²', unit_price: '' })
      setAdding(false)
    }
  }

  const grouped = items.reduce<Record<string, PriceItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24">
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6 flex items-center justify-between">
        <div>
          <Link href="/einstellungen" className="text-white/50 text-sm font-semibold">← Einstellungen</Link>
          <div className="text-white font-black text-xl mt-1">Preisdatenbank</div>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="bg-[#F5C400] rounded-xl p-2.5"
        >
          <Plus size={22} color="#2C2C2C" strokeWidth={3} />
        </button>
      </div>

      {/* Neue Position */}
      {adding && (
        <form onSubmit={handleAdd} className="mx-5 mt-5 bg-white rounded-2xl p-4 border-2 border-[#F5C400]">
          <div className="font-black text-[#2C2C2C] mb-3">Neue Position</div>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Gewerk / Kategorie"
              value={newItem.category}
              onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
              required
              className={inputCls}
            />
            <input
              placeholder="Bezeichnung"
              value={newItem.title}
              onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
              required
              className={inputCls}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Einheit"
                value={newItem.unit}
                onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Preis (€)"
                type="number"
                step="0.01"
                min="0"
                value={newItem.unit_price}
                onChange={e => setNewItem(p => ({ ...p, unit_price: e.target.value }))}
                required
                className={inputCls}
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setAdding(false)} className="flex-1 border-2 border-[#2C2C2C]/20 rounded-xl py-3 font-bold text-[#2C2C2C]">Abbrechen</button>
              <button type="submit" className="flex-[2] bg-[#F5C400] rounded-xl py-3 font-black text-[#2C2C2C]">Speichern</button>
            </div>
          </div>
        </form>
      )}

      <div className="px-5 mt-5">
        {loading && <div className="text-center text-[#2C2C2C]/40 font-semibold py-12">Lädt...</div>}

        {!loading && items.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
            <div className="text-4xl mb-3">💰</div>
            <div className="font-black text-[#2C2C2C] mb-1">Keine Preise hinterlegt</div>
            <div className="text-sm text-[#2C2C2C]/50 font-semibold mb-5">Lade marktübliche Preise als Startpunkt.</div>
            <button
              onClick={handleImportDefaults}
              disabled={importing}
              className="bg-[#F5C400] text-[#2C2C2C] font-black rounded-xl px-6 py-3 w-full disabled:opacity-50"
            >
              {importing ? 'Importiere...' : 'Standardpreise importieren'}
            </button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-[#2C2C2C]/50">{items.length} Positionen</div>
              <div className="flex gap-3">
                <button
                  onClick={handleImportDefaults}
                  disabled={importing}
                  className="text-sm font-bold text-[#2C2C2C]/40 hover:text-[#2C2C2C]/70 transition-colors"
                >
                  + Neue
                </button>
                <button
                  onClick={handleUpdateDefaults}
                  disabled={importing}
                  className="text-sm font-bold text-[#F5C400]"
                >
                  {importing ? '...' : '↻ Alle aktualisieren'}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {Object.entries(grouped).map(([cat, catItems]) => (
                <div key={cat} className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                  <button
                    onClick={() => toggleCat(cat)}
                    className="w-full flex items-center justify-between px-4 py-4"
                  >
                    <div className="font-black text-[#2C2C2C]">{cat}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2C2C2C]/40">{catItems.length}</span>
                      {expandedCats.has(cat) ? <ChevronUp size={16} color="#2C2C2C" /> : <ChevronDown size={16} color="#2C2C2C" />}
                    </div>
                  </button>
                  {expandedCats.has(cat) && (
                    <div className="border-t border-[#2C2C2C]/5">
                      {catItems.map(item => (
                        <div key={item.id} className="border-b border-[#2C2C2C]/5 last:border-0">
                          {editingId === item.id ? (
                            <div className="px-4 py-3 bg-[#F5C400]/5 border-l-4 border-[#F5C400]">
                              <div className="flex flex-col gap-2 mb-3">
                                <input
                                  value={editState.title}
                                  onChange={e => setEditState(s => ({ ...s, title: e.target.value }))}
                                  autoFocus
                                  placeholder="Bezeichnung"
                                  className="w-full bg-white border-2 border-[#F5C400] rounded-lg px-3 py-2 text-[#2C2C2C] font-bold text-sm focus:outline-none"
                                />
                                <input
                                  value={editState.category}
                                  onChange={e => setEditState(s => ({ ...s, category: e.target.value }))}
                                  placeholder="Gewerk / Kategorie"
                                  className="w-full bg-white border-2 border-[#2C2C2C]/15 rounded-lg px-3 py-2 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:border-[#F5C400]"
                                />
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="relative flex-1 max-w-[120px]">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editState.unit_price}
                                    onChange={e => setEditState(s => ({ ...s, unit_price: e.target.value }))}
                                    className="w-full bg-white border-2 border-[#F5C400] rounded-lg px-3 py-2 text-[#2C2C2C] font-black text-base focus:outline-none pr-6"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2C2C2C]/40 font-bold">€</span>
                                </div>
                                <span className="text-sm text-[#2C2C2C]/40 font-semibold">/</span>
                                <input
                                  value={editState.unit}
                                  onChange={e => setEditState(s => ({ ...s, unit: e.target.value }))}
                                  className="w-20 bg-white border-2 border-[#F5C400] rounded-lg px-3 py-2 text-[#2C2C2C] font-semibold text-base focus:outline-none"
                                />
                              </div>
                              {/* Mengenrabatt-Tiers */}
                              <div className="mb-3">
                                <div className="text-xs font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-1.5">Mengenrabatt (optional)</div>
                                {editState.mengenrabatt.map((tier, ti) => (
                                  <div key={ti} className="flex items-center gap-2 mb-1.5">
                                    <span className="text-xs font-semibold text-[#2C2C2C]/50 shrink-0">ab</span>
                                    <input
                                      type="number" min={1} step={1}
                                      value={tier.ab}
                                      onChange={e => setEditState(s => ({ ...s, mengenrabatt: s.mengenrabatt.map((t, i) => i === ti ? { ...t, ab: Number(e.target.value) } : t) }))}
                                      className="w-16 bg-white border-2 border-[#2C2C2C]/15 rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none focus:border-[#F5C400] text-center"
                                    />
                                    <span className="text-xs font-semibold text-[#2C2C2C]/50 shrink-0">Stk →</span>
                                    <input
                                      type="number" min={1} max={99} step={1}
                                      value={tier.rabatt_prozent}
                                      onChange={e => setEditState(s => ({ ...s, mengenrabatt: s.mengenrabatt.map((t, i) => i === ti ? { ...t, rabatt_prozent: Number(e.target.value) } : t) }))}
                                      className="w-16 bg-white border-2 border-[#2C2C2C]/15 rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none focus:border-[#F5C400] text-center"
                                    />
                                    <span className="text-xs font-semibold text-[#2C2C2C]/50 shrink-0">%</span>
                                    <button type="button" onClick={() => setEditState(s => ({ ...s, mengenrabatt: s.mengenrabatt.filter((_, i) => i !== ti) }))} className="ml-auto p-1">
                                      <X size={14} color="#ef4444" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setEditState(s => ({ ...s, mengenrabatt: [...s.mengenrabatt, { ab: 5, rabatt_prozent: 5 }] }))}
                                  className="text-xs font-black text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors"
                                >
                                  + Rabattstufe hinzufügen
                                </button>
                              </div>

                              <div className="flex gap-2">
                                <button onClick={() => saveEdit(item.id)} className="flex-1 bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-xl py-2.5">
                                  Speichern
                                </button>
                                <button onClick={cancelEdit} className="flex-1 bg-white border-2 border-[#2C2C2C]/15 text-[#2C2C2C] font-bold text-sm rounded-xl py-2.5">
                                  Abbrechen
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-[#2C2C2C] text-sm truncate">{item.title}</div>
                                <div className="text-xs text-[#2C2C2C]/50 font-semibold mt-0.5">
                                  {item.unit_price.toFixed(2).replace('.', ',')} € / {item.unit}
                                  {item.mengenrabatt && item.mengenrabatt.length > 0 && (
                                    <span className="ml-2 text-[#2C2C2C]/30">
                                      · Rabatt: {item.mengenrabatt.map(t => `ab ${t.ab} → ${t.rabatt_prozent}%`).join(', ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button onClick={() => startEdit(item)} className="p-2">
                                  <Pencil size={17} color="#2C2C2C" strokeWidth={2} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2">
                                  <Trash2 size={17} color="#ef4444" strokeWidth={2} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const inputCls = "w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
