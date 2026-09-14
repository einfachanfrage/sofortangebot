// Der gesprochene Ausführungstermin.
//
// ── CoS-E-019 / TN-045 (Manfred) ──────────────────────────────────────────
//
// *„Gesprochener Ausführungstermin (‚in 3 Wochen fertig') wird nirgends
// gespeichert, kein Feld dafür vorgesehen."*
//
// Zwei Seiten müssen stimmen, und die zweite ist die, an der man sich die
// Finger verbrennt:
//   • Was gesagt wurde, muss ankommen.
//   • Was NICHT gesagt wurde, darf nicht erfunden werden. Ein Termin, den
//     niemand genannt hat, ist schlimmer als gar keiner — er sieht aus wie
//     eine Zusage.
import { describe, expect, it } from 'vitest'
import { lesTermin, terminNotiz } from '../termin'

// Fester Stichtag, damit „am 15. Oktober" nicht jedes Jahr ein anderer Test ist.
const HEUTE = new Date('2026-09-13T00:00:00Z')
const lies = (t: string) => lesTermin(t, HEUTE)

describe('Was gesagt wurde, kommt an', () => {
  it.each([
    ['Wohnzimmer streichen, in drei Wochen fertig.', 'spanne', 'in drei Wochen'],
    ['Bad fliesen, in 2 Wochen.', 'spanne', 'in 2 Wochen'],
    ['Muss in 10 Tagen fertig sein.', 'spanne', 'in 10 Tagen'],
    ['In einem Monat fertig.', 'spanne', 'In einem Monat'],
    ['Innerhalb von zwei Wochen.', 'spanne', 'Innerhalb von zwei Wochen'],
    ['Ende Oktober passt.', 'ungefaehr', 'Ende Oktober'],
    ['Nächste Woche anfangen.', 'ungefaehr', 'Nächste Woche'],
    ['KW 42 wäre gut.', 'ungefaehr', 'KW 42'],
    ['Bis Freitag fertig.', 'ungefaehr', 'Bis Freitag'],
  ])('„%s"', (text, art, wortlaut) => {
    const t = lies(text)
    expect(t?.art).toBe(art)
    // Der Wortlaut ist das Ergebnis, nicht eine Umformulierung: Der
    // Handwerker soll SEINEN Satz wiederlesen.
    expect(t?.wortlaut).toBe(wortlaut)
  })
})

describe('Ein genanntes Datum wird zum Datum — sonst keins', () => {
  it.each([
    ['Bis zum 30. Oktober bitte.', '2026-10-30'],
    ['Am 15. Oktober fangen wir an.', '2026-10-15'],
    ['Bis zum 30.10. fertig.', '2026-10-30'],
    ['Ab 1.11. frei.', '2026-11-01'],
    ['Am 15.3.2027 Termin.', '2027-03-15'],
  ])('„%s" → %s', (text, datum) => {
    expect(lies(text)?.datum).toBe(datum)
  })

  it('schiebt einen schon vergangenen Monat ins nächste Jahr', () => {
    // Am 13.09. gesagt: „am 15. März" kann nur der kommende März sein.
    expect(lies('Am 15. März soll es losgehen.')?.datum).toBe('2027-03-15')
  })

  it('rechnet aus einer Spanne KEIN Datum', () => {
    // Die wichtigste Zusicherung dieser Datei. „In drei Wochen" rechnet sich
    // vom Tag des Diktats — nicht vom Tag, an dem der Kunde zusagt, und
    // zwischen beiden liegen oft Wochen. Ein errechnetes Datum sähe aus wie
    // eine Verpflichtung und wäre keine.
    expect(lies('in drei Wochen fertig')?.datum).toBeNull()
    expect(lies('Ende Oktober passt.')?.datum).toBeNull()
    expect(lies('KW 42 wäre gut.')?.datum).toBeNull()
  })
})

describe('Was niemand gesagt hat, wird nicht erfunden', () => {
  it.each([
    'Wohnzimmer vier mal fünf Meter, Höhe zwei fünfzig. Wände zweimal streichen, Decke einmal.',
    'Schlafzimmer, alte Tapete runter, die Wände spachteln, neue Raufaser aufziehen und zweimal weiß streichen. 42 Quadratmeter Wandfläche.',
    'Büro, 24 Quadratmeter. Alter Teppichboden ist verklebt, muss raus, Kleberreste abschleifen.',
    'Kinderzimmer 3,50 mal 4 Meter. Estrich grundieren, Ausgleichsmasse fünf Millimeter, dann Laminat verlegen.',
    'Drei Zimmer, insgesamt 120 Quadratmeter, Decke in 2 Lagen spachteln.',
    'Treppenhaus über 4 Etagen, Gerüst nötig.',
    'Bad 8 Quadratmeter, Fliesen bis 2 Meter Höhe.',
    'Frau Krüger, Bochum. Altbau, bewohnt.',
  ])('kein Termin in: „%s"', text => {
    // Echte Diktate voller Zahlen und Maßangaben. Wer hier etwas erkennt,
    // hängt dem Handwerker einen Termin an, den er nie genannt hat.
    expect(lies(text)).toBeNull()
  })
})

describe('Der Satz für die interne Notiz', () => {
  it('zitiert den Handwerker und ergänzt das Datum nur, wenn es eines gibt', () => {
    // In Anführungszeichen, damit sichtbar ist: Das ist SEIN Satz, keine
    // Auslegung der App.
    expect(terminNotiz(lies('Bis zum 30. Oktober bitte.')!))
      .toBe('Termin aus dem Diktat: „Bis zum 30. Oktober" (30.10.2026)')
    expect(terminNotiz(lies('in drei Wochen fertig')!))
      .toBe('Termin aus dem Diktat: „in drei Wochen"')
  })
})
