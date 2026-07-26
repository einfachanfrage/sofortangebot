'use client'

import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import type { RueckfrageItem, SchnellAntwort } from '@/lib/mengen/rueckfragen-generator'

export interface RueckfragenAntwort {
  wert: number | number[]
  einheit: string
}

interface Props {
  fragen: RueckfrageItem[]
  onFertig: (antworten: Record<string, RueckfragenAntwort>) => void
  onUeberspringen: () => void
  onZurueck?: () => void
}

// ── Masse Einzel ────────────────────────────────────────────────────────────
function MasseEinzelInput({
  frage,
  antwort,
  onChange,
}: {
  frage: RueckfrageItem
  antwort: RueckfragenAntwort | null
  onChange: (a: RueckfragenAntwort) => void
}) {
  const current = Array.isArray(antwort?.wert) ? antwort!.wert as number[] : [0, 0]
  const [feld1, setFeld1] = useState(current[0] > 0 ? String(current[0]).replace('.', ',') : '')
  const [feld2, setFeld2] = useState(current[1] > 0 ? String(current[1]).replace('.', ',') : '')
  const [eingabeart, setEingabeart] = useState<'masse' | 'flaeche'>(
    antwort && !Array.isArray(antwort.wert) && antwort.einheit === 'm²' ? 'flaeche' : 'masse',
  )
  const [direkteFlaeche, setDirekteFlaeche] = useState(
    antwort && !Array.isArray(antwort.wert) && antwort.einheit === 'm²' ? String(antwort.wert).replace('.', ',') : '',
  )

  const frageText = frage.frage.toLowerCase()
  const istFenster = frageText.includes('fenster')
  const istTuer = frageText.includes('tür') || frageText.includes('tuer')
  const istOeffnung = istFenster || istTuer
  const label1 = istOeffnung ? 'Breite' : 'Länge'
  const label2 = istOeffnung ? 'Höhe' : 'Breite'
  const placeholder1 = istFenster ? '1,20' : istTuer ? '0,90' : '5,20'
  const placeholder2 = istFenster ? '1,00' : istTuer ? '2,10' : '4,80'

  const v1 = parseFloat(feld1.replace(',', '.')) || 0
  const v2 = parseFloat(feld2.replace(',', '.')) || 0
  const flaeche = v1 > 0 && v2 > 0 ? Math.round(v1 * v2 * 100) / 100 : null
  const umfang = !istOeffnung && v1 > 0 && v2 > 0 ? Math.round((2 * v1 + 2 * v2) * 100) / 100 : null

  useEffect(() => {
    if (v1 > 0 && v2 > 0) onChange({ wert: [v1, v2], einheit: 'm' })
  }, [v1, v2]) // eslint-disable-line react-hooks/exhaustive-deps

  function applySchnell(s: SchnellAntwort) {
    if (Array.isArray(s.wert) && s.wert.length === 2) {
      setFeld1(String(s.wert[0]).replace('.', ','))
      setFeld2(String(s.wert[1]).replace('.', ','))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Hint für Öffnungen */}
      {istOeffnung && (
        <div className="bg-[#2C2C2C]/5 rounded-xl px-4 py-3 text-[13px] text-[#2C2C2C]/60 font-semibold">
          Wenn du's nicht genau weißt — einfach &ldquo;Standard&rdquo; wählen, das passt für die meisten {istFenster ? 'Fenster' : 'Türen'}.
        </div>
      )}

      {/* Schnell-Chips */}
      {frage.schnell_antworten.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {frage.schnell_antworten.map(s => {
            const aktiv = Array.isArray(antwort?.wert) &&
              (antwort!.wert as number[])[0] === (Array.isArray(s.wert) ? s.wert[0] : 0) &&
              (antwort!.wert as number[])[1] === (Array.isArray(s.wert) ? s.wert[1] : 0)
            const istStandard = s.label.toLowerCase().startsWith('standard')
            return (
              <button
                key={s.label}
                onClick={() => applySchnell(s)}
                className={`text-[13px] font-extrabold px-3 py-1.5 rounded-full border-2 transition-colors ${
                  aktiv
                    ? 'bg-[#F5C400] border-[#F5C400] text-[#2C2C2C]'
                    : istStandard
                    ? 'bg-[#2C2C2C] border-[#2C2C2C] text-white'
                    : 'bg-white border-[#2C2C2C]/15 text-[#2C2C2C]/60'
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      )}

      {!istOeffnung && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-[#2C2C2C]/55">Was hast du aufgemessen?</div>
          <div className="grid grid-cols-2 rounded-xl bg-[#2C2C2C]/5 p-1">
            <button type="button" onClick={() => setEingabeart('masse')}
              className={`rounded-lg py-2 text-sm font-black ${eingabeart === 'masse' ? 'bg-white shadow-sm text-[#2C2C2C]' : 'text-[#2C2C2C]/45'}`}>
              Raummaße
            </button>
            <button type="button" onClick={() => setEingabeart('flaeche')}
              className={`rounded-lg py-2 text-sm font-black ${eingabeart === 'flaeche' ? 'bg-white shadow-sm text-[#2C2C2C]' : 'text-[#2C2C2C]/45'}`}>
              Fläche direkt
            </button>
          </div>
          <div className="text-xs font-semibold text-[#2C2C2C]/45">
            Raummaße = Länge × Breite. Für Wandflächen fragen wir danach zusätzlich die Raumhöhe.
            Kennst du bereits die fertige Wandfläche, sind keine weiteren Raummaße nötig.
          </div>
        </div>
      )}

      {/* Felder */}
      {(istOeffnung || eingabeart === 'masse') && <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[11px] font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-1">{label1}</div>
          <div className="flex items-center gap-2 bg-white border-2 border-[#2C2C2C]/15 rounded-xl px-3 py-2.5 focus-within:border-[#F5C400]">
            <input
              type="number"
              inputMode="decimal"
              placeholder={placeholder1}
              value={feld1}
              onChange={e => setFeld1(e.target.value)}
              className="flex-1 font-bold text-[#2C2C2C] text-lg bg-transparent focus:outline-none w-0"
            />
            <span className="text-[#2C2C2C]/40 font-semibold text-sm shrink-0">m</span>
          </div>
        </div>
        <div className="text-[#2C2C2C]/30 font-black text-xl mt-4">×</div>
        <div className="flex-1">
          <div className="text-[11px] font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-1">{label2}</div>
          <div className="flex items-center gap-2 bg-white border-2 border-[#2C2C2C]/15 rounded-xl px-3 py-2.5 focus-within:border-[#F5C400]">
            <input
              type="number"
              inputMode="decimal"
              placeholder={placeholder2}
              value={feld2}
              onChange={e => setFeld2(e.target.value)}
              className="flex-1 font-bold text-[#2C2C2C] text-lg bg-transparent focus:outline-none w-0"
            />
            <span className="text-[#2C2C2C]/40 font-semibold text-sm shrink-0">m</span>
          </div>
        </div>
      </div>}

      {!istOeffnung && eingabeart === 'flaeche' && (
        <div>
          <div className="text-[11px] font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-1">
            Wandfläche oder Boden-/Deckenfläche
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-[#2C2C2C]/15 rounded-xl px-3 py-2.5 focus-within:border-[#F5C400]">
            <input type="number" inputMode="decimal" autoFocus placeholder="z. B. 18"
              value={direkteFlaeche}
              onChange={e => {
                setDirekteFlaeche(e.target.value)
                const wert = parseFloat(e.target.value.replace(',', '.'))
                if (wert > 0) onChange({ wert, einheit: 'm²' })
              }}
              className="flex-1 font-bold text-[#2C2C2C] text-lg bg-transparent focus:outline-none w-0" />
            <span className="text-[#2C2C2C]/40 font-semibold text-sm">m²</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-[#2C2C2C]/45">
            Bei Wandarbeiten gilt der Wert als fertige Wandfläche. Bei Boden- oder Deckenarbeiten gilt er als Boden-/Deckenfläche.
          </div>
        </div>
      )}

      {/* Live-Vorschau */}
      {eingabeart === 'masse' && flaeche !== null && (
        <div className="bg-[#F5C400]/15 border border-[#F5C400]/40 rounded-xl px-4 py-3">
          <div className="font-black text-[#2C2C2C] text-sm">✓ Fläche: {String(flaeche).replace('.', ',')} m²</div>
          {umfang !== null && (
            <div className="text-[#2C2C2C]/60 font-semibold text-xs mt-0.5">Umfang: {String(umfang).replace('.', ',')} lfm</div>
          )}
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
  antwort: RueckfragenAntwort | null
  onChange: (a: RueckfragenAntwort) => void
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
  antwort: RueckfragenAntwort | null
  onChange: (a: RueckfragenAntwort) => void
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
  antwort: RueckfragenAntwort | null
  onChange: (a: RueckfragenAntwort) => void
}) {
  const [freitext, setFreitext] = useState('')
  const [zeigeFreieAnzahl, setZeigeFreieAnzahl] = useState(false)

  if (frage.schnell_antworten.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 bg-white border-2 border-[#2C2C2C]/15 rounded-xl px-4 py-3 focus-within:border-[#F5C400]">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Wert eingeben"
            autoFocus
            value={freitext}
            onChange={e => {
              setFreitext(e.target.value)
              const v = parseFloat(e.target.value.replace(',', '.'))
              if (v > 0) onChange({ wert: v, einheit: frage.einheit ?? 'Stück' })
            }}
            className="flex-1 font-bold text-[#2C2C2C] text-lg bg-transparent focus:outline-none"
          />
          {frage.einheit && <span className="text-[#2C2C2C]/40 font-semibold shrink-0">{frage.einheit}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2">
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
        <button onClick={() => setZeigeFreieAnzahl(true)}
          className={`rounded-2xl py-5 font-black text-base transition-colors border-2 ${zeigeFreieAnzahl ? 'bg-[#F5C400] border-[#F5C400]' : 'bg-white border-[#2C2C2C]/8'}`}>
          Mehr …
        </button>
      </div>
      {zeigeFreieAnzahl && (
        <div className="flex items-center gap-2 bg-white border-2 border-[#F5C400] rounded-xl px-4 py-3">
          <input type="number" inputMode="numeric" min="0" autoFocus placeholder="Beliebige Anzahl"
            value={freitext}
            onChange={e => {
              setFreitext(e.target.value)
              const wert = Number(e.target.value)
              if (Number.isInteger(wert) && wert >= 0) onChange({ wert, einheit: 'Stück' })
            }}
            className="flex-1 font-bold text-[#2C2C2C] text-lg bg-transparent focus:outline-none" />
          <span className="text-[#2C2C2C]/40 font-semibold">Stück</span>
        </div>
      )}
    </div>
  )
}

// ── Haupt-Screen ────────────────────────────────────────────────────────────
export default function RueckfragenScreen({ fragen, onFertig, onUeberspringen, onZurueck }: Props) {
  const [aktuelleIdx, setAktuelleIdx] = useState(0)
  const [antworten, setAntworten] = useState<Record<string, RueckfragenAntwort>>({})
  const [fertig, setFertig] = useState(false)

  const flaechenRaumIds = new Set(Object.entries(antworten)
    .filter(([id, antwort]) => /^masse_/.test(id) && antwort.einheit === 'm²' && !Array.isArray(antwort.wert))
    .map(([id]) => id.replace(/^masse_/, '')))
  const sichtbareFragen = fragen.filter(item => ![...flaechenRaumIds].some(raumId =>
    item.id === `hoehe_${raumId}` || item.id === `tueren_anzahl_${raumId}` || item.id === `fenster_anzahl_${raumId}`
  ))
  const frage = sichtbareFragen[Math.min(aktuelleIdx, sichtbareFragen.length - 1)]
  const antwort = antworten[frage.id] ?? null
  const hatAntwort = antwort !== null

  function setAntwort(a: RueckfragenAntwort) {
    setAntworten(prev => ({ ...prev, [frage.id]: a }))
  }

  async function weiter() {
    if (aktuelleIdx < sichtbareFragen.length - 1) {
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
          <button onClick={onZurueck ?? onUeberspringen} className="text-white/50 text-sm font-semibold">← Zurück</button>
          <button onClick={onUeberspringen} className="text-white/40 text-sm font-semibold">Überspringen</button>
        </div>
        <div className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
          Kurze Rückfrage {aktuelleIdx + 1} von {sichtbareFragen.length}
        </div>
        {/* Fortschrittsbalken */}
        <div className="flex gap-1.5 mb-3">
          {sichtbareFragen.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= aktuelleIdx ? 'bg-[#F5C400]' : 'bg-white/15'}`}
            />
          ))}
        </div>
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
        {frage.typ === 'ja_nein' && (
          <div className="flex flex-col gap-3">
            {(frage.schnell_antworten.length > 0
              ? frage.schnell_antworten.map(s => ({ label: s.label, wert: s.wert as number }))
              : [{ label: 'Ja', wert: 1 }, { label: 'Nein', wert: 0 }]
            ).map(opt => {
              const aktiv = !Array.isArray(antwort?.wert) && antwort?.wert === opt.wert
              return (
                <button
                  key={opt.label}
                  onClick={() => setAntwort({ wert: opt.wert, einheit: 'bool' })}
                  className={`rounded-2xl py-5 font-black text-xl transition-colors border-2 ${aktiv ? 'bg-[#F5C400] border-[#F5C400] text-[#2C2C2C]' : 'bg-white border-[#2C2C2C]/8 text-[#2C2C2C]'}`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}
        {(frage.typ === 'anzahl' || frage.typ === 'laenge' || frage.typ === 'flaeche_einzel') && (
          <AnzahlInput frage={frage} antwort={antwort} onChange={setAntwort} />
        )}
        {/* Fallback: unbekannter Typ → Ja/Nein */}
        {frage.typ !== 'masse_einzel' && frage.typ !== 'masse_mehrere' && frage.typ !== 'hoehe' &&
         frage.typ !== 'ja_nein' && frage.typ !== 'anzahl' && frage.typ !== 'laenge' && frage.typ !== 'flaeche_einzel' && (
          <div className="flex flex-col gap-3">
            {[{ label: 'Ja', wert: 1 }, { label: 'Nein', wert: 0 }].map(opt => {
              const aktiv = !Array.isArray(antwort?.wert) && antwort?.wert === opt.wert
              return (
                <button key={opt.label} onClick={() => setAntwort({ wert: opt.wert, einheit: 'bool' })}
                  className={`rounded-2xl py-5 font-black text-xl transition-colors border-2 ${aktiv ? 'bg-[#F5C400] border-[#F5C400] text-[#2C2C2C]' : 'bg-white border-[#2C2C2C]/8 text-[#2C2C2C]'}`}>
                  {opt.label}
                </button>
              )
            })}
          </div>
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
