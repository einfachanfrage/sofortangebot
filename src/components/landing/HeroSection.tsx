'use client'

import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-[#F7F7F5] min-h-screen flex flex-col justify-center pt-16">
      <div className="max-w-6xl mx-auto px-5 md:px-10 w-full py-16 md:py-24">
        <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-center">

          {/* LEFT */}
          <div>
            <span className="inline-flex items-center gap-2 bg-[#F5C400]/15 text-[#8B7000] text-[13px] font-extrabold px-4 py-2 rounded-full mb-6">
              🖌 Für Malerbetriebe
            </span>

            <h1 className="font-syne font-extrabold text-[#2C2C2C] text-[34px] md:text-[50px] lg:text-[58px] leading-[1.08] tracking-tight mb-7 max-w-2xl">
              Sprich dein Aufmaß ein.{' '}
              <span className="bg-[#F5C400] px-2 rounded-xl whitespace-nowrap">Fertig gerechnet</span>, bevor du im Auto sitzt.
            </h1>

            <p className="text-[#2C2C2C]/55 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              Sofortangebot ist die Angebots-App für Maler — und sie <span className="text-[#2C2C2C] font-bold">rechnet, statt zu schätzen</span>: Wandflächen aus Umfang × Höhe, Fenster und Türen abgezogen, jeder Rechenweg zum Nachprüfen. Kurz drüberschauen, als PDF raus, Feierabend.
            </p>

            <Link
              href="/register"
              className="inline-block bg-[#F5C400] text-[#2C2C2C] font-black text-base md:text-lg px-8 py-4 rounded-2xl hover:bg-[#e6b800] active:scale-95 transition-all mb-4 shadow-lg shadow-[#F5C400]/30"
            >
              Kostenlos testen →
            </Link>
            <p className="text-[#2C2C2C]/35 text-sm font-semibold">Die ersten 5 Angebote kostenlos · Monatlich kündbar · Kein Abo-Stress</p>
          </div>

          {/* RIGHT — Sprachnachricht wird Angebot */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[340px] flex flex-col gap-3">

              {/* Sprachnachricht — wie man sie kennt */}
              <div className="bg-[#2C2C2C] rounded-3xl rounded-br-lg px-5 py-4 shadow-xl self-end w-[92%]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5C400] flex items-center justify-center shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="1" width="6" height="12" rx="3"/>
                      <path d="M5 10v2a7 7 0 0 0 14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                    </svg>
                  </div>
                  {/* Wellenform */}
                  <div className="flex items-center gap-[3px] flex-1">
                    {[4, 9, 14, 8, 16, 11, 6, 13, 9, 15, 7, 11, 5, 9, 12, 6].map((h, i) => (
                      <span key={i} className="w-[3px] rounded-full bg-white/40" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                  <span className="text-white/40 text-[11px] font-semibold shrink-0">0:19</span>
                </div>
                <p className="text-white/60 text-[13px] leading-relaxed italic">
                  „Wohnzimmer, fünf mal vier, zwei sechzig hoch, Wände und Decke streichen, ein Fenster, eine Tür."
                </p>
              </div>

              {/* Pfeil */}
              <div className="flex justify-center items-center gap-2 py-1">
                <span className="text-[#2C2C2C]/30 text-[12px] font-bold">wird zu</span>
                <span className="text-[#F5C400] text-[18px]">↓</span>
              </div>

              {/* Angebots-Karte — wie in der App */}
              <div className="bg-white rounded-3xl p-5 shadow-xl border border-[#2C2C2C]/5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[17px]">🛋</span>
                  <span className="font-syne font-extrabold text-[#2C2C2C] text-[14px]">Wohnzimmer</span>
                  <span className="ml-auto bg-[#EDFAF0] text-[#1A7A38] text-[10px] font-extrabold px-2 py-0.5 rounded-full">✓ Geprüft</span>
                </div>

                <div className="border-b border-[#2C2C2C]/6 pb-3 mb-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[#2C2C2C] text-[13px] font-bold">Wandflächen streichen</span>
                    <span className="text-[#2C2C2C] text-[13px] font-extrabold shrink-0">43,71 m²</span>
                  </div>
                  <p className="text-[#2C2C2C]/40 text-[10.5px] font-semibold mt-1">
                    = 18 lfm Umfang × 2,60 m − Fenster − Tür
                  </p>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-2.5">
                  <span className="text-[#2C2C2C]/70 text-[13px] font-bold">Deckenfläche streichen</span>
                  <span className="text-[#2C2C2C]/70 text-[13px] font-extrabold shrink-0">20,00 m²</span>
                </div>
                <div className="flex items-baseline justify-between gap-2 mb-4">
                  <span className="text-[#2C2C2C]/70 text-[13px] font-bold">Sockelleisten abkleben</span>
                  <span className="text-[#2C2C2C]/70 text-[13px] font-extrabold shrink-0">17,10 lfdm</span>
                </div>

                <div className="bg-[#F5C400]/12 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[#8B7000] text-[11px] font-extrabold tracking-wide">GERECHNET, NICHT GESCHÄTZT</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
