import { corsHeaders } from '../_shared/cors.ts'
import { getUser } from '../_shared/auth.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const auth = await getUser(req)
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Nicht eingeloggt' }), {
        status: 401,
        headers: corsHeaders,
      })
    }
    const { supabase } = auth

    const { angebot_id, positionen_json, notizen } = await req.json()

    if (!angebot_id) {
      return new Response(JSON.stringify({ error: 'angebot_id fehlt' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const updateData: Record<string, unknown> = {
      entwurf_gespeichert_am: new Date().toISOString(),
    }
    if (positionen_json !== undefined) updateData.positionen_json = positionen_json
    if (notizen !== undefined) updateData.notizen = notizen

    const { error } = await supabase
      .from('quotes')
      .update(updateData)
      .eq('id', angebot_id)

    if (error) throw error

    return new Response(
      JSON.stringify({ gespeichert: true, zeitpunkt: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch {
    console.error('[angebot-autosave] Speicherung fehlgeschlagen')
    return new Response(JSON.stringify({ error: 'Autosave fehlgeschlagen' }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
