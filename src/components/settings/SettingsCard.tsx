import type { ReactNode } from 'react'

export function SettingsCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-anthracite/5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-anthracite/5 rounded-lg flex items-center justify-center text-anthracite/50">{icon}</div>
        <div className="font-black text-anthracite">{title}</div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

export function SettingsField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-black text-anthracite/40 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
