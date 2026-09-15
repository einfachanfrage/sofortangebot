// Standardzeilen — was gilt, wenn der Handwerker sich nicht festlegt.
//
// ── Warum es diese Datei gibt (Manfred, 12.09.2026) ───────────────────────
//
// *„Was soll ‚Wärmedämmung verlegen' ohne Zusatz überhaupt treffen? Bisher
// war die Antwort stillschweigend ‚die oberste Zeile', also die billigste.
// Das war der Fehler."*
//
// Gemessen war es noch schlechter als „die oberste Zeile": Ohne Standard
// gewann der KÜRZESTE Titel. `Tür lackieren` traf `Außentür lackieren
// beidseitig` für 110,00 € statt 45,00 € — weil „außentür" das Wort „tür"
// enthält. `Wärmedämmung verlegen` traf die Mineralwolle für 22,00 €, die
// teuerste der drei.
//
// Diese Datei prüft die drei Zustände, die es geben darf:
//   1. festgelegt  → die Sperren entscheiden, der Standard hält sich raus
//   2. unbestimmt  → die Standardzeile gilt, sichtbar als Annahme
//   3. unbestimmt ohne Standardzeile → weiter kein Preis (PM-018)
import { describe, expect, it } from 'vitest'
import { findePreisposition } from '../preis-matcher'
import { standardFamilie, STANDARD_FAMILIEN } from '../katalog-standard'
import { DEFAULT_PRICES } from '../default-prices'

type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }
const KATALOG: Zeile[] = DEFAULT_PRICES.map((p, i) => ({ id: `p${i}`, ...p }))
const gewerk = (praefix: string) => KATALOG.filter(p => p.category.startsWith(praefix))
const treffer = (gew: string, einheit: string, titel: string) =>
  findePreisposition(titel, einheit, gewerk(gew))

describe('Jede Standardzeile gibt es auch wirklich', () => {
  // Eine Standardzeile, die im Katalog anders heißt, ist eine Zeile, die nie
  // greift — und zwar still. Genau die Fehlerklasse, aus der diese Datei
  // entstanden ist.
  it.each(STANDARD_FAMILIEN.map(f => [f.name, f.standard] as const))(
    '%s → „%s" steht im Standardkatalog',
    (_name, standard) => {
      expect(KATALOG.some(p => p.title === standard)).toBe(true)
    },
  )
})

describe('Unbestimmt → die Standardzeile, nicht der kürzeste Titel', () => {
  it.each([
    // PD-010: Die Standardzeile der Familie ist auf „Türen lackieren
    // einseitig (2× Anstrich)" gewandert, weil die alte Zeile in der falschen
    // Tätigkeit lag. Der angenommene Preis steigt damit von 45 auf 55 € —
    // nicht weil etwas teurer wurde, sondern weil vorher die billigere von
    // zwei Dubletten gewann.
    ['Maler', 'Stück', 'Tür lackieren', 55, 'Türen lackieren einseitig (2× Anstrich)'],
    ['Maler', 'Stück', 'Tür streichen', 55, 'Türen lackieren einseitig (2× Anstrich)'],
    ['Maler', 'Stück', 'Fenster lackieren', 55, 'Fenster streichen innen'],
    ['Maler', 'm²', 'Wand streichen', 9.5, 'Wand streichen 2x Anstrich'],
    ['Maler', 'm²', 'Wände streichen', 9.5, 'Wand streichen 2x Anstrich'],
    ['Maler', 'm²', 'Decke streichen', 11, 'Decke streichen 2x Anstrich'],
    ['Maler', 'm²', 'Fassade streichen', 14, 'Fassade streichen 2x Anstrich'],
    ['Boden', 'm²', 'Laminat verlegen', 14, 'Laminat verlegen, schwimmend'],
    ['Boden', 'm²', 'Parkett verlegen', 22, 'Fertigparkett verlegen schwimmend (Klick-System)'],
    ['Boden', 'm²', 'Vinyl verlegen', 16, 'Klick-Vinyl (LVT) verlegen schwimmend, Standard'],
    ['Estrich', 'm²', 'Wärmedämmung verlegen', 14, 'Wärmedämmung EPS verlegen, bis 60 mm'],
  ])('%s · „%s" → %s €', (gew, einheit, titel, betrag, zeile) => {
    const t = treffer(gew as string, einheit as string, titel as string)
    expect(t?.position.title).toBe(zeile)
    expect(t?.position.unit_price).toBe(betrag)
  })

  it('sagt dem Handwerker, WAS angenommen wurde', () => {
    // Ohne diesen Satz ist der Standard bloß ein anderer stiller Treffer.
    // Er geht in `annahmen` — im Entwurf sichtbar, auf dem Kunden-PDF nicht.
    expect(treffer('Maler', 'Stück', 'Tür lackieren')?.annahme).toMatch(/einseitig/i)
    expect(treffer('Maler', 'm²', 'Wand streichen')?.annahme).toMatch(/2x/i)
    expect(treffer('Estrich', 'm²', 'Wärmedämmung verlegen')?.annahme).toMatch(/60/)
  })
})

describe('Festgelegt → der Standard hält sich raus', () => {
  it.each([
    // Die Ansage gewinnt immer. Ein Standard, der eine ausdrückliche Angabe
    // überstimmt, wäre schlimmer als gar keiner.
    // Die alte beidseitig-Zeile ist mit PD-010 entfallen; die Ansage gilt
    // trotzdem weiter und landet jetzt auf der Zeile ohne Zusatz (90 €).
    ['Maler', 'Stück', 'Tür lackieren beidseitig', 90],
    ['Maler', 'Stück', 'Türen lackieren (2× Anstrich)', 90],
    ['Maler', 'Stück', 'Fenster lackieren (2× Anstrich)', 55],
    ['Maler', 'm²', 'Wand streichen 1x Anstrich', 6],
    ['Maler', 'm²', 'Wand streichen 3x Anstrich (Vollton / Dunkelfarbe)', 13],
    ['Maler', 'm²', 'Decke streichen 1x Anstrich', 7],
    ['Boden', 'm²', 'Laminat Großdiele verlegen, schwimmend', 16],
    ['Boden', 'm²', 'Loose-Lay-Vinyl verlegen', 18],
    ['Boden', 'm²', 'Klebe-Vinyl verlegen, Nasskleber', 28],
    ['Estrich', 'm²', 'Wärmedämmung Mineralwolle verlegen', 22],
    ['Estrich', 'm²', 'Wärmedämmung EPS verlegen, bis 100 mm', 20],
  ])('%s · „%s" → %s €', (gew, einheit, titel, betrag) => {
    const t = treffer(gew as string, einheit as string, titel as string)
    expect(t?.position.unit_price).toBe(betrag)
    expect(t?.annahme).toBeUndefined()
  })

  it('erkennt die Festlegung direkt', () => {
    expect(standardFamilie('Tür lackieren')?.name).toBe('Tür streichen/lackieren')
    expect(standardFamilie('Tür beidseitig lackieren')).toBeNull()
    expect(standardFamilie('Außentür lackieren beidseitig')).toBeNull()
    expect(standardFamilie('Loose-Lay-Vinyl verlegen')).toBeNull()
  })
})

describe('Kein Standard → weiterhin kein Preis', () => {
  it('erfindet keinen Standard für Familien, die keinen haben', () => {
    // PM-018 bleibt die Grundlinie. Der Standard ist eine benannte Ausnahme
    // für Alltagsbegriffe, kein neuer Automatismus.
    expect(standardFamilie('Parkett schleifen')).toBeNull()
    expect(treffer('Boden', 'm²', 'Parkett schleifen')).toBeNull()
  })

  it('greift nicht, wenn der Betrieb die Standardzeile gar nicht hat', () => {
    // Ein Betrieb mit eigenem Katalog bekommt nichts untergeschoben, was bei
    // ihm nicht existiert.
    const ohneStandard = gewerk('Maler').filter(p => p.title !== 'Tür streichen / lackieren (einseitig)')
    const t = findePreisposition('Tür lackieren', 'Stück', ohneStandard)
    expect(t?.position.title).not.toBe('Tür streichen / lackieren (einseitig)')
  })
})
