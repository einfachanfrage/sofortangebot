import type { BerechnetePosition } from '../mengen/types'
import { hat } from './helpers'
import { bodenNettoflaecheAusPositionen, extrahiereFlaeche, extrahiereFlaecheAusAbmessungen, extrahiereVerschnitt, erkenneBelagName } from './boden-basis'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

const zahlwoerter: Record<string, number> = { einmal: 1, zweimal: 2, dreimal: 3, viermal: 4 }

export function pruefeDiagonalBoden(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatDiagonal =
    lower.includes('diagonal') ||
    lower.includes('schräg verlegt') ||
    lower.includes('schraeg verlegt') ||
    lower.includes('45 grad') ||
    lower.includes('45°')
  if (!hatDiagonal) return
  if (!hat(ergaenzt, 'verschnitt', 'diagonal')) {
    fehlende.push('Verschnitt 15 % (Diagonalverlegung)')
  }
}

export function pruefeFBHBoden(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatFBH =
    lower.includes('fußbodenheizung') ||
    lower.includes('fussbodenheizung') ||
    /\bfbh\b/.test(lower) ||
    lower.includes('wärmeabgabe')
  if (!hatFBH) return
  if (!hat(ergaenzt, 'fußbodenheizung', 'fussbodenheizung', 'fbh', 'wärmeabgabe')) {
    fehlende.push('Hinweis: FBH-geeigneter Belag prüfen')
  }
}

export function pruefeParkettSchleifen(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  v: AuftragsVerstaendnis,
): void {
  // "Kleberreste/Untergrund abschleifen" darf nicht allein deshalb als
  // Parkett-Renovierung gelten, weil im selben Auftrag neues Parkett erwähnt wird.
  // Eine nachfolgende Schleif-Anweisung darf sich auf den zuvor genannten
  // Holzbelag beziehen; rückwärts gilt nur derselbe Satz (sonst Test-6-Fehltreffer).
  const hatParkettSchleifauftrag =
    /(?:parkett|dielen?|holzboden|eichenboden).{0,160}(?:abge|ab)?schl/i.test(lower) ||
    /(?:abge|ab)?schl[^.!?]{0,100}(?:parkett|dielen?|holzboden|eichenboden)/i.test(lower)
  const nurUntergrundOderKleberreste =
    /(?:kleberreste?|untergrund|estrich).{0,35}(?:abge|ab)?schl/i.test(lower) ||
    /(?:abge|ab)?schl.{0,35}(?:kleberreste?|untergrund|estrich)/i.test(lower)
  const hatSchleifen =
    v.hatArbeit('schleifen') &&
    hatParkettSchleifauftrag &&
    (!nurUntergrundOderKleberreste || /parkett.{0,20}(?:abge|ab)?schl|(?:abge|ab)?schl.{0,20}parkett/i.test(lower))
  if (!hatSchleifen) return

  // Fläche: aus Text, sonst aus vorhandener Schleif-/Boden-Position
  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
    ?? bodenNettoflaecheAusPositionen(ergaenzt)
    ?? ergaenzt.find(p => /parkett schleifen|boden/i.test(p.beschreibung) && p.einheit === 'm²')?.menge
    ?? null
  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }

  // Schleif-Position nur, wenn die Engine sie noch nicht angelegt hat.
  // WICHTIG: NICHT die ganze Funktion abbrechen — Versiegelung/Verkitten müssen folgen.
  if (!hat(ergaenzt, 'schleifen')) {
    let schleifGaenge = 1
    const gangMatch = lower.match(/(\d+)[\s-]*(?:fach|mal|x)\s*(?:abgeschliffen|schleif|schleifen)?/i)
    if (gangMatch) {
      schleifGaenge = parseInt(gangMatch[1])
    } else {
      for (const [wort, val] of Object.entries(zahlwoerter)) {
        if (lower.includes(wort)) { schleifGaenge = val; break }
      }
    }
    const schleifLabel = schleifGaenge > 1
      ? `Parkett schleifen ${schleifGaenge}-fach (grob bis fein)`
      : 'Parkett schleifen'
    if (m2) ergaenzt.push({ beschreibung: schleifLabel, menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
    else fehlende.push(schleifLabel)
  }

  // Fugen / Unreinheiten verkitten
  if (lower.includes('verkitten') || lower.includes('kitten') || lower.includes('unreinheit')) {
    if (!hat(ergaenzt, 'kitten', 'verkitten')) {
      if (m2) {
        ergaenzt.push({ beschreibung: 'Fugen/Unreinheiten verkitten', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
      } else {
        fehlende.push('Fugen/Unreinheiten verkitten')
      }
    }
  }

  // Antworten aus dem Rückfragen-Screen kommen strukturiert über raum.arbeiten.
  // Sie dürfen nicht beim Übergang in die textbasierte Vollständigkeitsprüfung
  // verloren gehen und verwenden direkt die exakten Katalogtitel.
  const antwortVersiegeln = v.arbeitenTexte.some(arbeit => /^versiegeln$/i.test(arbeit.trim()))
  const antwortOelen = v.arbeitenTexte.some(arbeit => /^(?:ölen|oelen)$/i.test(arbeit.trim()))
  if (antwortVersiegeln && !hat(ergaenzt, 'parkett versiegeln')) {
    if (m2) ergaenzt.push({ beschreibung: 'Parkett versiegeln (Lack, 2-lagig)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
    else fehlende.push('Parkett versiegeln (Lack, 2-lagig)')
    return
  }
  if (antwortOelen && !hat(ergaenzt, 'parkett ölen')) {
    if (m2) ergaenzt.push({ beschreibung: 'Parkett ölen (maschinell, 1-lagig)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
    else fehlende.push('Parkett ölen (maschinell, 1-lagig)')
    return
  }

  // Versiegelung: Anzahl bestimmen
  let versGaenge = 2
  const versMatch = lower.match(/(\d+)[\s-]*(?:mal|x|fach|gang)\s*(?:versiegelung|versiegeln|lack|parkettlack)/i)
    ?? lower.match(/(?:versiegelung|versiegeln|lack|parkettlack)[^.]*?(\d+)[\s-]*(?:mal|x|fach|gang)/i)
  if (versMatch) {
    versGaenge = parseInt(versMatch[1])
  } else {
    for (const [wort, val] of Object.entries(zahlwoerter)) {
      if (lower.includes(wort) && (lower.includes('versiegelung') || lower.includes('lack'))) {
        versGaenge = val; break
      }
    }
  }

  const versName = lower.includes('parkettlack') ? 'Parkettlack versiegeln' : 'Versiegelung'
  if (!hat(ergaenzt, 'versiegel', 'parkettlack')) {
    for (let i = 1; i <= versGaenge; i++) {
      if (m2) {
        ergaenzt.push({ beschreibung: `${versName} ${i}. Gang`, menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
      } else {
        fehlende.push(`${versName} ${i}. Gang`)
      }
    }
  }
}

export function pruefeTreppenBoden(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  v: AuftragsVerstaendnis,
): void {
  const hatTreppe =
    lower.includes('treppe') || lower.includes('treppenhaus') || lower.includes('trittstufe')
  if (!hatTreppe) return

  const m =
    lower.match(/(\d+)\s*(?:treppenstufen|trittstufen|stufen)/i) ??
    lower.match(/treppe\s+mit\s+(\d+)/i) ??
    lower.match(/(\d+)\s*(?:gerade\s+)?stufen?/i) ??
    lower.match(/(\d+)\s*(?:stufe|tritt)/i)
  const anzahl = m ? parseInt(m[1]) : 0

  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }
  const belag = v.belag
  const belagName = belag ? erkenneBelagName(lower, belag) : 'Belag'
  const istVerkleiden = lower.includes('verkleid')

  if (!hat(ergaenzt, 'trittstufe')) {
    const label = istVerkleiden ? `Trittstufen ${belagName} verkleiden` : 'Trittstufen belegen'
    if (anzahl > 0) {
      ergaenzt.push({ beschreibung: label, menge: anzahl, einheit: 'Stück', berechnungsweg: `${anzahl} Stück aus Transkript`, ...mk })
    } else {
      fehlende.push(label + ' (Anzahl prüfen)')
    }
  }
  if (!hat(ergaenzt, 'setzstufe')) {
    const label = istVerkleiden ? `Setzstufen ${belagName} verkleiden` : 'Setzstufen belegen'
    if (anzahl > 0) {
      ergaenzt.push({ beschreibung: label, menge: anzahl, einheit: 'Stück', berechnungsweg: `${anzahl} Stück aus Transkript`, ...mk })
    } else {
      fehlende.push(label + ' (Anzahl prüfen)')
    }
  }

  // Treppenkantenprofil
  if (lower.includes('kantenprofil') || lower.includes('treppenkante') || lower.includes('rutschhemmend')) {
    if (!hat(ergaenzt, 'kantenprofil', 'treppenkante')) {
      const beschreibung = lower.includes('alu') ? 'Treppenkantenprofil Alu rutschhemmend' : 'Treppenkantenprofil'
      if (anzahl > 0) {
        ergaenzt.push({ beschreibung, menge: anzahl, einheit: 'Stück', berechnungsweg: `${anzahl} Stück (je Stufe 1)`, ...mk })
      } else {
        fehlende.push(beschreibung + ' (Anzahl prüfen)')
      }
    }
  }
}

export function pruefeFugenVerschweissen(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatVerschweissen =
    lower.includes('verschweißen') ||
    lower.includes('verschweissen') ||
    lower.includes('verschweißt') ||
    lower.includes('verschweisst') ||
    lower.includes('schweißdraht') ||
    lower.includes('schweissdraht') ||
    (lower.includes('thermisch') && lower.includes('fug'))
  if (!hatVerschweissen) return
  if (hat(ergaenzt, 'verschweißen', 'verschweissen')) return

  const fugMatch =
    lower.match(/(\d+)\s*(?:laufende meter|lfm|lfdm|lm|meter)\s*(?:fuge|fugen)/i) ??
    lower.match(/(?:fuge|fugen)[^.]*?(\d+)\s*(?:laufende meter|lfm|lfdm|lm|meter)/i) ??
    lower.match(/(?:so\s+)?um\s+die\s+(\d+)\s*(?:laufende meter|lfm|lfdm|lm|meter)/i)
  const lfdm = fugMatch ? parseInt(fugMatch[1]) : null
  const mk = lfdm
    ? { konfidenz: 'high' as const, annahmen: [] as string[] }
    : { konfidenz: 'medium' as const, annahmen: ['Fugenmeter geschätzt, bitte vor Ort prüfen'] as string[] }

  if (lower.includes('fräsen') || lower.includes('fraesen') || lower.includes('gefräst') || lower.includes('gefraest')) {
    if (!hat(ergaenzt, 'fräsen', 'fraesen')) {
      if (lfdm) {
        ergaenzt.push({ beschreibung: 'Fugen fräsen', menge: lfdm, einheit: 'lfdm', berechnungsweg: `${lfdm} lfdm aus Transkript`, ...mk })
      } else {
        fehlende.push('Fugen fräsen (Meter prüfen)')
      }
    }
  }

  if (lfdm) {
    ergaenzt.push({ beschreibung: 'Fugen thermisch verschweißen (inkl. Schweißdraht)', menge: lfdm, einheit: 'lfdm', berechnungsweg: `${lfdm} lfdm aus Transkript`, ...mk })
  } else {
    fehlende.push('Fugen thermisch verschweißen (Meter prüfen)')
  }
}

export function pruefeTrittschalldaemmung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  // Ausdrücklich verlangt vs. von uns mitgedacht — das entscheidet später über
  // das „Vorschlag"-Etikett (PM-023). Bei Klick-Vinyl ergänzen WIR die Dämmung,
  // weil sie fachlich dazugehört; „mit Trittschalldämmung drunter" hat der
  // Handwerker dagegen selbst gesagt.
  const ausdruecklichGenannt =
    lower.includes('trittschalldämmung') ||
    lower.includes('trittschalldaemmung') ||
    lower.includes('gehschall') ||
    lower.includes('pur-schaum') || lower.includes('pur schaum')
  const hatDaemmung = ausdruecklichGenannt
    || lower.includes('klickvinyl') || lower.includes('klick-vinyl')
  if (!hatDaemmung) return
  if (hat(ergaenzt, 'trittschall', 'pur-schaum')) return

  // PM-023-Nachtest (2026-08-30): Die Menge kam aus dem GESAMTEN Transkript und
  // war damit die Grundfläche des ANDEREN Raums im selben Angebot. Deshalb
  // zuerst die berechnete Bodenfläche, dann erst der Rohtext.
  //
  // PM-032/033/035 (Prüfmeister, 02.09.2026) — derselbe Fund aus drei
  // Richtungen: Hier stand `ergaenzt.find(...)`, also die ERSTE
  // Verlegeposition, und daraus wurde EINE Dämmungsposition gebaut.
  //   * PM-032: ein Belag über drei Räume → Dämmung nur im ersten Raum,
  //     28,40 m² (127,80 €) fehlten zulasten des Betriebs.
  //   * PM-033: „Trittschall nur unterm Laminat im Flur" → die Dämmung landete
  //     im Wohnzimmer. 121,50 € zulasten des Kunden, 33,75 € zulasten des
  //     Betriebs, und ohne „Vorschlag"-Etikett, weil das Wort ja gefallen war.
  //   * PM-035: dritter Beleg, gleiche Ursache.
  // In PM-032 war die erste Position zufällig die richtige — deshalb sah der
  // Fall lange grün aus.
  //
  // Neue Regel, in dieser Reihenfolge:
  //   1. Nennt der Dämmungs-Satz einen Raum, gilt AUSSCHLIESSLICH dieser Raum.
  //      (Rangordnung „Ansage vor Struktur vor Rohtext".)
  //   2. Sonst: jeder verlegte Boden, der Trittschall überhaupt bekommt.
  // Je Raum eine eigene Position — sonst steht die Dämmung wieder ohne
  // Raumbezug unter „Allgemein" (der ursprüngliche PM-023-Fund).
  const verlegePositionen = ergaenzt.filter(p =>
    /(?:vinyl|laminat|parkett|bodenbelag|teppich|kork|linoleum).*(?:verlegen|verkleben)/i.test(p.beschreibung))

  // Teppich/Nadelvlies bekommt keine Trittschalldämmung — Bahnenware wird auf
  // den Untergrund geklebt. Bewusst eng gehalten: eine längere Ausschlussliste
  // (Linoleum, geklebtes Parkett) wäre fachlich diskutabel, und diese Liste
  // erfinde ich nicht selbst. Beim Prüfmeister zur Bestätigung gemeldet.
  const OHNE_TRITTSCHALL = /teppich|nadelvlies/i

  const genannterRaum = raumAusDaemmungsSatz(lower, verlegePositionen)
  const ziele = (genannterRaum
    ? verlegePositionen.filter(p => raumAusPositionsTitel(p.beschreibung) === genannterRaum)
    : verlegePositionen.filter(p => !OHNE_TRITTSCHALL.test(p.beschreibung))
  )

  const istHochwertig = lower.includes('hochwertig') || lower.includes('pur') || lower.includes('alufolie') || lower.includes('alukaschiert') || lower.includes('gehschall')
  const basisName = istHochwertig ? 'Trittschalldämmung hochwertig (PUR-Schaum, alukaschiert)' : 'Trittschalldämmung'
  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }

  if (ziele.length > 0) {
    for (const ziel of ziele) {
      // Raumfläche OHNE Verschnitt — die Dämmung wird stumpf gestoßen
      // (PM-032 ausdrücklich: 35,60 m², nicht 37,38 m²).
      const m2 = bodenNettoflaecheAusPositionen([ziel])
      if (!m2) continue
      const raumSuffix = raumAusPositionsTitel(ziel.beschreibung)
      ergaenzt.push({
        beschreibung: basisName + (raumSuffix ? ` — ${raumSuffix}` : ''),
        menge: m2, einheit: 'm²', berechnungsweg: `${m2} m² (Raumfläche ohne Verschnitt)`,
        ...(ausdruecklichGenannt ? { automatisch_ergaenzt: false } : {}),
        ...mk,
      })
    }
    return
  }

  // Kein verlegter Boden gefunden (z. B. reiner Dämmungs-Auftrag): wie bisher
  // aus dem Rohtext, aber ohne Raumbezug.
  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
    ?? bodenNettoflaecheAusPositionen(ergaenzt)
  if (m2) {
    ergaenzt.push({
      beschreibung: basisName, menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`,
      ...(ausdruecklichGenannt ? { automatisch_ergaenzt: false } : {}),
      ...mk,
    })
  } else {
    fehlende.push(basisName)
  }
}

/** Raum aus dem Titel-Suffix einer Position („… — Flur" → „Flur"). */
export function raumAusPositionsTitel(titel: string): string | null {
  return titel.match(/\s[—–-]\s*(.+)$/)?.[1]?.trim() ?? null
}

/**
 * Nennt der Satz, in dem die Dämmung vorkommt, einen der Räume des Angebots?
 *
 * Bewusst satzweise statt über das ganze Transkript: „Trittschall nur unterm
 * Laminat im Flur" darf nicht deshalb im Wohnzimmer landen, weil das
 * Wohnzimmer zwei Sätze weiter vorkommt. Verglichen wird nur gegen Räume, die
 * es im Angebot wirklich gibt — ein Raumname, den die Engine nicht kennt,
 * würde die Dämmung sonst ganz verschwinden lassen.
 */
export function raumAusDaemmungsSatz(
  lower: string,
  verlegePositionen: BerechnetePosition[],
): string | null {
  const raeume = verlegePositionen
    .map(p => raumAusPositionsTitel(p.beschreibung))
    .filter((r): r is string => !!r)
  if (raeume.length === 0) return null

  const satz = lower
    .split(/[.!?;]/)
    .map(t => t.trim())
    .find(t => /trittschall|gehschall|pur-?\s?schaum/i.test(t))
  if (!satz) return null

  return raeume.find(r => satz.includes(r.toLowerCase())) ?? null
}

export function pruefeStosskanten(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatStosskanten =
    lower.includes('stoßkanten') ||
    lower.includes('stosskanten') ||
    ((lower.includes('stoß') || lower.includes('stoss')) && lower.includes('verkleben'))
  if (!hatStosskanten) return
  if (hat(ergaenzt, 'stoßkanten', 'stosskanten')) return

  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }
  if (m2) {
    ergaenzt.push({ beschreibung: 'Stoßkanten verkleben', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
  } else {
    fehlende.push('Stoßkanten verkleben')
  }
}

export function pruefeFischgraet(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  v: AuftragsVerstaendnis,
): void {
  const hatFischgraet = lower.includes('fischgrät') || lower.includes('fischgraet')
  if (!hatFischgraet) return
  // PM-013, Nachtest 3 (2026-08-21): "verschnitt" zusätzlich zur Guard-Liste.
  // Seit Fix-Update 2 (2026-08-19) rechnet die Boden-Engine (boden.ts,
  // MUSTER_MIT_MEHR_VERSCHNITT) den Fischgrät-Verschnitt schon direkt in die
  // Hauptposition ein ("Fertigparkett verlegen inkl. 15% Verschnitt —
  // Wohnzimmer") — ohne dass deren Beschreibung "fischgrät"/"verkleben"
  // enthält. Diese (ältere, auf einen eigenen "Aufpreis"-Posten ausgelegte)
  // Prüfung erkannte das nicht, lief bei der HIER kombinierten
  // Mehrraum-Transkript-Fläche (Wohnzimmer + Flur gemischt) auf einen
  // Extraktionsfehler und landete als raumlose, doppelte
  // "(Menge prüfen)"-Position im "Allgemein"-Topf — obwohl der Verschnitt für
  // das Wohnzimmer längst korrekt in der echten Position steckt.
  if (hat(ergaenzt, 'fischgrät', 'fischgraet', 'verkleben', 'verschnitt')) return

  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }
  if (m2) {
    const explizitVerschnitt = extrahiereVerschnitt(lower)
    const verschnitt = explizitVerschnitt ?? 0.15
    const pct = Math.round(verschnitt * 100)
    const mengeMitVerschnitt = Math.round(m2 * (1 + verschnitt) * 100) / 100
    ergaenzt.push({
      beschreibung: 'Aufpreis Fischgrät-Verlegemuster (vollflächig verklebt)',
      menge: mengeMitVerschnitt,
      einheit: 'm²',
      berechnungsweg: `${m2} m² × ${1 + verschnitt} = ${mengeMitVerschnitt} m²`,
      ...mk,
      annahmen: [`Verlegemuster Fischgrät: +${pct}% Verschnitt`],
    })
  } else {
    fehlende.push('Fertigparkett Fischgrät vollflächig verkleben (Menge prüfen)')
  }
}

export function pruefeVollflaechigeVerklebung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatVollfl =
    (lower.includes('vollflächig verkleb') || lower.includes('vollflächig verklebt')) &&
    !hat(ergaenzt, 'fischgrät', 'fischgraet')
  if (!hatVollfl) return
  if (hat(ergaenzt, 'verkleben', 'verlegen')) return

  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }

  let beschreibung = 'Bodenbelag vollflächig verkleben'
  if (lower.includes('nadelvlies')) {
    const oeko = lower.includes('öko') || lower.includes('oeko') ? ' (Öko-Kleber)' : ''
    beschreibung = `Nadelvlies-Teppichboden vollflächig verkleben${oeko}`
  } else if (lower.includes('linoleum')) {
    beschreibung = 'Linoleum vollflächig verkleben'
  } else if (lower.includes('teppich')) {
    beschreibung = 'Teppichboden vollflächig verkleben'
  } else if (lower.includes('vinyl') || lower.includes('designboden')) {
    beschreibung = 'Vinyl / Designboden vollflächig verkleben'
  }

  if (m2) {
    ergaenzt.push({ beschreibung, menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
  } else {
    fehlende.push(beschreibung)
  }
}
