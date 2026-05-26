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

export default function ElectromagnetismPage() {
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
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground/50 mb-3">Physics</p>
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">Electromagnetism & Special Relativity</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Four equations that unified electricity, magnetism, and light — and broke Newtonian mechanics.
          </p>
        </motion.header>

        <Section title="The Unification Nobody Expected" delay={0.1}>
          <p>
            In 1865, James Clerk Maxwell sat down and put together something that should not, by any
            reasonable expectation, have worked. He took Faraday's experimental observations about
            electric and magnetic fields, noticed a mathematical inconsistency in Ampere's law, added
            a correction term he called the "displacement current," and wrote down four equations.
          </p>
          <p>
            The result was a complete theory of electromagnetism. But more than that — he discovered,
            almost as a side effect, that his equations predicted the existence of transverse waves
            propagating at a speed <InlineMath math="c = 1/\sqrt{\mu_0 \varepsilon_0}" />. When he
            calculated that number, it came out to roughly <InlineMath math="3 \times 10^8" /> m/s —
            the measured speed of light. Maxwell wrote, with admirable restraint, that this was
            "scarcely possible to avoid the inference that light consists in the transverse undulations
            of the same medium which is the cause of electric and magnetic phenomena."
          </p>
          <p>
            With one stroke, he had unified electricity, magnetism, and optics. Three apparently
            separate phenomena turned out to be facets of a single theory.
          </p>
        </Section>

        <Section title="Maxwell's Equations" delay={0.15}>
          <Diagram caption="The four equations in differential form">
{`  ┌──────────────────────────────────────────────────────────────┐
  │  ∇·E  = ρ/ε₀            Gauss — charges source E fields      │
  │  ∇·B  = 0               No magnetic monopoles exist           │
  │  ∇×E  = −∂B/∂t          Faraday — changing B induces E       │
  │  ∇×B  = μ₀J + μ₀ε₀∂E/∂t  Ampère-Maxwell — J or ∂E/∂t → B  │
  └──────────────────────────────────────────────────────────────┘`}
          </Diagram>
          <p>
            Each equation tells you something profound. The first says electric charges create
            diverging electric field lines — they act as sources and sinks. The second says there are
            no magnetic charges, so magnetic field lines always form closed loops. The third is
            Faraday's induction law — a changing magnetic field creates a curling electric field.
            The fourth is the key one Maxwell modified: a changing electric field creates a curling
            magnetic field, just as a real current does.
          </p>
          <p>
            That last term — <InlineMath math="\mu_0 \varepsilon_0 \partial\mathbf{E}/\partial t" /> — is
            the displacement current. It was not observed experimentally when Maxwell added it; he
            added it because without it, the equations were mathematically inconsistent. And it is
            that term that allows electromagnetic waves to exist and propagate through a vacuum.
          </p>
          <Eq math="\nabla^2 \mathbf{E} = \mu_0 \varepsilon_0 \frac{\partial^2 \mathbf{E}}{\partial t^2}" label="Electromagnetic Wave Equation" />
        </Section>

        <Section title="Light as an Electromagnetic Wave" delay={0.2}>
          <p>
            The wave equation Maxwell derived predicts transverse waves — oscillations perpendicular
            to the direction of travel. In an electromagnetic wave, the electric and magnetic fields
            oscillate perpendicular to each other and to the direction of propagation, always in
            phase and always satisfying <InlineMath math="|\mathbf{E}| = c|\mathbf{B}|" />.
          </p>
          <Diagram caption="An electromagnetic wave propagating in the x-direction">
{`                     E (vertical)
                          ╱╲        ╱╲
                         ╱  ╲      ╱  ╲
           ──────────── ╱    ╲────╱    ╲──────────────▶ x (propagation)
                               ╲  ╱        
                                ╲╱ 
                     B (horizontal, into/out of page)
                     
          E ⊥ B ⊥ propagation direction
          Speed in vacuum: c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s`}
          </Diagram>
          <p>
            The entire electromagnetic spectrum — from radio waves with kilometre-scale wavelengths
            to gamma rays with wavelengths smaller than an atomic nucleus — is the same phenomenon
            at different frequencies. Visible light is just the narrow band that evolution happened
            to tune our eyes to detect.
          </p>
        </Section>

        <Section title="The Problem with Ether — and Einstein's Solution" delay={0.25}>
          <p>
            Maxwell's equations contained a constant: the speed of light. But speed relative to
            what? In the late 1800s, physicists assumed there must be a medium — the "luminiferous
            ether" — through which light propagated, just as sound propagates through air. The speed
            of light would be <InlineMath math="c" /> relative to the ether, and you could measure
            the Earth's motion through it.
          </p>
          <p>
            Michelson and Morley tried to detect the ether in 1887. They found nothing. The speed
            of light was the same regardless of which direction they measured it. This was deeply
            confusing.
          </p>
          <p>
            Einstein, in 1905, resolved the confusion by refusing to be confused by it. He said:
            take the result seriously. The speed of light is the same for all observers, in all
            inertial frames. Accept that as a postulate and see what follows.
          </p>
          <p>
            What follows is special relativity. And the consequences are startling.
          </p>
        </Section>

        <Section title="Time Dilation and Length Contraction" delay={0.3}>
          <p>
            If the speed of light is constant for all observers, then time and length cannot be.
            Consider two people with perfectly synchronised clocks. One gets on a rocket and flies
            away at near the speed of light. When they reunite, the travelling twin is younger than
            the one who stayed. This is not a metaphor. It is a measurement.
          </p>
          <Eq math="\Delta t' = \gamma \Delta t, \qquad L' = \frac{L}{\gamma}, \qquad \gamma = \frac{1}{\sqrt{1 - v^2/c^2}}" label="Time Dilation and Length Contraction" />
          <p>
            The factor <InlineMath math="\gamma" />, the Lorentz factor, governs everything. At everyday
            speeds, <InlineMath math="\gamma \approx 1" /> and the effects are negligible. But GPS
            satellites orbit at speeds where relativistic corrections matter at the nanosecond level —
            without accounting for special (and general) relativity, GPS would accumulate errors of
            kilometres per day.
          </p>
          <Diagram caption="Lorentz factor — how relativistic effects grow with speed">
{`   γ
   ▲
10 │                                           ╭──
   │                                        ╭─╯
 5 │                                     ╭─╯
   │                                  ╭─╯
 2 │                             ╭───╯
   │                     ╭──────╯
 1 │─────────────────────╯
   └──────────────────────────────────────────────▶ v/c
   0      0.3     0.6      0.9   0.99  0.999  1.0
   
   At v = 0.9c: γ ≈ 2.3   At v = 0.99c: γ ≈ 7   At v = 0.999c: γ ≈ 22`}
          </Diagram>
        </Section>

        <Section title="Spacetime and the Invariant Interval" delay={0.35}>
          <p>
            The deepest insight of special relativity is that space and time are not separate
            things. They are two aspects of a single four-dimensional structure: spacetime. Different
            observers disagree about the spatial and temporal separations between events, but they
            all agree on the spacetime interval between them.
          </p>
          <Eq math="ds^2 = -c^2\,dt^2 + dx^2 + dy^2 + dz^2" label="Minkowski Spacetime Interval" />
          <p>
            When <InlineMath math="ds^2 < 0" />, the interval is timelike — the events can be causally
            related, and a clock can travel between them. When <InlineMath math="ds^2 > 0" />, it is
            spacelike — no signal can connect the events. When <InlineMath math="ds^2 = 0" />, it is
            null — only light can travel between them.
          </p>
          <p>
            And at the end of all this, Einstein's most famous equation sits like a punchline:
            mass is just a form of stored energy. Every kilogram of matter contains
            <InlineMath math="mc^2 \approx 9 \times 10^{16}" /> joules — roughly the energy output of
            a large power plant running for three years. From two postulates about the speed of light,
            we derived that matter itself is a kind of concentrated energy. That is not a bad return.
          </p>
          <Eq math="E^2 = (pc)^2 + (mc^2)^2" label="Energy-Momentum Relation" />
        </Section>
      </article>
    </main>
  )
}
