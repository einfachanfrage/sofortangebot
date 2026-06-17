import type { BerechnetePosition } from './types'

interface CheckErgebnis {
  fehlende: string[]
  positionen: BerechnetePosition[]
}

function hat(positionen: BerechnetePosition[], ...begriffe: string[]): boolean {
  return positionen.some(p => begriffe.some(b => p.beschreibung.toLowerCase().includes(b)))
}

export function pruefeUndErgaenzeVollstaendigkeit(
  gewerk: string,
  positionen: BerechnetePosition[],
  transkript: string
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
    const hatStreichen = lower.includes('streichen') || lower.includes('anstrich') || lower.includes('anstreichen')
    if (hatStreichen) {
      if (!nurDecke && !nurBoden && !hat(ergaenzt, 'wand', 'wandfläche')) add('Wandflächen streichen')
      if (!nurWaende && !nurBoden && !hat(ergaenzt, 'decke', 'deckenfläche')) add('Deckenfläche streichen')
      if (!nurDecke && !hat(ergaenzt, 'boden schütz', 'abdeck', 'abdecken')) add('Boden schützen / Abdecken')
      if (!nurDecke && !nurBoden && !hat(ergaenzt, 'sockel', 'abkleben')) add('Sockelleisten abkleben')
    }
    const hatTapez = lower.includes('tapez') || lower.includes('raufaser') || lower.includes('tapete')
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
        const hatGlaetten = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('glätten') || p.beschreibung.toLowerCase().includes('untergrund'))
        const hatAufziehen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('aufzieh') || p.beschreibung.toLowerCase().includes('tapezier'))
        const hatStreichen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('raufaser streich') || p.beschreibung.toLowerCase().includes('tapete streich'))

        if (!hatEntfernen) ergaenzt.push({ beschreibung: 'Tapete entfernen', menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
        if (!hatGlaetten) ergaenzt.push({ beschreibung: 'Untergrund glätten / Spachteln', menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
        if (!hatAufziehen) ergaenzt.push({ beschreibung: 'Raufaser aufziehen', menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
        if (!hatStreichen) ergaenzt.push({ beschreibung: 'Raufaser streichen', menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
      } else {
        if (!hat(ergaenzt, 'tapete entfern', 'tapete abnehm')) add('Tapete entfernen')
        if (!hat(ergaenzt, 'untergrund', 'glätten')) add('Untergrund glätten / Spachteln')
        if (!hat(ergaenzt, 'aufzieh', 'tapezieren')) add('Raufaser aufziehen')
        if (!hat(ergaenzt, 'raufaser streich')) add('Raufaser streichen')
      }
    }

    // Fassade: Folgepositionen mit gleicher Fläche ergänzen
    const istFassade = lower.includes('fassade') || lower.includes('außenwand')
      || (lower.includes('außen') && lower.includes('streichen'))
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
        if (!hatReinigen) ergaenzt.push({ beschreibung: 'Fassade reinigen / Untergrundvorbereitung', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
        if (!hatGrundierung) ergaenzt.push({ beschreibung: 'Grundierung / Tiefengrund Fassade', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
        if (!hatFarbe) ergaenzt.push({ beschreibung: 'Fassadenfarbe 2× Anstrich', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
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
