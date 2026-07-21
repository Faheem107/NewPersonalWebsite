'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import ThemeToggle from '@/components/theme-toggle'
import { useStick } from '@/lib/motion/pointer'

const NAV = [
  { label: 'research', href: '/research' },
  { label: 'photography & films', href: '/photography' },
  { label: 'some thoughts!', href: '/thoughts' },
  { label: 'notes', href: '/notes' },
  { label: 'about', href: '/about' },
]

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname()
  const stick = useStick()
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      {...stick}
      href={href}
      prefetch
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      data-active={active}
      className="wght-link text-[0.9375rem] tracking-tight"
    >
      {label}
    </Link>
  )
}

/** Shows the shortcut rather than a magnifier, so the key combination is learnable. */
function SearchButton() {
  const [mac, setMac] = useState(true)
  const stick = useStick()

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent))
  }, [])

  return (
    <button
      {...stick}
      onClick={() => window.dispatchEvent(new Event('open-note-search'))}
      aria-label="Search notes"
      className="caption rounded-full border border-border px-2.5 py-1 transition-colors hover:border-foreground/40 hover:text-foreground"
    >
      {mac ? '⌘' : 'Ctrl '}K
    </button>
  )
}

export default function SiteChrome() {
  const [visible, setVisible] = useState(true)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', current => {
    if (open) return
    if (current < 24) setVisible(true)
    else setVisible(current < lastY.current)
    lastY.current = current
  })

  // A full-screen overlay has to trap the page behind it and answer Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 px-6 py-5 md:px-10 md:py-7"
        animate={{ y: visible ? 0 : -96, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/"
          className="font-display text-lg leading-none tracking-tight wght-head"
          style={{ fontVariationSettings: "'wght' 600" }}
        >
          faheem.
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NAV.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
          <SearchButton />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="caption relative z-[70] py-1"
          >
            {open ? 'close' : 'menu'}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(140% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav
              aria-label="Primary"
              className="flex h-full flex-col justify-center gap-6 px-8"
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl tracking-tight"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
