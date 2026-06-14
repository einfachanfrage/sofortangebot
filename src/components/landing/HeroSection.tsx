'use client'

import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-[#2C2C2C] min-h-screen flex flex-col justify-center pt-16">
      <div className="max-w-6xl mx-auto px-5 md:px-10 w-full py-16 md:py-24">
        <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-center">

          {/* LEFT — Text */}
          <div>
            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['🎙 Spracheingabe', '📄 PDF sofort', '✍️ Digital unterschreiben'].map(chip => (
                <span key={chip} className="border border-[#F5C400]/40 text-[#F5C400] text-xs font-semibold px-3 py-1.5 rounded-full">
                  {chip}
                </span>
              ))}
            </div>

            <h1 className="font-syne font-black text-white text-[2.4rem] md:text-[3.8rem] leading-[1.05] tracking-tight mb-6">
              Angebot fertig,<br />
              bevor du beim<br />
              <span className="text-[#F5C400]">Kunden weg bist.</span>
            </h1>

            <p className="text-[#AAAAAA] text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-md">
              Einfach eingesprochen.<br />
              KI erkennt alles.<br />
              PDF verschickt.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link
                href="/register"
                className="bg-[#F5C400] text-[#2C2C2C] font-black text-lg px-8 py-4 text-center hover:bg-[#e6b800] transition-colors"
              >
                Jetzt kostenlos testen →
              </Link>
            </div>
            <p className="text-white/30 text-sm font-medium">Keine Kreditkarte · Kein Abo-Zwang</p>
          </div>

          {/* RIGHT — Phone Animation */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-[260px] md:w-[280px]">
              {/* Phone frame */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-[32px] p-6 shadow-2xl overflow-hidden">
                {/* Status bar */}
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-white/30 text-[10px] font-semibold">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 bg-white/30 rounded-sm" />
                    <div className="w-1 h-1.5 bg-white/30 rounded-sm" />
                  </div>
                </div>

                {/* App content */}
                <div className="min-h-[320px] relative">
                  {/* Step 1: Mic pulsing + typing */}
                  <div className="phone-step phone-step-1">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 bg-[#F5C400]/10 border-2 border-[#F5C400] rounded-full flex items-center justify-center phone-pulse">
                        <span className="text-2xl">🎙</span>
                      </div>
                    </div>
                    <div className="text-white/50 text-xs font-semibold text-center mb-3">Aufnahme läuft...</div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-white/70 text-xs leading-relaxed phone-type">
                        &ldquo;Beim Müller Bad fliesen, Boden 6qm, Wände 12qm, Altbelag muss raus...&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Loading */}
                  <div className="phone-step phone-step-2 absolute inset-0">
                    <div className="flex justify-center mb-6 mt-8">
                      <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-2 h-2 bg-[#F5C400] rounded-full phone-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                    <div className="text-white/40 text-xs font-semibold text-center">KI erkennt Positionen...</div>
                  </div>

                  {/* Step 3: Results */}
                  <div className="phone-step phone-step-3 absolute inset-0">
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-wider mb-3">Erkannt:</div>
                    {[
                      { label: 'Bodenfliesen 6 m²', price: '228,00 €', delay: '0s' },
                      { label: 'Wandfliesen 12 m²', price: '504,00 €', delay: '0.3s' },
                      { label: 'Altbelag entfernen', price: '108,00 €', delay: '0.6s' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="phone-result flex items-center justify-between py-2.5 border-b border-white/5"
                        style={{ animationDelay: item.delay }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#F5C400] text-sm">✓</span>
                          <span className="text-white/70 text-xs font-semibold">{item.label}</span>
                        </div>
                        <span className="text-white font-black text-xs">{item.price}</span>
                      </div>
                    ))}
                    <div className="text-right mt-2">
                      <div className="text-white/30 text-[10px]">Gesamt</div>
                      <div className="font-syne font-black text-white text-lg">840,00 €</div>
                    </div>
                  </div>

                  {/* Step 4: Send button */}
                  <div className="phone-step phone-step-4 absolute inset-0 flex flex-col justify-end pb-2">
                    <div className="phone-send bg-[#F5C400] text-[#2C2C2C] font-black text-sm py-3 text-center rounded-lg">
                      PDF versenden →
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-[#F5C400]/5 rounded-[48px] -z-10 blur-xl" />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .phone-step { opacity: 0; }

        /* Step 1: 0-3s */
        .phone-step-1 {
          animation: fadeInOut 8s infinite;
          animation-delay: 0s;
        }
        /* Step 2: 3-5s */
        .phone-step-2 {
          animation: fadeInOut 8s infinite;
          animation-delay: 3s;
        }
        /* Step 3: 5-7s */
        .phone-step-3 {
          animation: fadeInOut 8s infinite;
          animation-delay: 5s;
        }
        /* Step 4: overlaps step 3 */
        .phone-step-4 {
          animation: fadeInOut 8s infinite;
          animation-delay: 5s;
        }

        @keyframes fadeInOut {
          0%   { opacity: 0; }
          5%   { opacity: 1; }
          20%  { opacity: 1; }
          30%  { opacity: 0; }
          100% { opacity: 0; }
        }

        .phone-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 196, 0, 0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(245, 196, 0, 0); }
        }

        .phone-dot {
          animation: dot-bounce 1s ease-in-out infinite;
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1); opacity: 1; }
        }

        .phone-result {
          opacity: 0;
          animation: slideIn 0.4s ease forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .phone-send {
          opacity: 0;
          animation: fadeInBtn 0.5s ease 0.9s forwards;
        }
        @keyframes fadeInBtn {
          to { opacity: 1; }
        }
      `}</style>
    </section>
  )
}
