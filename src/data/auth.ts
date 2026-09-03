import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const requireUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
})

export const requireCompany = cache(async () => {
  const { supabase, user } = await requireUser()
  const { data: company } = await supabase
    .from('companies')
    // `onboarding_started_at` gehört mit in die Auswahl: getDashboardData()
    // entscheidet daran, ob jemand ins Onboarding umgeleitet wird. Ohne die
    // Spalte wäre der Wert immer undefined und die Prüfung stillschweigend
    // wirkungslos — Code, der aussieht, als täte er etwas.
    .select('id, name, plan, onboarding_started_at')
    .eq('user_id', user.id)
    .single()
  if (!company) redirect('/onboarding')
  return { supabase, user, company }
})
