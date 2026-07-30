'use client'

import { useEffect } from 'react'
import type Lenis from 'lenis'

/**
 * Scroll locking for overlays.
 *
 * Three things have to be stopped, not one. Lenis runs its own transform, so
 * stopping it is necessary; `overflow: hidden` covers the desktop wheel; and
 * neither of those stops a touch drag in mobile Safari, which is why the body
 * is taken out of flow and pinned at its current offset. Without that last part
 * every overlay on the site scrolls the page behind it on a phone.
 *
 * The instance lives here as a module-level ref rather than in a context.
 * SmoothScroll registers it on mount and there is only ever one.
 */

let lenis: Lenis | null = null
let locks = 0
let savedY = 0

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

function lock() {
  locks += 1
  if (locks > 1) return

  lenis?.stop()
  savedY = window.scrollY

  const body = document.body
  // Reserve the scrollbar's width, or locking shifts the whole page sideways.
  const gap = window.innerWidth - document.documentElement.clientWidth
  body.style.position = 'fixed'
  body.style.top = `${-savedY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.overflow = 'hidden'
  if (gap > 0) body.style.paddingRight = `${gap}px`
}

function unlock() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return

  const body = document.body
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.overflow = ''
  body.style.paddingRight = ''

  // Taking the body out of flow loses the scroll position, so put it back
  // before Lenis starts reading from it again.
  window.scrollTo(0, savedY)
  lenis?.scrollTo(savedY, { immediate: true })
  lenis?.start()
}

/** Locks the page while `active`, and always releases on unmount. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lock()
    return unlock
  }, [active])
}
