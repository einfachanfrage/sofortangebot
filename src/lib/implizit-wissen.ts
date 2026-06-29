import type { ExtrahierteDaten, KIRueckfrage } from '@/lib/mengen/types'

export interface ImpliziteSchlussfolgerung {
  typ: 'position_hinzufuegen' | 'flag_setzen' | 'wert_setzen' | 'rueckfrage'
  feld?: string
  wert?: unknown
  position_beschreibung?: string
  frage?: string
}

export interface ImpliziteRegel {
  trigger: (RegExp | string)[]
  gewerk?: string[]
  schlussfolgerung: ImpliziteSchlussfolgerung
  konfidenz: 'sicher' | 'wahrscheinlich' | 'moeglich'
  erklaerung: string
}

export const IMPLIZIT_REGELN: ImpliziteRegel[] = [
  // ── FASSADE / AUSSENARBEITEN ────────────────────
  {
    trigger: [/fassade/i, /außenwand/i, /außen\s+streichen/i, /garage\s+außen/i, /garagenfassade/i, /außenputz/i, /außenfarbe/i],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Fassade reinigen / Untergrundvorbereitung' },
    konfidenz: 'sicher',
    erklaerung: 'Außenarbeiten erfordern immer Untergrundvorbereitung',
  },
  {
    trigger: [/fassade/i, /außenwand/i, /außen\s+streichen/i, /garage\s+außen/i, /garagenfassade/i, /außenputz/i, /außenfarbe/i],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Grundierung / Tiefengrund Fassade' },
    konfidenz: 'sicher',
    erklaerung: 'Fassade benötigt immer Grundierung vor Anstrich',
  },
  {
    trigger: [/fassade/i, /außenwand/i, /außen\s+streichen/i, /garage\s+außen/i, /garagenfassade/i, /außenputz/i, /außenfarbe/i],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Fassadenfarbe 2× Anstrich' },
    konfidenz: 'sicher',
    erklaerung: 'Fassade = 2 Anstriche Standard',
  },
  {
    trigger: [/risse/i, /rissig/i, /schäden/i, /abgeplatzt/i, /moos/i, /algen/i, /schimmel/i, /alter\s+putz/i, /untergrundvorbereitung/i],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Rissverschluss / Spachtelarbeiten Außen' },
    konfidenz: 'sicher',
    erklaerung: 'Beschädigter Untergrund erfordert Rissverschluss vor Anstrich',
  },

  // ── MALER ──────────────────────────────────────
  {
    trigger: ['streichen', 'anstrich', 'lackieren'],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Abdecken/Abkleben Böden und Möbel' },
    konfidenz: 'sicher',
    erklaerung: 'Streicharbeiten erfordern immer Abdeckarbeiten',
  },
  {
    trigger: [/wände?\s+streichen/i],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Decke streichen' },
    konfidenz: 'wahrscheinlich',
    erklaerung: '"Wände streichen" schließt meist Decke ein',
  },
  {
    trigger: ['tapezieren'],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'rueckfrage', frage: 'Muss die alte Tapete vorher entfernt werden?' },
    konfidenz: 'sicher',
    erklaerung: 'Tapezieren = oft Altbelag entfernen',
  },
  {
    trigger: [
      /komplett\s+streichen/i, /alles\s+streichen/i,
      /das\s+volle\s+programm/i, /alles\s+drum\s+und\s+dran/i,
      /von\s+oben\s+bis\s+unten/i, /komplett\s+neu/i,
      /alles\s+neu\b/i, /frisch\s+machen/i, /den\s+ganzen\s+raum/i,
      /komplett\s+durch/i, /komplett\s+renovier/i, /muss\s+halt\s+alles\s+neu/i,
    ],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'flag_setzen', feld: 'komplett_inklusive_decke', wert: true },
    konfidenz: 'sicher',
    erklaerung: '"Komplett / das volle Programm" = Wände + Decke + Türen/Fenster',
  },
  {
    trigger: [/neubau/i, /rohbau/i, /erstanstrich/i],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Voranstrich/Grundierung' },
    konfidenz: 'sicher',
    erklaerung: 'Neubau erfordert Voranstrich',
  },

  // ── FLIESEN ────────────────────────────────────
  {
    trigger: ['bad', 'badezimmer', 'dusche', 'nassbereich'],
    gewerk: ['fliesen'],
    schlussfolgerung: { typ: 'flag_setzen', feld: 'nassbereich', wert: true },
    konfidenz: 'sicher',
    erklaerung: 'Bad/Dusche = immer Nassbereich',
  },
  {
    trigger: [/nassbereich/i, /dusche/i, /bad\s+fliesen/i],
    gewerk: ['fliesen'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Verbundabdichtung Nassbereich' },
    konfidenz: 'sicher',
    erklaerung: 'Nassbereich = Abdichtung Pflicht (DIN 18534)',
  },
  {
    trigger: [/bodengleich/i, /ebenerd/i, /barrierefreis?/i],
    gewerk: ['fliesen', 'sanitaer_heizung'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Bodengleiche Dusche einbauen' },
    konfidenz: 'sicher',
    erklaerung: 'Bodengleich = spezielle Position',
  },
  {
    trigger: [/komplett\s+(?:neu\s+)?fliesen/i, /bad\s+erneuern/i],
    gewerk: ['fliesen'],
    schlussfolgerung: { typ: 'rueckfrage', frage: 'Müssen die alten Fliesen entfernt werden?' },
    konfidenz: 'sicher',
    erklaerung: '"Komplett/Erneuern" = oft Altbelag entfernen',
  },
  {
    trigger: [/diagonal/i, /auf\s+gehrung/i, /45\s*grad/i],
    gewerk: ['fliesen', 'boden_parkett'],
    schlussfolgerung: { typ: 'wert_setzen', feld: 'verschnitt_prozent', wert: 15 },
    konfidenz: 'sicher',
    erklaerung: 'Diagonalverlegung = 15% Verschnitt statt 10%',
  },

  // ── SANITÄR ────────────────────────────────────
  {
    trigger: [/bad\s+komplett/i, /bad\s+erneuern/i, /bad\s+neu/i],
    gewerk: ['sanitaer_heizung'],
    schlussfolgerung: { typ: 'rueckfrage', frage: 'Sollen auch die Wasserleitungen erneuert werden?' },
    konfidenz: 'sicher',
    erklaerung: 'Komplett-Bad = Leitungen oft mit erneuern',
  },
  {
    trigger: ['wc', 'toilette', 'waschtisch', 'waschbecken'],
    gewerk: ['sanitaer_heizung'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Silikon Anschlussfugen' },
    konfidenz: 'wahrscheinlich',
    erklaerung: 'Sanitärobjekte brauchen Silikon-Abdichtung',
  },
  {
    trigger: [/(?:wc|waschtisch|wanne)\s+(?:tauschen|wechseln|austauschen|erneuern)/i],
    gewerk: ['sanitaer_heizung'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Demontage Altanlage' },
    konfidenz: 'sicher',
    erklaerung: 'Tauschen = Demontage alt + Montage neu',
  },
  {
    trigger: [/heizkörper\s+(?:tauschen|wechseln|neu)/i],
    gewerk: ['sanitaer_heizung'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Thermostatventil montieren' },
    konfidenz: 'wahrscheinlich',
    erklaerung: 'Neuer Heizkörper = meist neues Thermostatventil',
  },

  // ── ELEKTRO ────────────────────────────────────
  {
    trigger: [/küche\s+(?:neu|komplett|renovier)/i],
    gewerk: ['elektro'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Herdanschluss' },
    konfidenz: 'wahrscheinlich',
    erklaerung: 'Küche neu = meist Herdanschluss nötig',
  },
  {
    trigger: [/unterputz/i, /\bup\b/i, /in\s+der\s+wand/i],
    gewerk: ['elektro'],
    schlussfolgerung: { typ: 'flag_setzen', feld: 'up_oder_ap', wert: 'up' },
    konfidenz: 'sicher',
    erklaerung: 'Explizit Unterputz genannt',
  },
  {
    trigger: [/aufputz/i, /\bap\b/i, /auf\s+die\s+wand/i],
    gewerk: ['elektro'],
    schlussfolgerung: { typ: 'flag_setzen', feld: 'up_oder_ap', wert: 'ap' },
    konfidenz: 'sicher',
    erklaerung: 'Explizit Aufputz genannt',
  },
  {
    trigger: [/smart\s*home/i, /alexa/i, /homekit/i],
    gewerk: ['elektro'],
    schlussfolgerung: { typ: 'flag_setzen', feld: 'smart_home', wert: true },
    konfidenz: 'sicher',
    erklaerung: 'Smart Home = spezielle Schalter/Aktoren',
  },

  // ── TROCKENBAU ─────────────────────────────────
  {
    trigger: [/brandschutz/i, /f30/i, /f60/i, /t30/i],
    gewerk: ['trockenbau'],
    schlussfolgerung: { typ: 'flag_setzen', feld: 'brandschutz', wert: true },
    konfidenz: 'sicher',
    erklaerung: 'Brandschutz = spezielle GK-Platten + Ausführung',
  },
  {
    trigger: [/schallschutz/i, /lärmschutz/i],
    gewerk: ['trockenbau'],
    schlussfolgerung: { typ: 'flag_setzen', feld: 'schallschutz', wert: true },
    konfidenz: 'sicher',
    erklaerung: 'Schallschutz = doppelte Beplankung + Entkopplung',
  },
  {
    trigger: [/doppelt\s+beplankt/i, /2\s*lagen/i],
    gewerk: ['trockenbau'],
    schlussfolgerung: { typ: 'wert_setzen', feld: 'beplankung_lagen', wert: 2 },
    konfidenz: 'sicher',
    erklaerung: 'Explizit doppelte Beplankung',
  },

  // ── BODENBELÄGE ────────────────────────────────
  {
    trigger: [/parkett\s+schleifen/i, /abschleifen/i],
    gewerk: ['boden_parkett'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Parkett schleifen + versiegeln (3 Gänge)' },
    konfidenz: 'sicher',
    erklaerung: 'Schleifen = immer 3 Arbeitsgänge',
  },
  {
    trigger: [/fußbodenheizung/i, /\bfbh\b/i, /flächenheizung/i],
    gewerk: ['boden_parkett'],
    schlussfolgerung: { typ: 'flag_setzen', feld: 'fussbodenheizung', wert: true },
    konfidenz: 'sicher',
    erklaerung: 'FBH = nur geeignete Beläge, Aufheizprotokoll',
  },

  // ── ENTSORGUNG ─────────────────────────────────────
  {
    trigger: [/fliesen?\s+(entfernen|raus|runter|rausrei[sß]en|abschlagen|wegreißen)/i, /alte?\s+fliesen?\s+(raus|weg|runter)/i],
    gewerk: ['fliesen'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Entsorgung Fliesenmaterial' },
    konfidenz: 'sicher',
    erklaerung: 'Fliesendemontage erzeugt Bauschutt',
  },
  {
    trigger: [/tapete?\s+(ab|runter|entfernen|abziehen)/i, /tapete?\s+weg/i],
    gewerk: ['maler'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Entsorgung Tapetenmaterial' },
    konfidenz: 'sicher',
    erklaerung: 'Tapetenentfernung → Entsorgung Pauschale',
  },
  {
    trigger: [/(wand|decke|rigips|gk)\s+(raus|runter|entfernen|abbauen|wegreißen)/i],
    gewerk: ['trockenbau'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Entsorgung Bauschutt Pauschale' },
    konfidenz: 'sicher',
    erklaerung: 'Trockenbaudemontage → Bauschutt-Entsorgung',
  },
  {
    trigger: [/(wc|toilette|waschtisch|waschbecken|wanne|dusche)\s+(raus|runter|entfernen|austauschen|tauschen|wechseln)/i],
    gewerk: ['sanitaer_heizung'],
    schlussfolgerung: { typ: 'position_hinzufuegen', position_beschreibung: 'Entsorgung Sanitärobjekte' },
    konfidenz: 'sicher',
    erklaerung: 'Sanitärtausch → Entsorgung Altgeräte',
  },

  // ── ALLGEMEIN ──────────────────────────────────
  {
    trigger: [/altbau/i, /gründerzeit/i, /historisch/i],
    gewerk: undefined,
    schlussfolgerung: { typ: 'flag_setzen', feld: 'altbau', wert: true },
    konfidenz: 'sicher',
    erklaerung: 'Altbau = Erschwerniszuschlag wahrscheinlich',
  },
  {
    trigger: [/bewohnt/i, /wohnung\s+bewohnt/i, /während\s+betrieb/i],
    gewerk: undefined,
    schlussfolgerung: { typ: 'flag_setzen', feld: 'bewohnt', wert: true },
    konfidenz: 'sicher',
    erklaerung: 'Bewohnt = Erschwerniszuschlag',
  },
  {
    trigger: [/denkmalschutz/i, /denkmalgeschützt/i],
    gewerk: undefined,
    schlussfolgerung: { typ: 'flag_setzen', feld: 'denkmalschutz', wert: true },
    konfidenz: 'sicher',
    erklaerung: 'Denkmalschutz = erheblicher Mehraufwand',
  },
]

export interface ImplizitErgebnis {
  regel: ImpliziteRegel
  angewendet: boolean
  aenderung: string
}

export interface ImplizitResultat {
  extraktion_angereichert: ExtrahierteDaten
  angewendete_regeln: ImplizitErgebnis[]
  neue_positionen: string[]
  neue_rueckfragen: string[]
  neue_flags: Record<string, unknown>
}

function istGetriggert(trigger: RegExp | string, transkript: string): boolean {
  if (trigger instanceof RegExp) return trigger.test(transkript)
  return transkript.toLowerCase().includes(trigger.toLowerCase())
}

export function wendeImplizitRegelnAn(
  transkript: string,
  gewerk: string,
  extraktion: ExtrahierteDaten
): ImplizitResultat {
  const angewendet: ImplizitErgebnis[] = []
  const neue_positionen: string[] = []
  const neue_rueckfragen: string[] = []
  const neue_flags: Record<string, unknown> = {}
  const extraktion_neu = { ...extraktion }

  for (const regel of IMPLIZIT_REGELN) {
    if (regel.gewerk && !regel.gewerk.includes(gewerk)) continue

    const getriggert = regel.trigger.some(t => istGetriggert(t, transkript))
    if (!getriggert) continue

    const { schlussfolgerung } = regel

    switch (schlussfolgerung.typ) {
      case 'position_hinzufuegen': {
        const schluessel = (schlussfolgerung.position_beschreibung ?? '').toLowerCase().split(' ')[0]
        const schon_da = neue_positionen.some(p => (p ?? '').toLowerCase().includes(schluessel))
        if (!schon_da) {
          neue_positionen.push(schlussfolgerung.position_beschreibung!)
          angewendet.push({ regel, angewendet: true, aenderung: `Position ergänzt: ${schlussfolgerung.position_beschreibung}` })
        }
        break
      }
      case 'flag_setzen': {
        neue_flags[schlussfolgerung.feld!] = schlussfolgerung.wert
        ;(extraktion_neu as Record<string, unknown>)[schlussfolgerung.feld!] = schlussfolgerung.wert
        angewendet.push({ regel, angewendet: true, aenderung: `Flag gesetzt: ${schlussfolgerung.feld} = ${schlussfolgerung.wert}` })
        break
      }
      case 'wert_setzen': {
        ;(extraktion_neu as Record<string, unknown>)[schlussfolgerung.feld!] = schlussfolgerung.wert
        angewendet.push({ regel, angewendet: true, aenderung: `Wert gesetzt: ${schlussfolgerung.feld} = ${schlussfolgerung.wert}` })
        break
      }
      case 'rueckfrage': {
        const schon_gefragt = [
          ...(extraktion_neu.rueckfragen ?? []),
          ...neue_rueckfragen,
        ].some(r => {
          if (typeof r === 'string') return r === schlussfolgerung.frage
          return (r as KIRueckfrage).frage === schlussfolgerung.frage
        })
        if (!schon_gefragt) {
          neue_rueckfragen.push(schlussfolgerung.frage!)
          angewendet.push({ regel, angewendet: true, aenderung: `Rückfrage hinzugefügt: ${schlussfolgerung.frage}` })
        }
        break
      }
    }
  }

  return { extraktion_angereichert: extraktion_neu, angewendete_regeln: angewendet, neue_positionen, neue_rueckfragen, neue_flags }
}
