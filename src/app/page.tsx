import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ArrowRight, Mic, CheckCircle, ChevronDown } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7F5] font-sans">

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-5">
        <Logo variant="light" className="text-2xl" />
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-[#2C2C2C]/50 font-bold text-sm px-4 py-2">
            Login
          </Link>
          <Link href="/register" className="bg-[#2C2C2C] text-white font-black text-sm px-5 py-2.5 rounded-xl">
            Kostenlos testen
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 pt-10 pb-12">
        <div className="inline-flex items-center gap-2 bg-[#F5C400]/20 border border-[#F5C400]/40 rounded-full px-3 py-1.5 mb-6">
          <span className="text-xs font-black text-[#2C2C2C]/70 uppercase tracking-wide">Für Handwerker</span>
        </div>

        <h1 className="text-[2.6rem] font-black text-[#2C2C2C] leading-[1.05] mb-5 tracking-tight">
          Angebote schreiben<br />
          in unter{' '}
          <span className="relative inline-block">
            <span className="relative z-10">10 Minuten.</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#F5C400] -z-0 opacity-60"></span>
          </span>
        </h1>

        <p className="text-[#2C2C2C]/55 font-semibold text-lg leading-relaxed mb-8">
          Einfach eingesprochen. Fertig.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-3 bg-[#2C2C2C] text-white font-black text-lg px-7 py-4 rounded-2xl"
          >
            <Mic size={20} strokeWidth={2.5} />
            Jetzt kostenlos testen
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

        <p className="text-[#2C2C2C]/30 font-semibold text-sm">
          Keine Kreditkarte · Kein Abo-Zwang · Läuft auf dem Handy
        </p>
      </section>

      {/* VORHER / NACHHER */}
      <section className="px-6 pb-16">
        <div className="text-xs font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-4 text-center">Dein Abend. Vorher und nachher.</div>

        <div className="relative">
          {/* Vorher-Karte */}
          <div className="bg-white rounded-2xl p-5 border-2 border-red-100 mb-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-xs font-black text-red-400 uppercase tracking-widest">Früher — 22:47 Uhr</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                ['😩', 'Laptop aufgeklappt, Kaffee kalt'],
                ['📋', 'Preisliste suchen, Seite 14...'],
                ['⌨️', 'Alles eintippen, Position für Position'],
                ['🔁', 'Nochmal korrigieren weil Tippfehler'],
                ['📧', 'Um 23:15 Uhr endlich abgeschickt'],
              ].map(([emoji, text], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-base shrink-0">{emoji}</span>
                  <span className="text-sm font-semibold text-[#2C2C2C]/55">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trennlinie mit VS */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-[#2C2C2C]/10"></div>
            <div className="w-8 h-8 rounded-full bg-[#F5C400] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-black text-[#2C2C2C]">VS</span>
            </div>
            <div className="flex-1 h-px bg-[#2C2C2C]/10"></div>
          </div>

          {/* Nachher-Karte */}
          <div className="bg-[#2C2C2C] rounded-2xl p-5 border-2 border-[#2C2C2C]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#F5C400]"></div>
              <span className="text-xs font-black text-[#F5C400]/70 uppercase tracking-widest">Heute — 17:03 Uhr</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                ['🎙', 'Beim Kunden eingesprochen, 2 Min.'],
                ['🤖', 'KI erkennt Positionen und Mengen'],
                ['👀', 'Kurz drübergeschaut, passt'],
                ['📱', 'Angebot per Link verschickt'],
                ['✅', 'Kunde hat schon unterschrieben'],
              ].map(([emoji, text], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-base shrink-0">{emoji}</span>
                  <span className="text-sm font-semibold text-white/75">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section className="bg-[#2C2C2C] px-6 py-14">
        <h2 className="text-2xl font-black text-white mb-6">Du kennst das.</h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <p className="text-white/60 font-semibold text-base leading-relaxed">
            Acht Stunden auf der Baustelle. Dreck an den Händen, drei Rückrufe verpasst. Und abends sitzt du nochmal zwei Stunden am Tisch und tippst Angebote.
          </p>
          <p className="text-white/60 font-semibold text-base leading-relaxed">
            Während dein Kunde wartet. Während dein Mitbewerber schläft. Während du eigentlich längst Feierabend hättest.
          </p>
          <div className="bg-[#F5C400] rounded-2xl p-4 mt-2">
            <p className="text-[#2C2C2C] font-black text-base leading-snug">
              Viele Aufträge gehen nicht verloren weil du zu teuer bist — sondern weil das Angebot zu spät kam.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-[#F5C400] px-6 py-12">
        <div className="max-w-sm mx-auto">
          <div className="text-[#2C2C2C]/30 font-black text-5xl leading-none mb-4">"</div>
          <p className="text-[#2C2C2C] font-black text-xl leading-snug mb-6">
            Ich schick das Angebot raus, während der Kunde noch in der Wohnung ist. Das ist ein anderes Niveau.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2C2C2C] flex items-center justify-center shrink-0">
              <span className="text-[#F5C400] font-black text-sm">M</span>
            </div>
            <div>
              <div className="font-black text-[#2C2C2C] text-sm">Marco K.</div>
              <div className="text-[#2C2C2C]/50 font-semibold text-xs">Malerbetrieb, 8 Mitarbeiter</div>
            </div>
          </div>
        </div>
      </section>

      {/* WIE ES FUNKTIONIERT */}
      <section className="px-6 py-14">
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-2">So funktioniert Sofortangebot.</h2>
        <p className="text-[#2C2C2C]/40 font-semibold text-sm mb-10">Drei Schritte. Kein Handbuch.</p>

        <div className="flex flex-col gap-6 max-w-sm">
          {[
            {
              icon: '🎙',
              head: 'Eingesprochen',
              body: 'Du stehst beim Kunden und sprichst kurz rein: Raum, Maße, was gemacht werden soll. Fertig.',
            },
            {
              icon: '✓',
              head: 'Erkannt',
              body: 'Die KI versteht Handwerkersprache. Positionen, Mengen, Einheiten — alles automatisch.',
              accent: true,
            },
            {
              icon: '📄',
              head: 'Fertig',
              body: 'Ein sauberes PDF mit deinem Logo, deinen Preisen, deiner Unterschriftenzeile. Versandfertig.',
            },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-5 ${s.accent ? 'bg-[#2C2C2C]' : 'bg-white border border-[#2C2C2C]/8'}`}>
              <div className={`text-3xl mb-3 ${s.accent ? 'bg-[#F5C400] w-10 h-10 rounded-xl flex items-center justify-center text-lg' : ''}`}>
                {s.icon}
              </div>
              <div className={`font-black text-lg mb-1.5 ${s.accent ? 'text-white' : 'text-[#2C2C2C]'}`}>{s.head}</div>
              <div className={`font-semibold text-sm leading-relaxed ${s.accent ? 'text-white/55' : 'text-[#2C2C2C]/50'}`}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#F7F7F5] px-6 py-14">
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-2">Was du bekommst.</h2>
        <p className="text-[#2C2C2C]/40 font-semibold text-sm mb-8">Alles was du brauchst. Nichts was du nicht brauchst.</p>

        <div className="flex flex-col gap-3 max-w-sm">
          {[
            {
              icon: '🎙',
              head: 'Einfach eingesprochen',
              body: 'Kein Tippen. Kein Formular. Du redest wie auf der Baustelle — die KI versteht den Rest.',
            },
            {
              icon: '📋',
              head: '2.000+ Positionen',
              body: 'Alle Gewerke, alle Einheiten, realistische Marktpreise. Du musst nichts aufbauen — alles ist schon da.',
            },
            {
              icon: '📄',
              head: 'PDF sofort fertig',
              body: 'Mit deinem Logo, deiner Adresse, Zahlungsziel, Gewährleistung. Professionell ohne dass du eine Sekunde an Layout denkst.',
            },
            {
              icon: '✍️',
              head: 'Digital unterschreiben',
              body: 'Dein Kunde bekommt einen Link, tippt einmal auf seinem Handy — Auftrag erteilt. Kein Ausdrucken.',
            },
            {
              icon: '🔗',
              head: 'Lexoffice & sevDesk',
              body: 'Fertiges Angebot mit einem Tap rüberschieben. Keine Doppelarbeit, kein Abtippen.',
            },
            {
              icon: '🎙',
              head: 'Nachträglich ergänzen',
              body: 'Ersten Raum eingesprochen, eine Stunde später noch den zweiten. Die Session bleibt offen bis du fertig bist.',
            },
          ].map((f) => (
            <div key={f.head} className="flex gap-4 items-start bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
              <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] flex items-center justify-center shrink-0 text-xl">
                {f.icon}
              </div>
              <div>
                <div className="font-black text-[#2C2C2C] text-sm">{f.head}</div>
                <div className="text-[#2C2C2C]/45 font-semibold text-xs mt-0.5 leading-relaxed">{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTEGRATIONEN */}
      <section className="px-6 py-14 bg-white">
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-2">Passt zu deiner Software.</h2>
        <p className="text-[#2C2C2C]/45 font-semibold text-sm mb-8">Einmal verbinden, nie wieder doppelt eintippen.</p>

        <div className="mb-6">
          <div className="text-xs font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-3">Direkte Anbindung</div>
          <div className="grid grid-cols-3 gap-2">
            {['Lexoffice', 'sevDesk', 'FastBill', 'Billomat', 'Papierkram', 'Easybill'].map(name => (
              <div key={name} className="bg-[#F7F7F5] rounded-xl px-3 py-3 text-center border border-[#2C2C2C]/5">
                <div className="font-black text-[#2C2C2C] text-xs">{name}</div>
                <div className="w-2 h-2 rounded-full bg-green-400 mx-auto mt-1.5"></div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-3">CSV-Export</div>
          <div className="grid grid-cols-3 gap-2">
            {['DATEV', 'Sage', 'PlanCraft'].map(name => (
              <div key={name} className="bg-[#F7F7F5] rounded-xl px-3 py-3 text-center border border-[#2C2C2C]/5">
                <div className="font-black text-[#2C2C2C] text-xs">{name}</div>
                <div className="w-2 h-2 rounded-full bg-blue-400 mx-auto mt-1.5"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREISE */}
      <section className="px-6 py-14 bg-[#F7F7F5]">
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-1">Was kostet das.</h2>
        <p className="text-[#2C2C2C]/40 font-semibold mb-8 text-sm">Monatlich kündbar. Keine versteckten Kosten.</p>

        <div className="flex flex-col gap-3 max-w-sm">

          {/* Starter */}
          <div className="border-2 border-[#2C2C2C]/10 rounded-2xl p-5 bg-white">
            <div className="flex items-end justify-between mb-1">
              <div>
                <div className="font-black text-[#2C2C2C] text-lg">Reinschnuppern</div>
                <div className="text-[#2C2C2C]/40 text-xs font-semibold mt-0.5">Zum Ausprobieren</div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-[#2C2C2C]">0 €</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4 mt-4">
              {[
                '3 Angebote pro Monat',
                'PDF mit Sofortangebot-Logo',
                '1 Gewerk',
              ].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} color="#2C2C2C" strokeWidth={2.5} className="opacity-30 shrink-0" />
                  <span className="text-sm font-semibold text-[#2C2C2C]/60">{f}</span>
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="block w-full text-center bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 text-[#2C2C2C] font-black text-sm rounded-xl py-3"
            >
              Kostenlos starten →
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-[#2C2C2C] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#F5C400] text-[#2C2C2C] font-black text-xs px-4 py-1.5 rounded-bl-2xl">
              ⭐ Beliebteste Wahl
            </div>
            <div className="mb-1 pt-2">
              <div className="font-black text-white text-lg">Vollgas</div>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-black text-white">17 €</span>
                <span className="text-white/30 text-sm font-semibold pb-1">/Monat</span>
              </div>
              <div className="text-white/30 text-xs font-semibold">Bei Jahresabrechnung. Monatlich 22 €.</div>
            </div>
            <p className="text-[#F5C400] font-black text-sm mt-3 mb-4">
              Für einen Auftrag mehr im Monat hat sich das bezahlt gemacht.
            </p>
            <div className="flex flex-col gap-2 mb-5">
              {[
                'Unbegrenzte Angebote',
                'Alle 18 Gewerke',
                'PDF mit deinem Logo, kein Sofortangebot-Branding',
                'Digitale Unterschrift',
                'Lexoffice & sevDesk Export',
                'Mehrere Eingaben pro Angebot',
                'ZUGFeRD E-Rechnung',
                'Kundendatenbank',
              ].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} color="#F5C400" strokeWidth={2.5} className="shrink-0" />
                  <span className="text-sm font-semibold text-white/70">{f}</span>
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="block w-full text-center bg-[#F5C400] text-[#2C2C2C] font-black text-base rounded-xl py-3.5"
            >
              30 Tage gratis testen →
            </Link>
            <p className="text-white/25 text-xs font-semibold text-center mt-2">
              Kein Risiko. Monatlich kündbar. Keine versteckten Kosten.
            </p>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-14 bg-white">
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-8">Häufige Fragen.</h2>

        <div className="flex flex-col gap-1 max-w-sm">
          {[
            {
              q: 'Was wenn die KI mich nicht versteht?',
              a: 'Du siehst sofort was erkannt wurde und kannst es mit einem Tipp korrigieren. Und mit jedem Gewerk das du angibst wird das Matching besser — die KI kennt dann deine typischen Positionen.',
            },
            {
              q: 'Muss ich alle Preise selbst eingeben?',
              a: 'Nein. Sofortangebot lädt aktuelle Marktpreise für dein Gewerk. Du kannst sie übernehmen, anpassen oder deine eigenen eintragen. Dauert drei Minuten beim ersten Mal.',
            },
            {
              q: 'Funktioniert das auf dem Handy?',
              a: 'Ja. Genau dafür ist es gebaut. Parkplatz, Baustelle, Auto — wo auch immer du gerade bist.',
            },
            {
              q: 'Was passiert mit meinen Kundendaten?',
              a: 'Die liegen verschlüsselt auf Servern in Deutschland. Kein Verkauf, kein Tracking, kein Teilen mit Dritten. DSGVO-konform.',
            },
            {
              q: 'Ich bin Kleinunternehmer nach §19 UStG — geht das?',
              a: 'Ja, direkt beim Einrichten einstellbar. Auf deinen Angeboten steht dann der korrekte Hinweis, ohne MwSt-Ausweis.',
            },
            {
              q: 'Kann ich jederzeit kündigen?',
              a: 'Ja. Monatlich, ohne Frist, ohne Anruf. Einfach in den Einstellungen auf Kündigen klicken.',
            },
          ].map((faq, i) => (
            <details key={i} className="group border-b border-[#2C2C2C]/8 last:border-0">
              <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
                <span className="font-black text-[#2C2C2C] text-sm pr-4">{faq.q}</span>
                <ChevronDown size={16} color="#2C2C2C" className="shrink-0 opacity-30 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="text-[#2C2C2C]/55 font-semibold text-sm leading-relaxed pb-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-[#2C2C2C] text-center">
        <h2 className="text-3xl font-black text-white leading-tight mb-3">
          Dein nächstes Angebot.
        </h2>
        <p className="text-white/50 font-black text-lg mb-2">
          Nicht heute Abend am Laptop.
        </p>
        <p className="text-white/40 font-semibold text-base mb-10 leading-relaxed">
          Direkt vom Parkplatz. In unter 10 Minuten.<br />Während der Kunde noch neben dir steht.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-lg px-8 py-4 rounded-2xl"
        >
          Jetzt kostenlos starten <ArrowRight size={18} />
        </Link>
        <p className="text-white/25 font-semibold text-xs mt-4">
          Keine Kreditkarte. Keine Einarbeitung. Monatlich kündbar.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2C2C2C]/8 px-6 py-6 flex items-center justify-between bg-[#F7F7F5]">
        <Logo variant="light" className="text-sm" />
        <div className="flex gap-4 text-[#2C2C2C]/30 text-xs font-semibold">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/agb">AGB</Link>
        </div>
      </footer>

    </div>
  )
}
