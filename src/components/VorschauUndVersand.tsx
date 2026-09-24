'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import AngebotVorschau from './AngebotVorschau'
import { createClient } from '@/lib/supabase/client'
import { anredeZeile } from '@/lib/anrede'
import { getActiveIntegrations } from '@/lib/integrations'
import type { Quote, QuoteItem, Company, Customer, Briefpapier } from '@/lib/types'
import { nutzerFehler } from '@/lib/fehlertexte'

/**
 * DC-132 (2026-09-21) — das Blatt wird EINMAL verkleinert, außen.
 *
 * Vorher stand hier `width: 133%` mit `scale(0.75)`. Das hat die Vorschau
 * nicht auf A4 gebracht, sondern auf Panelbreite: bei 375 px Gerätebreite
 * rund 477 px Seitenbreite statt der 595 pt, die das Blatt hat — mit den
 * Schriftgrößen des Papiers (7/9/10) unverändert darauf. Eine A4-Seite auf
 * 78 % ihrer Breite, aber 100 % ihrer Typografie: dieselben Prozente wie im
 * PDF konnten dort gar nicht aufgehen, und genau deshalb hatte die Vorschau
 * eigene Spaltenbreiten (DC-127, offen gelassen).
 *
 * Jetzt rendert `AngebotVorschau` ein echtes Blatt (595 px = 595 pt) und
 * dieser Rahmen rechnet den Maßstab aus der tatsächlich verfügbaren Breite
 * aus, statt ihn zu raten. Zwei Dinge fallen damit weg: die feste
 * 133/0,75-Annahme (sie stimmte nur bei einer Panelbreite) und der leere
 * Streifen unter der Vorschau — `transform` verkleinert das Bild, nicht den
 * Platz, den das Element im Layout belegt, deshalb wird die Höhe hier
 * mitgerechnet.
 */
const BLATT_BREITE = 595

function BlattInPanelbreite({ children }: { children: React.ReactNode }) {
  const rahmen = useRef<HTMLDivElement>(null)
  const blatt = useRef<HTMLDivElement>(null)
  const [mass, setMass] = useState({ skala: 1, hoehe: 0 })

  useEffect(() => {
    const r = rahmen.current
    const b = blatt.current
    if (!r || !b) return
    const messen = () => {
      const breite = r.clientWidth
      if (!breite) return
      const skala = breite / BLATT_BREITE
      const hoehe = b.scrollHeight * skala
      // Gleiche Werte => gleiches Objekt zurückgeben. Sonst setzt dieser
      // Effekt die Höhe, die Höhenänderung weckt den Beobachter, und das
      // läuft im Kreis.
      setMass(alt =>
        Math.abs(alt.skala - skala) < 0.0001 && Math.abs(alt.hoehe - hoehe) < 0.5 ? alt : { skala, hoehe },
      )
    }
    messen()
    const beobachter = new ResizeObserver(messen)
    beobachter.observe(r)
    beobachter.observe(b)
    return () => beobachter.disconnect()
  }, [])

  return (
    <div ref={rahmen} style={{ height: mass.hoehe, overflow: 'hidden' }}>
      <div
        ref={blatt}
        style={{ transform: `scale(${mass.skala})`, transformOrigin: 'top left', width: BLATT_BREITE }}
      >
        {children}
      </div>
    </div>
  )
}

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null }
  company: Company
  quoteNumber: string
  onClose: () => void
  onSent?: (via: string) => void
  initialTab?: 'vorschau' | 'senden'
  /**
   * CoS-E-004/012/023/035 (Manfred, 11.09.2026): Was diesem Angebot noch
   * fehlt, bevor es zum Kunden darf — fehlender Kunde, unbepreiste
   * Positionen. Kommt aus `src/lib/versandbereit.ts`, derselben Quelle, die
   * auch den Fertigstellen-Knopf und die Versand-Route benutzen.
   *
   * Blockiert wird bewusst nur das SENDEN, nicht das Ansehen: Der Handwerker
   * muss sich sein Angebot anschauen dürfen, gerade wenn noch etwas fehlt —
   * er soll ja sehen, wo.
   */
  versandHindernisse?: string[]
  // DC-050 (2026-09-11): informiert AngebotDetail, sobald hier eine
  // Rechenweg-Antwort gespeichert wurde — die dortige `quote`-Prop bleibt
  // sonst auf dem Stand des Seitenladens, siehe Kommentar dort.
  onZeigeRechenwegChange?: (wert: boolean) => void
  // 2026-09-11 (Sandy: "NATÜRLICH im Senden-Dialog!!"): der
  // Buchhaltungs-Export lebte bisher im Aktionen-Sheet (⋯), jetzt als
  // eigener Tab hier. Bewusst EIGENER Callback statt `onSent` — `onSent`
  // markiert das Angebot als "an den Kunden gesendet" und schließt das
  // Sheet, beides falsch für einen Export ans eigene Buchhaltungsprogramm.
  // AngebotDetail hängt hier nur `trackVia` ein (Analyse-Tracking, kein
  // Status-Wechsel).
  onExported?: (provider: string, label: string) => void
  // DC-123 (2026-09-17): nur durchgereicht — das Briefpapier des Angebots,
  // damit die Vorschau Größe und Position des Logos so zeigt, wie das PDF
  // sie druckt. Ohne die Prop bleibt alles wie vorher (links, mittel).
  briefpapier?: Briefpapier | null
}

type SendTab = 'email' | 'whatsapp' | 'link' | 'buchhaltung'

function buildDefaultNachricht(
  company: Company,
  customer: Customer | null | undefined,
  quoteNumber: string
): string {
  // DC-078 (2026-09-11, Manfred/TN-075): hier stand
  // `Hallo ${customer.name.split(' ')[0]},` — Ton falsch und der „Vorname"
  // nur geraten. Siehe src/lib/anrede.ts.
  return `${anredeZeile(customer)}

vielen Dank für Ihr Interesse. Im Anhang finden Sie unser Angebot Nr. ${quoteNumber}.

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
${company.name}`
}

export default function VorschauUndVersand({ quote, company, quoteNumber, onClose, onSent, initialTab = 'vorschau', versandHindernisse = [], onZeigeRechenwegChange, onExported, briefpapier }: Props) {
  const supabase = createClient()
  const [mainTab, setMainTab] = useState<'vorschau' | 'senden'>(initialTab)
  const [sendTab, setSendTab] = useState<SendTab>('email')

  // 2026-09-11: Buchhaltungs-Tab nur zeigen, wenn der Nutzer mindestens eine
  // Software in den Einstellungen verknüpft hat — sonst wäre der Tab leer
  // und würde nur verwirren ("was soll ich hier?").
  const activeIntegrations = getActiveIntegrations(company)
  const [exportingProvider, setExportingProvider] = useState<string | null>(null)
  const [exportedProviders, setExportedProviders] = useState<string[]>([])
  const [exportError, setExportError] = useState<string | null>(null)

  async function handleExport(provider: string, label: string) {
    setExportingProvider(provider)
    setExportError(null)
    try {
      const r = await fetch(`/api/integrations/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.id }),
      })
      if (r.ok) {
        setExportedProviders(prev => prev.includes(provider) ? prev : [...prev, provider])
        onExported?.(provider, label)
      } else {
        const err = await r.json().catch(() => null)
        setExportError(nutzerFehler(err, `Übertragung zu ${label} fehlgeschlagen.`))
      }
    } catch (e) {
      setExportError(nutzerFehler(e, `Übertragung zu ${label} fehlgeschlagen.`))
    } finally {
      setExportingProvider(null)
    }
  }

  // DC-050 (2026-09-11, Sandys Entscheidung "Frage pro Angebot vor dem
  // PDF-Erstellen"): Rechenweg auf dem KUNDEN-PDF ist steuerbar
  // (quote.zeige_rechenweg_auf_pdf). `null` = noch nicht gefragt — dann
  // gilt der CI-Handbuch-Standard (sichtbar) und die Frage erscheint
  // genau hier, in der Vorschau, bevor einer der drei Versandwege
  // (E-Mail/WhatsApp/Link) das PDF erzeugt. Bewusst kein Blocker auf
  // dem Weg zum Senden: unbeantwortet bleibt der Rechenweg sichtbar, das ist der
  // sichere Standard, keine Lücke. Persistiert direkt am Angebot (nicht
  // pro Versandweg neu), damit Vorschau und echtes PDF (lib/pdf.tsx,
  // gleiche Rangfolge: Prop, dann gespeicherte Antwort, dann sichtbar)
  // immer dieselbe Antwort zeigen — Backend-Teil (Migration, lib/pdf.tsx):
  // Head of Product Engineering, docs/design-check.md DC-050.
  const [zeigeRechenweg, setZeigeRechenweg] = useState(quote.zeige_rechenweg_auf_pdf ?? true)
  const [rechenwegBeantwortet, setRechenwegBeantwortet] = useState(
    quote.zeige_rechenweg_auf_pdf !== null && quote.zeige_rechenweg_auf_pdf !== undefined
  )
  const [rechenwegSaving, setRechenwegSaving] = useState(false)

  async function beantworteRechenweg(antwort: boolean) {
    const vorherAntwort = zeigeRechenweg
    const vorherBeantwortet = rechenwegBeantwortet
    setZeigeRechenweg(antwort)
    setRechenwegBeantwortet(true)
    setRechenwegSaving(true)
    const { error } = await supabase.from('quotes').update({ zeige_rechenweg_auf_pdf: antwort }).eq('id', quote.id)
    setRechenwegSaving(false)
    if (error) {
      // Speichern fehlgeschlagen — nicht so tun, als wäre die Antwort
      // angekommen, sonst weicht die spätere Wirklichkeit (PDF liest die
      // Datenbank, nicht diesen lokalen State) von der Anzeige hier ab.
      setZeigeRechenweg(vorherAntwort)
      setRechenwegBeantwortet(vorherBeantwortet)
      return
    }
    onZeigeRechenwegChange?.(antwort)
  }

  // Email-Tab
  const [to, setTo] = useState(quote.customer?.email ?? '')
  const [betreff, setBetreff] = useState(`Angebot Nr. ${quoteNumber} – ${company.name}`)
  const [nachricht, setNachricht] = useState(() => buildDefaultNachricht(company, quote.customer, quoteNumber))

  // WhatsApp / Link
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [urlLoading, setUrlLoading] = useState(false)
  // 2026-09-11 (Sandy, Live-Test): WhatsApp/Link zeigten beide nur ein
  // stummes "Link konnte nicht generiert werden" — ohne jede Angabe, woran
  // es lag. Beide hängen an derselben `loadPublicUrl`, die bisher weder
  // `res.ok` noch die Fehlermeldung aus der API-Antwort auswertete und den
  // Fehler komplett verschluckte (kein catch). Backend-seitig (Engineering-
  // Domäne) konnte ich die Ursache von hier aus nicht abschließend
  // reproduzieren — kein Netzwerkzugriff auf Supabase aus meiner
  // Diagnose-Umgebung, und in Sentry liegt zu dieser Route kein einziges
  // Fehler-Event (die Route meldet Fehler bisher nicht an Sentry). Diese
  // Fehlermeldung macht den nächsten Fehlschlag wenigstens sichtbar, statt
  // ihn stumm zu verschlucken.
  const [urlError, setUrlError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Sending state
  const [sending, setSending] = useState(false)
  const [sentOk, setSentOk] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  // Vorschau-Banner
  const [showBanner, setShowBanner] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShowBanner(false), 3000)
    return () => clearTimeout(t)
  }, [])

  const loadPublicUrl = useCallback(async () => {
    if (publicUrl) return
    setUrlLoading(true)
    setUrlError(null)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/public-pdf`, { method: 'POST' })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.url) {
        setPublicUrl(data.url)
      } else {
        setUrlError(nutzerFehler(data, `Der Server hat den Link nicht erzeugt (Status ${res.status}).`))
      }
    } catch (e) {
      setUrlError(nutzerFehler(e, 'Verbindung zum Server fehlgeschlagen.'))
    } finally {
      setUrlLoading(false)
    }
  }, [quote.id, publicUrl])

  // Wenn WhatsApp oder Link geöffnet wird, URL vorab laden
  useEffect(() => {
    if (mainTab === 'senden' && (sendTab === 'whatsapp' || sendTab === 'link')) {
      loadPublicUrl()
    }
  }, [mainTab, sendTab, loadPublicUrl])

  // CoS-E-004/012/023/035: alle drei Versandwege gehen über dieselbe Route,
  // die serverseitig ebenfalls prüft — das hier ist nur die freundliche
  // Variante, damit der Handwerker nicht erst auf einen Fehler läuft.
  const darfSenden = versandHindernisse.length === 0

  async function handleSend() {
    if (!darfSenden) return
    setSending(true)
    setSendError(null)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: sendTab === 'email' ? to : '',
          betreff,
          nachricht,
          via: sendTab,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Fehler beim Senden')
      setSentOk(true)
      onSent?.(sendTab)
    } catch (e: unknown) {
      setSendError(nutzerFehler(e, 'Das Senden hat nicht geklappt — bitte nochmal versuchen.'))
    } finally {
      setSending(false)
    }
  }

  function handleWhatsApp() {
    if (!publicUrl || !darfSenden) return
    const text = encodeURIComponent(`${anredeZeile(quote.customer)}\n\nanbei das Angebot Nr. ${quoteNumber}:\n${publicUrl}\n\nBei Fragen gerne melden.\n\n${company.name}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
    // Status als gesendet markieren
    fetch(`/api/quotes/${quote.id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: '', betreff: '', nachricht: '', via: 'whatsapp' }),
    }).catch(() => {})
    onSent?.('whatsapp')
  }

  async function copyLink() {
    if (!publicUrl || !darfSenden) return
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // Status als gesendet markieren
    fetch(`/api/quotes/${quote.id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: '', betreff: '', nachricht: '', via: 'link' }),
    }).catch(() => {})
    onSent?.('link')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative mt-auto w-full bg-white rounded-t-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Tabs: Vorschau | Senden */}
        {/* DC-058 (2026-09-11, Manfred/TN-014): „Senden" stand doppelt — hier
            als Reiter und unten als Knopf, beide mit Pfeil, beide mit
            demselben Ziel. Anders als bei DC-046 ist hier keiner zu viel: oben
            ist Navigation, unten der nächste Schritt, nachdem man die Vorschau
            durchgelesen hat (den Fuß-Knopf zu streichen hieße, danach wieder
            hochscrollen zu müssen). Zu viel war die gleiche Beschriftung. Ein
            Reiter ist ein Substantiv und trägt keinen Pfeil; der Pfeil gehört
            der einen Aktion. */}
        <div className="flex border-b border-gray-100 mx-4 flex-shrink-0">
          <button
            onClick={() => setMainTab('vorschau')}
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'vorschau' ? 'border-yellow text-anthracite' : 'border-transparent text-gray-400'}`}
          >
            Vorschau
          </button>
          <button
            onClick={() => setMainTab('senden')}
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'senden' ? 'border-yellow text-anthracite' : 'border-transparent text-gray-400'}`}
          >
            Senden
          </button>
          <button onClick={onClose} className="px-4 text-gray-400 text-lg">✕</button>
        </div>

        {/* VORSCHAU TAB */}
        {mainTab === 'vorschau' && (
          <div className="flex-1 overflow-y-auto relative">
            {/* CoS-E-008/033/036 (Sandys Entscheidung, 11.09.2026: „Rechnung
                erstmal raus"): Hier stand ein Umschalter Angebot/Rechnung.
                Er hat nichts erzeugt — er tauschte zwei Überschriften aus und
                zeigte dasselbe Blatt: dieselbe Nummer (deshalb TN-086
                „Rechnungsnummer = Angebotsnummer"), dieselbe
                Unterschriftszeile (TN-087), derselbe Angebots-Schlusstext,
                ohne Leistungsdatum und Steuernummer (TN-089). Es gab
                folgerichtig auch keinen Weg vom beauftragten Angebot zur
                Rechnung (TN-091) — es gab nämlich gar keine Rechnung.
                Manfreds Sorge war berechtigt: „Zwei Rechnungsnummernkreise
                darf's nicht geben."
                Entfernt statt beschriftet, weil ein Reiter, der eine Rechnung
                verspricht, genau das Vertrauen kostet, um das es in TN-067
                geht. Was eine echte Rechnung bräuchte, steht in
                docs/chief-of-staff-engineering-todos.md — sie ist ein eigenes
                Vorhaben, kein Fix. */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 flex items-center justify-end border-b border-gray-100">
              <span className="text-[10px] text-gray-400">So sieht dein Angebot aus</span>
            </div>

            {/* Banner */}
            {showBanner && (
              <div className="mx-4 mt-3 bg-[#FFF9E6] border border-yellow/40 rounded-xl px-4 py-3 text-xs text-[#92400E] font-medium text-center transition-opacity">
                So sieht dein Angebot für den Kunden aus
              </div>
            )}

            {/* DC-050: Rechenweg-Frage — einmal pro Angebot, direkt hier vor
                dem Versand. Unbeantwortet bleibt der Rechenweg sichtbar
                (CI-Handbuch-Standard), deshalb kein Blocker vor dem Senden. */}
            {!rechenwegBeantwortet ? (
              <div className="mx-4 mt-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-anthracite">Rechenweg auf dem PDF zeigen?</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Für den Kunden nachvollziehbar, wie die Fläche berechnet wurde.</div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => beantworteRechenweg(false)}
                    disabled={rechenwegSaving}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50"
                  >
                    Nein
                  </button>
                  <button
                    onClick={() => beantworteRechenweg(true)}
                    disabled={rechenwegSaving}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-anthracite text-white disabled:opacity-50"
                  >
                    Ja
                  </button>
                </div>
              </div>
            ) : (
              <div className="mx-5 mt-3 flex items-center justify-between text-[11px] text-gray-400">
                <span>Rechenweg auf PDF: <span className="font-semibold text-gray-600">{zeigeRechenweg ? 'sichtbar' : 'ausgeblendet'}</span></span>
                <button
                  onClick={() => beantworteRechenweg(!zeigeRechenweg)}
                  disabled={rechenwegSaving}
                  className="font-semibold text-anthracite underline underline-offset-2 disabled:opacity-50"
                >
                  {zeigeRechenweg ? 'ausblenden' : 'einblenden'}
                </button>
              </div>
            )}

            {/* Skalierte Vorschau */}
            <div className="px-2 py-3">
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <BlattInPanelbreite>
                  <AngebotVorschau quote={quote} company={company} quoteNumber={quoteNumber} zeigeRechenweg={zeigeRechenweg} briefpapier={briefpapier} />
                </BlattInPanelbreite>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex gap-2">
              <button
                onClick={() => { setMainTab('senden'); setSendTab('email') }}
                className="flex-1 bg-anthracite text-white py-3 rounded-xl font-semibold text-sm"
              >
                Weiter zum Senden →
              </button>
            </div>
          </div>
        )}

        {/* SENDEN TAB */}
        {mainTab === 'senden' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Sub-Tabs */}
            <div className="flex gap-1 mx-4 mt-3 bg-gray-100 rounded-xl p-1 flex-shrink-0">
              {([
                'email', 'whatsapp', 'link',
                ...(activeIntegrations.length > 0 ? ['buchhaltung'] as SendTab[] : []),
              ] as SendTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSendTab(tab)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${sendTab === tab ? 'bg-white shadow text-anthracite' : 'text-gray-500'}`}
                >
                  {tab === 'email' ? '✉️ E-Mail' : tab === 'whatsapp' ? '💬 WhatsApp' : tab === 'link' ? '🔗 Link' : '📊 Buchhaltung'}
                </button>
              ))}
            </div>

            {/* R3 (2026-09-02, Head of Legal & Compliance, CoS-L-001): der
                KI-Hinweis war zwar in AGB §2.1/§10.2 und der Kommunikation
                enthalten, aber nirgends an der Stelle sichtbar, wo er wirkt
                — hier, unmittelbar vor dem Versenden. Bewusst kein
                Warnbanner, ein ruhiger Satz an der Freigabestelle. Stützt
                gleichzeitig die Prüfpflicht aus AGB §10.2 und, im
                Streitfall, ein Mitverschuldens-Argument. Gilt für alle drei
                Versandwege (E-Mail/WhatsApp/Link), deshalb hier über den
                Tabs statt dreifach je Tab. Für den Buchhaltungs-Export
                irrelevant (geht nicht an den Kunden), deshalb dort
                ausgeblendet. */}
            {sendTab !== 'buchhaltung' && versandHindernisse.length > 0 && (
              /* CoS-E-004/012/023/035: Vorher stand hier nur eine Warnung, die
                 man wegklicken konnte — Manfreds Angebot mit „Boden schützen
                 0,00 €" ist genau so rausgegangen und wurde angenommen
                 (TN-090). Jetzt sind die Versandwege gesperrt, solange etwas
                 fehlt. Der Buchhaltungs-Export bleibt frei: der geht nicht an
                 den Kunden. */
              <div className="mx-4 mt-3 px-3.5 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex-shrink-0">
                <div className="font-bold mb-1">Noch nicht fertig zum Senden</div>
                <ul className="space-y-0.5">
                  {versandHindernisse.map((h, i) => <li key={i}>· {h}</li>)}
                </ul>
              </div>
            )}
            {sendTab !== 'buchhaltung' && versandHindernisse.length === 0 && (
              <div className="mx-4 mt-3 px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-500 flex items-start gap-2 flex-shrink-0">
                <span className="shrink-0">✓</span>
                <span>Aus deinem Diktat erstellt — bitte einmal prüfen, bevor es rausgeht.</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

              {/* ── E-Mail Tab ─────────────────────────────────────────── */}
              {sendTab === 'email' && (
                <div className="space-y-3">
                  {sentOk ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                      <div className="text-4xl mb-2">✅</div>
                      <div className="font-bold text-green-800 text-base mb-1">Angebot gesendet!</div>
                      <div className="text-green-600 text-sm">Die E-Mail wurde an {to} geschickt.</div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">An</label>
                        <input
                          type="email"
                          value={to}
                          onChange={e => setTo(e.target.value)}
                          placeholder="kunde@beispiel.de"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow"
                        />
                        {/* DC-079 (2026-09-11, Manfred/TN-076): „‚An'-Feld
                            leer, Knopf grau, keine Erklärung. Sag mir, dass
                            die Mail-Adresse fehlt." Der Hinweis steht genau
                            da, wo man ihn beheben kann — am Feld, nicht am
                            grauen Knopf. Nicht rot: es ist nichts kaputt,
                            es fehlt etwas.
                            Nur wenn sonst nichts im Weg steht — liegt ein
                            echtes Versandhindernis vor, erklärt der Kasten
                            oben das bereits, und zwei Meldungen gleichzeitig
                            beantworten keine Frage doppelt, sie stellen eine
                            neue. */}
                        {/* DC-150: der Hinweis trug einen erfundenen Gelbton
                            (#8B7000). Das Handbuch kennt Success und Danger —
                            eine Warn-Rolle gibt es nicht, und eine zu erfinden
                            waere derselbe Fehler nochmal. Ein fehlendes Feld ist
                            kein Ausgang, also traegt es keine Farbe, sondern die
                            staerkste neutrale Textstufe: Anthrazit, 13,97:1 auf
                            Weiss — deutlich lauter als die grauen Feldlabels
                            daneben, und damit genau die Aufmerksamkeit, die der
                            Gelbton eigentlich wollte. */}
                        {!to.trim() && darfSenden && (
                          <p className="text-xs font-semibold text-anthracite mt-1.5 leading-relaxed">
                            {quote.customer?.name
                              ? `Für ${quote.customer.name} ist keine E-Mail-Adresse hinterlegt — hier eintragen, dann geht's raus.`
                              : 'Diesem Angebot ist noch kein Kunde zugewiesen — Adresse hier eintragen oder den Kunden am Angebot hinterlegen.'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Betreff</label>
                        <input
                          value={betreff}
                          onChange={e => setBetreff(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Nachricht</label>
                        <textarea
                          value={nachricht}
                          onChange={e => setNachricht(e.target.value)}
                          rows={8}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow resize-none"
                        />
                        <div className="text-[10px] text-gray-400 mt-0.5">PDF-Anhang wird automatisch beigefügt</div>
                      </div>
                      {sendError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                          {sendError}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── WhatsApp Tab ───────────────────────────────────────── */}
              {sendTab === 'whatsapp' && (
                <div className="space-y-4">
                  {urlLoading ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <div className="w-8 h-8 border-2 border-yellow border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-500">PDF wird vorbereitet…</span>
                    </div>
                  ) : publicUrl ? (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800">
                        <span className="font-semibold">Link bereit.</span> Der Kunde kann das Angebot direkt im Browser öffnen.
                      </div>
                      {/* 2026-09-11 (Sandy: "der link soll für user leicht
                          rauskopierbar sein"): bisher stand die URL hier nur
                          als reiner Text ohne Kopieren-Möglichkeit — man
                          musste sie von Hand markieren. Gleicher
                          Kopieren-Button wie im Link-Tab (copyLink, teilt
                          sich denselben `copied`-State), nicht nur "In
                          WhatsApp öffnen". */}
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-500 truncate">
                          {publicUrl}
                        </div>
                        <button
                          onClick={copyLink}
                          disabled={!darfSenden}
                          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 disabled:opacity-50 ${copied ? 'bg-green-100 text-green-700' : 'bg-anthracite text-white'}`}
                        >
                          {copied ? '✓ Kopiert' : 'Kopieren'}
                        </button>
                      </div>
                      <button
                        onClick={handleWhatsApp}
                        disabled={!darfSenden}
                        className="w-full bg-[#25D366] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <span className="text-base">💬</span> In WhatsApp öffnen
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8 space-y-2">
                      <div className="text-sm text-red-600 font-medium px-4">{urlError ?? 'Link konnte nicht generiert werden.'}</div>
                      <button onClick={loadPublicUrl} className="text-xs font-semibold text-anthracite underline underline-offset-2">
                        Erneut versuchen
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Link kopieren Tab ──────────────────────────────────── */}
              {sendTab === 'link' && (
                <div className="space-y-4">
                  {urlLoading ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <div className="w-8 h-8 border-2 border-yellow border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-500">PDF wird vorbereitet…</span>
                    </div>
                  ) : publicUrl ? (
                    <>
                      {/* QR Code */}
                      <div className="flex justify-center py-2">
                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm">
                          <QRCodeSVG value={publicUrl} size={160} bgColor="#ffffff" fgColor="#2C2C2C" />
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-gray-400">QR-Code scannen zum Öffnen</div>

                      {/* URL */}
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-500 truncate">
                          {publicUrl}
                        </div>
                        <button
                          onClick={copyLink}
                          disabled={!darfSenden}
                          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 ${copied ? 'bg-green-100 text-green-700' : 'bg-anthracite text-white'}`}
                        >
                          {copied ? '✓ Kopiert' : 'Kopieren'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 space-y-2">
                      <div className="text-sm text-red-600 font-medium px-4">{urlError ?? 'Link konnte nicht generiert werden.'}</div>
                      <button onClick={loadPublicUrl} className="text-xs font-semibold text-anthracite underline underline-offset-2">
                        Erneut versuchen
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Buchhaltung Tab ────────────────────────────────────── */}
              {sendTab === 'buchhaltung' && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500">
                    Angebot als Beleg an deine verknüpfte Buchhaltungssoftware übertragen.
                  </div>
                  {activeIntegrations.map(int => {
                    const isExporting = exportingProvider === int.id
                    const isExported = exportedProviders.includes(int.id)
                    return (
                      <button
                        key={int.id}
                        onClick={() => handleExport(int.id, int.label)}
                        disabled={isExporting}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 border font-semibold text-sm transition-colors disabled:opacity-50 ${
                          isExported ? 'border-green-200 bg-green-50 text-green-800' : 'border-gray-200 text-anthracite hover:bg-sunken'
                        }`}
                      >
                        <span className="font-black text-anthracite/35 text-xs w-[20px] text-center flex-shrink-0">{int.short}</span>
                        <span className="flex-1 text-left">
                          {isExporting ? 'Übertrage…' : isExported ? `Zu ${int.label} übertragen ✓` : `Zu ${int.label} übertragen`}
                        </span>
                      </button>
                    )
                  })}
                  {exportError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                      {exportError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Senden-Button. DC-079: am Desktop erklärt sich der graue Knopf
                zusätzlich beim Draufzeigen (title) — am Handy, wo es kein
                Draufzeigen gibt, tut das der Hinweis direkt am Feld. */}
            {sendTab === 'email' && !sentOk && (
              <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={handleSend}
                  disabled={!to || sending || !darfSenden}
                  title={!to.trim() ? 'Trag oben eine E-Mail-Adresse ein' : undefined}
                  className="w-full bg-anthracite text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                      Wird gesendet…
                    </>
                  ) : '✉️ Angebot jetzt senden'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
