// E2E-Test KORREKT: Transkript → GPT (echter Prompt) → ExtrahierteDaten → Engine → Vergleich
// Starten: node tests/e2e-test-v3.mjs
// Dauer: ca. 4-6 Minuten (30 GPT-Calls mit echtem Prompt)
import { readFileSync } from 'fs'
import OpenAI from 'openai'

// ── Mehrraum-Reparatur (identisch zu src/lib/mengen/mehrraum-reparatur.ts) ──
const RAUM_WOERTER = [
  'wohnzimmer','schlafzimmer','kinderzimmer','bad','badezimmer','wc','küche','kueche',
  'flur','keller','dachboden','büro','buro','esszimmer','gästezimmer','gastezimmer',
  'toilette','abstellraum','hauswirtschaft','treppenhaus','garage','terrasse','balkon',
  'zimmer','studio','arbeitszimmer','diele','hauswirtschaftsraum','spielzimmer','hobbyraum',
]
const RAUM_PATTERN = new RegExp(
  '(' + RAUM_WOERTER.join('|') + ')' +
  '[^0-9]*?' +
  '([0-9]+[,.]?[0-9]*)\\s*[×xX]\\s*([0-9]+[,.]?[0-9]*)',
  'gi'
)
function extrahiereMasseAusText(transkript) {
  const ergebnis = new Map()
  RAUM_PATTERN.lastIndex = 0
  let m
  while ((m = RAUM_PATTERN.exec(transkript)) !== null) {
    const raumName = m[1].toLowerCase().trim()
    const laenge = parseFloat(m[2].replace(',', '.'))
    const breite = parseFloat(m[3].replace(',', '.'))
    if (laenge > 0 && breite > 0 && !ergebnis.has(raumName)) {
      ergebnis.set(raumName, { raumName, laenge, breite })
    }
  }
  return ergebnis
}
function hatDuplikatMasse(liste) {
  if (!liste || liste.length < 2) return false
  const seen = new Set()
  for (const r of liste) {
    if (r.laenge != null && r.breite != null) {
      const key = `${r.laenge}x${r.breite}`
      if (seen.has(key)) return true
      seen.add(key)
    }
  }
  return false
}
function repariereDuplikatMasse(raeume, transkript) {
  if (!raeume || raeume.length < 2) return { repariert: raeume, wurdeRepariert: false }
  const textMasse = extrahiereMasseAusText(transkript)
  if (textMasse.size < 2) return { repariert: raeume, wurdeRepariert: false }
  let wurdeRepariert = false
  const repariert = raeume.map(raum => {
    const raumLower = (raum.name ?? '').toLowerCase().trim()
    const match = textMasse.get(raumLower)
      ?? Array.from(textMasse.values()).find(m => raumLower.includes(m.raumName) || m.raumName.includes(raumLower))
    if (match && (match.laenge !== raum.laenge || match.breite !== raum.breite)) {
      wurdeRepariert = true
      return { ...raum, laenge: match.laenge, breite: match.breite }
    }
    return raum
  })
  return { repariert, wurdeRepariert }
}

// API Key aus .env.local lesen
const env = readFileSync('.env.local', 'utf8')
const apiKey = env.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim()
if (!apiKey) { console.error('❌ Kein OPENAI_API_KEY in .env.local'); process.exit(1) }
const client = new OpenAI({ apiKey })

// ── Echter Prompt aus der App ──────────────────────────────────────
const PROMPT = `Du bist ein erfahrener Kalkulator für das deutsche Handwerk mit 20 Jahren Erfahrung. Du hörst einem Handwerker zu der sein Aufmaß einspricht.

DEINE AUFGABE:
Extrahiere ALLES was für eine korrekte Kalkulation nötig ist. Erkenne was fehlt. Stelle die RICHTIGEN Fragen.

GRUNDREGELN — NIE BRECHEN:
1. NIEMALS Mengen erfinden oder schätzen. Wenn du eine Fläche nicht berechnen kannst: null.
2. NIEMALS Bodenfläche als Wandfläche nutzen. Wände = Umfang × Höhe. Immer.
3. IMMER Öffnungen bedenken. Fenster und Türen reduzieren Wandfläche. Wenn Maße fehlen: Standard annehmen (Fenster 1,20×1,00m, Tür 0,90×2,10m) und als Annahme markieren.
4. KONTEXT ist dein wichtigstes Werkzeug: "die Dusche" im Bad = bodengleiche Dusche, "komplett" = alle Positionen des Gewerks
5. STANDARD-ANNAHMEN (immer in annahmen[] protokollieren): Raumhöhe unbekannt → 2,60m, Fenstermaß unbekannt → 1,20×1,00m, Türmaß unbekannt → 0,90×2,10m, Verschnitt Fliesen/Boden → 10%

GEWERK-SPEZIFISCHES WISSEN:
MALER: "Zimmer streichen" = Wände + Decke. Wandfläche = Umfang × Höhe − Öffnungen. Deckenfläche = Bodenfläche. Abdecken/Abkleben immer wenn Streichen.
FLIESEN: Nassbereich → immer Abdichtung. "Bad fliesen" = Boden + Wände. Altfliesen entfernen = eigene Position. Bodengleiche Dusche = teure eigene Position.
BODENBELÄGE: Bodenfläche = Länge × Breite + Verschnitt. Sockelleisten = Umfang − Türbreiten.

MULTI-RAUM PARSING — KRITISCH:
Jeder genannte Raum = eigener Eintrag in raeume[] mit EIGENEN Maßen.
Jeder Raum hat seine EIGENEN Maße — NIEMALS Maße von einem Raum auf einen anderen übertragen.
Wenn Raum 1 "6×4m" und Raum 2 "4.5×3.5m" hat: raeume[0].laenge=6, raeume[0].breite=4 UND raeume[1].laenge=4.5, raeume[1].breite=3.5 (NICHT 6 und 4).
Erkenne Raumwechsel an: "dann noch", "außerdem", Raumname, Doppelpunkt nach Raumname, Komma zwischen Räumen.
WC und Bad sind IMMER separate Räume mit EIGENEN Maßen.
WARNUNG: Wenn zwei Räume dieselben laenge+breite haben aber unterschiedliche Maße im Text → Extraktionsfehler! Prüfe nochmal.

AUSGABE — EXAKTES FORMAT:
Antworte NUR mit diesem JSON. Kein Text davor, kein Text danach.

{
  "gewerk": "maler|fliesen|boden_parkett",
  "raeume": [
    {
      "name": "Wohnzimmer",
      "laenge": 5.0,
      "breite": 4.0,
      "hoehe": 2.60,
      "fenster": [{"breite": 1.20, "hoehe": 1.00, "anzahl": 1, "annahme": true}],
      "tueren": [{"breite": 0.90, "hoehe": 2.10, "anzahl": 1, "annahme": false}],
      "nassbereich": false,
      "arbeiten": ["waende_streichen", "decke_streichen"],
      "altbelag_entfernen": false,
      "sockelleisten": false,
      "belag": null,
      "verlegerichtung": null,
      "ausgleich": false,
      "flieshoehe": null
    }
  ],
  "bereiche": [
    {
      "name": "Bad",
      "laenge": 2.5,
      "breite": 2.0,
      "flieshoehe": 2.2,
      "nassbereich": true
    }
  ],
  "altbelag": [
    { "bereich": "Bad", "flaeche": 5.0 }
  ],
  "annahmen": [],
  "rueckfragen": []
}`

// ── Inline Engines (identisch zu validate-engine-v2) ──────────────
const round2 = n => Math.round(n * 100) / 100

function malerEngine(daten) {
  const positionen = []
  for (const raum of (daten.raeume ?? [])) {
    const { name: nameRaw='Raum', laenge, breite, hoehe, fenster=[], tueren=[], arbeiten=[], sockelleisten:sockel=false } = raum
    const arbStr = arbeiten.join(' ').toLowerCase()
    const tl = (daten.transkript ?? '').toLowerCase()
    const keinFenster = tl.includes('kein fenster')||tl.includes('keine fenster')||tl.includes('ohne fenster')
    const keineTuer = tl.includes('keine tür')||tl.includes('ohne tür')
    const istGarage = nameRaw.toLowerCase().includes('garage')
    const istKeller = nameRaw.toLowerCase().includes('keller')
    const effF = fenster.filter(Boolean).length>0?fenster.filter(Boolean):(istGarage||istKeller||keinFenster)?[]:[{breite:1.2,hoehe:1.0}]
    const effT = tueren.filter(Boolean).length>0?tueren.filter(Boolean):(istGarage||keineTuer)?[]:[{breite:0.9,hoehe:2.1}]
    const name = nameRaw.charAt(0).toUpperCase()+nameRaw.slice(1)
    let boden=null,wand=null,decke=null,umfang=null
    if (laenge&&breite) {
      boden=round2(laenge*breite); umfang=round2(2*laenge+2*breite); decke=boden
      if (hoehe) {
        const fenFl=effF.reduce((s,f)=>s+(f.anzahl??1)*(f.breite??1.2)*(f.hoehe??1.0),0)
        const tuerFl=effT.reduce((s,t)=>s+(t.anzahl??1)*(t.breite??0.9)*(t.hoehe??2.1),0)
        wand=round2(umfang*hoehe-fenFl-tuerFl)
      }
    }
    const leerKomplett=arbeiten.length===0||arbStr.includes('komplett')
    const hatStr=leerKomplett||arbStr.includes('streichen')||arbStr.includes('anstrich')
    const nurWaende=arbStr.includes('nur_wand')||tl.includes('nur wände')||tl.includes('nur die wand')
    const nurDecke=arbStr.includes('nur_decke')||tl.includes('nur decke')
    const hatBoden=arbStr.includes('boden')||tl.includes('boden streich')
    const anW=!nurDecke&&!hatBoden&&(hatStr||arbStr.includes('wand'))
    const anD=!nurWaende&&!hatBoden&&(hatStr||arbStr.includes('decke'))
    const boStr=hatBoden&&boden!==null
    const boSch=!boStr&&(hatStr||anD||anW)
    const hatSok=anW&&wand!==null&&!istKeller&&(hatStr||sockel)
    if (anW&&wand!==null) positionen.push({beschreibung:`Wandflächen streichen — ${name}`,menge:wand,einheit:'m²'})
    if (anD&&decke!==null) positionen.push({beschreibung:`Deckenfläche streichen — ${name}`,menge:decke,einheit:'m²'})
    if (boStr&&boden!==null) positionen.push({beschreibung:`Boden streichen — ${name}`,menge:boden,einheit:'m²'})
    if (boSch&&boden!==null) positionen.push({beschreibung:`Boden schützen — ${name}`,menge:boden,einheit:'m²'})
    if (hatSok&&umfang!==null) {
      const tuerBr=effT.reduce((s,t)=>s+(t.anzahl??1)*(t.breite??0.9),0)
      positionen.push({beschreibung:`Sockelleisten abkleben — ${name}`,menge:round2(umfang-tuerBr),einheit:'lfdm'})
    }
  }
  return positionen
}

function fliesenEngine(daten) {
  const positionen = []
  for (const b of (daten.bereiche??[])) {
    const {name='Bereich',laenge,breite,flieshoehe,flaeche:fa,nassbereich=false}=b
    const umfang=laenge&&breite?round2(2*laenge+2*breite):null
    let bodenNetto=null
    if (laenge&&breite) {
      bodenNetto=round2(laenge*breite)
      positionen.push({beschreibung:`Bodenfliesen verlegen — ${name}`,menge:round2(bodenNetto*1.1),einheit:'m²'})
      if (nassbereich) positionen.push({beschreibung:`Verbundabdichtung Boden — ${name}`,menge:bodenNetto,einheit:'m²'})
    } else if (fa) { bodenNetto=fa; positionen.push({beschreibung:`Bodenfliesen verlegen — ${name}`,menge:round2(fa*1.1),einheit:'m²'}) }
    if (bodenNetto!==null) positionen.push({beschreibung:`Verfugung Boden — ${name}`,menge:bodenNetto,einheit:'m²'})
    if (flieshoehe&&umfang) {
      const wand=round2(umfang*flieshoehe)
      positionen.push({beschreibung:`Wandfliesen verlegen — ${name}`,menge:round2(wand*1.05),einheit:'m²'})
      positionen.push({beschreibung:`Verfugung Wand — ${name}`,menge:wand,einheit:'m²'})
      if (nassbereich) positionen.push({beschreibung:`Verbundabdichtung Wand — ${name}`,menge:wand,einheit:'m²'})
    }
    if (umfang) positionen.push({beschreibung:`Fliesensockel / Abschlussleiste — ${name}`,menge:umfang,einheit:'lfdm'})
  }
  for (const ab of (daten.altbelag??[])) {
    const name=ab.bereich??'Bereich', fl=ab.flaeche
    if (fl) {
      positionen.push({beschreibung:`Altfliesen abstemmen — ${name}`,menge:fl,einheit:'m²'})
      positionen.push({beschreibung:`Entsorgung Fliesenmaterial — ${name}`,menge:fl,einheit:'m²'})
    }
  }
  return positionen
}

function bodenEngine(daten) {
  const positionen = []
  for (const r of (daten.raeume??[])) {
    const {name='Raum',laenge,breite,flaeche:f,belag,verlegerichtung,altbelag_entfernen=false,sockelleisten=false,ausgleich=false}=r
    let fl=null,umfang=null
    if (laenge&&breite){fl=round2(laenge*breite);umfang=round2(2*laenge+2*breite)}else if(f){fl=f}
    if (!fl) continue
    const v=verlegerichtung==='diagonal'?0.15:0.10
    positionen.push({beschreibung:`${belag??'Bodenbelag'} verlegen — ${name}`,menge:round2(fl*(1+v)),einheit:'m²'})
    if (altbelag_entfernen) positionen.push({beschreibung:`Altbelag entfernen — ${name}`,menge:fl,einheit:'m²'})
    if (sockelleisten&&umfang) positionen.push({beschreibung:`Sockelleisten montieren — ${name}`,menge:umfang,einheit:'lfdm'})
    if (ausgleich) positionen.push({beschreibung:`Untergrundausgleich — ${name}`,menge:fl,einheit:'m²'})
  }
  return positionen
}

function runEngine(gewerk, extraktion, transkript) {
  const daten = {...extraktion, transkript}
  if (gewerk==='maler') return malerEngine(daten)
  if (gewerk==='fliesen') return fliesenEngine(daten)
  if (gewerk==='boden_parkett') return bodenEngine(daten)
  return []
}

// ── Testfälle laden (nur Engine-Kategorien, 10 pro Gewerk) ────────
const alle = JSON.parse(readFileSync('tests/testfaelle-v2.json','utf8')).testfaelle
const ENGINE_KAT = new Set(['einzelraum_komplett','nur_waende','nur_decke','multi_raum','keller_garage',
  'standardhoehe_annahme','bad_komplett_nassbereich','nur_boden','altfliesen','multi_bereich',
  'standard_verlegen','mit_altbelag','diagonal','mit_sockelleisten','untergrundausgleich','linoleum'])

function pick(gewerk, anzahl) {
  const kandidaten = alle.filter(t => t.few_shot_kandidat && !t.engine_test_skip && ENGINE_KAT.has(t.kategorie) && t.gewerk === gewerk)
  const result = [], katSeen = new Set()
  for (const t of kandidaten) {
    if (!katSeen.has(t.kategorie)) { result.push(t); katSeen.add(t.kategorie); if (result.length >= anzahl) break }
  }
  return result
}

const testSet = [...pick('maler',10), ...pick('fliesen',10), ...pick('boden_parkett',10)]

console.log(`\n🚀 E2E-Test v3 — ${testSet.length} Testfälle`)
console.log('═══════════════════════════════════════════')
console.log('Ablauf: Transkript → GPT-4o (echter Prompt) → ExtrahierteDaten → Engine → Vergleich\n')

let ok=0, teilweise=0, fail=0
const TOLERANZ=0.5

for (const tc of testSet) {
  process.stdout.write(`[${tc.id}] ${tc.transkript.slice(0,55)}... `)
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: tc.transkript }
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    })

    let gptJSON = JSON.parse(response.choices[0].message.content)

    // Mehrraum-Reparatur: GPT kopiert manchmal Maße von Raum 1 auf Raum 2+
    if (gptJSON.raeume?.length > 1) {
      const { repariert, wurdeRepariert } = repariereDuplikatMasse(gptJSON.raeume, tc.transkript)
      if (wurdeRepariert) gptJSON = { ...gptJSON, raeume: repariert }
    }
    if (gptJSON.bereiche?.length > 1) {
      const { repariert, wurdeRepariert } = repariereDuplikatMasse(gptJSON.bereiche, tc.transkript)
      if (wurdeRepariert) gptJSON = { ...gptJSON, bereiche: repariert }
    }

    // Engine mit GPT-Ausgabe laufen lassen
    // Fliesen: raeume → bereiche mappen wenn nötig
    let extraktion = { ...gptJSON }
    if (tc.gewerk === 'fliesen' && (!gptJSON.bereiche || gptJSON.bereiche.length === 0) && gptJSON.raeume?.length > 0) {
      extraktion.bereiche = gptJSON.raeume.map(r => ({
        name: r.name, laenge: r.laenge, breite: r.breite,
        flieshoehe: r.flieshoehe, nassbereich: r.nassbereich ?? false
      }))
    }

    const enginePositionen = runEngine(tc.gewerk, extraktion, tc.transkript)

    // Vergleich
    let treffer = 0
    const details = []
    for (const erw of tc.positionen_erwartet) {
      const erfKey = erw.beschreibung.toLowerCase()
      const gefunden = enginePositionen.find(p => p.beschreibung.toLowerCase() === erfKey)
      if (!gefunden) {
        details.push(`  ❌ FEHLT: ${erw.beschreibung} (erw. ${erw.menge} ${erw.einheit})`)
      } else if (Math.abs(gefunden.menge - erw.menge) > TOLERANZ) {
        details.push(`  ⚠️  MENGE: "${erw.beschreibung}" → Engine: ${gefunden.menge}, erw: ${erw.menge} ${erw.einheit}`)
        treffer += 0.5
      } else {
        details.push(`  ✅ ${erw.beschreibung}: ${gefunden.menge} ${gefunden.einheit}`)
        treffer++
      }
    }

    const quote = tc.positionen_erwartet.length > 0 ? treffer / tc.positionen_erwartet.length : 1
    const status = quote >= 0.9 ? '✅ PASS' : quote >= 0.6 ? '⚠️  TEIL' : '❌ FAIL'
    console.log(status)
    if (quote < 0.9) {
      details.forEach(d => console.log(d))
      // GPT-JSON kurz zeigen zum Debuggen
      if (quote < 0.5) {
        const raeume = gptJSON.raeume?.map(r=>`${r.name}(${r.laenge}×${r.breite}×${r.hoehe})`).join(', ') ?? '-'
        const bereiche = gptJSON.bereiche?.map(r=>`${r.name}(${r.laenge}×${r.breite})`).join(', ') ?? '-'
        console.log(`  → GPT raeume: [${raeume}]`)
        if (bereiche !== '-') console.log(`  → GPT bereiche: [${bereiche}]`)
      }
    }

    if (quote >= 0.9) ok++
    else if (quote >= 0.6) teilweise++
    else fail++

  } catch(e) {
    console.log('❌ FEHLER:', e.message)
    fail++
  }
  await new Promise(r => setTimeout(r, 600))
}

console.log('\n═══════════════════════════════════════════')
console.log('  ERGEBNIS')
console.log('═══════════════════════════════════════════')
console.log(`✅ PASS:      ${ok}/${testSet.length}`)
console.log(`⚠️  TEILWEISE: ${teilweise}/${testSet.length}`)
console.log(`❌ FAIL:      ${fail}/${testSet.length}`)
const score = Math.round(ok/testSet.length*100)
console.log(`\nScore: ${score}% (Ziel: 90%+)`)
if (score >= 90) console.log('🎉 GPT hat die Logik verstanden — bereit für Few-Shot Integration!')
else if (score >= 70) console.log('⚙️  Gut, aber Prompt braucht noch Feinschliff.')
else console.log('🔧 Prompt muss überarbeitet werden.')
