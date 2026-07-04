import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, CHAT_MODEL } from '@/lib/ai-client'
import { kleinmaterialPosition, anfahrtPosition } from '@/lib/gewerke-config'

const SYSTEM_PROMPT = `Du bist Kalkulations-Profi mit 20 Jahren Erfahrung im deutschen Handwerk.

AUFGABE: Vervollständige das Angebot anhand der Rückfragen-Antworten.
Füge Fahrtkosten, Material, Aufpreise, Entsorgung usw. hinzu — NUR was noch fehlt, keine Duplikate.

══════════════════════════════════════════════
MATERIAL-LOGIK (WENN "Ja, ich liefere das Material")
══════════════════════════════════════════════
Leite aus den vorhandenen Positionen das Gewerk ab und füge passende Material-Positionen hinzu.
Aufschlag auf Einkaufspreis: 20% (Marge für Beschaffung, Transport, Lagerung).

MALER — Material-Positionen:
- Tiefengrund/Grundierung: ca. 2,50€/m² (Wandfläche)
- Wandfarbe 2× Anstrich: ca. 4,50€/m²
- Deckenfarbe 2× Anstrich: ca. 4,50€/m²
- Kleinmaterial (Folie, Krepp, Rollen): ca. 5% der m²-Anzahl als €-Pauschale
Kategorie: "Material"

VINYL/LAMINAT — Material-Positionen:
- Bodenbelag liefern: Verlegefläche m² × marktüblicher Preis (ca. 14-22€/m² je nach Qualität)
- Trittschalldämmung: gleiche m² × 3,50€/m²
- Sockelleisten: Raumumfang lm (Schätzung: √Fläche × 4,2) × 5€/lm
- Übergangsprofil Türen: Anzahl Türen (min. 1, aus Aufmaß ableiten) × 8€/Stk
- Kleinmaterial/Befestigung: Pauschale 20-35€
Kategorie: "Material"

FLIESEN — Material-Positionen:
- Fliesen inkl. 12% Verschnitt: Fläche × 1,12 × Preis (Badezimmer ca. 30-55€/m²)
- Fliesenkleber: Fläche × 5€/m²
- Fugenmörtel: Fläche × 1,50€/m²
- Silikon für Ecken/Anschlüsse: Pauschale 28€
- Fliesenschienen/Winkelprofile: 3 Stk × 8€
Kategorie: "Material"

TROCKENBAU — Material-Positionen:
- GK-Platten inkl. 10% Verschnitt: m² × 1,10 × 8€/m²
- Metallprofile CW/UW: (2 × Wandhöhe + 2 × Wandbreite) lm × 3,50€/lm
- Schrauben/Dübel/Abhänger: m² × 4€/m²
- Spachtelmasse + Fugenband: m² × 2,50€/m²
Kategorie: "Material"

SANITÄR/HEIZUNG — Material pauschal: Rohre, Fittings, Dichtmittel nach Aufwand schätzen.
ELEKTRO — Kabel NYM + Dosen + Kleinmaterial nach Aufwand schätzen.

══════════════════════════════════════════════
FAHRTKOSTEN
══════════════════════════════════════════════
Wenn Entfernung bekannt: (km × 2) × Fahrtenanzahl (Standard: 3) × 0,40€/km
Wenn "keine Angabe": Pauschale 45€
Kategorie: "Fahrtkosten"

══════════════════════════════════════════════
AUFPREISE & ERSCHWERNISSE
══════════════════════════════════════════════
- 2.OG ohne Aufzug: Position "Trägerzuschlag Stockwerk" = 8% der Arbeitskosten (als €-Betrag)
- 3.OG: 12%, 4.OG+: 15%
- Bewohnte Wohnung: "Schutzmaßnahmen bewohnte Wohnung" Pauschale 80-150€
- Wochenende: "+30% Wochenend-Zuschlag" als eigene Position (% × Lohnanteil)
- Parkproblem Innenstadt: "Parkpauschale" ca. 20€/Tag × Arbeitstage (schätzen aus Fläche)

══════════════════════════════════════════════
ENTSORGUNG (wenn "Ja, Entsorgung nötig" und noch nicht vorhanden)
══════════════════════════════════════════════
- Bis 30m²: Kleinfuhre 120€ Pauschale
- 30-60m²: Container 7m³ ca. 320€
- 60m²+: Container 10m³ ca. 420€
Kategorie: "Entsorgung"

WICHTIG:
- KEINE Duplikate zu bestehenden Positionen (Titeln vergleichen)
- Marktüblich — nicht übertreiben
- Mengen-Logik: Teilflächen dürfen Gesamtfläche NICHT überschreiten
- "notizen": kurz und klar was warum hinzugefügt wurde

Antworte NUR mit JSON:
{
  "items": [
    {
      "title": "Bodenbelag Vinyl liefern (inkl. 10% Verschnitt)",
      "description": "Klick-Vinyl ca. 8mm, mittelpreisig",
      "quantity": 88,
      "unit": "m²",
      "unit_price": 18.00,
      "kategorie": "Material"
    }
  ],
  "notizen": "Material hinzugefügt: Vinyl-Belag 88m², Trittschalldämmung, Sockelleisten. Fahrtkosten 45€."
}`

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { items, antworten, aufmaß, gewerk } = await req.json()

  const { data: companyKlein } = await supabase
    .from('companies')
    .select('kleinmaterial_config, anfahrt_config')
    .eq('user_id', user.id)
    .single()

  const antwortText = Object.entries(antworten as Record<string, string>)
    .map(([frage, antwort]) => `- ${frage}: ${antwort}`)
    .join('\n')

  try {
    const client = await getAIClient()
    const response = await client.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Ursprüngliches Aufmaß: ${aufmaß}\n\nVorläufige Positionen:\n${items.map((i: { title: string; quantity: number; unit: string; unit_price: number }) => `- ${i.title}: ${i.quantity} ${i.unit} × ${i.unit_price}€`).join('\n')}\n\nAntworten auf Rückfragen:\n${antwortText}\n\nVervollständige das Angebot. Antworte NUR mit JSON.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 3000,
    })
    const raw = response.choices[0].message.content ?? '{}'
    const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
    const result = JSON.parse(cleaned)

    // Kleinmaterial: AI-Vorschläge entfernen, programmatisch nach Schwelle ergänzen
    if (Array.isArray(result.items)) {
      result.items = result.items.filter((it: { title?: string }) =>
        !(it.title ?? '').toLowerCase().includes('kleinmaterial')
      )
      const summeNetto = [...items, ...result.items].reduce(
        (s: number, it: { unit_price?: number; quantity?: number }) =>
          s + (it.unit_price ?? 0) * (it.quantity ?? 1), 0)
      const klein = kleinmaterialPosition(gewerk ?? null, summeNetto, companyKlein?.kleinmaterial_config ?? null)
      if (klein) result.items.push(klein)

      // An- und Abfahrt
      result.items = result.items.filter((it: { title?: string }) => {
        const t = (it.title ?? '').toLowerCase()
        return !(t.includes('anfahrt') || t.includes('abfahrt') || t.includes('fahrtkosten'))
      })
      const anfahrt = anfahrtPosition(companyKlein?.anfahrt_config ?? null)
      if (anfahrt) result.items.push(anfahrt)
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('angebot-verfeinern error:', err)
    return NextResponse.json({ error: 'Verfeinerung fehlgeschlagen' }, { status: 500 })
  }
}
