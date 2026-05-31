"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

declare global {
  interface Window {
    THREE: any;
    p5: any;
    VANTA: any;
  }
}

type VantaType = "dots" | "net" | "halo" | "trunk"

const loadScript = (src: string, globalCheck: () => boolean): Promise<void> => {
  return new Promise((resolve) => {
    if (globalCheck()) {
      resolve()
      return
    }

    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      const interval = setInterval(() => {
        if (globalCheck()) {
          clearInterval(interval)
          resolve()
        }
      }, 50)
      setTimeout(() => clearInterval(interval), 4000)
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => resolve()
    document.body.appendChild(script)
  })
}

export default function VantaBackground({ type = "dots" }: { type?: VantaType }) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  useEffect(() => {
    let vantaEffect: any = null
    let isCancelled = false

    const initVanta = async () => {
      if (type === "trunk") {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js", () => !!window.p5)
      } else {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js", () => !!window.THREE)
      }

      if (isCancelled) return

      let scriptSrc = ""
      let checkGlobal = () => false

      if (type === "dots") {
        scriptSrc = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js"
        checkGlobal = () => !!(window.VANTA && window.VANTA.DOTS)
      } else if (type === "net") {
        scriptSrc = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        checkGlobal = () => !!(window.VANTA && window.VANTA.NET)
      } else if (type === "halo") {
        scriptSrc = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js"
        checkGlobal = () => !!(window.VANTA && window.VANTA.HALO)
      } else if (type === "trunk") {
        scriptSrc = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.trunk.min.js"
        checkGlobal = () => !!(window.VANTA && window.VANTA.TRUNK)
      }

      await loadScript(scriptSrc, checkGlobal)

      if (isCancelled || !vantaRef.current || !window.VANTA) return

      // Use a richer black (0x111111) in light mode for better contrast
      const fgColor = isDark ? 0xffffff : 0x111111
      const bgColor = isDark ? 0x000000 : 0xffffff

      try {
        if (vantaRef.current) {
          vantaRef.current.innerHTML = ""
        }

        if (type === "dots" && window.VANTA.DOTS) {
          vantaEffect = window.VANTA.DOTS({
            el: vantaRef.current,
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.0, minWidth: 200.0, scale: 1.0, scaleMobile: 1.0,
            color: fgColor, color2: fgColor,
            backgroundColor: bgColor, backgroundAlpha: 0,
            size: 2.1, spacing: 18.0
          })
        } else if (type === "net" && window.VANTA.NET) {
          vantaEffect = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.0, minWidth: 200.0, scale: 1.0, scaleMobile: 1.0,
            color: fgColor,
            backgroundColor: bgColor, backgroundAlpha: 0
          })
        } else if (type === "halo" && window.VANTA.HALO) {
          vantaEffect = window.VANTA.HALO({
            el: vantaRef.current,
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.0, minWidth: 200.0,
            baseColor: fgColor, 
            backgroundColor: bgColor, backgroundAlpha: 0,
            amplitudeFactor: 1.5 // Boosts the ring intensity slightly
          })
        } else if (type === "trunk" && window.VANTA.TRUNK) {
          vantaEffect = window.VANTA.TRUNK({
            el: vantaRef.current,
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.0, minWidth: 200.0, scale: 1.0, scaleMobile: 1.0,
            color: fgColor,
            backgroundColor: bgColor, backgroundAlpha: 0
          })
        }
      } catch (e) {
        console.error("Vanta failed to initialize:", e)
      }
    }

    initVanta()

    return () => {
      isCancelled = true
      if (vantaEffect && typeof vantaEffect.destroy === "function") {
        vantaEffect.destroy()
      }
    }
  }, [type, isDark])

  // Dynamically boost opacity to 40% in light mode so it doesn't wash out against the white background
  const opacityClass = isDark ? "opacity-25" : "opacity-40"

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none mix-blend-normal ${opacityClass}`}>
      <div ref={vantaRef} className="w-full h-full" />
    </div>
  )
}