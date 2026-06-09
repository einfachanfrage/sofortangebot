'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_PRICES } from '@/lib/default-prices'
import { Trash2, Plus, ChevronDown, ChevronUp, Pencil, Check, X } from 'lucide-react'
import Link from 'next/link'
import type { PriceItem } from '@/lib/types'

interface EditState {
  unit_price: string
  unit: string
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
  const [editState, setEditState] = useState<EditState>({ unit_price: '', unit: '' })
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
    const existingTitles = new Set(items.map(i => i.title.toLowerCase()))
    const toInsert = DEFAULT_PRICES
      .filter(p => !existingTitles.has(p.title.toLowerCase()))
      .map(p => ({ ...p, company_id: companyId }))
    if (toInsert.length > 0) {
      const { data } = await supabase.from('price_items').insert(toInsert).select()
      if (data) setItems(prev => [...prev, ...data])
    }
    setImporting(false)
  }

  async function handleDelete(id: string) {
    await supabase.from('price_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function startEdit(item: PriceItem) {
    setEditingId(item.id)
    setEditState({ unit_price: String(item.unit_price), unit: item.unit })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id: string) {
    const unit_price = parseFloat(editState.unit_price)
    if (isNaN(unit_price) || unit_price < 0) return
    await supabase.from('price_items').update({ unit_price, unit: editState.unit }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, unit_price, unit: editState.unit } : i))
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
              <button
                onClick={handleImportDefaults}
                disabled={importing}
                className="text-sm font-bold text-[#F5C400]"
              >
                + Standardpreise
              </button>
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
                        <div key={item.id} className="flex items-center gap-2 px-4 py-3 border-b border-[#2C2C2C]/5 last:border-0">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-[#2C2C2C] text-sm truncate mb-1">{item.title}</div>
                            {editingId === item.id ? (
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editState.unit_price}
                                    onChange={e => setEditState(s => ({ ...s, unit_price: e.target.value }))}
                                    autoFocus
                                    className="w-24 bg-[#F7F7F5] border-2 border-[#F5C400] rounded-lg px-2 py-1 text-[#2C2C2C] font-black text-sm focus:outline-none pr-5"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2C2C2C]/40 font-bold">€</span>
                                </div>
                                <span className="text-xs text-[#2C2C2C]/40">/</span>
                                <input
                                  value={editState.unit}
                                  onChange={e => setEditState(s => ({ ...s, unit: e.target.value }))}
                                  className="w-14 bg-[#F7F7F5] border-2 border-[#F5C400] rounded-lg px-2 py-1 text-[#2C2C2C] font-semibold text-sm focus:outline-none"
                                />
                              </div>
                            ) : (
                              <div className="text-xs text-[#2C2C2C]/50 font-semibold">
                                {item.unit_price.toFixed(2).replace('.', ',')} € / {item.unit}
                              </div>
                            )}
                          </div>
                          {editingId === item.id ? (
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => saveEdit(item.id)} className="p-1.5 bg-[#F5C400] rounded-lg">
                                <Check size={14} color="#2C2C2C" strokeWidth={3} />
                              </button>
                              <button onClick={cancelEdit} className="p-1.5 bg-[#2C2C2C]/8 rounded-lg">
                                <X size={14} color="#2C2C2C" strokeWidth={2.5} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => startEdit(item)} className="p-2">
                                <Pencil size={18} color="#2C2C2C" strokeWidth={2.5} />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="p-2">
                                <Trash2 size={18} color="#ef4444" />
                              </button>
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
