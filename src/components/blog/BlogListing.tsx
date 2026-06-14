'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'
import { KATEGORIE_META, formatDate } from '@/lib/blog-client'

const KATEGORIEN = ['Alle', 'Angebote', 'Preise', 'Recht & Steuern', 'Gewerke', 'Tools']
const PAGE_SIZE = 9

function BlogCard({ post }: { post: BlogPost }) {
  const meta = KATEGORIE_META[post.kategorie] ?? KATEGORIE_META['Angebote']
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-lg overflow-hidden border border-[#2C2C2C]/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Gradient placeholder */}
      <div
        className="h-[160px] flex items-center justify-center text-5xl"
        style={{ background: meta.gradient }}
      >
        {meta.emoji}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center gap-2.5 mb-3 text-xs font-semibold">
          <span
            className="px-2 py-0.5 rounded-full font-bold"
            style={{ color: meta.color, background: meta.bg }}
          >
            {post.kategorie}
          </span>
          <span className="text-[#2C2C2C]/30">·</span>
          <span className="text-[#2C2C2C]/40">{post.lesezeit}</span>
          <span className="text-[#2C2C2C]/30">·</span>
          <span className="text-[#2C2C2C]/40">{formatDate(post.date)}</span>
        </div>

        {/* Title */}
        <h2 className="font-extrabold text-[#2C2C2C] text-[17px] leading-snug mb-2 group-hover:text-[#F5C400] transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-[#666] text-sm leading-relaxed flex-1 mb-4">
          {post.excerpt}
        </p>

        <span className="text-[#2C2C2C] font-bold text-sm group-hover:text-[#F5C400] transition-colors">
          Weiterlesen →
        </span>
      </div>
    </Link>
  )
}

export function BlogListing({ posts }: { posts: BlogPost[] }) {
  const [activeKat, setActiveKat] = useState('Alle')
  const [page, setPage] = useState(1)

  const filtered = activeKat === 'Alle' ? posts : posts.filter(p => p.kategorie === activeKat)
  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  function selectKat(k: string) {
    setActiveKat(k)
    setPage(1)
  }

  return (
    <div className="bg-[#F7F7F5] min-h-screen">
      {/* Filter chips */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 pt-10 pb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {KATEGORIEN.map(k => (
            <button
              key={k}
              onClick={() => selectKat(k)}
              className={`shrink-0 text-sm font-bold px-4 py-2 rounded-full border transition-colors ${
                activeKat === k
                  ? 'bg-[#F5C400] border-[#F5C400] text-[#2C2C2C]'
                  : 'border-white text-[#2C2C2C]/50 bg-white hover:border-[#2C2C2C]/20 hover:text-[#2C2C2C]'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Article grid */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#2C2C2C]/40 font-semibold">
            Keine Artikel in dieser Kategorie.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map(post => <BlogCard key={post.slug} post={post} />)}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="bg-white border border-[#2C2C2C]/10 text-[#2C2C2C] font-bold px-8 py-3 rounded-lg hover:border-[#2C2C2C]/30 transition-colors"
                >
                  Mehr laden
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
