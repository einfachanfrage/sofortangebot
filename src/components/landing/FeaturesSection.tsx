'use client'

import { motion } from 'framer-motion'
import { SketchIcon } from './SketchIcon'

const features = [
  {
    name: 'Spracheingabe',
    desc: 'Einfach eingesprochen auf der Baustelle. Dialekt, Korrekturen, Unterbrechungen - die KI versteht das.',
    icon: <SketchIcon width={26} height={30} seed={11} roughness={1.6} strokeWidth={2} shapes={[
      { type: 'rect', x: 8, y: 1, w: 10, h: 16 },
      { type: 'arc', cx: 13, cy: 17, r: 8, start: 0, stop: Math.PI },
      { type: 'line', x1: 13, y1: 25, x2: 13, y2: 29 },
      { type: 'line', x1: 8, y1: 29, x2: 18, y2: 29 },
    ]} />,
  },
  {
    name: 'Alles in einem Aufmaß',
    desc: 'Mehrere Räume, verschiedene Gewerke, alles in einem Durchgang eingesprochen.',
    icon: <SketchIcon width={28} height={26} seed={5} roughness={1.6} strokeWidth={2} shapes={[
      { type: 'rect', x: 2, y: 2, w: 24, h: 22 },
      { type: 'line', x1: 14, y1: 2, x2: 14, y2: 24 },
      { type: 'line', x1: 14, y1: 14, x2: 26, y2: 14 },
    ]} />,
  },
  {
    name: 'PDF sofort',
    desc: 'Mit deinem Logo. Professionell. Kein Word, kein Layout-Stress.',
    icon: <SketchIcon width={22} height={28} seed={3} roughness={1.6} strokeWidth={2} shapes={[
      { type: 'rect', x: 2, y: 1, w: 18, h: 26 },
      { type: 'line', x1: 5, y1: 9, x2: 17, y2: 9 },
      { type: 'line', x1: 5, y1: 13, x2: 14, y2: 13 },
      { type: 'line', x1: 5, y1: 17, x2: 16, y2: 17 },
    ]} />,
  },
  {
    name: 'Digital unterschreiben',
    desc: 'Kunde bekommt einen Link, Finger drauf, Auftrag erteilt. Kein Ausdrucken, kein Scannen.',
    icon: <SketchIcon width={24} height={28} seed={9} roughness={1.6} strokeWidth={2} shapes={[
      { type: 'line', x1: 4, y1: 22, x2: 20, y2: 22 },
      { type: 'curve', points: [[4, 22], [4, 10], [8, 6], [12, 8], [12, 14]] },
      { type: 'curve', points: [[12, 14], [12, 8], [16, 6], [20, 8], [20, 14]] },
      { type: 'arc', cx: 12, cy: 22, r: 8, start: 0, stop: Math.PI },
    ]} />,
  },
  {
    name: 'Lexoffice & sevDesk',
    desc: 'Ein Tap. Fertig in deiner Buchhaltung. Nie wieder doppelt eintippen.',
    icon: <SketchIcon width={30} height={22} seed={17} roughness={1.6} strokeWidth={2} shapes={[
      { type: 'circle', cx: 8, cy: 11, r: 7 },
      { type: 'circle', cx: 22, cy: 11, r: 7 },
      { type: 'line', x1: 11, y1: 11, x2: 19, y2: 11 },
    ]} />,
  },
  {
    name: 'Session offen lassen',
    desc: 'Raum 1 jetzt, Raum 2 in einer Stunde. Die App wartet auf dich.',
    icon: <SketchIcon width={26} height={26} seed={23} roughness={1.6} strokeWidth={2} shapes={[
      { type: 'circle', cx: 13, cy: 13, r: 11 },
      { type: 'line', x1: 13, y1: 6, x2: 13, y2: 13 },
      { type: 'line', x1: 13, y1: 13, x2: 19, y2: 16 },
    ]} />,
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-[#2C2C2C] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-syne font-extrabold text-white text-[28px] md:text-[36px] tracking-tight mb-12 md:mb-16"
        >
          Was du bekommst.
        </motion.h2>

        <div>
          {features.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="grid grid-cols-[32px_1fr] md:grid-cols-[32px_220px_1fr] gap-x-5 md:gap-x-8 items-start py-5 border-b border-white/8 last:border-0"
            >
              <span className="flex items-center pt-0.5">{f.icon}</span>
              <span className="font-syne font-extrabold text-white text-[17px] md:text-[19px] tracking-tight leading-snug">{f.name}</span>
              <span className="text-white/40 text-sm md:text-base leading-relaxed col-start-2 md:col-start-3 mt-1 md:mt-0">{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
