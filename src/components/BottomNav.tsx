'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Users, Settings, Mic } from 'lucide-react'

// DC-043 (2026-08-30, Sandys Go): hieß hier "Start", die Desktop-SideNav
// nennt denselben Ort "Dashboard" — kleine Wort-Inkonsistenz zwischen
// Mobile und Desktop, jetzt vereinheitlicht.
const LEFT_NAV  = [
  { href: '/dashboard', icon: Home,     label: 'Dashboard' },
  { href: '/angebote',  icon: FileText, label: 'Angebote'  },
]
const RIGHT_NAV = [
  { href: '/kunden',        icon: Users,    label: 'Kunden'        },
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
          active ? 'text-yellow' : 'text-[#AAAAAA]'
        }`}
      >
        <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
        <span className="text-[10px] font-bold">{label}</span>
      </Link>
    )
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* FAB */}
      <Link
        href="/angebot/neu"
        className="absolute left-1/2 -translate-x-1/2 -top-5 w-14 h-14 rounded-full bg-yellow flex items-center justify-center active:opacity-80 transition-opacity"
        style={{ boxShadow: '0 4px 16px rgba(245,196,0,0.5)' }}
      >
        <Mic size={24} strokeWidth={2.5} className="text-white" />
      </Link>

      <div
        className="bg-white flex items-stretch pb-safe"
        style={{ height: 64, borderTop: '1px solid #EEEEEE', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}
      >
        {LEFT_NAV.map(item  => <NavItem key={item.href} {...item} />)}
        {/* center gap for FAB */}
        <div className="flex-1" />
        {RIGHT_NAV.map(item => <NavItem key={item.href} {...item} />)}
      </div>
    </div>
  )
}
