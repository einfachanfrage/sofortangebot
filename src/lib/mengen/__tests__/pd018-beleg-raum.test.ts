// PD-018 Punkt 1 / PM-100 — der Beleg-Satz unter einer Rückfrage muss zu dem
// Raum gehören, nach dem gefragt wird.
//
// Gemessen in Fall 10 des Live-Laufs vom 16.09.2026: Ein Diktat mit drei
// Räumen enthält den Satz „im Flur gehen drei Türen ab". Gefragt wurde
// „Wie viele Türen hat Wohnzimmer?" — belegt mit genau diesem Satz und dem
// Vorschlag „3 Türen". Das Ergebnis stimmte, der Weg nicht: Wer die Aufnahme
// nicht mehr im Kopf hat, drückt „Stimmt ✓", und danach hat das Wohnzimmer
// drei Türen und der Flur keine.
//
// Die Regel des Product Designers: Nennt der Beleg-Satz einen anderen Raum
// als die Frage, gibt es KEINEN Vorschlag. Eine nackte Frage ist ehrlicher
// als ein falscher Vorschlag mit Häkchen daneben.
import { describe, expect, it } from 'vitest'
import { findeGesagtenWert } from '../gesagte-werte'

// Der Wortlaut aus der Einsprech-Liste, Fall 10 — aber so, wie die
// Spracherkennung ihn liefert: durchgehend, ohne Satzpunkte. Genau daran ist
// die alte Satzgrenze gescheitert.
const DIKTAT_OHNE_PUNKTE =
  'Wohnung komplett streichen, Wohnzimmer vier mal fünf, Schlafzimmer drei fünfzig mal vier, ' +
  'Flur eins zwanzig mal sechs, überall zwo fünfzig hoch, Wände und Decken zweimal weiß, ' +
  'im Flur gehen drei Türen ab'

const RAEUME = ['Wohnzimmer', 'Schlafzimmer', 'Flur']

describe('PM-100 – der Beleg-Satz gehört dem Raum, nach dem gefragt wird', () => {
  it('schlägt dem Wohnzimmer keine Türen vor, die im Flur stehen', () => {
    expect(findeGesagtenWert('anzahl_tueren', DIKTAT_OHNE_PUNKTE, 'Wohnzimmer', RAEUME)).toBeNull()
  })

  it('schlägt dem Schlafzimmer ebenso wenig vor', () => {
    expect(findeGesagtenWert('anzahl_tueren', DIKTAT_OHNE_PUNKTE, 'Schlafzimmer', RAEUME)).toBeNull()
  })

  it('bietet die drei Türen dort an, wo sie gesagt wurden — im Flur', () => {
    const treffer = findeGesagtenWert('anzahl_tueren', DIKTAT_OHNE_PUNKTE, 'Flur', RAEUME)
    expect(treffer?.wert).toBe(3)
    expect(treffer?.zitat).toContain('Flur')
    // SEINE Worte, nicht unsere umgeschriebene Fassung.
    expect(treffer?.zitat).toContain('drei Türen')
    // Und kein fremder Raum im Beleg.
    expect(treffer?.zitat).not.toContain('Wohnzimmer')
  })

  it('nimmt auch mit Satzpunkten den Wert nicht aus dem fremden Raum', () => {
    const mitPunkten =
      'Wohnzimmer vier mal fünf. Schlafzimmer drei fünfzig mal vier. Im Flur gehen drei Türen ab.'
    expect(findeGesagtenWert('anzahl_tueren', mitPunkten, 'Wohnzimmer', RAEUME)).toBeNull()
    expect(findeGesagtenWert('anzahl_tueren', mitPunkten, 'Flur', RAEUME)?.wert).toBe(3)
  })

  it('verliert den Rückbezug nicht: ein Raum, der zweimal genannt wird, behält seinen Wert', () => {
    // Die Gegenprobe zur Trennung — sie darf nicht dazu führen, dass ein
    // später nachgereichter Wert seinem Raum nicht mehr zugeordnet wird.
    const transkript = 'Im Wohnzimmer und in der Küche streichen. Im Wohnzimmer sind drei Fenster drin.'
    const treffer = findeGesagtenWert('anzahl_fenster', transkript, 'Wohnzimmer', ['Wohnzimmer', 'Küche'])
    expect(treffer?.wert).toBe(3)
    expect(treffer?.zitat).toContain('drei Fenster')
  })

  it('lässt der Küche nichts durchgehen, was im Wohnzimmer steht', () => {
    const transkript = 'Im Wohnzimmer und in der Küche streichen. Im Wohnzimmer sind drei Fenster drin.'
    expect(findeGesagtenWert('anzahl_fenster', transkript, 'Küche', ['Wohnzimmer', 'Küche'])).toBeNull()
  })
})
