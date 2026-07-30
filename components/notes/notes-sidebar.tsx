'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { useHighlight } from '@/lib/motion/pointer'
import { useScrollLock } from '@/lib/motion/scroll-lock'
import type { Subject } from '@/lib/notes'

/**
 * The whole corpus, always in view.
 *
 * Every note is one click from every other note, which is the point of a notes
 * site and what the previous back-link-and-breadcrumb arrangement made
 * impossible. Below lg there is no room for a permanent column, so it becomes a
 * drawer instead.
 */

function SubjectGroup({
  subject,
  onNavigate,
}: {
  subject: Subject
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="mb-7">
      <Link
        href={`/notes/${subject.slug}`}
        onClick={onNavigate}
        className="caption mb-2 block transition-colors hover:text-foreground"
      >
        {subject.title}
      </Link>

      <ul className="flex flex-col border-l border-border">
        {subject.topics.map(topic => {
          const href = `/notes/${subject.slug}/${topic.slug}`
          const active = pathname === href
          return (
            <li key={topic.slug}>
              <TopicLink href={href} active={active} onNavigate={onNavigate}>
                {topic.title}
              </TopicLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function TopicLink({
  href,
  active,
  onNavigate,
  children,
}: {
  href: string
  active: boolean
  onNavigate?: () => void
  children: React.ReactNode
}) {
  // Highlight, not stick: these sit a few pixels apart and snapping the cursor
  // to each one's bounds is jitter by construction.
  const highlight = useHighlight()

  return (
    <Link
      {...highlight}
      href={href}
      prefetch
      onClick={onNavigate}
      data-active={active}
      aria-current={active ? 'page' : undefined}
      className="wght-link -ml-px block border-l border-transparent py-1 pl-4 text-[0.875rem] leading-snug data-[active=true]:border-foreground"
    >
      {children}
    </Link>
  )
}

export default function NotesSidebar({ subjects }: { subjects: Subject[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useScrollLock(open)
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Permanent column, wide screens. Sticks below the header and scrolls
          on its own so a long corpus never pushes the reading column down. */}
      <nav
        aria-label="Notes"
        className="sticky top-32 hidden h-[calc(100vh-10rem)] w-52 shrink-0 overflow-y-auto overscroll-contain pb-10 lg:block"
      >
        {subjects.map(subject => (
          <SubjectGroup key={subject.slug} subject={subject} />
        ))}
      </nav>

      {/* Narrow screens: a control in the flow, and a drawer. Both pills clear
          the home indicator, which bottom-6 alone sits underneath. */}
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="caption fixed left-1/2 z-40 -translate-x-1/2 rounded-full border border-border bg-background/90 px-4 py-3 backdrop-blur-sm lg:hidden"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        Contents
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl lg:hidden"
            style={{ height: '100dvh' }}
            initial={{ clipPath: 'circle(0% at 50% 96%)' }}
            animate={{ clipPath: 'circle(150% at 50% 96%)' }}
            exit={{ clipPath: 'circle(0% at 50% 96%)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* The list scrolls inside the drawer and stops above the button,
                rather than running underneath it. */}
            <nav
              aria-label="Notes"
              className="h-full overflow-y-auto overscroll-contain px-8"
              style={{
                paddingTop: 'calc(env(safe-area-inset-top) + 6rem)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 6rem)',
              }}
            >
              {subjects.map(subject => (
                <SubjectGroup
                  key={subject.slug}
                  subject={subject}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </nav>

            <button
              onClick={() => setOpen(false)}
              className="caption fixed left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/90 px-4 py-3 backdrop-blur-sm"
              style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
