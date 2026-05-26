"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import CircularMenu from "@/components/circular-menu"
import ImageMarquee from "@/components/image-marquee"

// Load 3D torus client-side only (no SSR)
const Torus3D = dynamic(() => import("@/components/torus-3d"), { ssr: false })

const TYPING_WORDS = ["Physics.", "Film.", "Code.", "Curiosity."]
const TYPING_SPEED = 80
const DELETING_SPEED = 45
const PAUSE_MS = 1800

function TypingHeadline() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing")

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), TYPING_SPEED)
      } else {
        timeout = setTimeout(() => setPhase("pausing"), PAUSE_MS)
      }
    } else if (phase === "pausing") {
      setPhase("deleting")
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETING_SPEED)
      } else {
        setWordIndex((i) => (i + 1) % TYPING_WORDS.length)
        setPhase("typing")
      }
    }

    return () => clearTimeout(timeout)
  }, [displayed, phase, wordIndex])

  return (
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tight text-foreground leading-none">
      Faheem.<br />
      <span className="text-foreground/50">
        {displayed}
        <span className="animate-pulse">|</span>
      </span>
    </h1>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <CustomCursor />
      <Navigation />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <div className="flex-1 flex items-center">
        <div className="w-full flex items-center justify-between px-8 md:px-16 lg:px-24 gap-12">

          {/* Left — circular menu, low opacity until hover */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0.15 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <CircularMenu />
            </motion.div>
          </motion.div>

          {/* Right — typing headline + subtitle */}
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <motion.div
              initial={{ opacity: 0.15 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TypingHeadline />
              <motion.p
                className="text-base md:text-lg font-sans font-bold text-foreground/60 mt-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Physics at NYU Abu Dhabi
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Horizontal image marquee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="w-full"
      >
        <ImageMarquee />
      </motion.div>

      {/* 3D Torus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
        className="w-full flex justify-center py-6"
      >
        <Torus3D />
      </motion.div>

      {/* Bottom label */}
      <motion.div
        className="pb-6 text-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-xs font-sans text-muted-foreground/50 tracking-widest uppercase">
          Last Updated: May 2026
        </p>
      </motion.div>
    </main>
  )
}
