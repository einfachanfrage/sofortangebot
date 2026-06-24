'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    nr: '01',
    title: 'Einsprechen',
    desc: 'Du stehst beim Kunden und sprichst kurz rein — Raum, Maße, was gemacht wird.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="13" y="3" width="10" height="16" rx="5"/>
        <path d="M6 17v2a12 12 0 0 0 24 0v-2"/>
        <line x1="18" y1="31" x2="18" y2="35"/>
        <line x1="12" y1="35" x2="24" y2="35"/>
        <path d="M28 13c1.5 1 2 3 2 5" strokeOpacity="0.5"/>
        <path d="M30 10c2.5 2 3.5 5 3.5 8" strokeOpacity="0.3"/>
      </svg>
    ),
  },
  {
    nr: '02',
    title: 'Erkennen',
    desc: 'Die KI versteht Handwerkersprache. Positionen, Mengen, Preise — automatisch.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="8" y="2" width="20" height="32" rx="2"/>
        <line x1="8" y1="8" x2="28" y2="8"/>
        <rect x="11" y="2" width="14" height="4" rx="1"/>
        <line x1="13" y1="15" x2="23" y2="15"/>
        <line x1="13" y1="20" x2="20" y2="20"/>
        <polyline points="13,27 16,30 23,23"/>
      </svg>
    ),
  },
  {
    nr: '03',
    title: 'Abschicken',
    desc: 'PDF fertig. Per Link teilen, digital unterschreiben lassen. Fertig.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="6" width="28" height="24" rx="2"/>
        <polyline points="4,6 18,20 32,6"/>
        <line x1="4" y1="30" x2="13" y2="21"/>
        <line x1="32" y1="30" x2="23" y2="21"/>
        <line x1="22" y1="33" x2="32" y2="33"/>
        <polyline points="29,30 32,33 29,36"/>
      </svg>
    ),
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
              <div className="mb-4 opacity-80">{s.icon}</div>
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
