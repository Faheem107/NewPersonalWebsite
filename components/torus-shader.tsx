"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"

export function TorusShader({ explode = false }: { explode?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [mouse3D, setMouse3D] = useState(new THREE.Vector3(0, 0, -10))
  const { camera } = useThree()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const { positions, count } = useMemo(() => {
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.6, 128, 256)
    const positions = torusGeometry.attributes.position.array
    const count = positions.length / 3
    return { positions, count }
  }, [])

  // Particle base color: white on dark, near-black on light
  const baseColor = isDark ? [1.0, 1.0, 1.0] : [0.08, 0.08, 0.08]

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector3(0, 0, -10) },
          uMagnetStrength: { value: 0.9 },
          uExplode: { value: 0.0 },
          uBaseColor: { value: new THREE.Vector3(0.08, 0.08, 0.08) },
        },
        vertexShader: `
          uniform float uTime;
          uniform vec3 uMouse;
          uniform float uMagnetStrength;
          uniform float uExplode;
          varying float vDistanceFromCenter;
          varying float vMouseInfluence;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
          void main() {
            vec3 pos = position;

            // Organic noise-driven drift
            float noiseX = sin(pos.x * 1.3 + uTime * 0.4) * cos(pos.y * 0.9 + uTime * 0.3) * 0.06;
            float noiseY = cos(pos.z * 1.1 + uTime * 0.35) * sin(pos.x * 0.8 + uTime * 0.45) * 0.06;
            pos += vec3(noiseX, noiseY, 0.0);

            // Explode outward
            if (uExplode > 0.0) {
              float len = length(pos);
              pos += normalize(pos) * uExplode * 2.5;
            }

            float radius = 1.5;
            float tubeRadius = 0.6;
            vec2 center = normalize(pos.xy) * radius;
            float distFromTube = length(pos.xy - center);
            vDistanceFromCenter = 1.0 - (distFromTube / tubeRadius);
            vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
            vWorldPosition = worldPos;
            vNormal = normalize((modelMatrix * vec4(normalize(pos), 0.0)).xyz);
            float distToMouse = length(worldPos - uMouse);
            float magneticInfluence = smoothstep(3.0, 0.0, distToMouse);
            magneticInfluence = pow(magneticInfluence, 0.7);
            vMouseInfluence = magneticInfluence;
            vec3 direction = normalize(uMouse - worldPos);
            vec3 perpendicular = cross(direction, vec3(0.0, 0.0, 1.0));
            pos += direction * magneticInfluence * uMagnetStrength;
            pos += perpendicular * magneticInfluence * 0.5 * sin(uTime * 2.0 + length(worldPos) * 3.0);
            float wave = sin(distToMouse * 5.0 - uTime * 3.0) * magneticInfluence * 0.2;
            pos += direction * wave;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = 2.0 + magneticInfluence * 2.0;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uBaseColor;
          varying float vDistanceFromCenter;
          varying float vMouseInfluence;
          void main() {
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.0, 0.8, vDistanceFromCenter);
            alpha = mix(alpha, 1.0, vMouseInfluence * 0.8);
            // Subtle iridescent tint on hover, otherwise pure base color
            vec3 tint = mix(uBaseColor, vec3(0.6, 0.8, 1.0), vMouseInfluence * 0.25);
            gl_FragColor = vec4(tint, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  // Keep uniforms synced to theme changes and explode prop without recreating material
  if (materialRef.current) {
    materialRef.current.uniforms.uBaseColor.value.set(...(baseColor as [number, number, number]))
    materialRef.current.uniforms.uExplode.value = explode ? 1.0 : 0.0
  }

  const handlePointerMove = (event: { pointer: THREE.Vector2 }) => {
    if (!pointsRef.current) return
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(event.pointer, camera)
    const planeNormal = new THREE.Vector3(0, 0, 1)
    const planePoint = new THREE.Vector3(0, 0, pointsRef.current.position.z)
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, planePoint)
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersectPoint)
    if (intersectPoint) setMouse3D(intersectPoint)
  }

  useFrame((state) => {
    if (pointsRef.current && materialRef.current) {
      // Organic gentle rotation
      pointsRef.current.rotation.y += 0.003 + Math.sin(state.clock.elapsedTime * 0.2) * 0.001
      pointsRef.current.rotation.x += 0.0015 + Math.cos(state.clock.elapsedTime * 0.15) * 0.0008
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMouse.value.copy(mouse3D)
      materialRef.current.uniforms.uBaseColor.value.set(...(baseColor as [number, number, number]))
    }
  })

  return (
    <points ref={pointsRef} onPointerMove={handlePointerMove}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions as Float32Array, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </points>
  )
}
