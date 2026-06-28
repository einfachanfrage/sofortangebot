'use client'

import { motion } from 'framer-motion'
import { SketchIcon } from './SketchIcon'

const steps = [
  {
    nr: '01',
    title: 'Einsprechen',
    desc: 'Du stehst beim Kunden und sprichst kurz rein. Raum, Maße, was gemacht wird.',
    icon: (
      /* mic: capsule body + stand arc + base + sound waves */
      <SketchIcon width={58} height={58} seed={11} roughness={1.6} strokeWidth={2.2} shapes={[
        { type: 'arc', cx: 29, cy: 20, r: 10, start: Math.PI, stop: 0 },
        { type: 'rect', x: 19, y: 11, w: 20, h: 18 },
        { type: 'arc', cx: 29, cy: 29, r: 15, start: 0, stop: Math.PI },
        { type: 'line', x1: 29, y1: 44, x2: 29, y2: 52 },
        { type: 'line', x1: 19, y1: 52, x2: 39, y2: 52 },
        { type: 'arc', cx: 42, cy: 24, r: 5, start: -0.8, stop: 0.8 },
        { type: 'arc', cx: 47, cy: 24, r: 8, start: -0.8, stop: 0.8 },
      ]} />
    ),
  },
  {
    nr: '02',
    title: 'Erkennen',
    desc: 'Die KI versteht Handwerkersprache. Positionen, Mengen, Preise. Automatisch.',
    icon: (
      /* clipboard: board + clip + three lines + checkmark */
      <SketchIcon width={52} height={62} seed={7} roughness={1.6} strokeWidth={2.2} shapes={[
        { type: 'rect', x: 8, y: 10, w: 36, h: 48 },
        { type: 'rect', x: 17, y: 5, w: 18, h: 10 },
        { type: 'line', x1: 15, y1: 28, x2: 37, y2: 28 },
        { type: 'line', x1: 15, y1: 36, x2: 33, y2: 36 },
        { type: 'line', x1: 15, y1: 45, x2: 22, y2: 52 },
        { type: 'line', x1: 22, y1: 52, x2: 36, y2: 38 },
      ]} />
    ),
  },
  {
    nr: '03',
    title: 'Abschicken',
    desc: 'PDF fertig. Per Link teilen, digital unterschreiben lassen. Fertig.',
    icon: (
      /* envelope: body + V-flap + arrow */
      <SketchIcon width={66} height={52} seed={3} roughness={1.6} strokeWidth={2.2} shapes={[
        { type: 'rect', x: 4, y: 10, w: 48, h: 34 },
        { type: 'line', x1: 4, y1: 10, x2: 28, y2: 28 },
        { type: 'line', x1: 28, y1: 28, x2: 52, y2: 10 },
        { type: 'line', x1: 56, y1: 27, x2: 66, y2: 27 },
        { type: 'line', x1: 62, y1: 22, x2: 66, y2: 27 },
        { type: 'line', x1: 66, y1: 27, x2: 62, y2: 32 },
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

        <div className="grid md:grid-cols-3 gap-0 relative">

          {steps.map((s, i) => (
            <motion.div
              key={s.nr}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative pb-12 md:pb-0 md:pr-12 last:pr-0"
            >
              <div className="mb-4">{s.icon}</div>
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
