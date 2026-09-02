// sofort = Gelb / Weiß  |  angebot = Weiß / Anthrazit
// variant="dark"  → auf dunklem Hintergrund (Login, Header)
// variant="light" → auf hellem Hintergrund (Onboarding, Dashboard-Karten)

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  return (
    <span className={`font-black tracking-tight ${className}`}>
      <span className={variant === 'dark' ? 'text-yellow' : 'text-anthracite'}>sofort</span>
      <span className={variant === 'dark' ? 'text-white' : 'text-yellow'}>angebot</span>
    </span>
  )
}
