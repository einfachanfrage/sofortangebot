'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// DC-013: der globale Footer aus (app)/layout.tsx leckte auch in bewusst
// reduzierte Fokus-Screens (z. B. den Aufmaß-Aufnahme-Screen /entwurf, der
// die BottomNav schon korrekt ausblendet). Hier zentral pro Route steuern,
// analog dazu wie BottomNav bereits pro Seite gesteuert wird.
const HIDDEN_ON = [/\/entwurf$/]

export function AppFooter() {
  const path = usePathname()
  if (HIDDEN_ON.some(pattern => pattern.test(path))) return null

  return (
    <footer className="md:px-8 px-5 py-4 flex items-center justify-center gap-4 text-anthracite/25 text-xs font-semibold border-t border-anthracite/5">
      <span>© 2026 Sofortangebot</span>
      <span>·</span>
      <Link href="/agb" className="hover:text-anthracite/50 transition-colors">AGB</Link>
      <span>·</span>
      <Link href="/datenschutz" className="hover:text-anthracite/50 transition-colors">Datenschutz</Link>
      <span>·</span>
      <Link href="/impressum" className="hover:text-anthracite/50 transition-colors">Impressum</Link>
    </footer>
  )
}
