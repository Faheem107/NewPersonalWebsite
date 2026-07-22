'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { animate } from 'animejs'

/**
 * The backdrop: a slow cyanotype wash with a drift of particles moving through
 * it.
 *
 * The two layers are not stacked effects. Both are built from the same stream
 * function psi: the wash is a smoothed reading of its value, and the particles
 * follow its perpendicular gradient, which is by construction the flow whose
 * streamlines are psi's contours. So the drift always runs along the grain of
 * the wash rather than across it, and the whole thing reads as one field.
 *
 * Everything is held far below the text contrast floor on purpose. A backdrop
 * that competes with the reading is a worse backdrop, however good it looks in
 * isolation.
 *
 * Deliberately raw WebGL2. This runs on pages with no other 3D content, and
 * pulling three.js in for a background would cost more than the background.
 */

export type Field = 'laminar' | 'dipole' | 'saddle' | 'vortex'

const VARIANT_INDEX: Record<Field, number> = { laminar: 0, dipole: 1, saddle: 2, vortex: 3 }

/** Field-space half-extent along the shorter axis. Shared by both layers. */
const EXTENT = 7.0

/** How fast particles travel along the field, in field units per second. */
const SPEED = 1.05

/**
 * Trail samples kept per particle. The trail is drawn as a polyline through
 * them, so it curves with the field. A single straight segment from the last
 * frame's position reads as a scratch rather than as flow, which is what this
 * first looked like.
 */
const TRAIL = 22

/**
 * Trail sampling step, in seconds. Fixed rather than per-frame, so the trail is
 * the same length in space on a 60 Hz and a 120 Hz display.
 */
const STEP = 1 / 60

// ─── Wash ─────────────────────────────────────────────────────────────────────

const WASH_VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const WASH_FRAG = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform float u_reveal;
uniform vec3  u_tint;
uniform float u_alpha;
uniform int   u_variant;

out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

// The stream function. Must stay in step with psi() in this file's TypeScript,
// which advects the particles along the same field.
float psi(vec2 p, float t, int variant) {
  vec2 drift = vec2(t * 0.021, -t * 0.014);

  // Domain warp: one fbm displacing the input of another. This is what gives
  // the wash its soft, developed-print structure instead of even cloud.
  vec2 q = vec2(fbm(p * 0.42 + drift), fbm(p * 0.42 + drift + vec2(3.7, 1.3)));
  float v = fbm(p * 0.55 + q * 1.15 + drift) * 2.0 - 1.0;

  if (variant == 1)      v += 0.16 * sin(p.x * 0.42 + t * 0.05);
  else if (variant == 2) v += 0.11 * (p.x * p.y) * 0.05;
  else if (variant == 3) v += 0.13 * sin(p.x * 0.5 + t * 0.04) * cos(p.y * 0.5);
  else                   v += 0.10 * p.y * 0.16;

  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  vec2 p = uv * ${EXTENT.toFixed(1)};

  float v = psi(p, u_time, u_variant);

  // Two soft bands rather than a single ramp: it keeps some structure without
  // ever producing an edge sharp enough to read as a shape.
  float wash = smoothstep(-0.55, 0.75, v) * 0.72 + smoothstep(0.1, 0.95, v) * 0.28;

  // Grain, animated. Its real job is dithering: at these alphas a smooth
  // gradient bands badly on an 8-bit display, and grain breaks the bands up.
  float grain = (hash(gl_FragCoord.xy + fract(u_time) * 431.7) - 0.5) * 0.035;

  float vignette = 1.0 - smoothstep(0.32, 0.92, length(uv * vec2(1.0, 1.15)));

  float reveal = smoothstep(-0.4, 1.0, u_reveal * 2.2 - (uv.x + uv.y + 1.0) * 0.5);

  float a = clamp((wash + grain) * u_alpha * vignette * reveal, 0.0, 1.0);
  outColor = vec4(u_tint, a);
}
`

// ─── Flow ─────────────────────────────────────────────────────────────────────

const FLOW_VERT = `#version 300 es
in vec2  a_pos;    // field space
in float a_alpha;

uniform vec2 u_res;

out float v_alpha;

void main() {
  // Inverse of the wash's fragment-space mapping, so a field-space coordinate
  // means the same thing to both layers.
  vec2 clip = a_pos * (2.0 * min(u_res.x, u_res.y)) / (${EXTENT.toFixed(1)} * u_res);
  gl_Position = vec4(clip, 0.0, 1.0);
  v_alpha = a_alpha;
}
`

const FLOW_FRAG = `#version 300 es
precision highp float;

in float v_alpha;
uniform vec3  u_tint;
uniform float u_alpha;

out vec4 outColor;

void main() {
  outColor = vec4(u_tint, v_alpha * u_alpha);
}
`

// ─── Field, in TypeScript ─────────────────────────────────────────────────────
// Mirrors the GLSL above closely enough that the particles track the wash. It
// does not have to match bit for bit, only belong to the same field.

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
  return s - Math.floor(s)
}

function noise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return (a + (b - a) * ux) * (1 - uy) + (c + (d - c) * ux) * uy
}

function fbm(x: number, y: number) {
  let v = 0
  let a = 0.5
  let px = x
  let py = y
  for (let i = 0; i < 4; i++) {
    v += a * noise(px, py)
    px *= 2.02
    py *= 2.02
    a *= 0.5
  }
  return v
}

function psi(x: number, y: number, t: number, variant: number) {
  const dx = t * 0.021
  const dy = -t * 0.014
  const qx = fbm(x * 0.42 + dx, y * 0.42 + dy)
  const qy = fbm(x * 0.42 + dx + 3.7, y * 0.42 + dy + 1.3)
  let v = fbm(x * 0.55 + qx * 1.15 + dx, y * 0.55 + qy * 1.15 + dy) * 2 - 1

  if (variant === 1) v += 0.16 * Math.sin(x * 0.42 + t * 0.05)
  else if (variant === 2) v += 0.11 * x * y * 0.05
  else if (variant === 3) v += 0.13 * Math.sin(x * 0.5 + t * 0.04) * Math.cos(y * 0.5)
  else v += 0.1 * y * 0.16

  return v
}

/**
 * Velocity is the perpendicular gradient of psi, which makes the flow
 * divergence-free: particles neither pile up nor thin out, they just travel
 * along the contours the wash is already drawing.
 */
function velocity(x: number, y: number, t: number, variant: number): [number, number] {
  // A deliberately wide finite difference. It is the gradient of a low-pass
  // version of psi, which is what keeps the flow to the large structures of the
  // wash rather than chasing every ripple of the noise. A narrow h looks like
  // scattered dust.
  const h = 0.28
  const dpdx = (psi(x + h, y, t, variant) - psi(x - h, y, t, variant)) / (2 * h)
  const dpdy = (psi(x, y + h, t, variant) - psi(x, y - h, t, variant)) / (2 * h)

  // Soft speed normalisation. Without it, particles in flat regions of psi sit
  // almost still while others race, and the field reads as uneven rather than
  // calm. Direction is untouched.
  const vx = dpdy
  const vy = -dpdx
  const mag = Math.hypot(vx, vy)
  const k = 1 / (mag + 0.45)
  return [vx * k, vy * k]
}

// ─── Component ────────────────────────────────────────────────────────────────

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

function link(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc)
  if (!vs || !fs) return null
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog))
    return null
  }
  return prog
}

export default function Wash({
  variant = 'laminar',
  alpha,
  className = '',
}: {
  variant?: Field
  /** overall opacity; the default is already conservative */
  alpha?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    })
    // No WebGL2 means no backdrop. It is decoration; nothing depends on it.
    if (!gl) return

    const washProg = link(gl, WASH_VERT, WASH_FRAG)
    const flowProg = link(gl, FLOW_VERT, FLOW_FRAG)
    if (!washProg || !flowProg) return

    const variantIndex = VARIANT_INDEX[variant]

    // Tint comes from --wash, so the backdrop stays inside the palette.
    const washVar = getComputedStyle(document.documentElement).getPropertyValue('--wash').trim()
    const parsed = washVar.split(/\s+/).map(Number)
    const tint: [number, number, number] =
      parsed.length === 3 && parsed.every(n => !Number.isNaN(n))
        ? [parsed[0] / 255, parsed[1] / 255, parsed[2] / 255]
        : [0.5, 0.6, 0.7]

    // Dark needs roughly double. A pale mark gaining on a near-black field is a
    // much smaller perceptual step than a dark one losing against paper.
    const isDark = document.documentElement.classList.contains('dark')
    const baseAlpha = alpha ?? (isDark ? 0.62 : 0.4)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 768px)').matches
    const COUNT = narrow ? 220 : 620
    /** line segments per trail */
    const SEGS = TRAIL - 1

    // ── wash geometry: one oversized triangle ────────────────────────────────
    const washVao = gl.createVertexArray()!
    gl.bindVertexArray(washVao)
    const washBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, washBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const washPosLoc = gl.getAttribLocation(washProg, 'a_pos')
    gl.enableVertexAttribArray(washPosLoc)
    gl.vertexAttribPointer(washPosLoc, 2, gl.FLOAT, false, 0, 0)

    // ── flow geometry ────────────────────────────────────────────────────────
    // Each particle is drawn as a polyline through its last TRAIL positions,
    // expanded into SEGS separate GL_LINES segments so one buffer holds every
    // particle without a primitive restart.
    const positions = new Float32Array(COUNT * SEGS * 4)
    const alphas = new Float32Array(COUNT * SEGS * 2)

    const flowVao = gl.createVertexArray()!
    gl.bindVertexArray(flowVao)
    const posBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(gl.ARRAY_BUFFER, positions.byteLength, gl.DYNAMIC_DRAW)
    const flowPosLoc = gl.getAttribLocation(flowProg, 'a_pos')
    gl.enableVertexAttribArray(flowPosLoc)
    gl.vertexAttribPointer(flowPosLoc, 2, gl.FLOAT, false, 0, 0)

    const alphaBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf)
    gl.bufferData(gl.ARRAY_BUFFER, alphas.byteLength, gl.DYNAMIC_DRAW)
    const flowAlphaLoc = gl.getAttribLocation(flowProg, 'a_alpha')
    gl.enableVertexAttribArray(flowAlphaLoc)
    gl.vertexAttribPointer(flowAlphaLoc, 1, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)

    // ── particle state ───────────────────────────────────────────────────────
    const px = new Float32Array(COUNT)
    const py = new Float32Array(COUNT)
    const age = new Float32Array(COUNT)
    const life = new Float32Array(COUNT)

    // Trail history, one ring buffer of TRAIL slots per particle. Every particle
    // is sampled on the same tick, so a single shared head index serves all of
    // them and nothing has to be shifted.
    const tx = new Float32Array(COUNT * TRAIL)
    const ty = new Float32Array(COUNT * TRAIL)
    let head = 0

    let extentX = EXTENT
    let extentY = EXTENT

    const respawn = (i: number, fresh = false) => {
      px[i] = (Math.random() * 2 - 1) * extentX
      py[i] = (Math.random() * 2 - 1) * extentY
      life[i] = 7 + Math.random() * 11
      age[i] = fresh ? Math.random() * life[i] : 0
      // Collapse the trail onto the new position, or the particle draws a
      // streak across the screen from wherever it used to be.
      for (let s = 0; s < TRAIL; s++) {
        tx[i * TRAIL + s] = px[i]
        ty[i * TRAIL + s] = py[i]
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      const short = Math.min(canvas.width, canvas.height) || 1
      extentX = (EXTENT * canvas.width) / short
      extentY = (EXTENT * canvas.height) / short
    }

    resize()
    // Seeded mid-life so the field is already populated on the first frame
    // rather than fading up out of nothing.
    for (let i = 0; i < COUNT; i++) respawn(i, true)

    const state = { time: 0, reveal: reduced ? 1 : 0 }

    // anime.js eases the reveal. A plain numeric target is exactly what its
    // engine is good at, and the easing beats a hand-rolled lerp.
    if (!reduced) animate(state, { reveal: 1, duration: 2400, ease: 'outExpo' })

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)
    const onVisibility = () => {
      visible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', resize)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const uWash = {
      res: gl.getUniformLocation(washProg, 'u_res'),
      time: gl.getUniformLocation(washProg, 'u_time'),
      reveal: gl.getUniformLocation(washProg, 'u_reveal'),
      tint: gl.getUniformLocation(washProg, 'u_tint'),
      alpha: gl.getUniformLocation(washProg, 'u_alpha'),
      variant: gl.getUniformLocation(washProg, 'u_variant'),
    }
    const uFlow = {
      res: gl.getUniformLocation(flowProg, 'u_res'),
      tint: gl.getUniformLocation(flowProg, 'u_tint'),
      alpha: gl.getUniformLocation(flowProg, 'u_alpha'),
    }

    let raf = 0
    let last = performance.now()
    /** leftover time carried between fixed steps */
    let acc = 0

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!visible) return
      state.time += dt

      resize()

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // wash
      gl.useProgram(washProg)
      gl.bindVertexArray(washVao)
      gl.uniform2f(uWash.res, canvas.width, canvas.height)
      gl.uniform1f(uWash.time, state.time)
      gl.uniform1f(uWash.reveal, state.reveal)
      gl.uniform3f(uWash.tint, tint[0], tint[1], tint[2])
      gl.uniform1f(uWash.alpha, baseAlpha * 0.62)
      gl.uniform1i(uWash.variant, variantIndex)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // ── flow: advance on a fixed step, then rebuild the trail geometry ─────
      // The step is fixed so the trail covers the same distance regardless of
      // refresh rate. Capped at three catch-up steps, so a backgrounded tab
      // returning does not try to simulate the whole gap at once.
      acc += dt
      let steps = 0
      while (acc >= STEP && steps < 3) {
        acc -= STEP
        steps++
        head = (head + 1) % TRAIL

        for (let i = 0; i < COUNT; i++) {
          const [vx, vy] = velocity(px[i], py[i], state.time, variantIndex)
          const nx = px[i] + vx * STEP * SPEED
          const ny = py[i] + vy * STEP * SPEED

          age[i] += STEP
          const gone = Math.abs(nx) > extentX * 1.06 || Math.abs(ny) > extentY * 1.06
          if (age[i] > life[i] || gone) {
            respawn(i)
            continue
          }

          px[i] = nx
          py[i] = ny
          tx[i * TRAIL + head] = nx
          ty[i * TRAIL + head] = ny
        }
      }

      if (steps > 0) {
        for (let i = 0; i < COUNT; i++) {
          // Fades in and out over its life, so nothing ever pops in or vanishes.
          const fade = Math.sin(Math.PI * (age[i] / life[i]))
          const base = i * TRAIL

          for (let s = 0; s < SEGS; s++) {
            // Oldest sample is the one just after the head.
            const a = base + ((head + 1 + s) % TRAIL)
            const b = base + ((head + 2 + s) % TRAIL)
            const v = (i * SEGS + s) * 4

            positions[v] = tx[a]
            positions[v + 1] = ty[a]
            positions[v + 2] = tx[b]
            positions[v + 3] = ty[b]

            // Ramps along the trail, so the head is brightest. That gradient is
            // what reads as a direction of travel.
            const q = (i * SEGS + s) * 2
            alphas[q] = fade * (s / SEGS) ** 1.6
            alphas[q + 1] = fade * ((s + 1) / SEGS) ** 1.6
          }
        }
      }

      gl.useProgram(flowProg)
      gl.bindVertexArray(flowVao)
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions)
      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, alphas)
      gl.uniform2f(uFlow.res, canvas.width, canvas.height)
      gl.uniform3f(uFlow.tint, tint[0], tint[1], tint[2])
      gl.uniform1f(uFlow.alpha, baseAlpha * state.reveal * 1.55)
      gl.drawArrays(gl.LINES, 0, COUNT * SEGS * 2)

      gl.bindVertexArray(null)

      // Reduced motion gets one frame, then the loop stops entirely.
      if (reduced) cancelAnimationFrame(raf)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(washProg)
      gl.deleteProgram(flowProg)
      gl.deleteBuffer(washBuf)
      gl.deleteBuffer(posBuf)
      gl.deleteBuffer(alphaBuf)
      gl.deleteVertexArray(washVao)
      gl.deleteVertexArray(flowVao)
    }
    // Re-created on theme change so the tint is re-read from the palette.
  }, [variant, alpha, resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 h-full w-full ${className}`}
    />
  )
}
