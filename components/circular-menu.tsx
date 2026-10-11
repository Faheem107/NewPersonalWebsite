"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
} from "motion/react"
import { Linkedin, Instagram, Github, Mail } from "lucide-react"
import { BookOpen, Disc3, Clapperboard } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import ModalShell from "@/components/modal-shell"
import MusicPlayer from "@/components/music-player"
import { TorusShader } from "@/components/torus-shader"
import {
  CAMERA_FOV,
  CAMERA_Z,
  TORUS_RADIUS,
  canvasForContainer,
  containerForCanvas,
  pxPerUnit,
} from "@/lib/torus-geometry"

// Data

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

// Orbit item config

type MenuItem = {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  modal?: "vinyl" | "books" | "movies"
  /** What the glyph itself does under the pointer. One gesture each. */
  gesture: TargetAndTransition
  /** Turns all the time, faster under the pointer. Only the disc. */
  turns?: boolean
}

const REST: TargetAndTransition = { rotate: 0, x: 0, y: 0, scale: 1 }
const once = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }

const GESTURES = {
  none:  REST,
  open:  { rotate: [0, -10, 7, 0], y: [0, -2, 0], transition: once },
  clap:  { rotate: [0, -16, 0, -9, 0], transition: { ...once, duration: 0.5 } },
  nod:   { rotate: [0, 9, -6, 0], scale: [1, 1.14, 1], transition: once },
  send:  { x: [0, 3, 0], y: [0, -4, 0], rotate: [0, -8, 0], transition: once },
} satisfies Record<string, TargetAndTransition>

const MENU_ITEMS: MenuItem[] = [
  { id: "music",    label: "Music",    icon: <Disc3 size={20} strokeWidth={1.6} />,        modal: "vinyl", gesture: GESTURES.none, turns: true },
  { id: "books",    label: "Books",    icon: <BookOpen size={20} strokeWidth={1.6} />,     modal: "books", gesture: GESTURES.open },
  { id: "movies",   label: "Movies",   icon: <Clapperboard size={20} strokeWidth={1.6} />, modal: "movies", gesture: GESTURES.clap },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin size={20} strokeWidth={1.6} />,     href: "https://www.linkedin.com/in/mohammed-faheem-33bb49295/", gesture: GESTURES.nod },
  { id: "instagram",label: "Instagram",icon: <Instagram size={20} strokeWidth={1.6} />,    href: "https://www.instagram.com/faheemmmm._/", gesture: GESTURES.nod },
  { id: "github",   label: "GitHub",   icon: <Github size={20} strokeWidth={1.6} />,       href: "https://github.com/Faheem107", gesture: GESTURES.nod },
  { id: "email",    label: "Email",    icon: <Mail size={20} strokeWidth={1.6} />,         href: "mailto:mj3398@nyu.edu", gesture: GESTURES.send },
]

// Books and films

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
            // Behind the panel's own spring, so the list arrives after it.
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

// One item in the orbit. Its own component because its position is derived
// from motion values, which needs hooks per item.
function OrbitItem({
  item,
  index,
  theta0,
  radius,
  scale,
  delay,
  spin,
  clock,
  touch,
  active,
  onActive,
  onSelect,
}: {
  item: MenuItem
  index: number
  theta0: number
  radius: number
  scale: number
  delay: number
  spin: MotionValue<number>
  clock: MotionValue<number>
  touch: boolean
  active: boolean
  onActive: (id: string | null) => void
  onSelect: (item: MenuItem, e: React.MouseEvent) => void
}) {
  // How far out along its spoke the item has travelled. It leaves from the
  // centre of the form and swings round as it goes, so the ring opens like an
  // iris rather than seven marks appearing where they will end up.
  const reach = useMotionValue(0)
  useEffect(() => {
    const controls = animate(reach, 1, { type: 'spring', stiffness: 150, damping: 17, delay })
    return () => controls.stop()
  }, [reach, delay])

  // Each one rides a slow swell of its own, a few pixels in and out along the
  // spoke and a couple around it, out of step with its neighbours.
  const phase = index * 2.4
  const x = useTransform(() => {
    const k = reach.get()
    const t = clock.get()
    const angle = theta0 + spin.get() - (1 - k) * 1.2 + Math.sin(t * 0.9 + phase) * 0.03 * k
    return Math.cos(angle) * (radius * k + Math.sin(t * 1.3 + phase) * 4 * k)
  })
  const y = useTransform(() => {
    const k = reach.get()
    const t = clock.get()
    const angle = theta0 + spin.get() - (1 - k) * 1.2 + Math.sin(t * 0.9 + phase) * 0.03 * k
    return Math.sin(angle) * (radius * k + Math.sin(t * 1.3 + phase) * 4 * k)
  })

  return (
    <motion.button
      // The label is only visible on hover, so without this the orbit is seven
      // unnamed buttons to a screen reader.
      aria-label={item.label}
      // The mark is under 44px, so size-11 is the hit area.
      className="absolute z-[50] flex size-11 cursor-pointer flex-col items-center justify-center gap-0.5"
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28, delay }}
      onMouseEnter={() => !touch && onActive(item.id)}
      onMouseLeave={() => !touch && onActive(null)}
      onClick={e => onSelect(item, e)}
    >
      {/* The scale lives on the mark, so the 44px button around it keeps its
          size at every ring radius.

          The mark sits on a round plate for the same reason every other plate
          on the site exists: it is over the expanded ball, which is a dense
          field of colour, and a bare glyph in either theme's foreground is
          unreadable against it. Framed field, hairline edge, no shadow. */}
      <motion.span
        className={`relative flex items-center justify-center rounded-full border p-[9px] backdrop-blur-[2px] transition-colors duration-300 ${
          active
            ? 'border-accent bg-background text-accent'
            : 'border-plate-border bg-background/85 text-foreground/75'
        }`}
        animate={{ scale: active ? scale * 1.16 : scale }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      >
        {/* A ring that leaves the plate now and then, each on its own beat, so
            the orbit is never quite still. Hairline, and gone under the
            pointer, where the plate's own edge is doing the work. */}
        {!active && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-[-1px] rounded-full border border-accent"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.55, 0], scale: [1, 1.12, 1.6] }}
            transition={{
              duration: 2.2,
              times: [0, 0.15, 1],
              ease: 'easeOut',
              repeat: Infinity,
              repeatDelay: 3.4,
              delay: 0.9 + index * 0.8,
            }}
          />
        )}

        <motion.span
          className="flex"
          animate={active ? item.gesture : REST}
          style={
            item.turns
              ? {
                  animation: 'vinyl-spin linear infinite',
                  animationDuration: active ? '1.3s' : '9s',
                }
              : { transformOrigin: item.id === 'movies' ? '15% 85%' : '50% 50%' }
          }
        >
          {item.icon}
        </motion.span>
      </motion.span>

      <AnimatePresence>
        {(active || touch) && (
          <motion.span
            className="caption absolute -bottom-6 whitespace-nowrap text-[9px] text-foreground/80"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            // Behind the ring's own spring, so the labels settle after the
            // icons have found their places rather than travelling with them.
            transition={{ duration: 0.16, delay: touch ? delay + 0.3 : 0 }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/** Largest the form is allowed to get, whatever room it is given. */
const MAX_CONTAINER = 410

/**
 * How much of the available column the form may take. The cap alone does
 * nothing on a phone, where the column is already narrower than it; this is
 * what gives the shape room to sit in.
 */
const ROOM_SHARE = 0.82

/** Degrees a second the ring turns while it is open. */
const ORBIT_SPEED = 3

export default function CircularMenu({ forceOpen = false }: { forceOpen?: boolean }) {
  const [hovered,    setHovered]    = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [modal,      setModal]      = useState<"vinyl" | "books" | "movies" | null>(null)

  const [touch, setTouch] = useState(false)
  const [touchOpen, setTouchOpen] = useState(false)

  // A pointer that cannot hover, rather than a width: at 640-767px a width test
  // gives hover behaviour to a layout that has already stacked.
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)")
    const sync = () => setTouch(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // Sizing. Measured rather than assumed: the wrapper is the grid cell the hero
  // gives us, so this is however much width the page has after its padding.
  const shellRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState(MAX_CONTAINER)

  useEffect(() => {
    const el = shellRef.current
    if (!el) return
    const measure = () => {
      const room = el.getBoundingClientRect().width
      // Three limits, all real: the room the column gives us, the cap above,
      // and the largest form whose canvas still fits across the screen. The
      // canvas is absolutely positioned and centred, so one wider than the
      // viewport is overflow the layout does not account for.
      const screen = containerForCanvas(document.documentElement.clientWidth)
      if (room > 0) {
        setContainerSize(Math.min(room * ROOM_SHARE, MAX_CONTAINER, screen))
      }
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

  // The ring's rotation, in radians, advanced on the frame clock. Nothing
  // re-renders as it turns: each item reads it through useTransform.
  const spin = useMotionValue(0)
  // Seconds the ring has been open for, which the items' own drift runs on.
  const clock = useMotionValue(0)
  useAnimationFrame((_, delta) => {
    if (!isExpanded) return
    const dt = Math.min(delta, 50) / 1000
    spin.set(spin.get() + (ORBIT_SPEED * Math.PI) / 180 * dt)
    clock.set(clock.get() + dt)
  })
  // The line the items ride, turning the other way.
  const trackTurn = useTransform(spin, s => (-s * 180) / Math.PI * 2.5)

  // Escape is handled by ModalShell, which only listens while a modal is open.
  const handleClick = useCallback((item: MenuItem, e: React.MouseEvent) => {
    // Or the container's own click fires and closes the menu.
    e.stopPropagation()
    if (item.href)  window.open(item.href, "_blank", "noopener,noreferrer")
    else if (item.modal) setModal(item.modal)
  }, [])

  // Tap the form itself to toggle the ring, on a device that cannot hover.
  const handleContainerClick = () => {
    if (touch) setTouchOpen(v => !v)
  }

  const N         = MENU_ITEMS.length
  const angleStep = (2 * Math.PI) / N

  // Geometry. The canvas size is the shape's scale: the camera has a fixed FOV
  // at a fixed z, so a canvas of N pixels shows exactly VIEW_UNITS of world
  // across it and the torus takes whatever fraction its radii come to. There is
  // no separate zoom, and no multiplier for the intro scatter's run-up: the
  // margin is already in the frame by construction.
  //
  // RADIUS comes off the same scale as the shader's own ring line, so the icons
  // are concentric with the torus rather than sitting at a guessed pixel value.
  const formCanvas = canvasForContainer(containerSize)
  const canvasSize = Math.round(formCanvas)
  const RADIUS     = TORUS_RADIUS * pxPerUnit(formCanvas)
  // Applied to the mark, never to the button around it: the button carries the
  // tap target, and shrinking that on a small screen costs hit area on exactly
  // the devices with the least precise pointer. Measured against the ring the
  // marks actually sit on rather than against the desktop cap, or a phone gets
  // the smallest marks and the least room to read them.
  const itemScale  = Math.max(0.86, Math.min(1, RADIUS / 150))

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
            // Uncapped this renders at the device ratio, which on a phone is 3x
            // and nine times the fragment work.
            dpr={[1, 2]}
            // offsetWidth/offsetHeight rather than a bounding rect, which would
            // include any ancestor transform and size the canvas to whatever an
            // entrance animation happened to be part-way through.
            resize={{ offsetSize: true }}
            style={{ background: "transparent", width: "100%", height: "100%" }}
          >
            <TorusShader explode={isExpanded} />
          </Canvas>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.span
              key="track"
              aria-hidden
              className="pointer-events-none absolute z-[45] rounded-full border border-dashed border-foreground/20"
              style={{ width: RADIUS * 2, height: RADIUS * 2, rotate: trackTurn }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            />
          )}
          {isExpanded &&
            MENU_ITEMS.map((item, i) => (
              <OrbitItem
                key={item.id}
                item={item}
                index={i}
                theta0={angleStep * i - Math.PI / 2}
                radius={RADIUS}
                scale={itemScale}
                delay={i * 0.05}
                spin={spin}
                clock={clock}
                touch={touch}
                active={activeItem === item.id}
                onActive={setActiveItem}
                onSelect={handleClick}
              />
            ))}
        </AnimatePresence>
      </div>
      </div>

      <AnimatePresence>
        {modal === "vinyl"  && <MusicPlayer songs={SONGS} onClose={() => setModal(null)} />}
        {modal === "books"  && <ContentModal type="books"  onClose={() => setModal(null)} />}
        {modal === "movies" && <ContentModal type="movies" onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  )
}