// Aus fünf genannten Zahlen werden vierzig — die Rechnung dahinter.
//
// CoS-E-053, Schritt 3/4 aus `docs/preisliste-konzept.md` (Fassung 3):
// *„Aus den Ankern skaliert die App die übrigen gebrauchten Preise. Die
// VERHÄLTNISSE im Standardkatalog sind Handwerkswissen, das NIVEAU kommt aus
// seinen Zahlen."*
//
// Grundlage ist der Entwurf des Product Designers (`dc-102-preise-prototyp.html`)
// und dessen fachliche Durchsicht durch den Prüfmeister (PD-009 in
// `pruefmeister-notizen-fuer-designer.md`, 15.09.2026). Alle sieben Funde von
// dort sind hier eingebaut; wo ich von einem abweiche, steht es dabei.
//
// ── Der Fund, der die Bauweise bestimmt hat (PD-009 §4) ────────────────────
//
// Im Prototyp standen die Basiswerte der Anker als Zahlen in der Tabelle, und
// sie wichen vom Standardkatalog ab: Vliestapete 9,00 € gegen echte 18,00 €.
// Der Faktor ist `mein / basis` — eine falsche Basis verzieht damit **jede**
// abgeleitete Zeile dieser Tätigkeit. Bei der Tapete hätte ein Betrieb, der
// seine echten 18,00 € einträgt, den Faktor 2,0 bekommen: „Raufaser kleben"
// wäre bei 15,20 € statt 10,00 € gelandet.
//
// Der Prüfmeister: *„Die Basiswerte müssen beim Einbau aus `default-prices.ts`
// gezogen werden, nicht abgeschrieben."* Genau so ist es gebaut — **keine
// einzige Basiszahl steht in dieser Datei.** Jede Zeile nennt ihren
// Katalogtitel, der Preis kommt aus `DEFAULT_PRICES`.
//
// Damit erledigt sich sein zweiter Fund derselben Stelle von selbst: Im
// Prototyp waren Decke 2x und Wand 2x beide 10,00 €. Über Kopf ist teurer —
// Leiter, Nackenhaltung, schlechtere Sicht auf den Randanschluss. Der Katalog
// hat es richtig (9,50 gegen 11,00), und wer aus dem Katalog liest, kann es
// nicht mehr falsch abschreiben.
//
// ── Die Benennung (PD-009 §1) ─────────────────────────────────────────────
//
// Der Prototyp nannte die zwei Arten `'flaeche'` und `'zeit'`. `'flaeche'`
// hieß dort aber nicht „aus der Fläche", sondern „skaliert mit dem Ankerpreis"
// — und der Anker beim Lackieren ist ein STÜCKPREIS. Deshalb stand
// `Fenster lackieren` auf `'flaeche'` und hatte mit Fläche nichts zu tun.
//
// Das fiel genau dort auf die Füße, wo Manfred zitiert wurde: *„Ein Heizkörper
// hat mit dem Quadratmeterpreis nichts zu tun, der kommt aus der Zeit"* stand
// als Kommentar über einer Tabelle, in der `Heizkörper lackieren` auf
// `'flaeche'` steht. Es sah aus wie ein Fehler und war keiner.
//
// Die Arten heißen jetzt `anker` und `zeit`. Die Prüffrage dazu, wörtlich vom
// Prüfmeister — sie steht hier, weil jede neue Zeile sie beantworten muss:
//
//   > Wenn der Betrieb seinen Ankerpreis um 20 % anhebt — muss diese Zeile
//   > mitgehen? Dann `anker`. Hängt sie stattdessen daran, wie lange einer
//   > dafür braucht? Dann `zeit`.

import { DEFAULT_PRICES } from './default-prices'
import type { TaetigkeitId } from './taetigkeiten'

/** Woraus eine abgeleitete Zeile ihren Preis bezieht. */
export type Ableitungsart = 'anker' | 'zeit'

/** Wie das Material dieser Zeile behandelt wird. */
export type MaterialArt = 'wahl' | 'zubehoer' | null

export interface AbleitungsZeile {
  art: Ableitungsart
  material: MaterialArt

  /**
   * Der Katalogtitel.
   *
   * Bei `art: 'anker'` **Pflicht** — von dort kommen Basispreis UND Einheit.
   * Bei `art: 'zeit'` nur setzen, wenn es wirklich **dieselbe Arbeit in
   * derselben Einheit** ist. Dann dient er als Gegenprobe (§7).
   *
   * ── Warum die Unterscheidung so scharf sein muss ────────────────────────
   * Im ersten Anlauf hatte ich jeder Zeit-Zeile einen ungefähr passenden
   * Katalogtitel gegeben, damit sie eine Einheit hat. Der eigene Test hat
   * drei Fehlgriffe gefunden, und der dritte war der teuerste:
   *
   *   „Boden reinigen" · 0,02 h/m² · Zwilling „Baustelle kehren / saugen
   *   nach Verlegung" — 35,00 € **pro Pauschale**.
   *
   * Die Einheit kam aus dem Zwilling, gerundet wird eine Pauschale auf 5 € —
   * **Ergebnis: 0,00 €.** Eine Zeile, die Arbeit beschreibt und nichts
   * kostet, also genau das, wogegen der Versand-Riegel gebaut wurde.
   * Dieselbe Sorte Fehler bei „Steckdosen" (Zwilling war Abkleben, nicht
   * Ab- und Anbauen) und „Gerüstplane" (Zwilling war ein Gerüst-Aufpreis).
   *
   * Lehre: Ein Zwilling, der „so ungefähr passt", ist kein Zwilling. Eine
   * Zeit-Zeile bringt Titel und Einheit selbst mit.
   */
  katalogTitel?: string

  /** Nur bei `art: 'zeit'`: Stunden je Einheit. */
  stunden?: number
  /** Nur bei `art: 'zeit'` ohne Zwilling: eigener Titel und eigene Einheit. */
  titel?: string
  einheit?: string

  /** Zusatz für die Herkunftszeile, wo die Zahl mehr Erklärung braucht. */
  hinweis?: string
  /**
   * Abweichender Titel fürs Onboarding. Nur setzen, wo der Katalogtitel
   * fachlich falsch oder für den Bildschirm zu lang ist.
   */
  zeigeAls?: string
}

export interface Anker {
  taetigkeit: TaetigkeitId
  /** Der Katalogtitel des Ankers — auch hier keine Zahl. */
  katalogTitel: string
  /** Kurzform für die Herkunftszeile: „abgeleitet aus: Wand 2x". */
  kurz: string
  zeilen: AbleitungsZeile[]
}

// ── Die Zeitwerte (PD-009 §3) ─────────────────────────────────────────────
//
// Bei `zeit` ist der Wert eine Stundenzahl, multipliziert mit dem Stundensatz
// des Betriebs. Der Prüfmeister hat alle sechs gegen den Katalog nachgerechnet
// und fünf korrigiert. Die Zahlen unten sind seine, nicht die des Prototyps:
//
//   Sockelleisten abkleben   0,04 → 0,015 h/lfm  (0,04 h = 2,4 Min je Meter;
//                                   ein 18-m-Zimmer wäre eine Dreiviertelstunde
//                                   nur Kreppband. Katalog: 0,80 €/lfdm)
//   Boden reinigen           0,05 → 0,02  h/m²
//   Steckdosen               0,15 → 0,08  h/Stück (Abdeckung ab und dran: 5 Min)
//   Gerüstplane              0,06 → 0,03  h/m²   (100 m² ≈ 3 Mannstunden)
//   Übergangsprofil          0,35 → 0,29  h/Stück
//   Heizkörper abkleben      0,30 → 0,35  h/Stück — als EINZIGE nach OBEN
//
// Zum Heizkörper ist der Grund wichtiger als der Betrag, und er gilt für alle:
// *„Für jede Position, die es auch im Standardkatalog gibt, müssen beide Wege
// ungefähr dieselbe Zahl liefern. Sonst bekommt ein Betrieb, der die Nick-Seite
// durchgeht, einen anderen Preis als einer, der sie wegklickt — für dieselbe
// Arbeit, in derselben App."* Genau das prüft `pruefeGegenKatalog()` unten.

export const ANKER: readonly Anker[] = [
  {
    taetigkeit: 'maler_innen',
    katalogTitel: 'Wand streichen 2x Anstrich',
    kurz: 'Wand 2x',
    zeilen: [
      // PD-009 §5: Die 63 % aus dem Katalog gegen Manfreds 75 % sind kein
      // Widerspruch, sondern hängen an einer Frage — steckt die Vorbereitung
      // im m²-Preis? Bei uns nicht, sie zählt extra. Der Prüfmeister:
      // „Das ist nichts zum Entscheiden, sondern etwas zum Anzeigen." Deshalb
      // steht es als Hinweis an der Zeile und nicht als Zahl im Code.
      { katalogTitel: 'Wand streichen 1x Anstrich', art: 'anker', material: 'wahl',
        hinweis: 'ohne Vorbereitung, die zählt extra' },
      { katalogTitel: 'Decke streichen 2x Anstrich', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Decke streichen 1x Anstrich', art: 'anker', material: 'wahl',
        hinweis: 'ohne Vorbereitung, die zählt extra' },
      { katalogTitel: 'Grundieren (Tiefengrund)', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Fläche spachteln (Flächenspachtel)', art: 'anker', material: 'zubehoer' },
      { katalogTitel: 'Schleifen von Hand', art: 'anker', material: null },
      { katalogTitel: 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Boden abdecken (Abdeckvlies)', art: 'anker', material: 'zubehoer' },
      // PD-009 §2, dritter Fund: „Steckdosen abklemmen" war richtig als `zeit`
      // eingeordnet, hieß aber falsch. *„Abklemmen ist Elektroarbeit. Der Maler
      // nimmt die Abdeckung ab und wieder dran. So wie es dasteht, steht auf
      // dem Kundenangebot eine Leistung, die der Betrieb gar nicht erbringen
      // darf."* Deshalb der Katalogtitel („Abkleben Schalter / Steckdosen"
      // trifft es nicht) und ein eigener Anzeigetitel.
      //
      // Kein Katalogzwilling: „Abkleben Schalter / Steckdosen" (3,00 €) ist
      // das ABKLEBEN, nicht das Ab- und Anbauen. Zwei Arbeiten, ein ähnlicher
      // Wortlaut — und genau deshalb kein Vergleichsmaßstab.
      { art: 'zeit', stunden: 0.08, material: 'zubehoer',
        titel: 'Steckdosen-Abdeckungen ab- und anbauen', einheit: 'Stück' },
      { katalogTitel: 'Sockelleisten abkleben', art: 'zeit', stunden: 0.015, material: 'zubehoer' },
      // Kein Katalogzwilling — die Zeile gibt es dort nicht. Der Richtwert
      // des Prüfmeisters vom 12.09. ist 18,00 €; 0,35 h × 52 € = 18,20 €.
      { art: 'zeit', stunden: 0.35, material: 'zubehoer',
        titel: 'Heizkörper abkleben', einheit: 'Stück' },
    ],
  },
  {
    taetigkeit: 'tapezieren',
    katalogTitel: 'Vliestapete tapezieren',
    kurz: 'Vliestapete',
    zeilen: [
      { katalogTitel: 'Raufaser tapezieren ohne Anstrich', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Tapete ablösen (einlagig)', art: 'anker', material: null },
      { katalogTitel: 'Grundieren (Tiefengrund)', art: 'anker', material: 'zubehoer' },
    ],
  },
  {
    // PD-010 (Prüfmeister, 15.09.2026) — der Anker fürs Lackieren.
    //
    // Drei Gründe, seine Reihenfolge:
    //  1. Es ist die Zeile, die die ENGINE selbst erzeugt
    //     (`maler-lackieren.ts` schreibt wörtlich diesen Titel). Der Anker
    //     muss dieselbe Zeile sein, die später im Angebot steht — sonst fragt
    //     das Onboarding nach einem Preis, den nachher niemand benutzt.
    //  2. Es ist die Zahl, die jeder Maler im Kopf hat. „Was nimmst du für
    //     eine Tür?" beantwortet jeder; bei „Holzbauteil lackieren, 18 €/m²"
    //     muss er erst ausrechnen, wie viel Quadratmeter eine Tür hat.
    //  3. Alles andere im Lackierbereich verhält sich stabil dazu.
    //
    // Nicht der Entwurf („Tür lackieren, pro Tür mit Zarge", 60,00 €), und
    // das aus zwei Gründen, die beide Geld kosten:
    //  - **Die Zarge wäre doppelt drin.** Sie ist eine eigene Katalogzeile,
    //    und die Engine erzeugt sie getrennt. Ein Anker, der sie einschließt,
    //    lässt den Betrieb einen Preis für Blatt + Zarge nennen — und danach
    //    stehen beide Zeilen im Angebot.
    //  - **60,00 € gegen 135,00 € echte Summe** (Blatt 90 + Zarge 45). Trägt
    //    ein Betrieb seinen wahren Türpreis ein, wird der Faktor 1,5 und jede
    //    Lackier-Zeile springt um die Hälfte hoch. Dieselbe Mechanik wie bei
    //    der Vliestapete aus PD-009, nur eine Tätigkeit weiter.
    //
    // Die Quoten des Prüfmeisters, gemessen am Anker (90,00 €), stimmen mit
    // dem Katalog überein — deshalb steht hier keine einzige davon als Zahl:
    //   Zarge 50 % (45,00) · Fenster 61 % (55,00) · Heizkörper 44 % (40,00)
    //   grundieren 28 % (25,00) · abschleifen 22 % (20,00) · Geländer 20 %
    // Sie sind der Beleg, dass die Katalogwerte zueinander passen, nicht die
    // Quelle der Preise.
    taetigkeit: 'lackieren',
    katalogTitel: 'Türen lackieren (2× Anstrich)',
    kurz: 'Tür beidseitig',
    zeilen: [
      { katalogTitel: 'Türen lackieren einseitig (2× Anstrich)', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Türzarge lackieren', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Stahlzarge lackieren', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Fenster lackieren (2× Anstrich)', art: 'anker', material: 'wahl' },
      // PD-009 §6, wörtlich: „Fenster, Zarge, Heizkörper, Geländer lackieren
      // auf `anker` — richtig. Der Anker ist ein Stückpreis, sie skalieren mit
      // ihm." Der Heizkörper stand bei mir unter „Innen streichen" und hing
      // damit am Quadratmeterpreis der Wand. Genau die Zuordnung, gegen die
      // Manfreds Satz gerichtet war: „Ein Heizkörper hat mit dem
      // Quadratmeterpreis nichts zu tun."
      { katalogTitel: 'Heizkörper streichen / lackieren', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Türen grundieren', art: 'anker', material: 'zubehoer' },
      { katalogTitel: 'Türen abschleifen', art: 'anker', material: null },
      // Der Entwurf hatte hier 53,00 €/lfm. Der Prüfmeister: „53 € je
      // laufendem Meter wäre ein Geländer mit Abbeizen und Neuaufbau — für
      // ‚lackieren' sind 18 € richtig."
      { katalogTitel: 'Treppengeländer lackieren', art: 'anker', material: 'wahl' },
    ],
  },
  {
    taetigkeit: 'fassade',
    katalogTitel: 'Fassade streichen 2x Anstrich',
    kurz: 'Fassade 2x',
    zeilen: [
      // Derselbe Hinweis wie innen, und aus demselben Grund. Nachgerechnet:
      // Fassade 1x/2x steht bei 9,00/14,00 = 64 %, praktisch identisch mit
      // Wand (63 %) und Decke (64 %) — und Grundierung, Reinigen und
      // Rissarbeiten sind auch außen eigene Katalogzeilen, zählen also extra.
      // Beim ersten Bauen hatte ich den Hinweis nur an die zwei Innen-Zeilen
      // gehängt; der Test hat die Lücke gefunden, nicht ich.
      { katalogTitel: 'Fassade streichen 1x Anstrich', art: 'anker', material: 'wahl',
        hinweis: 'ohne Vorbereitung, die zählt extra' },
      { katalogTitel: 'Fassadengrundierung auftragen', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Fassade reinigen / druckwaschen', art: 'anker', material: null },
      { katalogTitel: 'Fassadenrisse schließen', art: 'anker', material: 'zubehoer' },
      // Kein Katalogzwilling: „Gerüst Aufpreis Überdachung / Wetterschutzplane"
      // (6,00 €/m²) ist ein Aufpreis aufs Gerüst, nicht die Arbeitszeit fürs
      // Anbringen der Plane.
      { art: 'zeit', stunden: 0.03, material: 'zubehoer',
        titel: 'Gerüstplane anbringen', einheit: 'm²' },
    ],
  },
  {
    taetigkeit: 'boden',
    katalogTitel: 'Laminat verlegen, schwimmend',
    kurz: 'Laminat',
    zeilen: [
      // PD-009 §2, Zusatzfund: Trittschall stand auf `zubehoer` — Material
      // immer drin, nicht wählbar. *„Wer sein Laminat selbst kauft, kauft die
      // Dämmung fast immer mit; die liegt im Baumarkt direkt daneben."*
      // Das widersprach dem Boden-Standard „ohne Belag". Jetzt `wahl`.
      //
      // Ausdrücklich KEIN Widerspruch zu Manfreds Zubehör-Regel („Trittschall
      // ist bei mir drin"): Die gilt für Positionen, in denen der Trittschall
      // im Verlegepreis steckt. Hier ist er eine EIGENE Zeile — und was eine
      // eigene Zeile hat, kann der Kunde auch selbst stellen.
      { katalogTitel: 'Trittschalldämmung verlegen (PE-Schaum / Filz)', art: 'anker', material: 'wahl' },
      { katalogTitel: 'Laminat demontieren und entsorgen', art: 'anker', material: null,
        zeigeAls: 'Altbelag aufnehmen, lose verlegt' },
      { katalogTitel: 'Teppichboden verklebt entfernen', art: 'anker', material: null,
        zeigeAls: 'Altbelag aufnehmen, verklebt' },
      // PD-009 §2, zweiter Fund: `Kleberreste entfernen` stand auf `flaeche`.
      // *„Die schwankendste Position im ganzen Bodenbau: zwischen 5 und 25 €/m²,
      // je nachdem, was da klebt. Eine abgeleitete Zahl täuscht hier eine
      // Genauigkeit vor, die es nicht gibt."*
      { katalogTitel: 'Altkleber abschaben', art: 'zeit', stunden: 0.15, material: null,
        zeigeAls: 'Kleberreste entfernen', hinweis: 'schwankt stark — vor Ort prüfen' },
      { katalogTitel: 'Untergrund spachteln / ausgleichen (bis 5mm)', art: 'anker', material: 'zubehoer' },
      // PD-009 §2, erster Fund: `Sockelleisten montieren` stand auf `flaeche`.
      // *„Der Aufwand hängt an Metern, Ecken, Gehrungen und Türausschnitten —
      // nicht am Quadratmeterpreis des Belags. Ein Betrieb, der Laminat für
      // 25 €/m² verlegt, nimmt deshalb nicht 8,50 € für den laufenden Meter."*
      { katalogTitel: 'Sockelleisten montieren (Holz / MDF / Kunststoff)', art: 'zeit', stunden: 0.10, material: 'wahl' },
      { katalogTitel: 'Übergangsprofil / Schwelle einbauen', art: 'zeit', stunden: 0.29, material: 'zubehoer' },
      // Kein Katalogzwilling: „Baustelle kehren / saugen nach Verlegung" ist
      // eine PAUSCHALE (35,00 €), diese Zeile rechnet je m². Der erste Anlauf
      // hat die Einheit von dort geborgt und kam auf 0,00 € — siehe den
      // Kommentar bei `katalogTitel`.
      { art: 'zeit', stunden: 0.02, material: null,
        titel: 'Boden reinigen', einheit: 'm²' },
    ],
  },
]

// ── Rechnen ───────────────────────────────────────────────────────────────

/** Der Katalogpreis zu einem Titel, oder null. */
export function katalogPreis(titel: string): { preis: number; einheit: string } | null {
  const treffer = DEFAULT_PRICES.find(p => p.title === titel)
  return treffer ? { preis: treffer.unit_price, einheit: treffer.unit } : null
}

export interface AbgeleiteterPreis {
  titel: string
  /** Was auf dem Bildschirm steht — kaufmännisch gerundet. */
  preis: number
  /**
   * Derselbe Wert ungerundet.
   *
   * Nicht für die Anzeige, sondern für die erste Probe des Prüfmeisters:
   * *„Zwei Betriebe, sonst gleich: einer mit 52 €/h, einer mit 75 €/h. Die
   * Zeit-Zeilen müssen sich um genau diesen Faktor unterscheiden."* Am
   * gerundeten Preis lässt sich „genau" nicht prüfen — das Runden ist ja
   * gerade dazu da, die letzte Stelle wegzunehmen.
   */
  rohpreis: number
  einheit: string
  /** Woher die Zahl kommt — wörtlich für die Herkunftszeile. */
  herkunft: string
  art: Ableitungsart
  material: MaterialArt
  taetigkeit: TaetigkeitId
  /** Der Katalogtitel, falls es einen echten Zwilling gibt (für die Gegenprobe). */
  katalogTitel?: string
}

/**
 * Kaufmännisch runden, wie im Entwurf: Pauschalen auf 5 €, Stückpreise auf
 * 1 €, Flächen- und Meterpreise auf 50 Cent.
 */
export function runde(wert: number, einheit: string): number {
  // Unter 5 € auf 10 Cent statt auf 50.
  //
  // Der Entwurf rundete alles außer Stück und Pauschale auf 0,50 €. Bei einer
  // Zeile wie „Sockelleisten abkleben" (Katalog 0,80 €/lfdm) ist das eine
  // Quantisierung von 60 % — 0,78 € und 1,12 € landen beide auf 1,00 €, und
  // damit verschwindet der Unterschied zwischen einem Betrieb mit 52 €/h und
  // einem mit 75 €/h vollständig. Aufgefallen an der ersten Probe des
  // Prüfmeisters, nicht am Bildschirm: Die Zeile sah richtig aus.
  const stufe = einheit === 'Pauschale' ? 5
    : einheit === 'Stück' ? 1
    : wert < 5 ? 0.1
    : 0.5
  return Math.round((Math.round(wert / stufe) * stufe) * 100) / 100
}

export interface AnkerEingabe {
  /** Die Zahl, die der Betrieb selbst genannt hat. */
  [taetigkeit: string]: number | undefined
}

/**
 * Leitet aus den genannten Ankerpreisen und dem Stundensatz die übrigen
 * Preise ab.
 *
 * `eigene` enthält je Tätigkeit den vom Betrieb genannten Ankerpreis. Fehlt
 * einer, bleibt der Katalogpreis stehen (Faktor 1) — wer nur zwei Zahlen
 * weiß, kommt trotzdem weiter, so wie es der Entwurf vorsieht.
 */
export function leiteAb(
  taetigkeiten: TaetigkeitId[],
  eigene: AnkerEingabe,
  stundensatz: number,
): AbgeleiteterPreis[] {
  const raus: AbgeleiteterPreis[] = []

  for (const anker of ANKER) {
    if (!taetigkeiten.includes(anker.taetigkeit)) continue

    const basis = katalogPreis(anker.katalogTitel)
    if (!basis) continue // Ein Anker ohne Katalogzeile ist ein Fehler — der Test sperrt ihn.

    const mein = eigene[anker.taetigkeit] ?? basis.preis
    const faktor = basis.preis > 0 ? mein / basis.preis : 1

    for (const zeile of anker.zeilen) {
      const katalog = zeile.katalogTitel ? katalogPreis(zeile.katalogTitel) : null

      // Anker-Zeilen brauchen den Katalog — ohne ihn gäbe es keine Basis.
      // Zeit-Zeilen bringen Titel und Einheit selbst mit.
      if (zeile.art === 'anker' && !katalog) continue

      const einheit = katalog?.einheit ?? zeile.einheit
      const titel = zeile.zeigeAls ?? zeile.titel ?? zeile.katalogTitel
      if (!einheit || !titel) continue

      const roh = zeile.art === 'zeit'
        ? (zeile.stunden ?? 0) * stundensatz
        : (katalog?.preis ?? 0) * faktor

      const grund = zeile.art === 'zeit' ? 'dein Stundensatz' : `abgeleitet aus: ${anker.kurz}`

      raus.push({
        titel,
        preis: runde(roh, einheit),
        rohpreis: roh,
        einheit,
        herkunft: zeile.hinweis ? `${grund} · ${zeile.hinweis}` : grund,
        art: zeile.art,
        material: zeile.material,
        taetigkeit: anker.taetigkeit,
        katalogTitel: zeile.katalogTitel,
      })
    }
  }

  return raus
}

// ── Die zwei Proben des Prüfmeisters (PD-009 §7) ──────────────────────────

export interface KatalogAbweichung {
  titel: string
  abgeleitet: number
  katalog: number
  abweichung: number
}

/**
 * *„Für jede Position, die es auch im Standardkatalog gibt, der abgeleitete
 * Preis gegen den Katalogpreis. Abweichung über 20 % heißt, einer von beiden
 * ist falsch."*
 *
 * Geprüft wird beim Faktor 1 — also bei einem Betrieb, der genau die
 * Katalogpreise als Anker nennt. Dann müssen beide Wege dasselbe liefern:
 * Die `anker`-Zeilen per Definition, und die `zeit`-Zeilen, weil ihre
 * Stundenzahl sonst nicht stimmt. Genau dort saßen die fünf Fehler aus §3.
 */
export function pruefeGegenKatalog(stundensatz: number, grenze = 0.2): KatalogAbweichung[] {
  const alle = ANKER.map(a => a.taetigkeit)
  const raus: KatalogAbweichung[] = []

  for (const p of leiteAb(alle, {}, stundensatz)) {
    // Nur Zeilen mit echtem Zwilling. Eine Zeile ohne Katalogeintrag ist kein
    // Fehler — sie hat nur keinen Vergleichsmaßstab.
    if (!p.katalogTitel) continue
    const katalog = katalogPreis(p.katalogTitel)
    if (!katalog || katalog.preis <= 0) continue
    // Verschiedene Einheiten heißt verschiedene Arbeit — nicht vergleichbar,
    // und ein Zwilling in anderer Einheit ist ohnehin ein Zuordnungsfehler.
    if (katalog.einheit !== p.einheit) continue

    const abweichung = Math.abs(p.preis - katalog.preis) / katalog.preis
    if (abweichung > grenze) {
      raus.push({ titel: p.titel, abgeleitet: p.preis, katalog: katalog.preis, abweichung })
    }
  }
  return raus
}
