'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react'
import { usePointer, useStick } from '@/lib/motion/pointer'
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
  const stick = useStick()
  return (
    <Link
      {...stick}
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
  const rect = useRef<DOMRect | null>(null)
  const { smoothX, smoothY } = usePointer()
  const [active, setActive] = useState(false)

  // Local coordinates for the wash. Seeded off-plate so nothing shows until the
  // pointer actually arrives.
  const lx = useMotionValue(-600)
  const ly = useMotionValue(-600)

  // Reads the shared spring, not the raw pointer — the lag is the whole effect.
  // The rect is captured once on enter rather than measured per frame, so this
  // costs no layout work while tracking.
  useMotionValueEvent(smoothX, 'change', v => {
    if (rect.current) lx.set(v - rect.current.left)
  })
  useMotionValueEvent(smoothY, 'change', v => {
    if (rect.current) ly.set(v - rect.current.top)
  })

  const wash = useMotionTemplate`radial-gradient(340px circle at ${lx}px ${ly}px, rgb(var(--wash) / 0.17), transparent 68%)`

  return (
    <motion.div
      ref={ref}
      variants={plateIn}
      onMouseEnter={() => {
        rect.current = ref.current?.getBoundingClientRect() ?? null
        setActive(true)
        onHover(subject.slug)
      }}
      onMouseLeave={() => {
        rect.current = null
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
        style={{ background: wash }}
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
