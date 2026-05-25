"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl mx-auto px-8 py-24 md:py-32">
        {/* Header */}
        <motion.div
          className="mb-12"
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
            About
          </h1>
        </motion.div>

        {/* About Content */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Main Bio */}
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              {"I'm"} Mohammed Faheem, a student at NYU Abu Dhabi majoring in Physics 
              with a minor in Film and New Media. My work explores the intersection of 
              scientific inquiry and creative expression.
            </p>
            <p>
              I believe in building things that matter - whether {"it's"} research that pushes 
              the boundaries of our understanding or creative projects that explore how we 
              connect with the world around us.
            </p>
            <p>
              When {"I'm"} not in the lab or working on films, you can find me experimenting 
              with photography, getting lost in philosophical discussions about consciousness 
              and the nature of reality, or obsessing over the perfect cup of coffee.
            </p>
          </div>

          {/* Quick Facts */}
          <motion.div
            className="border-t border-border pt-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">
              Quick Facts
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Location</span>
                <p className="font-bold mt-1">Abu Dhabi, UAE</p>
              </div>
              <div>
                <span className="text-muted-foreground">Studying</span>
                <p className="font-bold mt-1">Physics (Major) @ NYUAD</p>
              </div>
              <div>
                <span className="text-muted-foreground">Minor</span>
                <p className="font-bold mt-1">Film and New Media</p>
              </div>
              <div>
                <span className="text-muted-foreground">Currently Reading</span>
                <p className="font-bold mt-1">{"Gödel, Escher, Bach"}</p>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="border-t border-border pt-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">
              Get In Touch
            </h2>
            <div className="flex flex-wrap gap-6">
              <a
                href="mailto:hello@faheem.dev"
                className="text-sm text-accent hover:text-foreground transition-colors interactive link-hover"
              >
                Email
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-foreground transition-colors interactive link-hover"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-foreground transition-colors interactive link-hover"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-foreground transition-colors interactive link-hover"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs font-mono text-muted-foreground text-center">
            This website is forever ongoing, and will be regularly updated with new work
          </p>
        </motion.div>
      </div>
    </main>
  )
}
