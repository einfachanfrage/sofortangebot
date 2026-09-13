'use client'

/**
 * Einheitlicher Toast — unten-mittig, rounded-full, dunkel.
 * Bewusst unten platziert, damit er nicht mit den dunklen Seiten-Headern kollidiert.
 * Rendert nichts, wenn `message` leer ist.
 *
 * DC-066 (2026-09-11, Manfred/TN-055): Der Toast kann jetzt EINE Aktion
 * tragen. Anlass war das Löschen einer Position — schnell und ohne Rückfrage,
 * genau wie Manfred es will („ist mir recht"), nur ist ihm dabei die Liste
 * unter dem Finger verrutscht und er traf die falsche Zeile. Die richtige
 * Antwort darauf ist nicht eine Rückfrage VOR jedem Löschen (die macht den
 * häufigen, richtigen Fall langsam, um den seltenen, falschen abzufangen),
 * sondern ein Weg zurück DANACH.
 *
 * Bewusst genau eine Aktion und kein Aktions-Array: ein Toast ist eine
 * Beiläufigkeit. Wer zwei Entscheidungen braucht, braucht ein Sheet.
 */
export function Toast({
  message,
  aktion,
}: {
  message: string
  aktion?: { label: string; onClick: () => void } | null
}) {
  if (!message) return null
  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-anthracite text-white font-extrabold text-sm pl-5 pr-5 py-3 rounded-full shadow-xl whitespace-nowrap flex items-center gap-3">
      {message}
      {aktion && (
        <>
          {/* Trennstrich statt Rahmen: der Toast bleibt eine Pille, die
              Aktion ist trotzdem klar abgesetzt. */}
          <span aria-hidden className="w-px self-stretch bg-white/20" />
          <button
            onClick={aktion.onClick}
            className="text-yellow font-extrabold -my-2 -mr-2 px-3 py-2 rounded-full active:bg-white/10 transition-colors"
          >
            {aktion.label}
          </button>
        </>
      )}
    </div>
  )
}
