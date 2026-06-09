import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ArrowRight, Mic, CheckCircle } from 'lucide-react'

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
      <section className="px-6 pt-10 pb-16">
        <h1 className="text-[2.8rem] font-black text-[#2C2C2C] leading-[1.05] mb-5 tracking-tight">
          Angebot fertig,<br />
          bevor du<br />
          <span className="relative inline-block">
            <span className="relative z-10">beim Kunden weg bist.</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#F5C400] -z-0 opacity-60"></span>
          </span>
        </h1>

        <p className="text-[#2C2C2C]/55 font-semibold text-lg leading-relaxed mb-10 max-w-xs">
          Aufmaß kurz einsprechen. KI macht das Angebot. Du schaust drüber und schickst es raus.
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-3 bg-[#2C2C2C] text-white font-black text-lg px-7 py-4 rounded-2xl"
        >
          <Mic size={20} strokeWidth={2.5} />
          Jetzt kostenlos starten
        </Link>
        <p className="text-[#2C2C2C]/30 font-semibold text-sm mt-3">Keine Kreditkarte. Kein Abo-Trick.</p>
      </section>

      {/* VORHER / NACHHER */}
      <section className="px-6 pb-16">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-5 border-2 border-[#2C2C2C]/8">
            <div className="text-xs font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-4">Früher</div>
            <div className="flex flex-col gap-3">
              {[
                'Abends am Laptop',
                'Preise nachschlagen',
                'Alles eintippen',
                'Nochmal korrigieren',
                'Um 23 Uhr fertig',
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-red-400 text-[10px] font-black">✕</span>
                  </div>
                  <span className="text-xs font-semibold text-[#2C2C2C]/60">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#2C2C2C] rounded-2xl p-5 border-2 border-[#2C2C2C]">
            <div className="text-xs font-black text-[#F5C400]/70 uppercase tracking-widest mb-4">Heute</div>
            <div className="flex flex-col gap-3">
              {[
                'Handy raus',
                'Aufmaß einsprechen',
                'KI macht den Rest',
                'Kurz drüberschauen',
                'Um 17 Uhr fertig',
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle size={14} color="#F5C400" strokeWidth={2.5} className="shrink-0" />
                  <span className="text-xs font-semibold text-white/80">{t}</span>
                </div>
              ))}
            </div>
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
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-10">So läuft das.</h2>
        <div className="flex flex-col gap-8 max-w-sm">
          {[
            {
              nr: '01',
              head: 'Handy raus, reden.',
              body: 'Einfach loslaufen und einsprechen was du siehst. Drei Zimmer, Raufaser runter, ein Feuchtigkeitsschaden — alles so wie du es sagen würdest.',
            },
            {
              nr: '02',
              head: 'KI fragt was noch fehlt.',
              body: 'Material dabei oder Kunde? Stockwerk? Entsorgung nötig? Nur die Fragen die wirklich ins Angebot müssen. Kein Papierkram.',
            },
            {
              nr: '03',
              head: 'Angebot ist fertig.',
              body: 'Alle Positionen, Mengen und Preise — mit deinen eigenen Zahlen. Du schaust kurz drüber und änderst was nicht passt.',
            },
            {
              nr: '04',
              head: 'Raus damit.',
              body: 'PDF per Mail, Link per WhatsApp. Der Kunde unterschreibt direkt auf seinem Handy. Keine Ausdrucke, kein Hin und Her.',
            },
          ].map(s => (
            <div key={s.nr} className="flex gap-5 items-start">
              <span className="text-[#F5C400] font-black text-2xl leading-none shrink-0 w-8">{s.nr}</span>
              <div>
                <div className="font-black text-[#2C2C2C] text-base mb-1">{s.head}</div>
                <div className="text-[#2C2C2C]/50 font-semibold text-sm leading-relaxed">{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SETUP */}
      <section className="bg-[#2C2C2C] px-6 py-12">
        <h2 className="text-2xl font-black text-white mb-2">
          In 3 Minuten<br /><span className="text-[#F5C400]">startklar.</span>
        </h2>
        <p className="text-white/40 font-semibold mb-8 text-sm">Kein IT. Kein Handbuch. Kein Support-Anruf.</p>
        <div className="flex flex-col gap-3 max-w-sm">
          {[
            ['Gewerk wählen', 'Maler, Elektriker, Fliesenleger — die KI kennt dann deine typischen Positionen und fragt die richtigen Rückfragen.'],
            ['Preise hinterlegen', 'Dein Stundensatz, dein Quadratmeterpreis. Einmal eintragen, danach rechnet alles mit deinen Zahlen.'],
            ['Buchhaltung verbinden', 'Lexoffice, sevDesk und andere per Klick. Oder CSV-Export für alles andere.'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-3 items-start bg-white/5 rounded-2xl p-4">
              <CheckCircle size={16} color="#F5C400" strokeWidth={2.5} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-black text-white text-sm">{title}</div>
                <div className="text-white/40 font-semibold text-xs mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTEGRATIONEN */}
      <section className="px-6 py-14 bg-[#F7F7F5]">
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-2">Passt zu deiner Software.</h2>
        <p className="text-[#2C2C2C]/45 font-semibold text-sm mb-8">Einmal verbinden, nie wieder doppelt eintippen.</p>

        <div className="mb-6">
          <div className="text-xs font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-3">Direkte Anbindung</div>
          <div className="grid grid-cols-3 gap-2">
            {['Lexoffice', 'sevDesk', 'FastBill', 'Billomat', 'Papierkram', 'Easybill'].map(name => (
              <div key={name} className="bg-white rounded-xl px-3 py-3 text-center border border-[#2C2C2C]/8">
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
              <div key={name} className="bg-white rounded-xl px-3 py-3 text-center border border-[#2C2C2C]/8">
                <div className="font-black text-[#2C2C2C] text-xs">{name}</div>
                <div className="w-2 h-2 rounded-full bg-blue-400 mx-auto mt-1.5"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREISE */}
      <section className="px-6 py-14">
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-1">Klar und fair.</h2>
        <p className="text-[#2C2C2C]/40 font-semibold mb-8 text-sm">Monatlich kündbar. Keine versteckten Kosten.</p>

        <div className="flex flex-col gap-3 max-w-sm">
          <div className="border-2 border-[#2C2C2C]/10 rounded-2xl p-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="font-black text-[#2C2C2C] text-lg">Starter</div>
                <div className="text-[#2C2C2C]/40 text-xs font-semibold">Zum Reinschnuppern</div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-[#2C2C2C]">9 €</span>
                <span className="text-[#2C2C2C]/30 text-sm font-semibold"> /Monat</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {['5 Angebote pro Monat', 'PDF-Download', 'Digitale Unterschrift'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} color="#2C2C2C" strokeWidth={2.5} className="opacity-30 shrink-0" />
                  <span className="text-sm font-semibold text-[#2C2C2C]/60">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#2C2C2C] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#F5C400] text-[#2C2C2C] font-black text-xs px-4 py-1.5 rounded-bl-2xl">
              Meistgewählt
            </div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="font-black text-white text-lg">Pro</div>
                <div className="text-white/30 text-xs font-semibold">Für den Alltag</div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">29 €</span>
                <span className="text-white/30 text-sm font-semibold"> /Monat</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {['Unbegrenzte Angebote', 'Lexoffice & sevDesk', 'WhatsApp-Versand', 'Foto-Analyse (KI)'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} color="#F5C400" strokeWidth={2.5} className="shrink-0" />
                  <span className="text-sm font-semibold text-white/70">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 text-center">
        <h2 className="text-3xl font-black text-[#2C2C2C] leading-tight mb-3">
          Beim nächsten Kunden<br />einfach ausprobieren.
        </h2>
        <p className="text-[#2C2C2C]/40 font-semibold mb-8 text-sm">Kostenlos. Keine Kreditkarte. Kein Risiko.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-lg px-8 py-4 rounded-2xl"
        >
          Jetzt loslegen <ArrowRight size={18} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2C2C2C]/8 px-6 py-6 flex items-center justify-between">
        <Logo variant="light" className="text-sm" />
        <div className="flex gap-4 text-[#2C2C2C]/30 text-xs font-semibold">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </footer>

    </div>
  )
}
