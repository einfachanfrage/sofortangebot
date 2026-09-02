import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = {
  title: 'AGB – Sofortangebot',
}

const sections = [
  {
    title: '§ 1 Geltungsbereich',
    paragraphs: [
      '1.1 Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Sandy Holm, Inhaberin von Sofortangebot (nachfolgend „Anbieter"), und den Nutzern der Software-as-a-Service Plattform sofortangebot.app (nachfolgend „Nutzer").',
      '1.2 Sofortangebot richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB. Die Nutzung durch Verbraucher ist ausgeschlossen.',
      '1.3 Abweichende AGB des Nutzers haben keine Gültigkeit, es sei denn, der Anbieter stimmt diesen ausdrücklich schriftlich zu.',
    ],
  },
  {
    title: '§ 2 Leistungsbeschreibung',
    paragraphs: [
      '2.1 Sofortangebot ist eine KI-gestützte Software-as-a-Service Plattform, die Handwerkern und Dienstleistern die Erstellung von Angeboten mittels Spracheingabe ermöglicht.',
      '2.2 Der Anbieter stellt dem Nutzer Zugang zur Plattform über das Internet bereit. Ein Anspruch auf eine bestimmte Verfügbarkeit besteht nicht, der Anbieter strebt jedoch eine Verfügbarkeit von 99 % pro Monat an (ausgenommen geplante Wartungsarbeiten).',
      '2.3 Die durch die KI generierten Angebote, Preise und Positionen sind Richtwerte und ersetzen keine fachkundige Kalkulation. Der Nutzer ist für die Richtigkeit der erstellten Angebote selbst verantwortlich.',
      '2.4 Der Anbieter behält sich vor, den Funktionsumfang der Plattform jederzeit zu erweitern, zu ändern oder einzelne Funktionen einzustellen, sofern dies dem Nutzer zumutbar ist.',
    ],
  },
  {
    title: '§ 3 Vertragsschluss & Registrierung',
    paragraphs: [
      '3.1 Der Vertrag kommt durch die Registrierung des Nutzers und die Bestätigung durch den Anbieter (auch konkludent durch Freischaltung des Zugangs) zustande.',
      '3.2 Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen und diese aktuell zu halten.',
      '3.3 Pro Betrieb ist grundsätzlich ein Account vorgesehen. Mehrere Nutzer-Accounts desselben Betriebs sind nur im Rahmen des jeweiligen Tarifplans zulässig.',
    ],
  },
  {
    title: '§ 4 Tarifpläne & Preise',
    paragraphs: [
      '4.1 Sofortangebot wird in verschiedenen Tarifplänen angeboten. Die aktuellen Preise und Leistungen ergeben sich aus der Preisübersicht auf sofortangebot.app zum Zeitpunkt des Vertragsschlusses.',
      '4.2 Alle Preise verstehen sich als Nettopreise. Der Anbieter handelt als Kleinunternehmer gemäß § 19 UStG — es wird keine Umsatzsteuer ausgewiesen.',
      '4.3 Kostenlose Testzeiträume gelten einmalig pro Betrieb. Der Anbieter behält sich vor, Missbrauch durch mehrfache Registrierungen zu unterbinden.',
      '4.4 Der Anbieter behält sich vor, Preise mit einer Ankündigungsfrist von 30 Tagen per E-Mail zu ändern. Bestandskunden, die zum Zeitpunkt der Ankündigung aktive zahlende Nutzer sind, behalten ihren bestehenden Preis für die Dauer ihrer ununterbrochenen Mitgliedschaft (Grandfathering).',
    ],
  },
  {
    title: '§ 5 Zahlung & Abrechnung',
    paragraphs: [
      '5.1 Die Abrechnung erfolgt monatlich oder jährlich im Voraus, je nach gewähltem Tarifplan, über den Zahlungsdienstleister Stripe.',
      '5.2 Zahlungen werden automatisch zum Beginn jedes Abrechnungszeitraums eingezogen. Bei fehlgeschlagener Zahlung behält sich der Anbieter vor, den Zugang nach angemessener Nachfrist zu sperren.',
      '5.3 Rückerstattungen sind grundsätzlich ausgeschlossen, es sei denn, der Anbieter hat eine wesentliche Leistungspflicht nicht erfüllt.',
    ],
  },
  {
    title: '§ 6 Laufzeit & Kündigung',
    paragraphs: [
      '6.1 Der Vertrag wird auf unbestimmte Zeit geschlossen und ist monatlich zum Ende des jeweiligen Abrechnungszeitraums kündbar.',
      '6.2 Die Kündigung erfolgt durch den Nutzer direkt in den Einstellungen der Plattform oder per E-Mail an hallo@sofortangebot.app.',
      '6.3 Nach Kündigung bleibt der Zugang bis zum Ende des bezahlten Zeitraums bestehen. Eine anteilige Erstattung bereits bezahlter Beträge erfolgt nicht.',
      '6.4 Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund liegt insbesondere vor bei schwerem Vertragsverstoß des Nutzers, Zahlungsverzug von mehr als 30 Tagen oder Missbrauch der Plattform.',
      '6.5 Nach Vertragsende werden die Daten des Nutzers für 30 Tage vorgehalten und können exportiert werden. Danach werden sie unwiderruflich gelöscht.',
    ],
  },
  {
    title: '§ 7 Nutzungsrechte & Pflichten',
    paragraphs: [
      '7.1 Der Anbieter räumt dem Nutzer ein nicht-exklusives, nicht übertragbares Recht zur Nutzung der Plattform für die Dauer des Vertragsverhältnisses ein.',
      '7.2 Der Nutzer darf die Plattform ausschließlich für eigene betriebliche Zwecke nutzen. Eine Weitergabe von Zugangsdaten an Dritte außerhalb des eigenen Betriebs ist untersagt.',
      '7.3 Der Nutzer ist verantwortlich für alle Inhalte, die er in der Plattform erfasst, und für die Angebote, die er an Dritte versendet. Der Anbieter übernimmt keine Haftung für die inhaltliche Richtigkeit erstellter Angebote oder Rechnungen.',
      '7.4 Folgendes ist dem Nutzer untersagt: Reverse Engineering oder Dekompilierung der Software; automatisierter Zugriff auf die Plattform (Scraping, Bots); Nutzung der Plattform für illegale Zwecke; Umgehung von Zugangskontrollen oder Sicherheitsmechanismen.',
    ],
  },
  {
    title: '§ 8 Daten & Datenschutz',
    paragraphs: [
      '8.1 Der Anbieter verarbeitet personenbezogene Daten gemäß der Datenschutzerklärung unter sofortangebot.app/datenschutz.',
      '8.2 Für die Verarbeitung personenbezogener Daten Dritter (z. B. Kundendaten des Nutzers) durch die Plattform wird ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO geschlossen. Dieser ist unter sofortangebot.app/avv abrufbar und gilt mit Nutzungsbeginn als abgeschlossen.',
      '8.3 Sprachaufnahmen werden zur Transkription an OpenAI übermittelt. Die Aufnahme wird auf unseren Servern in der EU gespeichert, damit sie erneut angehört und die Auswertung wiederholt werden kann, und spätestens 30 Tage nach der Aufnahme automatisch gelöscht — vorher jederzeit auf Wunsch des Nutzers. Transkript und die daraus erzeugten Positionen bleiben als Teil des Angebots erhalten.',
      '8.4 Der Anbieter speichert Daten auf Servern der Supabase Inc. innerhalb der EU (Rechenzentrum Frankfurt).',
    ],
  },
  {
    title: '§ 9 Haftung',
    paragraphs: [
      '9.1 Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen.',
      '9.2 Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und nur in Höhe des vertragstypisch vorhersehbaren Schadens, maximal jedoch in Höhe der vom Nutzer in den letzten 12 Monaten gezahlten Vergütung.',
      '9.3 Der Anbieter haftet nicht für: inhaltliche Fehler in KI-generierten Angeboten oder Preisen; steuerrechtliche oder rechtliche Richtigkeit von Rechnungen und Angeboten; Datenverlust durch höhere Gewalt oder Angriffe Dritter; Ausfälle von Drittdiensten (OpenAI, Supabase, Vercel, Stripe).',
      '9.4 Die Haftungsbeschränkungen gelten nicht, soweit der Anbieter einen Mangel arglistig verschwiegen oder eine Garantie übernommen hat.',
    ],
  },
  {
    title: '§ 10 Preise & Richtwerte (Haftungsausschluss KI)',
    paragraphs: [
      '10.1 Die in Sofortangebot hinterlegten Preise sind Marktrichtwerte und dienen als Kalkulationshilfe. Sie stellen keine verbindliche Preisempfehlung dar.',
      '10.2 Die durch KI-Spracheingabe erstellten Angebote sind maschinell generiert und können Fehler enthalten. Der Nutzer ist verpflichtet, jedes Angebot vor dem Versand zu prüfen und für dessen Inhalt die alleinige Verantwortung zu tragen.',
      '10.3 Sofortangebot ersetzt keine steuerliche, rechtliche oder betriebswirtschaftliche Beratung.',
    ],
  },
  {
    title: '§ 11 Änderungen der AGB',
    paragraphs: [
      '11.1 Der Anbieter behält sich vor, diese AGB mit einer Ankündigungsfrist von 30 Tagen per E-Mail zu ändern.',
      '11.2 Widerspricht der Nutzer den geänderten AGB nicht innerhalb von 30 Tagen nach Zugang der Benachrichtigung, gelten die neuen AGB als akzeptiert. Auf dieses Widerspruchsrecht wird in der Benachrichtigung ausdrücklich hingewiesen.',
      '11.3 Im Falle eines Widerspruchs ist der Anbieter berechtigt, das Vertragsverhältnis zum Zeitpunkt des Inkrafttretens der neuen AGB zu beenden.',
    ],
  },
  {
    title: '§ 12 Schlussbestimmungen',
    paragraphs: [
      '12.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).',
      '12.2 Erfüllungsort und Gerichtsstand ist Berlin, sofern der Nutzer Kaufmann ist oder keinen allgemeinen Gerichtsstand in Deutschland hat.',
      '12.3 Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.',
    ],
  },
]

export default function AgbPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-[#2C2C2C]/8 bg-white">
        <Link href="/"><Logo variant="light" className="text-xl" /></Link>
      </nav>

      <div className="px-6 py-12 max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C2C2C]">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-[#2C2C2C]/50 text-sm font-semibold mt-2">Stand: Juni 2026 · Version 2026-06</p>
          <p className="text-[#2C2C2C]/60 text-sm font-semibold mt-1">
            Sandy Holm · Sofortangebot · Wielandstr. 11, 12159 Berlin · hallo@sofortangebot.app
          </p>
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
          <Link href="/avv">AVV</Link>
          <Link href="/agb" className="text-[#2C2C2C]">AGB</Link>
        </div>
      </footer>
    </div>
  )
}
