'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { AnimatePresence, motion } from 'motion/react'

export type SearchEntry = {
  subject: string
  subjectTitle: string
  topic: string
  title: string
  summary: string
  headings: { text: string; id: string }[]
}

/**
 * Search across every note, reachable from anywhere with ⌘K.
 *
 * Indexes section headings as well as titles, so "Brewster" finds the section
 * inside Electromagnetic Waves rather than returning nothing. Matching is left to
 * cmdk's built-in scorer via each item's `value`.
 */
export default function NoteSearch({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(v => !v)
      }
      // This is a plain Command, not Command.Dialog, so Escape is ours to handle.
      if (e.key === 'Escape') setOpen(false)
    }
    // The header button opens it too. A window event keeps the two apart rather
    // than threading state through a provider for one boolean.
    const onOpen = () => setOpen(true)
    document.addEventListener('keydown', onKey)
    window.addEventListener('open-note-search', onOpen)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('open-note-search', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) return
    // Reset only after the exit animation, so the list does not visibly empty.
    const t = setTimeout(() => setQuery(''), 220)
    return () => clearTimeout(t)
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
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
            onClick={() => setOpen(false)}
          />

          <motion.div
            className="plate relative w-full max-w-xl overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Command
              label="Search notes"
              loop
              // cmdk's default scorer is fuzzy, which here matched "brewster"
              // against "Probability Distributions" and then selected it. People
              // searching notes type real words, so require every term to appear
              // and rank a prefix match above a mid-string one.
              filter={(value, search) => {
                const haystack = value.toLowerCase()
                const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean)
                if (!terms.length) return 1
                if (!terms.every(t => haystack.includes(t))) return 0
                return haystack.startsWith(terms[0]) ? 1 : 0.5
              }}
            >
              <div className="flex items-center gap-3 border-b border-border px-5">
                <span className="caption">Notes</span>
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search titles and sections…"
                  className="flex-1 bg-transparent py-4 text-[0.9375rem] outline-none placeholder:text-muted-foreground/60"
                />
                <kbd className="caption rounded border border-border px-1.5 py-0.5">esc</kbd>
              </div>

              <Command.List className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
                <Command.Empty className="px-3 py-8 text-center text-[0.9375rem] text-muted-foreground">
                  Nothing matches “{query}”.
                </Command.Empty>

                {entries.map(entry => (
                  <Command.Group
                    key={`${entry.subject}/${entry.topic}`}
                    // A plain string, not JSX: cmdk scores and orders groups by
                    // their heading, and a React element breaks that ordering.
                    // Styled via [cmdk-group-heading] in globals.css.
                    heading={entry.subjectTitle}
                  >
                    <Command.Item
                      value={`${entry.title} ${entry.summary} ${entry.subjectTitle}`}
                      onSelect={() => go(`/notes/${entry.subject}/${entry.topic}`)}
                      className="cursor-pointer rounded-lg px-3 py-2.5 data-[selected=true]:bg-secondary"
                    >
                      <span className="block font-display text-[1.0625rem] leading-snug">
                        {entry.title}
                      </span>
                      {entry.summary && (
                        <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted-foreground">
                          {entry.summary}
                        </span>
                      )}
                    </Command.Item>

                    {entry.headings.map(h => (
                      <Command.Item
                        key={h.id}
                        // Deliberately excludes the parent note's title. Including
                        // it meant searching "entropy" surfaced every section of
                        // "Entropy, Properly", most of which were about something
                        // else. A section should match on its own words.
                        value={h.text}
                        onSelect={() => go(`/notes/${entry.subject}/${entry.topic}#${h.id}`)}
                        className="cursor-pointer rounded-lg py-1.5 pl-7 pr-3 text-[0.875rem] text-muted-foreground data-[selected=true]:bg-secondary data-[selected=true]:text-foreground"
                      >
                        <span className="mr-2 opacity-40">§</span>
                        {h.text}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
