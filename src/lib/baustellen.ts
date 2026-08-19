import type { SupabaseClient } from '@supabase/supabase-js'

// CoS-012/DC-029: "Baustelle"/Projekt-Zuordnung.
//
// Designer-Regel (DC-029, Antwort 1): sobald `customer_id` an einem Angebot
// gesetzt wird — egal auf welchem der mehreren Wege im Produkt —, wird
// automatisch die Erstbaustelle dieses Kunden als `baustelle_id` mitgesetzt,
// ohne dass der Nutzer etwas tun muss. Diese Funktion ist die eine Stelle,
// die das umsetzt — an jeder Stelle im Code, die `quotes.customer_id`
// setzt, wird sie danach mit derselben `customer_id` aufgerufen, um
// `baustelle_id` zu bestimmen (siehe `quotes/create`, `entwurf/neu`,
// `quotes/[id]/revise`, `AngebotDetail.tsx`).
//
// "Erstbaustelle" statt einer festen 1:1-Kopplung, weil ein Kunde später
// bewusst eine zweite Baustelle bekommen kann (Clemens-Fall) — diese
// Funktion legt NUR die automatische erste an bzw. findet sie wieder, sie
// wählt nie eine andere, schon vorhandene zweite Baustelle aus. Sobald die
// Baustellen-UI existiert, wird die Auswahl einer anderen Baustelle ein
// bewusster, separater Schritt des Nutzers sein, nicht Teil dieser Funktion.

/**
 * Liefert die ID der Erstbaustelle eines Kunden — legt sie an, falls sie
 * noch nicht existiert (z.B. bei Kunden, die vor diesem Feature angelegt
 * wurden, oder weil die Backfill-Migration diesen Kunden aus irgendeinem
 * Grund noch nicht erreicht hat). Namensregel (DC-029, Antwort 3): hat der
 * Kunde eine Adresse, wird die Baustelle danach benannt ("Musterstraße 12,
 * 12345 Musterstadt") — das ist der Name, unter dem ein Handwerker eine
 * Baustelle im Kopf hat. Ohne Adresse (Schnellanlage) Fallback auf
 * "Baustelle bei {Kundenname}".
 *
 * Gibt `null` zurück, wenn der Kunde nicht gefunden wurde oder das Anlegen
 * fehlschlägt — Aufrufer sollten das genauso behandeln wie ein fehlendes
 * `customer_id` (Baustelle bleibt dann leer, blockiert aber nichts, siehe
 * DC-029 Antwort 1: nullable, wie `customer_id` selbst).
 */
export async function getOrCreateErstbaustelle(
  supabase: SupabaseClient,
  companyId: string,
  customerId: string
): Promise<string | null> {
  const { data: bestehend } = await supabase
    .from('baustellen')
    .select('id')
    .eq('customer_id', customerId)
    .eq('ist_erstbaustelle', true)
    .maybeSingle()
  if (bestehend) return bestehend.id as string

  const { data: kunde } = await supabase
    .from('customers')
    .select('name, address')
    .eq('id', customerId)
    .single()
  if (!kunde) return null

  const adresse = (kunde.address as string | null)?.trim() || null
  const name = adresse || `Baustelle bei ${kunde.name as string}`

  const { data: neu, error } = await supabase
    .from('baustellen')
    .insert({
      company_id: companyId,
      customer_id: customerId,
      name,
      adresse,
      ist_erstbaustelle: true,
    })
    .select('id')
    .single()

  if (error) {
    // Race Condition: zwei gleichzeitige Aufrufe (z.B. zwei schnelle
    // Klicks) könnten beide "existiert noch nicht" sehen und beide
    // versuchen anzulegen — der Unique-Index (`baustellen_erstbaustelle_
    // unique`) lässt nur den ersten durch, der zweite Insert schlägt fehl.
    // In dem Fall nochmal nachschauen statt eine echte Baustelle zu
    // verwerfen.
    const { data: retry } = await supabase
      .from('baustellen')
      .select('id')
      .eq('customer_id', customerId)
      .eq('ist_erstbaustelle', true)
      .maybeSingle()
    return (retry?.id as string) ?? null
  }

  return (neu?.id as string) ?? null
}
