"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import CircularMenu from "@/components/circular-menu"

const NAME = "Faheem"
const SUBTEXTS = ["Physics.", "Film.", "Mathematics."]
const TYPE_SPEED = 80
const DELETE_SPEED = 45
const PAUSE_MS = 1800

function TypingName({ onDone }: { onDone: () => void }) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    if (displayed.length < NAME.length) {
      const t = setTimeout(() => {
        setDisplayed(NAME.slice(0, displayed.length + 1))
      }, TYPE_SPEED)
      return () => clearTimeout(t)
    } else {
      setDone(true)
      onDone()
    }
  }, [displayed, done, onDone])

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse ml-px">|</span>}
    </span>
  )
}

function RotatingSubtitle() {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing")

  useEffect(() => {
    const word = SUBTEXTS[idx]
    let t: ReturnType<typeof setTimeout>
    if (phase === "typing") {
      if (text.length < word.length) {
        t = setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_SPEED)
      } else {
        t = setTimeout(() => setPhase("pausing"), PAUSE_MS)
      }
    } else if (phase === "pausing") {
      setPhase("deleting")
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), DELETE_SPEED)
      } else {
        setIdx(i => (i + 1) % SUBTEXTS.length)
        setPhase("typing")
      }
    }
    return () => clearTimeout(t)
  }, [text, phase, idx])

  return (
    <span className="text-foreground/40">
      {text}
      <span className="animate-pulse ml-px">|</span>
    </span>
  )
}

export default function Home() {
  const [nameDone, setNameDone] = useState(false)
  const [explode, setExplode] = useState(false)

  return (
    <main className="min-h-screen bg-background flex flex-col overflow-x-hidden border-none outline-none">
      <CustomCursor />
      <Navigation />

      <div className="fixed top-5 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center min-h-[calc(100vh-1px)] border-none outline-none">
        <div className="w-full grid grid-cols-2 items-center gap-8 px-10 md:px-20 lg:px-28 border-none outline-none">

          {/* Left — WebGL torus container */}
          <motion.div
            className="flex items-center justify-center border-none outline-none select-none"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="border-none outline-none"
              initial={{ opacity: 0.15 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Passing the state directly into your real component */}
              <CircularMenu forceOpen={explode} />
            </motion.div>
          </motion.div>

          {/* Right — typography block */}
          <motion.div
            className="flex flex-col items-end text-right"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
          >
            <h1 className="font-sans font-bold text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-tight text-foreground">
              <TypingName onDone={() => setNameDone(true)} />
            </h1>

            <AnimatePresence>
              {nameDone && (
                <motion.p
                  className="mt-3 font-sans font-bold text-[clamp(1.4rem,3.5vw,2.8rem)] leading-none tracking-tight"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <RotatingSubtitle />
                </motion.p>
              )}
            </AnimatePresence>

            <motion.p
              className="mt-5 text-sm font-sans text-muted-foreground tracking-wide"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Physics at NYU Abu Dhabi
            </motion.p>

            <motion.button
              className="mt-8 text-xs font-sans text-muted-foreground tracking-[0.18em] uppercase hover:text-foreground transition-colors duration-200 interactive cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              onClick={() => setExplode(v => !v)}
            >
              explore
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── Footer label ─────────────────────────────────── */}
      <motion.div
        className="pb-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        <p className="text-[10px] font-sans text-muted-foreground/40 tracking-[0.22em] uppercase">
          Last Updated May 2026
        </p>
      </motion.div>

    </main>
  )
}