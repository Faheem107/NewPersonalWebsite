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

export function TorusShader({ explode = false }: { explode?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  // A ref, not state: this is written on every pointer move, and a setState
  // there re-renders the whole hero for a value only the shader reads.
  const mouse3D = useRef(new THREE.Vector3(0, 0, -10))
  const { camera, gl } = useThree()

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  // `seed` roughens the order the points arrive in, so the front of the intro
  // is a band rather than a line.
  const { positions, seed } = useMemo(() => {
    const RADIAL = 80
    const TUBULAR = 160
    const source = new THREE.TorusGeometry(TORUS_RADIUS, TUBE_RADIUS, RADIAL, TUBULAR).attributes
      .position.array as Float32Array

    // The geometry closes each loop by repeating its first vertex. As a mesh
    // that is a seam; as points it is one circle drawn twice, which shows as a
    // bright band around the tube.
    const positions = new Float32Array(RADIAL * TUBULAR * 3)
    let n = 0
    for (let j = 0; j < RADIAL; j++) {
      for (let i = 0; i < TUBULAR; i++) {
        const k = (j * (TUBULAR + 1) + i) * 3
        positions[n++] = source[k]
        positions[n++] = source[k + 1]
        positions[n++] = source[k + 2]
      }
    }
    const seed = new Float32Array(positions.length / 3)
    for (let i = 0; i < seed.length; i++) seed[i] = Math.random()
    return { positions, seed }
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
          attribute float seed;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
          varying float vExpand;
          varying float vIntro;
          varying float vSwell;

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

            // Assembly, in two movements. First the points spiral in onto the
            // ring's centreline, so what appears is a single circle being
            // drawn both ways round from one side. Then the tube swells out of
            // that line, following the same order. The movements overlap, so
            // the far side is still closing while the near side has begun to
            // fill.
            //
            // Applied last, so it overrides the magnet and the expand: nothing
            // should tug at a point that has not arrived yet.
            float sweep = abs(atan(position.y, position.x)) / 3.14159265;
            float order = mix(seed, sweep, 0.72);

            // Smootherstep on both: zero velocity at each end, so there is no
            // kick as a point sets off and none as it lands.
            float ta = clamp((uIntro - order * 0.40) / 0.30, 0.0, 1.0);
            float arrive = ta * ta * ta * (ta * (ta * 6.0 - 15.0) + 10.0);
            float tb = clamp((uIntro - 0.26 - order * 0.30) / 0.44, 0.0, 1.0);
            float swell = tb * tb * tb * (tb * (tb * 6.0 - 15.0) + 10.0);
            vIntro = arrive;
            vSwell = swell;

            vec3 centre = vec3(normalize(position.xy) * uRadius, 0.0);

            // Where a point sets off from: further out along its own radius,
            // turned back round the ring, and a little off the plane.
            float back = 1.0 - arrive;
            float turn = back * (1.3 + seed * 0.5);
            float cs = cos(turn), sn = sin(turn);
            // Kept inside the frame: the canvas has an edge, and a point that
            // starts beyond it appears there as a cut.
            float far = 1.0 + back * (0.5 + seed * 0.4);
            vec3 from = vec3(
              (centre.x * cs - centre.y * sn) * far,
              (centre.x * sn + centre.y * cs) * far,
              (seed - 0.5) * 2.4 * back
            );

            pos = from + (pos - centre) * swell;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // Finer while they are still a line, since the whole tube is
            // stacked on one circle there.
            float introSize = mix(0.72, 1.0, swell) * (1.0 + back * 0.5);
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
          varying float vSwell;

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
            // hotter until the tube has opened. They are also held dim while
            // they are a line: every point of the tube sits on one circle then,
            // and at full strength that sums to a white ring.
            finalColor += vec3(0.22, 0.36, 0.58) * (1.0 - vSwell) * 0.3;
            alpha *= smoothstep(0.0, 0.7, vIntro) * mix(0.3, 1.0, vSwell);

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
      u.uIntro.value = Math.min(1, u.uIntro.value + dt / 3.6)
    }
    const intro = u.uIntro.value

    // The one rotation allowed to accumulate. Nearly still while the ring is
    // being drawn, so it reads as a ring, then easing up to its resting speed.
    pointsRef.current.rotation.y += (0.05 + intro * intro * 0.19) * dt

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
        <bufferAttribute attach="attributes-seed" args={[seed, 1]} />
      </bufferGeometry>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </points>
  )
}
