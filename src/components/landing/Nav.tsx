'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 flex items-center justify-between h-16">
          {/* Logo */}
          <span className="font-syne font-extrabold text-[20px] tracking-tight text-anthracite">
            sofort<span className="text-yellow">angebot</span>
          </span>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="font-semibold text-sm px-4 py-2 border rounded-xl transition-colors border-anthracite/15 text-anthracite hover:border-anthracite/40"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-yellow text-anthracite font-extrabold text-sm px-5 py-2 rounded-xl hover:bg-[#e6b800] transition-colors"
            >
              Kostenlos testen
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menü öffnen"
          >
            <span className="block w-5 h-0.5 bg-anthracite" />
            <span className="block w-5 h-0.5 bg-anthracite" />
            <span className="block w-5 h-0.5 bg-anthracite" />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-anthracite flex flex-col px-8 pt-20 pb-10">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-5 text-white/50 text-3xl font-light"
          >
            ×
          </button>
          <nav className="flex flex-col gap-8">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="font-syne font-extrabold text-white text-[36px] tracking-tight">Login</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} className="font-syne font-extrabold text-yellow text-[36px] tracking-tight">Kostenlos testen</Link>
          </nav>
          <div className="mt-auto text-white/20 text-sm font-semibold">
            Keine Kreditkarte · Kein Abo-Zwang
          </div>
        </div>
      )}
    </>
  )
}
