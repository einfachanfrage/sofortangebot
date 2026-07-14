import type { BerechnetePosition } from '../mengen/types'
import { hat, add, addMitMenge } from './helpers'
import { extrahiereFlaeche, extrahiereFlaecheAusAbmessungen } from './boden-basis'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

function extrahiereLfdm(lower: string, schluessel: string): number | null {
  const esc = schluessel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const m =
    lower.match(new RegExp(`(\\d+)\\s*(?:laufende meter|lfm|lfdm|lm)\\s*${esc}`, 'i')) ??
    lower.match(new RegExp(`${esc}.*?(\\d+)\\s*(?:laufende meter|lfm|lfdm|lm|meter)`, 'i')) ??
    lower.match(new RegExp(`(\\d+)\\s*${esc}`, 'i'))
  return m ? parseInt(m[1]) : null
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
    ?? ergaenzt.find(p => /altbelag entfernen|boden/i.test(p.beschreibung) && p.einheit === 'm²')?.menge
    ?? null

  // Kleberreste abschleifen bei verklebtem Altbelag — UNABHÄNGIG davon, ob die Engine
  // schon "Altbelag entfernen" angelegt hat (sonst lief dieser Zweig in Prod nie).
  const willKleber = hatVerklebt && (lower.includes('kleber') || lower.includes('kleberreste') || v.hatArbeit('schleifen'))
  if (willKleber && !hat(ergaenzt, 'kleberreste', 'kleber abschleif')) {
    if (m2) ergaenzt.push({ beschreibung: 'Kleberreste abschleifen', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
    else fehlende.push('Kleberreste abschleifen')
  }

  // Basis-Altbelag nur, wenn noch keine Entfernen-Position existiert
  if (!(v.altbelagEntfernen && !hat(ergaenzt, 'altbelag', 'entfernen', 'demontage', 'teppichboden entfernen'))) return

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
  if (hat(ergaenzt, 'feuchtigkeitssperre', 'epoxidharz')) return

  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }

  const name = lower.includes('epoxidharz') ? 'Epoxidharz-Feuchtigkeitssperre aufwalzen' : 'Feuchtigkeitssperre aufbringen'
  if (m2) {
    ergaenzt.push({ beschreibung: name, menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
  } else {
    fehlende.push(name)
  }

  // Quarzsand absanden — häufig im Zusammenhang
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
  if (hat(ergaenzt, 'sockel', 'profilleiste')) return

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
  if (lfm && lfm > 0 && lfm < 500) {
    addMitMenge(ergaenzt, 'Sockelleisten montieren', lfm, 'lfdm', `${lfm} lfdm aus Transkript`)
    return
  }
  // Keine Meter genannt → Umfang aus der Bodenfläche schätzen (quadratischer Raum),
  // statt die Position stumm in "fehlende" zu schieben.
  if (!hat(ergaenzt, 'sockel')) {
    const flaeche = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
      ?? ergaenzt.find(p => /altbelag entfernen|verlegen|boden/i.test(p.beschreibung) && p.einheit === 'm²')?.menge
      ?? null
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
  const hatUebergang =
    lower.includes('übergangsprofil') ||
    lower.includes('uebergangsprofil') ||
    lower.includes('raumübergang') ||
    lower.includes('türübergang') ||
    lower.includes('anschlussprofil') ||
    lower.includes('alu-übergangsprofil') ||
    (lower.includes('übergang') && (lower.includes('profil') || lower.includes('alu')))

  if (!hatUebergang) return
  if (hat(ergaenzt, 'übergangsprofil', 'uebergangsprofil', 'anschlussprofil')) return

  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }

  // Stückzahl: direkte Zahl oder "zwei", "drei" etc.
  const zahlwoerter: Record<string, number> = { ein: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6 }
  let anzahl = 0
  const numMatch = lower.match(/(\d+)\s*(?:stück\s*)?(?:alu-?)?(?:übergangs|anschluss)?profil/i)
    ?? lower.match(/(?:an|bei)\s+(\d+)\s*(?:zimmer|raum|tür)/i)
  if (numMatch) {
    anzahl = parseInt(numMatch[1])
  } else {
    for (const [wort, val] of Object.entries(zahlwoerter)) {
      if (lower.includes(wort + ' ') || lower.includes(wort + 'e')) { anzahl = val; break }
    }
  }

  // Bezeichnung
  const beschreibung = lower.includes('alu') && lower.includes('silber')
    ? 'Alu-Übergangsprofil Silber'
    : lower.includes('alu')
    ? 'Alu-Übergangsprofil'
    : 'Übergangsprofil'

  if (anzahl > 0) {
    ergaenzt.push({ beschreibung, menge: anzahl, einheit: 'Stück', berechnungsweg: `${anzahl} Stück aus Transkript`, ...mk })
  } else {
    fehlende.push(beschreibung + ' (Anzahl prüfen)')
  }
}
