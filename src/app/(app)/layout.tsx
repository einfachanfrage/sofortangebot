import SideNav from '@/components/SideNav'
import Link from 'next/link'
import { AgbUpdateModal } from '@/components/AgbUpdateModal'
import { RestoreBanner } from '@/components/RestoreBanner'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg">
      <SideNav />
      <AgbUpdateModal />
      <RestoreBanner />
      <div className="md:ml-[220px] flex flex-col min-h-dvh">
        <main className="flex-1">
          {children}
        </main>
        <footer className="md:px-8 px-5 py-4 flex items-center justify-center gap-4 text-anthracite/25 text-xs font-semibold border-t border-anthracite/5">
          <span>© 2026 Sofortangebot</span>
          <span>·</span>
          <Link href="/agb" className="hover:text-anthracite/50 transition-colors">AGB</Link>
          <span>·</span>
          <Link href="/datenschutz" className="hover:text-anthracite/50 transition-colors">Datenschutz</Link>
          <span>·</span>
          <Link href="/impressum" className="hover:text-anthracite/50 transition-colors">Impressum</Link>
        </footer>
      </div>
    </div>
  )
}
