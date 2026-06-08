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
      <span className={variant === 'dark' ? 'text-[#F5C400]' : 'text-[#2C2C2C]'}>sofort</span>
      <span className={variant === 'dark' ? 'text-white' : 'text-[#F5C400]'}>angebot</span>
    </span>
  )
}
