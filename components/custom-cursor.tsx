'use client'

import { useEffect, useRef } from 'react'
import { getCursorState, targetRadius, usePointer } from '@/lib/motion/pointer'

/**
 * The pointer. One rAF loop writing transforms straight to the DOM: nothing
 * goes through React state and nothing re-renders while the pointer moves.
 *
 * No mix-blend-mode: blending over .plate, which uses backdrop-filter and so
 * creates a stacking context the compositor redraws every frame, flickers. The
 * ring below buys the contrast the blend was for.
 *
 * It stores the stuck element rather than its rect and re-measures each frame,
 * because Lenis fires scroll every frame and unsticking on scroll drops the
 * cursor constantly.
 */

type Shape = { w: number; h: number; r: number; fill: number; ring: number }

const SHAPES = {
  // a small filled dot
  default: { w: 9, h: 9, r: 999, fill: 1, ring: 0 },
  // an open ring over anything interactive
  highlight: { w: 34, h: 34, r: 999, fill: 0, ring: 1 },
  // an I-beam substitute over prose, since cursor:none removes the real one
  text: { w: 2, h: 22, r: 1, fill: 1, ring: 0 },
} satisfies Record<string, Shape>

/** Frame-rate independent exponential smoothing. */
function approach(current: number, goal: number, dt: number, rate: number) {
  return current + (goal - current) * (1 - Math.exp(-dt * rate))
}

export default function CustomCursor() {
  const { hasPointer } = usePointer()
  const rootRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasPointer) return
    const root = rootRef.current
    const box = boxRef.current
    if (!root || !box) return

    const state = getCursorState()

    // Current, smoothed. Seeded off-screen so nothing flashes at the origin.
    let x = -100
    let y = -100
    let w = SHAPES.default.w
    let h = SHAPES.default.h
    let r = SHAPES.default.r
    let fill = 1
    let opacity = 0

    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      let goalX = state.x
      let goalY = state.y
      let shape: Shape = SHAPES.default

      if (state.variant === 'stuck' && state.target?.isConnected) {
        // Re-measured every frame rather than cached, so the snap survives
        // scrolling, resizing and layout shifts underneath it.
        const rect = state.target.getBoundingClientRect()
        goalX = rect.left + rect.width / 2
        goalY = rect.top + rect.height / 2
        shape = {
          w: rect.width + 16,
          h: rect.height + 12,
          r: targetRadius(state.target) + 7,
          fill: 0,
          ring: 1,
        }
      } else if (state.variant === 'highlight') {
        shape = SHAPES.highlight
      } else if (state.variant === 'text') {
        shape = SHAPES.text
      }

      x = approach(x, goalX, dt, 26)
      y = approach(y, goalY, dt, 26)
      w = approach(w, shape.w, dt, 20)
      h = approach(h, shape.h, dt, 20)
      r = approach(r, shape.r, dt, 20)
      fill = approach(fill, shape.fill, dt, 18)
      opacity = approach(opacity, state.inside ? 1 : 0, dt, 14)

      root.style.transform = `translate3d(${x}px, ${y}px, 0)`
      root.style.opacity = String(opacity)
      box.style.width = `${w}px`
      box.style.height = `${h}px`
      box.style.borderRadius = `${r}px`
      box.style.backgroundColor = `rgb(var(--cursor) / ${fill})`
      box.style.borderColor = `rgb(var(--cursor) / ${1 - fill})`
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [hasPointer])

  if (!hasPointer) return null

  return (
    <div
      ref={rootRef}
      aria-hidden
      // Above the search dialog and the torus modals, which sit at 100 and 200,
      // so the cursor never disappears behind an overlay. The loop owns this
      // element's transform outright, so no translate utilities here: they
      // would be overwritten every frame anyway.
      className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
      style={{ opacity: 0 }}
    >
      <div
        ref={boxRef}
        className="border"
        style={{
          // Centred here rather than on the root, whose transform the loop
          // rewrites every frame.
          transform: 'translate(-50%, -50%)',
          // Keeps it legible over photographs.
          boxShadow: '0 0 0 1px rgb(var(--cursor-contrast) / 0.35)',
        }}
      />
    </div>
  )
}
