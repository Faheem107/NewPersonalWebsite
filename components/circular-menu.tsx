"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

// ASCII Art representations
const VINYL_ASCII = `
    ╭──────────╮
   ╱  ╭────╮   ╲
  │  ╱ ╭──╮ ╲   │
  │ │  │▪▪│  │  │
  │  ╲ ╰──╯ ╱   │
   ╲  ╰────╯   ╱
    ╰──────────╯
`

const BOOK_ASCII = `
   ┌─────────┐
   │ ═══════ │
   │ ─────── │
   │ ═══════ │
   │ ─────── │
   │ ═══════ │
   └─────────┘
`

const LAPIS_ASCII = `
      ◆
     ╱ ╲
    ╱   ╲
   ╱  ◇  ╲
   ╲     ╱
    ╲   ╱
     ╲ ╱
      ◆
`

const INSTAGRAM_ASCII = `
   ┌───────┐
   │ ┌───┐ │
   │ │ ◉ │ │
   │ └───┘ │
   └───────┘
`

const LINKEDIN_ASCII = `
   ┌───────┐
   │ in    │
   │ ───── │
   │ ───── │
   └───────┘
`

interface MenuItemData {
  id: string
  label: string
  ascii: string
  href?: string
  action?: () => void
}

const MENU_ITEMS: MenuItemData[] = [
  { id: "vinyl", label: "Music", ascii: VINYL_ASCII, action: () => {} },
  { id: "books", label: "Books", ascii: BOOK_ASCII, action: () => {} },
  { id: "movies", label: "Movies", ascii: LAPIS_ASCII, action: () => {} },
  { id: "instagram", label: "Instagram", ascii: INSTAGRAM_ASCII, href: "https://www.instagram.com/faheemmmm._" },
  { id: "linkedin", label: "LinkedIn", ascii: LINKEDIN_ASCII, href: "https://www.linkedin.com/in/mohammed-faheem-33bb49295/" },
]

const SONGS = [
  { title: "Resonance", artist: "HOME" },
  { title: "Midnight City", artist: "M83" },
  { title: "Tadow", artist: "Masego & FKJ" },
  { title: "Redbone", artist: "Childish Gambino" },
  { title: "Pink + White", artist: "Frank Ocean" },
]

const BOOKS = [
  { title: "The Feynman Lectures on Physics", author: "Richard Feynman" },
  { title: "The Elegant Universe", author: "Brian Greene" },
  { title: "Sculpting in Time", author: "Andrei Tarkovsky" },
  { title: "Godel, Escher, Bach", author: "Douglas Hofstadter" },
  { title: "Seven Brief Lessons on Physics", author: "Carlo Rovelli" },
]

const MOVIES = [
  { title: "Stalker", director: "Andrei Tarkovsky", year: "1979" },
  { title: "2001: A Space Odyssey", director: "Stanley Kubrick", year: "1968" },
  { title: "In the Mood for Love", director: "Wong Kar-wai", year: "2000" },
  { title: "Interstellar", director: "Christopher Nolan", year: "2014" },
  { title: "Chungking Express", director: "Wong Kar-wai", year: "1994" },
]

export default function CircularMenu() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [showModal, setShowModal] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleItemClick = (item: MenuItemData) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer")
    } else if (item.id === "vinyl" || item.id === "books" || item.id === "movies") {
      setShowModal(item.id)
    }
  }

  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(null)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const radius = isExpanded ? 100 : 0
  const angleStep = (2 * Math.PI) / MENU_ITEMS.length

  return (
    <>
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false)
          setActiveItem(null)
        }}
      >
        {/* Center dot */}
        <motion.div
          className="w-4 h-4 rounded-full bg-foreground/30 cursor-pointer interactive"
          animate={{
            scale: isExpanded ? 1.5 : 1,
            backgroundColor: isExpanded ? "var(--foreground)" : "rgba(var(--foreground), 0.3)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Orbital items */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {MENU_ITEMS.map((item, index) => {
                const angle = angleStep * index - Math.PI / 2 // Start from top
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                  <motion.div
                    key={item.id}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer interactive"
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{ x, y, opacity: 1, scale: 1 }}
                    exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: index * 0.05,
                    }}
                    onMouseEnter={() => setActiveItem(item.id)}
                    onMouseLeave={() => setActiveItem(null)}
                    onClick={() => handleItemClick(item)}
                  >
                    <motion.div
                      className="flex items-center justify-center"
                      animate={{
                        scale: activeItem === item.id ? 1.3 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <pre
                        className="text-[6px] leading-[6px] font-mono text-foreground/70 hover:text-foreground transition-colors whitespace-pre select-none"
                        style={{ fontFamily: "monospace" }}
                      >
                        {item.ascii}
                      </pre>
                    </motion.div>

                    {/* Label on hover */}
                    <AnimatePresence>
                      {activeItem === item.id && (
                        <motion.span
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-sans text-foreground/60 whitespace-nowrap"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(null)}
          >
            <motion.div
              className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif" }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <h3 className="text-sm font-bold">
                  {showModal === "vinyl" && "What Faheem is listening to"}
                  {showModal === "books" && "Recent Reads"}
                  {showModal === "movies" && "Favorite Films"}
                </h3>
                <button
                  onClick={() => setShowModal(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors interactive"
                >
                  x
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-2">
                {showModal === "vinyl" &&
                  SONGS.map((song, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded transition-colors"
                    >
                      <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                      <div>
                        <p className="text-sm font-medium">{song.title}</p>
                        <p className="text-xs text-muted-foreground">{song.artist}</p>
                      </div>
                    </div>
                  ))}

                {showModal === "books" &&
                  BOOKS.map((book, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded transition-colors"
                    >
                      <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                      <div>
                        <p className="text-sm font-medium">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </div>
                    </div>
                  ))}

                {showModal === "movies" &&
                  MOVIES.map((movie, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded transition-colors"
                    >
                      <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                      <div>
                        <p className="text-sm font-medium">{movie.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {movie.director} ({movie.year})
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
