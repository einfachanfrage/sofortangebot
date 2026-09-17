import { describe, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({ id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, bereiche: any[], altbelag: any[] = []) {
  const eng = berechneMengen('fliesen', { transkript, bereiche, altbelag })
  const meta = { raeume: bereiche.map(b => ({ name: b.name, hoehe: null })) }
  const signale = { arbeitenTexte: [], belagText: null, altbelagEntfernen: altbelag.length > 0, raeume: bereiche.map(b => ({ name: b.name, arbeiten: [] })) }
  return pruefeUndErgaenzeVollstaendigkeit('fliesen', eng.positionen, transkript, meta as never, signale as never).positionen
}
function preisFuer(beschreibung: string, einheit = 'm²') {
  const g = gewerkFuerPosition(beschreibung, 'fliesen')
  const t = findePreisposition(beschreibung, einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
  return { gewerk: g, titel: t?.position.title ?? null, preis: t?.position.unit_price ?? null }
}

describe('MESSUNG', () => {
  it('druckt', () => {
    const T61 = 'Im Bad nur die Wandfliesen runter, die alten Fliesen an der Wand kommen weg, achtzehn Quadratmeter. Danach neu fliesen bis zwei Meter zehn. Bad ist zwei Meter vierzig mal ein Meter achtzig.'
    const p61 = lauf(T61, [{ name: 'Bad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1, nassbereich: false }], [{ bereich: 'Bad', flaeche: 18 }])
    console.log('=== PM-061 alle Zeilen ===')
    let summe = 0
    for (const z of p61) {
      const r = preisFuer(z.beschreibung, z.einheit)
      const wert = r.preis ? Math.round(r.preis * z.menge * 100) / 100 : 0
      summe += wert
      console.log([z.beschreibung, z.menge, z.einheit, r.gewerk, r.titel ?? 'KEIN TREFFER', r.preis ?? '-', wert].join(' | '))
    }
    console.log('SUMME61:', Math.round(summe * 100) / 100)

    const T60 = 'Bad komplett neu fliesen, zwei Meter vierzig mal ein Meter achtzig, Fliesenhöhe zwo Meter zehn. Nassbereich, Dusche. Die alten Fliesen kommen raus, das sind sechzehn Quadratmeter.'
    const p60 = lauf(T60, [{ name: 'Bad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1, nassbereich: true }], [{ bereich: 'Bad', flaeche: 16 }])
    console.log('=== PM-060 alle Zeilen ===')
    let s60 = 0
    for (const z of p60) {
      const r = preisFuer(z.beschreibung, z.einheit)
      const wert = r.preis ? Math.round(r.preis * z.menge * 100) / 100 : 0
      s60 += wert
      console.log([z.beschreibung, z.menge, z.einheit, r.gewerk, r.titel ?? 'KEIN TREFFER', r.preis ?? '-', wert].join(' | '))
    }
    console.log('SUMME60:', Math.round(s60 * 100) / 100)

    console.log('=== Entsorgung / Nische ===')
    for (const t of ['Entsorgung Fliesenmaterial', 'Entsorgung Fliesenmaterial — Bad', 'Fliesenschutt entsorgen — Bad', 'Nische fliesen — Bad', 'Wandnische fliesen — Bad', 'Nische / Wandnische fliesen — Bad']) {
      console.log(t, '→', JSON.stringify(preisFuer(t)))
    }
  })
})
