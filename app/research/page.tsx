"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"

const RESEARCH_PROJECTS = [
  {
    title: "Biomedical Signal Processing",
    location: "NYUAD Research Lab",
    description: "Developing novel algorithms for processing and analyzing biomedical signals using machine learning techniques. Focus on real-time ECG analysis and anomaly detection.",
    year: "2025-present"
  },
  {
    title: "Neural Interface Design",
    location: "Collaborative Research Project",
    description: "Exploring human-computer interaction through non-invasive neural interfaces. Working on signal acquisition and interpretation for accessibility applications.",
    year: "2024-2025"
  },
  {
    title: "Microfluidics for Diagnostics",
    location: "Bioengineering Department",
    description: "Designing point-of-care diagnostic devices using microfluidic principles. Focus on low-cost, portable solutions for resource-limited settings.",
    year: "2024"
  }
]

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

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
            &larr; back home
          </Link>
          <h1 className="text-4xl md:text-5xl font-sans font-light tracking-tight mb-4">
            research
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            exploring the intersection of biology, engineering, and technology
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
                  <h2 className="text-xl font-sans font-medium mb-1">
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
          more projects coming soon...
        </motion.p>
      </div>
    </main>
  )
}
