'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// DC-048 (Sandy, 10.09.2026: „es fehlt bspw ein auge um passwort anzeigen
// zu lassen"): Passwort-Feld mit Anzeigen/Verbergen-Umschalter.
//
// Bewusst EIN gemeinsamer Baustein statt vier Kopien: Das Passwort-Feld
// kommt in der (auth)-Gruppe an vier Stellen vor (Login, Registrierung,
// neues Passwort + Bestätigung). Vier eigene `useState`-Toggles wären
// vier Stellen, an denen Beschriftung, Icon-Größe und Touch-Fläche
// auseinanderlaufen können — dieselbe Lehre wie bei `Button.tsx` (DC-005).
//
// Der Aufrufer bringt seinen eigenen Feld-Stil mit (`className`), weil die
// (auth)-Seiten den kräftigen `border-anthracite`-Rahmen nutzen und nicht
// den leiseren App-Stil aus `Input.tsx`. Ergänzt wird nur der Platz rechts
// für das Icon.
//
// Icon-Sprache: Lucide (DC-017). Der Umschalter ist `type="button"`, damit
// er das Formular nicht abschickt, und trägt eine eigene Beschriftung für
// Screenreader — ein Icon allein sagt dort nichts.

type PasswortFeldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  wrapperClassName?: string
}

export function PasswortFeld({ className = '', wrapperClassName = '', ...props }: PasswortFeldProps) {
  const [sichtbar, setSichtbar] = useState(false)

  return (
    <div className={`relative ${wrapperClassName}`}>
      <input
        {...props}
        type={sichtbar ? 'text' : 'password'}
        className={`${className} pr-14`}
      />
      <button
        type="button"
        onClick={() => setSichtbar(v => !v)}
        aria-label={sichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'}
        aria-pressed={sichtbar}
        className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-anthracite/40 hover:text-anthracite active:text-anthracite transition-colors"
      >
        {sichtbar
          ? <EyeOff size={20} strokeWidth={2.5} aria-hidden="true" />
          : <Eye size={20} strokeWidth={2.5} aria-hidden="true" />}
      </button>
    </div>
  )
}
