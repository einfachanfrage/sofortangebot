import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Liefert eine frische Signed URL für die Unterschrift eines Angebots (1 Stunde gültig)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { id } = await params

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!company) return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 })

  // Ownership prüfen
  const { data: quote } = await supabase
    .from('quotes')
    .select('id, signature_url')
    .eq('id', id)
    .eq('company_id', company.id)
    .single()

  if (!quote) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  if (!quote.signature_url) return NextResponse.json({ error: 'Keine Unterschrift' }, { status: 404 })

  // Unterstützt sowohl alte gespeicherte URLs als auch neue Pfade (signatures/...)
  const isPath = !quote.signature_url.startsWith('http')
  if (!isPath) {
    // Legacy: direkt zurückgeben (alte gespeicherte Signed URLs)
    return NextResponse.json({ url: quote.signature_url })
  }

  // Neue Logik: frische Signed URL generieren (1 Stunde)
  const { data, error } = await supabaseAdmin.storage
    .from('quote-signatures')
    .createSignedUrl(quote.signature_url, 60 * 60)

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'Konnte URL nicht generieren' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
