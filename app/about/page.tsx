"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

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
            &larr; back home
          </Link>
          <h1 className="text-4xl md:text-5xl font-sans font-light tracking-tight mb-4">
            about
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
              {"I'm"} Mohammed Faheem, a freshman studying Interactive Media at NYU Abu Dhabi. 
              My work sits at the intersection of bioengineering, creative technology, and human experience.
            </p>
            <p>
              I believe in building things that matter - whether {"it's"} research that could improve 
              healthcare accessibility or creative projects that explore how we connect with technology 
              and each other.
            </p>
            <p>
              When {"I'm"} not in the lab or coding, you can find me experimenting with photography, 
              getting lost in philosophical discussions about consciousness and AI, or obsessing 
              over the perfect cup of coffee.
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
              quick facts
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">location</span>
                <p className="font-medium mt-1">Abu Dhabi, UAE</p>
              </div>
              <div>
                <span className="text-muted-foreground">studying</span>
                <p className="font-medium mt-1">Interactive Media @ NYUAD</p>
              </div>
              <div>
                <span className="text-muted-foreground">interests</span>
                <p className="font-medium mt-1">Bioengineering, AI, Philosophy</p>
              </div>
              <div>
                <span className="text-muted-foreground">currently reading</span>
                <p className="font-medium mt-1">{"Gödel, Escher, Bach"}</p>
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
              get in touch
            </h2>
            <div className="flex flex-wrap gap-6">
              <a
                href="mailto:hello@faheem.dev"
                className="text-sm text-accent hover:text-foreground transition-colors interactive link-hover"
              >
                email
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-foreground transition-colors interactive link-hover"
              >
                instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-foreground transition-colors interactive link-hover"
              >
                linkedin
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-foreground transition-colors interactive link-hover"
              >
                github
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
            this website is forever ongoing, and will be regularly updated with new work
          </p>
        </motion.div>
      </div>
    </main>
  )
}
