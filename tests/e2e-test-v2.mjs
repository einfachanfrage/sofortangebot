// E2E-Test: Schickt echte Transkripte an GPT-4o und prüft ob die Extraktion stimmt
// Starten: node tests/e2e-test-v2.mjs
// Dauer: ca. 3-5 Minuten (30 GPT-Calls)
import { readFileSync } from 'fs'
import OpenAI from 'openai'

// API Key aus .env.local lesen
const env = readFileSync('.env.local', 'utf8')
const apiKey = env.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim()
if (!apiKey) { console.error('❌ Kein OPENAI_API_KEY in .env.local'); process.exit(1) }

const client = new OpenAI({ apiKey })

// Prompt (vereinfacht für Test — gleiches Prinzip wie PROMPT_EXTRAKTION_V4)
const SYSTEM_PROMPT = `Du bist ein Assistent für Handwerker-Angebote.
Analysiere den Transkript und extrahiere die Arbeitspositionen.

Antworte NUR mit JSON im Format:
{
  "gewerk": "maler" | "fliesen" | "boden_parkett",
  "erkannte_positionen": [
    { "beschreibung": "...", "menge": <Zahl>, "einheit": "m²" | "lfdm" | "Stück" | "Pauschale" }
  ]
}

Regeln:
- Wandfläche = Umfang × Höhe − Fenster − Türen
- Standard Deckenhöhe: 2,60m wenn nicht angegeben
- Standard Fenster: 1,20 × 1,00m
- Standard Tür: 0,90 × 2,10m
- Fliesen Boden: +10% Verschnitt
- Fliesen Wand: +5% Verschnitt
- Parkett/Laminat/Vinyl: +10% Verschnitt (diagonal: +15%)
- Nassbereich: immer Verbundabdichtung`

// 30 repräsentative Testfälle aus testfaelle-v2.json
const alle = JSON.parse(readFileSync('tests/testfaelle-v2.json', 'utf8')).testfaelle
const fewShotKandidaten = alle.filter(t => t.few_shot_kandidat && !t.engine_test_skip)

// 10 pro Gewerk, je aus verschiedenen Kategorien
function pick(gewerk, anzahl) {
  const gefiltert = fewShotKandidaten.filter(t => t.gewerk === gewerk)
  const result = []
  const kategorienGesehen = new Set()
  for (const t of gefiltert) {
    if (!kategorienGesehen.has(t.kategorie)) {
      result.push(t); kategorienGesehen.add(t.kategorie)
      if (result.length >= anzahl) break
    }
  }
  return result
}

const testSet = [
  ...pick('maler', 10),
  ...pick('fliesen', 10),
  ...pick('boden_parkett', 10),
]

console.log(`\n🚀 E2E-Test startet mit ${testSet.length} Testfällen...`)
console.log('══════════════════════════════════════════\n')

let ok = 0, teilweise = 0, fail = 0
const ergebnisse = []

for (const tc of testSet) {
  process.stdout.write(`[${tc.id}] ${tc.transkript.slice(0,60)}... `)

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: tc.transkript }
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    })

    const json = JSON.parse(response.choices[0].message.content)
    const gptPositionen = json.erkannte_positionen ?? []

    // Prüfen: Wie viele erwartete Positionen wurden erkannt?
    let treffer = 0
    const details = []
    for (const erw of tc.positionen_erwartet) {
      const gefunden = gptPositionen.find(p =>
        p.beschreibung?.toLowerCase().includes(erw.beschreibung.toLowerCase().split('—')[0].trim()) ||
        erw.beschreibung.toLowerCase().includes(p.beschreibung?.toLowerCase().split('—')[0].trim() ?? '')
      )
      if (gefunden) {
        const mengeFehler = Math.abs((gefunden.menge ?? 0) - erw.menge) > 0.5
        details.push(`  ${mengeFehler ? '⚠️ ' : '  ✅'} ${erw.beschreibung}: erw. ${erw.menge} ${erw.einheit}, GPT: ${gefunden.menge} ${gefunden.einheit}`)
        if (!mengeFehler) treffer++
        else treffer += 0.5
      } else {
        details.push(`  ❌ FEHLT: ${erw.beschreibung} (erw. ${erw.menge} ${erw.einheit})`)
      }
    }

    const quote = treffer / tc.positionen_erwartet.length
    const status = quote >= 0.9 ? '✅ PASS' : quote >= 0.6 ? '⚠️  TEIL' : '❌ FAIL'
    console.log(status)
    if (quote < 0.9) details.forEach(d => console.log(d))

    ergebnisse.push({ id: tc.id, status, quote })
    if (quote >= 0.9) ok++
    else if (quote >= 0.6) teilweise++
    else fail++

  } catch (e) {
    console.log('❌ FEHLER:', e.message)
    ergebnisse.push({ id: tc.id, status: 'ERROR', quote: 0 })
    fail++
  }

  // Rate limiting: kurz warten
  await new Promise(r => setTimeout(r, 500))
}

console.log('\n══════════════════════════════════════════')
console.log('  ERGEBNIS')
console.log('══════════════════════════════════════════')
console.log(`✅ PASS:     ${ok}/${testSet.length}`)
console.log(`⚠️  TEILWEISE: ${teilweise}/${testSet.length}`)
console.log(`❌ FAIL:     ${fail}/${testSet.length}`)
console.log(`\nZiel: 90%+ PASS → GPT hat die Logik verstanden`)
