'use client'

import { motion } from 'framer-motion'

export function ProblemSection() {
  return (
    <section className="bg-[#F7F7F5] py-20 md:py-28 border-t border-[#2C2C2C]/8">
      <div className="max-w-2xl mx-auto px-5 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-syne font-extrabold text-[#F5C400] leading-none mb-4 text-[80px] md:text-[96px] lg:text-[120px]">
            73%
          </div>
          <p className="text-[#2C2C2C] text-lg md:text-xl font-medium mb-14">
            der Handwerker schreiben Angebote noch nach 20 Uhr.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-8 text-left"
        >
          <p className="text-[#666] text-base md:text-lg leading-relaxed">
            Acht Stunden auf der Baustelle. Dreck an den Händen, drei Rückrufe verpasst.
            Und abends sitzt du nochmal zwei Stunden am Tisch und tippst Angebote.
          </p>
          <p className="text-[#666] text-base md:text-lg leading-relaxed">
            Während dein Kunde wartet. Während dein Mitbewerber schläft.
            Während du eigentlich längst Feierabend hättest.
          </p>
          <p className="text-[#2C2C2C] text-base md:text-lg font-black leading-relaxed">
            Viele Aufträge gehen nicht verloren weil du zu teuer bist —<br className="hidden md:block" />
            sondern weil das Angebot zu spät kam.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
