'use client'

import { motion } from 'framer-motion'

const features = [
  {
    nr: '01', name: 'Spracheingabe', desc: 'Einfach eingesprochen auf der Baustelle. Dialekt, Korrekturen, Unterbrechungen — die KI versteht das.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="1" width="6" height="12" rx="3"/>
        <path d="M5 10v1a7 7 0 0 0 14 0v-1"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
  },
  {
    nr: '02', name: 'Alles in einem Aufmaß', desc: 'Mehrere Räume, verschiedene Gewerke, alles in einem Durchgang eingesprochen.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7l18 0"/>
        <path d="M3 7l0 14"/>
        <path d="M21 7l0 14"/>
        <path d="M3 21l18 0"/>
        <line x1="3" y1="3" x2="21" y2="3"/>
        <line x1="7" y1="3" x2="7" y2="7"/>
        <line x1="12" y1="3" x2="12" y2="7"/>
        <line x1="17" y1="3" x2="17" y2="7"/>
        <line x1="3" y1="11" x2="6" y2="11"/>
        <line x1="3" y1="15" x2="6" y2="15"/>
      </svg>
    ),
  },
  {
    nr: '03', name: 'PDF sofort', desc: 'Mit deinem Logo. Professionell. Kein Word, kein Layout-Stress.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="12" y1="11" x2="12" y2="17"/>
        <polyline points="9,14 12,17 15,14"/>
      </svg>
    ),
  },
  {
    nr: '04', name: 'Digital unterschreiben', desc: 'Kunde bekommt einen Link, Finger drauf, Auftrag erteilt. Kein Ausdrucken, kein Scannen.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="9" y1="7" x2="15" y2="7"/>
        <line x1="9" y1="11" x2="15" y2="11"/>
        <path d="M9 17c1-1 2-1 3 0s2 1 3 0"/>
      </svg>
    ),
  },
  {
    nr: '05', name: 'Lexoffice & sevDesk', desc: 'Ein Tap. Fertig in deiner Buchhaltung. Nie wieder doppelt eintippen.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="12" r="4"/>
        <circle cx="17" cy="12" r="4"/>
        <line x1="11" y1="12" x2="13" y2="12"/>
      </svg>
    ),
  },
  {
    nr: '06', name: 'Session offen lassen', desc: 'Raum 1 jetzt, Raum 2 in einer Stunde. Die App wartet auf dich.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-[#2C2C2C] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-syne font-extrabold text-white text-[28px] md:text-[36px] tracking-tight mb-12 md:mb-16"
        >
          Was du bekommst.
        </motion.h2>

        <div>
          {features.map((f, i) => (
            <motion.div
              key={f.nr}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="grid grid-cols-[auto_1fr] md:grid-cols-[40px_220px_1fr] gap-x-5 md:gap-x-8 items-start py-5 border-b border-white/8 last:border-0"
            >
              <span className="flex items-center pt-0.5">{f.icon}</span>
              <span className="font-syne font-extrabold text-white text-[17px] md:text-[19px] tracking-tight leading-snug col-start-2">{f.name}</span>
              <span className="text-white/40 text-sm md:text-base leading-relaxed col-start-2 md:col-start-3 mt-1 md:mt-0">{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
