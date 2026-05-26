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

export default function StatMechPage() {
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
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">Statistical Mechanics</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            The bridge between the microscopic world of atoms and the macroscopic world we actually measure.
          </p>
        </motion.header>

        <Section title="The Problem of Scale" delay={0.1}>
          <p>
            Here is a question that should bother you: a glass of water contains roughly
            {" "}<InlineMath math="10^{25}" /> molecules. Each one is bouncing around, colliding, spinning — a
            storm of motion at every scale smaller than your thumbnail. And yet, when you stick a thermometer
            in that glass, you get a single number. Temperature. One tidy digit summarising an incomprehensible
            amount of microscopic chaos.
          </p>
          <p>
            How? That is exactly what statistical mechanics answers. It is the art of not caring about
            individual particles while extracting everything useful from their collective behaviour. It is,
            in a deep sense, the physics of ignoring things on purpose.
          </p>
          <p>
            The central idea is the distinction between a <em className="text-foreground/80">microstate</em> and
            a <em className="text-foreground/80">macrostate</em>. A microstate is the full specification — every
            particle position, every momentum, at one instant. A macrostate is everything you can actually
            measure: temperature, pressure, volume. One macrostate corresponds to an astronomically large number
            of microstates.
          </p>

          <Diagram caption="Phase space — each point is a complete microstate of the system">
{`  p ▲                      ·  ·  ·
    │               ·  ·          ·  ·
    │          ·                        ·
    │       ·         ┌──────────────┐     ·
    │      ·          │  constant-E  │      ·
    │       ·         │  shell Ω(E)  │     ·
    │          ·      └──────────────┘  ·
    │               ·  ·          ·  ·
    │                      ·  ·  ·
    └────────────────────────────────────▶ q`}
          </Diagram>

          <Eq math="\Omega(E) = \text{number of microstates with energy } E" label="Fundamental Postulate" />
          <p>
            The multiplicity <InlineMath math="\Omega(E)" /> is the heart of the whole subject. Once you know
            how many microstates are available at each energy, everything else — temperature, entropy,
            pressure — follows by differentiation.
          </p>
        </Section>

        <Section title="Entropy and the Arrow of Time" delay={0.15}>
          <p>
            Here is something weird: every microscopic law of physics is time-reversible. Play a video of
            two billiard balls colliding in reverse — it looks perfectly fine. But play a video of a wine
            glass shattering in reverse and everyone laughs. Why?
          </p>
          <p>
            Boltzmann realised the answer is simply about counting. There is an overwhelmingly larger number
            of microstates corresponding to "broken glass scattered on the floor" than to "intact glass
            sitting on a table." The system is not being pulled toward disorder by some mysterious force —
            it just wanders randomly through microstates, and there are vastly more disordered ones.
          </p>
          <Eq math="S = k_B \ln \Omega" label="Boltzmann Entropy" />
          <p>
            This equation, carved on Boltzmann's grave in Vienna, is arguably the most important equation in
            all of physics. It connects the measurable, macroscopic quantity S with the microscopic count
            <InlineMath math="\Omega" />. The constant <InlineMath math="k_B \approx 1.38 \times 10^{-23} \text{ J/K}" /> is
            simply a conversion factor between the microscopic world of counting and the macroscopic world
            of temperature.
          </p>
        </Section>

        <Section title="The Boltzmann Distribution" delay={0.2}>
          <p>
            Now suppose our system is not isolated but connected to a large heat reservoir — a thermal bath
            that maintains a fixed temperature T. The system can exchange energy with the bath. What is the
            probability of finding the system in a microstate with energy <InlineMath math="E_i" />?
          </p>
          <p>
            The answer emerges from a counting argument that is almost embarrassingly simple once you see it:
            the probability is proportional to the number of microstates available to the bath when the
            system has energy <InlineMath math="E_i" />. That count grows exponentially with the bath's entropy,
            giving:
          </p>
          <Eq math="P_i = \frac{e^{-E_i / k_B T}}{Z}" label="Boltzmann Distribution" />

          <Diagram caption="Higher temperature → flatter distribution across energies">
{`  P(E)
   ▲
 1 │▓▓▓▓░░
   │▓▓▓▓▓▓▓░░░
   │▓▓▓▓▓▓▓▓▓▓░░░░░           ← low T
   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░
   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░── high T
   └──────────────────────────────▶ E`}
          </Diagram>

          <p>
            The denominator <InlineMath math="Z = \sum_i e^{-E_i/k_BT}" /> is the partition function —
            a normalisation constant that turns out to encode everything about the equilibrium thermodynamics
            of the system. Once you have Z, you have everything.
          </p>
        </Section>

        <Section title="The Partition Function as a Generating Machine" delay={0.25}>
          <p>
            This is where statistical mechanics becomes almost magical. Z is a single scalar — a sum over
            all microstates — and yet by differentiating it in different directions you can read off any
            equilibrium thermodynamic quantity you want.
          </p>
          <Eq math="\langle E \rangle = -\frac{\partial \ln Z}{\partial \beta}, \quad F = -k_BT \ln Z, \quad S = k_B\!\left(\ln Z + \beta\langle E\rangle\right)" label="Everything from Z" />

          <Diagram caption="Z as the central node in thermodynamics">
{`                   ┌─────────────┐
                   │   ln Z(β,V) │
                   └──────┬──────┘
         ┌────────────────┼────────────────┐
         │                │                │
    -∂/∂β│           -kT ×│          kT ∂/∂V
         ▼                ▼                ▼
    ⟨Energy⟩         Free Energy       Pressure`}
          </Diagram>
          <p>
            The parameter <InlineMath math="\beta = 1/k_BT" /> is the inverse temperature. Taking derivatives
            with respect to it extracts moments of the energy distribution. This framework applies to
            everything from ideal gases to black holes — the formalism does not know or care what the system is.
          </p>
        </Section>

        <Section title="Quantum Statistics — When Particles Are Truly Identical" delay={0.3}>
          <p>
            Classical statistical mechanics works well at high temperatures and low densities. But zoom in
            too far — cool things down, pack them tight — and something strange happens. Quantum particles
            are not just similar to one another; they are mathematically <em className="text-foreground/80">identical</em>.
            There is no label you could put on an electron to tell it apart from another electron.
          </p>
          <p>
            This has radical consequences for counting microstates. Depending on whether particles have
            integer or half-integer spin, the counting changes completely:
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="p-5 border border-border/40 rounded-xl">
              <h3 className="font-sans font-bold text-sm mb-1">Fermi-Dirac</h3>
              <p className="text-xs text-muted-foreground mb-4">Electrons, protons, neutrons (spin ½)</p>
              <div className="overflow-x-auto">
                <BlockMath math="\bar{n}_i = \frac{1}{e^{(\varepsilon_i-\mu)/k_BT} + 1}" />
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3">No two fermions share a state — Pauli exclusion. This is why matter is solid.</p>
            </div>
            <div className="p-5 border border-border/40 rounded-xl">
              <h3 className="font-sans font-bold text-sm mb-1">Bose-Einstein</h3>
              <p className="text-xs text-muted-foreground mb-4">Photons, helium-4, Cooper pairs (integer spin)</p>
              <div className="overflow-x-auto">
                <BlockMath math="\bar{n}_i = \frac{1}{e^{(\varepsilon_i-\mu)/k_BT} - 1}" />
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3">Bosons pile into the lowest state — Bose-Einstein condensation.</p>
            </div>
          </div>

          <p>
            At temperatures close to absolute zero, bosons do something remarkable: they all collapse into
            the single lowest-energy quantum state, forming a new phase of matter — a Bose-Einstein
            condensate — where every particle is described by the same wavefunction and quantum effects
            become visible at room scale. It was predicted in 1924 and first observed in a lab in 1995.
            That is a 71-year wait. Physics is patient.
          </p>
        </Section>
      </article>
    </main>
  )
}
