import type { BerechnetePosition } from './types'
import { ersetzeZahlenWorte } from '@/lib/zahlen-parser'

function raumSuffix(position: BerechnetePosition | undefined): string {
  const raum = position?.beschreibung.match(/\s[—–-]\s*(.+)$/)?.[1]?.trim()
  return raum ? ` — ${raum}` : ''
}

function nettoBodenflaeche(position: BerechnetePosition | undefined): number | null {
  if (!position) return null
  const ausRechenweg = position.berechnungsweg?.match(/(\d+(?:[.,]\d+)?)\s*m²/i)
  if (ausRechenweg) return Number(ausRechenweg[1].replace(',', '.'))
  if (/10\s*%\s*verschnitt/i.test(position.beschreibung)) return Math.round(position.menge / 1.1 * 100) / 100
  return position.menge
}

/**
 * Die schnellen grünen Erkennungs-Chips sind nur ein Sicherheitsnetz. Sie dürfen
 * niemals erneut in die KI-Extraktion gelangen (sonst entstehen Phantomräume),
 * sondern ergänzen ausschließlich eindeutig fehlende Positionen mit Mengen, die
 * die eigentliche Engine bereits berechnet hat.
 */
export function ergaenzeAusAufnahmeHinweisen(
  positionen: BerechnetePosition[],
  titel: string[],
  quelltext = '',
): BerechnetePosition[] {
  const ergebnis = [...positionen]
  const hinweise = titel.join(' | ').toLocaleLowerCase('de-DE')
  const hatPos = (muster: RegExp) => ergebnis.some(p => muster.test(p.beschreibung))
  const wand = ergebnis.find(p => /wandfl[äa]chen streichen/i.test(p.beschreibung))
  const boden = ergebnis.find(p => /(?:vinyl|laminat|parkett|bodenbelag).*verlegen/i.test(p.beschreibung))
  const bodenM2 = nettoBodenflaeche(boden)
  const textMitZahlen = ersetzeZahlenWorte(quelltext).toLocaleLowerCase('de-DE')
  const sockelMengenTreffer = textMitZahlen.match(/(\d+(?:[.,]\d+)?)\s*(?:laufende[nr]?\s+meter|lfdm|lfm)[^.]{0,50}sockelleist/i)
    ?? textMitZahlen.match(/sockelleist[^.]{0,50}?(\d+(?:[.,]\d+)?)\s*(?:laufende[nr]?\s+meter|lfdm|lfm)/i)
  const expliziteSockelMenge = sockelMengenTreffer ? Number(sockelMengenTreffer[1].replace(',', '.')) : null

  if (/w[äa]nde? schleifen|schleifen.*w[äa]nde?/.test(hinweise) && wand && !hatPos(/^Schleifen(?:\s|—|–|-)/i)) {
    ergebnis.push({ beschreibung: `Schleifen${raumSuffix(wand)}`, menge: wand.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie ${wand.beschreibung.split(' — ')[0]}`, annahmen: [] })
  }

  if (/(?:teppichboden|altbelag).*(?:entfern|aufnehm)/.test(hinweise) && bodenM2 && !hatPos(/altbelag entfernen|teppichboden entfernen/i)) {
    ergebnis.push({ beschreibung: `Altbelag entfernen${raumSuffix(boden)}`, menge: bodenM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${bodenM2} m² Bodenfläche`, annahmen: [] })
  }

  if ((/trittschall/.test(hinweise) || /klick.?vinyl/.test(hinweise)) && bodenM2 && !hatPos(/trittschall/i)) {
    ergebnis.push({ beschreibung: `Trittschalldämmung${raumSuffix(boden)}`, menge: bodenM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${bodenM2} m² Bodenfläche`, annahmen: [] })
  }

  // PM-010, Nachtest 5 (2026-08-19): Der Karten-Chip sagt "Sockelleisten
  // entfernen" (bestätigt am echten Live-Fall) — diese Prüfung verlangte
  // aber wörtlich "demontieren". Weil GPT die Chip-Titel frei formuliert
  // (kein festes Vokabular), hat "entfernen" hier nie gegriffen, obwohl die
  // Karte die Arbeit korrekt erkannt hatte — die Position ist deshalb
  // komplett verschwunden, nicht mal als offene Rückfrage. Jetzt alle
  // gängigen Synonyme fürs Entfernen zulassen. Risikoarm: Chip-Titel sind
  // bereits kuratierte Kurzlabel aus der Aufnahme-Erkennung, kein Rohtext —
  // anders als bei Fließtext-Regex droht hier keine "Über-Erkennung".
  const sockelEntfernenMuster = /sockelleiste(?:n)?\s*(?:demontieren|entfernen|abbauen|abmontieren|ausbauen)/i
  if (sockelEntfernenMuster.test(hinweise) && !hatPos(sockelEntfernenMuster)) {
    const montage = ergebnis.find(p => /sockelleisten montieren/i.test(p.beschreibung))
    const menge = expliziteSockelMenge ?? montage?.menge
    if (menge && menge > 0) {
      ergebnis.push({
        beschreibung: `Sockelleisten entfernen (alt)${raumSuffix(boden ?? montage)}`,
        menge,
        einheit: 'lfdm',
        konfidenz: expliziteSockelMenge ? 'high' : 'medium',
        berechnungsweg: expliziteSockelMenge ? `${menge} lfdm aus Aufnahme` : 'Gleiche Länge wie neue Sockelleisten',
        annahmen: expliziteSockelMenge ? [] : ['Gleiche Länge wie neue Sockelleisten angenommen'],
      })
    }
  }

  // PM-013 (2026-08-19): "Dehnungsfuge einbauen" wird von der Karte als
  // eigene Leistung mit eigener Menge erkannt ("1 Stück"), verschwindet im
  // fertigen Entwurf aber komplett — keine Zeile, keine offene Rückfrage.
  // Anders als bei den Sockelleisten-Fällen (PM-010/PM-012) gibt es hier
  // bisher AUCH keine Erkennung in der Boden-Engine oder der
  // Vollständigkeitsprüfung, die man nur "sichtbar machen" müsste — die
  // Karten-Erkennung ist aktuell die EINZIGE Stelle im System, die
  // "Dehnungsfuge" überhaupt kennt. Deshalb hier, wie bei den Sockelleisten-
  // Funden, den Chip-Titel als alleiniges Signal nehmen. Einheit bewusst
  // "Stück" (wie vom Chip erkannt) statt an einen der beiden lfdm-
  // Katalogpreise anzugleichen — im Transkript stand keine Länge, nur "eine
  // Dehnungsfuge". Fehlt dadurch ein passender Katalogpreis, bleibt die
  // Position sichtbar mit 0,00 € offen (gleiches, bewährtes Prinzip wie bei
  // fehlenden Preisen generell) statt zu verschwinden.
  // PM-013, Nachtest 2 (2026-08-20): der Chip-Titel-Fix von gestern war zu
  // zerbrechlich — bei NACHWEISLICH IDENTISCHEM Transkript hat GPTs
  // Karten-Erkennung die Dehnungsfuge im zweiten Testlauf gar nicht mehr
  // gemeldet (Sandy bestätigt: „habe Dehnungsfuge mit gesagt", gleicher
  // Wortlaut wie beim ersten Test). Der Fix hing komplett an dieser einen,
  // nachweislich nicht deterministischen Chip-Antwort — technisch
  // einwandfrei, aber nur so zuverlässig wie die vorgelagerte Erkennung.
  // Fix: zusätzlicher Fallback direkt im Rohtranskript, unabhängig vom Chip
  // — analog zu BODEN_VERLEGEN_SIGNAL (boden.ts/kontext-analyzer.ts).
  // Unterschied zu den Chip-Titeln: die sind bereits kuratierte Kurzlabel
  // (GPT formuliert nie "keine Dehnungsfuge" als Chip-Titel), das
  // Rohtranskript ist aber echter Fließtext und könnte eine Verneinung
  // enthalten ("keine Dehnungsfuge nötig") — deshalb hier zusätzlich
  // dieselbe Verneinungserkennung wie bei "kein Fenster"/"keine Tür"
  // (arbeiten-normalisierer.ts), damit der Fallback nicht selbst zum
  // Phantom-Auslöser wird.
  const dehnungsfugeMuster = /dehnungsfuge|bewegungsfuge/i
  const dehnungsfugeVerneint = /(?:kein[e]?|ohne)\s+(?:dehnungsfuge|bewegungsfuge)/i
  const dehnungsfugeImTranskript = dehnungsfugeMuster.test(textMitZahlen) && !dehnungsfugeVerneint.test(textMitZahlen)
  if ((dehnungsfugeMuster.test(hinweise) || dehnungsfugeImTranskript) && !hatPos(dehnungsfugeMuster)) {
    const stueckTreffer = textMitZahlen.match(/(\d+)\s*(?:stück\s*)?(?:dehnungsfuge|bewegungsfuge)/i)
      ?? textMitZahlen.match(/(?:dehnungsfuge|bewegungsfuge)[^.]{0,20}?(\d+)\s*stück/i)
    const stueck = stueckTreffer ? parseInt(stueckTreffer[1], 10) : 1
    ergebnis.push({
      beschreibung: `Dehnungsfuge einbauen${raumSuffix(boden)}`,
      menge: stueck,
      einheit: 'Stück',
      konfidenz: stueckTreffer ? 'high' : 'medium',
      berechnungsweg: stueckTreffer ? `${stueck} Stück aus Aufnahme` : 'Dehnungsfuge erkannt, keine explizite Stückzahl im Transkript — 1 Stück angenommen',
      annahmen: stueckTreffer ? [] : ['1 Stück angenommen — bitte Anzahl/Länge prüfen'],
    })
  }

  // PM-012, zweiter Nachtest (2026-08-19): der Fix vom 17.08. in der
  // Maler-Engine (vollstaendigkeit/maler-tapete.ts) war im Golden-Test grün,
  // live aber weiterhin wirkungslos — „Sockelleisten streichen" fehlte
  // erneut komplett, obwohl der Karten-Chip sie zuverlässig mit eigener
  // Menge meldet ("Sockelleisten streichen, 10 m"). Gleiches
  // Sicherheitsnetz-Prinzip wie bei den anderen Sockelleisten-/Dehnungsfuge-
  // Fällen oben: nur ergänzen, wenn die tiefere Engine noch keine
  // "Sockelleisten streich..."-Position angelegt hat (die Ursache, WARUM die
  // Text-Heuristik dort live nicht greift, obwohl der Golden-Test sie
  // bestätigt, ist ohne echten GPT-Rohdaten-Zugriff nicht abschließend
  // nachvollziehbar — dieser Fix behebt die SICHTBARKEIT unabhängig davon).
  const sockelStreichenMuster = /sockelleiste(?:n)?\s*streichen/i
  if (sockelStreichenMuster.test(hinweise) && !hatPos(/sockelleisten streich/i)) {
    const montage = ergebnis.find(p => /sockelleisten (?:montieren|erneuern)/i.test(p.beschreibung))
    const abkleben = ergebnis.find(p => /sockelleisten abkleben/i.test(p.beschreibung))
    const quelle = montage ?? abkleben
    const menge = expliziteSockelMenge ?? quelle?.menge
    if (menge && menge > 0) {
      ergebnis.push({
        beschreibung: `Sockelleisten streichen${raumSuffix(boden ?? quelle ?? wand)}`,
        menge,
        einheit: 'lfdm',
        konfidenz: expliziteSockelMenge ? 'high' : 'medium',
        berechnungsweg: expliziteSockelMenge ? `${menge} lfdm aus Aufnahme` : `Gleiche Länge wie „${quelle?.beschreibung}"`,
        annahmen: expliziteSockelMenge ? [] : ['Menge von vorhandener Sockelleisten-Position übernommen — bitte kurz prüfen'],
      })
    }
  }

  if (/sockelleisten montieren/i.test(hinweise)) {
    const expliziteMenge = expliziteSockelMenge
    const montage = ergebnis.find(p => /sockelleisten montieren/i.test(p.beschreibung))
    if (montage) {
      if (expliziteMenge && expliziteMenge > 0) {
        montage.menge = expliziteMenge
        montage.berechnungsweg = `${expliziteMenge} lfdm aus Aufnahme`
        montage.annahmen = []
      }
      return ergebnis.filter(p => !/sockelleisten abkleben/i.test(p.beschreibung))
    }

    const abkleben = ergebnis.find(p => /sockelleisten abkleben/i.test(p.beschreibung))
    const menge = expliziteMenge && expliziteMenge > 0 ? expliziteMenge : abkleben?.menge
    if (menge) {
      ergebnis.push({
        beschreibung: `Sockelleisten montieren${raumSuffix(boden ?? wand)}`,
        menge,
        einheit: 'lfdm',
        konfidenz: expliziteMenge ? 'high' : 'medium',
        berechnungsweg: expliziteMenge ? `${expliziteMenge} lfdm aus Aufnahme` : (abkleben?.berechnungsweg ?? 'Raumumfang'),
        annahmen: expliziteMenge ? [] : ['Menge aus Raumumfang übernommen'],
      })
    }
    return ergebnis.filter(p => !/sockelleisten abkleben/i.test(p.beschreibung))
  }
  return ergebnis
}

/**
 * Letzte fachliche Normalisierung direkt vor dem Speichern/Bepreisen.
 * Damit bleibt der exakte Katalogtitel auch dann erhalten, wenn ein vorgelagerter
 * Extraktionspfad nur das allgemeine "Fertigparkett verlegen" geliefert hat.
 */
export function normalisiereBodenPositionenAusAufnahme(
  positionen: BerechnetePosition[],
  quelltext: string,
): BerechnetePosition[] {
  const text = quelltext.toLocaleLowerCase('de-DE')
  if (!/fertigparkett/.test(text) || !/vollfl.chig.{0,40}verkleb|verkleb.{0,40}vollfl.chig/.test(text)) {
    return positionen
  }
  return positionen.map(position => {
    if (!/fertigparkett verlegen/i.test(position.beschreibung) || /vollfl.chig verklebt/i.test(position.beschreibung)) {
      return position
    }
    const suffix = position.beschreibung.match(/\s[—–-]\s*(.+)$/)?.[0] ?? ''
    return {
      ...position,
      beschreibung: `Fertigparkett verlegen vollflächig verklebt${suffix}`,
    }
  })
}
