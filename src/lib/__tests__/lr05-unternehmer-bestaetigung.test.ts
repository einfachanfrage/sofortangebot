import { describe, it, expect } from 'vitest'
import { pruefeRegistrierungsdaten } from '../registrierung'

// LR-05 / G4 — Unternehmer-Bestätigung, serverseitig.
//
// Der Befund vom 04.09.2026: G4 galt als umgesetzt, weil das
// Registrierungsformular eine Pflicht-Checkbox hat. Die API-Route hat das Feld
// `unternehmerBestaetigt` aber gar nicht gelesen — die Prüfung war rein
// optisch, und es gab keinen Beleg, dass je bestätigt wurde. Diese Tests
// halten beide Hälften fest.
const gueltig = {
  email: 'chef@malerbetrieb.de',
  password: 'einsicheres1',
  agbAkzeptiert: true,
  unternehmerBestaetigt: true,
}

describe('LR-05 — ohne Unternehmer-Bestätigung keine Registrierung', () => {
  it('fehlendes Feld wird abgelehnt', () => {
    const r = pruefeRegistrierungsdaten({ ...gueltig, unternehmerBestaetigt: undefined })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.status).toBe(400)
      expect(r.fehler).toContain('Unternehmer')
    }
  })

  it('„false" wird abgelehnt', () => {
    expect(pruefeRegistrierungsdaten({ ...gueltig, unternehmerBestaetigt: false }).ok).toBe(false)
  })

  it('ein wahrheitsähnlicher Wert reicht nicht — es muss echtes true sein', () => {
    for (const wert of ['true', 1, 'ja', {}]) {
      expect(pruefeRegistrierungsdaten({ ...gueltig, unternehmerBestaetigt: wert }).ok, String(wert)).toBe(false)
    }
  })
})

describe('LR-05 — die Bestätigung wird als Beleg gespeichert', () => {
  it('der Zeitpunkt landet in den Nutzerdaten, nicht nur im Formular', () => {
    const jetzt = new Date('2026-09-04T10:00:00.000Z')
    const r = pruefeRegistrierungsdaten(gueltig, jetzt)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.metadata.unternehmer_bestaetigt_am).toBe('2026-09-04T10:00:00.000Z')
      // Die AGB-Zustimmung wird weiterhin genauso belegt wie bisher.
      expect(r.metadata.agb_akzeptiert_am).toBe('2026-09-04T10:00:00.000Z')
      expect(r.metadata.agb_version).toBe('2026-06')
    }
  })

  it('E-Mail wird normalisiert, das Passwort unverändert durchgereicht', () => {
    const r = pruefeRegistrierungsdaten({ ...gueltig, email: '  Chef@Malerbetrieb.DE ' })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.email).toBe('chef@malerbetrieb.de')
      expect(r.password).toBe('einsicheres1')
    }
  })
})

describe('LR-05 — die bisherigen Prüfungen bleiben unverändert', () => {
  it('ungültige E-Mail, kurzes Passwort, fehlende AGB', () => {
    expect(pruefeRegistrierungsdaten({ ...gueltig, email: 'keine-mail' }).ok).toBe(false)
    expect(pruefeRegistrierungsdaten({ ...gueltig, password: 'kurz' }).ok).toBe(false)
    expect(pruefeRegistrierungsdaten({ ...gueltig, agbAkzeptiert: false }).ok).toBe(false)
  })

  it('die AGB-Meldung kommt vor der Unternehmer-Meldung — eine Sache nach der anderen', () => {
    const r = pruefeRegistrierungsdaten({ ...gueltig, agbAkzeptiert: false, unternehmerBestaetigt: false })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.fehler).toContain('AGB')
  })
})
