// ──────────────────────────────────────────────────────────────────
// SOFORTANGEBOT — Engine-Test (pure JS, kein API-Call nötig)
// Testet die deterministischen Berechnungsengines für:
//   Maler · Fliesen · Bodenleger
// ──────────────────────────────────────────────────────────────────

const round2 = n => Math.round(n * 100) / 100

// ── Maler-Engine (aus src/lib/mengen/gewerke/maler.ts) ───────────
function malerEngine(daten) {
  const positionen = []
  const warnungen = []

  for (const raum of (daten.raeume ?? [])) {
    const { name: nameRaw = 'Raum', laenge, breite, hoehe,
      fenster = [], tueren = [], arbeiten = [], sockelleisten: sockel = false } = raum

    let bodenflaecheM2 = null, wandflaecheNettoM2 = null, deckenflaecheM2 = null, umfangM = null
    const arbeitenStr = arbeiten.join(' ').toLowerCase()
    const transkriptLower = (daten.transkript ?? '').toLowerCase()
    const keinFenster = transkriptLower.includes('kein fenster') || transkriptLower.includes('keine fenster') || transkriptLower.includes('ohne fenster')
    const keineTuer = transkriptLower.includes('keine tür') || transkriptLower.includes('ohne tür')
    const istGarageRaum = nameRaw.toLowerCase().includes('garage')
    const istKellerRaum = nameRaw.toLowerCase().includes('keller')
    const fensterGefiltert = (fenster).filter(Boolean)
    const tuerenGefiltert = (tueren).filter(Boolean)
    const effFenster = fensterGefiltert.length > 0 ? fensterGefiltert : (istGarageRaum || istKellerRaum || keinFenster) ? [] : [{ breite: 1.2, hoehe: 1.0, annahme: true }]
    const effTueren = tuerenGefiltert.length > 0 ? tuerenGefiltert : (istGarageRaum || keineTuer) ? [] : [{ breite: 0.9, hoehe: 2.1, annahme: true }]
    const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1)

    if (laenge && breite) {
      bodenflaecheM2 = round2(laenge * breite)
      umfangM = round2(2 * laenge + 2 * breite)
      deckenflaecheM2 = bodenflaecheM2
      if (hoehe) {
        const wandBrutto = round2(umfangM * hoehe)
        const fensterFlaeche = effFenster.reduce((s, f) => s + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0)
        const tuerFlaeche = effTueren.reduce((s, t) => s + (t.anzahl ?? 1) * (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0)
        wandflaecheNettoM2 = round2(wandBrutto - fensterFlaeche - tuerFlaeche)
      }
    }

    const leerOderKomplett = arbeiten.length === 0 || arbeitenStr.includes('komplett') || arbeitenStr.includes('alles')
    const hatStreichen = leerOderKomplett || arbeitenStr.includes('streichen') || arbeitenStr.includes('anstrich')
    const nurWaende = arbeitenStr.includes('nur wand') || transkriptLower.includes('nur wänd') || transkriptLower.includes('nur die wand') || transkriptLower.includes('nur wände')
    const nurDecke = arbeitenStr.includes('nur decke') || transkriptLower.includes('nur decke') || transkriptLower.includes('nur die decke')
    const hatBodenStreichen = arbeitenStr.includes('boden') || transkriptLower.includes('boden streich')
    const anWaenden = !nurDecke && (hatStreichen || arbeitenStr.includes('wand') || arbeitenStr.includes('tapez'))
    const anDecke = !nurWaende && !hatBodenStreichen && (hatStreichen || arbeitenStr.includes('decke'))
    const bodenStreichen = hatBodenStreichen && bodenflaecheM2 !== null
    const bodenSchutz = !bodenStreichen && (hatStreichen || anDecke || anWaenden)
    const hatSockel = anWaenden && wandflaecheNettoM2 !== null && !istKellerRaum && (hatStreichen || sockel || arbeitenStr.includes('sockel'))

    if (anWaenden && wandflaecheNettoM2 !== null)
      positionen.push({ beschreibung: `Wandflächen streichen — ${name}`, menge: wandflaecheNettoM2, einheit: 'm²' })
    if (anDecke && deckenflaecheM2 !== null)
      positionen.push({ beschreibung: `Deckenfläche streichen — ${name}`, menge: deckenflaecheM2, einheit: 'm²' })
    if (bodenStreichen && bodenflaecheM2 !== null)
      positionen.push({ beschreibung: `Boden streichen — ${name}`, menge: bodenflaecheM2, einheit: 'm²' })
    if (bodenSchutz && bodenflaecheM2 !== null)
      positionen.push({ beschreibung: `Boden schützen — ${name}`, menge: bodenflaecheM2, einheit: 'm²' })
    if (hatSockel && umfangM !== null) {
      const tuerBreiten = effTueren.reduce((s, t) => s + (t.breite ?? 0.9), 0)
      positionen.push({ beschreibung: `Sockelleisten abkleben — ${name}`, menge: round2(umfangM - tuerBreiten), einheit: 'lfdm' })
    }
  }
  return { positionen, warnungen }
}

// ── Fliesen-Engine ────────────────────────────────────────────────
function fliesenEngine(daten) {
  const positionen = []
  for (const bereich of (daten.bereiche ?? [])) {
    const { name = 'Bereich', laenge, breite, flieshoehe, flaeche: flaeche_angegeben, nassbereich = false } = bereich
    const umfang = laenge && breite ? round2(2 * laenge + 2 * breite) : null
    let bodenNetto = null
    if (laenge && breite) {
      bodenNetto = round2(laenge * breite)
      positionen.push({ beschreibung: `Bodenfliesen verlegen — ${name}`, menge: round2(bodenNetto * 1.1), einheit: 'm²' })
      if (nassbereich) positionen.push({ beschreibung: `Verbundabdichtung Boden — ${name}`, menge: bodenNetto, einheit: 'm²' })
    } else if (flaeche_angegeben) {
      bodenNetto = flaeche_angegeben
      positionen.push({ beschreibung: `Bodenfliesen verlegen — ${name}`, menge: round2(flaeche_angegeben * 1.1), einheit: 'm²' })
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
  return { positionen }
}

// ── Boden-Engine ──────────────────────────────────────────────────
function bodenEngine(daten) {
  const positionen = []
  for (const raum of (daten.raeume ?? [])) {
    const { name = 'Raum', laenge, breite, flaeche: f, belag, verlegerichtung,
      altbelag_entfernen = false, sockelleisten = false, ausgleich = false } = raum
    let flaeche = null, umfang = null
    if (laenge && breite) { flaeche = round2(laenge * breite); umfang = round2(2 * laenge + 2 * breite) }
    else if (f) { flaeche = f }
    if (!flaeche) continue
    const verschnitt = verlegerichtung === 'diagonal' ? 0.15 : 0.10
    const label = belag ?? 'Bodenbelag'
    positionen.push({ beschreibung: `${label} verlegen — ${name}`, menge: round2(flaeche * (1 + verschnitt)), einheit: 'm²' })
    if (altbelag_entfernen) positionen.push({ beschreibung: `Altbelag entfernen — ${name}`, menge: flaeche, einheit: 'm²' })
    if (sockelleisten && umfang) positionen.push({ beschreibung: `Sockelleisten montieren — ${name}`, menge: umfang, einheit: 'lfdm' })
    if (ausgleich) positionen.push({ beschreibung: `Untergrundausgleich — ${name}`, menge: flaeche, einheit: 'm²' })
  }
  return { positionen }
}

// ──────────────────────────────────────────────────────────────────
// TEST-HELPER
// ──────────────────────────────────────────────────────────────────
let bestanden = 0, fehlgeschlagen = 0

function assert(label, actual, expected, toleranz = 0.05) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (ok) {
    console.log(`  ✅  ${label}: ${actual} ${expected !== actual ? `(erw. ${expected})` : ''}`)
    bestanden++
  } else {
    console.log(`  ❌  ${label}: ${actual} — ERWARTET ${expected}`)
    fehlgeschlagen++
  }
}

function check(label, positionen, suchbegriff, expectedMenge) {
  const pos = positionen.find(p => p.beschreibung.toLowerCase().includes(suchbegriff.toLowerCase()))
  if (!pos) {
    console.log(`  ❌  "${suchbegriff}" fehlt komplett`)
    fehlgeschlagen++; return
  }
  assert(`${label} [${pos.beschreibung}]`, pos.menge, expectedMenge)
}

function fehlt(label, positionen, suchbegriff) {
  const pos = positionen.find(p => p.beschreibung.toLowerCase().includes(suchbegriff.toLowerCase()))
  if (pos) {
    console.log(`  ❌  "${suchbegriff}" sollte NICHT da sein, ist aber: ${pos.menge} ${pos.einheit}`)
    fehlgeschlagen++
  } else {
    console.log(`  ✅  "${suchbegriff}" korrekt NICHT vorhanden`)
    bestanden++
  }
}

// ══════════════════════════════════════════════════════════════════
// MALER TESTS
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════')
console.log('  MALER')
console.log('══════════════════════════════════════════')

// ─── M1: Wohnzimmer komplett, Standardfenster ────────────────────
// Raum: 5 × 4 × 2,60 m | 2 Fenster (Standard 1,2×1,0) | 1 Tür (Standard 0,9×2,1)
// Umfang: 18 m
// Wand brutto: 18 × 2,60 = 46,80 m²
// – 2 Fenster: 2 × 1,20 × 1,00 = 2,40 m²
// – 1 Tür: 0,90 × 2,10 = 1,89 m²
// Wand netto: 46,80 − 2,40 − 1,89 = 42,51 m²
// Decke: 5 × 4 = 20 m²
// Boden schützen: 20 m²
// Sockelleisten: 18 − 0,90 = 17,10 lfdm
{
  console.log('\n[M1] Wohnzimmer komplett — 5×4×2,60m, 2 Fenster, 1 Tür (alle Standard)')
  const { positionen } = malerEngine({
    transkript: 'Wohnzimmer komplett streichen, 5 Meter lang, 4 Meter breit, 2,60 Meter hoch, 2 Fenster, 1 Tür',
    raeume: [{
      name: 'Wohnzimmer', laenge: 5, breite: 4, hoehe: 2.60,
      fenster: [{ breite: 1.2, hoehe: 1.0, anzahl: 2 }],
      tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
      arbeiten: ['waende_streichen', 'decke_streichen'],
    }]
  })
  check('M1 Wand', positionen, 'wandflächen', 42.51)
  check('M1 Decke', positionen, 'deckenfläche', 20)
  check('M1 Boden schützen', positionen, 'boden schütz', 20)
  check('M1 Sockel', positionen, 'sockelleisten', 17.1)
}

// ─── M2: Schlafzimmer NUR WÄNDE — bekannte Fenstermaße ───────────
// Raum: 4,5 × 3,5 × 2,40 m | 1 Fenster 1,50×1,20 m | 1 Tür Standard
// Umfang: 16 m
// Wand brutto: 16 × 2,40 = 38,40 m²
// – Fenster: 1,50 × 1,20 = 1,80 m²
// – Tür: 0,90 × 2,10 = 1,89 m²
// Wand netto: 38,40 − 1,80 − 1,89 = 34,71 m²
// Boden schützen: 4,5 × 3,5 = 15,75 m²
// Sockelleisten: 16 − 0,90 = 15,10 lfdm
// KEIN Decke!
{
  console.log('\n[M2] Schlafzimmer — nur Wände, 4,5×3,5×2,40m, Fenster 1,5×1,2, Standardtür')
  const { positionen } = malerEngine({
    transkript: 'Schlafzimmer nur Wände streichen, 4,5 Meter lang, 3,5 Meter breit, 2,40 Meter hoch, 1 Fenster 1,5 mal 1,2 Meter, 1 Tür',
    raeume: [{
      name: 'Schlafzimmer', laenge: 4.5, breite: 3.5, hoehe: 2.40,
      fenster: [{ breite: 1.5, hoehe: 1.2, anzahl: 1 }],
      tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
      arbeiten: ['waende_streichen'],
    }]
  })
  check('M2 Wand', positionen, 'wandflächen', 34.71)
  fehlt('M2 Decke', positionen, 'deckenfläche')
  check('M2 Boden schützen', positionen, 'boden schütz', 15.75)
  check('M2 Sockel', positionen, 'sockelleisten', 15.10)
}

// ─── M3: Küche mit Dachschräge / kein Fenster-Standard ──────────
// Raum: 3,5 × 3,0 × 2,60 m | 0 Fenster (explizit: kein Fenster) | 1 Tür
// Umfang: 13 m
// Wand brutto: 13 × 2,60 = 33,80 m²
// – kein Fenster (0 m²)
// – Tür: 0,90 × 2,10 = 1,89 m²
// Wand netto: 33,80 − 1,89 = 31,91 m²
// Decke: 3,5 × 3,0 = 10,50 m²
// Boden schützen: 10,50 m²
// Sockelleisten: 13 − 0,90 = 12,10 lfdm
{
  console.log('\n[M3] Küche ohne Fenster — 3,5×3,0×2,60m, kein Fenster, 1 Tür')
  const { positionen } = malerEngine({
    transkript: 'Küche komplett streichen, 3,5 mal 3 Meter, 2,60 Meter hoch, kein Fenster, 1 Tür',
    raeume: [{
      name: 'Küche', laenge: 3.5, breite: 3.0, hoehe: 2.60,
      fenster: [],
      tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
      arbeiten: ['waende_streichen', 'decke_streichen'],
    }]
  })
  check('M3 Wand', positionen, 'wandflächen', 31.91)
  check('M3 Decke', positionen, 'deckenfläche', 10.5)
  check('M3 Boden schützen', positionen, 'boden schütz', 10.5)
  check('M3 Sockel', positionen, 'sockelleisten', 12.10)
}

// ─── M4: Multi-Raum — Wohnzimmer + Kinderzimmer ──────────────────
// WZ: 6 × 4 × 2,60m | 2 Fenster Standard | 1 Tür
//   Umfang: 20m | Wand brutto: 52 m² − 2,40 − 1,89 = 47,71 m² | Decke: 24 m²
// KiZi: 3,5 × 3 × 2,60m | 1 Fenster Standard | 1 Tür
//   Umfang: 13m | Wand brutto: 33,80 m² − 1,20 − 1,89 = 30,71 m² | Decke: 10,5 m²
{
  console.log('\n[M4] Multi-Raum: Wohnzimmer (6×4×2,60) + Kinderzimmer (3,5×3×2,60)')
  const { positionen } = malerEngine({
    transkript: 'Wohnzimmer 6 mal 4 Meter komplett streichen, 2,60 Meter hoch, 2 Fenster, 1 Tür. Dann Kinderzimmer 3,5 mal 3 Meter, gleiche Höhe, 1 Fenster, 1 Tür',
    raeume: [
      { name: 'Wohnzimmer', laenge: 6, breite: 4, hoehe: 2.60,
        fenster: [{ breite: 1.2, hoehe: 1.0, anzahl: 2 }], tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
        arbeiten: ['waende_streichen', 'decke_streichen'] },
      { name: 'Kinderzimmer', laenge: 3.5, breite: 3, hoehe: 2.60,
        fenster: [{ breite: 1.2, hoehe: 1.0, anzahl: 1 }], tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
        arbeiten: ['waende_streichen', 'decke_streichen'] },
    ]
  })
  check('M4 WZ Wand', positionen, 'wohnzimmer', 47.71)
  check('M4 WZ Decke', positionen, 'deckenfläche streichen — wohnzimmer', 24)
  check('M4 KiZi Wand', positionen, 'kinderzimmer', 30.71)
  check('M4 KiZi Decke', positionen, 'deckenfläche streichen — kinderzimmer', 10.5)
}

// ══════════════════════════════════════════════════════════════════
// FLIESEN TESTS
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════')
console.log('  FLIESEN')
console.log('══════════════════════════════════════════')

// ─── F1: Bad komplett — Boden + Wände, Nassbereich ───────────────
// Boden: 2,5 × 2 = 5 m² → verlegen: 5,50 m² (+10%) | Verfugung: 5 m² | Abdichtung: 5 m²
// Wände: Umfang = 9 m | Wandfliesen: 9 × 2,20 = 19,80 m² → verlegen: 20,79 m² (+5%) | Verfugung: 19,80 m² | Abdichtung: 19,80 m²
// Sockel/Abschlussleiste: 9 lfdm
{
  console.log('\n[F1] Bad komplett — 2,5×2m, Wandfliesen bis 2,20m, Nassbereich')
  const { positionen } = fliesenEngine({
    transkript: 'Bad komplett fliesen, 2,5 mal 2 Meter, Wandfliesen bis 2,20 Meter Höhe, Nassbereich',
    bereiche: [{ name: 'Bad', laenge: 2.5, breite: 2, flieshoehe: 2.20, nassbereich: true }],
    altbelag: [],
  })
  check('F1 Boden verlegen', positionen, 'bodenfliesen', 5.5)
  check('F1 Boden Verfugung', positionen, 'verfugung boden', 5)
  check('F1 Boden Abdichtung', positionen, 'verbundabdichtung boden', 5)
  check('F1 Wand verlegen', positionen, 'wandfliesen', 20.79)
  check('F1 Wand Verfugung', positionen, 'verfugung wand', 19.8)
  check('F1 Wand Abdichtung', positionen, 'verbundabdichtung wand', 19.8)
  check('F1 Sockel', positionen, 'fliesensockel', 9)
}

// ─── F2: Küchenboden — kein Nassbereich, Altfliesen ──────────────
// Boden: 4 × 3 = 12 m² → verlegen: 13,20 m² | Verfugung: 12 m²
// Altfliesen abstemmen: 12 m² | Entsorgung: 12 m²
// Sockel: (2×4 + 2×3) = 14 lfdm
{
  console.log('\n[F2] Küchenboden — 4×3m, Altfliesen abstemmen, kein Nassbereich')
  const { positionen } = fliesenEngine({
    transkript: 'Küchenboden fliesen 4 mal 3 Meter, Altfliesen müssen raus',
    bereiche: [{ name: 'Küche', laenge: 4, breite: 3, nassbereich: false }],
    altbelag: [{ bereich: 'Küche', flaeche: 12 }],
  })
  check('F2 Boden verlegen', positionen, 'bodenfliesen', 13.2)
  check('F2 Verfugung', positionen, 'verfugung boden', 12)
  fehlt('F2 Keine Wandfliesen', positionen, 'wandfliesen')
  fehlt('F2 Keine Abdichtung', positionen, 'verbundabdichtung')
  check('F2 Altfliesen', positionen, 'altfliesen abstemmen', 12)
  check('F2 Entsorgung', positionen, 'entsorgung', 12)
  check('F2 Sockel', positionen, 'fliesensockel', 14)
}

// ─── F3: Duschbereich — nur Boden, kleiner Nassbereich ───────────
// Boden: 1,0 × 1,0 = 1 m² → verlegen: 1,10 m² | Verfugung: 1 m² | Abdichtung: 1 m²
// Sockel: 4 lfdm
{
  console.log('\n[F3] Duschbereich — 1×1m Nassbereich, nur Boden')
  const { positionen } = fliesenEngine({
    transkript: 'Duschbereich fliesen, 1 mal 1 Meter, Nassbereich',
    bereiche: [{ name: 'Dusche', laenge: 1, breite: 1, nassbereich: true }],
    altbelag: [],
  })
  check('F3 Boden verlegen', positionen, 'bodenfliesen', 1.1)
  check('F3 Abdichtung', positionen, 'verbundabdichtung boden', 1)
  check('F3 Verfugung', positionen, 'verfugung boden', 1)
  check('F3 Sockel', positionen, 'fliesensockel', 4)
}

// ══════════════════════════════════════════════════════════════════
// BODENLEGER TESTS
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════')
console.log('  BODENLEGER')
console.log('══════════════════════════════════════════')

// ─── B1: Parkett, Altbelag, Sockelleisten ─────────────────────────
// Fläche: 6 × 4,5 = 27 m² → verlegen: 27 × 1,10 = 29,70 m²
// Altbelag: 27 m²  |  Sockelleisten: 2×(6+4,5) = 21 lfdm
{
  console.log('\n[B1] Parkett Wohnzimmer — 6×4,5m, Altbelag entfernen, Sockelleisten')
  const { positionen } = bodenEngine({
    transkript: 'Wohnzimmer Parkett verlegen, 6 mal 4,5 Meter, Altbelag muss raus, neue Sockelleisten',
    raeume: [{ name: 'Wohnzimmer', laenge: 6, breite: 4.5, belag: 'Parkett',
      altbelag_entfernen: true, sockelleisten: true }],
  })
  check('B1 Parkett verlegen', positionen, 'parkett verlegen', 29.7)
  check('B1 Altbelag', positionen, 'altbelag entfernen', 27)
  check('B1 Sockel', positionen, 'sockelleisten', 21)
}

// ─── B2: Laminat diagonal — Verschnitt 15% ────────────────────────
// Fläche: 5 × 1,5 = 7,5 m² → diagonal: 7,5 × 1,15 = 8,625 m²
{
  console.log('\n[B2] Laminat Flur — 5×1,5m, Diagonalverlegung (+15% Verschnitt)')
  const { positionen } = bodenEngine({
    transkript: 'Flur Laminat diagonal verlegen, 5 mal 1,5 Meter',
    raeume: [{ name: 'Flur', laenge: 5, breite: 1.5, belag: 'Laminat',
      verlegerichtung: 'diagonal', altbelag_entfernen: false, sockelleisten: false }],
  })
  check('B2 Laminat diagonal', positionen, 'laminat verlegen', 8.625)
}

// ─── B3: Vinyl mehrere Räume ──────────────────────────────────────
// WZ: 5×4 = 20 m² → 22 m² | Altbelag: nein
// SZ: 4×3,5 = 14 m² → 15,40 m² | Altbelag: 14 m²
{
  console.log('\n[B3] Vinyl — Wohnzimmer (5×4) + Schlafzimmer (4×3,5, Altbelag raus)')
  const { positionen } = bodenEngine({
    transkript: 'Wohnzimmer 5 mal 4 Meter Vinylboden verlegen. Schlafzimmer 4 mal 3,5 Meter Vinyl, Altbelag raus',
    raeume: [
      { name: 'Wohnzimmer', laenge: 5, breite: 4, belag: 'Vinyl', altbelag_entfernen: false, sockelleisten: false },
      { name: 'Schlafzimmer', laenge: 4, breite: 3.5, belag: 'Vinyl', altbelag_entfernen: true, sockelleisten: false },
    ],
  })
  check('B3 WZ Vinyl', positionen, 'vinyl verlegen — wohnzimmer', 22)
  check('B3 SZ Vinyl', positionen, 'vinyl verlegen — schlafzimmer', 15.4)
  check('B3 SZ Altbelag', positionen, 'altbelag entfernen — schlafzimmer', 14)
  fehlt('B3 WZ kein Altbelag', positionen, 'altbelag entfernen — wohnzimmer')
}

// ─── B4: Untergrundausgleich ──────────────────────────────────────
// Fläche: 3 × 4 = 12 m²
{
  console.log('\n[B4] Laminat mit Untergrundausgleich — 3×4m')
  const { positionen } = bodenEngine({
    transkript: 'Gästezimmer Laminat verlegen 3 mal 4 Meter, Untergrund muss ausgeglichen werden',
    raeume: [{ name: 'Gästezimmer', laenge: 3, breite: 4, belag: 'Laminat',
      altbelag_entfernen: false, sockelleisten: false, ausgleich: true }],
  })
  check('B4 Laminat', positionen, 'laminat verlegen', 13.2)
  check('B4 Ausgleich', positionen, 'untergrundausgleich', 12)
}

// ══════════════════════════════════════════════════════════════════
// ERGEBNIS
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════')
console.log(`  ERGEBNIS: ${bestanden} ✅  bestanden   ${fehlgeschlagen} ❌  fehlgeschlagen`)
console.log(`  (${bestanden + fehlgeschlagen} Assertions gesamt)`)
console.log('══════════════════════════════════════════\n')

process.exit(fehlgeschlagen > 0 ? 1 : 0)
