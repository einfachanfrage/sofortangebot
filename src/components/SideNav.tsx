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
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[220px] bg-[#2C2C2C] z-50">
      {/* Logo */}
      <div className="px-5 pt-7 pb-5 border-b border-white/8">
        <Logo variant="dark" className="text-lg" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#F5C400] text-[#2C2C2C] font-black'
                  : 'text-white/50 hover:text-white hover:bg-white/5 font-semibold'
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.75} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* New Quote CTA */}
      <div className="px-3 pb-4">
        <Link
          href="/angebot/neu"
          className="flex items-center justify-center gap-2 w-full bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-lg py-3 hover:bg-[#e6b800] transition-colors"
        >
          <Mic size={15} strokeWidth={2.5} />
          Neues Angebot
        </Link>
      </div>

      {/* Plan indicator */}
      <div className="px-4 pb-6 pt-4 border-t border-white/8">
        <div className="flex items-center justify-between">
          <span className="text-white/30 text-xs font-semibold">Dein Plan</span>
          <span className="text-[10px] font-black text-[#F5C400] bg-[#F5C400]/10 px-2 py-0.5 rounded-full">PRO</span>
        </div>
      </div>
    </aside>
  )
}
