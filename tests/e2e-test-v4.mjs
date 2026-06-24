// E2E-Test v4 — Komplexe Alltagssprache, Korrekturen, Dialekt, Multi-Raum
// Starten: node tests/e2e-test-v4.mjs
// Dauer: ca. 8-12 Minuten (45 GPT-Calls)
//
// NEU gegenüber v3:
//  ✦ Korrekturen ("5×4m, ach nee, 6×4m") — KI muss LETZTEN Wert nehmen
//  ✦ Dialekt & Alltagssprache ("des is", "ich sag mal", "warte kurz")
//  ✦ Multi-Raum mit Korrekturen pro Raum
//  ✦ Selbst-Unterbrechungen & Fülller
//  ✦ Mehr Gewerke-Durchmischung pro Batch

import { readFileSync } from 'fs'
import OpenAI from 'openai'

// ── Mehrraum-Reparatur ──────────────────────────────────────────────
const RAUM_WOERTER = [
  'wohnzimmer','schlafzimmer','kinderzimmer','bad','badezimmer','wc','küche','kueche',
  'flur','keller','dachboden','büro','buro','esszimmer','gästezimmer','gastezimmer',
  'toilette','abstellraum','hauswirtschaft','treppenhaus','garage','terrasse','balkon',
  'zimmer','studio','arbeitszimmer','diele','hobbyraum','gästebad','masterbad','eingang',
  'ankleidezimmer','warteraum','besprechungsraum','konferenzraum',
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

// ── API-Key ────────────────────────────────────────────────────────
const env = readFileSync('.env.local', 'utf8')
const apiKey = env.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim()
if (!apiKey) { console.error('❌ Kein OPENAI_API_KEY in .env.local'); process.exit(1) }
const client = new OpenAI({ apiKey })

// ── Prompt (identisch zur App) ──────────────────────────────────────
const PROMPT = `Du bist ein erfahrener Kalkulator für das deutsche Handwerk mit 20 Jahren Erfahrung. Du hörst einem Handwerker zu der sein Aufmaß einspricht.

DEINE AUFGABE:
Extrahiere ALLES was für eine korrekte Kalkulation nötig ist. Erkenne was fehlt. Stelle die RICHTIGEN Fragen.

GRUNDREGELN — NIE BRECHEN:
1. NIEMALS Mengen erfinden oder schätzen. Wenn du eine Fläche nicht berechnen kannst: null.
2. NIEMALS Bodenfläche als Wandfläche nutzen. Wände = Umfang × Höhe. Immer.
3. IMMER Öffnungen bedenken. Fenster und Türen reduzieren Wandfläche. Wenn Maße fehlen: Standard annehmen (Fenster 1,20×1,00m, Tür 0,90×2,10m) und als Annahme markieren.
4. KONTEXT ist dein wichtigstes Werkzeug: "die Dusche" im Bad = bodengleiche Dusche, "komplett" = alle Positionen des Gewerks
5. STANDARD-ANNAHMEN (immer in annahmen[] protokollieren): Raumhöhe unbekannt → 2,60m, Fenstermaß unbekannt → 1,20×1,00m, Türmaß unbekannt → 0,90×2,10m, Verschnitt Fliesen/Boden → 10%

KORREKTUREN BEACHTEN — KRITISCH:
Wenn der Handwerker sich korrigiert ("nee, doch 6 Meter", "warte, 4,5 Meter stimmt", "ach quatsch, 5×4"),
IMMER den zuletzt genannten Wert nehmen. Der erste Wert war falsch.
Beispiel: "3×5 Meter, nee doch, 3×6 Meter" → laenge=3, breite=6 (NICHT 5!)

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

// ── Engines ──────────────────────────────────────────────────────────
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
    const effF = fenster.filter(Boolean).length>0 ? fenster.filter(Boolean) : (istGarage||istKeller||keinFenster) ? [] : [{breite:1.2,hoehe:1.0}]
    const effT = tueren.filter(Boolean).length>0 ? tueren.filter(Boolean) : (istGarage||keineTuer) ? [] : [{breite:0.9,hoehe:2.1}]
    const name = nameRaw.charAt(0).toUpperCase()+nameRaw.slice(1)
    let boden=null, wand=null, decke=null, umfang=null
    if (laenge && breite) {
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
    } else if (fa) {
      bodenNetto=fa
      positionen.push({beschreibung:`Bodenfliesen verlegen — ${name}`,menge:round2(fa*1.1),einheit:'m²'})
    }
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
    let fl=null, umfang=null
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

// ══════════════════════════════════════════════════════════════════════
// TESTFÄLLE — handgepickt, maximal alltagstauglich
// ══════════════════════════════════════════════════════════════════════
const round2h = n => Math.round(n * 100) / 100
function w(l,b,h,fAnz,tAnz) {
  return round2h((2*l+2*b)*h - fAnz*1.2*1.0 - tAnz*0.9*2.1)
}

const TESTFAELLE = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GRUPPE 1: KORREKTUREN — KI muss letzten Wert nehmen
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    gruppe: 'KORREKTUR Maler',
    id: 'K-M-01',
    gewerk: 'maler',
    transkript: 'Wohnzimmer komplett streichen, äh... 3 mal 5 Meter, nee warte, doch 5 mal 4 Meter. 2,60 hoch. 1 Fenster, 1 Tür.',
    // Korrektur: 5×4 ist die finale Maß (nicht 3×5)
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Wohnzimmer', menge: w(5,4,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Wohnzimmer', menge: 20, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Wohnzimmer', menge: 20, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Wohnzimmer', menge: round2h(2*5+2*4-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'KORREKTUR Maler',
    id: 'K-M-02',
    gewerk: 'maler',
    transkript: 'Schlafzimmer, 4 Meter breit und äh... also lang ist das... sag ich mal 3,5 Meter. Stimmt eigentlich nicht, eher 4 Meter. Also 4 mal 4. 2,60 hoch, 1 Fenster, 1 Tür.',
    // Korrektur: 4×4 (nicht 3,5 Meter)
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Schlafzimmer', menge: w(4,4,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Schlafzimmer', menge: 16, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Schlafzimmer', menge: 16, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Schlafzimmer', menge: round2h(2*4+2*4-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'KORREKTUR Maler',
    id: 'K-M-03',
    gewerk: 'maler',
    transkript: 'Küche komplett, 4 mal 3 Meter... warte, ich schau kurz nach... also 4,5 mal 3 Meter. 2,60 hoch. 1 Fenster, 2 Türen.',
    // Korrektur: 4,5×3 (nicht 4×3)
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Küche', menge: w(4.5,3,2.6,1,2), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Küche', menge: round2h(4.5*3), einheit: 'm²' },
      { beschreibung: 'Boden schützen — Küche', menge: round2h(4.5*3), einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Küche', menge: round2h(2*4.5+2*3-2*0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'KORREKTUR Maler',
    id: 'K-M-04',
    gewerk: 'maler',
    transkript: 'Wohnzimmer, äh, 7 mal 5 Meter... nee das ist zu groß, eher 6 mal 5. Also 6 mal 5 Meter. 2,80 hoch, 3 Fenster, 1 Tür.',
    // Korrektur: 6×5 (nicht 7×5)
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Wohnzimmer', menge: w(6,5,2.8,3,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Wohnzimmer', menge: 30, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Wohnzimmer', menge: 30, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Wohnzimmer', menge: round2h(2*6+2*5-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'KORREKTUR Maler Flur',
    id: 'K-M-05',
    gewerk: 'maler',
    transkript: 'Flur streichen, also der ist lang... 6 Meter, nee 5 Meter. Und breit, so 1,50 Meter. Höhe 2,60. Kein Fenster, 3 Türen.',
    // Korrektur: 5m (nicht 6m); kein Fenster
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Flur', menge: round2h((2*5+2*1.5)*2.6-3*0.9*2.1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Flur', menge: round2h(5*1.5), einheit: 'm²' },
      { beschreibung: 'Boden schützen — Flur', menge: round2h(5*1.5), einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Flur', menge: round2h(2*5+2*1.5-3*0.9), einheit: 'lfdm' },
    ]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GRUPPE 2: MULTI-RAUM MIT KORREKTUREN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    gruppe: 'MULTI-RAUM Korrektur Maler',
    id: 'K-MR-01',
    gewerk: 'maler',
    transkript: 'Wohnzimmer komplett, 5 mal 4 Meter, ach nee 6 mal 4, und das Schlafzimmer 4 mal 3,5 Meter. Alle 2,60 hoch.',
    // WZ: 6×4 (nicht 5×4), SZ: 4×3.5 — je 1 Fenster 1 Tür angenommen
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Wohnzimmer', menge: w(6,4,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Wohnzimmer', menge: 24, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Wohnzimmer', menge: 24, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Wohnzimmer', menge: round2h(2*6+2*4-0.9), einheit: 'lfdm' },
      { beschreibung: 'Wandflächen streichen — Schlafzimmer', menge: w(4,3.5,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Schlafzimmer', menge: 14, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Schlafzimmer', menge: 14, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Schlafzimmer', menge: round2h(2*4+2*3.5-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'MULTI-RAUM Korrektur Maler',
    id: 'K-MR-02',
    gewerk: 'maler',
    transkript: 'Also, Küche und Esszimmer. Küche 4×3m, Esszimmer ich sag mal 4×3,5, nee 5×4 Meter. 2,60 hoch.',
    // Küche: 4×3, Esszimmer: 5×4 (nicht 4×3,5)
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Küche', menge: w(4,3,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Küche', menge: 12, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Küche', menge: 12, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Küche', menge: round2h(2*4+2*3-0.9), einheit: 'lfdm' },
      { beschreibung: 'Wandflächen streichen — Esszimmer', menge: w(5,4,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Esszimmer', menge: 20, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Esszimmer', menge: 20, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Esszimmer', menge: round2h(2*5+2*4-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'MULTI-RAUM Korrektur Maler',
    id: 'K-MR-03',
    gewerk: 'maler',
    transkript: 'Drei Zimmer: Wohnzimmer 6×4m, Schlafzimmer 4,5×3,5m und Kinderzimmer, das ist 3 mal 3 Meter – nee 3,5 mal 3. Alle 2,60.',
    // WZ: 6×4, SZ: 4,5×3,5, KZ: 3,5×3
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Wohnzimmer', menge: w(6,4,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Wohnzimmer', menge: 24, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Wohnzimmer', menge: 24, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Wohnzimmer', menge: round2h(2*6+2*4-0.9), einheit: 'lfdm' },
      { beschreibung: 'Wandflächen streichen — Schlafzimmer', menge: w(4.5,3.5,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Schlafzimmer', menge: round2h(4.5*3.5), einheit: 'm²' },
      { beschreibung: 'Boden schützen — Schlafzimmer', menge: round2h(4.5*3.5), einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Schlafzimmer', menge: round2h(2*4.5+2*3.5-0.9), einheit: 'lfdm' },
      { beschreibung: 'Wandflächen streichen — Kinderzimmer', menge: w(3.5,3,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Kinderzimmer', menge: round2h(3.5*3), einheit: 'm²' },
      { beschreibung: 'Boden schützen — Kinderzimmer', menge: round2h(3.5*3), einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Kinderzimmer', menge: round2h(2*3.5+2*3-0.9), einheit: 'lfdm' },
    ]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GRUPPE 3: DIALEKT & ALLTAGSSPRACHE Maler
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    gruppe: 'DIALEKT Maler',
    id: 'D-M-01',
    gewerk: 'maler',
    transkript: 'Also, ähm, das Wohnzimmer soll komplett neu, Wände und Decke. Is so 5 mal 4 Meter, Höhe 2,60. Zwei Fenster, eine Tür.',
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Wohnzimmer', menge: w(5,4,2.6,2,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Wohnzimmer', menge: 20, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Wohnzimmer', menge: 20, einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Wohnzimmer', menge: round2h(2*5+2*4-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'DIALEKT Maler',
    id: 'D-M-02',
    gewerk: 'maler',
    transkript: 'Ja also, Schlafzimmer streichen, komplett. Des is 4,5 mal 3,5. Höhe normal, also 2,60. Ein Fenster, eine Tür.',
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Schlafzimmer', menge: w(4.5,3.5,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Schlafzimmer', menge: round2h(4.5*3.5), einheit: 'm²' },
      { beschreibung: 'Boden schützen — Schlafzimmer', menge: round2h(4.5*3.5), einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Schlafzimmer', menge: round2h(2*4.5+2*3.5-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'DIALEKT Maler Keller',
    id: 'D-M-03',
    gewerk: 'maler',
    transkript: 'Also der Hobbyraum im Keller, der muss neu gestrichen werden. 5 mal 4 Meter, Höhe 2,40. Kein Fenster da unten.',
    // Keller: kein Fenster, kein Sockelkleben (Keller-Ausnahme)
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Hobbyraum', menge: round2h((2*5+2*4)*2.4-1*0.9*2.1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Hobbyraum', menge: 20, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Hobbyraum', menge: 20, einheit: 'm²' },
    ]
  },
  {
    gruppe: 'DIALEKT Maler nur Decke',
    id: 'D-M-04',
    gewerk: 'maler',
    transkript: 'Wohnzimmer, wir machen nur die Decke. 6 mal 4 Meter.',
    positionen_erwartet: [
      { beschreibung: 'Deckenfläche streichen — Wohnzimmer', menge: 24, einheit: 'm²' },
      { beschreibung: 'Boden schützen — Wohnzimmer', menge: 24, einheit: 'm²' },
    ]
  },
  {
    gruppe: 'DIALEKT Maler nur Wände',
    id: 'D-M-05',
    gewerk: 'maler',
    transkript: 'Schlafzimmer, nur Wände bitte. 4 mal 3,5 Meter, 2,60 Meter. Ein Fenster, eine Tür.',
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Schlafzimmer', menge: w(4,3.5,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Boden schützen — Schlafzimmer', menge: round2h(4*3.5), einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Schlafzimmer', menge: round2h(2*4+2*3.5-0.9), einheit: 'lfdm' },
    ]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GRUPPE 4: FLIESEN KORREKTUREN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    gruppe: 'KORREKTUR Fliesen',
    id: 'K-F-01',
    gewerk: 'fliesen',
    transkript: 'Bad komplett fliesen, 2 mal 2,5 Meter – warte, 2,5 mal 2. Wände bis 2,20 Meter, Nassbereich.',
    // Korrektur: 2,5×2 (nicht 2×2,5)
    positionen_erwartet: [
      { beschreibung: 'Bodenfliesen verlegen — Bad', menge: round2h(2.5*2*1.1), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Boden — Bad', menge: round2h(2.5*2), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Bad', menge: round2h(2.5*2), einheit: 'm²' },
      { beschreibung: 'Wandfliesen verlegen — Bad', menge: round2h((2*2.5+2*2)*2.2*1.05), einheit: 'm²' },
      { beschreibung: 'Verfugung Wand — Bad', menge: round2h((2*2.5+2*2)*2.2), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Wand — Bad', menge: round2h((2*2.5+2*2)*2.2), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Bad', menge: round2h(2*2.5+2*2), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'KORREKTUR Fliesen',
    id: 'K-F-02',
    gewerk: 'fliesen',
    transkript: 'Küche, nur Boden. 3 mal 4 Meter... nee andersrum, 4 mal 3 Meter.',
    // Korrektur: 4×3 — nur Boden
    positionen_erwartet: [
      { beschreibung: 'Bodenfliesen verlegen — Küche', menge: round2h(4*3*1.1), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Küche', menge: round2h(4*3), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Küche', menge: round2h(2*4+2*3), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'KORREKTUR Fliesen',
    id: 'K-F-03',
    gewerk: 'fliesen',
    transkript: 'Flur fliesen, 5 mal 1,5 Meter, ach nee, 6 mal 1,5 Meter.',
    // Korrektur: 6×1,5
    positionen_erwartet: [
      { beschreibung: 'Bodenfliesen verlegen — Flur', menge: round2h(6*1.5*1.1), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Flur', menge: round2h(6*1.5), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Flur', menge: round2h(2*6+2*1.5), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'KORREKTUR Fliesen Bad+WC',
    id: 'K-F-04',
    gewerk: 'fliesen',
    transkript: 'Bad 2,5×2m Wände bis 2,2m, und WC 1,5×1,2m – nee WC ist 1,5×1 Meter. Alles Nassbereich.',
    // Bad: 2,5×2; WC: 1,5×1 (nicht 1,2)
    positionen_erwartet: [
      { beschreibung: 'Bodenfliesen verlegen — Bad', menge: round2h(2.5*2*1.1), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Boden — Bad', menge: round2h(2.5*2), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Bad', menge: round2h(2.5*2), einheit: 'm²' },
      { beschreibung: 'Wandfliesen verlegen — Bad', menge: round2h((2*2.5+2*2)*2.2*1.05), einheit: 'm²' },
      { beschreibung: 'Verfugung Wand — Bad', menge: round2h((2*2.5+2*2)*2.2), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Wand — Bad', menge: round2h((2*2.5+2*2)*2.2), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Bad', menge: round2h(2*2.5+2*2), einheit: 'lfdm' },
      { beschreibung: 'Bodenfliesen verlegen — WC', menge: round2h(1.5*1*1.1), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Boden — WC', menge: round2h(1.5*1), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — WC', menge: round2h(1.5*1), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — WC', menge: round2h(2*1.5+2*1), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'DIALEKT Fliesen',
    id: 'D-F-01',
    gewerk: 'fliesen',
    transkript: 'Also, das Badezimmer soll komplett neu gefliest werden. 3 mal 2,5 Meter. Wände bis 2,4 Meter. Nassbereich.',
    positionen_erwartet: [
      { beschreibung: 'Bodenfliesen verlegen — Bad', menge: round2h(3*2.5*1.1), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Boden — Bad', menge: round2h(3*2.5), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Bad', menge: round2h(3*2.5), einheit: 'm²' },
      { beschreibung: 'Wandfliesen verlegen — Bad', menge: round2h((2*3+2*2.5)*2.4*1.05), einheit: 'm²' },
      { beschreibung: 'Verfugung Wand — Bad', menge: round2h((2*3+2*2.5)*2.4), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Wand — Bad', menge: round2h((2*3+2*2.5)*2.4), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Bad', menge: round2h(2*3+2*2.5), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'DIALEKT Fliesen Multi',
    id: 'D-F-02',
    gewerk: 'fliesen',
    transkript: 'Bad EG 3×2,5m Nassbereich Wände 2,2m. Bad OG 2,5×2m Nassbereich Wände 2,2m.',
    positionen_erwartet: [
      { beschreibung: 'Bodenfliesen verlegen — Bad EG', menge: round2h(3*2.5*1.1), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Boden — Bad EG', menge: round2h(3*2.5), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Bad EG', menge: round2h(3*2.5), einheit: 'm²' },
      { beschreibung: 'Wandfliesen verlegen — Bad EG', menge: round2h((2*3+2*2.5)*2.2*1.05), einheit: 'm²' },
      { beschreibung: 'Verfugung Wand — Bad EG', menge: round2h((2*3+2*2.5)*2.2), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Wand — Bad EG', menge: round2h((2*3+2*2.5)*2.2), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Bad EG', menge: round2h(2*3+2*2.5), einheit: 'lfdm' },
      { beschreibung: 'Bodenfliesen verlegen — Bad OG', menge: round2h(2.5*2*1.1), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Boden — Bad OG', menge: round2h(2.5*2), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Bad OG', menge: round2h(2.5*2), einheit: 'm²' },
      { beschreibung: 'Wandfliesen verlegen — Bad OG', menge: round2h((2*2.5+2*2)*2.2*1.05), einheit: 'm²' },
      { beschreibung: 'Verfugung Wand — Bad OG', menge: round2h((2*2.5+2*2)*2.2), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Wand — Bad OG', menge: round2h((2*2.5+2*2)*2.2), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Bad OG', menge: round2h(2*2.5+2*2), einheit: 'lfdm' },
    ]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GRUPPE 5: BODEN KORREKTUREN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    gruppe: 'KORREKTUR Boden',
    id: 'K-B-01',
    gewerk: 'boden_parkett',
    transkript: 'Wohnzimmer Parkett verlegen, 5 mal 4 Meter – nee, 6 mal 4 Meter. Altbelag muss raus.',
    // Korrektur: 6×4 (nicht 5×4)
    positionen_erwartet: [
      { beschreibung: 'Parkett verlegen — Wohnzimmer', menge: round2h(6*4*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Wohnzimmer', menge: round2h(6*4), einheit: 'm²' },
    ]
  },
  {
    gruppe: 'KORREKTUR Boden',
    id: 'K-B-02',
    gewerk: 'boden_parkett',
    transkript: 'Schlafzimmer Laminat, 4 mal 3 Meter – doch 4,5 mal 3,5 Meter. Neue Sockelleisten.',
    // Korrektur: 4,5×3,5
    positionen_erwartet: [
      { beschreibung: 'Laminat verlegen — Schlafzimmer', menge: round2h(4.5*3.5*1.1), einheit: 'm²' },
      { beschreibung: 'Sockelleisten montieren — Schlafzimmer', menge: round2h(2*4.5+2*3.5), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'KORREKTUR Boden diagonal',
    id: 'K-B-03',
    gewerk: 'boden_parkett',
    transkript: 'Wohnzimmer Laminat diagonal, 5 mal 4 Meter – nee 6 mal 4 Meter.',
    // Korrektur: 6×4; diagonal = 15% Verschnitt
    positionen_erwartet: [
      { beschreibung: 'Laminat verlegen — Wohnzimmer', menge: round2h(6*4*1.15), einheit: 'm²' },
    ]
  },
  {
    gruppe: 'KORREKTUR Boden Multi',
    id: 'K-B-04',
    gewerk: 'boden_parkett',
    transkript: 'Wohnzimmer Parkett 6×4m, Schlafzimmer Parkett 4×3,5m – nee 4,5×3,5m. Altbelag raus, Sockelleisten.',
    // SZ: 4,5×3,5 (nicht 4×3,5)
    positionen_erwartet: [
      { beschreibung: 'Parkett verlegen — Wohnzimmer', menge: round2h(6*4*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Wohnzimmer', menge: 24, einheit: 'm²' },
      { beschreibung: 'Sockelleisten montieren — Wohnzimmer', menge: round2h(2*6+2*4), einheit: 'lfdm' },
      { beschreibung: 'Parkett verlegen — Schlafzimmer', menge: round2h(4.5*3.5*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Schlafzimmer', menge: round2h(4.5*3.5), einheit: 'm²' },
      { beschreibung: 'Sockelleisten montieren — Schlafzimmer', menge: round2h(2*4.5+2*3.5), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'DIALEKT Boden',
    id: 'D-B-01',
    gewerk: 'boden_parkett',
    transkript: 'Also, Wohnzimmer Parkett, 6 mal 4 Meter. Altbelag raus, Sockelleisten neu.',
    positionen_erwartet: [
      { beschreibung: 'Parkett verlegen — Wohnzimmer', menge: round2h(6*4*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Wohnzimmer', menge: 24, einheit: 'm²' },
      { beschreibung: 'Sockelleisten montieren — Wohnzimmer', menge: round2h(2*6+2*4), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'DIALEKT Boden',
    id: 'D-B-02',
    gewerk: 'boden_parkett',
    transkript: 'Küche, Vinyl drauf. 4 mal 3 Meter. Altbelag muss raus.',
    positionen_erwartet: [
      { beschreibung: 'Vinyl verlegen — Küche', menge: round2h(4*3*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Küche', menge: 12, einheit: 'm²' },
    ]
  },
  {
    gruppe: 'DIALEKT Boden Multi',
    id: 'D-B-03',
    gewerk: 'boden_parkett',
    transkript: 'Küche Vinyl 4×3m, Flur Vinyl 5×1,5m – Flur ist eigentlich 6×1,5m. Altbelag überall raus.',
    // Flur: 6×1,5 (nicht 5×1,5)
    positionen_erwartet: [
      { beschreibung: 'Vinyl verlegen — Küche', menge: round2h(4*3*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Küche', menge: 12, einheit: 'm²' },
      { beschreibung: 'Vinyl verlegen — Flur', menge: round2h(6*1.5*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Flur', menge: round2h(6*1.5), einheit: 'm²' },
    ]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GRUPPE 6: EXTREM-ALLTAG — Unterbrechungen + alles vermischt
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    gruppe: 'EXTREM Unterbrechungen',
    id: 'X-01',
    gewerk: 'maler',
    transkript: 'Wohnzimmer komplett neu streichen, 5 mal 4 Meter, Moment ich check das nochmal... 5 mal 4,5 Meter. Decke und Wände. 2,60 Meter hoch. Ein Fenster, eine Tür.',
    // Korrektur: 5×4,5 (nicht 5×4)
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Wohnzimmer', menge: w(5,4.5,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Wohnzimmer', menge: round2h(5*4.5), einheit: 'm²' },
      { beschreibung: 'Boden schützen — Wohnzimmer', menge: round2h(5*4.5), einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Wohnzimmer', menge: round2h(2*5+2*4.5-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'EXTREM Unterbrechungen',
    id: 'X-02',
    gewerk: 'fliesen',
    transkript: 'Bad komplett, 3 mal 2,5 Meter. Wände... bis 2 Meter, nee 2,2 Meter. Nassbereich.',
    // Wandhöhe: 2,2m (nicht 2m)
    positionen_erwartet: [
      { beschreibung: 'Bodenfliesen verlegen — Bad', menge: round2h(3*2.5*1.1), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Boden — Bad', menge: round2h(3*2.5), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Bad', menge: round2h(3*2.5), einheit: 'm²' },
      { beschreibung: 'Wandfliesen verlegen — Bad', menge: round2h((2*3+2*2.5)*2.2*1.05), einheit: 'm²' },
      { beschreibung: 'Verfugung Wand — Bad', menge: round2h((2*3+2*2.5)*2.2), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Wand — Bad', menge: round2h((2*3+2*2.5)*2.2), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Bad', menge: round2h(2*3+2*2.5), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'EXTREM Unterbrechungen',
    id: 'X-03',
    gewerk: 'boden_parkett',
    transkript: 'Drei Zimmer: Wohnzimmer 6×4m, Schlafzimmer 4,5×3,5m, Kinderzimmer 3,5×3m – Kinderzimmer ist 4×3m. Parkett überall, Altbelag raus.',
    // KZ: 4×3 (nicht 3,5×3)
    positionen_erwartet: [
      { beschreibung: 'Parkett verlegen — Wohnzimmer', menge: round2h(6*4*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Wohnzimmer', menge: 24, einheit: 'm²' },
      { beschreibung: 'Parkett verlegen — Schlafzimmer', menge: round2h(4.5*3.5*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Schlafzimmer', menge: round2h(4.5*3.5), einheit: 'm²' },
      { beschreibung: 'Parkett verlegen — Kinderzimmer', menge: round2h(4*3*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Kinderzimmer', menge: 12, einheit: 'm²' },
    ]
  },
  {
    gruppe: 'EXTREM Mehrfach-Korrektur',
    id: 'X-04',
    gewerk: 'maler',
    transkript: 'Kinderzimmer, 3 mal 3 Meter... nee, 4 mal 3. Nein warte, 4 mal 3,5. So in etwa. 2,60 hoch, 1 Fenster, 1 Tür.',
    // Dreifach-Korrektur: 4×3,5 ist der finale Wert
    positionen_erwartet: [
      { beschreibung: 'Wandflächen streichen — Kinderzimmer', menge: w(4,3.5,2.6,1,1), einheit: 'm²' },
      { beschreibung: 'Deckenfläche streichen — Kinderzimmer', menge: round2h(4*3.5), einheit: 'm²' },
      { beschreibung: 'Boden schützen — Kinderzimmer', menge: round2h(4*3.5), einheit: 'm²' },
      { beschreibung: 'Sockelleisten abkleben — Kinderzimmer', menge: round2h(2*4+2*3.5-0.9), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'EXTREM Mehrfach-Korrektur',
    id: 'X-05',
    gewerk: 'fliesen',
    transkript: 'Bad, 2,2 mal 1,8 Meter, ups, 2,5 mal 2 Meter. Nassbereich, Wände bis 2m.',
    // Korrektur: 2,5×2 (nicht 2,2×1,8)
    positionen_erwartet: [
      { beschreibung: 'Bodenfliesen verlegen — Bad', menge: round2h(2.5*2*1.1), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Boden — Bad', menge: round2h(2.5*2), einheit: 'm²' },
      { beschreibung: 'Verfugung Boden — Bad', menge: round2h(2.5*2), einheit: 'm²' },
      { beschreibung: 'Wandfliesen verlegen — Bad', menge: round2h((2*2.5+2*2)*2.0*1.05), einheit: 'm²' },
      { beschreibung: 'Verfugung Wand — Bad', menge: round2h((2*2.5+2*2)*2.0), einheit: 'm²' },
      { beschreibung: 'Verbundabdichtung Wand — Bad', menge: round2h((2*2.5+2*2)*2.0), einheit: 'm²' },
      { beschreibung: 'Fliesensockel / Abschlussleiste — Bad', menge: round2h(2*2.5+2*2), einheit: 'lfdm' },
    ]
  },
  {
    gruppe: 'EXTREM Mehrfach-Korrektur Boden',
    id: 'X-06',
    gewerk: 'boden_parkett',
    transkript: 'Wohnzimmer Parkett, 5 mal 4 Meter – halt, ist 5 mal 4,5 Meter. Warte noch mal, 6 mal 4,5 Meter. Altbelag raus, Sockelleisten.',
    // Dreifach-Korrektur: 6×4,5
    positionen_erwartet: [
      { beschreibung: 'Parkett verlegen — Wohnzimmer', menge: round2h(6*4.5*1.1), einheit: 'm²' },
      { beschreibung: 'Altbelag entfernen — Wohnzimmer', menge: round2h(6*4.5), einheit: 'm²' },
      { beschreibung: 'Sockelleisten montieren — Wohnzimmer', menge: round2h(2*6+2*4.5), einheit: 'lfdm' },
    ]
  },
]

// ── Test-Runner ───────────────────────────────────────────────────────
console.log(`\n🚀 E2E-Test v4 — ${TESTFAELLE.length} komplexe Alltagssprache-Testfälle`)
console.log('═══════════════════════════════════════════════════════════════')
console.log('NEU: Korrekturen, Dialekt, Multi-Raum, Selbst-Unterbrechungen')
console.log('Ablauf: Transkript → GPT-4o → ExtrahierteDaten → Engine → Vergleich\n')

let ok=0, teilweise=0, fail=0
const TOLERANZ=0.6
const ergebnisse = []
let aktuelleGruppe = ''

for (const tc of TESTFAELLE) {
  // Gruppenheader
  if (tc.gruppe !== aktuelleGruppe) {
    aktuelleGruppe = tc.gruppe
    console.log(`\n── ${aktuelleGruppe} ─────────────────────────────────`)
  }

  const kurzTranskript = tc.transkript.length > 70
    ? tc.transkript.slice(0,70)+'…'
    : tc.transkript
  process.stdout.write(`[${tc.id}] ${kurzTranskript}\n       → `)

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

    // Mehrraum-Reparatur
    if (gptJSON.raeume?.length > 1 && hatDuplikatMasse(gptJSON.raeume)) {
      const { repariert, wurdeRepariert } = repariereDuplikatMasse(gptJSON.raeume, tc.transkript)
      if (wurdeRepariert) { gptJSON = { ...gptJSON, raeume: repariert }; process.stdout.write('[🔧rep] ') }
    }
    if (gptJSON.bereiche?.length > 1 && hatDuplikatMasse(gptJSON.bereiche)) {
      const { repariert, wurdeRepariert } = repariereDuplikatMasse(gptJSON.bereiche, tc.transkript)
      if (wurdeRepariert) { gptJSON = { ...gptJSON, bereiche: repariert }; process.stdout.write('[🔧rep] ') }
    }

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
        details.push(`    ❌ FEHLT: ${erw.beschreibung} (erw. ${erw.menge} ${erw.einheit})`)
      } else if (Math.abs(gefunden.menge - erw.menge) > TOLERANZ) {
        details.push(`    ⚠️  MENGE: "${erw.beschreibung.split('—')[1]?.trim() ?? erw.beschreibung}" → GPT→Engine: ${gefunden.menge}, erwartet: ${erw.menge}`)
        treffer += 0.5
      } else {
        treffer++
      }
    }

    const quote = tc.positionen_erwartet.length > 0 ? treffer / tc.positionen_erwartet.length : 1
    const status = quote >= 0.9 ? '✅ PASS' : quote >= 0.6 ? '⚠️  TEILWEISE' : '❌ FAIL'
    console.log(status)
    if (details.length > 0) details.forEach(d => console.log(d))

    // Für Fehler: zeige was GPT extrahiert hat
    if (quote < 0.9) {
      const rList = gptJSON.raeume?.map(r=>`${r.name}(${r.laenge}×${r.breite}${r.hoehe?',h='+r.hoehe:''})`).join(', ') ?? ''
      const bList = gptJSON.bereiche?.map(b=>`${b.name}(${b.laenge}×${b.breite}${b.flieshoehe?',fw='+b.flieshoehe:''})`).join(', ') ?? ''
      if (rList) console.log(`    → GPT raeume:  [${rList}]`)
      if (bList) console.log(`    → GPT bereiche: [${bList}]`)
    }

    if (quote >= 0.9) ok++
    else if (quote >= 0.6) teilweise++
    else fail++

    ergebnisse.push({ id: tc.id, gruppe: tc.gruppe, status, quote: Math.round(quote*100) })

  } catch(e) {
    console.log(`❌ FEHLER: ${e.message}`)
    fail++
    ergebnisse.push({ id: tc.id, gruppe: tc.gruppe, status: '❌ FEHLER', quote: 0 })
  }

  await new Promise(r => setTimeout(r, 500))
}

// ── Zusammenfassung ────────────────────────────────────────────────
const total = TESTFAELLE.length
const score = Math.round(ok / total * 100)

console.log('\n═══════════════════════════════════════════════════════════════')
console.log('  ERGEBNIS E2E-TEST v4')
console.log('═══════════════════════════════════════════════════════════════')
console.log(`✅ PASS:      ${ok}/${total}`)
console.log(`⚠️  TEILWEISE: ${teilweise}/${total}`)
console.log(`❌ FAIL:      ${fail}/${total}`)
console.log(`\nScore: ${score}% (Ziel: 90%+)`)

// Gruppen-Auswertung
const gruppen = {}
for (const e of ergebnisse) {
  if (!gruppen[e.gruppe]) gruppen[e.gruppe] = { pass: 0, total: 0 }
  gruppen[e.gruppe].total++
  if (e.quote >= 90) gruppen[e.gruppe].pass++
}
console.log('\n── Auswertung nach Kategorie ──────────────────────────')
for (const [g, s] of Object.entries(gruppen)) {
  const pct = Math.round(s.pass/s.total*100)
  const icon = pct >= 100 ? '✅' : pct >= 60 ? '⚠️ ' : '❌'
  console.log(`  ${icon} ${g.padEnd(32)} ${s.pass}/${s.total} (${pct}%)`)
}

console.log('')
if (score >= 90) console.log('🎉 Alltagssprache & Korrekturen werden verstanden!')
else if (score >= 70) console.log('⚙️  Gut — Korrekturen noch verbesserungswürdig.')
else console.log('🔧 Prompt braucht Korrekturs-Training.')
