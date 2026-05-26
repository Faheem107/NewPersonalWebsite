"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LinearAlgebraPage() {
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
            Linear Algebra
          </h1>
          <p className="text-lg text-muted-foreground">
            Vector spaces, operators, and the mathematics of quantum mechanics
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Vector Spaces</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A vector space V over a field F is a set equipped with addition and scalar multiplication satisfying closure, associativity, commutativity, and distributivity axioms.
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <p className="font-serif font-bold mb-3">Key Concepts</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Linear independence:</strong> No vector can be written as a linear combination of others</li>
                <li><strong>Span:</strong> The set of all linear combinations of a set of vectors</li>
                <li><strong>Basis:</strong> A linearly independent spanning set</li>
                <li><strong>Dimension:</strong> The number of vectors in any basis</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Linear Transformations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A linear transformation {"$$T: V \\to W$$"} preserves vector addition and scalar multiplication:
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 space-y-2">
              <p className="text-center font-mono">{"$$T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$$"}</p>
              <p className="text-center font-mono">{"$$T(c\\mathbf{v}) = cT(\\mathbf{v})$$"}</p>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Once bases are chosen, every linear transformation can be represented by a matrix. The matrix representation depends on the choice of bases.
            </p>
            <div className="space-y-3 my-6">
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <span className="font-serif font-bold min-w-[100px]">Kernel:</span>
                <span className="text-sm text-muted-foreground">{"$$\\ker(T) = \\{\\mathbf{v} : T(\\mathbf{v}) = \\mathbf{0}\\}$$"}</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <span className="font-serif font-bold min-w-[100px]">Image:</span>
                <span className="text-sm text-muted-foreground">{"$$\\text{im}(T) = \\{T(\\mathbf{v}) : \\mathbf{v} \\in V\\}$$"}</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The rank-nullity theorem: {"$$\\dim(\\ker T) + \\dim(\\text{im } T) = \\dim(V)$$"}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Eigenvalues and Eigenvectors</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              An eigenvector of a linear operator A is a nonzero vector whose direction is unchanged by A:
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <p className="text-center text-lg">{"$$A\\mathbf{v} = \\lambda\\mathbf{v}$$"}</p>
              <p className="text-center text-sm text-muted-foreground mt-3">
                {"where $$\\lambda$$ is the eigenvalue"}
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Eigenvalues are found from the characteristic polynomial:
            </p>
            <p className="text-center font-mono my-4">{"$$\\det(A - \\lambda I) = 0$$"}</p>
            <p className="text-muted-foreground leading-relaxed">
              In quantum mechanics, eigenvalues represent possible measurement outcomes and eigenvectors represent the corresponding states.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Inner Product Spaces</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              An inner product {"$$\\langle \\cdot, \\cdot \\rangle: V \\times V \\to F$$"} satisfies:
            </p>
            <div className="space-y-3 my-6">
              <div className="p-4 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">Conjugate symmetry: </span>
                <span className="font-mono text-sm">{"$$\\langle u, v \\rangle = \\overline{\\langle v, u \\rangle}$$"}</span>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">Linearity: </span>
                <span className="font-mono text-sm">{"$$\\langle au + bw, v \\rangle = a\\langle u, v \\rangle + b\\langle w, v \\rangle$$"}</span>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">Positive definiteness: </span>
                <span className="font-mono text-sm">{"$$\\langle v, v \\rangle \\geq 0$$ with equality iff $$v = 0$$"}</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The inner product defines the norm {"$$||v|| = \\sqrt{\\langle v, v \\rangle}$$"} and allows us to speak of orthogonality and angles between vectors.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">The Spectral Theorem</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For a Hermitian (self-adjoint) operator on a finite-dimensional inner product space:
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>All eigenvalues are real</li>
                <li>Eigenvectors corresponding to distinct eigenvalues are orthogonal</li>
                <li>There exists an orthonormal basis of eigenvectors</li>
              </ul>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This theorem is fundamental to quantum mechanics, where observables are represented by Hermitian operators and measurements project onto eigenspaces.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Dirac Notation</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In quantum mechanics, we use Dirac notation for vectors in Hilbert space:
            </p>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 border border-border rounded-lg text-center">
                <h3 className="font-serif font-bold mb-2 text-sm">Ket</h3>
                <p className="font-mono">{"$$|\\psi\\rangle$$"}</p>
                <p className="text-xs text-muted-foreground mt-2">Column vector</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <h3 className="font-serif font-bold mb-2 text-sm">Bra</h3>
                <p className="font-mono">{"$$\\langle\\psi|$$"}</p>
                <p className="text-xs text-muted-foreground mt-2">Row vector (dual)</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The inner product is written {"$$\\langle\\phi|\\psi\\rangle$$"} and the outer product {"$$|\\psi\\rangle\\langle\\phi|$$"} forms a linear operator.
            </p>
          </section>
        </motion.div>
      </article>
    </main>
  )
}
