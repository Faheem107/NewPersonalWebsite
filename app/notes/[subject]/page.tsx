import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FieldLines from '@/components/backdrop/field-lines'
import PageHeader from '@/components/page-header'
import BackLink from '@/components/notes/back-link'
import { getSubject, getSubjects } from '@/lib/notes'

type Params = { params: Promise<{ subject: string }> }

export function generateStaticParams() {
  return getSubjects().map(s => ({ subject: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { subject } = await params
  const s = getSubject(subject)
  if (!s) return {}
  return { title: s.title, description: s.blurb }
}

export default async function SubjectPage({ params }: Params) {
  const { subject } = await params
  const s = getSubject(subject)
  if (!s) notFound()

  return (
    <main className="min-h-screen">
      <FieldLines field={s.field} />

      <div className="mx-auto w-full max-w-3xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <BackLink href="/notes" label="All notes" />

        <div className="mt-8">
          <PageHeader title={s.title} lede={s.blurb} />
        </div>

        <ol className="mt-16">
          {s.topics.map((topic, i) => (
            <li key={topic.slug}>
              <Link
                href={`/notes/${s.slug}/${topic.slug}`}
                prefetch
                className="group grid gap-x-8 gap-y-2 border-t border-border py-7 md:grid-cols-[3.5rem_1fr]"
              >
                {/* Notes within a subject build on each other, so the index is
                    real information rather than decoration. */}
                <span className="caption md:pt-2 md:text-right">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="wght-head block font-display text-[length:var(--text-h3)] leading-snug transition-colors group-hover:text-accent">
                    {topic.title}
                  </span>
                  {topic.summary && (
                    <span className="mt-1.5 block text-[0.9375rem] text-muted-foreground">
                      {topic.summary}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  )
}
