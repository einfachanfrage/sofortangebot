// PM-103 — die Grenze des Altbau-Zuschlags. Antwort auf Engineerings
// A/B/C-Frage (Prüfmeister, 21.09.2026)
//
// Engineering hat die Grenze als WORTGRENZE gebaut: „Altbau" zählt, wenn es
// für sich steht, und zählt nicht, wenn ein anderes Wort daran klebt. Damit
// löst auch „Altbauwohnung" nichts mehr aus, und die Frage war, ob das so
// bleiben soll:
//   A — so lassen: nur das freistehende Wort zählt.
//   B — „Altbauwohnung"/„Altbauhaus" zählen mit, nur Raumnamen fallen raus.
//   C — strenger: es braucht ein Zustandswort daneben (Kalkputz, Stuck, krumm).
//
// ENTSCHIEDEN: B. Begründet an dem, was ich gemessen habe, nicht an Gefühl.
//
// Gemessen am 21.09. über `pruefeAltbau` direkt, Fall für Fall:
//
//   ZUSCHLAG  | Ist ein Altbau, Kalkputz, alles krumm.
//   ZUSCHLAG  | Wir sind hier im Altbau.
//   ZUSCHLAG  | Altgebäude, alles krumm.
//   kein      | Altbauwohnung, dritter Stock, Kalkputz.
//   kein      | Altbauhaus von 1910.
//   kein      | Altbauwohnzimmer, 5 mal 4.
//   kein      | Altbaufenster raus.
//   kein      | Im Altbau streichen.        [Raum heißt „Altbau"]
//
// 1. GEGEN A. Die heutige Grenze trennt nicht Zustand von Name, sie trennt
//    einfaches Wort von zusammengesetztem. „Wir sind hier im Altbau" ist
//    genauso wenig eine Zustandsaussage wie „Altbauwohnung" — beides sagt
//    etwas über das OBJEKT. Das eine feuert, das andere nicht, und der
//    Unterschied ist Typografie. Am deutlichsten zeigt es „Altgebäude":
//    löst aus, ohne dass ein Zustandswort danebensteht. Eine Grenze, die
//    zwei gleichwertige Sätze verschieden behandelt, hält keiner Rückfrage
//    eines Kunden stand, der 460,20 € erklärt bekommen will.
//
// 2. GEGEN C. C würde „Wir sind hier im Altbau" abschalten — den Satz, der
//    heute der tragende Auslöser ist. Und C braucht eine Liste von
//    Zustandswörtern; jedes fehlende Wort ist ein stiller Verlust gegen den
//    Betrieb, den niemand bemerkt, weil eine fehlende Zeile nicht auffällt.
//    Eine Whitelist, die man nur durch Schaden pflegt, ist der teurere Bau.
//
// 3. FÜR B, und warum es die Namensgefahr nicht zurückholt. Die zweite
//    Schranke — Raumnamen werden vor der Prüfung aus dem Text genommen —
//    bleibt unverändert. Heißt ein Raum „Altbauwohnung", ist das Wort weg,
//    bevor geprüft wird (gemessen, letzte Zeile oben, für „Altbau"). „Wohnung"
//    und „Haus" sind in einer Aufnahme nie ein Raum; „Zimmer", „Fenster",
//    „Tür", „Wand", „Decke" sind es sehr wohl, und die bleiben draußen.
//
// GEBAUT WIRD B ALS GESCHLOSSENE LISTE, nicht als Präfix `altbau*`. Ein
// Präfix ließe „Altbauwohnzimmer" und „Altbaufenster" wieder herein und
// machte PM-103 rückgängig. Es zählen genau: Altbauwohnung(en),
// Altbauhaus/Altbauhäuser — und weiterhin alles, was heute schon zählt.
//
// Die Sperrklinken unten halten beide Richtungen fest. Sie sind Engineerings
// Bauauftrag; bis sie gebaut sind, gilt A, und die Datei ist trotzdem grün.
import { describe, expect, it } from 'vitest'
import { pruefeAltbau } from '../vollstaendigkeit/maler-extras'

/** Feuert der Zuschlag? `raeume` sind die Raumnamen aus der Aufnahme. */
function zuschlag(text: string, raeume: Array<{ name?: string }> = [{ name: 'Wohnzimmer' }]): boolean {
  const pos: Array<{ beschreibung: string }> = []
  pruefeAltbau(pos as never, text.toLocaleLowerCase('de-DE'), raeume)
  return pos.some(p => /erschwerniszuschlag altbau/i.test(p.beschreibung))
}

describe('PM-103 — was den Altbau-Zuschlag auslösen darf', () => {
  describe('unverändert: die Aussage zählt', () => {
    it('„Ist ein Altbau, Kalkputz, alles krumm" — der Fall, für den es den Zuschlag gibt', () => {
      expect(zuschlag('Ist ein Altbau, Kalkputz, alles krumm.')).toBe(true)
    })
    it('„Wir sind hier im Altbau" — freistehend, ohne Zustandswort', () => {
      expect(zuschlag('Wir sind hier im Altbau.')).toBe(true)
    })
    it('„Altgebäude" zählt ebenfalls', () => {
      expect(zuschlag('Altgebäude, alles krumm.')).toBe(true)
    })
  })

  describe('unverändert: der Name zählt nicht — das ist PM-103 selbst', () => {
    it('„Altbauwohnzimmer" löst nichts aus', () => {
      expect(zuschlag('Altbauwohnzimmer, 5 mal 4, Höhe 2,50.')).toBe(false)
    })
    it('„Altbaufenster" und „Altbautür" lösen nichts aus', () => {
      expect(zuschlag('Altbaufenster raus.')).toBe(false)
      expect(zuschlag('Altbautür abschleifen.')).toBe(false)
    })
    it('ein Raum, der wirklich „Altbau" heißt, ist ein Name und keine Aussage', () => {
      expect(zuschlag('Im Altbau streichen.', [{ name: 'Altbau' }])).toBe(false)
    })
    it('ohne jede Altbau-Nennung entsteht nichts', () => {
      expect(zuschlag('Wohnzimmer, 5 mal 4, Höhe 2,50.')).toBe(false)
    })
  })

  // ── Sperrklinken für B — Bauauftrag an Engineering ──────────────────────
  // Bis B gebaut ist, schlagen diese fehl; danach schnappt die Klinke zu und
  // sie werden auf `it` zurückgestellt.
  describe('Entscheidung B — das Objekt zählt mit', () => {
    it.fails('OFFEN: „Altbauwohnung" ist eine Aussage über das Objekt und zählt', () => {
      expect(zuschlag('Altbauwohnung, dritter Stock, Kalkputz.')).toBe(true)
    })
    it.fails('OFFEN: „Altbauhaus" zählt ebenso', () => {
      expect(zuschlag('Altbauhaus von 1910, alles krumm.')).toBe(true)
    })
    it.fails('OFFEN: auch in der Mehrzahl — „Altbauwohnungen", „Altbauhäuser"', () => {
      expect(zuschlag('Wir machen drei Altbauwohnungen.')).toBe(true)
      expect(zuschlag('Zwei Altbauhäuser in der Straße.')).toBe(true)
    })
  })

  describe('Entscheidung B — und was sie NICHT aufmacht', () => {
    // Heute schon grün — die Raumnamen-Schranke greift hier bereits, weil sie
    // ganze Wörter schneidet. Genau das trägt B: der Name ist weg, bevor
    // geprüft wird. Muss nach B grün bleiben.
    it('heißt der Raum „Altbauwohnung", bleibt es ein Name', () => {
      expect(zuschlag('Die Altbauwohnung streichen.', [{ name: 'Altbauwohnung' }])).toBe(false)
    })
    // Diese beiden sind heute schon grün und müssen es NACH B bleiben — sie
    // sind die Gegenprobe gegen ein Präfix `altbau*`.
    it('nach B weiterhin nichts: „Altbauwohnzimmer"', () => {
      expect(zuschlag('Altbauwohnzimmer, 5 mal 4.')).toBe(false)
    })
    it('nach B weiterhin nichts: „Altbaufenster"', () => {
      expect(zuschlag('Altbaufenster raus.')).toBe(false)
    })
  })
})
