import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Original laden (mit Items)
  const { data: original } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*)')
    .eq('id', id)
    .single()

  if (!original) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  // Sicherstellen dass es dem eigenen Betrieb gehört
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!company || original.company_id !== company.id) {
    return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 })
  }

  const neueRevision = (original.revision ?? 1) + 1
  // original_id zeigt immer auf das allererste Angebot der Serie
  const serienUrsprung = original.original_id ?? original.id

  // Angebotsnummer: AG-2025-001 → AG-2025-001-R2
  // Bereits vorhandenes -R{n} Suffix entfernen und neu anhängen
  const basisNummer = (original.angebotsnummer ?? '').replace(/-R\d+$/, '')
  const neueNummer = basisNummer ? `${basisNummer}-R${neueRevision}` : null

  // Extras aus der alten Quote holen (Rabatte, Aufschläge etc.)
  const { data: extras } = await supabase
    .from('quotes')
    .select('discount_percent, discount_amount, surcharge_amount, surcharge_label, internal_notes, briefpapier_id')
    .eq('id', id)
    .single()

  // Neue Revision anlegen
  const { data: neueQuote, error: createErr } = await supabase
    .from('quotes')
    .insert({
      company_id: original.company_id,
      customer_id: original.customer_id,
      status: 'draft',
      angebotsnummer: neueNummer,
      valid_until: original.valid_until,
      total_net: original.total_net,
      total_vat: original.total_vat,
      total_gross: original.total_gross,
      notes: original.notes,
      revision: neueRevision,
      original_id: serienUrsprung,
      // Extras übernehmen
      discount_percent: extras?.discount_percent ?? 0,
      discount_amount: extras?.discount_amount ?? 0,
      surcharge_amount: extras?.surcharge_amount ?? 0,
      surcharge_label: extras?.surcharge_label ?? 'Zuschlag',
      internal_notes: extras?.internal_notes ?? null,
      briefpapier_id: extras?.briefpapier_id ?? null,
      // Versand-/Unterschrift-Felder bewusst leer lassen
      sent_via: [],
    })
    .select()
    .single()

  if (createErr || !neueQuote) {
    return NextResponse.json({ error: createErr?.message ?? 'Fehler beim Erstellen' }, { status: 500 })
  }

  // Items kopieren
  const items = (original.items ?? []) as {
    position: number; title: string; description: string | null
    quantity: number; unit: string; unit_price: number; total_price: number
    vob_norm?: string | null; din_normen?: string[] | null
  }[]

  if (items.length > 0) {
    await supabase.from('quote_items').insert(
      items.map(item => ({
        quote_id: neueQuote.id,
        position: item.position,
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.total_price,
        vob_norm: item.vob_norm ?? null,
        din_normen: item.din_normen ?? null,
      }))
    )
  }

  return NextResponse.json({ id: neueQuote.id, revision: neueRevision, angebotsnummer: neueNummer })
}
