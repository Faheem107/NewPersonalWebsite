"use client"

import React, { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { TorusShader } from "@/components/torus-shader"
import { useTheme } from "next-themes"

export default function Torus3D() {
  const [hovered, setHovered] = useState(false)
  const { resolvedTheme } = useTheme()
  
  const isDark = resolvedTheme !== "light"
  const iconBg = isDark ? "rgba(15, 15, 15, 0.85)" : "rgba(255, 255, 255, 0.95)"
  const invertClass = isDark ? "invert" : ""

  return (
    <div 
      className="fixed inset-0 w-screen h-screen z-0 flex items-center justify-center bg-transparent overflow-hidden border-none outline-none m-0 p-0"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas 
        camera={{ position: [0, 0, 13], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full block"
        style={{ background: "transparent" }}
      >
        <TorusShader explode={hovered} />
      </Canvas>

      {/* DOM-Decoupled Icons: Zero lag, absolute positioning over the 3D space */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        
        {/* Left Icon (Music) */}
        <div 
          className={`absolute transform -translate-x-[20vw] -translate-y-[10vh] p-4 rounded-2xl transition-all duration-500 ease-out shadow-2xl backdrop-blur-md border border-white/10 ${
            hovered ? "opacity-100 scale-100 pointer-events-auto hover:scale-110 cursor-pointer" : "opacity-0 scale-75"
          }`}
          style={{ background: iconBg }}
        >
          <img src="/vinyl_ascii_pic.png" alt="Music" className={`w-16 h-16 ${invertClass}`} />
        </div>

        {/* Right Icon (Books) */}
        <div 
          className={`absolute transform translate-x-[20vw] translate-y-[5vh] p-4 rounded-2xl transition-all duration-500 ease-out shadow-2xl backdrop-blur-md border border-white/10 ${
            hovered ? "opacity-100 scale-100 pointer-events-auto hover:scale-110 cursor-pointer" : "opacity-0 scale-75"
          }`}
          style={{ background: iconBg }}
        >
          <img src="/book_ascii.png" alt="Books" className={`w-16 h-16 ${invertClass}`} />
        </div>

        {/* Bottom Icon (Movies) */}
        <div 
          className={`absolute transform translate-y-[25vh] p-4 rounded-2xl transition-all duration-500 ease-out shadow-2xl backdrop-blur-md border border-white/10 ${
            hovered ? "opacity-100 scale-100 pointer-events-auto hover:scale-110 cursor-pointer" : "opacity-0 scale-75"
          }`}
          style={{ background: iconBg }}
        >
          <img src="/movie_ascii_pic.png" alt="Movies" className={`w-16 h-16 ${invertClass}`} />
        </div>

      </div>
    </div>
  )
}