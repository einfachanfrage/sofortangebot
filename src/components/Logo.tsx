// sofort = Gelb / Weiß  |  angebot = Weiß / Anthrazit
// variant="dark"  → auf dunklem Hintergrund (Login, Header)
// variant="light" → auf hellem Hintergrund (Onboarding, Dashboard-Karten)
//
// DC-049 Schritt 5 (2026-09-10): Bildmarke (Maßband-Icon, von Sandy als
// PNG geliefert) ergänzt das Wortmarke-Textlogo zum vom CI-Handbuch
// geforderten Lockup. Icon skaliert per `em` mit der jeweiligen
// Textgröße mit (Höhe = Schriftgröße), kein eigenes size-Prop nötig —
// alle bestehenden Aufrufstellen (Login, Onboarding, SideNav, Rechts-
// texte) funktionieren mit dieser Änderung unverändert weiter. Zusätzlich
// `font-syne` (= Bricolage Grotesque seit Schritt 2) ergänzt — das
// Wortmarke-Logo selbst hatte die Schrift-Umstellung aus Schritt (b)
// bisher übersehen und lief weiter in Inter.

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const iconSrc = variant === 'dark' ? '/brand/icon-light.png' : '/brand/icon-dark.png'
  return (
    <span className={`font-syne inline-flex items-center gap-[0.22em] font-black tracking-tight ${className}`}>
      <img src={iconSrc} alt="" width={452} height={257} className="h-[1em] w-auto shrink-0" />
      <span>
        <span className={variant === 'dark' ? 'text-yellow' : 'text-anthracite'}>sofort</span>
        <span className={variant === 'dark' ? 'text-white' : 'text-yellow'}>angebot</span>
      </span>
    </span>
  )
}
