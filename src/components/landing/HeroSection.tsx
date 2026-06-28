'use client'

import Link from 'next/link'
import { SketchIcon } from './SketchIcon'

/* Einzelne Tool-Skizzen — dezent im Hintergrund verteilt */
const toolFarbrolle = [
  { type: 'line' as const, x1: 52, y1: 18, x2: 72, y2: 58 },
  { type: 'line' as const, x1: 12, y1: 16, x2: 52, y2: 16 },
  { type: 'line' as const, x1: 12, y1: 16, x2: 12, y2: 32 },
  { type: 'rect' as const, x: 4, y: 32, w: 44, h: 18 },
]

const toolHammer = [
  { type: 'line' as const, x1: 44, y1: 26, x2: 66, y2: 72 },
  { type: 'line' as const, x1: 6, y1: 6, x2: 48, y2: 6 },
  { type: 'line' as const, x1: 10, y1: 30, x2: 50, y2: 30 },
  { type: 'line' as const, x1: 6, y1: 6, x2: 10, y2: 30 },
  { type: 'line' as const, x1: 48, y1: 6, x2: 52, y2: 18 },
  { type: 'line' as const, x1: 52, y1: 18, x2: 50, y2: 30 },
]

const toolBohrmaschine = [
  { type: 'rect' as const, x: 6, y: 16, w: 46, h: 24 },
  { type: 'line' as const, x1: 40, y1: 40, x2: 36, y2: 64 },
  { type: 'line' as const, x1: 52, y1: 40, x2: 48, y2: 64 },
  { type: 'line' as const, x1: 36, y1: 64, x2: 48, y2: 64 },
  { type: 'line' as const, x1: 52, y1: 28, x2: 76, y2: 28 },
  { type: 'rect' as const, x: 46, y: 22, w: 8, h: 10 },
]

export function HeroSection() {
  return (
    <section className="bg-[#2C2C2C] min-h-screen flex flex-col justify-center pt-16 relative overflow-hidden">
      {/* Background floor plan sketch */}
      <svg
        viewBox="0 0 900 600"
        fill="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.05 }}
        aria-hidden="true"
      >
        <rect x="80" y="60" width="380" height="260" stroke="white" strokeWidth="2"/>
        <rect x="80" y="340" width="180" height="180" stroke="white" strokeWidth="2"/>
        <rect x="280" y="340" width="180" height="120" stroke="white" strokeWidth="2"/>
        <rect x="480" y="60" width="340" height="200" stroke="white" strokeWidth="2"/>
        <rect x="480" y="280" width="200" height="240" stroke="white" strokeWidth="2"/>
        <line x1="260" y1="60" x2="260" y2="320" stroke="white" strokeWidth="1.5"/>
        <line x1="80" y1="200" x2="260" y2="200" stroke="white" strokeWidth="1.5"/>
        <path d="M 260 120 A 40 40 0 0 1 300 120" stroke="white" strokeWidth="1"/>
        <line x1="130" y1="60" x2="210" y2="60" stroke="white" strokeWidth="2.5"/>
        <line x1="530" y1="60" x2="640" y2="60" stroke="white" strokeWidth="2.5"/>
        <line x1="80" y1="30" x2="460" y2="30" stroke="white" strokeWidth="1"/>
        <line x1="80" y1="24" x2="80" y2="36" stroke="white" strokeWidth="1"/>
        <line x1="460" y1="24" x2="460" y2="36" stroke="white" strokeWidth="1"/>
      </svg>

      {/* Farbrolle — oben links, sehr dezent */}
      <div className="absolute top-24 left-4 md:left-12 opacity-[0.12] pointer-events-none rotate-[-12deg]">
        <SketchIcon width={72} height={68} seed={5} roughness={1.4} strokeWidth={2} color="white" shapes={toolFarbrolle} />
      </div>

      {/* Hammer — unten rechts */}
      <div className="absolute bottom-16 right-4 md:right-16 opacity-[0.10] pointer-events-none rotate-[18deg]">
        <SketchIcon width={72} height={78} seed={13} roughness={1.4} strokeWidth={2} color="white" shapes={toolHammer} />
      </div>

      {/* Bohrmaschine — unten links */}
      <div className="absolute bottom-24 left-8 md:left-24 opacity-[0.08] pointer-events-none rotate-[-8deg]">
        <SketchIcon width={82} height={72} seed={33} roughness={1.4} strokeWidth={2} color="white" shapes={toolBohrmaschine} />
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-10 w-full py-16 md:py-24 relative">
        <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-center">

          {/* LEFT */}
          <div>
            <h1 className="font-syne font-extrabold text-white text-[34px] md:text-[50px] lg:text-[60px] leading-[1.06] tracking-tight mb-7 max-w-2xl">
              Angebot fertig, noch bevor du vom{' '}
              <span className="text-[#F5C400]">Kunden losfährst.</span>
            </h1>

            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              Du sprichst dein Aufmaß ein — direkt auf der Baustelle. Sofortangebot erkennt die Positionen, rechnet alles durch und schickt ein sauberes PDF raus. Unter 10 Minuten. Kein Tippen. Kein Abend am Schreibtisch.
            </p>

            <Link
              href="/register"
              className="inline-block bg-[#F5C400] text-[#2C2C2C] font-black text-base md:text-lg px-8 py-4 hover:bg-[#e6b800] transition-colors mb-4"
            >
              Kostenlos testen →
            </Link>
            <p className="text-white/25 text-sm font-medium">Die ersten 5 Angebote kostenlos.</p>
          </div>

          {/* RIGHT — Phone Mockup, menschlicher */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-[240px] md:w-[256px]">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-[28px] px-5 pt-5 pb-6 shadow-2xl">

                {/* Statusbar */}
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-white/30 text-[10px] font-semibold tracking-wide">9:41</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-3 h-1.5 bg-white/20 rounded-sm" />
                    <div className="w-1 h-1.5 bg-white/20 rounded-sm" />
                  </div>
                </div>

                {/* Mic button — simpel, warm */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full border-2 border-[#F5C400]/60 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-[#F5C400]/20 scale-125" />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="1" width="6" height="12" rx="3"/>
                      <path d="M5 10v2a7 7 0 0 0 14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  </div>
                  <span className="text-white/35 text-[10px] font-semibold tracking-widest uppercase">läuft…</span>
                </div>

                {/* Transkript — das echte, menschliche */}
                <div className="bg-white/[0.04] rounded-xl px-4 py-3 mb-5">
                  <p className="text-white/55 text-[12px] leading-[1.7] italic">
                    „Wohnzimmer bei Herrn Müller — 4 mal 5, Höhe 2,60. Wände und Decke streichen, zwei Fenster, eine Tür…"
                  </p>
                </div>

                {/* Erkannte Positionen */}
                <div className="flex flex-col gap-2.5">
                  {[
                    { pos: 'Wandflächen',  preis: '494 €' },
                    { pos: 'Deckenfläche', preis: '170 €' },
                    { pos: 'Abkleben',     preis: '52 €'  },
                  ].map((item) => (
                    <div key={item.pos} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[#F5C400] text-[10px]">✓</span>
                        <span className="text-white/45 text-[11px]">{item.pos}</span>
                      </div>
                      <span className="text-white/70 text-[11px] font-bold">{item.preis}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/8 pt-2.5 mt-0.5 flex justify-between items-baseline">
                    <span className="text-white/25 text-[10px] uppercase tracking-wider">Gesamt</span>
                    <span className="font-syne font-black text-white text-[18px]">716 €</span>
                  </div>
                </div>

              </div>

              {/* Glow */}
              <div className="absolute -inset-6 bg-[#F5C400]/5 rounded-[56px] -z-10 blur-2xl" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
