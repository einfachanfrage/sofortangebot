import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { pruefeNeuenPreis } from '@/lib/preis-kategorie'

/**
 * DC-039: Legt einen komplett neuen Eintrag in der Preisdatenbank an — ohne
 * Bezug zu einer bereits gespeicherten Angebotsposition.
 *
 * Warum ein eigener Endpunkt: `/api/quotes/[id]/items/[itemId]/preis` setzt
 * eine Position voraus, die schon in der Datenbank steht. Beim "+ Position"-
 * Ablauf existiert die Zeile in diesem Moment aber nur im Browser. Und warum
 * überhaupt über den Server, obwohl der Browser dank RLS selbst schreiben
 * dürfte: hier wird in die echte Preisdatenbank geschrieben, die jedes
 * künftige Angebot benutzt. Prüfung, Rubrik und Dubletten-Schutz gehören an
 * EINE Stelle, nicht in jede Oberfläche, die zufällig ein Eingabefeld hat.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as { titel?: unknown; einheit?: unknown; preis?: unknown }
  const geprueft = pruefeNeuenPreis(body)
  if (!geprueft.ok) return NextResponse.json({ error: geprueft.fehler }, { status: 400 })
  const { titel, einheit, preis, kategorie } = geprueft.wert

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!company) return NextResponse.json({ error: 'Betrieb nicht gefunden' }, { status: 404 })

  // Dubletten-Schutz: gleicher Titel + gleiche Einheit im selben Betrieb.
  // Bewusst OHNE .single()/.maybeSingle() — in der Preisdatenbank gibt es
  // keine Eindeutigkeits-Regel, ein historisches Dublett würde einen
  // .maybeSingle()-Aufruf zum Fehler machen und dem Handwerker das Anlegen
  // grundlos verweigern. Der erste Treffer gewinnt.
  const { data: bestehende } = await supabase
    .from('price_items')
    .select('id, title, unit, unit_price, category')
    .eq('company_id', company.id)
    .ilike('title', titel)
    .ilike('unit', einheit)
    .order('created_at', { ascending: true })
    .limit(1)

  const bestehend = bestehende?.[0]
  if (bestehend) {
    return NextResponse.json({
      ok: true,
      bestehend: true,
      price_item: {
        id: bestehend.id,
        title: bestehend.title,
        unit: bestehend.unit,
        unit_price: Number(bestehend.unit_price),
        category: bestehend.category,
      },
    })
  }

  const { data: neu, error } = await supabase
    .from('price_items')
    .insert({ company_id: company.id, category: kategorie, title: titel, unit: einheit, unit_price: preis })
    .select('id, title, unit, unit_price, category')
    .single()

  if (error || !neu) {
    return NextResponse.json({ error: 'Preis konnte nicht in der Preisdatenbank angelegt werden.' }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    bestehend: false,
    price_item: {
      id: neu.id,
      title: neu.title,
      unit: neu.unit,
      unit_price: Number(neu.unit_price),
      category: neu.category,
    },
  })
}
