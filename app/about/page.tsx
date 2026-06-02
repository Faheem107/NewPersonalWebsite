"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import VantaBackground from "@/components/vanta-bg"
import { useTheme } from "next-themes"

export default function AboutPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by waiting until component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if we are in light mode specifically for this page
  const isLightMode = mounted && resolvedTheme === "light"

  return (
    <main 
      className="min-h-screen relative overflow-hidden transition-colors duration-700"
      // Dynamically override the background color in light mode to match the Halo backdrop
      style={{ backgroundColor: isLightMode ? "#d7baba" : "var(--background)" }}
    >
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
              Alongside my coursework and lab research, I am deeply involved in science communication and visual arts. I believe scientific education holds its greatest value when it is shared across multiple mediums of communication. It is important to uphold the philosophy behind what we study as scientists, keeping our work rooted in the belief that science must ultimately benefit humanity. This is what I aim for in my education: to progress, and at the same time, to share.
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
            {/* Optimized grid: evenly spaces items out on desktop and aligns University to the far right text-alignment */}
            <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-4 text-sm">
              <div className="flex-1 min-w-[120px]">
                <span className="text-muted-foreground block mb-1">Location</span>
                <p className="font-bold text-foreground">Abu Dhabi, UAE</p>
              </div>
              <div className="flex-1 md:max-w-[40%]">
                <span className="text-muted-foreground block mb-1">Major</span>
                <p className="font-bold text-foreground leading-snug">Physics and Film & New Media</p>
              </div>
              <div className="flex-1 min-w-[140px] md:text-right">
                <span className="text-muted-foreground block mb-1">University</span>
                <p className="font-bold text-foreground">NYU Abu Dhabi</p>
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