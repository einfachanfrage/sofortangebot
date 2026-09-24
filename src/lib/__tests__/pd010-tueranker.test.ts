import { describe, it, expect } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ANKER, katalogPreis, leiteAb } from '../preis-ableitung'
import { standardFamilie } from '../katalog-standard'
import { GEWERK_PREISE } from '../preise-vorlagen'

// PD-010 (Prüfmeister, 15.09.2026) — der Anker fürs Lackieren und das
// Aufräumen, das mit ihm kommt.
//
// Der Kern seines Fundes: Für EINE Innentür führte der Katalog fünf Zeilen in
// zwei Rubriken, für die Zarge drei. Die billigeren lagen in der falschen
// Tätigkeit — „Tür streichen / lackieren (beidseitig)" stand mit 75,00 € unter
// „Anstrich Innen" statt unter „Lackierarbeiten". Ein Betrieb, der den
// Lackier-Haken gar nicht setzt, bekam seine Türen trotzdem bepreist: 15 € zu
// billig und ohne je nach dem Preis gefragt worden zu sein.

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
  const r2 = extraktion.raeume ?? raeume
  const signale = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arbeitenTexte: r2.flatMap((r: any) => r.arbeiten ?? []),
    belagText: null, altbelagEntfernen: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten ?? [] })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(transkript) || undefined,
    tuerenAnzahl: zaehleTueren(transkript) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, transkript, meta as never, signale as never).positionen
}

function rubrikDesPreises(titel: string, einheit: string): string | null {
  const g = gewerkFuerPosition(titel, 'maler')
  const treffer = findePreisposition(titel, einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
  return treffer?.position.category ?? null
}

describe('🔴 Die Probe des Prüfmeisters: eine Tür, keine zweite Rubrik', () => {
  // Wörtlich: „Ein Angebot mit einer Tür darf genau zwei Zeilen erzeugen —
  // Blatt und Zarge — und nie eine dritte aus der anderen Rubrik. Heute kann
  // der Matcher je nach Titel in beiden Rubriken landen; nach dem Aufräumen
  // gibt es die zweite Rubrik nicht mehr."
  //
  // Sein „genau zwei" zielt auf den KATALOG (zwei Türzeilen statt fünf), nicht
  // auf die Zahl der Positionen: Abschleifen und Grundieren sind eigene
  // Arbeitsgänge, die die Engine zu Recht dazulegt. Beide Lesarten stehen hier
  // als eigene Prüfung.
  const T = 'Wohnzimmer, vier mal fünf, zweifuffzig hoch. Wände streichen. Und die Tür lackieren, beidseitig.'
  const pos = () => lauf(T, [raum('Wohnzimmer', {
    laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen', 'tür lackieren'],
  })])
  const tuerZeilen = () => pos().filter(p => /t(ü|ue)r|zarge|rahmen/i.test(p.beschreibung))

  it('jede Tür- und Zargenzeile wird aus den Lackierarbeiten bepreist', () => {
    const fremd = tuerZeilen()
      .map(p => ({ p, rubrik: rubrikDesPreises(p.beschreibung, p.einheit) }))
      .filter(({ rubrik }) => rubrik !== 'Maler – Lackierarbeiten')
      .map(({ p, rubrik }) => `${p.beschreibung} → ${rubrik ?? 'kein Preis'}`)
    expect(fremd).toEqual([])
    expect(tuerZeilen().length).toBeGreaterThan(0)
  })

  it('Blatt und Zarge entstehen, und die Zarge genau einmal', () => {
    const p = pos()
    expect(p.filter(x => /^Türen lackieren \(2× Anstrich\)/.test(x.beschreibung))).toHaveLength(1)
    expect(p.filter(x => /zarge/i.test(x.beschreibung))).toHaveLength(1)
  })

  it('der Katalog führt zwei Türzeilen und eine Zargenzeile', () => {
    const tuer = DEFAULT_PRICES.filter(p =>
      /^Maler/.test(p.category) && /^t(ü|ue)ren?\b/i.test(p.title) && /lackier|streich/i.test(p.title))
    expect(tuer.map(p => `${p.title} ${p.unit_price}`).sort()).toEqual([
      'Türen lackieren — 2× Anstrich 90',
      'Türen lackieren einseitig (2× Anstrich) 55',
    ])
    const zarge = DEFAULT_PRICES.filter(p => /^Maler/.test(p.category) && /^türzarge/i.test(p.title))
    expect(zarge.map(p => p.title)).toEqual(['Türzarge lackieren'])
  })

  it('die vier Altlast-Zeilen sind weg', () => {
    for (const titel of [
      'Tür streichen / lackieren (einseitig)',
      'Tür streichen / lackieren (beidseitig)',
      'Türzarge streichen',
      'Innentürblatt lackieren beidseitig',
      'Innentürblatt lackieren einseitig',
    ]) {
      expect(DEFAULT_PRICES.some(p => p.title === titel), titel).toBe(false)
    }
  })
})

describe('Der Anker ist die Zeile, die die Engine selbst erzeugt', () => {
  it('Anker = „Türen lackieren — 2× Anstrich" zu 90,00 €', () => {
    const lack = ANKER.find(a => a.taetigkeit === 'lackieren')!
    expect(lack.katalogTitel).toBe('Türen lackieren — 2× Anstrich')
    expect(katalogPreis(lack.katalogTitel)!.preis).toBe(90)
  })

  it('der Ankertitel kommt im Angebot tatsächlich vor', () => {
    // Genau das war sein erster Grund: Sonst fragt das Onboarding nach einem
    // Preis, den nachher niemand benutzt.
    const T = 'Zwei Türen lackieren, beidseitig.'
    const beschreibungen = lauf(T, [raum('Flur', { arbeiten: ['türen lackieren'] })]).map(p => p.beschreibung)
    expect(beschreibungen.some(b => b.startsWith('Türen lackieren — 2× Anstrich'))).toBe(true)
  })

  it('die Quoten des Prüfmeisters stimmen mit dem Katalog überein', () => {
    // Sie sind der Beleg, dass die Katalogwerte zueinander passen — nicht die
    // Quelle der Preise. Deshalb stehen sie nur hier, nicht im Code.
    const anker = 90
    for (const [titel, quote] of [
      ['Türzarge lackieren', 0.50],
      ['Fenster lackieren (2× Anstrich)', 0.61],
      ['Stahlzarge lackieren', 0.61],
      ['Heizkörper streichen / lackieren', 0.44],
      ['Türen grundieren', 0.28],
      ['Türen abschleifen', 0.22],
      ['Treppengeländer lackieren', 0.20],
    ] as [string, number][]) {
      const ist = katalogPreis(titel)!.preis / anker
      expect(Math.abs(ist - quote), `${titel}: ${Math.round(ist * 100)} % statt ${Math.round(quote * 100)} %`)
        .toBeLessThanOrEqual(0.02)
    }
  })

  it('der Heizkörper hängt am Türpreis, nicht am Quadratmeterpreis der Wand', () => {
    // Manfred: „Ein Heizkörper hat mit dem Quadratmeterpreis nichts zu tun."
    // Er stand bei mir unter „Innen streichen" und damit am Wandanker.
    expect(leiteAb(['maler_innen'], {}, 52).some(p => /Heizkörper streichen/.test(p.titel))).toBe(false)

    const normal = leiteAb(['lackieren'], {}, 52)
    const teuer = leiteAb(['lackieren'], { lackieren: 135 }, 52)
    const a = normal.find(p => /Heizkörper/.test(p.titel))!
    const b = teuer.find(p => /Heizkörper/.test(p.titel))!
    expect(b.rohpreis / a.rohpreis).toBeCloseTo(135 / 90, 6)
  })
})

describe('Was am Katalog hing, zeigt weiter auf etwas', () => {
  it('die Standardzeile der Tür-Familie existiert noch (CoS-E-051)', () => {
    // Sie hieß „Tür streichen / lackieren (einseitig)" und ist entfallen.
    // Ohne Nachziehen hätte „Tür lackieren" keinen Standard mehr gefunden.
    const familie = standardFamilie('Tür lackieren')
    expect(familie).not.toBeNull()
    expect(DEFAULT_PRICES.some(p => p.title === familie!.standard), familie!.standard).toBe(true)
  })

  it('die Tür-Vorlagen im Onboarding zeigen auf existierende Katalogzeilen', () => {
    const titel = new Set(DEFAULT_PRICES.map(p => p.title))
    const tueren = (GEWERK_PREISE['malerarbeiten'] ?? []).filter(v => /t(ü|ue)r/i.test(v.title))
    expect(tueren.length).toBeGreaterThan(0)
    expect(tueren.filter(v => !titel.has(v.title)).map(v => v.title)).toEqual([])
  })
})
