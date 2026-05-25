"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import TimeMachine from "@/components/time-machine"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const [isHoveringLeft, setIsHoveringLeft] = useState(false)
  const [isHoveringRight, setIsHoveringRight] = useState(false)

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <CustomCursor />
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Infinite Scroll Images - Full screen and interactive */}
      <div className="fixed inset-0 z-0">
        <TimeMachine />
      </div>

      {/* Main Content Overlay - pointer-events-none so scrolling works */}
      <div className="relative z-10 min-h-screen flex items-center pointer-events-none">
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24">
          
          {/* Left Side - Pixel Art Turntable */}
          <motion.div
            className="mb-8 md:mb-0 pointer-events-auto"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onMouseEnter={() => setIsHoveringLeft(true)}
            onMouseLeave={() => setIsHoveringLeft(false)}
          >
            <motion.div
              animate={{ opacity: isHoveringLeft ? 1 : 0.15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="interactive"
            >
              <Image
                src="/images/vinyl-turntable.png"
                alt="Pixel art turntable"
                width={200}
                height={200}
                className="w-32 h-32 md:w-48 md:h-48 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </motion.div>
          </motion.div>

          {/* Right Side - Name and Title */}
          <motion.div
            className="text-right pointer-events-auto"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            onMouseEnter={() => setIsHoveringRight(true)}
            onMouseLeave={() => setIsHoveringRight(false)}
          >
            <motion.div
              animate={{ opacity: isHoveringRight ? 1 : 0.15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tight text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              >
                Faheem
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl font-sans font-bold text-muted-foreground mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              >
                Physics at NYU Abu Dhabi
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="fixed bottom-8 left-8 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p className="text-xs font-mono text-muted-foreground">
          Last Updated: May 2026
        </p>
      </motion.div>
    </main>
  )
}
