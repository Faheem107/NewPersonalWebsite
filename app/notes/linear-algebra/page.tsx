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

export default function LinearAlgebraPage() {
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
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground/50 mb-3">Mathematics</p>
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">Linear Algebra</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            The mathematics of transformation, direction, and dimension — and the secret language of quantum mechanics.
          </p>
        </motion.header>

        <Section title="Vectors Are Not Arrows" delay={0.1}>
          <p>
            Most people first encounter vectors as arrows in two or three dimensions. That is a
            perfectly good start. But the deeper idea is more general and more powerful.
          </p>
          <p>
            A vector space is any set of objects that can be added together and scaled by numbers,
            as long as those operations behave sensibly — associativity, commutativity, distributivity,
            and so on. The objects could be arrows in space. But they could also be polynomials,
            or continuous functions on an interval, or infinite sequences of numbers, or quantum states.
          </p>
          <p>
            This generality is what makes linear algebra so pervasive. Once you identify the right
            vector space, powerful machinery kicks in: you can talk about bases, dimensions,
            transformations, and orthogonality, all in complete abstraction from the specific
            objects involved.
          </p>
          <Diagram caption="Examples of vector spaces — very different objects, same abstract structure">
{`  Object              Addition                   Scaling
  ──────────────      ──────────────────────     ───────────────────
  Arrows in ℝ³        Tip-to-tail                Stretch or shrink
  Polynomials         (p+q)(x) = p(x)+q(x)       (cp)(x) = c·p(x)
  Functions f:[0,1]→ℝ (f+g)(x) = f(x)+g(x)       (cf)(x) = c·f(x)
  Quantum states |ψ⟩  |ψ⟩+|φ⟩  (superposition)  c|ψ⟩  (amplitude)`}
          </Diagram>
        </Section>

        <Section title="Bases, Dimension, and Coordinates" delay={0.15}>
          <p>
            A basis is a minimal spanning set — a collection of vectors that (a) span the space,
            meaning every vector in the space can be written as a linear combination of them, and
            (b) are linearly independent, meaning none of them is redundant.
          </p>
          <p>
            The number of vectors in any basis is the dimension of the space. This is a theorem —
            you can prove that any two bases for the same space have the same number of elements.
            Dimension is a property of the space itself, not of any particular basis.
          </p>
          <p>
            Once you choose a basis <InlineMath math="\{e_1, \ldots, e_n\}" />, every vector gets
            a unique coordinate representation. This is what makes linear algebra computational:
            abstract vectors become concrete arrays of numbers. But remember — the numbers depend
            on the basis. The vector itself does not.
          </p>
        </Section>

        <Section title="Linear Transformations and Matrices" delay={0.2}>
          <p>
            A linear transformation is a function between vector spaces that respects the structure —
            it preserves addition and scalar multiplication. In coordinates, every linear
            transformation between finite-dimensional spaces corresponds to multiplication by a matrix.
          </p>
          <Eq math="T(\mathbf{u} + \mathbf{v}) = T\mathbf{u} + T\mathbf{v}, \qquad T(c\mathbf{v}) = c\,T\mathbf{v}" label="Linearity Conditions" />
          <p>
            The kernel of <InlineMath math="T" /> is the set of vectors that get sent to zero.
            The image is the set of all output vectors. The rank-nullity theorem is a conservation
            law for dimensions:
          </p>
          <Eq math="\dim(\ker T) + \dim(\mathrm{im}\, T) = \dim(V)" label="Rank-Nullity Theorem" />
          <p>
            This says something intuitive but powerful: if a transformation collapses a lot of
            directions to zero (large kernel), it can only reach a small part of the output space
            (small image). You cannot gain dimensions from a linear map.
          </p>
        </Section>

        <Section title="Eigenvalues — The Natural Axes" delay={0.25}>
          <p>
            An eigenvector of a transformation is a vector that the transformation merely scales —
            it does not change direction. The scaling factor is the eigenvalue.
          </p>
          <Eq math="A\mathbf{v} = \lambda\mathbf{v}" label="Eigenvalue Equation" />
          <p>
            This is why eigenvectors are special: they are the natural axes of the transformation.
            If you write a transformation in the basis of its own eigenvectors, it becomes diagonal —
            just a list of scaling factors. All the apparent complexity of the transformation is
            reduced to a few numbers.
          </p>
          <p>
            Eigenvalues are found by solving the characteristic polynomial
            <InlineMath math="\det(A - \lambda I) = 0" />. For an <InlineMath math="n \times n" /> matrix,
            this gives a degree-<InlineMath math="n" /> polynomial, hence up to <InlineMath math="n" /> eigenvalues.
          </p>
          <Diagram caption="Geometric interpretation — eigenvectors are directions unchanged by the transformation">
{`  A general vector v:          An eigenvector v:
  
        Av                            Av = λv
       ╱                              ▲
      ╱                               │  (only stretched)
     ╱                                │
    v ────▶ Av (rotated + scaled)    v │
                                       │
                                       ▼`}
          </Diagram>
        </Section>

        <Section title="Inner Products, Orthogonality, and the Spectral Theorem" delay={0.3}>
          <p>
            An inner product gives a vector space a notion of length and angle. For vectors in
            <InlineMath math="\mathbb{R}^n" />, it is the dot product. For functions, it is typically
            an integral <InlineMath math="\langle f, g \rangle = \int f(x) g(x)\, dx" />.
          </p>
          <p>
            Two vectors are orthogonal if their inner product is zero. An orthonormal basis is
            one where all basis vectors are orthogonal and have unit length. In such a basis,
            coordinates are found by projection: <InlineMath math="c_i = \langle \mathbf{v}, e_i \rangle" />.
            This is why Fourier series work — the trigonometric functions form an orthonormal
            basis for the space of periodic functions.
          </p>
          <p>
            The spectral theorem is the crown jewel of linear algebra for physicists. It says that
            any Hermitian (self-adjoint) operator on a finite-dimensional inner product space can
            be diagonalised by an orthonormal basis of eigenvectors, with real eigenvalues.
          </p>
          <Eq math="A = A^\dagger \implies A = \sum_i \lambda_i \,|e_i\rangle\langle e_i|" label="Spectral Decomposition" />
          <p>
            In quantum mechanics, observables are Hermitian operators. The spectral theorem
            guarantees that measurements yield real values (eigenvalues) and that the
            eigenstates form a complete basis. The act of measurement is a projection onto
            an eigenspace. All of this is just the spectral theorem, dressed in physics.
          </p>
        </Section>

        <Section title="Dirac Notation — Linear Algebra for Physicists" delay={0.35}>
          <p>
            Physicists use Dirac notation as a cleaner way to write inner product space operations.
            A state vector is a ket <InlineMath math="|\psi\rangle" />; its dual is a bra
            <InlineMath math="\langle\psi|" />; their pairing is the bracket (bra-ket):
            <InlineMath math="\langle\phi|\psi\rangle" />.
          </p>
          <Diagram caption="Dirac notation maps cleanly onto linear algebra operations">
{`  Linear algebra           Dirac notation
  ──────────────           ──────────────
  Vector v                 |ψ⟩           (ket)
  Dual vector              ⟨ψ|           (bra)  
  Inner product ⟨u,v⟩      ⟨φ|ψ⟩         (braket)
  Outer product u⊗v*       |ψ⟩⟨φ|        (projection operator)
  Matrix element Aᵢⱼ       ⟨i|A|j⟩       (matrix element)`}
          </Diagram>
          <p>
            The completeness relation <InlineMath math="\sum_i |e_i\rangle\langle e_i| = \mathbf{1}" />
            is just the statement that the eigenstates form a complete basis — you can expand any
            state in terms of them. It looks like a trivial identity, but it is actually a powerful
            computational tool: insert it strategically inside a calculation to switch between bases.
          </p>
        </Section>
      </article>
    </main>
  )
}
