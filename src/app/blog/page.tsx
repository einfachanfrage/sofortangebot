import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { BlogListing } from '@/components/blog/BlogListing'

export const metadata: Metadata = {
  title: 'Blog | Praxiswissen für Handwerker | Sofortangebot',
  description: 'Angebote, Preise, Recht: Praxiswissen für Handwerker. Kurz erklärt. Direkt umsetzbar.',
  alternates: { canonical: 'https://sofortangebot.app/blog' },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <div className="bg-anthracite px-5 md:px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-yellow text-xs font-extrabold uppercase tracking-widest mb-4">
            Praxiswissen für Handwerker
          </div>
          <h1 className="font-extrabold text-white text-[36px] md:text-[48px] leading-tight tracking-tight mb-4">
            Angebote. Preise. Recht.
          </h1>
          <p className="text-[#AAAAAA] text-lg md:text-xl font-normal leading-relaxed max-w-xl">
            Kurz erklärt. Direkt umsetzbar. Kein Bullshit.
          </p>
        </div>
      </div>

      <BlogListing posts={posts} />
    </div>
  )
}
