import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = {
  title: 'Auftragsverarbeitungsvertrag (AVV) – Sofortangebot',
}

const sections = [
  {
    title: 'Präambel',
    paragraphs: [
      'Dieser Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO regelt die Verarbeitung personenbezogener Daten durch Sandy Holm, Inhaberin von Sofortangebot (nachfolgend „Auftragsverarbeiter"), im Auftrag der Nutzer der Plattform sofortangebot.app (nachfolgend „Verantwortlicher").',
      'Gemäß § 8.2 der AGB gilt dieser AVV mit Beginn der Nutzung der Plattform als abgeschlossen, ohne dass eine gesonderte Unterzeichnung erforderlich ist.',
    ],
  },
  {
    title: '§ 1 Gegenstand und Dauer der Verarbeitung',
    paragraphs: [
      '1.1 Gegenstand: Der Auftragsverarbeiter verarbeitet im Rahmen der Bereitstellung der Plattform sofortangebot.app personenbezogene Daten, die der Verantwortliche über seine Kunden und Geschäftspartner in die Plattform eingibt.',
      '1.2 Art der Daten: Name, Adresse, E-Mail-Adresse, Telefonnummer sowie sonstige vom Verantwortlichen eingegebene Kontakt- und Geschäftsdaten seiner Kunden.',
      '1.3 Betroffene Personen: Kunden und Geschäftspartner des Verantwortlichen.',
      '1.4 Zweck der Verarbeitung: Erstellung, Verwaltung und Versand von Angeboten im Auftrag des Verantwortlichen.',
      '1.5 Dauer: Für die Laufzeit des Nutzungsvertrags. Nach Vertragsende werden die Daten gemäß § 6.5 der AGB behandelt.',
    ],
  },
  {
    title: '§ 2 Pflichten des Auftragsverarbeiters',
    paragraphs: [
      '2.1 Der Auftragsverarbeiter verarbeitet personenbezogene Daten ausschließlich auf dokumentierte Weisung des Verantwortlichen (d. h. entsprechend der Nutzung der Plattform durch den Verantwortlichen).',
      '2.2 Der Auftragsverarbeiter gewährleistet, dass sich die zur Verarbeitung befugten Personen zur Vertraulichkeit verpflichtet haben.',
      '2.3 Der Auftragsverarbeiter ergreift alle erforderlichen technischen und organisatorischen Maßnahmen gemäß Art. 32 DSGVO.',
      '2.4 Der Auftragsverarbeiter unterstützt den Verantwortlichen soweit möglich bei der Erfüllung von Betroffenenrechten (Auskunft, Löschung, Berichtigung).',
      '2.5 Der Auftragsverarbeiter löscht oder gibt nach Wahl des Verantwortlichen alle personenbezogenen Daten zurück, nachdem die Erbringung der Verarbeitungsleistungen abgeschlossen ist.',
      '2.6 Der Auftragsverarbeiter stellt dem Verantwortlichen alle erforderlichen Informationen zum Nachweis der Einhaltung der in Art. 28 DSGVO niedergelegten Pflichten zur Verfügung.',
    ],
  },
  {
    title: '§ 3 Technische und organisatorische Maßnahmen (TOM)',
    paragraphs: [
      '3.1 Verschlüsselung: Alle Daten werden verschlüsselt übertragen (TLS 1.2+) und verschlüsselt gespeichert (AES-256).',
      '3.2 Zugriffskontrolle: Zugriff auf Kundendaten ist auf den jeweiligen authentifizierten Nutzer beschränkt (Row-Level Security in Supabase).',
      '3.3 Datenspeicherung: Daten werden auf Servern der Supabase Inc. im EU-Rechenzentrum Frankfurt (eu-central-1) gespeichert.',
      '3.4 Datensicherung: Supabase erstellt automatische tägliche Backups der Datenbank.',
      '3.5 Zugangsprotokollierung: Zugriffe auf die Plattform werden protokolliert.',
      '3.6 Incident Management: Bei Sicherheitsvorfällen wird der Verantwortliche unverzüglich, spätestens innerhalb von 72 Stunden, informiert.',
    ],
  },
  {
    title: '§ 4 Unterauftragsverarbeiter',
    paragraphs: [
      '4.1 Der Auftragsverarbeiter setzt folgende Unterauftragsverarbeiter ein:',
      'Supabase Inc. (USA/EU) — Datenbankhosting und Authentifizierung, Serverstandort: Frankfurt/EU · Groq Inc. (USA) — KI-Sprachverarbeitung (Transkription), Standardvertragsklauseln gemäß Art. 46 DSGVO · Resend Inc. (USA) — E-Mail-Versand, Standardvertragsklauseln gemäß Art. 46 DSGVO · Stripe Inc. (USA/EU) — Zahlungsabwicklung, Standardvertragsklauseln gemäß Art. 46 DSGVO · Vercel Inc. (USA) — Hosting der Webanwendung, Standardvertragsklauseln gemäß Art. 46 DSGVO.',
      '4.2 Der Verantwortliche erteilt hiermit seine generelle Genehmigung zur Beauftragung der genannten Unterauftragsverarbeiter. Bei wesentlichen Änderungen wird der Verantwortliche informiert und hat ein Einspruchsrecht.',
    ],
  },
  {
    title: '§ 5 Pflichten des Verantwortlichen',
    paragraphs: [
      '5.1 Der Verantwortliche ist dafür verantwortlich, dass er eine rechtmäßige Grundlage für die Verarbeitung der Daten seiner Kunden durch den Auftragsverarbeiter hat.',
      '5.2 Der Verantwortliche informiert den Auftragsverarbeiter unverzüglich über Fehler oder Unregelmäßigkeiten bei der Verarbeitung personenbezogener Daten.',
    ],
  },
  {
    title: '§ 6 Drittlandübermittlungen',
    paragraphs: [
      '6.1 Soweit Daten an Auftragsverarbeiter in Drittländern (insbesondere USA) übermittelt werden, erfolgt dies auf Basis der EU-Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO sowie ggf. des EU-U.S. Data Privacy Framework.',
      '6.2 Sprachaufnahmen (Audio) werden zur Transkription an Groq übermittelt und dort unmittelbar verarbeitet. Es werden keine Audioaufnahmen dauerhaft gespeichert.',
    ],
  },
  {
    title: '§ 7 Anwendbares Recht',
    paragraphs: [
      '7.1 Dieser AVV unterliegt dem Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin.',
      '7.2 Bei Widersprüchen zwischen diesem AVV und den AGB gehen die Bestimmungen dieses AVV vor, soweit es den Datenschutz betrifft.',
    ],
  },
]

export default function AvvPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-[#2C2C2C]/8 bg-white">
        <Link href="/"><Logo variant="light" className="text-xl" /></Link>
      </nav>

      <div className="px-6 py-12 max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C2C2C]">Auftragsverarbeitungsvertrag</h1>
          <p className="text-[#2C2C2C]/50 text-sm font-semibold mt-2">gemäß Art. 28 DSGVO · Stand: Juni 2026</p>
          <p className="text-[#2C2C2C]/60 text-sm font-semibold mt-1">
            Sandy Holm · Sofortangebot · Wielandstr. 11, 12159 Berlin · hallo@sofortangebot.app
          </p>
          <div className="mt-4 bg-[#F5C400]/15 border border-[#F5C400]/40 rounded-xl px-4 py-3 text-sm font-semibold text-[#2C2C2C]/70">
            Dieser AVV gilt gemäß § 8.2 der AGB automatisch mit Beginn der Nutzung von Sofortangebot als abgeschlossen.
            Ein gesondertes Unterzeichnen ist nicht erforderlich.
          </div>
        </div>

        {sections.map(section => (
          <section key={section.title} className="bg-white rounded-2xl p-6 border border-[#2C2C2C]/5">
            <h2 className="font-black text-[#2C2C2C] text-lg mb-4">{section.title}</h2>
            <div className="space-y-3 text-[#2C2C2C]/70 font-semibold text-sm leading-relaxed">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-[#2C2C2C]/8 px-6 py-6 flex items-center justify-between">
        <Logo variant="light" className="text-sm" />
        <div className="flex gap-4 text-[#2C2C2C]/30 text-xs font-semibold">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/avv" className="text-[#2C2C2C]">AVV</Link>
          <Link href="/agb">AGB</Link>
        </div>
      </footer>
    </div>
  )
}
