const STILLE_SCHWELLE_LAUTSTAERKE = 10
const STILLE_SCHWELLE_MS = 2000

export interface StilleErkennung {
  stop: () => void
}

export function starteStilleErkennung(
  stream: MediaStream,
  onStille: () => void
): StilleErkennung {
  let audioCtx: AudioContext | null = null
  let aktiv = true
  let stilleStart: number | null = null
  let frameId: number | null = null

  try {
    audioCtx = new AudioContext()
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256
    const source = audioCtx.createMediaStreamSource(stream)
    source.connect(analyser)
    const buffer = new Uint8Array(analyser.frequencyBinCount)

    const check = () => {
      if (!aktiv) return
      analyser.getByteFrequencyData(buffer)
      const lautstaerke = buffer.reduce((a, b) => a + b, 0) / buffer.length

      if (lautstaerke < STILLE_SCHWELLE_LAUTSTAERKE) {
        if (!stilleStart) {
          stilleStart = Date.now()
        } else if (Date.now() - stilleStart > STILLE_SCHWELLE_MS) {
          aktiv = false
          onStille()
          return
        }
      } else {
        stilleStart = null
      }

      frameId = requestAnimationFrame(check)
    }

    frameId = requestAnimationFrame(check)
  } catch {
    // AudioContext nicht verfügbar (SSR, ältere Browser) → ignorieren
  }

  return {
    stop: () => {
      aktiv = false
      if (frameId !== null) cancelAnimationFrame(frameId)
      audioCtx?.close().catch(() => {})
    },
  }
}
