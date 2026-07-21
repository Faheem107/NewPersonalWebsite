import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Field } from '@/components/backdrop/field-lines'

/**
 * The notes tree is derived from the filesystem, not from a hand-maintained
 * array: adding content/notes/<subject>/<topic>.mdx creates the route, the menu
 * entry and the prev/next links with no code change.
 *
 * Server-only — every export here touches fs.
 */

const ROOT = path.join(process.cwd(), 'content', 'notes')

export type Topic = {
  slug: string
  subject: string
  title: string
  summary: string
  order: number
  updated?: string
}

export type Subject = {
  slug: string
  title: string
  blurb: string
  order: number
  /** which backdrop this subject reads best against */
  field: Field
  topics: Topic[]
}

type SubjectMeta = {
  title?: string
  blurb?: string
  order?: number
  field?: Field
}

/** "greens-functions" -> "Greens Functions", used when a title is missing. */
function titleFromSlug(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function readSubject(slug: string): Subject | null {
  const dir = path.join(ROOT, slug)
  if (!fs.statSync(dir).isDirectory()) return null

  let meta: SubjectMeta = {}
  const metaPath = path.join(dir, '_meta.json')
  if (fs.existsSync(metaPath)) {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as SubjectMeta
  }

  const topics = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(file => {
      const topicSlug = file.replace(/\.mdx$/, '')
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'))
      return {
        slug: topicSlug,
        subject: slug,
        title: (data.title as string) ?? titleFromSlug(topicSlug),
        summary: (data.summary as string) ?? '',
        order: (data.order as number) ?? 999,
        updated: data.updated ? String(data.updated) : undefined,
      }
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

  return {
    slug,
    title: meta.title ?? titleFromSlug(slug),
    blurb: meta.blurb ?? '',
    order: meta.order ?? 999,
    field: meta.field ?? 'laminar',
    topics,
  }
}

export function getSubjects(): Subject[] {
  if (!fs.existsSync(ROOT)) return []
  return fs
    .readdirSync(ROOT)
    .map(readSubject)
    .filter((s): s is Subject => s !== null && s.topics.length > 0)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

export function getSubject(slug: string): Subject | undefined {
  return getSubjects().find(s => s.slug === slug)
}

export function getTopic(subject: string, topic: string): Topic | undefined {
  return getSubject(subject)?.topics.find(t => t.slug === topic)
}

/** Prev/next walk the whole corpus, so they cross subject boundaries. */
export function getAdjacent(subject: string, topic: string) {
  const flat = getSubjects().flatMap(s => s.topics)
  const i = flat.findIndex(t => t.subject === subject && t.slug === topic)
  return {
    prev: i > 0 ? flat[i - 1] : undefined,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined,
  }
}

export function getAllTopicParams() {
  return getSubjects().flatMap(s => s.topics.map(t => ({ subject: s.slug, topic: t.slug })))
}
