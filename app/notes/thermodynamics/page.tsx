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

export default function ThermodynamicsPage() {
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
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">Thermodynamics</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            The laws governing energy, entropy, and why time only flows in one direction.
          </p>
        </motion.header>

        <Section title="Why Does Heat Flow Downhill?" delay={0.1}>
          <p>
            Put a hot cup of coffee on your desk. Walk away. Come back in an hour. The coffee is cold.
            You already knew that was going to happen. But here is a weird thing: every single
            physical law governing the molecules in that cup is perfectly symmetric in time. Run the
            equations backwards, and they still hold. Nothing in the microscopic physics prefers one
            direction of time over another.
          </p>
          <p>
            So why does the coffee always cool down and never spontaneously heat back up? The answer
            is thermodynamics — specifically, the second law. It is perhaps the most asymmetric,
            one-way, irreversible-feeling law in all of physics, and it emerges entirely from
            counting.
          </p>
          <p>
            Thermodynamics was originally developed in the 1800s to understand steam engines —
            before anyone had a solid idea about atoms. People noticed four remarkably general
            principles that seemed to govern all heat and energy processes. They numbered them
            the zeroth through the third law, because the zeroth one was discovered after the
            others but turned out to be more fundamental.
          </p>
        </Section>

        <Section title="The Four Laws" delay={0.15}>
          <Diagram caption="The four laws — a compact summary">
{`  ┌────────────────────────────────────────────────────────────┐
  │  0th │ A ↔ C  and  B ↔ C  ⟹  A ↔ B   (Temperature exists) │
  │  1st │ dU = δQ − δW            (Energy is conserved)        │
  │  2nd │ dS ≥ δQ/T               (Entropy never decreases)    │
  │  3rd │ S → 0  as  T → 0        (Absolute zero is a limit)   │
  └────────────────────────────────────────────────────────────┘`}
          </Diagram>
          <p>
            The zeroth law sounds almost trivially obvious — if two things are each in thermal
            equilibrium with a third thing, they are in equilibrium with each other. But this
            logical transitivity is what justifies the entire concept of a temperature scale. Without
            it, "temperature" would mean nothing.
          </p>
          <p>
            The first law is energy conservation, dressed up for thermodynamics. The internal energy
            <InlineMath math="U" /> of a system changes only when heat <InlineMath math="\delta Q" /> flows
            in or work <InlineMath math="\delta W" /> flows out. Energy is never created or destroyed.
          </p>
          <Eq math="dU = \delta Q - \delta W" label="First Law" />
          <p>
            The second law is the one people argue about. Clausius put it this way: "Heat never
            passes spontaneously from a colder body to a warmer one." Kelvin put it another way:
            "No process is possible whose sole result is to convert heat entirely into work." Both
            statements are equivalent, and both are saying the same thing — entropy increases.
          </p>
          <Eq math="\Delta S_\text{universe} \geq 0" label="Second Law" />
        </Section>

        <Section title="Entropy: The Most Misunderstood Quantity in Physics" delay={0.2}>
          <p>
            Entropy is not disorder, despite what pop science articles say. Or rather — it is a
            very specific, mathematical kind of disorder. Boltzmann defined it as
            <InlineMath math="S = k_B \ln \Omega" />, where <InlineMath math="\Omega" /> is
            the number of microstates corresponding to a given macrostate.
          </p>
          <p>
            Here is the intuition. A gas expanding to fill a room has more entropy than the same
            gas compressed into a corner. Not because "spread out" is messier in some aesthetic
            sense, but because there are vastly more ways to arrange the molecules throughout
            the whole room than to arrange them all in the corner. The system is not being pushed
            toward any particular configuration — it just wanders, and the spread-out state is
            overwhelmingly more probable.
          </p>
        </Section>

        <Section title="Thermodynamic Potentials and Free Energy" delay={0.25}>
          <p>
            A crucial concept is free energy: the portion of a system's total energy that is
            actually available to do useful work. The rest is "locked up" in entropy — it is energy
            so thoroughly spread out among microscopic degrees of freedom that you cannot extract
            it without violating the second law.
          </p>
          <p>
            Different experimental conditions call for different potentials. The Gibbs free energy
            <InlineMath math="G = U - TS + PV" /> is what matters when you run reactions at constant
            temperature and pressure — which is basically every chemistry lab and every living cell.
            A reaction is spontaneous if and only if <InlineMath math="\Delta G < 0" />.
          </p>
          <Diagram caption="Thermodynamic potentials — each suited to different natural variables">
{`    Natural
    Variables     Potential      Definition
    ─────────     ─────────      ──────────────────────
    S, V, N       U              Internal Energy
    T, V, N       F = U − TS     Helmholtz Free Energy
    S, P, N       H = U + PV     Enthalpy
    T, P, N       G = U−TS+PV    Gibbs Free Energy  ← most useful in chemistry/biology`}
          </Diagram>
          <Eq math="G = U - TS + PV \qquad dG = -S\,dT + V\,dP + \mu\,dN" label="Gibbs Free Energy" />
        </Section>

        <Section title="Heat Engines and the Carnot Limit" delay={0.3}>
          <p>
            In the 1820s, a French engineer named Sadi Carnot asked a deceptively simple question:
            what is the maximum efficiency a heat engine can possibly achieve? He was thinking about
            steam engines, but his answer turned out to be a universal limit on all energy conversion.
          </p>
          <p>
            The answer depends only on the temperatures of the hot source and cold sink — nothing
            else. Not the working fluid, not the specific mechanism, not the engineering. Just two
            temperatures.
          </p>
          <Eq math="\eta_\text{Carnot} = 1 - \frac{T_C}{T_H}" label="Carnot Efficiency" />
          <p>
            A power plant running between steam at 600 K and a river at 300 K cannot exceed 50%
            efficiency, no matter how well-engineered it is. This is not an engineering limitation.
            It is a law of the universe. Real engines are always less efficient than this because of
            friction, heat leakage, and other irreversibilities — each of which generates entropy and
            reduces the work available.
          </p>
          <Diagram caption="The Carnot cycle — the theoretical gold standard">
{`      P
      ▲     1 ──── 2
      │    ╱        ╲   isothermal expansion at T_H
      │   ╱          ╲
      │  ╱            ╲  adiabatic expansion
      │ 4              ╲
      │  ╲           3 ╱
      │   ╲          ╱    isothermal compression at T_C
      │    ╲        ╱
      │     4 ──── 3   adiabatic compression
      └──────────────────▶ V
      
      Net work = area enclosed by cycle`}
          </Diagram>
        </Section>

        <Section title="Phase Transitions — When Systems Change Completely" delay={0.35}>
          <p>
            Thermodynamics also describes the dramatic moments when matter changes its character
            entirely — from liquid to gas, from disordered to magnetically ordered, from normal
            conductor to superconductor. These are phase transitions.
          </p>
          <p>
            First-order transitions (like boiling water) involve a latent heat — energy is absorbed
            or released at a fixed temperature without any change in temperature. Second-order
            transitions (like a material becoming magnetic) are stranger: there is no latent heat,
            but fluctuations and correlations diverge at the critical point, making the mathematics
            considerably more interesting.
          </p>
          <p>
            Near a critical point, the details of the material stop mattering. A magnet, a liquid-gas
            system, and a superconductor all show the same mathematical behaviour — the same critical
            exponents — regardless of their microscopic differences. This universality is one of the
            most surprising and beautiful results in all of physics.
          </p>
        </Section>
      </article>
    </main>
  )
}
