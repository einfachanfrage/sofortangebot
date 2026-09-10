import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

// Einheitlicher Button-Baustein für die App — Antwort auf DC-005 in
// docs/design-check.md (über 30 leicht unterschiedliche Button-Varianten
// im Code, u. a. ein ungültiges `active:scale-98`). Modelliert nach dem
// Muster von Input.tsx: ein Basis-Stil pro Variante, per `className`
// erweiterbar, nicht überschreibbar.
//
// Migration bestehender Buttons ist bewusst NICHT Teil dieses Commits —
// das passiert schrittweise bei Gelegenheit (siehe DC-005-Empfehlung),
// damit nicht in einem Rutsch 30+ Stellen gleichzeitig angefasst werden.
//
// Farben nutzen bewusst von Anfang an die Tailwind-Tokens aus
// globals.css (`bg-yellow`/`text-anthracite`, siehe DC-006) statt neuer
// Hex-Literale — kein Grund, hier dieselbe Schuld nochmal aufzubauen.
//
// DC-049 Schritt 4 (2026-09-10, CI-Handbuch): Press-State von Scale-down
// auf `translateY(1px)` umgestellt — das Handbuch verbietet Scale-down und
// Ripple explizit ("Kein Scale-down, kein Ripple"). Primär-Variante nutzt
// jetzt echte Hover/Press-Farbstufen (Gelb 600/700, siehe globals.css)
// statt `hover:brightness-95`, das keinen markendefinierten Ton trifft.
// Timing/Easing exakt nach Handbuch-Vorgabe.

type Variant = 'primary' | 'secondary' | 'destructive'
type Size = 'default' | 'small'

const base =
  'inline-flex items-center justify-center gap-2 font-black rounded-2xl ' +
  'transition-all duration-[120ms] ease-[cubic-bezier(0.2,0,0.2,1)] ' +
  'active:translate-y-px disabled:opacity-50 disabled:active:translate-y-0'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-yellow text-anthracite hover:bg-yellow-600 active:bg-yellow-700',
  secondary:
    'bg-white text-anthracite border-2 border-anthracite/10 hover:border-anthracite/20',
  destructive: 'bg-white text-[#DC2626] border-2 border-[#DC2626]/20 hover:bg-[#DC2626]/5',
}

const sizeStyles: Record<Size, string> = {
  default: 'py-4 px-6 text-lg',
  small: 'py-2.5 px-4 text-sm',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  // Zeigt einen Spinner statt des Inhalts und deaktiviert den Button —
  // für Aktionen, die auf eine Server-Antwort warten (z. B. Speichern).
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'default', loading = false, disabled, className = '', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={size === 'small' ? 16 : 20} className="animate-spin" /> : children}
    </button>
  )
})
