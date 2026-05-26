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

export default function ThermodynamicsPage() {
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
            Thermodynamics
          </h1>
          <p className="text-lg text-muted-foreground">
            The laws governing energy, entropy, and the arrow of time
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-12"
        >
          {/* Laws of Thermodynamics */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">The Laws of Thermodynamics</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Thermodynamics rests on four fundamental laws that constrain all physical processes involving energy and heat transfer.
            </p>
            
            <ASCIIDiagram caption="The four laws form the foundation of thermodynamics">
{`    ╔═══════════════════════════════════════════════════════════╗
    ║                  LAWS OF THERMODYNAMICS                   ║
    ╠═══════════════════════════════════════════════════════════╣
    ║  0th │ A ⟷ C, B ⟷ C  ⟹  A ⟷ B   (Thermal Equilibrium)  ║
    ╠══════╪════════════════════════════════════════════════════╣
    ║  1st │ dU = δQ - δW              (Energy Conservation)    ║
    ╠══════╪════════════════════════════════════════════════════╣
    ║  2nd │ dS ≥ δQ/T                 (Entropy Increase)       ║
    ╠══════╪════════════════════════════════════════════════════╣
    ║  3rd │ S → 0 as T → 0            (Absolute Zero Limit)    ║
    ╚══════╧════════════════════════════════════════════════════╝`}
            </ASCIIDiagram>

            <div className="space-y-4">
              {[
                { num: "0th", title: "Zeroth Law", desc: "Establishes temperature as a well-defined transitive property", eq: "A \\leftrightarrow C, B \\leftrightarrow C \\Rightarrow A \\leftrightarrow B" },
                { num: "1st", title: "First Law", desc: "Energy is conserved in all processes", eq: "dU = \\delta Q - \\delta W" },
                { num: "2nd", title: "Second Law", desc: "Entropy of isolated systems never decreases", eq: "dS \\geq \\frac{\\delta Q}{T}" },
                { num: "3rd", title: "Third Law", desc: "Entropy approaches zero as T approaches absolute zero", eq: "\\lim_{T \\to 0} S = 0" },
              ].map((law, i) => (
                <motion.div
                  key={law.num}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className="p-5 border-l-4 border-foreground/20 bg-foreground/[0.02] rounded-r-lg hover:border-foreground/40 transition-colors"
                  style={{ borderLeftWidth: `${(i + 1) * 1}px` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-sans font-bold mb-1">{law.title}</h3>
                      <p className="text-sm text-muted-foreground">{law.desc}</p>
                    </div>
                    <div className="text-sm">
                      <InlineMath math={law.eq} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Thermodynamic Potentials */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Thermodynamic Potentials</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Different experimental conditions call for different thermodynamic potentials. Each is a Legendre transform of the internal energy:
            </p>

            <ASCIIDiagram caption="Thermodynamic square - relating potentials and natural variables">
{`                          S ──────────────── V
                         ╱                    ╲
                        ╱      U = U(S,V)      ╲
                       ╱                        ╲
                      H ──────────────────────── F
                       ╲                        ╱
                        ╲      G = G(T,P)      ╱
                         ╲                    ╱
                          P ──────────────── T

        ┌──────────┬─────────────────┬────────────────┐
        │ Potential│    Definition   │ Natural Vars   │
        ├──────────┼─────────────────┼────────────────┤
        │    U     │       U         │    S, V, N     │
        │    F     │   U - TS        │    T, V, N     │
        │    H     │   U + PV        │    S, P, N     │
        │    G     │   U - TS + PV   │    T, P, N     │
        └──────────┴─────────────────┴────────────────┘`}
            </ASCIIDiagram>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              {[
                { name: "Internal Energy", symbol: "U", def: "U", vars: "S, V, N", color: "from-blue-500/5" },
                { name: "Helmholtz Free Energy", symbol: "F", def: "U - TS", vars: "T, V, N", color: "from-green-500/5" },
                { name: "Enthalpy", symbol: "H", def: "U + PV", vars: "S, P, N", color: "from-orange-500/5" },
                { name: "Gibbs Free Energy", symbol: "G", def: "U - TS + PV", vars: "T, P, N", color: "from-purple-500/5" },
              ].map((pot, i) => (
                <motion.div
                  key={pot.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  className={`p-4 border border-border/40 rounded-xl bg-gradient-to-br ${pot.color} to-transparent`}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans font-bold">{pot.name}</span>
                    <span className="text-xl font-mono text-foreground/60">{pot.symbol}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <InlineMath math={`${pot.symbol} = ${pot.def}`} />
                  </div>
                  <p className="text-xs text-muted-foreground/60 mt-2">Variables: {pot.vars}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Heat Engines */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Heat Engines & Carnot Cycle</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A heat engine converts thermal energy into mechanical work. The Carnot cycle represents the theoretical maximum efficiency:
            </p>

            <ASCIIDiagram caption="Carnot cycle: the most efficient heat engine possible">
{`             P                              ┌─────────────────┐
             ▲                              │   Hot Reservoir  │
             │    1                         │      T_H         │
             │   ╱╲                         └────────┬────────┘
             │  ╱  ╲ isothermal                      │
             │ ╱    ╲  (T_H)                         │ Q_H
             │╱      ╲                               ▼
           2 │        ╲                       ┌───────────┐
             │╲        │ adiabatic            │   Engine  │──▶ W = Q_H - Q_C
             │ ╲       │                      └─────┬─────┘
             │  ╲      │ 4                          │
             │   ╲    ╱                             │ Q_C
             │    ╲  ╱  isothermal                  ▼
             │     ╲╱   (T_C)               ┌────────────────┐
             │      3                       │  Cold Reservoir │
             └──────────────────────▶ V     │      T_C        │
                                            └─────────────────┘

              Carnot Efficiency: η = 1 - T_C/T_H`}
            </ASCIIDiagram>

            <EquationBox label="Carnot Efficiency">
              <BlockMath math="\eta_{Carnot} = 1 - \frac{T_C}{T_H} = \frac{W}{Q_H}" />
              <p className="text-sm text-muted-foreground mt-3">
                No engine operating between temperatures <InlineMath math="T_H" /> and <InlineMath math="T_C" /> can exceed this efficiency
              </p>
            </EquationBox>
          </section>

          {/* Phase Transitions */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 tracking-tight">Phase Transitions</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Phase transitions are classified by the behavior of thermodynamic derivatives:
            </p>

            <ASCIIDiagram caption="Phase diagram showing critical point and triple point">
{`             P
             ▲
             │
             │           SOLID
             │          ╱
       P_c ──┤─────────●←── Critical Point
             │        ╱│
             │       ╱ │   LIQUID
             │      ╱  │
             │     ╱   │
             │    ╱    │
       P_t ──┤───●─────┤
             │  ╱│     │    GAS
             │ ╱ │     │
             │╱  │     │
             └───┴─────┴─────────────▶ T
                T_t   T_c

         ● Triple Point: all three phases coexist
         ● Critical Point: liquid-gas distinction vanishes`}
            </ASCIIDiagram>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <motion.div 
                className="p-5 border border-border/40 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-sans font-bold mb-2">First Order</h3>
                <p className="text-xs text-muted-foreground mb-3">First derivatives of G discontinuous</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Latent heat present</li>
                  <li>• Volume changes abruptly</li>
                  <li>• Examples: melting, boiling</li>
                </ul>
              </motion.div>
              <motion.div 
                className="p-5 border border-border/40 rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-sans font-bold mb-2">Second Order</h3>
                <p className="text-xs text-muted-foreground mb-3">Second derivatives of G discontinuous</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• No latent heat</li>
                  <li>• Diverging susceptibilities</li>
                  <li>• Examples: ferromagnetic, superconducting</li>
                </ul>
              </motion.div>
            </div>
          </section>

          {/* Key Takeaways */}
          <section className="border-t border-border/30 pt-8">
            <h2 className="text-lg font-sans font-bold mb-4 tracking-tight">Key Takeaways</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>The four laws establish temperature, energy conservation, entropy increase, and absolute zero limits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>Different potentials (U, F, H, G) are suited to different experimental constraints</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground/40">•</span>
                <span>Carnot efficiency sets the theoretical upper bound for heat engine performance</span>
              </li>
            </ul>
          </section>
        </motion.div>
      </article>
    </main>
  )
}
