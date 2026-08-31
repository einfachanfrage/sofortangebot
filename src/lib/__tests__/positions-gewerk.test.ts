// PM-024/PM-026-Nachtest (Sandy, 2026-08-30): „Boden schützen" stand plötzlich
// mit 0,00 € im Angebot — „Preis fehlt in deiner Preisdatenbank", bei einer
// Position, die in jedem Malerfall vorkommt.
//
// Ursache war nicht der Katalog (der Eintrag „Boden abdecken (Abdeckvlies)",
// 1,20 €/m², steht unverändert unter „Maler – Vorbereitung & Schutz"), sondern
// die Gewerke-Zuordnung der POSITION: „Boden schützen" enthält kein einziges
// Maler-Wort. In einem reinen Malerauftrag fiel das nie auf. In einem
// gemischten Angebot (Laminat + Streichen) wurde die Position dem Hauptgewerk
// „boden_parkett" zugeschlagen — und dort gibt es keinen solchen Eintrag.
import { describe, expect, it } from 'vitest'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { findePreisposition } from '../preis-matcher'
import { gewerkFuerPosition } from '@/app/api/angebot-generieren/route'

const KATALOG = [
  { id: '1', title: 'Boden abdecken (Abdeckvlies)', category: 'Maler – Vorbereitung & Schutz', unit: 'm²', unit_price: 1.2 },
  { id: '2', title: 'Boden abdecken (Abdeckvlies)', category: 'Fliesen – Vorbereitung & Schutz', unit: 'm²', unit_price: 1.2 },
  { id: '3', title: 'Laminat verlegen', category: 'Boden – Laminat', unit: 'm²', unit_price: 18 },
  { id: '4', title: 'Wandflächen streichen 2x Anstrich', category: 'Maler – Anstrich Innen', unit: 'm²', unit_price: 9.5 },
]

function preisFuer(beschreibung: string, einheit: string, hauptgewerk: string) {
  const gewerk = gewerkFuerPosition(beschreibung, hauptgewerk)
  const kandidaten = KATALOG.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
  return findePreisposition(beschreibung, einheit, kandidaten)?.position.unit_price
}

describe('Gewerke-Zuordnung einzelner Positionen', () => {
  it('findet den Preis für „Boden schützen" auch im gemischten Angebot', () => {
    expect(preisFuer('Boden schützen — Küche', 'm²', 'boden_parkett')).toBe(1.2)
    expect(preisFuer('Boden schützen — Büro', 'm²', 'maler')).toBe(1.2)
  })

  it('ordnet Bodenschutz dem Maler zu, nicht dem Bodenleger', () => {
    expect(gewerkFuerPosition('Boden schützen — Küche', 'boden_parkett')).toBe('maler')
    expect(gewerkFuerPosition('Abdeckfolie entfernen', 'boden_parkett')).toBe('maler')
  })

  it('lässt echte Bodenarbeiten beim Bodenleger', () => {
    expect(gewerkFuerPosition('Laminat verlegen inkl. 5% Verschnitt — Flur', 'maler')).toBe('boden_parkett')
    expect(gewerkFuerPosition('Altbelag entfernen — Flur', 'maler')).toBe('boden_parkett')
    expect(preisFuer('Laminat verlegen inkl. 5% Verschnitt — Flur', 'm²', 'maler')).toBe(18)
  })

  it('lässt Wandarbeiten beim Maler', () => {
    expect(preisFuer('Wandflächen streichen 2x — Küche', 'm²', 'boden_parkett')).toBe(9.5)
  })
})

// Trockenlauf 2026-08-30: Jede Position, die die Engines erzeugen, muss im
// Katalog einen Preis finden. Zwei Lücken sind dabei aufgefallen, bevor Sandy
// sie einsprechen musste — Singular/Plural bei den Dachschrägen und die
// Dehnungsfuge, die im Katalog „herstellen" statt „einbauen" heißt.
describe('Jede erzeugte Position findet ihren Katalogpreis', () => {
  const KATALOG_ERWEITERT = [
    ...KATALOG,
    { id: '10', title: 'Dachschrägen streichen', category: 'Maler – Anstrich Innen', unit: 'm²', unit_price: 11 },
    { id: '11', title: 'Kniestockwände streichen', category: 'Maler – Anstrich Innen', unit: 'm²', unit_price: 10 },
    { id: '12', title: 'Fassadenfläche streichen', category: 'Maler – Anstrich Außen', unit: 'm²', unit_price: 14 },
    { id: '13', title: 'Sockelleisten abkleben', category: 'Maler – Vorbereitung & Schutz', unit: 'lfdm', unit_price: 0.8 },
    { id: '14', title: 'Dehnungsfuge mit Bewegungsprofil herstellen', category: 'Boden – Abschlussarbeiten', unit: 'lfdm', unit_price: 18 },
    { id: '15', title: 'Altbelag entfernen', category: 'Boden – Sonstiges', unit: 'm²', unit_price: 12 },
    { id: '16', title: 'Parkett verlegen', category: 'Boden – Parkett', unit: 'm²', unit_price: 45 },
  ]

  const faelle: Array<[string, string, string]> = [
    ['Dachschrägen streichen 2x — Dachzimmer', 'm²', 'maler'],
    ['Kniestockwände streichen 2x — Dachzimmer', 'm²', 'maler'],
    ['Fassadenfläche streichen 1x — Fassade', 'm²', 'maler'],
    ['Boden schützen — Dachzimmer', 'm²', 'maler'],
    ['Boden schützen — Küche', 'm²', 'boden_parkett'],
    ['Sockelleisten abkleben — Abstellraum', 'lfdm', 'maler'],
    ['Dehnungsfuge einbauen — Wohnzimmer', 'lfdm', 'boden_parkett'],
    ['Altbelag entfernen — Kellerraum', 'm²', 'boden_parkett'],
    ['Fertigparkett verlegen — Kellerraum', 'm²', 'boden_parkett'],
  ]

  it.each(faelle)('%s findet einen Preis', (titel, einheit, haupt) => {
    const gewerk = gewerkFuerPosition(titel, haupt)
    const kandidaten = KATALOG_ERWEITERT.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
    expect(findePreisposition(titel, einheit, kandidaten)).not.toBeNull()
  })
})
