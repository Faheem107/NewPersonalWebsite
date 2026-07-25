'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { GLOSSARY } from '@/content/glossary'
import { useHighlight } from '@/lib/motion/pointer'

/**
 * A term that explains itself.
 *
 * Three decisions worth keeping:
 *
 *  - **The trigger is a span, not a button.** A button is inline-block, and an
 *    inline-block "University of Oxford" cannot break across lines, so a term
 *    landing near the end of a measure forces an early wrap. The site has been
 *    bitten by exactly this before, with SplitText tearing headings. A span
 *    with role="button" wraps like the prose it sits in, and the keyboard
 *    handling a button would have given for free is written out below.
 *
 *  - **The box is absolute, not fixed.** The research page puts GSAP transforms
 *    on [data-reveal] while it animates, and a transformed ancestor becomes the
 *    containing block for fixed positioning: that is the documented trap that
 *    pinned the torus modals above the torus. Absolute against a wrapper this
 *    component owns cannot hit it, and needs no portal.
 *
 *  - **It clamps horizontally.** html and body carry overflow-x: hidden as a
 *    backstop, so a box overhanging the right edge is cut rather than scrolled
 *    to. The shift is measured once per open.
 *
 * Hover opens it where there is a real pointer, tap where there is not, and
 * focus in both cases. Only one is open at a time.
 */

/** Fired by whichever gloss is opening, so the others close. */
const CLAIM = 'gloss-claim'

export default function Gloss({
  entryKey,
  children,
}: {
  entryKey: string
  children: React.ReactNode
}) {
  const entry = GLOSSARY[entryKey]
  const id = useId()

  const [open, setOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const [above, setAbove] = useState(false)

  const wrapRef = useRef<HTMLSpanElement>(null)
  const boxRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const highlight = useHighlight()

  const clearTimers = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (openTimer.current) clearTimeout(openTimer.current)
  }

  const show = useCallback(() => {
    clearTimers()
    window.dispatchEvent(new CustomEvent(CLAIM, { detail: id }))
    setOpen(true)
  }, [id])

  const hide = useCallback(() => {
    clearTimers()
    setOpen(false)
  }, [])

  // Only one box at a time, or a column of prose ends up papered over.
  useEffect(() => {
    const onClaim = (e: Event) => {
      if ((e as CustomEvent).detail !== id) setOpen(false)
    }
    window.addEventListener(CLAIM, onClaim)
    return () => window.removeEventListener(CLAIM, onClaim)
  }, [id])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide()
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) hide()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, hide])

  useEffect(() => clearTimers, [])

  // Measured before paint, so the box never appears off-edge and then jumps.
  useLayoutEffect(() => {
    if (!open) {
      setShift(0)
      setAbove(false)
      return
    }
    const box = boxRef.current
    if (!box) return

    const pad = 12
    const r = box.getBoundingClientRect()

    let dx = 0
    if (r.right > window.innerWidth - pad) dx = window.innerWidth - pad - r.right
    else if (r.left < pad) dx = pad - r.left
    setShift(dx)

    // Flip up only when below genuinely does not fit and above does.
    const anchor = wrapRef.current?.getBoundingClientRect()
    if (anchor) {
      const roomBelow = window.innerHeight - anchor.bottom
      const roomAbove = anchor.top
      setAbove(roomBelow < r.height + pad && roomAbove > roomBelow)
    }
  }, [open])

  // An unknown key should be loud in development and invisible in production,
  // never a crash and never a bracket left in the prose.
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[gloss] no glossary entry for "${entryKey}"`)
    }
    return <>{children}</>
  }

  const onEnter = () => {
    // Hover intent. Without the delay, dragging the pointer across a paragraph
    // flickers a box open at every term on the way past.
    if (window.matchMedia('(hover: none)').matches) return
    clearTimers()
    openTimer.current = setTimeout(show, 120)
  }

  const onLeave = () => {
    if (window.matchMedia('(hover: none)').matches) return
    clearTimers()
    // Long enough to let the pointer travel from the word into the box.
    closeTimer.current = setTimeout(hide, 220)
  }

  return (
    <span
      ref={wrapRef}
      className="gloss"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span
        {...highlight}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        className="gloss-term"
        onClick={() => (open ? hide() : show())}
        onFocus={show}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            open ? hide() : show()
          }
        }}
      >
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.span
            ref={boxRef}
            id={id}
            role="tooltip"
            // The clamp goes through motion's own x, not a transform in
            // `style`. motion writes `transform` to animate y, so a transform
            // set alongside it is overwritten on the first frame and the box
            // silently un-clamps itself back over the edge of the screen.
            initial={{ opacity: 0, y: above ? 4 : -4, x: shift }}
            animate={{ opacity: 1, y: 0, x: shift }}
            exit={{ opacity: 0, y: above ? 4 : -4, x: shift }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`plate-solid gloss-box absolute left-0 z-[80] block w-[min(19rem,calc(100vw-2rem))] cursor-auto p-4 ${
              above ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <span className="caption block">{entry.term}</span>
            <span className="mt-2 block text-[0.9375rem] leading-relaxed text-muted-foreground">
              {entry.short}
            </span>

            {(entry.href || entry.see) && (
              <span className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
                {entry.href && (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rule-link wght-link text-[0.875rem]"
                  >
                    {entry.hrefLabel ?? 'The source'} ↗
                  </a>
                )}
                {entry.see && (
                  <Link
                    href={entry.see.href}
                    prefetch
                    onClick={hide}
                    className="rule-link wght-link text-[0.875rem]"
                  >
                    {entry.see.label} →
                  </Link>
                )}
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
