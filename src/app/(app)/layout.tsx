import SideNav from '@/components/SideNav'
import { AgbUpdateModal } from '@/components/AgbUpdateModal'
import { RestoreBanner } from '@/components/RestoreBanner'
import { AppFooter } from '@/components/AppFooter'

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
        <AppFooter />
      </div>
    </div>
  )
}
