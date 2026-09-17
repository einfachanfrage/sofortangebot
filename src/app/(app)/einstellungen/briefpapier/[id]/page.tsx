'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Briefpapier, Company } from '@/lib/types'
import { Input } from '@/components/Input'
import { akzentLinieAusFarbe, wirdAbgedunkelt } from '@/lib/briefpapier-farbe'
import { logoKopfVorschau, logoQuelle, LOGO_PT_ZU_PX_MINI } from '@/lib/briefpapier-logo'

const FARB_CHIPS = ['#D9A400', '#2563EB', '#16A34A', '#DC2626', '#6B7280', '#1C1C1C']
// DC-122 (17.09.2026): Hier stand eine Auswahl aus drei Schriften (Inter,
// Roboto, Open Sans). Sie hat nie etwas bewirkt — das Kundendokument setzt
// `lib/pdf.tsx` fest in Inter, und nur diese Vorschau hat so getan, als
// könnte man das ändern. Warum die Auswahl nicht nachgebaut, sondern
// abgeschafft wurde, steht ausführlich in `docs/design-check.md` unter
// DC-122. Kurz: Die Überschriften des Dokuments bleiben in jedem Fall
// Bricolage Grotesque, die Wahl hätte also nur den Fließtext gegen eine
// beinahe gleich aussehende Schrift getauscht — für zwei zusätzliche
// Schriftfamilien im Dokument. Die Spalte `schrift` bleibt in der Datenbank
// unangetastet; es wird nur nichts mehr behauptet.
const FUSSZEILE_CHIPS = ['Steuernummer', 'IBAN', 'Handwerkskammer', 'USt-IdNr.', 'Geschäftsführer']

// ── Mini Live-Vorschau ─────────────────────────────────────────────────────
function BriefpapierVorschau({ bp, company }: { bp: Partial<Briefpapier>; company: Company | null }) {
  // Firmeninfo kommt aus dem Betrieb (companies), nicht mehr aus dem Briefpapier.
  const firmenname = company?.name || 'Musterfirma'
  // DC-122: NICHT mehr die roh eingegebene Farbe, sondern die, mit der das
  // Dokument die Linie wirklich zieht (sehr helle Farben werden dort
  // abgedunkelt, damit die Linie nicht verschwindet). Dieselbe Funktion, die
  // `lib/pdf.tsx` und die große Vorschau benutzen — sonst zeigt diese Seite
  // wieder etwas anderes als das Papier, und genau das war der Befund.
  const akzent = akzentLinieAusFarbe(bp.akzentfarbe)
  const adresse = company?.address || ''
  // DC-124: Diese Vorschau kannte nur `bp.logo_url` und zeigte das Logo
  // ANSTELLE des Firmennamens. Beides war falsch: das Dokument fällt auf das
  // Firmenlogo zurück (`logoQuelle`) und zeigt Logo UND Namen untereinander
  // — dieselbe Korrektur wie in DC-121 an der großen Vorschau. Größe und
  // Position kommen aus denselben zwei Schaltern, die direkt darunter stehen;
  // bisher hat die Vorschau beide ignoriert, obwohl das Papier sie seit
  // DC-121 befolgt.
  const logoSrc = logoQuelle(bp, company).src
  const logo = logoKopfVorschau(bp as Briefpapier, LOGO_PT_ZU_PX_MINI)
  const logoBild = logoSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoSrc} alt="" className="object-contain mb-1"
      style={{ height: logo.hoehePx, maxWidth: logo.maxBreitePx }} />
  ) : null

  const dummyItems = [
    { pos: 1, title: 'Malerarbeiten Innen', qty: 45, unit: 'm²', price: 18, total: 810 },
    { pos: 2, title: 'Grundierung', qty: 2, unit: 'Stk', price: 35, total: 70 },
    { pos: 3, title: 'Abschlussarbeiten', qty: 1, unit: 'pauschal', price: 250, total: 250 },
  ]

  // DC-122: Hier stand ein `fontFamily` aus `bp.schrift`. Das Dokument kennt
  // nur Inter — die Vorschau hat also eine Schrift gezeigt, die das Angebot
  // nie annimmt.
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-[7px] leading-tight">
      <div className="px-5 py-4">
        {/* Header — DC-124: dreispaltig wie im PDF, Logo an der gewählten
            Position. „mitte" ist wie dort eine eigene Zeile ÜBER dem Kopf,
            nicht ein zentriertes Bild in der linken Spalte. */}
        {logo.position === 'mitte' && logoBild && (
          <div className="flex justify-center mb-2">{logoBild}</div>
        )}
        <div className="flex justify-between items-start mb-4">
          <div>
            {logo.position === 'links' && logoBild}
            <div className="font-black text-[10px] text-anthracite">{firmenname}</div>
            {adresse && <div className="text-[6px] text-gray-400 whitespace-pre-line">{adresse}</div>}
          </div>
          {/* DC-122: Das war eine farbige Fläche mit „ANGEBOT" darin. Auf dem
              Dokument steht dort eine kleine graue Zeile, keine Fläche — und
              bei einer dunklen Akzentfarbe (die Chip-Liste enthält #1C1C1C)
              stand hier dunkler Text auf dunklem Grund. */}
          <div className="flex flex-col items-end">
            {logo.position === 'rechts' && logoBild}
            <span className="text-[7px] font-bold tracking-widest text-gray-400">ANGEBOT</span>
          </div>
        </div>

        {/* DC-122: erste der zwei Akzentlinien, genau wie auf dem Dokument */}
        <div className="mb-3" style={{ borderTop: `1px solid ${akzent}` }} />

        {/* Tabelle */}
        <div className="rounded overflow-hidden">
          <div className="flex text-[6px] font-bold text-white px-1.5 py-1" style={{ background: '#2C2C2C' }}>
            <span style={{ width: '6%' }}>#</span>
            <span style={{ width: '40%' }}>Bezeichnung</span>
            <span style={{ width: '12%', textAlign: 'right' }}>Menge</span>
            <span style={{ width: '10%', textAlign: 'center' }}>Einh.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Einzelpr.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Gesamt</span>
          </div>
          {dummyItems.map((item, i) => (
            <div key={i} className={`flex px-1.5 py-1 text-[6px] ${i % 2 !== 0 ? 'bg-[#FAFAF8]' : ''}`}>
              <span style={{ width: '6%' }} className="text-gray-400">{item.pos}</span>
              <span style={{ width: '40%' }} className="font-bold">{item.title}</span>
              <span style={{ width: '12%', textAlign: 'right' }}>{item.qty}</span>
              <span style={{ width: '10%', textAlign: 'center' }}>{item.unit}</span>
              <span style={{ width: '16%', textAlign: 'right' }}>{item.price.toFixed(2)} €</span>
              <span style={{ width: '16%', textAlign: 'right' }} className="font-bold">{item.total.toFixed(2)} €</span>
            </div>
          ))}
        </div>

        {/* Summe */}
        <div className="flex justify-end mt-2">
          <div className="rounded px-2 py-1.5 text-[6px] w-[45%]" style={{ background: '#F7F7F5' }}>
            <div className="flex justify-between mb-0.5"><span className="text-gray-500">Netto</span><span>1.130,00 €</span></div>
            <div className="flex justify-between mb-0.5"><span className="text-gray-500">MwSt. 19%</span><span>214,70 €</span></div>
            {/* DC-122: zweite und letzte Akzentlinie */}
            <div className="flex justify-between font-black pt-0.5 text-[7px]" style={{ borderTop: `1px solid ${akzent}` }}><span>Gesamt</span><span>1.344,70 €</span></div>
          </div>
        </div>

        {/* Footer — DC-122: Die Fußzeilen-Linie ist auf dem Dokument grau,
            nicht farbig; die Akzentfarbe zieht genau zwei Linien. Dass der
            Text dieser drei Felder das Angebot bis heute gar nicht erreicht,
            ist der noch offene Teil von DC-122 (Rechtsfrage bei Legal,
            CoS-L-011) — der Hinweis dazu steht unten an der Fußzeilen-Karte. */}
        {(bp.fusszeile_links || bp.fusszeile_mitte || bp.fusszeile_rechts) && (
          <div className="flex justify-between mt-3 pt-1.5 border-t border-gray-200 text-[5px] text-gray-400">
            <span>{bp.fusszeile_links}</span>
            <span>{bp.fusszeile_mitte}</span>
            <span>{bp.fusszeile_rechts}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Hauptseite ─────────────────────────────────────────────────────────────
function BriefpapierEditorInner() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  const router = useRouter()
  const [bp, setBp] = useState<Partial<Briefpapier>>({
    akzentfarbe: '#D9A400',
    logo_position: 'links',
    logo_groesse: 'mittel',
    schrift: 'inter',
  })
  const [company, setCompany] = useState<Company | null>(null)
  const [saving, setSaving] = useState(false)
  const searchParams = useSearchParams()
  // DC-031: kommt von "+ Neue Variante erstellen" (siehe briefpapier/page.tsx),
  // die Zeile existiert also schon in der DB, aber der Nutzer hat noch nichts
  // eingegeben. originalRef hält den geladenen Ausgangsstand fest, damit
  // handleBack() erkennen kann, ob seitdem wirklich etwas geändert wurde.
  const istNeu = searchParams.get('neu') === '1'
  const originalRef = useRef<Partial<Briefpapier> | null>(null)

  useEffect(() => { load() }, [id])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: co } = await supabase.from('companies').select('*').eq('user_id', user.id).single()
    setCompany(co)
    const { data } = await supabase.from('briefpapiere').select('*').eq('id', id).single()
    if (data) { setBp(data); originalRef.current = data }
  }

  // DC-031: Zurück ohne zu speichern — bei einer frisch (leer) angelegten
  // Variante, die unverändert geblieben ist, die Zeile wieder entfernen statt
  // eine leere "Neue Variante" in der Liste liegen zu lassen (gleiches Muster
  // wie DC-010/DC-029 bei leeren Angebots-Entwürfen).
  async function handleBack() {
    const geaendert = originalRef.current && JSON.stringify(bp) !== JSON.stringify(originalRef.current)
    if (istNeu && !geaendert) {
      await supabase.from('briefpapiere').delete().eq('id', id)
    } else if (geaendert && !window.confirm('Änderungen wurden noch nicht gespeichert. Trotzdem verlassen?')) {
      return
    }
    router.push('/einstellungen/briefpapier')
  }

  function setField<K extends keyof Briefpapier>(field: K, value: Briefpapier[K]) {
    setBp(prev => ({ ...prev, [field]: value }))
  }

  // DC-124 (17.09.2026): Hier stand `uploadLogo()` — die zweite von zwei
  // Stellen, an denen ein Logo hochgeladen werden konnte. Sie schrieb
  // `briefpapiere.logo_url`, und weil das Dokument diese Spalte vor
  // `companies.logo_url` liest, gewann sie stillschweigend: Wer sein Logo
  // unter Einstellungen → Firmenlogo wechselte, sah auf jedem Angebot weiter
  // das alte und hatte keinen Hinweis darauf, warum.
  //
  // Die Entscheidung dazu steht in `lib/briefpapier-logo.ts` und in
  // `docs/design-check.md` unter DC-124: Ein Betrieb hat EIN Logo, und es
  // wird an EINER Stelle hochgeladen. Ein Briefpapier bestimmt, wo es steht
  // und wie groß es ist — nicht, welches es ist. Die Karte darunter macht es
  // deshalb genauso wie die Karte „Firmenangaben" gleich darüber: sie zeigt,
  // was auf dem Angebot landet, und verweist zum Ändern auf die eine Stelle.
  //
  // Die Spalte bleibt unangetastet, und die Rangfolge auch — ein bestehendes
  // Briefpapier mit eigenem Logo druckt weiter sein eigenes. Neu ist nur,
  // dass keine neue Überschreibung mehr entsteht und dass eine bestehende
  // sichtbar als solche dasteht, mit einem Weg zurück.

  async function save() {
    setSaving(true)
    await supabase.from('briefpapiere').update({
      ...bp,
      aktualisiert_am: new Date().toISOString(),
    }).eq('id', id)
    setSaving(false)
    router.push('/einstellungen/briefpapier')
  }

  return (
    <div className="min-h-dvh bg-bg pb-24">
      {/* Header */}
      <div className="bg-anthracite px-5 pt-12 pb-6">
        <button onClick={handleBack} className="text-white/50 text-sm font-semibold">← Briefpapier</button>
        <h1 className="text-xl font-syne font-black text-white mt-1">
          {bp.name || 'Briefpapier bearbeiten'}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-5">
        {/* Live-Vorschau */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-anthracite/30 mb-2 uppercase tracking-wider">Live-Vorschau</div>
          <BriefpapierVorschau bp={bp} company={company} />
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="bg-white rounded-2xl shadow-sm border border-anthracite/5 px-5 py-4">
            <label className="block text-xs font-bold text-anthracite/50 mb-1.5">Name dieser Variante</label>
            <Input
              value={bp.name ?? ''}
              onChange={e => setField('name', e.target.value)}
            />
          </div>

          {/* Firmeninfo — zentral aus dem Betrieb */}
          <Link href="/einstellungen" className="block bg-white rounded-2xl shadow-sm border border-anthracite/5 px-5 py-4 hover:border-yellow/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs font-black text-anthracite/50 uppercase tracking-wider mb-1">Firmenangaben</div>
                <div className="font-bold text-anthracite text-sm truncate">{company?.name || 'Noch kein Firmenname'}</div>
                {company?.address && (
                  <div className="text-xs text-anthracite/40 font-semibold mt-0.5">{company.address.replace('\n', ' · ')}</div>
                )}
              </div>
              <span className="text-xs font-black text-yellow shrink-0 ml-3">Ändern →</span>
            </div>
            <p className="text-[11px] text-anthracite/30 font-semibold mt-2 leading-relaxed">
              Name, Adresse & Kontakt werden zentral unter Einstellungen → Betrieb gepflegt und erscheinen automatisch auf jedem Angebot.
            </p>
          </Link>

          {/* Logo */}
          <div className="bg-white rounded-2xl shadow-sm border border-anthracite/5 px-5 py-4 space-y-3">
            <div className="text-xs font-black text-anthracite/50 uppercase tracking-wider">Logo</div>

            {bp.logo_url ? (
              /* Bestandsfall: Dieses Briefpapier trägt ein eigenes Logo — aus
                 der Zeit, als man hier eines hochladen konnte, oder als Kopie
                 vom Anlegen des Standard-Briefpapiers. Es gewinnt weiter, und
                 das steht jetzt dabei, statt es zu verschweigen. */
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bp.logo_url} alt="Logo dieser Variante" className="h-14 max-w-[140px] object-contain rounded-lg border border-anthracite/10" />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-anthracite">Eigenes Logo</div>
                    <p className="text-[11px] text-anthracite/40 font-semibold leading-relaxed mt-0.5">
                      Diese Variante benutzt ein eigenes Logo. Es hat Vorrang vor dem Firmenlogo — ein neues Firmenlogo erscheint auf Angeboten mit diesem Briefpapier also nicht.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setField('logo_url', null)}
                  className="w-full bg-bg rounded-xl py-2.5 text-xs font-black text-anthracite"
                >
                  Stattdessen das Firmenlogo verwenden
                </button>
              </div>
            ) : (
              <Link href="/einstellungen" className="block bg-bg rounded-xl px-4 py-3 hover:bg-[#FFF9E6] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {company?.logo_url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={company.logo_url} alt="Firmenlogo" className="h-12 max-w-[120px] object-contain shrink-0" />
                        <div className="text-xs font-bold text-anthracite">Firmenlogo</div>
                      </>
                    ) : (
                      <div className="text-xs font-bold text-anthracite/40">Noch kein Logo hinterlegt</div>
                    )}
                  </div>
                  <span className="text-xs font-black text-yellow shrink-0">
                    {company?.logo_url ? 'Ändern →' : 'Hochladen →'}
                  </span>
                </div>
                <p className="text-[11px] text-anthracite/30 font-semibold mt-2 leading-relaxed">
                  Das Logo wird zentral unter Einstellungen → Firmenlogo gepflegt und erscheint automatisch auf jedem Angebot. Hier wird nur bestimmt, wo es steht und wie groß es ist.
                </p>
              </Link>
            )}

            <div>
              <label className="block text-[10px] font-bold text-anthracite/40 mb-1.5">Position</label>
              <div className="flex gap-2">
                {(['links', 'mitte', 'rechts'] as const).map(pos => (
                  <button key={pos} onClick={() => setField('logo_position', pos)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 capitalize transition-colors ${bp.logo_position === pos ? 'border-yellow bg-[#FFF9E6] text-anthracite' : 'border-anthracite/10 text-anthracite/40'}`}>
                    {pos}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-anthracite/40 mb-1.5">Größe</label>
              <div className="flex gap-2">
                {[{ v: 'klein', l: 'Klein' }, { v: 'mittel', l: 'Mittel' }, { v: 'gross', l: 'Groß' }].map(({ v, l }) => (
                  <button key={v} onClick={() => setField('logo_groesse', v as Briefpapier['logo_groesse'])}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-colors ${bp.logo_groesse === v ? 'border-yellow bg-[#FFF9E6] text-anthracite' : 'border-anthracite/10 text-anthracite/40'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Akzentfarbe */}
          <div className="bg-white rounded-2xl shadow-sm border border-anthracite/5 px-5 py-4 space-y-3">
            <div className="text-xs font-black text-anthracite/50 uppercase tracking-wider">Akzentfarbe</div>
            <div className="flex gap-2">
              {FARB_CHIPS.map(c => (
                <button
                  key={c}
                  onClick={() => setField('akzentfarbe', c)}
                  style={{ background: c }}
                  className={`w-9 h-9 rounded-full border-2 transition-transform ${bp.akzentfarbe === c ? 'border-anthracite scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-anthracite/40">#</span>
              <input
                value={(bp.akzentfarbe ?? '#D9A400').replace('#', '')}
                onChange={e => setField('akzentfarbe', '#' + e.target.value.replace('#', '').slice(0, 6))}
                maxLength={6}
                className="flex-1 bg-bg rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow/50"
              />
              <div className="w-8 h-8 rounded-lg border border-anthracite/10" style={{ background: bp.akzentfarbe }} />
            </div>
            {/* DC-122: Wo die Farbe auftaucht, stand nirgends. Wer sie wählt,
                soll nicht raten müssen — und nicht damit rechnen, dass das
                Angebot bunt wird. */}
            <p className="text-[11px] text-anthracite/30 font-semibold leading-relaxed">
              Deine Farbe zieht auf dem Angebot zwei Linien: unter dem Briefkopf und über der
              Gesamtsumme. Text und Flächen bleiben schwarz auf weiß — ein Angebot wird gelesen,
              auch in Graustufen ausgedruckt.
            </p>
            {wirdAbgedunkelt(bp.akzentfarbe) && (
              <p className="text-[11px] text-anthracite/40 font-semibold leading-relaxed flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-sm shrink-0" style={{ background: akzentLinieAusFarbe(bp.akzentfarbe) }} />
                Diese Farbe ist sehr hell. Auf dem Angebot wird sie etwas abgedunkelt, sonst wäre
                die Linie auf Papier nicht zu sehen. Die Vorschau oben zeigt schon den Ton, der
                gedruckt wird.
              </p>
            )}
          </div>

          {/* Fußzeile */}
          <div className="bg-white rounded-2xl shadow-sm border border-anthracite/5 px-5 py-4 space-y-3">
            <div className="text-xs font-black text-anthracite/50 uppercase tracking-wider">Fußzeile</div>
            <div className="flex flex-wrap gap-1.5">
              {FUSSZEILE_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => {
                    const fields: (keyof Briefpapier)[] = ['fusszeile_links', 'fusszeile_mitte', 'fusszeile_rechts']
                    const empty = fields.find(f => !bp[f])
                    if (empty) setField(empty, chip)
                  }}
                  className="text-[10px] font-semibold bg-bg border border-anthracite/10 rounded-full px-2.5 py-1 text-anthracite/60"
                >
                  + {chip}
                </button>
              ))}
            </div>
            {/* DC-122, noch offener Teil: Diese drei Felder erreichen das
                Kundendokument bis heute nicht — dort baut `lib/pdf.tsx` die
                Fußzeile aus den Betriebsdaten (Firma, USt-IdNr., IBAN). Ob
                freier Text diese Pflichtangaben ersetzen darf, liegt als
                Rechtsfrage bei Head of Legal (CoS-L-011). Bis die Antwort da
                ist, wird hier nichts gebaut — aber auch nichts behauptet. */}
            <p className="text-[11px] text-anthracite/40 font-semibold leading-relaxed bg-bg rounded-xl px-3 py-2">
              Diese drei Felder stehen noch nicht auf dem fertigen Angebot. Dort steht heute die
              Fußzeile aus deinen Betriebsdaten (Firma, Steuer- und Bankangaben). Wir klären
              gerade, welche davon durch eigenen Text ersetzt werden dürfen — bis dahin kannst du
              hier eintragen, was später erscheinen soll.
            </p>
            {[
              { label: 'Links', field: 'fusszeile_links' as const },
              { label: 'Mitte', field: 'fusszeile_mitte' as const },
              { label: 'Rechts', field: 'fusszeile_rechts' as const },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-[10px] font-bold text-anthracite/40 mb-1">{label}</label>
                <Input
                  value={(bp[field] as string) ?? ''}
                  onChange={e => setField(field, e.target.value)}
                  placeholder={`Fußzeile ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          {/* DC-122: Hier stand die Schriftauswahl. Siehe Kommentar ganz oben
              an FARB_CHIPS — abgeschafft statt nachgebaut. */}

          {/* Speichern */}
          <button
            onClick={save}
            disabled={saving}
            className="w-full bg-anthracite text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50"
          >
            {saving ? 'Speichert…' : 'Änderungen speichern'}
          </button>
        </div>
      </div>

    </div>
  )
}

// DC-031: BriefpapierEditorInner nutzt useSearchParams() (für den ?neu=1-Flag)
// — Next.js verlangt dafür einen Suspense-Rand um die Seite, sonst schlägt
// der Build fehl. Gleiches Muster wie in angebot/neu/page.tsx.
export default function BriefpapierEditor() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-bg" />}>
      <BriefpapierEditorInner />
    </Suspense>
  )
}
