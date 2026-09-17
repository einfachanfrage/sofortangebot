'use client'

import type { Quote, QuoteItem, Company, Customer, Briefpapier } from '@/lib/types'
import { mitDeutschenZahlen } from '@/lib/zahlen-text'
import { kundenRechenweg } from '@/lib/rechenweg-kundentext'
import { fasseKleinbetraegeZusammen } from '@/lib/kleinbetraege'
import { gruppiereNachStruktur } from '@/lib/angebot-struktur'
import { raeumeAusQuote, istAllgemeinPosition, ohneNullzeilen } from '@/lib/angebot-gruppierung'
import { effektiveOptionen, gueltigBis } from '@/lib/angebot-optionen'
import { uebermessungsHinweiseJePosition, UEBERMESSUNG_ERKLAERUNG } from '@/lib/mengen/gewerke/vob-uebermessung'
import { logoKopfVorschau, logoQuelle } from '@/lib/briefpapier-logo'
import { akzentLinie } from '@/lib/briefpapier-farbe'
import { idsOhnePreis, PREIS_FEHLT_KURZ, fehlendePreiseSatz } from '@/lib/versandbereit'

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null }
  company: Company
  quoteNumber: string
  /**
   * DC-050 (2026-09-11): Rechenweg auf dem Kunden-PDF zeigen? Gleiche
   * Rangfolge wie in lib/pdf.tsx (das echte PDF, gleiche Frage): Prop, dann
   * die am Angebot gespeicherte Antwort (`quote.zeige_rechenweg_auf_pdf`),
   * dann der CI-Handbuch-Standard (sichtbar). Wird von VorschauUndVersand
   * live mitgegeben, während der Handwerker die Frage dort beantwortet —
   * ohne die Prop verhält sich diese Vorschau also identisch zum PDF.
   */
  zeigeRechenweg?: boolean
  /**
   * DC-123 (2026-09-17): Das Briefpapier des Angebots — dieselbe Zeile, die
   * `lib/pdf.tsx` bekommt (`quotes.briefpapier_id` → Tabelle `briefpapiere`).
   *
   * Bis heute bekam diese Vorschau es nicht. Sie hat das Logo deshalb immer
   * links und immer in der Vorgabegröße gezeigt, egal was unter
   * Einstellungen → Briefpapier & Design eingestellt war — und behauptet
   * dabei „so sieht dein Angebot für den Kunden aus". Wer „Groß / rechts"
   * gewählt hatte, sah den Unterschied erst im fertigen PDF.
   *
   * `undefined`/`null` heißt „kein Briefpapier am Angebot" und ergibt exakt
   * das, was vorher zu sehen war: links, mittel. Kein Aufrufer muss also
   * etwas mitgeben, um den alten Stand zu behalten.
   */
  briefpapier?: Briefpapier | null
}

function fmt(n: number) { return n.toFixed(2).replace('.', ',') + ' €' }
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Spiegelbild von fmtMenge in lib/pdf.tsx — gleiche Nachkommastellen, damit
// Vorschau und PDF dieselbe Zahl gleich schreiben.
const MENGE_FORMAT = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 3 })
function fmtMenge(n: number) {
  return MENGE_FORMAT.format(n)
}

// DC-049 PDF-Schritt Nachtrag Teil 2 (2026-09-11, Sandy: "hier fehlt die
// raumtrennung... das soll doch genau das gleiche pdf sein"): Eine Zeile war
// hier schon immer eine Zeile — nur flach nach Position, nie nach Raum
// gruppiert, obwohl das echte PDF (lib/pdf.tsx) das längst tut. Dieselbe
// Zeilen-Darstellung jetzt einmal extrahiert, damit sie im flachen UND im
// gruppierten Pfad identisch aussieht.
function PositionsZeile({
  position, idx, title, description, berechnungsweg, uebermessungsHinweis, quantity, unit, unitPrice, totalPrice, zeigeRechenweg, ohnePreis,
}: {
  position: number
  idx: number
  title: string
  description?: string | null
  berechnungsweg?: string | null
  /** VOB-004/Legal G5 — muss auf dem Kundendokument stehen, siehe unten. */
  uebermessungsHinweis?: string | null
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  // DC-050: siehe Props-Kommentar oben — hier nur durchgereicht.
  zeigeRechenweg: boolean
  /**
   * DC-125: Diese Position hat keinen Preis (kein Katalogeintrag UND
   * 0,00 €). Dann steht in beiden Betragsspalten „fehlt" statt „0,00 €" —
   * Begründung in src/lib/versandbereit.ts.
   */
  ohnePreis: boolean
}) {
  return (
    <div className={`flex px-2.5 py-2 text-[9px] border-b border-[#F0F0EE] ${idx % 2 !== 0 ? 'bg-[#FAFAF8]' : ''}`}>
      <span style={{ width: '6%' }} className="text-[#999]">{position}</span>
      <div style={{ width: '40%' }}>
        <span className="font-bold">{title}</span>
        {description && <div className="text-[#666] mt-0.5">{description}</div>}
        {uebermessungsHinweis && (
          <div className="text-[8.5px] text-[#444] mt-1 leading-relaxed">{mitDeutschenZahlen(uebermessungsHinweis)} ¹</div>
        )}
        {/* DC-055 (2026-09-11, Manfred/TN-007): `font-mono` ist raus und die
            Zahlen laufen durch den deutschen Formatter — diese Vorschau MUSS
            aussehen wie das PDF (lib/pdf.tsx), sonst ist sie keine Vorschau. */}
        {zeigeRechenweg && (
          <div className="text-[8px] text-[#666] mt-1 leading-relaxed">
            {mitDeutschenZahlen(kundenRechenweg(berechnungsweg)) || 'Pauschale'}
          </div>
        )}
      </div>
      {/* DC-055, dabei mitgefunden: die Menge stand hier als rohe JS-Zahl
          („46.64"), während das PDF sie längst deutsch formatiert (fmtMenge).
          Dieselbe Zahl, zwei Schreibweisen, je nachdem wo man hinsieht. */}
      <span style={{ width: '12%', textAlign: 'right' }}>{fmtMenge(quantity)}</span>
      <span style={{ width: '10%', textAlign: 'center' }}>{unit}</span>
      {/* DC-125: „0,00 €" behauptet, diese Arbeit koste nichts. Hier steht
          deshalb, was wahr ist. Bewusst in derselben Zeile und nicht als
          Fußnote: der Blick fällt beim Überfliegen auf die Betragsspalte. */}
      <span style={{ width: '16%', textAlign: 'right' }} className={ohnePreis ? 'text-[#B00020]' : undefined}>
        {ohnePreis ? PREIS_FEHLT_KURZ : fmt(unitPrice)}
      </span>
      <span style={{ width: '16%', textAlign: 'right' }} className={ohnePreis ? 'font-bold text-[#B00020]' : 'font-bold'}>
        {ohnePreis ? PREIS_FEHLT_KURZ : fmt(totalPrice)}
      </span>
    </div>
  )
}

export default function AngebotVorschau({ quote, company, quoteNumber, zeigeRechenweg, briefpapier }: Props) {
  const isKleinunternehmer = company.vat_rate === 0
  // DC-050: siehe Props-Kommentar oben — gleiche Rangfolge wie lib/pdf.tsx.
  const rechenwegSichtbar = zeigeRechenweg ?? quote.zeige_rechenweg_auf_pdf ?? true
  // CoS-E-008/033/036 (Sandy, 11.09.2026: „Rechnung erstmal raus"): Diese
  // Vorschau kannte einen Modus „rechnung", der nichts anderes tat, als
  // Überschriften auszutauschen — dieselbe Nummer, dieselbe
  // Unterschriftszeile, derselbe Angebots-Schlusstext. Der Umschalter dazu
  // ist aus dem Versand-Dialog raus; der Modus hier ebenfalls, statt als
  // toter Pfad liegen zu bleiben. Eine echte Rechnung ist ein eigenes
  // Vorhaben (eigener Nummernkreis, eigenes Layout, Leistungsdatum,
  // Steuernummer) und wird dann richtig gebaut, nicht wiederbelebt.
  const dokumentTitel = 'ANGEBOT'

  // Summen (inkl. Rabatt/Zuschlag wenn in quote gespeichert)
  const q = quote as Quote & {
    items: QuoteItem[]
    customer?: Customer | null
    discount_percent?: number
    discount_amount?: number
    surcharge_amount?: number
    surcharge_label?: string
  }
  const baseNet = quote.total_net
  const discountPct = q.discount_percent ?? 0
  const discountAmt = q.discount_amount ?? 0
  const discountValue = discountPct > 0 ? baseNet * (discountPct / 100) : discountAmt
  const surchargeAmt = q.surcharge_amount ?? 0
  const surchargeLabel = q.surcharge_label ?? 'Zuschlag'
  const netAfterDiscount = baseNet - discountValue
  const netWithSurcharge = netAfterDiscount + surchargeAmt
  const totalVat = !isKleinunternehmer && company.vat_rate > 0 ? netWithSurcharge * (company.vat_rate / 100) : 0
  const totalGross = netWithSurcharge + totalVat

  const co = company as Company & { ust_id?: string }

  // ── DC-123 (2026-09-17): Kopflogo wie im PDF ────────────────────────────
  //
  // Beides eins zu eins aus `lib/pdf.tsx` (dort `logoSrc` und `logoKopf`),
  // damit diese Ansicht ihr Versprechen hält.
  //
  // 1. WELCHES Bild: Das PDF nimmt `briefpapier.logo_url` und fällt erst
  //    dann auf `companies.logo_url` zurück. Diese Vorschau kannte nur die
  //    zweite Spalte — wer sein Logo im Briefpapier gewechselt hatte, sah
  //    hier weiter das alte und auf dem Papier das neue.
  //    (DC-124 hat die Rangfolge aus allen drei Ansichten in
  //    `lib/briefpapier-logo.ts` zusammengezogen — `logoQuelle()`. Sie ist
  //    unverändert, sie steht nur nicht mehr dreimal im Code.)
  // 2. WIE GROSS und WO: aus den Briefpapier-Schaltern „Größe" und
  //    „Position", in Pixeln — siehe `lib/briefpapier-logo.ts`.
  const logoSrc = logoQuelle(briefpapier, company).src
  const logo = logoKopfVorschau(briefpapier)
  // DC-122: Die Akzentfarbe aus demselben Briefpapier. Sie zieht auf dem
  // Papier genau zwei Linien — die unter dem Briefkopf und die über der
  // Gesamtsumme. Hier dieselben zwei, aus derselben Datei gerechnet, damit
  // die Vorschau ihr Versprechen hält (Regel: `lib/briefpapier-farbe.ts`).
  const akzent = akzentLinie(briefpapier)
  const logoBild = logoSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc}
      alt={company.name}
      className="object-contain mb-2"
      style={{ height: logo.hoehePx, maxWidth: logo.maxBreitePx }}
    />
  ) : null

  // Gleiches Muster wie lib/pdf.tsx: Der Rechenweg steht an den Rohdaten
  // (quote.items), gruppiereNachStruktur reicht ihn an den gruppierten
  // Einträgen nicht durch — deshalb einmal nach id auflösen.
  //
  // CoS-E-005/CoS-E-009 (11.09.2026): `annahmen` ist hier bewusst NICHT mehr
  // dabei. Diese Vorschau ist das Versprechen „so sieht dein Angebot für den
  // Kunden aus" — sie muss deshalb genau das zeigen, was lib/pdf.tsx druckt,
  // und dort sind die internen Annahmen jetzt raus (Begründung steht
  // ausführlich in lib/pdf.tsx an derselben Stelle). Zwei Ansichten, die
  // auseinanderlaufen, sind hier schon einmal teuer geworden.
  const opt = effektiveOptionen(quote, company, quote.customer?.ist_unternehmen)
  const rechenwegJeItem = new Map(
    quote.items.map(i => [i.id, { berechnungsweg: i.berechnungsweg }])
  )
  // Der eine Satz aus den Annahmen, der ausdrücklich AUF das Kundendokument
  // gehört (VOB-004/Legal G5): er erklärt, warum die abgerechnete Fläche
  // größer ist als die, die der Kunde nachmisst. Im PDF stand er längst —
  // in dieser Vorschau bisher nicht, die Vorschau zeigte also weniger als
  // das Papier. Gleiche Quelle wie lib/pdf.tsx, damit das so bleibt.
  const uebermessungJeItem = uebermessungsHinweiseJePosition(quote.items)
  // CoS-E-013/031/042 — gleiche Quelle wie lib/pdf.tsx.
  const gueltigBisDatum = gueltigBis(quote, opt.gueltigTage)
  // DC-056 (Manfred/TN-010): identisch zum PDF — gebündelt wird vor der
  // Gruppierung, damit Vorschau und Dokument dieselbe Zeilenliste zeigen.
  // PD-018 Punkt 2: Zeilen ohne Arbeit und ohne Geld (Menge 0, Prozent-
  // Zuschlag auf 0,00 €) gehören nicht auf das Kundenpapier. Nach dem
  // Bündeln, damit beide Regeln auf derselben Liste arbeiten, und vor der
  // Gruppierung, damit auch der flache Renderpfad unten sie erbt.
  const positionen = ohneNullzeilen(fasseKleinbetraegeZusammen(
    quote.items, opt.kleinbetraegeZusammenfassen, istAllgemeinPosition,
  ))
  const gruppen = gruppiereNachStruktur(positionen, opt.struktur, raeumeAusQuote(quote))
  // DC-125: Welche der angezeigten Zeilen keinen Preis hat. Über die IDs und
  // nicht über ein neues Feld im Gruppen-Typ — dieselbe Lösung wie beim
  // Übermessungs-Hinweis und beim Rechenweg weiter oben, aus demselben Grund
  // (`GruppenItem` kennt `price_item_id` nicht und soll es nicht lernen
  // müssen, nur damit eine Anzeige eine Farbe wählen kann).
  const ohnePreisIds = idsOhnePreis(positionen)
  const summeIstUnvollstaendig = ohnePreisIds.size > 0

  return (
    // DC-049 PDF-Schritt Nachtrag (2026-09-11, Sandy: "hier sieht das pdf so
    // aus wenn ich auf vorschau klicke" — diese Live-Vorschau und das echte
    // PDF waren auseinandergelaufen): `font-sans` überschrieb bisher die von
    // `body` geerbte Inter-Schrift mit Tailwinds System-Sans-Stack — diese
    // Vorschau lief nie auf einer Marken-Schrift. Jetzt einfach weglassen und
    // von `body` erben (siehe globals.css), wie der Rest der App.
    <div className="bg-white text-anthracite text-[10px] leading-normal min-h-full">
      {/* A4-artiges Paper-Layout */}
      <div className="px-12 py-10">

        {/* HEADER */}
        {/* DC-123 (2026-09-17): Position „mitte" — eigene, mittige Zeile ÜBER
            dem Kopf, genau wie im PDF (lib/pdf.tsx, S.logoZeileMitte).
            Bewusst nicht innerhalb der linken Spalte zentriert: das sähe nach
            Versehen aus, nicht nach Absicht. */}
        {logoBild && logo.position === 'mitte' && (
          <div className="flex justify-center mb-3">{logoBild}</div>
        )}
        <div className="flex justify-between items-start mb-10">
          <div className="max-w-[55%]">
            {/* DC-121 (2026-09-17): Zwei Abweichungen zum echten PDF, beide hier
                behoben. (1) Diese Vorschau zeigte das Logo ANSTELLE des
                Firmennamens — lib/pdf.tsx zeigt beides untereinander, und wer
                ein Logo hochlädt, verliert auf dem Kundenpapier seinen Namen
                nicht. (2) Die Höhe war mit `max-h-16` größer als der Kopf im
                PDF.
                DC-123 (2026-09-17): Der Rest der DC-121-Lücke ist damit zu —
                Größe und Position kommen jetzt aus dem Briefpapier (siehe
                `logoBild`/`logo` oben), nicht mehr fest aus dieser Datei. */}
            {logo.position === 'links' && logoBild}
            <div className="font-syne text-[20px] font-black text-anthracite leading-tight mb-1">{company.name}</div>
            <div className="text-[#666] text-[9px] leading-relaxed whitespace-pre-line">{company.address}</div>
            {co.ust_id && <div className="text-[#666] text-[9px] mt-1">USt-IdNr.: {co.ust_id}</div>}
            {!co.ust_id && company.tax_number && <div className="text-[#666] text-[9px] mt-1">Steuernummer: {company.tax_number}</div>}
            {company.iban && <div className="text-[#666] text-[9px]">IBAN: {company.iban}</div>}
          </div>
          {/* DC-123: Bei Position „rechts" steht das Logo über „ANGEBOT" —
              dieselbe Reihenfolge wie im PDF, wo Nr./Datum darunter rutschen.
              `items-end`, damit es an der rechten Kante bündig bleibt, auch
              wenn das Bild schmaler ist als die Beschriftung. */}
          <div className="flex flex-col items-end">
            {logo.position === 'rechts' && logoBild}
            {/* DC-049 PDF-Schritt Nachtrag (2026-09-11): war ein gelber Pill —
                das echte Kunden-PDF (lib/pdf.tsx, S.angebotLabel) ist auf
                Sandys Entscheidung hin bewusst neutral/grau, kein Gelb-Akzent.
                Diese Vorschau behauptet "so sieht dein Angebot für den Kunden
                aus" und muss deshalb dieselbe Farbgebung/Typografie zeigen. */}
            <span className="text-[#999] uppercase tracking-wider text-[9px] font-bold">{dokumentTitel}</span>
          </div>
        </div>

        {/* META — zweispaltig */}
        <div className="flex gap-10 mb-8">
          <div className="space-y-4 flex-1">
            {quote.customer && (
              <div>
                <div className="text-[#999] uppercase tracking-wider text-[8px] font-bold mb-1">
                  Angebot für
                </div>
                <div className="font-black text-[11px]">{quote.customer.name}</div>
                {quote.customer.address && (
                  <div className="text-[#666] text-[9px] leading-relaxed whitespace-pre-line">{quote.customer.address}</div>
                )}
                {quote.customer.email && <div className="text-[#666] text-[9px]">{quote.customer.email}</div>}
              </div>
            )}
          </div>
          <div className="space-y-2 text-[9px] text-right min-w-[160px]">
            <div className="flex justify-between gap-4">
              <span className="text-[#999] font-semibold">Angebotsnummer:</span>
              <span className="font-black">{quoteNumber}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#999] font-semibold">Datum:</span>
              <span>{fmtDate(quote.created_at)}</span>
            </div>
            {/* CoS-E-006/013/031/042 — Begründung steht in lib/pdf.tsx an
                derselben Stelle: „Zahlungsziel" ist Rechnungssprache, aufs
                Angebot gehört, wie lange der Preis gilt. */}
            {gueltigBisDatum && (
              <div className="flex justify-between gap-4">
                <span className="text-[#999] font-semibold">Gültig bis:</span>
                <span>{fmtDate(gueltigBisDatum)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Trennlinie — DC-122: erste der zwei Akzentlinien */}
        <div className="mb-6" style={{ borderTop: `1px solid ${akzent}` }} />

        {/* POSITIONEN-TABELLE */}
        <div>
          {/* Tabellenkopf */}
          <div className="bg-anthracite text-white flex rounded text-[9px] font-bold py-2 px-2.5 mb-0.5">
            <span style={{ width: '6%' }}>#</span>
            <span style={{ width: '40%' }}>Bezeichnung</span>
            <span style={{ width: '12%', textAlign: 'right' }}>Menge</span>
            <span style={{ width: '10%', textAlign: 'center' }}>Einh.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Einzelpr.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Gesamt</span>
          </div>

          {/* Zeilen — DC-049 PDF-Schritt Nachtrag Teil 2 (2026-09-11): jetzt
              nach Raum/Gewerk/Arbeitsablauf gruppiert wie das echte PDF
              (gruppiereNachStruktur), statt immer flach nach Position. */}
          {!gruppen ? (
            positionen.map((item, idx) => (
              <PositionsZeile
                key={item.id}
                position={item.position}
                idx={idx}
                title={item.title}
                description={item.description}
                berechnungsweg={item.berechnungsweg}
                uebermessungsHinweis={uebermessungJeItem.get(item.id)}
                quantity={item.quantity}
                unit={item.unit}
                unitPrice={item.unit_price}
                totalPrice={item.total_price}
                zeigeRechenweg={rechenwegSichtbar}
                ohnePreis={ohnePreisIds.has(item.id)}
              />
            ))
          ) : (() => {
            const { raeume, allgemein, hatMehrereRaeume } = gruppen
            const sektionen = [
              ...raeume.map(r => ({ typ: 'raum' as const, raum: r })),
              ...(allgemein.length > 0 ? [{ typ: 'allgemein' as const, raum: null }] : []),
            ]
            return sektionen.map(sek => (
              <div key={sek.typ === 'raum' ? sek.raum!.raumName : 'allg'}>
                <div className="bg-bg px-2.5 py-1.5 mt-3 first:mt-0">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#999]">
                    {sek.typ === 'raum' ? sek.raum!.raumName : 'Allgemein'}
                  </span>
                </div>
                {(sek.typ === 'raum' ? sek.raum!.items : allgemein).map((gi, idx) => (
                  <PositionsZeile
                    key={gi.id}
                    position={gi.position}
                    idx={idx}
                    title={gi.titleDisplay}
                    description={gi.description}
                    berechnungsweg={rechenwegJeItem.get(gi.id)?.berechnungsweg}
                    uebermessungsHinweis={uebermessungJeItem.get(gi.id)}
                    quantity={gi.quantity}
                    unit={gi.unit}
                    unitPrice={gi.unit_price}
                    totalPrice={gi.total_price}
                    zeigeRechenweg={rechenwegSichtbar}
                    ohnePreis={ohnePreisIds.has(gi.id)}
                  />
                ))}
                {hatMehrereRaeume && sek.typ === 'raum' && (
                  <div className="flex justify-end px-2.5 py-1.5 text-[8px]">
                    <span className="text-[#999] mr-3">Summe {sek.raum!.raumName}</span>
                    {/* DC-125: Eine Raumsumme, in der eine Zeile ohne Preis
                        steckt, ist zu niedrig — und zwar um genau den Betrag,
                        den niemand kennt. Sie steht deshalb nicht da. */}
                    <span className={`min-w-[60px] text-right ${sek.raum!.items.some(i => ohnePreisIds.has(i.id)) ? 'text-[#B00020]' : 'text-[#666]'}`}>
                      {sek.raum!.items.some(i => ohnePreisIds.has(i.id)) ? PREIS_FEHLT_KURZ : fmt(sek.raum!.summe)}
                    </span>
                  </div>
                )}
              </div>
            ))
          })()}
        </div>

        {/* Übermessungs-Erklärung — einmal, genau wie im PDF (VOB-004/G5). */}
        {uebermessungJeItem.size > 0 && (
          <div className="mt-3 pt-2 border-t border-[#E0E0DE] text-[8.5px] text-[#444] leading-relaxed">
            ¹ {UEBERMESSUNG_ERKLAERUNG}
          </div>
        )}

        {/* SUMMENBLOCK */}
        {/* DC-125 (Chief of Staff, 17.09.2026): Solange eine Position keinen
            Preis hat, gibt es hier keine Zahl — auch keine Zwischensumme und
            keine Steuer, denn beide rechnen auf derselben zu niedrigen Basis.
            Der Prüfmeister hat es in PD-022 auf den Punkt gebracht: eine
            offensichtlich falsche Summe ist schlimmer als gar keine. Was
            stattdessen dasteht, sagt in einem Satz, woran es liegt und wie
            viele Zeilen betroffen sind. */}
        {summeIstUnvollstaendig ? (
          <div className="flex justify-end mt-4">
            {/* Formgleich mit lib/pdf.tsx: dieselbe Akzentlinie an derselben
                Stelle, darunter dieselben zwei Zeilen. Diese Vorschau
                behauptet „so sieht dein Angebot für den Kunden aus" — sie
                muss das auch dann tun, wenn das Angebot noch keins ist
                (DC-049/DC-055 sind genau daran auseinandergelaufen). Die
                zweite Akzentlinie fällt hier weg, weil sie zur Gesamtsumme
                gehörte, die es nicht mehr gibt. */}
            <div className="w-[55%] text-[9px] pt-2.5" style={{ borderTop: `2px solid ${akzent}` }}>
              <div className="font-black text-[11px] text-[#B00020]">Gesamtbetrag noch offen</div>
              <div className="text-[#444] leading-relaxed mt-1">
                {fehlendePreiseSatz(ohnePreisIds.size, positionen.length)} Dieses Angebot ist
                noch nicht vollständig.
              </div>
            </div>
          </div>
        ) : (
        <div className="flex justify-end mt-4">
          <div className="bg-bg rounded-lg p-4 w-[45%] text-[9px]">
            <div className="flex justify-between mb-1">
              <span className="text-[#666]">Nettobetrag</span>
              <span>{fmt(baseNet)}</span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between mb-1 text-yellow">
                <span className="font-semibold">Rabatt {discountPct > 0 ? `${discountPct}%` : ''}</span>
                <span>−{fmt(discountValue)}</span>
              </div>
            )}
            {surchargeAmt > 0 && (
              <div className="flex justify-between mb-1">
                <span className="text-[#666]">{surchargeLabel}</span>
                <span>+{fmt(surchargeAmt)}</span>
              </div>
            )}
            {(discountValue > 0 || surchargeAmt > 0) && (
              <div className="flex justify-between mb-1 border-t border-[#E0E0DE] pt-1">
                <span className="text-[#666]">Netto gesamt</span>
                <span>{fmt(netWithSurcharge)}</span>
              </div>
            )}
            {!isKleinunternehmer && company.vat_rate > 0 && (
              <div className="flex justify-between mb-1">
                <span className="text-[#666]">MwSt. {company.vat_rate}%</span>
                <span>{fmt(totalVat)}</span>
              </div>
            )}
            {/* DC-122: zweite und letzte Akzentlinie */}
            <div className="flex justify-between mt-1.5 pt-1.5 font-black text-[12px]" style={{ borderTop: `2px solid ${akzent}` }}>
              <span>Gesamtbetrag</span>
              <span>{fmt(totalGross)}</span>
            </div>
          </div>
        </div>
        )}

        {/* §19 UStG */}
        {isKleinunternehmer && (
          <div className="mt-3 bg-bg rounded px-3 py-2 text-[8px] text-[#666]">
            Kein Ausweis von Umsatzsteuer gemäß § 19 UStG.
          </div>
        )}

        {/* Materialpreis-Hinweis */}
        {company.materialpreis_hinweis_aktiv && (
          <div className="mt-2 bg-[#FFFBEB] rounded px-3 py-2 text-[8px] text-[#92400E]">
            Hinweis: Die angegebenen Preise basieren auf aktuellen Materialkosten und können bei Preisänderungen der Lieferanten angepasst werden.
          </div>
        )}

        {/* Notizen */}
        {quote.notes && (
          <div className="mt-6">
            <div className="text-[#999] uppercase tracking-wider text-[8px] font-bold mb-1">Anmerkungen</div>
            <div className="text-[9px] text-[#444] leading-relaxed">{quote.notes}</div>
          </div>
        )}

        {/* Zahlungsbedingungen — bewusst als Bedingung formuliert, nicht als
            Fälligkeit (CoS-E-006), gleicher Wortlaut wie im PDF. */}
        <div className="mt-6 text-[9px] text-[#666]">
          Zahlungsbedingungen: {opt.zahlungszielTage} Tage nach Rechnungserhalt ohne Abzug.
        </div>

        {/* Unterschriftszeilen */}
        <div className="flex gap-16 mt-10">
          <div className="flex-1 border-t border-anthracite pt-1.5">
            <span className="text-[8px] text-[#666]">Datum, Unterschrift Auftraggeber</span>
          </div>
          <div className="flex-1 border-t border-anthracite pt-1.5">
            <span className="text-[8px] text-[#666]">{company.name}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-3 border-t border-[#E0E0DE] flex justify-between text-[8px] text-[#999]">
          <div>
            {company.name} · {company.address?.split('\n')[0]}
            {co.ust_id && ` · USt-IdNr.: ${co.ust_id}`}
            {!co.ust_id && company.tax_number && ` · St.-Nr.: ${company.tax_number}`}
          </div>
          <div className="text-right">
            {dokumentTitel} {quoteNumber}
            {company.iban && ` · IBAN: ${company.iban}`}
          </div>
        </div>

      </div>

      {/* KI-Hinweis — nur in Web-Vorschau, nicht im PDF */}
      <div className="mt-3 px-2 text-[10px] text-anthracite/30 font-medium text-center">
        Bitte das Angebot vor dem Versand prüfen. Sofortangebot haftet nicht für fehlerhafte Berechnungen.
      </div>

    </div>
  )
}
