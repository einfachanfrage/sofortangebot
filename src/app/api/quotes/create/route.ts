import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createClient } from '@/lib/supabase/server'
import { checkUserRateLimit, rateLimitResponse } from '@/lib/rate-limiter'
import { getOrCreateErstbaustelle } from '@/lib/baustellen'

const PLAN_LIMITS = {
  starter: 5,   // 5 Angebote/Monat
  pro: Infinity,
  enterprise: Infinity,
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json()
  const { items, notes, customerName, customerEmail, customerPhone, customerAddress, externalContactId, validUntil, briefpapier_id } = body
  const extId = externalContactId as { source: string; id: string } | null

  // Company + Plan laden
  const { data: company } = await supabase
    .from('companies')
    .select('id, vat_rate, plan')
    .eq('user_id', user.id)
    .single()

  if (!company) return NextResponse.json({ error: 'Kein Betrieb gefunden' }, { status: 400 })

  const plan = (company.plan ?? 'starter') as keyof typeof PLAN_LIMITS

  const rlCheck = await checkUserRateLimit(user.id, 'angebot_erstellen', plan)
  if (!rlCheck.allowed) return rateLimitResponse(rlCheck)
  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.starter

  // Quotes diesen Monat zählen (nur für Starter relevant)
  if (limit !== Infinity) {
    const firstOfMonth = new Date()
    firstOfMonth.setDate(1)
    firstOfMonth.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('quotes')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', company.id)
      .gte('created_at', firstOfMonth.toISOString())

    if ((count ?? 0) >= limit) {
      return NextResponse.json({
        error: 'limit_reached',
        message: `Im Starter-Plan sind ${limit} Angebote pro Monat enthalten. Upgrade auf Pro für unbegrenzte Angebote.`,
        limit,
        count,
      }, { status: 403 })
    }
  }

  // Kunde anlegen/finden
  let customerId: string | null = null
  if (customerName?.trim()) {
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('company_id', company.id)
      .ilike('name', customerName.trim())
      .maybeSingle()

    if (existing) {
      await supabase.from('customers').update({
        ...(customerPhone?.trim() && { phone: customerPhone.trim() }),
        ...(customerEmail?.trim() && { email: customerEmail.trim() }),
        ...(customerAddress?.trim() && { address: customerAddress.trim() }),
        ...(extId?.source === 'lexoffice' && { lexoffice_contact_id: extId.id }),
        ...(extId?.source === 'sevdesk' && { sevdesk_contact_id: extId.id }),
        ...(extId?.source === 'fastbill' && { fastbill_customer_id: extId.id }),
        ...(extId?.source === 'billomat' && { billomat_client_id: extId.id }),
        ...(extId?.source === 'papierkram' && { papierkram_contact_id: extId.id }),
        ...(extId?.source === 'easybill' && { easybill_customer_id: extId.id }),
      }).eq('id', existing.id)
      customerId = existing.id
    } else {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          company_id: company.id,
          name: customerName.trim(),
          email: customerEmail?.trim() || null,
          phone: customerPhone?.trim() || null,
          address: customerAddress?.trim() || null,
          lexoffice_contact_id: extId?.source === 'lexoffice' ? extId.id : null,
          sevdesk_contact_id: extId?.source === 'sevdesk' ? extId.id : null,
          fastbill_customer_id: extId?.source === 'fastbill' ? extId.id : null,
          billomat_client_id: extId?.source === 'billomat' ? extId.id : null,
          papierkram_contact_id: extId?.source === 'papierkram' ? extId.id : null,
          easybill_customer_id: extId?.source === 'easybill' ? extId.id : null,
        })
        .select('id')
        .single()
      customerId = newCustomer?.id ?? null
    }
  }

  // CoS-012/DC-029: sobald ein Kunde am Angebot hängt, automatisch dessen
  // Erstbaustelle mitsetzen (Designer-Regel, DC-029 Antwort 1) — ohne
  // Kunde bleibt baustelleId null, genau wie customerId auch.
  const baustelleId = customerId
    ? await getOrCreateErstbaustelle(supabase, company.id, customerId)
    : null

  // Gesamtpreise berechnen
  const totalNet = (items as Array<{ quantity: number; unit_price: number }>)
    .reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const totalVat = company.vat_rate > 0 ? totalNet * (company.vat_rate / 100) : 0

  const validUntilDate = validUntil ?? (() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]
  })()

  // Angebot erstellen
  // Standard-Briefpapier holen wenn keins angegeben
  let resolvedBriefpapierId: string | null = briefpapier_id ?? null
  if (!resolvedBriefpapierId) {
    const { data: std } = await supabase
      .from('briefpapiere')
      .select('id')
      .eq('betrieb_id', company.id)
      .eq('ist_standard', true)
      .maybeSingle()
    resolvedBriefpapierId = std?.id ?? null
  }

  const baseInsert = {
    company_id: company.id,
    customer_id: customerId,
    status: 'draft',
    total_net: totalNet,
    total_vat: totalVat,
    total_gross: totalNet + totalVat,
    notes: notes || null,
    valid_until: validUntilDate,
    // DC-011: `quotes.gewerk` gibt es nicht als Spalte (siehe quotes.ts) —
    // dieser Insert wäre fehlgeschlagen, sobald `gewerk` mitgeschickt wird.
    // Aktuell ruft niemand diese Route mit `gewerk` auf, aber die Spalte
    // trotzdem anzufragen war eine tickende Zeitbombe. Entfernt statt nur
    // abgesichert, weil sie nirgends gebraucht wird.
    ...(resolvedBriefpapierId ? { briefpapier_id: resolvedBriefpapierId } : {}),
    ...(baustelleId ? { baustelle_id: baustelleId } : {}),
  }

  // Versuche zuerst mit share_token, Fallback ohne falls Spalte fehlt
  let quote: { id: string; share_token?: string; created_at: string } | null = null
  let quoteError: { message: string } | null = null

  const full = await supabase.from('quotes').insert(baseInsert).select('id, share_token, created_at').single()
  if (full.error?.message?.includes('share_token') || full.error?.message?.includes('briefpapier_id') || full.error?.message?.includes('baustelle_id')) {
    // Spalte fehlt noch — ohne optionale Felder nochmal versuchen
    const minimal = await supabase.from('quotes').insert({
      company_id: company.id, customer_id: customerId, status: 'draft',
      total_net: totalNet, total_vat: totalVat, total_gross: totalNet + totalVat,
      notes: notes || null, valid_until: validUntilDate,
    }).select('id, created_at').single()
    quote = minimal.data
    quoteError = minimal.error
  } else {
    quote = full.data
    quoteError = full.error
  }

  if (quoteError || !quote) {
    console.error('[quote-create] Datenbankeintrag fehlgeschlagen')
    return NextResponse.json({
      error: 'Angebot konnte nicht gespeichert werden',
      detail: quoteError?.message,
    }, { status: 500 })
  }

  // GoBD-konforme atomare Nummernvergabe via RPC
  // Nummernkreis anlegen falls noch nicht vorhanden
  //
  // DC-033 (2026-08-25): Beide Aufrufe haben ihren `error` bisher nicht
  // ausgelesen. Schlug die Vergabe fehl, blieb `angebotsnummer` still `null`
  // und die Anzeige fiel auf ein Fragment der internen ID zurück
  // („2026-5EC9") — für den Nutzer sah das aus wie eine zufällige Nummer,
  // für uns nach gar nichts. Jetzt wird jeder Fehlschlag protokolliert.
  const { error: initFehler } = await supabase.rpc('init_nummernkreise', { p_betrieb_id: company.id })
  if (initFehler) {
    console.error('[quote-create] Nummernkreis konnte nicht angelegt werden')
    Sentry.captureException(new Error(initFehler.message), { tags: { feature: 'angebotsnummer_init' } })
  }
  const { data: angebotsnummer, error: nummerFehler } = await supabase.rpc('vergib_naechste_nummer', {
    p_betrieb_id: company.id,
    p_typ: 'angebot',
    p_angebot_id: quote.id,
  })
  if (nummerFehler) {
    console.error('[quote-create] Angebotsnummer konnte nicht vergeben werden')
    Sentry.captureException(new Error(nummerFehler.message), { tags: { feature: 'angebotsnummer_vergabe' } })
  }

  // Normverweise aus Preiskatalog nachschlagen (best-effort per Titel)
  const { data: priceItems } = await supabase
    .from('price_items')
    .select('title, vob_norm, din_normen')
    .eq('company_id', company.id)
  const normByTitle = new Map(
    (priceItems ?? []).map(p => [p.title.toLowerCase().trim(), { vob_norm: p.vob_norm, din_normen: p.din_normen }])
  )

  // Positionen einfügen — Fallback ohne vob_norm/din_normen falls Migration noch nicht ausgeführt
  // 2026-09-02 (VOB-004): berechnungsweg/annahmen/price_item_id werden
  // durchgereicht, wenn der Aufrufer sie mitschickt (Duplizieren). Ohne das
  // verlor eine Kopie den Rechenweg und den Übermessungshinweis fürs PDF.
  const itemRows = (items as Array<{
    title: string; description?: string; quantity: number; unit: string; unit_price: number
    berechnungsweg?: string | null; annahmen?: string[] | null
    price_item_id?: string | null; automatisch_ergaenzt?: boolean | null
  }>)
    .map((item, idx) => {
      const norm = normByTitle.get(item.title.toLowerCase().trim())
      return {
        quote_id: quote!.id,
        position: idx + 1,
        title: item.title,
        description: item.description || null,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        vob_norm: norm?.vob_norm ?? null,
        din_normen: norm?.din_normen ?? null,
        berechnungsweg: item.berechnungsweg ?? null,
        annahmen: item.annahmen ?? [],
        price_item_id: item.price_item_id ?? null,
        automatisch_ergaenzt: item.automatisch_ergaenzt ?? false,
      }
    })

  const { error: itemsError } = await supabase.from('quote_items').insert(itemRows)
  if (itemsError) {
    // Fallback: ohne optionale Normspalten (Migration noch nicht ausgeführt)
    // Audit 2026-08-31: Dieser zweite Versuch lief bisher ohne Fehlerprüfung.
    // Scheiterte er auch, entstand ein Angebot GANZ OHNE Positionen — und
    // niemand erfuhr davon. Dieselbe Fehlerklasse wie PM-016.
    const { error: fallbackError } = await supabase.from('quote_items').insert(
      itemRows.map(item => ({
        quote_id: item.quote_id,
        position: item.position,
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }))
    )
    if (fallbackError) {
      console.error('[quotes/create] Positionen konnten nicht gespeichert werden')
      Sentry.captureException(new Error(fallbackError.message), { tags: { feature: 'quote_items_insert' } })
      // Ein Angebot ohne Positionen ist kein Angebot. Lieber ein sichtbarer
      // Fehler als eine leere Hülle, die erst beim Verschicken auffällt.
      return NextResponse.json(
        { error: 'Die Positionen konnten nicht gespeichert werden. Bitte versuche es noch einmal.' },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ id: quote.id, share_token: quote.share_token, angebotsnummer })
}
