"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

export default function DifferentialEquationsPage() {
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
            Differential Equations
          </h1>
          <p className="text-lg text-muted-foreground">
            The language of change and dynamical systems
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Ordinary Differential Equations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              An ODE relates a function to its derivatives. The order is determined by the highest derivative present. Linear ODEs with constant coefficients admit exponential solutions:
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <p className="text-sm text-muted-foreground mb-2">For the equation:</p>
              <div className="text-center">
                <BlockMath math="a_n y^{(n)} + a_{n-1} y^{(n-1)} + \cdots + a_1 y' + a_0 y = 0" />
              </div>
              <p className="text-sm text-muted-foreground mt-4 mb-2">The characteristic equation:</p>
              <div className="text-center">
                <BlockMath math="a_n r^n + a_{n-1} r^{n-1} + \cdots + a_1 r + a_0 = 0" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The roots of the characteristic equation determine the form of the general solution. Real roots give exponentials, complex roots give oscillations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Partial Differential Equations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PDEs involve functions of multiple variables and their partial derivatives. The fundamental equations of physics are all PDEs:
            </p>
            <div className="space-y-4 my-6">
              <div className="p-5 border border-border rounded-lg">
                <h3 className="font-serif font-bold mb-2">Wave Equation</h3>
                <div className="text-center">
                  <BlockMath math="\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Describes propagating waves in elastic media, EM fields, etc.
                </p>
              </div>
              <div className="p-5 border border-border rounded-lg">
                <h3 className="font-serif font-bold mb-2">Heat/Diffusion Equation</h3>
                <div className="text-center">
                  <BlockMath math="\frac{\partial u}{\partial t} = \alpha \nabla^2 u" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Describes heat conduction, diffusion, Brownian motion
                </p>
              </div>
              <div className="p-5 border border-border rounded-lg">
                <h3 className="font-serif font-bold mb-2">Laplace Equation</h3>
                <div className="text-center">
                  <BlockMath math="\nabla^2 u = 0" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Describes steady-state temperature, electrostatic potential
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Boundary Value Problems</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Physical problems require boundary conditions to specify unique solutions. Common types:
            </p>
            <div className="grid md:grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-muted/20 rounded-lg text-center">
                <h3 className="font-serif font-bold mb-2 text-sm">Dirichlet</h3>
                <p className="text-xs text-muted-foreground mb-2">Value specified on boundary</p>
                <InlineMath math="u|_{\partial\Omega} = f" />
              </div>
              <div className="p-4 bg-muted/20 rounded-lg text-center">
                <h3 className="font-serif font-bold mb-2 text-sm">Neumann</h3>
                <p className="text-xs text-muted-foreground mb-2">Normal derivative specified</p>
                <InlineMath math="\frac{\partial u}{\partial n}|_{\partial\Omega} = g" />
              </div>
              <div className="p-4 bg-muted/20 rounded-lg text-center">
                <h3 className="font-serif font-bold mb-2 text-sm">Robin</h3>
                <p className="text-xs text-muted-foreground mb-2">Linear combination</p>
                <InlineMath math="au + b\frac{\partial u}{\partial n} = h" />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">{"Green's Functions"}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {"Green's functions provide a powerful method for solving inhomogeneous linear differential equations. The Green's function G(x, x') satisfies:"}
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <div className="text-center">
                <BlockMath math="\mathcal{L} G(x, x') = \delta(x - x')" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-3">
                where <InlineMath math="\mathcal{L}" /> is the differential operator
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The solution to <InlineMath math="\mathcal{L}u = f" /> is then given by convolution:
            </p>
            <div className="text-center my-4">
              <BlockMath math="u(x) = \int G(x, x') f(x') \, dx'" />
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Sturm-Liouville Theory</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Sturm-Liouville problem is an eigenvalue problem of the form:
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <div className="text-center">
                <BlockMath math="\frac{d}{dx}\left[p(x)\frac{dy}{dx}\right] + q(x)y = -\lambda w(x)y" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Key properties of Sturm-Liouville systems:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Eigenvalues are real</li>
              <li>Eigenfunctions corresponding to distinct eigenvalues are orthogonal</li>
              <li>Eigenfunctions form a complete basis for expanding functions</li>
            </ul>
          </section>
        </motion.div>
      </article>
    </main>
  )
}
