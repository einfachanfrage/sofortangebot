'use client'

import { useState, useEffect, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import AngebotVorschau from './AngebotVorschau'
import type { Quote, QuoteItem, Company, Customer } from '@/lib/types'

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null }
  company: Company
  quoteNumber: string
  onClose: () => void
  onSent?: (via: string) => void
  initialTab?: 'vorschau' | 'senden'
}

type SendTab = 'email' | 'whatsapp' | 'link'

function buildDefaultNachricht(
  company: Company,
  customer: Customer | null | undefined,
  quoteNumber: string
): string {
  const anrede = customer?.name ? `Hallo ${customer.name.split(' ')[0]},` : 'Hallo,'
  return `${anrede}

vielen Dank für Ihr Interesse. Im Anhang finden Sie unser Angebot Nr. ${quoteNumber}.

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
${company.name}`
}

export default function VorschauUndVersand({ quote, company, quoteNumber, onClose, onSent, initialTab = 'vorschau' }: Props) {
  const [mainTab, setMainTab] = useState<'vorschau' | 'senden'>(initialTab)
  const [sendTab, setSendTab] = useState<SendTab>('email')
  const [modus, setModus] = useState<'angebot' | 'rechnung'>('angebot')

  // Email-Tab
  const [to, setTo] = useState(quote.customer?.email ?? '')
  const [betreff, setBetreff] = useState(`Angebot Nr. ${quoteNumber} – ${company.name}`)
  const [nachricht, setNachricht] = useState(() => buildDefaultNachricht(company, quote.customer, quoteNumber))

  // WhatsApp / Link
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [urlLoading, setUrlLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Sending state
  const [sending, setSending] = useState(false)
  const [sentOk, setSentOk] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  // Vorschau-Banner
  const [showBanner, setShowBanner] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShowBanner(false), 3000)
    return () => clearTimeout(t)
  }, [])

  const loadPublicUrl = useCallback(async () => {
    if (publicUrl) return
    setUrlLoading(true)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/public-pdf`, { method: 'POST' })
      const data = await res.json()
      if (data.url) setPublicUrl(data.url)
    } finally {
      setUrlLoading(false)
    }
  }, [quote.id, publicUrl])

  // Wenn WhatsApp oder Link geöffnet wird, URL vorab laden
  useEffect(() => {
    if (mainTab === 'senden' && (sendTab === 'whatsapp' || sendTab === 'link')) {
      loadPublicUrl()
    }
  }, [mainTab, sendTab, loadPublicUrl])

  async function handleSend() {
    setSending(true)
    setSendError(null)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: sendTab === 'email' ? to : '',
          betreff,
          nachricht,
          via: sendTab,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Fehler beim Senden')
      setSentOk(true)
      onSent?.(sendTab)
    } catch (e: unknown) {
      setSendError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setSending(false)
    }
  }

  function handleWhatsApp() {
    if (!publicUrl) return
    const text = encodeURIComponent(`Hallo${quote.customer?.name ? ` ${quote.customer.name.split(' ')[0]}` : ''},\n\nanbei das Angebot Nr. ${quoteNumber}:\n${publicUrl}\n\nBei Fragen gerne melden.\n\n${company.name}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
    // Status als gesendet markieren
    fetch(`/api/quotes/${quote.id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: '', betreff: '', nachricht: '', via: 'whatsapp' }),
    }).catch(() => {})
    onSent?.('whatsapp')
  }

  async function copyLink() {
    if (!publicUrl) return
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // Status als gesendet markieren
    fetch(`/api/quotes/${quote.id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: '', betreff: '', nachricht: '', via: 'link' }),
    }).catch(() => {})
    onSent?.('link')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative mt-auto w-full bg-white rounded-t-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Tabs: Vorschau | Senden */}
        <div className="flex border-b border-gray-100 mx-4 flex-shrink-0">
          <button
            onClick={() => setMainTab('vorschau')}
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'vorschau' ? 'border-[#F5C400] text-[#2C2C2C]' : 'border-transparent text-gray-400'}`}
          >
            Vorschau
          </button>
          <button
            onClick={() => setMainTab('senden')}
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'senden' ? 'border-[#F5C400] text-[#2C2C2C]' : 'border-transparent text-gray-400'}`}
          >
            Senden →
          </button>
          <button onClick={onClose} className="px-4 text-gray-400 text-lg">✕</button>
        </div>

        {/* VORSCHAU TAB */}
        {mainTab === 'vorschau' && (
          <div className="flex-1 overflow-y-auto relative">
            {/* Angebot/Rechnung Toggle */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between border-b border-gray-100">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setModus('angebot')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modus === 'angebot' ? 'bg-white shadow text-[#2C2C2C]' : 'text-gray-500'}`}
                >
                  Angebot
                </button>
                <button
                  onClick={() => setModus('rechnung')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modus === 'rechnung' ? 'bg-white shadow text-[#2C2C2C]' : 'text-gray-500'}`}
                >
                  Rechnung
                </button>
              </div>
              <span className="text-[10px] text-gray-400">So sieht dein {modus === 'angebot' ? 'Angebot' : 'Rechnung'} aus</span>
            </div>

            {/* Banner */}
            {showBanner && (
              <div className="mx-4 mt-3 bg-[#FFF9E6] border border-[#F5C400]/40 rounded-xl px-4 py-3 text-xs text-[#92400E] font-medium text-center transition-opacity">
                So sieht dein Angebot für den Kunden aus
              </div>
            )}

            {/* Skalierte Vorschau */}
            <div className="px-2 py-3">
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133%' }}>
                  <AngebotVorschau quote={quote} company={company} quoteNumber={quoteNumber} modus={modus} />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex gap-2">
              <button
                onClick={() => { setMainTab('senden'); setSendTab('email') }}
                className="flex-1 bg-[#2C2C2C] text-white py-3 rounded-xl font-semibold text-sm"
              >
                Senden →
              </button>
            </div>
          </div>
        )}

        {/* SENDEN TAB */}
        {mainTab === 'senden' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Sub-Tabs */}
            <div className="flex gap-1 mx-4 mt-3 bg-gray-100 rounded-xl p-1 flex-shrink-0">
              {(['email', 'whatsapp', 'link'] as SendTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSendTab(tab)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${sendTab === tab ? 'bg-white shadow text-[#2C2C2C]' : 'text-gray-500'}`}
                >
                  {tab === 'email' ? '✉️ E-Mail' : tab === 'whatsapp' ? '💬 WhatsApp' : '🔗 Link'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

              {/* ── E-Mail Tab ─────────────────────────────────────────── */}
              {sendTab === 'email' && (
                <div className="space-y-3">
                  {sentOk ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                      <div className="text-4xl mb-2">✅</div>
                      <div className="font-bold text-green-800 text-base mb-1">Angebot gesendet!</div>
                      <div className="text-green-600 text-sm">Die E-Mail wurde an {to} geschickt.</div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">An</label>
                        <input
                          type="email"
                          value={to}
                          onChange={e => setTo(e.target.value)}
                          placeholder="kunde@beispiel.de"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C400]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Betreff</label>
                        <input
                          value={betreff}
                          onChange={e => setBetreff(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C400]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Nachricht</label>
                        <textarea
                          value={nachricht}
                          onChange={e => setNachricht(e.target.value)}
                          rows={8}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C400] resize-none"
                        />
                        <div className="text-[10px] text-gray-400 mt-0.5">PDF-Anhang wird automatisch beigefügt</div>
                      </div>
                      {sendError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                          {sendError}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── WhatsApp Tab ───────────────────────────────────────── */}
              {sendTab === 'whatsapp' && (
                <div className="space-y-4">
                  {urlLoading ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <div className="w-8 h-8 border-2 border-[#F5C400] border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-500">PDF wird vorbereitet…</span>
                    </div>
                  ) : publicUrl ? (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800">
                        <span className="font-semibold">Link bereit.</span> Der Kunde kann das Angebot direkt im Browser öffnen.
                      </div>
                      <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500 break-all">{publicUrl}</div>
                      <button
                        onClick={handleWhatsApp}
                        className="w-full bg-[#25D366] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <span className="text-base">💬</span> In WhatsApp öffnen
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-sm text-gray-500 py-8">Link konnte nicht generiert werden.</div>
                  )}
                </div>
              )}

              {/* ── Link kopieren Tab ──────────────────────────────────── */}
              {sendTab === 'link' && (
                <div className="space-y-4">
                  {urlLoading ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <div className="w-8 h-8 border-2 border-[#F5C400] border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-500">PDF wird vorbereitet…</span>
                    </div>
                  ) : publicUrl ? (
                    <>
                      {/* QR Code */}
                      <div className="flex justify-center py-2">
                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm">
                          <QRCodeSVG value={publicUrl} size={160} bgColor="#ffffff" fgColor="#2C2C2C" />
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-gray-400">QR-Code scannen zum Öffnen</div>

                      {/* URL */}
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-500 truncate">
                          {publicUrl}
                        </div>
                        <button
                          onClick={copyLink}
                          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-[#2C2C2C] text-white'}`}
                        >
                          {copied ? '✓ Kopiert' : 'Kopieren'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-sm text-gray-500 py-8">Link konnte nicht generiert werden.</div>
                  )}
                </div>
              )}
            </div>

            {/* Senden-Button */}
            {sendTab === 'email' && !sentOk && (
              <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={handleSend}
                  disabled={!to || sending}
                  className="w-full bg-[#2C2C2C] text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                      Wird gesendet…
                    </>
                  ) : '✉️ Angebot jetzt senden'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
