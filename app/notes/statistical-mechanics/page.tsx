"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

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

        {/* Title */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            Statistical Mechanics
          </h1>
          <p className="text-lg text-muted-foreground">
            The bridge between microscopic physics and macroscopic thermodynamics
          </p>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Microstates and Macrostates</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The fundamental insight of statistical mechanics is that macroscopic properties emerge from the collective behavior of microscopic constituents. A <em>microstate</em> specifies the exact configuration of every particle in the system, while a <em>macrostate</em> describes only the measurable, macroscopic quantities.
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <p className="text-center font-mono text-sm mb-2">Fundamental Postulate</p>
              <div className="text-center">
                <BlockMath math="\Omega(E) = \text{number of microstates with energy } E" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The multiplicity function <InlineMath math="\Omega(E)" /> counts how many ways we can arrange the microscopic degrees of freedom while maintaining the same total energy. This combinatorial counting lies at the heart of statistical mechanics.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">The Boltzmann Distribution</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When a system is in thermal equilibrium with a heat bath at temperature T, the probability of finding it in a microstate with energy <InlineMath math="E_i" /> follows the Boltzmann distribution:
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <div className="text-center">
                <BlockMath math="P_i = \frac{e^{-E_i/k_B T}}{Z}" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                where <InlineMath math="Z = \sum_i e^{-E_i/k_B T}" /> is the partition function
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The exponential suppression of high-energy states reflects the tendency of systems to minimize energy at low temperatures, while the normalization by Z ensures probabilities sum to unity.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">The Partition Function</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The partition function Z is the central object in statistical mechanics. All thermodynamic quantities can be derived from it:
            </p>
            <div className="space-y-4 my-6">
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <span className="font-serif font-bold min-w-[140px]">Free Energy:</span>
                <InlineMath math="F = -k_B T \ln Z" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <span className="font-serif font-bold min-w-[140px]">Average Energy:</span>
                <InlineMath math="\langle E \rangle = -\frac{\partial \ln Z}{\partial \beta}" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <span className="font-serif font-bold min-w-[140px]">Entropy:</span>
                <InlineMath math="S = k_B (\ln Z + \beta \langle E \rangle)" />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Quantum Statistics</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At low temperatures or high densities, quantum effects become important. The indistinguishability of identical particles leads to two fundamentally different types of statistics:
            </p>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-serif font-bold mb-2">Fermi-Dirac</h3>
                <p className="text-sm text-muted-foreground mb-3">For fermions (half-integer spin)</p>
                <div className="text-center">
                  <BlockMath math="\bar{n}_i = \frac{1}{e^{(\epsilon_i - \mu)/k_B T} + 1}" />
                </div>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-serif font-bold mb-2">Bose-Einstein</h3>
                <p className="text-sm text-muted-foreground mb-3">For bosons (integer spin)</p>
                <div className="text-center">
                  <BlockMath math="\bar{n}_i = \frac{1}{e^{(\epsilon_i - \mu)/k_B T} - 1}" />
                </div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The Pauli exclusion principle for fermions (<InlineMath math="\bar{n}_i \leq 1" />) and Bose-Einstein condensation for bosons are direct consequences of these distributions.
            </p>
          </section>
        </motion.div>
      </article>
    </main>
  )
}
