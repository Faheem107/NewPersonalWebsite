'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/lib/motion/layout-effect'

/**
 * Reveals `[data-reveal]` descendants as they enter the viewport, once each.
 *
 * `data-enter` holds each item hidden from the first painted frame (see
 * globals.css); the attribute comes off only once the tween has written its own
 * start state inline, so the handover costs no frame either way.
 *
 * clearProps matters as much as the animation: a leftover transform is a
 * stacking context, and one on every article traps the glossary boxes inside it.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  { y = 22, stagger = 0.08, start = 'top 88%' } = {},
) {
  const scope = useRef<T>(null)

  useIsomorphicLayoutEffect(() => {
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
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: item, start, once: true },
        })

        item.removeAttribute('data-enter')
      })
    }, root)

    // Start positions are measured against the fallback face otherwise.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => ctx.revert()
  }, [y, stagger, start])

  return scope
}
