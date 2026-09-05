import { saetze } from '../satz-raum'
import { SOCKEL_WORT } from '../sockelleisten-ausschluss'
import { EINSCHRAENKUNG } from '../teilflaeche'
import type { BerechnetePosition } from '../mengen/types'
import { hat, add, addMitMenge } from './helpers'
import { bodenNettoflaecheAusPositionen, extrahiereFlaeche, extrahiereFlaecheAusAbmessungen } from './boden-basis'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

function extrahiereLfdm(lower: string, schluessel: string): number | null {
  const esc = schluessel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const m =
    lower.match(new RegExp(`(\\d+)\\s*(?:laufende meter|lfm|lfdm|lm)\\s*${esc}`, 'i')) ??
    lower.match(new RegExp(`${esc}.*?(\\d+)\\s*(?:laufende meter|lfm|lfdm|lm|meter)`, 'i')) ??
    lower.match(new RegExp(`(\\d+)\\s*${esc}`, 'i'))
  if (m) return parseInt(m[1])
  const zahlwoerter: Record<string, number> = {
    ein: 1, eine: 1, eins: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6,
    sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, dreizehn: 13,
    vierzehn: 14, fünfzehn: 15, sechzehn: 16, siebzehn: 17, achtzehn: 18,
    neunzehn: 19, zwanzig: 20,
  }
  const wort = lower.match(new RegExp(`\\b(${Object.keys(zahlwoerter).join('|')})\\s+(?:laufende meter|lfm|lfdm|lm)\\s*${esc}`, 'i'))
    ?? lower.match(new RegExp(`${esc}.*?\\b(${Object.keys(zahlwoerter).join('|')})\\s+(?:laufende meter|lfm|lfdm|lm|meter)`, 'i'))
  return wort ? zahlwoerter[wort[1].toLowerCase()] ?? null : null
}

export function pruefeAltbelag(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  v: AuftragsVerstaendnis,
): void {
  const hatVerklebt =
    lower.includes('vollflächig verklebt') ||
    lower.includes('vollflächig verklebter') ||
    lower.includes('verklebter teppich') ||
    lower.includes('verklebt') && (lower.includes('teppich') || lower.includes('belag'))

  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }
  // Fläche: aus Text, sonst aus bereits vorhandener Altbelag-/Boden-Position (netto)
  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
    ?? bodenNettoflaecheAusPositionen(ergaenzt)
    ?? null

  // Kleberreste abschleifen bei verklebtem Altbelag — UNABHÄNGIG davon, ob die Engine
  // schon "Altbelag entfernen" angelegt hat (sonst lief dieser Zweig in Prod nie).
  const willKleber = hatVerklebt && (lower.includes('kleber') || lower.includes('kleberreste') || v.hatArbeit('schleifen'))
  if (willKleber && !hat(ergaenzt, 'kleberreste', 'kleber abschleif')) {
    if (m2) ergaenzt.push({ beschreibung: 'Untergrund schleifen (Unebenheiten, Kleberreste)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
    else fehlende.push('Untergrund schleifen (Unebenheiten, Kleberreste)')
  }

  // Basis-Altbelag nur, wenn noch keine Entfernen-Position existiert
  const vorhandeneEntfernung = ergaenzt.find(p => /altbelag entfernen|teppichboden entfernen|bodenbelag entfernen/i.test(p.beschreibung))
  const entsorgungBeauftragt = /entsorg|abtransport|abfahren|wegfahren/i.test(lower)
  if (vorhandeneEntfernung && entsorgungBeauftragt) {
    const suffix = vorhandeneEntfernung.beschreibung.match(/\s[—–-]\s*(.+)$/)?.[0] ?? ''
    if (/laminat/i.test(lower)) vorhandeneEntfernung.beschreibung = `Laminat demontieren und entsorgen${suffix}`
    else if (/teppich/i.test(lower)) vorhandeneEntfernung.beschreibung = `Teppichboden entfernen und entsorgen${suffix}`
    else if (/vinyl|pvc/i.test(lower)) vorhandeneEntfernung.beschreibung = `Vinyl / PVC entfernen und entsorgen${suffix}`
    else if (/linoleum/i.test(lower)) vorhandeneEntfernung.beschreibung = `Linoleum entfernen und entsorgen${suffix}`
  }
  const hatBodenEntfernung = !!vorhandeneEntfernung
  if (!v.altbelagEntfernen || hatBodenEntfernung) return

  if (hatVerklebt) {
    if (m2) ergaenzt.push({ beschreibung: 'Alten Teppichboden entfernen (verklebt)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
    else fehlende.push('Alten Teppichboden entfernen (verklebt)')
  } else {
    if (m2) addMitMenge(ergaenzt, 'Altbelag entfernen', m2, 'm²', `${m2} m² aus Transkript`)
    else add(ergaenzt, fehlende, 'Altbelag entfernen')
  }
}

export function pruefeFeuchtigkeitssperre(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatSperre =
    lower.includes('feuchtigkeitssperre') ||
    lower.includes('epoxidharz') ||
    lower.includes('restfeuchte') ||
    lower.includes('feuchtigkeit') && lower.includes('sperr')

  if (!hatSperre) return

  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
    ?? ergaenzt.find(p => /feuchtigkeitssperre|epoxidharz|verlegen|boden/i.test(p.beschreibung) && p.einheit === 'm²')?.menge
    ?? null
  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }

  // Sperre nur, wenn die Engine sie nicht schon angelegt hat
  if (!hat(ergaenzt, 'feuchtigkeitssperre', 'epoxidharz')) {
    const name = lower.includes('epoxidharz') ? 'Epoxidharz-Feuchtigkeitssperre aufwalzen' : 'Feuchtigkeitssperre aufbringen'
    if (m2) ergaenzt.push({ beschreibung: name, menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
    else fehlende.push(name)
  }

  // Quarzsand absanden — UNABHÄNGIG (die Engine legt die Sperre selbst an)
  if (lower.includes('quarzsand') || lower.includes('absanden')) {
    if (!hat(ergaenzt, 'quarzsand', 'absanden')) {
      if (m2) {
        ergaenzt.push({ beschreibung: 'Quarzsand absanden', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
      } else {
        fehlende.push('Quarzsand absanden')
      }
    }
  }
}

export function pruefeSockelleisten(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  nurOhneSockel: boolean,
): void {
  if (nurOhneSockel) return
  const vorhandeneMontage = ergaenzt.find(p => /sockelleisten montieren/i.test(p.beschreibung))

  // Streichen/Lackieren → Maler-Gewerk
  if (lower.includes('sockelleisten streichen') || lower.includes('sockelleisten lackieren')) return

  // Spezifische Profilleisten-Typen
  if (lower.includes('hamburger') || lower.includes('profilleiste')) {
    const lfm = extrahiereLfdm(lower, 'profilleiste') ?? extrahiereLfdm(lower, 'meter')
    const beschreibung = lower.includes('hamburger')
      ? 'Hamburger Profilleiste MDF weiß foliert (geklippt)'
      : 'Profilleiste montieren'
    if (lfm && lfm > 0 && lfm < 500) {
      ergaenzt.push({ beschreibung, menge: lfm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfm} lfdm aus Transkript`, annahmen: [] })
    } else {
      fehlende.push(beschreibung + ' (Meter prüfen)')
    }
    return
  }

  const lfm = extrahiereLfdm(lower, 'sockelleisten') ?? extrahiereLfdm(lower, 'sockel')
  const alteSockelEntfernen = /(?:alte[nr]?\s+)?sockelleisten?.{0,35}(?:entfern|demontier|abnehm)|(?:entfern|demontier|abnehm).{0,35}sockelleisten?/i.test(lower)
  if (alteSockelEntfernen && !hat(ergaenzt, 'sockelleisten entfernen')) {
    const menge = lfm ?? vorhandeneMontage?.menge
      ?? (() => {
        const flaeche = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
        return flaeche ? Math.round(4 * Math.sqrt(flaeche)) : null
      })()
    if (menge && menge > 0) {
      ergaenzt.push({
        beschreibung: 'Sockelleisten entfernen (alt)',
        menge,
        einheit: 'lfdm',
        konfidenz: lfm ? 'high' : 'medium',
        berechnungsweg: lfm ? `${lfm} lfdm aus Transkript` : `${menge} lfdm wie neue Sockelleisten`,
        annahmen: lfm ? [] : ['Länge wie neue Sockelleisten angenommen — bitte prüfen'],
      })
    } else {
      fehlende.push('Sockelleisten entfernen (alt)')
    }
  }
  if (lfm && lfm > 0 && lfm < 500) {
    if (vorhandeneMontage) {
      vorhandeneMontage.menge = lfm
      vorhandeneMontage.einheit = 'lfdm'
      vorhandeneMontage.konfidenz = 'high'
      vorhandeneMontage.berechnungsweg = `${lfm} lfdm aus Transkript`
      vorhandeneMontage.annahmen = []
    } else {
      const verlegeRaum = ergaenzt.find(p => /verlegen/i.test(p.beschreibung))?.beschreibung.match(/\s[—–-]\s*(.+)$/)?.[1]?.trim()
      ergaenzt.push({
        beschreibung: `Sockelleisten montieren${verlegeRaum ? ` — ${verlegeRaum}` : ''}`,
        menge: lfm, einheit: 'lfdm', konfidenz: 'high',
        berechnungsweg: `${lfm} lfdm aus Transkript`, annahmen: [],
      })
    }
    return
  }
  if (vorhandeneMontage || hat(ergaenzt, 'profilleiste montieren')) return
  // Keine Meter genannt → Umfang aus der Bodenfläche schätzen (quadratischer Raum),
  // statt die Position stumm in "fehlende" zu schieben.
  //
  // PM-013/PM-020 (2026-08-19/21): dieser Fallback lief bisher OHNE jede
  // Prüfung, ob Sockelleisten im Transkript überhaupt vorkommen — bei JEDER
  // Bodenverlegung wurde automatisch eine "Sockelleisten montieren"-Position
  // (bzw. ein "fehlende"-Eintrag) erzeugt, unabhängig davon, ob das je gesagt
  // wurde ("neuer Boden → automatisch neue Sockelleisten"-Annahme). Zwei
  // unabhängige Live-Funde (PM-013 Wohnzimmer, PM-020 Kinderzimmer 2) hatten
  // dieselbe Ursache: die Engine (gewerke/boden.ts) verlangt seit PM-013
  // bereits ein echtes "sockelleist"-Textsignal, bevor sie GPTs
  // `sockelleisten`-Boolean vertraut — dieser separate Vollständigkeits-
  // Fallback hier kannte diese Bedingung nicht und hat den Phantom-Fund
  // munter erneut erzeugt, sobald die Engine (korrekt) nichts angelegt hatte.
  // Gleiches Prinzip wie dort: ohne ein eigenes Textsignal keine Erfindung.
  if (!hat(ergaenzt, 'sockel') && SOCKEL_WORT.test(lower)) {
    // PM-036 (04.09.2026): Die Schätzung 4 × √Fläche darf NIE auf einer
    // Teilfläche stehen. Im Produktionsfall war die einzige m²-Position des
    // Wohnzimmers die reparierte Ecke (6 m² von 20 m²) — daraus wurden
    // 4 × √6 = 10 lfdm „Umfang". Sockelleisten laufen aber am ganzen Raum
    // entlang, nicht um die Ecke herum. Die Engine markiert Teilflächen im
    // Berechnungsweg; diese Positionen scheiden hier deshalb aus, und ohne
    // andere Quelle wird lieber gefragt als geraten.
    const istTeilflaeche = (p: BerechnetePosition) => /teilfl(?:ä|ae)che/i.test(p.berechnungsweg ?? '')
    // Auch die Fläche AUS DEM TEXT kann eine Teilfläche sein („nur die Ecke,
    // ungefähr 6 Quadratmeter"). Derselbe Marker wie in teilflaeche.ts —
    // importiert, nicht nachgebaut.
    // Auch die Fläche AUS DEM TEXT ist dann eine Teilfläche („nur die Ecke,
    // ungefähr 6 Quadratmeter") — und jede daraus abgeleitete Position erbt
    // den Fehler, ohne ihn im Berechnungsweg noch zu tragen („6 m² × 1.05").
    // Deshalb sperrt der Marker die Schätzung als Ganzes: Beschreibt das
    // Diktat für diesen Raum nur einen Ausschnitt, ist die Bodenfläche keine
    // gültige Quelle für einen Umfang. Derselbe Marker wie in teilflaeche.ts
    // — importiert, nicht nachgebaut.
    const nurTeilflaecheImText = EINSCHRAENKUNG.test(lower)
    const flaeche = nurTeilflaecheImText ? null : (
      extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
      ?? ergaenzt.find(p => /altbelag entfernen|verlegen|boden/i.test(p.beschreibung) && p.einheit === 'm²' && !istTeilflaeche(p))?.menge
      ?? null)
    if (flaeche && flaeche > 0) {
      const umfang = Math.round(4 * Math.sqrt(flaeche))
      ergaenzt.push({ beschreibung: 'Sockelleisten montieren', menge: umfang, einheit: 'lfdm', konfidenz: 'medium', berechnungsweg: `Umfang ≈ 4 × √${flaeche} m² = ${umfang} lfdm`, annahmen: ['Quadratischer Raum angenommen — Meter bitte prüfen'] })
    } else {
      add(ergaenzt, fehlende, 'Sockelleisten montieren')
    }
  }
}

export function pruefeUebergangsprofil(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  // Robust gegen Flexion (Türübergäng-EN mit ä) und "Alu-Profil(e)".
  // PM-009: "Übergangsschiene" (mindestens so gebräuchlich wie "-profil" im
  // Handwerk, an Türdurchgängen zwischen zwei Bodenbelägen) fehlte komplett
  // in der Wortliste — die Leistung wurde auf der Aufnahme-Karte erkannt,
  // landete aber nie als echte Position im Angebot.
  const hatUebergang =
    /überg[aä]ngsprofil|uebergangsprofil|anschlussprofil|überg[aä]ngsschiene|uebergangsschiene/i.test(lower) ||
    /alu-?profil/i.test(lower) ||
    (/überg[aä]ng/i.test(lower) && (lower.includes('profil') || lower.includes('alu') || lower.includes('schiene')))

  if (!hatUebergang) return
  if (hat(ergaenzt, 'übergangsprofil', 'uebergangsprofil', 'anschlussprofil')) return

  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }

  // Stückzahl: direkte Zahl oder "zwei", "drei" etc.
  //
  // Soll-Audit 2026-08-31 (PM-009): Die Zahlwort-Suche lief über das GANZE
  // Transkript. Im Satz „Flur, VIER mal eins achtzig … noch ne
  // Übergangsschiene" wurde damit das Raummaß zur Stückzahl — vier Schienen
  // statt einer, viermal berechnet. Deshalb: Zahlen zählen nur noch in dem
  // Satzabschnitt, in dem der Übergang selbst vorkommt, und ein Zahlwort muss
  // unmittelbar davorstehen. Steht dort gar keine Zahl, entscheidet der
  // Artikel: „ne/eine Übergangsschiene" ist eine.
  const zahlwoerter: Record<string, number> = {
    ein: 1, eine: 1, zwei: 2, beide: 2, beiden: 2, drei: 3, vier: 4, fünf: 5, sechs: 6,
  }
  // Zwei verschiedene Muster, mit Absicht:
  //   UEBERGANG_SATZ — findet den Satzteil, in dem es wirklich um den Übergang
  //     geht. Eng gehalten, sonst gewinnt ein früherer Satzteil über
  //     „Profilleisten" (Sockelleisten!) und die Stückzahl wird dort gesucht.
  //   NOMEN — erlaubt beim Zählen Zusammensetzungen mit Bindestrich
  //     („Alu-Übergangsprofil"); `\w` allein deckt den Bindestrich nicht ab.
  const UEBERGANG_SATZ = /überg[aä]ng|uebergang|anschlussprofil|alu-?profil/i
  // `\w` ist in JavaScript [A-Za-z0-9_] — OHNE Umlaute. „Alu-Übergangsprofil"
  // wäre daran zerbrochen (das „Ü" beendet die Zeichenklasse). Genau dieselbe
  // Umlaut-Falle wie bei den Flächen-Mustern; hier deshalb ausgeschrieben.
  const WORTZEICHEN = 'A-Za-zÄÖÜäöüß0-9_-'
  const NOMEN = new RegExp(`[${WORTZEICHEN}]*(?:profil|schiene)n?`, 'i')
  // Code-Review 2026-08-31 (eigener Fund): Zuerst wurde auch am KOMMA
  // getrennt — dann stand in „an den zwei Zimmertüren, Alu-Übergangsprofil"
  // die Zahl im vorherigen Stück und die Anzahl fiel auf 1 zurück. Im
  // Deutschen gehört ein Komma zum selben Satz; getrennt wird deshalb nur am
  // Satzende. Die Raummaße aus „Flur, vier mal eins achtzig." bleiben trotzdem
  // draußen — die stehen in einem eigenen Satz.
  // Gemeinsamer Satz-Splitter — er schützt Dezimalpunkte, sonst zerfiele
  // „Flur, 4 mal 1.50, dazu eine Übergangsschiene" mitten im Maß.
  const abschnitt = saetze(lower).find(s => UEBERGANG_SATZ.test(s)) ?? ''
  let anzahl = 0

  // PM-033, Befund 3 (Prüfmeister, 02.09.2026): „An den **beiden** Türen zum
  // Wohnzimmer und zum Schlafzimmer **jeweils eine** Übergangsschiene" ergab
  // eine statt zwei. Die Stückzahl-Suche unten fand das „eine" — richtig
  // gelesen, aber es ist die Zahl PRO Tür, nicht die Gesamtzahl. Bei einem
  // „jeweils/je" zählt deshalb die Zahl der Türen bzw. Übergänge davor.
  //
  // Der Prüfmeister hatte den Verdacht, das Tool setze immer pauschal genau
  // eine Schiene, und PM-032 sei deshalb nur ein Zufallstreffer gewesen.
  // Am Code geprüft stimmt das nicht: Die Anzahl wird aus dem Satz gelesen,
  // in dem der Übergang vorkommt. Gefehlt hat allein diese eine Sprechweise.
  const JEWEILS = /\bje(?:weils|de[rnm]?)?\b/i
  const proStueckMatch = JEWEILS.test(abschnitt)
    ? abschnitt.match(/\b(beiden|beide|zwei|drei|vier|fünf|sechs)\s+(?:[a-zäöüß-]+\s+){0,2}?(?:t[üu]r|zimmert[üu]r|durchg|überg[aä]ng|uebergäng|schwellen)/i)
    : null
  if (proStueckMatch) anzahl = zahlwoerter[proStueckMatch[1]] ?? 0

  const numMatch = anzahl > 0 ? null : abschnitt.match(/(\d+)\s*(?:stück\s*)?(?:alu-?)?(?:übergangs|uebergangs|anschluss)?(?:profil|schiene)/i)
    ?? abschnitt.match(/(\d+)\s*(?:tür|türe|zimmer|raum)?überg[aä]ng/i)
  if (numMatch) {
    anzahl = parseInt(numMatch[1])
  } else if (anzahl === 0) {
    const wortMatch = abschnitt.match(
      // Zwischen Zahlwort und Nomen darf auch ein Komma stehen
      // („an den zwei Zimmertüren, Alu-Übergangsprofil").
      new RegExp(`\\b(eine|ein|zwei|drei|vier|fünf|sechs)\\s+(?:[${WORTZEICHEN}]+[,;:]?\\s+){0,3}?${NOMEN.source}`, 'i'),
    )
    if (wortMatch) anzahl = zahlwoerter[wortMatch[1]] ?? 0
    // „ne Schiene", „eine Übergangsschiene", „die Übergangsschiene" — Singular.
    // Plural erkennen — auch in Zusammensetzungen: „Übergangsprofile" hat
    // vorne keine Wortgrenze, `\bprofile\b` traf es deshalb nicht und eine
    // unbezifferte Mehrzahl wurde stillschweigend zu genau einem Stück.
    else if (abschnitt && !/(?:profile|schienen)\b/i.test(abschnitt)) anzahl = 1
  }

  // Bezeichnung — Wortwahl aus dem Transkript übernehmen (Profil vs. Schiene),
  // statt immer "Profil" zu sagen, auch wenn der Handwerker "Schiene" meinte.
  const nurSchiene = lower.includes('schiene') && !lower.includes('profil')
  const beschreibung = lower.includes('alu') && lower.includes('silber')
    ? 'Alu-Übergangsprofil Silber'
    : lower.includes('alu')
    ? 'Alu-Übergangsprofil'
    : nurSchiene
    ? 'Übergangsschiene'
    : 'Übergangsprofil'

  if (anzahl > 0) {
    ergaenzt.push({ beschreibung, menge: anzahl, einheit: 'Stück', berechnungsweg: `${anzahl} Stück aus Transkript`, ...mk })
  } else {
    fehlende.push(beschreibung + ' (Anzahl prüfen)')
  }
}
