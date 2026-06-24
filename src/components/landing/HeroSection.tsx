'use client'

import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-[#2C2C2C] min-h-screen flex flex-col justify-center pt-16">
      <div className="max-w-6xl mx-auto px-5 md:px-10 w-full py-16 md:py-24">
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

          {/* RIGHT — Phone Mockup */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-[240px] md:w-[256px]">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-[28px] p-5 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-5 px-1">
                  <span className="text-white/25 text-[10px] font-semibold">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 bg-white/15 rounded-sm" />
                    <div className="w-1 h-1.5 bg-white/15 rounded-sm" />
                  </div>
                </div>

                <div className="min-h-[300px] relative">
                  {/* Step 1: Recording */}
                  <div className="phone-step phone-step-1">
                    <div className="flex justify-center mb-5">
                      <div className="w-12 h-12 border border-[#F5C400]/50 rounded-full flex items-center justify-center phone-pulse">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-white/25 text-[9px] font-black uppercase tracking-widest text-center mb-3">Aufnahme läuft</div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/55 text-[11px] leading-relaxed">
                        &ldquo;Beim Müller Wohnzimmer streichen, 4 mal 5 Meter, 2,60 hoch, Decke auch...&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="phone-step phone-step-2 absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex gap-2 mb-4">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-[#F5C400] rounded-full phone-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                    <div className="text-white/25 text-[9px] font-black uppercase tracking-widest">KI erkennt Positionen</div>
                  </div>

                  {/* Step 3: Results */}
                  <div className="phone-step phone-step-3 absolute inset-0">
                    <div className="text-white/25 text-[9px] font-black uppercase tracking-widest mb-3">Erkannt</div>
                    {[
                      { label: 'Wandflächen streichen', price: '494,00 €', delay: '0s' },
                      { label: 'Deckenfläche streichen', price: '170,00 €', delay: '0.3s' },
                      { label: 'Boden schützen', price: '52,00 €', delay: '0.6s' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="phone-result flex items-center justify-between py-2.5 border-b border-white/5"
                        style={{ animationDelay: item.delay }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#F5C400] text-xs font-bold">✓</span>
                          <span className="text-white/55 text-[11px]">{item.label}</span>
                        </div>
                        <span className="text-white text-[11px] font-bold">{item.price}</span>
                      </div>
                    ))}
                    <div className="text-right mt-3">
                      <div className="text-white/25 text-[9px] uppercase tracking-wider">Gesamt</div>
                      <div className="font-syne font-black text-white text-lg">840,00 €</div>
                    </div>
                  </div>

                  {/* Step 4: Send */}
                  <div className="phone-step phone-step-4 absolute inset-0 flex flex-col justify-end pb-1">
                    <div className="phone-send bg-[#F5C400] text-[#2C2C2C] font-black text-[12px] py-3 text-center">
                      PDF versenden →
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -inset-6 bg-[#F5C400]/5 rounded-[56px] -z-10 blur-2xl" />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .phone-step { opacity: 0; }
        .phone-step-1 { animation: pFade 8s infinite; animation-delay: 0s; }
        .phone-step-2 { animation: pFade 8s infinite; animation-delay: 3s; }
        .phone-step-3 { animation: pFade 8s infinite; animation-delay: 5s; }
        .phone-step-4 { animation: pFade 8s infinite; animation-delay: 5s; }
        @keyframes pFade {
          0%  { opacity: 0; } 5% { opacity: 1; } 20% { opacity: 1; } 30% { opacity: 0; } 100% { opacity: 0; }
        }
        .phone-pulse { animation: ringPulse 2s ease-in-out infinite; }
        @keyframes ringPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(245,196,0,0.3); }
          50%      { box-shadow: 0 0 0 10px rgba(245,196,0,0); }
        }
        .phone-dot { animation: dotBounce 1s ease-in-out infinite; }
        @keyframes dotBounce {
          0%,80%,100% { transform: scale(0.5); opacity: 0.3; }
          40%          { transform: scale(1); opacity: 1; }
        }
        .phone-result { opacity: 0; animation: slideIn 0.4s ease forwards; }
        @keyframes slideIn { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }
        .phone-send { opacity: 0; animation: fadeInBtn 0.5s ease 0.9s forwards; }
        @keyframes fadeInBtn { to { opacity: 1; } }
      `}</style>
    </section>
  )
}
