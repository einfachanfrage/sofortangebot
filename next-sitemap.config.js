const { getAllPosts } = require('./src/lib/blog')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sofortangebot.app',
  generateRobotsTxt: true,
  additionalPaths: async () => {
    try {
      const posts = getAllPosts()
      return posts.map(post => ({
        loc: `/blog/${post.slug}`,
        lastmod: post.date,
        priority: 0.7,
        changefreq: 'weekly',
      }))
    } catch {
      return []
    }
  },
}
