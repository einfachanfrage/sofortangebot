'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Quote, QuoteItem, Company, Customer } from '@/lib/types'
import { Download, Mail, Share2, Trash2, FileText, Link2, Phone, Check, Pencil, X, Plus, ChevronDown, Copy } from 'lucide-react'

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null; share_token?: string; sent_via?: string[] }
  company: Company | null
  quoteNumber: string
}

const STATUS_CONFIG = {
  draft:    { label: 'Entwurf',    bg: 'bg-gray-100',  text: 'text-gray-600'  },
  sent:     { label: 'Offen',      bg: 'bg-blue-50',   text: 'text-blue-700'  },
  accepted: { label: 'Beauftragt', bg: 'bg-green-50',  text: 'text-green-700' },
  rejected: { label: 'Abgelehnt', bg: 'bg-red-50',    text: 'text-red-700'   },
  archived: { label: 'Archiviert', bg: 'bg-gray-50',   text: 'text-gray-400'  },
}

const VIA_LABELS: Record<string, string> = {
  email: '✉️ E-Mail',
  whatsapp: '💬 WhatsApp',
  link: '🔗 Link',
  lexoffice: 'Lexoffice',
  sevdesk: 'sevDesk',
  fastbill: 'FastBill',
  billomat: 'Billomat',
  papierkram: 'Papierkram',
  easybill: 'Easybill',
}

function fmt(n: number) {
  return n.toFixed(2).replace('.', ',') + ' €'
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
}

export default function AngebotDetail({ quote, company, quoteNumber }: Props) {
  const [sending, setSending] = useState(false)
  const [emailInput, setEmailInput] = useState(quote.customer?.email ?? '')
  const [showEmail, setShowEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editItems, setEditItems] = useState<EditItem[]>(quote.items)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)
  const [showStatusPicker, setShowStatusPicker] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(quote.status)
  const [sentVia, setSentVia] = useState<string[]>(quote.sent_via ?? [])
  const router = useRouter()
  const supabase = createClient()

  const INTEGRATIONS = [
    { id: 'lexoffice', label: 'Lexoffice', short: 'LO', color: '#0066CC', active: !!company?.lexoffice_api_key },
    { id: 'sevdesk', label: 'sevDesk', short: 'SD', color: '#E84B3C', active: !!company?.sevdesk_api_key },
    { id: 'fastbill', label: 'FastBill', short: 'FB', color: '#FF6B00', active: !!company?.fastbill_api_key && !!company?.fastbill_email },
    { id: 'billomat', label: 'Billomat', short: 'BM', color: '#4CAF50', active: !!company?.billomat_api_key && !!company?.billomat_subdomain },
    { id: 'papierkram', label: 'Papierkram', short: 'PK', color: '#795548', active: !!company?.papierkram_api_key },
    { id: 'easybill', label: 'Easybill', short: 'EB', color: '#009688', active: !!company?.easybill_api_key },
  ]
  const activeIntegrations = INTEGRATIONS.filter(i => i.active)
  const hasAnyIntegration = activeIntegrations.length > 0

  const status = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.draft

  // Öffentliche PDF-URL via Share-Token
  const publicPdfUrl = quote.share_token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/pdf/public?token=${quote.share_token}`
    : null

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function trackVia(via: string) {
    if (sentVia.includes(via)) return
    setSentVia(prev => [...prev, via])
    fetch(`/api/quotes/${quote.id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ via }),
    }).catch(() => {})
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
    const r = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quoteId: quote.id, to: emailInput }),
    })
    setSending(false)
    if (r.ok) {
      setEmailSent(true)
      setShowEmail(false)
      setCurrentStatus('sent')
      trackVia('email')
      await supabase.from('quotes').update({ status: 'sent' }).eq('id', quote.id)
      showToast('E-Mail versendet ✓')
    } else {
      showToast('E-Mail fehlgeschlagen — Resend noch nicht eingerichtet')
    }
  }

  async function handleDuplicate() {
    const r = await fetch('/api/quotes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: quote.items.map(i => ({
          title: i.title,
          description: i.description,
          quantity: i.quantity,
          unit: i.unit,
          unit_price: i.unit_price,
        })),
        notes: quote.notes,
        customerName: quote.customer?.name ?? '',
        customerEmail: quote.customer?.email ?? '',
        customerPhone: quote.customer?.phone ?? '',
        customerAddress: quote.customer?.address ?? '',
      }),
    })
    if (r.ok) {
      const { id } = await r.json()
      showToast('Angebot dupliziert ✓')
      router.push(`/angebot/${id}`)
    } else {
      showToast('Duplizieren fehlgeschlagen')
    }
  }

  async function handleDelete() {
    if (!confirm('Angebot wirklich löschen?')) return
    setDeleting(true)
    await supabase.from('quotes').delete().eq('id', quote.id)
    router.push('/dashboard')
  }

  function copyLink() {
    // share_token verwenden, nicht UUID (Punkt 2)
    const token = quote.share_token ?? quote.id
    const link = `${window.location.origin}/angebot/${token}/unterschreiben`
    navigator.clipboard.writeText(link)
    trackVia('link')
    showToast('Link kopiert — jetzt an Kunden schicken')
  }

  // ── Edit-Modus ──────────────────────────────────────────────────────────────
  function updateEditItem(id: string, field: keyof EditItem, value: string | number) {
    setEditItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: typeof value === 'string' && (field === 'quantity' || field === 'unit_price') ? Number(value) : value }
      updated.total_price = updated.quantity * updated.unit_price
      return updated
    }))
  }

  function removeEditItem(id: string) {
    setEditItems(prev => prev.filter(item => item.id !== id))
  }

  function addEditItem() {
    const newItem: EditItem = {
      id: `new-${Date.now()}`,
      position: (editItems[editItems.length - 1]?.position ?? 0) + 1,
      title: 'Neue Position',
      description: null,
      quantity: 1,
      unit: 'Stk',
      unit_price: 0,
      total_price: 0,
    }
    setEditItems(prev => [...prev, newItem])
  }

  async function saveEdits() {
    setSaving(true)

    // Bestehende Items updaten oder neu anlegen
    for (const item of editItems) {
      if (item.id.startsWith('new-')) {
        await supabase.from('quote_items').insert({
          quote_id: quote.id,
          position: item.position,
          title: item.title,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price,
        })
      } else {
        await supabase.from('quote_items').update({
          title: item.title,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price,
        }).eq('id', item.id)
      }
    }

    // Gelöschte Items entfernen
    const deletedIds = quote.items
      .filter(orig => !editItems.some(e => e.id === orig.id))
      .map(i => i.id)
    if (deletedIds.length) {
      await supabase.from('quote_items').delete().in('id', deletedIds)
    }

    // Summen neu berechnen
    const totalNet = editItems.reduce((s, i) => s + i.total_price, 0)
    const totalVat = company && company.vat_rate > 0 ? totalNet * (company.vat_rate / 100) : 0
    await supabase.from('quotes').update({
      total_net: totalNet,
      total_vat: totalVat,
      total_gross: totalNet + totalVat,
    }).eq('id', quote.id)

    setSaving(false)
    setEditMode(false)
    showToast('Angebot gespeichert ✓')
    router.refresh()
  }

  const displayItems = editMode ? editItems : quote.items
  const totalNet = editMode
    ? editItems.reduce((s, i) => s + i.quantity * i.unit_price, 0)
    : quote.total_net
  const totalVat = company && company.vat_rate > 0 ? totalNet * (company.vat_rate / 100) : 0
  const totalGross = totalNet + totalVat

  async function handleExport(provider: string, label: string) {
    setExporting(provider)
    const r = await fetch(`/api/integrations/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quoteId: quote.id }),
    })
    setExporting(null)
    if (r.ok) {
      trackVia(provider)
      showToast(`Zu ${label} übertragen ✓`)
    } else {
      const err = await r.json()
      showToast(err.error ?? 'Export fehlgeschlagen')
    }
  }

  const signingLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://sofortangebot.app'}/angebot/${quote.share_token ?? quote.id}/unterschreiben`
  const whatsappText = publicPdfUrl
    ? encodeURIComponent(`Hallo, anbei mein Angebot ${quoteNumber} über ${fmt(quote.total_gross)}.\n\nOnline ansehen & unterschreiben: ${signingLink}\n\nPDF: ${publicPdfUrl}`)
    : encodeURIComponent(`Hallo, anbei mein Angebot ${quoteNumber} über ${fmt(quote.total_gross)}.\n\nOnline ansehen & unterschreiben: ${signingLink}`)

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2C2C2C] text-white font-bold text-sm rounded-2xl px-5 py-3 text-center shadow-xl whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#2C2C2C] md:bg-transparent px-5 md:px-8 pt-12 md:pt-8 pb-5">
        <Link href="/dashboard" className="text-white/50 md:text-[#2C2C2C]/40 text-sm font-semibold">← Dashboard</Link>
        <div className="flex items-center justify-between mt-1">
          <div>
            <div className="text-white md:text-[#2C2C2C] font-black text-xl">Angebot {quoteNumber}</div>
            <div className="text-white/50 md:text-[#2C2C2C]/40 text-sm font-semibold mt-0.5">{fmtDate(quote.created_at)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStatusPicker(true)}
              className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${status.bg} ${status.text} active:scale-95 transition-transform`}
            >
              {status.label}
              <ChevronDown size={13} strokeWidth={3} />
            </button>
            {!editMode && (
              <button
                onClick={() => { setEditItems(quote.items); setEditMode(true) }}
                className="bg-white/10 text-white rounded-xl p-2 active:scale-95 transition-transform"
              >
                <Pencil size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status-Picker Modal */}
      {showStatusPicker && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowStatusPicker(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="font-black text-[#2C2C2C] text-lg mb-4">Status ändern</div>
            <div className="flex flex-col gap-2">
              {(Object.entries(STATUS_CONFIG) as [string, { label: string; bg: string; text: string }][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => changeStatus(key)}
                  className={`flex items-center justify-between w-full rounded-2xl px-4 py-3.5 border-2 transition-colors ${currentStatus === key ? 'border-[#F5C400] bg-[#F5C400]/10' : 'border-[#2C2C2C]/8'}`}
                >
                  <span className="font-bold text-[#2C2C2C]">{cfg.label}</span>
                  {currentStatus === key && <Check size={18} color="#2C2C2C" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: 2-Spalten-Grid. Mobile: einfache Liste */}
      <div className="px-5 md:px-8 pt-5 md:grid md:grid-cols-[1fr_340px] md:gap-6 md:items-start flex flex-col gap-4">

        {/* ── Linke Spalte: Badges, Kunde, Positionen, Notizen, Edit-Aktionen ── */}
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
          {quote.customer && (
            <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
              <div className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide mb-2">Kunde</div>
              <div className="font-black text-[#2C2C2C]">{quote.customer.name}</div>
              {quote.customer.address && (
                <div className="text-sm text-[#2C2C2C]/60 font-semibold mt-0.5">{quote.customer.address}</div>
              )}
              <div className="flex flex-col gap-1 mt-1">
                {quote.customer.phone && (
                  <a href={`tel:${quote.customer.phone}`} className="flex items-center gap-2 text-sm text-[#2C2C2C] font-semibold">
                    <Phone size={14} strokeWidth={2} className="text-[#F5C400]" />
                    {quote.customer.phone}
                  </a>
                )}
                {quote.customer.email && (
                  <div className="text-sm text-[#2C2C2C]/60 font-semibold">{quote.customer.email}</div>
                )}
              </div>
            </div>
          )}

          {/* Positionen */}
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="font-black text-[#2C2C2C]">Positionen</div>
              {editMode && (
                <button onClick={addEditItem} className="bg-[#F5C400] rounded-lg p-1.5">
                  <Plus size={16} color="#2C2C2C" strokeWidth={3} />
                </button>
              )}
            </div>

            {displayItems.map(item => (
              <div key={item.id} className="border-t border-[#2C2C2C]/5 px-4 py-3">
                {editMode ? (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <input value={item.title}
                        onChange={e => updateEditItem(item.id, 'title', e.target.value)}
                        className="w-full font-bold text-[#2C2C2C] bg-transparent focus:outline-none text-sm border-b border-transparent focus:border-[#F5C400] pb-0.5 mb-2" />
                      <div className="flex gap-2 items-center">
                        <input type="number" value={item.quantity}
                          onChange={e => updateEditItem(item.id, 'quantity', e.target.value)}
                          className="w-16 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 focus:outline-none" min={0} step="0.01" />
                        <input value={item.unit}
                          onChange={e => updateEditItem(item.id, 'unit', e.target.value)}
                          className="w-14 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 focus:outline-none" />
                        <div className="flex items-center gap-1 ml-auto">
                          <input type="number" value={item.unit_price}
                            onChange={e => updateEditItem(item.id, 'unit_price', e.target.value)}
                            className="w-20 text-sm font-semibold text-[#2C2C2C] bg-[#F7F7F5] rounded-lg px-2 py-1 text-right focus:outline-none" min={0} step="0.01" />
                          <span className="text-xs text-[#2C2C2C]/40 font-bold">€</span>
                        </div>
                      </div>
                      <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1 text-right">
                        = {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')} €
                      </div>
                    </div>
                    <button onClick={() => removeEditItem(item.id)} className="mt-0.5 p-1 shrink-0">
                      <X size={16} color="#ef4444" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#2C2C2C] text-sm">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-[#2C2C2C]/50 font-semibold mt-0.5">{item.description}</div>
                      )}
                      <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1">
                        {item.quantity} {item.unit} × {fmt(item.unit_price)}
                      </div>
                    </div>
                    <div className="font-black text-[#2C2C2C] shrink-0">{fmt(item.total_price)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Notizen */}
          {!editMode && quote.notes && (
            <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
              <div className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide mb-2">Anmerkungen</div>
              <div className="text-sm text-[#2C2C2C]/70 font-semibold">{quote.notes}</div>
            </div>
          )}

          {/* Edit-Aktionen */}
          {editMode && (
            <div className="flex gap-3">
              <button onClick={() => setEditMode(false)}
                className="flex-1 bg-white border-2 border-[#2C2C2C]/20 text-[#2C2C2C] font-black text-base rounded-2xl py-4 active:scale-95 transition-transform">
                Abbrechen
              </button>
              <button onClick={saveEdits} disabled={saving}
                className="flex-[2] bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-2xl py-4 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? 'Speichere...' : <><Check size={18} strokeWidth={3} /> Speichern</>}
              </button>
            </div>
          )}
        </div>

        {/* ── Rechte Spalte: Summen + Aktionen ── */}
        <div className="flex flex-col gap-3">
          {/* Summen */}
          <div className="bg-[#2C2C2C] rounded-2xl p-4">
            <div className="flex justify-between text-white/60 font-semibold text-sm mb-1.5">
              <span>Netto</span><span>{fmt(totalNet)}</span>
            </div>
            {company && company.vat_rate > 0 && (
              <div className="flex justify-between text-white/60 font-semibold text-sm mb-1.5">
                <span>MwSt. {company.vat_rate}%</span><span>{fmt(totalVat)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-black text-xl border-t border-white/20 pt-2 mt-1">
              <span>Gesamt</span><span>{fmt(totalGross)}</span>
            </div>
            {quote.valid_until && (
              <div className="text-white/30 text-xs font-semibold mt-2">Gültig bis {fmtDate(quote.valid_until)}</div>
            )}
          </div>

          {/* Aktionen */}
          {!editMode && (
            <>
              {/* Unterschrift-Info wenn signiert */}
              {quote.signed_at && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                  <Check size={20} color="#16a34a" strokeWidth={2.5} />
                  <div>
                    <div className="font-black text-green-800 text-sm">Unterschrieben</div>
                    <div className="text-green-700 text-xs font-semibold">
                      {quote.signed_by} · {fmtDate(quote.signed_at)}
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Download */}
              <a href={`/api/pdf?id=${quote.id}`} target="_blank"
                className="flex items-center justify-center gap-3 w-full bg-[#F5C400] text-[#2C2C2C] font-black text-base rounded-2xl py-3.5 active:scale-95 transition-transform">
                <Download size={20} strokeWidth={3} />
                PDF herunterladen
              </a>

              {/* WhatsApp */}
              <a href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noopener noreferrer"
                onClick={() => trackVia('whatsapp')}
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-black text-base rounded-2xl py-3.5 active:scale-95 transition-transform">
                <Share2 size={20} strokeWidth={3} />
                Per WhatsApp senden
              </a>

              {/* E-Mail */}
              {!showEmail ? (
                <button onClick={() => setShowEmail(true)}
                  className="flex items-center justify-center gap-3 w-full bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-base rounded-2xl py-3.5 active:scale-95 transition-transform">
                  <Mail size={20} strokeWidth={3} />
                  {emailSent ? '✓ E-Mail versendet' : 'Per E-Mail senden'}
                </button>
              ) : (
                <div className="bg-white border-2 border-[#2C2C2C] rounded-2xl p-4">
                  <div className="font-black text-[#2C2C2C] mb-3">E-Mail-Adresse</div>
                  <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                    placeholder="kunde@beispiel.de"
                    className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400] mb-3" />
                  <div className="flex gap-3">
                    <button onClick={() => setShowEmail(false)}
                      className="flex-1 border-2 border-[#2C2C2C]/20 rounded-xl py-3 font-bold text-[#2C2C2C]">Abbrechen</button>
                    <button onClick={handleSendEmail} disabled={sending}
                      className="flex-[2] bg-[#F5C400] rounded-xl py-3 font-black text-[#2C2C2C] disabled:opacity-50">
                      {sending ? 'Sende...' : 'Senden'}
                    </button>
                  </div>
                </div>
              )}

              {/* Unterschreiben-Link */}
              <button onClick={copyLink}
                className="flex items-center justify-center gap-3 w-full bg-white border-2 border-[#2C2C2C]/20 text-[#2C2C2C] font-bold text-sm rounded-2xl py-3 active:scale-95 transition-transform">
                <Link2 size={18} strokeWidth={2.5} />
                Unterschreiben-Link kopieren
              </button>

              {/* CSV Export */}
              <a href={`/api/csv?id=${quote.id}`}
                className="flex items-center justify-center gap-3 w-full bg-white border-2 border-[#2C2C2C]/20 text-[#2C2C2C] font-bold text-sm rounded-2xl py-3 active:scale-95 transition-transform">
                <FileText size={18} strokeWidth={2.5} />
                CSV Export
              </a>

              {/* Duplizieren */}
              <button onClick={handleDuplicate}
                className="flex items-center justify-center gap-3 w-full bg-white border-2 border-[#2C2C2C]/20 text-[#2C2C2C] font-bold text-sm rounded-2xl py-3 active:scale-95 transition-transform">
                <Copy size={18} strokeWidth={2.5} />
                Angebot duplizieren
              </button>

              {/* Buchhaltungs-Integrationen */}
              {hasAnyIntegration ? (
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide text-center">Buchhaltung</div>
                  {activeIntegrations.map(int => (
                    <button key={int.id} onClick={() => handleExport(int.id, int.label)}
                      disabled={exporting === int.id}
                      style={{ borderColor: int.color + '33', color: int.color, backgroundColor: int.color + '12' }}
                      className="flex items-center justify-center gap-3 w-full border-2 font-bold text-sm rounded-2xl py-3 active:scale-95 transition-transform disabled:opacity-50">
                      <span className="font-black">{int.short}</span>
                      {exporting === int.id ? 'Übertrage...' : `Zu ${int.label} exportieren`}
                    </button>
                  ))}
                </div>
              ) : (
                <Link href="/einstellungen/integrationen"
                  className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-[#2C2C2C]/15 text-[#2C2C2C]/40 font-bold text-sm rounded-2xl py-3">
                  + Buchhaltung verbinden
                </Link>
              )}

              {/* Löschen */}
              <button onClick={handleDelete} disabled={deleting}
                className="flex items-center justify-center gap-2 w-full text-red-400 hover:text-red-500 font-bold text-sm py-3 transition-colors">
                <Trash2 size={15} />
                {deleting ? 'Wird gelöscht...' : 'Angebot löschen'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
