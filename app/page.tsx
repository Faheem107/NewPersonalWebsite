'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import CircularMenu from '@/components/circular-menu'
import Magnetic from '@/components/magnetic'
import { TypeOnce, TypeCycle } from '@/components/typewriter'
import { useStick } from '@/lib/motion/pointer'

const DISCIPLINES = ['Physics.', 'Film.', 'Mathematics.']

/** Roughly when the name finishes typing, so the disciplines follow it. */
const NAME_DONE = 200 + 'Faheem'.length * 105

export default function Home() {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLElement>(null)
  const stick = useStick()

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(SplitText)

    // One timeline for the whole entrance. The page this replaces ran six
    // independent transitions with hand-tuned delays, which is why nothing
    // quite landed together.
    // The name and the disciplines type themselves now, so the timeline no
    // longer touches them: animating opacity underneath a typewriter fights it.
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('[data-torus]', { opacity: 0, scale: 0.9, duration: 1.4 })
        .from('[data-role]', { opacity: 0, y: 10, duration: 0.6 }, NAME_DONE / 1000 + 0.4)
        .from('[data-explore]', { opacity: 0, duration: 0.6 }, '-=0.3')
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={root} className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center px-6 pb-16 pt-28 md:px-12 md:pb-0 md:pt-0 lg:px-20">
        {/* Stacks below md. The previous hero was a hard grid-cols-2 with no
            breakpoint, so the torus ran off the left edge of every phone. */}
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-8">
          <div
            data-torus
            className="flex select-none items-center justify-center [&>*]:max-w-full"
          >
            <CircularMenu forceOpen={open} />
          </div>

          <div className="flex flex-col items-center text-center md:items-end md:text-right">
            {/* The one place Inter is used. Everything else is Lexend. */}
            <h1
              data-name
              className="name pb-2 text-[length:var(--text-display)] leading-[0.94]"
            >
              <TypeOnce text="Faheem" />
            </h1>

            <p
              data-discipline
              className="mt-1 font-display text-[clamp(1.5rem,3.6vw,2.75rem)] leading-none text-muted-foreground"
            >
              <TypeCycle words={DISCIPLINES} startDelay={NAME_DONE + 320} />
            </p>

            <p data-role className="caption mt-7">
              Physics at NYU Abu Dhabi
            </p>

            <Magnetic>
              <button
                {...stick}
                data-explore
                onClick={() => setOpen(v => !v)}
                aria-pressed={open}
                className="caption mt-9 py-2 transition-colors hover:text-foreground"
              >
                {open ? 'collapse' : 'explore'}
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </main>
  )
}
