// ── Whisper-Hörfehler: das Wörterbuch ─────────────────────────────────────
//
// PM-034 (04.09.2026) hat 155,10 € gekostet, weil Whisper „Zockelleisten"
// mit Z geschrieben hat und ein Textsignal-Gate im Code auf „sockelleist"
// stand. Der Fix dort war ein toleranterer Ausdruck — die saubere Stelle ist
// aber hier: Das Wort wird EINMAL geradegerückt, bevor irgendetwas es liest.
// Danach steht es richtig in der KI-Eingabe, in den Positionen und im PDF.
//
// ── Die Regel für diese Datei ────────────────────────────────────────────
// Jeder Eintrag braucht einen ECHTEN Produktionsfund. Kein Eintrag „könnte
// ja mal vorkommen". Der Beleg steht bei jeder Zeile, mit Datum, damit man
// später nachvollziehen kann, warum eine Ersetzung existiert — und sie
// wieder streichen kann, wenn sie sich als Fehlgriff herausstellt.
//
// Grundlage der ersten Fassung: alle 90 Aufnahmen aus der Produktions-
// datenbank (entwurf_aufnahmen, 22.07.–05.09.2026), einmal von Hand
// durchgesehen. Die Trefferliste war länger als erwartet.
//
// ── Zwei Dinge, die hier bewusst NICHT passieren ─────────────────────────
// 1. Nichts wird stumm geändert. Der Rohtext bleibt in
//    `transkript_original` stehen, und jede Ersetzung wird als lesbare
//    Zeile zurückgegeben.
// 2. Kein Rechtschreib-Rateverfahren. Nur feste, belegte Muster — eine
//    Ähnlichkeitssuche über den Preiskatalog würde irgendwann ein Wort
//    „korrigieren", das der Handwerker genau so gemeint hat.
//
// ACHTUNG bei Regeln mit Umlaut am Ende („Klickvenü"): Ein abschließendes
// \b greift dort NICHT — in JavaScript ist „ü" kein Wortzeichen. Dieselbe
// Falle wie bei /\büberall\b/ in sockelleisten-ausschluss.ts.

/**
 * Klick-Vinyl, wie es GESPROCHEN ankommt — richtige und verhörte Formen.
 *
 * ── 05.09.2026, Sandys Fund ───────────────────────────────────────────────
 * Zum Erkennen (Gates) braucht es das Gegenteil des Korrektur-Musters
 * weiter unten: Dort dürfen die richtigen Schreibweisen NICHT treffen, hier
 * müssen sie es. Der Anlass ist derselbe wie bei SOCKEL_WORT: Eine Prüfung,
 * die auf `klickvinyl`/`klick-vinyl` stand, lief an „Klickvenü" vorbei — und
 * damit fiel die Trittschalldämmung eines ganzen Auftrags aus.
 *
 * Das Wörterbuch repariert neue Aufnahmen; dieser Ausdruck deckt auch die
 * bereits gespeicherten und jede Schreibweise, die noch nicht im Wörterbuch
 * steht. Beide Netze, nicht eines.
 */
export const KLICK_VINYL_WORT = /\b[ck]lick[\s-]?v[aei]n(?:yl|il|[üu])?/i

interface Regel {
  muster: RegExp
  ersetze: (treffer: string, ...gruppen: string[]) => string
  /** Wofür das steht — erscheint im Hinweistext. */
  gemeint: string
  /** Wo es in der Produktion aufgetaucht ist. */
  beleg: string
}

const REGELN: Regel[] = [
  {
    // „Klickvanil", „Klickvenyl", „Clickvenyl", „Klickvenü", „Klickvenüboden".
    // Richtig geschriebene Formen („Klickvinyl", „Click-Vinyl") treffen das
    // Muster nicht — nach dem v muss ein a oder e stehen.
    muster: /\b[ck]lick[\s-]?v[ae]n(?:il|yl|ü|u)(boden)?/gi,
    ersetze: (_t, boden) => (boden ? 'Klick-Vinyl-Boden' : 'Klick-Vinyl'),
    gemeint: 'Klick-Vinyl',
    beleg: '22.07., 16.08. (2×), 27.08., 03.09., 05.09. — sechs Schreibweisen in sechs Wochen',
  },
  {
    // „Rittschalldämmung", „Ritschalldämmung", „Ritzschalldämmung".
    // Das korrekte „Trittschall" trifft nicht: davor steht ein T, die
    // Wortgrenze greift also nicht.
    muster: /\b(?:ritz|rit+)schall/gi,
    ersetze: () => 'Trittschall',
    gemeint: 'Trittschalldämmung',
    beleg: '22.07. (4× an einem Tag, drei verschiedene Schreibweisen)',
  },
  {
    // „Zockelleisten" (PM-034), „Sockenleisten".
    muster: /\b(?:[zs]ockel|socken)[\s-]?leist/gi,
    ersetze: () => 'Sockelleist',
    gemeint: 'Sockelleisten',
    beleg: '22.07. („Sockenleisten"), 05.09. („Zockelleisten" — PM-034, 155,10 € Ausfall)',
  },
  {
    // „Frischgrät verlegt" — Fischgrät hat 15 % Verschnitt statt 5 %.
    // Ein verhörter Buchstabe, der direkt auf den Preis durchschlägt.
    muster: /\bfrischgr[äa]t/gi,
    ersetze: () => 'Fischgrät',
    gemeint: 'Fischgrätmuster',
    beleg: '19.08. („Eichenparkett, Frischgrät verlegt")',
  },
  {
    // „Eiche-Fertigpaket", „Eichenfertigpaket" — gemeint ist Fertigparkett.
    // Bewusst ohne \b davor: das Wort steht in der Produktion angewachsen.
    muster: /fertig[\s-]?paket/gi,
    ersetze: () => 'Fertigparkett',
    gemeint: 'Fertigparkett',
    beleg: '26.07. (2×), 27.07.',
  },
  {
    // „Rauffasertapete", „rauhe Fasertapete".
    muster: /\brau[hf]?e?[\s-]*fasertapete/gi,
    ersetze: () => 'Rauhfasertapete',
    gemeint: 'Rauhfasertapete',
    beleg: '22.07. (4×), 26.07.',
  },
  {
    muster: /\bdisplosionsfarbe/gi,
    ersetze: () => 'Dispersionsfarbe',
    gemeint: 'Dispersionsfarbe',
    beleg: '22.07.',
  },
  {
    // „da wird nix am Bogen gemacht". Bewusst nur in dieser Verneinung —
    // ein „Bogen" kann auf dem Bau auch ein Bogen sein.
    muster: /\b(nix|nichts)(\s+am\s+)Bogen\b/gi,
    ersetze: (_t, wort, mitte) => `${wort}${mitte}Boden`,
    gemeint: 'Boden',
    beleg: '19.08. („da wird nix am Bogen gemacht, der bleibt wie er ist")',
  },
  {
    // „Bodenlass mal weg" — zwei Wörter zusammengezogen.
    muster: /\bbodenlass\b/gi,
    ersetze: () => 'Boden lass',
    gemeint: 'Boden lass',
    beleg: '16.08.',
  },
  {
    // „weil ja unterschiedliche Belege" — gemeint sind Beläge.
    // „Belege" allein bleibt unangetastet, das ist ein echtes Wort.
    muster: /\b(unterschiedlich\w*\s+)belege\b/gi,
    ersetze: (_t, davor) => `${davor}Beläge`,
    gemeint: 'Beläge',
    beleg: '03.09. (PM-033-Diktat)',
  },
  {
    // „3,5 x 4 Meter, Aufwände streichen" — gemeint ist „auch Wände".
    // Nur direkt vor einem Streich-Wort, sonst bliebe „Aufwände" ein
    // normales deutsches Wort.
    muster: /\baufw[äa]nde(\s+)(streichen|wei[ßs])/gi,
    ersetze: (_t, luecke, wort) => `auch Wände${luecke}${wort}`,
    gemeint: 'auch Wände',
    beleg: '07.08., 09.08.',
  },
]

// Halluzinierter Abspann. Whisper hängt bei Stille oder am Ende einer
// Aufnahme Untertitel-Boilerplate an, die nie jemand gesagt hat. Steht sie
// allein im Transkript, bleibt danach nichts übrig — und „keine Sprache
// erkannt" ist für eine stille Aufnahme genau die richtige Antwort.
// Auch hier: nur, was in der Produktion wirklich aufgetaucht ist.
const HALLUZINATIONEN: { muster: RegExp; beleg: string }[] = [
  { muster: /\s*Untertitel(?:ung)?\s+(?:der|des)\s+Amara\.org[\w-]*\s*\.?/gi, beleg: '22.07., 16.08. (jeweils als komplettes Transkript einer stillen Aufnahme)' },
  { muster: /\s*Mehr Informationen auf\s+www\.\S+\s*$/gi, beleg: '26.07. (an ein echtes Diktat angehängt)' },
]

export interface HoerfehlerErgebnis {
  /** Der bereinigte Text. */
  text: string
  /** Lesbare Zeilen: was wurde wodurch ersetzt. Leer = nichts geändert. */
  korrekturen: string[]
}

/**
 * Rückt bekannte Whisper-Hörfehler gerade. Läuft EINMAL, direkt nach der
 * Transkription — vor Zahlwörtern, vor der KI, vor allem anderen.
 */
export function korrigiereHoerfehler(text: string): HoerfehlerErgebnis {
  const korrekturen: string[] = []
  if (!text) return { text: text ?? '', korrekturen }

  let ergebnis = text

  for (const { muster, beleg } of HALLUZINATIONEN) {
    muster.lastIndex = 0
    const treffer = ergebnis.match(muster)
    if (treffer) {
      ergebnis = ergebnis.replace(muster, '').trim()
      for (const t of new Set(treffer.map(x => x.trim()))) {
        korrekturen.push(`„${t}" entfernt — von Whisper erfunden, nicht gesagt (${beleg})`)
      }
    }
  }

  for (const regel of REGELN) {
    regel.muster.lastIndex = 0
    const gesehen = new Set<string>()
    ergebnis = ergebnis.replace(regel.muster, (treffer, ...rest) => {
      const offset = Number(rest[rest.length - 2])
      const quelle = String(rest[rest.length - 1])
      const gruppen = rest.slice(0, -2).map(g => (g == null ? '' : String(g)))
      const roh = regel.ersetze(treffer, ...gruppen)
      // „Eichenfertigpaket" wird MITTEN im Wort ersetzt und darf dort kein
      // großes F bekommen; „rauhe Fasertapete" steht dagegen für sich und
      // ist ein Substantiv. Entscheidend ist also, ob links ein Buchstabe
      // klebt — nicht, wie der Treffer selbst geschrieben war.
      const davor = offset > 0 ? quelle.charAt(offset - 1) : ''
      const imWort = davor !== '' && /[A-Za-zÄÖÜäöüß]/.test(davor)
      const neu = imWort ? roh.charAt(0).toLowerCase() + roh.slice(1) : roh
      if (treffer !== neu && !gesehen.has(treffer)) {
        gesehen.add(treffer)
        korrekturen.push(`„${treffer}" als „${neu}" gelesen (${regel.gemeint})`)
      }
      return neu
    })
  }

  return { text: ergebnis, korrekturen }
}
