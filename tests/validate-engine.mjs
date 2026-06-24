// Validiert alle 300 Testfälle aus testfaelle.json gegen die Engine
import { readFileSync } from 'fs'

const round2 = n => Math.round(n * 100) / 100
const TOLERANZ = 0.12 // max. Abweichung in m² / lfdm

// ── Engines (inline, identisch zu engine-test.mjs) ────────────────
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

// ── Validierung ───────────────────────────────────────────────────
const { testfaelle } = JSON.parse(readFileSync('/tmp/testfaelle.json','utf8'))

let ok=0, fail=0, fehlerLog=[]

for (const tc of testfaelle) { if (tc.engine_test_skip) continue;
  const positionen = runEngine(tc.gewerk, tc.extraktion, tc.transkript)

  for (const erw of tc.positionen_erwartet) {
    const gefunden = positionen.find(p => p.beschreibung.toLowerCase() === erw.beschreibung.toLowerCase())
    if (!gefunden) {
      fehlerLog.push(`[${tc.id}] FEHLT: "${erw.beschreibung}" (erw. ${erw.menge})`)
      fail++
    } else if (Math.abs(gefunden.menge - erw.menge) > TOLERANZ) {
      fehlerLog.push(`[${tc.id}] MENGE FALSCH: "${erw.beschreibung}" → ${gefunden.menge} statt ${erw.menge}`)
      fail++
    } else {
      ok++
    }
  }
}

console.log(`\n✅ ${ok} Assertions bestanden`)
console.log(`❌ ${fail} Assertions fehlgeschlagen`)
console.log(`📊 ${testfaelle.length} Testfälle, ${ok+fail} Assertions gesamt`)
if (fehlerLog.length > 0) {
  console.log('\nFehler:')
  fehlerLog.forEach(e => console.log(' ', e))
}
process.exit(fail > 0 ? 1 : 0)
