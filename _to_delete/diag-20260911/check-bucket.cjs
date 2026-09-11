// Diagnose (Product Designer, 2026-09-11): Sandy meldet, WhatsApp/Link-
// Versand funktioniere nicht, E-Mail-Versand aber schon. Beide Pfade
// rendern dasselbe PDF (lib/pdf.tsx) — nur der WhatsApp/Link-Pfad
// (api/quotes/[id]/public-pdf) lädt es danach zusätzlich in den
// Supabase-Storage-Bucket "public-pdfs" hoch. Test isoliert: existiert
// der Bucket überhaupt, funktioniert ein Upload + öffentliche URL?
const fs = require('fs')
const path = require('path')

// .env.local von Hand parsen (kein dotenv-Zusatzpaket nötig)
const envPath = path.join(__dirname, '..', '..', '.env.local')
const envRaw = fs.readFileSync(envPath, 'utf8')
for (const line of envRaw.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}

const { createClient } = require('@supabase/supabase-js')
const service = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  console.log('--- 1. Buckets auflisten ---')
  const { data: buckets, error: listErr } = await service.storage.listBuckets()
  if (listErr) {
    console.log('FEHLER beim Auflisten:', listErr.message)
  } else {
    console.log(buckets.map(b => `${b.id} (public=${b.public})`).join('\n'))
  }

  console.log('\n--- 2. Testdatei in public-pdfs hochladen ---')
  const testBuf = Buffer.from('%PDF-1.4 diagnose-test')
  const testPath = `__diagnose__/test-${Date.now()}.pdf`
  const { error: uploadErr } = await service.storage.from('public-pdfs').upload(testPath, testBuf, { contentType: 'application/pdf', upsert: true })
  if (uploadErr) {
    console.log('FEHLER beim Upload:', JSON.stringify(uploadErr))
  } else {
    console.log('Upload OK')
    const { data: pub } = service.storage.from('public-pdfs').getPublicUrl(testPath)
    console.log('Public URL:', pub.publicUrl)
    // Aufräumen
    const { error: rmErr } = await service.storage.from('public-pdfs').remove([testPath])
    console.log(rmErr ? 'Aufräumen fehlgeschlagen: ' + rmErr.message : 'Testdatei wieder entfernt')
  }
}

main().catch(e => console.log('UNCAUGHT:', e.message))
