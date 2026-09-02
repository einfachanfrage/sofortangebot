'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export const BEISPIEL_CARDS = [
  {
    gewerk_id: 'maler',
    emoji: '🖌',
    label: 'Maler',
    text: 'Beim Müller soll ich das Wohnzimmer und Schlafzimmer streichen. Wohnzimmer ist 5 mal 4 Meter, 2,60 hoch, 2 Fenster. Schlafzimmer 4 mal 3,50 Meter, 1 Fenster, 1 Tür. Alles weiß, zweimal Anstrich.',
  },
  {
    gewerk_id: 'fliesen',
    emoji: '🪟',
    label: 'Fliesen',
    text: 'Bei Schmidt soll das Bad neu gefliest werden. Boden 6 Quadratmeter, Wände bis 1,50 Meter hoch, rund 12 Quadratmeter. Alte Fliesen müssen vorher runter. Dusche bodengleich.',
  },
  {
    gewerk_id: 'elektro',
    emoji: '⚡',
    label: 'Elektro',
    text: 'Bei Meyer Küche neu machen. 12 Steckdosen, 4 Lichtschalter, 6 Einbauspots, Herdanschluss und eine Wallbox in der Garage dazu.',
  },
  {
    gewerk_id: 'sanitaer_heizung',
    emoji: '🚿',
    label: 'Sanitär',
    text: 'Bad komplett erneuern bei Familie Weber. WC, Waschtisch, Dusche neu, alle Armaturen tauschen. Rohre wenn möglich auch erneuern, ca. 8 Meter.',
  },
  {
    gewerk_id: 'trockenbau',
    emoji: '🧱',
    label: 'Trockenbau',
    text: 'Bei Hoffmann eine Trennwand einziehen, 4 Meter lang, 2,60 hoch, mit Dämmung. Dazu Decke im Wohnzimmer absenken, 5 mal 4 Meter.',
  },
]

const STORAGE_KEY = 'aufnahme_hinweis_count'

export function getHinweisCount(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
}

export function incrementHinweisCount(): void {
  const count = getHinweisCount()
  localStorage.setItem(STORAGE_KEY, String(count + 1))
}

interface Props {
  open: boolean
  onClose: () => void
  schliessbar: boolean
  gewerk?: string
}

export default function AufnahmeHinweisSheet({ open, onClose, schliessbar, gewerk }: Props) {
  const startIdx = BEISPIEL_CARDS.findIndex(c => c.gewerk_id === gewerk)
  const [activeIdx, setActiveIdx] = useState(startIdx >= 0 ? startIdx : 0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sync scroll position when activeIdx changes via dots
  useEffect(() => {
    if (!scrollRef.current) return
    const child = scrollRef.current.children[activeIdx] as HTMLElement
    if (child) {
      scrollRef.current.scrollTo({ left: child.offsetLeft - 20, behavior: 'smooth' })
    }
  }, [activeIdx])

  // Track scroll to update dots
  function handleScroll() {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const cardW = el.scrollWidth / BEISPIEL_CARDS.length
    const idx = Math.round(el.scrollLeft / cardW)
    setActiveIdx(Math.max(0, Math.min(BEISPIEL_CARDS.length - 1, idx)))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={schliessbar ? onClose : undefined} />

      {/* Sheet */}
      <div className="relative bg-anthracite rounded-t-3xl flex flex-col" style={{ height: '60vh', maxHeight: 600 }}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-2 shrink-0">
          <div>
            <div className="font-syne font-bold text-white" style={{ fontSize: 20 }}>So geht&apos;s am besten:</div>
            <div className="text-[#AAAAAA] mt-1 leading-relaxed" style={{ fontSize: 14 }}>
              Sprich einfach wie du es einem<br />Kollegen erklären würdest.
            </div>
          </div>
          {schliessbar && (
            <button onClick={onClose} className="p-1.5 mt-0.5 shrink-0">
              <X size={20} color="white" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Cards carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto px-5 pb-3 pt-1 shrink-0"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          {BEISPIEL_CARDS.map((card, i) => (
            <div
              key={card.gewerk_id}
              onClick={() => setActiveIdx(i)}
              className="shrink-0 rounded-2xl p-4 cursor-pointer transition-colors"
              style={{
                width: 260,
                scrollSnapAlign: 'start',
                background: i === activeIdx ? 'var(--color-yellow)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className={`font-black text-sm mb-2 ${i === activeIdx ? 'text-anthracite' : 'text-white'}`}>
                {card.emoji} {card.label}
              </div>
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: i === activeIdx ? 'var(--color-anthracite)' : 'rgba(255,255,255,0.6)', fontSize: 13 }}
              >
                &ldquo;{card.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 py-2 shrink-0">
          {BEISPIEL_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="rounded-full transition-all"
              style={{
                width: i === activeIdx ? 16 : 6,
                height: 6,
                background: i === activeIdx ? 'var(--color-yellow)' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        {/* Tipp-Box */}
        <div className="mx-5 rounded-xl px-4 py-3 mb-4 shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <p className="text-white/70 font-semibold leading-relaxed" style={{ fontSize: 13 }}>
            💡 Tipp: Maße direkt mit nennen — &lsquo;fünf mal vier Meter&rsquo; reicht.
            Je mehr du sagst, desto genauer wird das Angebot.
          </p>
        </div>

        {/* CTA */}
        <div className="px-5 pb-8 shrink-0 mt-auto">
          <button
            onClick={schliessbar ? onClose : undefined}
            disabled={!schliessbar}
            className="w-full bg-yellow text-anthracite font-black rounded-2xl py-4 text-base disabled:opacity-50"
          >
            Verstanden — los geht&apos;s 🎙
          </button>
          <p className="text-center mt-2.5" style={{ color: '#666666', fontSize: 13 }}>
            Kein perfekter Satz nötig. Einfach drauflos.
          </p>
        </div>
      </div>
    </div>
  )
}
