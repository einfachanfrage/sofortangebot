import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { KalkulationsAntworten } from '@/lib/mengen/antworten-verarbeiter'
import type { RueckfrageItem } from '@/lib/mengen/rueckfragen-generator'
import type { ExtrahierteDaten } from '@/lib/mengen/types'
import type { BerechnetePosition } from '@/lib/mengen/types'
import type { VollExtraktionCache } from '@/lib/types'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '@/lib/mengen/aufnahme-hinweise'
import { pruefeMassPlausibilitaet } from '@/lib/mass-plausibilitaet'
import { filtereExakteDubletten } from '@/lib/quote-items-dedup'
import * as Sentry from '@sentry/nextjs'

export const maxDuration = 90

/**
 * Kombiniert alle Transkripte des Entwurfs und führt die volle Pipeline aus:
 * angebot-extrahieren (Engine + Vollständigkeits-Check) →
 * angebot-generieren (ausschließlich betriebliche Datenbankpreise) →
 * quote_items aktualisieren
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json() as {
    angebot_id: string
    aufnahmen_ids?: string[]
    antworten?: KalkulationsAntworten
    basis_extraktion?: ExtrahierteDaten
    rueckfragen_ueberspringen?: boolean
  }
  const { angebot_id, aufnahmen_ids, antworten = {}, basis_extraktion, rueckfragen_ueberspringen = false } = body
  if (!angebot_id) return NextResponse.json({ error: 'angebot_id fehlt' }, { status: 400 })

  // Nur Aufnahmen dieses Users (Sicherheit: Angebot gehört zur Company des Users)
  const { data: quoteCheck } = await supabase
    .from('quotes')
    .select('id, entwurf_gespeichert_am, companies!inner(user_id)')
    .eq('id', angebot_id)
    .single()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const companyData = quoteCheck?.companies as any
  const companyUserId = Array.isArray(companyData) ? companyData[0]?.user_id : companyData?.user_id
  if (!quoteCheck || companyUserId !== user.id) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }

  // Letzter Generierungs-Zeitstempel — nur neue Aufnahmen danach verarbeiten
  const letzteGenerierung = (quoteCheck as { entwurf_gespeichert_am?: string | null }).entwurf_gespeichert_am

  // Aufnahmen laden — per expliziter ID-Liste (vom Frontend) oder Timestamp-Fallback
  let query = supabase
    .from('entwurf_aufnahmen')
    // voll_extraktion neu seit CoS-002 Schritt 3 (Head of Product
    // Engineering, 2026-08-21) — siehe Cache-Wiederverwendung weiter unten.
    .select('id, typ, transkript, notiz_text, erkannte_positionen, verarbeitung_status, erstellt_am, voll_extraktion')
    .eq('angebot_id', angebot_id)
    .order('erstellt_am', { ascending: true })
  if (aufnahmen_ids !== undefined) {
    if (aufnahmen_ids.length === 0) {
      // Alle neuen Aufnahmen noch nicht fertig transkribiert
      return NextResponse.json({ ok: true, positionen_count: 0, rueckfragen: [], keine_neuen: true })
    }
    // Frontend hat explizit die neuen Aufnahmen übergeben — zuverlässiger als Timestamp-Vergleich
    query = query.in('id', aufnahmen_ids)
  } else if (letzteGenerierung) {
    query = query.gt('erstellt_am', letzteGenerierung)
  }
  const { data: aufnahmen } = await query

  if (!aufnahmen?.length) {
    // Keine neuen Aufnahmen seit letzter Generierung — kein Fehler, einfach weiter
    return NextResponse.json({ ok: true, positionen_count: 0, rueckfragen: [], keine_neuen: true })
  }

  // Texte sammeln: Sprach-Transkripte + Notizen + Zettel-Scans (foto mit transkript)
  const texte: string[] = []
  for (const a of aufnahmen) {
    if (a.typ === 'sprache' && a.verarbeitung_status === 'fertig' && a.transkript) {
      texte.push(a.transkript as string)
    } else if (a.typ === 'notiz' && a.notiz_text) {
      texte.push(a.notiz_text as string)
    } else if (a.typ === 'foto' && a.verarbeitung_status === 'fertig' && a.transkript) {
      // Zettel-Scan: Vision hat den handschriftlichen Zettel abgelesen
      texte.push(a.transkript as string)
    }
  }

  if (texte.length === 0) {
    return NextResponse.json({ error: 'Keine Transkripte verfügbar' }, { status: 400 })
  }

  // Transkripte kombinieren (Trenner damit GPT Räume auseinanderhält)
  const erkannteArbeiten: string[] = []
  for (const aufnahme of aufnahmen) {
    const chips = Array.isArray(aufnahme.erkannte_positionen) ? aufnahme.erkannte_positionen : []
    for (const chip of chips) {
      if (!chip || typeof chip !== 'object') continue
      const titel = String((chip as { titel?: unknown }).titel ?? '').trim()
      if (titel && !erkannteArbeiten.includes(titel)) erkannteArbeiten.push(titel)
    }
  }
  const combinedText = texte.join('\n\n---\n\n')

  // Basis-URL für interne API-Calls
  const origin = req.nextUrl.origin
  const cookieHeader = req.headers.get('cookie') ?? ''

  // CoS-002 Option 1, Schritt 3 (Head of Product Engineering, 2026-08-21,
  // docs/cos-002-architektur-vorschlag.md): statt hier IMMER einen frischen
  // ki-extrahieren-Aufruf über /api/angebot-extrahieren auszulösen, wird
  // — wenn möglich — die in Schritt 1 gecachte volle Extraktion
  // (entwurf_aufnahmen.voll_extraktion) wiederverwendet. Nur EIN KI-Aufruf
  // pro Aufnahme statt zwei, das ist das eigentliche CoS-002-Ziel.
  //
  // Bewusst NUR im einfachsten, sicheren Fall aktiv (kleine Schritte statt
  // Big-Bang, wie im eigenen Vorschlag empfohlen): genau EINE neue Aufnahme
  // im Batch, vom Typ 'sprache', ohne laufende Rückfragen-Runde. Grund: der
  // Cache wurde pro Aufnahme auf DEREN EIGENEM Transkript berechnet — bei
  // mehreren gleichzeitig neuen Aufnahmen kombiniert combinedText mehrere
  // Transkripte zu EINEM GPT-Aufruf (damit z. B. ein in Aufnahme 2 erwähnter
  // Bezug auf einen Raum aus Aufnahme 1 aufgelöst werden kann) — das können
  // die einzeln gecachten Extraktionen strukturell nicht nachbilden, ein
  // Wiederverwenden würde diese Cross-Aufnahme-Korrektur stillschweigend
  // verlieren. In diesem Mehr-Aufnahmen-Fall läuft weiterhin der bisherige,
  // frische Kombi-Aufruf — unverändertes, bekanntes Verhalten.
  let vollExtraktionCache: ExtrahierteDaten | undefined
  if (
    !basis_extraktion
    && aufnahmen.length === 1
    && aufnahmen[0].typ === 'sprache'
    && aufnahmen[0].verarbeitung_status === 'fertig'
  ) {
    const voll = aufnahmen[0].voll_extraktion as VollExtraktionCache | null | undefined
    if (voll?.result) vollExtraktionCache = voll.result
  }

  // ── Schritt 1: Extraktion + Engine + Vollständigkeits-Check ──────────────
  const extRes = await fetch(`${origin}/api/angebot-extrahieren`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
    body: JSON.stringify({ text: combinedText, antworten, basis_extraktion, voll_extraktion_cache: vollExtraktionCache }),
  })

  if (!extRes.ok) {
    const err = await extRes.json().catch(() => ({})) as { error?: string }
    // Rate-Limit / Budget-Meldung unverändert durchreichen
    if (extRes.status === 429) {
      return NextResponse.json({ error: err.error ?? 'Zu viele Anfragen' }, { status: 429 })
    }
    return NextResponse.json({ error: `Extraktion fehlgeschlagen: ${err.error ?? extRes.status}` }, { status: 500 })
  }

  const extData = await extRes.json() as {
    mengen?: { positionen?: unknown[]; rueckfragen?: unknown[] }
    hat_rueckfragen?: boolean
    rueckfragen?: RueckfrageItem[]
    extraktion_roh?: unknown
    extraktion?: {
      gewerk?: string
      raeume?: Array<{
        name?: string
        breite?: number | null
        laenge?: number | null
        hoehe?: number | null
        flaeche?: number | null
        wandflaeche_direkt?: number | null
        deckflaeche_direkt?: number | null
        // PM-008-Nachtest 6 (2026-08-19): breite/hoehe/annahme mit aufnehmen —
        // vorher wurde hier nur die Stückzahl gelesen, obwohl die Extraktion
        // (siehe ExtrahierteDaten in mengen/types.ts) echte Öffnungsmaße
        // liefert, wenn der Nutzer sie genannt hat. Ohne die Maße fiel die
        // Bearbeiten-Ansicht beim Neuberechnen immer auf das Standardmaß
        // zurück (1,20×1,00m je Fenster), auch wenn ein Fenster laut
        // Transkript größer war — das machte "So gerechnet" im Chip falsch,
        // obwohl die ursprüngliche Position (aus derselben Extraktion,
        // siehe maler.ts) korrekt mit den echten Maßen gerechnet hatte.
        fenster?: Array<{ anzahl?: number; breite?: number; hoehe?: number; annahme?: boolean }>
        tueren?: Array<{ anzahl?: number; breite?: number; hoehe?: number; annahme?: boolean }>
      }>
      // PM-008/PD-003: Fassaden landen bei GPT hier, nicht in raeume[] (siehe
      // Kommentar in maler.ts) — kein Boden/Decke, keine Breite. Bisher wurde
      // dieses Feld beim Speichern der Raumdimensionen komplett ignoriert,
      // weshalb `raum_details` bei einer reinen Fassaden-Aufnahme leer blieb.
      waende?: Array<{
        name?: string
        laenge?: number | null
        hoehe?: number | null
        // PM-008-Nachtest 6: siehe Kommentar bei raeume[].fenster oben —
        // dieselbe Erweiterung, derselbe Grund.
        fenster?: Array<{ anzahl?: number; breite?: number; hoehe?: number; annahme?: boolean }>
      }>
    }
  }
  const positionen = normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(
      (extData.mengen?.positionen ?? []) as BerechnetePosition[],
      erkannteArbeiten,
      combinedText,
    ),
    combinedText,
  )
  const rueckfragen = extData.rueckfragen ?? []

  // PM-010, Whisper-Vorschlag (freigegeben 2026-08-17): unrealistische
  // Raummaße (z.B. Whisper hat "drei fünfzig" als "350" transkribiert) sind
  // hier schon strukturiert als Zahl verfügbar — deterministisch prüfbar,
  // bevor irgendetwas gerechnet oder gespeichert wird. Blockiert nichts,
  // wird nur an beide möglichen Antworten unten drangehängt.
  const massWarnungen = pruefeMassPlausibilitaet(extData.extraktion?.raeume ?? [])

  // Sichtbarkeit: roh (direkt von GPT) + final (nach allen Nachbearbeitungs-
  // Modulen) speichern. Bei Rückfragen ruft das Frontend diese Route für
  // denselben Auftrag zweimal auf — die zweite Runde läuft mit basis_extraktion
  // und hat KEINE neue GPT-Antwort (extraktion_roh dann null). Den echten
  // Rohschnappschuss aus der ersten Runde darf das nicht überschreiben.
  const rohUpdate: Record<string, unknown> = { extraktion_final: extData.extraktion ?? null }
  if (extData.extraktion_roh != null) rohUpdate.extraktion_roh = extData.extraktion_roh
  await supabase.from('quotes').update(rohUpdate).eq('id', angebot_id)

  // Phase 1 endet hier: Noch nichts speichern oder bepreisen, solange wichtige
  // Angaben fehlen. Nach den Antworten wird dieselbe Pipeline neu berechnet.
  if (rueckfragen.length > 0 && !rueckfragen_ueberspringen) {
    return NextResponse.json({
      ok: true,
      requires_input: true,
      positionen_count: 0,
      rueckfragen,
      basis_extraktion: extData.extraktion,
      warnungen: massWarnungen,
    })
  }

  // Raumdimensionen aus Extraktion in raum_details speichern.
  // WICHTIG: Der Schlüssel muss exakt dem Raumnamen in den Positions-Titeln
  // entsprechen ("… — Wohnzimmer"), sonst findet die Bearbeiten-Ansicht die
  // Maße nicht (Casing-Mismatch: Extraktion "wohnzimmer" vs. Titel "Wohnzimmer").
  const extraktionRaeume = extData.extraktion?.raeume ?? []
  // PM-008/PD-003, Punkt 4: Fassaden stehen bei GPT in einem eigenen
  // waende[]-Feld, nicht in raeume[] (siehe maler.ts). Die Prüfung unten lief
  // bisher NUR über extraktionRaeume — bei einer reinen Fassaden-Aufnahme war
  // extraktionRaeume leer, also blieb raum_details für diesen Auftrag
  // komplett leer, und die Bearbeiten-Ansicht hatte buchstäblich nichts zum
  // Anzeigen/Neuberechnen. Jetzt zählt auch waende[] als Grund, den Block
  // überhaupt zu betreten.
  const extraktionWaende = extData.extraktion?.waende ?? []
  if (extraktionRaeume.length > 0 || extraktionWaende.length > 0) {
    // Kanonische Raumnamen, wie sie in den Positionen stehen
    const titelRaeume: string[] = []
    for (const p of positionen) {
      const beschr = (p as { beschreibung?: string }).beschreibung ?? ''
      const m = beschr.match(/\s+[-–—]\s+(.+)$/)
      if (m && !titelRaeume.includes(m[1].trim())) titelRaeume.push(m[1].trim())
    }
    const findeTitelName = (rawName: string): string => {
      const low = rawName.toLowerCase()
      return titelRaeume.find(t => t.toLowerCase() === low)
        ?? titelRaeume.find(t => t.toLowerCase().includes(low) || low.includes(t.toLowerCase()))
        ?? (titelRaeume.length === 1 && extraktionRaeume.length === 1 ? titelRaeume[0] : undefined)
        ?? rawName
    }

    // Berechnete Wandfläche je Raum (aus "Wandflächen streichen — Raum") — zum Vorbelegen
    const wandProRaum: Record<string, number> = {}
    for (const p of positionen) {
      const b = (p as { beschreibung?: string }).beschreibung ?? ''
      if (/wandfläch/i.test(b) && (p as { einheit?: string }).einheit === 'm²') {
        const mm = b.match(/\s+[-–—]\s+(.+)$/)
        const rn = mm ? mm[1].trim() : null
        if (rn) wandProRaum[rn] = (p as { menge?: number }).menge ?? 0
      }
    }

    // PM-008-Nachtest 6 (2026-08-19): echte Öffnungsfläche aus Anzahl ×
    // (Breite ?? Standard) × (Höhe ?? Standard) summieren — exakt dieselbe
    // Formel wie in maler.ts (dort z.B. `effFenster.reduce(... (f.breite ??
    // 1.2) * (f.hoehe ?? 1.0) ...)`). Ohne diese Funktion wurde beim
    // Speichern der Raummaße nur die Stückzahl übernommen, die reale Größe
    // ging verloren — die Bearbeiten-Ansicht rechnete beim Neuberechnen dann
    // immer mit dem Standardmaß, selbst wenn ein Fenster laut Transkript
    // größer war als 1,20×1,00m. Rückgabe `undefined` bei leerem/fehlendem
    // Array, damit `raumDetails` weiterhin sauber auf den bestehenden
    // Stückzahl×Standard-Fallback in raum-geometrie.ts zurückfallen kann.
    const flaecheAusOeffnungen = (
      liste: Array<{ anzahl?: number; breite?: number; hoehe?: number }> | undefined,
      standardBreite: number,
      standardHoehe: number,
    ): number | undefined => {
      if (!Array.isArray(liste) || liste.length === 0) return undefined
      const summe = liste.reduce(
        (s, o) => s + (o.anzahl ?? 1) * (o.breite ?? standardBreite) * (o.hoehe ?? standardHoehe), 0
      )
      return Math.round(summe * 100) / 100
    }

    const raumDetails: Record<string, {
      modus?: 'rechteck' | 'flaeche' | 'wand'
      breite?: number; laenge?: number; hoehe?: number; tueren?: number; fenster?: number
      tuerFlaeche?: number; fensterFlaeche?: number
      wandflaeche?: number; bodenflaeche?: number
    }> = {}
    for (const raum of extraktionRaeume) {
      const name = raum.name?.trim()
      if (!name) continue
      const key = findeTitelName(name)
      // PM-003: vorher `raum.fenster?.length ? summe : undefined` — bei
      // ausdrücklich "kein Fenster" liefert die Extraktion ein LEERES Array
      // (fenster: []), .length ist dann 0, und 0 ist in JS "falsy". Das hat
      // den echten, korrekten Wert "0 Fenster" wie "gar keine Angabe"
      // behandelt → Anzeige zeigte ein rotes "!" statt der 0. Fix: prüfen, ob
      // überhaupt ein Array da ist (auch ein leeres zählt als Antwort),
      // nicht ob die Summe > 0 ist.
      const fensterAnzahl = Array.isArray(raum.fenster)
        ? raum.fenster.reduce((s, f) => s + (f.anzahl ?? 1), 0)
        : undefined
      const tuerenAnzahl = Array.isArray(raum.tueren)
        ? raum.tueren.reduce((s, t) => s + (t.anzahl ?? 1), 0)
        : undefined
      // Standardmaße 1,20×1,00m (Fenster) / 0,90×2,10m (Tür) — dieselben wie
      // in maler.ts und raum-geometrie.ts (siehe Kommentar dort).
      const fensterFlaeche = flaecheAusOeffnungen(raum.fenster, 1.2, 1.0)
      const tuerFlaeche = flaecheAusOeffnungen(raum.tueren, 0.9, 2.1)
      // Fläche vs. L×B: hat der Nutzer eine Fläche genannt (Boden/Wand) statt Maße?
      const hatMasse = raum.breite != null && raum.laenge != null
      const bodenflaeche = raum.flaeche ?? raum.deckflaeche_direkt ?? undefined
      // Wandfläche: direkt genannt, sonst (nur bei Flächen-Räumen) die berechnete aus der Position
      const wandflaeche = raum.wandflaeche_direkt ?? (!hatMasse ? wandProRaum[key] : undefined) ?? undefined
      const hatFlaeche = bodenflaeche != null || wandflaeche != null
      // PM-008/PD-003, Nebenfund: GPT legt manche Fassaden nicht in waende[],
      // sondern als "Raum" mit nur Länge+Höhe ab (Breite fehlt strukturell,
      // nicht durch eine Rückfrage-Lücke). Genau dieser Fall zeigte in der
      // Bearbeiten-Ansicht 5 rote "!" gleichzeitig, obwohl die Rechnung
      // dahinter stimmte — derselbe Fund wie bei waende[], nur ein anderer
      // Eingang. Ohne modus 'wand' würde die Anzeige weiterhin "rechteck"
      // annehmen und eine nie vorhandene Breite verlangen.
      const istWandOhneBreite = !hatMasse && !hatFlaeche && raum.laenge != null && raum.hoehe != null
      raumDetails[key] = {
        // Ohne L×B, aber mit Fläche → Flächen-Reiter direkt aktiv
        ...(istWandOhneBreite ? { modus: 'wand' as const }
          : (!hatMasse && hatFlaeche ? { modus: 'flaeche' as const } : {})),
        ...(raum.breite != null ? { breite: raum.breite } : {}),
        ...(raum.laenge != null ? { laenge: raum.laenge } : {}),
        ...(raum.hoehe != null ? { hoehe: raum.hoehe } : {}),
        ...(wandflaeche != null ? { wandflaeche } : {}),
        ...(bodenflaeche != null ? { bodenflaeche } : {}),
        ...(tuerenAnzahl !== undefined ? { tueren: tuerenAnzahl } : {}),
        ...(fensterAnzahl !== undefined ? { fenster: fensterAnzahl } : {}),
        ...(tuerFlaeche !== undefined ? { tuerFlaeche } : {}),
        ...(fensterFlaeche !== undefined ? { fensterFlaeche } : {}),
      }
    }

    // PM-008/PD-003, Punkt 4 (Sandys Go 2026-08-18): Wände/Fassaden aus
    // waende[] genauso in raum_details ablegen wie Räume — mit modus 'wand',
    // damit die Bearbeiten-Ansicht sie erkennt und mit Länge×Höhe−Öffnungen
    // statt der Raumumfang-Formel neu berechnet (siehe raum-geometrie.ts).
    // Namensfindung exakt wie bei Räumen: dieselbe findeTitelName-Logik,
    // derselbe Fallback-Name 'Fassade' wie in maler.ts (damit Schlüssel und
    // Positions-Titel garantiert übereinstimmen).
    for (const wand of extraktionWaende) {
      if (wand.laenge == null || wand.hoehe == null) continue
      const name = wand.name?.trim() || 'Fassade'
      const key = findeTitelName(name)
      const fensterAnzahl = Array.isArray(wand.fenster)
        ? wand.fenster.reduce((s, f) => s + (f.anzahl ?? 1), 0)
        : undefined
      const fensterFlaeche = flaecheAusOeffnungen(wand.fenster, 1.2, 1.0)
      raumDetails[key] = {
        ...raumDetails[key],
        modus: 'wand',
        laenge: wand.laenge,
        hoehe: wand.hoehe,
        ...(fensterAnzahl !== undefined ? { fenster: fensterAnzahl } : {}),
        ...(fensterFlaeche !== undefined ? { fensterFlaeche } : {}),
      }
    }

    if (Object.keys(raumDetails).length > 0) {
      const { error: raumDetailsError } = await supabase
        .from('quotes')
        .update({ raum_details: raumDetails })
        .eq('id', angebot_id)
      if (raumDetailsError) {
        console.error('[positionen-generieren] Raumdaten konnten nicht gespeichert werden')
        Sentry.captureException(new Error(raumDetailsError.message), { tags: { feature: 'positionen_generieren_raumdetails' } })
        return NextResponse.json({ error: 'Raummaße konnten nicht gespeichert werden' }, { status: 500 })
      }
    }
  }

  if (positionen.length === 0) {
    return NextResponse.json({ error: 'Keine Positionen erkannt' }, { status: 400 })
  }

  // ── Schritt 2: KI-Preise zuweisen ────────────────────────────────────────
  const genRes = await fetch(`${origin}/api/angebot-generieren`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
    body: JSON.stringify({
      text: combinedText,
      gewerk: extData.extraktion?.gewerk,
      berechnete_positionen: positionen,
    }),
  })

  if (!genRes.ok) {
    // Systemischer Fund Punkt 2 (2026-08-20): hier stand früher eine
    // Fehlerbehandlung für "Preisberechnung antwortet mit 422/PREIS_FEHLT",
    // die ein rotes Banner gezeigt und NICHT zur Entwurfsansicht
    // weitergeleitet hätte — genau der Verstoß, den Sandy ausdrücklich
    // verboten hat ("muss ich natürlich TROTZDEM zur Entwurfsansicht
    // kommen"). Entfernt, weil toter Code: angebot-generieren liefert nie
    // mehr 422 (siehe Kommentar dort — fehlende Preise blockieren nicht
    // mehr, sondern kommen mit 0,00 € sichtbar in die Positionen; Status
    // ist dabei immer 200). Ohne diesen Branch fällt ein tatsächlich
    // fehlerhafter Aufruf jetzt sauber auf den generischen 500er unten.
    if (genRes.status === 429) {
      const err = await genRes.json().catch(() => ({})) as { error?: string }
      return NextResponse.json({ error: err.error ?? 'Zu viele Anfragen' }, { status: 429 })
    }
    return NextResponse.json({ error: `Preisberechnung fehlgeschlagen: ${genRes.status}` }, { status: 500 })
  }

  const genData = await genRes.json() as {
    items?: Array<{
      title: string
      description?: string
      quantity: number
      unit: string
      unit_price: number
      preis_position_id?: string
      berechnungsweg?: string | null
      annahmen?: string[]
    }>
    zusammenfassung?: string
    notizen?: string
  }

  const items = genData.items ?? []

  // ── Schritt 3: quote_items ergänzen ──────────────────────────────────────
  // PM-014, App-seitiger Dedup-Fix (2026-08-19): Angebot 2026-0016
  // verdoppelte sich komplett (jede Position exakt 2×, Nettosumme exakt
  // verdoppelt). Ursache: Positionen MIT Raum-Suffix ("Wandflächen streichen
  // — Flur") wurden nie gegen bereits vorhandene Positionen geprüft (nur die
  // "einmalig"-Kategorie unten). Trifft diese Route ein zweites Mal auf
  // dieselben Daten, landet exakt derselbe Titel MIT derselben Menge nochmal
  // in der Liste. Details + Tests: `quote-items-dedup.ts`.
  //
  // PM-014, DB-seitiger Race-Fix (2026-08-20, Sandys Go): der App-Dedup oben
  // schützt nur gegen einen erneuten Aufruf NACHDEM der vorherige committed
  // hat. Er schützt NICHT gegen zwei wirklich zeitgleiche Anfragen — beide
  // lesen "bestehendeItems" (unten), bevor eine von beiden geschrieben hat
  // (TOCTOU), bestehen beide denselben Dedup-Check und fügen beide denselben
  // Positionsbereich ein. Der neue DB-Constraint
  // `quote_items_quote_id_position_key` (unique auf quote_id+position,
  // Migration 20260820103931) macht das strukturell unmöglich: die zweite,
  // kollidierende Schreibung schlägt jetzt mit Fehlercode 23505 fehl statt
  // still zu duplizieren. Diese Schleife fängt genau diesen Fehler ab, liest
  // den inzwischen frischen Datenbankstand neu ein und versucht es EINMAL
  // erneut — die andere Anfrage hat zu diesem Zeitpunkt bereits committed,
  // der zweite Versuch berechnet also entweder eine freie Positionsspanne
  // oder erkennt (über denselben Dedup wie oben), dass gar nichts Neues mehr
  // einzufügen ist.
  let gefilterteItems: typeof items = []
  for (let versuch = 1; versuch <= 2; versuch++) {
    // Bestehende Positionen: höchste Nummer + vorhandene Titel (für Dedup)
    const { data: bestehendeItems } = await supabase
      .from('quote_items')
      .select('position, title, quantity')
      .eq('quote_id', angebot_id)
      .order('position', { ascending: false })
    const startPosition = (bestehendeItems?.[0]?.position ?? 0) + 1
    const bestehendeTitle = new Set((bestehendeItems ?? []).map(i => (i.title as string).toLowerCase().trim()))

    const ohneExakteDubletten = filtereExakteDubletten(
      items,
      (bestehendeItems ?? []).map(i => ({ title: i.title as string, quantity: i.quantity as number | null })),
    )

    // Nur allgemeine Positionen OHNE Raum-Suffix dürfen nur einmal vorkommen
    const EINMALIG_MUSTER = ['kleinmaterial', 'verbrauchsmaterial', 'an- und abfahrt', 'anfahrt', 'abfahrt', 'schutzfolie', 'schutzmaßnahmen']
    gefilterteItems = ohneExakteDubletten.filter(item => {
      const titelLower = (item.title as string).toLowerCase().trim()
      const hatRaumSuffix = titelLower.includes(' — ')
      // Positionen mit Raum-Suffix (aber unterschiedlicher Menge) immer erlauben (Wandflächen — Flur + Wandflächen — Küche)
      if (hatRaumSuffix) return true
      // Allgemeine Positionen: nur einmal pro Quote
      const istEinmalig = EINMALIG_MUSTER.some(m => titelLower.includes(m))
      if (istEinmalig) {
        const schonDa = [...bestehendeTitle].some(t => EINMALIG_MUSTER.some(m => t.includes(m) && titelLower.includes(m)))
        if (schonDa) return false
      }
      return true
    })

    if (gefilterteItems.length === 0) break // nichts (mehr) einzufügen — z.B. eine parallele Anfrage hatte schon alles ergänzt

    const itemRows = gefilterteItems.map((item, idx) => ({
      quote_id: angebot_id,
      position: startPosition + idx,
      title: item.title,
      description: item.description ?? null,
      quantity: item.quantity ?? 1,
      unit: item.unit ?? 'Stk',
      unit_price: item.unit_price ?? 0,
      price_item_id: item.preis_position_id ?? null,
      total_price: (item.quantity ?? 1) * (item.unit_price ?? 0),
      berechnungsweg: item.berechnungsweg ?? null,
      annahmen: item.annahmen ?? [],
    }))

    const { error: insertErr } = await supabase.from('quote_items').insert(itemRows)
    if (!insertErr) break // Erfolg

    const istPositionsKonflikt = insertErr.code === '23505' && insertErr.message.includes('quote_items_quote_id_position_key')
    if (istPositionsKonflikt && versuch === 1) {
      // Echte Race Condition erwischt — parallele Anfrage war schneller.
      // Nicht als Fehler behandeln, einfach mit frischem Stand neu versuchen.
      continue
    }

    console.error('[positionen-generieren] Datenbankeintrag fehlgeschlagen')
    Sentry.captureException(new Error(insertErr.message), { tags: { feature: 'positionen_generieren_insert' } })
    return NextResponse.json({ error: 'Positionen konnten nicht gespeichert werden' }, { status: 500 })
  }

  // CoS-002 Option 2 (Head of Product Engineering, 2026-08-20, Sandys Auftrag
  // "Option 2 sofort"): die Aufnahmekarte zeigt bis hierhin für jede Aufnahme
  // noch die ursprüngliche, schnelle Chip-Vorschau (erkannte_positionen aus
  // extrahiereChips) — auch nachdem die echte, autoritative Berechnung oben
  // etwas anderes ergeben hat. Kein Architekturwechsel (siehe
  // docs/cos-002-architektur-vorschlag.md, das ist Option 1), sondern ein
  // nachträglicher Abgleich: sobald die echte Berechnung erfolgreich war,
  // überschreiben wir erkannte_positionen der beteiligten Aufnahmen mit dem
  // tatsächlich berechneten Ergebnis. Geht man später zu einer dieser
  // Aufnahmen zurück (Detail-Ansicht), sieht man die Wahrheit, nicht mehr die
  // ursprüngliche Vermutung. Behebt NICHT den Moment direkt nach dem
  // Sprechen, VOR diesem Klick — das bleibt Option 1.
  // Bewusst nur wenn tatsächlich etwas Neues eingefügt wurde (gefilterteItems
  // nicht leer) — sonst gäbe es nichts Verlässlicheres, um die Vorschau zu
  // ersetzen, und ein Leerschreiben würde eine sonst korrekte Karte kaputt
  // machen.
  if (gefilterteItems.length > 0) {
    const autoritativePositionen = gefilterteItems.map(item => ({
      titel: item.title,
      menge: item.quantity ?? 1,
      einheit: item.unit ?? 'Stk',
      einzelpreis: item.unit_price ?? 0,
      gesamtpreis: (item.quantity ?? 1) * (item.unit_price ?? 0),
      erkannt: true,
    }))
    const batchAufnahmenIds = aufnahmen.map(a => a.id)
    const { error: rueckschreibFehler } = await supabase
      .from('entwurf_aufnahmen')
      .update({ erkannte_positionen: autoritativePositionen })
      .in('id', batchAufnahmenIds)
    if (rueckschreibFehler) {
      // Nur protokollieren, nie blockieren — dieselbe "Fehler darf nie
      // blockieren"-Regel wie beim Preis-Fehlt-Fall. Die Positionen sind zu
      // diesem Zeitpunkt schon sicher in quote_items gespeichert.
      console.error('[positionen-generieren] Karten-Abgleich (CoS-002 Option 2) fehlgeschlagen, Berechnung selbst aber erfolgreich')
      Sentry.captureException(new Error(rueckschreibFehler.message), { tags: { feature: 'cos002_option2_kartenabgleich' } })
    }
  }

  // Totals neu berechnen (alle Positionen, nicht nur neue)
  const { data: alleItems } = await supabase
    .from('quote_items')
    .select('total_price')
    .eq('quote_id', angebot_id)
  const total_net = (alleItems ?? []).reduce((s, i) => s + (i.total_price ?? 0), 0)

  // MwSt aus Company-Profil laden
  const { data: companyData2 } = await supabase
    .from('companies')
    .select('vat_rate')
    .eq('user_id', user.id)
    .single()
  const vatRate = (companyData2 as { vat_rate?: number } | null)?.vat_rate ?? 19
  const total_gross = total_net * (1 + vatRate / 100)

  await supabase.from('quotes').update({
    total_net,
    total_gross,
    notes: genData.notizen ?? null,
    entwurf_gespeichert_am: new Date().toISOString(),
  }).eq('id', angebot_id)

  return NextResponse.json({ ok: true, positionen_count: gefilterteItems.length, rueckfragen, warnungen: massWarnungen })
}
