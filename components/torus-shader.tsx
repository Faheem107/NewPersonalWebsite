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

  // `scatter` is where each point starts: somewhere on a loose shell around the
  // torus. `seed` staggers its arrival, so the form assembles rather than
  // appearing whole. Both are computed once and uploaded as attributes; doing
  // it from a hash in the shader would be cheaper but far less controllable.
  const { positions, scatter, seed } = useMemo(() => {
    const torusGeometry = new THREE.TorusGeometry(1.8, 0.6, 80, 160)
    const positions = torusGeometry.attributes.position.array as Float32Array
    const count = positions.length / 3

    const scatter = new Float32Array(positions.length)
    const seed = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Uniform direction on a sphere.
      const u = Math.random() * 2 - 1
      const theta = Math.random() * Math.PI * 2
      const r = Math.sqrt(1 - u * u)

      // Heavy-tailed radius rather than a narrow shell. A shell has an edge,
      // and on a dark page that edge is plainly visible: the intro read as a
      // hollow ball collapsing. Raising a uniform to a small power puts most
      // points close and a long tail far off past the viewport, so the cloud
      // has no boundary to see.
      const dist = 5 + Math.pow(Math.random(), 0.28) * 55

      scatter[i * 3] = Math.cos(theta) * r * dist
      scatter[i * 3 + 1] = Math.sin(theta) * r * dist
      scatter[i * 3 + 2] = u * dist
      seed[i] = Math.random()
    }

    return { positions, scatter, seed }
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
          uIntro: { value: 0.0 },
        },
        vertexShader: `
          uniform float uTime;
          uniform vec3 uMouse;
          uniform float uMagnetStrength;
          uniform float uExpand;
          uniform float uIntro;
          attribute vec3 scatter;
          attribute float seed;
          varying float vDistanceFromCenter;
          varying float vMouseInfluence;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
          varying float vExpand;
          varying float vIntro;

          void main() {
            vec3 pos = position;
            vExpand = uExpand;

            // Breathing. Small enough not to read as a scale animation, large
            // enough that the surface is never quite still.
            float breathe = 1.0 + 0.022 * sin(uTime * 0.55);
            // A slow travelling ripple around the ring, so the motion has a
            // direction rather than pulsing uniformly.
            float ripple = sin(atan(pos.y, pos.x) * 3.0 - uTime * 0.9) * 0.035;
            pos *= breathe + ripple;

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

            // Assembly. Each point has its own start time from its seed, so the
            // torus gathers itself out of the cloud over the intro rather than
            // every point landing at once. Applied last, so it overrides the
            // magnet and the expand: nothing should tug at a point that has not
            // arrived yet.
            // Arrivals are spread across most of the intro rather than bunched,
            // so points keep streaming in instead of landing as one front.
            float t = clamp((uIntro - seed * 0.72) / 0.28, 0.0, 1.0);
            // Eased out hard: fast while distant, slow as it settles.
            float ease = 1.0 - pow(1.0 - t, 3.0);
            vIntro = ease;

            // A little spin on the way in, so points arc rather than travelling
            // in straight lines.
            float swirl = (1.0 - ease) * 1.6;
            float cs = cos(swirl), sn = sin(swirl);
            vec3 from = vec3(scatter.x * cs - scatter.y * sn, scatter.x * sn + scatter.y * cs, scatter.z);

            pos = mix(from, pos, ease);

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // Arriving points are briefly larger, which reads as them settling.
            float introSize = 1.0 + (1.0 - ease) * 1.8;
            gl_PointSize = mix(2.2 + magneticInfluence * 1.0, 1.5, uExpand) * introSize * (30.0 / -mvPosition.z);
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
          varying float vIntro;

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
                finalColor = surface * mix(0.92, 0.7, vExpand);
                alpha *= mix(0.34, 0.26, vExpand);
            }

            // Points fade up as they arrive, and run hotter while in flight,
            // so the assembly reads as light resolving into a form.
            finalColor += vec3(0.20, 0.38, 0.58) * (1.0 - vIntro) * 0.5;
            alpha *= vIntro;

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

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return

    const u = materialRef.current.uniforms
    const t = state.clock.elapsedTime

    // Intro runs once, over about two and a half seconds.
    if (u.uIntro.value < 1) {
      u.uIntro.value = Math.min(1, u.uIntro.value + delta / 2.5)
    }
    const intro = u.uIntro.value

    // Spin about the ring's own axis. This is the one rotation that always
    // looks right, so it is the only one allowed to accumulate. It runs fast
    // as the points arrive and settles into its resting speed, which is most
    // of what makes the entrance feel like motion rather than a fade.
    pointsRef.current.rotation.y += 0.004 + (1 - intro) * (1 - intro) * 0.02

    // Tilt and roll oscillate around a fixed pose rather than accumulating.
    // Left to accumulate, the torus drifts edge-on, where the tube stacks on
    // itself and additive blending clips the whole silhouette to white.
    pointsRef.current.rotation.x = 0.46 + Math.sin(t * 0.17) * 0.16
    pointsRef.current.rotation.z = Math.sin(t * 0.13) * 0.2
    pointsRef.current.position.y = Math.sin(t * 0.42) * 0.09

    u.uTime.value = t
    u.uMouse.value.copy(mouse3D)
    u.uIsDark.value = isDark ? 1.0 : 0.0

    materialRef.current.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending

    u.uExpand.value = THREE.MathUtils.lerp(u.uExpand.value, explode ? 1.0 : 0.0, 0.05)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-scatter" args={[scatter, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seed, 1]} />
      </bufferGeometry>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </points>
  )
}