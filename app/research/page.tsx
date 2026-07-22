'use client'

import Wash from '@/components/backdrop/wash'
import PageHeader from '@/components/page-header'
import { useReveal } from '@/lib/motion/use-reveal'
import { RESEARCH } from '@/content/research'

export default function ResearchPage() {
  const scope = useReveal<HTMLDivElement>()

  return (
    <main className="min-h-screen">
      {/* flow past a body, the figure a fluid-dynamics paper opens with */}
      <Wash variant="dipole" />

      <div ref={scope} className="mx-auto w-full max-w-3xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader
          title="Research"
          lede="Lab work and computational projects, mostly on how things move and find each other inside a cell."
        />

        <div className="mt-20">
          {RESEARCH.map(item => (
            <article
              key={item.id}
              id={item.id}
              data-reveal
              className="grid scroll-mt-32 gap-x-8 gap-y-3 border-t border-border py-10 md:grid-cols-[var(--rail)_1fr]"
            >
              {/* The rail carries when and where. Both were pill badges before,
                  chrome standing in for information that position can encode. */}
              <div data-reveal-child className="caption pt-1.5 md:text-right">
                {item.when}
              </div>

              <div data-reveal-child>
                <h2 className="wght-head font-display text-[length:var(--text-h2)]">{item.title}</h2>
                <p className="caption mt-2">{item.where}</p>
                <p className="mt-4 max-w-prose text-muted-foreground">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
