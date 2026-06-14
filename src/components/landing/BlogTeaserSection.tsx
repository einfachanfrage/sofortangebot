import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { KATEGORIE_META, formatDate } from '@/lib/blog-client'

export function BlogTeaserSection() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section className="bg-[#F7F7F5] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[#F5C400] text-xs font-extrabold uppercase tracking-widest mb-2">Blog</div>
            <h2 className="font-extrabold text-[#2C2C2C] text-[28px] md:text-[36px] leading-tight tracking-tight">
              Praxiswissen für Handwerker
            </h2>
            <p className="text-[#666] text-base font-medium mt-1">Kurz. Konkret. Direkt umsetzbar.</p>
          </div>
          <Link
            href="/blog"
            className="hidden md:block shrink-0 ml-8 text-sm font-bold text-[#2C2C2C]/50 hover:text-[#2C2C2C] transition-colors"
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
                className="group bg-white rounded-lg overflow-hidden border border-[#2C2C2C]/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                <div className="h-[120px] flex items-center justify-center text-4xl" style={{ background: meta.gradient }}>
                  {meta.emoji}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: meta.color, background: meta.bg }}>
                      {post.kategorie}
                    </span>
                    <span className="text-[#2C2C2C]/30 text-[11px]">{post.lesezeit}</span>
                  </div>
                  <h3 className="font-extrabold text-[#2C2C2C] text-[15px] leading-snug group-hover:text-[#F5C400] transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="md:hidden text-center mt-8">
          <Link href="/blog" className="font-bold text-[#2C2C2C] text-sm border border-[#2C2C2C]/15 px-6 py-3 rounded-lg hover:border-[#2C2C2C]/30 transition-colors inline-block">
            Alle Artikel lesen →
          </Link>
        </div>
      </div>
    </section>
  )
}
