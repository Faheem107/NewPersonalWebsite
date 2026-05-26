"use client"

import React from "react"
import "katex/dist/katex.min.css"
import { InlineMath, BlockMath } from "react-katex"

interface MathProps {
  children: string
  block?: boolean
}

export function Math({ children, block = false }: MathProps) {
  // Remove $$ delimiters if present
  const cleanMath = children.replace(/^\$\$/, "").replace(/\$\$$/, "").trim()
  
  if (block) {
    return <BlockMath math={cleanMath} />
  }
  return <InlineMath math={cleanMath} />
}

// Parse text with math and render appropriately
export function MathText({ children }: { children: string }) {
  // Split by $$ for block math
  const parts = children.split(/(\$\$[^$]+\$\$)/g)
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2)
          return <BlockMath key={index} math={math} />
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}
