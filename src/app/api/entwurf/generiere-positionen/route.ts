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
    .select('id, entwurf_gespeichert_am, companies!inner(user_id)')
    .eq('id', angebot_id)
    .single()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const companyData = quoteCheck?.companies as any
  const companyUserId = Array.isArray(companyData) ? companyData[0]?.user_id : companyData?.user_id
  if (!quoteCheck || companyUserId !== user.id) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }

  // Letzter Generierungs-Zeitstempel — nur neue Aufnahmen danach verarbeiten
  const letzteGenerierung = (quoteCheck as { entwurf_gespeichert_am?: string | null }).entwurf_gespeichert_am

  // Aufnahmen laden — bei Erstgenerierung alle, sonst nur neue
  let query = supabase
    .from('entwurf_aufnahmen')
    .select('typ, transkript, notiz_text, verarbeitung_status, erstellt_am')
    .eq('angebot_id', angebot_id)
    .order('erstellt_am', { ascending: true })
  if (letzteGenerierung) {
    query = query.gt('erstellt_am', letzteGenerierung)
  }
  const { data: aufnahmen } = await query

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

  const extData = await extRes.json() as {
    mengen?: { positionen?: unknown[]; rueckfragen?: unknown[] }
    hat_rueckfragen?: boolean
    extraktion?: {
      raeume?: Array<{
        name?: string
        breite?: number | null
        laenge?: number | null
        hoehe?: number | null
        fenster?: Array<{ anzahl?: number }>
        tueren?: Array<{ anzahl?: number }>
      }>
    }
  }
  const positionen = extData.mengen?.positionen ?? []
  const rueckfragen = extData.mengen?.rueckfragen ?? []

  // Raumdimensionen aus Extraktion in raum_details speichern
  const extraktionRaeume = extData.extraktion?.raeume ?? []
  if (extraktionRaeume.length > 0) {
    const raumDetails: Record<string, { breite?: number; laenge?: number; hoehe?: number; tueren?: number; fenster?: number }> = {}
    for (const raum of extraktionRaeume) {
      const name = raum.name?.trim()
      if (!name) continue
      const fensterAnzahl = raum.fenster?.reduce((s, f) => s + (f.anzahl ?? 1), 0) || undefined
      const tuerenAnzahl = raum.tueren?.reduce((s, t) => s + (t.anzahl ?? 1), 0) || undefined
      raumDetails[name] = {
        ...(raum.breite != null ? { breite: raum.breite } : {}),
        ...(raum.laenge != null ? { laenge: raum.laenge } : {}),
        ...(raum.hoehe != null ? { hoehe: raum.hoehe } : {}),
        ...(tuerenAnzahl ? { tueren: tuerenAnzahl } : {}),
        ...(fensterAnzahl ? { fenster: fensterAnzahl } : {}),
      }
    }
    if (Object.keys(raumDetails).length > 0) {
      await supabase.from('quotes').update({ raum_details: raumDetails }).eq('id', angebot_id)
    }
  }

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

  // ── Schritt 3: quote_items ergänzen ──────────────────────────────────────
  // Bestehende Positionen: höchste Nummer + vorhandene Titel (für Dedup)
  const { data: bestehendeItems } = await supabase
    .from('quote_items')
    .select('position, title')
    .eq('quote_id', angebot_id)
    .order('position', { ascending: false })
  const startPosition = (bestehendeItems?.[0]?.position ?? 0) + 1
  const bestehendeTitle = new Set((bestehendeItems ?? []).map(i => (i.title as string).toLowerCase().trim()))

  // Nur allgemeine Positionen OHNE Raum-Suffix dürfen nur einmal vorkommen
  const EINMALIG_MUSTER = ['kleinmaterial', 'verbrauchsmaterial', 'an- und abfahrt', 'anfahrt', 'abfahrt', 'schutzfolie', 'schutzmaßnahmen']
  const gefilterteItems = items.filter(item => {
    const titelLower = (item.title as string).toLowerCase().trim()
    const hatRaumSuffix = titelLower.includes(' — ')
    // Positionen mit Raum-Suffix immer erlauben (Wandflächen — Flur + Wandflächen — Küche)
    if (hatRaumSuffix) return true
    // Allgemeine Positionen: nur einmal pro Quote
    const istEinmalig = EINMALIG_MUSTER.some(m => titelLower.includes(m))
    if (istEinmalig) {
      const schonDa = [...bestehendeTitle].some(t => EINMALIG_MUSTER.some(m => t.includes(m) && titelLower.includes(m)))
      if (schonDa) return false
    }
    return true
  })

  if (gefilterteItems.length > 0) {
    const itemRows = gefilterteItems.map((item, idx) => ({
      quote_id: angebot_id,
      position: startPosition + idx,
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
  }

  // Totals neu berechnen (alle Positionen, nicht nur neue)
  const { data: alleItems } = await supabase
    .from('quote_items')
    .select('total_price')
    .eq('quote_id', angebot_id)
  const total_net = (alleItems ?? []).reduce((s, i) => s + (i.total_price ?? 0), 0)

  // MwSt aus Company-Profil laden
  const { data: companyData2 } = await supabase
    .from('companies')
    .select('vat_rate')
    .eq('user_id', user.id)
    .single()
  const vatRate = (companyData2 as { vat_rate?: number } | null)?.vat_rate ?? 19
  const total_gross = total_net * (1 + vatRate / 100)

  await supabase.from('quotes').update({
    total_net,
    total_gross,
    notes: genData.notizen ?? null,
    entwurf_gespeichert_am: new Date().toISOString(),
  }).eq('id', angebot_id)

  return NextResponse.json({ ok: true, positionen_count: gefilterteItems.length, rueckfragen })
}
