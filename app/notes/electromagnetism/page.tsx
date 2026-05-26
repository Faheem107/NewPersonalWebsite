"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

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
            Electromagnetism & Special Relativity
          </h1>
          <p className="text-lg text-muted-foreground">
            {"Maxwell's equations and the geometry of spacetime"}
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">{"Maxwell's Equations"}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {"Maxwell's four equations unify electricity, magnetism, and optics into a single theoretical framework. In differential form:"}
            </p>
            
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <InlineMath math="\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}" />
                <span className="text-sm text-muted-foreground">{"(Gauss's law)"}</span>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <InlineMath math="\nabla \cdot \mathbf{B} = 0" />
                <span className="text-sm text-muted-foreground">(No magnetic monopoles)</span>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <InlineMath math="\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}" />
                <span className="text-sm text-muted-foreground">{"(Faraday's law)"}</span>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <InlineMath math="\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}" />
                <span className="text-sm text-muted-foreground">{"(Ampère-Maxwell)"}</span>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Electromagnetic Waves</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"In vacuum, Maxwell's equations predict transverse electromagnetic waves propagating at the speed of light:"}
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <div className="text-center">
                <BlockMath math="c = \frac{1}{\sqrt{\mu_0 \epsilon_0}} \approx 3 \times 10^8 \text{ m/s}" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {"This remarkable result—that light is an electromagnetic wave—unified optics with electromagnetism and led Einstein to develop special relativity."}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Special Relativity</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"Einstein's two postulates of special relativity:"}
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
              <li>The laws of physics are the same in all inertial reference frames</li>
              <li>The speed of light in vacuum is constant for all observers</li>
            </ol>
            
            <h3 className="text-xl font-serif font-bold mb-3">Lorentz Transformations</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"For frames moving with relative velocity v along the x-axis:"}
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 space-y-2">
              <div className="text-center"><BlockMath math="t' = \gamma(t - vx/c^2)" /></div>
              <div className="text-center"><BlockMath math="x' = \gamma(x - vt)" /></div>
              <div className="text-center"><BlockMath math="y' = y, \quad z' = z" /></div>
              <p className="text-center text-sm text-muted-foreground mt-3">
                where <InlineMath math="\gamma = 1/\sqrt{1 - v^2/c^2}" /> is the Lorentz factor
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Spacetime and Four-Vectors</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"The spacetime interval between events is invariant under Lorentz transformations:"}
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <div className="text-center">
                <BlockMath math="ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"Physical quantities naturally group into four-vectors:"}
            </p>
            <div className="space-y-3 my-6">
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <span className="font-serif font-bold min-w-[120px]">Position:</span>
                <InlineMath math="x^\mu = (ct, x, y, z)" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <span className="font-serif font-bold min-w-[120px]">Momentum:</span>
                <InlineMath math="p^\mu = (E/c, p_x, p_y, p_z)" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <span className="font-serif font-bold min-w-[120px]">Current:</span>
                <InlineMath math="J^\mu = (c\rho, J_x, J_y, J_z)" />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Relativistic Energy-Momentum</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"The energy-momentum relation for a particle of rest mass m:"}
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <div className="text-center">
                <BlockMath math="E^2 = (pc)^2 + (mc^2)^2" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-3">
                For massless particles: <InlineMath math="E = pc" />
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The famous equation <InlineMath math="E = mc^2" /> represents the rest energy of a massive particle, revealing the equivalence of mass and energy.
            </p>
          </section>
        </motion.div>
      </article>
    </main>
  )
}
