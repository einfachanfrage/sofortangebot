'use client'

import { motion } from 'framer-motion'

const features = [
  { nr: '01', name: 'Spracheingabe',           desc: 'Einfach eingesprochen auf der Baustelle. Dialekt, Korrekturen, Unterbrechungen — die KI versteht das.' },
  { nr: '02', name: 'Alles in einem Aufmaß',   desc: 'Mehrere Räume, verschiedene Gewerke, alles in einem Durchgang eingesprochen.' },
  { nr: '03', name: 'PDF sofort',               desc: 'Mit deinem Logo. Professionell. Kein Word, kein Layout-Stress.' },
  { nr: '04', name: 'Digital unterschreiben',  desc: 'Kunde bekommt einen Link, Finger drauf, Auftrag erteilt. Kein Ausdrucken, kein Scannen.' },
  { nr: '05', name: 'Lexoffice & sevDesk',      desc: 'Ein Tap. Fertig in deiner Buchhaltung. Nie wieder doppelt eintippen.' },
  { nr: '06', name: 'Session offen lassen',    desc: 'Raum 1 jetzt, Raum 2 in einer Stunde. Die App wartet auf dich.' },
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
              <span className="font-syne font-black text-[#F5C400] text-sm leading-[1.8] md:leading-[1.6]">{f.nr}</span>
              <span className="font-syne font-extrabold text-white text-[17px] md:text-[19px] tracking-tight leading-snug col-start-2">{f.name}</span>
              <span className="text-white/40 text-sm md:text-base leading-relaxed col-start-2 md:col-start-3 mt-1 md:mt-0">{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
