'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CursorVariant = 'default' | 'highlight' | 'stuck' | 'text'

/**
 * Pointer state for the custom cursor.
 *
 * Deliberately not React state. Every element using useStick consumes this, so
 * held in a provider it would re-render the whole subtree on each hover, which
 * in a dense list of links is most of a frame. A module-level store and a
 * context value that never changes identity instead: writers mutate, and the
 * cursor reads from a single rAF loop.
 */

type Store = {
  /** raw pointer position, written on every pointermove */
  x: number
  y: number
  variant: CursorVariant
  /** the element to snap to, kept as an element rather than a rect */
  target: HTMLElement | null
  /** false while the pointer is outside the window */
  inside: boolean
}

const store: Store = { x: -100, y: -100, variant: 'default', target: null, inside: false }

/** Read from the cursor's own rAF loop, so there is nothing to notify. */
export function getCursorState(): Readonly<Store> {
  return store
}

export function setCursorPosition(x: number, y: number) {
  store.x = x
  store.y = y
  store.inside = true
}

export function setCursorInside(inside: boolean) {
  store.inside = inside
}

export function setCursorVariant(variant: CursorVariant) {
  if (store.variant === variant) return
  store.variant = variant
  if (variant !== 'stuck') store.target = null
}

export function setCursorTarget(el: HTMLElement | null) {
  store.target = el
  store.variant = el ? 'stuck' : 'default'
}

/**
 * Corner radius of a stick target. getComputedStyle forces a style recalc, so
 * elements can declare it with data-cursor-radius; otherwise measure once.
 */
const radiusCache = new WeakMap<HTMLElement, number>()

export function targetRadius(el: HTMLElement): number {
  const declared = el.dataset.cursorRadius
  if (declared) return Number(declared) || 8

  const cached = radiusCache.get(el)
  if (cached !== undefined) return cached

  const measured = parseFloat(getComputedStyle(el).borderRadius) || 8
  radiusCache.set(el, measured)
  return measured
}

/** Whether the pointer is over something that should read as text. */
const TEXT_SELECTOR = 'p, li, blockquote, h1, h2, h3, h4, .notes-prose, [data-cursor="text"]'

type PointerContextValue = { hasPointer: boolean }

const PointerContext = createContext<PointerContextValue | null>(null)

export function PointerProvider({ children }: { children: React.ReactNode }) {
  const [hasPointer, setHasPointer] = useState(false)

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

    const onMove = (e: PointerEvent) => setCursorPosition(e.clientX, e.clientY)

    // Or the cursor is stranded wherever it was last seen.
    const onLeave = (e: PointerEvent) => {
      if (e.relatedTarget) return
      setCursorInside(false)
    }

    // Resolved on pointerover, which fires once per element crossed rather
    // than per frame. Stuck and highlight are explicit and win over this.
    const onOver = (e: Event) => {
      if (store.variant === 'stuck' || store.variant === 'highlight') return
      const target = e.target as HTMLElement | null
      const isText = target?.closest?.(TEXT_SELECTOR) != null
      setCursorVariant(isText ? 'text' : 'default')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onLeave)
    document.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onLeave)
      document.removeEventListener('pointerover', onOver)
    }
  }, [hasPointer])

  const value = useMemo(() => ({ hasPointer }), [hasPointer])

  return <PointerContext.Provider value={value}>{children}</PointerContext.Provider>
}

export function usePointer() {
  const ctx = useContext(PointerContext)
  if (!ctx) throw new Error('usePointer must be used inside <PointerProvider>')
  return ctx
}

/**
 * Makes an element a snap target: the cursor takes its shape on enter and
 * releases on leave. Isolated controls only. A dense list wants useHighlight,
 * since snapping between neighbours a few pixels apart is jitter.
 */
export function useStick() {
  return useMemo(
    () => ({
      onMouseEnter: (e: React.MouseEvent) => setCursorTarget(e.currentTarget as HTMLElement),
      onMouseLeave: () => setCursorTarget(null),
    }),
    [],
  )
}

/** Marks an element as merely interactive: the cursor grows but does not snap. */
export function useHighlight() {
  return useMemo(
    () => ({
      onMouseEnter: () => setCursorVariant('highlight'),
      onMouseLeave: () => setCursorVariant('default'),
    }),
    [],
  )
}
