// ── Untergrund-Regeln für Lackarbeiten ────────────────────────────────────
//
// Prüfmeister, 07.09.2026: *„Der Farbwunsch bestimmt den Farbton. Der
// Untergrund bestimmt das Material."*
//
// Zwei Fragen hängen an dieser Regel, und beide werden an mehreren Stellen
// gebraucht — die Fensterbank entsteht in der Engine, die Sockelleiste in der
// Vollständigkeitsprüfung und noch einmal im Sicherheitsnetz der Route. Damit
// dieselbe Frage nicht dreimal privat beantwortet wird (die Fehlerfamilie
// dieser Woche), steht das Urteil hier einmal.

/**
 * Bauteile, die gar nicht gestrichen werden: folierte Kunststoffleisten,
 * Naturstein- und PVC-Fensterbänke. Ein Anstrich hält darauf nicht — er wird
 * bezahlt und blättert.
 */
const NICHT_STREICHBAR = /folier|kunststoff|pvc|naturstein|marmor|granit|alu(?:minium)?|edelstahl|kunstharz|werkstein/i

/** Das Bauteil, um das es geht — nur diese beiden Wörter zählen als Bezug. */
const BAUTEIL = /sockelleist|fu(?:ß|ss)leist|fensterb(?:ä|a|ae)nk/i

/**
 * Roher, abgelaugter oder neuer Holzuntergrund braucht einen Vorlack, sonst
 * schlägt der Deckanstrich fleckig an — dieselbe Fachlogik wie die
 * Grundierung nach einer Q2-Vollflächenspachtelung.
 */
const ROHES_HOLZ = /\broh(?:es|em|e|er)?\b|abgelaug|unbehandel|blank\w*\s+holz|neue?\s+(?:sockelleist|fu(?:ß|ss)leist|fensterb)|unlackier|angeschliffen\w*\s+bis\s+aufs\s+holz/i

/** Sätze, die das Bauteil überhaupt erwähnen. */
function bauteilSaetze(text: string): string[] {
  return (text ?? '').split(/[.!?;\n]+/).filter(s => BAUTEIL.test(s))
}

/**
 * Nennt das Diktat für dieses Bauteil einen Werkstoff, der sich nicht
 * streichen lässt? Bewusst satzweise geprüft: „Naturstein im Bad" darf keine
 * Fensterbank drei Sätze später betreffen — dieselbe Lehre wie PM-033.
 * Gibt den gefundenen Werkstoff zurück, damit der Hinweis ihn nennen kann.
 */
export function nichtStreichbarerWerkstoff(text: string): string | null {
  for (const satz of bauteilSaetze(text)) {
    const treffer = NICHT_STREICHBAR.exec(satz)
    if (treffer) return treffer[0]
  }
  return null
}

/** Braucht der Lackanstrich einen Vorlack (rohes/abgelaugtes Holz)? */
export function brauchtVorlack(text: string): boolean {
  return bauteilSaetze(text).some(satz => ROHES_HOLZ.test(satz))
}

/**
 * Der Hinweis, den der Handwerker sieht. Einmal formuliert, nicht dreimal.
 *
 * Bewusst als Annahme AN der Position statt als Löschung: Der Prüfmeister
 * hätte hier lieber gar keine Position und nur eine Rückfrage. Eine bestellte
 * Leistung stillschweigend zu entfernen ist aber genau der Fehler, den wir
 * diese Woche viermal repariert haben (PM-030, PM-012, PM-037) — und ein
 * falsch erkannter Werkstoff würde dann Geld kosten, das niemandem auffällt.
 * Die Position bleibt sichtbar, die Rückfrage steht daneben. Wenn er es
 * anders will, ist es eine Zeile.
 */
const LESBAR: Array<[RegExp, string]> = [
  [/folier/i, 'foliertem Kunststoff'],
  [/kunststoff/i, 'Kunststoff'],
  [/pvc/i, 'PVC'],
  [/naturstein|werkstein/i, 'Naturstein'],
  [/marmor/i, 'Marmor'],
  [/granit/i, 'Granit'],
  [/alu/i, 'Aluminium'],
  [/edelstahl/i, 'Edelstahl'],
  [/kunstharz/i, 'Kunstharz'],
]

export function nichtStreichbarHinweis(werkstoff: string): string {
  const wort = LESBAR.find(([m]) => m.test(werkstoff))?.[1] ?? werkstoff
  return `Laut Aufnahme aus ${wort} — solche Bauteile werden normalerweise nicht gestrichen, `
    + 'ein Anstrich hält darauf nicht. Bitte prüfen und die Position ggf. entfernen.'
}

/** Der Vorlack-Hinweis, wenn kein eigener Katalogeintrag in der Einheit existiert. */
export const VORLACK_HINWEIS =
  'Rohes/abgelaugtes Holz: Vorlack einplanen, sonst schlägt der Deckanstrich fleckig an.'

// ── „Sockel in Wandfarbe" (PM-012) ───────────────────────────────────────
//
// Ein völlig gängiger Stil: Die Wand läuft optisch bis zum Boden durch. Der
// Wunsch bleibt erfüllt — mit Buntlack im Wandfarbton abgetönt, nicht mit der
// Wandfarbe selbst. Der Farbwunsch bestimmt den Farbton, der Untergrund das
// Material. Der Handwerker soll beides auf der Position sehen.
const FARBTON_WIE_WAND =
  /(?:gleiche[nrms]?|selbe[nrms]?)\s+(?:farbe|farbton)\s+wie\s+(?:die\s+)?w[äa]nd|wie\s+die\s+wandfarbe|in\s+wandfarbe/i

export function farbtonWieWand(text: string): boolean {
  return bauteilSaetze(text).some(satz => FARBTON_WIE_WAND.test(satz))
}

export const FARBTON_HINWEIS =
  'Farbton wie die Wandfläche — als Buntlack abgetönt, nicht mit Wandfarbe gestrichen (hält dort nicht).'

// ── Ausnahme: der geputzte Sockel (Prüfmeister, 07.09.2026) ──────────────
//
// „Damit die Regel nicht zu breit wird": Ein geputzter oder gespachtelter
// Sockel ist kein Holzbauteil — der bekommt Dispersion, keinen Lack.
//
// Diese Entscheidung braucht den Diktattext, das Material-Mapping sieht aber
// nur den Positionstitel. Deshalb wird sie hier getroffen, wo der Text ist,
// und als Annahme AN der Position hinterlegt — das Mapping liest sie dort
// wieder. Eine zweite Kopie des Urteils im Mapping wäre genau die
// Doppelstelle, die diese Woche viermal Geld gekostet hat.
const MINERALISCH = /geputzt|verputzt|gespachtelt|\bputz\b|beton|mineralisch/i

export function sockelIstMineralisch(text: string): boolean {
  return (text ?? '').split(/[.!?;\n]+/)
    .some(satz => /sockel/i.test(satz) && MINERALISCH.test(satz))
}

/** Kennzeichen, an dem das Material-Mapping den mineralischen Sockel erkennt. */
export const MINERALISCH_HINWEIS =
  'Sockel ist geputzt/gespachtelt, kein Holzbauteil — Dispersion statt Lack.'

/** Trifft der Hinweis oben auf einen Kontexttext zu? */
export function kontextNenntMineralisch(kontext: string | null | undefined): boolean {
  return MINERALISCH.test(kontext ?? '')
}
