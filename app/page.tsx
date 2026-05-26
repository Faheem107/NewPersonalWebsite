"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import CircularMenu from "@/components/circular-menu"
import ImageMarquee from "@/components/image-marquee"

const Torus3D = dynamic(() => import("@/components/torus-3d"), { ssr: false })

const WORDS = ["Physics.", "Film.", "Code.", "Curiosity."]
const TYPE_SPEED = 75
const DELETE_SPEED = 42
const PAUSE = 1800

function TypedSubtitle() {
  const [wordIdx, setWordIdx] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing")

  useEffect(() => {
    const word = WORDS[wordIdx]
    let t: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < word.length) {
        t = setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_SPEED)
      } else {
        t = setTimeout(() => setPhase("pausing"), PAUSE)
      }
    } else if (phase === "pausing") {
      setPhase("deleting")
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), DELETE_SPEED)
      } else {
        setWordIdx((i) => (i + 1) % WORDS.length)
        setPhase("typing")
      }
    }

    return () => clearTimeout(t)
  }, [text, phase, wordIdx])

  return (
    <span className="text-foreground/40">
      {text}
      <span className="animate-pulse ml-px">|</span>
    </span>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <CustomCursor />
      <Navigation />

      <div className="fixed top-5 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center min-h-[calc(100vh-1px)]">
        <div className="w-full grid grid-cols-2 items-center px-10 md:px-20 lg:px-28">

          {/* Left — circular dial, very faint until hovered */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0.12 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <CircularMenu />
            </motion.div>
          </motion.div>

          {/* Right — typography block */}
          <motion.div
            className="flex flex-col items-end text-right"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
          >
            {/* Large serif name like panoseconomou "Notebook" heading */}
            <h1 className="font-sans font-bold text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-tight text-foreground text-balance">
              Faheem<span className="animate-pulse">|</span>
            </h1>

            {/* Typed rotating subtitle */}
            <p className="mt-3 font-sans font-bold text-[clamp(1.4rem,3.5vw,2.8rem)] leading-none tracking-tight">
              <TypedSubtitle />
            </p>

            {/* Caption — like panoseconomou's "Panos&apos; Physics and Math Notes" */}
            <motion.p
              className="mt-5 text-sm font-sans text-muted-foreground tracking-wide"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Physics at NYU Abu Dhabi
            </motion.p>

            {/* Explore dot — panoseconomou style */}
            <motion.div
              className="mt-8 flex flex-col items-end gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-foreground block" />
              <span className="text-xs font-sans text-muted-foreground tracking-[0.18em] uppercase">
                explore
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Horizontal image marquee ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="w-full border-t border-border/30"
      >
        <ImageMarquee />
      </motion.div>

      {/* ── WebGL particle torus ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
        className="w-full flex justify-center py-8 border-t border-border/30"
      >
        <Torus3D />
      </motion.div>

      {/* ── Footer label ─────────────────────────────────── */}
      <motion.div
        className="pb-5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <p className="text-[10px] font-sans text-muted-foreground/40 tracking-[0.22em] uppercase">
          Last Updated May 2026
        </p>
      </motion.div>
    </main>
  )
}
