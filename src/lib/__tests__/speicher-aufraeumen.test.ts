// Aufräumen des Objektspeichers (Head of Product Engineering, 2026-09-02)
//
// Der gefährlichste Fehler in diesem Job ist nicht, zu wenig zu löschen,
// sondern zu viel: Eine kaputte Verknüpfung würde jede Datei als verwaist
// melden. Deshalb prüfen diese Tests beide Richtungen.
import { describe, it, expect, vi } from 'vitest'
import {
  AUFRAEUMBARE_BUCKETS,
  MAX_LOESCHUNGEN_JE_LAUF,
  istVerdaechtig,
  raeumeBucketAuf,
} from '../speicher-aufraeumen'

function fakeService(gesamt: number, verwaist: string[]) {
  const entfernt: string[] = []
  const service = {
    rpc: vi.fn(async (name: string) => {
      if (name === 'speicher_dateien_anzahl') return { data: gesamt, error: null }
      if (name === 'verwaiste_speicherdateien') return { data: verwaist.map(n => ({ name: n })), error: null }
      return { data: null, error: { message: 'unbekannt' } }
    }),
    storage: {
      from: () => ({
        remove: vi.fn(async (pfade: string[]) => { entfernt.push(...pfade); return { error: null } }),
      }),
    },
  }
  return { service, entfernt }
}

describe('Sicherung gegen eine kaputte Verknüpfung', () => {
  it('greift, wenn ein gut gefüllter Bucket komplett als verwaist gilt', () => {
    expect(istVerdaechtig(263, 263)).toBe(true)
  })

  it('greift nicht bei einem winzigen Bucket — dort ist das plausibel', () => {
    // Echter Fall: ein Baustellenfoto, dessen Angebot gelöscht wurde.
    expect(istVerdaechtig(1, 1)).toBe(false)
  })

  it('greift nicht, solange etwas übrig bleibt', () => {
    expect(istVerdaechtig(182, 263)).toBe(false)
  })

  it('löscht nichts, wenn die Sicherung greift', async () => {
    const dateien = Array.from({ length: 30 }, (_, i) => `u/${i}.webm`)
    const { service, entfernt } = fakeService(30, dateien)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ergebnis = await raeumeBucketAuf(service as any, 'entwurf-audio')
    expect(ergebnis.uebersprungen).toBe(true)
    expect(ergebnis.geloescht).toBe(0)
    expect(entfernt).toEqual([])
    expect(ergebnis.fehler[0]).toContain('kaputten Verknüpfung')
  })
})

describe('Normaler Lauf', () => {
  it('löscht genau die gemeldeten Dateien', async () => {
    const { service, entfernt } = fakeService(263, ['u/a.webm', 'u/b.webm'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ergebnis = await raeumeBucketAuf(service as any, 'entwurf-audio')
    expect(ergebnis.geloescht).toBe(2)
    expect(entfernt).toEqual(['u/a.webm', 'u/b.webm'])
    expect(ergebnis.fehler).toEqual([])
  })

  it('deckelt einen Lauf, statt tausende Dateien auf einmal anzufassen', async () => {
    const viele = Array.from({ length: MAX_LOESCHUNGEN_JE_LAUF + 250 }, (_, i) => `u/${i}.webm`)
    const { service, entfernt } = fakeService(viele.length + 1000, viele)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ergebnis = await raeumeBucketAuf(service as any, 'entwurf-audio')
    expect(ergebnis.geloescht).toBe(MAX_LOESCHUNGEN_JE_LAUF)
    expect(entfernt.length).toBe(MAX_LOESCHUNGEN_JE_LAUF)
    expect(ergebnis.verwaist).toBe(viele.length)
  })

  it('ein leerer Bucket ist kein Fehler', async () => {
    const { service, entfernt } = fakeService(0, [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ergebnis = await raeumeBucketAuf(service as any, 'public-pdfs')
    expect(ergebnis.geloescht).toBe(0)
    expect(ergebnis.uebersprungen).toBe(false)
    expect(entfernt).toEqual([])
  })
})

describe('Abgedeckte Buckets', () => {
  it('deckt genau die Buckets ab, für die die Datenbank die Frage beantworten kann', () => {
    expect([...AUFRAEUMBARE_BUCKETS]).toEqual([
      'entwurf-audio', 'entwurf-fotos', 'quote-photos', 'public-pdfs',
    ])
  })

  it('company-logos und quote-signatures bleiben bewusst außen vor', () => {
    // Logos haengen an einem Betrieb, nicht an einer loeschbaren Zeile;
    // Unterschriften liegen flach unter der Angebots-ID und werden von der
    // Konto-Loeschung erfasst.
    expect(AUFRAEUMBARE_BUCKETS).not.toContain('company-logos')
    expect(AUFRAEUMBARE_BUCKETS).not.toContain('quote-signatures')
  })
})
