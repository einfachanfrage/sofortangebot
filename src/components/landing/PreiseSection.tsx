'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PRICING,
  GRUENDERPREIS_TEXT,
  MWST_HINWEIS,
  TESTPHASE_CTA,
  bruttoText,
} from '@/lib/pricing'

// ── CoS-038-A (Head of Product Engineering, 23.09.2026) ───────────────────
//
// Diese Sektion bewarb bis heute das ABGELÖSTE Modell: einen 0-€-Dauertarif
// mit 3 Angeboten pro Monat und einen Pro-Tarif zu 17 €/22 € mit Jahresabo.
// Beschlossen ist seit 03.09. ein einziger Tarif ohne Stufen; das Jahresabo
// gibt es vor Gate 2 nicht, das Gratis-Kontingent gehört nicht zum Modell.
//
// Aufbau und Wortlaut sind WÖRTLICH aus dem freigegebenen Entwurf des Head of
// Marketing übernommen (`docs/landingpage-entwurf.html`, „6 — PREIS"). Die
// Sätze gehören ihm, die Zahlen kommen aus `pricing.ts` — keine Zahl und kein
// Satz ist hier ein zweites Mal eingetippt.
//
// ── Head of Marketing, 23.09.2026 ────────────────────────────────────────
//
// Die sieben Merkmal-Zeilen, die hier zwischen Gruenderpreis-Kasten und Knopf
// standen ("Unbegrenzte Angebote", "PDF mit deinem Logo", "Lexware Office &
// sevDesk Export" u. a.), sind wieder entfernt. Sie standen NICHT im
// freigegebenen Entwurf (`docs/landingpage-entwurf.html`, "6 — PREIS"); die
// Preiskarte ist dort bewusst ohne Merkmalsliste. Die Merkmale stehen eine
// Sektion hoeher, ausfuehrlicher und richtiger: "Buchhaltung — Lexware,
// sevDesk und DATEV direkt, andere ueber Export". Zwei Listen auf derselben
// Seite, von denen die zweite kuerzer und schwaecher ist, widersprechen
// einander — hier stand "Export", wo das Produkt "direkt" kann.

export function PreiseSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="font-syne font-extrabold text-anthracite text-[28px] md:text-[36px] tracking-tight mb-2">
            Was kostet das.
          </h2>
          <p className="text-[#888] text-base">
            Ein Preis für den ganzen Betrieb, so viele Angebote du willst. Monatlich kündbar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-anthracite rounded-3xl p-8 md:p-10 max-w-md relative"
        >
          <div className="absolute -top-3.5 left-8 bg-yellow text-anthracite font-black text-xs px-3 py-1 rounded-full tracking-wide">
            Gründerpreis
          </div>

          <div className="font-syne font-extrabold text-white text-[18px] tracking-tight mb-1">Sofortangebot</div>
          <div className="text-white/30 text-sm mb-8">Alles drin. Keine Stufen, keine Zusatzpakete.</div>

          <div className="flex items-end gap-2.5 mb-1">
            <span className="font-syne font-extrabold text-white leading-none text-[52px] tracking-tight">
              {PRICING.gruenderMonatlich} €
            </span>
            <span className="text-white/40 text-sm pb-2">/Monat</span>
            <span className="text-white/25 text-lg pb-1.5 line-through">{PRICING.standardMonatlich} €</span>
          </div>
          <div className="text-white/30 text-xs font-semibold mb-7">
            zzgl. MwSt. — {bruttoText(PRICING.gruenderMonatlich)} brutto
          </div>

          <div className="bg-white/[0.06] rounded-2xl px-4 py-3.5 mb-10">
            <p className="text-white/70 text-[13px] font-semibold leading-relaxed">{GRUENDERPREIS_TEXT}</p>
          </div>

          <Link
            href="/register"
            className="block w-full text-center bg-yellow hover:bg-yellow-600 active:bg-yellow-700 rounded-2xl text-anthracite font-black text-sm py-4 transition-colors"
          >
            {TESTPHASE_CTA} →
          </Link>
          <p className="text-white/20 text-xs text-center mt-3">Keine Kreditkarte · Endet von allein</p>
        </motion.div>

        <p className="text-anthracite/30 text-xs font-semibold mt-6 max-w-md">{MWST_HINWEIS}</p>
      </div>
    </section>
  )
}
