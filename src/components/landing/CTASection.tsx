'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <section className="bg-[#F5C400] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">

          {/* LEFT — Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-syne font-extrabold text-[#2C2C2C] leading-tight tracking-tight mb-6 text-[32px] md:text-[44px] lg:text-[52px]">
              Feierabend statt<br />
              Angebot schreiben.
            </h2>
            <p className="text-[#2C2C2C]/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              Sprich dein Aufmaß direkt beim Kunden ein. Sofortangebot rechnet die Flächen, baut das Angebot und macht ein PDF draus — geprüft versendet, bevor du losfährst. Der Küchentisch bleibt heute frei.
            </p>
            <Link
              href="/register"
              className="inline-block bg-[#2C2C2C] text-white font-black text-base md:text-lg px-10 py-4 hover:bg-[#1a1a1a] transition-colors mb-5 w-full md:w-auto text-center"
            >
              Erstes Angebot kostenlos erstellen →
            </Link>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {['Keine Kreditkarte', 'In 5 Minuten eingerichtet', 'Monatlich kündbar'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-[#2C2C2C]/50 text-sm font-medium">
                  <span className="text-[#2C2C2C]/70 font-bold">✓</span> {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Prozess-Visualisierung */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden md:flex flex-col gap-3 min-w-[200px]"
          >
            {[
              { icon: '🎤', label: 'Aufmaß einsprechen' },
              { icon: '📐', label: 'Flächen berechnet' },
              { icon: '📧', label: 'Kunde erhält PDF' },
            ].map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center gap-3 bg-[#2C2C2C]/8 px-5 py-3.5">
                  <span className="text-xl">{step.icon}</span>
                  <span className="font-syne font-extrabold text-[#2C2C2C] text-[14px]">{step.label}</span>
                </div>
                {i < 2 && (
                  <div className="flex justify-center py-1">
                    <span className="text-[#2C2C2C]/30 text-sm">↓</span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
