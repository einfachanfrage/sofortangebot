'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings, Mic } from 'lucide-react'
import { Logo } from '@/components/Logo'

const NAV = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/kunden', icon: Users, label: 'Kunden' },
  { href: '/einstellungen', icon: Settings, label: 'Einstellungen' },
]

export default function SideNav() {
  const path = usePathname()
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-[#2C2C2C] z-50">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <Logo variant="dark" className="text-xl" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                active
                  ? 'bg-[#F5C400] text-[#2C2C2C]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* New Quote CTA */}
      <div className="px-3 pb-6">
        <Link
          href="/angebot/neu"
          className="flex items-center justify-center gap-2 w-full bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-xl py-3 hover:bg-[#F5C400]/90 transition-colors"
        >
          <Mic size={16} strokeWidth={2.5} />
          Neues Angebot
        </Link>
      </div>
    </aside>
  )
}
