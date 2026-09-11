'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, MoreHorizontal, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getStatusInfo, waehlbareStatus } from '@/lib/status'

// DC-003: hatte hier vorher zwei eigene Status→Farbe-Tabellen (Rand +
// Badge), unabhängig von den drei weiteren im Rest des Produkts — jetzt
// eine gemeinsame Quelle, siehe src/lib/status.ts. `statusLabel`/
// `statusColor` kamen bisher als Props von außen (angebote/page.tsx,
// dashboard/page.tsx hatten dafür jeweils eigene STATUS_LABEL-Tabellen) —
// `statusColor` wurde nie ausgewertet (siehe altes Props-Destructuring
// unten, das den Parameter gar nicht auflistete). Jetzt berechnet die Karte
// Label UND Farbe selbst aus `quote.status`, keine Props mehr nötig, keine
// Möglichkeit mehr, dass zwei Aufrufstellen unterschiedliche Werte liefern.

interface Props {
  quote: {
    id: string
    quote_number?: string | null
    customer?: { name: string } | null
    total_gross: number
    status: string
    created_at: string
    gewerk?: string | null
  }
  formattedDate: string
  formattedAmount: string
  ersterItemTitel?: string | null
}

export function MobileQuoteCard({ quote, formattedDate, formattedAmount, ersterItemTitel }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const [showStatusWahl, setShowStatusWahl] = useState(false)
  const [statusSpeichert, setStatusSpeichert] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  // Menü schließen bei Klick außerhalb
  useEffect(() => {
    if (!showMenu) return
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
        setShowStatusWahl(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showMenu])

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation()
    if (!confirm('Angebot wirklich löschen?')) return
    setDeleting(true)
    setShowMenu(false)
    await supabase.from('quotes').delete().eq('id', quote.id)
    router.refresh()
  }

  // DC-084 (2026-09-11, Manfred/TN-084): Das Menü konnte bisher nur löschen.
  // Manfreds Punkt: bei einem Angebot, das beim Kunden liegt, ist „Status
  // ändern" die Aktion, die man von der Liste aus wirklich braucht („Kunde
  // hat zugesagt" tippt man unterwegs, nicht am Schreibtisch) — Löschen ist
  // die seltenste. Dieselbe Aktion und dieselbe Auswahl-Logik wie im
  // Status-Sheet der Detailansicht (waehlbareStatus), nur eine Ebene früher.
  async function setzeStatus(e: React.MouseEvent, neuerStatus: string) {
    e.preventDefault(); e.stopPropagation()
    setStatusSpeichert(true)
    await supabase.from('quotes').update({ status: neuerStatus }).eq('id', quote.id)
    setStatusSpeichert(false)
    setShowStatusWahl(false)
    setShowMenu(false)
    router.refresh()
  }

  const status = getStatusInfo(quote.status)

  // DC-042 (2026-08-30, Sandys Go): "Beim Kunden seit X Tagen" macht
  // "wartet auf Antwort" konkret statt vage — Grundlage ist `created_at`
  // (kein neues Feld, dafür leicht ungenau, falls "Bereit" länger vor dem
  // eigentlichen Versand lag). Ein exaktes `sent_at`-Feld wäre eine
  // Datenbank-Änderung und bewusst NICHT Teil dieser Änderung, siehe
  // design-check.md DC-042.
  const tageSeitVersand = quote.status === 'sent'
    ? Math.max(0, Math.floor((Date.now() - new Date(quote.created_at).getTime()) / 86400000))
    : null

  const kundenname = quote.customer?.name?.trim()
  const nummer = quote.quote_number
  const primaryTitle = kundenname ?? 'Kunde offen'
  const subtitle = [nummer, formattedDate].filter(Boolean).join(' · ')

  return (
    <div className="relative">
      <Link
        href={`/angebot/${quote.id}`}
        className="block active:translate-y-px transition-transform"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white border border-black/5">
          {/* DC-049 Schritt 4 (2026-09-10): der farbige linke Balken ist weg —
              "Nie das Muster Karte mit farbigem linken Rand" laut CI-Handbuch.
              Der Status-Badge unten (status.bg/status.text) zeigt denselben
              Status bereits eindeutig an, keine zweite Kennzeichnung nötig. */}
          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className={`font-black text-sm truncate ${kundenname ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40 italic'}`}>
                  {primaryTitle}
                </div>
                {/* DC-054 (2026-09-11, Manfred/TN-004): „Zweimal Fischer GmbH,
                    zweimal Lina Meier — ich weiß nicht, welches was ist."
                    Der Titel der ersten Position wurde schon geladen und bis
                    hierher durchgereicht, aber nie angezeigt (toter Datenpfad
                    seit 660656a). Er steht jetzt direkt unter dem Namen —
                    dort, wo man beim Überfliegen der Liste hinsieht —, die
                    Nummer rutscht eine Zeile tiefer. */}
                {ersterItemTitel && (
                  <div className="text-xs text-anthracite/70 font-bold truncate mt-0.5">{ersterItemTitel}</div>
                )}
                <div className="text-xs text-[#888888] font-semibold mt-0.5">{subtitle}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="font-black text-[#1A1A1A] text-sm">{formattedAmount}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                  {tageSeitVersand !== null && (
                    <div className="text-[9.5px] font-bold text-anthracite/40 mt-1">
                      seit {tageSeitVersand === 1 ? '1 Tag' : `${tageSeitVersand} Tagen`}
                    </div>
                  )}
                </div>
                {/* 3-Punkte-Button */}
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setShowMenu(v => !v) }}
                  className="p-1.5 text-anthracite/30 hover:text-anthracite/60 active:bg-anthracite/5 rounded-lg transition-colors"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Dropdown-Menü */}
      {showMenu && (
        <div ref={menuRef} className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-anthracite/8 min-w-[190px] overflow-hidden">
          {showStatusWahl ? (
            <>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setShowStatusWahl(false) }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-anthracite/40 font-bold text-[11px] uppercase tracking-wide border-b border-anthracite/5"
              >
                <ArrowLeft size={13} strokeWidth={3} />
                Status ändern
              </button>
              {waehlbareStatus(quote.status).map(kandidat => {
                const info = getStatusInfo(kandidat)
                const istAktuell = kandidat === quote.status
                return (
                  <button
                    key={kandidat}
                    onClick={e => setzeStatus(e, kandidat)}
                    disabled={statusSpeichert || istAktuell}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-anthracite font-semibold text-sm hover:bg-bg transition-colors disabled:opacity-40"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: info.dot }} />
                    {info.label}
                  </button>
                )
              })}
            </>
          ) : (
            <>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setShowStatusWahl(true) }}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-anthracite font-semibold text-sm hover:bg-bg transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: status.dot }} />
                Status ändern
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 border-t border-anthracite/5"
              >
                <Trash2 size={15} />
                {deleting ? 'Wird gelöscht…' : 'Löschen'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
