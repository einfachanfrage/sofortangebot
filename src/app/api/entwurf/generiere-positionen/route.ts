import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { KalkulationsAntworten } from '@/lib/mengen/antworten-verarbeiter'
import type { RueckfrageItem } from '@/lib/mengen/rueckfragen-generator'
import type { ExtrahierteDaten } from '@/lib/mengen/types'
import type { BerechnetePosition } from '@/lib/mengen/types'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '@/lib/mengen/aufnahme-hinweise'

export const maxDuration = 90

/**
 * Kombiniert alle Transkripte des Entwurfs und führt die volle Pipeline aus:
 * angebot-extrahieren (Engine + Vollständigkeits-Check) →
 * angebot-generieren (ausschließlich betriebliche Datenbankpreise) →
 * quote_items aktualisieren
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json() as {
    angebot_id: string
    aufnahmen_ids?: string[]
    antworten?: KalkulationsAntworten
    basis_extraktion?: ExtrahierteDaten
    rueckfragen_ueberspringen?: boolean
  }
  const { angebot_id, aufnahmen_ids, antworten = {}, basis_extraktion, rueckfragen_ueberspringen = false } = body
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

  // Aufnahmen laden — per expliziter ID-Liste (vom Frontend) oder Timestamp-Fallback
  let query = supabase
    .from('entwurf_aufnahmen')
    .select('typ, transkript, notiz_text, erkannte_positionen, verarbeitung_status, erstellt_am')
    .eq('angebot_id', angebot_id)
    .order('erstellt_am', { ascending: true })
  if (aufnahmen_ids !== undefined) {
    if (aufnahmen_ids.length === 0) {
      // Alle neuen Aufnahmen noch nicht fertig transkribiert
      return NextResponse.json({ ok: true, positionen_count: 0, rueckfragen: [], keine_neuen: true })
    }
    // Frontend hat explizit die neuen Aufnahmen übergeben — zuverlässiger als Timestamp-Vergleich
    query = query.in('id', aufnahmen_ids)
  } else if (letzteGenerierung) {
    query = query.gt('erstellt_am', letzteGenerierung)
  }
  const { data: aufnahmen } = await query

  if (!aufnahmen?.length) {
    // Keine neuen Aufnahmen seit letzter Generierung — kein Fehler, einfach weiter
    return NextResponse.json({ ok: true, positionen_count: 0, rueckfragen: [], keine_neuen: true })
  }

  // Texte sammeln: Sprach-Transkripte + Notizen + Zettel-Scans (foto mit transkript)
  const texte: string[] = []
  for (const a of aufnahmen) {
    if (a.typ === 'sprache' && a.verarbeitung_status === 'fertig' && a.transkript) {
      texte.push(a.transkript as string)
    } else if (a.typ === 'notiz' && a.notiz_text) {
      texte.push(a.notiz_text as string)
    } else if (a.typ === 'foto' && a.verarbeitung_status === 'fertig' && a.transkript) {
      // Zettel-Scan: Vision hat den handschriftlichen Zettel abgelesen
      texte.push(a.transkript as string)
    }
  }

  if (texte.length === 0) {
    return NextResponse.json({ error: 'Keine Transkripte verfügbar' }, { status: 400 })
  }

  // Transkripte kombinieren (Trenner damit GPT Räume auseinanderhält)
  const erkannteArbeiten: string[] = []
  for (const aufnahme of aufnahmen) {
    const chips = Array.isArray(aufnahme.erkannte_positionen) ? aufnahme.erkannte_positionen : []
    for (const chip of chips) {
      if (!chip || typeof chip !== 'object') continue
      const titel = String((chip as { titel?: unknown }).titel ?? '').trim()
      if (titel && !erkannteArbeiten.includes(titel)) erkannteArbeiten.push(titel)
    }
  }
  const combinedText = texte.join('\n\n---\n\n')

  // Basis-URL für interne API-Calls
  const origin = req.nextUrl.origin
  const cookieHeader = req.headers.get('cookie') ?? ''

  // ── Schritt 1: Extraktion + Engine + Vollständigkeits-Check ──────────────
  const extRes = await fetch(`${origin}/api/angebot-extrahieren`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
    body: JSON.stringify({ text: combinedText, antworten, basis_extraktion }),
  })

  if (!extRes.ok) {
    const err = await extRes.json().catch(() => ({})) as { error?: string }
    // Rate-Limit / Budget-Meldung unverändert durchreichen
    if (extRes.status === 429) {
      return NextResponse.json({ error: err.error ?? 'Zu viele Anfragen' }, { status: 429 })
    }
    return NextResponse.json({ error: `Extraktion fehlgeschlagen: ${err.error ?? extRes.status}` }, { status: 500 })
  }

  const extData = await extRes.json() as {
    mengen?: { positionen?: unknown[]; rueckfragen?: unknown[] }
    hat_rueckfragen?: boolean
    rueckfragen?: RueckfrageItem[]
    extraktion_roh?: unknown
    extraktion?: {
      gewerk?: string
      raeume?: Array<{
        name?: string
        breite?: number | null
        laenge?: number | null
        hoehe?: number | null
        flaeche?: number | null
        wandflaeche_direkt?: number | null
        deckflaeche_direkt?: number | null
        fenster?: Array<{ anzahl?: number }>
        tueren?: Array<{ anzahl?: number }>
      }>
    }
  }
  const positionen = normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(
      (extData.mengen?.positionen ?? []) as BerechnetePosition[],
      erkannteArbeiten,
      combinedText,
    ),
    combinedText,
  )
  const rueckfragen = extData.rueckfragen ?? []

  // Sichtbarkeit: roh (direkt von GPT) + final (nach allen Nachbearbeitungs-
  // Modulen) speichern — unabhängig davon, ob noch Rückfragen offen sind.
  // Nur bei einer Rückfragen-Runde (extraktion_roh === undefined, weil
  // basis_extraktion genutzt wurde) den vorherigen Rohstand nicht überschreiben.
  if (extData.extraktion_roh !== undefined) {
    await supabase.from('quotes').update({
      extraktion_roh: extData.extraktion_roh,
      extraktion_final: extData.extraktion ?? null,
    }).eq('id', angebot_id)
  }

  // Phase 1 endet hier: Noch nichts speichern oder bepreisen, solange wichtige
  // Angaben fehlen. Nach den Antworten wird dieselbe Pipeline neu berechnet.
  if (rueckfragen.length > 0 && !rueckfragen_ueberspringen) {
    return NextResponse.json({
      ok: true,
      requires_input: true,
      positionen_count: 0,
      rueckfragen,
      basis_extraktion: extData.extraktion,
    })
  }

  // Raumdimensionen aus Extraktion in raum_details speichern.
  // WICHTIG: Der Schlüssel muss exakt dem Raumnamen in den Positions-Titeln
  // entsprechen ("… — Wohnzimmer"), sonst findet die Bearbeiten-Ansicht die
  // Maße nicht (Casing-Mismatch: Extraktion "wohnzimmer" vs. Titel "Wohnzimmer").
  const extraktionRaeume = extData.extraktion?.raeume ?? []
  if (extraktionRaeume.length > 0) {
    // Kanonische Raumnamen, wie sie in den Positionen stehen
    const titelRaeume: string[] = []
    for (const p of positionen) {
      const beschr = (p as { beschreibung?: string }).beschreibung ?? ''
      const m = beschr.match(/\s+[-–—]\s+(.+)$/)
      if (m && !titelRaeume.includes(m[1].trim())) titelRaeume.push(m[1].trim())
    }
    const findeTitelName = (rawName: string): string => {
      const low = rawName.toLowerCase()
      return titelRaeume.find(t => t.toLowerCase() === low)
        ?? titelRaeume.find(t => t.toLowerCase().includes(low) || low.includes(t.toLowerCase()))
        ?? (titelRaeume.length === 1 && extraktionRaeume.length === 1 ? titelRaeume[0] : undefined)
        ?? rawName
    }

    // Berechnete Wandfläche je Raum (aus "Wandflächen streichen — Raum") — zum Vorbelegen
    const wandProRaum: Record<string, number> = {}
    for (const p of positionen) {
      const b = (p as { beschreibung?: string }).beschreibung ?? ''
      if (/wandfläch/i.test(b) && (p as { einheit?: string }).einheit === 'm²') {
        const mm = b.match(/\s+[-–—]\s+(.+)$/)
        const rn = mm ? mm[1].trim() : null
        if (rn) wandProRaum[rn] = (p as { menge?: number }).menge ?? 0
      }
    }

    const raumDetails: Record<string, {
      modus?: 'rechteck' | 'flaeche'
      breite?: number; laenge?: number; hoehe?: number; tueren?: number; fenster?: number
      wandflaeche?: number; bodenflaeche?: number
    }> = {}
    for (const raum of extraktionRaeume) {
      const name = raum.name?.trim()
      if (!name) continue
      const key = findeTitelName(name)
      const fensterAnzahl = raum.fenster?.length
        ? raum.fenster.reduce((s, f) => s + (f.anzahl ?? 1), 0)
        : undefined
      const tuerenAnzahl = raum.tueren?.length
        ? raum.tueren.reduce((s, t) => s + (t.anzahl ?? 1), 0)
        : undefined
      // Fläche vs. L×B: hat der Nutzer eine Fläche genannt (Boden/Wand) statt Maße?
      const hatMasse = raum.breite != null && raum.laenge != null
      const bodenflaeche = raum.flaeche ?? raum.deckflaeche_direkt ?? undefined
      // Wandfläche: direkt genannt, sonst (nur bei Flächen-Räumen) die berechnete aus der Position
      const wandflaeche = raum.wandflaeche_direkt ?? (!hatMasse ? wandProRaum[key] : undefined) ?? undefined
      const hatFlaeche = bodenflaeche != null || wandflaeche != null
      raumDetails[key] = {
        // Ohne L×B, aber mit Fläche → Flächen-Reiter direkt aktiv
        ...(!hatMasse && hatFlaeche ? { modus: 'flaeche' as const } : {}),
        ...(raum.breite != null ? { breite: raum.breite } : {}),
        ...(raum.laenge != null ? { laenge: raum.laenge } : {}),
        ...(raum.hoehe != null ? { hoehe: raum.hoehe } : {}),
        ...(wandflaeche != null ? { wandflaeche } : {}),
        ...(bodenflaeche != null ? { bodenflaeche } : {}),
        ...(tuerenAnzahl !== undefined ? { tueren: tuerenAnzahl } : {}),
        ...(fensterAnzahl !== undefined ? { fenster: fensterAnzahl } : {}),
      }
    }
    if (Object.keys(raumDetails).length > 0) {
      const { error: raumDetailsError } = await supabase
        .from('quotes')
        .update({ raum_details: raumDetails })
        .eq('id', angebot_id)
      if (raumDetailsError) {
        console.error('[positionen-generieren] Raumdaten konnten nicht gespeichert werden')
        return NextResponse.json({ error: 'Raummaße konnten nicht gespeichert werden' }, { status: 500 })
      }
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
      gewerk: extData.extraktion?.gewerk,
      berechnete_positionen: positionen,
    }),
  })

  if (!genRes.ok) {
    if (genRes.status === 422) {
      const err = await genRes.json().catch(() => ({})) as {
        error?: string
        code?: string
        fehlende_positionen?: Array<{ beschreibung: string; einheit: string }>
      }
      return NextResponse.json({
        error: err.error ?? 'Preise fehlen in der betrieblichen Preisdatenbank',
        code: err.code ?? 'PREIS_FEHLT',
        fehlende_positionen: err.fehlende_positionen ?? [],
      }, { status: 422 })
    }
    if (genRes.status === 429) {
      const err = await genRes.json().catch(() => ({})) as { error?: string }
      return NextResponse.json({ error: err.error ?? 'Zu viele Anfragen' }, { status: 429 })
    }
    return NextResponse.json({ error: `Preisberechnung fehlgeschlagen: ${genRes.status}` }, { status: 500 })
  }

  const genData = await genRes.json() as {
    items?: Array<{
      title: string
      description?: string
      quantity: number
      unit: string
      unit_price: number
      preis_position_id?: string
      berechnungsweg?: string | null
      annahmen?: string[]
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
      price_item_id: item.preis_position_id ?? null,
      total_price: (item.quantity ?? 1) * (item.unit_price ?? 0),
      berechnungsweg: item.berechnungsweg ?? null,
      annahmen: item.annahmen ?? [],
    }))

    const { error: insertErr } = await supabase.from('quote_items').insert(itemRows)
    if (insertErr) {
      console.error('[positionen-generieren] Datenbankeintrag fehlgeschlagen')
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
