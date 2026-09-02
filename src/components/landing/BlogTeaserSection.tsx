import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/blog-client'

export function BlogTeaserSection() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-syne font-extrabold text-anthracite text-[28px] md:text-[36px] tracking-tight">
              Praxiswissen für Handwerker
            </h2>
            <p className="text-[#888] text-base mt-1">Kurz. Konkret. Direkt umsetzbar.</p>
          </div>
          <Link
            href="/blog"
            className="hidden md:block shrink-0 ml-8 text-sm font-bold text-anthracite/40 hover:text-anthracite transition-colors"
          >
            Alle Artikel →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {posts.map(post => {
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-anthracite overflow-hidden flex flex-col hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-yellow text-[11px] font-black uppercase tracking-widest">
                      {post.kategorie}
                    </span>
                    <span className="text-white/20 text-[11px]">{post.lesezeit}</span>
                  </div>
                  <h3 className="font-syne font-extrabold text-white text-[16px] leading-snug group-hover:text-yellow transition-colors">
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
            className="font-bold text-anthracite text-sm border border-anthracite/15 px-6 py-3 hover:border-anthracite/30 transition-colors inline-block"
          >
            Alle Artikel lesen →
          </Link>
        </div>
      </div>
    </section>
  )
}
