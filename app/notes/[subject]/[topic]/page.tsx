import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FieldLines from '@/components/backdrop/field-lines'
import BackLink from '@/components/notes/back-link'
import ReadingProgress from '@/components/notes/reading-progress'
import { getAdjacent, getAllTopicParams, getSubject, getTopic } from '@/lib/notes'

type Params = { params: Promise<{ subject: string; topic: string }> }

export function generateStaticParams() {
  return getAllTopicParams()
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { subject, topic } = await params
  const t = getTopic(subject, topic)
  if (!t) return {}
  return { title: t.title, description: t.summary }
}

export default async function TopicPage({ params }: Params) {
  const { subject, topic } = await params
  const s = getSubject(subject)
  const t = getTopic(subject, topic)
  if (!s || !t) notFound()

  // The static prefix and suffix let the bundler resolve this to a finite set
  // of modules, so every note is compiled and prerendered at build time.
  const { default: Note } = await import(`@/content/notes/${subject}/${topic}.mdx`)

  const { prev, next } = getAdjacent(subject, topic)

  return (
    <main className="min-h-screen">
      <FieldLines field={s.field} alpha={0.28} />
      <ReadingProgress />

      <article className="relative mx-auto w-full max-w-[42rem] px-6 pb-28 pt-32 md:px-8 md:pt-40">
        <BackLink href={`/notes/${s.slug}`} label={s.title} />

        <header className="mb-12 mt-8">
          <h1 className="font-display text-[length:var(--text-h1)] leading-[1.08]">{t.title}</h1>
          {t.summary && (
            <p className="mt-4 text-[length:var(--text-lede)] text-muted-foreground">{t.summary}</p>
          )}
          {t.updated && <p className="caption mt-6">Updated {t.updated}</p>}
        </header>

        <div className="notes-prose">
          <Note />
        </div>

        <nav
          aria-label="Note navigation"
          className="mt-20 grid gap-6 border-t border-border pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link href={`/notes/${prev.subject}/${prev.slug}`} className="group">
              <span className="caption">Previous</span>
              <span className="wght-head mt-1 block font-display text-lg leading-snug transition-colors group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/notes/${next.subject}/${next.slug}`} className="group sm:text-right">
              <span className="caption">Next</span>
              <span className="wght-head mt-1 block font-display text-lg leading-snug transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </article>
    </main>
  )
}
