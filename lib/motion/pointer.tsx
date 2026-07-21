'use client'

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'motion/react'

export type CursorVariant = 'default' | 'highlight' | 'stuck'

export type StickTarget = {
  left: number
  top: number
  width: number
  height: number
  radius: number
}

type PointerContextValue = {
  /** Raw pointer position, updated every mousemove. */
  x: MotionValue<number>
  y: MotionValue<number>
  /** Spring-smoothed pointer. Everything decorative should read these instead
   *  of the raw values — unsmoothed coordinates are what make a mouse-follow
   *  effect feel mechanical. */
  smoothX: MotionValue<number>
  smoothY: MotionValue<number>
  variant: CursorVariant
  setVariant: (v: CursorVariant) => void
  stickTarget: StickTarget | null
  stick: (el: Element | null) => void
  unstick: () => void
  hasPointer: boolean
}

const PointerContext = createContext<PointerContextValue | null>(null)

export function PointerProvider({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const spring = { stiffness: 380, damping: 32, mass: 0.45 }
  const smoothX = useSpring(x, spring)
  const smoothY = useSpring(y, spring)

  const [variant, setVariant] = useState<CursorVariant>('default')
  const [stickTarget, setStickTarget] = useState<StickTarget | null>(null)
  const [hasPointer, setHasPointer] = useState(false)

  const stick = useCallback((el: Element | null) => {
    if (!el) return
    const r = el.getBoundingClientRect()
    const radius = parseFloat(getComputedStyle(el).borderRadius) || 8
    setStickTarget({ left: r.left, top: r.top, width: r.width, height: r.height, radius })
    setVariant('stuck')
  }, [])

  const unstick = useCallback(() => {
    setStickTarget(null)
    setVariant('default')
  }, [])

  useEffect(() => {
    // A fine pointer that also reports hover is the only case where replacing
    // the system cursor is safe. Touch and stylus keep theirs.
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setHasPointer(mq.matches && !reduced.matches)
    sync()
    mq.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!hasPointer) return
    document.documentElement.classList.add('has-custom-cursor')
    return () => document.documentElement.classList.remove('has-custom-cursor')
  }, [hasPointer])

  useEffect(() => {
    if (!hasPointer) return
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [hasPointer, x, y])

  // A stuck target is stored in viewport coordinates, so it goes stale the
  // moment the page scrolls or resizes underneath it.
  useEffect(() => {
    if (!stickTarget) return
    const drop = () => unstick()
    window.addEventListener('scroll', drop, { passive: true })
    window.addEventListener('resize', drop)
    return () => {
      window.removeEventListener('scroll', drop)
      window.removeEventListener('resize', drop)
    }
  }, [stickTarget, unstick])

  const value = useMemo(
    () => ({ x, y, smoothX, smoothY, variant, setVariant, stickTarget, stick, unstick, hasPointer }),
    [x, y, smoothX, smoothY, variant, stickTarget, stick, unstick, hasPointer],
  )

  return <PointerContext.Provider value={value}>{children}</PointerContext.Provider>
}

export function usePointer() {
  const ctx = useContext(PointerContext)
  if (!ctx) throw new Error('usePointer must be used inside <PointerProvider>')
  return ctx
}

/**
 * Handlers that make an element a cursor target: the cursor snaps to its bounds
 * on enter and releases on leave. Spread onto the element.
 */
export function useStick() {
  const { stick, unstick } = usePointer()
  const ref = useRef<HTMLElement | null>(null)

  return useMemo(
    () => ({
      onMouseEnter: (e: React.MouseEvent) => {
        ref.current = e.currentTarget as HTMLElement
        stick(e.currentTarget)
      },
      onMouseLeave: () => {
        ref.current = null
        unstick()
      },
    }),
    [stick, unstick],
  )
}

/** Marks an element as merely interactive — the cursor grows but does not snap. */
export function useHighlight() {
  const { setVariant } = usePointer()
  return useMemo(
    () => ({
      onMouseEnter: () => setVariant('highlight'),
      onMouseLeave: () => setVariant('default'),
    }),
    [setVariant],
  )
}
