'use client'

import { useRef, useState } from 'react'
import { Plus, Trash2, RotateCcw, RotateCw, Check, Pencil } from 'lucide-react'
import { berechneGrundriss, type Wand } from '@/lib/raum-geometrie'

// Fertige, geschlossene Ausgangsformen — der Nutzer muss nur noch bemaßen,
// kein manuelles Wand-für-Wand-Abbiegen nötig.
const VORLAGEN: { id: string; label: string; waende: Wand[] }[] = [
  {
    id: 'rechteck', label: 'Rechteck',
    waende: [{ laenge: 4 }, { laenge: 3, turn: 'R' }, { laenge: 4, turn: 'R' }, { laenge: 3, turn: 'R' }],
  },
  {
    id: 'l-form', label: 'L-Form',
    waende: [{ laenge: 5 }, { laenge: 2, turn: 'R' }, { laenge: 2, turn: 'R' }, { laenge: 2, turn: 'L' }, { laenge: 3, turn: 'R' }, { laenge: 4, turn: 'R' }],
  },
  {
    id: 'u-form', label: 'U-Form',
    waende: [
      { laenge: 2 }, { laenge: 2, turn: 'R' }, { laenge: 2, turn: 'L' }, { laenge: 2, turn: 'L' },
      { laenge: 2, turn: 'R' }, { laenge: 4, turn: 'R' }, { laenge: 6, turn: 'R' }, { laenge: 4, turn: 'R' },
    ],
  },
]

// ── DC-038 Teil 2 (Sandy, 2026-08-29): Freihand-Zeichnung → Wand[] ─────────
// "kann nicht der user einfach quasi selbst per finger/touchscreen die
// raumform grob zeichnen, die app wandelt es in gerade wände/kanten um und
// dann werden die wände nummeriert und maße können angepasst werden" —
// Wand[] ist nur {laenge, turn?: 'L'|'R'}[] (raum-geometrie.ts), also
// erzeugt eine vereinfachte + auf 90° relativ zur ersten Wand eingerastete
// Freihand-Zeichnung GENAU dasselbe Format wie die Vorlagen-Buttons oben —
// kein neues System, nur ein neuer Weg zur selben Liste. Ansatz vorab per
// Prototyp validiert (docs/dc-038-freihandzeichnen-prototyp.html), den
// Sandy selbst angetippt hat, bevor das hier gebaut wurde.
interface Punkt { x: number; y: number }

const ZEICHEN_W = 260, ZEICHEN_H = 170, PX_PRO_METER = 24

/** Ramer-Douglas-Peucker: reduziert einen rohen Zeichenpfad auf die
 *  wesentlichen Ecken (epsilon in denselben Einheiten wie die Punkte). */
function simplifyRDP(points: Punkt[], epsilon: number): Punkt[] {
  if (points.length < 3) return points.slice()
  function perpDist(pt: Punkt, a: Punkt, b: Punkt): number {
    const dx = b.x - a.x, dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    return Math.abs((pt.x - a.x) * dy - (pt.y - a.y) * dx) / len
  }
  let maxD = 0, idx = 0
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], points[0], points[points.length - 1])
    if (d > maxD) { maxD = d; idx = i }
  }
  if (maxD > epsilon) {
    const left = simplifyRDP(points.slice(0, idx + 1), epsilon)
    const right = simplifyRDP(points.slice(idx), epsilon)
    return left.slice(0, -1).concat(right)
  }
  return [points[0], points[points.length - 1]]
}

/** Vereinfacht + rastet auf 90° relativ zur ersten Wand ein → Wand[]. Gibt
 *  ein leeres Array zurück, wenn zu wenig Ecken erkannt wurden. */
function pfadZuWaenden(punkte: Punkt[]): Wand[] {
  const simplified = simplifyRDP(punkte, 10)
  if (simplified.length < 4) return []

  let ankerWinkel: number | null = null
  let vorherigerWinkel: number | null = null
  const waende: Wand[] = []
  for (let i = 1; i < simplified.length; i++) {
    const a = simplified[i - 1], b = simplified[i]
    let winkel = Math.atan2(b.y - a.y, b.x - a.x)
    if (ankerWinkel === null) {
      ankerWinkel = Math.round(winkel / (Math.PI / 2)) * (Math.PI / 2)
      winkel = ankerWinkel
    } else {
      const rel = winkel - ankerWinkel
      const snappedRel = Math.round(rel / (Math.PI / 2)) * (Math.PI / 2)
      winkel = ankerWinkel + snappedRel
    }
    const rohLaenge = Math.hypot(b.x - a.x, b.y - a.y)
    const meter = Math.max(0.3, Math.round((rohLaenge / PX_PRO_METER) * 10) / 10)

    let turn: 'L' | 'R' | undefined
    if (vorherigerWinkel !== null) {
      let delta = winkel - vorherigerWinkel
      while (delta <= -Math.PI) delta += 2 * Math.PI
      while (delta > Math.PI) delta -= 2 * Math.PI
      turn = delta < 0 ? 'L' : 'R' // +90° im Bildschirm-Koordinatensystem (y nach unten) = 'R', wie berechneGrundriss()
    }
    waende.push(turn ? { laenge: meter, turn } : { laenge: meter })
    vorherigerWinkel = winkel
  }
  return waende
}

// Rechtwinkliger Grundriss-Zeichner: Wand für Wand Länge + Abbiegung eingeben,
// Live-Vorschau zeigt die Form. Umfang → Wandfläche, Fläche → Boden/Decke.
export function RaumGrundrissEditor({
  raumName,
  initial,
  onSave,
  onClose,
}: {
  raumName: string
  initial?: Wand[]
  onSave: (waende: Wand[]) => void
  onClose: () => void
}) {
  const [waende, setWaende] = useState<Wand[]>(
    initial && initial.length >= 1 ? initial : [{ laenge: 4 }, { laenge: 3, turn: 'R' }, { laenge: 4, turn: 'R' }, { laenge: 3, turn: 'R' }]
  )
  const [zeichenModus, setZeichenModus] = useState(false)
  const g = berechneGrundriss(waende)
  const ende = g.pfad[g.pfad.length - 1] ?? { x: 0, y: 0 }
  const luecke = Math.round(Math.hypot(ende.x, ende.y) * 10) / 10 // Abstand Endpunkt→Start in m

  function setLaenge(i: number, val: string) {
    const n = parseFloat(val.replace(',', '.'))
    setWaende(w => w.map((wand, idx) => idx === i ? { ...wand, laenge: isNaN(n) ? 0 : n } : wand))
  }
  function setTurn(i: number, turn: 'L' | 'R') {
    setWaende(w => w.map((wand, idx) => idx === i ? { ...wand, turn } : wand))
  }
  function addWand() {
    // Leere Wand: wird erst gezeichnet wenn eine Länge eingegeben wird — bricht die
    // aktuelle Form also nicht sofort auf.
    setWaende(w => [...w, { laenge: 0, turn: 'R' }])
  }
  function removeWand(i: number) {
    setWaende(w => w.length > 1 ? w.filter((_, idx) => idx !== i) : w)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl px-5 pt-4 pb-8 shadow-2xl max-h-[92dvh] overflow-y-auto">
        <div className="flex justify-center mb-3 md:hidden"><div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" /></div>
        <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[19px] mb-1">Grundriss · {raumName}</h2>
        <p className="text-[#2C2C2C]/50 font-semibold text-[13px] mb-3 leading-relaxed">
          Für Räume mit Nische, Erker oder Vorsprung: Wähle eine Form, zeichne
          grob mit dem Finger, oder baue frei Wand für Wand.
        </p>

        {/* Vorlagen */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-black text-[#2C2C2C]/30 uppercase tracking-wide shrink-0">Vorlage</span>
          {VORLAGEN.map(v => (
            <button
              key={v.id}
              onClick={() => { setWaende(v.waende.map(w => ({ ...w }))); setZeichenModus(false) }}
              className="flex-1 text-[12px] font-extrabold text-[#2C2C2C] bg-[#2C2C2C]/6 hover:bg-[#F5C400]/20 rounded-lg py-1.5 transition-colors"
            >
              {v.label}
            </button>
          ))}
          <button
            onClick={() => setZeichenModus(true)}
            title="Raumform mit dem Finger zeichnen"
            className={`flex-1 flex items-center justify-center gap-1 text-[12px] font-extrabold rounded-lg py-1.5 transition-colors ${
              zeichenModus ? 'bg-[#F5C400] text-[#2C2C2C]' : 'text-[#2C2C2C] bg-[#2C2C2C]/6 hover:bg-[#F5C400]/20'
            }`}
          >
            <Pencil size={12} strokeWidth={2.5} /> Zeichnen
          </button>
        </div>

        {zeichenModus ? (
          <FreihandFlaeche
            onFertig={neueWaende => { setWaende(neueWaende); setZeichenModus(false) }}
            onAbbrechen={() => setZeichenModus(false)}
          />
        ) : (
          <>
            {/* Vorschau */}
            <GrundrissVorschau pfad={g.pfad} geschlossen={g.geschlossen} laengen={waende.filter(w => w.laenge > 0).map(w => w.laenge)} />

            {/* Status */}
            <div className={`flex items-center justify-between rounded-xl px-3 py-2 mb-4 text-[13px] font-bold ${
              g.geschlossen ? 'bg-[#EDFAF0] text-[#1A7A38]' : 'bg-amber-50 text-amber-700'
            }`}>
              <span>{g.geschlossen ? '✓ Form geschlossen' : luecke > 0 ? `Noch ${String(luecke).replace('.', ',')} m Lücke` : 'Form schließt noch nicht'}</span>
              <span className="font-extrabold">
                {g.geschlossen ? `${g.flaeche} m² · Umfang ${g.umfang} m` : `Umfang ${g.umfang} m`}
              </span>
            </div>

            {/* Wandliste */}
            <div className="flex flex-col gap-2 mb-3">
              {waende.map((wand, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-[#2C2C2C]/30 w-12 shrink-0">Wand {i + 1}</span>
                  {i > 0 ? (
                    <div className="flex gap-0.5 bg-[#2C2C2C]/5 rounded-lg p-0.5 shrink-0">
                      <button onClick={() => setTurn(i, 'L')} title="nach links"
                        className={`p-1.5 rounded-md ${wand.turn === 'L' ? 'bg-white text-[#2C2C2C] shadow-sm' : 'text-[#2C2C2C]/40'}`}>
                        <RotateCcw size={13} />
                      </button>
                      <button onClick={() => setTurn(i, 'R')} title="nach rechts"
                        className={`p-1.5 rounded-md ${wand.turn === 'R' ? 'bg-white text-[#2C2C2C] shadow-sm' : 'text-[#2C2C2C]/40'}`}>
                        <RotateCw size={13} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-[#2C2C2C]/25 shrink-0 w-[52px] text-center">Start →</span>
                  )}
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text" inputMode="decimal"
                      value={wand.laenge || ''}
                      onChange={e => setLaenge(i, e.target.value)}
                      placeholder="Länge"
                      className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-3 py-2 text-[#2C2C2C] font-bold text-base focus:outline-none focus:border-[#F5C400]"
                    />
                    <span className="text-[13px] font-semibold text-[#2C2C2C]/40 shrink-0">m</span>
                  </div>
                  <button onClick={() => removeWand(i)} disabled={waende.length <= 1}
                    className="p-1.5 text-[#2C2C2C]/20 hover:text-red-400 disabled:opacity-30 shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addWand}
              className="flex items-center justify-center gap-1.5 w-full border-2 border-dashed border-[#2C2C2C]/15 rounded-xl py-2.5 text-[13px] font-extrabold text-[#2C2C2C]/50 hover:border-[#F5C400] hover:text-[#2C2C2C] transition-colors mb-5">
              <Plus size={15} /> Wand hinzufügen
            </button>
          </>
        )}

        {!zeichenModus && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSave(waende.filter(w => w.laenge > 0))}
              disabled={!g.geschlossen}
              className="w-full bg-[#F5C400] text-[#2C2C2C] rounded-2xl py-3.5 font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              <Check size={17} strokeWidth={3} /> Übernehmen
            </button>
            <button onClick={onClose} className="w-full border-2 border-[#2C2C2C]/15 text-[#2C2C2C]/60 rounded-2xl py-3 font-extrabold text-[13px]">
              Abbrechen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── SVG-Vorschau ────────────────────────────────────────────────────────────
function GrundrissVorschau({ pfad, geschlossen, laengen }: { pfad: { x: number; y: number }[]; geschlossen: boolean; laengen: number[] }) {
  const W = 260, H = 170, PAD = 30
  if (pfad.length < 2) {
    return <div className="bg-[#F7F7F5] rounded-2xl h-[170px] mb-3 flex items-center justify-center text-[#2C2C2C]/30 text-sm font-semibold">Wände eingeben…</div>
  }
  const xs = pfad.map(p => p.x), ys = pfad.map(p => p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const spanX = maxX - minX || 1, spanY = maxY - minY || 1
  const scale = Math.min((W - 2 * PAD) / spanX, (H - 2 * PAD) / spanY)
  const offX = (W - spanX * scale) / 2, offY = (H - spanY * scale) / 2
  const tx = (x: number) => (x - minX) * scale + offX
  const ty = (y: number) => (y - minY) * scale + offY
  const punkteStr = pfad.map(p => `${tx(p.x)},${ty(p.y)}`).join(' ')
  const stroke = geschlossen ? '#1A7A38' : '#D97706'
  const start = pfad[0], ende = pfad[pfad.length - 1]

  return (
    <div className="bg-[#F7F7F5] rounded-2xl mb-3 flex items-center justify-center">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {geschlossen ? (
          <polygon points={punkteStr} fill="#F5C40022" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
        ) : (
          <>
            <polyline points={punkteStr} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {/* Lücke zwischen Ende und Start */}
            <line x1={tx(ende.x)} y1={ty(ende.y)} x2={tx(start.x)} y2={ty(start.y)} stroke="#D97706" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
          </>
        )}
        {/* Wand-Nummer + Länge je Segment (Mittelpunkt des Segments) — Sandy,
            2026-08-29: vorher stand hier nur die Meterzahl, ohne erkennbar zu
            machen, welche Wand aus der Liste unten gemeint ist ("Wand 1"
            dort, aber in der Zeichnung nur "4"). Jetzt "W1 · 4" — dieselbe
            Nummerierung wie in der Wandliste, direkt an der passenden
            Kante. */}
        {laengen.map((len, i) => {
          const a = pfad[i], b = pfad[i + 1]
          if (!a || !b) return null
          const mx = (tx(a.x) + tx(b.x)) / 2
          const my = (ty(a.y) + ty(b.y)) / 2
          const horizontal = Math.abs(a.y - b.y) < 0.01
          return (
            <text
              key={i}
              x={mx} y={my}
              dx={horizontal ? 0 : 7} dy={horizontal ? -3 : 3}
              textAnchor="middle"
              className="fill-[#2C2C2C]"
              style={{ fontSize: 9, fontWeight: 800 }}
            >
              {`W${i + 1} · ${String(len).replace('.', ',')}`}
            </text>
          )
        })}
        {/* Startpunkt */}
        <circle cx={tx(start.x)} cy={ty(start.y)} r={4} fill={stroke} />
      </svg>
    </div>
  )
}

// ── Freihand-Zeichenfläche (DC-038 Teil 2) ──────────────────────────────────
function FreihandFlaeche({
  onFertig,
  onAbbrechen,
}: {
  onFertig: (waende: Wand[]) => void
  onAbbrechen: () => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  // Quelle der Wahrheit während des Zeichnens ist die Ref (immer aktuell,
  // kein Risiko einer veralteten Closure bei pointerup) — `punkte` (State)
  // dient nur der Live-Vorschau während des Zeichnens.
  const punkteRef = useRef<Punkt[]>([])
  const zeichnetRef = useRef(false)
  const [punkte, setPunkte] = useState<Punkt[]>([])
  const [fehler, setFehler] = useState(false)

  function svgPunkt(e: React.PointerEvent<SVGSVGElement>): Punkt {
    const rect = svgRef.current!.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / rect.width * ZEICHEN_W,
      y: (e.clientY - rect.top) / rect.height * ZEICHEN_H,
    }
  }

  function pointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    zeichnetRef.current = true
    setFehler(false)
    punkteRef.current = [svgPunkt(e)]
    setPunkte(punkteRef.current)
  }
  function pointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!zeichnetRef.current) return
    punkteRef.current = [...punkteRef.current, svgPunkt(e)]
    setPunkte(punkteRef.current)
  }
  function pointerUp() {
    if (!zeichnetRef.current) return
    zeichnetRef.current = false
    const aktuellePunkte = punkteRef.current
    if (aktuellePunkte.length >= 3) {
      const waende = pfadZuWaenden(aktuellePunkte)
      if (waende.length >= 3) {
        onFertig(waende)
        return
      }
    }
    setFehler(true)
    punkteRef.current = []
    setPunkte([])
  }

  const pfadStr = punkte.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="mb-3">
      <div className="bg-[#F7F7F5] rounded-2xl overflow-hidden mb-2" style={{ touchAction: 'none' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${ZEICHEN_W} ${ZEICHEN_H}`}
          width="100%" height={ZEICHEN_H}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
        >
          {punkte.length > 1 && (
            <polyline points={pfadStr} fill="none" stroke="#D97706" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          )}
          {punkte.length === 0 && (
            <text x={ZEICHEN_W / 2} y={ZEICHEN_H / 2} textAnchor="middle" className="fill-[#2C2C2C]/35" style={{ fontSize: 12, fontWeight: 700 }}>
              Mit dem Finger die Raumform umranden
            </text>
          )}
        </svg>
      </div>
      {fehler && (
        <div className="text-[12px] font-bold text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-2">
          Nicht genug Ecken erkannt — nochmal etwas deutlicher zeichnen.
        </div>
      )}
      <button onClick={onAbbrechen} className="w-full text-[12px] font-bold text-[#2C2C2C]/40 hover:text-[#2C2C2C]/60 py-1">
        Zurück zu Vorlagen
      </button>
    </div>
  )
}
