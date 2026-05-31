"use client"

import React from "react"
import { motion } from "framer-motion"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import VantaBackground from "@/components/vanta-bg"

const RESEARCH_PROJECTS = [
  {
    title: "Laidlaw Research Scholar",
    location: "Laidlaw Foundation",
    description: "I am conducting independent research funded by the Laidlaw Foundation. My focus is on the diffusive queueing dynamics of mRNA transcription. I am currently developing stochastic models to test activation signatures in single molecule transcription data.",
    year: "Mar 2026 - Present"
  },
  {
    title: "Biophysics Research Assistant",
    location: "University of Cambridge",
    description: "I analyze microscopy data to understand instability in cortical condensates within C. elegans oocytes. During the summer of 2025, I extended this work at the University of Cambridge by studying the mathematics of resource competition in soft matter and improving dry lab workflows.",
    year: "July 2025 - August 2025"
  },
  {
    title: "Computational Biology & iGEM",
    location: "NYU Abu Dhabi",
    description: "I serve on the dry lab and education team for our university's iGEM team. I help develop computational tools for synthetic biology research and organize educational outreach initiatives ahead of the iGEM 2026 conference in Paris.",
    year: "Dec 2025 - Present"
  },
  {
    title: "Bioinformatics Intern",
    location: "Harmonic Discovery",
    description: "During my internship, I organized biological datasets to assist with therapeutic drug design. I ran testing pipelines to analyze protein docking efficiency and estimate binding affinities to various ligands.",
    year: "Oct 2025 - Feb 2026"
  },
  {
    title: "Biomathematics Research",
    location: "NYU Abu Dhabi",
    description: "I worked under Professor Mazin Magzoub to study the probabilistic nature of RNA splicing. My responsibilities included developing computational methods to better understand RNA exon activity.",
    year: "Aug 2025 - Dec 2025"
  },
  {
    title: "Image Processing & Dynamics Intern",
    location: "Czech Academy of Sciences",
    description: "I designed a pipeline using Fiji and ilastik to highlight protein dynamics in actomyosin cortex activation. This allowed for the simultaneous tracking and processing of live cell datasets.",
    year: "Jun 2025 - Jul 2025"
  }
]

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <CustomCursor />
      <Navigation />
      <VantaBackground type="dots" />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl mx-auto px-8 py-24 md:py-32 relative z-10">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">
            Research
          </h1>
          <p className="text-lg text-muted-foreground">
            A brief summary of the lab work and computational projects I have been involved in!
          </p>
        </motion.div>

        <div className="space-y-12">
          {RESEARCH_PROJECTS.map((project, index) => (
            <motion.article
              key={project.title}
              className="border-b border-border/40 pb-12 last:border-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
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
                <span className="text-sm font-mono text-muted-foreground bg-foreground/5 px-3 py-1 rounded-full whitespace-nowrap">
                  {project.year}
                </span>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mt-4">
                {project.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  )
}