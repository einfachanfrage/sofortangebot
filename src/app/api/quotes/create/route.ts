import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkUserRateLimit, rateLimitResponse } from '@/lib/rate-limiter'

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

  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert({
      company_id: company.id,
      customer_id: customerId,
      status: 'draft',
      total_net: totalNet,
      total_vat: totalVat,
      total_gross: totalNet + totalVat,
      notes: notes || null,
      valid_until: validUntilDate,
      briefpapier_id: resolvedBriefpapierId,
    })
    .select('id, share_token, created_at')
    .single()

  if (quoteError || !quote) {
    return NextResponse.json({ error: 'Angebot konnte nicht gespeichert werden' }, { status: 500 })
  }

  // GoBD-konforme atomare Nummernvergabe via RPC
  // Nummernkreis anlegen falls noch nicht vorhanden
  await supabase.rpc('init_nummernkreise', { p_betrieb_id: company.id })
  const { data: angebotsnummer } = await supabase.rpc('vergib_naechste_nummer', {
    p_betrieb_id: company.id,
    p_typ: 'angebot',
    p_angebot_id: quote.id,
  })

  // Normverweise aus Preiskatalog nachschlagen (best-effort per Titel)
  const { data: priceItems } = await supabase
    .from('price_items')
    .select('title, vob_norm, din_normen')
    .eq('company_id', company.id)
  const normByTitle = new Map(
    (priceItems ?? []).map(p => [p.title.toLowerCase().trim(), { vob_norm: p.vob_norm, din_normen: p.din_normen }])
  )

  // Positionen einfügen
  await supabase.from('quote_items').insert(
    (items as Array<{ title: string; description?: string; quantity: number; unit: string; unit_price: number }>)
      .map((item, idx) => {
        const norm = normByTitle.get(item.title.toLowerCase().trim())
        return {
          quote_id: quote.id,
          position: idx + 1,
          title: item.title,
          description: item.description || null,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          vob_norm: norm?.vob_norm ?? null,
          din_normen: norm?.din_normen ?? null,
        }
      })
  )

  return NextResponse.json({ id: quote.id, share_token: quote.share_token, angebotsnummer })
}
