"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface NoteSection {
  id: string
  title: string
  description: string
  topics: string[]
}

const NOTES: NoteSection[] = [
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
  const [expandedNote, setExpandedNote] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 pt-32 pb-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            Notes
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A collection of physics and mathematics notes from my studies. 
            These are living documents, continuously refined as understanding deepens.
          </p>
        </motion.header>

        {/* Notes List */}
        <div className="space-y-4">
          {NOTES.map((note, index) => (
            <motion.article
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              className="group"
            >
              <Link href={`/notes/${note.id}`}>
                <div
                  className="border-b border-border py-6 cursor-pointer interactive transition-all duration-300 hover:border-foreground/30"
                  onMouseEnter={() => setExpandedNote(note.id)}
                  onMouseLeave={() => setExpandedNote(null)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-serif font-bold mb-2 group-hover:text-foreground transition-colors">
                        {note.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {note.description}
                      </p>
                    </div>
                    <motion.span
                      className="text-muted-foreground text-xl"
                      animate={{ x: expandedNote === note.id ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {"\u2192"}
                    </motion.span>
                  </div>

                  {/* Expandable Topics */}
                  <AnimatePresence>
                    {expandedNote === note.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                          {note.topics.map((topic) => (
                            <span
                              key={topic}
                              className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Footer Note */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground italic">
            These notes are inspired by the style of academic notebooks, 
            emphasizing clarity and mathematical rigor. They are continuously updated 
            as I progress through my physics curriculum at NYU Abu Dhabi.
          </p>
        </motion.footer>
      </div>
    </main>
  )
}
