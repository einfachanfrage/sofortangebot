'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    nr: '1',
    emoji: '🎙',
    title: 'Einsprechen',
    desc: 'Aufmaß auf der Baustelle einsprechen — so wie du eben redest. „Wohnzimmer, fünf mal vier, Raufaser runter, dann streichen."',
  },
  {
    nr: '2',
    emoji: '📐',
    title: 'Wir rechnen. Richtig.',
    desc: 'Keine Schätzung: Wandflächen aus Umfang × Höhe, Fenster und Türen abgezogen, Sockelleisten in lfdm. An jeder Position steht der Rechenweg — zum Nachprüfen.',
  },
  {
    nr: '3',
    emoji: '📄',
    title: 'Prüfen & versenden',
    desc: 'Kurz drüberschauen, als PDF an den Kunden — der unterschreibt direkt auf dem Handy.',
  },
]

export function WieFunktioniertSection() {
  return (
    <section className="bg-[#F7F7F5] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-14 md:mb-16"
        >
          So funktioniert&apos;s.
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.nr}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white rounded-3xl p-7 md:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#F5C400] flex items-center justify-center text-[22px] shrink-0">
                  {s.emoji}
                </div>
                <span className="font-syne font-extrabold text-[#2C2C2C]/15 text-[44px] leading-none">{s.nr}</span>
              </div>
              <div className="font-syne font-extrabold text-[#2C2C2C] text-[20px] md:text-[21px] mb-3 tracking-tight">
                {s.title}
              </div>
              <div className="text-[#2C2C2C]/50 text-[15px] leading-relaxed">
                {s.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
