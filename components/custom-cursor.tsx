"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

const DEFAULT_SIZE = 12
const HIGHLIGHT_SIZE = 32

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorVariant, setCursorVariant] = useState<"default" | "highlight" | "hidden">("default")
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  const size = useRef({ x: DEFAULT_SIZE, y: DEFAULT_SIZE })
  
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  }
  
  // Very smooth spring settings for buttery cursor movement
  const springMouse = {
    x: useSpring(mouse.x, { stiffness: 150, damping: 15, mass: 0.1 }),
    y: useSpring(mouse.y, { stiffness: 150, damping: 15, mass: 0.1 }),
  }
  
  const scale = {
    x: useMotionValue(1),
    y: useMotionValue(1),
  }
  
  const scaleSpring = {
    x: useSpring(scale.x, { stiffness: 300, damping: 20, mass: 0.5 }),
    y: useSpring(scale.y, { stiffness: 300, damping: 20, mass: 0.5 }),
  }

  useEffect(() => {
    // Check if touch device
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()
    
    if (isTouchDevice) return

    const mouseMove = (event: MouseEvent) => {
      mouse.x.set(event.clientX - size.current.x / 2)
      mouse.y.set(event.clientY - size.current.y / 2)
    }

    const mouseTapStart = () => {
      scale.x.set(0.85)
      scale.y.set(0.85)
    }

    const mouseTapEnd = () => {
      scale.x.set(1)
      scale.y.set(1)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target
      if (target instanceof Element && target.closest('a, button, [role="button"], .cursor-pointer, .interactive')) {
        setCursorVariant("highlight")
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target
      if (target instanceof Element && target.closest('a, button, [role="button"], .cursor-pointer, .interactive')) {
        setCursorVariant("default")
      }
    }

    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mousedown', mouseTapStart)
    window.addEventListener('mouseup', mouseTapEnd)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mousedown', mouseTapStart)
      window.removeEventListener('mouseup', mouseTapEnd)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [isTouchDevice, mouse.x, mouse.y, scale.x, scale.y])

  useEffect(() => {
    switch (cursorVariant) {
      case 'hidden':
        size.current = { x: 0, y: 0 }
        break
      case 'default':
        size.current = { x: DEFAULT_SIZE, y: DEFAULT_SIZE }
        break
      case 'highlight':
        size.current = { x: HIGHLIGHT_SIZE, y: HIGHLIGHT_SIZE }
        break
      default:
        size.current = { x: DEFAULT_SIZE, y: DEFAULT_SIZE }
    }
  }, [cursorVariant])

  if (isTouchDevice) return null

  const variants = {
    hidden: {
      width: 0,
      height: 0,
      opacity: 0,
    },
    default: {
      opacity: 1,
      width: DEFAULT_SIZE,
      height: DEFAULT_SIZE,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    highlight: {
      opacity: 1,
      width: HIGHLIGHT_SIZE,
      height: HIGHLIGHT_SIZE,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-foreground/60 mix-blend-difference"
      variants={variants}
      initial="hidden"
      animate={cursorVariant}
      style={{
        x: springMouse.x,
        y: springMouse.y,
        scaleX: scaleSpring.x,
        scaleY: scaleSpring.y,
      }}
    />
  )
}
