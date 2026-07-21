'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { animate } from 'animejs'

/**
 * Streamlines of a slow 2D vector field.
 *
 * Drawn as contours of a stream function rather than by tracing particles: the
 * level sets of psi ARE the field lines, so one fragment shader gets exact,
 * evenly-spaced, anti-aliased lines with no simulation state to keep.
 *
 * Deliberately raw WebGL. This runs on pages that have no other 3D content, and
 * pulling three.js in for a background would cost more than the background.
 */

export type Field = 'laminar' | 'dipole' | 'saddle' | 'vortex'

const FIELD_INDEX: Record<Field, number> = { laminar: 0, dipole: 1, saddle: 2, vortex: 3 }

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;      // in field space
uniform float u_mouseAmp;   // decays to 0 after the pointer stops
uniform float u_reveal;     // 0 -> 1 on mount
uniform vec3  u_line;
uniform float u_alpha;
uniform float u_density;
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

// Stream function. Its contours are the field lines.
float psi(vec2 p, float t) {
  float v;

  if (u_variant == 0) {
    // laminar: near-horizontal flow with a long standing wave
    v = p.y * 1.5 + 0.5 * sin(p.x * 0.9 + t * 0.19) + 0.24 * sin(p.x * 2.1 - t * 0.13);
  } else if (u_variant == 1) {
    // dipole: a doublet in a uniform stream — the classic flow-past-a-body plot
    vec2 d = p - vec2(0.0, 0.15);
    v = d.y / (dot(d, d) + 0.42) * 1.4 + p.y * 0.55;
  } else if (u_variant == 2) {
    // saddle: a hyperbolic fixed point, as in a phase portrait
    v = p.x * p.y * 0.8 + 0.22 * sin(t * 0.12) + p.y * 0.25;
  } else {
    // vortex lattice
    v = sin(p.x * 0.85 + t * 0.09) * cos(p.y * 0.85 - t * 0.07) * 1.5 + p.y * 0.45;
  }

  // organic drift so the field never reads as a static texture
  v += 0.4 * fbm(p * 0.5 + vec2(t * 0.045, -t * 0.03));

  // the pointer as a point vortex, falling off fast
  vec2 m = p - u_mouse;
  v += u_mouseAmp * 1.15 * atan(m.y, m.x) * exp(-dot(m, m) * 0.5);

  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  vec2 p = uv * 7.0;

  float f = psi(p, u_time) * u_density;

  // fwidth keeps the stroke a constant width on screen regardless of gradient
  float w = fwidth(f);
  float line = 1.0 - smoothstep(0.0, w * 1.35, abs(fract(f) - 0.5));

  // Where contours crowd tighter than a couple of pixels they alias into moire,
  // so fade those out. Only the upper bound matters: a small w means a smooth,
  // well-resolved line, which is exactly what we want to keep.
  line *= 1.0 - smoothstep(0.30, 0.85, w);

  // fade at the frame edge so lines never collide with the viewport border
  float edge = smoothstep(0.0, 0.28, min(uv.x + 0.5, 0.5 - uv.x))
             * smoothstep(0.0, 0.30, min(uv.y + 0.5, 0.5 - uv.y));

  // reveal sweeps diagonally out from the top-left
  float sweep = smoothstep(-0.4, 1.0, u_reveal * 2.2 - (uv.x + uv.y + 1.0) * 0.5);

  float a = line * u_alpha * edge * sweep;
  outColor = vec4(u_line, a);
}
`

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

export default function FieldLines({
  field = 'laminar',
  alpha,
  density = 1.6,
  className = '',
}: {
  field?: Field
  alpha?: number
  density?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    })
    // No WebGL2 means no backdrop. It is decoration; nothing else depends on it.
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(prog, n)
    const uRes = u('u_res'), uTime = u('u_time'), uMouse = u('u_mouse')
    const uAmp = u('u_mouseAmp'), uReveal = u('u_reveal'), uLine = u('u_line')
    const uAlpha = u('u_alpha'), uDensity = u('u_density'), uVariant = u('u_variant')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Line colour comes from --wash so the backdrop stays inside the palette.
    const wash = getComputedStyle(document.documentElement).getPropertyValue('--wash').trim()
    const rgb = wash.split(/\s+/).map(Number)
    const line: [number, number, number] =
      rgb.length === 3 && rgb.every(n => !Number.isNaN(n))
        ? [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255]
        : [0.5, 0.6, 0.7]

    // Dark needs roughly double: a pale line gaining on a near-black field is a
    // much smaller perceptual step than a dark line losing against paper.
    const isDark = document.documentElement.classList.contains('dark')
    const baseAlpha = alpha ?? (isDark ? 0.95 : 0.45)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const state = { time: 0, reveal: reduced ? 1 : 0, mouseAmp: 0, mx: 99, my: 99 }

    // anime.js eases the reveal. A shader uniform is exactly the kind of plain
    // numeric target its engine is good at, and the easing is better than a
    // hand-rolled lerp.
    if (!reduced) {
      animate(state, { reveal: 1, duration: 2400, ease: 'outExpo' })
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
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const m = Math.min(r.width, r.height)
      state.mx = ((e.clientX - r.left - r.width / 2) / m) * 7
      state.my = (-(e.clientY - r.top - r.height / 2) / m) * 7
      if (!reduced) {
        // Retarget rather than stack: repeated animations on one property would
        // otherwise queue up and the field would keep swirling after the pointer left.
        animate(state, { mouseAmp: 0.55, duration: 260, ease: 'outQuad' })
        animate(state, { mouseAmp: 0, delay: 500, duration: 1400, ease: 'outSine' })
      }
    }

    let visible = true
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(canvas)
    const onVisibility = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', resize)

    let raf = 0
    let last = performance.now()

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!visible) return
      state.time += dt

      resize()
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, state.time)
      gl.uniform2f(uMouse, state.mx, state.my)
      gl.uniform1f(uAmp, state.mouseAmp)
      gl.uniform1f(uReveal, state.reveal)
      gl.uniform3f(uLine, line[0], line[1], line[2])
      gl.uniform1f(uAlpha, baseAlpha)
      gl.uniform1f(uDensity, density)
      gl.uniform1i(uVariant, FIELD_INDEX[field])

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // Reduced motion gets one frame, then the loop stops entirely.
      if (reduced) cancelAnimationFrame(raf)
    }

    resize()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
    }
    // Re-created on theme change so the line colour is re-read from the palette.
  }, [field, alpha, density, resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 h-full w-full ${className}`}
    />
  )
}
