import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllSlugs, getPostBySlug, getAllPosts, KATEGORIE_META, formatDate } from '@/lib/blog'
import { TableOfContentsSidebar, TableOfContentsMobile } from '@/components/blog/TableOfContents'
import { Mic } from 'lucide-react'

export async function generateStaticParams() {
  return getAllSlugs()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = getPostBySlug(slug)
    const fm = post.frontmatter
    return {
      title: fm.meta_title,
      description: fm.meta_description,
      openGraph: {
        title: fm.meta_title,
        description: fm.meta_description,
        type: 'article',
        publishedTime: fm.date,
        locale: 'de_DE',
        siteName: 'Sofortangebot',
      },
      alternates: { canonical: `https://sofortangebot.app/blog/${slug}` },
    }
  } catch {
    return {}
  }
}

// MDX components with article typography + heading IDs for TOC
function makeComponents(mdxComponents: Record<string, React.ComponentType<React.HTMLAttributes<HTMLElement>>> = {}) {
  function slugify(text: string) {
    return String(text).toLowerCase().replace(/[^a-z0-9äöü]+/g, '-').replace(/^-|-$/g, '')
  }
  return {
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 id={slugify(String(children))} {...props}
        className="font-extrabold text-anthracite text-[24px] mt-10 mb-3 pl-4 border-l-4 border-yellow leading-snug"
      >{children}</h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 id={slugify(String(children))} {...props}
        className="font-extrabold text-anthracite text-[20px] mt-8 mb-2 leading-snug"
      >{children}</h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="text-[17px] leading-[1.8] text-[#333] mb-6">{children}</p>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="pl-6 mb-6 list-disc space-y-2">{children}</ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol {...props} className="pl-6 mb-6 list-decimal space-y-2">{children}</ol>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li {...props} className="text-[17px] leading-[1.7] text-[#333]">{children}</li>
    ),
    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote {...props}
        className="border-l-4 border-yellow bg-[#FFFBEB] px-5 py-4 my-6 rounded-r-lg italic text-[#555] text-[16px] leading-relaxed"
      >{children}</blockquote>
    ),
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong {...props} className="font-extrabold text-anthracite">{children}</strong>
    ),
    code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code {...props} className="bg-[#F5F5F5] px-1.5 py-0.5 rounded text-[14px] font-mono">{children}</code>
    ),
    ...mdxComponents,
  }
}

// Inline CTA box
function InlineCTA() {
  return (
    <div className="border-l-4 border-yellow bg-[#FFFBEB] px-5 py-5 my-8 rounded-r-lg">
      <div className="font-extrabold text-anthracite text-[16px] mb-2">
        Angebote noch schneller schreiben?
      </div>
      <p className="text-[#555] text-sm leading-relaxed mb-4">
        Sofortangebot erstellt dir ein professionelles PDF per Sprache — in unter 2 Minuten.
      </p>
      <Link
        href="/register"
        className="inline-flex items-center gap-2 bg-yellow text-anthracite font-extrabold text-sm px-5 py-2.5 rounded-lg hover:bg-[#e6b800] transition-colors"
      >
        <Mic size={14} strokeWidth={2.5} />
        Kostenlos testen →
      </Link>
    </div>
  )
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post
  try { post = getPostBySlug(slug) } catch { notFound() }

  const fm = post.frontmatter
  const meta = KATEGORIE_META[fm.kategorie] ?? KATEGORIE_META['Angebote']

  // Related posts: same category, exclude current
  const allPosts = getAllPosts()
  const related = allPosts.filter(p => p.kategorie === fm.kategorie && p.slug !== slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    datePublished: fm.date,
    author: { '@type': 'Organization', name: 'Sofortangebot' },
    publisher: { '@type': 'Organization', name: 'Sofortangebot', url: 'https://sofortangebot.app' },
    description: fm.meta_description,
  }

  // Split content at ~40% for inline CTA
  const lines = post.content.split('\n')
  const splitAt = Math.floor(lines.length * 0.4)
  const contentBefore = lines.slice(0, splitAt).join('\n')
  const contentAfter = lines.slice(splitAt).join('\n')

  const mdxComponents = makeComponents()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-dvh bg-bg">
        {/* Gradient header */}
        <div className="h-2" style={{ background: meta.gradient }} />

        <div className="max-w-6xl mx-auto px-5 md:px-10 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[13px] text-anthracite/40 font-medium mb-6">
            <Link href="/" className="hover:text-anthracite/70">Startseite</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-anthracite/70">Blog</Link>
            <span>›</span>
            <span className="text-anthracite/60 truncate max-w-[200px]">{fm.title}</span>
          </div>

          <div className="flex gap-12 items-start">
            {/* ── ARTICLE (68%) ── */}
            <article className="flex-1 min-w-0 max-w-[680px]">
              {/* Meta */}
              <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: meta.color, background: meta.bg }}>
                  {fm.kategorie}
                </span>
                <span className="text-anthracite/30 text-xs">·</span>
                <span className="text-anthracite/40 text-xs font-semibold">{post.lesezeit}</span>
                <span className="text-anthracite/30 text-xs">·</span>
                <span className="text-anthracite/40 text-xs font-semibold">{formatDate(fm.date)}</span>
              </div>

              <h1 className="font-extrabold text-anthracite text-[32px] md:text-[40px] leading-tight tracking-tight mb-8">
                {fm.title}
              </h1>

              {/* Mobile TOC */}
              <div className="md:hidden">
                <TableOfContentsMobile headings={post.headings} />
              </div>

              {/* Content part 1 */}
              <div className="prose-custom">
                <MDXRemote source={contentBefore} components={mdxComponents} />
              </div>

              {/* Inline CTA */}
              <InlineCTA />

              {/* Content part 2 */}
              <div className="prose-custom">
                <MDXRemote source={contentAfter} components={mdxComponents} />
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-14 pt-10 border-t border-anthracite/10">
                  <h2 className="font-extrabold text-anthracite text-xl mb-5">Das könnte dich auch interessieren</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {related.map(p => {
                      const rm = KATEGORIE_META[p.kategorie] ?? KATEGORIE_META['Angebote']
                      return (
                        <Link key={p.slug} href={`/blog/${p.slug}`}
                          className="bg-white rounded-lg p-4 border border-anthracite/5 hover:shadow-sm hover:-translate-y-0.5 transition-all group"
                        >
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block" style={{ color: rm.color, background: rm.bg }}>
                            {p.kategorie}
                          </span>
                          <div className="font-extrabold text-anthracite text-sm leading-snug group-hover:text-yellow transition-colors">
                            {p.title}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </article>

            {/* ── SIDEBAR (32%) ── */}
            <aside className="hidden md:block w-[260px] shrink-0">
              <TableOfContentsSidebar headings={post.headings} />
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
