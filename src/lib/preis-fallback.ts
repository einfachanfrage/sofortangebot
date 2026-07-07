// Deterministischer Preis-Fallback für die Maler-Kernpositionen.
//
// Warum: Die Preiszuweisung läuft über GPT (es echot Preise zu den Engine-
// Positionen zurück). Wenn GPT weniger/andere Items liefert, landet eine
// Position sonst bei 0 € — die "Nullerpositionen" aus dem Beta-Test.
// Dieser Fallback greift NUR, wenn kein Preis gefunden wurde, und garantiert,
// dass die Kernpositionen nie stumm auf 0 € stehen.
//
// Die Beträge spiegeln die Marktpreise aus dem angebot-generieren-Prompt.
// Reihenfolge = Priorität: spezifischere Muster zuerst.

interface Regel { test: RegExp; unit: string; preis: number }

const MALER_FALLBACK: Regel[] = [
  // Wände / Decke / Boden
  { test: /wand(fläche|flächen)?\s*streich|wände\s*streich/i, unit: 'm²', preis: 9.5 },
  { test: /dachschräge/i, unit: 'm²', preis: 10.5 },
  { test: /decken(fläche|spiegel)?\s*streich|decke\s*streich/i, unit: 'm²', preis: 8.5 },
  { test: /boden\s*(schütz|abdeck)/i, unit: 'm²', preis: 2.5 },
  { test: /boden\s*streich/i, unit: 'm²', preis: 8.0 },
  // Tapete / Raufaser / Spachteln
  { test: /tapete\s*(entfern|ablös|abnehm)/i, unit: 'm²', preis: 4.0 },
  { test: /(raufaser|vliestapete|tapete)\s*(aufzieh|tapezier)|aufzieh/i, unit: 'm²', preis: 12.0 },
  { test: /(raufaser|vliestapete|tapete)\s*streich/i, unit: 'm²', preis: 9.5 },
  { test: /spachtel|glätten|q[234]/i, unit: 'm²', preis: 8.0 },
  { test: /grundier|grundierung/i, unit: 'm²', preis: 4.0 },
  { test: /schleifen/i, unit: 'm²', preis: 6.0 },
  // Sockelleisten (lfdm)
  { test: /sockel(leiste)?n?\s*(abkleb|abdeck)/i, unit: 'lfdm', preis: 1.5 },
  { test: /sockel(leiste)?n?\s*(streich|lackier)/i, unit: 'lfdm', preis: 3.5 },
  { test: /sockel(leiste)?n?\s*(abschleif|entfern)/i, unit: 'lfdm', preis: 2.5 },
  // Türen / Fenster / Heizkörper (Stück)
  { test: /(türen?|zargen?|türzargen?)\s*lackier/i, unit: 'Stück', preis: 45.0 },
  { test: /türen?\s*(abschleif|schleif)/i, unit: 'Stück', preis: 35.0 },
  { test: /türen?\s*grundier/i, unit: 'Stück', preis: 35.0 },
  { test: /fenster\s*(lack|streich)/i, unit: 'Stück', preis: 45.0 },
  { test: /fenster\s*(abschleif|schleif)/i, unit: 'Stück', preis: 35.0 },
  { test: /fenster\s*grundier/i, unit: 'Stück', preis: 35.0 },
  { test: /heizkörper\s*lackier/i, unit: 'Stück', preis: 45.0 },
]

/**
 * Liefert einen Fallback-Preis für eine Maler-Position, oder null wenn unbekannt.
 * Raum-Suffix ("— Wohnzimmer") wird ignoriert.
 */
export function malerFallbackPreis(title: string, unit: string): number | null {
  const t = title.toLowerCase().split(/\s+[-–—]\s+/)[0].trim()
  for (const r of MALER_FALLBACK) {
    if (r.unit === unit && r.test.test(t)) return r.preis
  }
  return null
}
