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
            
            // FIX: Restored the highly dynamic point sizing so the particles look like a magnetic field again
            gl_PointSize = mix(2.2 + magneticInfluence * 2.0, 1.6, uExpand); 
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

          vec3 getIridescentColor(vec3 worldPos, vec3 normal, float time) {
            float angle = atan(worldPos.y, worldPos.x);
            float height = worldPos.z;
            float colorShift = angle * 0.6 + height * 0.4 + time * 0.2;
            
            vec3 color1 = vec3(0.5, 0.75, 1.0);
            vec3 color2 = vec3(0.75, 0.5, 1.0);
            vec3 color3 = vec3(1.0, 0.65, 0.75);
            
            vec3 iridescent = mix(color1, color2, sin(colorShift) * 0.5 + 0.5);
            iridescent = mix(iridescent, color3, cos(colorShift * 1.5) * 0.5 + 0.5);
            return iridescent;
          }
          
          void main() {
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.0, 0.8, vDistanceFromCenter);
            
            // Enforce a high minimum opacity so it never looks dim or hollow
            alpha = max(alpha, 0.7); 
            alpha = mix(alpha, 1.0, vMouseInfluence * 0.5);
            alpha = mix(alpha, 0.5, vExpand); 
            
            vec3 iridescent = getIridescentColor(vWorldPosition, vNormal, uTime);
            
            // FIXED: Changed uExpand to vExpand here!
            vec3 finalColor = iridescent * mix(6.5, 2.5, vExpand);
            
            if (uIsDark < 0.5) {
                finalColor = vec3(0.05, 0.05, 0.05); 
                alpha = mix(alpha, 0.8, vExpand); 
            }

            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending, 
      }),
    [],
  )

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