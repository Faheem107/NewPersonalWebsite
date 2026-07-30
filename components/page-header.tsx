'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useIsomorphicLayoutEffect } from '@/lib/motion/layout-effect'

/**
 * Every section opens the same way: the title resolves line by line, the lede
 * follows.
 *
 * `data-enter` holds both hidden from the first painted frame (see globals.css)
 * and is removed at the instant the timeline takes over, so nothing is ever
 * shown and then blanked.
 *
 * The split waits for the fonts. Lexend loads with display: swap, so splitting
 * early measures every character against the fallback face and the heading
 * re-wraps under its own animation when the real one arrives.
 */
export default function PageHeader({ title, lede }: { title: string; lede?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(SplitText)

    let split: SplitText | null = null
    let cancelled = false

    const ctx = gsap.context(() => {
      const heading = root.querySelector('h1')
      if (!heading) return
      const ledeEl = root.querySelector('[data-lede]')

      const run = () => {
        if (cancelled) return

        // smartWrap keeps each word's characters in a nowrap span. Without it a
        // chars-only split lets the browser break inside a word.
        split = new SplitText(heading, {
          type: 'chars',
          charsClass: 'inline-block',
          smartWrap: true,
        })

        const tl = gsap.timeline()
        tl.from(split.chars, {
          yPercent: 108,
          opacity: 0,
          duration: 0.75,
          ease: 'power4.out',
          stagger: 0.022,
          clearProps: 'opacity,transform',
        })
        if (ledeEl) {
          tl.from(
            ledeEl,
            {
              opacity: 0,
              y: 14,
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            },
            '-=0.42',
          )
        }

        // Only now, with the start state already written inline by the tweens.
        heading.removeAttribute('data-enter')
        ledeEl?.removeAttribute('data-enter')
      }

      if (!document.fonts || document.fonts.status === 'loaded') run()
      else document.fonts.ready.then(run)
    }, root)

    return () => {
      cancelled = true
      split?.revert()
      ctx.revert()
    }
  }, [title])

  return (
    <header ref={ref}>
      {/* overflow-hidden gives the chars something to rise out of */}
      <h1
        data-enter
        className="overflow-hidden pb-1 font-display text-[length:var(--text-h1)] leading-[1.05]"
      >
        {title}
      </h1>
      {lede && (
        <p
          data-lede
          data-enter
          className="mt-5 max-w-xl text-[length:var(--text-lede)] text-muted-foreground"
        >
          {lede}
        </p>
      )}
    </header>
  )
}
