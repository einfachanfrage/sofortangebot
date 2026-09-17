'use client'

import { motion } from 'framer-motion'

// Head of Marketing, 17.09.2026 — Finance-Korrektur 5 (Landingpage, Punkt 9.1):
// DATEV stand unter dem gruenen Punkt „Bereits integriert", hat aber keine
// Route unter src/app/api/integrations/ und traegt in accounting-options.ts
// tier: 'csv'. Eine Tatsachenbehauptung ueber etwas, das es nicht gibt —
// deshalb nach unten zu den Exporten, mit „(CSV)" im Namen, damit die Zeile
// die beiden Sorten nicht wieder vermischt.
// Ebenfalls hier: „Lexware" heisst als Produkt „Lexware Office"
// (accounting-options.ts, DC-019).
// NICHT geaendert, mit Absicht: FastBill, Billomat, Papierkram und Easybill
// haben echte Direktverbindungen (je eigene route.ts, eigene Key-Spalte) und
// gehoeren eigentlich nach oben. Sie bleiben unten, bis Sandys
// Buchhaltungs-Testlauf einmal durchgeklickt ist — Punkt 11.5 in
// launch-readiness.md steht auf 0 %, „nicht erhoben".
const hauptIntegrationen = [
  { name: 'Lexware Office' },
  { name: 'sevDesk' },
]

const weitereIntegrationen = ['FastBill', 'Billomat', 'Papierkram', 'Easybill', 'DATEV (CSV)', 'Sage (CSV)', 'PlanCraft (CSV)']

export function IntegrationenSection() {
  return (
    <section className="bg-white py-20 md:py-28 border-t border-[#F0F0F0]">
      <div className="max-w-6xl mx-auto px-5 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-14"
        >
          <h2 className="font-syne font-extrabold text-anthracite text-[28px] md:text-[36px] tracking-tight mb-3">
            Läuft mit dem, was du schon nutzt.
          </h2>
          <p className="text-[#888] text-base max-w-xl leading-relaxed">
            Arbeite einfach mit den Programmen weiter, die du bereits nutzt. Kein Umstellen, kein Neustart.
          </p>
        </motion.div>

        {/* Bereits integriert Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#2a7a2a] inline-block" />
          <span className="text-[#2a7a2a] text-sm font-semibold">Bereits integriert</span>
        </motion.div>

        {/* Haupt-Integrationen — groß, viel Luft */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12"
        >
          {hauptIntegrationen.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-4 border border-[#E8E8E8] px-7 py-6 hover:border-anthracite/30 transition-colors"
            >
              <span className="font-semibold text-anthracite text-[17px]">{integration.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Weitere Integrationen — kleiner, dezent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <p className="text-[#BBB] text-xs font-semibold tracking-widest uppercase mb-4">Weitere Anbindungen</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {weitereIntegrationen.map((name, i) => (
              <span key={name} className="text-[#999] text-sm">
                {name}{i < weitereIntegrationen.length - 1 && <span className="ml-4 text-[#DDD]">·</span>}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
