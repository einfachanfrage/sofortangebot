import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = {
  title: 'Auftragsverarbeitungsvertrag (AVV) – Sofortangebot',
}

export default function AvvPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-[#2C2C2C]/8 bg-white">
        <Link href="/"><Logo variant="light" className="text-xl" /></Link>
      </nav>

      <div className="px-6 py-12 max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C2C2C]">Auftragsverarbeitungsvertrag (AVV)</h1>
          <p className="text-[#2C2C2C]/50 text-sm font-semibold mt-2">gemäß Art. 28 DSGVO · Stand: Juni 2026</p>
        </div>

        <section className="bg-white rounded-2xl p-6 border border-[#2C2C2C]/5">
          <div className="text-[#2C2C2C]/70 font-semibold text-sm leading-relaxed space-y-2">
            <p>Zwischen dem Nutzer von Sofortangebot (nachfolgend „Verantwortlicher") und</p>
            <p className="pl-4 border-l-2 border-[#F5C400]">
              Sandy Holm, Sofortangebot<br />
              Wielandstr. 11, 12159 Berlin<br />
              hallo@sofortangebot.app
            </p>
            <p>(nachfolgend „Auftragsverarbeiter")</p>
            <p className="pt-2">
              Dieser Vertrag gilt gemäß § 8.2 der{' '}
              <Link href="/agb" className="underline text-[#2C2C2C]">AGB</Link>{' '}
              mit Beginn der Nutzung von sofortangebot.app als abgeschlossen.
              Eine gesonderte Unterzeichnung ist nicht erforderlich.
            </p>
          </div>
        </section>

        {[
          {
            title: '§ 1 Gegenstand',
            content: 'Der Auftragsverarbeiter verarbeitet im Auftrag des Verantwortlichen personenbezogene Daten (Kundendaten des Verantwortlichen) zum Zweck der Angebots- und Rechnungserstellung über die Plattform sofortangebot.app.',
          },
          {
            title: '§ 2 Art der Daten',
            list: [
              'Name und Adresse der Kunden des Verantwortlichen',
              'E-Mail-Adressen der Kunden',
              'Telefonnummern der Kunden',
              'Auftragsbezogene Informationen (Leistungsbeschreibungen, Preise, Mengen)',
            ],
          },
          {
            title: '§ 3 Pflichten des Auftragsverarbeiters',
            list: [
              'Verarbeitung nur auf dokumentierte Weisung des Verantwortlichen',
              'Vertraulichkeit durch Verschwiegenheitsverpflichtung aller beteiligten Personen',
              'Ergreifung technischer und organisatorischer Maßnahmen (TOM) gemäß Art. 32 DSGVO',
              'Einsatz von Unterauftragnehmern nur mit vorheriger Genehmigung des Verantwortlichen',
              'Unterstützung bei der Erfüllung von Betroffenenrechten (Auskunft, Löschung, Berichtigung)',
              'Löschung oder Rückgabe aller Daten nach Vertragsende',
            ],
          },
          {
            title: '§ 4 Genehmigte Unterauftragnehmer',
            content: 'Der Verantwortliche erteilt hiermit seine generelle Genehmigung zur Beauftragung folgender Unterauftragnehmer:',
            list: [
              'Supabase Inc. (USA/EU) — Datenbankhosting, Serverstandort: Frankfurt/EU',
              'Groq Inc. (USA) — KI-Sprachverarbeitung (Transkription), Übermittlung auf Basis von EU-Standardvertragsklauseln',
              'OpenAI LLC (USA) — KI-Textverarbeitung, Übermittlung auf Basis von EU-Standardvertragsklauseln',
              'Vercel Inc. (USA) — Hosting der Webanwendung, Übermittlung auf Basis von EU-Standardvertragsklauseln',
              'Resend Inc. (USA) — E-Mail-Versand, Übermittlung auf Basis von EU-Standardvertragsklauseln',
              'Stripe Inc. (USA/EU) — Zahlungsabwicklung, Übermittlung auf Basis von EU-Standardvertragsklauseln',
            ],
          },
          {
            title: '§ 5 Technische und organisatorische Maßnahmen (TOM)',
            list: [
              'Verschlüsselte Datenübertragung (TLS 1.2+) und verschlüsselte Speicherung (AES-256)',
              'Zugriffskontrolle: Kundendaten sind ausschließlich dem authentifizierten Nutzer zugänglich (Row-Level Security)',
              'Tägliche automatische Datenbankbackups',
              'Protokollierung von Zugriffen',
              'Benachrichtigung des Verantwortlichen bei Sicherheitsvorfällen innerhalb von 72 Stunden',
            ],
          },
          {
            title: '§ 6 Rechte des Verantwortlichen',
            content: 'Der Verantwortliche hat das Recht, die Einhaltung der Datenschutzvorschriften durch den Auftragsverarbeiter zu kontrollieren. Kontrollen sind nach Ankündigung mit einer Frist von 14 Tagen möglich. Der Auftragsverarbeiter stellt alle erforderlichen Informationen zur Verfügung.',
          },
          {
            title: '§ 7 Laufzeit und Kündigung',
            content: 'Dieser AVV gilt für die Dauer des Nutzungsvertrags. Bei Vertragsende löscht der Auftragsverarbeiter die Daten des Verantwortlichen gemäß § 6.5 der AGB (30-tägige Übergangsfrist, dann unwiderrufliche Löschung).',
          },
          {
            title: '§ 8 Anwendbares Recht',
            content: 'Dieser AVV unterliegt dem Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin.',
          },
        ].map(s => (
          <section key={s.title} className="bg-white rounded-2xl p-6 border border-[#2C2C2C]/5">
            <h2 className="font-black text-[#2C2C2C] text-lg mb-4">{s.title}</h2>
            <div className="text-[#2C2C2C]/70 font-semibold text-sm leading-relaxed space-y-2">
              {s.content && <p>{s.content}</p>}
              {s.list && (
                <ul className="space-y-1.5 pl-1">
                  {s.list.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#F5C400] font-black mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-[#2C2C2C]/8 px-6 py-6 flex items-center justify-between">
        <Logo variant="light" className="text-sm" />
        <div className="flex gap-4 text-[#2C2C2C]/30 text-xs font-semibold">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/agb">AGB</Link>
          <Link href="/avv" className="text-[#2C2C2C]">AVV</Link>
        </div>
      </footer>
    </div>
  )
}
