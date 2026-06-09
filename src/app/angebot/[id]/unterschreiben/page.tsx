'use client'

/**
 * [id] ist jetzt der share_token (NICHT die quote UUID) — Punkt 2
 * Unterschrift läuft über /api/sign (Server, Service Role) — Punkt 1
 * IP-Logging, DSGVO-Hinweis, AGB-Checkbox — Punkte 5, 6, 7
 * Canvas skalierungsfest — Punkt 17
 */

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { use } from 'react'
import Link from 'next/link'

interface Quote {
  id: string
  status: string
  total_gross: number
  total_net: number
  total_vat: number
  valid_until: string | null
  notes: string | null
  items: Array<{ id: string; position: number; title: string; description: string | null; quantity: number; unit: string; unit_price: number; total_price: number }>
  customer: { name: string; address: string | null } | null
}

interface Company {
  name: string
  address: string
  vat_rate: number
  payment_days: number
  agb_url: string | null
}

function fmt(n: number) {
  return n.toFixed(2).replace('.', ',') + ' €'
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function UnterschreibenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: shareToken } = use(params)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [quoteNumber, setQuoteNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [drawing, setDrawing] = useState(false)
  const [hasSig, setHasSig] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')
  const [agbChecked, setAgbChecked] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      // Lookup per share_token (NICHT per UUID)
      const { data: q } = await supabase
        .from('quotes')
        .select('*, items:quote_items(*), customer:customers(*)')
        .eq('share_token', shareToken)
        .in('status', ['sent', 'accepted'])
        .single()

      if (!q) { setLoading(false); return }

      if (q.valid_until && new Date(q.valid_until) < new Date() && q.status !== 'accepted') {
        setLoading(false)
        setQuote({ ...q, status: 'expired' } as Quote & { status: string })
        return
      }

      setQuote({ ...q, items: (q.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position) })

      const { data: co } = await supabase
        .from('companies')
        .select('name,address,vat_rate,payment_days,agb_url')
        .eq('id', q.company_id)
        .single()
      setCompany(co)

      // Angebotsnummer — aus gespeichertem Feld oder dynamisch berechnet
      if (q.quote_number) {
        setQuoteNumber(q.quote_number)
      } else {
        const { count } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', q.company_id)
          .lte('created_at', q.created_at)
        const year = new Date(q.created_at).getFullYear()
        setQuoteNumber(`${year}-${String(count ?? 1).padStart(4, '0')}`)
      }
      setLoading(false)
    }
    load()
  }, [shareToken])

  // Canvas: skalierungsfeste Koordinaten (Punkt 17)
  function getCanvasCoords(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const { x, y } = getCanvasCoords(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setDrawing(true)
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#2C2C2C'
    const { x, y } = getCanvasCoords(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSig(true)
  }

  function stopDraw() { setDrawing(false) }

  function clearCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
  }

  const canSubmit = hasSig && name.trim().length > 0 && (!company?.agb_url || agbChecked)

  async function handleSubmit() {
    if (!canSubmit || !quote) return
    setSubmitting(true)

    const canvas = canvasRef.current!
    const signatureDataUrl = canvas.toDataURL('image/png')
    const signedBy = name.trim()

    const r = await fetch('/api/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareToken, signedBy, signatureDataUrl }),
    })

    setSubmitting(false)
    if (r.ok) {
      setDone(true)
    } else {
      const err = await r.json()
      alert(err.error ?? 'Fehler beim Speichern — bitte nochmal versuchen.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex items-center justify-center">
        <div className="text-[#2C2C2C]/40 font-semibold">Lädt...</div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col items-center justify-center px-5 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <div className="font-black text-[#2C2C2C] text-xl">Angebot nicht gefunden</div>
        <div className="text-[#2C2C2C]/50 font-semibold mt-2">Der Link ist ungültig oder das Angebot wurde zurückgezogen.</div>
      </div>
    )
  }

  if ((quote as Quote & { status: string }).status === 'expired') {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col items-center justify-center px-5 text-center">
        <div className="text-5xl mb-4">⏰</div>
        <div className="font-black text-[#2C2C2C] text-xl">Angebot abgelaufen</div>
        <div className="text-[#2C2C2C]/50 font-semibold mt-2 max-w-sm">
          Die Gültigkeitsdauer dieses Angebots ist leider abgelaufen.<br />
          Bitte wenden Sie sich direkt an <strong>{company?.name}</strong>.
        </div>
      </div>
    )
  }

  if (done || quote.status === 'accepted') {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col items-center justify-center px-5 text-center gap-4">
        <div className="text-6xl">✅</div>
        <div className="font-black text-[#2C2C2C] text-2xl">Angebot angenommen!</div>
        <div className="text-[#2C2C2C]/60 font-semibold">{company?.name} wurde benachrichtigt.</div>
        <div className="bg-white rounded-2xl px-6 py-4 border border-[#2C2C2C]/5 mt-2">
          <div className="font-black text-3xl text-[#2C2C2C]">{fmt(quote.total_gross)}</div>
          <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1">Angebot {quoteNumber}</div>
        </div>
        <p className="text-xs text-[#2C2C2C]/30 font-semibold max-w-xs">
          Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet (sofern hinterlegt). Bitte heben Sie diese E-Mail auf.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-10">
      {/* Header */}
      <div className="bg-[#2C2C2C] px-5 pt-10 pb-5">
        <div className="text-[#F5C400] font-black text-lg">{company?.name}</div>
        <div className="text-white/60 text-sm font-semibold">Angebot {quoteNumber}</div>
        {quote.valid_until && (
          <div className="text-white/30 text-xs font-semibold mt-1">Gültig bis {fmtDate(quote.valid_until)}</div>
        )}
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4 max-w-xl mx-auto">
        {/* Absender */}
        {company && (
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide mb-2">Von</div>
            <div className="font-black text-[#2C2C2C]">{company.name}</div>
            {company.address && (
              <div className="text-sm text-[#2C2C2C]/60 font-semibold mt-0.5 whitespace-pre-line">{company.address}</div>
            )}
          </div>
        )}

        {/* Positionen */}
        <div className="bg-white rounded-2xl border border-[#2C2C2C]/5">
          <div className="px-4 pt-4 pb-2 font-black text-[#2C2C2C]">Positionen</div>
          {quote.items.map(item => (
            <div key={item.id} className="border-t border-[#2C2C2C]/5 px-4 py-3 flex justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-[#2C2C2C] text-sm">{item.title}</div>
                {item.description && (
                  <div className="text-xs text-[#2C2C2C]/50 font-semibold mt-0.5">{item.description}</div>
                )}
                <div className="text-xs text-[#2C2C2C]/40 font-semibold">{item.quantity} {item.unit} × {fmt(item.unit_price)}</div>
              </div>
              <div className="font-black text-[#2C2C2C] shrink-0 text-sm">{fmt(item.total_price)}</div>
            </div>
          ))}

          {/* Summen */}
          <div className="border-t border-[#2C2C2C]/10 px-4 py-3 bg-[#F7F7F5] rounded-b-2xl">
            {company && company.vat_rate > 0 && (
              <>
                <div className="flex justify-between text-sm text-[#2C2C2C]/60 font-semibold mb-1">
                  <span>Nettobetrag</span><span>{fmt(quote.total_net)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#2C2C2C]/60 font-semibold mb-2">
                  <span>MwSt. {company.vat_rate} %</span><span>{fmt(quote.total_vat)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="font-black text-[#2C2C2C]">Gesamtbetrag</span>
              <span className="font-black text-[#2C2C2C]">{fmt(quote.total_gross)}</span>
            </div>
            {company?.vat_rate === 0 && (
              <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1">
                Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.
              </div>
            )}
            {company?.payment_days && (
              <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1">
                Zahlbar innerhalb von {company.payment_days} Tagen.
              </div>
            )}
          </div>
        </div>

        {/* Notizen */}
        {quote.notes && (
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide mb-2">Anmerkungen</div>
            <div className="text-sm text-[#2C2C2C]/70 font-semibold">{quote.notes}</div>
          </div>
        )}

        {/* Unterschrift */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="font-black text-[#2C2C2C] mb-1">Ihr Name</div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={quote.customer?.name ?? 'Vor- und Nachname'}
            className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400] mb-4"
          />

          <div className="font-black text-[#2C2C2C] mb-2">Unterschrift</div>
          <div className="relative border-2 border-[#2C2C2C]/10 rounded-xl overflow-hidden bg-[#F7F7F5]" style={{ touchAction: 'none' }}>
            <canvas
              ref={canvasRef}
              width={700}
              height={200}
              className="w-full"
              onPointerDown={startDraw}
              onPointerMove={draw}
              onPointerUp={stopDraw}
              onPointerLeave={stopDraw}
            />
            {!hasSig && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[#2C2C2C]/20 font-semibold text-sm">Hier unterschreiben</span>
              </div>
            )}
          </div>
          {hasSig && (
            <button onClick={clearCanvas} className="text-sm font-bold text-[#2C2C2C]/40 mt-2">
              Zurücksetzen
            </button>
          )}
        </div>

        {/* AGB-Checkbox (nur wenn Betrieb eine AGB-URL hinterlegt hat) */}
        {company?.agb_url && (
          <label className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 cursor-pointer">
            <input
              type="checkbox"
              checked={agbChecked}
              onChange={e => setAgbChecked(e.target.checked)}
              className="mt-0.5 w-5 h-5 accent-[#F5C400] shrink-0"
            />
            <span className="text-sm text-[#2C2C2C]/70 font-semibold leading-relaxed">
              Ich habe die{' '}
              <a href={company.agb_url} target="_blank" rel="noopener noreferrer"
                className="text-[#2C2C2C] underline font-bold">
                Allgemeinen Geschäftsbedingungen
              </a>{' '}
              von {company.name} gelesen und stimme ihnen zu.
            </span>
          </label>
        )}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform disabled:opacity-40"
        >
          {submitting ? 'Wird gespeichert...' : 'Angebot annehmen & unterschreiben'}
        </button>

        {/* DSGVO-Hinweis (Punkt 6) */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="text-xs text-[#2C2C2C]/50 font-semibold leading-relaxed">
            <strong className="text-[#2C2C2C]/70">Rechtlicher Hinweis:</strong> Mit Ihrer Unterschrift nehmen Sie dieses Angebot verbindlich an und erteilen {company?.name} einen Auftrag im Sinne des BGB. Diese elektronische Unterschrift gilt als einfache elektronische Signatur gemäß eIDAS-Verordnung.
          </div>
          <div className="text-xs text-[#2C2C2C]/40 font-semibold leading-relaxed mt-2">
            <strong>Datenschutz:</strong> Ihr Name, Ihre Unterschrift sowie technische Daten (Zeitstempel, IP-Adresse) werden zur Dokumentation der Auftragserteilung gespeichert. Verantwortlicher für die Datenverarbeitung ist {company?.name}. Dieses System wird bereitgestellt durch sofortangebot.app.{' '}
            <Link href="/datenschutz" className="underline" target="_blank">Datenschutzerklärung</Link>
          </div>
        </div>

        {/* Powered by */}
        <div className="text-center text-xs text-[#2C2C2C]/20 font-semibold pb-2">
          Versendet über sofortangebot.app im Auftrag von {company?.name}
        </div>
      </div>
    </div>
  )
}
