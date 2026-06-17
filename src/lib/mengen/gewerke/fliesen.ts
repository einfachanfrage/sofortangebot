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

    let bodenNetto: number | null = null

    if (laenge && breite) {
      bodenNetto = round2(laenge * breite)
      positionen.push({
        beschreibung: `Bodenfliesen verlegen — ${name}`,
        menge: round2(bodenNetto * 1.1),
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `${laenge} × ${breite} = ${bodenNetto} m² + 10% Verschnitt`,
        annahmen: ['10% Verschnitt angesetzt'],
      })
      if (nassbereich) {
        positionen.push({
          beschreibung: `Verbundabdichtung Boden — ${name}`,
          menge: bodenNetto,
          einheit: 'm²',
          konfidenz: 'high',
          berechnungsweg: `Bodenfläche ${bodenNetto} m²`,
          annahmen: [],
        })
      }
    } else if (flaeche_angegeben) {
      bodenNetto = flaeche_angegeben
      positionen.push({
        beschreibung: `Bodenfliesen verlegen — ${name}`,
        menge: round2(flaeche_angegeben * 1.1),
        einheit: 'm²',
        konfidenz: 'medium',
        berechnungsweg: `${flaeche_angegeben} m² + 10% Verschnitt`,
        annahmen: ['10% Verschnitt angesetzt', 'Nur Bodenfläche angegeben — keine Raummaße vorhanden'],
      })
    }
    // Verfugung Boden — immer wenn Bodenfliesen
    if (bodenNetto !== null) {
      positionen.push({
        beschreibung: `Verfugung Boden — ${name}`,
        menge: bodenNetto,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Gleiche Fläche wie Bodenfliesen (Nettofläche)`,
        annahmen: [],
      })
    }
    // Keine Maße: Rückfrage kommt aus kontext-analyzer / rueckfragen-generator

    if (flieshoehe && umfang) {
      const wandNetto = round2(umfang * flieshoehe)
      positionen.push({
        beschreibung: `Wandfliesen verlegen — ${name}`,
        menge: round2(wandNetto * 1.05),
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Umfang ${umfang} lfm × Fliesenhöhe ${flieshoehe} m = ${wandNetto} m² + 5% Verschnitt`,
        annahmen: ['5% Verschnitt für Wandfliesen'],
      })
      // Verfugung Wand — immer wenn Wandfliesen
      positionen.push({
        beschreibung: `Verfugung Wand — ${name}`,
        menge: wandNetto,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Gleiche Fläche wie Wandfliesen (Nettofläche)`,
        annahmen: [],
      })
      if (nassbereich) {
        positionen.push({
          beschreibung: `Verbundabdichtung Wand — ${name}`,
          menge: wandNetto,
          einheit: 'm²',
          konfidenz: 'high',
          berechnungsweg: `Wandfläche ${wandNetto} m²`,
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
      positionen.push({
        beschreibung: `Entsorgung Fliesenmaterial — ${ab.bereich ?? 'Bereich'}`,
        menge: ab.flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Gleiche Fläche wie Demontage`,
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
