// Ordnet einer Arbeits-Position die passende Material-Position zu.
// z.B. "Wandflächen streichen" → { name: "Wandfarbe", unit: "m²" }.
// Der Nutzer trägt im Untertitel das konkrete Produkt/Farbe ein.
//
// Menge der Material-Position = Menge der Arbeits-Position (gleiche Fläche/Anzahl).
// Preis: aus der Preisdatenbank wenn vorhanden, sonst 0 € (Entscheidung des Nutzers).

export interface MaterialVorschlag {
  name: string
  unit: string
}

interface Regel { test: RegExp; material: MaterialVorschlag }

const REGELN: Regel[] = [
  // — Maler —
  { test: /wandfläche(n)?\s*streich|wände\s*streich/i, material: { name: 'Wandfarbe', unit: 'm²' } },
  { test: /decken?(fläche)?\s*streich|decke\s*streich/i, material: { name: 'Deckenfarbe', unit: 'm²' } },
  { test: /grundier|voranstrich|tiefengrund/i, material: { name: 'Tiefengrund / Grundierung', unit: 'm²' } },
  { test: /spachtel|glätt/i, material: { name: 'Spachtelmasse', unit: 'm²' } },
  { test: /(raufaser|vlies|tapete)\s*(aufzieh|tapezier|aufbring)|tapezieren/i, material: { name: 'Tapete / Raufaser', unit: 'm²' } },
  { test: /stuckleisten\s*montier/i, material: { name: 'Stuckleisten (Material)', unit: 'lfdm' } },
  // — Lackieren —
  { test: /türen?\s*lackier|türzarge/i, material: { name: 'Lack (Türen)', unit: 'Stück' } },
  { test: /fenster.*(lackier|anstrich|öl)/i, material: { name: 'Lack (Fenster)', unit: 'Stück' } },
  { test: /heizkörper\s*(lackier|streich)/i, material: { name: 'Heizkörperlack', unit: 'Stück' } },
  { test: /\blackier/i, material: { name: 'Lack', unit: 'Stück' } },
  // — Boden — (Belag aus dem Titel)
  { test: /klick-?vinyl.*verleg|verleg.*klick-?vinyl/i, material: { name: 'Klick-Vinyl (Material)', unit: 'm²' } },
  { test: /v[ie]nyl.*verleg|verleg.*v[ie]nyl|designboden.*verleg/i, material: { name: 'Vinyl / Designboden (Material)', unit: 'm²' } },
  { test: /laminat.*verleg|verleg.*laminat/i, material: { name: 'Laminat (Material)', unit: 'm²' } },
  { test: /parkett.*verleg|verleg.*parkett|fertigparkett/i, material: { name: 'Parkett (Material)', unit: 'm²' } },
  { test: /kork.*verleg|verleg.*kork/i, material: { name: 'Kork (Material)', unit: 'm²' } },
  { test: /linoleum.*verleg|verleg.*linoleum/i, material: { name: 'Linoleum (Material)', unit: 'm²' } },
  { test: /teppich.*verleg|nadelvlies.*verleg/i, material: { name: 'Teppichboden (Material)', unit: 'm²' } },
  { test: /\bverleg/i, material: { name: 'Bodenbelag (Material)', unit: 'm²' } },
  { test: /sockelleisten\s*montier/i, material: { name: 'Sockelleisten (Material)', unit: 'lfdm' } },
  { test: /trittschall|dämmung/i, material: { name: 'Trittschalldämmung (Material)', unit: 'm²' } },
]

/** Passendes Material zur Arbeits-Position, oder null wenn kein Material anfällt. */
export function materialFuerPosition(titel: string): MaterialVorschlag | null {
  const t = titel ?? ''
  // Material-Positionen selbst bekommen kein weiteres Material
  if (/\(material\)|wandfarbe|deckenfarbe|tiefengrund|spachtelmasse|heizkörperlack|\black\b/i.test(t)) return null
  for (const r of REGELN) {
    if (r.test.test(t)) return r.material
  }
  return null
}
