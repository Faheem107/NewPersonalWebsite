"use client"

import React from "react"
import { Canvas } from "@react-three/fiber"
import { TorusShader } from "@/components/torus-shader"

export default function Torus3D() {
  return (
    <div className="w-full flex justify-center">
      <div style={{ width: 280, height: 280 }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <TorusShader />
        </Canvas>
      </div>
    </div>
  )
}
