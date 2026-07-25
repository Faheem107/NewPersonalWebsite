'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

/**
 * Every section opens the same way: the title resolves line by line, the lede
 * follows. One orchestrated entrance per page rather than a stagger on every
 * element, which is what made the old pages feel busy.
 */
export default function PageHeader({ title, lede }: { title: string; lede?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(SplitText)

    const ctx = gsap.context(() => {
      const heading = root.querySelector('h1')
      if (!heading) return
      // smartWrap is load-bearing, not a nicety. A chars-only split makes every
      // character its own inline-block, and the browser will then break inside
      // a word: at a partial window "Photography and film" wrapped as
      // "Photograph / y and film". smartWrap puts each word's chars in a
      // white-space: nowrap span, which is GSAP's own answer to this.
      const split = new SplitText(heading, {
        type: 'chars',
        charsClass: 'inline-block',
        smartWrap: true,
      })

      gsap
        .timeline()
        .from(split.chars, {
          yPercent: 108,
          opacity: 0,
          duration: 0.75,
          ease: 'power4.out',
          stagger: 0.022,
        })
        .from('[data-lede]', { opacity: 0, y: 14, duration: 0.6, ease: 'power3.out' }, '-=0.42')

      return () => split.revert()
    }, root)

    return () => ctx.revert()
  }, [title])

  return (
    <header ref={ref}>
      {/* overflow-hidden gives the chars something to rise out of */}
      <h1 className="overflow-hidden pb-1 font-display text-[length:var(--text-h1)] leading-[1.05]">
        {title}
      </h1>
      {lede && (
        <p data-lede className="mt-5 max-w-xl text-[length:var(--text-lede)] text-muted-foreground">
          {lede}
        </p>
      )}
    </header>
  )
}
