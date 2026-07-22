'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useStick } from '@/lib/motion/pointer'

/**
 * Light and dark are drawn as a single disc that fills and empties, rather than
 * a sun swapping for a moon, closer to an exposure than an icon set.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const stick = useStick()

  useEffect(() => setMounted(true), [])

  // Reserve the space so the header does not reflow when the theme resolves.
  if (!mounted) return <div className="size-8" aria-hidden />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      {...stick}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="grid size-8 place-items-center rounded-full border border-border transition-colors hover:border-foreground/40"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <motion.path
          d="M12 4 A8 8 0 0 0 12 20 Z"
          fill="currentColor"
          initial={{ opacity: isDark ? 1 : 0.15 }}
          animate={{ opacity: isDark ? 1 : 0.15 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </button>
  )
}
