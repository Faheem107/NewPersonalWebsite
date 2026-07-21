import type { MetadataRoute } from 'next'
import { getSubjects } from '@/lib/notes'

const SITE = 'https://faheem.wiki'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/about', '/research', '/notes', '/thoughts', '/photography'].map(path => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
    priority: path === '' ? 1 : 0.8,
  }))

  const notes = getSubjects().flatMap(subject => [
    { url: `${SITE}/notes/${subject.slug}`, lastModified: new Date(), priority: 0.7 },
    ...subject.topics.map(topic => ({
      url: `${SITE}/notes/${subject.slug}/${topic.slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
  ])

  return [...pages, ...notes]
}
