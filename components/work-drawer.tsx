"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const GALLERY_IMAGES = [
  "/images/dubai-metro-3.jpg",
  "/images/dubai-metro-1.jpg",
  "/images/dubai-metro-2.jpg",
  "https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg",
  "https://cdn.cosmos.so/c4588488-0021-4804-9c29-a43059378bfe?format=jpeg",
  "https://cdn.cosmos.so/de8c561b-e4e4-48f3-9068-30d63b92c43e?format=jpeg",
  "https://cdn.cosmos.so/207b3ba7-13ef-496b-a9cb-2a718e14a24e?format=jpeg",
  "https://cdn.cosmos.so/6c41e632-d300-4516-a7af-9a1f7c0aef94?format=jpeg",
  "https://cdn.cosmos.so/e552eaac-8251-4890-b954-e988fc4bf2e0?format=jpeg",
]

export default function WorkDrawer() {
  const [open, setOpen] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // Scroll wheel drives horizontal scroll inside panel
  const onWheel = useCallback((e: WheelEvent) => {
    if (!trackRef.current || !open) return
    e.preventDefault()
    trackRef.current.scrollLeft += e.deltaY + e.deltaX
  }, [open])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [onWheel, open])

  // Drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0)
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.4
    trackRef.current.scrollLeft = scrollLeft.current - walk
  }
  const stopDrag = () => { isDragging.current = false }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Tab trigger */}
      <motion.button
        className="absolute bottom-0 left-1/2 -translate-x-1/2 px-6 py-2 text-xs font-sans font-bold tracking-[0.18em] uppercase text-foreground/60 hover:text-foreground bg-background/80 backdrop-blur-sm border border-border/40 border-b-0 rounded-t-lg transition-colors duration-200 interactive"
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen(o => !o)}
        animate={{ y: open ? -2 : 0 }}
        transition={{ duration: 0.2 }}
      >
        some of my work
      </motion.button>

      {/* Slide-up panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-full bg-background/90 backdrop-blur-md border-t border-border/30"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            onMouseLeave={() => setOpen(false)}
          >
            <div
              ref={trackRef}
              className="flex gap-3 overflow-x-auto overflow-y-hidden py-5 px-8 cursor-grab active:cursor-grabbing select-none"
              style={{ scrollbarWidth: "none" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
            >
              {GALLERY_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-60 h-36 rounded-lg overflow-hidden bg-foreground/5"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
