'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { usePointer } from '@/lib/motion/pointer'

type Props = {
  children: React.ReactNode
  /** How far outside the element the pull starts, in px. */
  radius?: number
  /** Fraction of the pointer's offset the element travels. */
  pull?: number
  className?: string
}

/**
 * Pulls its child toward the pointer while the pointer is nearby, then springs
 * back. Cheap to run: it reads the shared pointer values and only measures the
 * element when the pull is active.
 */
export default function Magnetic({ children, radius = 90, pull = 0.32, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { hasPointer } = usePointer()
  const [active, setActive] = useState(false)

  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const springConfig = { stiffness: 260, damping: 18, mass: 0.5 }
  const springX = useSpring(dx, springConfig)
  const springY = useSpring(dy, springConfig)

  // A touch of scale on approach reads as weight rather than as a hover state.
  const scale = useTransform([springX, springY], ([sx, sy]: number[]) => {
    const d = Math.hypot(sx, sy)
    return 1 + Math.min(d / (radius * 6), 0.05)
  })

  const onMove = (e: React.MouseEvent) => {
    if (!hasPointer || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const ox = e.clientX - (r.left + r.width / 2)
    const oy = e.clientY - (r.top + r.height / 2)
    if (Math.hypot(ox, oy) > radius + Math.max(r.width, r.height) / 2) return
    dx.set(ox * pull)
    dy.set(oy * pull)
    setActive(true)
  }

  const reset = () => {
    dx.set(0)
    dy.set(0)
    setActive(false)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, scale: active ? scale : 1, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}
