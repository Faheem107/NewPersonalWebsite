'use client'

import Wash from '@/components/backdrop/wash'
import PageHeader from '@/components/page-header'
import { useReveal } from '@/lib/motion/use-reveal'
import { THOUGHTS } from '@/content/thoughts'

export default function ThoughtsPage() {
  const scope = useReveal<HTMLDivElement>({ stagger: 0.05 })

  return (
    <main className="min-h-screen">
      <Wash variant="laminar" />

      <div ref={scope} className="mx-auto w-full max-w-2xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader
          title="Some thoughts!"
          lede="Short pieces about things I found out and could not quite put down afterwards."
        />

        <div className="mt-20">
          {THOUGHTS.map(thought => (
            <article
              key={thought.id}
              id={thought.id}
              data-reveal
              className="scroll-mt-32 border-t border-border py-12"
            >
              <p data-reveal-child className="caption mb-4">
                {thought.date}
              </p>
              <h2
                data-reveal-child
                className="wght-head font-display text-[length:var(--text-h2)] leading-tight"
              >
                {thought.title}
              </h2>
              <div data-reveal-child className="mt-5 space-y-4 text-muted-foreground">
                {thought.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
