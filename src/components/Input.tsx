import { forwardRef } from 'react'

// Einheitlicher Basis-Stil für alle Formular-Textfelder der App.
// Umrandet (grauer Hintergrund + border-2), Fokus färbt den Rand gelb —
// kein Layout-Sprung, weil der Rand immer vorhanden ist.
// text-base (16px) ist bewusst gewählt: kleinere Schrift löst beim Fokus
// automatisches Zoomen in iOS Safari aus.
const base =
  'w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 ' +
  'text-[#2C2C2C] font-semibold text-base placeholder:text-[#2C2C2C]/30 ' +
  'focus:outline-none focus:border-[#F5C400] transition-colors'

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
