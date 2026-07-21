'use client'

import { useEffect } from 'react'
import { motion, useMotionValue } from 'motion/react'
import { usePointer } from '@/lib/motion/pointer'

/**
 * The pointer. Uses mix-blend-mode: difference so it inverts whatever sits
 * under it — which means it needs no knowledge of the theme, and stays legible
 * over photographs and the field-line backdrop alike.
 */
export default function CustomCursor() {
  const { smoothX, smoothY, variant, stickTarget, hasPointer } = usePointer()

  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)

  // When stuck, the cursor parks on the target's centre instead of tracking the
  // pointer — that is what makes a link feel like it caught the cursor.
  useEffect(() => {
    const write = () => {
      if (stickTarget) {
        cx.set(stickTarget.left + stickTarget.width / 2)
        cy.set(stickTarget.top + stickTarget.height / 2)
      } else {
        cx.set(smoothX.get())
        cy.set(smoothY.get())
      }
    }
    write()
    const unsubscribe = [smoothX.on('change', write), smoothY.on('change', write)]
    return () => unsubscribe.forEach(u => u())
  }, [stickTarget, smoothX, smoothY, cx, cy])

  if (!hasPointer) return null

  const stuck = variant === 'stuck' && stickTarget !== null
  const size = stuck
    ? { width: stickTarget!.width + 16, height: stickTarget!.height + 12 }
    : variant === 'highlight'
      ? { width: 34, height: 34 }
      : { width: 9, height: 9 }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        x: cx,
        y: cy,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'difference',
      }}
    >
      <motion.div
        style={{
          background: variant === 'default' ? '#fff' : 'transparent',
          border: variant === 'default' ? 'none' : '1.5px solid #fff',
        }}
        animate={{
          width: size.width,
          height: size.height,
          borderRadius: stuck ? stickTarget!.radius + 7 : 999,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.5 }}
      />
    </motion.div>
  )
}
