"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

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
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground transition-colors interactive">
            {"\u2190"} Back to Notes
          </Link>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            Thermodynamics
          </h1>
          <p className="text-lg text-muted-foreground">
            The laws governing energy, entropy, and the arrow of time
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">The Laws of Thermodynamics</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Thermodynamics rests on four fundamental laws that constrain all physical processes involving energy and heat transfer.
            </p>
            
            <div className="space-y-6">
              <div className="p-6 border-l-4 border-foreground/20 bg-muted/20">
                <h3 className="font-serif font-bold mb-2">Zeroth Law</h3>
                <p className="text-muted-foreground text-sm">
                  If systems A and B are each in thermal equilibrium with system C, then A and B are in thermal equilibrium with each other. This establishes temperature as a well-defined quantity.
                </p>
              </div>
              
              <div className="p-6 border-l-4 border-foreground/40 bg-muted/20">
                <h3 className="font-serif font-bold mb-2">First Law</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Energy is conserved. The change in internal energy equals heat added minus work done:
                </p>
                <div className="text-center">
                  <BlockMath math="dU = \delta Q - \delta W" />
                </div>
              </div>
              
              <div className="p-6 border-l-4 border-foreground/60 bg-muted/20">
                <h3 className="font-serif font-bold mb-2">Second Law</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  The total entropy of an isolated system never decreases:
                </p>
                <div className="text-center">
                  <BlockMath math="dS \geq \frac{\delta Q}{T}" />
                </div>
                <p className="text-muted-foreground text-sm mt-3">
                  Equality holds for reversible processes. This law establishes the arrow of time.
                </p>
              </div>
              
              <div className="p-6 border-l-4 border-foreground/80 bg-muted/20">
                <h3 className="font-serif font-bold mb-2">Third Law</h3>
                <p className="text-muted-foreground text-sm">
                  As temperature approaches absolute zero, the entropy of a perfect crystal approaches zero. No finite process can reduce the temperature to absolute zero in finite time.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Thermodynamic Potentials</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Different experimental conditions call for different thermodynamic potentials. Each is a Legendre transform of the internal energy:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm my-6">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-serif">Potential</th>
                    <th className="text-left py-3 px-4">Definition</th>
                    <th className="text-left py-3 px-4">Natural Variables</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Internal Energy U</td>
                    <td className="py-3 px-4"><InlineMath math="U" /></td>
                    <td className="py-3 px-4">S, V, N</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Helmholtz Free Energy F</td>
                    <td className="py-3 px-4"><InlineMath math="F = U - TS" /></td>
                    <td className="py-3 px-4">T, V, N</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Enthalpy H</td>
                    <td className="py-3 px-4"><InlineMath math="H = U + PV" /></td>
                    <td className="py-3 px-4">S, P, N</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Gibbs Free Energy G</td>
                    <td className="py-3 px-4"><InlineMath math="G = U - TS + PV" /></td>
                    <td className="py-3 px-4">T, P, N</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Phase Transitions</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Phase transitions are classified by the behavior of thermodynamic derivatives. In the Ehrenfest classification:
            </p>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-serif font-bold mb-2">First Order</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  First derivatives of G are discontinuous
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{"- Latent heat (discontinuity in S)"}</li>
                  <li>{"- Volume change (discontinuity in V)"}</li>
                  <li>{"- Examples: melting, boiling"}</li>
                </ul>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-serif font-bold mb-2">Second Order</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Second derivatives of G are discontinuous
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{"- No latent heat"}</li>
                  <li>{"- Diverging susceptibilities"}</li>
                  <li>{"- Examples: ferromagnetic transition"}</li>
                </ul>
              </div>
            </div>
          </section>
        </motion.div>
      </article>
    </main>
  )
}
