import type { MengenErgebnis } from './types'
import { malerEngine } from './gewerke/maler'
import { fliesenEngine } from './gewerke/fliesen'
import { trockenBauEngine } from './gewerke/trockenbau'
import { bodenEngine } from './gewerke/boden'
import { sanitaerEngine } from './gewerke/sanitaer'
import { elektroEngine } from './gewerke/elektro'

const GEWERK_ENGINES: Record<string, (daten: any) => MengenErgebnis> = {
  maler:            malerEngine,
  fliesen:          fliesenEngine,
  trockenbau:       trockenBauEngine,
  boden_parkett:    bodenEngine,
  sanitaer_heizung: sanitaerEngine,
  elektro:          elektroEngine,
}

export function berechneMengen(gewerk: string, strukturierteDaten: any): MengenErgebnis {
  const engine = GEWERK_ENGINES[gewerk]

  if (!engine) {
    return {
      gewerk,
      quelleText: strukturierteDaten.transkript ?? '',
      objekte: [],
      positionen: (strukturierteDaten.positionen ?? []).map((p: any) => ({
        ...p,
        konfidenz: 'low' as const,
        berechnungsweg: 'Direkt aus Spracheingabe',
        annahmen: ['Menge nicht berechnet — Gewerk noch nicht in Engine'],
      })),
      rueckfragen: [],
      warnungen: [`Mengenermittlung für ${gewerk} noch nicht verfügbar. Bitte Mengen prüfen.`],
      plausibel: false,
    }
  }

  return engine(strukturierteDaten)
}
