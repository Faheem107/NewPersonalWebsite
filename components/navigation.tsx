"use client"

import React, { useRef } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import Link from "next/link"

const NAV_ITEMS = [
  { label: "research",           href: "/research" },
  { label: "photography & films",href: "/photography" },
  { label: "some thoughts!",     href: "/thoughts" },
  { label: "notes",              href: "/notes" },
  { label: "about",              href: "/about" },
]

export default function Navigation() {
  const [visible, setVisible] = React.useState(true)
  const lastY = useRef(0)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev      = lastY.current
    const scrolling  = current - prev

    if (current < 10) {
      // Always show when near top
      setVisible(true)
    } else if (scrolling > 0) {
      // Scrolling down — hide
      setVisible(false)
    } else {
      // Scrolling up — instantly show
      setVisible(true)
    }
    lastY.current = current
  })

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 p-6 md:p-8 flex items-start justify-between"
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {/* Home — top-left */}
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

      {/* Links — top-right */}
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
    </motion.nav>
  )
}
