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
    .select('id, name, plan')
    .eq('user_id', user.id)
    .single()
  if (!company) redirect('/onboarding')
  return { supabase, user, company }
})
