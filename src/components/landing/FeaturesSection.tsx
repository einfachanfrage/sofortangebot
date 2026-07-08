'use client'

import { motion } from 'framer-motion'

const features = [
  {
    emoji: '🎙',
    name: 'Aufmaß einsprechen',
    desc: 'Direkt auf der Baustelle, so wie du redest. Dialekt, Korrekturen („warte, nicht fünf — sechs Meter"), Nachträge – alles kein Problem.',
  },
  {
    emoji: '📐',
    name: 'Verwinkelte Räume? Kein Problem.',
    desc: 'L-Form, Nischen, acht Wände: Grundriss antippen, Wandlängen eingeben — Flächen und Umfang werden exakt berechnet. Oder sag einfach die Bodenfläche.',
  },
  {
    emoji: '🧮',
    name: 'Rechenweg an jeder Position',
    desc: '„43,71 m² — 18 lfm Umfang × 2,60 m, Fenster und Tür abgezogen." Du siehst bei jeder Zahl, wo sie herkommt. Keine Blackbox.',
  },
  {
    emoji: '✍️',
    name: 'Digital unterschreiben',
    desc: 'Der Kunde unterschreibt direkt auf dem Handy. Kein Drucken. Kein Scannen.',
  },
  {
    emoji: '🔗',
    name: 'Buchhaltung verbinden',
    desc: 'Angebot und Rechnung landen direkt in Lexoffice oder sevDesk. Nie wieder Daten doppelt eingeben.',
  },
  {
    emoji: '💡',
    name: 'Denkt an das, was man vergisst',
    desc: 'Boden abdecken, Türen abkleben, Grundierung nach dem Tapetenabriss: Sofortangebot prüft dein Angebot auf Vollständigkeit — bevor du für die Position umsonst arbeitest.',
  },
]

const killer = [
  { label: 'Deine Preise, nicht unsere', desc: 'Eigene Stunden- und Einheitspreise — oder Marktpreise als Start, jederzeit anpassbar.' },
  { label: 'Mehrere Räume, eine Aufnahme', desc: 'Wohnzimmer, Flur, Kinderzimmer — alles in einem Rutsch einsprechen.' },
  { label: 'Deine Firmenvorlagen', desc: 'Logo, Zahlungsziel, Angebotsnummern und Briefpapier automatisch.' },
  { label: 'Kleinmaterial & Anfahrt', desc: 'Pauschalen einmal einstellen — landen automatisch auf jedem Angebot.' },
  { label: 'Regionale Preisfaktoren', desc: 'Preise an deinen Standort angepasst — München rechnet anders als Dessau.' },
  { label: 'E-Rechnung & GoBD', desc: 'ZUGFeRD, fortlaufende Nummernkreise, digitale Unterschrift — rechtssicher.' },
]

export function FeaturesSection() {
  return (
    <section className="bg-[#F7F7F5] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 md:mb-14"
        >
          <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-3">
            Vom Aufmaß bis zur Unterschrift.
          </h2>
          <p className="text-[#2C2C2C]/40 text-base">Gebaut für den Maler-Alltag — nicht für alle ein bisschen.</p>
        </motion.div>

        {/* Workflow Features */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-14">
          {features.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white rounded-3xl p-6 md:p-7 flex items-start gap-4 shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#F5C400]/15 flex items-center justify-center text-[20px] shrink-0">
                {f.emoji}
              </div>
              <div>
                <p className="font-syne font-extrabold text-[#2C2C2C] text-[16px] md:text-[17px] tracking-tight leading-snug mb-2">{f.name}</p>
                <p className="text-[#2C2C2C]/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Und noch mehr */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-syne font-extrabold text-[#2C2C2C]/40 text-[12px] tracking-widest uppercase mb-6">Und noch mehr</p>
          <div className="grid md:grid-cols-2 gap-3">
            {killer.map((k) => (
              <div key={k.label} className="flex items-start gap-3 bg-white border border-[#2C2C2C]/8 rounded-2xl px-5 py-4">
                <span className="w-2 h-2 rounded-full bg-[#F5C400] mt-1.5 shrink-0" />
                <div>
                  <p className="font-syne font-extrabold text-[#2C2C2C] text-[15px] mb-1">{k.label}</p>
                  <p className="text-[#2C2C2C]/45 text-sm leading-relaxed">{k.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
