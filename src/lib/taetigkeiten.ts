// Tätigkeiten statt Gewerke — die Ebene, auf der die Materialfrage vorbelegt
// wird (CoS-E-053 Schritt 4, `docs/preisliste-konzept.md` Fassung 3 §4.1/§6).
//
// ── Warum eine Ebene unter dem Gewerk ──────────────────────────────────────
//
// Manfred, 14.09.2026: *„Der Schritt ‚Was machst du?' fragt heute nur Maler
// oder Boden. Innen und Fassade sind kein Haken. Wenn die Material-Frage je
// Tätigkeit laufen soll, muss vorher die Tätigkeit selbst ein Haken sein —
// Innen, Fassade, Boden, vielleicht Lack. Ein Bildschirm, vier Haken, jeder
// mit dem Material-Standard dran, den man antippen kann. Das sind keine
// zusätzlichen Fragen, das ist dieselbe Frage mit mehr Antworten."*
//
// Der Grund, warum „Maler" als Ebene nicht reicht, steht in seiner eigenen
// Tabelle: Ein Betrieb, drei verschiedene Antworten auf die Materialfrage.
// Innen drin, Fassade getrennt, Boden getrennt. Ein Schalter je Betrieb
// stünde für zwei Drittel seiner Arbeit falsch, egal wie er steht.
//
// ── Eine Korrektur an meinem eigenen Konzept ───────────────────────────────
//
// In Fassung 3 stand beim Onboarding-Entwurf „Tapezieren · ohne Tapete". Das
// widerspricht Manfreds Tabelle, und zwar in derselben Antwort: Er zählt
// *„Innen (Wand, Decke, **Lack, Vlies**)"* zusammen auf — mit Material DRIN.
// Vlies ist Vliestapete. Ich hatte aus dem Beispiel in §4.6 („Vlies
// tapezieren immer ohne Tapete, weil der Kunde die aussucht") einen Standard
// gemacht — dabei war es sein Beispiel für den SELTENEN Fall, für den er
// ausdrücklich keine eigene Ebene wollte.
//
// Hier gilt seine Tabelle: Tapezieren und Lackieren erben den Standard von
// Innen. Wer es anders hält, stellt es um — an der Zeile, wie alles andere.

export type MaterialStandard = 'drin' | 'getrennt'

export type TaetigkeitId =
  | 'maler_innen'
  | 'tapezieren'
  | 'lackieren'
  | 'fassade'
  | 'boden'

export interface Taetigkeit {
  id: TaetigkeitId
  /** Wie der Haken heißt. Handwerkersprache, kein Katalogdeutsch. */
  label: string
  /** Material drin oder getrennt — antippbar, das hier ist nur die Vorbelegung. */
  materialStandard: MaterialStandard
  /** Schlüssel in `GEWERK_PREISE`. */
  vorlagen: string[]
  /**
   * Welche Katalog-Rubriken zu dieser Tätigkeit gehören. Präfixvergleich,
   * kleingeschrieben.
   */
  kategorien: string[]
}

/**
 * Die Tätigkeiten, wie Manfred sie benannt hat.
 *
 * `tapezieren` und `lackieren` sind eigene HAKEN, aber keine eigene
 * Materialwelt: Der Haken entscheidet, ob im Onboarding nach „Vliestapete
 * neu" bzw. „Tür lackieren" gefragt wird — den Material-Standard erben sie
 * von Innen, weil Manfred sie dort einsortiert hat.
 */
export const TAETIGKEITEN: readonly Taetigkeit[] = [
  {
    id: 'maler_innen',
    label: 'Innen streichen',
    materialStandard: 'drin',
    vorlagen: ['malerarbeiten'],
    // Auffangregel statt Aufzählung: ALLES aus dem Maler-Katalog gehört
    // hierher, außer was weiter unten eine längere Rubrik beansprucht
    // (Tapezieren, Lackierarbeiten, Anstrich Außen). Mein erster Entwurf
    // zählte die Rubriken einzeln auf und übersah zwei —
    // „Maler – Bodenbeschichtung" (Boden streichen) und
    // „Maler – Stuck & Dekorative Techniken" (Stuckleisten streichen).
    // Beide sind Anstrich innen. Eine Aufzählung veraltet mit der nächsten
    // neuen Rubrik; eine Auffangregel nicht.
    kategorien: ['maler'],
  },
  {
    id: 'tapezieren',
    label: 'Tapezieren',
    materialStandard: 'drin',
    vorlagen: ['malerarbeiten'],
    kategorien: ['maler – tapezieren'],
  },
  {
    id: 'lackieren',
    label: 'Lackieren',
    materialStandard: 'drin',
    vorlagen: ['malerarbeiten'],
    kategorien: ['maler – lackierarbeiten'],
  },
  {
    id: 'fassade',
    label: 'Fassade',
    materialStandard: 'getrennt',
    vorlagen: ['maler_fassade'],
    kategorien: ['maler – anstrich außen', 'fassade'],
  },
  {
    id: 'boden',
    label: 'Boden',
    materialStandard: 'getrennt',
    vorlagen: ['bodenbeläge'],
    kategorien: ['boden', 'fliesen'],
  },
]

/**
 * Bestandsbetriebe: aus den alten Gewerk-Kennungen die Tätigkeiten ableiten.
 *
 * **Keine Migration, keine Umbenennung in der Datenbank.** `companies.gewerke`
 * bleibt stehen und bedeutet weiter dasselbe; diese Funktion übersetzt nur.
 * Wer `maler` gewählt hatte, bekam bisher Innen UND Fassade in einem Topf —
 * das bleibt für ihn so, bis er den Bildschirm einmal sieht und die Haken
 * selbst setzt. Ihm etwas wegzunehmen, das er nie abgewählt hat, wäre
 * dieselbe stille Entscheidung, die wir gerade überall abräumen.
 */
export function taetigkeitenAusGewerken(gewerke: string[] | null | undefined): TaetigkeitId[] {
  const alt: Record<string, TaetigkeitId[]> = {
    maler: ['maler_innen', 'tapezieren', 'lackieren', 'fassade'],
    fassade: ['fassade'],
    boden_parkett: ['boden'],
    fliesen: ['boden'],
  }
  const raus = new Set<TaetigkeitId>()
  for (const gewerk of gewerke ?? []) for (const id of alt[gewerk] ?? []) raus.add(id)
  return TAETIGKEITEN.filter(t => raus.has(t.id)).map(t => t.id)
}

/** Die Tätigkeit, zu der eine Katalogrubrik gehört. */
export function taetigkeitFuerKategorie(kategorie: string | null | undefined): Taetigkeit | null {
  const k = (kategorie ?? '').toLocaleLowerCase('de-DE').trim()
  if (!k) return null
  // Längstes Präfix gewinnt: „maler – anstrich außen" muss vor „maler" greifen.
  let treffer: Taetigkeit | null = null
  let laenge = -1
  for (const t of TAETIGKEITEN) {
    for (const praefix of t.kategorien) {
      if (k.startsWith(praefix) && praefix.length > laenge) {
        treffer = t
        laenge = praefix.length
      }
    }
  }
  return treffer
}

/**
 * Ist bei dieser Position das Material standardmäßig drin oder getrennt?
 *
 * `null` = die Rubrik gehört zu keiner Tätigkeit, für die die Frage
 * entschieden ist. Dort gibt es keinen Schalter (siehe
 * `ENTSCHIEDENE_GEWERKE` in `materialanteil.ts`).
 */
export function materialStandard(
  kategorie: string | null | undefined,
  eigene?: Partial<Record<TaetigkeitId, MaterialStandard>> | null,
): MaterialStandard | null {
  const t = taetigkeitFuerKategorie(kategorie)
  if (!t) return null
  return eigene?.[t.id] ?? t.materialStandard
}

/** Vorlagenschlüssel für eine Tätigkeitsauswahl — ohne Dopplung. */
export function vorlagenFuerTaetigkeiten(ids: TaetigkeitId[]): string[] {
  const raus = new Set<string>()
  for (const id of ids) {
    for (const schluessel of TAETIGKEITEN.find(t => t.id === id)?.vorlagen ?? []) raus.add(schluessel)
  }
  return [...raus]
}
