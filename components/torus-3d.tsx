"use client"

import React, { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function TorusMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.28
    meshRef.current.rotation.y += delta * 0.42
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.1, 0.38, 64, 128]} />
      <meshStandardMaterial
        color="#888888"
        roughness={0.3}
        metalness={0.7}
        wireframe={false}
      />
    </mesh>
  )
}

export default function Torus3D() {
  return (
    <div className="w-full flex justify-center">
      <div style={{ width: 260, height: 260 }}>
        <Canvas
          camera={{ position: [0, 0, 3.6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 4, 4]} intensity={1.4} />
          <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#aaaaff" />
          <TorusMesh />
        </Canvas>
      </div>
    </div>
  )
}
