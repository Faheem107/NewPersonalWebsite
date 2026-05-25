"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const MISC_ITEMS = [
  {
    title: "My iPad Setup",
    description: "A collection of apps, workflows, and accessories that make my iPad the perfect creative companion. Features Procreate, GoodNotes, and a carefully curated set of productivity tools.",
    category: "tools"
  },
  {
    title: "Reading List 2026",
    description: "Books that shaped my thinking this year. From philosophy to science fiction, a mix of challenging ideas and pure escapism.",
    category: "reading"
  },
  {
    title: "Keyboard Builds",
    description: "My journey into mechanical keyboards. Currently typing on a custom 65% with lubed switches and a brass plate.",
    category: "hobbies"
  },
  {
    title: "Spotify Wrapped",
    description: "A deeper look at my listening habits beyond the surface stats. Genre exploration, artist discoveries, and late-night playlists.",
    category: "music"
  },
  {
    title: "Favorite Fonts",
    description: "A curated collection of typefaces I keep coming back to. From classics like Helvetica to modern gems like Inter and Space Grotesk.",
    category: "design"
  },
  {
    title: "Coffee Notes",
    description: "Tracking my coffee journey through different beans, brewing methods, and cafes. Currently obsessed with Ethiopian light roasts.",
    category: "food"
  }
]

export default function MiscPage() {
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
            Misc.
          </h1>
          <p className="text-lg text-muted-foreground">
            Random things that bring me joy
          </p>
        </motion.div>

        {/* Miscellaneous Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MISC_ITEMS.map((item, index) => (
            <motion.article
              key={item.title}
              className="border border-border rounded-lg p-6 hover:border-foreground/30 transition-colors duration-300 interactive group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {item.category}
              </span>
              <h2 className="text-lg font-sans font-bold mt-2 mb-3 group-hover:text-foreground transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Feat my trusty tools reference */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-muted-foreground font-mono italic">
            (Feat. my trusty tools)
          </p>
        </motion.div>
      </div>
    </main>
  )
}
