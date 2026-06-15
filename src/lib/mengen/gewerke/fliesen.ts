import type { MengenErgebnis, BerechnetePosition } from '../types'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function fliesenEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  for (const bereich of (daten.bereiche ?? [])) {
    const {
      name = 'Bereich',
      laenge, breite,
      flieshoehe,
      flaeche: flaeche_angegeben,
      nassbereich = false,
    } = bereich

    const umfang = laenge && breite ? round2(2 * laenge + 2 * breite) : null

    if (laenge && breite) {
      const boden = round2(laenge * breite)
      positionen.push({
        beschreibung: `Bodenfliesen verlegen — ${name}`,
        menge: round2(boden * 1.1),
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `${laenge} × ${breite} = ${boden} m² + 10% Verschnitt`,
        annahmen: ['10% Verschnitt angesetzt'],
      })
      if (nassbereich) {
        positionen.push({
          beschreibung: `Verbundabdichtung Boden — ${name}`,
          menge: boden,
          einheit: 'm²',
          konfidenz: 'high',
          berechnungsweg: `Bodenfläche ${boden} m²`,
          annahmen: [],
        })
      }
    } else if (flaeche_angegeben) {
      positionen.push({
        beschreibung: `Bodenfliesen verlegen — ${name}`,
        menge: round2(flaeche_angegeben * 1.1),
        einheit: 'm²',
        konfidenz: 'medium',
        berechnungsweg: `${flaeche_angegeben} m² + 10% Verschnitt`,
        annahmen: ['10% Verschnitt angesetzt', 'Nur Bodenfläche angegeben — keine Raummaße vorhanden'],
      })
    }
    // Keine Maße: Rückfrage kommt aus kontext-analyzer / rueckfragen-generator

    if (flieshoehe && umfang) {
      const wandflaeche = round2(umfang * flieshoehe)
      positionen.push({
        beschreibung: `Wandfliesen verlegen — ${name}`,
        menge: round2(wandflaeche * 1.05),
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Umfang ${umfang} lfm × Fliesenhöhe ${flieshoehe} m = ${wandflaeche} m² + 5% Verschnitt`,
        annahmen: ['5% Verschnitt für Wandfliesen'],
      })
      if (nassbereich) {
        positionen.push({
          beschreibung: `Verbundabdichtung Wand — ${name}`,
          menge: wandflaeche,
          einheit: 'm²',
          konfidenz: 'high',
          berechnungsweg: `Wandfläche ${wandflaeche} m²`,
          annahmen: [],
        })
      }
    }
    // Wandhöhe fehlt: Rückfrage kommt aus kontext-analyzer (flieshoehe_*)

    if (umfang) {
      positionen.push({
        beschreibung: `Fliesensockel / Abschlussleiste — ${name}`,
        menge: umfang,
        einheit: 'lfdm',
        konfidenz: 'high',
        berechnungsweg: `Umfang ${umfang} lfm`,
        annahmen: [],
      })
    }
  }

  for (const ab of (daten.altbelag ?? [])) {
    if (ab.flaeche) {
      positionen.push({
        beschreibung: `Altfliesen abstemmen — ${ab.bereich ?? 'Bereich'}`,
        menge: ab.flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Angabe: ${ab.flaeche} m²`,
        annahmen: [],
      })
    }
  }

  return {
    gewerk: 'fliesen',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: true,
  }
}
