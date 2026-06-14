'use client'

import { motion } from 'framer-motion'

const integrations = [
  'Lexoffice', 'sevDesk', 'FastBill', 'Billomat',
  'Papierkram', 'Easybill', 'DATEV', 'PlanCraft', 'CSV-Export',
]

export function IntegrationenSection() {
  return (
    <section className="bg-[#F7F7F5] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-syne font-black text-[#2C2C2C] text-3xl md:text-4xl mb-3">
            Läuft mit dem was du schon nutzt.
          </h2>
          <p className="text-[#666] text-base mb-10">Einmal verbinden, nie wieder doppelt eintippen.</p>
        </motion.div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-5 px-5">
          <div className="flex gap-2 w-max pb-2">
            {integrations.map((name) => (
              <span key={name} className="border border-[#2C2C2C]/15 text-[#2C2C2C] text-sm font-semibold px-4 py-2.5 bg-white whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Desktop: wrap grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:flex flex-wrap gap-2"
        >
          {integrations.map((name) => (
            <span
              key={name}
              className="border border-[#2C2C2C]/15 text-[#2C2C2C] text-sm font-semibold px-5 py-2.5 bg-white hover:border-[#F5C400] transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
