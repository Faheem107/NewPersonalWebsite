"use client"

import React, { useEffect, useState, useRef } from "react"

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()
    
    if (isTouchDevice) return

    // Smooth lerp animation
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      const smoothFactor = 0.15 // Lower = smoother, higher = snappier
      
      positionRef.current.x = lerp(positionRef.current.x, targetRef.current.x, smoothFactor)
      positionRef.current.y = lerp(positionRef.current.y, targetRef.current.y, smoothFactor)
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) translate(-50%, -50%)`
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
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

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate)

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter, true)
    document.addEventListener('mouseleave', onMouseLeave, true)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter, true)
      document.removeEventListener('mouseleave', onMouseLeave, true)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isTouchDevice])

  if (isTouchDevice) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-foreground mix-blend-difference transition-[width,height] duration-200 ease-out"
      style={{
        width: isHovering ? 32 : 10,
        height: isHovering ? 32 : 10,
      }}
    />
  )
}
