"use client"

import React, { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useTheme } from "next-themes"

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Framer Motion spring physics — stiffness 300, damping 20 per spec
  const x = useSpring(rawX, { stiffness: 300, damping: 20, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 300, damping: 20, mass: 0.4 })

  useEffect(() => {
    setMounted(true)
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (isTouchDevice) return

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }

    const onEnter = (e: MouseEvent) => {
      if (e.target instanceof Element &&
          e.target.closest('a, button, [role="button"], .cursor-pointer, .interactive')) {
        setIsHovering(true)
      }
    }

    const onLeave = (e: MouseEvent) => {
      if (e.target instanceof Element &&
          e.target.closest('a, button, [role="button"], .cursor-pointer, .interactive')) {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseenter", onEnter, true)
    document.addEventListener("mouseleave", onLeave, true)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseenter", onEnter, true)
      document.removeEventListener("mouseleave", onLeave, true)
    }
  }, [isTouchDevice, rawX, rawY])

  if (!mounted || isTouchDevice) return null

  const isDark = resolvedTheme === "dark"
  const color = isDark ? "#ffffff" : "#000000"

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: isHovering ? 28 : 8,
        height: isHovering ? 28 : 8,
        backgroundColor: isHovering ? "transparent" : color,
        border: isHovering ? `1.5px solid ${color}` : "none",
        transition: "width 0.15s ease, height 0.15s ease, background-color 0.15s ease, border 0.15s ease",
      }}
    />
  )
}
