'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Settings, LogOut, X } from 'lucide-react'

interface Props {
  initial: string
  name: string
  plan?: string
}

export default function AvatarSheet({ initial, name, plan }: Props) {
  const [open, setOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-full bg-[#2C2C2C] flex items-center justify-center active:opacity-70 transition-opacity"
      >
        <span className="text-white font-black text-sm">{initial}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" />
            </div>

            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-syne font-black text-[#2C2C2C] text-xl">Hallo, {name}</div>
                {plan && (
                  <span className="text-[11px] font-black text-[#8B7000] bg-[#F5C400]/20 px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wide">
                    {plan === 'pro' ? '⭐ Pro' : plan === 'starter' ? 'Starter' : plan}
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-[#2C2C2C]/30 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/einstellungen"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 bg-[#F7F7F5] rounded-2xl px-4 py-3.5"
              >
                <Settings size={18} className="text-[#2C2C2C]/50" />
                <span className="font-black text-[#2C2C2C] text-[15px]">Einstellungen</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 bg-[#F7F7F5] rounded-2xl px-4 py-3.5 w-full text-left"
              >
                <LogOut size={18} className="text-red-500" />
                <span className="font-black text-red-500 text-[15px]">Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
