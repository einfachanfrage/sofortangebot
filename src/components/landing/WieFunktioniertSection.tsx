'use client'

import { motion } from 'framer-motion'
import { SketchIcon } from './SketchIcon'

const steps = [
  {
    nr: '1',
    title: 'Einsprechen',
    desc: 'Aufmaß und Arbeiten einfach einsprechen.',
    icon: (
      <SketchIcon width={56} height={56} seed={11} roughness={0.8} strokeWidth={2} shapes={[
        { type: 'rect', x: 19, y: 8, w: 18, h: 22 },
        { type: 'arc', cx: 28, cy: 30, r: 14, start: 0, stop: Math.PI },
        { type: 'line', x1: 28, y1: 44, x2: 28, y2: 51 },
        { type: 'line', x1: 18, y1: 51, x2: 38, y2: 51 },
        { type: 'arc', cx: 41, cy: 22, r: 5, start: -0.7, stop: 0.7 },
        { type: 'arc', cx: 46, cy: 22, r: 9, start: -0.7, stop: 0.7 },
      ]} />
    ),
  },
  {
    nr: '2',
    title: 'Angebot erstellen',
    desc: 'Mengen, Positionen und Preise werden automatisch ermittelt.',
    icon: (
      <SketchIcon width={48} height={58} seed={7} roughness={0.8} strokeWidth={2} shapes={[
        { type: 'rect', x: 6, y: 8, w: 36, h: 46 },
        { type: 'rect', x: 15, y: 3, w: 18, h: 10 },
        { type: 'line', x1: 13, y1: 24, x2: 35, y2: 24 },
        { type: 'line', x1: 13, y1: 32, x2: 30, y2: 32 },
        { type: 'line', x1: 13, y1: 42, x2: 20, y2: 50 },
        { type: 'line', x1: 20, y1: 50, x2: 34, y2: 36 },
      ]} />
    ),
  },
  {
    nr: '3',
    title: 'Versenden',
    desc: 'Angebot prüfen und direkt an den Kunden senden.',
    icon: (
      <SketchIcon width={58} height={46} seed={3} roughness={0.8} strokeWidth={2} shapes={[
        { type: 'rect', x: 3, y: 6, w: 46, h: 32 },
        { type: 'line', x1: 3, y1: 6, x2: 26, y2: 26 },
        { type: 'line', x1: 26, y1: 26, x2: 49, y2: 6 },
        { type: 'line', x1: 52, y1: 22, x2: 58, y2: 22 },
        { type: 'line', x1: 55, y1: 18, x2: 58, y2: 22 },
        { type: 'line', x1: 58, y1: 22, x2: 55, y2: 26 },
      ]} />
    ),
  },
]

export function WieFunktioniertSection() {
  return (
    <section className="bg-[#F5F5F5] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight mb-16 md:mb-20"
        >
          So funktioniert&apos;s.
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-0">
          {steps.map((s, i) => (
            <motion.div
              key={s.nr}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative pb-12 md:pb-0 md:pr-12 last:pr-0 flex flex-col items-start md:items-start"
            >
              <div className="mb-5">{s.icon}</div>
              <div className="font-syne font-extrabold text-[#F5C400] leading-none mb-4 text-[64px] md:text-[72px]">
                {s.nr}
              </div>
              <div className="font-syne font-extrabold text-[#2C2C2C] text-[20px] md:text-[22px] mb-3 tracking-tight">
                {s.title}
              </div>
              <div className="text-[#777] text-base leading-relaxed max-w-xs">
                {s.desc}
              </div>

              {i < 2 && (
                <div className="md:hidden absolute bottom-0 left-0 w-8 h-px bg-[#F5C400]/50" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
