'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Search } from 'lucide-react'

interface DashboardFiltersProps {
  entwurfCount: number
  openCount: number
  acceptedCount: number
  rejectedCount: number
  archivCount?: number
}

const PILLS = [
  { key: '',           label: 'Alle',           hasCount: false },
  { key: 'entwurf',    label: 'In Bearbeitung', hasCount: true  },
  { key: 'offen',      label: 'Offen',          hasCount: true  },
  { key: 'beauftragt', label: 'Beauftragt',     hasCount: true  },
  { key: 'abgelehnt',  label: 'Abgelehnt',      hasCount: true  },
  { key: 'archived',   label: 'Archiv',         hasCount: true  },
]

export default function DashboardFilters({
  entwurfCount,
  openCount,
  acceptedCount,
  rejectedCount,
  archivCount = 0,
}: DashboardFiltersProps) {
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

  const getCount = (key: string): number | null => {
    if (key === 'entwurf')    return entwurfCount
    if (key === 'offen')      return openCount
    if (key === 'beauftragt') return acceptedCount
    if (key === 'abgelehnt')  return rejectedCount
    if (key === 'archived')   return archivCount
    return null
  }

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

      {/* Status-Pills */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
        {PILLS.map(pill => {
          const isActive = status === pill.key
          const count = getCount(pill.key)
          return (
            <button
              key={pill.key}
              onClick={() => update('status', pill.key)}
              className={`shrink-0 text-xs font-black px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#2C2C2C] text-white'
                  : 'bg-white border border-[#2C2C2C]/10 text-[#2C2C2C]/60'
              }`}
            >
              {pill.label}
              {pill.hasCount && count !== null && count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                  isActive ? 'bg-[#F5C400] text-[#2C2C2C]' : 'bg-[#F5C400]/20 text-[#8B7000]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
