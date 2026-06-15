export type KIPhase = 'transkription' | 'extraktion' | 'mengenberechnung' | 'matching'

export class KIVerarbeitungsFehler extends Error {
  constructor(
    message: string,
    public readonly phase: KIPhase,
    public readonly retry: boolean,
    public readonly nutzer_nachricht: string,
  ) {
    super(message)
    this.name = 'KIVerarbeitungsFehler'
  }
}

export async function mitRetry<T>(
  fn: () => Promise<T>,
  optionen: { max_versuche: number; phase: KIPhase; warte_ms?: number }
): Promise<T> {
  let letzterFehler: Error = new Error('Unbekannter Fehler')

  for (let i = 0; i < optionen.max_versuche; i++) {
    try {
      return await fn()
    } catch (err) {
      letzterFehler = err instanceof Error ? err : new Error(String(err))
      const status = (err as { status?: number })?.status
      const code = (err as { code?: string })?.code

      if (status === 429) {
        await sleep((i + 1) * 2000)
        continue
      }
      if (code === 'ETIMEDOUT') continue
      if (err instanceof SyntaxError && i < optionen.max_versuche - 1) continue
      break
    }
  }

  throw new KIVerarbeitungsFehler(
    letzterFehler.message,
    optionen.phase,
    false,
    getFehlerText(optionen.phase),
  )
}

function getFehlerText(phase: KIPhase): string {
  switch (phase) {
    case 'transkription':
      return 'Aufnahme konnte nicht verarbeitet werden. Nochmal versuchen?'
    case 'extraktion':
      return 'Positionen konnten nicht erkannt werden. Nochmal versuchen oder manuell eingeben?'
    case 'matching':
      return 'Preise konnten nicht zugeordnet werden. Positionen manuell prüfen.'
    default:
      return 'Fehler bei der Verarbeitung. Nochmal versuchen?'
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
