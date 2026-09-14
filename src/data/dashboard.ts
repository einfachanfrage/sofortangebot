import 'server-only'

import { requireCompany } from './auth'
import { ACCOUNTING_OPTIONS } from '@/lib/accounting-options'

function normalizeCustomer(value: unknown): { name: string } | null {
  if (Array.isArray(value)) return value[0] ?? null
  return (value as { name: string } | null) ?? null
}

// CoS-P-017 (Platform & Integrations Engineer, 2026-09-14), TN-143: Manfred
// wählte im Onboarding "Lexoffice (Legacy)", ließ das API-Key-Feld leer und
// kam trotzdem mit "Fertig" durch — bewusst so (siehe onboarding/[step]),
// blockiert nicht. Nur: nirgends stand danach, dass die Verknüpfung
// unfertig ist. "Der Chef denkt, es ist verbunden." Eine Spalte pro
// Anbieter, gültig für alle sieben direkt verbundenen Buchhaltungs-Tools
// (nicht für 'datev'/'sage'/'plancraft' — reiner CSV-Export, kein Key nötig
// — und nicht für 'none').
const OAUTH_KEY_SPALTE: Record<string, string> = {
  lexware: 'lexware_api_key',
  lexoffice: 'lexoffice_api_key',
  sevdesk: 'sevdesk_api_key',
  fastbill: 'fastbill_api_key',
  billomat: 'billomat_api_key',
  papierkram: 'papierkram_api_key',
  easybill: 'easybill_api_key',
}

export async function getDashboardData() {
  const { supabase, company } = await requireCompany()
  // Punkt 3 des Designer-Vorschlags „Später fertigstellen" (02.09.2026):
  // Ins Onboarding zwangsweise umgeleitet wird nur noch, wer es NIE
  // angefangen hat. Wer angefangen und abgebrochen hat, sieht das Dashboard
  // mit einem Hinweis-Banner (baut der Product Designer) statt einer
  // Sackgasse — vorher waren beide Fälle in der Datenbank nicht zu
  // unterscheiden.
  //
  // Solange `onboarding_started_at` nirgends gesetzt wird (Punkt 2, ebenfalls
  // beim Designer), ist das Verhalten unverändert: alle Bestandszeilen sind
  // NULL. Diese Zeile geht also nicht "scharf", bevor sein Teil steht.
  const onboardingBegonnen = Boolean(
    (company as { onboarding_started_at?: string | null }).onboarding_started_at,
  )
  if (!company.name && !onboardingBegonnen) return { needsOnboarding: true as const }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  // DC-043 (2026-08-30, Sandys Go, Richtung "Warm & persönlich"): Umsatz
  // bekommt eine große, hervorgehobene Kachel mit Vergleich zum Vormonat
  // statt einer nüchternen Zahl unter drei gleich gewichteten Kacheln —
  // dafür zusätzlich der Vormonats-Umsatz mit derselben Filterlogik wie
  // der aktuelle Monat, nur einen Monat zurück.
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const [recentResult, monthResult, prevMonthResult, priceResult, openResult, accountingResult] = await Promise.all([
    supabase.from('quotes')
      .select('id, status, total_gross, created_at, quote_number, customer:customers(name), quote_items(title, position)')
      .eq('company_id', company.id).not('status', 'eq', 'archived')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('quotes').select('status, total_gross')
      .eq('company_id', company.id).gte('created_at', monthStart)
      .not('status', 'in', '("draft","in_bearbeitung","archived")'),
    supabase.from('quotes').select('status, total_gross')
      .eq('company_id', company.id).gte('created_at', prevMonthStart).lt('created_at', monthStart)
      .not('status', 'in', '("draft","in_bearbeitung","archived")'),
    supabase.from('price_items').select('id', { count: 'exact', head: true }).eq('company_id', company.id),
    supabase.from('quotes').select('id').eq('company_id', company.id).eq('status', 'sent'),
    // CoS-P-017: eigene, kleine Abfrage statt requireCompany() zu erweitern —
    // die sieben Key-Spalten braucht nur diese eine Nudge auf dem Dashboard,
    // requireCompany() wird auf sehr vielen Seiten genutzt.
    supabase.from('companies')
      .select('accounting_software, lexware_api_key, lexoffice_api_key, sevdesk_api_key, fastbill_api_key, billomat_api_key, papierkram_api_key, easybill_api_key')
      .eq('id', company.id).single(),
  ])

  const monthQuotes = monthResult.data ?? []
  const prevMonthQuotes = prevMonthResult.data ?? []
  const monthRevenue = monthQuotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.total_gross ?? 0), 0)
  const prevMonthRevenue = prevMonthQuotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.total_gross ?? 0), 0)

  // CoS-P-017: "Key fehlt noch" gilt nur für die sieben direkt verbundenen
  // Anbieter (Spalte in OAUTH_KEY_SPALTE vorhanden) — bei 'datev'/'sage'/
  // 'plancraft' (CSV-Export) und 'none' gibt es keinen Key, also auch keine
  // "unfertige" Verknüpfung, über die man stolpern könnte.
  const acc = accountingResult.data as Record<string, unknown> | null
  const anbieterWert = (acc?.accounting_software as string | null) ?? null
  const keySpalte = anbieterWert ? OAUTH_KEY_SPALTE[anbieterWert] : undefined
  const buchhaltungKeyFehlt = Boolean(keySpalte && !acc?.[keySpalte])
  const buchhaltungAnbieterLabel = anbieterWert
    ? (ACCOUNTING_OPTIONS.find(o => o.value === anbieterWert)?.label ?? anbieterWert)
    : null

  return {
    needsOnboarding: false as const,
    company: { name: company.name, plan: company.plan ?? 'starter' },
    recentQuotes: (recentResult.data ?? []).map(row => ({
      id: row.id,
      status: row.status,
      total_gross: row.total_gross,
      created_at: row.created_at,
      quote_number: row.quote_number,
      customer: normalizeCustomer(row.customer),
      quote_items: row.quote_items ?? [],
    })),
    monthRevenue,
    prevMonthRevenue,
    // null wenn es im Vormonat schlicht keine Vergleichsbasis gibt (0 €
    // Vormonatsumsatz, z. B. ganz neue Firma) — dann lieber gar kein
    // Vergleich als eine bedeutungslose "+100%"/"+∞%"-Angabe.
    //
    // DC-052 (2026-09-11, Manfred/TN-002): zwei weitere Fälle, in denen der
    // Prozentwert nichts aussagt, aber wie ein Alarm aussieht. Manfreds Satz:
    // "An jedem Monatsersten sieht jeder Betrieb damit aus wie pleite."
    //   (a) Dieser Monat steht noch bei 0 € -> die Rechnung ergibt zwingend
    //       -100 %, egal wie gut der Betrieb läuft.
    //   (b) Die ersten sieben Tage: ein angefangener Monat gegen einen
    //       vollen ist keine Aussage über den Betrieb, sondern über den
    //       Kalender.
    // In beiden Fällen zeigt die Kachel stattdessen den Vormonats-Umsatz als
    // nuechterne Bezugsgroesse (siehe dashboard/page.tsx) — dieselbe
    // Information, ohne die Wertung.
    monthRevenueDeltaPct:
      prevMonthRevenue > 0 && monthRevenue > 0 && now.getDate() > 7
        ? Math.round(((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
        : null,
    monthAccepted: monthQuotes.filter(q => q.status === 'accepted').length,
    priceListEmpty: (priceResult.count ?? 0) === 0,
    openCount: (openResult.data ?? []).length,
    buchhaltungKeyFehlt,
    buchhaltungAnbieterLabel,
  }
}
