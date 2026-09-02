'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import type { RueckfrageItem, RueckfrageTyp, SchnellAntwort } from '@/lib/mengen/rueckfragen-generator'

export interface RueckfragenAntwort {
  wert: number | number[]
  einheit: string
  /**
   * DC-035: Optionale Maße EINER abweichend großen Öffnung, wenn die Frage
   * `ausnahme_masse` anbietet (Terrassentür, Panoramafenster). Die
   * Antwort-Verarbeitung macht daraus zwei Öffnungs-Einträge: die Mehrheit
   * über die Standard-Annahme, diese eine über ihre echten Maße.
   */
  ausnahme?: { breite: number; hoehe: number } | null
}

interface Props {
  fragen: RueckfrageItem[]
  // PM-007: `null` = bewusst übersprungen. Der Wert MUSS mitgeschickt werden,
  // sonst hält die Berechnung die Frage für unbeantwortet und stellt sie
  // erneut — genau die Endlosschleife, in der Sandy festhing.
  onFertig: (antworten: Record<string, RueckfragenAntwort | null>) => void
  onUeberspringen: () => void
  onZurueck?: () => void
}

// ── Masse Einzel ────────────────────────────────────────────────────────────
// (unverändert gegenüber der Vorversion — die Eingabelogik ist inhaltlich gut,
// DC-025 ändert nur das Gerüst drumherum, nicht diese Bausteine.)
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
    antwort?.einheit === 'flaechen_m2' || (antwort && !Array.isArray(antwort.wert) && antwort.einheit === 'm²')
      ? 'flaeche'
      : 'masse',
  )
  const direkteWerte = antwort?.einheit === 'flaechen_m2' && Array.isArray(antwort.wert)
    ? antwort.wert
    : [!Array.isArray(antwort?.wert) && antwort?.einheit === 'm²' ? antwort.wert : 0, 0]
  const [direkteWandflaeche, setDirekteWandflaeche] = useState(
    direkteWerte[0] ? String(direkteWerte[0]).replace('.', ',') : '',
  )
  const [direkteBodenflaeche, setDirekteBodenflaeche] = useState(
    direkteWerte[1] ? String(direkteWerte[1]).replace('.', ',') : '',
  )

  const frageText = frage.frage.toLowerCase()
  const istFenster = frageText.includes('fenster')
  const istTuer = frageText.includes('tür') || frageText.includes('tuer')
  const istOeffnung = istFenster || istTuer
  const istReineBodenfrage = frage.id.startsWith('masse_boden_')
  const label1 = istOeffnung ? 'Breite' : 'Länge'
  const label2 = istOeffnung ? 'Höhe' : 'Breite'
  const placeholder1 = istFenster ? '1,20' : istTuer ? '0,90' : '5,20'
  const placeholder2 = istFenster ? '1,00' : istTuer ? '2,10' : '4,80'

  const v1 = parseFloat(feld1.replace(',', '.')) || 0
  const v2 = parseFloat(feld2.replace(',', '.')) || 0
  const flaeche = v1 > 0 && v2 > 0 ? Math.round(v1 * v2 * 100) / 100 : null
  const umfang = !istOeffnung && v1 > 0 && v2 > 0 ? Math.round((2 * v1 + 2 * v2) * 100) / 100 : null

  function commitMasse(nv1: number, nv2: number) {
    if (nv1 > 0 && nv2 > 0) onChange({ wert: [nv1, nv2], einheit: 'm' })
  }

  function applySchnell(s: SchnellAntwort) {
    if (Array.isArray(s.wert) && s.wert.length === 2) {
      setFeld1(String(s.wert[0]).replace('.', ','))
      setFeld2(String(s.wert[1]).replace('.', ','))
      commitMasse(s.wert[0], s.wert[1])
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Hint für Öffnungen */}
      {istOeffnung && (
        <div className="bg-anthracite/5 rounded-xl px-4 py-3 text-[13px] text-anthracite/60 font-semibold">
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
                    ? 'bg-yellow border-yellow text-anthracite'
                    : istStandard
                    ? 'bg-anthracite border-anthracite text-white'
                    : 'bg-white border-anthracite/15 text-anthracite/60'
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
          <div className="text-xs font-bold text-anthracite/55">Wie möchtest du die Menge angeben?</div>
          <div className="grid grid-cols-2 rounded-xl bg-anthracite/5 p-1">
            <button type="button" onClick={() => setEingabeart('masse')}
              className={`rounded-lg py-2 text-sm font-black ${eingabeart === 'masse' ? 'bg-white shadow-sm text-anthracite' : 'text-anthracite/45'}`}>
              Mit Raummaßen
            </button>
            <button type="button" onClick={() => setEingabeart('flaeche')}
              className={`rounded-lg py-2 text-sm font-black ${eingabeart === 'flaeche' ? 'bg-white shadow-sm text-anthracite' : 'text-anthracite/45'}`}>
              Flächen direkt
            </button>
          </div>
          <div className="text-xs font-semibold text-anthracite/45">
            Raummaße berechnen wir aus Länge, Breite und Raumhöhe. Wenn du fertige Flächen kennst,
            kannst du Wandfläche und Boden-/Deckenfläche getrennt eintragen.
          </div>
        </div>
      )}

      {/* Felder */}
      {(istOeffnung || eingabeart === 'masse') && <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[11px] font-black text-anthracite/40 uppercase tracking-wide mb-1">{label1}</div>
          <div className="flex items-center gap-2 bg-white border-2 border-anthracite/15 rounded-xl px-3 py-2.5 focus-within:border-yellow">
            <input
              type="number"
              inputMode="decimal"
              placeholder={placeholder1}
              value={feld1}
              onChange={e => { setFeld1(e.target.value); commitMasse(parseFloat(e.target.value.replace(',', '.')) || 0, v2) }}
              className="flex-1 font-bold text-anthracite text-lg bg-transparent focus:outline-none w-0"
            />
            <span className="text-anthracite/40 font-semibold text-sm shrink-0">m</span>
          </div>
        </div>
        <div className="text-anthracite/30 font-black text-xl mt-4">×</div>
        <div className="flex-1">
          <div className="text-[11px] font-black text-anthracite/40 uppercase tracking-wide mb-1">{label2}</div>
          <div className="flex items-center gap-2 bg-white border-2 border-anthracite/15 rounded-xl px-3 py-2.5 focus-within:border-yellow">
            <input
              type="number"
              inputMode="decimal"
              placeholder={placeholder2}
              value={feld2}
              onChange={e => { setFeld2(e.target.value); commitMasse(v1, parseFloat(e.target.value.replace(',', '.')) || 0) }}
              className="flex-1 font-bold text-anthracite text-lg bg-transparent focus:outline-none w-0"
            />
            <span className="text-anthracite/40 font-semibold text-sm shrink-0">m</span>
          </div>
        </div>
      </div>}

      {!istOeffnung && eingabeart === 'flaeche' && (
        <div className="flex flex-col gap-3">
          {!istReineBodenfrage && (
            <DirekteFlaecheFeld
              label="Fertige Wandfläche"
              hilfe="Für Streichen, Spachteln, Grundieren und Tapezieren. Türen und Fenster sind darin bereits berücksichtigt."
              value={direkteWandflaeche}
              autoFocus
              onChange={value => {
                setDirekteWandflaeche(value)
                const wand = parseFloat(value.replace(',', '.')) || 0
                const boden = parseFloat(direkteBodenflaeche.replace(',', '.')) || 0
                if (wand > 0 || boden > 0) onChange({ wert: [wand, boden], einheit: 'flaechen_m2' })
              }}
            />
          )}
          <DirekteFlaecheFeld
            label="Boden- / Deckenfläche"
            hilfe="Nur für Bodenarbeiten, Bodenschutz oder ausdrücklich beauftragte Deckenarbeiten."
            value={direkteBodenflaeche}
            autoFocus={istReineBodenfrage}
            onChange={value => {
              setDirekteBodenflaeche(value)
              const wand = parseFloat(direkteWandflaeche.replace(',', '.')) || 0
              const boden = parseFloat(value.replace(',', '.')) || 0
              if (wand > 0 || boden > 0) onChange({ wert: [wand, boden], einheit: 'flaechen_m2' })
            }}
          />
          <div className="rounded-xl bg-anthracite/5 px-3 py-2 text-xs font-semibold text-anthracite/55">
            Du kannst nur eine oder beide Flächen eintragen. Leere Felder werden nicht geschätzt.
          </div>
        </div>
      )}

      {/* Live-Vorschau */}
      {eingabeart === 'masse' && flaeche !== null && (
        <div className="bg-yellow/15 border border-yellow/40 rounded-xl px-4 py-3">
          <div className="font-black text-anthracite text-sm">✓ Fläche: {String(flaeche).replace('.', ',')} m²</div>
          {umfang !== null && (
            <div className="text-anthracite/60 font-semibold text-xs mt-0.5">Umfang: {String(umfang).replace('.', ',')} lfm</div>
          )}
        </div>
      )}
    </div>
  )
}

function DirekteFlaecheFeld({
  label,
  hilfe,
  value,
  onChange,
  autoFocus = false,
}: {
  label: string
  hilfe: string
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}) {
  return (
    <label className="block rounded-2xl border border-anthracite/10 bg-white p-4 focus-within:border-yellow focus-within:ring-2 focus-within:ring-yellow/15">
      <span className="mb-2 block text-sm font-black text-anthracite">{label}</span>
      <span className="flex items-center gap-2 rounded-xl bg-bg px-3 py-2.5">
        <input
          type="number"
          inputMode="decimal"
          autoFocus={autoFocus}
          placeholder="z. B. 38"
          value={value}
          onChange={event => onChange(event.target.value)}
          className="w-0 flex-1 bg-transparent text-lg font-bold text-anthracite focus:outline-none"
        />
        <span className="text-sm font-semibold text-anthracite/40">m²</span>
      </span>
      <span className="mt-2 block text-xs font-semibold leading-relaxed text-anthracite/45">{hilfe}</span>
    </label>
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
    const flatNext: number[] = []
    for (const w of next) {
      flatNext.push(parseFloat(w[0].replace(',', '.')) || 0)
      flatNext.push(parseFloat(w[1].replace(',', '.')) || 0)
    }
    if (flatNext.some(v => v > 0)) onChange({ wert: flatNext, einheit: 'm' })
  }

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, i) => {
        const l = parseFloat(werte[i][0].replace(',', '.')) || 0
        const b = parseFloat(werte[i][1].replace(',', '.')) || 0
        const fl = l > 0 && b > 0 ? Math.round(l * b * 100) / 100 : null
        return (
          <div key={i} className="bg-bg rounded-2xl p-4 border border-anthracite/8">
            <div className="text-[11px] font-black text-anthracite/40 uppercase tracking-wide mb-2">Zimmer {i + 1}</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-yellow">
                <input type="number" inputMode="decimal" placeholder="4,00" value={werte[i][0]}
                  onChange={e => update(i, 0, e.target.value)}
                  className="w-0 flex-1 font-bold text-anthracite bg-transparent focus:outline-none" />
                <span className="text-anthracite/40 font-semibold text-sm">m</span>
              </div>
              <span className="text-anthracite/30 font-black">×</span>
              <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-yellow">
                <input type="number" inputMode="decimal" placeholder="3,50" value={werte[i][1]}
                  onChange={e => update(i, 1, e.target.value)}
                  className="w-0 flex-1 font-bold text-anthracite bg-transparent focus:outline-none" />
                <span className="text-anthracite/40 font-semibold text-sm">m</span>
              </div>
            </div>
            {fl !== null && (
              <div className="text-xs font-semibold text-anthracite/40 mt-1.5">= {String(fl).replace('.', ',')} m²</div>
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
                ? 'bg-yellow border-yellow text-anthracite'
                : istHaeufigste
                ? 'bg-white border-anthracite/20 text-anthracite shadow-sm'
                : 'bg-white border-anthracite/8 text-anthracite/70'
            }`}
          >
            {s.label}{istHaeufigste && !aktiv ? ' ← häufigste Höhe' : ''}
          </button>
        )
      })}
      <button
        onClick={() => setZeigeAndere(v => !v)}
        className={`w-full rounded-2xl py-4 font-extrabold text-base border-2 transition-colors ${zeigeAndere ? 'border-yellow text-anthracite' : 'border-anthracite/8 text-anthracite/40'} bg-white`}
      >
        Andere Höhe eingeben
      </button>
      {zeigeAndere && (
        <div className="flex items-center gap-2 bg-white border-2 border-yellow rounded-xl px-4 py-3 mt-1">
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
            className="flex-1 font-bold text-anthracite text-lg bg-transparent focus:outline-none"
          />
          <span className="text-anthracite/40 font-semibold">m</span>
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
        <div className="flex items-center gap-2 bg-white border-2 border-anthracite/15 rounded-xl px-4 py-3 focus-within:border-yellow">
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
            className="flex-1 font-bold text-anthracite text-lg bg-transparent focus:outline-none"
          />
          {frage.einheit && <span className="text-anthracite/40 font-semibold shrink-0">{frage.einheit}</span>}
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
            className={`rounded-2xl py-5 font-black text-xl transition-colors border-2 ${aktiv ? 'bg-yellow border-yellow text-anthracite' : 'bg-white border-anthracite/8 text-anthracite'}`}
          >
            {s.label}
          </button>
        )
      })}
        <button onClick={() => setZeigeFreieAnzahl(true)}
          className={`rounded-2xl py-5 font-black text-base transition-colors border-2 ${zeigeFreieAnzahl ? 'bg-yellow border-yellow' : 'bg-white border-anthracite/8'}`}>
          Mehr …
        </button>
      </div>
      {zeigeFreieAnzahl && (
        <div className="flex items-center gap-2 bg-white border-2 border-yellow rounded-xl px-4 py-3">
          <input type="number" inputMode="numeric" min="0" autoFocus placeholder="Beliebige Anzahl"
            value={freitext}
            onChange={e => {
              setFreitext(e.target.value)
              const wert = Number(e.target.value)
              if (Number.isInteger(wert) && wert >= 0) onChange({ wert, einheit: 'Stück' })
            }}
            className="flex-1 font-bold text-anthracite text-lg bg-transparent focus:outline-none" />
          <span className="text-anthracite/40 font-semibold">Stück</span>
        </div>
      )}
    </div>
  )
}

// ── Ausnahme-Maße (DC-035 Teil 2) ────────────────────────────────────────────
// Nach einer Türen-/Fenster-Stückzahl-Antwort optional EINE abweichend große
// Öffnung erfassen (z.B. eine 2×2,2m Terrassentür unter sonst normalen
// Türen). Bewusst eingeklappt und unterhalb der ✓-Zusammenfassung platziert,
// statt die Stückzahl-Frage selbst umzubauen — die schnelle Chip-Auswahl
// bleibt dadurch unverändert, das ist nur ein optionaler Zusatz danach.
function AusnahmeMasseZeile({
  ausnahmeMasse,
  value,
  onChange,
}: {
  ausnahmeMasse: NonNullable<RueckfrageItem['ausnahme_masse']>
  value: { breite: number; hoehe: number } | null
  onChange: (v: { breite: number; hoehe: number } | null) => void
}) {
  const [offen, setOffen] = useState(!!value)
  const [breite, setBreite] = useState(value ? String(value.breite).replace('.', ',') : '')
  const [hoehe, setHoehe] = useState(value ? String(value.hoehe).replace('.', ',') : '')

  function commit(b: string, h: string) {
    const bv = parseFloat(b.replace(',', '.')) || 0
    const hv = parseFloat(h.replace(',', '.')) || 0
    onChange(bv > 0 && hv > 0 ? { breite: bv, hoehe: hv } : null)
  }

  if (!offen) {
    return (
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="mt-2 text-[12px] font-bold text-anthracite/40 hover:text-anthracite/65 underline decoration-dotted underline-offset-2"
      >
        {ausnahmeMasse.label}
      </button>
    )
  }

  const bv = parseFloat(breite.replace(',', '.')) || 0
  const hv = parseFloat(hoehe.replace(',', '.')) || 0
  const flaeche = bv > 0 && hv > 0 ? Math.round(bv * hv * 100) / 100 : null

  return (
    <div className="mt-2 bg-anthracite/[0.03] border border-anthracite/10 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold text-anthracite/55">{ausnahmeMasse.label}</span>
        <button
          type="button"
          onClick={() => { setOffen(false); setBreite(''); setHoehe(''); onChange(null) }}
          className="text-[11px] font-bold text-anthracite/35 hover:text-anthracite/55"
        >
          Zurück zu Standard
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-wide mb-1">Breite</div>
          <div className="flex items-center gap-2 bg-white border-2 border-anthracite/15 rounded-xl px-3 py-2 focus-within:border-yellow">
            <input
              type="number" inputMode="decimal"
              placeholder={String(ausnahmeMasse.standard_breite).replace('.', ',')}
              autoFocus
              value={breite}
              onChange={e => { setBreite(e.target.value); commit(e.target.value, hoehe) }}
              className="flex-1 font-bold text-anthracite bg-transparent focus:outline-none w-0"
            />
            <span className="text-anthracite/40 font-semibold text-sm shrink-0">m</span>
          </div>
        </div>
        <div className="text-anthracite/30 font-black mt-4">×</div>
        <div className="flex-1">
          <div className="text-[10px] font-black text-anthracite/40 uppercase tracking-wide mb-1">Höhe</div>
          <div className="flex items-center gap-2 bg-white border-2 border-anthracite/15 rounded-xl px-3 py-2 focus-within:border-yellow">
            <input
              type="number" inputMode="decimal"
              placeholder={String(ausnahmeMasse.standard_hoehe).replace('.', ',')}
              value={hoehe}
              onChange={e => { setHoehe(e.target.value); commit(breite, e.target.value) }}
              className="flex-1 font-bold text-anthracite bg-transparent focus:outline-none w-0"
            />
            <span className="text-anthracite/40 font-semibold text-sm shrink-0">m</span>
          </div>
        </div>
      </div>
      {flaeche !== null && (
        <div className="text-[11px] font-bold text-anthracite/45 mt-1.5">= {String(flaeche).replace('.', ',')} m²</div>
      )}
    </div>
  )
}

// ── Ja/Nein ─────────────────────────────────────────────────────────────────
function JaNeinInput({
  frage,
  antwort,
  onChange,
}: {
  frage: RueckfrageItem
  antwort: RueckfragenAntwort | null
  onChange: (a: RueckfragenAntwort) => void
}) {
  const optionen = frage.schnell_antworten.length > 0
    ? frage.schnell_antworten.map(s => ({ label: s.label, wert: s.wert as number }))
    : [{ label: 'Ja', wert: 1 }, { label: 'Nein', wert: 0 }]
  return (
    <div className="flex flex-col gap-3">
      {optionen.map(opt => {
        const aktiv = !Array.isArray(antwort?.wert) && antwort?.wert === opt.wert
        return (
          <button
            key={opt.label}
            onClick={() => onChange({ wert: opt.wert, einheit: 'bool' })}
            className={`rounded-2xl py-5 font-black text-xl transition-colors border-2 ${aktiv ? 'bg-yellow border-yellow text-anthracite' : 'bg-white border-anthracite/8 text-anthracite'}`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Vorschlagskarte (DC-025 + DC-026) ────────────────────────────────────────
// Der Rückfragen-Generator (Head of Product Engineering, 2026-08-24) liefert
// pro Frage optional `vorschlag`, wenn der Wert schon im Transkript stand,
// aber nicht strukturiert erkannt wurde. Statt die Frage stillschweigend
// nochmal zu stellen, zeigen wir das Zitat und bieten „Stimmt ✓" (übernimmt
// sofort) oder „Korrigieren" (öffnet die normale Eingabe) an — siehe
// docs/dc-025-konzept-rueckfragen.md.
function VorschlagKarte({
  vorschlag,
  onStimmt,
  onKorrigieren,
}: {
  vorschlag: NonNullable<RueckfrageItem['vorschlag']>
  onStimmt: () => void
  onKorrigieren: () => void
}) {
  return (
    <div className="bg-yellow/10 border-2 border-yellow/40 rounded-2xl p-4">
      <div className="text-[11px] font-black text-anthracite/40 uppercase tracking-wide mb-1.5">Du hast gesagt</div>
      {/* Bewusst SEINE Worte (roher Satz aus dem Transkript), nicht unsere
          normalisierte Fassung — sonst prüft der Handwerker einen Satz, den
          er so nie gesagt hat. */}
      <p className="text-anthracite/70 font-semibold text-sm italic leading-relaxed mb-2">„{vorschlag.zitat}“</p>
      <div className="flex items-center gap-1.5 font-black text-anthracite text-base mb-3">
        <span className="text-anthracite/30">→</span> {vorschlag.anzeige}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onStimmt}
          className="flex-1 bg-yellow text-anthracite font-extrabold text-sm rounded-xl py-2.5 active:scale-95 transition-transform"
        >
          Stimmt ✓
        </button>
        <button
          onClick={onKorrigieren}
          className="flex-1 bg-white border-2 border-anthracite/15 text-anthracite/60 font-extrabold text-sm rounded-xl py-2.5 active:scale-95 transition-transform"
        >
          Korrigieren
        </button>
      </div>
    </div>
  )
}

function renderEingabe(frage: RueckfrageItem, antwort: RueckfragenAntwort | null, onChange: (a: RueckfragenAntwort) => void) {
  switch (frage.typ) {
    case 'masse_einzel':
      return <MasseEinzelInput frage={frage} antwort={antwort} onChange={onChange} />
    case 'masse_mehrere':
      return <MasseMehrereInput frage={frage} antwort={antwort} onChange={onChange} />
    case 'hoehe':
      return <HoeheInput frage={frage} antwort={antwort} onChange={onChange} />
    case 'ja_nein':
      return <JaNeinInput frage={frage} antwort={antwort} onChange={onChange} />
    case 'anzahl':
    case 'laenge':
    case 'flaeche_einzel':
      return <AnzahlInput frage={frage} antwort={antwort} onChange={onChange} />
  }
}

// Kurzer, für den Handwerker verständlicher Text, was ohne diese Angabe
// passiert — Antwort auf PD-002: "Diese Angabe überspringen" war vorher
// klein und folgenlos, obwohl das Überspringen später zu einer roten
// Fehleranzeige führen kann (PM-003). Jetzt sichtbar VOR dem Überspringen.
const KONSEQUENZ_TEXT: Record<RueckfrageTyp, string> = {
  masse_einzel: 'Ohne diese Maße kann für diesen Bereich keine Fläche berechnet werden — die Position bleibt offen, bis du sie später in der Positionsliste nachträgst.',
  masse_mehrere: 'Ohne diese Maße kann für diese Räume keine Fläche berechnet werden — die Positionen bleiben offen, bis du sie später nachträgst.',
  flaeche_einzel: 'Ohne diese Fläche bleibt die Position offen — du kannst sie später in der Positionsliste nachtragen.',
  hoehe: 'Ohne Raumhöhe nehmen wir die häufigste Standardhöhe (2,60 m) an — das kann bei sehr hohen oder niedrigen Räumen leicht danebenliegen.',
  anzahl: 'Ohne diese Angabe rechnen wir ohne Abzug für Fenster/Türen bei der Wandfläche — du kannst es später in der Positionsliste nachtragen.',
  laenge: 'Ohne diese Angabe fehlt diese Position in der Berechnung — du kannst sie später in der Positionsliste nachtragen.',
  ja_nein: "Ohne Antwort gehen wir von „Nein“ aus — du kannst das später in der Positionsliste korrigieren.",
}

function formatAntwort(frage: RueckfrageItem, antwort: RueckfragenAntwort): string {
  const wert = antwort.wert
  if (frage.typ === 'masse_einzel') {
    if (antwort.einheit === 'flaechen_m2' && Array.isArray(wert)) {
      const teile: string[] = []
      if (wert[0] > 0) teile.push(`Wandfläche ${String(wert[0]).replace('.', ',')} m²`)
      if (wert[1] > 0) teile.push(`Boden-/Deckenfläche ${String(wert[1]).replace('.', ',')} m²`)
      return teile.length > 0 ? teile.join(' · ') : 'Erfasst'
    }
    if (!Array.isArray(wert) && antwort.einheit === 'm²') {
      return `${String(wert).replace('.', ',')} m²`
    }
    if (Array.isArray(wert) && wert.length === 2 && wert[0] > 0 && wert[1] > 0) {
      const flaeche = Math.round(wert[0] * wert[1] * 100) / 100
      return `${String(wert[0]).replace('.', ',')} × ${String(wert[1]).replace('.', ',')} m → ${String(flaeche).replace('.', ',')} m²`
    }
    return 'Erfasst'
  }
  if (frage.typ === 'masse_mehrere' && Array.isArray(wert)) {
    const paare: string[] = []
    for (let i = 0; i < wert.length; i += 2) {
      const l = wert[i], b = wert[i + 1]
      if (l > 0 && b > 0) paare.push(`${String(l).replace('.', ',')}×${String(b).replace('.', ',')} m`)
    }
    return paare.length > 0 ? paare.join(', ') : 'Erfasst'
  }
  if (frage.typ === 'hoehe' && !Array.isArray(wert)) {
    return `${String(wert).replace('.', ',')} m`
  }
  if (frage.typ === 'ja_nein' && !Array.isArray(wert)) {
    const treffer = frage.schnell_antworten.find(s => !Array.isArray(s.wert) && s.wert === wert)
    return treffer ? treffer.label : (wert === 1 ? 'Ja' : 'Nein')
  }
  if (!Array.isArray(wert)) {
    const einheit = antwort.einheit && antwort.einheit !== 'bool' ? antwort.einheit : (frage.einheit ?? 'Stück')
    const basis = `${String(wert).replace('.', ',')} ${einheit}`
    // DC-035: eine abweichend große Öffnung sichtbar machen.
    const a = antwort.ausnahme
    if (a && a.breite > 0 && a.hoehe > 0) {
      return `${basis} · eine davon ${String(a.breite).replace('.', ',')} × ${String(a.hoehe).replace('.', ',')} m`
    }
    return basis
  }
  return 'Erfasst'
}

interface RaumGruppe {
  name: string
  fragen: RueckfrageItem[]
}

// ── Haupt-Screen ────────────────────────────────────────────────────────────
// DC-025-Redesign: statt einem Vollbild-Screen pro einzelner Frage (alte
// Version) jetzt ein Screen pro RAUM mit allen offenen Fragen dazu als
// Karten untereinander, plus durchgängiger Gesamt-Fortschritt und sichtbarer
// Überspringen-Konsequenz. Details/Begründung: docs/dc-025-konzept-rueckfragen.md
export default function RueckfragenScreen({ fragen, onFertig, onUeberspringen, onZurueck }: Props) {
  const [roomIdx, setRoomIdx] = useState(0)
  const [antworten, setAntworten] = useState<Record<string, RueckfragenAntwort>>({})
  const [uebersprungen, setUebersprungen] = useState<Set<string>>(new Set())
  // DC-026: Nach "Korrigieren" auf der Vorschlagskarte bleibt die normale
  // Eingabe offen, auch wenn `frage.vorschlag` weiterhin gesetzt ist.
  const [korrigieren, setKorrigieren] = useState<Set<string>>(new Set())
  const [offeneKonsequenz, setOffeneKonsequenz] = useState<string | null>(null)
  const [ansicht, setAnsicht] = useState<'flow' | 'zusammenfassung'>('flow')
  const [fertig, setFertig] = useState(false)

  // Unverändert aus der Vorversion: Wenn für einen Raum bereits eine volle
  // Flächenangabe vorliegt, sind Höhe/Türen/Fenster-Fragen für DIESEN Raum
  // redundant geworden und verschwinden automatisch aus der sichtbaren Liste.
  const flaechenRaumIds = new Set(Object.entries(antworten)
    .filter(([id, antwort]) => {
      if (!/^masse_/.test(id)) return false
      if (antwort.einheit === 'm²' && !Array.isArray(antwort.wert)) return true
      return antwort.einheit === 'flaechen_m2' && Array.isArray(antwort.wert) && Number(antwort.wert[0]) > 0
    })
    .map(([id]) => id.replace(/^masse_/, '')))
  const sichtbareFragen = fragen.filter(item => ![...flaechenRaumIds].some(raumId =>
    item.id === `hoehe_${raumId}` || item.id === `tueren_anzahl_${raumId}` || item.id === `fenster_anzahl_${raumId}`
  ))

  const raeume: RaumGruppe[] = []
  for (const f of sichtbareFragen) {
    const name = f.kontext || 'Allgemein'
    let raum = raeume.find(r => r.name === name)
    if (!raum) { raum = { name, fragen: [] }; raeume.push(raum) }
    raum.fragen.push(f)
  }

  const istGeloest = (id: string) => antworten[id] !== undefined || uebersprungen.has(id)
  const raumIstFertig = (r: RaumGruppe) => r.fragen.every(f => istGeloest(f.id))
  const gesamt = sichtbareFragen.length
  const geloestAnzahl = sichtbareFragen.filter(f => istGeloest(f.id)).length

  const zeigeZusammenfassung = ansicht === 'zusammenfassung' || raeume.length === 0

  function setAntwortFuer(id: string, a: RueckfragenAntwort) {
    setAntworten(prev => ({ ...prev, [id]: a }))
    setOffeneKonsequenz(null)
  }

  function undoFuer(id: string) {
    setAntworten(prev => {
      const { [id]: _entfernt, ...rest } = prev
      return rest
    })
    setUebersprungen(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    // Zurück auf Anfang: falls es einen Vorschlag gab, wieder anzeigen statt
    // direkt in der zuletzt offenen manuellen Eingabe zu landen.
    setKorrigieren(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function springeZuFrage(f: RueckfrageItem) {
    const name = f.kontext || 'Allgemein'
    const idx = raeume.findIndex(r => r.name === name)
    if (idx >= 0) setRoomIdx(idx)
    setAnsicht('flow')
  }

  async function abschliessen() {
    setFertig(true)
    await new Promise(r => setTimeout(r, 500))
    // PM-007 (2026-08-24): Übersprungene Fragen lagen bisher nur in diesem
    // Bildschirm (`uebersprungen`) und wurden NICHT mitgeschickt. Die
    // Berechnung sah eine unbeantwortete Frage, stellte sie erneut — dieselbe
    // Maske, immer wieder, kein Weg zum Entwurf. Jetzt geht „übersprungen" als
    // ausdrückliches `null` mit: die Berechnung weiß dadurch, dass die Frage
    // erledigt ist, und rechnet mit ihren Standard-Annahmen weiter.
    const uebersprungenAlsNull = Object.fromEntries(
      [...uebersprungen].map(id => [id, null as RueckfragenAntwort | null]),
    )
    onFertig({ ...uebersprungenAlsNull, ...antworten })
  }

  if (fertig) {
    return (
      <div className="min-h-dvh bg-bg flex flex-col items-center justify-center gap-4 px-5">
        <div className="text-6xl animate-bounce">✓</div>
        <div className="font-black text-anthracite text-xl text-center">Mengen werden berechnet...</div>
      </div>
    )
  }

  // ── Zusammenfassung ────────────────────────────────────────────────────
  // Recap vor der Berechnung — derselbe Vertrauens-Moment wie die
  // Bestätigungskarte (DC-021), nur schon hier, editierbar per Tap.
  if (zeigeZusammenfassung) {
    function zurueckZurLetztenFrage() {
      if (raeume.length > 0) { setRoomIdx(raeume.length - 1); setAnsicht('flow') }
      else (onZurueck ?? onUeberspringen)()
    }
    return (
      <div className="min-h-dvh bg-bg flex flex-col">
        <div className="bg-anthracite px-5 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={zurueckZurLetztenFrage} className="rounded-full px-3 py-2 text-sm font-bold text-white/65 hover:bg-white/10">← Zurück</button>
            <span />
          </div>
          <h1 className="font-syne font-extrabold text-white text-[22px] leading-tight">Kurz geprüft?</h1>
          <p className="text-white/50 text-[13px] font-semibold mt-1">Alle Antworten aus den Rückfragen auf einen Blick — vor der Berechnung.</p>
        </div>
        <div className="flex-1 px-5 py-5 overflow-y-auto flex flex-col gap-2.5">
          {sichtbareFragen.length === 0 && (
            <div className="text-center text-anthracite/40 font-semibold text-sm py-10">Keine offenen Fragen mehr.</div>
          )}
          {sichtbareFragen.map(f => {
            const wurdeUebersprungen = uebersprungen.has(f.id)
            const a = antworten[f.id]
            return (
              <div key={f.id} className="bg-white rounded-2xl px-4 py-3 border border-anthracite/6 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-anthracite/45 mb-0.5 truncate">{f.frage}</div>
                  <div className={`text-sm font-extrabold ${wurdeUebersprungen ? 'text-[#B91C1C]' : 'text-anthracite'}`}>
                    {wurdeUebersprungen ? '⏭ Übersprungen — später ergänzen' : a ? formatAntwort(f, a) : '—'}
                  </div>
                </div>
                <button onClick={() => springeZuFrage(f)} className="shrink-0 text-xs font-extrabold text-anthracite bg-anthracite/6 rounded-lg px-2.5 py-1.5">
                  Ändern
                </button>
              </div>
            )
          })}
        </div>
        <div className="px-5 pb-8 pt-3 bg-white border-t border-anthracite/8">
          <Button variant="primary" className="w-full" onClick={abschliessen}>Angebot berechnen →</Button>
          <div className="text-center text-[11px] font-bold text-anthracite/35 mt-1.5">
            Wie die Bestätigungskarte danach — nur schon hier, bevor überhaupt gerechnet wird.
          </div>
        </div>
      </div>
    )
  }

  // ── Raum-Screen ─────────────────────────────────────────────────────────
  const aktuellerRaumIdx = Math.min(roomIdx, raeume.length - 1)
  const raum = raeume[aktuellerRaumIdx]
  if (!raum) return null // defensiv — kann bei raeume.length > 0 nicht eintreten

  const istLetzterRaum = aktuellerRaumIdx === raeume.length - 1
  const raumFertig = raumIstFertig(raum)
  const offenInRaum = raum.fragen.filter(f => !istGeloest(f.id)).length

  function zurueckKlick() {
    if (aktuellerRaumIdx > 0) setRoomIdx(aktuellerRaumIdx - 1)
    else (onZurueck ?? onUeberspringen)()
  }

  function weiterKlick() {
    if (istLetzterRaum) setAnsicht('zusammenfassung')
    else setRoomIdx(aktuellerRaumIdx + 1)
  }

  function renderKarte(frage: RueckfrageItem) {
    const antwort = antworten[frage.id] ?? null
    const wurdeUebersprungen = uebersprungen.has(frage.id)
    const geloest = antwort !== null || wurdeUebersprungen
    const zeigeKonsequenz = offeneKonsequenz === frage.id
    const istMasseFrage = frage.typ === 'masse_einzel'
      && !frage.id.startsWith('masse_boden_')
      && !/fenster|tür|tuer/i.test(frage.frage)
    const titel = istMasseFrage ? `Welche Maße kennst du für „${frage.kontext}“?` : frage.frage
    const zeigeVorschlag = !geloest && !!frage.vorschlag && !korrigieren.has(frage.id)

    return (
      <div
        key={frage.id}
        className={`rounded-2xl p-4 border transition-colors ${geloest ? 'bg-yellow/5 border-yellow/40' : 'bg-white border-anthracite/8'}`}
      >
        <div className="font-black text-anthracite text-[15px] mb-3 leading-snug">{titel}</div>

        {zeigeVorschlag && (
          <VorschlagKarte
            vorschlag={frage.vorschlag!}
            onStimmt={() => setAntwortFuer(frage.id, { wert: frage.vorschlag!.wert, einheit: frage.vorschlag!.einheit })}
            onKorrigieren={() => setKorrigieren(prev => new Set(prev).add(frage.id))}
          />
        )}
        {!geloest && !zeigeVorschlag && renderEingabe(frage, antwort, a => setAntwortFuer(frage.id, a))}

        {geloest && !wurdeUebersprungen && antwort && (
          <div className="flex items-center gap-1.5 text-anthracite font-extrabold text-sm">
            <span className="text-yellow">✓</span> {formatAntwort(frage, antwort)}
          </div>
        )}
        {wurdeUebersprungen && (
          <div className="text-[#B91C1C] font-extrabold text-sm">⏭ Später ergänzen</div>
        )}

        {/* DC-035 Teil 2: nach einer Türen-/Fenster-Stückzahl ≥ 1 optional
            EINE abweichend große Öffnung erfassen (z.B. Terrassentür). */}
        {geloest && !wurdeUebersprungen && antwort && frage.ausnahme_masse
          && !Array.isArray(antwort.wert) && antwort.wert >= 1 && (
          <AusnahmeMasseZeile
            ausnahmeMasse={frage.ausnahme_masse}
            value={antwort.ausnahme ?? null}
            onChange={v => setAntwortFuer(frage.id, { ...antwort, ausnahme: v })}
          />
        )}

        <div className="flex justify-end mt-2">
          {!geloest ? (
            <button
              onClick={() => setOffeneKonsequenz(zeigeKonsequenz ? null : frage.id)}
              className="text-[12px] font-bold text-anthracite/35 hover:text-anthracite/55"
            >
              Später ergänzen
            </button>
          ) : (
            <button onClick={() => undoFuer(frage.id)} className="text-[12px] font-bold text-anthracite/35 hover:text-anthracite/55">
              Ändern
            </button>
          )}
        </div>

        {!geloest && zeigeKonsequenz && (
          <div className="mt-2 bg-[#DC2626]/6 border border-[#DC2626]/20 rounded-xl px-3 py-3">
            <p className="text-[12px] font-semibold text-[#7A2020] leading-relaxed mb-2">{KONSEQUENZ_TEXT[frage.typ]}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setOffeneKonsequenz(null)}
                className="flex-1 bg-anthracite text-white font-extrabold text-[11px] rounded-lg py-2"
              >
                Doch beantworten
              </button>
              <button
                onClick={() => { setUebersprungen(prev => new Set(prev).add(frage.id)); setOffeneKonsequenz(null) }}
                className="flex-1 bg-white border border-[#DC2626]/30 text-[#B91C1C] font-extrabold text-[11px] rounded-lg py-2"
              >
                Trotzdem überspringen
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      {/* Header */}
      <div className="bg-anthracite px-5 pt-8 pb-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={zurueckKlick} className="rounded-full px-3 py-2 text-sm font-bold text-white/65 hover:bg-white/10">← Zurück</button>
          <button onClick={onUeberspringen} className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/10">
            Rückfragen beenden
          </button>
        </div>

        {raeume.length > 1 && (
          <div className="flex gap-1.5 mb-3 overflow-x-auto">
            {raeume.map((r, i) => (
              <div
                key={r.name + i}
                className={`shrink-0 text-xs font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap ${
                  i === aktuellerRaumIdx
                    ? 'bg-yellow text-anthracite'
                    : raumIstFertig(r)
                    ? 'bg-white/12 text-white/50'
                    : 'bg-white/6 text-white/35'
                }`}
              >
                {raumIstFertig(r) && i !== aktuellerRaumIdx ? '✓ ' : ''}{r.name}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/45">Insgesamt</span>
          <span className="text-[11px] font-black text-yellow">{geloestAnzahl} von {gesamt} beantwortet</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/12 overflow-hidden mb-3">
          <div
            className="h-full bg-yellow rounded-full transition-all"
            style={{ width: `${gesamt > 0 ? Math.round((geloestAnzahl / gesamt) * 100) : 100}%` }}
          />
        </div>

        <h1 className="font-syne font-extrabold text-white text-[20px] leading-tight">{raum.name}</h1>
      </div>

      {/* Inhalt */}
      <div className="flex-1 px-5 py-5 overflow-y-auto flex flex-col gap-3">
        {raum.fragen.map(f => renderKarte(f))}
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 pt-3 bg-white border-t border-anthracite/8 flex flex-col gap-1.5">
        <Button variant="primary" className="w-full" disabled={!raumFertig} onClick={weiterKlick}>
          {istLetzterRaum ? 'Fertig — Angebot berechnen' : `Weiter: ${raeume[aktuellerRaumIdx + 1].name} →`}
        </Button>
        <div className="text-center text-[11px] font-bold text-anthracite/35">
          {raumFertig ? 'Alle Fragen zu diesem Raum beantwortet' : `noch ${offenInRaum} von ${raum.fragen.length} in diesem Raum offen`}
        </div>
      </div>
    </div>
  )
}
