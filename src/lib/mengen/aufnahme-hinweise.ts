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

  if (/sockelleisten demontieren/i.test(hinweise) && !hatPos(/sockelleisten demontieren/i)) {
    const montage = ergebnis.find(p => /sockelleisten montieren/i.test(p.beschreibung))
    const menge = expliziteSockelMenge ?? montage?.menge
    if (menge && menge > 0) {
      ergebnis.push({
        beschreibung: `Sockelleisten demontieren${raumSuffix(boden ?? montage)}`,
        menge,
        einheit: 'lfdm',
        konfidenz: expliziteSockelMenge ? 'high' : 'medium',
        berechnungsweg: expliziteSockelMenge ? `${menge} lfdm aus Aufnahme` : 'Gleiche Länge wie neue Sockelleisten',
        annahmen: expliziteSockelMenge ? [] : ['Gleiche Länge wie neue Sockelleisten angenommen'],
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
