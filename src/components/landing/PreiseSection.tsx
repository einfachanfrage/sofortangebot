'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const starterFeatures = ['3 Angebote pro Monat', 'PDF mit Sofortangebot-Logo', 'Maler & Bodenbeläge']
const proFeatures = [
  'Unbegrenzte Angebote',
  'Maler & Bodenbeläge (weitere Gewerke folgen)',
  'PDF mit deinem Logo',
  'Digitale Unterschrift',
  'Lexoffice & sevDesk Export',
  'ZUGFeRD E-Rechnung',
  'Kundendatenbank',
]

export function PreiseSection() {
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
          <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-2">Was kostet das.</h2>
          <p className="text-[#666] text-base">Monatlich kündbar. Keine versteckten Kosten.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl">

          {/* STARTER */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-[#DDDDDD] p-7 md:p-8 flex flex-col"
          >
            <div className="font-syne font-extrabold text-[#2C2C2C] text-[20px] tracking-tight mb-1">Reinschnuppern</div>
            <div className="text-[#666] text-sm font-medium mb-6">Zum Ausprobieren</div>
            <div className="mb-6">
              <span className="font-syne font-extrabold text-[#2C2C2C] text-[48px] tracking-tight">0€</span>
            </div>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {starterFeatures.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#666] font-medium">
                  <span className="text-[#2C2C2C]/30">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full text-center border border-[#2C2C2C] text-[#2C2C2C] font-black text-sm py-3.5 hover:bg-[#F7F7F5] transition-colors"
            >
              Kostenlos starten →
            </Link>
          </motion.div>

          {/* PRO */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#2C2C2C] border-[3px] border-[#F5C400] p-7 md:p-8 relative flex flex-col"
          >
            <div
              className="absolute -top-3 right-6 bg-[#F5C400] text-[#2C2C2C] font-black text-xs px-3 py-1"
              style={{ transform: 'rotate(-3deg)' }}
            >
              ⭐ Beliebteste Wahl
            </div>
            <div className="font-syne font-extrabold text-white text-[20px] tracking-tight mb-1">Vollgas</div>
            <div className="text-white/40 text-sm font-medium mb-6">Für den Alltag</div>
            <div className="mb-1 flex items-end gap-1">
              <span className="font-syne font-extrabold text-white leading-none text-[48px] lg:text-[64px] tracking-tight">17€</span>
              <span className="text-white/40 text-sm font-medium pb-2">/Monat</span>
            </div>
            <div className="text-white/30 text-xs font-medium mb-6">bei Jahresabo · 22€ monatlich</div>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {proFeatures.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/70 font-medium">
                  <span className="text-[#F5C400] font-black">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full text-center bg-[#F5C400] text-[#2C2C2C] font-black text-sm py-3.5 hover:bg-[#e6b800] transition-colors"
            >
              30 Tage gratis testen →
            </Link>
            <p className="text-white/20 text-xs font-medium text-center mt-3">Kein Risiko · Monatlich kündbar</p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
