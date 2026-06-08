// Preisvorlagen je Gewerk — für die manuelle Eingabe im Onboarding
// Der Handwerker füllt nur die Felder seines Gewerks aus

export interface PreisVorlage {
  category: string
  title: string
  unit: string
  hint: string       // Placeholder / Orientierungswert
  defaultPrice: number
}

// Immer anzeigen — gewerkunabhängig
export const ALLGEMEINE_PREISE: PreisVorlage[] = [
  {
    category: 'Fahrtkosten',
    title: 'Anfahrt pro km (einfache Strecke)',
    unit: 'km',
    hint: 'üblich: 0,40–0,55 €',
    defaultPrice: 0.45,
  },
  {
    category: 'Arbeitszeit',
    title: 'Stundensatz Fachkraft',
    unit: 'Std',
    hint: 'üblich: 55–85 €/h',
    defaultPrice: 65,
  },
  {
    category: 'Arbeitszeit',
    title: 'Stundensatz Helfer',
    unit: 'Std',
    hint: 'üblich: 35–50 €/h',
    defaultPrice: 42,
  },
]

// Je Gewerk
export const GEWERK_PREISE: Record<string, PreisVorlage[]> = {
  malerarbeiten: [
    { category: 'Malerarbeiten', title: 'Wände streichen, 2× Anstrich', unit: 'm²', hint: '10–18 €', defaultPrice: 13 },
    { category: 'Malerarbeiten', title: 'Decke streichen, 2× Anstrich', unit: 'm²', hint: '12–20 €', defaultPrice: 15 },
    { category: 'Malerarbeiten', title: 'Tapete entfernen (einfach)', unit: 'm²', hint: '3–6 €', defaultPrice: 4 },
    { category: 'Malerarbeiten', title: 'Tapete entfernen (hartnäckig)', unit: 'm²', hint: '6–10 €', defaultPrice: 7 },
    { category: 'Malerarbeiten', title: 'Spachteln Q2 (normal)', unit: 'm²', hint: '8–14 €', defaultPrice: 10 },
    { category: 'Malerarbeiten', title: 'Spachteln Q3 (glatt)', unit: 'm²', hint: '14–22 €', defaultPrice: 17 },
    { category: 'Malerarbeiten', title: 'Grundierung auftragen', unit: 'm²', hint: '2–4 €', defaultPrice: 3 },
    { category: 'Malerarbeiten', title: 'Heizkörper lackieren', unit: 'Stk', hint: '30–60 €', defaultPrice: 45 },
    { category: 'Malerarbeiten', title: 'Fenster streichen (innen+außen)', unit: 'Stk', hint: '40–80 €', defaultPrice: 55 },
  ],

  bodenbeläge: [
    { category: 'Bodenbeläge', title: 'Vinyl/LVT verlegen (schwimmend)', unit: 'm²', hint: '12–20 €', defaultPrice: 15 },
    { category: 'Bodenbeläge', title: 'Laminat verlegen', unit: 'm²', hint: '10–18 €', defaultPrice: 13 },
    { category: 'Bodenbeläge', title: 'Parkett verlegen (schwimmend)', unit: 'm²', hint: '18–28 €', defaultPrice: 22 },
    { category: 'Bodenbeläge', title: 'Parkett vollflächig kleben', unit: 'm²', hint: '25–40 €', defaultPrice: 32 },
    { category: 'Bodenbeläge', title: 'Parkett schleifen + versiegeln', unit: 'm²', hint: '18–30 €', defaultPrice: 24 },
    { category: 'Bodenbeläge', title: 'Altbelag (Teppich) entfernen', unit: 'm²', hint: '4–8 €', defaultPrice: 5 },
    { category: 'Bodenbeläge', title: 'Altbelag (Laminat/Vinyl) entfernen', unit: 'm²', hint: '5–10 €', defaultPrice: 7 },
    { category: 'Bodenbeläge', title: 'Unterbodenausgleich (~5mm)', unit: 'm²', hint: '8–15 €', defaultPrice: 11 },
    { category: 'Bodenbeläge', title: 'Türunterschneidung', unit: 'Stk', hint: '20–35 €', defaultPrice: 28 },
    { category: 'Bodenbeläge', title: 'Sockelleisten montieren', unit: 'lm', hint: '5–10 €', defaultPrice: 7 },
  ],

  fliesenleger: [
    { category: 'Fliesenarbeiten', title: 'Fliesen legen Boden (Standard)', unit: 'm²', hint: '35–55 €', defaultPrice: 42 },
    { category: 'Fliesenarbeiten', title: 'Fliesen legen Wand (Standard)', unit: 'm²', hint: '45–65 €', defaultPrice: 52 },
    { category: 'Fliesenarbeiten', title: 'Großformat >60×60cm Aufpreis', unit: 'm²', hint: '10–20 €', defaultPrice: 15 },
    { category: 'Fliesenarbeiten', title: 'Altfliesen entfernen (Boden)', unit: 'm²', hint: '10–20 €', defaultPrice: 14 },
    { category: 'Fliesenarbeiten', title: 'Altfliesen entfernen (Wand)', unit: 'm²', hint: '12–22 €', defaultPrice: 16 },
    { category: 'Fliesenarbeiten', title: 'Abdichtung Duschbereich', unit: 'm²', hint: '20–35 €', defaultPrice: 28 },
    { category: 'Fliesenarbeiten', title: 'Bodengleiche Dusche komplett', unit: 'Pausch', hint: '400–800 €', defaultPrice: 550 },
    { category: 'Fliesenarbeiten', title: 'Untergrundvorbereitung/Ausgleich', unit: 'm²', hint: '8–15 €', defaultPrice: 11 },
  ],

  trockenbau: [
    { category: 'Trockenbau', title: 'Trennwand einfach (CW75)', unit: 'm²', hint: '45–65 €', defaultPrice: 55 },
    { category: 'Trockenbau', title: 'Trennwand Schallschutz (CW100)', unit: 'm²', hint: '65–95 €', defaultPrice: 78 },
    { category: 'Trockenbau', title: 'Abgehängte Decke', unit: 'm²', hint: '40–70 €', defaultPrice: 55 },
    { category: 'Trockenbau', title: 'Vorsatzschale an Wand', unit: 'm²', hint: '30–55 €', defaultPrice: 42 },
    { category: 'Trockenbau', title: 'Spachteln Q2 nach Trockenbau', unit: 'm²', hint: '8–14 €', defaultPrice: 11 },
    { category: 'Trockenbau', title: 'Durchbruch für Tür', unit: 'Stk', hint: '150–300 €', defaultPrice: 220 },
  ],

  putz_stuck: [
    { category: 'Putzarbeiten', title: 'Maschinenputz Innen', unit: 'm²', hint: '18–30 €', defaultPrice: 24 },
    { category: 'Putzarbeiten', title: 'Kalkputz handgezogen', unit: 'm²', hint: '30–50 €', defaultPrice: 40 },
    { category: 'Putzarbeiten', title: 'Dekorputz/Reibeputz', unit: 'm²', hint: '20–35 €', defaultPrice: 28 },
    { category: 'Putzarbeiten', title: 'Altputz abschlagen', unit: 'm²', hint: '8–15 €', defaultPrice: 11 },
  ],

  estrich: [
    { category: 'Estricharbeiten', title: 'Zementestrich 60mm', unit: 'm²', hint: '20–35 €', defaultPrice: 27 },
    { category: 'Estricharbeiten', title: 'Fließestrich (Anhydrit)', unit: 'm²', hint: '18–28 €', defaultPrice: 22 },
    { category: 'Estricharbeiten', title: 'Estrich aufbrechen', unit: 'm²', hint: '15–25 €', defaultPrice: 20 },
    { category: 'Estricharbeiten', title: 'Gefälleestrich', unit: 'm²', hint: '35–55 €', defaultPrice: 45 },
  ],

  elektro: [
    { category: 'Elektroarbeiten', title: 'Steckdose UP komplett', unit: 'Stk', hint: '80–130 €', defaultPrice: 100 },
    { category: 'Elektroarbeiten', title: 'Lichtauslass / Schalter UP', unit: 'Stk', hint: '70–120 €', defaultPrice: 90 },
    { category: 'Elektroarbeiten', title: 'Kabelverlegung UP', unit: 'm', hint: '25–45 €', defaultPrice: 35 },
    { category: 'Elektroarbeiten', title: 'Wandschlitz stemmen', unit: 'm', hint: '30–60 €', defaultPrice: 45 },
    { category: 'Elektroarbeiten', title: 'Unterverteiler 24 Module', unit: 'Stk', hint: '400–800 €', defaultPrice: 600 },
    { category: 'Elektroarbeiten', title: 'Wallbox 11kW inkl. Montage', unit: 'Stk', hint: '800–1.500 €', defaultPrice: 1100 },
  ],

  sanitär: [
    { category: 'Sanitärarbeiten', title: 'WC komplett (Wand-WC + Geberit)', unit: 'Stk', hint: '800–1.400 €', defaultPrice: 1050 },
    { category: 'Sanitärarbeiten', title: 'Waschtisch mit Armatur montiert', unit: 'Stk', hint: '400–800 €', defaultPrice: 580 },
    { category: 'Sanitärarbeiten', title: 'Dusche bodengleich (ohne Fliesen)', unit: 'Stk', hint: '600–1.200 €', defaultPrice: 850 },
    { category: 'Sanitärarbeiten', title: 'Badewanne einbauen', unit: 'Stk', hint: '500–900 €', defaultPrice: 680 },
    { category: 'Sanitärarbeiten', title: 'Heizkörper tauschen', unit: 'Stk', hint: '300–600 €', defaultPrice: 420 },
  ],

  schreiner: [
    { category: 'Schreinerarbeiten', title: 'Tür montieren inkl. Zarge', unit: 'Stk', hint: '300–600 €', defaultPrice: 420 },
    { category: 'Schreinerarbeiten', title: 'Einbauküche montieren (ohne Material)', unit: 'Pausch', hint: '400–900 €', defaultPrice: 600 },
    { category: 'Schreinerarbeiten', title: 'Treppenstufe erneuern', unit: 'Stk', hint: '80–200 €', defaultPrice: 130 },
    { category: 'Schreinerarbeiten', title: 'Treppe schleifen + versiegeln', unit: 'Pausch', hint: '600–1.500 €', defaultPrice: 950 },
  ],

  dachdecker: [
    { category: 'Dachdeckerarbeiten', title: 'Dachziegel komplett neu', unit: 'm²', hint: '60–120 €', defaultPrice: 85 },
    { category: 'Dachdeckerarbeiten', title: 'Aufsparrendämmung', unit: 'm²', hint: '80–150 €', defaultPrice: 115 },
    { category: 'Dachdeckerarbeiten', title: 'Dachfenster 70×118cm einbauen', unit: 'Stk', hint: '800–1.500 €', defaultPrice: 1100 },
    { category: 'Dachdeckerarbeiten', title: 'Dachrinne PVC montieren', unit: 'lm', hint: '20–35 €', defaultPrice: 28 },
  ],

  fenster_türen: [
    { category: 'Fenster & Türen', title: 'Fenster einbauen (ohne Material)', unit: 'Stk', hint: '150–300 €', defaultPrice: 220 },
    { category: 'Fenster & Türen', title: 'Fenster ausbauen (Altfenster)', unit: 'Stk', hint: '30–60 €', defaultPrice: 45 },
    { category: 'Fenster & Türen', title: 'Haustür einbauen', unit: 'Stk', hint: '400–800 €', defaultPrice: 580 },
    { category: 'Fenster & Türen', title: 'Rollladen elektrisch nachrüsten', unit: 'Stk', hint: '300–600 €', defaultPrice: 420 },
  ],

  entrümpelung: [
    { category: 'Entrümpelung', title: 'Entrümpelung pro Zimmer (ca. 20m²)', unit: 'Zimmer', hint: '200–500 €', defaultPrice: 320 },
    { category: 'Entrümpelung', title: 'Container 7m³ inkl. Entsorgung', unit: 'Stk', hint: '300–450 €', defaultPrice: 380 },
    { category: 'Entrümpelung', title: 'Endreinigung', unit: 'm²', hint: '10–18 €', defaultPrice: 13 },
  ],

  garten: [
    { category: 'Gartenarbeiten', title: 'Pflaster legen', unit: 'm²', hint: '35–65 €', defaultPrice: 48 },
    { category: 'Gartenarbeiten', title: 'Rasenschnitt', unit: 'm²', hint: '0,10–0,20 €', defaultPrice: 0.15 },
    { category: 'Gartenarbeiten', title: 'Rollrasen verlegen inkl. Material', unit: 'm²', hint: '15–25 €', defaultPrice: 19 },
    { category: 'Gartenarbeiten', title: 'Zaunbau Holz', unit: 'lm', hint: '30–60 €', defaultPrice: 42 },
  ],

  reinigung: [
    { category: 'Reinigung', title: 'Baureinigung', unit: 'm²', hint: '8–15 €', defaultPrice: 11 },
    { category: 'Reinigung', title: 'Fensterreinigung pro Seite', unit: 'Stk', hint: '3–8 €', defaultPrice: 5 },
    { category: 'Reinigung', title: 'Hochdruckreinigung Fassade', unit: 'm²', hint: '5–12 €', defaultPrice: 8 },
  ],

  abbruch: [
    { category: 'Abbrucharbeiten', title: 'Wandabbruch Mauerwerk', unit: 'm²', hint: '30–60 €', defaultPrice: 45 },
    { category: 'Abbrucharbeiten', title: 'Wandabbruch Beton', unit: 'm²', hint: '60–120 €', defaultPrice: 85 },
    { category: 'Abbrucharbeiten', title: 'Kernbohrung bis 100mm', unit: 'Stk', hint: '100–200 €', defaultPrice: 150 },
    { category: 'Abbrucharbeiten', title: 'Estrich aufbrechen', unit: 'm²', hint: '15–25 €', defaultPrice: 20 },
  ],

  maler_fassade: [
    { category: 'Fassadenarbeiten', title: 'Fassade streichen', unit: 'm²', hint: '15–25 €', defaultPrice: 20 },
    { category: 'Fassadenarbeiten', title: 'Fassadenputz auftragen', unit: 'm²', hint: '20–35 €', defaultPrice: 28 },
    { category: 'Fassadenarbeiten', title: 'WDVS 10cm komplett', unit: 'm²', hint: '80–120 €', defaultPrice: 95 },
    { category: 'Fassadenarbeiten', title: 'Altputz abschlagen', unit: 'm²', hint: '8–15 €', defaultPrice: 11 },
    { category: 'Fassadenarbeiten', title: 'Gerüst mieten', unit: 'm²', hint: '8–15 €/Monat', defaultPrice: 12 },
  ],

  allrounder: [
    { category: 'Entsorgung', title: 'Bauschutt-Container 7m³', unit: 'Stk', hint: '300–450 €', defaultPrice: 380 },
    { category: 'Entsorgung', title: 'Kleinfuhre bis 1m³', unit: 'Pausch', hint: '80–150 €', defaultPrice: 110 },
  ],
}

export function getPreisvorlagenForGewerke(gewerkeIds: string[]): PreisVorlage[] {
  const result: PreisVorlage[] = [...ALLGEMEINE_PREISE]
  const seen = new Set<string>()

  for (const id of gewerkeIds) {
    const vorlagen = GEWERK_PREISE[id] ?? []
    for (const v of vorlagen) {
      const key = `${v.category}::${v.title}`
      if (!seen.has(key)) {
        seen.add(key)
        result.push(v)
      }
    }
  }

  // Allrounder = Entsorgung immer dabei
  if (gewerkeIds.length > 0 && !seen.has('Entsorgung::Bauschutt-Container 7m³')) {
    result.push(...(GEWERK_PREISE['allrounder'] ?? []))
  }

  return result
}
