"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

function Section({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-16"
    >
      <h2 className="text-2xl font-sans font-bold tracking-tight mb-5 border-b border-border/30 pb-3">
        {title}
      </h2>
      <div className="space-y-5 text-[15px] text-muted-foreground leading-[1.8]">
        {children}
      </div>
    </motion.section>
  )
}

function Eq({ math, label }: { math: string; label?: string }) {
  return (
    <div className="my-7 px-6 py-5 border-l-2 border-foreground/20 bg-foreground/[0.02] rounded-r-lg">
      {label && <p className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground/50 mb-3">{label}</p>}
      <div className="overflow-x-auto">
        <BlockMath math={math} />
      </div>
    </div>
  )
}

function Diagram({ children, caption }: { children: string; caption?: string }) {
  return (
    <div className="my-8 p-5 border border-border/30 rounded-xl bg-foreground/[0.015]">
      <pre className="text-[11px] leading-[1.5] font-mono text-foreground/60 overflow-x-auto whitespace-pre">
        {children}
      </pre>
      {caption && (
        <p className="text-xs text-muted-foreground/40 mt-4 text-center italic">{caption}</p>
      )}
    </div>
  )
}

export default function DifferentialEquationsPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />
      <div className="fixed top-6 right-6 z-50"><ThemeToggle /></div>

      <article className="max-w-2xl mx-auto px-6 md:px-8 pt-36 pb-24">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground transition-colors interactive inline-flex items-center gap-2" prefetch={true}>
            ← Notes
          </Link>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground/50 mb-3">Mathematics</p>
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">Differential Equations</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            The language nature uses to describe change — and the toolkit physicists use to read it.
          </p>
        </motion.header>

        <Section title="Why Everything Is a Differential Equation" delay={0.1}>
          <p>
            Here is a strange and beautiful fact about the universe: almost every fundamental law
            in physics is a differential equation. Newton wrote <InlineMath math="F = ma" />, which
            is really <InlineMath math="F = m\,\ddot{x}" /> — a second-order ODE relating position
            to its second time derivative. Maxwell wrote four differential equations. Schrödinger
            wrote one. Einstein wrote ten, coupled, nonlinear partial differential equations.
          </p>
          <p>
            The reason is deep. Differential equations describe how a system changes given its
            current state. Nature seems to be fundamentally local — what happens here and now
            depends on what is here and now, not on some global overview of the whole universe.
            Differential equations are the mathematical expression of that locality.
          </p>
          <p>
            So understanding differential equations is not just a technical skill. It is learning
            to read the language in which the laws of physics are written.
          </p>
        </Section>

        <Section title="Ordinary Differential Equations" delay={0.15}>
          <p>
            An ODE involves a function of one variable and its derivatives. The order is the
            highest derivative that appears. Linear ODEs are ones where the unknown function and
            its derivatives appear only linearly — no products, no powers.
          </p>
          <p>
            The key insight for linear ODEs with constant coefficients is that exponential
            functions are eigenfunctions of differentiation: <InlineMath math="\frac{d}{dt}e^{rt} = r e^{rt}" />.
            So if you guess a solution <InlineMath math="y = e^{rt}" />, the ODE turns into an
            algebraic equation for <InlineMath math="r" /> — the characteristic equation.
          </p>
          <Eq math="a_n r^n + a_{n-1} r^{n-1} + \cdots + a_1 r + a_0 = 0" label="Characteristic Equation" />
          <Diagram caption="Nature of solutions depends on roots of the characteristic equation">
{`  Root type          Solution form           Physical meaning
  ───────────        ─────────────           ────────────────
  Real r             e^{rt}                  Exponential growth or decay
  Complex r = α±iβ  e^{αt}(cos βt + sin βt)  Damped oscillation
  Repeated root r    t^k e^{rt}              Resonance / polynomial growth`}
          </Diagram>
          <p>
            The simple harmonic oscillator — a mass on a spring, a pendulum near equilibrium,
            an LC circuit, a quantum particle in a parabolic potential — all reduce to the same
            equation: <InlineMath math="\ddot{x} + \omega^2 x = 0" />, with characteristic roots
            <InlineMath math="r = \pm i\omega" /> and solution <InlineMath math="x(t) = A\cos\omega t + B\sin\omega t" />.
            The universality of this equation is not a coincidence. It is the generic behaviour
            of any system near a stable equilibrium.
          </p>
        </Section>

        <Section title="Partial Differential Equations" delay={0.2}>
          <p>
            PDEs involve functions of multiple variables. The fundamental equations of physics
            are mostly PDEs, because physical fields — temperature, pressure, electric potential —
            vary continuously in space and time.
          </p>
          <p>
            The three archetypal PDEs each describe a qualitatively different kind of physics:
          </p>
          <div className="space-y-4 my-6">
            {[
              { name: "Wave Equation", eq: "\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u", desc: "Describes propagation without dissipation — sound, light, vibrating strings. Information travels at finite speed c." },
              { name: "Heat / Diffusion Equation", eq: "\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u", desc: "Describes irreversible spreading — heat conduction, Brownian motion, the diffusion of probability. Solutions smooth out immediately." },
              { name: "Laplace's Equation", eq: "\\nabla^2 u = 0", desc: "Describes steady-state configurations — electrostatic potential with no charges, steady temperature with no sources. Solutions are as smooth as possible (harmonic)." },
            ].map((eq) => (
              <div key={eq.name} className="p-5 border border-border/30 rounded-xl">
                <h3 className="font-sans font-bold text-sm mb-2">{eq.name}</h3>
                <div className="overflow-x-auto mb-3">
                  <BlockMath math={eq.eq} />
                </div>
                <p className="text-sm text-muted-foreground/70">{eq.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Boundary Conditions and Eigenvalue Problems" delay={0.25}>
          <p>
            Specifying a PDE is only half the problem. You also need boundary conditions — information
            about the solution at the edges of the domain. Different physical situations call for
            different conditions:
          </p>
          <Diagram caption="Three common boundary condition types">
{`  Type        Condition              Physical Example
  ────────    ───────────────        ──────────────────────────────
  Dirichlet   u = f  on boundary     Temperature fixed at wall
  Neumann     ∂u/∂n = g on boundary  Insulated wall (no heat flux)
  Robin       au + b∂u/∂n = h        Convective heat transfer`}
          </Diagram>
          <p>
            When you separate variables in a PDE on a bounded domain, you typically encounter a
            Sturm-Liouville eigenvalue problem. These are beautiful: they guarantee a discrete
            spectrum of eigenvalues and a complete orthogonal set of eigenfunctions — exactly
            the structure quantum mechanics needs for quantisation.
          </p>
          <Eq math="\frac{d}{dx}\!\left[p(x)\frac{dy}{dx}\right] + q(x)y + \lambda w(x) y = 0" label="Sturm-Liouville Problem" />
          <p>
            The vibrating string, the quantum particle in a box, and the hydrogen atom's angular
            part are all Sturm-Liouville problems. Their eigenfunctions — sinusoids, Legendre
            polynomials, spherical harmonics — are the basis functions that recur endlessly
            across physics.
          </p>
        </Section>

        <Section title="Green's Functions — The Impulse Response" delay={0.3}>
          <p>
            One of the most powerful ideas in mathematical physics is the Green's function.
            The idea is simple: if you understand how a system responds to a single point impulse,
            you understand how it responds to anything — because any source can be decomposed
            into a superposition of impulses.
          </p>
          <p>
            Formally, the Green's function <InlineMath math="G(x, x')" /> satisfies the equation
            with a delta function source at <InlineMath math="x'" />:
          </p>
          <Eq math="\mathcal{L}\, G(x,x') = \delta(x - x')" label="Green's Function" />
          <p>
            Once you have <InlineMath math="G" />, the solution for any source
            <InlineMath math="f" /> is just a convolution:
          </p>
          <Eq math="u(x) = \int G(x, x')\, f(x')\, dx'" label="Solution by Convolution" />
          <p>
            In electrostatics, <InlineMath math="G" /> is the potential due to a point charge.
            In quantum mechanics, it is the propagator — the amplitude for a particle to go from
            one place to another. In signal processing, it is the impulse response of a filter.
            Different names, same idea.
          </p>
        </Section>
      </article>
    </main>
  )
}
