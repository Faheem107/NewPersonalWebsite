import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * The note vocabulary. One set, shared by every note — the pages this replaces
 * redefined Section, Eq and Diagram inside all five subject files.
 *
 * Everything here uses the same device as the rest of the site: a condensed-caps
 * label in the left rail, prose in the field. No tinted boxes, no accent bars.
 */

/** A stated result. `kind` is the label; the rail carries it. */
export function Statement({
  kind = 'Definition',
  title,
  children,
}: {
  kind?: string
  title?: string
  children: ReactNode
}) {
  return (
    <div className="my-9 grid gap-x-8 gap-y-2 border-t border-border pt-5 md:grid-cols-[7rem_1fr]">
      <p className="caption md:pt-1 md:text-right">{kind}</p>
      <div>
        {title && <p className="mb-1.5 font-display text-lg leading-snug">{title}</p>}
        <div className="[&>p:last-child]:mb-0 [&>p]:mb-3">{children}</div>
      </div>
    </div>
  )
}

export const Definition = (p: { title?: string; children: ReactNode }) => (
  <Statement kind="Definition" {...p} />
)
export const Theorem = (p: { title?: string; children: ReactNode }) => (
  <Statement kind="Theorem" {...p} />
)
export const Proof = (p: { children: ReactNode }) => <Statement kind="Proof">{p.children}</Statement>

/** An aside. Sits in the margin on wide screens, inline on narrow ones. */
export function Aside({ children }: { children: ReactNode }) {
  return (
    <aside className="my-7 border-l border-border py-1 pl-5 text-[0.9375rem] italic text-muted-foreground [&>p:last-child]:mb-0 [&>p]:mb-2 xl:absolute xl:-right-4 xl:w-56 xl:translate-x-full xl:border-l-0 xl:pl-0 xl:not-italic">
      {children}
    </aside>
  )
}

/**
 * A figure with a plate caption.
 *
 * Scientific plots arrive with white backgrounds, which glare on a dark page.
 * `tone="invert"` flips luminance and rotates hue back, so a line plot reads as
 * light-on-dark with its curve colours roughly intact. `tone="keep"` is for
 * images where that would be wrong — photographs, colour-mapped renders — and
 * just takes the brightness down so the plate reads as a print on a dark wall.
 */
export function Figure({
  src,
  alt,
  width,
  height,
  n,
  tone = 'invert',
  children,
}: {
  src: string
  alt: string
  width: number
  height: number
  n?: number | string
  tone?: 'invert' | 'keep'
  children?: ReactNode
}) {
  return (
    <figure className="my-10">
      <div className="plate overflow-hidden p-3">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 720px"
          className={`h-auto w-full rounded-md ${
            tone === 'invert' ? 'dark:[filter:invert(1)_hue-rotate(180deg)_brightness(0.95)]' : 'dark:brightness-[0.82]'
          }`}
        />
      </div>
      {(n || children) && (
        <figcaption className="mt-3 grid gap-x-4 md:grid-cols-[4rem_1fr]">
          {n ? <span className="caption md:text-right">Fig. {n}</span> : <span />}
          <span className="text-[0.875rem] leading-relaxed text-muted-foreground">{children}</span>
        </figcaption>
      )}
    </figure>
  )
}

/** Preformatted ASCII diagrams, which several of the existing notes rely on. */
export function Diagram({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-9">
      <div className="plate overflow-x-auto p-5">
        <pre className="font-mono text-[0.6875rem] leading-[1.6] text-muted-foreground">
          {children}
        </pre>
      </div>
      {caption && <figcaption className="caption mt-3">{caption}</figcaption>}
    </figure>
  )
}

/** Baseline element mapping for MDX prose. */
export const mdxComponents = {
  h2: (p: React.ComponentProps<'h2'>) => (
    <h2
      {...p}
      className="wght-head mb-4 mt-14 scroll-mt-28 font-display text-[length:var(--text-h2)]"
    />
  ),
  h3: (p: React.ComponentProps<'h3'>) => (
    <h3
      {...p}
      className="wght-head mb-3 mt-10 scroll-mt-28 font-display text-[length:var(--text-h3)]"
    />
  ),
  p: (p: React.ComponentProps<'p'>) => <p {...p} className="mb-5 text-muted-foreground" />,
  ul: (p: React.ComponentProps<'ul'>) => (
    <ul {...p} className="mb-5 list-disc space-y-2 pl-5 text-muted-foreground marker:text-border" />
  ),
  ol: (p: React.ComponentProps<'ol'>) => (
    <ol
      {...p}
      className="mb-5 list-decimal space-y-2 pl-5 text-muted-foreground marker:text-border"
    />
  ),
  li: (p: React.ComponentProps<'li'>) => <li {...p} className="pl-1" />,
  blockquote: (p: React.ComponentProps<'blockquote'>) => (
    <blockquote
      {...p}
      className="my-7 border-l border-border pl-5 italic text-muted-foreground"
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
  strong: (p: React.ComponentProps<'strong'>) => (
    <strong {...p} className="text-foreground" style={{ fontVariationSettings: "'wght' 620" }} />
  ),
  code: (p: React.ComponentProps<'code'>) => (
    <code {...p} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.875em]" />
  ),
  pre: (p: React.ComponentProps<'pre'>) => (
    <pre {...p} className="plate my-7 overflow-x-auto p-5 font-mono text-[0.8125rem]" />
  ),
  a: ({ href = '', ...p }: React.ComponentProps<'a'>) =>
    href.startsWith('/') ? (
      <Link href={href} {...p} className="rule-link text-accent" />
    ) : (
      <a
        href={href}
        {...p}
        target="_blank"
        rel="noopener noreferrer"
        className="rule-link text-accent"
      />
    ),
  table: (p: React.ComponentProps<'table'>) => (
    <div className="my-8 overflow-x-auto">
      <table {...p} className="w-full border-collapse text-[0.9375rem]" />
    </div>
  ),
  th: (p: React.ComponentProps<'th'>) => (
    <th {...p} className="caption border-b border-foreground/30 px-3 py-2 text-left" />
  ),
  td: (p: React.ComponentProps<'td'>) => (
    <td {...p} className="border-b border-border px-3 py-2 text-muted-foreground" />
  ),
  Figure,
  Diagram,
  Aside,
  Statement,
  Definition,
  Theorem,
  Proof,
}
