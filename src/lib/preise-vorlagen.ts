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
    // Anstrich Innen
    { category: 'Maler – Anstrich Innen', title: 'Wand streichen 1x Anstrich', unit: 'm²', hint: '5–8 €', defaultPrice: 6.00 },
    { category: 'Maler – Anstrich Innen', title: 'Wand streichen 2x Anstrich', unit: 'm²', hint: '8–12 €', defaultPrice: 9.50 },
    { category: 'Maler – Anstrich Innen', title: 'Wand streichen 3x Anstrich (Vollton / Dunkelfarbe)', unit: 'm²', hint: '11–15 €', defaultPrice: 13.00 },
    { category: 'Maler – Anstrich Innen', title: 'Decke streichen 1x Anstrich', unit: 'm²', hint: '5–9 €', defaultPrice: 7.00 },
    { category: 'Maler – Anstrich Innen', title: 'Decke streichen 2x Anstrich', unit: 'm²', hint: '9–13 €', defaultPrice: 11.00 },
    { category: 'Maler – Anstrich Innen', title: 'Tür streichen / lackieren (einseitig)', unit: 'Stück', hint: '35–60 €', defaultPrice: 45.00 },
    { category: 'Maler – Anstrich Innen', title: 'Tür streichen / lackieren (beidseitig)', unit: 'Stück', hint: '60–90 €', defaultPrice: 75.00 },
    { category: 'Maler – Anstrich Innen', title: 'Türzarge streichen', unit: 'Stück', hint: '25–50 €', defaultPrice: 35.00 },
    { category: 'Maler – Anstrich Innen', title: 'Fenster streichen innen', unit: 'Stück', hint: '40–70 €', defaultPrice: 55.00 },
    { category: 'Maler – Anstrich Innen', title: 'Heizkörper streichen / lackieren', unit: 'Stück', hint: '30–55 €', defaultPrice: 40.00 },
    { category: 'Maler – Anstrich Innen', title: 'Sockelleisten / Fußleisten streichen', unit: 'lfdm', hint: '2,50–5 €', defaultPrice: 3.50 },
    { category: 'Maler – Anstrich Innen', title: 'Geländer / Handlauf streichen', unit: 'lfdm', hint: '9–16 €', defaultPrice: 12.00 },
    { category: 'Maler – Anstrich Innen', title: 'Treppenstufen streichen / versiegeln', unit: 'Stück', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Maler – Anstrich Innen', title: 'Sonderfarbe / RAL-Farbe (Aufpreis)', unit: 'm²', hint: '2–4 €', defaultPrice: 3.00 },
    // Anstrich Außen
    { category: 'Maler – Anstrich Außen', title: 'Fassade streichen 1x Anstrich', unit: 'm²', hint: '7–12 €', defaultPrice: 9.00 },
    { category: 'Maler – Anstrich Außen', title: 'Fassade streichen 2x Anstrich', unit: 'm²', hint: '12–17 €', defaultPrice: 14.00 },
    { category: 'Maler – Anstrich Außen', title: 'Fenster streichen außen', unit: 'Stück', hint: '55–85 €', defaultPrice: 70.00 },
    { category: 'Maler – Anstrich Außen', title: 'Holzschutzanstrich außen (Lasur)', unit: 'm²', hint: '10–16 €', defaultPrice: 13.00 },
    { category: 'Maler – Anstrich Außen', title: 'Rostschutzbehandlung', unit: 'm²', hint: '11–18 €', defaultPrice: 14.00 },
    // Tapezieren
    { category: 'Maler – Tapezieren', title: 'Raufaser tapezieren + überstreichen 1x', unit: 'm²', hint: '12–17 €', defaultPrice: 14.00 },
    { category: 'Maler – Tapezieren', title: 'Raufaser tapezieren + überstreichen 2x', unit: 'm²', hint: '15–20 €', defaultPrice: 17.00 },
    { category: 'Maler – Tapezieren', title: 'Vliestapete tapezieren', unit: 'm²', hint: '15–22 €', defaultPrice: 18.00 },
    { category: 'Maler – Tapezieren', title: 'Glasfasertapete tapezieren', unit: 'm²', hint: '17–25 €', defaultPrice: 20.00 },
    // Untergrundvorbereitung
    { category: 'Maler – Untergrundvorbereitung', title: 'Tapete ablösen (einlagig)', unit: 'm²', hint: '3–6 €', defaultPrice: 4.00 },
    { category: 'Maler – Untergrundvorbereitung', title: 'Tapete ablösen (mehrlagig, Aufpreis)', unit: 'm²', hint: '2–4 €', defaultPrice: 2.50 },
    { category: 'Maler – Untergrundvorbereitung', title: 'Tapete ablösen mit Dampfgerät', unit: 'm²', hint: '4–7 €', defaultPrice: 5.50 },
    { category: 'Maler – Untergrundvorbereitung', title: 'Fläche spachteln (Flächenspachtel)', unit: 'm²', hint: '7–12 €', defaultPrice: 9.00 },
    { category: 'Maler – Untergrundvorbereitung', title: 'Schleifen maschinell (Langhalsschleifer)', unit: 'm²', hint: '4–7 €', defaultPrice: 5.50 },
    { category: 'Maler – Untergrundvorbereitung', title: 'Grundieren (Tiefengrund)', unit: 'm²', hint: '3–6 €', defaultPrice: 4.50 },
    { category: 'Maler – Untergrundvorbereitung', title: 'Grundieren (Haftgrund / Sperrgrund)', unit: 'm²', hint: '4–8 €', defaultPrice: 6.00 },
    { category: 'Maler – Untergrundvorbereitung', title: 'Schimmel behandeln (Schimmelschutzgrund)', unit: 'm²', hint: '9–15 €', defaultPrice: 12.00 },
    { category: 'Maler – Untergrundvorbereitung', title: 'Putz ausbessern', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    // Bodenbeschichtung
    { category: 'Maler – Bodenbeschichtung', title: 'Betonboden grundieren', unit: 'm²', hint: '4–8 €', defaultPrice: 6.00 },
    { category: 'Maler – Bodenbeschichtung', title: 'Betonboden beschichten / versiegeln 2x', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    { category: 'Maler – Bodenbeschichtung', title: 'Bodenfarbe auftragen (Keller, Garage)', unit: 'm²', hint: '9–15 €', defaultPrice: 12.00 },
    // Erschwernisse
    { category: 'Maler – Erschwernisse & Zuschläge', title: 'Zuschlag hohe Räume (>2,80 m bis 4 m)', unit: 'm²', hint: '1,50–4 €', defaultPrice: 2.50 },
    { category: 'Maler – Erschwernisse & Zuschläge', title: 'Zuschlag hohe Räume (>4 m)', unit: 'm²', hint: '3–7 €', defaultPrice: 5.00 },
    { category: 'Maler – Erschwernisse & Zuschläge', title: 'Zuschlag bewohnte Wohnung', unit: 'Pauschale', hint: '60–120 €', defaultPrice: 80.00 },
    { category: 'Maler – Erschwernisse & Zuschläge', title: 'Bleihaltiger Altanstrich (Sicherheitsaufpreis)', unit: 'Pauschale', hint: '100–250 €', defaultPrice: 150.00 },
    // Stundenleistungen
    { category: 'Maler – Stundenleistungen', title: 'Regiearbeit Geselle', unit: 'Stunde', hint: '55–75 €', defaultPrice: 65.00 },
    { category: 'Maler – Stundenleistungen', title: 'Regiearbeit Meister', unit: 'Stunde', hint: '70–90 €', defaultPrice: 80.00 },
    { category: 'Maler – Stundenleistungen', title: 'Kleinstmengenarbeit pauschal', unit: 'Pauschale', hint: '75–120 €', defaultPrice: 95.00 },
  ],

  bodenbeläge: [
    // Parkett
    { category: 'Boden – Parkett', title: 'Fertigparkett verlegen schwimmend (Klick-System)', unit: 'm²', hint: '18–28 €', defaultPrice: 22.00 },
    { category: 'Boden – Parkett', title: 'Fertigparkett verlegen vollflächig verklebt', unit: 'm²', hint: '28–44 €', defaultPrice: 35.00 },
    { category: 'Boden – Parkett', title: 'Mehrschichtparkett verlegen schwimmend', unit: 'm²', hint: '22–36 €', defaultPrice: 28.00 },
    { category: 'Boden – Parkett', title: 'Mehrschichtparkett verlegen vollflächig verklebt', unit: 'm²', hint: '34–52 €', defaultPrice: 42.00 },
    { category: 'Boden – Parkett', title: 'Massivparkett (Stabparkett) verlegen vollflächig verklebt', unit: 'm²', hint: '44–68 €', defaultPrice: 55.00 },
    { category: 'Boden – Parkett', title: 'Landhausdiele verlegen schwimmend (Klick)', unit: 'm²', hint: '20–32 €', defaultPrice: 25.00 },
    { category: 'Boden – Parkett', title: 'Landhausdiele verlegen vollflächig verklebt', unit: 'm²', hint: '32–50 €', defaultPrice: 40.00 },
    { category: 'Boden – Parkett', title: 'Aufpreis Fischgrät-Verlegemuster', unit: 'm²', hint: '10–19 €', defaultPrice: 14.00 },
    { category: 'Boden – Parkett', title: 'Aufpreis Verlegung bei Fußbodenheizung', unit: 'm²', hint: '5–12 €', defaultPrice: 8.00 },
    // Parkett Aufarbeitung
    { category: 'Boden – Parkett Aufarbeitung', title: 'Parkett abschleifen (2 Schleifgänge inkl. Rand)', unit: 'm²', hint: '15–26 €', defaultPrice: 20.00 },
    { category: 'Boden – Parkett Aufarbeitung', title: 'Parkett versiegeln (Lack, 2-lagig)', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Boden – Parkett Aufarbeitung', title: 'Parkett ölen (maschinell, 2-lagig)', unit: 'm²', hint: '22–36 €', defaultPrice: 28.00 },
    { category: 'Boden – Parkett Aufarbeitung', title: 'Parkett schleifen + versiegeln komplett', unit: 'm²', hint: '30–48 €', defaultPrice: 38.00 },
    { category: 'Boden – Parkett Aufarbeitung', title: 'Parkett schleifen + ölen komplett', unit: 'm²', hint: '36–56 €', defaultPrice: 45.00 },
    { category: 'Boden – Parkett Aufarbeitung', title: 'Einzelstäbe / beschädigte Felder austauschen', unit: 'Stück', hint: '26–46 €', defaultPrice: 35.00 },
    // Laminat
    { category: 'Boden – Laminat', title: 'Laminat verlegen schwimmend (Standard)', unit: 'm²', hint: '11–19 €', defaultPrice: 14.00 },
    { category: 'Boden – Laminat', title: 'Laminat verlegen schwimmend (Großdiele)', unit: 'm²', hint: '12–22 €', defaultPrice: 16.00 },
    { category: 'Boden – Laminat', title: 'Aufpreis Diagonalverlegung Laminat', unit: 'm²', hint: '5–12 €', defaultPrice: 8.00 },
    // Vinyl / LVT
    { category: 'Boden – Vinyl / LVT', title: 'Klick-Vinyl (LVT) verlegen schwimmend, Standard', unit: 'm²', hint: '12–22 €', defaultPrice: 16.00 },
    { category: 'Boden – Vinyl / LVT', title: 'Klick-Vinyl (SPC) verlegen schwimmend (wasserfest)', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Boden – Vinyl / LVT', title: 'Klebe-Vinyl verlegen vollflächig (Profikleber)', unit: 'm²', hint: '22–36 €', defaultPrice: 28.00 },
    { category: 'Boden – Vinyl / LVT', title: 'WPC-Boden / Outdoorvinyl verlegen', unit: 'm²', hint: '19–33 €', defaultPrice: 25.00 },
    // PVC / Elastisch
    { category: 'Boden – PVC / Elastisch', title: 'PVC-Belag verlegen vollflächig verklebt (Rollenware)', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Boden – PVC / Elastisch', title: 'CV-Belag (Cushion Vinyl) verlegen vollflächig', unit: 'm²', hint: '15–27 €', defaultPrice: 20.00 },
    { category: 'Boden – PVC / Elastisch', title: 'Gummibelag verlegen (Gewerbe, Küche, Keller)', unit: 'm²', hint: '22–36 €', defaultPrice: 28.00 },
    // Teppichboden
    { category: 'Boden – Teppichboden', title: 'Teppichboden verlegen (gespannt / Nagelleiste)', unit: 'm²', hint: '11–19 €', defaultPrice: 14.00 },
    { category: 'Boden – Teppichboden', title: 'Teppichboden verlegen vollflächig verklebt', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Boden – Teppichboden', title: 'Teppichfliesen verlegen (selbsthaftend)', unit: 'm²', hint: '9–16 €', defaultPrice: 12.00 },
    // Linoleum / Kork
    { category: 'Boden – Linoleum', title: 'Linoleum verlegen vollflächig verklebt (Rollenware)', unit: 'm²', hint: '17–29 €', defaultPrice: 22.00 },
    { category: 'Boden – Kork', title: 'Korkboden verlegen schwimmend (Klick-System)', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Boden – Kork', title: 'Korkboden verlegen vollflächig verklebt', unit: 'm²', hint: '18–32 €', defaultPrice: 24.00 },
    // Altbelag entfernen
    { category: 'Boden – Altbelag entfernen', title: 'Teppichboden entfernen und entsorgen', unit: 'm²', hint: '4–9 €', defaultPrice: 6.00 },
    { category: 'Boden – Altbelag entfernen', title: 'Laminat demontieren und entsorgen', unit: 'm²', hint: '3–8 €', defaultPrice: 5.00 },
    { category: 'Boden – Altbelag entfernen', title: 'Vinyl / PVC entfernen und entsorgen', unit: 'm²', hint: '5–10 €', defaultPrice: 7.00 },
    { category: 'Boden – Altbelag entfernen', title: 'Parkett demontieren (verklebt, aufwändig)', unit: 'm²', hint: '13–24 €', defaultPrice: 18.00 },
    { category: 'Boden – Altbelag entfernen', title: 'Klebstoffreste / Altkleber abfräsen', unit: 'm²', hint: '10–19 €', defaultPrice: 14.00 },
    // Untergrundvorbereitung
    { category: 'Boden – Untergrundvorbereitung', title: 'Untergrund spachteln / ausgleichen (bis 5mm)', unit: 'm²', hint: '9–16 €', defaultPrice: 12.00 },
    { category: 'Boden – Untergrundvorbereitung', title: 'Untergrund spachteln / ausgleichen (bis 20mm)', unit: 'm²', hint: '15–27 €', defaultPrice: 20.00 },
    { category: 'Boden – Untergrundvorbereitung', title: 'Trittschalldämmung verlegen (PE-Schaum / Filz)', unit: 'm²', hint: '3–7 €', defaultPrice: 4.50 },
    { category: 'Boden – Untergrundvorbereitung', title: 'Dampfbremse / PE-Folie verlegen', unit: 'm²', hint: '2–5 €', defaultPrice: 3.50 },
    { category: 'Boden – Untergrundvorbereitung', title: 'Feuchtemessung Estrich (CM-Messung)', unit: 'Messung', hint: '25–50 €', defaultPrice: 35.00 },
    // Abschlussarbeiten
    { category: 'Boden – Abschlussarbeiten', title: 'Sockelleisten montieren (Holz / MDF / Kunststoff)', unit: 'lfdm', hint: '4–8 €', defaultPrice: 5.50 },
    { category: 'Boden – Abschlussarbeiten', title: 'Übergangsprofil / Schwelle einbauen', unit: 'Stück', hint: '10–22 €', defaultPrice: 15.00 },
    { category: 'Boden – Abschlussarbeiten', title: 'Treppenstufe mit Belag belegen', unit: 'Stück', hint: '34–58 €', defaultPrice: 45.00 },
    { category: 'Boden – Abschlussarbeiten', title: 'Türzarge unterkürzen für neuen Belagsaufbau', unit: 'Stück', hint: '18–34 €', defaultPrice: 25.00 },
    // Stundenleistungen
    { category: 'Boden – Stundenleistungen', title: 'Regiearbeit Geselle Bodenleger', unit: 'Stunde', hint: '48–70 €', defaultPrice: 58.00 },
    { category: 'Boden – Stundenleistungen', title: 'Regiearbeit Parkettleger / Meister', unit: 'Stunde', hint: '62–90 €', defaultPrice: 75.00 },
    { category: 'Boden – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '85–140 €', defaultPrice: 110.00 },
  ],

  fliesenleger: [
    // Boden verlegen
    { category: 'Fliesen – Boden verlegen', title: 'Bodenfliesen Standard (30×30 bis 60×60cm), gerade, Q2', unit: 'm²', hint: '32–46 €', defaultPrice: 38.00 },
    { category: 'Fliesen – Boden verlegen', title: 'Bodenfliesen Großformat (60×60 bis 80×80cm)', unit: 'm²', hint: '44–62 €', defaultPrice: 52.00 },
    { category: 'Fliesen – Boden verlegen', title: 'Bodenfliesen Großformat (80×80 bis 120×120cm)', unit: 'm²', hint: '58–80 €', defaultPrice: 68.00 },
    { category: 'Fliesen – Boden verlegen', title: 'Bodenfliesen XXL (>120×120cm, Buttering-Floating)', unit: 'm²', hint: '76–106 €', defaultPrice: 90.00 },
    { category: 'Fliesen – Boden verlegen', title: 'Kleinfliesen / Mosaikfliesen Boden (<10×10cm)', unit: 'm²', hint: '54–78 €', defaultPrice: 65.00 },
    { category: 'Fliesen – Boden verlegen', title: 'Aufpreis Diagonalverlegung Boden', unit: 'm²', hint: '9–16 €', defaultPrice: 12.00 },
    { category: 'Fliesen – Boden verlegen', title: 'Aufpreis Fischgrät / Muster / Mosaik', unit: 'm²', hint: '15–26 €', defaultPrice: 20.00 },
    // Wand verlegen
    { category: 'Fliesen – Wand verlegen', title: 'Wandfliesen Standard (20×40 bis 30×60cm), gerade', unit: 'm²', hint: '36–52 €', defaultPrice: 42.00 },
    { category: 'Fliesen – Wand verlegen', title: 'Wandfliesen Großformat (60×120cm aufwärts)', unit: 'm²', hint: '54–78 €', defaultPrice: 65.00 },
    { category: 'Fliesen – Wand verlegen', title: 'Wandfliesen Kleinfliesen / Mosaik (<10×10cm)', unit: 'm²', hint: '62–90 €', defaultPrice: 75.00 },
    { category: 'Fliesen – Wand verlegen', title: 'Fliesenspiegel Küche (inkl. Ausschnitte Steckdosen)', unit: 'm²', hint: '45–68 €', defaultPrice: 55.00 },
    // Abriss
    { category: 'Fliesen – Abriss & Entsorgung', title: 'Altfliesen Boden abstemmen (einlagig)', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Fliesen – Abriss & Entsorgung', title: 'Altfliesen Wand abstemmen', unit: 'm²', hint: '17–28 €', defaultPrice: 22.00 },
    { category: 'Fliesen – Abriss & Entsorgung', title: 'Kleberbett / Altkleber abfräsen', unit: 'm²', hint: '10–19 €', defaultPrice: 14.00 },
    // Untergrundvorbereitung
    { category: 'Fliesen – Untergrundvorbereitung', title: 'Untergrund spachteln / ausgleichen (bis 5mm)', unit: 'm²', hint: '9–16 €', defaultPrice: 12.00 },
    { category: 'Fliesen – Untergrundvorbereitung', title: 'Untergrund spachteln / ausgleichen (bis 20mm)', unit: 'm²', hint: '15–26 €', defaultPrice: 20.00 },
    { category: 'Fliesen – Untergrundvorbereitung', title: 'Entkopplungsmatte verlegen (z.B. Schlüter Ditra)', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    // Abdichtung
    { category: 'Fliesen – Abdichtung', title: 'Verbundabdichtung Boden (Flüssigfolie 2-lagig)', unit: 'm²', hint: '17–28 €', defaultPrice: 22.00 },
    { category: 'Fliesen – Abdichtung', title: 'Verbundabdichtung Wand / Duschbereich (Flüssigfolie 2-lagig)', unit: 'm²', hint: '22–35 €', defaultPrice: 28.00 },
    { category: 'Fliesen – Abdichtung', title: 'Dichtband in Ecken und Anschlüssen einlegen', unit: 'lfdm', hint: '4,50–9 €', defaultPrice: 6.50 },
    { category: 'Fliesen – Abdichtung', title: 'Bodenablauf / Rinne einbauen und abdichten', unit: 'Stück', hint: '72–120 €', defaultPrice: 95.00 },
    // Naturstein
    { category: 'Fliesen – Naturstein', title: 'Naturstein Boden verlegen (bis 60×60cm)', unit: 'm²', hint: '54–78 €', defaultPrice: 65.00 },
    { category: 'Fliesen – Naturstein', title: 'Naturstein Boden verlegen (Großformat >60×60cm)', unit: 'm²', hint: '76–106 €', defaultPrice: 90.00 },
    { category: 'Fliesen – Naturstein', title: 'Naturstein Wand verlegen', unit: 'm²', hint: '62–90 €', defaultPrice: 75.00 },
    { category: 'Fliesen – Naturstein', title: 'Naturstein imprägnieren / versiegeln', unit: 'm²', hint: '10–19 €', defaultPrice: 14.00 },
    { category: 'Fliesen – Naturstein', title: 'Naturstein Treppenstufe verlegen', unit: 'Stück', hint: '58–95 €', defaultPrice: 75.00 },
    // Sonderarbeiten
    { category: 'Fliesen – Sonderarbeiten', title: 'Ebenerdige / bodengleiche Dusche einbauen (Gefälleestrich)', unit: 'Pauschale', hint: '420–680 €', defaultPrice: 550.00 },
    { category: 'Fliesen – Sonderarbeiten', title: 'Duschrinne / Punktablauf einbauen inkl. Abdichtung', unit: 'Stück', hint: '72–120 €', defaultPrice: 95.00 },
    { category: 'Fliesen – Sonderarbeiten', title: 'Nische / Wandnische fliesen', unit: 'Stück', hint: '72–120 €', defaultPrice: 95.00 },
    { category: 'Fliesen – Sonderarbeiten', title: 'Treppenstufe fliesen (Setz- und Trittstufe)', unit: 'Stück', hint: '42–70 €', defaultPrice: 55.00 },
    { category: 'Fliesen – Sonderarbeiten', title: 'Außenfliesen / Terrassenfliesen verlegen (frostsicher)', unit: 'm²', hint: '44–68 €', defaultPrice: 55.00 },
    { category: 'Fliesen – Sonderarbeiten', title: 'Schlüter-Profil / Kantenprofil setzen', unit: 'lfdm', hint: '7–14 €', defaultPrice: 10.00 },
    // Fugen & Silikon
    { category: 'Fliesen – Fugen & Silikon', title: 'Silikonfuge setzen (Sanitärsilikon, Bewegungsfuge)', unit: 'lfdm', hint: '5–11 €', defaultPrice: 8.00 },
    { category: 'Fliesen – Fugen & Silikon', title: 'Alte Silikonfuge entfernen und neu setzen', unit: 'lfdm', hint: '10–19 €', defaultPrice: 14.00 },
    { category: 'Fliesen – Fugen & Silikon', title: 'Fugenmasse erneuern (Ausfräsen + neu verfugen)', unit: 'm²', hint: '22–36 €', defaultPrice: 28.00 },
    // Stundenleistungen
    { category: 'Fliesen – Stundenleistungen', title: 'Regiearbeit Geselle Fliesenleger', unit: 'Stunde', hint: '52–74 €', defaultPrice: 62.00 },
    { category: 'Fliesen – Stundenleistungen', title: 'Regiearbeit Meister / Naturstein-Spezialist', unit: 'Stunde', hint: '70–96 €', defaultPrice: 82.00 },
    { category: 'Fliesen – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–150 €', defaultPrice: 120.00 },
  ],

  trockenbau: [
    // Trennwände
    { category: 'Trockenbau – Trennwände', title: 'Trennwand 75mm, 1-lagig je Seite (GK), Q2', unit: 'm²', hint: '50–68 €', defaultPrice: 58.00 },
    { category: 'Trockenbau – Trennwände', title: 'Trennwand 100mm, 1-lagig je Seite (GK), Q2', unit: 'm²', hint: '58–75 €', defaultPrice: 65.00 },
    { category: 'Trockenbau – Trennwände', title: 'Trennwand 100mm, 2-lagig je Seite, Rw ~50dB, Q2', unit: 'm²', hint: '85–115 €', defaultPrice: 98.00 },
    { category: 'Trockenbau – Trennwände', title: 'Trennwand 125mm, 2-lagig, erhöhter Schallschutz, Q2', unit: 'm²', hint: '100–130 €', defaultPrice: 115.00 },
    { category: 'Trockenbau – Trennwände', title: 'Trennwand Feuchtraum (GKF), 1-lagig', unit: 'm²', hint: '68–90 €', defaultPrice: 78.00 },
    { category: 'Trockenbau – Trennwände', title: 'Trennwand Brandschutz F30 (GKF), 1-lagig', unit: 'm²', hint: '75–98 €', defaultPrice: 85.00 },
    { category: 'Trockenbau – Trennwände', title: 'Trennwand Brandschutz F60 (GKF), 2-lagig', unit: 'm²', hint: '105–140 €', defaultPrice: 120.00 },
    { category: 'Trockenbau – Trennwände', title: 'Installationswand (doppeltes Ständerwerk)', unit: 'm²', hint: '82–110 €', defaultPrice: 95.00 },
    { category: 'Trockenbau – Trennwände', title: 'Aufpreis Wandhöhe >3,25m bis 4,5m', unit: 'm²', hint: '9–16 €', defaultPrice: 12.00 },
    // Vorsatzschalen
    { category: 'Trockenbau – Vorsatzschalen', title: 'Vorsatzschale direkt (GK auf UK), 1-lagig, Q2', unit: 'm²', hint: '32–45 €', defaultPrice: 38.00 },
    { category: 'Trockenbau – Vorsatzschalen', title: 'Vorsatzschale mit Luftspalt / freistehend, Q2', unit: 'm²', hint: '45–62 €', defaultPrice: 52.00 },
    { category: 'Trockenbau – Vorsatzschalen', title: 'Vorsatzschale mit Dämmung (Mineralwolle 40mm)', unit: 'm²', hint: '54–72 €', defaultPrice: 62.00 },
    { category: 'Trockenbau – Vorsatzschalen', title: 'Vorsatzschale Feuchtraum (GKF)', unit: 'm²', hint: '50–68 €', defaultPrice: 58.00 },
    // Decken
    { category: 'Trockenbau – Decken', title: 'Deckenbekleidung direkt (GK auf UK), 1-lagig, Q2', unit: 'm²', hint: '36–50 €', defaultPrice: 42.00 },
    { category: 'Trockenbau – Decken', title: 'Abgehängte Decke (GK), 1-lagig, bis 50cm, Q2', unit: 'm²', hint: '48–65 €', defaultPrice: 55.00 },
    { category: 'Trockenbau – Decken', title: 'Abgehängte Decke (GK), 2-lagig (Schall-/Brandschutz)', unit: 'm²', hint: '62–84 €', defaultPrice: 72.00 },
    { category: 'Trockenbau – Decken', title: 'Abgehängte Decke Feuchtraum (GKF)', unit: 'm²', hint: '56–76 €', defaultPrice: 65.00 },
    { category: 'Trockenbau – Decken', title: 'Lichtvoute / Lichtkanal in Decke', unit: 'lfdm', hint: '70–100 €', defaultPrice: 85.00 },
    // Trockenestrich
    { category: 'Trockenbau – Trockenestrich', title: 'Trockenestrich (Fermacell) auf Schüttung', unit: 'm²', hint: '40–58 €', defaultPrice: 48.00 },
    { category: 'Trockenbau – Trockenestrich', title: 'Trockenestrich auf Trittschalldämmung', unit: 'm²', hint: '32–46 €', defaultPrice: 38.00 },
    { category: 'Trockenbau – Trockenestrich', title: 'Schüttung einbringen und abziehen (Blähton)', unit: 'm²', hint: '18–28 €', defaultPrice: 22.00 },
    // Spachtelung
    { category: 'Trockenbau – Spachtelung & Oberfläche', title: 'GK-Fugen verspachteln (Q1)', unit: 'm²', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Trockenbau – Spachtelung & Oberfläche', title: 'GK-Fläche spachteln (Q2 – Standard)', unit: 'm²', hint: '11–18 €', defaultPrice: 14.00 },
    { category: 'Trockenbau – Spachtelung & Oberfläche', title: 'GK-Fläche spachteln (Q3 – Feinspachtelung)', unit: 'm²', hint: '18–27 €', defaultPrice: 22.00 },
    { category: 'Trockenbau – Spachtelung & Oberfläche', title: 'GK-Fläche spachteln (Q4 – Streichfertig)', unit: 'm²', hint: '26–38 €', defaultPrice: 32.00 },
    { category: 'Trockenbau – Spachtelung & Oberfläche', title: 'Kantenschutzwinkel setzen', unit: 'lfdm', hint: '3,50–7 €', defaultPrice: 5.00 },
    // Sonderkonstruktionen
    { category: 'Trockenbau – Sonderkonstruktionen', title: 'Nische / Wandnische einbauen', unit: 'Stück', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Trockenbau – Sonderkonstruktionen', title: 'Türöffnung einbauen / ummanteln', unit: 'Stück', hint: '95–150 €', defaultPrice: 120.00 },
    { category: 'Trockenbau – Sonderkonstruktionen', title: 'Schräge / Dachschräge verkleiden (GK)', unit: 'm²', hint: '62–90 €', defaultPrice: 75.00 },
    { category: 'Trockenbau – Sonderkonstruktionen', title: 'Installationsschacht verkleiden', unit: 'lfdm', hint: '70–105 €', defaultPrice: 85.00 },
    { category: 'Trockenbau – Sonderkonstruktionen', title: 'Revisionsöffnung einbauen (inkl. Klappe)', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    { category: 'Trockenbau – Sonderkonstruktionen', title: 'Vorbereitung für Wandhänge-WC / Installationsblock', unit: 'Stück', hint: '110–175 €', defaultPrice: 140.00 },
    // Stundenleistungen
    { category: 'Trockenbau – Stundenleistungen', title: 'Regiearbeit Geselle Trockenbau', unit: 'Stunde', hint: '55–76 €', defaultPrice: 65.00 },
    { category: 'Trockenbau – Stundenleistungen', title: 'Regiearbeit Meister / Bauleiter', unit: 'Stunde', hint: '70–95 €', defaultPrice: 82.00 },
    { category: 'Trockenbau – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–150 €', defaultPrice: 120.00 },
  ],

  putz_stuck: [
    // Innenputz
    { category: 'Putz – Innenputz', title: 'Kalkputz einlagig (Unterputz, bis 15mm)', unit: 'm²', hint: '17–28 €', defaultPrice: 22.00 },
    { category: 'Putz – Innenputz', title: 'Kalkputz zweilagig (Unter- + Oberputz)', unit: 'm²', hint: '27–43 €', defaultPrice: 34.00 },
    { category: 'Putz – Innenputz', title: 'Kalk-Zement-Putz einlagig (feuchtebelastet)', unit: 'm²', hint: '18–32 €', defaultPrice: 24.00 },
    { category: 'Putz – Innenputz', title: 'Gipsputz einlagig (Unterputz, bis 15mm)', unit: 'm²', hint: '15–26 €', defaultPrice: 20.00 },
    { category: 'Putz – Innenputz', title: 'Gipsputz maschinell (MIP, bis 15mm)', unit: 'm²', hint: '13–24 €', defaultPrice: 18.00 },
    { category: 'Putz – Innenputz', title: 'Gipsputz zweilagig (Unter- + Oberputz)', unit: 'm²', hint: '23–38 €', defaultPrice: 30.00 },
    { category: 'Putz – Innenputz', title: 'Sanierputz (WTA-konform, bei Feuchteschäden)', unit: 'm²', hint: '38–60 €', defaultPrice: 48.00 },
    { category: 'Putz – Innenputz', title: 'Lehmputz / Lehminnenputz (einlagig)', unit: 'm²', hint: '29–50 €', defaultPrice: 38.00 },
    { category: 'Putz – Innenputz', title: 'Kalkglätte / Putzglätte als Oberputz', unit: 'm²', hint: '10–19 €', defaultPrice: 14.00 },
    { category: 'Putz – Innenputz', title: 'Reibeputz / Strukturputz innen (Körnung 1,5–3mm)', unit: 'm²', hint: '13–24 €', defaultPrice: 18.00 },
    { category: 'Putz – Innenputz', title: 'Laibung verputzen (bis 30cm Tiefe)', unit: 'lfdm', hint: '10–19 €', defaultPrice: 14.00 },
    // Außenputz / Fassade
    { category: 'Putz – Außenputz / Fassade', title: 'Kalk-Zement-Putz außen einlagig (Unterputz)', unit: 'm²', hint: '21–36 €', defaultPrice: 28.00 },
    { category: 'Putz – Außenputz / Fassade', title: 'Kalk-Zement-Putz außen zweilagig (Unter- + Oberputz)', unit: 'm²', hint: '33–53 €', defaultPrice: 42.00 },
    { category: 'Putz – Außenputz / Fassade', title: 'Mineralischer Edelputz / Oberputz außen', unit: 'm²', hint: '16–29 €', defaultPrice: 22.00 },
    { category: 'Putz – Außenputz / Fassade', title: 'Kunstharzputz außen (Silikonharzputz)', unit: 'm²', hint: '19–34 €', defaultPrice: 26.00 },
    { category: 'Putz – Außenputz / Fassade', title: 'Sockelputz / Kelleraußenputz (Sperrputz)', unit: 'm²', hint: '28–50 €', defaultPrice: 38.00 },
    // WDVS
    { category: 'Putz – WDVS', title: 'WDVS komplett (EPS 80mm, inkl. Armierung + Putz)', unit: 'm²', hint: '75–118 €', defaultPrice: 95.00 },
    { category: 'Putz – WDVS', title: 'WDVS komplett (EPS 120mm, inkl. Armierung + Putz)', unit: 'm²', hint: '90–144 €', defaultPrice: 115.00 },
    { category: 'Putz – WDVS', title: 'WDVS komplett (Mineralwolle 100mm, nicht brennbar)', unit: 'm²', hint: '110–175 €', defaultPrice: 140.00 },
    { category: 'Putz – WDVS', title: 'Dämmplatte EPS / Mineralwolle kleben + dübeln', unit: 'm²', hint: '26–46 €', defaultPrice: 35.00 },
    { category: 'Putz – WDVS', title: 'Armierungsschicht aufbringen (Kleber + Gewebe)', unit: 'm²', hint: '13–24 €', defaultPrice: 18.00 },
    // Altputz entfernen
    { category: 'Putz – Altputz entfernen', title: 'Altputz abstemmen (innen, einlagig)', unit: 'm²', hint: '13–24 €', defaultPrice: 18.00 },
    { category: 'Putz – Altputz entfernen', title: 'Altputz abstemmen (innen, mehrlagig)', unit: 'm²', hint: '21–36 €', defaultPrice: 28.00 },
    { category: 'Putz – Altputz entfernen', title: 'Altputz abstemmen (außen / Fassade)', unit: 'm²', hint: '16–29 €', defaultPrice: 22.00 },
    // Spachtelung
    { category: 'Putz – Spachtelung', title: 'Fläche spachteln (Q2)', unit: 'm²', hint: '10–19 €', defaultPrice: 14.00 },
    { category: 'Putz – Spachtelung', title: 'Fläche feinspachteln (Q3, streichfertig)', unit: 'm²', hint: '16–29 €', defaultPrice: 22.00 },
    { category: 'Putz – Spachtelung', title: 'Fläche glätten (Q4, Hochglatt)', unit: 'm²', hint: '24–42 €', defaultPrice: 32.00 },
    { category: 'Putz – Spachtelung', title: 'Putz ausbessern (Fehlstellen, Schadstellen)', unit: 'm²', hint: '21–36 €', defaultPrice: 28.00 },
    // Stuck Dekorativ
    { category: 'Stuck – Dekorativ', title: 'Stuckleiste montieren (PU-Hartschaum, einfach)', unit: 'lfdm', hint: '13–24 €', defaultPrice: 18.00 },
    { category: 'Stuck – Dekorativ', title: 'Stuckleiste montieren (PU-Hartschaum, profiliert)', unit: 'lfdm', hint: '21–36 €', defaultPrice: 28.00 },
    { category: 'Stuck – Dekorativ', title: 'Stuckleiste montieren (Gips, einfach)', unit: 'lfdm', hint: '18–33 €', defaultPrice: 25.00 },
    { category: 'Stuck – Dekorativ', title: 'Deckenrosette montieren (PU / Gips, Fertigteil)', unit: 'Stück', hint: '40–72 €', defaultPrice: 55.00 },
    { category: 'Stuck – Dekorativ', title: 'Deckenrosette montieren (groß, >50cm)', unit: 'Stück', hint: '68–116 €', defaultPrice: 90.00 },
    { category: 'Stuck – Dekorativ', title: 'Deckenspiegel / Rahmenfeld (Stuckleisten)', unit: 'Stück', hint: '90–155 €', defaultPrice: 120.00 },
    { category: 'Stuck – Dekorativ', title: 'LED-Stuckleiste montieren (inkl. LED-Profil)', unit: 'lfdm', hint: '26–46 €', defaultPrice: 35.00 },
    // Stuck Restaurierung
    { category: 'Stuck – Restaurierung', title: 'Stuckprofil ergänzen / rekonstruieren (nach Original)', unit: 'lfdm', hint: '90–155 €', defaultPrice: 120.00 },
    { category: 'Stuck – Restaurierung', title: 'Stuckelement restaurieren (freie Modellierung)', unit: 'Stunde', hint: '72–120 €', defaultPrice: 95.00 },
    { category: 'Stuck – Restaurierung', title: 'Stuck-Reproduktion nach Abformung herstellen + montieren', unit: 'Stück', hint: '165–280 €', defaultPrice: 220.00 },
    // Stundenleistungen
    { category: 'Putz – Stundenleistungen', title: 'Regiearbeit Geselle Stuckateur / Putzer', unit: 'Stunde', hint: '52–80 €', defaultPrice: 65.00 },
    { category: 'Putz – Stundenleistungen', title: 'Regiearbeit Meister / Restaurator', unit: 'Stunde', hint: '72–112 €', defaultPrice: 90.00 },
    { category: 'Putz – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–155 €', defaultPrice: 120.00 },
  ],

  estrich: [
    // Altestrich entfernen
    { category: 'Estrich – Altestrich entfernen', title: 'Altestrich abstemmen (bis 60mm)', unit: 'm²', hint: '18–28 €', defaultPrice: 22.00 },
    { category: 'Estrich – Altestrich entfernen', title: 'Estrichschutt entsorgen (Container)', unit: 'm³', hint: '70–100 €', defaultPrice: 85.00 },
    // Untergrundvorbereitung
    { category: 'Estrich – Untergrundvorbereitung', title: 'Untergrund grundieren (Haftbrücke)', unit: 'm²', hint: '3–7 €', defaultPrice: 5.00 },
    { category: 'Estrich – Untergrundvorbereitung', title: 'Schüttung einbringen (Blähton / Perlite)', unit: 'm²', hint: '18–28 €', defaultPrice: 22.00 },
    // Dämmung & Trennlagen
    { category: 'Estrich – Dämmung & Trennlagen', title: 'Trittschalldämmung verlegen (bis 20mm)', unit: 'm²', hint: '7–12 €', defaultPrice: 9.00 },
    { category: 'Estrich – Dämmung & Trennlagen', title: 'Wärmedämmung verlegen (EPS, bis 60mm)', unit: 'm²', hint: '11–18 €', defaultPrice: 14.00 },
    { category: 'Estrich – Dämmung & Trennlagen', title: 'PE-Folie / Trennlage verlegen', unit: 'm²', hint: '2–4 €', defaultPrice: 3.00 },
    // Zementestrich
    { category: 'Estrich – Zementestrich', title: 'Zementestrich schwimmend (CT-C25-F4, 60mm)', unit: 'm²', hint: '22–35 €', defaultPrice: 28.00 },
    { category: 'Estrich – Zementestrich', title: 'Zementestrich Verbundestrich (40mm)', unit: 'm²', hint: '19–30 €', defaultPrice: 24.00 },
    { category: 'Estrich – Zementestrich', title: 'Zementestrich Heizestrich auf FBH (65mm)', unit: 'm²', hint: '28–44 €', defaultPrice: 35.00 },
    { category: 'Estrich – Zementestrich', title: 'Zementestrich Außenbereich / Garage (80mm)', unit: 'm²', hint: '30–48 €', defaultPrice: 38.00 },
    // Anhydritestrich
    { category: 'Estrich – Anhydritestrich', title: 'Anhydrit-Fließestrich schwimmend (50mm)', unit: 'm²', hint: '26–40 €', defaultPrice: 32.00 },
    { category: 'Estrich – Anhydritestrich', title: 'Anhydrit-Fließestrich Heizestrich auf FBH (45mm)', unit: 'm²', hint: '29–44 €', defaultPrice: 36.00 },
    { category: 'Estrich – Anhydritestrich', title: 'Anhydrit-Fließestrich großflächig (>200m²)', unit: 'm²', hint: '22–35 €', defaultPrice: 28.00 },
    // Schnellestrich
    { category: 'Estrich – Schnellestrich', title: 'Schnellestrich Zementbasis (belegreif nach 7 Tagen)', unit: 'm²', hint: '40–58 €', defaultPrice: 48.00 },
    { category: 'Estrich – Schnellestrich', title: 'Schnellestrich ultra (belegreif nach 24–48h)', unit: 'm²', hint: '62–90 €', defaultPrice: 75.00 },
    // Gefälleestrich
    { category: 'Estrich – Gefälleestrich', title: 'Gefälleestrich Dusche / ebenerdige Dusche', unit: 'Pauschale', hint: '300–460 €', defaultPrice: 380.00 },
    { category: 'Estrich – Gefälleestrich', title: 'Gefälleestrich Balkon / Terrasse', unit: 'm²', hint: '44–68 €', defaultPrice: 55.00 },
    // Fußbodenheizung
    { category: 'Estrich – Fußbodenheizung', title: 'FBH Tackersystem verlegen (inkl. Clips)', unit: 'm²', hint: '17–28 €', defaultPrice: 22.00 },
    { category: 'Estrich – Fußbodenheizung', title: 'FBH Noppensystem verlegen', unit: 'm²', hint: '22–36 €', defaultPrice: 28.00 },
    { category: 'Estrich – Fußbodenheizung', title: 'Aufheizprotokoll erstellen (DIN EN 1264)', unit: 'Pauschale', hint: '75–120 €', defaultPrice: 95.00 },
    // Ausgleich & Spachtelung
    { category: 'Estrich – Ausgleich & Spachtelung', title: 'Ausgleichsmasse dünn (bis 5mm)', unit: 'm²', hint: '9–16 €', defaultPrice: 12.00 },
    { category: 'Estrich – Ausgleich & Spachtelung', title: 'Ausgleichsmasse mittelstark (5–20mm)', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Estrich – Ausgleich & Spachtelung', title: 'Ausgleichsmasse stark (20–50mm)', unit: 'm²', hint: '22–36 €', defaultPrice: 28.00 },
    { category: 'Estrich – Ausgleich & Spachtelung', title: 'Estrichoberfläche schleifen / egalisieren', unit: 'm²', hint: '6–11 €', defaultPrice: 8.00 },
    // Messungen & Protokolle
    { category: 'Estrich – Messungen & Protokolle', title: 'CM-Feuchtemessung mit Protokoll (Belegreifnachweis)', unit: 'Messung', hint: '45–70 €', defaultPrice: 55.00 },
    // Erschwernisse
    { category: 'Estrich – Erschwernisse & Zuschläge', title: 'Mindermengenzuschlag (Fläche <50 m²)', unit: 'Pauschale', hint: '120–200 €', defaultPrice: 150.00 },
    { category: 'Estrich – Erschwernisse & Zuschläge', title: 'Zuschlag bewohnte Wohnung / eingeschränkter Zugang', unit: 'Pauschale', hint: '70–120 €', defaultPrice: 90.00 },
    // Stundenleistungen
    { category: 'Estrich – Stundenleistungen', title: 'Regiearbeit Geselle Estrichleger', unit: 'Stunde', hint: '52–75 €', defaultPrice: 62.00 },
    { category: 'Estrich – Stundenleistungen', title: 'Regiearbeit Meister / Bauleiter', unit: 'Stunde', hint: '68–95 €', defaultPrice: 80.00 },
    { category: 'Estrich – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '150–220 €', defaultPrice: 180.00 },
  ],

  elektro: [
    // Stemmen & Rohre
    { category: 'Elektro – Stemmen & Rohre', title: 'Wandschlitz stemmen (UP, bis 20mm)', unit: 'lfdm', hint: '6–11 €', defaultPrice: 8.00 },
    { category: 'Elektro – Stemmen & Rohre', title: 'Wandschlitz fräsen (maschinell)', unit: 'lfdm', hint: '8–14 €', defaultPrice: 10.00 },
    { category: 'Elektro – Stemmen & Rohre', title: 'Unterputzrohr verlegen (M16/M20)', unit: 'lfdm', hint: '3–6 €', defaultPrice: 4.50 },
    { category: 'Elektro – Stemmen & Rohre', title: 'Kabelkanal aufputz montieren', unit: 'lfdm', hint: '5–9 €', defaultPrice: 6.00 },
    { category: 'Elektro – Stemmen & Rohre', title: 'Unterputzdose setzen', unit: 'Stück', hint: '6–12 €', defaultPrice: 8.00 },
    // Leitungen & Kabel
    { category: 'Elektro – Leitungen & Kabel', title: 'NYM-Leitung 3x1,5mm² verlegen (Licht)', unit: 'lfdm', hint: '3–6 €', defaultPrice: 4.50 },
    { category: 'Elektro – Leitungen & Kabel', title: 'NYM-Leitung 3x2,5mm² verlegen (Steckdosen)', unit: 'lfdm', hint: '4–7 €', defaultPrice: 5.00 },
    { category: 'Elektro – Leitungen & Kabel', title: 'NYM-Leitung 5x6mm² verlegen (Wallbox / WP)', unit: 'lfdm', hint: '9–14 €', defaultPrice: 11.00 },
    { category: 'Elektro – Leitungen & Kabel', title: 'Datenkabel CAT 6 / CAT 7 verlegen', unit: 'lfdm', hint: '4–7 €', defaultPrice: 5.00 },
    { category: 'Elektro – Leitungen & Kabel', title: 'Erdkabel NYY verlegen (Außen)', unit: 'lfdm', hint: '7–12 €', defaultPrice: 9.00 },
    { category: 'Elektro – Leitungen & Kabel', title: 'Erdkabel graben (80cm tief, inkl. Sandbett)', unit: 'lfdm', hint: '18–28 €', defaultPrice: 22.00 },
    // Unterverteilung
    { category: 'Elektro – Unterverteilung', title: 'Unterverteilung komplett neu (8–12 Stromkreise)', unit: 'Pauschale', hint: '800–1.200 €', defaultPrice: 950.00 },
    { category: 'Elektro – Unterverteilung', title: 'Unterverteilung komplett neu (12–18 Stromkreise)', unit: 'Pauschale', hint: '1.100–1.600 €', defaultPrice: 1350.00 },
    { category: 'Elektro – Unterverteilung', title: 'Unterverteilung erweitern / Stromkreis nachrüsten', unit: 'Stück', hint: '95–150 €', defaultPrice: 120.00 },
    { category: 'Elektro – Unterverteilung', title: 'FI-Schutzschalter (RCD 30mA) einbauen', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    { category: 'Elektro – Unterverteilung', title: 'Leitungsschutzschalter (LS) einbauen / tauschen', unit: 'Stück', hint: '25–50 €', defaultPrice: 35.00 },
    // Steckdosen & Schalter
    { category: 'Elektro – Steckdosen & Schalter', title: 'Steckdose setzen unterputz', unit: 'Stück', hint: '52–82 €', defaultPrice: 65.00 },
    { category: 'Elektro – Steckdosen & Schalter', title: 'Doppelsteckdose setzen unterputz', unit: 'Stück', hint: '60–95 €', defaultPrice: 75.00 },
    { category: 'Elektro – Steckdosen & Schalter', title: 'Außensteckdose (IP44/IP65)', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    { category: 'Elektro – Steckdosen & Schalter', title: 'Lichtschalter setzen unterputz', unit: 'Stück', hint: '42–70 €', defaultPrice: 55.00 },
    { category: 'Elektro – Steckdosen & Schalter', title: 'Dimmer einbauen (UP, für LED)', unit: 'Stück', hint: '65–110 €', defaultPrice: 85.00 },
    { category: 'Elektro – Steckdosen & Schalter', title: 'Bewegungsmelder / Präsenzmelder einbauen', unit: 'Stück', hint: '65–110 €', defaultPrice: 85.00 },
    { category: 'Elektro – Steckdosen & Schalter', title: 'Drehstromsteckdose (CEE 16A / 32A) setzen', unit: 'Stück', hint: '95–155 €', defaultPrice: 120.00 },
    // Beleuchtung
    { category: 'Elektro – Beleuchtung', title: 'Deckenleuchte anschließen (Bestandsdose)', unit: 'Stück', hint: '42–70 €', defaultPrice: 55.00 },
    { category: 'Elektro – Beleuchtung', title: 'Deckenauslass neu setzen + Leuchte anschließen', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    { category: 'Elektro – Beleuchtung', title: 'Einbaustrahler / LED-Spot einbauen (je Spot)', unit: 'Stück', hint: '35–58 €', defaultPrice: 45.00 },
    { category: 'Elektro – Beleuchtung', title: 'Außenleuchte montieren + anschließen', unit: 'Stück', hint: '65–110 €', defaultPrice: 85.00 },
    // Küche & Geräte
    { category: 'Elektro – Küche & Geräte', title: 'Herdanschluss / Cerankochfeld anschließen (16A)', unit: 'Stück', hint: '95–155 €', defaultPrice: 120.00 },
    { category: 'Elektro – Küche & Geräte', title: 'Geschirrspüler / Waschmaschine anschließen', unit: 'Stück', hint: '60–95 €', defaultPrice: 75.00 },
    // Bad & Nassbereiche
    { category: 'Elektro – Bad & Nassbereiche', title: 'Badezimmer Stromkreis (FI-Pflicht) einrichten', unit: 'Pauschale', hint: '140–230 €', defaultPrice: 180.00 },
    { category: 'Elektro – Bad & Nassbereiche', title: 'Elektro-Durchlauferhitzer anschließen', unit: 'Stück', hint: '95–155 €', defaultPrice: 120.00 },
    { category: 'Elektro – Bad & Nassbereiche', title: 'Elektro-Fußbodenheizung anschließen', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    // Wallbox & E-Mobilität
    { category: 'Elektro – Wallbox & E-Mobilität', title: 'Wallbox 11kW montieren + anschließen (bis 10m)', unit: 'Stück', hint: '520–820 €', defaultPrice: 650.00 },
    { category: 'Elektro – Wallbox & E-Mobilität', title: 'Wallbox 22kW montieren + anschließen (bis 10m)', unit: 'Stück', hint: '620–960 €', defaultPrice: 780.00 },
    { category: 'Elektro – Wallbox & E-Mobilität', title: 'Wallbox-Unterverteilung inkl. FI + LS einbauen', unit: 'Pauschale', hint: '250–400 €', defaultPrice: 320.00 },
    // Photovoltaik
    { category: 'Elektro – Photovoltaik & Speicher', title: 'PV-Anlage elektrisch anschließen (bis 10 kWp)', unit: 'Pauschale', hint: '680–1.050 €', defaultPrice: 850.00 },
    { category: 'Elektro – Photovoltaik & Speicher', title: 'Wechselrichter montieren + anschließen', unit: 'Stück', hint: '220–360 €', defaultPrice: 280.00 },
    { category: 'Elektro – Photovoltaik & Speicher', title: 'Batteriespeicher anschließen + einrichten', unit: 'Stück', hint: '300–480 €', defaultPrice: 380.00 },
    // Sicherheitstechnik
    { category: 'Elektro – Sicherheitstechnik', title: 'Rauchwarnmelder montieren + anschließen (vernetzt)', unit: 'Stück', hint: '35–58 €', defaultPrice: 45.00 },
    { category: 'Elektro – Sicherheitstechnik', title: 'Überwachungskamera (IP, PoE) montieren', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    // Prüfung & Abnahme
    { category: 'Elektro – Prüfung & Abnahme', title: 'E-Check Wohnung (VDE 0100-600)', unit: 'Pauschale', hint: '175–275 €', defaultPrice: 220.00 },
    { category: 'Elektro – Prüfung & Abnahme', title: 'Erstprüfung Neuanlage mit Protokoll', unit: 'Pauschale', hint: '220–360 €', defaultPrice: 280.00 },
    // Stundenleistungen
    { category: 'Elektro – Stundenleistungen', title: 'Regiearbeit Elektriker-Geselle', unit: 'Stunde', hint: '62–85 €', defaultPrice: 72.00 },
    { category: 'Elektro – Stundenleistungen', title: 'Regiearbeit Elektriker-Meister', unit: 'Stunde', hint: '80–108 €', defaultPrice: 92.00 },
    { category: 'Elektro – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–155 €', defaultPrice: 120.00 },
  ],

  sanitär: [
    // Rückbau
    { category: 'SHK – Vorbereitung & Rückbau', title: 'Altbadewanne demontieren und entsorgen', unit: 'Stück', hint: '95–150 €', defaultPrice: 120.00 },
    { category: 'SHK – Vorbereitung & Rückbau', title: 'Alt-WC demontieren und entsorgen', unit: 'Stück', hint: '65–110 €', defaultPrice: 85.00 },
    { category: 'SHK – Vorbereitung & Rückbau', title: 'Alte Heizungsanlage / Kessel demontieren', unit: 'Pauschale', hint: '360–560 €', defaultPrice: 450.00 },
    // Rohrleitungen Trinkwasser
    { category: 'SHK – Rohrleitungen Trinkwasser', title: 'Trinkwasserleitung Kupfer DN 15 (1/2") verlegen', unit: 'lfdm', hint: '17–28 €', defaultPrice: 22.00 },
    { category: 'SHK – Rohrleitungen Trinkwasser', title: 'Trinkwasserleitung Kupfer DN 22 (3/4") verlegen', unit: 'lfdm', hint: '22–36 €', defaultPrice: 28.00 },
    { category: 'SHK – Rohrleitungen Trinkwasser', title: 'Trinkwasserleitung MLCP DN 16 verlegen', unit: 'lfdm', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'SHK – Rohrleitungen Trinkwasser', title: 'Absperrventil / Kugelhahn einbauen (bis DN 25)', unit: 'Stück', hint: '35–58 €', defaultPrice: 45.00 },
    { category: 'SHK – Rohrleitungen Trinkwasser', title: 'Druckminderer einbauen und einstellen', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    { category: 'SHK – Rohrleitungen Trinkwasser', title: 'Druckprüfung Trinkwasseranlage mit Protokoll', unit: 'Pauschale', hint: '95–155 €', defaultPrice: 120.00 },
    // Abwasser
    { category: 'SHK – Abwasser & Abfluss', title: 'Abwasserrohr HT-PP DN 110 (Fallrohr) verlegen', unit: 'lfdm', hint: '24–38 €', defaultPrice: 30.00 },
    { category: 'SHK – Abwasser & Abfluss', title: 'Rückstauventil einbauen (Pflicht EG)', unit: 'Stück', hint: '220–360 €', defaultPrice: 280.00 },
    { category: 'SHK – Abwasser & Abfluss', title: 'Duschrinne / Bodenebener Ablauf einbauen', unit: 'Stück', hint: '95–155 €', defaultPrice: 120.00 },
    { category: 'SHK – Abwasser & Abfluss', title: 'Rohrreinigung mit Hochdruckspülung', unit: 'Pauschale', hint: '220–360 €', defaultPrice: 280.00 },
    // WC & Vorwand
    { category: 'SHK – WC & Vorwandinstallation', title: 'Wand-WC anschließen und montieren', unit: 'Stück', hint: '140–230 €', defaultPrice: 180.00 },
    { category: 'SHK – WC & Vorwandinstallation', title: 'Vorwandelement / WC-Trägersystem montieren', unit: 'Stück', hint: '220–360 €', defaultPrice: 280.00 },
    { category: 'SHK – WC & Vorwandinstallation', title: 'Unterputzspülkasten einbauen', unit: 'Stück', hint: '140–230 €', defaultPrice: 180.00 },
    // Waschbecken
    { category: 'SHK – Waschbecken & Waschtisch', title: 'Waschbecken anschließen und montieren', unit: 'Stück', hint: '125–200 €', defaultPrice: 160.00 },
    { category: 'SHK – Waschbecken & Waschtisch', title: 'Waschtisch-Armatur (Einhebelmischer) montieren', unit: 'Stück', hint: '50–85 €', defaultPrice: 65.00 },
    { category: 'SHK – Waschbecken & Waschtisch', title: 'Spülbecken Küche anschließen und montieren', unit: 'Stück', hint: '115–185 €', defaultPrice: 145.00 },
    // Dusche & Badewanne
    { category: 'SHK – Dusche & Badewanne', title: 'Duschwanne anschließen und montieren (inkl. Ablauf)', unit: 'Stück', hint: '175–280 €', defaultPrice: 220.00 },
    { category: 'SHK – Dusche & Badewanne', title: 'Bodengleiche Dusche einbauen (inkl. Gefälleestrich)', unit: 'Pauschale', hint: '600–950 €', defaultPrice: 750.00 },
    { category: 'SHK – Dusche & Badewanne', title: 'Duscharmatur / Thermostatarmatur montieren', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    { category: 'SHK – Dusche & Badewanne', title: 'Badewanne eingebaut anschließen und montieren', unit: 'Stück', hint: '200–320 €', defaultPrice: 250.00 },
    // Warmwasser
    { category: 'SHK – Warmwasserbereitung', title: 'Warmwasserspeicher montieren (bis 150L)', unit: 'Stück', hint: '220–360 €', defaultPrice: 280.00 },
    { category: 'SHK – Warmwasserbereitung', title: 'Warmwasserspeicher montieren (150–300L)', unit: 'Stück', hint: '300–480 €', defaultPrice: 380.00 },
    { category: 'SHK – Warmwasserbereitung', title: 'Zirkulationspumpe einbauen und einstellen', unit: 'Stück', hint: '140–230 €', defaultPrice: 180.00 },
    // Heizkörper
    { category: 'SHK – Heizkörper', title: 'Heizkörper (Plattenheizkörper) montieren und anschließen', unit: 'Stück', hint: '140–230 €', defaultPrice: 180.00 },
    { category: 'SHK – Heizkörper', title: 'Handtuchheizkörper montieren und anschließen', unit: 'Stück', hint: '155–250 €', defaultPrice: 195.00 },
    { category: 'SHK – Heizkörper', title: 'Thermostatventil einbauen / tauschen', unit: 'Stück', hint: '42–70 €', defaultPrice: 55.00 },
    { category: 'SHK – Heizkörper', title: 'Hydraulischer Abgleich gesamt (Verfahren B, Protokoll)', unit: 'Pauschale', hint: '520–820 €', defaultPrice: 650.00 },
    // Fußbodenheizung
    { category: 'SHK – Fußbodenheizung', title: 'Fußbodenheizung Tackersystem verlegen', unit: 'm²', hint: '17–28 €', defaultPrice: 22.00 },
    { category: 'SHK – Fußbodenheizung', title: 'Heizkreisverteiler montieren (bis 6 Kreise)', unit: 'Stück', hint: '220–360 €', defaultPrice: 280.00 },
    // Gasheizung
    { category: 'SHK – Gasheizung', title: 'Gas-Brennwerttherme montieren und anschließen (Wandgerät)', unit: 'Stück', hint: '520–820 €', defaultPrice: 650.00 },
    { category: 'SHK – Gasheizung', title: 'Gasanschluss herstellen (Inneninstallation, DVGW)', unit: 'Pauschale', hint: '280–440 €', defaultPrice: 350.00 },
    { category: 'SHK – Gasheizung', title: 'Gasdichtigkeitsprüfung mit Protokoll', unit: 'Pauschale', hint: '120–190 €', defaultPrice: 150.00 },
    { category: 'SHK – Gasheizung', title: 'Gasheizung in Betrieb nehmen (Einregulierung)', unit: 'Pauschale', hint: '175–280 €', defaultPrice: 220.00 },
    // Wärmepumpe
    { category: 'SHK – Wärmepumpe', title: 'Luft-Wasser-WP Außengerät aufstellen + anschließen', unit: 'Stück', hint: '950–1.500 €', defaultPrice: 1200.00 },
    { category: 'SHK – Wärmepumpe', title: 'Luft-Wasser-WP Innengerät montieren + anschließen', unit: 'Stück', hint: '750–1.200 €', defaultPrice: 950.00 },
    { category: 'SHK – Wärmepumpe', title: 'Wärmepumpe in Betrieb nehmen (Protokoll)', unit: 'Pauschale', hint: '280–440 €', defaultPrice: 350.00 },
    // Lüftung & Klima
    { category: 'SHK – Lüftung & Klima', title: 'Badlüfter / Abluftventilatoren einbauen', unit: 'Stück', hint: '65–110 €', defaultPrice: 85.00 },
    { category: 'SHK – Lüftung & Klima', title: 'Split-Klimaanlage Innengerät montieren + anschließen', unit: 'Stück', hint: '220–360 €', defaultPrice: 280.00 },
    { category: 'SHK – Lüftung & Klima', title: 'Split-Klimaanlage Außengerät + Kältemittelleitung', unit: 'Stück', hint: '250–400 €', defaultPrice: 320.00 },
    // Wartung
    { category: 'SHK – Wartung & Inspektion', title: 'Gasheizung Jahreswartung (inkl. Protokoll)', unit: 'Pauschale', hint: '175–280 €', defaultPrice: 220.00 },
    { category: 'SHK – Wartung & Inspektion', title: 'Wärmepumpe Jahreswartung (inkl. Protokoll)', unit: 'Pauschale', hint: '200–320 €', defaultPrice: 250.00 },
    // Stundenleistungen
    { category: 'SHK – Stundenleistungen', title: 'Regiearbeit Geselle SHK', unit: 'Stunde', hint: '68–95 €', defaultPrice: 78.00 },
    { category: 'SHK – Stundenleistungen', title: 'Regiearbeit Meister SHK / Gasinstallateur', unit: 'Stunde', hint: '85–115 €', defaultPrice: 98.00 },
    { category: 'SHK – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '120–190 €', defaultPrice: 150.00 },
  ],

  schreiner: [
    // Innentüren & Zargen
    { category: 'Schreiner – Innentüren & Zargen', title: 'Innentür (CPL / Folie) inkl. Zarge montieren', unit: 'Stück', hint: '300–480 €', defaultPrice: 380.00 },
    { category: 'Schreiner – Innentüren & Zargen', title: 'Innentür Massivholz inkl. Zarge montieren', unit: 'Stück', hint: '460–740 €', defaultPrice: 580.00 },
    { category: 'Schreiner – Innentüren & Zargen', title: 'Schiebetür (Wandeinschub) montieren', unit: 'Stück', hint: '410–660 €', defaultPrice: 520.00 },
    { category: 'Schreiner – Innentüren & Zargen', title: 'Brandschutztür T30 einbauen', unit: 'Stück', hint: '750–1.200 €', defaultPrice: 950.00 },
    { category: 'Schreiner – Innentüren & Zargen', title: 'Türblatt nachhängen / justieren (Bestandszarge)', unit: 'Stück', hint: '75–120 €', defaultPrice: 95.00 },
    { category: 'Schreiner – Innentüren & Zargen', title: 'Türschloss / Schlosskasten tauschen', unit: 'Stück', hint: '60–95 €', defaultPrice: 75.00 },
    // Außentüren & Haustür
    { category: 'Schreiner – Außentüren & Haustür', title: 'Haustür Holz einbauen (inkl. Zarge, Beschläge)', unit: 'Stück', hint: '780–1.250 €', defaultPrice: 980.00 },
    { category: 'Schreiner – Außentüren & Haustür', title: 'Kellertür / Nebeneingangstür einbauen', unit: 'Stück', hint: '540–870 €', defaultPrice: 680.00 },
    // Fenster
    { category: 'Schreiner – Fenster', title: 'Holzfenster einflügelig einbauen', unit: 'Stück', hint: '380–610 €', defaultPrice: 480.00 },
    { category: 'Schreiner – Fenster', title: 'Holzfenster zweiflügelig einbauen', unit: 'Stück', hint: '540–870 €', defaultPrice: 680.00 },
    { category: 'Schreiner – Fenster', title: 'Fensterbank innen (Holz / MDF) montieren', unit: 'lfdm', hint: '50–85 €', defaultPrice: 65.00 },
    { category: 'Schreiner – Fenster', title: 'Holzfenster schleifen und neu lackieren', unit: 'Stück', hint: '220–360 €', defaultPrice: 280.00 },
    // Einbauschränke
    { category: 'Schreiner – Einbauschränke', title: 'Einbauschrank einfach (Spanplatte / MDF, je m² Frontfläche)', unit: 'm²', hint: '300–480 €', defaultPrice: 380.00 },
    { category: 'Schreiner – Einbauschränke', title: 'Einbauschrank mittel (furniert / lackiert)', unit: 'm²', hint: '440–700 €', defaultPrice: 550.00 },
    { category: 'Schreiner – Einbauschränke', title: 'Dachschrägenschrank / Nischenschrank', unit: 'm²', hint: '520–830 €', defaultPrice: 650.00 },
    { category: 'Schreiner – Einbauschränke', title: 'Garderobenschrank Maßanfertigung (je lfdm)', unit: 'lfdm', hint: '540–870 €', defaultPrice: 680.00 },
    { category: 'Schreiner – Einbauschränke', title: 'IKEA-Schrank / Serienmöbel montieren (nur Montage)', unit: 'Stunde', hint: '52–82 €', defaultPrice: 65.00 },
    // Küche nach Maß
    { category: 'Schreiner – Küche nach Maß', title: 'Küche Planung + Fertigung + Montage (einfach, je lfdm)', unit: 'lfdm', hint: '1.400–2.200 €', defaultPrice: 1800.00 },
    { category: 'Schreiner – Küche nach Maß', title: 'Küche Planung + Fertigung + Montage (mittel, je lfdm)', unit: 'lfdm', hint: '2.200–3.500 €', defaultPrice: 2800.00 },
    { category: 'Schreiner – Küche nach Maß', title: 'Küchenmontage (nur Montage Kundenware, je lfdm)', unit: 'lfdm', hint: '95–155 €', defaultPrice: 120.00 },
    { category: 'Schreiner – Küche nach Maß', title: 'Küchenarbeitsplatte Holz einpassen + montieren', unit: 'lfdm', hint: '220–360 €', defaultPrice: 280.00 },
    // Möbel nach Maß
    { category: 'Schreiner – Möbel nach Maß', title: 'Regal nach Maß (Wandregal, einfach, je m²)', unit: 'm²', hint: '255–410 €', defaultPrice: 320.00 },
    { category: 'Schreiner – Möbel nach Maß', title: 'Wohnwand / Schrankwand Maßanfertigung', unit: 'm²', hint: '460–740 €', defaultPrice: 580.00 },
    { category: 'Schreiner – Möbel nach Maß', title: 'Schreibtisch nach Maß (Massivholz / MDF)', unit: 'Stück', hint: '780–1.250 €', defaultPrice: 980.00 },
    { category: 'Schreiner – Möbel nach Maß', title: 'Esstisch nach Maß (Massivholz)', unit: 'Stück', hint: '1.100–1.800 €', defaultPrice: 1400.00 },
    { category: 'Schreiner – Möbel nach Maß', title: 'Badmöbel / Waschtischunterbau nach Maß', unit: 'Stück', hint: '680–1.080 €', defaultPrice: 850.00 },
    // Treppen
    { category: 'Schreiner – Treppen', title: 'Holztreppe Massiv (gerade, bis 10 Stufen)', unit: 'Pauschale', hint: '4.400–7.000 €', defaultPrice: 5500.00 },
    { category: 'Schreiner – Treppen', title: 'Treppenstufe Holz montieren / ersetzen', unit: 'Stück', hint: '140–230 €', defaultPrice: 180.00 },
    { category: 'Schreiner – Treppen', title: 'Bestandstreppe renovieren (neue Holzstufen)', unit: 'Stück', hint: '175–280 €', defaultPrice: 220.00 },
    { category: 'Schreiner – Treppen', title: 'Treppengeländer Holz montieren (je lfdm)', unit: 'lfdm', hint: '220–360 €', defaultPrice: 280.00 },
    { category: 'Schreiner – Treppen', title: 'Handlauf Holz montieren (je lfdm)', unit: 'lfdm', hint: '95–155 €', defaultPrice: 120.00 },
    // Wand- & Deckenverkleidung
    { category: 'Schreiner – Wand- & Deckenverkleidung', title: 'Wandverkleidung Holz / Paneele (je m²)', unit: 'm²', hint: '65–110 €', defaultPrice: 85.00 },
    { category: 'Schreiner – Wand- & Deckenverkleidung', title: 'Deckenverkleidung Holz / Paneele (je m²)', unit: 'm²', hint: '75–120 €', defaultPrice: 95.00 },
    { category: 'Schreiner – Wand- & Deckenverkleidung', title: 'Lambris / Täfelung montieren (historisch)', unit: 'm²', hint: '115–185 €', defaultPrice: 145.00 },
    // Bodenarbeiten
    { category: 'Schreiner – Bodenarbeiten', title: 'Massivparkett / Dielenboden verlegen', unit: 'm²', hint: '42–70 €', defaultPrice: 55.00 },
    { category: 'Schreiner – Bodenarbeiten', title: 'Parkett abschleifen + versiegeln / ölen', unit: 'm²', hint: '33–54 €', defaultPrice: 42.00 },
    { category: 'Schreiner – Bodenarbeiten', title: 'Sockelleisten Holz montieren', unit: 'lfdm', hint: '9–16 €', defaultPrice: 12.00 },
    // Außenbereich
    { category: 'Schreiner – Außenbereich & Garten', title: 'Terrasse Holz (Lärche / Douglasie) verlegen', unit: 'm²', hint: '65–110 €', defaultPrice: 85.00 },
    { category: 'Schreiner – Außenbereich & Garten', title: 'Überdachung / Pergola Holz montieren', unit: 'm²', hint: '220–360 €', defaultPrice: 280.00 },
    // Restaurierung
    { category: 'Schreiner – Restaurierung & Reparatur', title: 'Möbelreparatur (je Stunde)', unit: 'Stunde', hint: '62–98 €', defaultPrice: 78.00 },
    { category: 'Schreiner – Restaurierung & Reparatur', title: 'Holzfenster aufarbeiten (schleifen + streichen)', unit: 'Stück', hint: '220–360 €', defaultPrice: 280.00 },
    // Stundenleistungen
    { category: 'Schreiner – Stundenleistungen', title: 'Regiearbeit Geselle Schreiner / Tischler', unit: 'Stunde', hint: '55–85 €', defaultPrice: 68.00 },
    { category: 'Schreiner – Stundenleistungen', title: 'Regiearbeit Meister / Restaurator', unit: 'Stunde', hint: '70–110 €', defaultPrice: 88.00 },
    { category: 'Schreiner – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–155 €', defaultPrice: 120.00 },
  ],

  dachdecker: [
    // Gerüst
    { category: 'Dach – Gerüst & Absturzsicherung', title: 'Fassadengerüst stellen + vorhalten (bis 4 Wochen)', unit: 'm²', hint: '11–18 €', defaultPrice: 14.00 },
    // Rückbau
    { category: 'Dach – Rückbau & Entsorgung', title: 'Alte Dachziegel abdecken und entsorgen', unit: 'm²', hint: '14–24 €', defaultPrice: 18.00 },
    { category: 'Dach – Rückbau & Entsorgung', title: 'Asbesthaltige Platten entfernen + Sonderentsorgung', unit: 'm²', hint: '50–85 €', defaultPrice: 65.00 },
    // Dachstuhl
    { category: 'Zimmerei – Dachstuhl', title: 'Dachstuhl Sparrendach errichten (inkl. KVH)', unit: 'm²', hint: '60–95 €', defaultPrice: 75.00 },
    { category: 'Zimmerei – Dachstuhl', title: 'Einzelne Sparren einbauen / austauschen', unit: 'Stück', hint: '140–230 €', defaultPrice: 180.00 },
    { category: 'Zimmerei – Dachstuhl', title: 'Sparren schäften (beschädigter Bereich ergänzen)', unit: 'Stück', hint: '95–155 €', defaultPrice: 120.00 },
    // Schalung & Lattung
    { category: 'Dach – Schalung & Lattung', title: 'Unterspannbahn / Unterdeckbahn verlegen', unit: 'm²', hint: '6–11 €', defaultPrice: 8.00 },
    { category: 'Dach – Schalung & Lattung', title: 'Konterlattung + Dachlattung verlegen', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    // Steildach Eindeckung
    { category: 'Dach – Steildach Eindeckung', title: 'Tondachziegel verlegen (inkl. Lattung + Konterlattung)', unit: 'm²', hint: '60–95 €', defaultPrice: 75.00 },
    { category: 'Dach – Steildach Eindeckung', title: 'Betondachstein verlegen (inkl. Lattung)', unit: 'm²', hint: '52–83 €', defaultPrice: 65.00 },
    { category: 'Dach – Steildach Eindeckung', title: 'Naturschiefer verlegen (Altdeutsche Deckung)', unit: 'm²', hint: '144–230 €', defaultPrice: 180.00 },
    { category: 'Dach – Steildach Eindeckung', title: 'Metalleindeckung Stahl / Aluminium (Stehfalz)', unit: 'm²', hint: '88–140 €', defaultPrice: 110.00 },
    { category: 'Dach – Steildach Eindeckung', title: 'Dacheindeckung reparieren (einzelne Ziegel tauschen)', unit: 'Stück', hint: '17–28 €', defaultPrice: 22.00 },
    { category: 'Dach – Steildach Eindeckung', title: 'Firstziegel verlegen / erneuern', unit: 'lfdm', hint: '28–45 €', defaultPrice: 35.00 },
    // Flachdach
    { category: 'Dach – Flachdach & Abdichtung', title: 'Bitumenbahnen zweilagig verschweißen (Heißverfahren)', unit: 'm²', hint: '44–70 €', defaultPrice: 55.00 },
    { category: 'Dach – Flachdach & Abdichtung', title: 'EPDM-Folie verlegen (1-lagig)', unit: 'm²', hint: '52–83 €', defaultPrice: 65.00 },
    { category: 'Dach – Flachdach & Abdichtung', title: 'Flüssigkunststoff-Abdichtung (PMMA, nahtlos)', unit: 'm²', hint: '68–108 €', defaultPrice: 85.00 },
    { category: 'Dach – Flachdach & Abdichtung', title: 'Extensive Dachbegrünung (Substrat + Pflanzen)', unit: 'm²', hint: '44–70 €', defaultPrice: 55.00 },
    // Dachdämmung
    { category: 'Dach – Dachdämmung', title: 'Zwischensparrendämmung komplett (160mm)', unit: 'm²', hint: '54–86 €', defaultPrice: 68.00 },
    { category: 'Dach – Dachdämmung', title: 'Aufsparrendämmung PU-Hartschaum (120mm)', unit: 'm²', hint: '140–220 €', defaultPrice: 175.00 },
    { category: 'Dach – Dachdämmung', title: 'Oberste Geschossdecke dämmen (nicht begehbar, 160mm)', unit: 'm²', hint: '28–45 €', defaultPrice: 35.00 },
    { category: 'Dach – Dachdämmung', title: 'Einblasdämmung (in bestehende Hohlräume)', unit: 'm²', hint: '22–36 €', defaultPrice: 28.00 },
    // Dachfenster
    { category: 'Dach – Dachfenster & Luken', title: 'Dachflächenfenster einbauen – Standard (78x118cm)', unit: 'Stück', hint: '540–870 €', defaultPrice: 680.00 },
    { category: 'Dach – Dachfenster & Luken', title: 'Dachflächenfenster einbauen – groß (>114x118cm)', unit: 'Stück', hint: '760–1.210 €', defaultPrice: 950.00 },
    { category: 'Dach – Dachfenster & Luken', title: 'Dachflächenfenster austauschen (Bestand)', unit: 'Stück', hint: '440–700 €', defaultPrice: 550.00 },
    // Klempner & Spengler
    { category: 'Dach – Klempner & Spengler', title: 'Dachrinne Zink / Titanzink montieren', unit: 'lfdm', hint: '44–70 €', defaultPrice: 55.00 },
    { category: 'Dach – Klempner & Spengler', title: 'Fallrohr Zink / Aluminium montieren', unit: 'lfdm', hint: '36–57 €', defaultPrice: 45.00 },
    { category: 'Dach – Klempner & Spengler', title: 'Schornsteineinfassung / Kaminkappe Blech', unit: 'Stück', hint: '380–610 €', defaultPrice: 480.00 },
    { category: 'Dach – Klempner & Spengler', title: 'Schneefanggitter montieren', unit: 'lfdm', hint: '30–48 €', defaultPrice: 38.00 },
    // Gauben
    { category: 'Dach – Gauben & Aufbauten', title: 'Schleppgaube herstellen (inkl. Zimmerei + Eindeckung)', unit: 'Stück', hint: '4.400–7.000 €', defaultPrice: 5500.00 },
    { category: 'Dach – Gauben & Aufbauten', title: 'Satteldachgaube herstellen', unit: 'Stück', hint: '6.000–9.600 €', defaultPrice: 7500.00 },
    { category: 'Dach – Gauben & Aufbauten', title: 'Gaube sanieren / Eindeckung erneuern', unit: 'Stück', hint: '2.000–3.200 €', defaultPrice: 2500.00 },
    // Wartung & Inspektion
    { category: 'Dach – Wartung & Inspektion', title: 'Dachinspektion / Dachabnahme (visuell, mit Bericht)', unit: 'Pauschale', hint: '220–360 €', defaultPrice: 280.00 },
    { category: 'Dach – Wartung & Inspektion', title: 'Sturmschaden-Notabdichtung (Plane / Folie sichern)', unit: 'Pauschale', hint: '280–450 €', defaultPrice: 350.00 },
    { category: 'Dach – Wartung & Inspektion', title: 'Einzelne undichte Stelle reparieren', unit: 'Stück', hint: '95–155 €', defaultPrice: 120.00 },
    // Holzfassade
    { category: 'Dach – Holzfassade', title: 'Holzfassade / Holzschalung montieren (vertikal)', unit: 'm²', hint: '65–110 €', defaultPrice: 85.00 },
    { category: 'Dach – Holzfassade', title: 'Faserzement-Fassade / Eternit-Ersatz montieren', unit: 'm²', hint: '60–95 €', defaultPrice: 75.00 },
    // Stundenleistungen
    { category: 'Dach – Stundenleistungen', title: 'Regiearbeit Dachdecker-Geselle', unit: 'Stunde', hint: '60–88 €', defaultPrice: 72.00 },
    { category: 'Dach – Stundenleistungen', title: 'Regiearbeit Dachdecker-Meister', unit: 'Stunde', hint: '75–115 €', defaultPrice: 92.00 },
    { category: 'Dach – Stundenleistungen', title: 'Regiearbeit Zimmerer-Geselle', unit: 'Stunde', hint: '60–95 €', defaultPrice: 75.00 },
    { category: 'Dach – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '140–230 €', defaultPrice: 180.00 },
  ],

  fenster_türen: [
    // Rückbau
    { category: 'Fenster – Rückbau & Demontage', title: 'Altfenster (< 1,5 m²) demontieren inkl. Entsorgung', unit: 'Stück', hint: '45–85 €', defaultPrice: 65.00 },
    { category: 'Fenster – Rückbau & Demontage', title: 'Altfenster (> 1,5 m²) demontieren inkl. Entsorgung', unit: 'Stück', hint: '70–120 €', defaultPrice: 95.00 },
    { category: 'Fenster – Rückbau & Demontage', title: 'Haustür + alte Zarge demontieren inkl. Entsorgung', unit: 'Stück', hint: '130–230 €', defaultPrice: 180.00 },
    // PVC-Fenster
    { category: 'Fenster – Kunststoff (PVC)', title: 'PVC-Fenster 2-fach-Verglasung einbauen (Standard, bis 1,5 m², inkl. Element)', unit: 'Stück', hint: '380–580 €', defaultPrice: 480.00 },
    { category: 'Fenster – Kunststoff (PVC)', title: 'PVC-Fenster 3-fach-Verglasung einbauen (bis 1,5 m², inkl. Element)', unit: 'Stück', hint: '550–820 €', defaultPrice: 680.00 },
    { category: 'Fenster – Kunststoff (PVC)', title: 'PVC-Fenster 3-fach-Verglasung (groß, 1,5–3 m², inkl. Element)', unit: 'Stück', hint: '750–1.150 €', defaultPrice: 950.00 },
    { category: 'Fenster – Kunststoff (PVC)', title: 'PVC-Fenster nur Einbau / Montage (ohne Element, bis 1,5 m²)', unit: 'Stück', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Fenster – Kunststoff (PVC)', title: 'Aufpreis Einbruchschutz RC2 (Beschlag + Verglasung P4A)', unit: 'Stück', hint: '140–220 €', defaultPrice: 180.00 },
    // Alufenster
    { category: 'Fenster – Aluminium', title: 'Alufenster 3-fach-Verglasung einbauen (bis 1,5 m², inkl. Element)', unit: 'Stück', hint: '750–1.150 €', defaultPrice: 950.00 },
    { category: 'Fenster – Aluminium', title: 'Alufenster 3-fach-Verglasung (groß, 1,5–3 m², inkl. Element)', unit: 'Stück', hint: '1.150–1.750 €', defaultPrice: 1450.00 },
    { category: 'Fenster – Aluminium', title: 'Bodentiefes Alu-Fensterelement (>3 m², Sonderformat) einbauen', unit: 'Stück', hint: '1.750–2.650 €', defaultPrice: 2200.00 },
    // Hebe-Schiebe
    { category: 'Fenster – Schiebe & Hebe-Schiebe', title: 'Hebeschiebetür (HST, bis 4 m² Breite, inkl. Element PVC)', unit: 'Stück', hint: '2.200–3.400 €', defaultPrice: 2800.00 },
    { category: 'Fenster – Schiebe & Hebe-Schiebe', title: 'Hebeschiebetür Alu (HST, bis 4 m², inkl. Element)', unit: 'Stück', hint: '3.300–5.100 €', defaultPrice: 4200.00 },
    // Haustür
    { category: 'Türen – Haustür & Außentüren', title: 'Haustür PVC/Kunststoff einbauen (Standard, inkl. Element + Montage)', unit: 'Stück', hint: '1.400–2.200 €', defaultPrice: 1800.00 },
    { category: 'Türen – Haustür & Außentüren', title: 'Haustür Aluminium einbauen (inkl. Element + Montage)', unit: 'Stück', hint: '2.050–3.150 €', defaultPrice: 2600.00 },
    { category: 'Türen – Haustür & Außentüren', title: 'Haustür Holz / Holz-Alu einbauen (inkl. Element + Montage)', unit: 'Stück', hint: '2.500–3.900 €', defaultPrice: 3200.00 },
    { category: 'Türen – Haustür & Außentüren', title: 'Haustür nur Montage (ohne Element, Standardmaß)', unit: 'Stück', hint: '380–580 €', defaultPrice: 480.00 },
    { category: 'Türen – Haustür & Außentüren', title: 'Terrassentür einbauen (einflügelig, PVC, inkl. Element)', unit: 'Stück', hint: '870–1.340 €', defaultPrice: 1100.00 },
    { category: 'Türen – Haustür & Außentüren', title: 'Aufpreis RC2-Zertifizierung (Einbruchschutz)', unit: 'Stück', hint: '270–420 €', defaultPrice: 350.00 },
    // Sicherheitstüren
    { category: 'Türen – Sicherheit & Brandschutz', title: 'Sicherheitstür RC2 (Stahl) einbauen inkl. Zarge', unit: 'Stück', hint: '1.300–2.000 €', defaultPrice: 1650.00 },
    { category: 'Türen – Sicherheit & Brandschutz', title: 'Brandschutztür T30 (Stahl) einbauen inkl. Zarge + Selbstschließer', unit: 'Stück', hint: '1.400–2.200 €', defaultPrice: 1800.00 },
    { category: 'Türen – Sicherheit & Brandschutz', title: 'Mehrfachverriegelung nachrüsten (3-Punkt / 5-Punkt)', unit: 'Stück', hint: '220–340 €', defaultPrice: 280.00 },
    // Innentüren
    { category: 'Türen – Innentüren', title: 'Innentür CPL/Folie inkl. Zarge einbauen (Standard)', unit: 'Stück', hint: '300–460 €', defaultPrice: 380.00 },
    { category: 'Türen – Innentüren', title: 'Schiebetür Innenbereich (Wandeinschub) einbauen', unit: 'Stück', hint: '410–630 €', defaultPrice: 520.00 },
    { category: 'Türen – Innentüren', title: 'Glastür (innen) einbauen inkl. Zarge', unit: 'Stück', hint: '540–820 €', defaultPrice: 680.00 },
    // Garagentor
    { category: 'Türen – Garagentore', title: 'Sektionaltor (Deckentor, Standard bis 2,5×2,25m) einbauen inkl. Element', unit: 'Stück', hint: '1.750–2.650 €', defaultPrice: 2200.00 },
    { category: 'Türen – Garagentore', title: 'Garagentorantrieb elektrisch einbauen / nachrüsten', unit: 'Stück', hint: '380–580 €', defaultPrice: 480.00 },
    // Rollladen & Sonnenschutz
    { category: 'Fenster – Rollladen & Sonnenschutz', title: 'Außenrollladen (elektrisch, 230V) einbauen inkl. Kasten', unit: 'Stück', hint: '460–700 €', defaultPrice: 580.00 },
    { category: 'Fenster – Rollladen & Sonnenschutz', title: 'Rollladen motorisieren (Umbau manuell → elektrisch)', unit: 'Stück', hint: '220–340 €', defaultPrice: 280.00 },
    { category: 'Fenster – Rollladen & Sonnenschutz', title: 'Markise einbauen (Standard, bis 3m Breite)', unit: 'Stück', hint: '515–790 €', defaultPrice: 650.00 },
    { category: 'Fenster – Rollladen & Sonnenschutz', title: 'Insektenschutz / Fliegengitter einbauen (Spannrahmen)', unit: 'Stück', hint: '65–105 €', defaultPrice: 85.00 },
    // Anschluss & Laibung
    { category: 'Fenster – Anschluss & Laibung', title: 'Laibung verputzen (innen, nach Fenstertausch)', unit: 'Stück', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Fenster – Anschluss & Laibung', title: 'Fensterbank innen montieren (PVC / Naturstein / MDF)', unit: 'Stück', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Fenster – Anschluss & Laibung', title: 'Fensterbank außen montieren (Alu / Zink / Naturstein)', unit: 'Stück', hint: '95–145 €', defaultPrice: 120.00 },
    // Reparatur
    { category: 'Fenster – Reparatur & Wartung', title: 'Glasscheibe (Isolierglas) tauschen (bis 1 m²)', unit: 'Stück', hint: '220–340 €', defaultPrice: 280.00 },
    { category: 'Fenster – Reparatur & Wartung', title: 'Fensterbeschlag tauschen (Drehkippbeschlag komplett)', unit: 'Stück', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Fenster – Reparatur & Wartung', title: 'Zylinder / Schließzylinder tauschen', unit: 'Stück', hint: '42–68 €', defaultPrice: 55.00 },
    // Stundenleistungen
    { category: 'Fenster – Stundenleistungen', title: 'Regiearbeit Monteur Fenster / Türen', unit: 'Stunde', hint: '60–88 €', defaultPrice: 72.00 },
    { category: 'Fenster – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–145 €', defaultPrice: 120.00 },
  ],

  entrümpelung: [
    // Räumung nach m²
    { category: 'Entrümpelung – Räumung', title: 'Entrümpelung / Räumung pauschal (je m² Wohnfläche, Normalfall)', unit: 'm²', hint: '10–18 €', defaultPrice: 14.00 },
    { category: 'Entrümpelung – Räumung', title: 'Entrümpelung stark vermüllt / voll möbliert (je m²)', unit: 'm²', hint: '18–32 €', defaultPrice: 25.00 },
    { category: 'Entrümpelung – Räumung', title: 'Messie-Wohnung / Extremfall (je m²)', unit: 'm²', hint: '40–70 €', defaultPrice: 55.00 },
    { category: 'Entrümpelung – Räumung', title: 'Keller entrümpeln (je m²)', unit: 'm²', hint: '13–23 €', defaultPrice: 18.00 },
    { category: 'Entrümpelung – Räumung', title: 'Dachboden entrümpeln (je m²)', unit: 'm²', hint: '15–25 €', defaultPrice: 20.00 },
    { category: 'Entrümpelung – Räumung', title: 'Garage entrümpeln (je m²)', unit: 'm²', hint: '12–20 €', defaultPrice: 16.00 },
    // Haushaltsauflösung Pauschalen
    { category: 'Entrümpelung – Räumung', title: 'Haushaltsauflösung komplett (Wohnung bis 50 m²)', unit: 'Pauschale', hint: '950–1.450 €', defaultPrice: 1200.00 },
    { category: 'Entrümpelung – Räumung', title: 'Haushaltsauflösung komplett (Wohnung bis 80 m²)', unit: 'Pauschale', hint: '1.400–2.200 €', defaultPrice: 1800.00 },
    { category: 'Entrümpelung – Räumung', title: 'Haushaltsauflösung komplett (Haus bis 150 m²)', unit: 'Pauschale', hint: '2.500–3.900 €', defaultPrice: 3200.00 },
    { category: 'Entrümpelung – Räumung', title: 'Haushaltsauflösung komplett (Haus >150 m²)', unit: 'Pauschale', hint: '4.300–6.700 €', defaultPrice: 5500.00 },
    // Einzelpositionen
    { category: 'Entrümpelung – Einzelpositionen', title: 'Möbel demontieren (Schrank, Bett, Regal)', unit: 'Stück', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Entrümpelung – Einzelpositionen', title: 'Einbauküche demontieren und entsorgen', unit: 'lfdm', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Entrümpelung – Einzelpositionen', title: 'Sofa / Couch entsorgen', unit: 'Stück', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Entrümpelung – Einzelpositionen', title: 'Kleiderschrank entsorgen (bis 2m)', unit: 'Stück', hint: '50–80 €', defaultPrice: 65.00 },
    { category: 'Entrümpelung – Einzelpositionen', title: 'Bett / Matratze entsorgen', unit: 'Stück', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Entrümpelung – Einzelpositionen', title: 'Kühlschrank / Gefriergerät entsorgen (FCKW-Entsorgung)', unit: 'Stück', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Entrümpelung – Einzelpositionen', title: 'Klavier / Flügel entsorgen (Sondertransport)', unit: 'Stück', hint: '300–460 €', defaultPrice: 380.00 },
    { category: 'Entrümpelung – Einzelpositionen', title: 'Teppichboden / Laminat entfernen + entsorgen', unit: 'm²', hint: '5–9 €', defaultPrice: 7.00 },
    // Container & Entsorgung
    { category: 'Entrümpelung – Container & Entsorgung', title: 'Container 5 m³ stellen + Abholung + Entsorgung Mischmüll', unit: 'Stück', hint: '220–340 €', defaultPrice: 280.00 },
    { category: 'Entrümpelung – Container & Entsorgung', title: 'Container 7 m³ stellen + Abholung + Entsorgung Mischmüll', unit: 'Stück', hint: '285–435 €', defaultPrice: 360.00 },
    { category: 'Entrümpelung – Container & Entsorgung', title: 'Container 10 m³ stellen + Abholung + Entsorgung', unit: 'Stück', hint: '380–580 €', defaultPrice: 480.00 },
    { category: 'Entrümpelung – Container & Entsorgung', title: 'Entsorgungsfahrt mit Transporter (bis 3 m³ Nutzlast)', unit: 'Fahrt', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Entrümpelung – Container & Entsorgung', title: 'Sondermüll-Entsorgung (Farben, Lösungsmittel, Öle, je kg)', unit: 'kg', hint: '3,50–5,50 €', defaultPrice: 4.50 },
    { category: 'Entrümpelung – Container & Entsorgung', title: 'Asbesthaltige Materialien entsorgen (je kg)', unit: 'kg', hint: '6–10 €', defaultPrice: 8.00 },
    // Reinigung
    { category: 'Entrümpelung – Reinigung', title: 'Besenreine Übergabe (kehren, Grobeinigung, je m²)', unit: 'm²', hint: '3–5 €', defaultPrice: 4.00 },
    { category: 'Entrümpelung – Reinigung', title: 'Grundreinigung / Endreinigung (je m²)', unit: 'm²', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Entrümpelung – Reinigung', title: 'Bad / Küche Intensivreinigung (je Raum)', unit: 'Stück', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Entrümpelung – Reinigung', title: 'Geruchsneutralisation (Ozon-Behandlung, je m²)', unit: 'm²', hint: '4–6 €', defaultPrice: 5.00 },
    { category: 'Entrümpelung – Reinigung', title: 'Schimmelreinigung / -behandlung Oberfläche (je m²)', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    // Umzug lokal
    { category: 'Umzug – Lokal', title: 'Umzugsteam 2 Mann + Transporter (je Stunde)', unit: 'Stunde', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Umzug – Lokal', title: 'Umzugspauschale 2-Zimmer-Wohnung (innerhalb Stadt)', unit: 'Pauschale', hint: '750–1.150 €', defaultPrice: 950.00 },
    { category: 'Umzug – Lokal', title: 'Umzugspauschale 3-Zimmer-Wohnung (innerhalb Stadt)', unit: 'Pauschale', hint: '1.100–1.700 €', defaultPrice: 1400.00 },
    { category: 'Umzug – Lokal', title: 'Umzugspauschale 4-Zimmer-Wohnung / Haus (innerhalb Stadt)', unit: 'Pauschale', hint: '1.750–2.650 €', defaultPrice: 2200.00 },
    // Fernumzug
    { category: 'Umzug – Fernumzug', title: 'Fernumzug bis 100 km (2-Zimmer, Pauschale)', unit: 'Pauschale', hint: '1.100–1.700 €', defaultPrice: 1400.00 },
    { category: 'Umzug – Fernumzug', title: 'Fernumzug bis 300 km (3-Zimmer, Pauschale)', unit: 'Pauschale', hint: '2.500–3.900 €', defaultPrice: 3200.00 },
    // Equipment
    { category: 'Umzug – Fahrzeuge & Equipment', title: 'Möbellift / Treppensteiger mieten (bis 3. OG, je Einsatz)', unit: 'Einsatz', hint: '250–390 €', defaultPrice: 320.00 },
    { category: 'Umzug – Fahrzeuge & Equipment', title: 'Kran / Autokran (für Schwerlast / Piano, je Einsatz)', unit: 'Einsatz', hint: '510–790 €', defaultPrice: 650.00 },
    // Möbelmontage
    { category: 'Umzug – Möbelmontage', title: 'Möbel montieren / aufbauen (allgemein, je Stunde)', unit: 'Stunde', hint: '30–46 €', defaultPrice: 38.00 },
    { category: 'Umzug – Möbelmontage', title: 'Küche montieren (Aufbau, je lfdm)', unit: 'lfdm', hint: '68–105 €', defaultPrice: 85.00 },
    // Erschwernisse & Stundenleistungen
    { category: 'Entrümpelung – Erschwernisse & Zuschläge', title: 'Zuschlag kein Aufzug (je Etage ab 1. OG)', unit: 'Etage', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Entrümpelung – Erschwernisse & Zuschläge', title: 'Zuschlag enge Treppenhäuser / Altbau', unit: 'Pauschale', hint: '65–100 €', defaultPrice: 80.00 },
    { category: 'Entrümpelung – Erschwernisse & Zuschläge', title: 'Zuschlag Asbest / Sondermüll vorhanden (Schutzausrüstung)', unit: 'Pauschale', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Entrümpelung – Stundenleistungen', title: 'Helfer / Träger (ungelernt, je Stunde)', unit: 'Stunde', hint: '22–34 €', defaultPrice: 28.00 },
    { category: 'Entrümpelung – Stundenleistungen', title: 'Möbelpacker / Fachkraft (je Stunde)', unit: 'Stunde', hint: '30–46 €', defaultPrice: 38.00 },
    { category: 'Entrümpelung – Stundenleistungen', title: 'Mindestauftrag / Kleinstauftrag pauschal', unit: 'Pauschale', hint: '120–185 €', defaultPrice: 150.00 },
  ],

  garten: [
    // Anfahrt & Organisation
    { category: 'Garten – Anfahrt & Organisation', title: 'Anfahrt pauschal (bis 15 km)', unit: 'Pauschale', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Garten – Anfahrt & Organisation', title: 'Gartenplanung / Bepflanzungsplan einfach', unit: 'Pauschale', hint: '190–310 €', defaultPrice: 250.00 },
    // Erdarbeiten
    { category: 'Garten – Erdarbeiten', title: 'Boden abtragen / Oberboden abschälen (bis 20cm)', unit: 'm²', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Garten – Erdarbeiten', title: 'Erdaushub Bagger (ohne Abtransport)', unit: 'm³', hint: '17–27 €', defaultPrice: 22.00 },
    { category: 'Garten – Erdarbeiten', title: 'Gelände planieren / einebnen', unit: 'm²', hint: '4,50–7,50 €', defaultPrice: 6.00 },
    { category: 'Garten – Erdarbeiten', title: 'Oberboden / Muttererde anliefern + einbauen', unit: 'm³', hint: '43–68 €', defaultPrice: 55.00 },
    // Rasen
    { category: 'Garten – Rasen', title: 'Rasen einsäen (Bodenvorbereitung + Saatgut + Einarbeiten)', unit: 'm²', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Garten – Rasen', title: 'Rollrasen verlegen (inkl. Lieferung + Verlegen + Andrücken)', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    { category: 'Garten – Rasen', title: 'Rasenmähen Mindestpauschale (kleiner Garten)', unit: 'Pauschale', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Garten – Rasen', title: 'Rasen vertikutieren', unit: 'm²', hint: '0,60–1,00 €', defaultPrice: 0.80 },
    { category: 'Garten – Rasen', title: 'Rasen erneuern (abfräsen + neu einsäen)', unit: 'm²', hint: '11–17 €', defaultPrice: 14.00 },
    // Bepflanzung & Beet
    { category: 'Garten – Bepflanzung & Beet', title: 'Strauch / Gehölz pflanzen (klein, bis 100cm)', unit: 'Stück', hint: '17–27 €', defaultPrice: 22.00 },
    { category: 'Garten – Bepflanzung & Beet', title: 'Strauch / Gehölz pflanzen (mittel, 100–200cm)', unit: 'Stück', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Garten – Bepflanzung & Beet', title: 'Baum pflanzen (Hochstamm, bis 3m, inkl. Pflanzgrube)', unit: 'Stück', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Garten – Bepflanzung & Beet', title: 'Heckenpflanzen setzen (inkl. Pflanzen Standard)', unit: 'lfdm', hint: '22–34 €', defaultPrice: 28.00 },
    { category: 'Garten – Bepflanzung & Beet', title: 'Beet anlegen (inkl. Erde + Pflanzen)', unit: 'm²', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Garten – Bepflanzung & Beet', title: 'Mulch / Rindenmulch einbringen', unit: 'm²', hint: '6–10 €', defaultPrice: 8.00 },
    // Gehölzpflege & Baumarbeiten
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Heckenschnitt (bis 1,5m Höhe)', unit: 'lfdm', hint: '3,50–5,50 €', defaultPrice: 4.50 },
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Heckenschnitt (bis 2,5m Höhe)', unit: 'lfdm', hint: '5,50–8,50 €', defaultPrice: 7.00 },
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Heckenschnitt (>2,5m / mit Arbeitsbühne)', unit: 'lfdm', hint: '9–15 €', defaultPrice: 12.00 },
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Obstbaumschnitt (klein bis 3m)', unit: 'Stück', hint: '60–95 €', defaultPrice: 75.00 },
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Obstbaumschnitt (groß 3–6m)', unit: 'Stück', hint: '120–185 €', defaultPrice: 150.00 },
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Baum fällen (bis 10m Höhe, inkl. Stammentsorgung)', unit: 'Stück', hint: '275–425 €', defaultPrice: 350.00 },
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Baum fällen (10–20m, Seilklettertechnik)', unit: 'Stück', hint: '600–920 €', defaultPrice: 750.00 },
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Baumstumpf fräsen (bis 40cm Durchmesser)', unit: 'Stück', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Garten – Gehölzpflege & Baumarbeiten', title: 'Baumstumpf fräsen (>40cm Durchmesser)', unit: 'Stück', hint: '175–270 €', defaultPrice: 220.00 },
    // Pflege & Wartung
    { category: 'Garten – Pflege & Wartung', title: 'Unkraut jäten', unit: 'm²', hint: '1,90–3,10 €', defaultPrice: 2.50 },
    { category: 'Garten – Pflege & Wartung', title: 'Frühjahrsreinigung Garten', unit: 'm²', hint: '1,40–2,20 €', defaultPrice: 1.80 },
    // Pflaster & Wege
    { category: 'Garten – Pflaster & Wege', title: 'Betonsteinpflaster verlegen (inkl. Bettung, ohne Unterbau)', unit: 'm²', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Garten – Pflaster & Wege', title: 'Natursteinpflaster verlegen (Granit / Basalt)', unit: 'm²', hint: '87–135 €', defaultPrice: 110.00 },
    { category: 'Garten – Pflaster & Wege', title: 'Terrassenplatten Beton verlegen', unit: 'm²', hint: '51–79 €', defaultPrice: 65.00 },
    { category: 'Garten – Pflaster & Wege', title: 'Terrassenplatten auf Stelzlager verlegen', unit: 'm²', hint: '60–92 €', defaultPrice: 75.00 },
    { category: 'Garten – Pflaster & Wege', title: 'Kiesweg anlegen (Kies + Vlies + einbauen)', unit: 'm²', hint: '22–34 €', defaultPrice: 28.00 },
    { category: 'Garten – Pflaster & Wege', title: 'Stufenanlage / Treppe Garten (je Stufe)', unit: 'Stück', hint: '95–145 €', defaultPrice: 120.00 },
    // Mauern & Einfassungen
    { category: 'Garten – Mauern & Einfassungen', title: 'Natursteinmauer trocken aufschichten (Trockenmauer)', unit: 'm²', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Garten – Mauern & Einfassungen', title: 'Gabione / Steinkorb befüllen + aufstellen', unit: 'm³', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Garten – Mauern & Einfassungen', title: 'Cortenstahl-Beetumrandung montieren', unit: 'lfdm', hint: '27–43 €', defaultPrice: 35.00 },
    // Zaun & Einfriedung
    { category: 'Garten – Zaun & Einfriedung', title: 'Holzzaun / Lattenzaun montieren (inkl. Pfosten)', unit: 'lfdm', hint: '51–79 €', defaultPrice: 65.00 },
    { category: 'Garten – Zaun & Einfriedung', title: 'Sichtschutzzaun Holz montieren (bis 1,8m)', unit: 'lfdm', hint: '68–105 €', defaultPrice: 85.00 },
    { category: 'Garten – Zaun & Einfriedung', title: 'Metallzaun / Doppelstabmattenzaun montieren', unit: 'lfdm', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Garten – Zaun & Einfriedung', title: 'Tor einbauen (Gartentor, einflügelig)', unit: 'Stück', hint: '220–340 €', defaultPrice: 280.00 },
    { category: 'Garten – Zaun & Einfriedung', title: 'Schiebetor einbauen (motorisch, komplett)', unit: 'Stück', hint: '1.400–2.200 €', defaultPrice: 1800.00 },
    // Teich & Wasserspiel
    { category: 'Garten – Teich & Wasserspiel', title: 'Gartenteich anlegen (Folienteich, bis 10 m², inkl. Aushub + Folie)', unit: 'Pauschale', hint: '1.400–2.200 €', defaultPrice: 1800.00 },
    { category: 'Garten – Teich & Wasserspiel', title: 'Wasserspiel / Brunnen aufbauen (komplett)', unit: 'Stück', hint: '660–1.040 €', defaultPrice: 850.00 },
    { category: 'Garten – Teich & Wasserspiel', title: 'Teichpumpe / Filter einbauen + anschließen', unit: 'Stück', hint: '140–220 €', defaultPrice: 180.00 },
    // Bewässerung
    { category: 'Garten – Bewässerung', title: 'Bewässerungsanlage einfach (Rasen, bis 100 m²)', unit: 'Pauschale', hint: '950–1.450 €', defaultPrice: 1200.00 },
    { category: 'Garten – Bewässerung', title: 'Bewässerungsanlage komplett (bis 300 m², inkl. Steuerung)', unit: 'Pauschale', hint: '2.200–3.400 €', defaultPrice: 2800.00 },
    { category: 'Garten – Bewässerung', title: 'Bewässerungsrohr verlegen (Graben + Rohr)', unit: 'lfdm', hint: '14–22 €', defaultPrice: 18.00 },
    // Drainage
    { category: 'Garten – Drainage & Entwässerung', title: 'Drainagerohr verlegen (DN 100, inkl. Kiesbett)', unit: 'lfdm', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Garten – Drainage & Entwässerung', title: 'Rinne / Schlitzrinne einbauen (inkl. Unterbau)', unit: 'lfdm', hint: '43–68 €', defaultPrice: 55.00 },
    // Holzbauten
    { category: 'Garten – Holzbauten', title: 'Holzterrasse verlegen (Lärche/Douglasie, inkl. UK)', unit: 'm²', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Garten – Holzbauten', title: 'WPC-Terrassendiele verlegen (inkl. UK)', unit: 'm²', hint: '68–105 €', defaultPrice: 85.00 },
    { category: 'Garten – Holzbauten', title: 'Pergola / Sonnensegel-Träger Holz montieren', unit: 'Stück', hint: '950–1.450 €', defaultPrice: 1200.00 },
    { category: 'Garten – Holzbauten', title: 'Hochbeet aufbauen (Holz, Standard 1x2m)', unit: 'Stück', hint: '220–340 €', defaultPrice: 280.00 },
    // Gartenbeleuchtung
    { category: 'Garten – Gartenbeleuchtung', title: 'Gartenstrahler / Wegeleuchte einbauen (inkl. Erdkabel)', unit: 'Stück', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Garten – Gartenbeleuchtung', title: 'Erdkabel verlegen (NYY-J 3x1,5, Graben + Rohr)', unit: 'lfdm', hint: '17–27 €', defaultPrice: 22.00 },
    // Maschineneinsatz
    { category: 'Garten – Maschineneinsatz', title: 'Bagger (Minibagger bis 3t, inkl. Fahrer)', unit: 'Stunde', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Garten – Maschineneinsatz', title: 'Lkw-Transport Aushub / Material (10t)', unit: 'Fahrt', hint: '220–340 €', defaultPrice: 280.00 },
    // Stundenleistungen
    { category: 'Garten – Stundenleistungen', title: 'Regiearbeit Gartenhelfer / Hilfsarbeiter', unit: 'Stunde', hint: '25–39 €', defaultPrice: 32.00 },
    { category: 'Garten – Stundenleistungen', title: 'Regiearbeit Gärtner / Fachkraft GaLaBau', unit: 'Stunde', hint: '38–58 €', defaultPrice: 48.00 },
    { category: 'Garten – Stundenleistungen', title: 'Regiearbeit Landschaftsgärtner-Meister', unit: 'Stunde', hint: '58–88 €', defaultPrice: 72.00 },
    { category: 'Garten – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–145 €', defaultPrice: 120.00 },
  ],

  rohbau: [
    // Anfahrt & Organisation
    { category: 'Rohbau – Anfahrt & Organisation', title: 'Anfahrt pauschal (bis 15 km)', unit: 'Pauschale', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Rohbau – Anfahrt & Organisation', title: 'Baustelleneinrichtung pauschal', unit: 'Pauschale', hint: '270–430 €', defaultPrice: 350.00 },
    // Erdarbeiten & Aushub
    { category: 'Rohbau – Erdarbeiten & Aushub', title: 'Erdaushub Bagger (ohne Abtransport)', unit: 'm³', hint: '19–31 €', defaultPrice: 25.00 },
    { category: 'Rohbau – Erdarbeiten & Aushub', title: 'Kellersohle / Baugrube ausheben', unit: 'm³', hint: '25–39 €', defaultPrice: 32.00 },
    { category: 'Rohbau – Erdarbeiten & Aushub', title: 'Kiesbett / Schotterschicht einbauen (20cm)', unit: 'm²', hint: '17–27 €', defaultPrice: 22.00 },
    { category: 'Rohbau – Erdarbeiten & Aushub', title: 'Sauberkeitsschicht Beton (5cm)', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    // Fundamente
    { category: 'Rohbau – Fundamente', title: 'Streifenfundament Stahlbeton C25/30 (b=50cm, h=30cm)', unit: 'lfdm', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Rohbau – Fundamente', title: 'Einzelfundament (Köcherfundament, 60x60x60cm)', unit: 'Stück', hint: '170–270 €', defaultPrice: 220.00 },
    { category: 'Rohbau – Fundamente', title: 'Fundamentabdichtung (bituminöse Abdichtung)', unit: 'm²', hint: '22–34 €', defaultPrice: 28.00 },
    // Bodenplatten
    { category: 'Rohbau – Bodenplatten', title: 'Stahlbetonbodenplatte (20cm, C25/30, inkl. Bewehrung)', unit: 'm²', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Rohbau – Bodenplatten', title: 'Stahlbetonbodenplatte (25cm, C25/30)', unit: 'm²', hint: '90–140 €', defaultPrice: 115.00 },
    { category: 'Rohbau – Bodenplatten', title: 'Perimeterdämmung (EPS, 10cm) einbauen', unit: 'm²', hint: '27–43 €', defaultPrice: 35.00 },
    // Kellerwände
    { category: 'Rohbau – Kellerwände', title: 'Ortbetonwand Keller (20cm, C25/30)', unit: 'm²', hint: '112–178 €', defaultPrice: 145.00 },
    { category: 'Rohbau – Kellerwände', title: 'Ortbetonwand Keller (25cm, WU-Beton)', unit: 'm²', hint: '136–214 €', defaultPrice: 175.00 },
    { category: 'Rohbau – Kellerwände', title: 'Kellerwandabdichtung außen (2-lagig Bitumen)', unit: 'm²', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Rohbau – Kellerwände', title: 'Horizontalsperre nachträglich einbauen', unit: 'lfdm', hint: '140–220 €', defaultPrice: 180.00 },
    // Mauerwerk Außenwände
    { category: 'Rohbau – Mauerwerk Außenwände', title: 'Poroton/Ziegelmauer (24cm, inkl. Mörtel)', unit: 'm²', hint: '58–92 €', defaultPrice: 75.00 },
    { category: 'Rohbau – Mauerwerk Außenwände', title: 'Poroton/Ziegelmauer (36,5cm)', unit: 'm²', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Rohbau – Mauerwerk Außenwände', title: 'Kalksandstein KS (24cm)', unit: 'm²', hint: '64–100 €', defaultPrice: 82.00 },
    { category: 'Rohbau – Mauerwerk Außenwände', title: 'Porenbeton / Ytong (24cm)', unit: 'm²', hint: '56–88 €', defaultPrice: 72.00 },
    // Mauerwerk Innenwände
    { category: 'Rohbau – Mauerwerk Innenwände', title: 'Kalksandstein Innenwand (11,5cm)', unit: 'm²', hint: '40–64 €', defaultPrice: 52.00 },
    { category: 'Rohbau – Mauerwerk Innenwände', title: 'Kalksandstein Innenwand (17,5cm)', unit: 'm²', hint: '51–79 €', defaultPrice: 65.00 },
    { category: 'Rohbau – Mauerwerk Innenwände', title: 'Innenwand verputzen (Kalkgipsputz, 10mm)', unit: 'm²', hint: '17–27 €', defaultPrice: 22.00 },
    // Decken
    { category: 'Rohbau – Decken', title: 'Stahlbetondecke Ortbeton (18cm, inkl. Bewehrung)', unit: 'm²', hint: '97–153 €', defaultPrice: 125.00 },
    { category: 'Rohbau – Decken', title: 'Fertigteildecke / Hohldielen verlegen', unit: 'm²', hint: '66–104 €', defaultPrice: 85.00 },
    { category: 'Rohbau – Decken', title: 'Deckendurchbruch (bis 1m², Stahlbeton)', unit: 'Stück', hint: '350–550 €', defaultPrice: 450.00 },
    // Schalung & Bewehrung
    { category: 'Rohbau – Schalung & Bewehrung', title: 'Systemschalung stellen (Wand, je m² Schalfläche)', unit: 'm²', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Rohbau – Schalung & Bewehrung', title: 'Bewehrungsstahl einbauen (BSt 500, je kg)', unit: 'kg', hint: '1,40–2,20 €', defaultPrice: 1.80 },
    { category: 'Rohbau – Schalung & Bewehrung', title: 'Bewehrungsmatte einlegen (Q188A)', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    // Ringbalken & Stürze
    { category: 'Rohbau – Ringbalken & Stürze', title: 'Ringbalken Stahlbeton (20x20cm)', unit: 'lfdm', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Rohbau – Ringbalken & Stürze', title: 'Sturz einbauen (Betonfertigsturz, bis 1m)', unit: 'Stück', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Rohbau – Ringbalken & Stürze', title: 'Stahlträger Sturz einbauen (bis 3m, IPE, inkl. Träger)', unit: 'Stück', hint: '295–465 €', defaultPrice: 380.00 },
    // Treppen Beton
    { category: 'Rohbau – Treppen Beton', title: 'Betontreppe Ortbeton (je Stufe, inkl. Schalung)', unit: 'Stufe', hint: '170–270 €', defaultPrice: 220.00 },
    { category: 'Rohbau – Treppen Beton', title: 'Betontreppe Fertigteil (je Stufe, inkl. Einbau)', unit: 'Stufe', hint: '140–220 €', defaultPrice: 180.00 },
    // Wandöffnungen & Durchbrüche
    { category: 'Rohbau – Wandöffnungen & Durchbrüche', title: 'Wanddurchbruch (11–25cm, bis 1m²)', unit: 'Stück', hint: '295–465 €', defaultPrice: 380.00 },
    { category: 'Rohbau – Wandöffnungen & Durchbrüche', title: 'Wanddurchbruch Stahlbetonwand (bis 1m²)', unit: 'Stück', hint: '580–920 €', defaultPrice: 750.00 },
    { category: 'Rohbau – Wandöffnungen & Durchbrüche', title: 'Kernbohrung (bis DN 100, durch Beton)', unit: 'Stück', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Rohbau – Wandöffnungen & Durchbrüche', title: 'Öffnung schließen / zumauern (bis 1m²)', unit: 'Stück', hint: '140–220 €', defaultPrice: 180.00 },
    // Mauerwerk-Sanierung
    { category: 'Rohbau – Mauerwerk-Sanierung', title: 'Feuchtigkeitsschäden ausbessern / Risse schließen', unit: 'm²', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Rohbau – Mauerwerk-Sanierung', title: 'Außenputz erneuern (Unterputz + Oberputz)', unit: 'm²', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Rohbau – Mauerwerk-Sanierung', title: 'Fugen sanieren / Fugen neu verfugen', unit: 'm²', hint: '30–46 €', defaultPrice: 38.00 },
    { category: 'Rohbau – Mauerwerk-Sanierung', title: 'Feuchtigkeitssperre horizontal nachträglich einbauen', unit: 'lfdm', hint: '151–239 €', defaultPrice: 195.00 },
    // Stundenleistungen
    { category: 'Rohbau – Stundenleistungen', title: 'Regiearbeit Hilfsarbeiter', unit: 'Stunde', hint: '30–46 €', defaultPrice: 38.00 },
    { category: 'Rohbau – Stundenleistungen', title: 'Regiearbeit Maurer / Facharbeiter', unit: 'Stunde', hint: '40–64 €', defaultPrice: 52.00 },
    { category: 'Rohbau – Stundenleistungen', title: 'Regiearbeit Polier / Vorarbeiter', unit: 'Stunde', hint: '53–83 €', defaultPrice: 68.00 },
    { category: 'Rohbau – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '140–220 €', defaultPrice: 180.00 },
  ],

  reinigung: [
    // Unterhaltsreinigung
    { category: 'Reinigung – Unterhaltsreinigung', title: 'Büroreinigung täglich (5× wöchentlich, je m² je Reinigung)', unit: 'm²', hint: '0,75–1,15 €', defaultPrice: 0.95 },
    { category: 'Reinigung – Unterhaltsreinigung', title: 'Büroreinigung 3× wöchentlich (je m² je Reinigung)', unit: 'm²', hint: '1,10–1,70 €', defaultPrice: 1.40 },
    { category: 'Reinigung – Unterhaltsreinigung', title: 'Büroreinigung 1× wöchentlich (je m² je Reinigung)', unit: 'm²', hint: '1,75–2,65 €', defaultPrice: 2.20 },
    { category: 'Reinigung – Unterhaltsreinigung', title: 'Unterhaltsreinigung pauschal (je Stunde, Einzelauftrag)', unit: 'Stunde', hint: '30–46 €', defaultPrice: 38.00 },
    { category: 'Reinigung – Unterhaltsreinigung', title: 'Unterhaltsreinigung Monatspauschale (je m², 4× wöchentlich)', unit: 'm²/Monat', hint: '3,50–5,50 €', defaultPrice: 4.50 },
    // Treppenhaus
    { category: 'Reinigung – Treppenhaus', title: 'Treppenhausreinigung (MFH, bis 4 Etagen, je Reinigung)', unit: 'Reinigung', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Reinigung – Treppenhaus', title: 'Treppenhausreinigung (MFH, 4–8 Etagen, je Reinigung)', unit: 'Reinigung', hint: '59–91 €', defaultPrice: 75.00 },
    { category: 'Reinigung – Treppenhaus', title: 'Treppenhausreinigung monatlich (bis 4 Etagen)', unit: 'Monat', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Reinigung – Treppenhaus', title: 'Tiefgarage / Parkhaus reinigen', unit: 'm²', hint: '1,40–2,20 €', defaultPrice: 1.80 },
    // Grundreinigung
    { category: 'Reinigung – Grundreinigung', title: 'Grundreinigung Büro / Gewerbe', unit: 'm²', hint: '4,30–6,70 €', defaultPrice: 5.50 },
    { category: 'Reinigung – Grundreinigung', title: 'Grundreinigung Wohnung', unit: 'm²', hint: '5–8 €', defaultPrice: 6.50 },
    { category: 'Reinigung – Grundreinigung', title: 'Grundreinigung nach Umbau / Handwerker', unit: 'm²', hint: '7–11 €', defaultPrice: 9.00 },
    { category: 'Reinigung – Grundreinigung', title: 'Intensivreinigung stark verschmutzte Fläche', unit: 'm²', hint: '9–15 €', defaultPrice: 12.00 },
    // Baureinigung
    { category: 'Reinigung – Baureinigung', title: 'Bauendreinigung grob (Bauschutt kehren)', unit: 'm²', hint: '3,50–5,50 €', defaultPrice: 4.50 },
    { category: 'Reinigung – Baureinigung', title: 'Bauendreinigung fein (übergabefertig)', unit: 'm²', hint: '7–11 €', defaultPrice: 9.00 },
    { category: 'Reinigung – Baureinigung', title: 'Bauendreinigung komplett (inkl. Fenster, Sanitär, Böden)', unit: 'm²', hint: '11–17 €', defaultPrice: 14.00 },
    { category: 'Reinigung – Baureinigung', title: 'Putzreste / Mörtelspritzer von Böden entfernen', unit: 'm²', hint: '4,70–7,30 €', defaultPrice: 6.00 },
    // Glasreinigung
    { category: 'Reinigung – Glasreinigung', title: 'Fenster reinigen innen + außen (bis 1 m², je Fenster)', unit: 'Stück', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Reinigung – Glasreinigung', title: 'Fenster reinigen innen + außen (1–2 m², je Fenster)', unit: 'Stück', hint: '11–17 €', defaultPrice: 14.00 },
    { category: 'Reinigung – Glasreinigung', title: 'Glasfassade reinigen', unit: 'm²', hint: '5,50–8,50 €', defaultPrice: 7.00 },
    { category: 'Reinigung – Glasreinigung', title: 'Glasreinigung mit Hebebühne / Gondel', unit: 'm²', hint: '9–15 €', defaultPrice: 12.00 },
    { category: 'Reinigung – Glasreinigung', title: 'Wintergarten Glasreinigung (komplett innen + außen)', unit: 'm²', hint: '7–11 €', defaultPrice: 9.00 },
    { category: 'Reinigung – Glasreinigung', title: 'Solaranlage / PV-Module reinigen (je Modul)', unit: 'Stück', hint: '6–10 €', defaultPrice: 8.00 },
    // Sanitär & Küche
    { category: 'Reinigung – Sanitär & Küche', title: 'Toiletten / WC-Anlage reinigen (je WC, je Reinigung)', unit: 'Stück', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Reinigung – Sanitär & Küche', title: 'Sanitärreinigung Grundreinigung (Kalk, Urinstein)', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    { category: 'Reinigung – Sanitär & Küche', title: 'Desinfektionsreinigung Sanitär', unit: 'm²', hint: '11–17 €', defaultPrice: 14.00 },
    { category: 'Reinigung – Sanitär & Küche', title: 'Küche Grundreinigung (Fettablagerungen, Geräte)', unit: 'm²', hint: '22–34 €', defaultPrice: 28.00 },
    { category: 'Reinigung – Sanitär & Küche', title: 'Abzugshaube / Lüftung entfetten', unit: 'Stück', hint: '75–115 €', defaultPrice: 95.00 },
    // Bodenreinigung
    { category: 'Reinigung – Bodenreinigung', title: 'Hartboden feucht wischen (je m², je Reinigung)', unit: 'm²', hint: '0,47–0,73 €', defaultPrice: 0.60 },
    { category: 'Reinigung – Bodenreinigung', title: 'Hartboden maschinell reinigen (Einscheibenmaschine)', unit: 'm²', hint: '2–3 €', defaultPrice: 2.50 },
    { category: 'Reinigung – Bodenreinigung', title: 'Teppichboden Sprühextraktionsreinigung', unit: 'm²', hint: '3,50–5,50 €', defaultPrice: 4.50 },
    { category: 'Reinigung – Bodenreinigung', title: 'Teppichboden Grundreinigung (Shampoonierbürste)', unit: 'm²', hint: '5–8 €', defaultPrice: 6.50 },
    { category: 'Reinigung – Bodenreinigung', title: 'Steinboden (Marmor, Granit) reinigen + versiegeln', unit: 'm²', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Reinigung – Bodenreinigung', title: 'PVC / Linoleum reinigen + pflegen (Emulsionspflege)', unit: 'm²', hint: '2,35–3,65 €', defaultPrice: 3.00 },
    // Wohnungsreinigung
    { category: 'Reinigung – Wohnungsreinigung', title: 'Wohnungsübergabereinigung (besenrein + Saugen)', unit: 'm²', hint: '4–6 €', defaultPrice: 5.00 },
    { category: 'Reinigung – Wohnungsreinigung', title: 'Wohnungsübergabe Grundreinigung (übergabefertig)', unit: 'm²', hint: '6,50–10,50 €', defaultPrice: 8.50 },
    { category: 'Reinigung – Wohnungsreinigung', title: 'Haushaltsreinigung (Privathaushalt, je Stunde)', unit: 'Stunde', hint: '24–37 €', defaultPrice: 30.00 },
    { category: 'Reinigung – Wohnungsreinigung', title: 'Haushaltsreinigung Pauschale (1-Zimmer-Wohnung)', unit: 'Reinigung', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Reinigung – Wohnungsreinigung', title: 'Haushaltsreinigung Pauschale (2-Zimmer-Wohnung)', unit: 'Reinigung', hint: '65–98 €', defaultPrice: 80.00 },
    { category: 'Reinigung – Wohnungsreinigung', title: 'Haushaltsreinigung Pauschale (3-Zimmer-Wohnung)', unit: 'Reinigung', hint: '87–135 €', defaultPrice: 110.00 },
    { category: 'Reinigung – Wohnungsreinigung', title: 'Haushaltsreinigung Pauschale (4-Zimmer-Wohnung / Haus)', unit: 'Reinigung', hint: '120–185 €', defaultPrice: 150.00 },
    { category: 'Reinigung – Wohnungsreinigung', title: 'Backofen / Herd entfetten + reinigen', unit: 'Stück', hint: '27–43 €', defaultPrice: 35.00 },
    // Sonderreinigung
    { category: 'Reinigung – Sonderreinigung', title: 'Desinfektion / Desinfektionsreinigung', unit: 'm²', hint: '4,30–6,70 €', defaultPrice: 5.50 },
    { category: 'Reinigung – Sonderreinigung', title: 'Schimmelreinigung Oberfläche', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    { category: 'Reinigung – Sonderreinigung', title: 'Geruchsbeseitigung / Ozon-Behandlung', unit: 'm²', hint: '4–6 €', defaultPrice: 5.00 },
    { category: 'Reinigung – Sonderreinigung', title: 'Brandschadenreinigung (Ruß, Löschwasser)', unit: 'm²', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Reinigung – Sonderreinigung', title: 'Wasserschadenreinigung', unit: 'm²', hint: '22–34 €', defaultPrice: 28.00 },
    { category: 'Reinigung – Sonderreinigung', title: 'Graffiti-Entfernung Fassade', unit: 'm²', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Reinigung – Sonderreinigung', title: 'Hochdruckreinigung Fassade', unit: 'm²', hint: '5,50–8,50 €', defaultPrice: 7.00 },
    { category: 'Reinigung – Sonderreinigung', title: 'Hochdruckreinigung Pflasterfläche / Terrasse', unit: 'm²', hint: '3–5 €', defaultPrice: 4.00 },
    { category: 'Reinigung – Sonderreinigung', title: 'Dachrinne reinigen', unit: 'lfdm', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Reinigung – Sonderreinigung', title: 'Messie-Wohnung / Verwahrlosung reinigen', unit: 'm²', hint: '35–55 €', defaultPrice: 45.00 },
    // Hygiene & Klinik
    { category: 'Reinigung – Hygiene & Klinik', title: 'Praxisreinigung Arzt / Zahnarzt täglich (je m², je Reinigung)', unit: 'm²', hint: '1,40–2,20 €', defaultPrice: 1.80 },
    { category: 'Reinigung – Hygiene & Klinik', title: 'OP-Reinigung / Schlussdesinfektion', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    { category: 'Reinigung – Hygiene & Klinik', title: 'Reinraumreinigung (Pharma / Elektronik)', unit: 'm²', hint: '20–30 €', defaultPrice: 25.00 },
    // Außen & Winterdienst
    { category: 'Reinigung – Außen & Winterdienst', title: 'Gehweg / Einfahrt kehren (je m², je Reinigung)', unit: 'm²', hint: '0,62–0,98 €', defaultPrice: 0.80 },
    { category: 'Reinigung – Außen & Winterdienst', title: 'Winterdienst Räumen + Streuen Gehweg (je Einsatz)', unit: 'Einsatz', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Reinigung – Außen & Winterdienst', title: 'Winterdienst Monatspauschale (je m², Nov–Mrz)', unit: 'm²/Monat', hint: '0,95–1,45 €', defaultPrice: 1.20 },
    // Erschwernisse
    { category: 'Reinigung – Erschwernisse & Zuschläge', title: 'Zuschlag Nachtarbeit (22:00–06:00 Uhr)', unit: '%', hint: '25 %', defaultPrice: 25.00 },
    { category: 'Reinigung – Erschwernisse & Zuschläge', title: 'Zuschlag Wochenendarbeit (Sa/So)', unit: '%', hint: '25 %', defaultPrice: 25.00 },
    { category: 'Reinigung – Erschwernisse & Zuschläge', title: 'Zuschlag stark verschmutzt / vernachlässigt', unit: '%', hint: '50 %', defaultPrice: 50.00 },
    // Stundenleistungen
    { category: 'Reinigung – Stundenleistungen', title: 'Reinigungskraft (Unterhaltsreinigung, LG1)', unit: 'Stunde', hint: '22–34 €', defaultPrice: 28.00 },
    { category: 'Reinigung – Stundenleistungen', title: 'Fachkraft Gebäudereinigung (LG3–5)', unit: 'Stunde', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Reinigung – Stundenleistungen', title: 'Fachkraft Glas- / Fassadenreinigung (LG6)', unit: 'Stunde', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Reinigung – Stundenleistungen', title: 'Vorarbeiter / Objektleiter (LG5)', unit: 'Stunde', hint: '38–58 €', defaultPrice: 48.00 },
    { category: 'Reinigung – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '65–100 €', defaultPrice: 80.00 },
  ],

  abbruch: [
    // Vorbereitung
    { category: 'Abbruch – Anfahrt & Organisation', title: 'Schadstoffuntersuchung (Asbest, KMF, PCB) inkl. Gutachten', unit: 'Pauschale', hint: '300–460 €', defaultPrice: 380.00 },
    { category: 'Abbruch – Baustelleneinrichtung', title: 'Baustellenabsperrung / Bauzaun aufstellen (je lfdm, 4 Wochen)', unit: 'lfdm', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Abbruch – Baustelleneinrichtung', title: 'Staubschutzwand / Trennwand zu angrenzenden Bereichen', unit: 'm²', hint: '11–17 €', defaultPrice: 14.00 },
    // Entkernung
    { category: 'Abbruch – Entkernung', title: 'Entkernung komplett (ohne tragende Strukturen, je m² Wohnfläche)', unit: 'm²', hint: '51–79 €', defaultPrice: 65.00 },
    { category: 'Abbruch – Entkernung', title: 'Entkernung einfach (nur Ausbau, Böden, Verkleidungen)', unit: 'm²', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Abbruch – Entkernung', title: 'Entkernung Bad / Sanitärbereich', unit: 'm²', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Abbruch – Entkernung', title: 'Entkernung Küche', unit: 'm²', hint: '67–103 €', defaultPrice: 85.00 },
    { category: 'Abbruch – Entkernung', title: 'Tapeten abziehen', unit: 'm²', hint: '4–6 €', defaultPrice: 5.00 },
    { category: 'Abbruch – Entkernung', title: 'Bodenbelag entfernen + entsorgen (Laminat / Parkett)', unit: 'm²', hint: '5,50–8,50 €', defaultPrice: 7.00 },
    { category: 'Abbruch – Entkernung', title: 'Estrich entfernen + entsorgen', unit: 'm²', hint: '17–27 €', defaultPrice: 22.00 },
    { category: 'Abbruch – Entkernung', title: 'Türen + Zargen ausbauen + entsorgen', unit: 'Stück', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Abbruch – Entkernung', title: 'Fenster ausbauen + entsorgen', unit: 'Stück', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Abbruch – Entkernung', title: 'Sanitärobjekte (WC, Waschbecken, Wanne) ausbauen + entsorgen', unit: 'Stück', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Abbruch – Entkernung', title: 'Einbauküche demontieren + entsorgen', unit: 'lfdm', hint: '35–55 €', defaultPrice: 45.00 },
    // Wände
    { category: 'Abbruch – Wände', title: 'Nichttragende Wand abreißen (Gasbeton / Leichtbau)', unit: 'm²', hint: '17–27 €', defaultPrice: 22.00 },
    { category: 'Abbruch – Wände', title: 'Nichttragende Wand abreißen (Ziegel / Kalksandstein)', unit: 'm²', hint: '23–37 €', defaultPrice: 30.00 },
    { category: 'Abbruch – Wände', title: 'Tragende Wand abbrechen (Mauerwerk, inkl. Statikkoordination)', unit: 'm²', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Abbruch – Wände', title: 'Tragende Betonwand abbrechen (inkl. Bewehrung trennen)', unit: 'm²', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Abbruch – Wände', title: 'Wandfliesen abstemmen', unit: 'm²', hint: '17–27 €', defaultPrice: 22.00 },
    { category: 'Abbruch – Wände', title: 'Putz abschlagen', unit: 'm²', hint: '11–17 €', defaultPrice: 14.00 },
    { category: 'Abbruch – Wände', title: 'Wandöffnung / Durchbruch herstellen (bis 1 m², Mauerwerk)', unit: 'Stück', hint: '220–340 €', defaultPrice: 280.00 },
    { category: 'Abbruch – Wände', title: 'Wandöffnung / Durchbruch herstellen (bis 1 m², Beton / Stahlbeton)', unit: 'Stück', hint: '510–790 €', defaultPrice: 650.00 },
    { category: 'Abbruch – Wände', title: 'Kernbohrung (bis DN 150)', unit: 'Stück', hint: '140–220 €', defaultPrice: 180.00 },
    // Decken & Böden
    { category: 'Abbruch – Decken & Böden', title: 'Betondecke abbrechen (Stahlbetondecke)', unit: 'm²', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Abbruch – Decken & Böden', title: 'Holzbalkendecke abbrechen + entsorgen', unit: 'm²', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Abbruch – Decken & Böden', title: 'Bodenplatte aufbrechen (Beton)', unit: 'm²', hint: '51–79 €', defaultPrice: 65.00 },
    { category: 'Abbruch – Decken & Böden', title: 'Bodenfliesen abstemmen', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    // Teilabbruch
    { category: 'Abbruch – Teilabbruch', title: 'Kamin / Schornstein abtragen (je m Höhe)', unit: 'lfdm', hint: '51–79 €', defaultPrice: 65.00 },
    { category: 'Abbruch – Teilabbruch', title: 'Treppe abbrechen (Beton)', unit: 'Stück', hint: '670–1.030 €', defaultPrice: 850.00 },
    { category: 'Abbruch – Teilabbruch', title: 'Balkon abbrechen (Stahlbeton)', unit: 'm²', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Abbruch – Teilabbruch', title: 'Dachstuhl abbrechen + entsorgen', unit: 'm²', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Abbruch – Teilabbruch', title: 'Dachabdeckung entfernen + entsorgen', unit: 'm²', hint: '14–22 €', defaultPrice: 18.00 },
    { category: 'Abbruch – Teilabbruch', title: 'Keller abbrechen + verfüllen', unit: 'm²', hint: '95–145 €', defaultPrice: 120.00 },
    // Vollabbruch
    { category: 'Abbruch – Vollabbruch', title: 'Vollabbruch EFH (Massivbau, bis 120 m², inkl. Entsorgung)', unit: 'Pauschale', hint: '22.000–34.000 €', defaultPrice: 28000.00 },
    { category: 'Abbruch – Vollabbruch', title: 'Vollabbruch je m² BGF (Massivbau, Richtwert)', unit: 'm²', hint: '60–92 €', defaultPrice: 75.00 },
    { category: 'Abbruch – Vollabbruch', title: 'Garage abbrechen (Beton / Massiv, bis 25 m²)', unit: 'Stück', hint: '2.200–3.400 €', defaultPrice: 2800.00 },
    { category: 'Abbruch – Vollabbruch', title: 'Garage abbrechen (Leichtbau / Fertiggarage)', unit: 'Stück', hint: '950–1.450 €', defaultPrice: 1200.00 },
    { category: 'Abbruch – Vollabbruch', title: 'Gartenhaus / Nebengebäude abbrechen (Holz, bis 20 m²)', unit: 'Stück', hint: '750–1.150 €', defaultPrice: 950.00 },
    // Schadstoff-Rückbau
    { category: 'Abbruch – Schadstoff-Rückbau', title: 'Asbest-Dachplatten (Eternit) entfernen + Sonderentsorgung', unit: 'm²', hint: '55–85 €', defaultPrice: 70.00 },
    { category: 'Abbruch – Schadstoff-Rückbau', title: 'Asbest in Putzen / Fliesenkleber (schwach gebunden)', unit: 'm²', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Abbruch – Schadstoff-Rückbau', title: 'PCB-haltiger Fugenkitt entfernen', unit: 'lfdm', hint: '35–55 €', defaultPrice: 45.00 },
    { category: 'Abbruch – Schadstoff-Rückbau', title: 'Teerhaltige Baustoffe (PAK) entfernen + Sonderentsorgung', unit: 'm²', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Abbruch – Schadstoff-Rückbau', title: 'Kontaminierter Boden ausheben + Sonderentsorgung', unit: 'm³', hint: '220–340 €', defaultPrice: 280.00 },
    { category: 'Abbruch – Schadstoff-Rückbau', title: 'Ölabscheider / Tanks reinigen + entsorgen', unit: 'Stück', hint: '510–790 €', defaultPrice: 650.00 },
    // Entsorgung
    { category: 'Abbruch – Entsorgung', title: 'Container 7 m³ stellen + abholen (Bauschutt mineral)', unit: 'Stück', hint: '285–435 €', defaultPrice: 360.00 },
    { category: 'Abbruch – Entsorgung', title: 'Container 10 m³ stellen + abholen (Bauschutt mineral)', unit: 'Stück', hint: '380–580 €', defaultPrice: 480.00 },
    { category: 'Abbruch – Entsorgung', title: 'Deponiegebühr mineralischer Bauschutt (je Tonne)', unit: 't', hint: '30–46 €', defaultPrice: 38.00 },
    { category: 'Abbruch – Entsorgung', title: 'Deponiegebühr Asbest-Sondermüll (je Tonne)', unit: 't', hint: '330–510 €', defaultPrice: 420.00 },
    // Maschineneinsatz
    { category: 'Abbruch – Maschineneinsatz', title: 'Minibagger (bis 3t, inkl. Fahrer)', unit: 'Stunde', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Abbruch – Maschineneinsatz', title: 'Abbruchbagger mit Zange / Abbruchhammer', unit: 'Stunde', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Abbruch – Maschineneinsatz', title: 'Arbeitsbühne / Hubsteiger (je Tag)', unit: 'Tag', hint: '175–265 €', defaultPrice: 220.00 },
    // Nacharbeiten
    { category: 'Abbruch – Nacharbeiten', title: 'Fläche nach Abbruch planieren + verdichten', unit: 'm²', hint: '6–10 €', defaultPrice: 8.00 },
    { category: 'Abbruch – Nacharbeiten', title: 'Abrissgrube verfüllen + verdichten', unit: 'm³', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Abbruch – Nacharbeiten', title: 'Baustelle besenrein räumen + abschließende Reinigung', unit: 'Pauschale', hint: '140–220 €', defaultPrice: 180.00 },
    // Erschwernisse
    { category: 'Abbruch – Erschwernisse & Zuschläge', title: 'Zuschlag Innenstadtlage / enge Bebauung (Schutzmaßnahmen)', unit: 'Pauschale', hint: '2.800–4.200 €', defaultPrice: 3500.00 },
    { category: 'Abbruch – Erschwernisse & Zuschläge', title: 'Zuschlag Stahlbeton (armierter Beton gegenüber Mauerwerk)', unit: '%', hint: '50 %', defaultPrice: 50.00 },
    { category: 'Abbruch – Erschwernisse & Zuschläge', title: 'Zuschlag bewohntes Gebäude (laufender Betrieb, eingeschränkt)', unit: 'Pauschale', hint: '355–545 €', defaultPrice: 450.00 },
    // Stundenleistungen
    { category: 'Abbruch – Stundenleistungen', title: 'Abbruchhelfer / Träger', unit: 'Stunde', hint: '33–51 €', defaultPrice: 42.00 },
    { category: 'Abbruch – Stundenleistungen', title: 'Abbruchfacharbeiter', unit: 'Stunde', hint: '46–71 €', defaultPrice: 58.00 },
    { category: 'Abbruch – Stundenleistungen', title: 'Abbruchmeister / Bauleiter', unit: 'Stunde', hint: '68–105 €', defaultPrice: 85.00 },
    { category: 'Abbruch – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '140–220 €', defaultPrice: 180.00 },
  ],

  maler_fassade: [
    { category: 'Fassade – Gerüst', title: 'Fassadengerüst stellen + vorhalten (4 Wochen, je m²)', unit: 'm²', hint: '10–18 €', defaultPrice: 14 },
    { category: 'Fassade – Gerüst', title: 'Gerüst Aufpreis je weitere Woche Standzeit', unit: 'm²/Woche', hint: '1,50–4 €', defaultPrice: 2.50 },
    { category: 'Fassade – Untergrundvorbereitung', title: 'Fassade abbürsten / losen Putz entfernen', unit: 'm²', hint: '3–8 €', defaultPrice: 5 },
    { category: 'Fassade – Untergrundvorbereitung', title: 'Altputz komplett abstemmen', unit: 'm²', hint: '15–30 €', defaultPrice: 22 },
    { category: 'Fassade – Untergrundvorbereitung', title: 'Fassade hochdruckreinigen / abwaschen', unit: 'm²', hint: '4–9 €', defaultPrice: 6 },
    { category: 'Fassade – Untergrundvorbereitung', title: 'Risse schließen / vorspachteln', unit: 'lfdm', hint: '8–18 €', defaultPrice: 12 },
    { category: 'Fassade – Außenputz', title: 'Kalk-Zement-Putz zweilagig (Unter- + Oberputz)', unit: 'm²', hint: '32–55 €', defaultPrice: 42 },
    { category: 'Fassade – Außenputz', title: 'Mineralischer Edelputz / Reibeputz (Körnung 1,5mm)', unit: 'm²', hint: '16–30 €', defaultPrice: 22 },
    { category: 'Fassade – Außenputz', title: 'Silikonharzputz (diffusionsoffen)', unit: 'm²', hint: '20–34 €', defaultPrice: 26 },
    { category: 'Fassade – Anstrich & Beschichtung', title: 'Fassade streichen 1× Anstrich (Dispersionsfarbe)', unit: 'm²', hint: '6–13 €', defaultPrice: 9 },
    { category: 'Fassade – Anstrich & Beschichtung', title: 'Fassade streichen 2× Anstrich', unit: 'm²', hint: '10–18 €', defaultPrice: 14 },
    { category: 'Fassade – Anstrich & Beschichtung', title: 'Fassade streichen Silikonharzfarbe 2×', unit: 'm²', hint: '14–24 €', defaultPrice: 18 },
    { category: 'Fassade – Anstrich & Beschichtung', title: 'Fassadenbeschichtung mineralisch (Silikatfarbe)', unit: 'm²', hint: '16–28 €', defaultPrice: 22 },
    { category: 'Fassade – Anstrich & Beschichtung', title: 'Holzfassade lasieren / streichen (2×)', unit: 'm²', hint: '16–28 €', defaultPrice: 22 },
    { category: 'Fassade – Anstrich & Beschichtung', title: 'Fassaden-Imprägnierung / Hydrophobierung', unit: 'm²', hint: '5–12 €', defaultPrice: 8 },
    { category: 'Fassade – WDVS', title: 'WDVS komplett EPS 80mm (inkl. Dämmplatte, Armierung, Edelputz)', unit: 'm²', hint: '80–115 €', defaultPrice: 95 },
    { category: 'Fassade – WDVS', title: 'WDVS komplett EPS 120mm', unit: 'm²', hint: '95–138 €', defaultPrice: 115 },
    { category: 'Fassade – WDVS', title: 'WDVS komplett EPS 160mm', unit: 'm²', hint: '115–160 €', defaultPrice: 135 },
    { category: 'Fassade – WDVS', title: 'WDVS Mineralwolle 100mm (nicht brennbar, A1)', unit: 'm²', hint: '125–170 €', defaultPrice: 145 },
    { category: 'Fassade – WDVS', title: 'WDVS Fensteranschluss / Laibungsdämmung', unit: 'lfdm', hint: '18–34 €', defaultPrice: 25 },
    { category: 'Fassade – Hinterlüftete Fassade', title: 'Holzfassade / Holzschalung montieren (Lärche/Douglasie)', unit: 'm²', hint: '70–105 €', defaultPrice: 85 },
    { category: 'Fassade – Hinterlüftete Fassade', title: 'Faserzement-Fassade / Platten montieren', unit: 'm²', hint: '60–95 €', defaultPrice: 75 },
    { category: 'Fassade – Hinterlüftete Fassade', title: 'WPC-Fassadenpaneele montieren', unit: 'm²', hint: '75–120 €', defaultPrice: 95 },
    { category: 'Fassade – Sockel & Abdichtung', title: 'Kelleraußenwand abdichten (Bitumendickbeschichtung 2-lagig)', unit: 'm²', hint: '40–75 €', defaultPrice: 55 },
    { category: 'Fassade – Sockel & Abdichtung', title: 'Kelleraußenwand Perimeterdämmung XPS (80mm)', unit: 'm²', hint: '35–65 €', defaultPrice: 48 },
    { category: 'Fassade – Balkone & Loggien', title: 'Balkonabdichtung Flüssigfolie / Flüssigkunststoff', unit: 'm²', hint: '65–110 €', defaultPrice: 85 },
    { category: 'Fassade – Balkone & Loggien', title: 'Balkonbelag Feinsteinzeug / Fliesen', unit: 'm²', hint: '75–120 €', defaultPrice: 95 },
    { category: 'Fassade – Reinigung & Pflege', title: 'Fassadenreinigung Softwash (Algen, Moos, Schmutz)', unit: 'm²', hint: '7–14 €', defaultPrice: 10 },
    { category: 'Fassade – Reinigung & Pflege', title: 'Graffiti-Entfernung Fassade', unit: 'm²', hint: '30–65 €', defaultPrice: 45 },
    { category: 'Fassade – Klempner & Blecharbeiten', title: 'Fensterbank außen (Alu / Zink) liefern + montieren', unit: 'lfdm', hint: '40–75 €', defaultPrice: 55 },
    { category: 'Fassade – Klempner & Blecharbeiten', title: 'Dachrinne Zink / Alu montieren', unit: 'lfdm', hint: '40–75 €', defaultPrice: 55 },
    { category: 'Fassade – Betonsanierung', title: 'Reprofilierung Beton (PCC-Mörtel)', unit: 'm²', hint: '65–110 €', defaultPrice: 85 },
    { category: 'Fassade – Betonsanierung', title: 'Risse in Beton injizieren / verpressen', unit: 'lfdm', hint: '22–34 €', defaultPrice: 28 },
    { category: 'Fassade – Betonsanierung', title: 'Waschbetonfassade sanieren / überputzen', unit: 'm²', hint: '43–68 €', defaultPrice: 55 },
    { category: 'Fassade – Außentreppe & Eingang', title: 'Außentreppe Beton sanieren (Beschichtung)', unit: 'm²', hint: '51–79 €', defaultPrice: 65 },
    { category: 'Fassade – Außentreppe & Eingang', title: 'Vordach / Eingangsüberdachung montieren', unit: 'm²', hint: '220–340 €', defaultPrice: 280 },
    { category: 'Fassade – Erschwernisse & Zuschläge', title: 'Zuschlag Denkmalschutz / besondere Materialauflagen', unit: '%', hint: '30 %', defaultPrice: 30 },
    { category: 'Fassade – Erschwernisse & Zuschläge', title: 'Zuschlag Winterarbeiten (Frost unter 5°C, Wetterschutzplane)', unit: 'Pauschale', hint: '380–580 €', defaultPrice: 480 },
    { category: 'Fassade – Stundenleistungen', title: 'Regiearbeit Geselle (Fassade / Putz / Maler)', unit: 'Stunde', hint: '55–82 €', defaultPrice: 68 },
    { category: 'Fassade – Stundenleistungen', title: 'Regiearbeit Meister / Bauleiter', unit: 'Stunde', hint: '70–106 €', defaultPrice: 88 },
    { category: 'Fassade – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '120–190 €', defaultPrice: 150 },
  ],

  brandschutz: [
    // Anfahrt & Organisation
    { category: 'Brandschutz – Anfahrt & Organisation', title: 'Anfahrt pauschal (bis 20 km)', unit: 'Pauschale', hint: '50–80 €', defaultPrice: 65.00 },
    { category: 'Brandschutz – Anfahrt & Organisation', title: 'Brandschutzbegehung / -beratung vor Ort', unit: 'Stunde', hint: '85–135 €', defaultPrice: 110.00 },
    { category: 'Brandschutz – Anfahrt & Organisation', title: 'Brandschutznachweis / Dokumentation erstellen', unit: 'Pauschale', hint: '220–340 €', defaultPrice: 280.00 },
    // Türen & Tore
    { category: 'Brandschutz – Türen & Tore', title: 'Brandschutztür T30 (EI230) einbauen inkl. Zarge + Selbstschließer', unit: 'Stück', hint: '1.400–2.200 €', defaultPrice: 1800.00 },
    { category: 'Brandschutz – Türen & Tore', title: 'Brandschutztür T60 (EI260) einbauen inkl. Zarge', unit: 'Stück', hint: '1.900–2.900 €', defaultPrice: 2400.00 },
    { category: 'Brandschutz – Türen & Tore', title: 'Brandschutztür T90 (EI290) einbauen inkl. Zarge', unit: 'Stück', hint: '2.500–3.900 €', defaultPrice: 3200.00 },
    { category: 'Brandschutz – Türen & Tore', title: 'Selbstschließer nachrüsten / tauschen (je Tür)', unit: 'Stück', hint: '140–220 €', defaultPrice: 180.00 },
    { category: 'Brandschutz – Türen & Tore', title: 'Feststellanlage (Türfesthalter mit Brandmeldung, je Tür)', unit: 'Stück', hint: '295–465 €', defaultPrice: 380.00 },
    { category: 'Brandschutz – Türen & Tore', title: 'Brandschutztür warten + prüfen (Jahresprüfung, je Tür)', unit: 'Stück', hint: '43–68 €', defaultPrice: 55.00 },
    // Abschottungen
    { category: 'Brandschutz – Abschottungen & Leitungsführung', title: 'Rohrabschottung (bis DN 50, EI90, je Stück)', unit: 'Stück', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Brandschutz – Abschottungen & Leitungsführung', title: 'Rohrabschottung (DN 50–150, EI90, je Stück)', unit: 'Stück', hint: '112–178 €', defaultPrice: 145.00 },
    { category: 'Brandschutz – Abschottungen & Leitungsführung', title: 'Brandschutzklappe Lüftung (EI90 S, je Stück einbauen)', unit: 'Stück', hint: '295–465 €', defaultPrice: 380.00 },
    { category: 'Brandschutz – Abschottungen & Leitungsführung', title: 'Brandschutzmanschette (Kunststoffrohr, je Stück)', unit: 'Stück', hint: '51–79 €', defaultPrice: 65.00 },
    // Anstriche & Beschichtungen
    { category: 'Brandschutz – Anstriche & Beschichtungen', title: 'Brandschutzbeschichtung Stahl (R30, intumeszierend, je m²)', unit: 'm²', hint: '51–79 €', defaultPrice: 65.00 },
    { category: 'Brandschutz – Anstriche & Beschichtungen', title: 'Brandschutzbeschichtung Stahl (R60, je m²)', unit: 'm²', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Brandschutz – Anstriche & Beschichtungen', title: 'Brandschutzbeschichtung Holz (B1-Beschichtung, je m²)', unit: 'm²', hint: '17–27 €', defaultPrice: 22.00 },
    // Melder & Löschung
    { category: 'Brandschutz – Melder & Löschung', title: 'Rauchwarnmelder montieren + anschließen (vernetzt, 230V)', unit: 'Stück', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Brandschutz – Melder & Löschung', title: 'Brandmeldeanlage Basis einbauen (Zentrale + 4 Melder)', unit: 'Pauschale', hint: '1.400–2.200 €', defaultPrice: 1800.00 },
    { category: 'Brandschutz – Melder & Löschung', title: 'Handfeuerlöscher prüfen / warten (je Stück)', unit: 'Stück', hint: '22–34 €', defaultPrice: 28.00 },
    { category: 'Brandschutz – Melder & Löschung', title: 'Notbeleuchtung / Sicherheitsleuchte einbauen', unit: 'Stück', hint: '95–145 €', defaultPrice: 120.00 },
    // Stundenleistungen
    { category: 'Brandschutz – Stundenleistungen', title: 'Regiearbeit Brandschutzmonteur / Fachkraft', unit: 'Stunde', hint: '56–88 €', defaultPrice: 72.00 },
    { category: 'Brandschutz – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–145 €', defaultPrice: 120.00 },
  ],

  aufzug: [
    // Anfahrt & Organisation
    { category: 'Aufzugstechnik – Anfahrt & Organisation', title: 'Anfahrt / Begehung Aufzugsschacht vor Ort', unit: 'Stunde', hint: '85–135 €', defaultPrice: 110.00 },
    { category: 'Aufzugstechnik – Anfahrt & Organisation', title: 'Baugenehmigung Aufzugseinbau (Koordination)', unit: 'Pauschale', hint: '140–220 €', defaultPrice: 180.00 },
    // Einbau
    { category: 'Aufzugstechnik – Einbau', title: 'Personenaufzug einbauen (2–4 Haltestellen, maschinenraumlos)', unit: 'Pauschale', hint: '22.000–34.000 €', defaultPrice: 28000.00 },
    { category: 'Aufzugstechnik – Einbau', title: 'Personenaufzug einbauen (5–8 Haltestellen)', unit: 'Pauschale', hint: '30.000–46.000 €', defaultPrice: 38000.00 },
    { category: 'Aufzugstechnik – Einbau', title: 'Plattformlift / Hebebühne einbauen (bis 3 Haltestellen)', unit: 'Pauschale', hint: '14.000–22.000 €', defaultPrice: 18000.00 },
    { category: 'Aufzugstechnik – Einbau', title: 'Treppenlift einbauen (gerade Treppe, komplett)', unit: 'Pauschale', hint: '4.300–6.700 €', defaultPrice: 5500.00 },
    { category: 'Aufzugstechnik – Einbau', title: 'Treppenlift einbauen (gewendelte Treppe)', unit: 'Pauschale', hint: '7.400–11.600 €', defaultPrice: 9500.00 },
    { category: 'Aufzugstechnik – Einbau', title: 'Aufzugsschacht mauern / herstellen (je m² Innenfläche)', unit: 'm²', hint: '220–340 €', defaultPrice: 280.00 },
    { category: 'Aufzugstechnik – Einbau', title: 'Aufzugsgrube herstellen (Beton, je Grube)', unit: 'Stück', hint: '2.200–3.400 €', defaultPrice: 2800.00 },
    { category: 'Aufzugstechnik – Einbau', title: 'Elektroanschluss Aufzug (Zuleitung + Unterverteilung)', unit: 'Pauschale', hint: '660–1.040 €', defaultPrice: 850.00 },
    // Modernisierung & Sanierung
    { category: 'Aufzugstechnik – Modernisierung & Sanierung', title: 'Aufzug modernisieren (Steuerung + Antrieb, komplett)', unit: 'Pauschale', hint: '14.000–22.000 €', defaultPrice: 18000.00 },
    { category: 'Aufzugstechnik – Modernisierung & Sanierung', title: 'Aufzugssteuerung tauschen (je Anlage)', unit: 'Stück', hint: '6.600–10.400 €', defaultPrice: 8500.00 },
    { category: 'Aufzugstechnik – Modernisierung & Sanierung', title: 'Aufzugstüren tauschen (je Haltestelle)', unit: 'Stück', hint: '1.700–2.700 €', defaultPrice: 2200.00 },
    // Wartung & Prüfung
    { category: 'Aufzugstechnik – Wartung & Prüfung', title: 'Aufzug Jahreswartung (inkl. Schmierung, Einstellung, Protokoll)', unit: 'Jahr', hint: '580–920 €', defaultPrice: 750.00 },
    { category: 'Aufzugstechnik – Wartung & Prüfung', title: 'Aufzug Monatswartung (je Wartungstermin)', unit: 'Monat', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Aufzugstechnik – Wartung & Prüfung', title: 'Notbefreiung eingeschlossener Personen (Einsatzpauschale)', unit: 'Einsatz', hint: '140–220 €', defaultPrice: 180.00 },
    // Stundenleistungen
    { category: 'Brandschutz – Stundenleistungen', title: 'Regiearbeit Aufzugsmonteur', unit: 'Stunde', hint: '68–108 €', defaultPrice: 88.00 },
    { category: 'Brandschutz – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–145 €', defaultPrice: 120.00 },
  ],

  luftdichtigkeit: [
    // Planung & Beratung
    { category: 'Luftdichtigkeit – Planung & Beratung', title: 'Anfahrt pauschal (bis 20 km)', unit: 'Pauschale', hint: '43–68 €', defaultPrice: 55.00 },
    { category: 'Luftdichtigkeit – Planung & Beratung', title: 'Beratung Luftdichtigkeitskonzept (vor Baustart)', unit: 'Stunde', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Luftdichtigkeit – Planung & Beratung', title: 'Luftdichtigkeitsplanung (Detailplanung Anschlüsse)', unit: 'Pauschale', hint: '295–465 €', defaultPrice: 380.00 },
    // Blower-Door-Test
    { category: 'Luftdichtigkeit – Blower-Door-Test', title: 'Blower-Door-Test Einfamilienhaus (bis 200 m² WF, inkl. Protokoll)', unit: 'Pauschale', hint: '375–585 €', defaultPrice: 480.00 },
    { category: 'Luftdichtigkeit – Blower-Door-Test', title: 'Blower-Door-Test Mehrfamilienhaus / Gewerbe (bis 500 m² WF)', unit: 'Pauschale', hint: '580–920 €', defaultPrice: 750.00 },
    { category: 'Luftdichtigkeit – Blower-Door-Test', title: 'Zwischentest (Rohbau / vor Schließung, ohne vollst. Protokoll)', unit: 'Pauschale', hint: '250–390 €', defaultPrice: 320.00 },
    { category: 'Luftdichtigkeit – Blower-Door-Test', title: 'Leckageortung (Thermografie + Blower-Door kombiniert)', unit: 'Stunde', hint: '85–135 €', defaultPrice: 110.00 },
    { category: 'Luftdichtigkeit – Blower-Door-Test', title: 'Blower-Door-Protokoll nach DIN EN ISO 9972 (für KfW / BAFA)', unit: 'Dokument', hint: '75–115 €', defaultPrice: 95.00 },
    // Ausführung & Abdichtung
    { category: 'Luftdichtigkeit – Ausführung & Abdichtung', title: 'Dampfbremse / Luftdichtigkeitsbahn verlegen (je m²)', unit: 'm²', hint: '7–11 €', defaultPrice: 9.00 },
    { category: 'Luftdichtigkeit – Ausführung & Abdichtung', title: 'Luftdichtigkeitsklebeband / Anschlussband (je lfdm)', unit: 'lfdm', hint: '3,50–5,50 €', defaultPrice: 4.50 },
    { category: 'Luftdichtigkeit – Ausführung & Abdichtung', title: 'Anschluss Dampfbremse an Wand / Decke (Manschette)', unit: 'lfdm', hint: '9–15 €', defaultPrice: 12.00 },
    { category: 'Luftdichtigkeit – Ausführung & Abdichtung', title: 'Rohrdurchführung luftdicht abdichten (je Stück)', unit: 'Stück', hint: '27–43 €', defaultPrice: 35.00 },
    { category: 'Luftdichtigkeit – Ausführung & Abdichtung', title: 'Luftdichtigkeits-Leckagen abdichten (nach Blower-Door-Test)', unit: 'Stunde', hint: '56–88 €', defaultPrice: 72.00 },
    // Thermografie & Energiecheck
    { category: 'Luftdichtigkeit – Thermografie & Energiecheck', title: 'Thermografieaufnahmen außen (Fassade, je Stunde)', unit: 'Stunde', hint: '95–145 €', defaultPrice: 120.00 },
    { category: 'Luftdichtigkeit – Thermografie & Energiecheck', title: 'Thermografie-Gutachten / Bericht (inkl. Auswertung + Fotos)', unit: 'Pauschale', hint: '375–585 €', defaultPrice: 480.00 },
    { category: 'Luftdichtigkeit – Thermografie & Energiecheck', title: 'Thermografie kombiniert mit Blower-Door (Gesamtpaket EFH)', unit: 'Pauschale', hint: '660–1.040 €', defaultPrice: 850.00 },
    // Stundenleistungen
    { category: 'Brandschutz – Stundenleistungen', title: 'Regiearbeit Blower-Door / Thermografie-Techniker', unit: 'Stunde', hint: '75–115 €', defaultPrice: 95.00 },
    { category: 'Brandschutz – Stundenleistungen', title: 'Kleinstauftrag pauschal (Mindestbetrag)', unit: 'Pauschale', hint: '95–145 €', defaultPrice: 120.00 },
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
