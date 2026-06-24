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
    <section className="bg-[#F5F5F5] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-16 md:mb-20"
        >
          So funktioniert&apos;s.
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-0 relative">
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-[44px] left-[calc(33%+24px)] right-[calc(33%+24px)] h-px bg-[#F5C400]/60" />

          {steps.map((s, i) => (
            <motion.div
              key={s.nr}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative pb-12 md:pb-0 md:pr-12 last:pr-0"
            >
              <div className="font-syne font-extrabold text-[#F5C400] leading-none mb-4 text-[64px] md:text-[72px]">
                {s.nr}
              </div>
              <div className="font-syne font-extrabold text-[#2C2C2C] text-[20px] md:text-[22px] mb-3 tracking-tight">
                {s.title}
              </div>
              <div className="text-[#777] text-base leading-relaxed max-w-xs">
                {s.desc}
              </div>

              {i < 2 && (
                <div className="md:hidden absolute bottom-0 left-0 w-8 h-px bg-[#F5C400]/50" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
