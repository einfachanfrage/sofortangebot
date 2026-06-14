'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function VorherNachherSection() {
  return (
    <section className="bg-[#F7F7F5] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid md:grid-cols-2 gap-4 md:gap-6"
        >
          {/* NACHHER — mobile first */}
          <motion.div variants={fadeUp} className="md:order-2 bg-[#2C2C2C] border-l-4 border-[#F5C400] p-7 md:p-8">
            <div className="text-[#F5C400] text-sm font-black font-syne mb-1">17:03 Uhr</div>
            <div className="font-syne font-black text-white text-xl mb-5">Mit Sofortangebot</div>
            <div className="flex flex-col gap-3">
              {[
                '🎙 Aufmaß beim Kunden eingesprochen',
                '🤖 KI erkennt Positionen und Mengen',
                '👀 Kurz drübergeschaut, alles passt',
                '📱 Angebot als Link verschickt',
              ].map((t) => (
                <div key={t} className="flex items-start gap-3">
                  <span className="text-[#F5C400] font-black text-base mt-0.5 shrink-0">✓</span>
                  <span className="text-white/70 text-sm font-medium">{t}</span>
                </div>
              ))}
              <div className="flex items-start gap-3 mt-2 pt-3 border-t border-white/10">
                <span className="text-[#F5C400] text-lg shrink-0">✅</span>
                <span className="text-[#F5C400] font-black text-sm">Kunde hat schon unterschrieben</span>
              </div>
            </div>
          </motion.div>

          {/* VORHER */}
          <motion.div variants={fadeUp} className="md:order-1 bg-white border-l-4 border-red-400 p-7 md:p-8">
            <div className="text-red-400 text-sm font-black font-syne mb-1">22:47 Uhr</div>
            <div className="font-syne font-black text-[#2C2C2C] text-xl mb-5">Ohne Sofortangebot</div>
            <div className="flex flex-col gap-3">
              {[
                'Laptop aufgeklappt, Kaffee kalt',
                'Preisliste suchen, Seite 14...',
                'Alles eintippen, Position für Position',
                'Nochmal korrigieren weil Tippfehler',
              ].map((t) => (
                <div key={t} className="flex items-start gap-3">
                  <span className="text-red-300 font-black text-base mt-0.5 shrink-0">✕</span>
                  <span className="text-[#666] text-sm font-medium">{t}</span>
                </div>
              ))}
              <div className="flex items-start gap-3 mt-2 pt-3 border-t border-[#2C2C2C]/8">
                <span className="text-lg shrink-0">📧</span>
                <span className="text-[#2C2C2C]/60 font-black text-sm">Um 23:15 Uhr endlich abgeschickt</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
