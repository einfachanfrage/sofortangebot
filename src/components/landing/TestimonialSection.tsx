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
            className="font-syne font-black text-[#2C2C2C] leading-none select-none mb-6"
            style={{ fontSize: 'clamp(80px, 15vw, 120px)', opacity: 0.15, lineHeight: 1 }}
            aria-hidden
          >
            "
          </div>
          <blockquote className="font-syne font-black text-[#2C2C2C] leading-snug mb-8" style={{ fontSize: 'clamp(22px, 4vw, 30px)' }}>
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
