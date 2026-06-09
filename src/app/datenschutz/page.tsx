import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = {
  title: 'Datenschutzerklärung – Sofortangebot',
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-[#2C2C2C]/8 bg-white">
        <Link href="/"><Logo variant="light" className="text-xl" /></Link>
      </nav>

      <div className="px-6 py-12 max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-[#2C2C2C]">Datenschutzerklärung</h1>

        {[
          {
            title: '1. Verantwortlicher',
            content: (
              <p>
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br /><br />
                Sandra Holm<br />
                Wielandstr. 11<br />
                12159 Berlin<br />
                E-Mail: hallo@sofortangebot.app
              </p>
            ),
          },
          {
            title: '2. Erhobene Daten und Zwecke',
            content: (
              <div className="space-y-4">
                <div>
                  <strong className="font-black">Registrierung und Nutzerkonto</strong>
                  <p className="mt-1">Bei der Registrierung erheben wir E-Mail-Adresse und Passwort (verschlüsselt gespeichert). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
                </div>
                <div>
                  <strong className="font-black">Betriebsdaten</strong>
                  <p className="mt-1">Im Rahmen der Nutzung speichern wir: Firmenname, Adresse, Steuernummer, IBAN, Gewerke-Angaben sowie erstellte Angebote mit Kundendaten. Diese Daten sind für die Vertragserfüllung notwendig. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
                </div>
                <div>
                  <strong className="font-black">Spracheingaben</strong>
                  <p className="mt-1">Aufgenommene Spracheingaben werden zur Transkription an OpenAI übermittelt und unmittelbar danach gelöscht. Wir speichern keine Audiodateien. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
                </div>
                <div>
                  <strong className="font-black">Kundendaten</strong>
                  <p className="mt-1">Name, Adresse, E-Mail und Telefon von Kunden der Handwerksbetriebe werden ausschließlich zur Angebotserstellung verwendet. Der Nutzer ist für diese Daten selbst verantwortlich (Auftragsverarbeitung gemäß Art. 28 DSGVO). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
                </div>
                <div>
                  <strong className="font-black">Server-Logs</strong>
                  <p className="mt-1">Beim Zugriff auf unsere Dienste werden technische Zugriffsdaten (IP-Adresse, Zeitstempel, aufgerufene URL) für maximal 7 Tage gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an IT-Sicherheit).</p>
                </div>
              </div>
            ),
          },
          {
            title: '3. Auftragsverarbeiter',
            content: (
              <div className="space-y-4">
                <p>Wir setzen folgende Dienstleister als Auftragsverarbeiter ein. Mit allen wurde ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO geschlossen oder ist durch AGB abgedeckt:</p>
                <div>
                  <strong className="font-black">Supabase Inc. (Datenbank &amp; Authentifizierung)</strong>
                  <p className="mt-1">Datenbankhosting auf Servern in der EU (Frankfurt). Supabase verarbeitet alle gespeicherten Nutzerdaten. Datenschutzrichtlinie: <a href="https://supabase.com/privacy" className="text-[#F5C400] underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a></p>
                </div>
                <div>
                  <strong className="font-black">OpenAI, L.L.C. (KI-Analyse &amp; Spracherkennung)</strong>
                  <p className="mt-1">Spracheingaben und Textinhalte werden zur KI-gestützten Angebotserstellung an OpenAI übermittelt. OpenAI nutzt diese Daten nicht zum Training seiner Modelle (Enterprise-Bedingungen). Datenschutzrichtlinie: <a href="https://openai.com/privacy" className="text-[#F5C400] underline" target="_blank" rel="noopener noreferrer">openai.com/privacy</a></p>
                </div>
                <div>
                  <strong className="font-black">Resend Inc. (E-Mail-Versand)</strong>
                  <p className="mt-1">Beim Versand von Angeboten per E-Mail werden E-Mail-Adresse des Empfängers sowie der Angebotsinhalt an Resend übermittelt. Datenschutzrichtlinie: <a href="https://resend.com/privacy" className="text-[#F5C400] underline" target="_blank" rel="noopener noreferrer">resend.com/privacy</a></p>
                </div>
                <div>
                  <strong className="font-black">Stripe Inc. (Zahlungsabwicklung)</strong>
                  <p className="mt-1">Für Abonnement-Zahlungen nutzen wir Stripe. Zahlungsdaten werden direkt bei Stripe eingegeben und nicht von uns gespeichert. Datenschutzrichtlinie: <a href="https://stripe.com/privacy" className="text-[#F5C400] underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></p>
                </div>
                <div>
                  <strong className="font-black">Vercel Inc. (Hosting)</strong>
                  <p className="mt-1">Die Webanwendung wird auf Servern von Vercel gehostet. Datenschutzrichtlinie: <a href="https://vercel.com/legal/privacy-policy" className="text-[#F5C400] underline" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a></p>
                </div>
              </div>
            ),
          },
          {
            title: '4. Drittland-Übermittlungen',
            content: (
              <p>
                OpenAI, Resend, Stripe und Vercel sind US-amerikanische Unternehmen. Die Übermittlung personenbezogener Daten in die USA erfolgt auf Basis der EU-Standardvertragsklauseln gemäß Art. 46 Abs. 2 lit. c DSGVO sowie – sofern anwendbar – auf Basis des EU-US Data Privacy Framework (Art. 45 DSGVO). Alle genannten Anbieter sind im Data Privacy Framework zertifiziert oder haben entsprechende Garantien getroffen.
              </p>
            ),
          },
          {
            title: '5. Cookies und lokale Speicherung',
            content: (
              <p>
                Wir verwenden ausschließlich technisch notwendige Cookies für die Authentifizierung (Session-Token). Diese Cookies sind für den Betrieb des Dienstes erforderlich und können nicht deaktiviert werden. Es werden keine Tracking-, Analyse- oder Werbe-Cookies eingesetzt. Eine Einwilligung nach § 25 TTDSG ist für technisch notwendige Cookies nicht erforderlich.
              </p>
            ),
          },
          {
            title: '6. Speicherdauer',
            content: (
              <div className="space-y-2">
                <p><strong className="font-black">Nutzerdaten:</strong> Bis zur Löschung des Accounts oder auf Anfrage.</p>
                <p><strong className="font-black">Angebote und Kundendaten:</strong> Bis zur Löschung durch den Nutzer oder Löschung des Accounts. Handelsrechtlich relevante Daten können bis zu 10 Jahre aufbewahrt werden (§ 257 HGB, § 147 AO).</p>
                <p><strong className="font-black">Zahlungsdaten bei Stripe:</strong> Gemäß gesetzlicher Aufbewahrungspflichten (bis zu 10 Jahre).</p>
                <p><strong className="font-black">Server-Logs:</strong> 7 Tage.</p>
              </div>
            ),
          },
          {
            title: '7. Betroffenenrechte',
            content: (
              <div className="space-y-2">
                <p>Sie haben das Recht auf:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Auskunft</strong> über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
                  <li><strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)</li>
                  <li><strong>Löschung</strong> Ihrer Daten (Art. 17 DSGVO)</li>
                  <li><strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)</li>
                  <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                  <li><strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)</li>
                </ul>
                <p className="mt-3">Zur Ausübung Ihrer Rechte wenden Sie sich an: <a href="mailto:hallo@sofortangebot.app" className="text-[#F5C400] underline">hallo@sofortangebot.app</a></p>
                <p>Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig für Berlin: <a href="https://www.datenschutz-berlin.de" className="text-[#F5C400] underline" target="_blank" rel="noopener noreferrer">Berliner Beauftragte für Datenschutz und Informationsfreiheit</a>.</p>
              </div>
            ),
          },
          {
            title: '8. Accountlöschung',
            content: (
              <p>
                Sie können Ihren Account jederzeit löschen. Alle mit Ihrem Account verbundenen Daten werden dann vollständig und unwiderruflich gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Die Löschung können Sie über die Einstellungen in der App oder per E-Mail an <a href="mailto:hallo@sofortangebot.app" className="text-[#F5C400] underline">hallo@sofortangebot.app</a> beantragen.
              </p>
            ),
          },
          {
            title: '9. Aktualität dieser Datenschutzerklärung',
            content: (
              <p>
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Juni 2026. Durch die Weiterentwicklung unserer Dienste oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung anzupassen. Die jeweils aktuelle Datenschutzerklärung ist unter dieser Adresse abrufbar.
              </p>
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
          <Link href="/datenschutz" className="text-[#2C2C2C]">Datenschutz</Link>
        </div>
      </footer>
    </div>
  )
}
