import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = {
  title: 'AGB – Sofortangebot',
}

export default function AgbPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-[#2C2C2C]/8 bg-white">
        <Link href="/"><Logo variant="light" className="text-xl" /></Link>
      </nav>

      <div className="px-6 py-12 max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C2C2C]">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-[#2C2C2C]/50 text-sm font-semibold mt-2">Stand: Juni 2026</p>
        </div>

        {[
          {
            title: '§ 1 Geltungsbereich',
            content: (
              <div className="space-y-2">
                <p>(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Sandra Holm (nachfolgend „Anbieter") und den Nutzern der SaaS-Plattform sofortangebot.app (nachfolgend „Dienst").</p>
                <p>(2) Der Dienst richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB (insbesondere selbstständige Handwerksbetriebe). Eine Nutzung durch Verbraucher im Sinne des § 13 BGB ist nicht gestattet.</p>
                <p>(3) Abweichende AGB des Nutzers gelten nicht, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
              </div>
            ),
          },
          {
            title: '§ 2 Leistungsbeschreibung',
            content: (
              <div className="space-y-2">
                <p>(1) Der Anbieter stellt dem Nutzer eine webbasierte Softwareplattform zur KI-gestützten Erstellung und Verwaltung von Handwerksangeboten zur Verfügung.</p>
                <p>(2) Der Leistungsumfang richtet sich nach dem vom Nutzer gewählten Tarif (Free, Starter, Pro). Details zu den Tarifen sind auf der Preisseite unter sofortangebot.app/preise abrufbar.</p>
                <p>(3) Der Anbieter ist berechtigt, den Funktionsumfang des Dienstes weiterzuentwickeln und anzupassen, sofern die wesentlichen Kernfunktionen erhalten bleiben.</p>
              </div>
            ),
          },
          {
            title: '§ 3 Vertragsschluss und Laufzeit',
            content: (
              <div className="space-y-2">
                <p>(1) Der Vertrag kommt durch Registrierung auf sofortangebot.app und — bei kostenpflichtigen Tarifen — durch Abschluss des Abonnements über Stripe zustande.</p>
                <p>(2) Kostenpflichtige Abonnements laufen monatlich und verlängern sich automatisch um einen weiteren Monat, wenn sie nicht bis zum letzten Tag der Laufzeit gekündigt werden.</p>
                <p>(3) Der Nutzer kann sein Abonnement jederzeit über die Einstellungen in der App oder per E-Mail an hallo@sofortangebot.app kündigen. Die Kündigung wird zum Ende der jeweils bezahlten Periode wirksam.</p>
                <p>(4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.</p>
              </div>
            ),
          },
          {
            title: '§ 4 Preise und Zahlung',
            content: (
              <div className="space-y-2">
                <p>(1) Die Preise für kostenpflichtige Tarife sind auf sofortangebot.app/preise einsehbar und verstehen sich zzgl. gesetzlicher Umsatzsteuer.</p>
                <p>(2) Die Zahlung erfolgt monatlich im Voraus über den Zahlungsdienstleister Stripe. Akzeptierte Zahlungsmittel werden im Checkout-Prozess angezeigt.</p>
                <p>(3) Gerät der Nutzer in Zahlungsverzug, ist der Anbieter berechtigt, den Zugang zu kostenpflichtigen Funktionen bis zum Ausgleich der offenen Forderung zu sperren.</p>
              </div>
            ),
          },
          {
            title: '§ 5 Pflichten des Nutzers',
            content: (
              <div className="space-y-2">
                <p>(1) Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen und diese aktuell zu halten.</p>
                <p>(2) Der Nutzer ist verantwortlich für die Vertraulichkeit seiner Zugangsdaten und für alle unter seinem Konto vorgenommenen Aktivitäten.</p>
                <p>(3) Der Nutzer ist selbst verantwortlich für die Rechtmäßigkeit der von ihm verarbeiteten Kundendaten und die Einhaltung der geltenden Datenschutzgesetze (insbesondere DSGVO) gegenüber seinen eigenen Kunden.</p>
                <p>(4) Der Nutzer darf den Dienst nicht missbräuchlich nutzen, insbesondere nicht zum Zwecke der Überlastung, des Reverse Engineering oder der unerlaubten Weitergabe an Dritte.</p>
              </div>
            ),
          },
          {
            title: '§ 6 Verfügbarkeit und Support',
            content: (
              <div className="space-y-2">
                <p>(1) Der Anbieter strebt eine Verfügbarkeit des Dienstes von 99 % im Jahresdurchschnitt an, schließt jedoch eine Garantie hierfür aus.</p>
                <p>(2) Wartungsarbeiten werden nach Möglichkeit in nutzungsarmen Zeiten durchgeführt und ggf. vorab angekündigt.</p>
                <p>(3) Support erfolgt per E-Mail an hallo@sofortangebot.app. Eine Reaktionszeit wird nicht garantiert.</p>
              </div>
            ),
          },
          {
            title: '§ 7 Haftung',
            content: (
              <div className="space-y-2">
                <p>(1) Der Anbieter haftet unbegrenzt bei Vorsatz und grober Fahrlässigkeit sowie bei schuldhafter Verletzung von Leben, Körper und Gesundheit.</p>
                <p>(2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt.</p>
                <p>(3) Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.</p>
                <p>(4) Der Anbieter haftet nicht für die inhaltliche Richtigkeit der durch KI generierten Angebotspositionen und Preise. Der Nutzer ist verpflichtet, KI-generierte Inhalte vor Verwendung zu prüfen.</p>
                <p>(5) Die vorstehenden Haftungsbeschränkungen gelten entsprechend für die persönliche Haftung der Organe, gesetzlichen Vertreter und Erfüllungsgehilfen des Anbieters.</p>
              </div>
            ),
          },
          {
            title: '§ 8 Datenschutz',
            content: (
              <p>
                Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{' '}
                <Link href="/datenschutz" className="text-[#F5C400] underline">Datenschutzerklärung</Link>.
                Zwischen dem Anbieter und dem Nutzer wird ggf. ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen, sofern der Nutzer im Rahmen der Plattform Kundendaten verarbeitet. Auf Anfrage stellen wir einen entsprechenden Vertrag zur Verfügung.
              </p>
            ),
          },
          {
            title: '§ 9 Änderungen der AGB',
            content: (
              <div className="space-y-2">
                <p>(1) Der Anbieter behält sich vor, diese AGB mit einer Ankündigungsfrist von 30 Tagen zu ändern. Die Ankündigung erfolgt per E-Mail an die hinterlegte Adresse.</p>
                <p>(2) Widerspricht der Nutzer den geänderten AGB nicht innerhalb der Frist, gelten die neuen AGB als angenommen. Auf diese Wirkung wird der Anbieter in der Ankündigung ausdrücklich hinweisen.</p>
              </div>
            ),
          },
          {
            title: '§ 10 Schlussbestimmungen',
            content: (
              <div className="space-y-2">
                <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).</p>
                <p>(2) Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist Berlin, sofern der Nutzer Kaufmann ist.</p>
                <p>(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
              </div>
            ),
          },
        ].map(section => (
          <section key={section.title} className="bg-white rounded-2xl p-6 border border-[#2C2C2C]/5">
            <h2 className="font-black text-[#2C2C2C] text-lg mb-4">{section.title}</h2>
            <div className="text-[#2C2C2C]/70 font-semibold text-sm leading-relaxed">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-[#2C2C2C]/8 px-6 py-6 flex items-center justify-between">
        <Logo variant="light" className="text-sm" />
        <div className="flex gap-4 text-[#2C2C2C]/30 text-xs font-semibold">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/agb" className="text-[#2C2C2C]">AGB</Link>
        </div>
      </footer>
    </div>
  )
}
