// ──────────────────────────────────────────────────────────────────
// SOFORTANGEBOT — E2E-Test (Transkript → GPT-4o Extraktion → Engine → Positionen)
// Ausführen: node tests/e2e-test.mjs
// ──────────────────────────────────────────────────────────────────
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import OpenAI from '/tmp/nodebin/lib/node_modules/openai/index.js'

// ── Env laden ─────────────────────────────────────────────────────
const envPath = path.resolve('/sessions/sharp-clever-cerf/mnt/sofortangebot/.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const OPENAI_API_KEY = env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

// ── Prompt (aus src/lib/ai-prompts.ts) ───────────────────────────
const PROMPT_EXTRAKTION = readFileSync(
  '/sessions/sharp-clever-cerf/mnt/sofortangebot/src/lib/ai-prompts.ts', 'utf8'
).match(/PROMPT_EXTRAKTION_V4 = `([\s\S]*?)`\n/)?.[1] ?? ''

// ── Engine-Funktionen (aus engine-test.mjs kopiert) ───────────────
const round2 = n => Math.round(n * 100) / 100

function malerEngine(daten) {
  const positionen = []
  for (const raum of (daten.raeume ?? [])) {
    const { name: nameRaw = 'Raum', laenge, breite, hoehe, fenster = [], tueren = [], arbeiten = [], sockelleisten: sockel = false } = raum
    const arbeitenStr = arbeiten.join(' ').toLowerCase()
    const transkriptLower = (daten.transkript ?? '').toLowerCase()
    const keinFenster = transkriptLower.includes('kein fenster') || transkriptLower.includes('keine fenster') || transkriptLower.includes('ohne fenster')
    const keineTuer = transkriptLower.includes('keine tür') || transkriptLower.includes('ohne tür')
    const istGarageRaum = nameRaw.toLowerCase().includes('garage')
    const istKellerRaum = nameRaw.toLowerCase().includes('keller')
    const effFenster = fenster.filter(Boolean).length > 0 ? fenster.filter(Boolean) : (istGarageRaum || istKellerRaum || keinFenster) ? [] : [{ breite: 1.2, hoehe: 1.0 }]
    const effTueren = tueren.filter(Boolean).length > 0 ? tueren.filter(Boolean) : (istGarageRaum || keineTuer) ? [] : [{ breite: 0.9, hoehe: 2.1 }]
    const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1)
    let bodenflaecheM2 = null, wandflaecheNettoM2 = null, deckenflaecheM2 = null, umfangM = null
    if (laenge && breite) {
      bodenflaecheM2 = round2(laenge * breite); umfangM = round2(2 * laenge + 2 * breite); deckenflaecheM2 = bodenflaecheM2
      if (hoehe) {
        const brutto = round2(umfangM * hoehe)
        const fenFl = effFenster.reduce((s, f) => s + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0)
        const tuerFl = effTueren.reduce((s, t) => s + (t.anzahl ?? 1) * (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0)
        wandflaecheNettoM2 = round2(brutto - fenFl - tuerFl)
      }
    }
    const leerOderKomplett = arbeiten.length === 0 || arbeitenStr.includes('komplett') || arbeitenStr.includes('alles')
    const hatStreichen = leerOderKomplett || arbeitenStr.includes('streichen') || arbeitenStr.includes('anstrich')
    const nurWaende = arbeitenStr.includes('nur wand') || transkriptLower.includes('nur wände') || transkriptLower.includes('nur die wand')
    const nurDecke = arbeitenStr.includes('nur decke') || transkriptLower.includes('nur decke')
    const hatBodenStreichen = arbeitenStr.includes('boden') || transkriptLower.includes('boden streich')
    const anWaenden = !nurDecke && (hatStreichen || arbeitenStr.includes('wand') || arbeitenStr.includes('tapez'))
    const anDecke = !nurWaende && !hatBodenStreichen && (hatStreichen || arbeitenStr.includes('decke'))
    const bodenStreichen = hatBodenStreichen && bodenflaecheM2 !== null
    const bodenSchutz = !bodenStreichen && (hatStreichen || anDecke || anWaenden)
    const hatSockel = anWaenden && wandflaecheNettoM2 !== null && !istKellerRaum && (hatStreichen || sockel)
    if (anWaenden && wandflaecheNettoM2 !== null) positionen.push({ beschreibung: `Wandflächen streichen — ${name}`, menge: wandflaecheNettoM2, einheit: 'm²' })
    if (anDecke && deckenflaecheM2 !== null) positionen.push({ beschreibung: `Deckenfläche streichen — ${name}`, menge: deckenflaecheM2, einheit: 'm²' })
    if (bodenSchutz && bodenflaecheM2 !== null) positionen.push({ beschreibung: `Boden schützen — ${name}`, menge: bodenflaecheM2, einheit: 'm²' })
    if (hatSockel && umfangM !== null) {
      const tuerBr = effTueren.reduce((s, t) => s + (t.breite ?? 0.9), 0)
      positionen.push({ beschreibung: `Sockelleisten abkleben — ${name}`, menge: round2(umfangM - tuerBr), einheit: 'lfdm' })
    }
  }
  return positionen
}

function fliesenEngine(daten) {
  const positionen = []
  for (const bereich of (daten.bereiche ?? [])) {
    const { name = 'Bereich', laenge, breite, flieshoehe, flaeche: fa, nassbereich = false } = bereich
    const umfang = laenge && breite ? round2(2 * laenge + 2 * breite) : null
    let bodenNetto = null
    if (laenge && breite) {
      bodenNetto = round2(laenge * breite)
      positionen.push({ beschreibung: `Bodenfliesen verlegen — ${name}`, menge: round2(bodenNetto * 1.1), einheit: 'm²' })
      if (nassbereich) positionen.push({ beschreibung: `Verbundabdichtung Boden — ${name}`, menge: bodenNetto, einheit: 'm²' })
    } else if (fa) {
      bodenNetto = fa
      positionen.push({ beschreibung: `Bodenfliesen verlegen — ${name}`, menge: round2(fa * 1.1), einheit: 'm²' })
    }
    if (bodenNetto !== null) positionen.push({ beschreibung: `Verfugung Boden — ${name}`, menge: bodenNetto, einheit: 'm²' })
    if (flieshoehe && umfang) {
      const wandNetto = round2(umfang * flieshoehe)
      positionen.push({ beschreibung: `Wandfliesen verlegen — ${name}`, menge: round2(wandNetto * 1.05), einheit: 'm²' })
      positionen.push({ beschreibung: `Verfugung Wand — ${name}`, menge: wandNetto, einheit: 'm²' })
      if (nassbereich) positionen.push({ beschreibung: `Verbundabdichtung Wand — ${name}`, menge: wandNetto, einheit: 'm²' })
    }
    if (umfang) positionen.push({ beschreibung: `Fliesensockel / Abschlussleiste — ${name}`, menge: umfang, einheit: 'lfdm' })
  }
  for (const ab of (daten.altbelag ?? [])) {
    if (ab.flaeche) {
      positionen.push({ beschreibung: `Altfliesen abstemmen — ${ab.bereich ?? 'Bereich'}`, menge: ab.flaeche, einheit: 'm²' })
      positionen.push({ beschreibung: `Entsorgung Fliesenmaterial — ${ab.bereich ?? 'Bereich'}`, menge: ab.flaeche, einheit: 'm²' })
    }
  }
  return positionen
}

function bodenEngine(daten) {
  const positionen = []
  for (const raum of (daten.raeume ?? [])) {
    const { name = 'Raum', laenge, breite, flaeche: f, belag, verlegerichtung, altbelag_entfernen = false, sockelleisten = false, ausgleich = false } = raum
    let flaeche = null, umfang = null
    if (laenge && breite) { flaeche = round2(laenge * breite); umfang = round2(2 * laenge + 2 * breite) }
    else if (f) flaeche = f
    if (!flaeche) continue
    const verschnitt = verlegerichtung === 'diagonal' ? 0.15 : 0.10
    positionen.push({ beschreibung: `${belag ?? 'Bodenbelag'} verlegen — ${name}`, menge: round2(flaeche * (1 + verschnitt)), einheit: 'm²' })
    if (altbelag_entfernen) positionen.push({ beschreibung: `Altbelag entfernen — ${name}`, menge: flaeche, einheit: 'm²' })
    if (sockelleisten && umfang) positionen.push({ beschreibung: `Sockelleisten montieren — ${name}`, menge: umfang, einheit: 'lfdm' })
    if (ausgleich) positionen.push({ beschreibung: `Untergrundausgleich — ${name}`, menge: flaeche, einheit: 'm²' })
  }
  return positionen
}

function runEngine(gewerk, daten) {
  if (gewerk === 'maler') return malerEngine(daten)
  if (gewerk === 'fliesen') return fliesenEngine(daten)
  if (gewerk === 'boden_parkett') return bodenEngine(daten)
  return []
}

// ── GPT-Extraktion ────────────────────────────────────────────────
async function extrahiere(transkript) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0,
    messages: [
      { role: 'system', content: PROMPT_EXTRAKTION },
      { role: 'user', content: transkript }
    ],
    response_format: { type: 'json_object' },
  })
  return JSON.parse(res.choices[0].message.content)
}

// ── Test-Helper ───────────────────────────────────────────────────
let bestanden = 0, fehlgeschlagen = 0

function check(label, positionen, suchbegriff, expectedMenge, toleranz = 0.11) {
  const pos = positionen.find(p => p.beschreibung.toLowerCase().includes(suchbegriff.toLowerCase()))
  if (!pos) {
    console.log(`  ❌  "${suchbegriff}" — Position fehlt komplett`)
    fehlgeschlagen++; return
  }
  const ok = Math.abs(pos.menge - expectedMenge) <= toleranz
  if (ok) { console.log(`  ✅  ${label}: ${pos.menge} m² (erw. ~${expectedMenge})`); bestanden++ }
  else { console.log(`  ❌  ${label}: ${pos.menge} — ERWARTET ~${expectedMenge} [${pos.beschreibung}]`); fehlgeschlagen++ }
}

function fehlt(label, positionen, suchbegriff) {
  const pos = positionen.find(p => p.beschreibung.toLowerCase().includes(suchbegriff.toLowerCase()))
  if (pos) { console.log(`  ❌  "${suchbegriff}" sollte NICHT da sein, ist aber vorhanden`); fehlgeschlagen++ }
  else { console.log(`  ✅  "${suchbegriff}" korrekt nicht vorhanden`); bestanden++ }
}

async function runTest(name, transkript, checks) {
  process.stdout.write(`\n[${name}] ${transkript.slice(0, 70)}...\n  → GPT-Extraktion läuft...`)
  try {
    const daten = await extrahiere(transkript)
    daten.transkript = transkript
    process.stdout.write(` Gewerk: ${daten.gewerk}\n`)
    const positionen = runEngine(daten.gewerk, daten)
    console.log(`  Positionen: ${positionen.map(p => `${p.beschreibung} (${p.menge} ${p.einheit})`).join(' | ')}`)
    checks(positionen, daten)
  } catch (e) {
    console.log(`  ❌  FEHLER: ${e.message}`)
    fehlgeschlagen++
  }
}

// ══════════════════════════════════════════════════════════════════
// TEST-SZENARIEN
// ══════════════════════════════════════════════════════════════════

console.log('\n══════════════════════════════════════════')
console.log('  SOFORTANGEBOT — E2E Tests (GPT-4o + Engine)')
console.log('══════════════════════════════════════════')

// ── MALER ────────────────────────────────────────────────────────
console.log('\n── MALER ──────────────────────────────────')

await runTest(
  'E-M1', 'Wohnzimmer komplett streichen. 5 Meter lang, 4 Meter breit, 2 Komma 60 Meter hoch. Zwei Fenster, eine Tür.',
  (pos) => {
    // Wand: (2×5+2×4)×2,60 = 18×2,60 = 46,80 − 2×(1,2×1,0) − 1×(0,9×2,1) = 42,51 m²
    check('Wand', pos, 'wandflächen', 42.51, 1.5)
    // Decke: 5×4 = 20 m²
    check('Decke', pos, 'deckenfläche', 20, 0.5)
    check('Boden schützen', pos, 'boden schütz', 20, 0.5)
    // Sockel: 18 − 0,9 = 17,1 lfdm
    check('Sockel', pos, 'sockelleisten', 17.1, 1.5)
  }
)

await runTest(
  'E-M2', 'Schlafzimmer, nur die Wände streichen. Raum ist 4,5 mal 3,5 Meter, 2 Meter 40 hoch. Ein Fenster 1,50 mal 1,20 Meter, eine Tür.',
  (pos) => {
    // Wand: 16×2,40 = 38,40 − 1,80 − 1,89 = 34,71 m²
    check('Wand', pos, 'wandflächen', 34.71, 1.5)
    fehlt('Decke soll fehlen', pos, 'deckenfläche')
    check('Sockel', pos, 'sockelleisten', 15.1, 1.5)
  }
)

await runTest(
  'E-M3', 'Hier ist ein Kellerraum, 6 mal 4 Meter, 2,40 Meter hoch, kein Fenster, eine Tür. Wände und Decke streichen.',
  (pos) => {
    // Wand: (2×6+2×4)×2,40 = 20×2,40 = 48 − 0 − 1,89 = 46,11 m²
    check('Wand', pos, 'wandflächen', 46.11, 2)
    check('Decke', pos, 'deckenfläche', 24, 0.5)
    fehlt('Keine Sockelleisten im Keller', pos, 'sockelleisten')
  }
)

// ── FLIESEN ──────────────────────────────────────────────────────
console.log('\n── FLIESEN ─────────────────────────────────')

await runTest(
  'E-F1', 'Bad komplett neu fliesen. 2,5 mal 2 Meter groß. Wandfliesen bis 2 Meter 20 hoch. Nassbereich wegen der Dusche.',
  (pos) => {
    // Boden: 2,5×2 = 5 m² + 10% = 5,50 m²
    check('Boden verlegen', pos, 'bodenfliesen', 5.5, 0.3)
    check('Verfugung Boden', pos, 'verfugung boden', 5, 0.3)
    check('Abdichtung Boden', pos, 'verbundabdichtung boden', 5, 0.3)
    // Wand: (2×2,5+2×2)×2,2 = 9×2,2 = 19,8 m² + 5% = 20,79 m²
    check('Wand verlegen', pos, 'wandfliesen', 20.79, 1)
    check('Abdichtung Wand', pos, 'verbundabdichtung wand', 19.8, 1)
    check('Sockel', pos, 'fliesensockel', 9, 0.5)
  }
)

await runTest(
  'E-F2', 'Küchenboden fliesen, 4 mal 3 Meter. Altfliesen müssen vorher raus.',
  (pos) => {
    // Boden: 4×3 = 12 m² + 10% = 13,20 m²
    check('Boden verlegen', pos, 'bodenfliesen', 13.2, 0.5)
    check('Altfliesen', pos, 'altfliesen', 12, 0.5)
    check('Entsorgung', pos, 'entsorgung', 12, 0.5)
    fehlt('Keine Wandfliesen', pos, 'wandfliesen')
    fehlt('Keine Abdichtung', pos, 'verbundabdichtung')
  }
)

// ── BODENLEGER ───────────────────────────────────────────────────
console.log('\n── BODENLEGER ──────────────────────────────')

await runTest(
  'E-B1', 'Wohnzimmer Parkett verlegen, 6 mal 4,5 Meter. Der alte Belag muss raus. Und neue Sockelleisten.',
  (pos) => {
    // Parkett: 27 m² + 10% = 29,70 m²
    check('Parkett verlegen', pos, 'verlegen', 29.7, 1)
    check('Altbelag', pos, 'altbelag', 27, 0.5)
    check('Sockelleisten', pos, 'sockelleisten', 21, 1)
  }
)

await runTest(
  'E-B2', 'Flur Laminat verlegen, diagonal, 5 mal 1,5 Meter.',
  (pos) => {
    // Laminat: 7,5 m² + 15% diagonal = 8,625 m²
    check('Laminat diagonal', pos, 'verlegen', 8.625, 0.5)
  }
)

await runTest(
  'E-B3', 'Vinylboden verlegen im Wohnzimmer 5 mal 4 Meter und im Schlafzimmer 4 mal 3,5 Meter, dort muss der Altbelag raus.',
  (pos) => {
    check('WZ Vinyl', pos, 'verlegen — wohnzimmer', 22, 1)
    check('SZ Vinyl', pos, 'verlegen — schlafzimmer', 15.4, 1)
    check('SZ Altbelag', pos, 'altbelag entfernen — schlafzimmer', 14, 0.5)
    fehlt('WZ kein Altbelag', pos, 'altbelag entfernen — wohnzimmer')
  }
)

// ── ERGEBNIS ─────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════')
console.log(`  ERGEBNIS: ${bestanden} ✅  bestanden   ${fehlgeschlagen} ❌  fehlgeschlagen`)
console.log(`  (${bestanden + fehlgeschlagen} Assertions gesamt)`)
console.log('══════════════════════════════════════════\n')
process.exit(fehlgeschlagen > 0 ? 1 : 0)
