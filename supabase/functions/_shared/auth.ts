// @deno-types="https://esm.sh/@supabase/supabase-js@2/types/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function getUser(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return null

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  return { user, supabase }
}
