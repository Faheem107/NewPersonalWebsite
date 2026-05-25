"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const RESEARCH_PROJECTS = [
  {
    title: "Quantum Optics Research",
    location: "NYUAD Physics Lab",
    description: "Investigating quantum entanglement and photon manipulation for applications in quantum computing and secure communications.",
    year: "2025-present"
  },
  {
    title: "Computational Astrophysics",
    location: "Collaborative Research Project",
    description: "Developing simulations to model stellar evolution and galaxy formation using high-performance computing clusters.",
    year: "2024-2025"
  },
  {
    title: "Condensed Matter Physics",
    location: "Physics Department",
    description: "Studying novel materials and their properties at low temperatures, with applications in superconductivity and energy storage.",
    year: "2024"
  }
]

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto px-8 py-24 md:py-32">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block interactive"
          >
            &larr; Back Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">
            Research
          </h1>
          <p className="text-lg text-muted-foreground">
            Exploring the fundamental nature of the universe through physics
          </p>
        </motion.div>

        {/* Research Projects Grid */}
        <div className="space-y-12">
          {RESEARCH_PROJECTS.map((project, index) => (
            <motion.article
              key={project.title}
              className="border-b border-border pb-12 last:border-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.3 }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-sans font-bold mb-1">
                    {project.title}
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    {project.location}
                  </p>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  {project.year}
                </span>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Footer Note */}
        <motion.p
          className="mt-16 text-sm text-muted-foreground font-mono text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          More projects coming soon...
        </motion.p>
      </div>
    </main>
  )
}
