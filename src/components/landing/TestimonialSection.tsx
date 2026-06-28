'use client'

import { motion } from 'framer-motion'

const aktiv = [
  {
    gewerk: 'Maler & Lackierer',
    was: 'Wände, Decken, Fassaden, Tapeten, Lacke',
    badge: 'Verfügbar',
  },
  {
    gewerk: 'Bodenbeläge',
    was: 'Parkett, Laminat, Vinyl, Teppich, Fliesen',
    badge: 'Verfügbar',
  },
]

const bald = [
  'Trockenbau',
  'Fliesenleger',
  'Elektriker',
  'Sanitär & Heizung',
  'Zimmerer',
  'Schreiner',
]

export function TestimonialSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-2">
            Für welche Gewerke?
          </h2>
          <p className="text-[#888] text-base">Die KI kennt die typischen Positionen, Einheiten und Preise deines Gewerks.</p>
        </motion.div>

        {/* Aktive Gewerke */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {aktiv.map((g, i) => (
            <motion.div
              key={g.gewerk}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-[#E5E5E5] p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="font-syne font-extrabold text-[#2C2C2C] text-[20px] md:text-[22px] tracking-tight">{g.gewerk}</span>
                <span className="shrink-0 bg-[#2C2C2C] text-[#F5C400] text-[10px] font-black uppercase tracking-widest px-2.5 py-1">{g.badge}</span>
              </div>
              <p className="text-[#888] text-sm leading-relaxed">{g.was}</p>
            </motion.div>
          ))}
        </div>

        {/* Bald verfügbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-[#2C2C2C]/35 text-xs font-bold uppercase tracking-widest mb-4">In Arbeit</p>
          <div className="flex flex-wrap gap-2">
            {bald.map(g => (
              <span key={g} className="border border-[#E5E5E5] text-[#2C2C2C]/40 text-sm px-3.5 py-2">
                {g}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
