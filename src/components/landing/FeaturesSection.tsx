'use client'

import { motion } from 'framer-motion'
import { SketchIcon } from './SketchIcon'

const features = [
  {
    name: 'Aufmaß einsprechen',
    desc: 'Direkt auf der Baustelle eingesprochen. Egal ob Dialekt, Korrekturen oder Nachträge – Sofortangebot versteht deine Beschreibung.',
    icon: <SketchIcon width={26} height={30} seed={11} roughness={0.6} strokeWidth={1.8} shapes={[
      { type: 'rect', x: 8, y: 1, w: 10, h: 16 },
      { type: 'arc', cx: 13, cy: 17, r: 8, start: 0, stop: Math.PI },
      { type: 'line', x1: 13, y1: 25, x2: 13, y2: 29 },
      { type: 'line', x1: 8, y1: 29, x2: 18, y2: 29 },
    ]} />,
  },
  {
    name: 'Mehrere Räume, eine Aufnahme',
    desc: 'Wohnzimmer, Flur und Kinderzimmer? Alles in einer Aufnahme. Kein Neustart zwischen den Räumen.',
    icon: <SketchIcon width={28} height={26} seed={5} roughness={0.6} strokeWidth={1.8} shapes={[
      { type: 'rect', x: 2, y: 2, w: 24, h: 22 },
      { type: 'line', x1: 14, y1: 2, x2: 14, y2: 24 },
      { type: 'line', x1: 14, y1: 14, x2: 26, y2: 14 },
    ]} />,
  },
  {
    name: 'Angebot automatisch erstellt',
    desc: 'Fertiges Angebot als professionelles PDF – mit deinem Logo, deinen Preisen und bereit zum Versenden.',
    icon: <SketchIcon width={22} height={28} seed={3} roughness={0.6} strokeWidth={1.8} shapes={[
      { type: 'rect', x: 2, y: 1, w: 18, h: 26 },
      { type: 'line', x1: 5, y1: 9, x2: 17, y2: 9 },
      { type: 'line', x1: 5, y1: 13, x2: 14, y2: 13 },
      { type: 'line', x1: 5, y1: 17, x2: 16, y2: 17 },
    ]} />,
  },
  {
    name: 'Digital unterschreiben',
    desc: 'Der Kunde unterschreibt direkt auf dem Handy. Kein Drucken. Kein Scannen.',
    icon: <SketchIcon width={24} height={28} seed={9} roughness={0.6} strokeWidth={1.8} shapes={[
      { type: 'line', x1: 4, y1: 22, x2: 20, y2: 22 },
      { type: 'curve', points: [[4, 22], [4, 10], [8, 6], [12, 8], [12, 14]] },
      { type: 'curve', points: [[12, 14], [12, 8], [16, 6], [20, 8], [20, 14]] },
      { type: 'arc', cx: 12, cy: 22, r: 8, start: 0, stop: Math.PI },
    ]} />,
  },
  {
    name: 'Buchhaltung verbinden',
    desc: 'Angebot und Rechnung landen direkt in Lexoffice oder sevDesk. Nie wieder Daten doppelt eingeben.',
    icon: <SketchIcon width={30} height={22} seed={17} roughness={0.6} strokeWidth={1.8} shapes={[
      { type: 'circle', cx: 8, cy: 11, r: 7 },
      { type: 'circle', cx: 22, cy: 11, r: 7 },
      { type: 'line', x1: 11, y1: 11, x2: 19, y2: 11 },
    ]} />,
  },
  {
    name: 'Jederzeit weitermachen',
    desc: 'Baustelle unterbrechen? Kein Problem. Die App wartet genau an der gleichen Stelle auf dich.',
    icon: <SketchIcon width={26} height={26} seed={23} roughness={0.6} strokeWidth={1.8} shapes={[
      { type: 'circle', cx: 13, cy: 13, r: 11 },
      { type: 'line', x1: 13, y1: 6, x2: 13, y2: 13 },
      { type: 'line', x1: 13, y1: 13, x2: 19, y2: 16 },
    ]} />,
  },
]

const killer = [
  { label: 'Eigene Preisdatenbank', desc: 'Stunden- und Einheitspreise individuell anpassbar.' },
  { label: 'KI berechnet Mengen', desc: 'Wandflächen, Decken, Sockelleisten – alles wird automatisch ermittelt.' },
  { label: 'Deine Firmenvorlagen', desc: 'Logo, Zahlungsziel, Angebotsnummern und Briefpapier automatisch.' },
  { label: 'Regionale Preisfaktoren', desc: 'Preise automatisch an deinen Standort und Markt angepasst.' },
]

export function FeaturesSection() {
  return (
    <section className="bg-[#2C2C2C] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-14 md:mb-18"
        >
          <h2 className="font-syne font-extrabold text-white text-[28px] md:text-[36px] tracking-tight mb-3">
            Vom Aufmaß bis zur Unterschrift.
          </h2>
          <p className="text-white/35 text-base">Alles in einer App.</p>
        </motion.div>

        {/* Workflow Features */}
        <div className="mb-14">
          {features.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="grid grid-cols-[32px_1fr] md:grid-cols-[32px_240px_1fr] gap-x-5 md:gap-x-10 items-start py-6 border-b border-white/8 last:border-0"
            >
              <span className="flex items-center pt-1">{f.icon}</span>
              <span className="font-syne font-extrabold text-white text-[17px] md:text-[19px] tracking-tight leading-snug">{f.name}</span>
              <span className="text-white/40 text-sm md:text-base leading-relaxed col-start-2 md:col-start-3 mt-2 md:mt-0">{f.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* Killerfunktionen */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-syne font-extrabold text-white/50 text-[12px] tracking-widest uppercase mb-6">Und noch mehr</p>
          <div className="grid md:grid-cols-2 gap-4">
            {killer.map((k) => (
              <div key={k.label} className="flex items-start gap-3 bg-white/[0.04] px-5 py-4">
                <span className="w-2 h-2 rounded-full bg-[#F5C400] mt-1.5 shrink-0" />
                <div>
                  <p className="font-syne font-extrabold text-white text-[15px] mb-1">{k.label}</p>
                  <p className="text-white/35 text-sm leading-relaxed">{k.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
