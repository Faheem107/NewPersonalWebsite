"use client"

import React from "react"
import { motion } from "framer-motion"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import VantaBackground from "@/components/vanta-bg"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <CustomCursor />
      <Navigation />
      <VantaBackground type="halo" />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl mx-auto px-8 py-24 md:py-32 relative z-10">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">
            About
          </h1>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Hi! I am Mohammed Faheem. I am a second-year student at NYU Abu Dhabi majoring in Physics with a minor in Film & New Media. My academic work primarily revolves around using mathematical and computational tools to understand biological systems and physical phenomena.
            </p>
            <p>
              Alongside my coursework and lab research, I am deeply involved in science communication and visual arts. I believe scientific education holds its greatest value when it is shared across multiple mediums. It is important to uphold the philosophy behind what we study, keeping our work rooted in the belief that science must ultimately benefit humanity. This is what I aim for in my education: to progress, and at the same time, to share.
            </p>
            <p>
              Outside of academics and filmmaking, I also enjoy football and reading!
            </p>
          </div>

          <motion.div
            className="border-t border-border/40 pt-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">
              Quick Facts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Location</span>
                <p className="font-bold">Abu Dhabi, UAE</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Major</span>
                <p className="font-bold">Physics and Film & New Media</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">University</span>
                <p className="font-bold">NYU Abu Dhabi</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="border-t border-border/40 pt-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">
              Get In Touch
            </h2>
            <div className="flex flex-wrap gap-6">
              <a
                href="mailto:mj3398@nyu.edu"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors interactive font-medium"
              >
                Email
              </a>
              <a
                href="https://linkedin.com/in/mohammed-faheem-33bb49295"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors interactive font-medium"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com/faheemmmm._"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors interactive font-medium"
              >
                Instagram
              </a>
              <a
                href="https://github.com/Faheem107"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors interactive font-medium"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 pt-8 border-t border-border/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs font-mono text-muted-foreground text-center">
            This archive is forever ongoing. Latest update: May 2026
          </p>
        </motion.div>
      </div>
    </main>
  )
}