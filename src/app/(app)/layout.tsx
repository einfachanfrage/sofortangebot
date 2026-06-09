import SideNav from '@/components/SideNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <SideNav />
      <div className="md:ml-60">
        {children}
      </div>
    </div>
  )
}
