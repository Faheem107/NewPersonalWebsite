"use client"

import React, { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()
    
    if (isTouchDevice) return

    // Smooth lerp animation with very smooth interpolation
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      // Very smooth factor for natural movement
      const smoothFactor = 0.12
      
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

  if (isTouchDevice || !mounted) return null

  // Black cursor in light mode, white cursor in dark mode
  const cursorColor = resolvedTheme === 'dark' ? 'white' : 'black'

  // In light mode: solid black dot. In dark mode: solid white dot. No blend mode needed.
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        width: isHovering ? 24 : 7,
        height: isHovering ? 24 : 7,
        backgroundColor: cursorColor,
        border: isHovering ? `2px solid ${cursorColor}` : 'none',
        background: isHovering ? 'transparent' : cursorColor,
        transition: 'width 0.18s ease, height 0.18s ease, background 0.18s ease, border 0.18s ease',
      }}
    />
  )
}
