"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ASCII Art icons - minimal and clean
const VINYL_ASCII = `  ╭───────╮
 ╱ ╭───╮ ╲
│ │ ● │ │
 ╲ ╰───╯ ╱
  ╰───────╯`

const BOOK_ASCII = `  ┌─────┐
  │░░░░░│
  │─────│
  │░░░░░│
  └─────┘`

const GEM_ASCII = `    ◆
   ╱ ╲
  ╱   ╲
  ╲   ╱
   ╲ ╱
    ◆`

const INSTA_ASCII = `  ┌─────┐
  │┌───┐│
  ││ ○ ││
  │└───┘│
  └─────┘`

const LINKEDIN_ASCII = `  ┌─────┐
  │ in  │
  │ ─── │
  │ ─── │
  └─────┘`

interface MenuItem {
  id: string
  label: string
  ascii: string
  href?: string
  modalType?: "vinyl" | "books" | "movies"
}

const MENU_ITEMS: MenuItem[] = [
  { id: "vinyl", label: "Music", ascii: VINYL_ASCII, modalType: "vinyl" },
  { id: "books", label: "Books", ascii: BOOK_ASCII, modalType: "books" },
  { id: "movies", label: "Movies", ascii: GEM_ASCII, modalType: "movies" },
  { id: "instagram", label: "Instagram", ascii: INSTA_ASCII, href: "https://www.instagram.com/faheemmmm._" },
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
  const [showModal, setShowModal] = useState<"vinyl" | "books" | "movies" | null>(null)
  const [rotation, setRotation] = useState(0)

  // Slow continuous rotation when expanded
  useEffect(() => {
    if (!isExpanded) return
    const interval = setInterval(() => {
      setRotation(r => r + 0.3)
    }, 50)
    return () => clearInterval(interval)
  }, [isExpanded])

  const handleItemClick = useCallback((item: MenuItem) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer")
    } else if (item.modalType) {
      setShowModal(item.modalType)
    }
  }, [])

  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(null)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const baseRadius = 80
  const expandedRadius = isExpanded ? baseRadius : 0
  const angleStep = (2 * Math.PI) / MENU_ITEMS.length

  return (
    <>
      <div
        className="relative w-48 h-48 flex items-center justify-center"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false)
          setActiveItem(null)
        }}
      >
        {/* Center ASCII torus/donut */}
        <motion.div
          className="absolute cursor-pointer interactive select-none"
          animate={{
            scale: isExpanded ? 0.8 : 1,
            opacity: isExpanded ? 0.5 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <pre
            className="text-[8px] leading-[8px] font-mono text-foreground whitespace-pre"
            style={{ fontFamily: "monospace" }}
          >
{`      ●●●●●
    ●●     ●●
   ●  ●●●●●  ●
  ●  ●     ●  ●
  ● ●   ●   ● ●
  ●  ●     ●  ●
   ●  ●●●●●  ●
    ●●     ●●
      ●●●●●`}
          </pre>
        </motion.div>

        {/* Orbital ASCII items */}
        <AnimatePresence>
          {isExpanded && MENU_ITEMS.map((item, index) => {
            const angle = angleStep * index - Math.PI / 2 + (rotation * Math.PI / 180)
            const x = Math.cos(angle) * expandedRadius
            const y = Math.sin(angle) * expandedRadius

            return (
              <motion.div
                key={item.id}
                className="absolute cursor-pointer interactive"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ 
                  x, 
                  y, 
                  opacity: 1, 
                  scale: activeItem === item.id ? 1.2 : 1 
                }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.04,
                }}
                onMouseEnter={() => setActiveItem(item.id)}
                onMouseLeave={() => setActiveItem(null)}
                onClick={() => handleItemClick(item)}
              >
                <pre
                  className={`text-[5px] leading-[5px] font-mono whitespace-pre transition-colors duration-200 ${
                    activeItem === item.id ? 'text-foreground' : 'text-foreground/60'
                  }`}
                  style={{ fontFamily: "monospace" }}
                >
                  {item.ascii}
                </pre>

                {/* Label */}
                <AnimatePresence>
                  {activeItem === item.id && (
                    <motion.span
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-sans font-bold text-foreground/80 whitespace-nowrap"
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowModal(null)}
          >
            <motion.div
              className="bg-background/95 border border-border/50 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl backdrop-blur-xl"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                <h3 className="text-sm font-sans font-bold tracking-tight">
                  {showModal === "vinyl" && "What Faheem is listening to"}
                  {showModal === "books" && "Recent Reads"}
                  {showModal === "movies" && "Favorite Films"}
                </h3>
                <button
                  onClick={() => setShowModal(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors interactive text-lg leading-none"
                >
                  x
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-1">
                {showModal === "vinyl" &&
                  SONGS.map((song, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-2.5 hover:bg-muted/30 rounded-lg transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="text-xs text-muted-foreground/60 w-4 font-mono">{i + 1}</span>
                      <div>
                        <p className="text-sm font-sans font-bold">{song.title}</p>
                        <p className="text-xs text-muted-foreground">{song.artist}</p>
                      </div>
                    </motion.div>
                  ))}

                {showModal === "books" &&
                  BOOKS.map((book, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-2.5 hover:bg-muted/30 rounded-lg transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="text-xs text-muted-foreground/60 w-4 font-mono">{i + 1}</span>
                      <div>
                        <p className="text-sm font-sans font-bold">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </div>
                    </motion.div>
                  ))}

                {showModal === "movies" &&
                  MOVIES.map((movie, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-2.5 hover:bg-muted/30 rounded-lg transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="text-xs text-muted-foreground/60 w-4 font-mono">{i + 1}</span>
                      <div>
                        <p className="text-sm font-sans font-bold">{movie.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {movie.director} ({movie.year})
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
