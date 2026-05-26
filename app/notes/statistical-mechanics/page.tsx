"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

// Animation variants for smooth transitions
const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
}

// ASCII diagram component
function ASCIIDiagram({ children, caption }: { children: string; caption?: string }) {
  return (
    <div className="my-8 p-6 bg-foreground/[0.02] border border-border/40 rounded-xl backdrop-blur-sm">
      <pre className="text-[10px] md:text-xs leading-tight font-mono text-foreground/70 overflow-x-auto whitespace-pre">
        {children}
      </pre>
      {caption && (
        <p className="text-xs text-muted-foreground/60 text-center mt-4 italic">{caption}</p>
      )}
    </div>
  )
}

// Equation box component
function EquationBox({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <motion.div 
      className="my-6 p-5 bg-gradient-to-br from-foreground/[0.03] to-transparent border border-border/30 rounded-xl backdrop-blur-sm"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <p className="text-xs font-sans font-bold text-muted-foreground/60 uppercase tracking-wider mb-3">{label}</p>
      )}
      <div className="text-center overflow-x-auto">
        {children}
      </div>
    </motion.div>
  )
}

export default function StatisticalMechanicsPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <article className="max-w-3xl mx-auto px-6 md:px-8 pt-32 pb-20">
        {/* Back Link */}
        <motion.div {...fadeIn} className="mb-8">
          <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground transition-colors interactive inline-flex items-center gap-2" prefetch={true}>
            <span>←</span> Back to Notes
          </Link>
        </motion.div>

        {/* Title */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-sans font-bold mb-4 tracking-tight">
            Statistical Mechanics
          </h1>
          <p className="text-lg text-muted-foreground">
            The bridge between microscopic physics and macroscopic thermodynamics
          </p>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-12"
        >
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Microstates and Macrostates</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The fundamental insight of statistical mechanics is that macroscopic properties emerge from the collective behavior of microscopic constituents. A <em className="text-foreground/80">microstate</em> specifies the exact configuration of every particle, while a <em className="text-foreground/80">macrostate</em> describes only measurable quantities.
            </p>

            <ASCIIDiagram caption="Phase space: each point represents a microstate">
{`              p (momentum)
              ▲
              │    ·  ·    ·
              │  ·    ·  ·   ·
              │    ·  ·    ·
              │  ·   [E=const]  ·
              │    ·  ·    ·
              │  ·    ·  ·   ·
              └──────────────────▶ q (position)
              
         Each dot = one microstate
         Surface = constant energy shell`}
            </ASCIIDiagram>

            <EquationBox label="Fundamental Postulate">
              <BlockMath math="\Omega(E) = \text{number of microstates with energy } E" />
            </EquationBox>

            <p className="text-muted-foreground leading-relaxed">
              The multiplicity function <InlineMath math="\Omega(E)" /> counts how many ways we can arrange the microscopic degrees of freedom while maintaining the same total energy.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">The Boltzmann Distribution</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When a system is in thermal equilibrium with a heat bath at temperature T, the probability of finding it in a microstate with energy <InlineMath math="E_i" /> follows:
            </p>

            <ASCIIDiagram caption="Boltzmann factor visualization">
{`         P(E)
          ▲
        1 │▓▓▓░
          │▓▓▓▓▓░
          │▓▓▓▓▓▓▓░░
          │▓▓▓▓▓▓▓▓▓▓░░░░
          │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░─────
          └──────────────────────────────▶ E
          
          High T: flatter distribution
          Low T:  sharply peaked at E=0`}
            </ASCIIDiagram>

            <EquationBox label="Boltzmann Distribution">
              <BlockMath math="P_i = \frac{e^{-E_i/k_B T}}{Z}" />
              <p className="text-sm text-muted-foreground mt-3">
                where <InlineMath math="Z = \sum_i e^{-E_i/k_B T}" /> is the partition function
              </p>
            </EquationBox>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">The Partition Function</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The partition function Z is the central object in statistical mechanics. All thermodynamic quantities derive from it:
            </p>

            <div className="space-y-3 my-6">
              {[
                { name: "Free Energy", eq: "F = -k_B T \\ln Z" },
                { name: "Average Energy", eq: "\\langle E \\rangle = -\\frac{\\partial \\ln Z}{\\partial \\beta}" },
                { name: "Entropy", eq: "S = k_B (\\ln Z + \\beta \\langle E \\rangle)" },
                { name: "Pressure", eq: "P = k_B T \\frac{\\partial \\ln Z}{\\partial V}" },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className="flex items-center gap-4 p-4 bg-foreground/[0.02] border border-border/30 rounded-lg hover:border-border/50 transition-colors"
                >
                  <span className="font-sans font-bold text-sm min-w-[120px]">{item.name}</span>
                  <InlineMath math={item.eq} />
                </motion.div>
              ))}
            </div>

            <ASCIIDiagram caption="Connection between Z and thermodynamics">
{`                      ┌─────────────────┐
                      │  Partition      │
                      │  Function Z     │
                      └────────┬────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
         ┌────────┐      ┌──────────┐     ┌─────────┐
         │ -∂lnZ  │      │ -kT lnZ  │     │ kT ∂lnZ │
         │  ────  │      │          │     │  ────── │
         │  ∂β    │      │    = F   │     │   ∂V    │
         └───┬────┘      └────┬─────┘     └────┬────┘
             │                │                │
             ▼                ▼                ▼
         ⟨Energy⟩        Free Energy       Pressure`}
            </ASCIIDiagram>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Quantum Statistics</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At low temperatures or high densities, quantum effects dominate. The indistinguishability of identical particles leads to two statistics:
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <motion.div 
                className="p-5 border border-border/40 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-sans font-bold mb-1">Fermi-Dirac</h3>
                <p className="text-xs text-muted-foreground mb-4">Fermions (half-integer spin)</p>
                <div className="text-center">
                  <BlockMath math="\bar{n}_i = \frac{1}{e^{(\epsilon_i - \mu)/k_B T} + 1}" />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  <InlineMath math="\bar{n}_i \leq 1" /> (Pauli exclusion)
                </p>
              </motion.div>

              <motion.div 
                className="p-5 border border-border/40 rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-sans font-bold mb-1">Bose-Einstein</h3>
                <p className="text-xs text-muted-foreground mb-4">Bosons (integer spin)</p>
                <div className="text-center">
                  <BlockMath math="\bar{n}_i = \frac{1}{e^{(\epsilon_i - \mu)/k_B T} - 1}" />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  <InlineMath math="\bar{n}_i \to \infty" /> possible (BEC)
                </p>
              </motion.div>
            </div>

            <ASCIIDiagram caption="Occupation number vs energy">
{`       ⟨n⟩
        ▲
      2 │          ╭─── Bose-Einstein (T > 0)
        │         ╱
      1 │───┐    ╱
        │   │   ╱
        │   └──╱──────── Fermi-Dirac (T → 0)
        │     ╱
      0 │────╱───────────────────────────▶ ε
             μ
             
        At T=0: Fermions fill states up to μ (Fermi energy)
                Bosons can all occupy ground state`}
            </ASCIIDiagram>
          </section>

          {/* Key Takeaways */}
          <section className="border-t border-border/30 pt-8">
            <h2 className="text-lg font-sans font-bold mb-4 tracking-tight">Key Takeaways</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>Statistical mechanics connects microscopic dynamics to macroscopic thermodynamics through probability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>The partition function Z encodes all equilibrium thermodynamic information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>Quantum statistics fundamentally alters behavior at low T: fermion degeneracy vs. Bose condensation</span>
              </li>
            </ul>
          </section>
        </motion.div>
      </article>
    </main>
  )
}
