import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createClient } from '@/lib/supabase/server'

// DC-033 (2026-08-25, Sandy: „ich erkenne keine logik?!" bei „2026-5EC9"):
// Angebotsnummern sahen zufällig aus, weil sie gar keine Nummern waren —
// die Anzeige fiel still auf die letzten vier Zeichen der internen ID zurück,
// sobald `quotes.angebotsnummer` leer war.
//
// Der Product Designer hat das komplette System durchgesehen und den
// verschluckten RPC-Fehler in `api/quotes/create` gefunden. Beim Nachprüfen
// kam eine zweite, tiefere Ursache dazu: **der heutige Weg, auf dem Angebote
// entstehen, hat noch nie eine Nummer angefordert.** Angebote werden über den
// Aufnahme-Flow (`api/entwurf/neu`) angelegt; die Nummernvergabe stand nur in
// der älteren Route `api/quotes/create`. Nicht ein fehlgeschlagener Aufruf,
// sondern ein fehlender.
//
// Warum die Nummer HIER vergeben wird und nicht beim Anlegen: Ein Entwurf
// entsteht bei jeder Aufnahme, auch bei Fehlversuchen — 101 der 106 Angebote
// in der Datenbank sind Entwürfe. Würde jeder davon eine Nummer ziehen, wäre
// der Nummernkreis nach einer Woche Testen bei 100+ und voller Lücken, die
// man bei einer Prüfung erklären müsste. Eine Nummer bekommt deshalb nur, was
// der Handwerker wirklich fertigstellt.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!company) return NextResponse.json({ error: 'Betrieb nicht gefunden' }, { status: 404 })

  const { data: quote } = await supabase
    .from('quotes')
    .select('id, angebotsnummer')
    .eq('id', id)
    .eq('company_id', company.id)
    .single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  // Schon nummeriert → nichts tun. Eine einmal vergebene Nummer darf sich nie
  // ändern (GoBD), und der Aufruf muss gefahrlos mehrfach passieren dürfen.
  if (quote.angebotsnummer) {
    return NextResponse.json({ angebotsnummer: quote.angebotsnummer, neu: false })
  }

  // Nummernkreis anlegen, falls der Betrieb noch keinen hat. Fehler hier sind
  // nicht mehr stillschweigend: genau dieses Verschlucken hat dafür gesorgt,
  // dass seit Juni niemand gemerkt hat, dass nichts nummeriert wird.
  const { error: initFehler } = await supabase.rpc('init_nummernkreise', { p_betrieb_id: company.id })
  if (initFehler) {
    console.error('[angebotsnummer] Nummernkreis konnte nicht angelegt werden')
    Sentry.captureException(new Error(initFehler.message), { tags: { feature: 'angebotsnummer_init' } })
  }

  const { data: angebotsnummer, error: vergabeFehler } = await supabase.rpc('vergib_naechste_nummer', {
    p_betrieb_id: company.id,
    p_typ: 'angebot',
    p_angebot_id: quote.id,
  })

  if (vergabeFehler || !angebotsnummer) {
    console.error('[angebotsnummer] Vergabe fehlgeschlagen')
    Sentry.captureException(new Error(vergabeFehler?.message ?? 'RPC ohne Ergebnis'), {
      tags: { feature: 'angebotsnummer_vergabe' },
    })
    return NextResponse.json({ error: 'Angebotsnummer konnte nicht vergeben werden' }, { status: 500 })
  }

  return NextResponse.json({ angebotsnummer, neu: true })
}
