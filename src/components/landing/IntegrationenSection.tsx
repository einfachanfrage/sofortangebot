'use client'

import { motion } from 'framer-motion'

const hauptIntegrationen = [
  {
    name: 'Lexware',
    logo: (
      <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <rect width="32" height="32" rx="6" fill="#E30613"/>
        <path d="M10 10l6 6-6 6M22 10l-6 6 6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="40" y="22" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16" fill="#2C2C2C">Lexware</text>
      </svg>
    ),
  },
  {
    name: 'sevDesk',
    logo: (
      <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <rect width="32" height="32" rx="6" fill="#E8440A"/>
        <rect x="8" y="18" width="4" height="8" fill="white"/>
        <rect x="14" y="13" width="4" height="13" fill="white"/>
        <rect x="20" y="8" width="4" height="18" fill="white"/>
        <text x="40" y="22" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16" fill="#2C2C2C">sevDesk</text>
      </svg>
    ),
  },
  {
    name: 'DATEV',
    logo: (
      <svg viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <rect width="32" height="32" rx="6" fill="#4CAF50"/>
        <text x="4" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="11" fill="white" letterSpacing="0.5">DATEV</text>
        <text x="40" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" fill="#2C2C2C">DATEV</text>
      </svg>
    ),
  },
]

const weitereIntegrationen = ['FastBill', 'Billomat', 'Papierkram', 'Easybill', 'PlanCraft', 'CSV-Export']

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
          <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-3">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
        >
          {hauptIntegrationen.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-4 border border-[#E8E8E8] px-7 py-6 hover:border-[#2C2C2C]/30 transition-colors"
            >
              {integration.logo}
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
