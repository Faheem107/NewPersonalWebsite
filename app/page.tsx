"use client"

import React from "react"
import { motion } from "framer-motion"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import VinylPlayer from "@/components/vinyl-player"
import TimeMachine from "@/components/time-machine"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <CustomCursor />
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Infinite Scroll Images - Full opacity for landing */}
      <div className="fixed inset-0 z-0">
        <TimeMachine />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24">
          
          {/* Left Side - Vinyl Player */}
          <motion.div
            className="mb-8 md:mb-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VinylPlayer />
          </motion.div>

          {/* Right Side - Name and Title */}
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-sans font-light tracking-tight text-foreground lowercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              faheem
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl font-sans font-light text-muted-foreground mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Physics at NYU Abu Dhabi
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="fixed bottom-8 left-8 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs font-mono text-muted-foreground">
          last updated: may 2026
        </p>
      </motion.div>
    </main>
  )
}
