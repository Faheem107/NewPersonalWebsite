"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import VinylPlayer from "@/components/vinyl-player"
import { ThemeToggle } from "@/components/theme-toggle"

const BOOKS = [
  {
    title: "Surely You're Joking, Mr. Feynman!",
    author: "Richard Feynman",
    description: "Adventures of a curious character - physics, bongo drums, and safe-cracking."
  },
  {
    title: "The Elegant Universe",
    author: "Brian Greene",
    description: "Superstrings, hidden dimensions, and the quest for the ultimate theory."
  },
  {
    title: "Stalker",
    author: "Andrei Tarkovsky / Arkady & Boris Strugatsky",
    description: "The screenplay and novella that inspired the film - exploring faith and desire."
  },
  {
    title: "Godel, Escher, Bach",
    author: "Douglas Hofstadter",
    description: "An eternal golden braid weaving mathematics, art, and music into consciousness."
  },
  {
    title: "The Order of Time",
    author: "Carlo Rovelli",
    description: "A poetic exploration of time - physics meets philosophy meets poetry."
  }
]

const MOVIES = [
  {
    title: "Stalker",
    year: "1979",
    director: "Andrei Tarkovsky",
    description: "A journey into the Zone - faith, desire, and the room that grants wishes."
  },
  {
    title: "2001: A Space Odyssey",
    year: "1968",
    director: "Stanley Kubrick",
    description: "Humanity's evolution from ape to starchild, with HAL along for the ride."
  },
  {
    title: "In the Mood for Love",
    year: "2000",
    director: "Wong Kar-wai",
    description: "Two neighbors, two cheating spouses, and the restraint of unspoken love."
  },
  {
    title: "Interstellar",
    year: "2014",
    director: "Christopher Nolan",
    description: "Love transcending spacetime - Cooper reaching through a tesseract."
  },
  {
    title: "Chungking Express",
    year: "1994",
    director: "Wong Kar-wai",
    description: "Two lonely cops, expiring pineapples, and California Dreamin' on repeat."
  }
]

const MISC_ITEMS = [
  {
    title: "My iPad Setup",
    description: "A collection of apps, workflows, and accessories that make my iPad the perfect creative companion.",
    category: "tools"
  },
  {
    title: "Keyboard Builds",
    description: "My journey into mechanical keyboards. Currently typing on a custom 65% with lubed switches.",
    category: "hobbies"
  },
  {
    title: "Favorite Fonts",
    description: "A curated collection of typefaces I keep coming back to. From Helvetica to Space Grotesk.",
    category: "design"
  },
  {
    title: "Coffee Notes",
    description: "Tracking my coffee journey through different beans and brewing methods.",
    category: "food"
  }
]

export default function MiscPage() {
  const [showBooks, setShowBooks] = useState(false)
  const [showMovies, setShowMovies] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-5xl mx-auto px-8 py-24 md:py-32">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8 inline-block interactive"
          >
            &larr; back home
          </Link>
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">
            misc.
          </h1>
          <p className="text-lg text-muted-foreground">
            random things that bring me joy
          </p>
        </motion.div>

        {/* Icons Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-sans font-bold mb-8">icons list</h2>
          
          <div className="flex flex-wrap gap-6 items-center">
            {/* Vinyl Player Icon */}
            <motion.div
              className="interactive"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <VinylPlayer />
            </motion.div>

            {/* Books Icon */}
            <motion.button
              onClick={() => setShowBooks(!showBooks)}
              className="interactive flex flex-col items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/images/amethyst.png"
                alt="Books"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <span className="text-xs font-mono text-muted-foreground">books</span>
            </motion.button>

            {/* Movies Icon */}
            <motion.button
              onClick={() => setShowMovies(!showMovies)}
              className="interactive flex flex-col items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/images/lapis-lazuli.png"
                alt="Movies"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <span className="text-xs font-mono text-muted-foreground">movies</span>
            </motion.button>
          </div>
        </motion.section>

        {/* Books Modal */}
        <AnimatePresence>
          {showBooks && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowBooks(false)}
            >
              <motion.div
                className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-sans font-bold">recent reads</h3>
                  <button
                    onClick={() => setShowBooks(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors interactive"
                  >
                    close
                  </button>
                </div>
                <div className="space-y-4">
                  {BOOKS.map((book, index) => (
                    <motion.div
                      key={book.title}
                      className="border-b border-border pb-4 last:border-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <h4 className="font-sans font-bold">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <p className="text-sm text-foreground/70 mt-1">{book.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movies Modal */}
        <AnimatePresence>
          {showMovies && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowMovies(false)}
            >
              <motion.div
                className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-sans font-bold">favorite films</h3>
                  <button
                    onClick={() => setShowMovies(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors interactive"
                  >
                    close
                  </button>
                </div>
                <div className="space-y-4">
                  {MOVIES.map((movie, index) => (
                    <motion.div
                      key={movie.title}
                      className="border-b border-border pb-4 last:border-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <h4 className="font-sans font-bold">{movie.title} <span className="font-normal text-muted-foreground">({movie.year})</span></h4>
                      <p className="text-sm text-muted-foreground">{movie.director}</p>
                      <p className="text-sm text-foreground/70 mt-1">{movie.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Miscellaneous Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-sans font-bold mb-8">other things</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MISC_ITEMS.map((item, index) => (
              <motion.article
                key={item.title}
                className="border border-border rounded-lg p-6 hover:border-foreground/30 transition-colors duration-300 interactive group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.4, ease: "easeOut" }}
              >
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-lg font-sans font-bold mt-2 mb-3 group-hover:text-foreground transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-sm text-muted-foreground font-mono italic">
            (feat. my trusty tools)
          </p>
        </motion.div>
      </div>
    </main>
  )
}
