import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Wash from '@/components/backdrop/wash'
import PageHeader from '@/components/page-header'
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
    <>
      <Wash variant={s.field} />

      <div className="mx-auto max-w-3xl">
        {/* The sidebar carries the way back to everything else, so there is no
            back link here any more. */}
        <PageHeader title={s.title} lede={s.blurb} />

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
    </>
  )
}
