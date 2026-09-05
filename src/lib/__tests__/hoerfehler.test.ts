import { describe, it, expect } from 'vitest'
import { korrigiereHoerfehler } from '../hoerfehler'

// Jeder Fall hier ist ein WÖRTLICHER Produktionsfund aus entwurf_aufnahmen
// (22.07.–05.09.2026). Kein ausgedachter Testtext — wenn eine Regel fällt,
// fällt sie an dem Satz, an dem sie gebraucht wurde.

describe('Hörfehler: Klick-Vinyl in allen sechs Schreibweisen', () => {
  const faelle: [string, string][] = [
    ['Klickvanil mit Trittschalldämmung verlegt', 'Klick-Vinyl mit Trittschalldämmung verlegt'],
    ['Boden kriegt Klickvenyl, diagonal verlegt', 'Boden kriegt Klick-Vinyl, diagonal verlegt'],
    ['der alte Teppichboden raus und Clickvenyl rein', 'der alte Teppichboden raus und Klick-Vinyl rein'],
    ['dafür Klickvenü verlegt werden', 'dafür Klick-Vinyl verlegt werden'],
    ['nebenan im Flur kommt derselbe Klickvenüboden rein', 'nebenan im Flur kommt derselbe Klick-Vinyl-Boden rein'],
  ]
  for (const [roh, soll] of faelle) {
    it(roh.slice(0, 40), () => expect(korrigiereHoerfehler(roh).text).toBe(soll))
  }
  it('lässt richtig geschriebene Formen in Ruhe', () => {
    for (const ok of ['Klickvinyl verlegen', 'Click-Vinyl drauf, gerade verlegt', 'Klick-Vinyl mit Dämmung']) {
      expect(korrigiereHoerfehler(ok).text).toBe(ok)
      expect(korrigiereHoerfehler(ok).korrekturen).toEqual([])
    }
  })
})

describe('Hörfehler: Trittschalldämmung', () => {
  for (const roh of ['mit Rittschalldämmung verlegt', 'mit Ritschalldämmung verlegt', 'mit Ritzschalldämmung verlegt']) {
    it(roh, () => expect(korrigiereHoerfehler(roh).text).toBe('mit Trittschalldämmung verlegt'))
  }
  it('lässt „Trittschalldämmung" in Ruhe', () => {
    expect(korrigiereHoerfehler('Trittschalldämmung drunter').korrekturen).toEqual([])
  })
})

describe('Hörfehler: Sockelleisten — der PM-034-Fall', () => {
  it('Zockelleisten mit Z', () => {
    const r = korrigiereHoerfehler('Zockelleisten in Küche und Esszimmer neu, je eine Tür.')
    expect(r.text).toBe('Sockelleisten in Küche und Esszimmer neu, je eine Tür.')
    expect(r.korrekturen).toHaveLength(1)
  })
  it('Sockenleisten', () => {
    expect(korrigiereHoerfehler('18 laufende Meter Sockenleisten montiert').text)
      .toBe('18 laufende Meter Sockelleisten montiert')
  })
})

describe('Hörfehler mit direkter Preiswirkung', () => {
  it('Frischgrät → Fischgrät (15 % Verschnitt statt 5 %)', () => {
    expect(korrigiereHoerfehler('Eichenparkett, Frischgrät verlegt').text)
      .toBe('Eichenparkett, Fischgrät verlegt')
  })
  it('Fertigpaket → Fertigparkett', () => {
    expect(korrigiereHoerfehler('Danach wird Eiche-Fertigpaket im Fischgrätmuster vollflächig verklebt').text)
      .toContain('Eiche-Fertigparkett')
    expect(korrigiereHoerfehler('wird Eichenfertigpaket verklebt').text).toContain('Eichenfertigparkett')
  })
  it('nix am Bogen → nix am Boden', () => {
    expect(korrigiereHoerfehler('da wird nix am Bogen gemacht, der bleibt wie er ist').text)
      .toBe('da wird nix am Boden gemacht, der bleibt wie er ist')
  })
  it('lässt einen echten Bogen in Ruhe', () => {
    expect(korrigiereHoerfehler('über dem Fenster ist ein Bogen gemauert').korrekturen).toEqual([])
  })
})

describe('Hörfehler: verschluckte Wortgrenzen', () => {
  it('Aufwände streichen → auch Wände streichen', () => {
    expect(korrigiereHoerfehler('das Schlafzimmer 3,5 x 4 Meter, Aufwände streichen.').text)
      .toBe('das Schlafzimmer 3,5 x 4 Meter, auch Wände streichen.')
  })
  it('lässt „Aufwände" ohne Streich-Wort in Ruhe', () => {
    expect(korrigiereHoerfehler('die Aufwände sind höher als gedacht').korrekturen).toEqual([])
  })
  it('Bodenlass mal weg → Boden lass mal weg', () => {
    expect(korrigiereHoerfehler('Bodenlass mal weg, der bleibt wie er ist').text)
      .toBe('Boden lass mal weg, der bleibt wie er ist')
  })
  it('unterschiedliche Belege → Beläge', () => {
    expect(korrigiereHoerfehler('eine Übergangsschiene, weil ja unterschiedliche Belege').text)
      .toBe('eine Übergangsschiene, weil ja unterschiedliche Beläge')
  })
  it('lässt echte Belege in Ruhe', () => {
    expect(korrigiereHoerfehler('die Belege liegen beim Steuerberater').korrekturen).toEqual([])
  })
})

describe('Hörfehler: Rauhfaser und Dispersionsfarbe', () => {
  it('Rauffasertapete', () => {
    expect(korrigiereHoerfehler('Die alte Rauffasertapete muss entfernt werden').text)
      .toBe('Die alte Rauhfasertapete muss entfernt werden')
  })
  it('rauhe Fasertapete', () => {
    expect(korrigiereHoerfehler('Die alte, rauhe Fasertapete muss entfernt werden').text)
      .toBe('Die alte, Rauhfasertapete muss entfernt werden')
  })
  it('Displosionsfarbe', () => {
    expect(korrigiereHoerfehler('zweimal mit weißer Displosionsfarbe gestrichen').text)
      .toBe('zweimal mit weißer Dispersionsfarbe gestrichen')
  })
})

describe('Halluzinierter Abspann wird entfernt', () => {
  it('Amara.org-Community allein im Transkript → leer', () => {
    const r = korrigiereHoerfehler('Untertitel der Amara.org-Community')
    expect(r.text).toBe('')
    expect(r.korrekturen[0]).toContain('von Whisper erfunden')
  })
  it('angehängte Werbezeile am Ende', () => {
    expect(korrigiereHoerfehler('zwei Übergangsprofile eingebaut. Mehr Informationen auf www.hansgrobe-int.com').text)
      .toBe('zwei Übergangsprofile eingebaut.')
  })
  it('lässt eine echte Adresse mitten im Text stehen', () => {
    const t = 'Mehr Informationen auf www.beispiel.de haben wir vom Kunden bekommen'
    expect(korrigiereHoerfehler(t).text).toBe(t)
  })
})

describe('Nichts passiert stumm', () => {
  it('meldet jede Ersetzung als lesbare Zeile', () => {
    const r = korrigiereHoerfehler('Zockelleisten neu, Klickvenü drunter, Frischgrät verlegt')
    expect(r.korrekturen).toHaveLength(3)
    for (const k of r.korrekturen) expect(k).toMatch(/gelesen/)
  })
  it('meldet nichts, wenn nichts zu korrigieren war', () => {
    const t = 'Wohnzimmer 5 x 4 Meter, Wände zweimal streichen.'
    const r = korrigiereHoerfehler(t)
    expect(r.text).toBe(t)
    expect(r.korrekturen).toEqual([])
  })
  it('kommt mit leerem Text klar', () => {
    expect(korrigiereHoerfehler('').text).toBe('')
  })
})
