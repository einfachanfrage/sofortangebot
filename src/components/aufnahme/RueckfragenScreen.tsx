'use client'

import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import type { RueckfrageItem, SchnellAntwort } from '@/lib/mengen/rueckfragen-generator'

interface Antwort {
  wert: number | number[]
  einheit: string
}

interface Props {
  fragen: RueckfrageItem[]
  onFertig: (antworten: Record<string, Antwort>) => void
  onUeberspringen: () => void
}

// ── Masse Einzel ────────────────────────────────────────────────────────────
function MasseEinzelInput({
  frage,
  antwort,
  onChange,
}: {
  frage: RueckfrageItem
  antwort: Antwort | null
  onChange: (a: Antwort) => void
}) {
  const current = Array.isArray(antwort?.wert) ? antwort!.wert as number[] : [0, 0]
  const [laenge, setLaenge] = useState(current[0] > 0 ? String(current[0]).replace('.', ',') : '')
  const [breite, setBreite] = useState(current[1] > 0 ? String(current[1]).replace('.', ',') : '')

  const l = parseFloat(laenge.replace(',', '.')) || 0
  const b = parseFloat(breite.replace(',', '.')) || 0
  const flaeche = l > 0 && b > 0 ? Math.round(l * b * 100) / 100 : null
  const umfang = l > 0 && b > 0 ? Math.round((2 * l + 2 * b) * 100) / 100 : null

  useEffect(() => {
    if (l > 0 && b > 0) onChange({ wert: [l, b], einheit: 'm' })
  }, [l, b]) // eslint-disable-line react-hooks/exhaustive-deps

  function applySchnell(s: SchnellAntwort) {
    if (Array.isArray(s.wert) && s.wert.length === 2) {
      setLaenge(String(s.wert[0]).replace('.', ','))
      setBreite(String(s.wert[1]).replace('.', ','))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Schnell-Chips */}
      <div className="flex flex-wrap gap-2">
        {frage.schnell_antworten.map(s => {
          const aktiv = Array.isArray(antwort?.wert) &&
            (antwort!.wert as number[])[0] === (Array.isArray(s.wert) ? s.wert[0] : 0) &&
            (antwort!.wert as number[])[1] === (Array.isArray(s.wert) ? s.wert[1] : 0)
          return (
            <button
              key={s.label}
              onClick={() => applySchnell(s)}
              className={`text-[13px] font-extrabold px-3 py-1.5 rounded-full border-2 transition-colors ${aktiv ? 'bg-[#F5C400] border-[#F5C400] text-[#2C2C2C]' : 'bg-white border-[#2C2C2C]/15 text-[#2C2C2C]/60'}`}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Felder Länge × Breite */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[11px] font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-1">Länge</div>
          <div className="flex items-center gap-2 bg-white border-2 border-[#2C2C2C]/15 rounded-xl px-3 py-2.5 focus-within:border-[#F5C400]">
            <input
              type="number"
              inputMode="decimal"
              placeholder="5,20"
              value={laenge}
              onChange={e => setLaenge(e.target.value)}
              className="flex-1 font-bold text-[#2C2C2C] text-lg bg-transparent focus:outline-none w-0"
            />
            <span className="text-[#2C2C2C]/40 font-semibold text-sm shrink-0">m</span>
          </div>
        </div>
        <div className="text-[#2C2C2C]/30 font-black text-xl mt-4">×</div>
        <div className="flex-1">
          <div className="text-[11px] font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-1">Breite</div>
          <div className="flex items-center gap-2 bg-white border-2 border-[#2C2C2C]/15 rounded-xl px-3 py-2.5 focus-within:border-[#F5C400]">
            <input
              type="number"
              inputMode="decimal"
              placeholder="4,80"
              value={breite}
              onChange={e => setBreite(e.target.value)}
              className="flex-1 font-bold text-[#2C2C2C] text-lg bg-transparent focus:outline-none w-0"
            />
            <span className="text-[#2C2C2C]/40 font-semibold text-sm shrink-0">m</span>
          </div>
        </div>
      </div>

      {/* Live-Vorschau */}
      {flaeche !== null && (
        <div className="bg-[#F5C400]/15 border border-[#F5C400]/40 rounded-xl px-4 py-3">
          <div className="font-black text-[#2C2C2C] text-sm">✓ Fläche: {String(flaeche).replace('.', ',')} m²</div>
          <div className="text-[#2C2C2C]/60 font-semibold text-xs mt-0.5">Umfang: {String(umfang).replace('.', ',')} lfm</div>
        </div>
      )}
    </div>
  )
}

// ── Masse Mehrere ───────────────────────────────────────────────────────────
function MasseMehrereInput({
  frage,
  antwort,
  onChange,
}: {
  frage: RueckfrageItem
  antwort: Antwort | null
  onChange: (a: Antwort) => void
}) {
  const count = frage.plural_count ?? 2
  const flat = Array.isArray(antwort?.wert) ? antwort!.wert as number[] : []
  const [werte, setWerte] = useState<string[][]>(
    Array.from({ length: count }, (_, i) => [
      flat[i * 2] ? String(flat[i * 2]).replace('.', ',') : '',
      flat[i * 2 + 1] ? String(flat[i * 2 + 1]).replace('.', ',') : '',
    ])
  )

  function update(zimmer: number, idx: number, val: string) {
    const next = werte.map((w, i) => i === zimmer ? w.map((v, j) => j === idx ? val : v) : w)
    setWerte(next)
    const flat: number[] = []
    for (const w of next) {
      flat.push(parseFloat(w[0].replace(',', '.')) || 0)
      flat.push(parseFloat(w[1].replace(',', '.')) || 0)
    }
    if (flat.some(v => v > 0)) onChange({ wert: flat, einheit: 'm' })
  }

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, i) => {
        const l = parseFloat(werte[i][0].replace(',', '.')) || 0
        const b = parseFloat(werte[i][1].replace(',', '.')) || 0
        const fl = l > 0 && b > 0 ? Math.round(l * b * 100) / 100 : null
        return (
          <div key={i} className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/8">
            <div className="text-[11px] font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-2">Zimmer {i + 1}</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 bg-[#F7F7F5] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F5C400]">
                <input type="number" inputMode="decimal" placeholder="4,00" value={werte[i][0]}
                  onChange={e => update(i, 0, e.target.value)}
                  className="w-0 flex-1 font-bold text-[#2C2C2C] bg-transparent focus:outline-none" />
                <span className="text-[#2C2C2C]/40 font-semibold text-sm">m</span>
              </div>
              <span className="text-[#2C2C2C]/30 font-black">×</span>
              <div className="flex items-center gap-2 flex-1 bg-[#F7F7F5] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F5C400]">
                <input type="number" inputMode="decimal" placeholder="3,50" value={werte[i][1]}
                  onChange={e => update(i, 1, e.target.value)}
                  className="w-0 flex-1 font-bold text-[#2C2C2C] bg-transparent focus:outline-none" />
                <span className="text-[#2C2C2C]/40 font-semibold text-sm">m</span>
              </div>
            </div>
            {fl !== null && (
              <div className="text-xs font-semibold text-[#2C2C2C]/40 mt-1.5">= {String(fl).replace('.', ',')} m²</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Höhe ────────────────────────────────────────────────────────────────────
function HoeheInput({
  frage,
  antwort,
  onChange,
}: {
  frage: RueckfrageItem
  antwort: Antwort | null
  onChange: (a: Antwort) => void
}) {
  const [andereHoehe, setAndereHoehe] = useState('')
  const [zeigeAndere, setZeigeAndere] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      {frage.schnell_antworten.map(s => {
        const aktiv = !Array.isArray(antwort?.wert) && antwort?.wert === s.wert
        const istHaeufigste = s.wert === 2.6
        return (
          <button
            key={s.label}
            onClick={() => { onChange({ wert: s.wert as number, einheit: 'm' }); setZeigeAndere(false) }}
            className={`w-full rounded-2xl py-4 font-extrabold text-base transition-colors border-2 ${
              aktiv
                ? 'bg-[#F5C400] border-[#F5C400] text-[#2C2C2C]'
                : istHaeufigste
                ? 'bg-white border-[#2C2C2C]/20 text-[#2C2C2C] shadow-sm'
                : 'bg-white border-[#2C2C2C]/8 text-[#2C2C2C]/70'
            }`}
          >
            {s.label}{istHaeufigste && !aktiv ? ' ← häufigste Höhe' : ''}
          </button>
        )
      })}
      <button
        onClick={() => setZeigeAndere(v => !v)}
        className={`w-full rounded-2xl py-4 font-extrabold text-base border-2 transition-colors ${zeigeAndere ? 'border-[#F5C400] text-[#2C2C2C]' : 'border-[#2C2C2C]/8 text-[#2C2C2C]/40'} bg-white`}
      >
        Andere Höhe eingeben
      </button>
      {zeigeAndere && (
        <div className="flex items-center gap-2 bg-white border-2 border-[#F5C400] rounded-xl px-4 py-3 mt-1">
          <input
            type="number"
            inputMode="decimal"
            placeholder="2,70"
            autoFocus
            value={andereHoehe}
            onChange={e => {
              setAndereHoehe(e.target.value)
              const v = parseFloat(e.target.value.replace(',', '.'))
              if (v > 0) onChange({ wert: v, einheit: 'm' })
            }}
            className="flex-1 font-bold text-[#2C2C2C] text-lg bg-transparent focus:outline-none"
          />
          <span className="text-[#2C2C2C]/40 font-semibold">m</span>
        </div>
      )}
    </div>
  )
}

// ── Anzahl ──────────────────────────────────────────────────────────────────
function AnzahlInput({
  frage,
  antwort,
  onChange,
}: {
  frage: RueckfrageItem
  antwort: Antwort | null
  onChange: (a: Antwort) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {frage.schnell_antworten.map(s => {
        const aktiv = !Array.isArray(antwort?.wert) && antwort?.wert === s.wert
        return (
          <button
            key={s.label}
            onClick={() => onChange({ wert: s.wert as number, einheit: 'Stück' })}
            className={`rounded-2xl py-5 font-black text-xl transition-colors border-2 ${aktiv ? 'bg-[#F5C400] border-[#F5C400] text-[#2C2C2C]' : 'bg-white border-[#2C2C2C]/8 text-[#2C2C2C]'}`}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Haupt-Screen ────────────────────────────────────────────────────────────
export default function RueckfragenScreen({ fragen, onFertig, onUeberspringen }: Props) {
  const [aktuelleIdx, setAktuelleIdx] = useState(0)
  const [antworten, setAntworten] = useState<Record<string, Antwort>>({})
  const [fertig, setFertig] = useState(false)

  const frage = fragen[aktuelleIdx]
  const antwort = antworten[frage.id] ?? null
  const hatAntwort = antwort !== null

  function setAntwort(a: Antwort) {
    setAntworten(prev => ({ ...prev, [frage.id]: a }))
  }

  async function weiter() {
    if (aktuelleIdx < fragen.length - 1) {
      setAktuelleIdx(i => i + 1)
    } else {
      setFertig(true)
      await new Promise(r => setTimeout(r, 500))
      onFertig(antworten)
    }
  }

  if (fertig) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col items-center justify-center gap-4 px-5">
        <div className="text-6xl animate-bounce">✓</div>
        <div className="font-black text-[#2C2C2C] text-xl text-center">Mengen werden berechnet...</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col">
      {/* Header */}
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onUeberspringen} className="text-white/50 text-sm font-semibold">← Zurück</button>
          <button onClick={onUeberspringen} className="text-white/40 text-sm font-semibold">Überspringen</button>
        </div>
        <div className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
          Kurze Rückfrage {fragen.length > 1 ? `${aktuelleIdx + 1} von ${fragen.length}` : ''}
        </div>
        {/* Fortschrittsbalken */}
        {fragen.length > 1 && (
          <div className="flex gap-1.5 mb-3">
            {fragen.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= aktuelleIdx ? 'bg-[#F5C400]' : 'bg-white/15'}`}
              />
            ))}
          </div>
        )}
        {/* Kontext-Chip */}
        <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 mb-3">
          <span className="text-[#F5C400] text-xs">💬</span>
          <span className="text-white/60 text-xs font-semibold italic">&ldquo;{frage.kontext}&rdquo;</span>
        </div>
        <h1 className="font-syne font-extrabold text-white text-[22px] leading-tight">
          {frage.frage}
        </h1>
      </div>

      {/* Inhalt */}
      <div className="flex-1 px-5 py-5 overflow-y-auto">
        {frage.typ === 'masse_einzel' && (
          <MasseEinzelInput frage={frage} antwort={antwort} onChange={setAntwort} />
        )}
        {frage.typ === 'masse_mehrere' && (
          <MasseMehrereInput frage={frage} antwort={antwort} onChange={setAntwort} />
        )}
        {frage.typ === 'hoehe' && (
          <HoeheInput frage={frage} antwort={antwort} onChange={setAntwort} />
        )}
        {(frage.typ === 'anzahl' || frage.typ === 'laenge' || frage.typ === 'flaeche_einzel') && (
          <AnzahlInput frage={frage} antwort={antwort} onChange={setAntwort} />
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 pt-3 bg-white border-t border-[#2C2C2C]/8 flex flex-col gap-2">
        <button
          onClick={weiter}
          disabled={!hatAntwort}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-extrabold text-[16px] rounded-2xl py-4 disabled:opacity-40 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Weiter <ChevronRight size={18} strokeWidth={3} />
        </button>
        <button
          onClick={onUeberspringen}
          className="text-center text-[#2C2C2C]/30 font-semibold text-[13px] py-1"
        >
          Überspringen — ich trage die Menge danach manuell ein
        </button>
      </div>
    </div>
  )
}
