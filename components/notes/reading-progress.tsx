'use client'

import { motion, useScroll, useSpring } from 'motion/react'

/** A hairline at the top of the note showing how far through it you are. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed inset-x-0 top-0 z-[55] h-px bg-accent"
    />
  )
}
