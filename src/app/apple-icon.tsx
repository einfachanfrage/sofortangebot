import { ImageResponse } from 'next/og'
import fs from 'node:fs'
import path from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// DC-049 Schritt 5 (2026-09-10): echte Bildmarke (Maßband-Icon, von Sandy
// geliefert) statt der "sa"-Initialen-Platzhalter-Lösung. Quelle liegt
// unter ./_assets/brand-mark.png (452×257, Off-White-Icon auf
// transparentem Grund) und wird zur Build-/Request-Zeit als Base64
// eingebettet — next/og's ImageResponse kann keine relativen Datei-Pfade
// direkt referenzieren. Bei 180×180 ist genug Auflösung für die feinen
// Maßband-Details (Skalen-Striche, Linsen-Kreis) vorhanden — anders als
// beim 32×32-Favicon (icon.tsx), das bewusst NOCH bei "sa" bleibt, siehe
// design-check.md DC-049 Schritt 5.
//
// Nachtrag (2026-09-11): `fetch(new URL('./_assets/...', import.meta.url))`
// funktionierte lokal, hat aber seit dem allerersten Push mit dieser Datei
// JEDEN Produktions-Build zum Absturz gebracht — Node/undicis fetch() kennt
// das file://-Protokoll beim statischen Prerendering nicht ("fetch failed:
// not implemented... yet..."). Vier Deployments in Folge sind daran
// gescheitert, alles seit der Bildmarke (inkl. PDF-Marken-Schriften,
// Rechenweg, Vorschau-Angleichung) lief nie live. Gleiches, bereits
// bewährtes Muster wie beim Font-Laden in lib/pdf.tsx: `fs.readFileSync`
// über einen process.cwd()-relativen Pfad statt fetch.
export default async function AppleIcon() {
  const imageData = fs.readFileSync(path.join(process.cwd(), 'src/app/_assets/brand-mark.png'))
  const base64 = imageData.toString('base64')

  // Icon-Quelle ist 452×257 (Seitenverhältnis ≈ 1,76:1) — Breite auf
  // ca. 70% der Canvas gesetzt, Höhe folgt proportional, zentriert.
  const iconWidth = 124
  const iconHeight = Math.round((iconWidth * 257) / 452)

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#2C2C2C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${base64}`}
          width={iconWidth}
          height={iconHeight}
          alt=""
        />
      </div>
    ),
    { ...size }
  )
}
