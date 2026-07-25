"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import { Linkedin, Instagram, Github, Mail } from "lucide-react"
import { BookOpen, Disc3, Clapperboard } from "lucide-react"
import Image from "next/image"
import { Canvas } from "@react-three/fiber"
import { TorusShader } from "@/components/torus-shader"
import { useScrollLock } from "@/lib/motion/scroll-lock"
import { CAMERA_FOV, CAMERA_Z, TORUS_RADIUS, canvasForContainer, pxPerUnit } from "@/lib/torus-geometry"

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

// ─── Modal shell ──────────────────────────────────────────────────────────────

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Backdrop, centring, focus and scroll behaviour for both modals.
 *
 * The portal is the point. These used to render where they sit in the tree,
 * which is inside [data-torus] on the home page, and the GSAP entrance timeline
 * puts a transform on that element. A transformed ancestor becomes the
 * containing block for position: fixed, so `inset-0` resolved to the torus box
 * and the modal opened above the torus instead of centred in the viewport.
 * Nothing was wrong with the modal's own CSS.
 */
function ModalShell({
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

// ─── The turntable ────────────────────────────────────────────────────────────

/**
 * A record on a beveled plate, in the same 98-era chrome as the player.
 *
 * Three layers, and the split between them is the thing that makes it read as
 * vinyl rather than as a spinning picture:
 *
 *  - the disc rotates, carrying the grooves and the label,
 *  - the sheen does NOT, because a light source does not turn with the record,
 *    so what you see is the grooves travelling under a fixed highlight,
 *  - the spindle sits still in the middle of both.
 *
 * The album art is the label only. It used to be stretched over the whole disc,
 * which is not what a record looks like from any angle.
 */
function Turntable({ src, playing }: { src: string; playing: boolean }) {
  const SIZE = 148
  const LABEL = Math.round(SIZE * 0.38)

  return (
    <div
      style={{
        position: 'relative',
        width: SIZE + 18,
        height: SIZE + 18,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        background: '#8a8a8a',
        border: '2px solid',
        // sunken, the inverse of the raised bevel the buttons use
        borderColor: '#808080 #ffffff #ffffff #808080',
      }}
    >
      <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            // Grooves. A repeating radial gradient is what a 98 skin would have
            // faked this with, and it is still the cheapest honest way to do it.
            background: `
              repeating-radial-gradient(
                circle at 50% 50%,
                #0b0b0b 0px, #0b0b0b 1px,
                #1a1a1a 2px, #0f0f0f 3px
              )
            `,
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.9)',
            animation: 'vinyl-spin 3.2s linear infinite',
            animationPlayState: playing ? 'running' : 'paused',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: LABEL,
              height: LABEL,
              marginLeft: -LABEL / 2,
              marginTop: -LABEL / 2,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid #000',
            }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="60px" unoptimized />
          </div>
        </div>

        {/* Fixed sheen. Stays put while the disc turns under it. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            pointerEvents: 'none',
            background:
              'conic-gradient(from 210deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.16) 34deg, rgba(255,255,255,0) 78deg, rgba(255,255,255,0) 190deg, rgba(255,255,255,0.10) 220deg, rgba(255,255,255,0) 260deg)',
          }}
        />

        {/* Spindle, punched through the label. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 7,
            height: 7,
            marginLeft: -3.5,
            marginTop: -3.5,
            borderRadius: '50%',
            background: '#8a8a8a',
            boxShadow: 'inset 1px 1px 0 #555',
          }}
        />
      </div>

      {/* Tonearm: swings onto the record while it plays, lifts when it stops. */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          right: 8,
          top: 10,
          width: 6,
          height: SIZE * 0.62,
          transformOrigin: '50% 6px',
          background: '#c0c0c0',
          border: '1px solid',
          borderColor: '#ffffff #707070 #707070 #ffffff',
        }}
        animate={{ rotate: playing ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        {/* pivot */}
        <div
          style={{
            position: 'absolute',
            left: -5,
            top: -6,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #707070 #707070 #ffffff',
          }}
        />
        {/* headshell */}
        <div
          style={{
            position: 'absolute',
            left: -3,
            bottom: -6,
            width: 11,
            height: 9,
            background: '#a8a8a8',
            border: '1px solid #6a6a6a',
          }}
        />
      </motion.div>
    </div>
  )
}

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
    <ModalShell
      label="Music player"
      onClose={onClose}
      panelStyle={{
        background:  "#c0c0c0",
        border:      "2px solid",
        borderColor: "#ffffff #808080 #808080 #ffffff",
        boxShadow:   "inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #707070",
        fontFamily:  '"MS Sans Serif", "Pixelated MS Sans Serif", Arial, sans-serif',
        width:       "100%",
        maxWidth:    560,
      }}
    >
      <audio
        ref={audioRef}
        src={SONGS[currentTrack].audioSrc}
        autoPlay={isPlaying}
      />

      <div>
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
          <span>Winamp · Now Playing</span>
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

        {/* Body. The turntable sits beside the player above 520px and stacks
            above it below that, which is the only breakpoint in here. */}
        <div
          style={{
            padding: "10px 12px 12px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Turntable src={SONGS[currentTrack].imgSrc} playing={isPlaying} />

          <div style={{ flex: "1 1 260px", minWidth: 0 }}>

          {/* Visualizer bars */}
          <div
            style={{
              background:  "#000",
              display:     "flex",
              alignItems:  "flex-end",
              gap:         2,
              padding:     "4px 6px",
              height:      50,
              marginBottom: 10,
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
        </div>
      </div>
    </ModalShell>
  )
}

const buttonStyle = {
  background:  "#c0c0c0",
  border:      "2px solid",
  borderColor: "#ffffff #808080 #808080 #ffffff",
  fontSize:    10,
  fontFamily:  "inherit",
  // 2px 6px is authentic and unusable with a thumb. This is the smallest that
  // still reads as a 98 button.
  padding:     "5px 9px",
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
  const title = type === "books" ? "Reading" : "Films I go back to"
  const items =
    type === "books"
      ? BOOKS.map((b) => ({ main: b.title, sub: b.author }))
      : MOVIES.map((m) => ({ main: m.title, sub: `${m.director} · ${m.year}` }))

  return (
    <ModalShell label={title} onClose={onClose} panelClassName="plate-solid w-full max-w-sm p-6">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <h3 className="caption">{title}</h3>
        <button
          className="leading-none text-muted-foreground transition-colors hover:text-foreground"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="space-y-0.5">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 rounded-lg px-2 py-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            // Behind the panel's own spring, so the list arrives after the
            // thing containing it rather than alongside it.
            transition={{ delay: 0.06 + i * 0.035, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="w-4 font-mono text-xs text-muted-foreground/50">{i + 1}</span>
            <div>
              <p className="text-[0.9375rem] leading-tight">{item.main}</p>
              <p className="text-[0.8125rem] text-muted-foreground">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </ModalShell>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

/** Largest the form is allowed to get, whatever room it is given. */
const MAX_CONTAINER = 480

export default function CircularMenu({ forceOpen = false }: { forceOpen?: boolean }) {
  const [hovered,    setHovered]    = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [modal,      setModal]      = useState<"vinyl" | "books" | "movies" | null>(null)
  const [angle,      setAngle]      = useState(0)

  const [touch, setTouch] = useState(false)
  const [touchOpen, setTouchOpen] = useState(false)

  // Whether the form has to answer to taps rather than to hover. This used to
  // be innerWidth < 640, which is a different question and also disagreed with
  // the md breakpoint the hero stacks at, so 640-767px got hover behaviour on
  // a stacked layout. A pointer that cannot hover is the actual condition.
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)")
    const sync = () => setTouch(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // ─── Sizing ───
  // Measured rather than assumed. The wrapper is the grid cell the hero gives
  // us, so this is however much width the page actually has after its padding.
  const shellRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState(MAX_CONTAINER)
  const [viewport, setViewport] = useState(MAX_CONTAINER * 2)

  useEffect(() => {
    const el = shellRef.current
    if (!el) return
    const measure = () => {
      const room = el.getBoundingClientRect().width
      if (room > 0) setContainerSize(Math.min(room, MAX_CONTAINER))
      setViewport(document.documentElement.clientWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // The menu expands if forced, if hovered, or if tapped on a touch device.
  const isExpanded = forceOpen || (touch ? touchOpen : (hovered || activeItem !== null))

  // Handle continuous rotation
  useEffect(() => {
    if (!isExpanded) return
    const id = setInterval(() => setAngle((a) => a + 0.15), 50)
    return () => clearInterval(id)
  }, [isExpanded])

  // Escape is handled by ModalShell, which only listens while a modal is open.

  // Handle click on individual menu items
  const handleClick = useCallback((item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the container click from firing and closing the menu
    if (item.href)  window.open(item.href, "_blank", "noopener,noreferrer")
    else if (item.modal) setModal(item.modal)
  }, [])

  // Tap the form itself to toggle the ring, on a device that cannot hover.
  const handleContainerClick = () => {
    if (touch) setTouchOpen(v => !v)
  }

  const N         = MENU_ITEMS.length
  const angleStep = (2 * Math.PI) / N

  // ─── Geometry ───
  // The canvas is deliberately larger than the form: the intro scatter streams
  // in from up to 60 units out, and a tight canvas clips that. That ratio is
  // what the 1.65 is; the canvas follows the container rather than the other
  // way round, so the whole assembly fits whatever room the page has.
  //
  // Everything else derives from the shape. RADIUS was a flat 150px, which had
  // no relationship to anything the shader draws, so the ring of icons was
  // never concentric with the torus. It sits on the torus's own ring line now.
  //
  // The 1.65 is capped at the viewport because the canvas is absolutely
  // positioned and centred on the page, so anything wider than the screen is
  // scrollable overflow that nothing in the layout accounts for: on a 320px
  // phone this came out 722px wide and only the overflow-x backstop was hiding
  // it. Clamping costs a little of the scatter's run-up on small screens, which
  // was off the edge and unseen there anyway.
  const formCanvas = canvasForContainer(containerSize)
  const canvasSize = Math.round(Math.min(formCanvas * 1.65, viewport))
  const RADIUS     = TORUS_RADIUS * pxPerUnit(formCanvas)
  const itemScale  = Math.max(0.7, Math.min(1, containerSize / MAX_CONTAINER))

  return (
    <>
      {/* Tap-out target, so the ring closes again on a touch device. */}
      {touch && touchOpen && (
        <div
          className="fixed inset-0 z-[40]"
          onClick={() => setTouchOpen(false)}
        />
      )}

      {/* The shell is what gets measured: it takes the width the hero grid
          gives it, and the square form sizes itself inside that. */}
      <div ref={shellRef} className="flex w-full justify-center">
      <div
        className={`relative flex items-center justify-center isolate select-none touch-pan-y ${
          touch && touchOpen ? "z-[50]" : "z-10"
        }`}
        style={{ width: containerSize, height: containerSize }}
        onMouseEnter={() => !touch && setHovered(true)}
        onMouseLeave={() => {
          if (!touch) {
            setHovered(false)
            setActiveItem(null)
          }
        }}
        onClick={handleContainerClick}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: canvasSize, height: canvasSize }}
        >
          <Canvas
            camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
            gl={{ antialias: true, alpha: true }}
            // Measure with offsetWidth/offsetHeight rather than a bounding rect.
            // The hero's GSAP entrance scales [data-torus] from 0.9, and a
            // bounding rect includes an ancestor's transform, so r3f sized the
            // canvas mid-animation: it came out 736px inside an 800px box and
            // then sat anchored to the top left of it. The torus rendered 32px
            // up and left of the icons, which is why the ring never looked
            // concentric with it. offsetSize ignores transforms.
            resize={{ offsetSize: true }}
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
                  // The visible label only appears on hover, so without this
                  // the orbit is seven unnamed buttons to a screen reader.
                  aria-label={item.label}
                  // The icon is 22px, which is half a usable tap target, so the
                  // padding is the hit area rather than decoration.
                  className="absolute flex flex-col items-center justify-center gap-0.5 cursor-pointer z-[50] size-11"
                  style={{ x: ox, y: oy }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{
                    opacity: 1,
                    scale: active ? (itemScale * 1.3) : itemScale
                  }}
                  exit={{   opacity: 0, scale: 0.3 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28, delay: i * 0.04 }}
                  onMouseEnter={() => !touch && setActiveItem(item.id)}
                  onMouseLeave={() => !touch && setActiveItem(null)}
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
                          active || touch ? "opacity-100" : "opacity-80"
                        }`}
                        sizes="44px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span
                      className={`transition-colors duration-150 ${
                        active || touch ? "text-foreground" : "text-foreground/50"
                      }`}
                    >
                      {item.icon}
                    </span>
                  )}

                  <AnimatePresence>
                    {(active || touch) && (
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
      </div>

      <AnimatePresence>
        {modal === "vinyl"  && <Win95Modal        onClose={() => setModal(null)} />}
        {modal === "books"  && <ContentModal type="books"  onClose={() => setModal(null)} />}
        {modal === "movies" && <ContentModal type="movies" onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  )
}