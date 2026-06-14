'use client'

import { motion } from 'framer-motion'

export function TestimonialSection() {
  return (
    <section className="bg-[#F5C400] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="font-syne font-extrabold text-[#2C2C2C] leading-none select-none mb-6 text-[80px] md:text-[96px] lg:text-[120px]"
            style={{ opacity: 0.15, lineHeight: 1 }}
            aria-hidden
          >
            "
          </div>
          <blockquote className="font-syne font-extrabold text-[#2C2C2C] leading-snug mb-8 text-[22px] md:text-[26px] lg:text-[30px] tracking-tight">
            Ich schick das Angebot raus,<br />
            während der Kunde noch<br />
            in der Wohnung ist.
          </blockquote>
          <p className="text-[#2C2C2C]/60 text-sm font-semibold tracking-wide">
            — Marco K., Malerbetrieb, 8 Mitarbeiter
          </p>
        </motion.div>
      </div>
    </section>
  )
}
