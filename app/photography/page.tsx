"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Urban Fragments",
    type: "photography",
    year: "2026",
    description: "A series exploring the geometry of city life",
    imageUrl: "https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg"
  },
  {
    id: 2,
    title: "Quiet Moments",
    type: "photography",
    year: "2025",
    description: "Finding stillness in motion",
    imageUrl: "https://cdn.cosmos.so/c4588488-0021-4804-9c29-a43059378bfe?format=jpeg"
  },
  {
    id: 3,
    title: "Documentary Short",
    type: "film",
    year: "2025",
    description: "A 5-minute exploration of daily rituals",
    imageUrl: "https://cdn.cosmos.so/de8c561b-e4e4-48f3-9068-30d63b92c43e?format=jpeg"
  },
  {
    id: 4,
    title: "Abstract Series",
    type: "photography",
    year: "2024",
    description: "Light, shadow, and form",
    imageUrl: "https://cdn.cosmos.so/207b3ba7-13ef-496b-a9cb-2a718e14a24e?format=jpeg"
  },
  {
    id: 5,
    title: "Night Drive",
    type: "film",
    year: "2024",
    description: "Experimental short film",
    imageUrl: "https://cdn.cosmos.so/6c41e632-d300-4516-a7af-9a1f7c0aef94?format=jpeg"
  },
  {
    id: 6,
    title: "Textures",
    type: "photography",
    year: "2024",
    description: "Close-up studies of everyday materials",
    imageUrl: "https://cdn.cosmos.so/e552eaac-8251-4890-b954-e988fc4bf2e0?format=jpeg"
  }
]

export default function PhotographyPage() {
  const [filter, setFilter] = useState<"all" | "photography" | "film">("all")
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_ITEMS[0] | null>(null)

  const filteredItems = filter === "all" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.type === filter)

  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto px-8 py-24 md:py-32">
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
            Photography & Films
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Visual stories and experiments
          </p>

          {/* Filter */}
          <div className="flex gap-4">
            {(["all", "photography", "film"] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`text-sm font-mono transition-all duration-300 interactive ${
                  filter === filterOption
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                {filter === filterOption && (
                  <motion.div
                    className="h-px bg-foreground mt-1"
                    layoutId="filter-underline"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative aspect-[4/3] bg-secondary rounded-lg overflow-hidden cursor-pointer interactive"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-white/70 font-mono">{item.type} - {item.year}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 text-white">
                <h2 className="text-xl font-sans font-bold">{selectedItem.title}</h2>
                <p className="text-sm text-white/70 font-mono mt-1">
                  {selectedItem.type} - {selectedItem.year}
                </p>
                <p className="text-sm text-white/60 mt-2">{selectedItem.description}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm font-mono interactive"
              >
                Close [esc]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
