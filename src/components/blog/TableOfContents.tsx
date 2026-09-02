'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Heading { id: string; text: string }

export function TableOfContentsSidebar({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id)
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.1 }
    )
    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <div className="sticky top-6">
      <div className="text-[10px] font-extrabold text-anthracite/30 uppercase tracking-widest mb-3">Inhalt</div>
      <nav className="flex flex-col gap-1">
        {headings.map(h => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={e => {
              e.preventDefault()
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className={`text-sm leading-snug py-1 pl-3 border-l-2 transition-colors ${
              activeId === h.id
                ? 'border-yellow text-yellow font-bold'
                : 'border-transparent text-anthracite/40 hover:text-anthracite/70 hover:border-anthracite/20'
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>

      {/* Mini CTA */}
      <div className="mt-10 bg-anthracite rounded-xl p-5">
        <div className="font-extrabold text-white text-base mb-1 leading-tight">
          2 Min. Angebot
        </div>
        <p className="text-white/40 text-xs font-medium mb-4 leading-relaxed">
          Per Sprache. PDF sofort fertig.
        </p>
        <a
          href="/register"
          className="block w-full text-center bg-yellow text-anthracite font-extrabold text-sm py-2.5 rounded-lg hover:bg-[#e6b800] transition-colors"
        >
          Kostenlos testen →
        </a>
      </div>
    </div>
  )
}

export function TableOfContentsMobile({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false)

  if (!headings.length) return null

  return (
    <div className="border border-anthracite/10 rounded-xl mb-8 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg"
      >
        <span className="text-[10px] font-extrabold text-anthracite/40 uppercase tracking-widest">Inhalt</span>
        <ChevronDown
          size={14}
          className="text-anthracite/30 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <nav className="flex flex-col px-4 py-3 gap-2 bg-white">
          {headings.map(h => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={() => setOpen(false)}
              className="text-sm text-anthracite/60 hover:text-anthracite font-medium"
            >
              → {h.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}
