// Konto-Löschung und Aufnahmen-Frist (Head of Product Engineering, 2026-09-02)
//
// Diese Tests sichern die Stelle ab, an der ein Fehler am teuersten ist: Was
// gelöscht werden muss, wird gelöscht — und was noch in der Frist steht,
// bleibt. Beides ist gleich wichtig. Ein zu großzügiger Job löscht Konten von
// Nutzern, die sich noch wiederherstellen wollten.
import { describe, it, expect, vi } from 'vitest'
import {
  LOESCH_FRIST_TAGE,
  loeschungFaelligAm,
  tageBisLoeschung,
  istLoeschreif,
  loeschreifVor,
  speicherPlan,
  loescheSpeicher,
} from '../konto-loeschung'
import {
  AUFNAHME_FRIST_TAGE,
  aufnahmenFristVor,
  tageBisAudioLoeschung,
} from '../aufnahmen-aufraeumen'
import { istUeberfaellig } from '../system-laeufe'

const TAG = 24 * 60 * 60 * 1000
const JETZT = new Date('2026-09-02T12:00:00.000Z')
const vorTagen = (n: number) => new Date(JETZT.getTime() - n * TAG).toISOString()

describe('30-Tage-Frist (AGB § 6.5)', () => {
  it('rechnet die Frist auf die Minute, nicht auf den Kalendertag', () => {
    expect(loeschungFaelligAm('2026-08-03T12:00:00.000Z').toISOString()).toBe('2026-09-02T12:00:00.000Z')
  })

  it('ist am Tag 29 noch nicht löschreif', () => {
    expect(istLoeschreif(vorTagen(29), JETZT)).toBe(false)
    expect(tageBisLoeschung(vorTagen(29), JETZT)).toBe(1)
  })

  it('ist exakt auf die Minute genau löschreif — keine Sekunde früher', () => {
    expect(istLoeschreif(vorTagen(30), JETZT)).toBe(true)
    const eineMinuteZuFrueh = new Date(JETZT.getTime() - 60_000)
    expect(istLoeschreif(vorTagen(30), eineMinuteZuFrueh)).toBe(false)
  })

  it('ein nicht gelöschtes Konto ist nie löschreif', () => {
    expect(istLoeschreif(null, JETZT)).toBe(false)
    expect(istLoeschreif(undefined, JETZT)).toBe(false)
  })

  it('ein kaputtes Datum löscht nichts (lieber stehen lassen als irrtümlich löschen)', () => {
    expect(istLoeschreif('kein datum', JETZT)).toBe(false)
  })

  it('Restlaufzeit wird nie negativ', () => {
    expect(tageBisLoeschung(vorTagen(90), JETZT)).toBe(0)
  })

  it('die Abfragegrenze passt zur Frist', () => {
    expect(loeschreifVor(JETZT)).toBe(new Date(JETZT.getTime() - LOESCH_FRIST_TAGE * TAG).toISOString())
  })
})

describe('Speicherplan — welche Dateien gehören zum Konto', () => {
  const plan = speicherPlan({ userId: 'u1', companyId: 'c1', quoteIds: ['q1', 'q2'] })
  const buckets = plan.map(p => p.bucket)

  it('deckt alle Buckets mit Personenbezug ab', () => {
    expect(buckets).toEqual([
      'entwurf-audio', 'entwurf-fotos', 'company-logos', 'public-pdfs', 'quote-photos', 'quote-signatures',
    ])
  })

  it('lässt tts-cache bewusst aus — Marketing-Demo, kein Konto-Bezug', () => {
    expect(buckets).not.toContain('tts-cache')
  })

  it('company-logos hat beide Pfadmuster (Betriebslogo und Briefpapier-Logo)', () => {
    const logos = plan.find(p => p.bucket === 'company-logos')!
    expect(logos.praefixe).toEqual(['u1', 'c1'])
  })

  it('Unterschriften liegen flach und werden über die Angebots-IDs erwischt', () => {
    const sig = plan.find(p => p.bucket === 'quote-signatures')!
    expect(sig.dateien).toEqual(['signatures/q1.png', 'signatures/q2.png'])
  })

  it('ohne Betrieb bleiben die betriebsbezogenen Ordner leer statt undefined zu enthalten', () => {
    const ohne = speicherPlan({ userId: 'u1', companyId: null, quoteIds: [] })
    for (const auftrag of ohne) {
      expect(auftrag.praefixe.every(p => typeof p === 'string' && p.length > 0)).toBe(true)
    }
    expect(ohne.find(p => p.bucket === 'public-pdfs')!.praefixe).toEqual([])
  })
})

describe('loescheSpeicher', () => {
  function fakeStorage(dateien: Record<string, string[]>) {
    const entfernt: string[] = []
    const service = {
      storage: {
        from: (bucket: string) => ({
          list: vi.fn(async (ordner: string, opts: { offset: number }) => {
            if (opts.offset > 0) return { data: [], error: null }
            const kinder = (dateien[bucket] ?? [])
              .filter(p => p.startsWith(ordner ? `${ordner}/` : ''))
              .map(p => p.slice(ordner ? ordner.length + 1 : 0))
            const direkt = new Map<string, boolean>()
            for (const k of kinder) {
              const teil = k.split('/')[0]
              direkt.set(teil, direkt.get(teil) ?? !k.includes('/'))
            }
            return {
              data: [...direkt].map(([name, istDatei]) => ({ name, id: istDatei ? 'x' : null })),
              error: null,
            }
          }),
          remove: vi.fn(async (pfade: string[]) => { entfernt.push(...pfade); return { error: null } }),
        }),
      },
    }
    return { service, entfernt }
  }

  it('findet Dateien auch in verschachtelten Ordnern', async () => {
    const { service, entfernt } = fakeStorage({
      'entwurf-audio': ['u1/angebot1/aufnahme1/audio.webm', 'u1/angebot2/aufnahme9/audio.m4a'],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ergebnis = await loescheSpeicher(service as any, [
      { bucket: 'entwurf-audio', praefixe: ['u1'], dateien: [] },
    ])
    expect(ergebnis.fehler).toEqual([])
    expect(entfernt.sort()).toEqual([
      'u1/angebot1/aufnahme1/audio.webm',
      'u1/angebot2/aufnahme9/audio.m4a',
    ])
  })

  it('fasst fremde Ordner nicht an', async () => {
    const { service, entfernt } = fakeStorage({
      'entwurf-audio': ['u1/a/1/audio.webm', 'u2/a/1/audio.webm'],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await loescheSpeicher(service as any, [{ bucket: 'entwurf-audio', praefixe: ['u1'], dateien: [] }])
    expect(entfernt).toEqual(['u1/a/1/audio.webm'])
  })
})

describe('Sprachaufnahmen-Frist', () => {
  it('gilt dieselbe Zahl wie bei der Konto-Löschung — eine Frist, die man sich merkt', () => {
    expect(AUFNAHME_FRIST_TAGE).toBe(LOESCH_FRIST_TAGE)
  })

  it('eine frische Aufnahme wird nicht angefasst', () => {
    expect(tageBisAudioLoeschung(vorTagen(1), JETZT)).toBe(29)
    expect(vorTagen(1) > aufnahmenFristVor(JETZT)).toBe(true)
  })

  it('eine 31 Tage alte Aufnahme fällt unter die Grenze', () => {
    expect(vorTagen(31) < aufnahmenFristVor(JETZT)).toBe(true)
    expect(tageBisAudioLoeschung(vorTagen(31), JETZT)).toBe(0)
  })
})

describe('Überfälligkeit von Hintergrundjobs', () => {
  it('ein Job, der nie gelaufen ist, gilt sofort als überfällig', () => {
    // Genau der Fall, der beim Erinnerungs-Job monatelang unbemerkt blieb.
    expect(istUeberfaellig(null, JETZT)).toBe(true)
  })

  it('ein Lauf von gestern ist in Ordnung', () => {
    expect(istUeberfaellig(new Date(JETZT.getTime() - 20 * 60 * 60 * 1000), JETZT)).toBe(false)
  })

  it('zwei Tage Puffer — ein einzelner Ausfall (Deploy) löst keinen Alarm aus', () => {
    expect(istUeberfaellig(new Date(JETZT.getTime() - 47 * 60 * 60 * 1000), JETZT)).toBe(false)
    expect(istUeberfaellig(new Date(JETZT.getTime() - 49 * 60 * 60 * 1000), JETZT)).toBe(true)
  })
})
