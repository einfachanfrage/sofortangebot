'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'Kann ich das direkt auf der Baustelle nutzen?',
    a: 'Ja. Sofortangebot wurde speziell für das Smartphone entwickelt. Du kannst Angebote direkt beim Kunden oder auf der Baustelle erstellen – ohne Laptop.',
  },
  {
    q: 'Und wenn ich mich verspreche oder Dialekt spreche?',
    a: 'Du siehst sofort, was erkannt wurde. Falls etwas nicht stimmt, kannst du es direkt ändern. Auch Dialekt, Versprecher oder Korrekturen erkennt Sofortangebot in den meisten Fällen zuverlässig.',
  },
  {
    q: 'Wie lange dauert die Einrichtung?',
    a: 'Weniger als fünf Minuten. Firmendaten eintragen, Preise prüfen und loslegen. Mehr brauchst du nicht.',
  },
  {
    q: 'Kann ich meine eigenen Preise verwenden?',
    a: 'Ja. Du kannst die vorgeschlagenen Preise übernehmen oder jederzeit durch deine eigenen ersetzen. Deine Preisdatenbank gehört dir.',
  },
  {
    q: 'Ich bin Kleinunternehmer nach §19 UStG – geht das?',
    a: 'Ja, direkt beim Einrichten einstellbar. Auf deinen Angeboten steht dann der korrekte Hinweis, ohne MwSt-Ausweis.',
  },
  {
    q: 'Sind meine Kundendaten sicher?',
    a: 'Ja. Alles liegt verschlüsselt auf Servern in Deutschland. Kein Verkauf, kein Tracking, kein Teilen mit Dritten. DSGVO-konform.',
  },
  {
    q: 'Kann ich jederzeit kündigen?',
    a: 'Ja. Monatlich, ohne Frist, ohne Anruf. Einfach in den Einstellungen auf Kündigen klicken.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-[#F5F5F5] py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-12"
        >
          Noch Fragen?
        </motion.h2>

        <div className="mb-14">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border-b border-[#E0E0E0]"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-6"
              >
                <span className="font-syne font-extrabold text-[#2C2C2C] text-[15px] md:text-[16px] leading-snug">
                  {faq.q}
                </span>
                <span
                  className="text-[#999] text-xl font-light shrink-0 transition-transform duration-200 select-none"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[#777] text-base leading-relaxed pb-6">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Support-Abschluss */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="border-l-2 border-[#F5C400] pl-5"
        >
          <p className="font-syne font-extrabold text-[#2C2C2C] text-[15px] mb-1">Nicht dabei?</p>
          <p className="text-[#888] text-sm mb-2">Schreib uns einfach. Antwort innerhalb eines Werktages.</p>
          <a
            href="mailto:support@sofortangebot.app"
            className="text-[#2C2C2C] text-sm font-semibold hover:text-[#F5C400] transition-colors"
          >
            support@sofortangebot.app
          </a>
        </motion.div>

      </div>
    </section>
  )
}
