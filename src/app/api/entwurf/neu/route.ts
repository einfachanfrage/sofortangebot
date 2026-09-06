import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateErstbaustelle } from '@/lib/baustellen'
import { pruefeAngebotsLimit, limitNachricht } from '@/lib/plan-limit'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as {
    kunden_name?: string
    customer_id?: string
    baustelle_id?: string
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id, plan')
    .eq('user_id', user.id)
    .single()

  if (!company) return NextResponse.json({ error: 'Kein Unternehmen gefunden' }, { status: 404 })

  // DC-045, Sandys Entscheidung „harte Grenze": Hier — und nur hier —
  // entsteht ein NEUES Angebot. Die Prüfung sitzt vor dem Insert, damit
  // niemand erst ein Diktat aufnimmt und danach die Sperre sieht.
  // Bestehende Entwürfe bleiben unberührt: Diese Route legt an, sie
  // bearbeitet nicht.
  const limit = await pruefeAngebotsLimit(supabase, company.id, company.plan)
  if (limit.erreicht && limit.limit !== null) {
    return NextResponse.json({
      error: 'limit_erreicht',
      message: limitNachricht(limit.limit),
      anzahl: limit.anzahl,
      limit: limit.limit,
    }, { status: 403 })
  }

  let customerId: string | null = null
  let baustelleId: string | null = null

  if (body.customer_id) {
    // DC-029: „+ Neues Angebot für diese Baustelle" auf der Kunde-Seite —
    // Kunde (und optional die gewählte Baustelle) kommen direkt als IDs mit,
    // statt wie unten per Namens-Schnellanlage. Beide IDs kommen aus der
    // URL/dem Request-Body und könnten manipuliert sein, deshalb hier explizit
    // Eigentümerschaft prüfen statt sie blind zu übernehmen.
    const { data: kunde } = await supabase
      .from('customers')
      .select('id')
      .eq('id', body.customer_id)
      .eq('company_id', company.id)
      .maybeSingle()
    customerId = kunde?.id ?? null

    if (customerId && body.baustelle_id) {
      const { data: baustelle } = await supabase
        .from('baustellen')
        .select('id')
        .eq('id', body.baustelle_id)
        .eq('company_id', company.id)
        .eq('customer_id', customerId)
        .maybeSingle()
      baustelleId = baustelle?.id ?? null
    }
  } else if (body.kunden_name?.trim()) {
    // Optionaler Kundenname als Hilfs-Bezeichnung (Schnellanlage)
    const { data: kunde } = await supabase
      .from('customers')
      .insert({ name: body.kunden_name.trim(), company_id: company.id })
      .select('id')
      .single()
    customerId = kunde?.id ?? null
  }

  // CoS-012/DC-029: automatisch die Erstbaustelle des Kunden mitsetzen, falls
  // oben keine explizite Baustelle übergeben wurde (siehe src/lib/baustellen.ts).
  if (customerId && !baustelleId) {
    baustelleId = await getOrCreateErstbaustelle(supabase, company.id, customerId)
  }

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({
      company_id: company.id,
      customer_id: customerId,
      status: 'draft',
      total_net: 0,
      total_gross: 0,
      ...(baustelleId ? { baustelle_id: baustelleId } : {}),
    })
    .select('id')
    .single()

  if (error?.message?.includes('baustelle_id')) {
    // Spalte fehlt noch (Migration nicht ausgeführt) — ohne erneut versuchen,
    // gleiche Vorsicht wie in quotes/create/route.ts.
    const minimal = await supabase
      .from('quotes')
      .insert({ company_id: company.id, customer_id: customerId, status: 'draft', total_net: 0, total_gross: 0 })
      .select('id')
      .single()
    if (minimal.error || !minimal.data) {
      return NextResponse.json({ error: minimal.error?.message ?? 'Konnte Entwurf nicht anlegen' }, { status: 500 })
    }
    return NextResponse.json({ id: minimal.data.id })
  }

  if (error || !quote) {
    return NextResponse.json({ error: error?.message ?? 'Konnte Entwurf nicht anlegen' }, { status: 500 })
  }

  return NextResponse.json({ id: quote.id })
}
