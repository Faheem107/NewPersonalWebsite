"use client"

import React, { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring for cursor position
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 })

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()
    
    if (isTouchDevice) return

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target
      if (target instanceof Element && target.closest('a, button, [role="button"], .cursor-pointer, .interactive')) {
        setIsHovering(true)
      }
    }

    const onMouseLeave = (e: MouseEvent) => {
      const target = e.target
      if (target instanceof Element && target.closest('a, button, [role="button"], .cursor-pointer, .interactive')) {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter, true)
    document.addEventListener('mouseleave', onMouseLeave, true)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter, true)
      document.removeEventListener('mouseleave', onMouseLeave, true)
    }
  }, [isTouchDevice, mouseX, mouseY])

  if (isTouchDevice) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-foreground mix-blend-difference"
      animate={{
        width: isHovering ? 40 : 8,
        height: isHovering ? 40 : 8,
      }}
      transition={{
        width: { type: "spring", stiffness: 300, damping: 20 },
        height: { type: "spring", stiffness: 300, damping: 20 },
      }}
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  )
}
