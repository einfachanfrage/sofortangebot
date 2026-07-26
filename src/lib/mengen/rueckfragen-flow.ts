import { analysiereKontext, type KIRueckfrageRaw } from '@/lib/kontext-analyzer'
import { generiereRueckfragen, type RueckfrageItem, type RueckfrageTyp } from './rueckfragen-generator'
import { verarbeiteAntworten, type KalkulationsAntworten } from './antworten-verarbeiter'
import type { ExtrahierteDaten } from './types'

const ANTWORTBARE_IDS = [
  /^masse_/, /^hoehe_/, /^raum_/, /^plural_/, /^belag_/, /^altbelag_/,
  /^tueren_anzahl_/, /^fenster_anzahl_/,
  /^tapete_entfernen_/, /^altfliesen_/, /^flieshoehe_/, /^versiegelung_/,
  /^decke_masse$/, /^geruest$/, /^daemmung_staenderwand$/, /^brandschutz$/,
  /^dusche_typ$/, /^rohre_erneuern$/, /^bad_ausstattung$/, /^kabel_meter$/,
  /^unterverteilung$/, /^wallbox_zuleitung$/, /^elektro_umfang$/,
]

function istAntwortbar(id: string): boolean {
  return ANTWORTBARE_IDS.some(muster => muster.test(id))
}

function normalisiereTyp(typ: KIRueckfrageRaw['typ']): RueckfrageTyp {
  if (typ === 'meter') return 'laenge'
  return typ
}

function konvertiereKIRueckfrage(frage: KIRueckfrageRaw): RueckfrageItem {
  const typ = normalisiereTyp(frage.typ)
  return {
    id: frage.id,
    frage: frage.frage,
    kontext: frage.betrifft ?? '',
    typ,
    einheit: typ === 'hoehe' || typ === 'laenge' ? 'm' : undefined,
    schnell_antworten: (frage.schnell_antworten ?? [])
      .filter(option => option.wert !== null)
      .map(option => ({
        label: option.label,
        wert: typeof option.wert === 'boolean' ? (option.wert ? 1 : 0) : option.wert as number,
        einheit: typ === 'hoehe' || typ === 'laenge' ? 'm' : typ === 'ja_nein' ? 'bool' : 'Stück',
      })),
  }
}

function dedupliziere(fragen: RueckfrageItem[]): RueckfrageItem[] {
  const ids = new Set<string>()
  const texte = new Set<string>()
  return fragen.filter(frage => {
    const textKey = frage.frage.toLocaleLowerCase('de-DE').replace(/[^a-zäöüß0-9]/g, '')
    if (ids.has(frage.id) || texte.has(textKey)) return false
    ids.add(frage.id)
    texte.add(textKey)
    return true
  })
}

export function bereiteRueckfragenVor(
  extraktion: ExtrahierteDaten,
  antworten: KalkulationsAntworten = {},
): { extraktion: ExtrahierteDaten; rueckfragen: RueckfrageItem[] } {
  // Antworten zuerst einsetzen und erst danach erneut prüfen, was noch fehlt.
  // Beispiel: Nach Länge × Breite wird bei Malerarbeiten erst erkennbar, dass
  // zusätzlich die Raumhöhe für die Wandfläche benötigt wird.
  const beantwortet = Object.keys(antworten).length > 0
    ? verarbeiteAntworten(extraktion, antworten)
    : extraktion
  const kontext = analysiereKontext(beantwortet).extraktion_angereichert
  const beantworteteIds = new Set(Object.keys(antworten))

  const kontextFragen = (kontext.rueckfragen ?? [])
    .filter(frage => istAntwortbar(frage.id))
    .map(frage => konvertiereKIRueckfrage(frage))
  const vageFragen = generiereRueckfragen(kontext)
  const rueckfragen = dedupliziere([...kontextFragen, ...vageFragen])
    .filter(frage => !beantworteteIds.has(frage.id))

  const angereichert = kontext
  angereichert.rueckfragen = []

  return { extraktion: angereichert, rueckfragen }
}
