import { forwardRef } from 'react'

// Einheitlicher Basis-Stil für alle Formular-Textfelder der App.
// Umrandet (grauer Hintergrund + border-2), Fokus färbt den Rand gelb —
// kein Layout-Sprung, weil der Rand immer vorhanden ist.
// text-base (16px) ist bewusst gewählt: kleinere Schrift löst beim Fokus
// automatisches Zoomen in iOS Safari aus.
const base =
  'w-full bg-bg border-2 border-anthracite/10 rounded-xl px-4 py-3 ' +
  'text-anthracite font-semibold text-base placeholder:text-anthracite/30 ' +
  'focus:outline-none focus:border-yellow transition-colors'

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return <input ref={ref} className={`${base} ${className}`} {...props} />
  }
)

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = '', ...props }, ref) {
    return <textarea ref={ref} className={`${base} resize-none ${className}`} {...props} />
  }
)
