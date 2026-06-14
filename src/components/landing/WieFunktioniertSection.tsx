'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    nr: '01',
    title: 'Einsprechen',
    desc: 'Du stehst beim Kunden und sprichst kurz rein — Raum, Maße, was gemacht wird.',
  },
  {
    nr: '02',
    title: 'Erkennen',
    desc: 'Die KI versteht Handwerkersprache. Positionen, Mengen, Preise — automatisch.',
  },
  {
    nr: '03',
    title: 'Abschicken',
    desc: 'PDF fertig. Per Link teilen, digital unterschreiben lassen. Fertig.',
  },
]

export function WieFunktioniertSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-syne font-black text-[#2C2C2C] text-3xl md:text-4xl mb-14 md:mb-20"
        >
          So funktioniert&apos;s.
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-0 md:gap-0 relative">
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-[52px] left-[33%] right-[33%] h-px bg-[#F5C400]" />

          {steps.map((s, i) => (
            <motion.div
              key={s.nr}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative pt-0 pb-12 md:pb-0 md:pr-10 last:pb-0"
            >
              <div className="font-syne font-black text-[#F5C400] leading-none mb-3" style={{ fontSize: 'clamp(56px, 8vw, 80px)' }}>
                {s.nr}
              </div>
              <div className="font-syne font-black text-[#2C2C2C] text-2xl mb-3">{s.title}</div>
              <div className="text-[#666] text-base leading-relaxed max-w-xs">{s.desc}</div>

              {/* Mobile connector */}
              {i < 2 && (
                <div className="md:hidden absolute bottom-0 left-0 right-0 h-px bg-[#F5C400]/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
