'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { getCursorState, useHighlight } from '@/lib/motion/pointer'
import type { Subject } from '@/lib/notes'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
}

const plateIn = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 220, damping: 26 },
  },
}

function TopicLink({ subject, slug, title }: { subject: string; slug: string; title: string }) {
  // Highlight rather than stick. These sit a few pixels apart, and a cursor
  // that snaps to each one's bounds spends the whole time in transit.
  const highlight = useHighlight()
  return (
    <Link
      {...highlight}
      href={`/notes/${subject}/${slug}`}
      prefetch
      className="wght-link block py-[3px] text-[0.9375rem] leading-snug"
    >
      {title}
    </Link>
  )
}

function SubjectPlate({
  subject,
  dimmed,
  onHover,
}: {
  subject: Subject
  dimmed: boolean
  onHover: (slug: string | null) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  // The wash follows the pointer with a lag, which is the whole effect. It is
  // written straight to CSS custom properties from one rAF loop that only runs
  // while the plate is hovered, so tracking costs no renders and no layout.
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const state = getCursorState()
    let x = state.x - rect.left
    let y = state.y - rect.top
    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const k = 1 - Math.exp(-dt * 12)
      x += (state.x - rect.left - x) * k
      y += (state.y - rect.top - y) * k
      el.style.setProperty('--wash-x', `${x}px`)
      el.style.setProperty('--wash-y', `${y}px`)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <motion.div
      ref={ref}
      variants={plateIn}
      onMouseEnter={() => {
        setActive(true)
        onHover(subject.slug)
      }}
      onMouseLeave={() => {
        setActive(false)
        onHover(null)
      }}
      animate={{
        opacity: dimmed ? 0.55 : 1,
        scale: active ? 1.03 : 1,
        filter: dimmed ? 'blur(1.5px)' : 'blur(0px)',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="plate relative flex flex-col overflow-hidden p-7"
    >
      {/* The wash sits under the content and only paints while hovered. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(340px circle at var(--wash-x, -600px) var(--wash-y, -600px), rgb(var(--wash) / 0.17), transparent 68%)',
        }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative">
        <h2 className="wght-head font-display text-[length:var(--text-h3)] leading-tight">
          {subject.title}
        </h2>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground">
          {subject.blurb}
        </p>

        <div className="mt-6 border-t border-border pt-5">
          <p className="caption mb-3">
            {subject.topics.length} {subject.topics.length === 1 ? 'note' : 'notes'}
          </p>
          <div className="flex flex-col">
            {subject.topics.map(topic => (
              <TopicLink
                key={topic.slug}
                subject={subject.slug}
                slug={topic.slug}
                title={topic.title}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function NotesMenu({ subjects }: { subjects: Subject[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {subjects.map(subject => (
        <SubjectPlate
          key={subject.slug}
          subject={subject}
          dimmed={hovered !== null && hovered !== subject.slug}
          onHover={setHovered}
        />
      ))}
    </motion.div>
  )
}
