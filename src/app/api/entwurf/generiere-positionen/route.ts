import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 90

/**
 * Kombiniert alle Transkripte des Entwurfs und führt die volle Pipeline aus:
 * angebot-extrahieren (Engine + Vollständigkeits-Check) →
 * angebot-generieren (KI-Preise) →
 * quote_items aktualisieren
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { angebot_id } = await req.json() as { angebot_id: string }
  if (!angebot_id) return NextResponse.json({ error: 'angebot_id fehlt' }, { status: 400 })

  // Nur Aufnahmen dieses Users (Sicherheit: Angebot gehört zur Company des Users)
  const { data: quoteCheck } = await supabase
    .from('quotes')
    .select('id, companies!inner(user_id)')
    .eq('id', angebot_id)
    .single()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const companyData = quoteCheck?.companies as any
  const companyUserId = Array.isArray(companyData) ? companyData[0]?.user_id : companyData?.user_id
  if (!quoteCheck || companyUserId !== user.id) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }

  // Alle fertig transkribierten Aufnahmen laden
  const { data: aufnahmen } = await supabase
    .from('entwurf_aufnahmen')
    .select('typ, transkript, notiz_text, verarbeitung_status, erstellt_am')
    .eq('angebot_id', angebot_id)
    .order('erstellt_am', { ascending: true })

  if (!aufnahmen?.length) {
    return NextResponse.json({ error: 'Keine Aufnahmen gefunden' }, { status: 400 })
  }

  // Texte sammeln: Sprach-Transkripte + Notizen
  const texte: string[] = []
  for (const a of aufnahmen) {
    if (a.typ === 'sprache' && a.verarbeitung_status === 'fertig' && a.transkript) {
      texte.push(a.transkript as string)
    } else if (a.typ === 'notiz' && a.notiz_text) {
      texte.push(a.notiz_text as string)
    }
  }

  if (texte.length === 0) {
    return NextResponse.json({ error: 'Keine Transkripte verfügbar' }, { status: 400 })
  }

  // Transkripte kombinieren (Trenner damit GPT Räume auseinanderhält)
  const combinedText = texte.join('\n\n---\n\n')

  // Basis-URL für interne API-Calls
  const origin = req.nextUrl.origin
  const cookieHeader = req.headers.get('cookie') ?? ''

  // ── Schritt 1: Extraktion + Engine + Vollständigkeits-Check ──────────────
  const extRes = await fetch(`${origin}/api/angebot-extrahieren`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
    body: JSON.stringify({ text: combinedText }),
  })

  if (!extRes.ok) {
    const err = await extRes.json().catch(() => ({})) as { error?: string }
    return NextResponse.json({ error: `Extraktion fehlgeschlagen: ${err.error ?? extRes.status}` }, { status: 500 })
  }

  const extData = await extRes.json() as { mengen?: { positionen?: unknown[] } }
  const positionen = extData.mengen?.positionen ?? []

  if (positionen.length === 0) {
    return NextResponse.json({ error: 'Keine Positionen erkannt' }, { status: 400 })
  }

  // ── Schritt 2: KI-Preise zuweisen ────────────────────────────────────────
  const genRes = await fetch(`${origin}/api/angebot-generieren`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
    body: JSON.stringify({
      text: combinedText,
      berechnete_positionen: positionen,
    }),
  })

  if (!genRes.ok) {
    return NextResponse.json({ error: `Preisberechnung fehlgeschlagen: ${genRes.status}` }, { status: 500 })
  }

  const genData = await genRes.json() as {
    items?: Array<{
      title: string
      description?: string
      quantity: number
      unit: string
      unit_price: number
    }>
    zusammenfassung?: string
    notizen?: string
  }

  const items = genData.items ?? []

  // ── Schritt 3: quote_items ersetzen ──────────────────────────────────────
  await supabase.from('quote_items').delete().eq('quote_id', angebot_id)

  if (items.length > 0) {
    const itemRows = items.map((item, idx) => ({
      quote_id: angebot_id,
      position: idx + 1,
      title: item.title,
      description: item.description ?? null,
      quantity: item.quantity ?? 1,
      unit: item.unit ?? 'Stk',
      unit_price: item.unit_price ?? 0,
      total_price: (item.quantity ?? 1) * (item.unit_price ?? 0),
    }))

    const { error: insertErr } = await supabase.from('quote_items').insert(itemRows)
    if (insertErr) {
      console.error('quote_items insert Fehler:', insertErr)
      return NextResponse.json({ error: 'Positionen konnten nicht gespeichert werden' }, { status: 500 })
    }

    // Totals aktualisieren
    const total_net = itemRows.reduce((s, i) => s + i.total_price, 0)
    await supabase.from('quotes').update({
      total_net,
      notes: genData.notizen ?? null,
      entwurf_gespeichert_am: new Date().toISOString(),
    }).eq('id', angebot_id)
  }

  return NextResponse.json({ ok: true, positionen_count: items.length })
}
