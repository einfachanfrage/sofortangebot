'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'Was wenn die KI mich nicht versteht?',
    a: 'Du siehst sofort was erkannt wurde und kannst es mit einem Tipp korrigieren. Mit jedem Gewerk das du angibst wird das Matching besser — die KI kennt dann deine typischen Positionen.',
  },
  {
    q: 'Muss ich alle Preise selbst eingeben?',
    a: 'Nein. Sofortangebot lädt aktuelle Marktpreise für dein Gewerk. Du kannst sie übernehmen, anpassen oder deine eigenen eintragen. Dauert drei Minuten beim ersten Mal.',
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
    <section className="bg-[#F7F7F5] py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-10"
        >
          Häufige Fragen.
        </motion.h2>

        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className={`border-b border-[#2C2C2C]/10 transition-colors ${open === i ? 'bg-white border-l-4 border-l-[#F5C400] -mx-4 px-4 md:-mx-6 md:px-6' : ''}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
              >
                <span className={`font-extrabold text-[16px] ${open === i ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/80'}`}>
                  {faq.q}
                </span>
                <span
                  className="text-[#2C2C2C]/40 text-xl font-light shrink-0 transition-transform duration-200"
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
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[#666] text-base leading-relaxed pb-5 font-medium">{faq.a}</p>
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
