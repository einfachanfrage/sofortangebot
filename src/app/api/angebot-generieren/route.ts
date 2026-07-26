import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { waehleUntertitel } from '@/lib/positions-untertitel'
import { findePreisposition, type PreisPosition } from '@/lib/preis-matcher'
import { preisKategoriePasstZuGewerk } from '@/lib/default-price-selection'

export const maxDuration = 60

interface BerechnetePositionInput {
  beschreibung: string
  menge: number
  einheit: string
  annahmen: string[]
  berechnungsweg?: string
  flaechen_parameter?: {
    brutto_m2: number
    fenster_anzahl: number
    fenster_einzelflaeche: number
    tuer_anzahl: number
    tuer_einzelflaeche: number
  }
}

function gewerkFuerPosition(beschreibung: string, hauptgewerk?: string): string | undefined {
  const text = beschreibung.toLocaleLowerCase('de-DE')
  const istBoden = /vinyl|laminat|parkett|teppich|kork|linoleum|designboden|bodenbelag|trittschall|altbelag|sockelleisten montier|boden (?:verleg|entfern|schleif)|untergrund schleifen.*kleberreste|kleberreste.*schleifen/i.test(text)
  if (istBoden) return 'boden_parkett'
  const istMaler = /wand|decke|streich|anstrich|tapete|raufaser|spachtel|schleifen|grundier|abdeck|abkleb/i.test(text)
  if (istMaler) return 'maler'
  return hauptgewerk
}

/**
 * Bepreist bereits berechnete Positionen ausschließlich aus der persönlichen
 * Preisdatenbank des Betriebs. Dieser Endpunkt enthält bewusst keinen KI-,
 * Marktpreis- oder Nullpreis-Fallback.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json() as {
    gewerk?: string
    berechnete_positionen?: BerechnetePositionInput[]
  }
  const positionen = body.berechnete_positionen ?? []
  if (positionen.length === 0) {
    return NextResponse.json({
      error: 'Keine berechneten Positionen übergeben. Preise werden nicht automatisch geschätzt.',
      code: 'POSITIONEN_FEHLEN',
    }, { status: 400 })
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!company) return NextResponse.json({ error: 'Betrieb nicht gefunden' }, { status: 404 })

  // Supabase begrenzt Antworten standardmäßig. Deshalb wird der komplette
  // Betriebskatalog stabil sortiert und seitenweise geladen.
  const priceItems: PreisPosition[] = []
  const pageSize = 1000
  for (let von = 0; ; von += pageSize) {
    const { data, error } = await supabase
      .from('price_items')
      .select('id, title, category, unit, unit_price')
      .eq('company_id', company.id)
      .order('category')
      .order('title')
      .range(von, von + pageSize - 1)
    if (error) return NextResponse.json({ error: 'Preisdatenbank konnte nicht geladen werden' }, { status: 500 })
    priceItems.push(...((data ?? []) as PreisPosition[]))
    if ((data?.length ?? 0) < pageSize) break
  }

  const zuordnungen = positionen.map(position => ({
    position,
    treffer: findePreisposition(
      position.beschreibung,
      position.einheit,
      priceItems.filter(preis => preisKategoriePasstZuGewerk(
        preis.category,
        gewerkFuerPosition(position.beschreibung, body.gewerk),
      )),
    ),
  }))
  const fehlende = zuordnungen
    .filter(eintrag => !eintrag.treffer)
    .map(eintrag => ({ beschreibung: eintrag.position.beschreibung, einheit: eintrag.position.einheit }))

  const items = zuordnungen.map(({ position, treffer }) => ({
    title: position.beschreibung,
    description: waehleUntertitel(position.beschreibung) ?? undefined,
    quantity: position.menge,
    unit: position.einheit,
    // Fehlende Datenbankpreise blockieren den Entwurf nicht. Sie bleiben
    // sichtbar mit 0 Euro offen; Markt- oder KI-Preise werden nie eingesetzt.
    unit_price: treffer?.position.unit_price ?? 0,
    kategorie: treffer?.position.category,
    preis_position_id: treffer?.position.id,
    preis_position_titel: treffer?.position.title,
    preis_match_score: treffer?.score,
    berechnungsweg: position.berechnungsweg ?? null,
    annahmen: position.annahmen ?? [],
    ...(position.flaechen_parameter ? { flaechen_parameter: position.flaechen_parameter } : {}),
  }))

  return NextResponse.json({
    items,
    zusammenfassung: fehlende.length > 0
      ? `${items.length} Positionen erstellt; ${fehlende.length} Datenbankpreis${fehlende.length === 1 ? '' : 'e'} noch offen.`
      : `${items.length} Positionen ausschließlich mit betrieblichen Datenbankpreisen kalkuliert.`,
    rückfragen: [],
    notizen: null,
    preisquelle: 'betriebliche_preisdatenbank',
    fehlende_positionen: fehlende,
    hat_fehlende_preise: fehlende.length > 0,
  })
}
