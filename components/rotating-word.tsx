'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/**
 * Cycles a short list of words in place.
 *
 * Replaces a character-by-character typewriter that drove a React state update
 * per keystroke — roughly forty re-renders of the hero per word. This animates
 * on the compositor and re-renders once per word.
 */
export default function RotatingWord({ words, hold = 2200 }: { words: string[]; hold?: number }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI(n => (n + 1) % words.length), hold)
    return () => clearInterval(t)
  }, [words.length, hold])

  // Reserve the width of the longest word so the line never reflows mid-cycle.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className="relative inline-grid">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {longest}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          className="col-start-1 row-start-1 md:text-right"
          initial={{ opacity: 0, y: '0.35em' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-0.35em' }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
