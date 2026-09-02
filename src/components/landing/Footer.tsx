import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-anthracite py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10">
          {/* Left */}
          <div>
            <div className="font-syne font-black text-white text-xl mb-2">
              sofort<span className="text-yellow">angebot</span>
            </div>
            <p className="text-[#888] text-sm font-medium leading-relaxed">
              Das schnellste Angebot im Handwerk.
            </p>
          </div>

          {/* Center */}
          <div className="hidden md:flex items-center justify-center">
            <span className="font-syne font-black text-yellow text-3xl opacity-20">sofortangebot</span>
          </div>

          {/* Right */}
          <div className="flex md:justify-end items-start">
            <div className="flex gap-5 text-[#888] text-sm font-medium">
              <Link href="/impressum" className="hover:text-yellow transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-yellow transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-yellow transition-colors">AGB</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6">
          <p className="text-[#888]/50 text-xs font-medium text-center md:text-left">
            © 2026 Sofortangebot · Made in Germany
          </p>
        </div>
      </div>
    </footer>
  )
}
