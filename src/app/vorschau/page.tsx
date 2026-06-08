import Link from 'next/link'
import { Check, Mic, Download, Mail, Share2, Link2, FileText, Plus } from 'lucide-react'
import { Logo } from '@/components/Logo'

function Phone({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wider">{label}</div>
      <div className="w-[340px] bg-[#F7F7F5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#2C2C2C]/10 min-h-[600px] flex flex-col">
        {children}
      </div>
    </div>
  )
}

function StatusBar() {
  return <div className="bg-inherit h-10 flex items-center px-6 justify-between"><span className="text-xs font-bold opacity-40">9:41</span><span className="text-xs font-bold opacity-40">●●●</span></div>
}

export default function VorschauPage() {
  return (
    <div className="min-h-dvh bg-[#2C2C2C]">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 text-center">
        <Logo variant="dark" className="text-4xl" />
        <div className="text-white/60 font-semibold mt-2">Das schnellste Handwerkerangebot.</div>
        <div className="flex gap-3 justify-center mt-6">
          <Link href="/register" className="bg-[#F5C400] text-[#2C2C2C] font-black px-6 py-3 rounded-xl text-sm">
            Kostenlos starten
          </Link>
          <Link href="/login" className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl text-sm">
            Einloggen
          </Link>
        </div>
      </div>

      {/* Screens */}
      <div className="overflow-x-auto pb-12">
        <div className="flex gap-8 px-8 w-max mx-auto">

          {/* Screen 0: Onboarding Gewerk */}
          <Phone label="Onboarding: Gewerk">
            <StatusBar />
            <div className="flex-1 px-5 pt-2 pb-5 flex flex-col bg-[#F7F7F5]">
              <Logo variant="light" className="text-2xl mb-1 block" />
              {/* Fortschritt */}
              <div className="flex gap-1.5 mb-5">
                {[1,2,3].map(n => <div key={n} className={`h-1 flex-1 rounded-full ${n <= 2 ? 'bg-[#F5C400]' : 'bg-[#2C2C2C]/15'}`} />)}
              </div>
              <div className="font-black text-[#2C2C2C] text-lg mb-0.5">Dein Gewerk</div>
              <div className="text-[#2C2C2C]/40 font-semibold text-xs mb-4">Die KI stellt dann die richtigen Fragen. Mehrere möglich.</div>
              <div className="flex flex-col gap-2 flex-1">
                {[
                  { e: '🖌️', l: 'Maler & Lackierer', active: true },
                  { e: '🏗️', l: 'Trockenbau', active: false },
                  { e: '🔲', l: 'Fliesen & Naturstein', active: true },
                  { e: '⚡', l: 'Elektro', active: false },
                  { e: '🔧', l: 'Sanitär & Heizung', active: false },
                  { e: '🚛', l: 'Entrümpelung', active: false },
                ].map(g => (
                  <div key={g.l} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border-2 ${g.active ? 'border-[#F5C400] bg-[#F5C400]/5' : 'border-[#2C2C2C]/8 bg-white'}`}>
                    <span className="text-base">{g.e}</span>
                    <span className={`font-bold text-xs flex-1 ${g.active ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/50'}`}>{g.l}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${g.active ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/20'}`}>
                      {g.active && <Check size={10} color="#2C2C2C" strokeWidth={3} />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex-1 border-2 border-[#2C2C2C] rounded-xl py-3 text-center font-black text-[#2C2C2C] text-sm">Zurück</div>
                <div className="flex-[2] bg-[#F5C400] rounded-xl py-3 text-center font-black text-[#2C2C2C] text-sm">Weiter (2)</div>
              </div>
            </div>
          </Phone>

          {/* Screen 1: Login */}
          <Phone label="Login">
            <StatusBar />
            <div className="flex-1 px-6 pt-4 pb-6 flex flex-col bg-[#F7F7F5]">
              <Logo variant="light" className="text-3xl mb-1 block" />
              <div className="text-[#2C2C2C] text-lg font-bold mb-8">Einloggen</div>
              <div className="flex flex-col gap-3">
                <div className="bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C]/40 font-semibold text-sm">max@mustermann.de</div>
                <div className="bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C]/40 font-semibold text-sm">••••••••</div>
                <div className="bg-[#F5C400] text-[#2C2C2C] font-black text-base rounded-xl py-3.5 text-center mt-2">Einloggen</div>
              </div>
              <p className="text-center text-[#2C2C2C] mt-6 font-semibold text-sm">Noch kein Konto? <span className="text-[#F5C400] underline">Registrieren</span></p>
            </div>
          </Phone>

          {/* Screen 2: Dashboard */}
          <Phone label="Dashboard">
            <div className="bg-[#2C2C2C] px-5 pt-10 pb-5">
              <Logo variant="dark" className="text-base" />
              <div className="text-white font-bold mt-0.5">Muster GmbH</div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] px-4 pt-3 pb-20">
              {/* Stats */}
              <div className="-mt-4 grid grid-cols-2 gap-2 mb-4">
                {[['3', 'Offen'], ['8', 'Angenommen']].map(([n, l]) => (
                  <div key={l} className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="text-2xl font-black text-[#2C2C2C]">{n}</div>
                    <div className="text-xs font-semibold text-[#2C2C2C]/50">{l}</div>
                  </div>
                ))}
              </div>
              {/* CTA */}
              <div className="bg-[#F5C400] rounded-xl py-4 flex items-center justify-center gap-2 mb-4">
                <span>🎙</span>
                <span className="font-black text-[#2C2C2C] text-base">Neues Angebot</span>
              </div>
              {/* List */}
              <div className="font-black text-[#2C2C2C] text-sm mb-2">Letzte Angebote</div>
              {[
                { name: 'K. Müller', amount: '2.840,00 €', status: 'Angenommen', color: 'bg-green-50 text-green-700' },
                { name: 'T. Schmidt', amount: '1.250,00 €', status: 'Versendet', color: 'bg-blue-50 text-blue-700' },
                { name: 'A. Weber', amount: '4.100,00 €', status: 'Entwurf', color: 'bg-gray-100 text-gray-600' },
              ].map(q => (
                <div key={q.name} className="bg-white rounded-xl p-3 mb-2 flex justify-between items-start">
                  <div>
                    <div className="font-black text-[#2C2C2C] text-sm">{q.name}</div>
                    <div className="text-xs text-[#2C2C2C]/40 font-semibold">07.06.2026</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="font-black text-[#2C2C2C] text-sm">{q.amount}</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.color}`}>{q.status}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Nav */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#2C2C2C]/10 flex">
              <div className="flex-1 flex flex-col items-center py-2 text-[#F5C400]"><span>🏠</span><span className="text-xs font-bold">Start</span></div>
              <div className="flex-1 flex flex-col items-center py-2 text-[#2C2C2C]/30"><span>⚙️</span><span className="text-xs font-bold">Einstellungen</span></div>
            </div>
          </Phone>

          {/* Screen 3: Spracheingabe */}
          <Phone label="Spracheingabe">
            <div className="bg-[#2C2C2C] px-5 pt-10 pb-0">
              <div className="text-white/50 text-xs font-semibold mb-1">← Dashboard</div>
              <div className="text-white font-black text-lg mb-3">Neues Angebot</div>
              <div className="flex border-b border-white/10">
                <div className="flex-1 py-2.5 font-black text-xs text-[#F5C400] border-b-2 border-[#F5C400] text-center">🎙 Sprache</div>
                <div className="flex-1 py-2.5 font-black text-xs text-white/30 text-center">📷 Foto</div>
              </div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] flex flex-col items-center justify-center gap-5 px-5">
              <div className="text-center">
                <div className="font-black text-[#2C2C2C] text-xl mb-1">Aufmaß einsprechen</div>
                <div className="text-[#2C2C2C]/50 font-semibold text-xs max-w-[220px]">Einfach loslaufen und alles ansprechen. Die KI fragt nach was fehlt.</div>
              </div>
              <div className="w-28 h-28 rounded-full bg-red-500 flex items-center justify-center shadow-xl shadow-red-200 scale-110">
                <Mic size={40} color="white" strokeWidth={2} />
              </div>
              <div className="text-[#2C2C2C]/50 font-bold text-xs">🔴 Läuft — loslassen zum Stoppen</div>
            </div>
          </Phone>

          {/* Screen 3b: Rückfragen */}
          <Phone label="KI-Rückfragen">
            <div className="bg-[#2C2C2C] px-5 pt-10 pb-5">
              <div className="text-white/50 text-xs font-semibold mb-3">Frage 2 von 4</div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[#F5C400] rounded-full" style={{ width: '50%' }} />
              </div>
              <div className="text-white/40 text-xs font-semibold">Wohnzimmer streichen + Vinyl, ca. 28m²</div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] px-5 pt-6 flex flex-col gap-4">
              <div className="font-black text-[#2C2C2C] text-xl leading-tight">
                In welchem Stockwerk wird gearbeitet?
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {['EG', '1. OG', '2. OG', '3. OG', '4. OG oder höher'].map((opt, i) => (
                  <div key={opt} className={`w-full border-2 rounded-xl px-4 py-3 flex items-center justify-between ${i === 2 ? 'border-[#F5C400] bg-[#F5C400]/5' : 'border-[#2C2C2C]/10 bg-white'}`}>
                    <span className={`font-bold text-sm ${i === 2 ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/70'}`}>{opt}</span>
                    {i === 2 && <div className="w-4 h-4 rounded-full bg-[#F5C400] border-2 border-[#2C2C2C]" />}
                  </div>
                ))}
              </div>
              <div className="text-center text-[#2C2C2C]/25 text-xs font-semibold mt-1">Überspringen</div>
            </div>
          </Phone>

          {/* Screen 3c: Rückfrage Zahl */}
          <Phone label="Entfernung">
            <div className="bg-[#2C2C2C] px-5 pt-10 pb-5">
              <div className="text-white/50 text-xs font-semibold mb-3">Frage 3 von 4</div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[#F5C400] rounded-full" style={{ width: '75%' }} />
              </div>
              <div className="text-white/40 text-xs font-semibold">Wohnzimmer streichen + Vinyl, ca. 28m²</div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] px-5 pt-6 flex flex-col gap-5">
              <div className="font-black text-[#2C2C2C] text-xl leading-tight">
                Wie weit ist die Baustelle von deinem Betrieb entfernt?
              </div>
              <div className="flex items-center gap-3 bg-white border-2 border-[#2C2C2C] rounded-2xl px-5 py-4">
                <span className="text-4xl font-black text-[#2C2C2C]">23</span>
                <span className="text-[#2C2C2C]/40 font-bold text-lg">km</span>
              </div>
              <div className="bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-2xl py-4 text-center">
                Weiter
              </div>
              <div className="text-center text-[#2C2C2C]/25 text-xs font-semibold">Überspringen</div>
            </div>
          </Phone>

          {/* Screen 4: Angebot Review */}
          <Phone label="Angebot prüfen">
            <div className="bg-[#2C2C2C] px-5 pt-10 pb-5">
              <div className="text-white/50 text-xs font-semibold mb-1">← Neu aufnehmen</div>
              <div className="text-white font-black text-lg">Angebot prüfen</div>
              <div className="text-white/30 text-xs font-semibold mt-1 line-clamp-1">&ldquo;Wohnzimmer, 28m², Vinyl...&rdquo;</div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] px-4 pt-4 pb-20 overflow-hidden">
              <div className="bg-white rounded-xl p-3 mb-3">
                <div className="font-black text-[#2C2C2C] text-sm mb-2">Kunde</div>
                <div className="bg-[#F7F7F5] rounded-lg px-3 py-2 text-[#2C2C2C]/40 text-xs font-semibold">Karl Müller</div>
              </div>
              <div className="bg-white rounded-xl mb-3">
                <div className="flex justify-between items-center px-3 pt-3 pb-2">
                  <div className="font-black text-[#2C2C2C] text-sm">Positionen</div>
                  <div className="bg-[#F5C400] rounded-md p-1"><Plus size={14} color="#2C2C2C" strokeWidth={3} /></div>
                </div>
                {[
                  { title: 'Vinyl verlegen', qty: '28', unit: 'm²', price: '18,00', total: '504,00' },
                  { title: 'Wände streichen (2×)', qty: '56', unit: 'm²', price: '8,00', total: '448,00' },
                  { title: 'Bodenbelag entfernen', qty: '28', unit: 'm²', price: '6,00', total: '168,00' },
                ].map(item => (
                  <div key={item.title} className="border-t border-[#2C2C2C]/5 px-3 py-2">
                    <div className="font-bold text-[#2C2C2C] text-xs">{item.title}</div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-[#2C2C2C]/40">{item.qty} {item.unit} × {item.price} €</span>
                      <span className="text-xs font-black text-[#2C2C2C]">{item.total} €</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#2C2C2C] rounded-xl p-3">
                <div className="flex justify-between text-white/50 text-xs font-semibold mb-1"><span>Netto</span><span>1.120,00 €</span></div>
                <div className="flex justify-between text-white font-black text-base"><span>Gesamt</span><span>1.120,00 €</span></div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#F7F7F5] border-t border-[#2C2C2C]/10">
              <div className="bg-[#F5C400] text-[#2C2C2C] font-black text-base rounded-xl py-4 text-center">Angebot speichern</div>
            </div>
          </Phone>

          {/* Screen 5: Angebot Detail */}
          <Phone label="Versenden">
            <div className="bg-[#2C2C2C] px-5 pt-10 pb-5">
              <div className="text-white/50 text-xs font-semibold mb-1">← Dashboard</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-black text-lg">Angebot 2026-0003</div>
                  <div className="text-white/40 text-xs font-semibold">07.06.2026</div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700">Versendet</span>
              </div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] px-4 pt-4 pb-4 flex flex-col gap-3">
              <div className="bg-[#2C2C2C] rounded-xl p-3">
                <div className="flex justify-between text-white/50 text-xs font-semibold mb-0.5"><span>Netto</span><span>1.120,00 €</span></div>
                <div className="flex justify-between text-white/50 text-xs font-semibold mb-1"><span>MwSt. 19%</span><span>212,80 €</span></div>
                <div className="flex justify-between text-white font-black text-lg border-t border-white/20 pt-2"><span>Gesamt</span><span>1.332,80 €</span></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-[#F5C400] rounded-xl py-3 flex items-center justify-center gap-2">
                  <Download size={18} color="#2C2C2C" strokeWidth={3} />
                  <span className="font-black text-[#2C2C2C] text-sm">PDF herunterladen</span>
                </div>
                <div className="bg-white border-2 border-[#2C2C2C] rounded-xl py-3 flex items-center justify-center gap-2">
                  <Mail size={18} color="#2C2C2C" strokeWidth={3} />
                  <span className="font-black text-[#2C2C2C] text-sm">Per E-Mail senden</span>
                </div>
                <div className="bg-[#25D366] rounded-xl py-3 flex items-center justify-center gap-2">
                  <Share2 size={18} color="white" strokeWidth={3} />
                  <span className="font-black text-white text-sm">Per WhatsApp senden</span>
                </div>
                <div className="bg-white border-2 border-[#2C2C2C]/15 rounded-xl py-3 flex items-center justify-center gap-2">
                  <Link2 size={16} color="#2C2C2C" strokeWidth={2.5} />
                  <span className="font-bold text-[#2C2C2C] text-sm">Unterschreiben-Link kopieren</span>
                </div>
                <div className="bg-white border-2 border-[#2C2C2C]/15 rounded-xl py-3 flex items-center justify-center gap-2">
                  <FileText size={16} color="#2C2C2C" strokeWidth={2.5} />
                  <span className="font-bold text-[#2C2C2C] text-sm">CSV für Lexware / Sevdesk</span>
                </div>
              </div>
            </div>
          </Phone>

          {/* Screen 6: Unterschreiben (Kundenansicht) */}
          <Phone label="Kunde unterschreibt">
            <div className="bg-[#2C2C2C] px-5 pt-10 pb-5">
              <div className="text-[#F5C400] font-black text-base">Muster GmbH</div>
              <div className="text-white/50 text-xs font-semibold">Angebot 2026-0003</div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] px-4 pt-4 pb-4 flex flex-col gap-3">
              <div className="bg-white rounded-xl border border-[#2C2C2C]/5">
                <div className="px-3 pt-3 pb-2 font-black text-[#2C2C2C] text-sm">Positionen</div>
                {[
                  { t: 'Vinyl verlegen', s: '504,00 €' },
                  { t: 'Wände streichen (2×)', s: '448,00 €' },
                ].map(i => (
                  <div key={i.t} className="border-t border-[#2C2C2C]/5 px-3 py-2 flex justify-between">
                    <span className="text-xs font-semibold text-[#2C2C2C]">{i.t}</span>
                    <span className="text-xs font-black text-[#2C2C2C]">{i.s}</span>
                  </div>
                ))}
                <div className="border-t-2 border-[#2C2C2C] px-3 py-2 flex justify-between">
                  <span className="font-black text-[#2C2C2C] text-sm">Gesamt</span>
                  <span className="font-black text-[#2C2C2C] text-sm">1.332,80 €</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-black text-[#2C2C2C] text-sm mb-2">Unterschrift</div>
                <div className="bg-[#F7F7F5] rounded-lg h-20 flex items-center justify-center border-2 border-dashed border-[#2C2C2C]/20">
                  <span className="text-[#2C2C2C]/20 text-xs font-semibold">Hier unterschreiben</span>
                </div>
              </div>
              <div className="bg-[#F5C400] rounded-xl py-4 text-center font-black text-[#2C2C2C] text-sm">
                Angebot annehmen & unterschreiben
              </div>
            </div>
          </Phone>

          {/* Screen 7: Preise */}
          <Phone label="Pläne & Preise">
            <div className="bg-[#2C2C2C] px-5 pt-10 pb-6 text-center">
              <div className="text-[#F5C400] font-black text-xl">Pläne & Preise</div>
              <div className="text-white/50 font-semibold text-xs mt-1">Jederzeit kündbar</div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] px-4 pt-3 pb-4 flex flex-col gap-3">
              <div className="bg-white rounded-xl p-4 border border-[#2C2C2C]/5">
                <div className="flex justify-between mb-3">
                  <div><div className="font-black text-[#2C2C2C]">Starter</div><div className="text-[#2C2C2C]/40 text-xs font-semibold">Zum Reinschnuppern</div></div>
                  <div className="text-right"><div className="font-black text-[#2C2C2C] text-2xl">9 €</div><div className="text-[#2C2C2C]/30 text-xs">/Monat</div></div>
                </div>
                {['5 Angebote/Monat', 'Spracheingabe', 'PDF & E-Mail'].map(f => (
                  <div key={f} className="flex items-center gap-1.5 mb-1"><Check size={12} color="#2C2C2C" strokeWidth={3} /><span className="text-xs font-semibold text-[#2C2C2C]">{f}</span></div>
                ))}
                <div className="border-2 border-[#2C2C2C] rounded-lg py-2.5 text-center font-black text-[#2C2C2C] text-sm mt-3">Starter wählen</div>
              </div>
              <div className="bg-[#2C2C2C] rounded-xl p-4 relative">
                <div className="absolute top-3 right-3 bg-[#F5C400] text-[#2C2C2C] text-[10px] font-black px-2 py-0.5 rounded-full">BELIEBT</div>
                <div className="flex justify-between mb-3">
                  <div><div className="font-black text-white">Pro</div><div className="text-white/40 text-xs font-semibold">Für den Alltag</div></div>
                  <div className="text-right"><div className="font-black text-[#F5C400] text-2xl">29 €</div><div className="text-white/30 text-xs">/Monat</div></div>
                </div>
                {['Unbegrenzte Angebote', 'Foto-Analyse (KI)', 'Digitale Annahme', 'Lexoffice / sevDesk'].map(f => (
                  <div key={f} className="flex items-center gap-1.5 mb-1"><Check size={12} color="#F5C400" strokeWidth={3} /><span className="text-xs font-semibold text-white">{f}</span></div>
                ))}
                <div className="bg-[#F5C400] rounded-lg py-3 text-center font-black text-[#2C2C2C] mt-3">Pro jetzt starten</div>
              </div>
            </div>
          </Phone>

        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-white font-black text-2xl">Warum Sofortangebot?</div>
          <div className="text-white/50 font-semibold mt-1">Kein Bullshit. Nur das Wesentliche.</div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: '🎙', title: 'Sprechen statt Tippen', desc: 'Aufmaß einsprechen — Angebot in Sekunden fertig.' },
            { icon: '📷', title: 'Foto genügt', desc: 'Kamera draufhalten, KI erkennt Räume und Maße.' },
            { icon: '✍️', title: 'Digital unterschreiben', desc: 'Kunde unterschreibt auf dem Handy — kein Papier.' },
            { icon: '📊', title: '1-Klick-Export', desc: 'Direkt zu Lexoffice, sevDesk oder FastBill.' },
            { icon: '⚡', title: 'Unter 10 Minuten', desc: 'Von Aufmaß bis versendetes Angebot. Garantiert.' },
          ].map(f => (
            <div key={f.title} className="bg-white/5 rounded-2xl p-4 flex items-start gap-4">
              <span className="text-3xl">{f.icon}</span>
              <div>
                <div className="font-black text-white">{f.title}</div>
                <div className="text-white/50 font-semibold text-sm mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/register" className="inline-block bg-[#F5C400] text-[#2C2C2C] font-black px-8 py-4 rounded-2xl text-lg">
            Jetzt kostenlos testen
          </Link>
        </div>
      </div>
    </div>
  )
}
