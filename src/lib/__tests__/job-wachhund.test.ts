// Wachhund für die Hintergrundjobs (Head of Product Engineering, 2026-09-02)
//
// Diese Tests gibt es, weil die erste Fassung der Warnung an der falschen
// Stelle hing: in einer Admin-Route, die niemand regelmäßig aufruft. Eine
// Warnung ist nur so viel wert wie der Weg, auf dem sie ankommt.
import { describe, it, expect, vi } from 'vitest'
import { jobStatus, meldeUeberfaelligeJobs, UEBERWACHTE_JOBS, JOB_BESCHREIBUNG } from '../job-wachhund'

const JETZT = new Date('2026-09-02T12:00:00.000Z')
const STUNDEN = 60 * 60 * 1000

/** Fake-Client, der je Job den letzten erfolgreichen Lauf zurückgibt. */
function fakeService(laeufe: Record<string, string | null>) {
  const gefragt: string[] = []
  return {
    from: () => {
      let job = ''
      const kette = {
        select: () => kette,
        eq: (spalte: string, wert: unknown) => {
          if (spalte === 'job') { job = String(wert); gefragt.push(job) }
          return kette
        },
        order: () => kette,
        limit: () => kette,
        maybeSingle: async () => ({
          data: laeufe[job] ? { beendet_am: laeufe[job] } : null,
          error: null,
        }),
      }
      return kette
    },
    _gefragt: gefragt,
  }
}

describe('jobStatus', () => {
  it('fragt genau die überwachten Jobs ab', async () => {
    const service = fakeService({})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = await jobStatus(service as any, JETZT)
    expect(status.map(s => s.job)).toEqual([...UEBERWACHTE_JOBS])
  })

  it('ein Job ohne jeden Lauf ist überfällig', async () => {
    const service = fakeService({})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = await jobStatus(service as any, JETZT)
    expect(status.every(s => s.ueberfaellig)).toBe(true)
    expect(status.every(s => s.letzterLauf === null)).toBe(true)
  })

  it('ein Lauf von heute Nacht ist in Ordnung', async () => {
    const service = fakeService({
      aufraeumen: new Date(JETZT.getTime() - 9 * STUNDEN).toISOString(),
      reminder: new Date(JETZT.getTime() - 4 * STUNDEN).toISOString(),
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = await jobStatus(service as any, JETZT)
    expect(status.some(s => s.ueberfaellig)).toBe(false)
  })
})

describe('meldeUeberfaelligeJobs', () => {
  it('meldet den eigenen Job nicht — ein Job, der sich selbst überwacht, überwacht nichts', async () => {
    // Nur `aufraeumen` ist überfällig, und `aufraeumen` fragt selbst an.
    // Es darf keine Mail rausgehen; würde eine versucht, bräuchte der Test
    // einen Resend-Schlüssel und schlüge fehl.
    const service = fakeService({
      reminder: new Date(JETZT.getTime() - 3 * STUNDEN).toISOString(),
      aufraeumen: null,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = await meldeUeberfaelligeJobs(service as any, {
      ausser: 'aufraeumen', empfaenger: 'test@example.invalid', jetzt: JETZT,
    })
    expect(status.find(s => s.job === 'aufraeumen')?.ueberfaellig).toBe(true)
    expect(status.find(s => s.job === 'reminder')?.ueberfaellig).toBe(false)
  })

  it('gibt den Status aller Jobs zurück, auch wenn nichts zu melden ist', async () => {
    const frisch = new Date(JETZT.getTime() - 2 * STUNDEN).toISOString()
    const service = fakeService({ aufraeumen: frisch, reminder: frisch })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = await meldeUeberfaelligeJobs(service as any, {
      ausser: 'aufraeumen', empfaenger: 'test@example.invalid', jetzt: JETZT,
    })
    expect(status).toHaveLength(UEBERWACHTE_JOBS.length)
  })
})

describe('Beschreibungen', () => {
  it('jeder überwachte Job erklärt in der Warnmail, was ausfällt', () => {
    for (const job of UEBERWACHTE_JOBS) {
      expect(JOB_BESCHREIBUNG[job]).toBeTruthy()
    }
  })
})
