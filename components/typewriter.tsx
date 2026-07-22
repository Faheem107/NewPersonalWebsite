'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Typewriters.
 *
 * Both of these drive a `useState` per keystroke, which an earlier version of
 * the hero was deliberately moved away from. It is affordable here only because
 * the strings are one short word and the elements are leaves: a re-render of a
 * single span costs nothing. Do not extend this to anything with children.
 *
 * The caret is CSS, so it blinks without involving React at all.
 */

const CARET = (
  <span
    aria-hidden
    className="ml-[0.06em] inline-block w-[0.06em] translate-y-[0.06em] self-center bg-current align-baseline"
    style={{ height: '0.78em', animation: 'caret 1.05s steps(1) infinite' }}
  />
)

/** Types a string once, then stops. The caret leaves when it is done. */
export function TypeOnce({
  text,
  speed = 105,
  delay = 200,
  className = '',
  onDone,
}: {
  text: string
  speed?: number
  delay?: number
  className?: string
  onDone?: () => void
}) {
  const [n, setN] = useState(0)
  const [running, setRunning] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(text.length)
      done.current = true
      onDone?.()
      return
    }

    const start = setTimeout(() => setRunning(true), delay)
    return () => clearTimeout(start)
    // onDone is called once and intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay])

  useEffect(() => {
    if (!running || done.current) return
    if (n >= text.length) {
      done.current = true
      onDone?.()
      return
    }
    const t = setTimeout(() => setN(v => v + 1), speed)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, n, text, speed])

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {/* The full string is present for assistive tech and for search engines,
          which should not have to wait on an animation to read a name. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>{text.slice(0, n)}</span>
      {!done.current && n < text.length && CARET}
    </span>
  )
}

type Phase = 'typing' | 'holding' | 'deleting'

/** Types each word, holds it, deletes it, moves on. Loops. */
export function TypeCycle({
  words,
  speed = 88,
  deleteSpeed = 44,
  hold = 1500,
  startDelay = 0,
  className = '',
}: {
  words: string[]
  speed?: number
  deleteSpeed?: number
  hold?: number
  startDelay?: number
  className?: string
}) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')
  const [started, setStarted] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      setN(words[0].length)
      return
    }
    const t = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(t)
  }, [startDelay, words])

  useEffect(() => {
    if (!started || reduced) return
    const word = words[i]

    if (phase === 'typing') {
      if (n < word.length) {
        const t = setTimeout(() => setN(v => v + 1), speed)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('holding'), 0)
      return () => clearTimeout(t)
    }

    if (phase === 'holding') {
      const t = setTimeout(() => setPhase('deleting'), hold)
      return () => clearTimeout(t)
    }

    if (n > 0) {
      const t = setTimeout(() => setN(v => v - 1), deleteSpeed)
      return () => clearTimeout(t)
    }
    setI(v => (v + 1) % words.length)
    setPhase('typing')
  }, [started, reduced, phase, n, i, words, speed, deleteSpeed, hold])

  // Reserve the longest word's width so the line never reflows mid-cycle.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className={`relative inline-grid ${className}`}>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {longest}
      </span>
      <span className="col-start-1 row-start-1 inline-flex items-baseline md:justify-end">
        <span className="sr-only">{words.join(', ')}</span>
        <span aria-hidden>{words[i].slice(0, n)}</span>
        {!reduced && CARET}
      </span>
    </span>
  )
}
