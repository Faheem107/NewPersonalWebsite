"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Linkedin, Instagram, Github, Mail } from "lucide-react"
import { BookOpen, Disc3, Clapperboard } from "lucide-react"
import Image from "next/image"
import { Canvas } from "@react-three/fiber"
import { TorusShader } from "@/components/torus-shader"

// ─── Data ────────────────────────────────────────────────────────────────────

const SONGS = [
  { title: "Hublots",  artist: "Frank Ocean",  audioSrc: "/audio/hublots.mp3",  imgSrc: "/audio/endless.jpg" },
  { title: "Bliss",    artist: "klsr.av",      audioSrc: "/audio/bliss.mp3",    imgSrc: "/audio/bliss.jpg" },
  { title: "Higgs",    artist: "Frank Ocean",  audioSrc: "/audio/higgs.mp3",    imgSrc: "/audio/endless.jpg" },
  { title: "West",     artist: "River Tiber",  audioSrc: "/audio/west.mp3",     imgSrc: "/audio/west.jpg" },
  { title: "Earrings", artist: "Malcolm Todd", audioSrc: "/audio/earrings.mp3", imgSrc: "/audio/earrings.jpg" },
]

const BOOKS = [
  { title: "Men of Mathematics",              author: "Eric Temple Bell" },
  { title: "The Elegant Universe",            author: "Brian Greene" },
  { title: "Mathematics for Human Flourishing", author: "Francis Su" },
  { title: "Godel, Escher, Bach",             author: "Douglas Hofstadter" },
  { title: "Seven Brief Lessons on Physics",  author: "Carlo Rovelli" },
]

const MOVIES = [
  { title: "Oppenheimer",               director: "Christopher Nolan", year: "2023" },
  { title: "2001: A Space Odyssey", director: "Stanley Kubrick",  year: "1968" },
  { title: "In the Mood for Love",  director: "Wong Kar-wai",     year: "2000" },
  { title: "Interstellar",          director: "Christopher Nolan",year: "2014" },
  { title: "Chungking Express",     director: "Wong Kar-wai",     year: "1994" },
]

// ─── Orbit item config ────────────────────────────────────────────────────────

type MenuItem = {
  id: string
  label: string
  kind: "img" | "icon"
  imgSrc?: string
  icon?: React.ReactNode
  href?: string
  modal?: "vinyl" | "books" | "movies"
}

const MENU_ITEMS: MenuItem[] = [
  { id: "music",    label: "Music",    kind: "icon", icon: <Disc3 size={22} strokeWidth={1.5} />,        modal: "vinyl" },
  { id: "books",    label: "Books",    kind: "icon", icon: <BookOpen size={22} strokeWidth={1.5} />,     modal: "books" },
  { id: "movies",   label: "Movies",   kind: "icon", icon: <Clapperboard size={22} strokeWidth={1.5} />, modal: "movies" },
  { id: "linkedin", label: "LinkedIn", kind: "icon", icon: <Linkedin size={22} strokeWidth={1.5} />,     href: "https://www.linkedin.com/in/mohammed-faheem-33bb49295/" },
  { id: "instagram",label: "Instagram",kind: "icon", icon: <Instagram size={22} strokeWidth={1.5} />,    href: "https://www.instagram.com/faheemmmm._/" },
  { id: "github",   label: "GitHub",   kind: "icon", icon: <Github size={22} strokeWidth={1.5} />,       href: "https://github.com/Faheem107" },
  { id: "email",    label: "Email",    kind: "icon", icon: <Mail size={22} strokeWidth={1.5} />,         href: "mailto:mj3398@nyu.edu" },
]

// ─── Windows 95 vinyl modal ───────────────────────────────────────────────────

function Win95Modal({ onClose }: { onClose: () => void }) {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying]       = useState(false)
  const [volume, setVolume]             = useState(0.5)
  const [bars, setBars]                 = useState<number[]>(Array(22).fill(6))
  const audioRef                        = useRef<HTMLAudioElement>(null)

  // Visualizer Animation
  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(22).fill(4))
      return
    }
    const interval = setInterval(() => {
      setBars(Array.from({ length: 22 }, () => Math.random() * 32 + 8))
    }, 120)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Playback & "Middle 30s" Logic
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (audio.duration) {
        const midPoint = audio.duration / 2
        const endTime = midPoint + 15
        
        if (audio.currentTime >= endTime) {
          audio.pause()
          setIsPlaying(false)
          audio.currentTime = midPoint - 15 // Reset to start point
        }
      }
    }

    const handleLoadedMetadata = () => {
      const midPoint = audio.duration / 2
      audio.currentTime = Math.max(0, midPoint - 15)
      if (isPlaying) {
        audio.play().catch((e) => console.log("Autoplay prevented:", e))
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [currentTrack, isPlaying])

  // Volume Control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play().catch(() => {})
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % SONGS.length)
    setIsPlaying(true)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + SONGS.length) % SONGS.length)
    setIsPlaying(true)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", touchAction: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <audio 
        ref={audioRef} 
        src={SONGS[currentTrack].audioSrc} 
        autoPlay={isPlaying}
      />

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
          margin:      "0 16px" 
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
            <button
              onClick={onClose}
              style={{
                background:  "#c0c0c0",
                border:      "2px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                color:       "#000",
                width:       16,
                height:      14,
                fontSize:    9,
                cursor:      "pointer",
                display:     "flex",
                alignItems:  "center",
                justifyContent: "center",
                lineHeight:  1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "10px 12px 12px" }}>
          
          {/* Rotating Vinyl & Visualizer Row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            {/* Spinning Vinyl */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              style={{
                width: 50, height: 50,
                borderRadius: '50%',
                background: '#111',
                border: '2px solid #333',
                display: 'flex', alignItems: 'center', justifyContent: 'center', // FIXED: Capitalized C in justifyContent
                position: 'relative', overflow: 'hidden', flexShrink: 0,
                boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
              }}
            >
              <Image 
                src={SONGS[currentTrack].imgSrc} 
                alt="album" 
                fill 
                className="object-cover opacity-90" 
                unoptimized
              />
              <div style={{ position: 'absolute', width: 10, height: 10, background: '#c0c0c0', borderRadius: '50%', border: '1px solid #555' }} />
            </motion.div>

            {/* Visualizer bars */}
            <div
              style={{
                flex: 1,
                background:  "#000",
                display:     "flex",
                alignItems:  "flex-end",
                gap:         2,
                padding:     "4px 6px",
              }}
            >
              {bars.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex:       1,
                    height:     h,
                    background: i < 8 ? "#00ff00" : i < 16 ? "#ffff00" : "#ff4444",
                    transition: "height 0.1s ease-in-out"
                  }}
                />
              ))}
            </div>
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
                onClick={() => { setCurrentTrack(i); setIsPlaying(true) }}
                style={{
                  padding:     "3px 8px",
                  fontSize:    11,
                  display:     "flex",
                  gap:         8,
                  background:  i === currentTrack ? "#000080" : "transparent",
                  color:       i === currentTrack ? "#fff" : "#000",
                  cursor:      "pointer",
                }}
              >
                <span style={{ color: i === currentTrack ? "#aac8ff" : "#808080", minWidth: 14 }}>{i + 1}.</span>
                <span>{s.title}</span>
                <span style={{ marginLeft: "auto", color: i === currentTrack ? "#aac8ff" : "#808080" }}>{s.artist}</span>
              </div>
            ))}
          </div>

          {/* Bottom Controls (Volume & Playback) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            
            {/* Volume Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 }}>VOL</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ width: 64, cursor: "pointer", accentColor: "#000080" }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={prevTrack} style={buttonStyle}> |◄◄ </button>
              <button onClick={togglePlay} style={buttonStyle}> {isPlaying ? " || " : " ► "} </button>
              <button onClick={() => { setIsPlaying(false); if(audioRef.current) audioRef.current.pause() }} style={buttonStyle}> ■ </button>
              <button onClick={nextTrack} style={buttonStyle}> ► ►| </button>
              <button onClick={onClose} style={{ ...buttonStyle, marginLeft: 8 }}>Close</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const buttonStyle = {
  background:  "#c0c0c0",
  border:      "2px solid",
  borderColor: "#ffffff #808080 #808080 #ffffff",
  fontSize:    10,
  fontFamily:  "inherit",
  padding:     "2px 6px",
  cursor:      "pointer",
  letterSpacing: 0.5,
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

  // ─── Mobile Responsiveness State ───
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Detect screen size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // The menu expands if forced, if hovered on desktop, or if tapped on mobile
  const isExpanded = forceOpen || (isMobile ? mobileOpen : (hovered || activeItem !== null))

  // Handle continuous rotation
  useEffect(() => {
    if (!isExpanded) return
    const id = setInterval(() => setAngle((a) => a + 0.15), 50)
    return () => clearInterval(id)
  }, [isExpanded])

  // Handle escape key to close modals
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Handle click on individual menu items
  const handleClick = useCallback((item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the container click from firing and closing the menu
    if (item.href)  window.open(item.href, "_blank", "noopener,noreferrer")
    else if (item.modal) setModal(item.modal)
  }, [])

  // Handle click on the central container (for mobile tap-to-toggle)
  const handleContainerClick = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    }
  }

  const N         = MENU_ITEMS.length
  const angleStep = (2 * Math.PI) / N
  
  // ─── Dynamic Math for Responsiveness ───
  const RADIUS        = isMobile ? 112 : 150 
  const containerSize = isMobile ? 330 : 420
  const itemScale     = isMobile ? 0.85 : 1

  return (
    <>
      {/* Mobile background overlay to tap-out and close */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 z-[40]" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      <div
        className={`relative flex items-center justify-center isolate select-none touch-none ${
          isMobile && mobileOpen ? "z-[50]" : "z-10"
        }`}
        style={{ width: containerSize, height: containerSize }}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => { 
          if (!isMobile) {
            setHovered(false); 
            setActiveItem(null) 
          }
        }}
        onClick={handleContainerClick}
      >
        {/* Mobile tap hint */}
        {isMobile && !mobileOpen && (
          <div className="absolute top-4 text-[10px] uppercase tracking-widest text-foreground/40 animate-pulse font-sans font-bold pointer-events-none">
            Tap to explore
          </div>
        )}

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: isMobile ? 600 : 800, height: isMobile ? 600 : 800 }}
        >
          <Canvas
            camera={{ position: [0, 0, 13], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent", width: "100%", height: "100%" }}
          >
            <TorusShader explode={isExpanded} />
          </Canvas>
        </div>

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
                  className="absolute flex flex-col items-center gap-0.5 cursor-pointer z-[50]"
                  style={{ x: ox, y: oy }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ 
                    opacity: 1, 
                    scale: active ? (itemScale * 1.3) : itemScale 
                  }}
                  exit={{   opacity: 0, scale: 0.3 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28, delay: i * 0.04 }}
                  onMouseEnter={() => !isMobile && setActiveItem(item.id)}
                  onMouseLeave={() => !isMobile && setActiveItem(null)}
                  onClick={(e) => handleClick(item, e)}
                >
                  {item.kind === "img" ? (
                    <div
                      className="relative overflow-hidden shadow-2xl rounded-lg bg-background/90"
                      style={{ width: 44, height: 44 }} 
                    >
                      <Image
                        src={item.imgSrc!}
                        alt={item.label}
                        fill
                        className={`object-contain transition-opacity duration-200 ${
                          active || isMobile ? "opacity-100" : "opacity-80" 
                        }`}
                        sizes="44px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span
                      className={`transition-colors duration-150 ${
                        active || isMobile ? "text-foreground" : "text-foreground/50"
                      }`}
                    >
                      {item.icon}
                    </span>
                  )}

                  <AnimatePresence>
                    {(active || isMobile) && (
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

      <AnimatePresence>
        {modal === "vinyl"  && <Win95Modal        onClose={() => setModal(null)} />}
        {modal === "books"  && <ContentModal type="books"  onClose={() => setModal(null)} />}
        {modal === "movies" && <ContentModal type="movies" onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  )
}