import type { BerechnetePosition } from './types'

interface CheckErgebnis {
  fehlende: string[]
  positionen: BerechnetePosition[]
}

function hat(positionen: BerechnetePosition[], ...begriffe: string[]): boolean {
  return positionen.some(p => p.beschreibung != null && begriffe.some(b => p.beschreibung.toLowerCase().includes(b)))
}

export function pruefeUndErgaenzeVollstaendigkeit(
  gewerk: string,
  positionen: BerechnetePosition[],
  transkript: string,
  meta?: { fensterAnzahl?: number; tuerenAnzahl?: number }
): CheckErgebnis {
  const lower = transkript.toLowerCase()
  const fehlende: string[] = []
  const ergaenzt: BerechnetePosition[] = [...positionen]

  // Nur als Hinweis loggen — keine menge:0 Positionen einfügen die GPT dann falsch schätzt
  function add(beschreibung: string) {
    if (!hat(ergaenzt, ...beschreibung.toLowerCase().split(' ').slice(0, 2))) {
      fehlende.push(beschreibung)
      // Keine Position ergänzen: Engine hat keine Maße → GPT soll schätzen (besser als menge:0)
    }
  }

  // Mit echter Menge ergänzen — für Folgepositionen wo Fläche bekannt
  function addMitMenge(beschreibung: string, menge: number, einheit: string, berechnungsweg: string) {
    if (!hat(ergaenzt, ...beschreibung.toLowerCase().split(' ').slice(0, 2))) {
      ergaenzt.push({ beschreibung, menge, einheit, konfidenz: 'high', berechnungsweg, annahmen: [] })
    }
  }

  // Explizite Einschränkungen erkennen — nie automatisch ergänzen wenn Nutzer "nur X" sagt
  const nurDecke = lower.includes('nur decke') || lower.includes('nur die decke')
  const nurWaende = lower.includes('nur wand') || lower.includes('nur die wand') || lower.includes('nur wände')
  const nurBoden = lower.includes('nur boden') || lower.includes('nur den boden')

  // Engine-Positionen filtern die dem "nur X"-Wunsch widersprechen
  // Sockelleisten und Wandflächen gehören nicht zur Decke
  if (nurDecke) {
    const ohneWandUndSockel = ergaenzt.filter(p => {
      const d = p.beschreibung.toLowerCase()
      return !d.includes('sockel') && !d.includes('wand')
    })
    ergaenzt.length = 0
    ohneWandUndSockel.forEach(p => ergaenzt.push(p))
  }
  // "nur Wände" → keine Decke, aber Boden schützen BLEIBT (beim Wandstreichen immer nötig)
  if (nurWaende) {
    const ohneDeckeUndBoden = ergaenzt.filter(p => {
      const d = p.beschreibung.toLowerCase()
      // Boden schützen/abkleben bleibt — nur "Boden streichen" oder "Bodenfläche" entfernen
      const istBodenSchutz = d.includes('boden schütz') || d.includes('boden abkl') || d.includes('abdeck')
      return !d.includes('decke') && (!d.includes('boden') || istBodenSchutz)
    })
    ergaenzt.length = 0
    ohneDeckeUndBoden.forEach(p => ergaenzt.push(p))
  }
  // "nur Boden" → keine Wände, keine Decke, keine Sockelleisten
  if (nurBoden) {
    const nurBodenPositionen = ergaenzt.filter(p => {
      const d = p.beschreibung.toLowerCase()
      return !d.includes('wand') && !d.includes('decke') && !d.includes('sockel')
    })
    ergaenzt.length = 0
    nurBodenPositionen.forEach(p => ergaenzt.push(p))
  }

  if (gewerk === 'maler') {
    // Hilfsfunktion: Zahl vor oder nach einem Schlüsselwort im Transkript suchen
    function anzahlAus(schluessel: string, fallback = 1): number {
      const escaped = schluessel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      // "N [stück] außenfenster" / "N fenster" — Präfix-Wörter vor dem Schlüsselwort erlaubt
      const vorher = new RegExp(`(\\d+)\\s*(?:stück\\s*)?(?:[a-zäöüß]+)?${escaped}`, 'i')
      // "fenster N" — aber NUR wenn die Zahl direkt danach kommt (max 2 Wörter dazwischen)
      const nachher = new RegExp(`${escaped}\\s*(\\d+)`, 'i')
      // "N stück" irgendwo im Text (allgemeiner Fallback)
      const stueckAllgemein = new RegExp(`(\\d+)\\s*stück`, 'i')
      const m = lower.match(vorher) ?? lower.match(nachher) ?? lower.match(stueckAllgemein)
      return m ? parseInt(m[1]) : fallback
    }

    const hatStreichen = lower.includes('streichen') || lower.includes('anstrich') || lower.includes('anstreichen')
    // Neubau/Erstanstrich triggert automatisch Grundierung
    const hatGrundierung = lower.includes('grundier') || lower.includes('voranstrich') || lower.includes('tiefengrund')
      || lower.includes('neubau') || lower.includes('erstanstrich') || lower.includes('rohbau')
    if (hatStreichen) {
      if (!nurDecke && !nurBoden && !hat(ergaenzt, 'wand', 'wandfläche')) add('Wandflächen streichen')
      if (!nurWaende && !nurBoden && !hat(ergaenzt, 'decke', 'deckenfläche')) add('Deckenfläche streichen')
      if (!nurDecke && !hat(ergaenzt, 'boden schütz', 'abdeck', 'abdecken')) add('Boden schützen / Abdecken')
      if (!nurDecke && !nurBoden && !hat(ergaenzt, 'sockel', 'abkleben')) add('Sockelleisten abkleben')
    }
    if (hatGrundierung) {
      // Grundierung mit gleicher Fläche wie Wandflächen-Position ergänzen
      if (!hat(ergaenzt, 'grundier', 'voranstrich', 'tiefengrund')) {
        const wandPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
        if (wandPos) {
          ergaenzt.unshift({ beschreibung: 'Voranstrich / Grundierung', menge: wandPos.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Wandflächen (${wandPos.menge} m²)`, annahmen: [] })
        } else {
          add('Voranstrich / Grundierung')
        }
      }
    }

    // Türen lackieren → vollständige Arbeitspositionen (Schleifen, Grundieren, 2× Lackieren, Zargen)
    const hatTuerenLackieren = (lower.includes('tür') || lower.includes('türen')) &&
      (lower.includes('lackier') || lower.includes('lack') || lower.includes('neu streich'))
    if (hatTuerenLackieren && !hat(ergaenzt, 'türen abschleifen', 'tür abschleifen')) {
      const anzTueren = anzahlAus('tür')
      ergaenzt.push({ beschreibung: 'Türen abschleifen', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en) aus Transkript`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Türen grundieren', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Türen lackieren — 1. Anstrich', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Türen lackieren — 2. Anstrich', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Türzargen lackieren', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Zarge(n)`, annahmen: [] })
    }

    // Fenster lackieren/streichen → Schleifen, Grundieren, 2× Anstrich
    // Außenfenster: "8 Holzfenster außen streichen", "Fenster lackieren", "Fenster neu streichen"
    const hatFensterLackieren = lower.includes('fenster') &&
      (lower.includes('lackier') || lower.includes('holzfenster') ||
       lower.includes('fenster streich') || lower.includes('fenster anstrich') ||
       (lower.includes('außen') && lower.includes('streich') && lower.includes('fenster'))) &&
      !lower.includes('fenster ab') // nicht "Fenster abkleben" allein
    if (hatFensterLackieren && !hat(ergaenzt, 'fenster abschleifen')) {
      const anzFenster = (meta?.fensterAnzahl ?? 0) > 1 ? meta!.fensterAnzahl! : anzahlAus('fenster')
      const istOelfarbe = lower.includes('ölfarbe') || lower.includes('oelfarbe') || lower.includes('öl')
      const farbTyp = istOelfarbe ? 'Ölfarbe' : 'Lack'
      const istAußen = lower.includes('außen') || lower.includes('holzfenster')
      // 2-seitig: Anstrich-Stückzahl verdoppeln (beide Seiten lackieren), Schleifen/Grundieren bleibt gleich
      const istZweiSeitig = lower.includes('2-seitig') || lower.includes('2 seitig') || lower.includes('2seitig') || lower.includes('zweiseitig') || lower.includes('beidseitig') || lower.includes('beide seiten') || lower.includes('innen und außen') || lower.includes('innen und aussen')
      const anzAnstrich = istZweiSeitig ? anzFenster * 2 : anzFenster
      const zweiSeitigHinweis = istZweiSeitig ? ' (2-seitig)' : ''
      ergaenzt.push({ beschreibung: 'Fenster abschleifen', menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster aus Transkript`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Fenster grundieren', menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster`, annahmen: [] })
      ergaenzt.push({ beschreibung: `Fenster ${farbTyp} — 1. Anstrich${zweiSeitigHinweis}`, menge: anzAnstrich, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster${istZweiSeitig ? ' × 2 Seiten' : ''}`, annahmen: [] })
      ergaenzt.push({ beschreibung: `Fenster ${farbTyp} — 2. Anstrich${zweiSeitigHinweis}`, menge: anzAnstrich, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster${istZweiSeitig ? ' × 2 Seiten' : ''}`, annahmen: [] })
      if (istAußen && !hat(ergaenzt, 'abdecken umgebung', 'umgebung abdecken')) {
        ergaenzt.push({ beschreibung: 'Abdecken Umgebung', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Außenarbeiten — Umgebung abdecken', annahmen: [] })
      }
    }

    // Heizkörper lackieren → Abschleifen, Grundieren, 2× Lackieren
    const hatHeizkLackieren = (lower.includes('heizkörper') || lower.includes('heizkoerper') || lower.includes('heizung')) &&
      (lower.includes('lackier') || lower.includes('lack') || lower.includes('neu streich'))
    if (hatHeizkLackieren && !hat(ergaenzt, 'heizkörper abschleifen', 'heizkoerper abschleifen')) {
      const anzHzk = anzahlAus('heizkörper', anzahlAus('heizkoerper', 1))
      ergaenzt.push({ beschreibung: 'Heizkörper abschleifen', menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper aus Transkript`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Heizkörper grundieren', menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Heizkörper lackieren — 1. Anstrich', menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Heizkörper lackieren — 2. Anstrich', menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper`, annahmen: [] })
    }

    // Lampen / Leuchten abkleben — Stückzahl aus Transkript
    const hatLampenAbkleben = lower.includes('lamp') || lower.includes('leuchte') || lower.includes('deckenleuchte')
    if (hatLampenAbkleben && hatStreichen && !hat(ergaenzt, 'lampen abkl', 'leuchten abkl')) {
      const anzLampen = anzahlAus('lamp', anzahlAus('leuchte', 1))
      ergaenzt.push({ beschreibung: 'Lampen / Leuchten abkleben', menge: anzLampen, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzLampen} Leuchte(n) aus Transkript`, annahmen: [] })
    }

    // Sockelleisten lackieren (eigene Arbeit, nicht nur abkleben) → Schleifen + 2× Lackieren
    const hatSockelLackieren = lower.includes('sockelleist') &&
      (lower.includes('lackier') || lower.includes('lack'))
    if (hatSockelLackieren && !hat(ergaenzt, 'sockelleisten lackieren', 'sockelleisten abschleifen')) {
      // lfdm aus Transkript: "ca. 18 Meter", "18 lfdm", "18 lfm"
      const lfdmMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:lfm|lfdm|laufende?r?\s*meter|meter\s*umfang|meter)/i)
      const lfdm = lfdmMatch ? parseFloat(lfdmMatch[1].replace(',', '.')) : null
      if (lfdm !== null && lfdm > 0) {
        // Bestehende "Sockelleisten abkleben"-Position entfernen — wird durch lackieren ersetzt
        const ohneSockelAbkl = ergaenzt.filter(p => !p.beschreibung.toLowerCase().includes('sockelleisten abkl'))
        ergaenzt.length = 0
        ohneSockelAbkl.forEach(p => ergaenzt.push(p))
        ergaenzt.push({ beschreibung: 'Sockelleisten abschleifen', menge: lfdm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdm} lfm aus Transkript`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Sockelleisten lackieren — 1. Anstrich', menge: lfdm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdm} lfm`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Sockelleisten lackieren — 2. Anstrich', menge: lfdm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdm} lfm`, annahmen: [] })
      } else {
        add('Sockelleisten abschleifen')
        add('Sockelleisten lackieren — 1. Anstrich')
        add('Sockelleisten lackieren — 2. Anstrich')
      }
    }

    // Dachschräge → Spachteln, Grundierung, Streichen
    const hatDachschraege = lower.includes('dachschräge') || lower.includes('dachschraege') || lower.includes('schräge') || lower.includes('schraege')
    if (hatDachschraege) {
      // Fläche aus Engine-Position holen (maler.ts fügt "Dachschräge streichen" hinzu) oder aus Transkript
      const dachPos = ergaenzt.find(p => (p.beschreibung ?? '').toLowerCase().includes('dachschräge'))
      const m2Match = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
      const dsm2 = dachPos?.menge ?? (m2Match ? parseFloat(m2Match[1].replace(',', '.')) : null)
      if (dsm2 !== null && dsm2 > 0) {
        if (!hat(ergaenzt, 'spachtel', 'untergrund')) ergaenzt.push({ beschreibung: 'Dachschräge spachteln / Untergrundvorbereitung', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m²`, annahmen: [] })
        if (!hat(ergaenzt, 'grundier')) ergaenzt.push({ beschreibung: 'Dachschräge Grundierung', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m²`, annahmen: [] })
        if (!hat(ergaenzt, 'dachschräge streich', 'schräge streich')) ergaenzt.push({ beschreibung: 'Dachschräge streichen — 2× Anstrich', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m²`, annahmen: [] })
      } else {
        if (!hat(ergaenzt, 'spachtel')) add('Dachschräge spachteln / Untergrundvorbereitung')
        if (!hat(ergaenzt, 'grundier')) add('Dachschräge Grundierung')
        if (!hat(ergaenzt, 'dachschräge streich')) add('Dachschräge streichen')
      }
    }

    // Graffiti → Entfernen, Grundierung, Fassadenfarbe
    const hatGraffiti = lower.includes('graffiti') || lower.includes('schmiererei') || lower.includes('vandalism')
    if (hatGraffiti && !hat(ergaenzt, 'graffiti entfern')) {
      const m2Match = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
      const gm2 = m2Match ? parseFloat(m2Match[1].replace(',', '.')) : null
      if (gm2 !== null && gm2 > 0) {
        ergaenzt.push({ beschreibung: 'Graffiti entfernen', menge: gm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${gm2} m² aus Transkript`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Grundierung Fassade nach Graffiti', menge: gm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${gm2} m²`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Fassadenfarbe 2× Anstrich', menge: gm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${gm2} m²`, annahmen: [] })
      } else {
        add('Graffiti entfernen')
        add('Grundierung Fassade nach Graffiti')
        add('Fassadenfarbe 2× Anstrich')
      }
    }

    // Altbau → Erschwerniszuschlag Pauschale
    const hatAltbau = lower.includes('altbau') || lower.includes('altgebäude') || lower.includes('altbestand')
    if (hatAltbau && !hat(ergaenzt, 'erschwerniszuschlag altbau', 'altbau pauschale')) {
      ergaenzt.push({ beschreibung: 'Erschwerniszuschlag Altbau', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Altbau im Transkript erkannt', annahmen: [] })
    }

    // Denkmalschutz → Erschwerniszuschlag Denkmal Pauschale
    const hatDenkmal = lower.includes('denkmal') || lower.includes('denkmalschutz') || lower.includes('denkmalgeschütz')
    if (hatDenkmal && !hat(ergaenzt, 'erschwerniszuschlag denkmal', 'denkmal pauschale')) {
      ergaenzt.push({ beschreibung: 'Erschwerniszuschlag Denkmalschutz', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Denkmalschutz im Transkript erkannt', annahmen: [] })
    }

    // Stuck → restaurieren (Altbau/Sanierung) vs abkleben (beim Streichen) vs Rosette (Stück)
    const hatStuck = lower.includes('stuck') || lower.includes('stuckdecke') || lower.includes('stuckelement') || lower.includes('stuckrosette')
    if (hatStuck && !hat(ergaenzt, 'stuck abkl', 'stuckdecke abkl', 'stuckrosette', 'stuck restau')) {
      const istRosette = lower.includes('stuckrosette') || lower.includes('rosette')
      const istRestaurieren = lower.includes('stuck restau') || lower.includes('stuckrestau') ||
        (lower.includes('stuck') && (lower.includes('restau') || lower.includes('sanieren') || lower.includes('instandsetz')))
      if (istRosette) {
        const anzRosetten = anzahlAus('rosette', anzahlAus('stuckrosette', 1))
        ergaenzt.push({ beschreibung: 'Stuckrosette abkleben', menge: anzRosetten, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzRosetten} Stuckrosette(n) aus Transkript`, annahmen: [] })
      } else if (istRestaurieren) {
        ergaenzt.push({ beschreibung: 'Stuck restaurieren', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Stuckrestaurierung im Transkript erkannt', annahmen: [] })
      } else {
        ergaenzt.push({ beschreibung: 'Stuckdecke / Stuckelemente abkleben', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Stuck im Transkript erkannt', annahmen: [] })
      }
    }

    // Betonwände → Schleifen/Vorbereitung + Tiefengrund + Betonfarbe (ersetzt normale Wandflächen streichen)
    const hatBetonwand = (lower.includes('betonwand') || lower.includes('betonwände') ||
      (lower.includes('beton') && lower.includes('wand'))) &&
      !lower.includes('balkon') && !lower.includes('beton boden')
    if (hatBetonwand && !hat(ergaenzt, 'betonwand schleifen', 'betonwände schleifen', 'tiefengrund beton')) {
      // Wandfläche aus Engine holen
      const wandPosBeton = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
      if (wandPosBeton) {
        const bm2 = wandPosBeton.menge
        // Normale Wandposition entfernen — wird durch Beton-Positionen ersetzt
        const ohneWand = ergaenzt.filter(p => !p.beschreibung.toLowerCase().includes('wandfläch'))
        ergaenzt.length = 0
        ohneWand.forEach(p => ergaenzt.push(p))
        ergaenzt.push({ beschreibung: 'Betonwände schleifen / Untergrundvorbereitung', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m²`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Tiefengrund Beton', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m²`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Betonfarbe streichen', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m²`, annahmen: [] })
      } else {
        add('Betonwände schleifen / Untergrundvorbereitung')
        add('Tiefengrund Beton')
        add('Betonfarbe streichen')
      }
    }

    // Estrich / Epoxid versiegeln → Estrich schleifen + Schicht 1 + Schicht 2
    const hatEstrich = lower.includes('estrich') || lower.includes('epoxid') || lower.includes('versiegeln')
    if (hatEstrich && !hat(ergaenzt, 'estrich schleifen', 'epoxid')) {
      // Bodenfläche aus Engine oder Transkript
      const bodenPosEstrich = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden'))
      const em2 = bodenPosEstrich?.menge ?? null
      if (em2 !== null && em2 > 0) {
        // Boden schützen-Position entfernen — Epoxid IS der Boden
        const ohneBoden = ergaenzt.filter(p => !p.beschreibung.toLowerCase().includes('boden schütz') && !p.beschreibung.toLowerCase().includes('boden — '))
        ergaenzt.length = 0
        ohneBoden.forEach(p => ergaenzt.push(p))
        ergaenzt.push({ beschreibung: 'Estrich schleifen / Untergrundvorbereitung', menge: em2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${em2} m²`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Epoxid / Versiegelung — Schicht 1', menge: em2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${em2} m²`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Epoxid / Versiegelung — Schicht 2', menge: em2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${em2} m²`, annahmen: [] })
      } else {
        add('Estrich schleifen / Untergrundvorbereitung')
        add('Epoxid / Versiegelung — Schicht 1')
        add('Epoxid / Versiegelung — Schicht 2')
      }
    }

    // Garagenboden Betonfarbe: wenn explizit Garagenboden gestrichen wird
    const hatGaragenboden = (lower.includes('garagenboden') || (lower.includes('garage') && lower.includes('boden')))
      && (lower.includes('beton') || lower.includes('betonfarbe') || lower.includes('grau'))
    if (hatGaragenboden && !hat(ergaenzt, 'garagenboden', 'garagenbod')) {
      const bodenPosGar = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden'))
      const gm2 = bodenPosGar?.menge ?? null
      if (gm2 !== null && gm2 > 0) {
        ergaenzt.unshift({ beschreibung: 'Garagenboden Betonfarbe', menge: gm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${gm2} m²`, annahmen: [] })
      } else {
        add('Garagenboden Betonfarbe')
      }
    }

    // Gerüst → wenn explizit erwähnt oder bei großen Fassadenflächen
    const hatGeruest = lower.includes('gerüst') || lower.includes('geruest') || lower.includes('gerüst nötig')
    if (hatGeruest && !hat(ergaenzt, 'gerüst', 'geruest')) {
      ergaenzt.push({ beschreibung: 'Gerüst stellen und abbauen', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Gerüst im Transkript erwähnt', annahmen: [] })
    }

    // Heizkörper ABKLEBEN beim Streichen (nicht lackieren) → Stück
    const hatHeizkAbkleben = hatStreichen && (lower.includes('heizkörper') || lower.includes('heizkoerper'))
      && !hatHeizkLackieren // nicht wenn Heizkörper LACKIERT werden
    if (hatHeizkAbkleben && !hat(ergaenzt, 'heizkörper abkl', 'heizkörper abschleifen')) {
      const anzHzkAbkl = anzahlAus('heizkörper', anzahlAus('heizkoerper', 1))
      ergaenzt.push({ beschreibung: 'Heizkörper abkleben', menge: anzHzkAbkl, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzkAbkl} Heizkörper aus Transkript`, annahmen: [] })
    }

    // Bewohnt / Möbel → Möbel schützen + Erschwerniszuschlag
    const hatBewohnt = lower.includes('bewohnt') || lower.includes('möbel') || lower.includes('einrichtung') || lower.includes('bewohnte')
    if (hatBewohnt && !hat(ergaenzt, 'möbel schütz', 'möbel abdeck', 'erschwerniszuschlag bewohnt')) {
      // Bodenfläche aus Engine-Position holen, Fallback: null
      const bodenPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden'))
      const bodenmenge = bodenPos?.menge ?? null
      if (bodenmenge !== null) {
        ergaenzt.push({ beschreibung: 'Möbel schützen / Abdecken', menge: bodenmenge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenmenge} m²`, annahmen: [] })
      } else {
        add('Möbel schützen / Abdecken')
      }
      ergaenzt.push({ beschreibung: 'Erschwerniszuschlag bewohnt', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Bewohnter Zustand im Transkript erkannt', annahmen: [] })
    }

    // Balkon → Balkonboden + Brüstung + ggf. Betonfarbe/Untergrundvorbereitung
    const hatBalkon = lower.includes('balkon') || lower.includes('loggia') || lower.includes('terrasse')
    if (hatBalkon && !hat(ergaenzt, 'balkonboden', 'brüstung', 'terrasse')) {
      const hatBeton = lower.includes('beton') || lower.includes('betonfarbe')
      const hatBruestung = lower.includes('brüstung') || lower.includes('bruestung') || lower.includes('geländer')
      // Bodenfläche aus Engine oder Transkript
      const bodenPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden'))
      const bodenM2 = bodenPos?.menge ?? null
      const beschrBoden = hatBeton ? 'Balkonboden Betonfarbe' : 'Balkonboden streichen'
      if (bodenM2 !== null) {
        ergaenzt.push({ beschreibung: beschrBoden, menge: bodenM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenM2} m²`, annahmen: [] })
      } else {
        add(beschrBoden)
      }
      if (hatBruestung) {
        // Brüstung: lfdm × hoehe = m² — Werte aus Transkript
        const lfdmBrMatch = lower.match(/brüst(?:ung)?[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:lfm|lfdm|laufende?r?\s*meter|meter)/i)
        const lfdmBr = lfdmBrMatch ? parseFloat(lfdmBrMatch[1].replace(',', '.')) : null
        const hBrMatch = lower.match(/brüst(?:ung)?[^.!?]*?(\d+(?:[.,]\d+)?)\s*m?\s*hoch/i)
          ?? lower.match(/(\d+(?:[.,]\d+)?)\s*m?\s*hoch[^.!?]*?brüst/i)
        const hBr = hBrMatch ? parseFloat(hBrMatch[1].replace(',', '.')) : 1.0
        if (lfdmBr !== null && lfdmBr > 0) {
          const brM2 = Math.round(lfdmBr * hBr * 100) / 100
          ergaenzt.push({ beschreibung: 'Brüstung innen streichen', menge: brM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${lfdmBr} lfm × ${hBr} m = ${brM2} m²`, annahmen: [] })
        } else {
          add('Brüstung innen streichen')
        }
      }
      if (hatBeton && !hat(ergaenzt, 'untergrundvorbereitung beton', 'betonvorbereitung')) {
        ergaenzt.push({ beschreibung: 'Untergrundvorbereitung Beton', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Betonuntergrund im Transkript erkannt', annahmen: [] })
      }
    }

    // Holzdecke / Holzdielen ölen → Abschleifen + Ölen 2× + Boden schützen
    const hatHolzOelen = (lower.includes('holzdecke') || (lower.includes('holz') && (lower.includes('decke') || lower.includes('dielen') || lower.includes('holzbalken'))))
      && (lower.includes('öl') || lower.includes('oel') || lower.includes('ölen'))
    if (hatHolzOelen && !hat(ergaenzt, 'holzdecke abschleifen', 'holzdecke ölen')) {
      const m2Match = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
      const hm2 = m2Match ? parseFloat(m2Match[1].replace(',', '.')) : null
      if (hm2 !== null && hm2 > 0) {
        ergaenzt.push({ beschreibung: 'Holzdecke abschleifen', menge: hm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${hm2} m² aus Transkript`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Holzdecke ölen — 2× Anstrich', menge: hm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${hm2} m²`, annahmen: [] })
        if (!hat(ergaenzt, 'boden schütz', 'abdeck')) {
          ergaenzt.push({ beschreibung: 'Boden schützen / Abdecken', menge: hm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Schutz unter Deckenfläche ${hm2} m²`, annahmen: [] })
        }
      } else {
        add('Holzdecke abschleifen')
        add('Holzdecke ölen — 2× Anstrich')
        add('Boden schützen / Abdecken')
      }
    }

    // Treppenhaus → Geländer abkleben Pauschale
    const hatTreppenhaus = lower.includes('treppenhaus') || lower.includes('treppe') || lower.includes('treppenaufgang')
    if (hatTreppenhaus && hatStreichen && !hat(ergaenzt, 'geländer abkl', 'geländer abdecken')) {
      ergaenzt.push({ beschreibung: 'Geländer abkleben', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Treppenhaus — Geländer immer abkleben', annahmen: [] })
    }

    // Schimmel → Schimmelbehandlung + Sperranstrich (additiv — normale Streich-Positionen bleiben)
    const hatSchimmel = lower.includes('schimmel') || lower.includes('schimmelbehandl')
    if (hatSchimmel && !hat(ergaenzt, 'schimmelbehandlung', 'schimmel behandl')) {
      // Schimmel-m² aus Transkript: "ca. 3 qm" neben "schimmel" — nicht Gesamt-Raumfläche
      const schimmelMatch = lower.match(/schimmel[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
        ?? lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?]*?schimmel/i)
      const schimmelM2 = schimmelMatch ? parseFloat(schimmelMatch[1].replace(',', '.')) : null
      if (schimmelM2 && schimmelM2 > 0) {
        ergaenzt.unshift({ beschreibung: 'Schimmelbehandlung', menge: schimmelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${schimmelM2} m² aus Transkript (Schimmelbereich)`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Sperranstrich nach Schimmelbehandlung', menge: schimmelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${schimmelM2} m² Schimmelbereich`, annahmen: [] })
      } else {
        add('Schimmelbehandlung')
        add('Sperranstrich nach Schimmelbehandlung')
      }
    }

    // Wasserflecken / Sperranstrich an Decke → ersetzt Deckenfläche streichen durch vollständige Abfolge
    const hatFlecken = !hatSchimmel && (lower.includes('fleck') || lower.includes('wasserfleck') || lower.includes('sperr') || lower.includes('sperranstrich'))
    if (hatFlecken && !hat(ergaenzt, 'sperranstrich', 'flecken sperr')) {
      const deckenPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('deckenfläch'))
      if (deckenPos) {
        const dm2 = deckenPos.menge
        // Sperranstrich + Grundierung VOR der Deckenfläche streichen einfügen
        const ohneDecke = ergaenzt.filter(p => !p.beschreibung.toLowerCase().includes('deckenfläch'))
        ergaenzt.length = 0
        ohneDecke.forEach(p => ergaenzt.push(p))
        ergaenzt.push({ beschreibung: 'Sperranstrich / Flecken sperren — Decke', menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Deckenfläche grundieren', menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
        ergaenzt.push({ beschreibung: `Deckenfläche streichen — 2× Anstrich`, menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
      } else {
        add('Sperranstrich / Flecken sperren')
      }
    }

    // Feuchtraumfarbe → Wandposition umbenennen
    const hatFeuchtraum = lower.includes('feuchtraum') || lower.includes('feuchtraumfarbe') || lower.includes('nassraum') || lower.includes('feuchtraumfar')
    if (hatFeuchtraum) {
      for (const p of ergaenzt) {
        if (p.beschreibung.toLowerCase().includes('wandfläch') && p.beschreibung.toLowerCase().includes('streichen') && !p.beschreibung.toLowerCase().includes('feuchtraum')) {
          p.beschreibung = p.beschreibung.replace(/streichen(\s*—\s*.+)?$/i, 'streichen (Feuchtraumfarbe)')
        }
      }
    }

    // Spachtelarbeiten Q2 + Schleifen → für alle Wand-/Deckenflächen
    const hatSpachteln = lower.includes('spachtel') || lower.includes('q2') || lower.includes('q3')
    const hatSchleifenArb = lower.includes('schleifen') && !lower.includes('abschleifen')
    if ((hatSpachteln || hatSchleifenArb) && !hat(ergaenzt, 'spachtelarbeiten', 'q2')) {
      // Alle Wand+Decken-Positionen als Basis
      const basisPositionen = ergaenzt.filter(p => {
        const d = p.beschreibung.toLowerCase()
        return (d.includes('wandfläch') || d.includes('deckenfläch')) && p.einheit === 'm²'
      })
      if (basisPositionen.length > 0) {
        for (const basisPos of basisPositionen) {
          // Raumname extrahieren (nach " — ")
          const raumMatch = basisPos.beschreibung.match(/ — (.+)$/)
          const raumSuffix = raumMatch ? ` — ${raumMatch[1]}` : ''
          if (hatSpachteln) ergaenzt.push({ beschreibung: `Spachtelarbeiten Q2${raumSuffix}`, menge: basisPos.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie ${basisPos.beschreibung.split(' — ')[0]}`, annahmen: [] })
          if (hatSchleifenArb) ergaenzt.push({ beschreibung: `Schleifen${raumSuffix}`, menge: basisPos.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie ${basisPos.beschreibung.split(' — ')[0]}`, annahmen: [] })
        }
      } else {
        if (hatSpachteln) add('Spachtelarbeiten Q2')
        if (hatSchleifenArb) add('Schleifen')
      }
    }

    // Türrahmen streichen (separates Produkt, nicht Türblatt lackieren)
    const hatTuerrahmen = lower.includes('türrahmen') || lower.includes('tuerrahmen') || lower.includes('türrahmen streich')
    if (hatTuerrahmen && !hat(ergaenzt, 'türrahmen')) {
      const anzRahmen = anzahlAus('türrahmen', anzahlAus('tuerrahmen', 3))
      ergaenzt.push({ beschreibung: 'Türrahmen schleifen', menge: anzRahmen, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzRahmen} Türrahmen aus Transkript`, annahmen: [] })
      ergaenzt.push({ beschreibung: 'Türrahmen streichen', menge: anzRahmen, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzRahmen} Türrahmen`, annahmen: [] })
    }

    // Sockelleisten STREICHEN (nicht lackieren — z.B. "Sockelleisten streichen" ohne Lackkontext)
    const hatSockelStreichen = lower.includes('sockelleist') && lower.includes('streich') &&
      !lower.includes('lackier') && !lower.includes('lack ') // explizit "streichen" ohne Lack-Kontext
    if (hatSockelStreichen && !hat(ergaenzt, 'sockelleisten schleifen', 'sockelleisten streich')) {
      const lfdmMatchStr = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:lfm|lfdm|laufende?r?\s*meter|meter)/i)
      const lfdmStr = lfdmMatchStr ? parseFloat(lfdmMatchStr[1].replace(',', '.')) : null
      if (lfdmStr !== null && lfdmStr > 0) {
        const ohneSockelAbkl2 = ergaenzt.filter(p => !p.beschreibung.toLowerCase().includes('sockelleisten abkl'))
        ergaenzt.length = 0
        ohneSockelAbkl2.forEach(p => ergaenzt.push(p))
        ergaenzt.push({ beschreibung: 'Sockelleisten schleifen', menge: lfdmStr, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdmStr} lfm aus Transkript`, annahmen: [] })
        ergaenzt.push({ beschreibung: 'Sockelleisten streichen', menge: lfdmStr, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdmStr} lfm`, annahmen: [] })
      } else {
        add('Sockelleisten schleifen')
        add('Sockelleisten streichen')
      }
    }

    // Tapete entfernen + dann streichen (KEIN neues Tapezieren — kein Raufaser aufziehen)
    // Erkennbar an: "tapete runter/entfernen" PLUS "streichen/anstrich" OHNE neues tapezieren
    const hatTapeteWegDannStreich = (lower.includes('tapete') || lower.includes('tapeten')) &&
      (lower.includes('runter') || lower.includes('herunter') || lower.includes('entfern') || lower.includes('abnehm') || lower.includes('abmachen')) &&
      (lower.includes('streich') || lower.includes('anstrich')) &&
      !lower.includes('tapezier') && !lower.includes('raufaser') && !lower.includes('aufzieh')
    if (hatTapeteWegDannStreich) {
      // Wandfläche aus Engine oder Text
      const wandPosTapRaus = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
      const tfmRaus = wandPosTapRaus?.menge ?? null
      if (tfmRaus !== null && tfmRaus > 0) {
        if (!hat(ergaenzt, 'tapete entfern')) ergaenzt.push({ beschreibung: 'Tapete entfernen', menge: tfmRaus, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfmRaus} m²`, annahmen: [] })
        if (!hat(ergaenzt, 'spachtel', 'glätten')) ergaenzt.push({ beschreibung: 'Wände spachteln / glätten', menge: tfmRaus, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfmRaus} m²`, annahmen: [] })
        // "Wandflächen streichen" bleibt bereits durch hatStreichen → kein neues push nötig
      } else {
        if (!hat(ergaenzt, 'tapete entfern')) add('Tapete entfernen')
        if (!hat(ergaenzt, 'spachtel', 'glätten')) add('Wände spachteln / glätten')
      }
    }

    // Akzentwand-Position bereits vorhanden → hatTapez NICHT triggern (Tapete-Erwähnung gehört zur Akzentwand)
    const hatAkzentwandPos = ergaenzt.some(p => {
      const d = p.beschreibung.toLowerCase()
      return d.includes('akzentwand') || d.includes('motivtapete') || d.includes('vliestapete')
    })
    const hatTapez = !hatAkzentwandPos && !hatTapeteWegDannStreich && (lower.includes('tapez') || lower.includes('raufaser') || lower.includes('tapete'))
    if (hatTapez) {
      // Wandfläche aus Engine oder direkt aus Text
      const wandPosTapez = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wand'))
      let tfm = wandPosTapez?.menge ?? null
      if (tfm === null) {
        const m2Match = transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
        if (m2Match) tfm = parseFloat(m2Match[1].replace(',', '.'))
      }
      // Etagen-Multiplikation: "4 Etagen, je 18 qm" → tfm = 4 × 18
      if (tfm !== null) {
        const etMatch = transkript.match(/(\d+)\s*(?:etagen?|stockwerke?|etag\b)/i)
        if (etMatch) {
          const etagen = parseInt(etMatch[1])
          if (etagen > 1) tfm = tfm * etagen
        }
      }
      if (tfm !== null && tfm > 0) {
        // Engine-Position "Wandflächen streichen" ersetzen durch tapezier-spezifische Positionen
        const ohneWand = ergaenzt.filter(p => !p.beschreibung.toLowerCase().includes('wandflächen streichen'))
        ergaenzt.length = 0
        ohneWand.forEach(p => ergaenzt.push(p))

        const hatEntfernen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('tapete entf') || p.beschreibung.toLowerCase().includes('tapete abneh'))
        const hatAufziehen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('aufzieh') || p.beschreibung.toLowerCase().includes('tapezier'))
        const hatStreichen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('raufaser streich') || p.beschreibung.toLowerCase().includes('tapete streich') || p.beschreibung.toLowerCase().includes('vliestapete streich'))

        // Tapetentyp aus Transkript ableiten
        const istRaufaser = lower.includes('raufaser')
        const istVliestapete = lower.includes('vliestapete') || lower.includes('vlies')
        const tapetenTyp = istRaufaser ? 'Raufaser' : istVliestapete ? 'Vliestapete' : 'Tapete'

        if (!hatEntfernen) ergaenzt.push({ beschreibung: 'Tapete entfernen', menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
        if (!hatAufziehen) ergaenzt.push({ beschreibung: `${tapetenTyp} aufziehen`, menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
        if (!hatStreichen) ergaenzt.push({ beschreibung: `${tapetenTyp} streichen`, menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
        // Boden schützen beim Tapezieren — Bodenfläche aus Engine holen
        if (!hat(ergaenzt, 'boden schütz', 'abdeck')) {
          const bodenTapez = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden schütz') || p.beschreibung.toLowerCase().includes('boden —'))
          const wandQuadrat = tfm // Wandfläche als Proxy wenn keine Bodenfläche bekannt
          const bodenMenge = bodenTapez?.menge ?? null
          if (bodenMenge !== null) {
            // bereits vorhanden
          } else {
            // Bodenfläche aus Engine-Position oder Fallback
            const bodenEnginePos = positionen.find(p => p.beschreibung.toLowerCase().includes('boden'))
            if (bodenEnginePos) {
              ergaenzt.push({ beschreibung: 'Boden schützen / Abdecken', menge: bodenEnginePos.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenEnginePos.menge} m²`, annahmen: [] })
            } else {
              add('Boden schützen / Abdecken')
              void wandQuadrat
            }
          }
        }
      } else {
        if (!hat(ergaenzt, 'tapete entfern', 'tapete abnehm')) add('Tapete entfernen')
        if (!hat(ergaenzt, 'untergrund', 'glätten')) add('Untergrund glätten / Spachteln')
        if (!hat(ergaenzt, 'aufzieh', 'tapezieren')) add('Raufaser aufziehen')
        if (!hat(ergaenzt, 'raufaser streich')) add('Raufaser streichen')
      }
    }

    // Fassade: Folgepositionen mit gleicher Fläche ergänzen
    // "Außenfenster streichen" / "außen streichen" ohne explizite Fassade → kein Fassade-Block
    const istFassade = lower.includes('fassade') || lower.includes('außenwand')
      || (lower.includes('außen') && lower.includes('streichen') && !lower.includes('fenster') && !lower.includes('außenfen'))
      || lower.includes('garagenfassade') || lower.includes('garage außen')
    if (istFassade) {
      const hatRisse = lower.includes('riss') || lower.includes('schäden') || lower.includes('abgeplatzt')
        || lower.includes('moos') || lower.includes('algen')
      // Referenzfläche: Engine-Position oder direkt aus Raw-Text extrahieren
      const wandPos = ergaenzt.find(p =>
        p.beschreibung.toLowerCase().includes('wand') ||
        p.beschreibung.toLowerCase().includes('fassade') ||
        p.beschreibung.toLowerCase().includes('streichen')
      )
      // Fallback: m²-Angabe aus Transkript lesen wenn Engine nichts liefert
      let fm = wandPos?.menge ?? null
      if (fm === null) {
        const m2Match = transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
        if (m2Match) fm = parseFloat(m2Match[1].replace(',', '.'))
      }
      if (fm !== null && fm > 0) {
        // Direkte Prüfung statt addMitMenge — hat() matcht 'fassade' zu früh gegen Wandposition
        const hatReinigen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('reinigen'))
        const hatGrundierung = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('grundierung'))
        const hatFarbe = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('fassadenfarbe'))
        const hatRissfix = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('rissverschluss'))
        // Produktname je nach Material: Silikatfarbe / Dispersionsfarbe / Fassadenfarbe
        const fassadeFarbTyp = lower.includes('silikat') ? 'Silikatfarbe' : lower.includes('dispersion') ? 'Dispersionsfarbe' : 'Fassadenfarbe'
        if (!hatReinigen) ergaenzt.push({ beschreibung: 'Fassade reinigen / Untergrundvorbereitung', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
        if (!hatGrundierung) ergaenzt.push({ beschreibung: 'Grundierung / Tiefengrund Fassade', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
        if (!hatFarbe) ergaenzt.push({ beschreibung: `${fassadeFarbTyp} 2× Anstrich`, menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
        if (hatRisse && !hatRissfix) ergaenzt.push({ beschreibung: 'Rissverschluss / Spachtelarbeiten Außen', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Pauschale bei Rissen/Schäden', annahmen: [] })
      }
    }
  }

  if (gewerk === 'fliesen') {
    const nurBodenFliesen = lower.includes('nur boden') || lower.includes('nur bodenfliesen')
    const nurWandFliesen = lower.includes('nur wand') || lower.includes('nur wandfliesen')
    const hatNass = lower.includes('bad') || lower.includes('dusche') || lower.includes('nassbereich') || lower.includes('wc')
    if (hatNass) {
      if (!hat(ergaenzt, 'abdicht')) add('Verbundabdichtung')
    }
    if (!hat(ergaenzt, 'verfug')) {
      if (!nurWandFliesen && hat(ergaenzt, 'bodenfliesen')) add('Verfugung Boden')
      if (!nurBodenFliesen && hat(ergaenzt, 'wandfliesen')) add('Verfugung Wand')
    }
    if (lower.includes('bodengleich')) {
      if (!hat(ergaenzt, 'bodengleich')) add('Bodengleiche Dusche einbauen')
    }
  }

  if (gewerk === 'sanitaer_heizung') {
    const nurWC = lower.includes('nur wc') || lower.includes('nur die toilette')
    const nurWaschtisch = lower.includes('nur waschtisch') || lower.includes('nur waschbecken')
    const hatTausch = lower.includes('tausch') || lower.includes('wechsel') || lower.includes('erneuern')
    if (hatTausch && !hat(ergaenzt, 'demon', 'ausbauen', 'entfernen')) {
      add('Demontage Altanlage')
    }
    const hatWC = !nurWaschtisch && lower.includes('wc')
    const hatWaschtisch = !nurWC && (lower.includes('waschtisch') || lower.includes('waschbecken'))
    const hatDusche = lower.includes('dusche') || lower.includes('wanne')
    if ((hatWC || hatWaschtisch || hatDusche) && !hat(ergaenzt, 'silikon')) {
      add('Silikon Anschlussfugen')
    }
  }

  if (gewerk === 'trockenbau') {
    const hatWand = lower.includes('wand') || lower.includes('ständer') || lower.includes('rigips') || lower.includes('gk')
    if (hatWand) {
      if (!hat(ergaenzt, 'spachtel')) add('Spachtelarbeiten Q2')
      if (!hat(ergaenzt, 'ständer')) add('Ständerwerk')
    }
  }

  return { fehlende, positionen: ergaenzt }
}
