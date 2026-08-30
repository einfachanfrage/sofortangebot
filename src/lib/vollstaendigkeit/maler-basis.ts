import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'
import type { RaumScope } from '../arbeiten-normalisierer'

// Raumname aus der Positions-Beschreibung lesen ("Wandflächen streichen —
// Küche" → "küche"). Gleiches Muster wie raumSuffix() in mengen/mehrgewerk.ts;
// bewusst hier lokal gehalten statt importiert, um keinen Zirkel-Import
// zwischen vollstaendigkeit/ und mengen/ zu erzeugen.
function raumAusBeschreibung(beschreibung: string): string | null {
  const match = beschreibung.match(/\s[—–]\s*(.+)$/)
  return match?.[1]?.trim().toLocaleLowerCase('de-DE') || null
}

// "nur X"-Filter: entfernt widersprechende Positionen aus der Engine-Liste.
//
// Fund PM-005: früher lief das über EINEN globalen Scope (aus dem
// Gesamt-Transkript aller Räume). Sagte Raum B "nur Decke", flog auch Raum A's
// Wand raus — obwohl Raum A nie etwas eingeschränkt hat. Jetzt: pro Position
// erst der eigene Raum-Scope (aus dessen arbeiten[]-Liste), der globale Scope
// bleibt nur Fallback für Positionen ohne erkennbaren Raum.
export function wendeNurXFilterAn(ergaenzt: BerechnetePosition[], v: AuftragsVerstaendnis): {
  nurDecke: boolean
  nurWaende: boolean
  nurBoden: boolean
} {
  // Scope aus dem typisierten Vertrag — deckt Flexionen + Synonyme + "ohne Decke" ab
  const { nurWaende, nurDecke, nurBoden, quelle } = v.scope
  // Rohtext-Audit (2026-08-30, Auftrag nach PM-026): Der globale Scope kommt
  // aus dem GESAMTEN Transkript — also aus dem, was Whisper verstanden hat.
  // Beruht er nur darauf, dass eine Fläche nicht erwähnt wurde ('erwaehnung'),
  // darf er keine Positionen löschen, solange es strukturierte Raumangaben
  // gibt: die stammen aus der KI-Extraktion und sind die bessere Quelle.
  // Ohne strukturierte Räume (scopeProRaum leer) bleibt er wie bisher der
  // einzige Anhaltspunkt und gilt weiter.
  const schwachUndUeberstimmbar = quelle === 'erwaehnung' && v.scopeProRaum.size > 0
  const globalScope: RaumScope = schwachUndUeberstimmbar
    ? { nurWaende: false, nurDecke: false, nurBoden: false, quelle: 'keine' }
    : { nurWaende, nurDecke, nurBoden, quelle }

  filtereArray(ergaenzt, p => {
    const raum = raumAusBeschreibung(p.beschreibung)
    const scope = (raum && v.scopeProRaum.get(raum)) || globalScope
    const d = p.beschreibung.toLowerCase()

    if (scope.nurDecke) return !d.includes('sockel') && !d.includes('wand')
    if (scope.nurWaende) {
      const istBodenSchutz = d.includes('boden schütz') || d.includes('boden abkl') || d.includes('abdeck')
      // PM-001-Nebenfund (2026-08-20): "abdecken"/"abdeckfolie" enthält
      // selbst die Zeichenkette "decke" (ab-DECKE-n) — ohne die
      // istBodenSchutz-Ausnahme HIER mit reinzunehmen, flog jede Boden-
      // schützen-Position bei "nur Wände"-Aufträgen (der Alltagsfall bei
      // einem reinen Wandanstrich) sofort wieder raus, obwohl die Zeile
      // darüber sie extra für genau diesen Fall retten wollte. Bug bestand
      // unabhängig von diesem Chip-Vorschau-Fix — betraf auch die finale,
      // bepreiste Kalkulation.
      const istDeckenPosition = !istBodenSchutz && d.includes('decke')
      return !istDeckenPosition && (!d.includes('boden') || istBodenSchutz)
    }
    if (scope.nurBoden) return !d.includes('wand') && !d.includes('decke') && !d.includes('sockel')
    return true
  })

  return { nurDecke, nurWaende, nurBoden }
}

// Streichen-Basis: Wand, Decke, Boden schützen, Sockel abkleben
export function pruefeStreichenBasis(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  v: AuftragsVerstaendnis,
  nurDecke: boolean,
  nurWaende: boolean,
  nurBoden: boolean,
  lower: string,
): void {
  if (!v.hatArbeit('streichen')) return

  const waendeAusdruecklich = /w(?:a|ä)nd|wandfl(?:a|ä)che/i.test(lower)
  const deckeAusdruecklich = /decke|deckenfl(?:a|ä)che/i.test(lower)
  if (waendeAusdruecklich && !nurDecke && !nurBoden && !hat(ergaenzt, 'wand', 'wandfläche')) {
    add(ergaenzt, fehlende, 'Wandflächen streichen')
  }
  if (deckeAusdruecklich && !nurWaende && !nurBoden && !hat(ergaenzt, 'decke', 'deckenfläche')) {
    add(ergaenzt, fehlende, 'Deckenfläche streichen')
  }
  // Schutz- und Abklebearbeiten nur ausgeben, wenn sie im Auftrag tatsächlich
  // genannt wurden. Keine ungefragten Zusatzpositionen erzeugen.
  const bodenSchutzGenannt = /(?:boden|böden).{0,35}(?:schütz|abdeck|vlies)|(?:schütz|abdeck|vlies).{0,35}(?:boden|böden)/i.test(lower)
  const sockelAbklebenGenannt = /sockel(?:leisten)?.{0,35}(?:abkl|abgekl)|(?:abkl|abgekl).{0,35}sockel(?:leisten)?/i.test(lower)
  if (!nurBoden && bodenSchutzGenannt && !hat(ergaenzt, 'boden schütz', 'boden abdeck', 'abdeckfolie')) {
    add(ergaenzt, fehlende, 'Boden schützen / Abdecken')
  }
  if (!nurDecke && !nurBoden && sockelAbklebenGenannt && !hat(ergaenzt, 'sockelleisten abkl')) {
    add(ergaenzt, fehlende, 'Sockelleisten abkleben')
  }
}

// Grundierung: Neubau/Erstanstrich triggert automatisch
export function pruefeGrundierung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  v: AuftragsVerstaendnis,
  lower: string,
): void {
  // grundieren/streichen aus dem Vertrag; distinktive Nomen weiter aus dem Text
  const hatGrundierung = v.hatArbeit('grundieren') || lower.includes('tiefengrund')
    || lower.includes('neubau') || lower.includes('erstanstrich') || lower.includes('rohbau')

  if (!v.hatArbeit('streichen') || !hatGrundierung) return

  // PM-003: "Grundierung" kam hier oft nur aus der GPT-Struktur, weil im Raum
  // eine Kleinreparatur steckt (Dübellöcher/Schadstellen) — der Nutzer selbst
  // hat nie "grundieren"/"Neubau"/"Erstanstrich" gesagt. Unten wurde das
  // trotzdem auf die VOLLE Wandfläche gerechnet (276,66 € für zwei
  // Dübellöcher). Ohne echtes Maß für "die geflickte Stelle" raten wir hier
  // keine Zahl — stattdessen Erinnerung in "fehlende", der Handwerker trägt
  // die reale Reparaturfläche selbst ein.
  const explizitVollflaechig = /grundier\w*|grundierung|voranstrich|primer|tiefengrund|neubau|erstanstrich|rohbau/i.test(lower)
  const nurKleinreparatur = !explizitVollflaechig
    && /dübellöch|duebelloech|bohrlöch|nagellöch|schadstell|fehlstell/i.test(lower)
  if (nurKleinreparatur) {
    add(ergaenzt, fehlende, 'Voranstrich / Grundierung (nur Reparaturstelle)')
    return
  }

  // Dachschrägen (im selben Raum wie Wände) grundieren separat — eigene Fläche.
  // Vor der Wand-Grundierung, damit die generische hat(...'grundier') Prüfung greift.
  //
  // PM-007: gleicher Fehler wie PM-003, nur beim Dachschrägen-Zweig nachgeholt.
  // GPT trägt "grundieren" öfter reflexartig in arbeiten[] ein (fachlich
  // nachvollziehbar bei älteren Schrägen), ohne dass der Nutzer das je gesagt
  // hat. Ohne `explizitVollflaechig`-Gate hätte das eine ungefragte 136,80-€-
  // Position auf die komplette Dachschrägenfläche erzeugt — exakt das Muster,
  // das der Wand-Grundierung oben schon (PM-003) verboten wurde.
  const dgPos = ergaenzt.find(p => /dachschräge/i.test(p.beschreibung) && p.einheit === 'm²')
  const hatDgGrundierung = ergaenzt.some(p =>
    /dachschräge/i.test(p.beschreibung) && /grundier|voranstrich|tiefengrund/i.test(p.beschreibung))
  if (dgPos && !hatDgGrundierung && explizitVollflaechig) {
    ergaenzt.push({
      beschreibung: 'Dachschrägen grundieren',
      menge: dgPos.menge,
      einheit: 'm²',
      konfidenz: 'high',
      berechnungsweg: `Gleiche Fläche wie Dachschrägen (${dgPos.menge} m²)`,
      annahmen: [...dgPos.annahmen],
    })
  }

  // Decken-Grundierung: PM-018 — bisher kannte diese Funktion Grundierung
  // NUR für Wände. Sagt der Kunde "beides grundieren" (Wand UND Decke), gibt
  // es aber eine eigene Deckenfläche im Ergebnis, muss auch die Decke ihre
  // eigene Grundierungs-Position bekommen — sonst fehlt bezahlte Arbeit,
  // ohne dass der ausdrückliche Auftrag dazu widersprochen wird. Vor der
  // Wand-Grundierung geprüft, aus demselben Grund wie beim Dachschrägen-Fall
  // oben: die generische hat(...'grundier')-Prüfung soll erst danach greifen.
  const deckePos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('deckenfläch'))
  const hatDeckenGrundierung = ergaenzt.some(p =>
    /grundier|voranstrich|tiefengrund/i.test(p.beschreibung) && /decke/i.test(p.beschreibung))
  if (deckePos && !hatDeckenGrundierung && explizitVollflaechig) {
    ergaenzt.unshift({
      beschreibung: 'Voranstrich / Grundierung Decke',
      menge: deckePos.menge,
      einheit: 'm²',
      konfidenz: 'high',
      berechnungsweg: `Gleiche Fläche wie Deckenfläche (${deckePos.menge} m²)`,
      annahmen: [...deckePos.annahmen],
    })
  }

  // Wand-Grundierung: nur wenn noch keine Wand-Grundierung existiert.
  const hatWandGrundierung = ergaenzt.some(p =>
    /grundier|voranstrich|tiefengrund/i.test(p.beschreibung) && !/dachschräge/i.test(p.beschreibung) && !/decke/i.test(p.beschreibung))
  if (hatWandGrundierung) return

  const wandPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
  if (wandPos) {
    ergaenzt.unshift({
      beschreibung: 'Voranstrich / Grundierung',
      menge: wandPos.menge,
      einheit: 'm²',
      konfidenz: 'high',
      berechnungsweg: `Gleiche Fläche wie Wandflächen (${wandPos.menge} m²)`,
      annahmen: [...wandPos.annahmen],
    })
  } else {
    add(ergaenzt, fehlende, 'Voranstrich / Grundierung')
  }
}
