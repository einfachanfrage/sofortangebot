import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import { ersetzeZahlenWorte } from '../../zahlen-parser'

describe('boden – basis', () => {
  // CoS-018 (2026-08-24): Dieser Test erwartete bis heute genau das
  // Verhalten, das PM-013 (19.08.) und PM-020 (21.08.) als Phantom-Fund
  // BESEITIGT haben — "neuer Boden ⇒ automatisch neue Sockelleisten", zweimal
  // unabhängig live aufgeschlagen. Kein verlorener Fix, sondern ein Test, der
  // der bewussten Änderung hinterherhinkte. Erwartung deshalb umgedreht.
  it('Parkett ohne Sockel-Erwähnung → kein erfundener Ausgleich, keine erfundenen Sockelleisten', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, 35 qm')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('untergrundvorbereitung'))).toBe(false)
    expect(alle).not.toContain('Sockelleisten montieren')
  })

  // Gegenprobe: die Leistung darf bei echtem Textsignal natürlich weiterhin
  // kommen — sonst wäre der Phantom-Fix zu weit gegangen und hätte die
  // Position ganz abgeschafft.
  it('Parkett MIT genannten Sockelleisten → Position mit geschätztem Umfang', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, 35 qm, und neue Sockelleisten montieren')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle).toContain('Sockelleisten montieren')
    const sockel = positionen.find(p => p.beschreibung === 'Sockelleisten montieren')
    expect(sockel?.einheit).toBe('lfdm')
    expect(sockel?.menge).toBeGreaterThan(0)
  })

  it('Laminat → wird als Laminat-Position erkannt', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Laminat verlegen in Wohnzimmer')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('laminat'))).toBe(true)
  })

  it('Vinyl/Designboden-Trigger', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Vinyl verlegen, Designboden klick')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('vinyl') || b.toLowerCase().includes('design'))).toBe(true)
  })

  it('"ohne Sockelleisten" → kein Sockel in fehlende', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen ohne Sockelleisten')
    expect(fehlende).not.toContain('Sockelleisten montieren')
  })

  it('Fläche aus Text wird extrahiert (Laminat inkl. 10% Verschnitt)', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Laminat verlegen, 48 qm.')
    const laminatPos = positionen.find(p => p.beschreibung.toLowerCase().includes('laminat'))
    // Laminat bekommt Standard-10%-Verschnitt: 48 × 1.10 = 52.8
    expect(laminatPos?.menge).toBeCloseTo(52.8, 1)
  })

  it('kein Trigger → keine Boden-Positionen', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Wände streichen')
    expect(fehlende).toHaveLength(0)
    expect(positionen).toHaveLength(0)
  })
})

describe('boden – vorarbeiten', () => {
  it('"Altbelag entfernen" → Entfernen-Position', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Alten Laminatboden raus, neues Parkett verlegen')
    expect(fehlende).toContain('Altbelag entfernen')
  })

  it('"alter Belag" → Entfernen-Position', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Alter Belag entfernen, dann Vinyl verlegen')
    expect(fehlende).toContain('Altbelag entfernen')
  })

  it('Übergangsprofil bei "Raumübergang"', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, am Übergang zum Flur ein Anschlussprofil')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].join(' ')
    expect(alle.toLowerCase()).toContain('übergangsprofil')
  })

  // PM-009: "Übergangsschiene" fehlte komplett — die Erkennung kannte nur
  // "-profil"/"Alu", nicht das mindestens genauso gebräuchliche Wort
  // "Schiene". Auf der Aufnahme-Karte wurde die Leistung erkannt, im
  // fertigen Angebot kam sie nie an.
  it('PM-009: Übergangsschiene wird erkannt (nicht nur "-profil")', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Vinylboden verlegen. Am Übergang zum Wohnzimmer brauchen wir noch eine Übergangsschiene.')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].join(' ').toLowerCase()
    expect(alle).toContain('übergangsschiene')
  })

  // PM-009, exaktes Original-Transkript über die echte Pipeline (erst
  // ersetzeZahlenWorte, wie im echten Tool). Prüft zusätzlich, dass die
  // Übergangsschiene NICHT versehentlich die Raummaß-Zahl ("vier" aus
  // "vier mal eins achtzig") als eigene Stückzahl erbt — beim Testen dieses
  // Fixes ist genau das zuerst passiert, als noch mit Rohtext ohne
  // Zahlen-Vorverarbeitung getestet wurde.
  it('PM-009: Original-Transkript → Übergangsschiene ohne erfundene Stückzahl aus der Raummaß-Zahl', () => {
    const roh = 'Flur, vier mal eins achtzig. Alter Teppich muss komplett raus und entsorgt werden, Untergrund ist uneben, den gleich mit ausgleichen. Dann Vinylboden drauf, ganz normal gerade verlegt. Neue Sockelleisten drumrum. Am Übergang zum Wohnzimmer brauchen wir noch ne Übergangsschiene.'
    const t = ersetzeZahlenWorte(roh)
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], t)
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].join(' ').toLowerCase()
    expect(alle).toContain('übergangsschiene')
    const schieneMitFalscherMenge = positionen.find(p => p.beschreibung.toLowerCase().includes('übergangsschiene') && p.menge === 4)
    expect(schieneMitFalscherMenge).toBeUndefined()
  })
})

describe('boden – sonder', () => {
  it('Diagonalverlegung → Verschnitt 15 % in fehlende', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett diagonal verlegen, 30 qm')
    expect(fehlende).toContain('Verschnitt 15 % (Diagonalverlegung)')
  })

  it('FBH-Hinweis wenn Fußbodenheizung erwähnt', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Laminat verlegen, Fußbodenheizung vorhanden')
    expect(fehlende.some(f => f.includes('FBH'))).toBe(true)
  })

  it('Parkett schleifen → genau 3 Positionen (schleifen + 2 Versiegelungen)', () => {
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett schleifen, 40 qm')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle).toContain('Parkett schleifen')
    expect(alle).toContain('Versiegelung 1. Gang')
    expect(alle).toContain('Versiegelung 2. Gang')
  })

  it('Parkett schleifen mit m² → Menge in positionen', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett schleifen, 40 qm.')
    const schleifPos = positionen.find(p => p.beschreibung.includes('schleifen'))
    expect(schleifPos?.menge).toBe(40)
    const vers1 = positionen.find(p => p.beschreibung.includes('1. Gang'))
    expect(vers1?.menge).toBe(40)
    const vers2 = positionen.find(p => p.beschreibung.includes('2. Gang'))
    expect(vers2?.menge).toBe(40)
  })

  it('Treppe → Trittstufen + Setzstufen separat', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, Treppe mit 14 Stufen auch belegen')
    // Mit Anzahl → positionen; ohne Anzahl → fehlende
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].join(' ')
    expect(alle.toLowerCase()).toContain('trittstufen')
    expect(alle.toLowerCase()).toContain('setzstufen')
  })

  it('Treppe mit Anzahl → Menge korrekt', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, 14 Treppenstufen belegen')
    const trittPos = positionen.find(p => p.beschreibung.toLowerCase().includes('trittstufen'))
    expect(trittPos?.menge).toBe(14)
    expect(trittPos?.einheit).toBe('Stück')
  })
})
