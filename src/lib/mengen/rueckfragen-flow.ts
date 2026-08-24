import { analysiereKontext, type KIRueckfrageRaw } from '@/lib/kontext-analyzer'
import { generiereRueckfragen, type RueckfrageItem, type RueckfrageTyp } from './rueckfragen-generator'
import { verarbeiteAntworten, type KalkulationsAntworten } from './antworten-verarbeiter'
import type { ExtrahierteDaten } from './types'
import { artFuerRueckfrage, findeGesagtenWert } from './gesagte-werte'

const ANTWORTBARE_IDS = [
  /^masse_/, /^hoehe_/, /^raum_/, /^plural_/, /^belag_/, /^altbelag_/,
  /^dachschraege_flaeche_/,
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
  // Flächen-Rückfragen (Dachschräge) sind freie m²-Eingaben, keine Stückzahl.
  const istFlaeche = /_flaeche_/.test(frage.id)
  const einheit = typ === 'hoehe' || typ === 'laenge' ? 'm' : istFlaeche ? 'm²' : undefined
  return {
    id: frage.id,
    frage: frage.frage,
    kontext: frage.betrifft ?? '',
    typ,
    einheit,
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

/**
 * DC-026: Hängt an eine Frage den Wert an, der schon im Transkript steht.
 * Findet sich keiner (oder wäre er bei mehreren Räumen geraten), bleibt die
 * Frage unverändert eine normale offene Frage.
 */
function ergaenzeVorschlag(
  frage: RueckfrageItem,
  transkript: string,
  kontext: ExtrahierteDaten,
): RueckfrageItem {
  if (!transkript.trim()) return frage
  const art = artFuerRueckfrage(frage.id, frage.typ)
  if (!art) return frage
  const alleRaumNamen = [
    ...(kontext.raeume ?? []).map(r => r.name),
    ...(kontext.bereiche ?? []).map(b => b.name),
  ].filter((name): name is string => Boolean(name))
  const vorschlag = findeGesagtenWert(art, transkript, frage.kontext || null, alleRaumNamen)
  return vorschlag ? { ...frage, vorschlag } : frage
}

export function bereiteRueckfragenVor(
  extraktion: ExtrahierteDaten,
  antworten: KalkulationsAntworten = {},
  // DC-026: das rohe Transkript, um Werte zu finden, die zwar gesagt, aber
  // nicht strukturiert erkannt wurden. Optional, damit bestehende Aufrufer
  // und Tests unverändert funktionieren.
  transkript?: string,
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
  const zusammen = dedupliziere([...kontextFragen, ...vageFragen])
  // Wenn die volle Maßfrage (masse_<raum>, Wand- UND Bodenfläche) vorliegt, ist die
  // reine Bodenfrage (masse_boden_<raum>) redundant — sonst wird derselbe Raum zweimal
  // nach Maßen gefragt. Die volle Frage deckt beide Flächen bereits ab.
  const volleMasseRaeume = new Set(
    zusammen.filter(f => /^masse_[^_]/.test(f.id) && !f.id.startsWith('masse_boden_') && !f.id.startsWith('masse_lb_'))
      .map(f => f.id.replace(/^masse_/, '')),
  )
  const rueckfragen = zusammen
    .filter(frage => !(frage.id.startsWith('masse_boden_') && volleMasseRaeume.has(frage.id.replace(/^masse_boden_/, ''))))
    .filter(frage => !beantworteteIds.has(frage.id))
    .map(frage => ergaenzeVorschlag(frage, transkript ?? kontext.transkript ?? '', kontext))

  const angereichert = kontext
  angereichert.rueckfragen = []

  return { extraktion: angereichert, rueckfragen }
}
