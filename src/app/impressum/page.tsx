import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = {
  title: 'Impressum – Sofortangebot',
}

export default function ImpressumPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-[#2C2C2C]/8 bg-white">
        <Link href="/"><Logo variant="light" className="text-xl" /></Link>
      </nav>

      <div className="px-6 py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-[#2C2C2C] mb-8">Impressum</h1>

        <div className="prose prose-sm text-[#2C2C2C]/80 space-y-6">

          <section>
            <h2 className="font-black text-[#2C2C2C] text-lg mb-2">Angaben gemäß § 5 DDG</h2>
            <p className="font-semibold leading-relaxed">
              Sandra Holm<br />
              Wielandstr. 11<br />
              12159 Berlin<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="font-black text-[#2C2C2C] text-lg mb-2">Kontakt</h2>
            <p className="font-semibold leading-relaxed">
              Telefon: +49 151 20791652<br />
              E-Mail: <a href="mailto:hallo@sofortangebot.app" className="text-[#F5C400] underline">hallo@sofortangebot.app</a>
            </p>
          </section>

          <section>
            <h2 className="font-black text-[#2C2C2C] text-lg mb-2">Umsatzsteuer-Identifikationsnummer</h2>
            <p className="font-semibold leading-relaxed text-[#2C2C2C]/60">
              Wird nach steuerlicher Registrierung ergänzt.
            </p>
          </section>

          <section>
            <h2 className="font-black text-[#2C2C2C] text-lg mb-2">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p className="font-semibold leading-relaxed">
              Sandra Holm<br />
              Wielandstr. 11<br />
              12159 Berlin
            </p>
          </section>

          {/* Head of Legal & Compliance, 2026-09-02: Der Verweis auf die
              OS-Plattform der EU-Kommission stand hier als Pflichtangabe —
              die Plattform ist eingestellt und die zugrunde liegende
              ODR-Verordnung aufgehoben (Verordnung (EU) 2024/3228). Ein
              toter Link auf eine nicht mehr existierende Pflichtstelle ist
              keine Pflichterfüllung, sondern eine falsche Angabe. Die
              VSBG-Erklärung bleibt: § 36 VSBG verlangt sie unverändert. */}
          <section>
            <h2 className="font-black text-[#2C2C2C] text-lg mb-2">Verbraucherstreitbeilegung</h2>
            <p className="font-semibold leading-relaxed">
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
            </p>
          </section>

          <section>
            <h2 className="font-black text-[#2C2C2C] text-lg mb-2">Haftung für Inhalte</h2>
            <p className="font-semibold leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich. Nach § 7 Abs. 2 DDG in Verbindung mit Art. 8 der Verordnung (EU)
              2022/2065 (Digital Services Act) sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
              oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="font-black text-[#2C2C2C] text-lg mb-2">Haftung für Links</h2>
            <p className="font-semibold leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="font-black text-[#2C2C2C] text-lg mb-2">Urheberrecht</h2>
            <p className="font-semibold leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#2C2C2C]/8 px-6 py-6 flex items-center justify-between">
        <Logo variant="light" className="text-sm" />
        <div className="flex gap-4 text-[#2C2C2C]/30 text-xs font-semibold">
          <Link href="/impressum" className="text-[#2C2C2C]">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/agb">AGB</Link>
        </div>
      </footer>
    </div>
  )
}
