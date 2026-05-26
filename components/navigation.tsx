"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const NAV_ITEMS = [
  { label: "research", href: "/research" },
  { label: "photography & films", href: "/photography" },
  { label: "some thoughts!", href: "/thoughts" },
  { label: "notes", href: "/notes" },
  { label: "about", href: "/about" },
]

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 p-6 md:p-8 flex items-start justify-between">
      {/* Home button — top-left */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Link
          href="/"
          className="text-sm font-sans font-bold tracking-wide text-foreground/80 hover:text-foreground transition-colors duration-200 interactive"
        >
          faheem.
        </Link>
      </motion.div>

      {/* Nav links — top-right */}
      <ul className="flex flex-wrap justify-end gap-4 md:gap-6 mr-12">
        {NAV_ITEMS.map((item, index) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <Link
              href={item.href}
              prefetch={true}
              className="text-sm font-sans font-bold tracking-wide text-foreground/80 hover:text-foreground transition-all duration-300 link-hover interactive"
            >
              {item.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}
