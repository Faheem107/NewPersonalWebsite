"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"

// +30% scale: base radii 1.5→1.95, tube 0.6→0.78
export function TorusShader({ explode = false }: { explode?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [mouse3D, setMouse3D] = useState(new THREE.Vector3(0, 0, -10))
  const { camera } = useThree()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  const { positions, count } = useMemo(() => {
    // 30% larger geometry
    const geo = new THREE.TorusGeometry(1.95, 0.78, 128, 256)
    const positions = geo.attributes.position.array
    const count = positions.length / 3
    return { positions, count }
  }, [])

  // Dark: glowing white/silver. Light: solid matte jet-black.
  const baseColor: [number, number, number] = isDark ? [1.0, 1.0, 1.0] : [0.04, 0.04, 0.04]
  const glowColor: [number, number, number] = isDark ? [0.75, 0.88, 1.0] : [0.04, 0.04, 0.04]

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime:          { value: 0 },
          uMouse:         { value: new THREE.Vector3(0, 0, -10) },
          uMagnetStrength:{ value: 0.9 },
          uExplode:       { value: 0.0 },
          uBaseColor:     { value: new THREE.Vector3(...baseColor) },
          uGlowColor:     { value: new THREE.Vector3(...glowColor) },
        },
        vertexShader: /* glsl */`
          uniform float uTime;
          uniform vec3  uMouse;
          uniform float uMagnetStrength;
          uniform float uExplode;
          varying float vDistanceFromCenter;
          varying float vMouseInfluence;
          void main() {
            vec3 pos = position;

            // Organic breathe
            float noiseX = sin(pos.x * 1.3 + uTime * 0.38) * cos(pos.y * 0.9  + uTime * 0.27) * 0.07;
            float noiseY = cos(pos.z * 1.1 + uTime * 0.33) * sin(pos.x * 0.8  + uTime * 0.43) * 0.07;
            pos += vec3(noiseX, noiseY, 0.0);

            // Explode
            if (uExplode > 0.0) {
              pos += normalize(pos) * uExplode * 3.0;
            }

            // Distance from torus tube surface
            float radius     = 1.95;
            float tubeRadius = 0.78;
            vec2  center2d   = normalize(pos.xy) * radius;
            float distFromTube = length(pos.xy - center2d);
            vDistanceFromCenter = 1.0 - clamp(distFromTube / tubeRadius, 0.0, 1.0);

            // Mouse magnet
            vec3  worldPos  = (modelMatrix * vec4(pos, 1.0)).xyz;
            float dMouse    = length(worldPos - uMouse);
            float magnet    = pow(smoothstep(3.5, 0.0, dMouse), 0.7);
            vMouseInfluence = magnet;
            vec3  dir  = normalize(uMouse - worldPos);
            vec3  perp = cross(dir, vec3(0.0, 0.0, 1.0));
            pos += dir  * magnet * uMagnetStrength;
            pos += perp * magnet * 0.5 * sin(uTime * 2.0 + length(worldPos) * 3.0);
            pos += dir  * sin(dMouse * 5.0 - uTime * 3.0) * magnet * 0.2;

            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            gl_Position  = projectionMatrix * mvPos;
            gl_PointSize = 2.2 + magnet * 2.4;
          }
        `,
        fragmentShader: /* glsl */`
          uniform vec3  uBaseColor;
          uniform vec3  uGlowColor;
          varying float vDistanceFromCenter;
          varying float vMouseInfluence;
          void main() {
            vec2  c    = gl_PointCoord - 0.5;
            float dist = length(c);
            if (dist > 0.5) discard;

            float alpha = smoothstep(0.0, 0.85, vDistanceFromCenter);
            alpha       = mix(alpha, 1.0, vMouseInfluence * 0.9);

            // On dark: subtle silver-blue hover tint. On light: stays jet-black.
            vec3 col = mix(uBaseColor, uGlowColor, vMouseInfluence * 0.35);
            gl_FragColor = vec4(col, alpha);
          }
        `,
        transparent: true,
        depthWrite:  false,
        blending:    THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Sync theme + explode uniforms every frame (no material rebuild)
  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return
    const t = state.clock.getElapsedTime()

    // Beautiful infinite organic loop — no jerk, no discontinuity
    pointsRef.current.rotation.y = t * 0.28 + Math.sin(t * 0.18) * 0.22
    pointsRef.current.rotation.x = t * 0.14 + Math.cos(t * 0.13) * 0.12

    materialRef.current.uniforms.uTime.value         = t
    materialRef.current.uniforms.uMouse.value.copy(mouse3D)
    materialRef.current.uniforms.uExplode.value      = explode ? 1.0 : 0.0
    materialRef.current.uniforms.uBaseColor.value.set(...baseColor)
    materialRef.current.uniforms.uGlowColor.value.set(...glowColor)
  })

  const handlePointerMove = (e: { pointer: THREE.Vector2 }) => {
    if (!pointsRef.current) return
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(e.pointer, camera)
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, pointsRef.current.position.z),
    )
    const hit = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, hit)
    if (hit) setMouse3D(hit)
  }

  return (
    <points ref={pointsRef} onPointerMove={handlePointerMove}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions as Float32Array, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </points>
  )
}
