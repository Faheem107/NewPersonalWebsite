'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTheme } from 'next-themes'
import * as THREE from 'three'
import { CAMERA_Z, SPHERE_RADIUS, TORUS_RADIUS, TUBE_RADIUS } from '@/lib/torus-geometry'

/** Frame-rate independent exponential smoothing. */
function approach(current: number, goal: number, dt: number, rate: number) {
  return current + (goal - current) * (1 - Math.exp(-dt * rate))
}

const SCATTER_JITTER = 2.2
const SCATTER_NEAR = 3.6
const SCATTER_FAR = CAMERA_Z * 0.78

export function TorusShader({ explode = false }: { explode?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  // A ref, not state: this is written on every pointer move, and a setState
  // there re-renders the whole hero for a value only the shader reads.
  const mouse3D = useRef(new THREE.Vector3(0, 0, -10))
  const { camera, gl } = useThree()

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  // `scatter` is where each point starts, out along its own direction from the
  // centre, so it travels inward to its place rather than across the form.
  // `seed` roughens the order of arrival.
  const { positions, scatter, seed } = useMemo(() => {
    const torusGeometry = new THREE.TorusGeometry(TORUS_RADIUS, TUBE_RADIUS, 80, 160)
    const positions = torusGeometry.attributes.position.array as Float32Array
    const count = positions.length / 3

    const scatter = new Float32Array(positions.length)
    const seed = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // The point's own direction, loosened, so neighbours start near each
      // other without the cloud being a scaled copy of the torus.
      const x = positions[i * 3] + (Math.random() * 2 - 1) * SCATTER_JITTER
      const y = positions[i * 3 + 1] + (Math.random() * 2 - 1) * SCATTER_JITTER
      const z = positions[i * 3 + 2] + (Math.random() * 2 - 1) * SCATTER_JITTER
      const len = Math.hypot(x, y, z) || 1

      // Kept inside the camera distance. The form tumbles, so any direction can
      // end up facing the lens, and a point starting beyond it crosses the near
      // plane as a flash.
      const dist = SCATTER_NEAR + Math.pow(Math.random(), 0.6) * (SCATTER_FAR - SCATTER_NEAR)

      scatter[i * 3] = (x / len) * dist
      scatter[i * 3 + 1] = (y / len) * dist
      scatter[i * 3 + 2] = (z / len) * dist
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
          uCameraZ: { value: CAMERA_Z },
          // From lib/torus-geometry, so the DOM and the shader cannot drift
          // apart on what size the shape is.
          uRadius: { value: TORUS_RADIUS },
          uSphereRadius: { value: SPHERE_RADIUS },
        },
        vertexShader: `
          uniform float uTime;
          uniform vec3 uMouse;
          uniform float uMagnetStrength;
          uniform float uExpand;
          uniform float uIntro;
          uniform float uRadius;
          uniform float uSphereRadius;
          attribute vec3 scatter;
          attribute float seed;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
          varying float vExpand;
          varying float vIntro;

          void main() {
            vec3 pos = position;
            vExpand = uExpand;

            // Small enough not to read as a scale animation, large enough that
            // the surface is never quite still.
            float breathe = 1.0 + 0.022 * sin(uTime * 0.55);
            // A travelling ripple around the ring, so the motion has a
            // direction rather than pulsing uniformly.
            float ripple = sin(atan(pos.y, pos.x) * 3.0 - uTime * 0.9) * 0.035;
            pos *= breathe + ripple;

            vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
            vWorldPosition = worldPos;
            vNormal = normalize((modelMatrix * vec4(normalize(pos), 0.0)).xyz);

            float distToMouse = length(worldPos - uMouse);
            float magneticInfluence = smoothstep(4.0, 0.0, distToMouse);
            magneticInfluence = pow(magneticInfluence, 0.7);

            vec3 direction = normalize(uMouse - worldPos);
            vec3 perpendicular = cross(direction, vec3(0.0, 0.0, 1.0));
            pos += direction * magneticInfluence * uMagnetStrength;
            pos += perpendicular * magneticInfluence * 0.4 * sin(uTime * 2.0 + length(worldPos) * 3.0);

            float angleXY = atan(position.y, position.x);
            float angleTube = atan(position.z, length(position.xy) - uRadius);

            vec3 spherePos;
            spherePos.x = cos(angleXY) * cos(angleTube) * uSphereRadius;
            spherePos.y = sin(angleXY) * cos(angleTube) * uSphereRadius;
            spherePos.z = sin(angleTube) * uSphereRadius;

            // Proportional to the radius, so the wobble stays a wobble at any
            // size rather than rounding the ball into a cube.
            spherePos += normalize(spherePos) * sin(uTime * 1.2 + angleXY * 4.0) * (uSphereRadius * 0.042);

            pos = mix(pos, spherePos, smoothstep(0.0, 1.0, uExpand));

            // Assembly. The order of arrival runs both ways round the ring
            // from one side and closes on the other, roughened by the seed so
            // the front is a band rather than a line.
            //
            // Start times spread across 0.58 of the intro and each point takes
            // 0.42 to settle, so the windows overlap heavily and the last point
            // lands exactly as the intro ends. Without the overlap the form
            // solidifies early and then collects stragglers on top of itself.
            //
            // Applied last, so it overrides the magnet and the expand: nothing
            // should tug at a point that has not arrived yet.
            float sweep = abs(atan(position.y, position.x)) / 3.14159265;
            float order = mix(seed, sweep, 0.55);
            float t = clamp((uIntro - order * 0.58) / 0.42, 0.0, 1.0);
            // Smootherstep: zero velocity at both ends, so there is no kick as
            // a point leaves the cloud and none as it lands.
            float ease = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
            vIntro = ease;

            // A little spin on the way in, so points arc rather than travelling
            // in straight lines.
            float swirl = (1.0 - ease) * 0.9;
            float cs = cos(swirl), sn = sin(swirl);
            vec3 from = vec3(scatter.x * cs - scatter.y * sn, scatter.x * sn + scatter.y * cs, scatter.z);

            pos = mix(from, pos, ease);

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // Arriving points run only slightly larger. Any more and late
            // arrivals read as blobs dropping onto the surface.
            float introSize = 1.0 + (1.0 - ease) * 0.7;
            gl_PointSize = mix(2.2 + magneticInfluence * 1.0, 1.25, uExpand) * introSize * (30.0 / -mvPosition.z);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uIsDark;
          uniform float uCameraZ;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
          varying float vExpand;
          varying float vIntro;

          const float TAU = 6.28318530718;

          /** Four stops, wrapped, so the ramp closes on itself. */
          vec3 ramp(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
            t = fract(t) * 4.0;
            if (t < 1.0) return mix(a, b, t);
            if (t < 2.0) return mix(b, c, t - 1.0);
            if (t < 3.0) return mix(c, d, t - 2.0);
            return mix(d, a, t - 3.0);
          }

          /**
           * A toned cyanotype.
           *
           * An untoned print is one hue: Prussian blue, light to dark. Toning it
           * in gold carries the deepest parts over into violet and then to a
           * warm copper, which is the range this ramps through. The stop a point
           * takes comes from where it sits around the ring, so the toning
           * travels rather than being painted onto the form.
           *
           * The whole ramp is deliberately kept off white. Dark mode blends
           * additively, so points on the near face sum, and any stop close to
           * 1.0 clips the silhouette to a flat white ring.
           */
          vec3 getSurfaceColor(vec3 worldPos, float time, float isDarkTheme) {
            float angle = atan(worldPos.y, worldPos.x);
            float height = worldPos.z;

            float around = angle / TAU + height * 0.05 + time * 0.02;

            vec3 base = isDarkTheme > 0.5
              ? ramp(
                  vec3(0.05, 0.19, 0.46),
                  vec3(0.08, 0.56, 0.74),
                  vec3(0.36, 0.32, 0.80),
                  vec3(0.78, 0.44, 0.30),
                  around)
              : ramp(
                  vec3(0.03, 0.14, 0.35),
                  vec3(0.03, 0.39, 0.57),
                  vec3(0.25, 0.20, 0.57),
                  vec3(0.60, 0.29, 0.17),
                  around);

            // Form shading, kept separate from the toning: one says which way
            // the surface is turned, the other says where round the print it is.
            float lit = 0.60 + 0.40 * (sin(angle * 0.8 + height * 0.9 + time * 0.22) * 0.5 + 0.5);
            return base * lit;
          }

          void main() {
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);

            if (dist > 0.5) discard;

            float alpha = smoothstep(0.5, 0.35, dist);

            vec3 finalColor = getSurfaceColor(vWorldPosition, uTime, uIsDark);

            // A pale edge where the surface turns away from the camera, so the
            // silhouette has a line and the form reads as solid. Small: on the
            // silhouette a great many points overlap, and anything stronger
            // sums to white there.
            vec3 viewDir = normalize(vec3(0.0, 0.0, uCameraZ) - vWorldPosition);
            float rim = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 3.0);
            finalColor += vec3(0.16, 0.22, 0.30) * rim * (1.0 - vExpand);

            if (uIsDark < 0.5) {
              finalColor *= mix(1.12, 0.95, vExpand);
              alpha *= mix(0.96, 0.78, vExpand);
            } else {
              // Additive, so this is a gain rather than a blend.
              finalColor *= mix(0.94, 0.72, vExpand);
              alpha *= mix(0.34, 0.24, vExpand);
            }

            // Points fade up over the first part of the flight and run a little
            // hotter until they land, so the assembly reads as light resolving
            // into a form rather than dots switching on in place.
            finalColor += vec3(0.22, 0.36, 0.58) * (1.0 - vIntro) * 0.3;
            alpha *= smoothstep(0.0, 0.7, vIntro);

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
      // Normalised against the canvas, not the window: the camera's aspect is
      // the canvas's, so dividing by innerWidth lands the magnet target nowhere
      // near the pointer.
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      const vector = new THREE.Vector3(x, y, 0.5)
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      mouse3D.current.copy(camera.position).add(dir.multiplyScalar(distance))
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [camera, gl])

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return

    const u = materialRef.current.uniforms
    const t = state.clock.elapsedTime
    // The first frame carries shader compilation and the first upload, so it
    // can be hundreds of milliseconds. Uncapped, that jumps a visible chunk of
    // the intro before anything has been drawn.
    const dt = Math.min(delta, 1 / 30)

    if (u.uIntro.value < 1) {
      u.uIntro.value = Math.min(1, u.uIntro.value + dt / 3.2)
    }
    const intro = u.uIntro.value

    // Spin about the ring's own axis, the one rotation that always looks right,
    // so it is the only one allowed to accumulate. Faster while the points
    // arrive, settling to its resting speed.
    pointsRef.current.rotation.y += (0.24 + (1 - intro) * (1 - intro) * 0.72) * dt

    // Tilt and roll oscillate around a fixed pose rather than accumulating.
    // Left to accumulate, the torus drifts edge-on, where the tube stacks on
    // itself and additive blending clips the silhouette to white.
    pointsRef.current.rotation.x = 0.46 + Math.sin(t * 0.17) * 0.16
    pointsRef.current.rotation.z = Math.sin(t * 0.13) * 0.2
    pointsRef.current.position.y = Math.sin(t * 0.42) * 0.09

    u.uTime.value = t
    u.uMouse.value.copy(mouse3D.current)
    u.uIsDark.value = isDark ? 1.0 : 0.0

    materialRef.current.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending

    u.uExpand.value = approach(u.uExpand.value, explode ? 1.0 : 0.0, dt, 3.2)

    // The magnet all but switches off once the menu is open: the pointer is
    // necessarily inside the form whenever the icons are showing, and at full
    // strength it drags one side of the ball out into a lobe that no ring of
    // icons is concentric with.
    u.uMagnetStrength.value = approach(u.uMagnetStrength.value, explode ? 0.12 : 1.0, dt, 3.8)
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
