'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { getCursorState } from '@/lib/motion/pointer'

/**
 * The backdrop: one construction per section, drawn as points.
 *
 * Each pattern is a real thing rather than decoration. Interference is two
 * sources and a path difference; phyllotaxis is the golden angle that actually
 * packs seeds in a sunflower head; the orbits obey a Kepler-ish period so the
 * inner rings lead. That is the whole reason the site can carry a moving
 * backdrop without it feeling arbitrary.
 *
 * There is no cloud layer. An earlier version put a soft noise wash behind
 * these and it read as fog: it hid the pattern and made the page look glassy.
 * The pattern is the backdrop now.
 *
 * Every construction is written against `reach`, the distance from the centre
 * to the corner of the viewport, so each one fills the whole screen rather than
 * sitting as a disc in the middle of it. The radial patterns used to top out
 * around 1.0 in a space where the corner is at 2.04, and were then vignetted
 * well inside even that, which left the outer third of a wide display empty.
 *
 * The field also leans very slightly toward the pointer. That is two uniforms
 * and an ease; there is no per-point work on the CPU for it.
 *
 * Every point's position comes from gl_VertexID in the vertex shader, so there
 * are no attribute buffers and nothing is uploaded per frame beyond a handful
 * of uniforms.
 */

export type Pattern = 'stars' | 'orbits' | 'interference' | 'phyllotaxis' | 'lattice'

const PATTERN_INDEX: Record<Pattern, number> = {
  stars: 0,
  orbits: 1,
  interference: 2,
  phyllotaxis: 3,
  lattice: 4,
}

/**
 * Point budget per pattern. The grids need far more than the curves.
 *
 * Orbits and phyllotaxis went up when the constructions grew to fill the
 * screen. Neither was stretched to get there: the sunflower head has more
 * seeds at the same packing, and the orbits have more rings at the same
 * spacing. Scaling the old counts up instead would have thinned both out.
 */
const COUNT: Record<Pattern, number> = {
  stars: 900,
  orbits: 7000,
  interference: 15600,
  phyllotaxis: 7600,
  lattice: 4200,
}

/** The aspect these counts are tuned for. */
const BASE_REACH = Math.hypot(16 / 9, 1)

/**
 * How each construction's budget grows with the field.
 *
 * The two grids span the viewport by construction: their rows and columns
 * stretch, so the count is already right at any aspect. The other three are
 * sized against `reach`, and holding their counts fixed there would just spread
 * the same points more thinly the wider the display gets. Stars and phyllotaxis
 * fill an area, so they follow reach²; the orbits gain rings rather than
 * density, so they follow reach.
 */
const GROWTH: Record<Pattern, number> = {
  stars: 2,
  orbits: 1,
  interference: 0,
  phyllotaxis: 2,
  lattice: 0,
}

/** Budget for the aspect actually on screen, capped so an odd window cannot run away with it. */
function countFor(pattern: Pattern, reach: number) {
  const exponent = GROWTH[pattern]
  if (!exponent) return COUNT[pattern]
  const factor = Math.min((reach / BASE_REACH) ** exponent, 2.5)
  return Math.round(COUNT[pattern] * factor)
}

const VERT = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform float u_reveal;
uniform int   u_pattern;
uniform float u_dpr;
/** point budget, so a construction can size itself to the field it has to fill */
uniform float u_count;
/** pointer in working space, and how much of it to apply */
uniform vec2  u_pointer;
uniform float u_pointer_amt;

out float v_alpha;

const float TAU = 6.28318530718;
const float GOLDEN = 2.39996322973;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

vec2 hash21(float p) {
  vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

void main() {
  float i = float(gl_VertexID);
  float asp = u_res.x / u_res.y;

  // Working space: y in [-1, 1], x in [-asp, asp]. Converted to clip at the end,
  // so every pattern below can be written in a square-ish space and stay
  // circular on a wide screen.
  //
  // reach is the distance from the centre to the corner: 2.04 at 16:9, 2.55 at
  // 21:9. Every radial construction is sized against it, which is what makes
  // them fill the screen instead of sitting as a disc in the middle of it.
  float reach = length(vec2(asp, 1.0));

  vec2 pos = vec2(0.0);
  float a = 1.0;
  float size = 2.6;

  if (u_pattern == 0) {
    // ── stars ────────────────────────────────────────────────────────────────
    // Three depths drifting at different rates. The parallax is what stops a
    // random scatter of dots from reading as noise.
    vec2 r = hash21(i);
    float depth = hash11(i * 7.7);

    float x = (r.x * 2.0 - 1.0) * asp + u_time * 0.008 * (0.25 + depth);
    pos = vec2(mod(x + asp, 2.0 * asp) - asp, r.y * 2.0 - 1.0);

    float twinkle = 0.62 + 0.38 * sin(u_time * 0.6 + i * 1.7);
    a = (0.22 + depth * 0.78) * twinkle;
    size = 1.6 + depth * 2.6;

  } else if (u_pattern == 1) {
    // ── orbits ───────────────────────────────────────────────────────────────
    // Nested ellipses, each rotated from the last by the golden angle so no two
    // line up. Inner rings travel faster, which is the one detail that makes it
    // read as orbits rather than as rings.
    float per = 200.0;
    float ring = floor(i / per);
    float k = mod(i, per);

    // The outermost ring lands on the corner, and the spacing between rings
    // falls out of how many there are. On a 16:9 display this comes to 0.057,
    // which is where the fixed 0.055 used to sit: the system covers the screen
    // now without changing how the rings read.
    float rings = u_count / per;
    float rr = 0.1 + ring * ((reach - 0.1) / (rings - 1.0));
    float rn = rr / reach;

    float ecc = 0.55 + 0.18 * sin(ring * 0.9);
    float tilt = ring * GOLDEN;
    float speed = 0.22 / pow(rn + 0.28, 1.5);

    float th = (k / per) * TAU + u_time * speed;
    vec2 e = vec2(cos(th) * rr, sin(th) * rr * ecc);
    pos = vec2(e.x * cos(tilt) - e.y * sin(tilt), e.x * sin(tilt) + e.y * cos(tilt));

    // Brighter along one limb, so each ring has a leading edge.
    a = 0.18 + 0.82 * pow(0.5 + 0.5 * sin(th), 2.2);
    // Outer rings sit back a little rather than fading out. The old curve was
    // steep enough to erase them, which is why the field stopped short.
    a *= smoothstep(1.9, 0.4, rn);
    size = 2.3;

  } else if (u_pattern == 2) {
    // ── interference ─────────────────────────────────────────────────────────
    // Two sources, one path difference. Points sit on a grid and only light up
    // where the two arrive in phase, so the hyperbolic fringes draw themselves.
    float cols = 156.0;
    float gx = mod(i, cols);
    float gy = floor(i / cols);
    float rows = 100.0;

    pos = vec2(
      (gx / (cols - 1.0) * 2.0 - 1.0) * asp,
      gy / (rows - 1.0) * 2.0 - 1.0
    );

    // The sources ease apart and back, which walks the fringes outward.
    float sep = 0.34 + 0.1 * sin(u_time * 0.06);
    float d = length(pos - vec2(-sep, 0.0)) - length(pos - vec2(sep, 0.0));

    float f = cos(d * 26.0 - u_time * 0.55);
    a = smoothstep(0.2, 0.95, f);
    // The fringes are hyperbolas and run off the edges on their own, so there
    // is nothing to vignette. The old falloff was a circle of radius 1.5 in a
    // field whose corner is at 2.04, which cut off both sides of the screen.
    // What is left only takes the very corners down a little.
    a *= smoothstep(reach * 1.35, reach * 0.9, length(pos));
    size = 2.2;

  } else if (u_pattern == 3) {
    // ── phyllotaxis ──────────────────────────────────────────────────────────
    // The golden angle, which is how a sunflower head packs seeds: it is the
    // one rotation that never repeats, so no seed ever shadows another.
    //
    // The head grew rather than stretched. Seed n sits at sqrt(n), so setting
    // the spacing to reach/sqrt(count) puts the last seed exactly on the corner
    // and leaves the packing alone. It comes to 0.0234 at 16:9, which is where
    // the fixed 0.0235 was; the difference is that there are now enough seeds
    // to get there.
    float th = i * GOLDEN + u_time * 0.045;
    float rr = (reach / sqrt(u_count)) * sqrt(i);
    float rn = rr / reach;

    pos = vec2(cos(th) * rr, sin(th) * rr);

    a = smoothstep(1.02, 0.12, rn) * (0.45 + 0.55 * sin(i * 0.05 + u_time * 0.3) * 0.5 + 0.275);
    size = 1.9 + 1.6 * smoothstep(0.98, 0.0, rn);

  } else {
    // ── lattice ──────────────────────────────────────────────────────────────
    // A hexagonal close packing with a wave running through it, so the grid is
    // never quite still.
    float cols = 84.0;
    float gx = mod(i, cols);
    float gy = floor(i / cols);
    float rows = 50.0;

    // Offsetting alternate rows by half a step is what makes it hexagonal
    // rather than square.
    float odd = mod(gy, 2.0) * 0.5;
    pos = vec2(
      ((gx + odd) / (cols - 1.0) * 2.0 - 1.0) * asp,
      (gy / (rows - 1.0) * 2.0 - 1.0)
    );

    float w = sin(pos.x * 2.4 + pos.y * 1.5 - u_time * 0.42);
    a = 0.12 + 0.88 * smoothstep(0.1, 1.0, w);
    // Same story as the interference grid: the lattice already spans the
    // viewport and it was the falloff that stopped it at the edges.
    a *= smoothstep(reach * 1.3, reach * 0.85, length(pos));
    size = 2.2;
  }

  // The field leans toward the pointer.
  //
  // The displacement is the offset itself times a falloff, so it goes to zero
  // both far away and at the pointer: points gather slightly rather than
  // collapsing onto it. It peaks around ten pixels, which is meant to be
  // noticed only if you are looking for it. The brightness term is deliberately
  // tiny; this is a lean, not a light.
  vec2 toP = u_pointer - pos;
  float fall = smoothstep(0.55, 0.0, length(toP));
  fall *= fall;
  pos += toP * fall * 0.22 * u_pointer_amt;
  a *= 1.0 + 0.12 * fall * u_pointer_amt;

  // Reveal sweeps diagonally on mount.
  float sweep = smoothstep(-0.5, 1.0, u_reveal * 2.4 - (pos.x / max(asp, 1.0) + pos.y + 2.0) * 0.4);

  v_alpha = a * sweep;
  gl_Position = vec4(pos.x / asp, pos.y, 0.0, 1.0);
  gl_PointSize = size * u_dpr;
}
`

const FRAG = `#version 300 es
precision highp float;

in float v_alpha;
uniform vec3  u_tint;
uniform float u_alpha;

out vec4 outColor;

void main() {
  // Round, with a soft edge. A square point at this size reads as dirt.
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d);
  float mask = smoothstep(0.5, 0.24, r);

  outColor = vec4(u_tint, v_alpha * u_alpha * mask);
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

export default function Backdrop({
  pattern = 'stars',
  alpha,
  className = '',
}: {
  pattern?: Pattern
  /** overall opacity; pages that carry long prose pass this down */
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

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    // Nothing is uploaded: every position comes from gl_VertexID. The VAO
    // exists only because a draw call needs one bound.
    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    // Resolved per frame from the aspect, since the window can be resized.
    let count = COUNT[pattern]
    const patternIndex = PATTERN_INDEX[pattern]

    // Tint from --wash, so the backdrop stays inside the palette.
    const washVar = getComputedStyle(document.documentElement).getPropertyValue('--wash').trim()
    const parsed = washVar.split(/\s+/).map(Number)
    const tint: [number, number, number] =
      parsed.length === 3 && parsed.every(n => !Number.isNaN(n))
        ? [parsed[0] / 255, parsed[1] / 255, parsed[2] / 255]
        : [0.5, 0.6, 0.7]

    // Dark needs more. A pale mark gaining on a near-black field is a much
    // smaller perceptual step than a dark one losing against paper.
    const isDark = document.documentElement.classList.contains('dark')
    const baseAlpha = alpha ?? (isDark ? 0.9 : 0.62)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const u = (n: string) => gl.getUniformLocation(prog, n)
    const uRes = u('u_res')
    const uTime = u('u_time')
    const uReveal = u('u_reveal')
    const uPattern = u('u_pattern')
    const uDpr = u('u_dpr')
    const uTint = u('u_tint')
    const uAlpha = u('u_alpha')
    const uCount = u('u_count')
    const uPointer = u('u_pointer')
    const uPointerAmt = u('u_pointer_amt')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

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

    const state = { time: 0, reveal: reduced ? 1 : 0 }

    // Pointer, eased. The store is the same module-level one the cursor reads,
    // so there is no subscription and no render involved; PointerProvider only
    // writes to it for a fine pointer with no reduced-motion preference, which
    // is exactly when this effect should exist at all. `amt` is what fades the
    // whole thing in and out as the pointer enters and leaves the window.
    const ptr = { x: 0, y: 0, amt: 0 }

    let raf = 0
    let last = performance.now()

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!visible) return

      state.time += dt
      if (state.reveal < 1) state.reveal = Math.min(1, state.reveal + dt / 1.6)

      resize()

      // The canvas is fixed to the viewport, so client coordinates map onto it
      // directly and scroll position never enters into it.
      const cursor = getCursorState()
      const asp = canvas.clientWidth / canvas.clientHeight
      count = countFor(pattern, Math.hypot(asp, 1))
      const tx = ((cursor.x / canvas.clientWidth) * 2 - 1) * asp
      const ty = -((cursor.y / canvas.clientHeight) * 2 - 1)

      if (ptr.amt < 0.01) {
        // Snap while the effect is off, so easing in does not drag the field
        // across from wherever the pointer was last seen.
        ptr.x = tx
        ptr.y = ty
      } else {
        ptr.x += (tx - ptr.x) * 0.1
        ptr.y += (ty - ptr.y) * 0.1
      }
      ptr.amt += ((cursor.inside ? 1 : 0) - ptr.amt) * 0.05

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, state.time)
      gl.uniform1f(uReveal, state.reveal)
      gl.uniform1i(uPattern, patternIndex)
      gl.uniform1f(uDpr, dpr)
      gl.uniform3f(uTint, tint[0], tint[1], tint[2])
      gl.uniform1f(uAlpha, baseAlpha)
      gl.uniform1f(uCount, count)
      gl.uniform2f(uPointer, ptr.x, ptr.y)
      gl.uniform1f(uPointerAmt, ptr.amt)

      gl.drawArrays(gl.POINTS, 0, count)

      // Reduced motion gets one frame, then the loop stops entirely.
      if (reduced) cancelAnimationFrame(raf)
    }

    resize()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(prog)
      gl.deleteVertexArray(vao)
    }
    // Re-created on theme change so the tint is re-read from the palette.
  }, [pattern, alpha, resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 h-full w-full ${className}`}
    />
  )
}
