import { redirect } from 'next/navigation'

// CoS-001/DC-001 (2026-08-16): Diese Seite war eine alte, unverlinkte
// Marketing-Vorschau mit eigenem, längst veraltetem Preismodell (9 €/29 €)
// — eine dritte, unabhängig gepflegte Preisquelle neben Landingpage und
// Upgrade-Dialog. Route bleibt bestehen (für alte Links/Bookmarks sowie als
// Fallback-Ziel in `proxy.ts`, wenn lokal keine Supabase-Umgebungsvariablen
// gesetzt sind), leitet aber direkt auf die echte Landingpage weiter statt
// eigene Inhalte/Preise zu zeigen.
export default function VorschauPage() {
  redirect('/')
}
