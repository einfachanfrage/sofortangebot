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

export { KATEGORIE_META, formatDate } from '@/lib/blog-client'
