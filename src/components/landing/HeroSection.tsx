'use client'

import Link from 'next/link'
import { SketchIcon } from './SketchIcon'

const tools = [
  {
    label: 'Farbrolle',
    w: 96, h: 88,
    seed: 5,
    shapes: [
      // handle — diagonal stick
      { type: 'line' as const, x1: 62, y1: 20, x2: 88, y2: 68 },
      // roller arm — L-shape top
      { type: 'line' as const, x1: 14, y1: 18, x2: 62, y2: 18 },
      { type: 'line' as const, x1: 14, y1: 18, x2: 14, y2: 38 },
      // roller body
      { type: 'rect' as const, x: 6, y: 38, w: 56, h: 22 },
      // tray hint
      { type: 'line' as const, x1: 6, y1: 64, x2: 62, y2: 64 },
    ],
  },
  {
    label: 'Hammer',
    w: 88, h: 96,
    seed: 13,
    shapes: [
      // handle
      { type: 'line' as const, x1: 52, y1: 30, x2: 80, y2: 88 },
      // head top face
      { type: 'line' as const, x1: 8, y1: 8, x2: 56, y2: 8 },
      // head bottom face
      { type: 'line' as const, x1: 14, y1: 36, x2: 58, y2: 36 },
      // head left
      { type: 'line' as const, x1: 8, y1: 8, x2: 14, y2: 36 },
      // head right (claw split)
      { type: 'line' as const, x1: 56, y1: 8, x2: 62, y2: 24 },
      { type: 'line' as const, x1: 62, y1: 24, x2: 58, y2: 36 },
    ],
  },
  {
    label: 'Schraubenschlüssel',
    w: 96, h: 96,
    seed: 21,
    shapes: [
      // handle — long diagonal
      { type: 'line' as const, x1: 52, y1: 42, x2: 88, y2: 88 },
      // jaw opening top arc
      { type: 'arc' as const, cx: 28, cy: 28, r: 20, start: Math.PI * 0.9, stop: Math.PI * 2.1 },
      // jaw left cheek
      { type: 'line' as const, x1: 10, y1: 42, x2: 52, y2: 42 },
      // jaw right cheek
      { type: 'line' as const, x1: 10, y1: 14, x2: 52, y2: 14 },
      // inner notch hint
      { type: 'line' as const, x1: 28, y1: 8, x2: 28, y2: 18 },
    ],
  },
  {
    label: 'Bohrmaschine',
    w: 96, h: 88,
    seed: 33,
    shapes: [
      // main body
      { type: 'rect' as const, x: 8, y: 18, w: 54, h: 28 },
      // handle going down
      { type: 'line' as const, x1: 48, y1: 46, x2: 42, y2: 74 },
      { type: 'line' as const, x1: 62, y1: 46, x2: 56, y2: 74 },
      { type: 'line' as const, x1: 42, y1: 74, x2: 56, y2: 74 },
      // drill bit
      { type: 'line' as const, x1: 62, y1: 32, x2: 90, y2: 32 },
      // chuck
      { type: 'rect' as const, x: 56, y: 26, w: 10, h: 12 },
      // trigger
      { type: 'arc' as const, cx: 54, cy: 54, r: 6, start: 0, stop: Math.PI * 0.7 },
    ],
  },
]

export function HeroSection() {
  return (
    <section className="bg-[#2C2C2C] min-h-screen flex flex-col justify-center pt-16 relative overflow-hidden">
      {/* Background floor plan sketch */}
      <svg
        viewBox="0 0 900 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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

          {/* RIGHT — hand-sketched tools */}
          <div className="flex justify-center md:justify-end">
            <div className="grid grid-cols-2 gap-8 md:gap-10">
              {tools.map((t) => (
                <div key={t.label} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <SketchIcon
                    width={t.w}
                    height={t.h}
                    seed={t.seed}
                    roughness={1.5}
                    strokeWidth={2.4}
                    color="white"
                    shapes={t.shapes}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
