'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { useScrollLock } from '@/lib/motion/scroll-lock'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Backdrop, centring, focus and scroll behaviour for both modals.
 *
 * The portal is load-bearing. Rendered in place these sit inside [data-torus],
 * and a transformed ancestor becomes the containing block for position: fixed,
 * so inset-0 would resolve to the torus box rather than to the viewport.
 */
export default function ModalShell({
  label,
  onClose,
  panelClassName = '',
  panelStyle,
  children,
}: {
  label: string
  onClose: () => void
  panelClassName?: string
  panelStyle?: React.CSSProperties
  children: React.ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useScrollLock(true)

  useEffect(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      restoreFocus.current?.focus?.()
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`relative outline-none will-change-transform ${panelClassName}`}
        style={panelStyle}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  )
}
