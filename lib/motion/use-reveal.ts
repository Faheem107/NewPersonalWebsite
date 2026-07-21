'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Reveals `[data-reveal]` descendants as they enter the viewport, once each.
 *
 * The pages this replaces animated every item on mount with an index-scaled
 * delay, so entries far below the fold finished their entrance before anyone
 * could see them and the reveal was pure cost. Tying it to scroll position is
 * both cheaper and the effect that was presumably intended.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  { y = 22, stagger = 0.08, start = 'top 88%' } = {},
) {
  const scope = useRef<T>(null)

  useEffect(() => {
    const root = scope.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      items.forEach(item => {
        const group = item.querySelectorAll('[data-reveal-child]')
        const targets = group.length ? Array.from(group) : [item]
        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 0.7,
          ease: 'power3.out',
          stagger,
          scrollTrigger: { trigger: item, start, once: true },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [y, stagger, start])

  return scope
}
