// DC-056 / TN-010 (Manfred, 11.09.2026) — Pfennigposten auf dem Kunden-PDF.
//
// Befund: „Boden schützen 2,70 €", „Sockelleisten abkleben 4,08 €" stehen als
// eigene Zeilen im Angebot. Manfred: „Geschmackssache, aber sieht kleinlich
// aus. Bei mir läuft das mit rein."
//
// Sandys Entscheidung (12.09.2026): ein Schalter in den Angebots-Einstellungen,
// Standard AUS. Kein automatisches Zusammenfassen — echte Aufstellung ist kein
// Fehler, und wer sie will, soll sie behalten. Wer es ruhiger mag, schaltet es
// an.
//
// Bewusst reine Anzeige: die Positionen bleiben einzeln in der Datenbank, im
// Editor und in der Kalkulation. Zusammengefasst wird nur, was der Kunde
// sieht. Damit ist der Schalter jederzeit folgenlos umlegbar und niemand
// verliert Daten, weil er ihn einmal angehabt hat.

/** Unter diesem Betrag gilt eine Position als Kleinbetrag. */
export const KLEINBETRAG_SCHWELLE_EUR = 10

/**
 * Ab so vielen Kleinbeträgen lohnt das Zusammenfassen. Eine einzelne Zeile
 * umzubenennen spart keine Zeile, sondern verbirgt nur, was sie war.
 */
const MINDESTANZAHL = 2

/** Der Titel der Sammelzeile. */
export const SAMMEL_TITEL = 'Nebenleistungen'

interface Kleinbetragsfaehig {
  id: string
  title: string
  description?: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  position: number
}

/**
 * Fasst Kleinbeträge zu einer Zeile zusammen — oder gibt die Liste unverändert
 * zurück, wenn der Schalter aus ist oder es nichts zusammenzufassen gibt.
 *
 * Nicht zusammengefasst wird alles, was ohnehin schon eine Sammelposition ist
 * (An-/Abfahrt, Kleinmaterial-Pauschale, Aufmaß, Entsorgung, Gerüst — die
 * Liste steckt in `istAllgemeinPosition`) und jeder Prozent-Zuschlag: der
 * rechnet sich aus der Bemessungsgrundlage und wäre als fester Betrag in einer
 * Sammelzeile schlicht falsch.
 */
export function fasseKleinbetraegeZusammen<T extends Kleinbetragsfaehig>(
  items: T[],
  aktiv: boolean,
  istSammelposition: (titel: string) => boolean,
): T[] {
  if (!aktiv || items.length === 0) return items

  const klein = items.filter(i =>
    i.total_price > 0 &&
    i.total_price < KLEINBETRAG_SCHWELLE_EUR &&
    i.unit !== '%' &&
    !istSammelposition(i.title),
  )
  if (klein.length < MINDESTANZAHL) return items

  const kleinIds = new Set(klein.map(i => i.id))
  const summe = Math.round(klein.reduce((s, i) => s + i.total_price, 0) * 100) / 100

  // Der Kunde soll nachlesen können, was in der Zeile steckt — die Titel
  // stehen als Untertitel darunter. Ein Raum-Suffix („ — Flur") bleibt dabei
  // stehen: er beantwortet genau die Frage, die eine Sammelzeile aufwirft.
  const titel = klein.map(i => i.title).join(' · ')

  // Die Sammelzeile erbt ihre Form von der ersten zusammengefassten Position
  // (gleicher Typ, keine erfundenen Felder) und überschreibt, was sie
  // ausmacht. Die neue `id` ist bewusst keine der alten: die Rechenweg- und
  // Übermessungs-Zuordnungen laufen über die ursprünglichen IDs und greifen
  // für die Sammelzeile damit gar nicht erst — sie hat ja keinen eigenen
  // Rechenweg.
  const sammel: T = {
    ...klein[0],
    id: 'sammel-kleinbetraege',
    title: SAMMEL_TITEL,
    description: titel,
    quantity: 1,
    unit: 'Pauschale',
    unit_price: summe,
    total_price: summe,
    position: Math.min(...klein.map(i => i.position)),
  }

  const rest = items.filter(i => !kleinIds.has(i.id))
  return [...rest, sammel].sort((a, b) => a.position - b.position)
}
