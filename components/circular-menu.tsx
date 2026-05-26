"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Linkedin, Instagram } from "lucide-react"
import Image from "next/image"
import { Canvas } from "@react-three/fiber"
import { TorusShader } from "@/components/torus-shader"

// ─── Data ────────────────────────────────────────────────────────────────────

const SONGS = [
  { title: "Resonance",         artist: "HOME" },
  { title: "Midnight City",     artist: "M83" },
  { title: "Tadow",             artist: "Masego & FKJ" },
  { title: "Redbone",           artist: "Childish Gambino" },
  { title: "Pink + White",      artist: "Frank Ocean" },
]

const BOOKS = [
  { title: "The Feynman Lectures on Physics", author: "Richard Feynman" },
  { title: "The Elegant Universe",            author: "Brian Greene" },
  { title: "Sculpting in Time",               author: "Andrei Tarkovsky" },
  { title: "Godel, Escher, Bach",             author: "Douglas Hofstadter" },
  { title: "Seven Brief Lessons on Physics",  author: "Carlo Rovelli" },
]

const MOVIES = [
  { title: "Stalker",               director: "Andrei Tarkovsky", year: "1979" },
  { title: "2001: A Space Odyssey", director: "Stanley Kubrick",  year: "1968" },
  { title: "In the Mood for Love",  director: "Wong Kar-wai",     year: "2000" },
  { title: "Interstellar",          director: "Christopher Nolan",year: "2014" },
  { title: "Chungking Express",     director: "Wong Kar-wai",     year: "1994" },
]

// ─── Orbit item config ────────────────────────────────────────────────────────

interface MenuItem {
  id:         string
  label:      string
  kind:       "img" | "icon"
  imgSrc?:    string
  icon?:      React.ReactNode
  href?:      string
  modal?:     "vinyl" | "books" | "movies"
}

const MENU_ITEMS: MenuItem[] = [
  {
    id:     "vinyl",
    label:  "Music",
    kind:   "img",
    imgSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vinyl_ascii_pic-NlO1G6fmcEEbXHk00IXFpvYhFgsT36.png",
    modal:  "vinyl",
  },
  {
    id:     "books",
    label:  "Books",
    kind:   "img",
    imgSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/book_ascii-sd9oEY0u9yK3qLoWrZZaamnoiXSGJO.png",
    modal:  "books",
  },
  {
    id:     "movies",
    label:  "Films",
    kind:   "img",
    imgSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/movie_ascii_pic-ucWwLQQzdgiB0vupll4pQPc6fdrB9L.png",
    modal:  "movies",
  },
  {
    id:   "instagram",
    label:"Instagram",
    kind: "icon",
    icon: <Instagram size={20} strokeWidth={1.5} />,
    href: "https://www.instagram.com/faheemmmm._",
  },
  {
    id:   "linkedin",
    label:"LinkedIn",
    kind: "icon",
    icon: <Linkedin size={20} strokeWidth={1.5} />,
    href: "https://www.linkedin.com/in/mohammed-faheem-33bb49295/",
  },
]

// ─── Windows 95 vinyl modal ───────────────────────────────────────────────────

function Win95Modal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1,    opacity: 1, y: 0 }}
        exit={{   scale: 0.94, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background:  "#c0c0c0",
          border:      "2px solid",
          borderColor: "#ffffff #808080 #808080 #ffffff",
          boxShadow:   "inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #707070",
          fontFamily:  '"MS Sans Serif", "Pixelated MS Sans Serif", Arial, sans-serif',
          minWidth:    320,
          maxWidth:    380,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background:  "linear-gradient(90deg,#000080,#1084d0)",
            color:       "#fff",
            padding:     "3px 6px",
            display:     "flex",
            alignItems:  "center",
            justifyContent: "space-between",
            fontSize:    11,
            fontWeight:  700,
            letterSpacing: 0.3,
          }}
        >
          <span>Winamp — Now Playing</span>
          <div style={{ display: "flex", gap: 2 }}>
            {["_", "□", "×"].map((c) => (
              <button
                key={c}
                onClick={c === "×" ? onClose : undefined}
                style={{
                  background:  "#c0c0c0",
                  border:      "2px solid",
                  borderColor: "#ffffff #808080 #808080 #ffffff",
                  color:       "#000",
                  width:       16,
                  height:      14,
                  fontSize:    9,
                  fontFamily:  "inherit",
                  cursor:      "pointer",
                  display:     "flex",
                  alignItems:  "center",
                  justifyContent: "center",
                  lineHeight:  1,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "10px 12px 12px" }}>
          {/* Visualiser bar */}
          <div
            style={{
              background:  "#000",
              height:      48,
              marginBottom: 8,
              display:     "flex",
              alignItems:  "flex-end",
              gap:         2,
              padding:     "4px 6px",
            }}
          >
            {Array.from({ length: 28 }).map((_, i) => {
              const h = 6 + Math.abs(Math.sin(i * 0.9)) * 30
              return (
                <div
                  key={i}
                  style={{
                    flex:       1,
                    height:     h,
                    background: i < 10 ? "#00ff00" : i < 20 ? "#ffff00" : "#ff4444",
                  }}
                />
              )
            })}
          </div>

          {/* Track list */}
          <div
            style={{
              border:      "2px solid",
              borderColor: "#808080 #ffffff #ffffff #808080",
              background:  "#fff",
              padding:     "2px 0",
              marginBottom: 10,
            }}
          >
            {SONGS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding:     "3px 8px",
                  fontSize:    11,
                  display:     "flex",
                  gap:         8,
                  background:  i === 2 ? "#000080" : "transparent",
                  color:       i === 2 ? "#fff" : "#000",
                  cursor:      "default",
                }}
              >
                <span style={{ color: i === 2 ? "#aac8ff" : "#808080", minWidth: 14 }}>{i + 1}.</span>
                <span>{s.title}</span>
                <span style={{ marginLeft: "auto", color: i === 2 ? "#aac8ff" : "#808080" }}>{s.artist}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            {["  |◄◄  ", "  ►  ", "  ■  ", "  ► ►|  "].map((label) => (
              <button
                key={label}
                style={{
                  background:  "#c0c0c0",
                  border:      "2px solid",
                  borderColor: "#ffffff #808080 #808080 #ffffff",
                  fontSize:    10,
                  fontFamily:  "inherit",
                  padding:     "2px 6px",
                  cursor:      "pointer",
                  letterSpacing: 0.5,
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={onClose}
              style={{
                background:  "#c0c0c0",
                border:      "2px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                fontSize:    10,
                fontFamily:  "inherit",
                padding:     "2px 10px",
                cursor:      "pointer",
                marginLeft:  8,
              }}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Generic dark modal (books / movies) ─────────────────────────────────────

function ContentModal({
  type,
  onClose,
}: {
  type: "books" | "movies"
  onClose: () => void
}) {
  const title = type === "books" ? "Reading" : "Favourite Films"
  const items =
    type === "books"
      ? BOOKS.map((b) => ({ main: b.title, sub: b.author }))
      : MOVIES.map((m) => ({ main: m.title, sub: `${m.director} · ${m.year}` }))

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-background border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1,    opacity: 1, y: 0 }}
        exit={{   scale: 0.96, opacity: 0, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <h3 className="text-sm font-sans font-bold tracking-tight">{title}</h3>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors text-base leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="space-y-0.5">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 px-2 py-2 hover:bg-muted/40 rounded-lg"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <span className="text-xs text-muted-foreground/50 font-mono w-4">{i + 1}</span>
              <div>
                <p className="text-sm font-sans font-bold leading-tight">{item.main}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CircularMenu({ forceOpen = false }: { forceOpen?: boolean }) {
  const [hovered,    setHovered]    = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [modal,      setModal]      = useState<"vinyl" | "books" | "movies" | null>(null)
  const [angle,      setAngle]      = useState(0)

  const isExpanded = hovered || forceOpen

  // Slow orbital drift when open
  useEffect(() => {
    if (!isExpanded) return
    const id = setInterval(() => setAngle((a) => a + 0.22), 50)
    return () => clearInterval(id)
  }, [isExpanded])

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const handleClick = useCallback((item: MenuItem) => {
    if (item.href)  window.open(item.href, "_blank", "noopener,noreferrer")
    else if (item.modal) setModal(item.modal)
  }, [])

  const N         = MENU_ITEMS.length
  const angleStep = (2 * Math.PI) / N
  const RADIUS    = 100          // slightly larger orbit to match bigger torus

  return (
    <>
      {/* Dial container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 340, height: 340 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setActiveItem(null) }}
      >
        {/* WebGL torus — scales UP slightly on hover, never shrinks or clips */}
        <motion.div
          animate={{ scale: isExpanded ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          style={{ width: 220, height: 220, opacity: 1 }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent", width: "100%", height: "100%" }}
          >
            <TorusShader explode={false} />
          </Canvas>
        </motion.div>

        {/* Orbital nodes */}
        <AnimatePresence>
          {isExpanded &&
            MENU_ITEMS.map((item, i) => {
              const theta  = angleStep * i - Math.PI / 2 + (angle * Math.PI) / 180
              const ox     = Math.cos(theta) * RADIUS
              const oy     = Math.sin(theta) * RADIUS
              const active = activeItem === item.id

              return (
                <motion.button
                  key={item.id}
                  className="absolute flex flex-col items-center gap-0.5 cursor-pointer"
                  style={{ x: ox, y: oy }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: active ? 1.3 : 1 }}
                  exit={{   opacity: 0, scale: 0.3 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28, delay: i * 0.04 }}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem(null)}
                  onClick={() => handleClick(item)}
                >
                  {item.kind === "img" ? (
                    <div
                      className="relative overflow-hidden"
                      style={{ width: 44, height: 44 }}
                    >
                      <Image
                        src={item.imgSrc!}
                        alt={item.label}
                        fill
                        className={`object-contain transition-opacity duration-200 ${
                          active ? "opacity-100" : "opacity-55"
                        }`}
                        sizes="44px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span
                      className={`transition-colors duration-150 ${
                        active ? "text-foreground" : "text-foreground/50"
                      }`}
                    >
                      {item.icon}
                    </span>
                  )}

                  {/* Label on hover */}
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        className="absolute -bottom-5 text-[9px] font-sans font-bold text-foreground/80 whitespace-nowrap tracking-wide"
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0  }}
                        exit={{   opacity: 0, y: -2  }}
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
        {modal === "vinyl"  && <Win95Modal        onClose={() => setModal(null)} />}
        {modal === "books"  && <ContentModal type="books"  onClose={() => setModal(null)} />}
        {modal === "movies" && <ContentModal type="movies" onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  )
}
