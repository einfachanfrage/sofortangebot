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
            <div className="text-red-400 text-[13px] font-extrabold font-syne mb-1 tracking-widest uppercase">22:47 Uhr</div>
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
            <div className="text-[#F5C400] text-[13px] font-extrabold font-syne mb-1 tracking-widest uppercase">17:03 Uhr</div>
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
