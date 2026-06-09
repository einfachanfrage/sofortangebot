'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import { use } from 'react'

interface Quote {
  id: string
  status: string
  total_gross: number
  total_net: number
  total_vat: number
  valid_until: string | null
  notes: string | null
  items: Array<{ id: string; position: number; title: string; quantity: number; unit: string; unit_price: number; total_price: number }>
  customer: { name: string; address: string | null } | null
}

interface Company {
  name: string
  address: string
  vat_rate: number
  payment_days: number
}

function fmt(n: number) {
  return n.toFixed(2).replace('.', ',') + ' €'
}

export default function UnterschreibenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [quoteNumber, setQuoteNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [drawing, setDrawing] = useState(false)
  const [hasSig, setHasSig] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: q } = await supabase
        .from('quotes')
        .select('*, items:quote_items(*), customer:customers(*)')
        .eq('id', id)
        .in('status', ['sent', 'accepted'])
        .single()
      if (!q) { setLoading(false); return }
      setQuote({ ...q, items: (q.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position) })

      const { data: co } = await supabase.from('companies').select('name,address,vat_rate,payment_days').eq('id', q.company_id).single()
      setCompany(co)

      const { count } = await supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('company_id', q.company_id).lte('created_at', q.created_at)
      const year = new Date(q.created_at).getFullYear()
      setQuoteNumber(`${year}-${String(count ?? 1).padStart(4, '0')}`)
      setLoading(false)
    }
    load()
  }, [id])

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setDrawing(true)
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#2C2C2C'
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
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

  async function handleSubmit() {
    if (!hasSig || !quote) return
    setSubmitting(true)
    const canvas = canvasRef.current!

    const sigBlob: Blob = await new Promise(resolve => canvas.toBlob(b => resolve(b!), 'image/png'))
    const filePath = `signatures/${quote.id}.png`

    let signatureUrl: string | null = null
    const { error: uploadError } = await supabase.storage
      .from('quote-signatures')
      .upload(filePath, sigBlob, { upsert: true, contentType: 'image/png' })

    if (!uploadError) {
      const { data } = supabase.storage.from('quote-signatures').getPublicUrl(filePath)
      signatureUrl = data.publicUrl
    }

    await supabase.from('quotes').update({
      status: 'accepted',
      signed_at: new Date().toISOString(),
      signed_by: name.trim() || quote.customer?.name || 'Kunde',
      ...(signatureUrl && { signature_url: signatureUrl }),
    }).eq('id', quote.id)

    setDone(true)
    setSubmitting(false)
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

  if (done || quote.status === 'accepted') {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col items-center justify-center px-5 text-center">
        <div className="text-6xl mb-4">✅</div>
        <div className="font-black text-[#2C2C2C] text-2xl mb-2">Angebot angenommen!</div>
        <div className="text-[#2C2C2C]/60 font-semibold">{company?.name} wurde benachrichtigt.</div>
        <div className="mt-4 bg-white rounded-2xl px-6 py-4 border border-[#2C2C2C]/5">
          <div className="font-black text-3xl text-[#2C2C2C]">{fmt(quote.total_gross)}</div>
          <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1">Angebot {quoteNumber}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-10">
      {/* Header */}
      <div className="bg-[#2C2C2C] px-5 pt-10 pb-5">
        <div className="text-[#F5C400] font-black text-lg">{company?.name}</div>
        <div className="text-white/60 text-sm font-semibold">Angebot {quoteNumber}</div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Positionen */}
        <div className="bg-white rounded-2xl border border-[#2C2C2C]/5">
          <div className="px-4 pt-4 pb-2 font-black text-[#2C2C2C]">Positionen</div>
          {quote.items.map(item => (
            <div key={item.id} className="border-t border-[#2C2C2C]/5 px-4 py-3 flex justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-[#2C2C2C] text-sm">{item.title}</div>
                <div className="text-xs text-[#2C2C2C]/40 font-semibold">{item.quantity} {item.unit} × {fmt(item.unit_price)}</div>
              </div>
              <div className="font-black text-[#2C2C2C] shrink-0 text-sm">{fmt(item.total_price)}</div>
            </div>
          ))}
          <div className="border-t-2 border-[#2C2C2C] px-4 py-3 flex justify-between">
            <span className="font-black text-[#2C2C2C]">Gesamt</span>
            <span className="font-black text-[#2C2C2C]">{fmt(quote.total_gross)}</span>
          </div>
        </div>

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
              width={350}
              height={140}
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

        <button
          onClick={handleSubmit}
          disabled={!hasSig || submitting}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform disabled:opacity-40"
        >
          {submitting ? 'Wird gespeichert...' : 'Angebot annehmen & unterschreiben'}
        </button>

        <p className="text-center text-xs text-[#2C2C2C]/30 font-semibold">
          Mit deiner Unterschrift nimmst du das Angebot verbindlich an.
        </p>
      </div>
    </div>
  )
}
