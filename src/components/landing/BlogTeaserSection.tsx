import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { KATEGORIE_META, formatDate } from '@/lib/blog-client'

export function BlogTeaserSection() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] tracking-tight">
              Praxiswissen für Handwerker
            </h2>
            <p className="text-[#888] text-base mt-1">Kurz. Konkret. Direkt umsetzbar.</p>
          </div>
          <Link
            href="/blog"
            className="hidden md:block shrink-0 ml-8 text-sm font-bold text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors"
          >
            Alle Artikel →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {posts.map(post => {
            const meta = KATEGORIE_META[post.kategorie] ?? KATEGORIE_META['Angebote']
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-[#2C2C2C] overflow-hidden flex flex-col hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#F5C400] text-[11px] font-black uppercase tracking-widest">
                      {post.kategorie}
                    </span>
                    <span className="text-white/20 text-[11px]">{post.lesezeit}</span>
                  </div>
                  <h3 className="font-syne font-extrabold text-white text-[16px] leading-snug group-hover:text-[#F5C400] transition-colors">
                    {post.title}
                  </h3>
                </div>
                <div className="h-px bg-white/5 mx-6" />
                <div className="px-6 py-3">
                  <span className="text-white/25 text-[11px]">{formatDate ? formatDate(post.date ?? '') : ''}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="md:hidden text-center mt-8">
          <Link
            href="/blog"
            className="font-bold text-[#2C2C2C] text-sm border border-[#2C2C2C]/15 px-6 py-3 hover:border-[#2C2C2C]/30 transition-colors inline-block"
          >
            Alle Artikel lesen →
          </Link>
        </div>
      </div>
    </section>
  )
}
