'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <section className="bg-[#F5C400] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-syne font-black text-[#2C2C2C] leading-tight mb-4" style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}>
            Dein nächstes Angebot.<br />
            Nicht heute Abend.
          </h2>
          <p className="text-[#2C2C2C]/60 text-lg md:text-xl font-medium mb-10 leading-relaxed">
            Direkt vom Parkplatz.<br />
            Während der Kunde noch neben dir steht.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#2C2C2C] text-white font-black text-lg px-10 py-4 hover:bg-[#1a1a1a] transition-colors w-full md:w-auto text-center"
          >
            Jetzt kostenlos starten →
          </Link>
          <p className="text-[#2C2C2C]/40 text-sm font-medium mt-4">
            Keine Kreditkarte · Keine Einarbeitung · Monatlich kündbar
          </p>
        </motion.div>
      </div>
    </section>
  )
}
