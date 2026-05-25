"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const NAV_ITEMS = [
  { label: "research", href: "/research" },
  { label: "photography & films", href: "/photography" },
  { label: "some thoughts!", href: "/thoughts" },
  { label: "misc.", href: "/misc" },
  { label: "about", href: "/about" },
]

export default function Navigation() {
  return (
    <nav className="fixed top-0 right-0 z-50 p-6 md:p-8">
      <ul className="flex flex-wrap justify-end gap-4 md:gap-6">
        {NAV_ITEMS.map((item, index) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <Link
              href={item.href}
              className="text-sm font-sans lowercase tracking-wide text-foreground/80 hover:text-foreground transition-all duration-300 link-hover interactive"
            >
              {item.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}
