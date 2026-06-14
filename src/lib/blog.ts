import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  title: string
  slug: string
  date: string
  meta_title: string
  meta_description: string
  kategorie: string
  gewerk: string
  lesezeit: string
  excerpt: string
}

export interface BlogPostFull {
  frontmatter: {
    title: string
    slug: string
    date: string
    meta_title: string
    meta_description: string
    kategorie: string
    gewerk: string
  }
  content: string
  lesezeit: string
  headings: { id: string; text: string }[]
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  return files
    .map(filename => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      const rt = readingTime(content)
      return {
        ...data,
        slug: data.slug || filename.replace('.mdx', ''),
        lesezeit: Math.ceil(rt.minutes) + ' Min.',
        excerpt: content.replace(/^#+\s.*/gm, '').replace(/[#*>`]/g, '').trim().slice(0, 200) + '…',
      } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPostFull {
  const filepath = path.join(BLOG_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)

  // Extract H2 headings for TOC
  const headings = [...content.matchAll(/^## (.+)$/gm)].map(m => ({
    id: m[1].toLowerCase().replace(/[^a-z0-9äöü]+/g, '-').replace(/^-|-$/g, ''),
    text: m[1],
  }))

  return {
    frontmatter: data as BlogPostFull['frontmatter'],
    content,
    lesezeit: Math.ceil(rt.minutes) + ' Min.',
    headings,
  }
}

export function getAllSlugs() {
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => ({ slug: f.replace('.mdx', '') }))
}

export const KATEGORIE_META: Record<string, { color: string; bg: string; gradient: string; emoji: string }> = {
  'Angebote':      { color: '#92620A', bg: '#FFFBEB', gradient: 'linear-gradient(135deg, #2C2C2C 0%, #F5C400 100%)', emoji: '📄' },
  'Preise':        { color: '#1D4ED8', bg: '#EFF6FF', gradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', emoji: '💰' },
  'Recht & Steuern': { color: '#B91C1C', bg: '#FEF2F2', gradient: 'linear-gradient(135deg, #7F1D1D 0%, #EF4444 100%)', emoji: '⚖️' },
  'Gewerke':       { color: '#15803D', bg: '#F0FDF4', gradient: 'linear-gradient(135deg, #14532D 0%, #22C55E 100%)', emoji: '🔧' },
  'Tools':         { color: '#7E22CE', bg: '#FAF5FF', gradient: 'linear-gradient(135deg, #4C1D95 0%, #A855F7 100%)', emoji: '⚙️' },
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
