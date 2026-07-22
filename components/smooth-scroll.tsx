'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerLenis } from '@/lib/motion/scroll-lock'

/**
 * Lenis drives scrolling; GSAP reads from it. Registering ScrollTrigger and
 * then leaving Lenis on its own rAF loop would give two clocks and visible
 * drift, so ScrollTrigger's ticker is the single source of time here.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.05,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ScrollTrigger.update)

    // Overlays need to stop Lenis as well as the body, or the page keeps
    // moving behind them.
    registerLenis(lenis)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      registerLenis(null)
      lenis.destroy()
    }
  }, [])

  return null
}
