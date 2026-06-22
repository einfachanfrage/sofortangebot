'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings, Mic } from 'lucide-react'

const LEFT_NAV = [
  { href: '/dashboard', icon: Home, label: 'Start' },
]
const RIGHT_NAV = [
  { href: '/kunden', icon: Users, label: 'Kunden' },
  { href: '/einstellungen', icon: Settings, label: 'Einstellungen' },
]

export default function BottomNav() {
  const path = usePathname()

  function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    const active = path === href || (href !== '/dashboard' && path.startsWith(href))
    return (
      <Link
        href={href}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
          active ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/30'
        }`}
      >
        <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
        <span className="text-[10px] font-bold">{label}</span>
      </Link>
    )
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* FAB */}
      <Link
        href="/angebot/neu"
        className="absolute left-1/2 -translate-x-1/2 -top-7 w-[54px] h-[54px] rounded-full bg-[#F5C400] flex items-center justify-center"
        style={{ boxShadow: '0 4px 24px rgba(245,196,0,0.5)' }}
      >
        <Mic size={22} strokeWidth={2.5} className="text-[#2C2C2C]" />
      </Link>

      <div className="bg-white border-t border-[#2C2C2C]/8 flex items-stretch h-[58px]">
        {LEFT_NAV.map(item => <NavItem key={item.href} {...item} />)}
        {/* center gap for FAB */}
        <div className="flex-1" />
        {RIGHT_NAV.map(item => <NavItem key={item.href} {...item} />)}
      </div>
    </div>
  )
}
