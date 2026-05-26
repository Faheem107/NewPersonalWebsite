"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

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

export default function ElectromagnetismPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <article className="max-w-3xl mx-auto px-6 md:px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground transition-colors interactive inline-flex items-center gap-2" prefetch={true}>
            <span>←</span> Back to Notes
          </Link>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-sans font-bold mb-4 tracking-tight">
            Electromagnetism & Special Relativity
          </h1>
          <p className="text-lg text-muted-foreground">
            {"Maxwell's equations and the geometry of spacetime"}
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-12"
        >
          {/* Maxwell's Equations */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">{"Maxwell's Equations"}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {"Maxwell's four equations unify electricity, magnetism, and optics into a single theoretical framework:"}
            </p>

            <ASCIIDiagram caption="The four Maxwell equations in differential form">
{`    ╔════════════════════════════════════════════════════════════════╗
    ║                     MAXWELL'S EQUATIONS                        ║
    ╠════════════════════════════════════════════════════════════════╣
    ║                                                                ║
    ║   ∇·E = ρ/ε₀              (Gauss's Law - Electric)            ║
    ║        ↳ Electric charges are sources of E field              ║
    ║                                                                ║
    ║   ∇·B = 0                 (Gauss's Law - Magnetic)            ║
    ║        ↳ No magnetic monopoles exist                          ║
    ║                                                                ║
    ║   ∇×E = -∂B/∂t            (Faraday's Law)                     ║
    ║        ↳ Changing B creates E                                  ║
    ║                                                                ║
    ║   ∇×B = μ₀J + μ₀ε₀∂E/∂t  (Ampère-Maxwell)                     ║
    ║        ↳ Currents and changing E create B                      ║
    ║                                                                ║
    ╚════════════════════════════════════════════════════════════════╝`}
            </ASCIIDiagram>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              {[
                { name: "Gauss (E)", eq: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}", desc: "Charges source E" },
                { name: "Gauss (B)", eq: "\\nabla \\cdot \\mathbf{B} = 0", desc: "No monopoles" },
                { name: "Faraday", eq: "\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}", desc: "Changing B → E" },
                { name: "Ampère-Maxwell", eq: "\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}", desc: "J or changing E → B" },
              ].map((law, i) => (
                <motion.div
                  key={law.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  className="p-4 border border-border/40 rounded-xl bg-foreground/[0.02]"
                  whileHover={{ y: -2 }}
                >
                  <p className="text-xs font-sans font-bold text-muted-foreground/60 mb-2">{law.name}</p>
                  <div className="text-sm overflow-x-auto">
                    <InlineMath math={law.eq} />
                  </div>
                  <p className="text-xs text-muted-foreground/50 mt-2">{law.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Electromagnetic Waves */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Electromagnetic Waves</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"In vacuum, Maxwell's equations predict transverse electromagnetic waves:"}
            </p>

            <ASCIIDiagram caption="Electromagnetic wave - E and B fields oscillate perpendicular to propagation">
{`                    E field (vertical)
                          │
                          │ ╱╲
                       ╱╲ │╱  ╲
                      ╱  ╲│    ╲     ╱╲
              ───────╱────┼─────╲───╱──╲────────▶ propagation (x)
                    ╱     │      ╲ ╱    ╲
                          │       ╳      ╲
                          │      ╱ ╲
                    ------│-----╱---╲--------- B field (into/out of page)
                          │    ╱     ╲
                          
          • E ⊥ B ⊥ direction of propagation
          • Both oscillate in phase
          • Speed: c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s`}
            </ASCIIDiagram>

            <EquationBox label="Speed of Light">
              <BlockMath math="c = \frac{1}{\sqrt{\mu_0 \epsilon_0}} = 299,792,458 \text{ m/s}" />
              <p className="text-sm text-muted-foreground mt-3">
                This result unified optics with electromagnetism and led to special relativity
              </p>
            </EquationBox>
          </section>

          {/* Special Relativity */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Special Relativity</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"Einstein's two postulates:"}
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6 ml-4">
              <li>The laws of physics are the same in all inertial reference frames</li>
              <li>The speed of light in vacuum is constant for all observers</li>
            </ol>

            <ASCIIDiagram caption="Lorentz transformations connect different inertial frames">
{`          Frame S                              Frame S'
       (at rest)                          (moving at v)
           
          t ▲                                  t' ▲
            │   light                            │   light
            │   cone                             │   cone
            │  ╱╲                                │  ╱╲
            │ ╱  ╲ c                             │ ╱  ╲ c
            │╱    ╲                              │╱    ╲
       ─────┼──────────▶ x              ────────┼──────────▶ x'
            │╲    ╱                              │╲    ╱
            │ ╲  ╱                               │ ╲  ╱
            │  ╲╱                                │  ╲╱
            
       Lorentz Transformation:
       t' = γ(t - vx/c²)     x' = γ(x - vt)
       
       where γ = 1/√(1 - v²/c²) is the Lorentz factor`}
            </ASCIIDiagram>

            <div className="space-y-3 my-6">
              {[
                { name: "Time Dilation", eq: "\\Delta t' = \\gamma \\Delta t", desc: "Moving clocks run slow" },
                { name: "Length Contraction", eq: "L' = L/\\gamma", desc: "Moving objects are shortened" },
                { name: "Velocity Addition", eq: "u' = \\frac{u - v}{1 - uv/c^2}", desc: "Velocities don't simply add" },
              ].map((eff, i) => (
                <motion.div
                  key={eff.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className="flex items-center gap-4 p-4 bg-foreground/[0.02] border border-border/30 rounded-lg hover:border-border/50 transition-colors"
                >
                  <span className="font-sans font-bold text-sm min-w-[140px]">{eff.name}</span>
                  <InlineMath math={eff.eq} />
                  <span className="text-xs text-muted-foreground/60 ml-auto hidden md:block">{eff.desc}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Spacetime */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Spacetime Geometry</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"Space and time unite into a single 4-dimensional manifold:"}
            </p>

            <ASCIIDiagram caption="Minkowski spacetime diagram showing light cones">
{`                           ct
                            ▲
                            │       FUTURE
                            │      ╱     ╲
                            │     ╱ light ╲
                            │    ╱  cone   ╲
                            │   ╱           ╲
                 ELSEWHERE  │  ╱    HERE     ╲  ELSEWHERE
               ─────────────┼─╱───────────────╲─────────────▶ x
               (spacelike)  │╱   (timelike)    ╲  (spacelike)
                            │╲                 ╱
                            │ ╲               ╱
                            │  ╲             ╱
                            │   ╲  PAST     ╱
                            │    ╲         ╱
                            
        • Inside light cone: causally connected (timelike)
        • On light cone: light signals (null/lightlike)  
        • Outside light cone: causally disconnected (spacelike)`}
            </ASCIIDiagram>

            <EquationBox label="Spacetime Interval">
              <BlockMath math="ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2" />
              <p className="text-sm text-muted-foreground mt-3">
                The interval <InlineMath math="ds^2" /> is invariant under Lorentz transformations
              </p>
            </EquationBox>

            <div className="grid md:grid-cols-3 gap-4 my-6">
              <motion.div 
                className="p-4 border border-border/40 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent text-center"
                whileHover={{ y: -2 }}
              >
                <p className="text-xs font-sans font-bold text-muted-foreground/60 mb-2">Position 4-vector</p>
                <InlineMath math="x^\mu = (ct, \vec{r})" />
              </motion.div>
              <motion.div 
                className="p-4 border border-border/40 rounded-xl bg-gradient-to-br from-green-500/5 to-transparent text-center"
                whileHover={{ y: -2 }}
              >
                <p className="text-xs font-sans font-bold text-muted-foreground/60 mb-2">Momentum 4-vector</p>
                <InlineMath math="p^\mu = (E/c, \vec{p})" />
              </motion.div>
              <motion.div 
                className="p-4 border border-border/40 rounded-xl bg-gradient-to-br from-purple-500/5 to-transparent text-center"
                whileHover={{ y: -2 }}
              >
                <p className="text-xs font-sans font-bold text-muted-foreground/60 mb-2">Current 4-vector</p>
                <InlineMath math="J^\mu = (c\rho, \vec{J})" />
              </motion.div>
            </div>
          </section>

          {/* Energy-Momentum */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Energy-Momentum Relation</h2>

            <EquationBox label="Relativistic Energy-Momentum">
              <BlockMath math="E^2 = (pc)^2 + (mc^2)^2" />
              <div className="text-sm text-muted-foreground mt-4 space-y-1">
                <p>For <InlineMath math="m = 0" />: <InlineMath math="E = pc" /> (photons)</p>
                <p>For <InlineMath math="p = 0" />: <InlineMath math="E = mc^2" /> (rest energy)</p>
              </div>
            </EquationBox>
          </section>

          {/* Key Takeaways */}
          <section className="border-t border-border/30 pt-8">
            <h2 className="text-lg font-sans font-bold mb-4 tracking-tight">Key Takeaways</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>{"Maxwell's equations unify E&M and predict electromagnetic waves at speed c"}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>Special relativity follows from the invariance of c across all frames</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>Spacetime geometry is encoded in the invariant interval and 4-vectors</span>
              </li>
            </ul>
          </section>
        </motion.div>
      </article>
    </main>
  )
}
