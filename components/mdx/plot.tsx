import fs from 'node:fs'
import path from 'node:path'
import type { ReactNode } from 'react'

/**
 * A generated diagram, inlined rather than served as an <img>.
 *
 * Inlining is the point: the SVG is authored with `currentColor` and the site's
 * CSS variables, so one file renders correctly in both themes. An <img> would
 * isolate it from the cascade and need a light and a dark copy.
 *
 * Server component, reading from disk at build time.
 */
export default function Plot({
  src,
  n,
  children,
}: {
  /** Path under public/, e.g. "notes/thermodynamics/carnot.svg" */
  src: string
  n?: number | string
  children?: ReactNode
}) {
  const file = path.join(process.cwd(), 'public', src)

  let svg: string
  try {
    svg = fs.readFileSync(file, 'utf8')
  } catch {
    // A missing diagram should not take the whole note down.
    return (
      <figure className="my-10">
        <div className="plate p-5">
          <p className="caption">Diagram not found: {src}</p>
        </div>
      </figure>
    )
  }

  return (
    <figure className="my-10">
      <div
        className="plate overflow-x-auto p-6 text-foreground [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-lg"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {(n || children) && (
        <figcaption className="mt-3 grid gap-x-4 md:grid-cols-[4rem_1fr]">
          {n ? <span className="caption md:text-right">Fig. {n}</span> : <span />}
          <span className="text-[0.875rem] leading-relaxed text-muted-foreground">{children}</span>
        </figcaption>
      )}
    </figure>
  )
}
