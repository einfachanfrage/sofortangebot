'use client'

import { motion } from 'framer-motion'

const features = [
  {
    nr: '01',
    name: 'Spracheingabe',
    desc: 'Kein Tippen. Du redest wie auf der Baustelle, die KI versteht den Rest.',
  },
  {
    nr: '02',
    name: '2.000+ Positionen',
    desc: 'Alle Gewerke, alle Preise. Nichts aufbauen — alles da.',
  },
  {
    nr: '03',
    name: 'PDF sofort',
    desc: 'Mit deinem Logo. Professionell. Ohne Layout-Stress.',
  },
  {
    nr: '04',
    name: 'Digital unterschreiben',
    desc: 'Link → Finger drauf → Auftrag erteilt. Kein Ausdrucken.',
  },
  {
    nr: '05',
    name: 'Lexoffice Export',
    desc: 'Ein Tap. Fertig in deiner Software. Keine Doppelarbeit.',
  },
  {
    nr: '06',
    name: 'Session offen',
    desc: 'Raum 1 jetzt, Raum 2 in einer Stunde. Die App wartet auf dich.',
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
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 py-5 border-b border-white/10 last:border-0"
            >
              <span className="font-syne font-black text-[#F5C400]/40 text-sm md:text-base w-8 shrink-0">{f.nr}</span>
              <span className="font-syne font-extrabold text-white text-[18px] md:text-[20px] md:w-56 shrink-0 tracking-tight">{f.name}</span>
              <span className="text-white/40 text-sm md:text-base leading-relaxed">{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
