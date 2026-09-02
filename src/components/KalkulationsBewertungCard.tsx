'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { KalkulationsBewertung } from '@/lib/mengen/types'

const STUFE_CONFIG = {
  hoch: {
    label: 'Hohe Sicherheit',
    dot: 'bg-green-500',
    bar: 'bg-green-500',
    badge: 'bg-green-50 text-green-700 border-green-200',
    border: 'border-green-200',
  },
  mittel: {
    label: 'Mittlere Sicherheit',
    dot: 'bg-amber-400',
    bar: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'border-amber-200',
  },
  gering: {
    label: 'Geringe Sicherheit',
    dot: 'bg-orange-500',
    bar: 'bg-orange-400',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    border: 'border-orange-200',
  },
} as const

export default function KalkulationsBewertungCard({ bewertung }: { bewertung: KalkulationsBewertung }) {
  const [open, setOpen] = useState(bewertung.vertrauensstufe !== 'hoch')
  const cfg = STUFE_CONFIG[bewertung.vertrauensstufe]

  return (
    <div className={`bg-white rounded-2xl border ${cfg.border} overflow-hidden`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3"
      >
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
        <span className="flex-1 text-left">
          <span className="font-black text-anthracite text-sm">KI-Kalkulation</span>
          <span className={`ml-2 text-[11px] font-black px-2 py-0.5 rounded-full border ${cfg.badge}`}>
            {cfg.label}
          </span>
        </span>
        <ChevronRight size={16} className={`text-anthracite/30 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-anthracite/5">
          {/* Vertrauensbalken */}
          <div className="flex gap-1 mt-3">
            {(['gering', 'mittel', 'hoch'] as const).map(s => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  s === bewertung.vertrauensstufe ? cfg.bar :
                  (bewertung.vertrauensstufe === 'hoch' ||
                   (bewertung.vertrauensstufe === 'mittel' && s === 'gering'))
                    ? cfg.bar + ' opacity-30' : 'bg-anthracite/10'
                }`}
              />
            ))}
          </div>

          {/* Bewertungstext */}
          <p className="text-xs text-anthracite/60 font-semibold leading-relaxed">
            {bewertung.bewertungstext}
          </p>

          {/* Erkannte Angaben */}
          {bewertung.erkannte_angaben.length > 0 && (
            <div>
              <div className="text-[11px] font-black text-anthracite/40 uppercase tracking-wide mb-1.5">
                Erkannte Angaben
              </div>
              <div className="flex flex-col gap-1">
                {bewertung.erkannte_angaben.map((a, i) => (
                  <div key={i} className="text-xs font-semibold text-green-700">{a}</div>
                ))}
              </div>
            </div>
          )}

          {/* Fehlende Angaben */}
          {bewertung.fehlende_angaben.length > 0 && (
            <div>
              <div className="text-[11px] font-black text-anthracite/40 uppercase tracking-wide mb-1.5">
                Fehlende Angaben
              </div>
              <div className="flex flex-col gap-1">
                {bewertung.fehlende_angaben.map((a, i) => (
                  <div key={i} className="text-xs font-semibold text-orange-600">{a}</div>
                ))}
              </div>
            </div>
          )}

          {/* Annahmen */}
          {bewertung.annahmen.length > 0 && (
            <div>
              <div className="text-[11px] font-black text-anthracite/40 uppercase tracking-wide mb-1.5">
                Annahmen
              </div>
              <div className="flex flex-col gap-1">
                {bewertung.annahmen.map((a, i) => (
                  <div key={i} className="text-xs font-semibold text-amber-700">• {a}</div>
                ))}
              </div>
            </div>
          )}

          {/* Empfehlung */}
          {bewertung.empfehlung.length > 0 && (
            <div className={`rounded-xl px-3 py-2.5 ${cfg.badge} border`}>
              <div className="text-[11px] font-black uppercase tracking-wide mb-1 opacity-60">
                Empfehlung
              </div>
              <div className="flex flex-col gap-1">
                {bewertung.empfehlung.map((e, i) => (
                  <div key={i} className="text-xs font-semibold">→ {e}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
