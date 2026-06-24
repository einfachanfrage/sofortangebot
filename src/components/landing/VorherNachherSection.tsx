'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function VorherNachherSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid md:grid-cols-2 gap-0 md:gap-8"
        >
          {/* VORHER */}
          <motion.div variants={fadeUp} className="md:order-1 border border-[#E5E5E5] bg-white p-8 md:p-10">
            <div className="flex items-center gap-3 mb-1">
              {/* Pencil with eraser icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
                <line x1="2" y1="22" x2="6" y2="22" strokeWidth="2"/>
              </svg>
              <span className="text-red-400 text-[13px] font-extrabold font-syne tracking-widest uppercase">22:47 Uhr</span>
            </div>
            <div className="font-syne font-extrabold text-[#2C2C2C] text-[22px] md:text-[26px] tracking-tight mb-8">Ohne Sofortangebot</div>
            <div className="flex flex-col gap-5">
              {[
                'Laptop aufgeklappt, Kaffee kalt',
                'Preisliste suchen, Seite 14...',
                'Alles eintippen, Position für Position',
                'Nochmal korrigieren weil Tippfehler',
              ].map((t) => (
                <div key={t} className="flex items-start gap-4">
                  <span className="text-red-300 font-black text-sm mt-0.5 shrink-0 w-4">✕</span>
                  <span className="text-[#888] text-sm leading-relaxed">{t}</span>
                </div>
              ))}
              <div className="flex items-start gap-4 pt-5 border-t border-[#F0F0F0]">
                <span className="text-red-300 font-black text-sm mt-0.5 shrink-0 w-4">✕</span>
                <span className="text-[#2C2C2C]/50 font-semibold text-sm">Um 23:15 Uhr endlich abgeschickt</span>
              </div>
            </div>
          </motion.div>

          {/* NACHHER */}
          <motion.div variants={fadeUp} className="md:order-2 bg-[#2C2C2C] border-t-2 border-t-[#F5C400] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-1">
              {/* Microphone with soundwaves icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <span className="text-[#F5C400] text-[13px] font-extrabold font-syne tracking-widest uppercase">17:03 Uhr</span>
            </div>
            <div className="font-syne font-extrabold text-white text-[22px] md:text-[26px] tracking-tight mb-8">Mit Sofortangebot</div>
            <div className="flex flex-col gap-5">
              {[
                'Aufmaß beim Kunden eingesprochen',
                'KI erkennt Positionen und Mengen',
                'Kurz drübergeschaut, alles passt',
                'Angebot als Link verschickt',
              ].map((t) => (
                <div key={t} className="flex items-start gap-4">
                  <span className="text-[#F5C400] font-black text-sm mt-0.5 shrink-0 w-4">✓</span>
                  <span className="text-white/60 text-sm leading-relaxed">{t}</span>
                </div>
              ))}
              <div className="flex items-start gap-4 pt-5 border-t border-white/10">
                <span className="text-[#F5C400] font-black text-sm mt-0.5 shrink-0 w-4">✓</span>
                <span className="text-[#F5C400] font-semibold text-sm">Kunde hat schon unterschrieben</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
