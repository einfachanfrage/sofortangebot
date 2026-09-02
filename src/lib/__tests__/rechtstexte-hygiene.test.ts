// Rechtstext-Hygiene (Head of Legal & Compliance, G1/G8, 02.09.2026)
//
// Zwei Fehlerklassen, die hier schon zugeschlagen haben und die niemand beim
// Lesen bemerkt, weil die Seiten nicht Teil des täglichen Arbeitsflusses sind:
//
//  1) Ein Dienstleister wird im Code eingesetzt, steht aber nicht in der
//     Datenschutzerklärung (OpenAI, Sentry) — oder umgekehrt: er steht in der
//     Erklärung und wird gar nicht eingesetzt (Groq — nie angebunden, am
//     02.09.2026 restlos entfernt). Beides ist eine falsche
//     Angabe nach Art. 13 DSGVO.
//  2) Ein Gesetz wird umbenannt (TMG → DDG, TTDSG → TDDDG) oder eine
//     Pflichtangabe fällt weg (EU-Streitschlichtung), und der alte Verweis
//     bleibt stehen. Genau danach wird automatisiert abgemahnt.
//
// Der Test liest die echten Seiten-Dateien, damit ein Rückschritt auffällt,
// bevor er live geht — nicht erst, wenn Post kommt.
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const lies = (p: string) => readFileSync(join(process.cwd(), p), 'utf-8')

const IMPRESSUM = lies('src/app/impressum/page.tsx')
const DATENSCHUTZ = lies('src/app/datenschutz/page.tsx')
const AVV = lies('src/app/avv/page.tsx')
const AGB = lies('src/app/agb/page.tsx')

/** Alle Quelldateien, in denen ein Drittdienst tatsächlich aufgerufen würde. */
function quelldateien(wurzeln: string[]): string[] {
  const treffer: string[] = []
  const lauf = (dir: string) => {
    let eintraege: string[]
    try { eintraege = readdirSync(dir) } catch { return }
    for (const name of eintraege) {
      if (name === 'node_modules' || name === '__tests__' || name.startsWith('.')) continue
      const pfad = join(dir, name)
      if (statSync(pfad).isDirectory()) lauf(pfad)
      else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) treffer.push(pfad)
    }
  }
  for (const w of wurzeln) lauf(join(process.cwd(), w))
  return treffer
}

const CODE = quelldateien(['src', 'supabase/functions'])
  .filter(p => !p.includes(join('src', 'app', 'datenschutz')))
  .filter(p => !p.includes(join('src', 'app', 'impressum')))
  .filter(p => !p.includes(join('src', 'app', 'avv')))
  .filter(p => !p.includes(join('src', 'app', 'agb')))
  .filter(p => !p.includes(join('src', 'lib', 'konto-loeschung')))
  .map(p => readFileSync(p, 'utf-8'))
  .join('\n')

describe('Datenschutzerklärung nennt genau die Dienste, die wir einsetzen', () => {
  it('OpenAI wird eingesetzt und ist genannt', () => {
    expect(CODE).toContain('api.openai.com')
    expect(DATENSCHUTZ).toContain('OpenAI')
  })

  it('Sentry wird eingesetzt und ist genannt', () => {
    expect(CODE).toMatch(/@sentry\/nextjs/)
    expect(DATENSCHUTZ).toMatch(/Sentry/)
  })

  it('Groq kommt nirgends mehr vor — weder im Code noch in einem Rechtstext', () => {
    // Sandys Ansage vom 02.09.2026: „habe nirgendwo groq komplett rauslöschen.
    // habe nur openai". Der Dienst war nie angebunden; jede Erwähnung war eine
    // falsche Angabe. Wird Groq eines Tages wirklich eingesetzt, schlägt dieser
    // Test an und erzwingt, dass er vorher in die Rechtstexte kommt.
    expect(CODE).not.toMatch(/groq/i)
    expect(DATENSCHUTZ).not.toMatch(/groq/i)
    expect(IMPRESSUM).not.toMatch(/groq/i)
    expect(AVV).not.toMatch(/groq/i)
    expect(AGB).not.toMatch(/groq/i)
  })

  it('Supabase, Vercel, Resend und Stripe sind genannt', () => {
    for (const dienst of ['Supabase', 'Vercel', 'Resend', 'Stripe']) {
      expect(DATENSCHUTZ).toContain(dienst)
    }
  })

  it('Drittland-Abschnitt unterscheidet DPF und Standardvertragsklauseln konkret', () => {
    // Die frühere Pauschale („Alle genannten Anbieter sind im DPF zertifiziert
    // oder haben entsprechende Garantien getroffen") behauptete mehr, als
    // belegbar ist — Legal konnte den DPF-Status nur für drei Anbieter finden.
    expect(DATENSCHUTZ).not.toMatch(/Alle genannten Anbieter sind im Data Privacy Framework zertifiziert/)
    expect(DATENSCHUTZ).toContain('Data Privacy Framework')
    expect(DATENSCHUTZ).toContain('Art. 46 Abs. 2 lit. c DSGVO')
  })

  it('AVV führt dieselben Unterauftragnehmer wie die Datenschutzerklärung', () => {
    for (const dienst of ['OpenAI', 'Sentry', 'Supabase', 'Vercel', 'Resend', 'Stripe']) {
      expect(AVV).toContain(dienst)
    }
  })
})

describe('Gesetzesverweise sind aktuell', () => {
  it('Impressum verweist auf das DDG, nicht mehr auf das TMG', () => {
    // TMG seit 14.05.2024 durch das Digitale-Dienste-Gesetz (DDG) ersetzt.
    expect(IMPRESSUM).not.toMatch(/TMG/)
    expect(IMPRESSUM).toContain('§ 5 DDG')
    expect(IMPRESSUM).toContain('§ 7 Abs. 1 DDG')
  })

  it('Haftungsabsatz nennt den DSA statt der aufgehobenen §§ 8–10 TMG', () => {
    expect(IMPRESSUM).toMatch(/2022\/2065/)
  })

  it('Datenschutzerklärung verweist auf das TDDDG, nicht auf § 25 TTDSG', () => {
    expect(DATENSCHUTZ).not.toMatch(/§ 25 TTDSG/)
    expect(DATENSCHUTZ).toContain('TDDDG')
  })

  it('kein Verweis auf die abgeschaffte OS-Plattform der EU-Kommission', () => {
    // ODR-Verordnung aufgehoben durch Verordnung (EU) 2024/3228, Plattform
    // eingestellt. Ein toter Pflichtlink ist keine Pflichterfüllung.
    expect(IMPRESSUM).not.toMatch(/ec\.europa\.eu\/consumers\/odr/)
    expect(IMPRESSUM).not.toMatch(/Online-Streitbeilegung/)
  })

  it('die VSBG-Erklärung bleibt — sie ist weiterhin Pflicht', () => {
    expect(IMPRESSUM).toMatch(/Verbraucherschlichtungsstelle/)
    expect(IMPRESSUM).toMatch(/VSBG/)
  })
})
