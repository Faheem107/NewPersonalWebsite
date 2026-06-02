"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import VantaBackground from "@/components/vanta-bg"

const NOTES_DATA = [
  {
    id: "statistical-mechanics",
    title: "Statistical Mechanics",
    description: "Notes on probability distributions, partition functions, and thermodynamic states.",
    topics: [
      { name: "Probability Distributions", slug: "probability-distributions" },
      { name: "Microcanonical Ensembles", slug: "microcanonical-ensembles" },
      { name: "Ising Model & Phase Transitions", slug: "ising-model" }
    ]
  },
  {
    id: "thermodynamics",
    title: "Thermodynamics",
    description: "Mathematical formulations of energy transfer, classical potentials, and entropy.",
    topics: [
      { name: "Laws of Thermodynamics", slug: "laws" },
      { name: "Maxwell Relations", slug: "maxwell-relations" },
      { name: "Free Energy & Equilibrium", slug: "free-energy" }
    ]
  },
  {
    id: "electromagnetism",
    title: "Electromagnetism",
    description: "Summaries of Maxwell's equations, boundary value problems, and radiation fields.",
    topics: [
      { name: "Electrostatics & Laplace Equation", slug: "electrostatics" },
      { name: "Magnetostatics in Media", slug: "magnetostatics" },
      { name: "Electromagnetic Waves", slug: "em-waves" }
    ]
  },
  {
    id: "differential-equations",
    title: "Differential Equations",
    description: "Analytical and numerical methods for solving linear and non-linear partial differential systems.",
    topics: [
      { name: "Separation of Variables", slug: "separation" },
      { name: "Green's Functions", slug: "greens-functions" },
      { name: "Sturm-Liouville Theory", slug: "sturm-liouville" }
    ]
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra",
    description: "Rigorous concepts involving inner product spaces, matrix decompositions, and spectral theory.",
    topics: [
      { name: "Vector Spaces & Subspaces", slug: "vector-spaces" },
      { name: "Eigenvalues & Spectral Theorem", slug: "spectral-theorem" },
      { name: "Singular Value Decomposition", slug: "svd" }
    ]
  }
]

export default function NotesPage() {
  // Capture localized pointer coordinates on each individual card boundarybox
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden transition-colors duration-300">
      <CustomCursor />
      <Navigation />
      <VantaBackground type="trunk" />

      {/* Global Frosted Glass Field Blur */}
      <div className="fixed inset-0 pointer-events-none backdrop-blur-[8px] bg-background/30 z-0" />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 pt-36 pb-32 relative z-10">
        <motion.header 
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">
            Notes
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            A structured repository of mathematical proofs and comprehensive topics from my classes. Updates are currently underway!
          </p>
        </motion.header>

        {/* Premium 2-Column Premium Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {NOTES_DATA.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              onMouseMove={handleMouseMove}
              className="group relative flex flex-col rounded-[2rem] border border-foreground/[0.09] dark:border-white/[0.09] bg-background/50 dark:bg-[#09090b]/40 transition-all duration-500 overflow-hidden shadow-xl backdrop-blur-3xl"
            >
              {/* STRONG LIGHT MODE GLOW (High-Contrast Black Drop) */}
              <div 
                className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 dark:hidden rounded-[2rem]"
                style={{
                  background: `radial-gradient(380px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0,0,0,0.12), transparent 65%)`
                }}
              />

              {/* STRONG DARK MODE GLOW (High-Contrast Vivid White Drop) */}
              <div 
                className="absolute -inset-px opacity-0 hidden dark:block dark:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 rounded-[2rem]"
                style={{
                  background: `radial-gradient(380px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255,255,255,0.14), transparent 65%)`
                }}
              />

              {/* Card Body Core */}
              <div className="p-8 relative z-10 flex-grow flex flex-col justify-between">
                <div className="mb-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-2xl font-sans font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                      {subject.title}
                    </h2>
                    <span className="text-xs font-mono text-muted-foreground bg-foreground/[0.04] dark:bg-white/[0.04] border border-foreground/5 dark:border-white/5 px-2.5 py-1 rounded-full">
                      {subject.topics.length} items
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {subject.description}
                  </p>
                </div>

                {/* Always-On Clean Topic Cluster */}
                <div className="border-t border-foreground/[0.06] dark:border-white/[0.06] pt-6">
                  <h3 className="text-xs font-mono tracking-wider uppercase text-muted-foreground/60 mb-3 block">
                    Core Modules
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {subject.topics.map((topic) => (
                      <Link
                        key={topic.slug}
                        href={`/notes/${subject.id}`}
                        prefetch={true}
                        className="interactive inline-flex items-center text-xs font-medium px-3.5 py-2 rounded-xl bg-foreground/[0.03] dark:bg-white/[0.03] border border-foreground/[0.05] dark:border-white/[0.05] text-foreground/80 hover:text-background dark:hover:text-black hover:bg-foreground dark:hover:bg-white hover:border-transparent transition-all duration-200"
                      >
                        {topic.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}