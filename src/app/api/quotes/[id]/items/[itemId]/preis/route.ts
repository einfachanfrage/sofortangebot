import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// DC-039: Rubrik-Regel und Titel-Bereinigung liegen jetzt in einer gemeinsamen
// Datei — vorher stand dieselbe Regel hier und im Browser, was genau die
// doppelten Rubriken erzeugt, die CoS-019 aufgeräumt hat.
import { kategorieFuerTitel, titelFuerPreisdatenbank } from '@/lib/preis-kategorie'
import * as Sentry from '@sentry/nextjs'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { id: quoteId, itemId } = await params
  const body = await req.json().catch(() => ({})) as { unit_price?: number; unit?: string }
  const unitPrice = Number(body.unit_price)
  const unit = String(body.unit ?? '').trim()
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    return NextResponse.json({ error: 'Bitte einen Preis größer als 0 eingeben.' }, { status: 400 })
  }
  if (!unit || unit.length > 30) {
    return NextResponse.json({ error: 'Bitte eine gültige Einheit auswählen.' }, { status: 400 })
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id, vat_rate')
    .eq('user_id', user.id)
    .single()
  if (!company) return NextResponse.json({ error: 'Betrieb nicht gefunden' }, { status: 404 })

  const { data: quote } = await supabase
    .from('quotes')
    .select('id, discount_percent, discount_amount, surcharge_amount')
    .eq('id', quoteId)
    .eq('company_id', company.id)
    .single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  const { data: item } = await supabase
    .from('quote_items')
    .select('id, title, unit, quantity')
    .eq('id', itemId)
    .eq('quote_id', quoteId)
    .single()
  if (!item) return NextResponse.json({ error: 'Position nicht gefunden' }, { status: 404 })

  const datenbankTitel = titelFuerPreisdatenbank(item.title)
  const category = kategorieFuerTitel(datenbankTitel)
  const { data: existingPriceItem } = await supabase
    .from('price_items')
    .select('id, title, unit, unit_price')
    .eq('company_id', company.id)
    .ilike('category', category)
    .ilike('title', datenbankTitel)
    .ilike('unit', unit)
    .maybeSingle()

  const priceResult = existingPriceItem
    ? await supabase
        .from('price_items')
        .update({ unit_price: unitPrice })
        .eq('id', existingPriceItem.id)
        .eq('company_id', company.id)
        .select('id, title, unit, unit_price')
        .single()
    : await supabase
        .from('price_items')
        .insert({
          company_id: company.id,
          category,
          title: datenbankTitel,
          unit,
          unit_price: unitPrice,
        })
        .select('id, title, unit, unit_price')
        .single()
  const { data: priceItem, error: priceError } = priceResult

  if (priceError || !priceItem) {
    return NextResponse.json({ error: 'Preis konnte nicht in der Preisdatenbank angelegt werden.' }, { status: 500 })
  }

  const totalPrice = Number(item.quantity) * unitPrice
  const { error: itemError } = await supabase
    .from('quote_items')
    .update({ unit, unit_price: unitPrice, total_price: totalPrice, price_item_id: priceItem.id })
    .eq('id', item.id)
    .eq('quote_id', quoteId)

  if (itemError) {
    if (!existingPriceItem) {
      await supabase.from('price_items').delete().eq('id', priceItem.id).eq('company_id', company.id)
    }
    return NextResponse.json({ error: 'Preis konnte nicht in das Angebot übernommen werden.' }, { status: 500 })
  }

  const { data: items } = await supabase
    .from('quote_items')
    .select('total_price')
    .eq('quote_id', quoteId)
  const totalNet = (items ?? []).reduce((sum, current) => sum + Number(current.total_price ?? 0), 0)
  const discountPercent = Number(quote.discount_percent ?? 0)
  const discountAmount = discountPercent > 0
    ? totalNet * discountPercent / 100
    : Number(quote.discount_amount ?? 0)
  const netAfterExtras = totalNet - discountAmount + Number(quote.surcharge_amount ?? 0)
  const totalVat = netAfterExtras * Number(company.vat_rate ?? 19) / 100
  // Audit 2026-08-31: Ohne Fehlerprüfung hätte die Position ihren neuen Preis
  // bekommen, die Angebotssumme aber nicht — Positionsliste und Endbetrag
  // wären auseinandergelaufen, ohne dass es jemand merkt.
  const { error: summeError } = await supabase.from('quotes').update({
    total_net: totalNet,
    total_vat: totalVat,
    total_gross: netAfterExtras + totalVat,
  }).eq('id', quoteId).eq('company_id', company.id)
  if (summeError) {
    console.error('[items/preis] Angebotssumme konnte nicht aktualisiert werden')
    Sentry.captureException(new Error(summeError.message), { tags: { feature: 'position_preis_summe' } })
    return NextResponse.json({ error: 'Der Preis wurde gespeichert, die Angebotssumme aber nicht. Bitte Seite neu laden.' }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    price_item_id: priceItem.id,
    unit_price: unitPrice,
    total_price: totalPrice,
    unit,
  })
}
