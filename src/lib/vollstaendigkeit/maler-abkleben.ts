import type { BerechnetePosition } from '../mengen/types'
import { hat, anzahlAus } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

export function pruefeBodenAbdecken(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatBodenAbdecken = lower.includes('boden abdecken') || lower.includes('böden abdecken')
    || lower.includes('abdecken') || lower.includes('abdeckfolie') || lower.includes('boden schütz')
  // Wächter prüft weiter auf ALLE Schreibweisen — auch die alte, falls eine
  // andere Stelle sie noch erzeugt. Sonst steht die Position doppelt drin.
  if (!hatBodenAbdecken || hat(ergaenzt, 'boden schütz', 'boden abdecken', 'abdeckfolie', 'abdeckvlies')) return

  const anzZimmerBoden = anzahlAus(lower, 'zimmer', anzahlAus(lower, 'raum', anzahlAus(lower, 'räume', 1)))
  const alleFlaechen = ergaenzt.filter(p => p.einheit === 'm²' && p.menge > 0
    && (p.beschreibung.toLowerCase().includes('boden') || p.beschreibung.toLowerCase().includes('decke') || p.beschreibung.toLowerCase().includes('wand')))
  const gesamtFlaeche = alleFlaechen.length > 0 ? alleFlaechen.reduce((s, p) => s + p.menge, 0) / alleFlaechen.length * anzZimmerBoden : null
  const spanneMatch = lower.match(/(\d+)\s*[-–bis]+\s*(\d+)\s*(?:m²|qm|quadratmeter)/i)
  const einzelMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
  const flaechemittelwert = spanneMatch
    ? (parseInt(spanneMatch[1]) + parseInt(spanneMatch[2])) / 2 * anzZimmerBoden
    : einzelMatch ? parseFloat(einzelMatch[1].replace(',', '.')) * anzZimmerBoden : gesamtFlaeche

  if (flaechemittelwert !== null && flaechemittelwert > 0) {
    // F.6: drei Schreibweisen für eine Arbeit („Boden schützen",
    // „… / Abdecken", „… / Abdeckfolie"). Jetzt der Katalogtitel wörtlich,
    // 1,20 €/m² — Treffer 1,00 statt 0,94.
    ergaenzt.push({ beschreibung: 'Boden abdecken (Abdeckvlies)', menge: Math.round(flaechemittelwert), einheit: 'm²', konfidenz: 'medium', berechnungsweg: spanneMatch ? `(${spanneMatch[1]}+${spanneMatch[2]})/2 × ${anzZimmerBoden} Zimmer` : `${flaechemittelwert} m²`, annahmen: [] })
  } else {
    // Der Pauschale-Zweig bleibt vorerst ohne Preis: Der Katalog führt nur
    // die m²-Zeile. Die Pauschale (25,00 € je Zimmer, F.3) kommt mit dem
    // Katalog-Zug — das ist TN-090.
    ergaenzt.push({ beschreibung: 'Boden abdecken (Abdeckvlies)', menge: anzZimmerBoden, einheit: 'Pauschale', konfidenz: 'medium', berechnungsweg: `${anzZimmerBoden} Zimmer`, annahmen: ['Bodenfläche nicht berechnet — Pauschale pro Zimmer'] })
  }
}

export function pruefeFliesenspiegel(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatFliesenspiegel = lower.includes('fliesenspiegel') || lower.includes('kachelspiegel')
    || (lower.includes('fliesen') && lower.includes('abkl') && lower.includes('küche'))
  // Nach der Umbenennung trägt die Position das Wort „Fliesenspiegel" nur
  // noch im Rechenweg, nicht mehr im Titel — der Wächter muss deshalb auch
  // den neuen Titel kennen, sonst legt er sie ein zweites Mal an.
  if (!hatFliesenspiegel || hat(ergaenzt, 'fliesenspiegel', 'abkleben kanten')) return

  const lfdmMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:lfdm|lfm|laufmeter|laufende)/i)
  const flm = lfdmMatch ? parseFloat(lfdmMatch[1].replace(',', '.')) : null
  if (flm !== null && flm > 0) {
    // F.2 #2: Dieselbe Arbeit wie `Abkleben Kanten / Leisten` (0,80 €/lfdm) —
    // die Folie über die Fliesen ist Nebenleistung. Der alte Titel fand im
    // Katalog gar nichts und stand mit 0,00 € im Angebot.
    // Das Katalogwort trägt den Preis, das Handwerkerwort steht in Klammern.
    //
    // Erster Anlauf hieß nur `Abkleben Kanten / Leisten` — und der Golden
    // Corpus hat zu Recht Alarm geschlagen: Manfred diktiert „Fliesenspiegel
    // abkleben" und findet auf dem Papier eine Zeile, die das Wort nicht
    // mehr enthält. Weder er noch sein Kunde erkennen sie wieder.
    //
    // Die Klammer löst beides: Die Normalisierung wirft Klammerinhalte weg,
    // der Treffer bleibt bei 1,00 und 0,80 €/lfdm — sichtbar bleibt das Wort
    // trotzdem. (Beim Isoliergrund funktioniert derselbe Griff NICHT:
    // „(nach Schimmelbehandlung)" wird von der Aufwandswort-Regel am
    // Rohtitel gelesen und sperrt hart. Dort steht der Anlass deshalb im
    // Rechenweg. Gemessen, nicht vermutet.)
    ergaenzt.push({ beschreibung: 'Abkleben Kanten / Leisten (Fliesenspiegel)', menge: flm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `Fliesenspiegel, ${flm} lfdm aus Transkript`, annahmen: [] })
  } else {
    // Keine Meter genannt → als Pauschale, damit die angefragte Position nicht verschwindet
    // F.2 #2: „Eine Arbeit, eine Einheit." Der Pauschale-Zweig ist raus —
    // er erfand die Menge 1 für eine Leistung, die in laufenden Metern
    // abgerechnet wird, und fand im Katalog ohnehin nichts. Ohne Meter steht
    // die Position jetzt sichtbar in der Fehlt-Liste (Manfreds
    // Einheiten-Eimer, dieselbe Entscheidung wie bei den Rohren).
    fehlende.push('Fliesenspiegel abkleben (laufende Meter prüfen)')
  }
}

export function pruefeLampenAbkleben(ergaenzt: BerechnetePosition[], lower: string, v: AuftragsVerstaendnis): void {
  const hatStreichen = v.hatArbeit('streichen')
  const hatLampenAbkleben = lower.includes('lamp') || lower.includes('leuchte') || lower.includes('deckenleuchte')
    || lower.includes('pendelleuchte') || lower.includes('einbauspot') || lower.includes('spot')
  if (!hatLampenAbkleben || !hatStreichen || hat(ergaenzt, 'lampen abkl', 'leuchten abkl', 'spots abkl', 'pendelleuchte')) return

  const anzPendel = anzahlAus(lower, 'pendelleuchte', 0)
  const anzSpots = anzahlAus(lower, 'einbauspot', anzahlAus(lower, 'spot', 0))
  const anzLampen = anzahlAus(lower, 'lamp', anzahlAus(lower, 'leuchte', 0))
  // ── F.2 #5+6 (Prüfmeister, 12.09.2026) ─────────────────────────────────
  //
  // Drei Positionen für dieselbe Handbewegung: Pendelleuchte, Einbauspot,
  // Lampe. Manfred dazu: *„Kleinkram."* Auf dem Kundenpapier standen bis zu
  // drei Zeilen à 0,00 €, wo eine gehört.
  //
  // Zusammengelegt zu `Leuchten / Spots abkleben`, Stückzahlen addiert. Die
  // Herkunft bleibt im Rechenweg sichtbar, damit der Handwerker die Zahl
  // nachvollziehen kann — der Rechenweg steht auch auf dem Kundendokument.
  //
  // Der Preis (3,00 €/Stück, „wie Schalter / Steckdosen") ist noch keine
  // Katalogzeile und kommt mit dem Katalog-Zug. Bis dahin steht EINE Zeile
  // mit 0,00 € da statt dreien.
  const teile: string[] = []
  if (anzPendel > 0) teile.push(`${anzPendel} Pendelleuchte(n)`)
  if (anzSpots > 0) teile.push(`${anzSpots} Einbauspot(s)`)
  if (anzLampen > 0) teile.push(`${anzLampen} Leuchte(n)`)
  const anzGesamt = anzPendel + anzSpots + anzLampen
  if (anzGesamt > 0) {
    ergaenzt.push({ beschreibung: 'Leuchten / Spots abkleben', menge: anzGesamt, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${teile.join(' + ')} aus Transkript`, annahmen: [] })
  } else {
    ergaenzt.push({ beschreibung: 'Leuchten / Spots abkleben', menge: 1, einheit: 'Stück', konfidenz: 'medium', berechnungsweg: 'Eine genannte Leuchte', annahmen: ['Anzahl nicht ausdrücklich genannt'] })
  }
}

export function pruefeHeizkAbkleben(ergaenzt: BerechnetePosition[], lower: string, v: AuftragsVerstaendnis, hatHeizkLackierenFlag: boolean): void {
  const hatStreichen = v.hatArbeit('streichen')
  const hatHeizkAbkleben = hatStreichen && (lower.includes('heizkörper') || lower.includes('heizkoerper')) && !hatHeizkLackierenFlag
  if (!hatHeizkAbkleben || hat(ergaenzt, 'heizkörper abkl', 'heizkörper abschleifen')) return

  const anzHzkAbkl = anzahlAus(lower, 'heizkörper', anzahlAus(lower, 'heizkoerper', 1))
  ergaenzt.push({ beschreibung: 'Heizkörper abkleben', menge: anzHzkAbkl, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzkAbkl} Heizkörper aus Transkript`, annahmen: [] })
}

export function pruefeTreppenhausGelaender(ergaenzt: BerechnetePosition[], lower: string, v: AuftragsVerstaendnis): void {
  const hatTreppenhaus = lower.includes('treppenhaus') || lower.includes('treppe') || lower.includes('treppenaufgang')
  const hatStreichen = v.hatArbeit('streichen')
  if (hatTreppenhaus && hatStreichen && !hat(ergaenzt, 'geländer abkl', 'geländer abdecken')) {
    ergaenzt.push({ beschreibung: 'Geländer abkleben', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Treppenhaus — Geländer immer abkleben', annahmen: [] })
  }
}
