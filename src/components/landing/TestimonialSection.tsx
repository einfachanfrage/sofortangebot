'use client'

import { motion } from 'framer-motion'

const aktiv = [
  {
    emoji: '🎨',
    gewerk: 'Maler & Lackierer',
    positionen: ['Innenanstrich', 'Lackierarbeiten', 'Spachteln', 'Tapeten', 'Fassaden'],
    hinweis: 'Über 300 vorbereitete Positionen',
  },
  {
    emoji: '🏠',
    gewerk: 'Bodenbeläge & Parkett',
    positionen: ['Vinyl', 'Laminat', 'Parkett', 'Teppich', 'Sockelleisten'],
    hinweis: 'Über 200 vorbereitete Positionen',
  },
]

const bald = ['Trockenbau', 'Fliesenleger', 'Elektrik', 'Sanitär & Heizung', 'Zimmerer', 'Schreiner']

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
          <h2 className="font-syne font-extrabold text-anthracite text-[28px] md:text-[36px] tracking-tight mb-3">
            Spezialisiert. Mit Absicht.
          </h2>
          <p className="text-[#888] text-base max-w-2xl leading-relaxed">
            Andere Tools wollen jedes Gewerk ein bisschen können. Sofortangebot kann Maler- und Bodenarbeiten richtig — inklusive der Sonderfälle, an denen Alleskönner scheitern: Raufaser, Dachschrägen, Erschwerniszuschläge, Verschnitt.
          </p>
        </motion.div>

        {/* Aktive Gewerke */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {aktiv.map((g, i) => (
            <motion.div
              key={g.gewerk}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-anthracite/8 rounded-3xl p-6 md:p-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{g.emoji}</span>
                  <span className="font-syne font-extrabold text-anthracite text-[19px] md:text-[21px] tracking-tight">{g.gewerk}</span>
                </div>
                <span className="shrink-0 flex items-center gap-1.5 bg-[#F0FAF0] text-[#2a7a2a] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2a7a2a] inline-block" />
                  Sofort einsatzbereit
                </span>
              </div>

              {/* Positionen */}
              <ul className="flex flex-col gap-1.5 mb-4">
                {g.positionen.map(p => (
                  <li key={p} className="flex items-center gap-2 text-[#555] text-sm">
                    <span className="text-anthracite/20 text-xs">·</span>
                    {p}
                  </li>
                ))}
              </ul>

              <p className="text-anthracite/30 text-xs font-semibold">{g.hinweis}</p>
            </motion.div>
          ))}
        </div>

        {/* Vertrauen-Zeile */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-[#888] text-sm mb-12 border-l-2 border-yellow pl-4"
        >
          Alle Positionen, Preise und Einheiten lassen sich jederzeit individuell an deinen Betrieb anpassen.
        </motion.p>

        {/* Weitere Gewerke */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <p className="font-syne font-extrabold text-anthracite text-[15px] mb-1">Weitere Gewerke folgen</p>
          <p className="text-[#999] text-sm mb-5">Wir erweitern Sofortangebot kontinuierlich.</p>
          <div className="flex flex-wrap gap-2">
            {bald.map(g => (
              <span key={g} className="flex items-center gap-1.5 border border-anthracite/8 rounded-full text-anthracite/40 text-sm px-3.5 py-2">
                <span>🚧</span> {g}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
