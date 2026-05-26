"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Linkedin, Instagram } from "lucide-react"
import dynamic from "next/dynamic"
import { Canvas } from "@react-three/fiber"
import { TorusShader } from "@/components/torus-shader"

// ASCII art for personal items
const VINYL_ASCII = `  ( (
 ) )
(( ))
  ||
  ||`

const BOOK_ASCII = `[======]
|      |
|      |
|      |
[======]`

const GEM_ASCII = `  /\\
 /  \\
/ -- \\
\\    /
 \\  /
  \\/`

interface MenuItem {
  id: string
  label: string
  type: "ascii" | "lucide"
  ascii?: string
  icon?: React.ReactNode
  href?: string
  modalType?: "vinyl" | "books" | "movies"
}

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
  const [angle, setAngle] = useState(0)

  const MENU_ITEMS: MenuItem[] = [
    {
      id: "vinyl",
      label: "Music",
      type: "ascii",
      ascii: VINYL_ASCII,
      modalType: "vinyl",
    },
    {
      id: "books",
      label: "Books",
      type: "ascii",
      ascii: BOOK_ASCII,
      modalType: "books",
    },
    {
      id: "movies",
      label: "Films",
      type: "ascii",
      ascii: GEM_ASCII,
      modalType: "movies",
    },
    {
      id: "instagram",
      label: "Instagram",
      type: "lucide",
      icon: <Instagram size={18} strokeWidth={1.5} />,
      href: "https://www.instagram.com/faheemmmm._",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      type: "lucide",
      icon: <Linkedin size={18} strokeWidth={1.5} />,
      href: "https://www.linkedin.com/in/mohammed-faheem-33bb49295/",
    },
  ]

  // Slow orbital rotation when open
  useEffect(() => {
    if (!isExpanded) return
    const id = setInterval(() => setAngle((a) => a + 0.25), 50)
    return () => clearInterval(id)
  }, [isExpanded])

  const handleClick = useCallback((item: MenuItem) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer")
    } else if (item.modalType) {
      setShowModal(item.modalType)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowModal(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const RADIUS = 88
  const N = MENU_ITEMS.length
  const angleStep = (2 * Math.PI) / N

  return (
    <>
      <div
        className="relative flex items-center justify-center"
        style={{ width: 240, height: 240 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => { setIsExpanded(false); setActiveItem(null) }}
      >
        {/* WebGL torus shader center */}
        <motion.div
          className="rounded-full overflow-hidden"
          animate={{ scale: isExpanded ? 0.72 : 1, opacity: isExpanded ? 0.85 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          style={{ width: 120, height: 120 }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent", width: "100%", height: "100%" }}
          >
            <TorusShader />
          </Canvas>
        </motion.div>

        {/* Orbital items */}
        <AnimatePresence>
          {isExpanded && MENU_ITEMS.map((item, i) => {
            const theta = angleStep * i - Math.PI / 2 + (angle * Math.PI / 180)
            const ox = Math.cos(theta) * RADIUS
            const oy = Math.sin(theta) * RADIUS
            const isActive = activeItem === item.id

            return (
              <motion.button
                key={item.id}
                className="absolute flex flex-col items-center gap-0.5 interactive cursor-pointer"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                animate={{ x: ox, y: oy, opacity: 1, scale: isActive ? 1.25 : 1 }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                transition={{ type: "spring", stiffness: 340, damping: 26, delay: i * 0.04 }}
                onMouseEnter={() => setActiveItem(item.id)}
                onMouseLeave={() => setActiveItem(null)}
                onClick={() => handleClick(item)}
                style={{ transform: `translate(${ox}px, ${oy}px)` }}
              >
                {item.type === "ascii" ? (
                  <pre
                    className={`text-[7px] leading-[9px] font-mono whitespace-pre select-none transition-colors duration-150 ${
                      isActive ? "text-foreground" : "text-foreground/50"
                    }`}
                  >
                    {item.ascii}
                  </pre>
                ) : (
                  <span className={`transition-colors duration-150 ${isActive ? "text-foreground" : "text-foreground/50"}`}>
                    {item.icon}
                  </span>
                )}

                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      className="absolute -bottom-5 text-[9px] font-sans font-bold text-foreground/80 whitespace-nowrap tracking-wide"
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      transition={{ duration: 0.12 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(null)}
          >
            <motion.div
              className="bg-background border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <h3 className="text-sm font-sans font-bold tracking-tight">
                  {showModal === "vinyl" && "Listening to"}
                  {showModal === "books" && "Reading"}
                  {showModal === "movies" && "Favourite Films"}
                </h3>
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors interactive text-base leading-none"
                  onClick={() => setShowModal(null)}
                >
                  ×
                </button>
              </div>

              <div className="space-y-0.5">
                {showModal === "vinyl" && SONGS.map((s, i) => (
                  <motion.div key={i} className="flex items-center gap-3 px-2 py-2 hover:bg-muted/40 rounded-lg"
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <span className="text-xs text-muted-foreground/50 font-mono w-4">{i + 1}</span>
                    <div>
                      <p className="text-sm font-sans font-bold leading-tight">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.artist}</p>
                    </div>
                  </motion.div>
                ))}
                {showModal === "books" && BOOKS.map((b, i) => (
                  <motion.div key={i} className="flex items-center gap-3 px-2 py-2 hover:bg-muted/40 rounded-lg"
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <span className="text-xs text-muted-foreground/50 font-mono w-4">{i + 1}</span>
                    <div>
                      <p className="text-sm font-sans font-bold leading-tight">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.author}</p>
                    </div>
                  </motion.div>
                ))}
                {showModal === "movies" && MOVIES.map((m, i) => (
                  <motion.div key={i} className="flex items-center gap-3 px-2 py-2 hover:bg-muted/40 rounded-lg"
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <span className="text-xs text-muted-foreground/50 font-mono w-4">{i + 1}</span>
                    <div>
                      <p className="text-sm font-sans font-bold leading-tight">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.director} · {m.year}</p>
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
