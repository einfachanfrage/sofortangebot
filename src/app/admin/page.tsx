'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Users, FileText, Euro, Crown, Zap } from 'lucide-react'

interface Stats {
  totalUsers: number
  proUsers: number
  starterUsers: number
  newUsersThisMonth: number
  totalQuotes: number
  quotesThisMonth: number
  mrr: number
  arr: number
  signupsPerMonth: { label: string; signups: number }[]
  quotesPerMonth: { label: string; quotes: number }[]
  revenuePerMonth: { label: string; revenue: number }[]
  recentUsers: {
    id: string
    name: string
    plan: string
    gewerke: string[]
    created_at: string
    hasStripe: boolean
  }[]
}

function fmt(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="w-full bg-[#2C2C2C]/5 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => {
        if (r.status === 403) { router.replace('/dashboard'); return Promise.reject('forbidden') }
        if (!r.ok) return Promise.reject(r.status)
        return r.json()
      })
      .then(setStats)
      .catch(e => { if (e !== 'forbidden') setError('Laden fehlgeschlagen') })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex items-center justify-center">
        <div className="text-[#2C2C2C]/40 font-semibold animate-pulse">Lädt...</div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex items-center justify-center px-5">
        <div className="text-red-600 font-semibold">{error || 'Kein Zugriff'}</div>
      </div>
    )
  }

  const maxSignups = Math.max(...stats.signupsPerMonth.map(m => m.signups), 1)
  const maxQuotes = Math.max(...stats.quotesPerMonth.map(m => m.quotes), 1)

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-16">
      {/* Header */}
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6">
        <div className="text-[#F5C400] text-xs font-black uppercase tracking-widest mb-1">Admin</div>
        <div className="text-white font-black text-2xl">sofortangebot</div>
        <div className="text-white/40 font-semibold text-sm mt-0.5">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-5">

        {/* MRR + ARR — Hauptzahlen */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#2C2C2C] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Euro size={14} color="#F5C400" strokeWidth={2.5} />
              <span className="text-[#F5C400] text-xs font-black uppercase tracking-wide">MRR</span>
            </div>
            <div className="text-white font-black text-3xl">{fmt(stats.mrr)}</div>
            <div className="text-white/40 text-xs font-semibold mt-1">monatlich wiederkehrend</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} color="#2C2C2C" strokeWidth={2.5} className="opacity-40" />
              <span className="text-[#2C2C2C]/40 text-xs font-black uppercase tracking-wide">ARR</span>
            </div>
            <div className="text-[#2C2C2C] font-black text-3xl">{fmt(stats.arr)}</div>
            <div className="text-[#2C2C2C]/40 text-xs font-semibold mt-1">jährlich hochgerechnet</div>
          </div>
        </div>

        {/* Kern-Metriken */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Users size={16} strokeWidth={2.5} />}
            label="Nutzer gesamt"
            value={stats.totalUsers}
            sub={`+${stats.newUsersThisMonth} diesen Monat`}
            highlight={stats.newUsersThisMonth > 0}
          />
          <StatCard
            icon={<FileText size={16} strokeWidth={2.5} />}
            label="Angebote gesamt"
            value={stats.totalQuotes}
            sub={`${stats.quotesThisMonth} diesen Monat`}
          />
          <StatCard
            icon={<Crown size={16} strokeWidth={2.5} color="#F5C400" />}
            label="Pro-User"
            value={stats.proUsers}
            sub={stats.totalUsers > 0 ? `${Math.round((stats.proUsers / stats.totalUsers) * 100)}% Conversion` : '—'}
            highlight={stats.proUsers > 0}
          />
          <StatCard
            icon={<Zap size={16} strokeWidth={2.5} />}
            label="Starter-User"
            value={stats.starterUsers}
            sub="kostenlos"
          />
        </div>

        {/* Signups letzte 6 Monate */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="font-black text-[#2C2C2C] mb-4">Neue Nutzer — letzte 6 Monate</div>
          <div className="flex items-end gap-2 h-20">
            {stats.signupsPerMonth.map((m, i) => {
              const pct = maxSignups > 0 ? (m.signups / maxSignups) * 100 : 0
              const isLast = i === stats.signupsPerMonth.length - 1
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs font-black text-[#2C2C2C]">{m.signups || ''}</div>
                  <div className="w-full flex items-end" style={{ height: 52 }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${isLast ? 'bg-[#F5C400]' : 'bg-[#2C2C2C]/15'}`}
                      style={{ height: `${Math.max(pct, m.signups > 0 ? 8 : 2)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#2C2C2C]/40 font-semibold">{m.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Angebote letzte 6 Monate */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="font-black text-[#2C2C2C] mb-4">Erstellte Angebote — letzte 6 Monate</div>
          <div className="flex items-end gap-2">
            {stats.quotesPerMonth.map((m, i) => {
              const pct = maxQuotes > 0 ? (m.quotes / maxQuotes) * 100 : 0
              const isLast = i === stats.quotesPerMonth.length - 1
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs font-black text-[#2C2C2C]">{m.quotes || ''}</div>
                  <div className="w-full flex items-end" style={{ height: 52 }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${isLast ? 'bg-[#F5C400]' : 'bg-[#2C2C2C]/15'}`}
                      style={{ height: `${Math.max(pct, m.quotes > 0 ? 8 : 2)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#2C2C2C]/40 font-semibold">{m.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Plan-Verteilung */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="font-black text-[#2C2C2C] mb-3">Plan-Verteilung</div>
          <div className="flex gap-3 mb-3">
            <div className="flex-1 bg-[#F5C400]/10 rounded-xl p-3 text-center">
              <div className="font-black text-2xl text-[#2C2C2C]">{stats.proUsers}</div>
              <div className="text-xs font-bold text-[#2C2C2C]/60 flex items-center justify-center gap-1 mt-0.5">
                <Crown size={10} color="#F5C400" /> Pro
              </div>
            </div>
            <div className="flex-1 bg-[#2C2C2C]/5 rounded-xl p-3 text-center">
              <div className="font-black text-2xl text-[#2C2C2C]">{stats.starterUsers}</div>
              <div className="text-xs font-bold text-[#2C2C2C]/60 mt-0.5">Starter</div>
            </div>
          </div>
          {/* Balken */}
          {stats.totalUsers > 0 && (
            <div className="h-3 bg-[#2C2C2C]/5 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#F5C400] rounded-l-full transition-all"
                style={{ width: `${(stats.proUsers / stats.totalUsers) * 100}%` }}
              />
              <div className="h-full bg-[#2C2C2C]/20 flex-1" />
            </div>
          )}
          {stats.totalUsers > 0 && (
            <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-2 text-center">
              {Math.round((stats.proUsers / stats.totalUsers) * 100)}% Conversion Starter → Pro
            </div>
          )}
        </div>

        {/* Letzte Registrierungen */}
        <div className="bg-white rounded-2xl border border-[#2C2C2C]/5">
          <div className="px-4 pt-4 pb-3 font-black text-[#2C2C2C]">Letzte Registrierungen</div>
          {stats.recentUsers.length === 0 && (
            <div className="px-4 pb-4 text-sm text-[#2C2C2C]/40 font-semibold">Noch keine Nutzer</div>
          )}
          {stats.recentUsers.map((u, i) => (
            <div key={u.id} className={`px-4 py-3 flex items-center gap-3 ${i > 0 ? 'border-t border-[#2C2C2C]/5' : ''}`}>
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                u.plan === 'pro' ? 'bg-[#F5C400] text-[#2C2C2C]' : 'bg-[#2C2C2C]/10 text-[#2C2C2C]'
              }`}>
                {(u.name || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-[#2C2C2C] text-sm truncate">{u.name}</div>
                <div className="text-xs text-[#2C2C2C]/40 font-semibold">
                  {u.gewerke.length > 0 ? u.gewerke.join(', ') : 'Kein Gewerk'}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  u.plan === 'pro' ? 'bg-[#F5C400] text-[#2C2C2C]' : 'bg-[#2C2C2C]/10 text-[#2C2C2C]/60'
                }`}>
                  {u.plan === 'pro' ? '★ Pro' : 'Starter'}
                </span>
                <span className="text-[10px] text-[#2C2C2C]/30 font-semibold">{fmtDate(u.created_at)}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, highlight }: {
  icon: React.ReactNode
  label: string
  value: number
  sub: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-2xl p-4 border ${highlight ? 'bg-[#F5C400]/5 border-[#F5C400]/30' : 'bg-white border-[#2C2C2C]/5'}`}>
      <div className="flex items-center gap-2 mb-1 text-[#2C2C2C]/40">
        {icon}
        <span className="text-xs font-black uppercase tracking-wide">{label}</span>
      </div>
      <div className="font-black text-3xl text-[#2C2C2C]">{value}</div>
      <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1">{sub}</div>
    </div>
  )
}
