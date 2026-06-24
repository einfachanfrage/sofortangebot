'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'Was wenn die KI mich nicht versteht?',
    a: 'Du siehst sofort was erkannt wurde und kannst es mit einem Tipp korrigieren. Die KI kennt alle typischen Positionen für Maler & Lackierer und Bodenbeläge.',
  },
  {
    q: 'Muss ich alle Preise selbst eingeben?',
    a: 'Nein. Sofortangebot lädt aktuelle Marktpreise für Maler- und Bodenbelagsarbeiten. Du kannst sie übernehmen, anpassen oder deine eigenen eintragen. Dauert drei Minuten beim ersten Mal.',
  },
  {
    q: 'Funktioniert das auf dem Handy?',
    a: 'Ja. Genau dafür ist es gebaut. Parkplatz, Baustelle, Auto — wo auch immer du gerade bist.',
  },
  {
    q: 'Was passiert mit meinen Kundendaten?',
    a: 'Die liegen verschlüsselt auf Servern in Deutschland. Kein Verkauf, kein Tracking, kein Teilen mit Dritten. DSGVO-konform.',
  },
  {
    q: 'Ich bin Kleinunternehmer nach §19 UStG — geht das?',
    a: 'Ja, direkt beim Einrichten einstellbar. Auf deinen Angeboten steht dann der korrekte Hinweis, ohne MwSt-Ausweis.',
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
          Häufige Fragen.
        </motion.h2>

        <div>
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
      </div>
    </section>
  )
}
