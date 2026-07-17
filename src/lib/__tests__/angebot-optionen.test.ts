import { describe, it, expect } from 'vitest'
import { effektiveOptionen, skontoText } from '../angebot-optionen'

const BETRIEB = {
  angebot_struktur: 'arbeitsablauf' as const,
  payment_days: 30,
  angebot_gueltig_tage: 60,
  widerruf_aktiv: true,
}

describe('effektiveOptionen — Angebot schlägt Betrieb schlägt Standard', () => {
  it('ohne Overrides → Betriebs-Einstellungen', () => {
    const o = effektiveOptionen({}, BETRIEB, false)
    expect(o.struktur).toBe('arbeitsablauf')
    expect(o.zahlungszielTage).toBe(30)
    expect(o.gueltigTage).toBe(60)
    expect(o.dokumentTyp).toBe('angebot')
  })

  it('Override am Angebot gewinnt', () => {
    const o = effektiveOptionen(
      { angebot_struktur: 'raeume', zahlungsziel_tage: 7, dokument_typ: 'kostenvoranschlag' },
      BETRIEB, false,
    )
    expect(o.struktur).toBe('raeume')
    expect(o.zahlungszielTage).toBe(7)
    expect(o.dokumentTyp).toBe('kostenvoranschlag')
  })

  it('leerer Betrieb → Standards', () => {
    const o = effektiveOptionen({}, {}, false)
    expect(o.struktur).toBe('raeume')
    expect(o.zahlungszielTage).toBe(14)
    expect(o.gueltigTage).toBe(30)
  })

  it('Kopf-/Fußtext: leer/whitespace → null', () => {
    const o = effektiveOptionen({ kopftext: '   ', fusstext: 'Danke!' }, BETRIEB, false)
    expect(o.kopftext).toBe(null)
    expect(o.fusstext).toBe('Danke!')
  })
})

describe('effektiveOptionen — Preisdarstellung nach Kundentyp', () => {
  it('Privatkunde → brutto (Endpreise, PAngV)', () => {
    expect(effektiveOptionen({}, BETRIEB, false).preisDarstellung).toBe('brutto')
  })
  it('Geschäftskunde → netto', () => {
    expect(effektiveOptionen({}, BETRIEB, true).preisDarstellung).toBe('netto')
  })
  it('Override schlägt Kundentyp', () => {
    expect(effektiveOptionen({ preis_darstellung: 'netto' }, BETRIEB, false).preisDarstellung).toBe('netto')
  })
})

describe('effektiveOptionen — Widerrufsbelehrung', () => {
  it('Privatkunde + Betrieb aktiv → beilegen', () => {
    expect(effektiveOptionen({}, BETRIEB, false).widerrufBeilegen).toBe(true)
  })
  it('Geschäftskunde → nicht beilegen', () => {
    expect(effektiveOptionen({}, BETRIEB, true).widerrufBeilegen).toBe(false)
  })
  it('explizites Nein am Angebot gewinnt', () => {
    expect(effektiveOptionen({ widerruf_beilegen: false }, BETRIEB, false).widerrufBeilegen).toBe(false)
  })
  it('explizites Ja am Angebot gewinnt (auch bei Geschäftskunde)', () => {
    expect(effektiveOptionen({ widerruf_beilegen: true }, BETRIEB, true).widerrufBeilegen).toBe(true)
  })
})

describe('skontoText', () => {
  it('formatiert korrekt', () => {
    const o = effektiveOptionen({ skonto_prozent: 2, skonto_tage: 10 }, BETRIEB, false)
    expect(skontoText(o)).toBe('2 % Skonto bei Zahlung innerhalb von 10 Tagen.')
  })
  it('unvollständig → null', () => {
    expect(skontoText(effektiveOptionen({ skonto_prozent: 2 }, BETRIEB, false))).toBe(null)
    expect(skontoText(effektiveOptionen({}, BETRIEB, false))).toBe(null)
  })
})
