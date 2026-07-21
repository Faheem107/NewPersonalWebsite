"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"

export function TorusShader({ explode = false }: { explode?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [mouse3D, setMouse3D] = useState(new THREE.Vector3(0, 0, -10))
  const { camera } = useThree()
  
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  const { positions } = useMemo(() => {
    const torusGeometry = new THREE.TorusGeometry(1.8, 0.6, 80, 160)
    const positions = torusGeometry.attributes.position.array
    return { positions }
  }, [])

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector3(0, 0, -10) },
          uMagnetStrength: { value: 1.0 },
          uExpand: { value: 0.0 }, 
          uIsDark: { value: 1.0 }, 
        },
        vertexShader: `
          uniform float uTime;
          uniform vec3 uMouse;
          uniform float uMagnetStrength;
          uniform float uExpand;
          varying float vDistanceFromCenter;
          varying float vMouseInfluence;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
          varying float vExpand;

          void main() {
            vec3 pos = position;
            vExpand = uExpand;

            float radius = 1.8;
            float tubeRadius = 0.6;
            vec2 center = normalize(pos.xy) * radius;
            float distFromTube = length(pos.xy - center);
            vDistanceFromCenter = 1.0 - (distFromTube / tubeRadius);
            
            vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
            vWorldPosition = worldPos;
            vNormal = normalize((modelMatrix * vec4(normalize(pos), 0.0)).xyz);
            
            float distToMouse = length(worldPos - uMouse);
            float magneticInfluence = smoothstep(4.0, 0.0, distToMouse);
            magneticInfluence = pow(magneticInfluence, 0.7);
            vMouseInfluence = magneticInfluence;
            
            vec3 direction = normalize(uMouse - worldPos);
            vec3 perpendicular = cross(direction, vec3(0.0, 0.0, 1.0));
            pos += direction * magneticInfluence * uMagnetStrength;
            pos += perpendicular * magneticInfluence * 0.4 * sin(uTime * 2.0 + length(worldPos) * 3.0);

            float angleXY = atan(position.y, position.x);
            float angleTube = atan(position.z, length(position.xy) - radius);

            float targetRadius = 3.6;
            vec3 spherePos;
            spherePos.x = cos(angleXY) * cos(angleTube) * targetRadius;
            spherePos.y = sin(angleXY) * cos(angleTube) * targetRadius;
            spherePos.z = sin(angleTube) * targetRadius;
            
            spherePos += normalize(spherePos) * sin(uTime * 1.2 + angleXY * 4.0) * 0.15;

            pos = mix(pos, spherePos, smoothstep(0.0, 1.0, uExpand));

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            gl_PointSize = mix(2.2 + magneticInfluence * 1.0, 1.5, uExpand) * (30.0 / -mvPosition.z); 
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uIsDark;
          varying float vDistanceFromCenter;
          varying float vMouseInfluence;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
          varying float vExpand;

          // Cyanotype, not iridescence. Three closely related cold blues rather
          // than three opposing hues, so the surface reads as one material
          // catching light instead of an oil slick.
          vec3 getSurfaceColor(vec3 worldPos, vec3 normal, float time, float isDarkTheme) {
            float angle = atan(worldPos.y, worldPos.x);
            float height = worldPos.z;
            float shift = angle * 0.8 + height * 0.5 + time * 0.18;

            vec3 shadow, body, highlight;

            if (isDarkTheme > 0.5) {
              shadow    = vec3(0.10, 0.24, 0.38);
              body      = vec3(0.33, 0.55, 0.74);
              highlight = vec3(0.72, 0.87, 0.97);
            } else {
              shadow    = vec3(0.05, 0.19, 0.33);
              body      = vec3(0.11, 0.31, 0.47);
              highlight = vec3(0.44, 0.66, 0.81);
            }

            vec3 c = mix(shadow, body, sin(shift) * 0.5 + 0.5);
            c = mix(c, highlight, pow(cos(shift * 1.3) * 0.5 + 0.5, 2.0));
            return c;
          }
          
          void main() {
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.35, dist);
            
            vec3 surface = getSurfaceColor(vWorldPosition, vNormal, uTime, uIsDark);
            vec3 finalColor;

            if (uIsDark < 0.5) {
                finalColor = surface * mix(1.15, 0.95, vExpand);
                alpha *= mix(0.92, 0.7, vExpand);
            } else {
                // Was multiplied by 14, which clipped every channel and left a flat
                // white ring. A gain just above 1 keeps the blues as blues.
                finalColor = surface * mix(1.45, 0.85, vExpand);
                alpha *= mix(0.95, 0.55, vExpand);
            }

            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending, 
      }),
    [isDark],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      
      const vector = new THREE.Vector3(x, y, 0.5)
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      const pos = camera.position.clone().add(dir.multiplyScalar(distance))
      
      setMouse3D(pos)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [camera])

  useFrame((state) => {
    if (pointsRef.current && materialRef.current) {
      pointsRef.current.rotation.y += 0.004
      pointsRef.current.rotation.x += 0.001

      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMouse.value.copy(mouse3D)
      materialRef.current.uniforms.uIsDark.value = isDark ? 1.0 : 0.0
      
      materialRef.current.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending

      const currentExpand = materialRef.current.uniforms.uExpand.value
      const targetExpand = explode ? 1.0 : 0.0
      materialRef.current.uniforms.uExpand.value = THREE.MathUtils.lerp(currentExpand, targetExpand, 0.05)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </points>
  )
}