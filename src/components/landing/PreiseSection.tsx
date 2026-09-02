'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PRICING } from '@/lib/pricing'

const freeFeatures = [
  `${PRICING.freeAngeboteProMonat} Angebote kostenlos`,
  PRICING.unterstuetzteGewerke,
  'PDF mit Sofortangebot-Logo',
]

const proFeatures = [
  'Unbegrenzte Angebote',
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
          className="mb-14"
        >
          <h2 className="font-syne font-extrabold text-anthracite text-[28px] md:text-[36px] tracking-tight mb-2">
            Was kostet das.
          </h2>
          <p className="text-[#888] text-base">Monatlich kündbar. Keine versteckten Kosten.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl">

          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-bg rounded-3xl p-8 md:p-10 flex flex-col"
          >
            <div className="font-syne font-extrabold text-anthracite text-[18px] tracking-tight mb-1">Reinschnuppern</div>
            <div className="text-[#AAA] text-sm mb-8">Zum Ausprobieren</div>
            <div className="mb-8">
              <span className="font-syne font-extrabold text-anthracite text-[52px] tracking-tight leading-none">0€</span>
            </div>
            <ul className="flex flex-col gap-3 mb-10 flex-1">
              {freeFeatures.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-[#666]">
                  <span className="text-[#CCCCCC] mt-0.5 shrink-0">—</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full text-center border-2 border-anthracite/20 rounded-2xl text-anthracite font-black text-sm py-4 hover:border-anthracite/50 transition-colors"
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
            className="bg-anthracite rounded-3xl p-8 md:p-10 flex flex-col relative"
          >
            <div
              className="absolute -top-3.5 right-6 bg-yellow text-anthracite font-black text-xs px-3 py-1 rounded-full tracking-wide"
            >
              Beliebteste Wahl
            </div>
            <div className="font-syne font-extrabold text-white text-[18px] tracking-tight mb-1">Vollgas</div>
            <div className="text-white/30 text-sm mb-8">Für den Alltag</div>
            <div className="mb-1 flex items-end gap-1.5">
              <span className="font-syne font-extrabold text-white leading-none text-[52px] tracking-tight">{PRICING.proJahresabo}€</span>
              <span className="text-white/40 text-sm pb-2">/Monat</span>
            </div>
            <div className="text-white/30 text-xs font-semibold mb-7">
              Bei Jahresabo. Monatlich {PRICING.proMonatlich} €.
            </div>
            <ul className="flex flex-col gap-3 mb-10 flex-1">
              {proFeatures.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/60">
                  <span className="text-yellow mt-0.5 shrink-0 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full text-center bg-yellow rounded-2xl text-anthracite font-black text-sm py-4 hover:bg-[#e6b800] transition-colors"
            >
              30 Tage gratis testen →
            </Link>
            <p className="text-white/20 text-xs text-center mt-3">Kein Risiko · Monatlich kündbar</p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
