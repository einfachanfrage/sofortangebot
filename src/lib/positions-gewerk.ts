// Welches Gewerk bepreist eine Position?
//
// ── Warum das hier liegt und nicht im API-Endpunkt (12.09.2026) ───────────
//
// Diese Funktion ist reine Logik ohne Datenbank, Netz oder Next.js — sie
// stand trotzdem in `src/app/api/angebot-generieren/route.ts`. Zwei Folgen:
//
//  • Der Test `entscheidungen-31-08.test.ts` musste die halbe Next.js-Route
//    nachladen, um EINE Zeile zu prüfen. Der Import hat erst 2,3 s gebraucht,
//    dann die 5-Sekunden-Grenze gerissen, und nach dem Hochsetzen auf 20 s
//    auch die. Ein Test, der zufällig rot wird, bringt einem bei, rote Läufe
//    wegzuklicken — deshalb die Ursache statt der Zeit.
//
//  • `scripts/vokabular-abgleich.mjs` hielt eine KOPIE dieser Funktion, weil
//    sie aus einem Node-Skript nicht importierbar war. Der Kopfkommentar dort
//    warnt selbst davor, dass die Kopie veralten kann. Jetzt ist sie
//    importierbar.
//
// Der Endpunkt exportiert sie unverändert weiter, damit bestehende Importe
// nichts merken.

export function gewerkFuerPosition(beschreibung: string, hauptgewerk?: string): string | undefined {
  const text = beschreibung.toLocaleLowerCase('de-DE')
  const istBoden = /vinyl|laminat|parkett|teppich|kork|linoleum|designboden|bodenbelag|trittschall|altbelag|sockelleisten montier|boden (?:verleg|entfern|schleif)|untergrund schleifen.*kleberreste|kleberreste.*schleifen/i.test(text)
  if (istBoden) return 'boden_parkett'
  // PM-024/PM-026-Nachtest (Sandy, 2026-08-30): „Boden schützen" enthält kein
  // einziges Maler-Wort — kein „streichen", kein „abdecken". In einem reinen
  // Malerauftrag fiel das nie auf, weil dann ohnehin auf 'maler' gefiltert
  // wurde. In einem GEMISCHTEN Angebot (Laminat + Streichen) landet die
  // Position dagegen beim Hauptgewerk 'boden_parkett' — und der Katalogeintrag
  // „Boden abdecken (Abdeckvlies)" steht unter „Maler – Vorbereitung & Schutz".
  // Ergebnis: kein Kandidat, 0,00 €, „Preis fehlt" bei einer der häufigsten
  // Positionen überhaupt. Bodenschutz ist Vorbereitung des Malers, auch wenn
  // das Wort „Boden" darin vorkommt.
  const istMalerVorbereitung = /boden\s*sch[üu]tz|bodenschutz|abdeckvlies|abdeckfolie|m[öo]bel\s*abdeck/i.test(text)
  if (istMalerVorbereitung) return 'maler'
  const istMaler = /wand|decke|streich|anstrich|tapete|raufaser|spachtel|schleifen|grundier|abdeck|abkleb/i.test(text)
  if (istMaler) return 'maler'
  // Dieselbe Falle wie bei „Boden schützen": „Erschwerniszuschlag Raumhöhe
  // > 3m — Büro" enthält kein einziges Maler-Wort. In einem reinen
  // Malerauftrag fiel das nie auf, in einem gemischten Angebot landete der
  // Zuschlag beim Hauptgewerk „boden_parkett" und fand seinen Katalogeintrag
  // unter „Maler – Erschwernisse & Zuschläge" nicht mehr. Alle Zuschläge,
  // die die Vollständigkeitsprüfung erzeugt, sind Maler-Zuschläge.
  if (/^\s*erschwerniszuschlag\b/i.test(text)) return 'maler'
  return hauptgewerk
}
