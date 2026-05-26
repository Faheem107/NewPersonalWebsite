"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const NOTES = [
  {
    id: "statistical-mechanics",
    title: "Statistical Mechanics",
    description: "The bridge between microscopic physics and macroscopic thermodynamics",
    topics: ["Microstates & Macrostates", "Boltzmann Distribution", "Partition Functions", "Quantum Statistics"],
  },
  {
    id: "thermodynamics",
    title: "Thermodynamics",
    description: "The laws governing energy, entropy, and the arrow of time",
    topics: ["Laws of Thermodynamics", "Entropy & Free Energy", "Phase Transitions", "Heat Engines"],
  },
  {
    id: "electromagnetism",
    title: "Electromagnetism & Special Relativity",
    description: "Maxwell's equations and the geometry of spacetime",
    topics: ["Maxwell's Equations", "Electromagnetic Waves", "Lorentz Transformations", "Relativistic Dynamics"],
  },
  {
    id: "differential-equations",
    title: "Differential Equations",
    description: "The language of change and dynamical systems",
    topics: ["ODEs & PDEs", "Boundary Value Problems", "Green's Functions", "Eigenvalue Problems"],
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra",
    description: "Vector spaces, operators, and the mathematics of quantum mechanics",
    topics: ["Vector Spaces", "Linear Transformations", "Eigenvalues & Eigenvectors", "Inner Product Spaces"],
  },
]

export default function NotesPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-8 pt-36 pb-24">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-sans font-bold tracking-tight mb-5">
            Notes
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md">
            Physics and mathematics notes from my studies at NYU Abu Dhabi.
            Living documents — continuously refined as understanding deepens.
          </p>
        </motion.header>

        <div className="space-y-0">
          {NOTES.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link href={`/notes/${note.id}`} prefetch={true}>
                <div className="group py-7 border-b border-border/40 cursor-pointer interactive">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h2 className="text-xl font-sans font-bold tracking-tight mb-1.5 group-hover:text-foreground/70 transition-colors duration-200">
                        {note.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {note.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {note.topics.map((t) => (
                          <span key={t} className="text-xs text-muted-foreground/60 font-sans">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-muted-foreground/30 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all duration-200 mt-0.5 text-lg flex-shrink-0">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 text-xs text-muted-foreground/40 italic"
        >
          These notes emphasise clarity and mathematical rigour over completeness.
        </motion.p>
      </div>
    </main>
  )
}
