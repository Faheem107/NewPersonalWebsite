"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import VinylPlayer from "@/components/vinyl-player"
import TimeMachine from "@/components/time-machine"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <CustomCursor />
      <Navigation />

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Vinyl Player */}
        <motion.section
          className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col justify-center px-8 md:px-16 py-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-md mx-auto lg:mx-0 lg:ml-auto lg:mr-16">
            <VinylPlayer />
          </div>
        </motion.section>

        {/* Right Section - Name and Info */}
        <motion.section
          className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col justify-center px-8 md:px-16 py-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="max-w-lg">
            {/* Welcome Text */}
            <motion.p
              className="text-sm font-mono lowercase tracking-widest text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              welcome to my archive
            </motion.p>

            {/* Name */}
            <motion.h1
              className="text-5xl md:text-7xl font-sans font-light tracking-tight mb-6 text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Mohammed
              <br />
              <span className="font-normal">Faheem</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-lg md:text-xl font-sans font-light text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              bioengineering & research
            </motion.p>

            {/* Growing Website Text */}
            <motion.p
              className="text-sm font-sans italic text-muted-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              this website is forever growing with ideas and projects
            </motion.p>

            {/* Social Links */}
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-sans text-accent hover:text-foreground transition-colors duration-300 interactive link-hover"
              >
                instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-sans text-accent hover:text-foreground transition-colors duration-300 interactive link-hover"
              >
                linkedin
              </a>
            </motion.div>

            {/* Thought Bubble */}
            <motion.div
              className="mt-12 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="relative inline-block bg-background border border-border rounded-2xl px-6 py-4 shadow-sm">
                <p className="text-sm font-sans text-muted-foreground italic">
                  {"Let me make something really quickly..."}
                </p>
                {/* Bubble tail */}
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-background border-b border-r border-border rounded-full transform rotate-45" />
              </div>
              {/* Small thought bubbles */}
              <div className="absolute -bottom-8 left-6 w-2 h-2 bg-border rounded-full" />
              <div className="absolute -bottom-12 left-4 w-1.5 h-1.5 bg-border rounded-full" />
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* Background Infinite Scroll Images */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
        <TimeMachine />
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="fixed bottom-8 left-8 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-xs font-mono text-muted-foreground">
          last updated: may 2026
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="fixed bottom-8 right-8 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="w-6 h-10 border border-muted-foreground/30 rounded-full flex justify-center pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-1 h-2 bg-muted-foreground/50 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </main>
  )
}
