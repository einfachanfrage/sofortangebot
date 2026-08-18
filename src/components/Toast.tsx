'use client'

/**
 * Einheitlicher Toast — unten-mittig, rounded-full, dunkel.
 * Bewusst unten platziert, damit er nicht mit den dunklen Seiten-Headern kollidiert.
 * Rendert nichts, wenn `message` leer ist.
 */
export function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-anthracite text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-xl whitespace-nowrap">
      {message}
    </div>
  )
}
