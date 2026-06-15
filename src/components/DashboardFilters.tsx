'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Search } from 'lucide-react'

const STATUS_TABS = [
  { key: '', label: 'Alle' },
  { key: 'in_bearbeitung', label: 'In Bearbeitung' },
  { key: 'sent', label: 'Offen' },
  { key: 'accepted', label: 'Beauftragt' },
  { key: 'rejected', label: 'Abgelehnt' },
]

interface DashboardFiltersProps {
  inBearbeitungCount?: number
}

export default function DashboardFilters({ inBearbeitungCount = 0 }: DashboardFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const status = searchParams.get('status') ?? ''

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return (
    <div className="flex flex-col gap-3">
      {/* Suchfeld */}
      <div className="relative md:max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C2C2C]/30" strokeWidth={2.5} />
        <input
          type="search"
          placeholder="Kunde suchen..."
          defaultValue={q}
          onChange={e => update('q', e.target.value)}
          className="w-full bg-white border border-[#2C2C2C]/10 rounded-xl pl-9 pr-4 py-2.5 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:border-[#F5C400]"
        />
      </div>

      {/* Status-Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
        {STATUS_TABS.map(tab => {
          const isActive = status === tab.key
          const showBadge = tab.key === 'in_bearbeitung' && inBearbeitungCount > 0
          return (
            <button
              key={tab.key}
              onClick={() => update('status', tab.key)}
              className={`shrink-0 text-xs font-black px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#2C2C2C] text-white'
                  : 'bg-white border border-[#2C2C2C]/10 text-[#2C2C2C]/60'
              }`}
            >
              {tab.label}
              {showBadge && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                  isActive ? 'bg-[#F5C400] text-[#2C2C2C]' : 'bg-[#F5C400]/20 text-[#8B7000]'
                }`}>
                  {inBearbeitungCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
