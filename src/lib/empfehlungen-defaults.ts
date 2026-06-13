export interface EmpfehlungDefault {
  trigger_category: string
  empfehlung_title: string
  empfehlung_unit: string
  empfehlung_unit_price: number
}

export const DEFAULT_EMPFEHLUNGEN: EmpfehlungDefault[] = [
  // Malerarbeiten
  { trigger_category: 'Malerarbeiten – Vorbereitung', empfehlung_title: 'Entsorgung Altmaterial & Abfall', empfehlung_unit: 'pauschal', empfehlung_unit_price: 95 },
  { trigger_category: 'Malerarbeiten – Wandanstrich', empfehlung_title: 'Deckenanstrich (2× Rolle)', empfehlung_unit: 'm²', empfehlung_unit_price: 12 },
  { trigger_category: 'Malerarbeiten – Außenarbeiten', empfehlung_title: 'Gerüststellung & Abbau', empfehlung_unit: 'pauschal', empfehlung_unit_price: 350 },
  // Trockenbau
  { trigger_category: 'Trockenbau – Ständerwerk', empfehlung_title: 'Spachteln & Schleifen (Q2)', empfehlung_unit: 'm²', empfehlung_unit_price: 14 },
  { trigger_category: 'Trockenbau – Deckenabhängung', empfehlung_title: 'Akustikputz oder Vlies grundieren', empfehlung_unit: 'm²', empfehlung_unit_price: 8 },
  // Fliesenleger
  { trigger_category: 'Fliesenleger – Fliesenverlegung', empfehlung_title: 'Verfugung (Keramik, Standard)', empfehlung_unit: 'm²', empfehlung_unit_price: 9 },
  { trigger_category: 'Fliesenleger – Fliesenverlegung', empfehlung_title: 'Sockelleisten verfliesen', empfehlung_unit: 'lfdm', empfehlung_unit_price: 18 },
  { trigger_category: 'Fliesenleger – Abdichtung', empfehlung_title: 'Wandfliesen Nassbereich', empfehlung_unit: 'm²', empfehlung_unit_price: 55 },
  // Sanitär
  { trigger_category: 'Sanitär – Montage', empfehlung_title: 'Dichtigkeitsprüfung & Drucktest', empfehlung_unit: 'pauschal', empfehlung_unit_price: 120 },
  { trigger_category: 'Sanitär – Rohinstallation', empfehlung_title: 'Thermostatventile austauschen', empfehlung_unit: 'Stk', empfehlung_unit_price: 65 },
  // Elektro
  { trigger_category: 'Elektro – Installation', empfehlung_title: 'Prüfung & Messung (VDE 0100)', empfehlung_unit: 'pauschal', empfehlung_unit_price: 180 },
  { trigger_category: 'Elektro – Unterverteilung', empfehlung_title: 'Potentialausgleich herstellen', empfehlung_unit: 'pauschal', empfehlung_unit_price: 145 },
  // Bodenbeläge
  { trigger_category: 'Bodenbeläge – Verlegen', empfehlung_title: 'Sockelleisten montieren', empfehlung_unit: 'lfdm', empfehlung_unit_price: 8 },
  { trigger_category: 'Bodenbeläge – Vorbereitung', empfehlung_title: 'Ausgleichsmasse einbringen', empfehlung_unit: 'm²', empfehlung_unit_price: 16 },
  // Garten
  { trigger_category: 'Garten – Bepflanzung & Beet', empfehlung_title: 'Mulchschicht ausbringen (10 cm)', empfehlung_unit: 'm²', empfehlung_unit_price: 12 },
  { trigger_category: 'Garten – Rasenpflege', empfehlung_title: 'Bewässerungsanlage verlegen', empfehlung_unit: 'pauschal', empfehlung_unit_price: 450 },
  // Rohbau
  { trigger_category: 'Rohbau & Maurer – Mauerwerk Außenwände', empfehlung_title: 'Ringbalken betonieren', empfehlung_unit: 'lfdm', empfehlung_unit_price: 95 },
  { trigger_category: 'Rohbau & Maurer – Wandöffnungen & Durchbrüche', empfehlung_title: 'Sturzträger liefern & einbauen', empfehlung_unit: 'Stk', empfehlung_unit_price: 280 },
  // Putz & Stuck
  { trigger_category: 'Putz & Stuck – Innenputz', empfehlung_title: 'Gipsspachtelung Übergänge', empfehlung_unit: 'm²', empfehlung_unit_price: 11 },
  { trigger_category: 'Putz & Stuck – Außenputz', empfehlung_title: 'Sockelabdichtung Außen', empfehlung_unit: 'lfdm', empfehlung_unit_price: 28 },
]
