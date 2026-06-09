'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings } from 'lucide-react'

const NAV = [
  { href: '/dashboard', icon: Home, label: 'Start' },
  { href: '/kunden', icon: Users, label: 'Kunden' },
  { href: '/einstellungen', icon: Settings, label: 'Einstellungen' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#2C2C2C]/10 flex z-40">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = path === href || (href !== '/dashboard' && path.startsWith(href))
        return (
          <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-3 ${active ? 'text-[#F5C400]' : 'text-[#2C2C2C]/40'}`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="text-xs font-bold mt-0.5">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
