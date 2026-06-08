export interface Gewerk {
  id: string
  label: string
  emoji: string
  beschreibung: string
  typischeRückfragen: string[]
  kalkulationshinweise: string[]
}

export const GEWERKE: Gewerk[] = [
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'allrounder',
    label: 'Allrounder',
    emoji: '🔨',
    beschreibung: 'Renovierungen aller Art — Maler, Boden, Trockenbau, Sanitär, Elektro & mehr',
    typischeRückfragen: [
      'Stockwerk und Aufzug vorhanden? (ab 2.OG ohne Aufzug: Aufpreis)',
      'Wie weit ist die Baustelle vom Betrieb entfernt? (km)',
      'Wie viele Mitarbeiter werden gebraucht?',
      'Wohnung bewohnt während der Arbeiten?',
      'Bauschutt / Entsorgung nötig?',
      'Strom und Wasser auf der Baustelle vorhanden?',
      'Parkplatz vor Ort möglich?',
      'Arbeiten am Wochenende oder Feiertag?',
      'Gesamtdauer der Arbeiten (Tage)?',
      'Schimmel, Asbest oder andere Schadstoffe?',
      'Alte Beläge / Tapeten / Installationen müssen raus?',
      'Besondere Auflagen? (Denkmalschutz, Mietrecht, Hausverwaltung)',
    ],
    kalkulationshinweise: [
      'Fahrtkosten: (km × 2) × Fahrten × 0,40€/km als eigene Position',
      'Stockwerk ohne Aufzug: +8% ab 2.OG, +15% ab 4.OG auf Lohnanteil',
      'Wochenend-/Feiertagsarbeit: +30% auf Lohn',
      'Bewohnte Wohnung: +10% für Schutzmaßnahmen und Koordination',
      'Gefahrstoffe (Asbest/Schimmel): Sicherheitsaufwand als separate Position',
      'Kein Strom: Aggregat-Miete 80-150€/Tag',
      'Container 7m³: 300-450€, Container 10m³: 400-550€',
      'Immer Anfahrtspauschale separat ausweisen',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'malerarbeiten',
    label: 'Maler & Lackierer',
    emoji: '🖌️',
    beschreibung: 'Streichen, Spachteln, Tapezieren, Lackieren',
    typischeRückfragen: [
      'Stockwerk — Aufzug vorhanden? (ab 2.OG: Aufpreis)',
      'Wohnung bewohnt während der Arbeiten?',
      'Tapete vorhanden? Wie viele Lagen?',
      'Spachtelarbeiten nötig? Welche Qualitätsstufe? (Q1=rau / Q2=normal / Q3=glatt / Q4=hochglatt)',
      'Schimmelbefall vorhanden? Wie groß?',
      'Decke auch streichen?',
      'Stuckleisten, Zierprofile oder Rosetten vorhanden?',
      'Fenster, Türen oder Heizkörper lackieren?',
      'Fassade? (Gerüst nötig, Außenfarbe)',
      'Schutzfolie für Böden und Möbel nötig?',
      'Entfernung zur Baustelle (km)?',
      'Wie viele Mitarbeiter nötig?',
      'Sonderbeschichtung? (Brandschutz, Küche/Bad, Keller)',
    ],
    kalkulationshinweise: [
      'Tapete entfernen: 3-6€/m² (trocken) / 5-10€/m² (hartnäckig, mehrere Lagen)',
      'Spachteln Q2: 8-14€/m², Q3: 14-22€/m², Q4: 22-35€/m²',
      'Grundieren vor Streichen einkalkulieren (0,50-1,50€/m²)',
      'Schutzfolie: 0,50-1,50€/m² Bodenfläche',
      'Schimmelbehandlung: 15-30€/m² Aufpreis + Spezialmittel',
      'Stuckleisten: pro lfd. Meter kalkulieren (15-30€/m montiert)',
      'Lackieren Heizkörper: 30-60€/Stk je nach Größe',
      'Fassade: Gerüstkosten separat (8-15€/m² Fassadenfläche)',
      'Fenster streichen: 30-80€/Stk je nach Größe und Zustand',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'trockenbau',
    label: 'Trockenbau',
    emoji: '🏗️',
    beschreibung: 'Rigips, Ständerwände, Unterdecken, Verkleidungen',
    typischeRückfragen: [
      'Stockwerk — Aufzug für Materialtransport vorhanden?',
      'Art der Wand: einfache Trennwand oder Wohnungstrennwand (Schallschutz)?',
      'Installationen in der Wand? (Elektro-, Heizungs- oder Sanitärleitungen)',
      'Unterdecke: Raumhöhe und vorhandene Leitungen / Rohre?',
      'Brandschutzanforderungen? (Treppenhaus, Büro, Flure)',
      'Feuchtraumbereich? (Bad, Keller: Feuchtraumplatten nötig)',
      'Dämmung integrieren? (Schall- oder Wärmedämmung)',
      'Vorsatzschale an bestehender Wand? (Feuchte, Schallschutz)',
      'Durchbrüche oder Öffnungen für Türen?',
      'Spachtel-Qualität nach Fertigstellung? (Q2/Q3)',
      'Wie weit ist die Baustelle entfernt?',
    ],
    kalkulationshinweise: [
      'Einfache CW75-Wand: 45-65€/m², CW100 Schallschutz: 65-95€/m²',
      'Wohnungstrennwand (mit Doppelbeplankung + Dämmung): 90-140€/m²',
      'Unterdecke (abgehängt): 40-70€/m² je nach Höhe und Profil',
      'Feuchtraumbereich: +15-20% für spezielle Platten und Anschlüsse',
      'Installationen in Wand: +20-40€/m² Zusatzaufwand',
      'Durchbruch für Tür: 150-300€ pauschal je nach Breite',
      'Brandschutzverkleidung F30/F60: Aufpreis nach Klassifizierung',
      'Vorsatzschale: 30-55€/m²',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'fliesenleger',
    label: 'Fliesen & Naturstein',
    emoji: '🔲',
    beschreibung: 'Böden, Wände, Bäder, Terrassen, Naturstein',
    typischeRückfragen: [
      'Altfliesen vorhanden die raus müssen? (Boden, Wand oder beides)',
      'Untergrundvorbereitung nötig? (Spachteln, Ausgleichen, Grundieren)',
      'Abdichtung nötig? (Duschbereich, Wanne, bodengleiche Dusche)',
      'Fliesengröße / Format? (Großformate >60×60cm = Mehraufwand)',
      'Naturstein oder Feinsteinzeug? (Imprägnierung, Versiegelung)',
      'Fußbodenheizung vorhanden? (Flexkleber, Dehnungsfugen)',
      'Trennschnitte für Aussparungen? (Steckdosen, Armaturen, Rohre)',
      'Verlegemuster? (Diagonal, Versatz, Fischgrät = Mehraufwand)',
      'Terrasse / Außenbereich? (Frostfester Kleber, Gefälle)',
      'Stockwerk — Materialtransport?',
      'Entfernung zur Baustelle (km)?',
      'Fugenfarbe besprochen?',
    ],
    kalkulationshinweise: [
      'Altfliesen entfernen Boden: 10-20€/m², Wand: 12-22€/m²',
      'Bodenausgleich: 5-15€/m² je nach Stärke',
      'Abdichtung Dusche (inkl. Boden + Wände): 20-35€/m²',
      'Fliesen legen Boden Standard: 35-55€/m²',
      'Fliesen legen Wand Standard: 45-65€/m²',
      'Großformat >60×60cm: +10-20€/m² Aufpreis',
      'Naturstein (Marmor, Travertin): +15-25€/m²',
      'Diagonal- oder Fischgrätmuster: +8-15€/m²',
      'Außenbereich/Terrasse: +10-15€/m² (Frostschutz, Gefälle)',
      'Bodengleiche Dusche komplett: 400-800€ pauschal',
      'Fußbodenheizung: Flexkleber, Dehnungsfugen = +5€/m²',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'bodenbeläge',
    label: 'Bodenbeläge & Parkett',
    emoji: '🏠',
    beschreibung: 'Laminat, Vinyl, Parkett, Teppich, Kork, Linoleum',
    typischeRückfragen: [
      'Alter Belag vorhanden? (Teppich, Laminat, Vinyl, PVC, Parkett)',
      'Unterbodenausgleich nötig? (Unebenheiten messen, max. 3mm/2m)',
      'Fußbodenheizung vorhanden? (schwimmend verlegen, kein Kleben)',
      'Türunterschneidungen nötig? (Wie viele Türen?)',
      'Sockelleisten: mitliefern und montieren?',
      'Treppenstufen dabei? (Stufenprofile, Winkelleisten)',
      'Parkett: schleifen, versiegeln oder ölen/wachsen?',
      'Parkett-Verlegemuster? (Schiffsboden, Fischgrät, Würfel = Aufpreis)',
      'Klebung oder schwimmend? (Vollverklebung bei FBH empfohlen)',
      'Übergangsprofil zu anderen Böden nötig?',
      'Stockwerk — Materialtransport?',
      'Entfernung zur Baustelle (km)?',
    ],
    kalkulationshinweise: [
      'Teppich entfernen: 4-8€/m²',
      'Laminat/Vinyl entfernen: 5-10€/m²',
      'Parkett entfernen (verklebt): 15-25€/m²',
      'Unterbodenausgleich 5mm: 8-15€/m², 10mm: 12-20€/m²',
      'Laminat verlegen: 10-18€/m² (inkl. Material ca. 20-35€/m²)',
      'Vinyl/LVT verlegen: 12-20€/m² (inkl. Material ca. 25-45€/m²)',
      'Parkett verlegen (schwimmend): 18-28€/m²',
      'Parkett vollflächig kleben: 25-40€/m²',
      'Parkett schleifen + versiegeln: 18-30€/m²',
      'Türunterschneidung: 20-35€/Tür',
      'Sockelleisten montieren: 5-10€/lfd. m',
      'Fischgrät/Würfelmuster: +15-25% auf Verlegepreis',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'putz_stuck',
    label: 'Putz & Stuck',
    emoji: '🧱',
    beschreibung: 'Innen-/Außenputz, Kalkputz, Dekorputz, Stuckarbeiten',
    typischeRückfragen: [
      'Innenputz oder Außenputz?',
      'Untergrund: Mauerwerk, Beton, Gipskarton oder Altputz?',
      'Altputz abschlagen nötig?',
      'Armierungsgewebe erforderlich? (bei Außendämmung, Rissen)',
      'Putzart: Maschinenputz, Kalkputz, Lehmputz oder Kalkzementputz?',
      'Dekorputz oder Stuckarbeiten?',
      'Außenputz: Fassadendämmung (WDVS) dabei?',
      'Stockwerk / Gerüst nötig?',
      'Putzschienen und Lehren stellen?',
      'Anschlüsse: Fenster, Türen, Durchbrüche?',
    ],
    kalkulationshinweise: [
      'Altputz abschlagen: 8-15€/m²',
      'Maschinenputz Innen: 18-30€/m²',
      'Kalkputz handgezogen: 30-50€/m²',
      'Dekorputz (Reibeputz): 20-35€/m²',
      'Außenputz auf WDVS: 25-45€/m² (ohne Dämmung)',
      'WDVS komplett: 60-120€/m² je nach Dämmstärke',
      'Gerüst: 8-15€/m² Fassadenfläche',
      'Stuckleisten montieren: 15-30€/lfd. m',
      'Armierungsgewebe: +5-10€/m²',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'estrich',
    label: 'Estrich & Ausgleich',
    emoji: '🪨',
    beschreibung: 'Zement- und Fließestrich, Ausgleichmassen, Gefälleestrich',
    typischeRückfragen: [
      'Estrichdicke? (min. 45mm schwimmend, 35mm auf Rohdecke)',
      'Dämmung darunter? (Trittschall, Wärme: Estrichdicke erhöht sich)',
      'Fußbodenheizung einbetonieren?',
      'Gefälleestrich? (Dusche, Terrasse, Balkon)',
      'Fließestrich oder Zementestrich?',
      'Alter Estrich raus? (Aufbruch nötig?)',
      'Anschlusshöhe zu Türen und anderen Böden beachtet?',
      'Trockenzeit einplanen? (Calciumsulfat: 4-6 Wochen, Zement: 4 Wochen)',
      'Estrich schleifen oder grundieren für Belag?',
      'Stockwerk — Material schwer (Betonpumpe nötig?)',
    ],
    kalkulationshinweise: [
      'Zementestrich 60mm: 20-35€/m²',
      'Fließestrich (Anhydrit): 18-28€/m²',
      'Estrich aufbrechen: 15-25€/m²',
      'Gefälleestrich: 35-55€/m²',
      'FBH einbetonieren: +3-5€/m²',
      'Dämmung darunter (50mm): +8-15€/m²',
      'Betonpumpe ab 3.OG: 300-600€ Pauschale',
      'Aufheizprotokoll FBH: 150-300€ pauschal',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'elektro',
    label: 'Elektro',
    emoji: '⚡',
    beschreibung: 'Leitungen, Steckdosen, Verteiler, Smart Home, Photovoltaik',
    typischeRückfragen: [
      'Unterputz (UP) oder Aufputz (AP)?',
      'Stemmarbeiten nötig? (Schlitze für Kabel in Wand/Decke)',
      'Unterverteiler erneuern oder erweitern?',
      'Zählerwechsel oder HAK (Hausanschlusskasten)?',
      'Drehstrom (400V) nötig? (Herd, Wallbox, Wärmepumpe)',
      'Wallbox / E-Mobilität? (11kW oder 22kW)',
      'Photovoltaik / Wechselrichter?',
      'Smart-Home-System? (KNX, Gira, Loxone oder einfache Lösungen)',
      'Außenanlage? (Garten, Garage, Carport, Außenleuchten)',
      'Brandmeldeanlage oder Einbruchschutz?',
      'Anzahl Steckdosen / Schalter / Leuchtenauslässe?',
      'Wie weit ist die Baustelle entfernt?',
    ],
    kalkulationshinweise: [
      'Steckdose UP komplett: 80-130€/Stk',
      'Lichtauslass / Schalter UP: 70-120€/Stk',
      'Kabelkanal AP je lfd. m: 20-40€',
      'Stemmarbeiten: 30-60€/m Wandschlitz',
      'Unterverteiler 24 Module: 400-800€ komplett',
      'Wallbox 11kW: 800-1.500€ inkl. Montage',
      'DGUV-Prüfung nach Fertigstellung obligatorisch einkalkulieren',
      'Bei Bestandsbau: Bestandsmessung oft nötig (150-300€)',
      'Kabelverlegung UP: 25-45€/m',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'sanitär',
    label: 'Sanitär & Heizung',
    emoji: '🔧',
    beschreibung: 'Bad, WC, Heizung, Rohrleitungen, Wärmepumpe',
    typischeRückfragen: [
      'Wasseranlage abstellen nötig? (Abstimmung mit Hausverwaltung)',
      'Wanddurchbrüche für Rohrleitungen nötig?',
      'Estrich aufbrechen für Bodenheizung oder Abfluss?',
      'Heizungsanlage: Kompletttausch oder nur Heizkörper?',
      'Wärmepumpe / Wechsel der Heizenergie?',
      'Badewanne oder bodengleiche Dusche?',
      'Lüftungsanlage / Badlüfter nötig?',
      'Gasarbeiten dabei? (nur konzessionierter Betrieb)',
      'Fußbodenheizung nachrüsten oder vorhanden?',
      'Trinkwasserinstallation / Rohrtausch (Korrosion, Bleileitungen)?',
      'Heizkörper tauschen: Wie viele, welche Größen?',
      'Warmwasserspeicher oder Durchlauferhitzer?',
      'Stockwerk — Materialtransport?',
      'Entfernung zur Baustelle (km)?',
    ],
    kalkulationshinweise: [
      'WC komplett (Wand-WC + Geberit): 800-1.400€',
      'Waschtisch mit Armatur montiert: 400-800€',
      'Dusche bodengleich (ohne Fliesen): 600-1.200€',
      'Badewanne einbauen: 500-900€',
      'Heizkörper tauschen: 300-600€/Stk',
      'Heizungsanlage komplett: sehr individuell, Aufmaß nötig',
      'Estrich aufbrechen + wiederherstellen: als eigene Position',
      'Druckprüfung nach Fertigstellung: 100-200€ Pauschale',
      'Gasarbeiten: Abnahme durch Netzbetreiber einkalkulieren',
      'Wärmepumpe Luft/Wasser: 8.000-20.000€ komplett',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'schreiner',
    label: 'Schreiner & Tischler',
    emoji: '🪚',
    beschreibung: 'Möbel, Einbauküchen, Treppen, Türen, Holzarbeiten',
    typischeRückfragen: [
      'Maßmöbel oder Serienware montieren?',
      'Einbauküche: Lieferung durch Händler oder Montage only?',
      'Treppen: Neubau oder Sanierung (Knarren, neue Stufen)?',
      'Türen: Nur Montage oder inkl. Zarge und Beschläge?',
      'Holzart und Oberfläche besprochen? (Massiv, MDF, furniert)',
      'Lackierung oder Ölung im Preis?',
      'Einbauschränke: Maße und Ausstattung fixiert?',
      'Dachgeschoss / schräge Wände? (Aufwand erhöht sich)',
      'Fensterbank: Holz, Marmor oder Kunststoff?',
      'Stockwerk — Materialtransport?',
      'Entfernung zur Baustelle (km)?',
    ],
    kalkulationshinweise: [
      'Türmontage inkl. Zarge: 300-600€/Stk',
      'Türzarge einbauen: 150-250€/Stk',
      'Einbauküche montieren (ohne Material): 400-900€',
      'Maßschrank pro lfd. m: sehr individuell (800-2.500€+)',
      'Treppenstufen erneuern: 80-200€/Stufe',
      'Treppe schleifen + versiegeln: 600-1.500€ komplett',
      'Schreinerarbeiten: Aufmaß vor Ort immer empfohlen',
      'DG-Ausbau mit Schrägen: +20-40% gegenüber Standard',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'dachdecker',
    label: 'Dachdecker & Zimmerer',
    emoji: '🏚️',
    beschreibung: 'Dacheindeckung, Dachstuhl, Dämmung, Gaube, Dachfenster',
    typischeRückfragen: [
      'Gerüst nötig? (eigenes oder Fremdgerüst beauftragen?)',
      'Dachfläche und Dachneigung (Grad)?',
      'Komplette Neueindeckung oder nur Reparatur?',
      'Dämmung: Aufsparren, Zwischensparren oder Untersparren?',
      'Dachfenster (Velux/Roto): Anzahl und Größe?',
      'Gaube: neu bauen oder sanieren?',
      'Schornstein-Durchdringung oder Blitzschutz?',
      'Photovoltaik-Montage auf dem Dach?',
      'Dachrinne und Fallrohre erneuern?',
      'Balkenlage / Dachstuhlschäden?',
      'Wetterlage — Arbeitstage einplanen?',
    ],
    kalkulationshinweise: [
      'Gerüst: 8-15€/m² Fassadenfläche je nach Höhe',
      'Dachziegel komplett: 60-120€/m² (Material + Lohn)',
      'Aufsparrendämmung: 80-150€/m²',
      'Dachfenster (70×118cm): 800-1.500€ komplett eingebaut',
      'Dachrinne PVC: 20-35€/lfd. m',
      'Dachrinne Titanzink: 45-80€/lfd. m',
      'Schlechtwetterrisiko: 10-15% Zeitpuffer einkalkulieren',
      'Absturzsicherung / PSA: obligatorisch, im Preis',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'fenster_türen',
    label: 'Fenster & Türen',
    emoji: '🚪',
    beschreibung: 'Fenster, Haustüren, Rollläden, Raffstores, Einbruchschutz',
    typischeRückfragen: [
      'Ausbau der alten Fenster/Türen dabei?',
      'Anzahl und Größe der Fenster / Türen?',
      'Rollläden, Raffstores oder Jalousien?',
      'Laibungsverkleidung / Anputz innen nach Einbau?',
      'Fensterbänke innen und/oder außen?',
      'Stockwerk — Kran für Materiallieferung nötig?',
      'Abdichtung und Anschlussband (RAL-Montage)?',
      'Haustür: Einbruchschutz-Klasse? (RC2, RC3)',
      'Fenster inklusive Material oder nur Montage?',
      'Entfernung zur Baustelle (km)?',
    ],
    kalkulationshinweise: [
      'Fenster ausbauen: 30-60€/Stk',
      'Fenster einbauen (ohne Material): 150-300€/Stk',
      'Laibungsanputz innen: 50-100€/Fenster',
      'Fensterbank Kunststoff: 40-70€ / Naturstein: 80-200€',
      'Rolladen elektrisch nachrüsten: 300-600€/Stk',
      'RAL-gerechte Abdichtung obligatorisch einkalkulieren',
      'Haustür einbauen: 400-800€ Montage',
      'Kran ab OG3: 300-800€ Pauschale',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'entrümpelung',
    label: 'Entrümpelung & Transport',
    emoji: '🚛',
    beschreibung: 'Wohnungsauflösung, Räumung, Entsorgung, Umzug',
    typischeRückfragen: [
      'Wie viele Zimmer / m² müssen geräumt werden?',
      'Stockwerk — Aufzug vorhanden?',
      'Sondermüll vorhanden? (Farben, Chemikalien, Asbest, Elektroschrott)',
      'Container-Stellplatz direkt vor dem Haus möglich? (Genehmigung nötig?)',
      'Möbel: Nur weg oder auch Wiederverkauf / Weitergabe?',
      'Endreinigung im Anschluss gewünscht?',
      'Fester Termin? (Wohnungsübergabe-Druck)',
      'Keller oder Dachboden dabei?',
      'Garage oder Nebengebäude?',
      'Wie viele Mitarbeiter werden kalkuliert?',
      'Entfernung Baustelle → Entsorgungshof (km)?',
    ],
    kalkulationshinweise: [
      'Container 7m³: 300-450€, Container 10m³: 400-550€',
      'Sondermüll-Entsorgung: erheblicher Aufpreis — immer separat ausweisen',
      'Stockwerk ohne Aufzug: +25-40% auf Lohnanteil',
      'Stundenlohn Helfer: 35-50€/h',
      'Endreinigung: 10-18€/m² oder Pauschalpreis',
      'Abstellgenehmigung Container: 50-150€ (Behörde)',
      'Transporter/LKW-Kosten als eigene Position',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'garten',
    label: 'Garten & Landschaft',
    emoji: '🌳',
    beschreibung: 'Gartengestaltung, Pflasterung, Zäune, Bäume, Bewässerung',
    typischeRückfragen: [
      'Pflasterarbeiten oder Gartengestaltung?',
      'Altpflaster / alten Belag abfräsen oder aufnehmen?',
      'Drainage / Entwässerung nötig?',
      'Baumfällarbeiten? (Genehmigung nötig?)',
      'Bewässerungsanlage?',
      'Rasenfläche: Einssäen oder Rollrasen?',
      'Zaunbau: welches Material, welche Länge?',
      'Terrasse: welches Material? (Beton, Naturstein, Holz, WPC)',
      'Erdaushub / Mulchen nötig?',
      'Fahrzeugzufahrt zum Grundstück möglich?',
      'Entsorgung des Schnittguts?',
      'Entfernung zur Baustelle (km)?',
    ],
    kalkulationshinweise: [
      'Pflaster legen: 35-65€/m² (ohne Material)',
      'Altpflaster aufnehmen: 8-15€/m²',
      'Rasenschnitt / Mäharbeiten: 0,08-0,20€/m²',
      'Rollrasen verlegen: 8-15€/m² (inkl. Material ca. 15-25€/m²)',
      'Baumfällung: sehr individuell, Absicherung einplanen',
      'Zaunbau Holz: 30-60€/lfd. m',
      'Terassenpflaster Naturstein: 80-150€/m²',
      'Erdaushub: 30-60€/m³ abtragen + entsorgen',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'reinigung',
    label: 'Gebäudereinigung',
    emoji: '🧹',
    beschreibung: 'Baureinigung, Unterhaltsreinigung, Fensterreinigung, Sonderreinigung',
    typischeRückfragen: [
      'Baureinigung (nach Handwerksarbeiten) oder Unterhaltsreinigung?',
      'Fläche in m²?',
      'Stockwerke?',
      'Fensterreinigung dabei? (Anzahl, Größe, Stockwerk)',
      'Treppenhaus / Gemeinschaftsflächen?',
      'Sonderreinigung? (Schimmel, Brandschaden, Messie-Haushalt)',
      'Regelmäßige Reinigung oder einmalig?',
      'Reinigungsmittel beigestellt oder eigene?',
      'Fassade / Außenreinigung? (Hochdruck)',
    ],
    kalkulationshinweise: [
      'Baureinigung: 8-15€/m²',
      'Unterhaltsreinigung: 20-35€/h',
      'Fensterreinigung: 3-8€/Fensterseite',
      'Hochdruckreinigung Fassade: 5-12€/m²',
      'Treppenhaus reinigen: 20-50€/Etage',
      'Sonderreinigung Schimmel: 30-60€/m² (Gefahrstoffbereich)',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'abbruch',
    label: 'Abbruch & Rückbau',
    emoji: '⛏️',
    beschreibung: 'Wände einreißen, Kernbohrungen, Rückbau, Schadstoffsanierung',
    typischeRückfragen: [
      'Tragende oder nicht-tragende Wände?',
      'Statiker-Gutachten vorhanden? (bei tragenden Wänden Pflicht)',
      'Kernbohrungen nötig? (Anzahl, Durchmesser, Material)',
      'Schadstoffgutachten vorhanden? (Asbest, PCB, PAK)',
      'Bauschutt-Entsorgung: Container-Stellplatz möglich?',
      'Estrich aufbrechen?',
      'Deckenabbruch oder nur Unterkonstruktion?',
      'Wie viele m² oder lfd. m abzubrechen?',
      'Stockwerk — Erschütterungsschutz nötig?',
      'Erschütterungsempfindliche Nachbarbereiche?',
    ],
    kalkulationshinweise: [
      'Wandabbruch (Mauerwerk): 30-60€/m²',
      'Wandabbruch (Beton): 60-120€/m²',
      'Kernbohrung bis 100mm: 100-200€/Stk',
      'Kernbohrung bis 200mm: 200-400€/Stk',
      'Estrich aufbrechen: 15-25€/m²',
      'Schadstoffsanierung Asbest: stark aufpreisig, Sonderentsorgung',
      'Stempel/Unterfangung Sturzbalken: Aufpreis je nach Aufwand',
      'Container 7m³: 300-450€ inkl. Entsorgung',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'maler_fassade',
    label: 'Fassade & Außenarbeiten',
    emoji: '🏢',
    beschreibung: 'Fassadenputz, WDVS-Dämmung, Fassadenfarbe, Außenanstriche',
    typischeRückfragen: [
      'Gerüst nötig? (eigenes oder fremd beauftragen)',
      'Altputz abschlagen oder nur streichen?',
      'Wärmedämmverbundsystem (WDVS)? (Welche Dämmstärke: 10/14/16/20cm)',
      'Fassadenfläche in m²?',
      'Kellerbereich oder Sockel separat behandeln?',
      'Balkone oder Erker mit dabei?',
      'Fensterlaibungen überarbeiten?',
      'Schlagregenschutzanstrich oder Fassadenfarbe?',
      'Farbe bereits ausgewählt oder Beratung nötig?',
      'Zeitplan: Wetterabhängig — Puffer einplanen?',
    ],
    kalkulationshinweise: [
      'Gerüst: 8-15€/m² Fassadenfläche',
      'Fassade streichen: 15-25€/m²',
      'Fassadenputz auftragen: 20-35€/m²',
      'WDVS 10cm: 80-120€/m², WDVS 16cm: 100-150€/m²',
      'Altputz abschlagen: 8-15€/m²',
      'Sockelputz: 30-55€/lfd. m',
      'Schlechtwetterrisiko: 10-15% Zeitpuffer',
    ],
  },
]

export function gewerkeById(ids: string[]): Gewerk[] {
  return GEWERKE.filter(g => ids.includes(g.id))
}

export function getGewerkePromptContext(gewerkeIds: string[]): string {
  if (!gewerkeIds.length) return ''

  // Allrounder = alle Gewerke relevant
  const ids = gewerkeIds.includes('allrounder')
    ? GEWERKE.filter(g => g.id !== 'allrounder').map(g => g.id)
    : gewerkeIds

  const selected = gewerkeById(ids)
  if (!selected.length) return ''

  return `Der Handwerker arbeitet in folgenden Gewerken:
${selected.map(g => `
### ${g.emoji} ${g.label}
Typische Rückfragen für dieses Gewerk:
${g.typischeRückfragen.map(f => `- ${f}`).join('\n')}
Kalkulationshinweise:
${g.kalkulationshinweise.map(h => `- ${h}`).join('\n')}
`).join('\n')}`
}
