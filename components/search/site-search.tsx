'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
// From search-match, not search: the latter reads the notes tree off disk.
import { searchDocs, type SearchDoc, type SearchSection } from '@/lib/search-match'
import { useScrollLock } from '@/lib/motion/scroll-lock'

/**
 * Search across the whole site: notes and their sections, research entries,
 * thoughts, and the pages themselves.
 *
 * Hand-rolled rather than built on cmdk, which this replaces. Once the scorer,
 * the styling and the Escape handling all had to be overridden, the library was
 * only supplying a list box. Matching lives in lib/search.ts.
 */

const SECTION_ORDER: SearchSection[] = ['Notes', 'Research', 'Thoughts', 'Pages']

/** With an empty field, show the pages rather than an empty box. */
function defaultResults(docs: SearchDoc[]) {
  return docs.filter(doc => doc.section === 'Pages')
}

export default function SiteSearch({ docs }: { docs: SearchDoc[] }) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => setMounted(true), [])
  useScrollLock(open)

  const results = useMemo(
    () => (query.trim() ? searchDocs(docs, query) : defaultResults(docs)),
    [docs, query],
  )

  // Flat for the keyboard, grouped for the eye. Sections appear in a fixed
  // order, but only if the query put something in them.
  const groups = useMemo(() => {
    const bySection = new Map<SearchSection, SearchDoc[]>()
    for (const doc of results) {
      const list = bySection.get(doc.section)
      if (list) list.push(doc)
      else bySection.set(doc.section, [doc])
    }
    return SECTION_ORDER.filter(section => bySection.has(section)).map(section => ({
      section,
      items: bySection.get(section)!,
    }))
  }, [results])

  // Order the arrow keys walk. Has to match the render order, which is grouped,
  // not the raw score order.
  const flat = useMemo(() => groups.flatMap(group => group.items), [groups])

  useEffect(() => setActive(0), [query])

  const close = useCallback(() => setOpen(false), [])

  const go = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router],
  )

  // Opening: the shortcut, the "/" key, and the header button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable === true

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(v => !v)
        return
      }
      // "/" is the other convention for this, but only when it would not
      // otherwise be a character someone is trying to type.
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setOpen(true)
      }
    }

    const onOpen = () => setOpen(true)
    document.addEventListener('keydown', onKey)
    window.addEventListener('open-site-search', onOpen)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('open-site-search', onOpen)
    }
  }, [])

  // Focus in on open, back to the trigger on close.
  useEffect(() => {
    if (open) {
      restoreFocus.current = document.activeElement as HTMLElement | null
      // After the mount, or there is nothing to focus yet.
      const id = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
    restoreFocus.current?.focus?.()
    restoreFocus.current = null
    // Reset only after the exit animation, so the list does not visibly empty.
    const t = setTimeout(() => setQuery(''), 220)
    return () => clearTimeout(t)
  }, [open])

  // Keep the highlighted row in view when the arrows walk past the fold.
  useEffect(() => {
    if (!open) return
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const onFieldKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => (flat.length ? (i + 1) % flat.length : 0))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => (flat.length ? (i - 1 + flat.length) % flat.length : 0))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const doc = flat[active]
      if (doc) go(doc.href)
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="plate relative w-full max-w-xl overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-border px-5">
              <span className="caption">Search</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onFieldKey}
                placeholder="Notes, research, thoughts, pages…"
                aria-label="Search the site"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent py-4 text-[0.9375rem] outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="caption rounded border border-border px-1.5 py-0.5">esc</kbd>
            </div>

            <div
              ref={listRef}
              className="max-h-[52vh] overflow-y-auto overscroll-contain p-2"
            >
              {flat.length === 0 ? (
                <p className="px-3 py-8 text-center text-[0.9375rem] text-muted-foreground">
                  Nothing matches “{query}”.
                </p>
              ) : (
                groups.map(group => (
                  <div key={group.section}>
                    <p className="caption px-3 pb-1 pt-3">{group.section}</p>
                    {group.items.map(doc => {
                      const index = flat.indexOf(doc)
                      const isActive = index === active
                      return (
                        <button
                          key={doc.href}
                          type="button"
                          data-active={isActive}
                          onMouseMove={() => setActive(index)}
                          onClick={() => go(doc.href)}
                          className={`block w-full rounded-lg text-left ${
                            doc.nested
                              ? 'py-1.5 pl-7 pr-3 text-[0.875rem] text-muted-foreground'
                              : 'px-3 py-2.5'
                          } ${isActive ? 'bg-secondary text-foreground' : ''}`}
                        >
                          {doc.nested ? (
                            <span>
                              <span className="mr-2 opacity-40">§</span>
                              {doc.title}
                            </span>
                          ) : (
                            <>
                              <span className="block font-display text-[1.0625rem] leading-snug">
                                {doc.title}
                              </span>
                              {doc.context && (
                                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted-foreground">
                                  {doc.context}
                                </span>
                              )}
                            </>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
