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
  gradient: string
}

const NOTES: NoteSection[] = [
  {
    id: "statistical-mechanics",
    title: "Statistical Mechanics",
    description: "The bridge between microscopic physics and macroscopic thermodynamics",
    topics: ["Microstates & Macrostates", "Boltzmann Distribution", "Partition Functions", "Quantum Statistics"],
    gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
  },
  {
    id: "thermodynamics",
    title: "Thermodynamics",
    description: "The laws governing energy, entropy, and the arrow of time",
    topics: ["Laws of Thermodynamics", "Entropy & Free Energy", "Phase Transitions", "Heat Engines"],
    gradient: "from-orange-500/10 via-red-500/5 to-transparent",
  },
  {
    id: "electromagnetism",
    title: "Electromagnetism & Special Relativity",
    description: "Maxwell's equations and the geometry of spacetime",
    topics: ["Maxwell's Equations", "Electromagnetic Waves", "Lorentz Transformations", "Relativistic Dynamics"],
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
  },
  {
    id: "differential-equations",
    title: "Differential Equations",
    description: "The language of change and dynamical systems",
    topics: ["ODEs & PDEs", "Boundary Value Problems", "Green's Functions", "Eigenvalue Problems"],
    gradient: "from-green-500/10 via-emerald-500/5 to-transparent",
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra",
    description: "Vector spaces, operators, and the mathematics of quantum mechanics",
    topics: ["Vector Spaces", "Linear Transformations", "Eigenvalues & Eigenvectors", "Inner Product Spaces"],
    gradient: "from-yellow-500/10 via-amber-500/5 to-transparent",
  },
]

export default function NotesPage() {
  const [hoveredNote, setHoveredNote] = useState<string | null>(null)

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
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-sans font-bold mb-4 tracking-tight">
            Notes
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A collection of physics and mathematics notes from my studies. 
            These are living documents, continuously refined as understanding deepens.
          </p>
        </motion.header>

        {/* Notes Grid */}
        <div className="space-y-4">
          {NOTES.map((note, index) => (
            <motion.article
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.08, 
                duration: 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
            >
              <Link href={`/notes/${note.id}`} prefetch={true}>
                <motion.div
                  className={`relative overflow-hidden rounded-xl border border-border/40 p-6 cursor-pointer interactive transition-colors duration-300 hover:border-foreground/20`}
                  onMouseEnter={() => setHoveredNote(note.id)}
                  onMouseLeave={() => setHoveredNote(null)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Glassy gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${note.gradient} opacity-0 transition-opacity duration-300 ${hoveredNote === note.id ? 'opacity-100' : ''}`} />
                  <div className="absolute inset-0 backdrop-blur-[1px]" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-sans font-bold mb-2 tracking-tight">
                          {note.title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {note.description}
                        </p>
                      </div>
                      <motion.span
                        className="text-muted-foreground/50 text-xl mt-1"
                        animate={{ x: hoveredNote === note.id ? 4 : 0, opacity: hoveredNote === note.id ? 1 : 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </div>

                    {/* Topics */}
                    <AnimatePresence>
                      {hoveredNote === note.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
                            {note.topics.map((topic, i) => (
                              <motion.span
                                key={topic}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03, duration: 0.2 }}
                                className="text-xs px-3 py-1.5 bg-foreground/5 rounded-full text-muted-foreground font-sans"
                              >
                                {topic}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Footer Note */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 pt-8 border-t border-border/30"
        >
          <p className="text-sm text-muted-foreground/70 italic">
            These notes are inspired by the style of academic notebooks, 
            emphasizing clarity and mathematical rigor. Continuously updated 
            as I progress through my physics curriculum at NYU Abu Dhabi.
          </p>
        </motion.footer>
      </div>
    </main>
  )
}
