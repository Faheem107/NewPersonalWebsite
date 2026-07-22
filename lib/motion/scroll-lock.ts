'use client'

import { useEffect } from 'react'
import type Lenis from 'lenis'

/**
 * Scroll locking for overlays.
 *
 * Lenis drives scrolling, so `overflow: hidden` on the body is not enough on
 * its own: Lenis keeps running its own transform and the page carries on
 * moving behind the overlay. Both have to be stopped together.
 *
 * The instance lives here as a module-level ref rather than in a context.
 * SmoothScroll registers it on mount and there is only ever one, so a provider
 * would be ceremony around a single value that never changes identity.
 */

let lenis: Lenis | null = null
let locks = 0

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

function lock() {
  locks += 1
  if (locks > 1) return
  lenis?.stop()
  // Keep the scrollbar's width reserved, or locking shifts the whole page.
  const gap = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (gap > 0) document.body.style.paddingRight = `${gap}px`
}

function unlock() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  lenis?.start()
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

/** Locks the page while `active`, and always releases on unmount. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lock()
    return unlock
  }, [active])
}
