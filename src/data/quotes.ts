import 'server-only'

import { notFound } from 'next/navigation'
import { requireCompany } from './auth'

export interface QuoteListDTO {
  id: string
  status: string
  total_gross: number
  created_at: string
  // DC-042 Punkt 4: echtes Versanddatum statt created_at — Grundlage für
  // „Beim Kunden seit X Tagen" (Anzeige baut der Product Designer).
  gesendet_am: string | null
  // DC-042: echter Ausgang trotz Archivierung, und der Unterschied zwischen
  // „Kunde hat Nein gesagt" und „nie wieder gehört".
  status_vor_archiv: string | null
  abgelehnt_grund: string | null
  gewerk: string | null
  customer: { name: string } | null
  quote_items: Array<{ title: string; position: number }>
}

function normalizeCustomer(value: unknown): { name: string } | null {
  if (Array.isArray(value)) return value[0] ?? null
  return (value as { name: string } | null) ?? null
}

// DC-011: `quotes.gewerk` und `quotes.title` existieren NICHT als Spalten
// (per Datenbank-Check am 2026-08-18 bestätigt) — die Abfrage unten hat sie
// bisher trotzdem angefragt und ist deshalb IMMER mit einem SQL-Fehler
// gescheitert ("column gewerk does not exist"), für JEDE Firma und JEDEN
// Filter, nicht nur für ein einzelnes Angebot. Der Fehler wurde nur
// geloggt, nicht angezeigt — die Seite zeigte einfach "Noch kein Angebot.".
// `title` wurde nirgends im Ergebnis genutzt (einfach entfernt). `gewerk`
// wird für das Positionen-Badge gebraucht — steckt aber bereits im
// `extraktion_final`-JSON (siehe generiere-positionen/route.ts), hier nur
// sicher auslesen statt aus einer eigenen Spalte.
function extrahiereGewerk(extraktion: unknown): string | null {
  if (!extraktion || typeof extraktion !== 'object') return null
  const gewerk = (extraktion as { gewerk?: unknown }).gewerk
  return typeof gewerk === 'string' ? gewerk : null
}

// DC-042 (2026-08-30, Sandys Go): "bereit" fehlte hier komplett — ein
// fertiggestelltes, aber noch nicht verschicktes Angebot hatte dadurch
// KEINEN eigenen Filter-Reiter, nur über "Alle" zu finden (eine der drei
// strukturellen Lücken aus der Bestandsaufnahme, siehe design-check.md).
const STATUS_FILTERS: Record<string, string[]> = {
  entwurf: ['draft', 'in_bearbeitung'],
  bereit: ['bereit'],
  offen: ['sent'],
  beauftragt: ['accepted'],
  abgelehnt: ['rejected'],
  archived: ['archived'],
}

export async function getQuotesOverview(status?: string) {
  const { supabase, company } = await requireCompany()
  const statusValues = status ? STATUS_FILTERS[status] : undefined
  let query = supabase.from('quotes')
    .select('id, status, total_gross, created_at, gesendet_am, status_vor_archiv, abgelehnt_grund, extraktion_final, customer:customers(name), quote_items(title, position)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
  if (statusValues) query = query.in('status', statusValues)

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const [quotesResult, draftsResult, archiveResult, monthResult] = await Promise.all([
    query,
    supabase.from('quotes').select('id').eq('company_id', company.id).in('status', ['draft', 'in_bearbeitung']),
    supabase.from('quotes').select('id').eq('company_id', company.id).eq('status', 'archived'),
    supabase.from('quotes').select('status').eq('company_id', company.id).gte('created_at', monthStart)
      .not('status', 'in', '("draft","in_bearbeitung","archived")'),
  ])
  if (quotesResult.error) console.error('[quotes-dal] Abfrage fehlgeschlagen')
  const month = monthResult.data ?? []
  return {
    quotes: (quotesResult.data ?? []).map(row => ({
      id: row.id,
      status: row.status,
      total_gross: row.total_gross,
      created_at: row.created_at,
      gesendet_am: row.gesendet_am ?? null,
      status_vor_archiv: row.status_vor_archiv ?? null,
      abgelehnt_grund: row.abgelehnt_grund ?? null,
      gewerk: extrahiereGewerk(row.extraktion_final),
      customer: normalizeCustomer(row.customer),
      quote_items: row.quote_items ?? [],
    })) satisfies QuoteListDTO[],
    counts: {
      drafts: (draftsResult.data ?? []).length,
      archive: (archiveResult.data ?? []).length,
      bereit: month.filter(q => q.status === 'bereit').length,
      open: month.filter(q => q.status === 'sent').length,
      accepted: month.filter(q => q.status === 'accepted').length,
      rejected: month.filter(q => q.status === 'rejected').length,
    },
  }
}

export async function getQuoteDetail(id: string) {
  const { supabase, company } = await requireCompany()
  const { data: quote } = await supabase
    .from('quotes').select('*, items:quote_items(*), customer:customers(*)')
    .eq('id', id).eq('company_id', company.id).single()
  if (!quote) notFound()

  const { data: fullCompany } = await supabase.from('companies').select('*').eq('id', company.id).single()
  const quoteNumber = (quote as { angebotsnummer?: string | null }).angebotsnummer
    ?? `${new Date(quote.created_at).getFullYear()}-${quote.id.slice(-4).toUpperCase()}`
  return {
    quote: { ...quote, items: (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position) },
    company: fullCompany,
    quoteNumber,
  }
}
