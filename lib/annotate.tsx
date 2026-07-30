import React from 'react'
import Gloss from '@/components/gloss'
import { GLOSSARY } from '@/content/glossary'

/**
 * Inline annotation, as a syntax rather than as markup.
 *
 * The content files hold prose as plain strings and the search index reads
 * those strings directly, so a glossed term goes in as syntax both readers
 * agree on rather than as JSX:
 *
 *     [[key]]                    the entry's own term
 *     [[key|as it reads here]]   when the sentence needs different words
 *
 * Everything that parses it lives in this file. A third reader means calling
 * parseAnnotated, not writing another regex.
 */

const TOKEN = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g

export type AnnotatedPart = string | { key: string; text: string }

/** Splits prose into plain runs and glossed terms, in order. */
export function parseAnnotated(text: string): AnnotatedPart[] {
  const parts: AnnotatedPart[] = []
  let last = 0

  for (const match of text.matchAll(TOKEN)) {
    const [raw, key, display] = match
    const at = match.index
    if (at > last) parts.push(text.slice(last, at))
    parts.push({ key, text: display ?? GLOSSARY[key]?.term ?? key })
    last = at + raw.length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts
}

/**
 * The prose without the brackets. Every content source routes through this, so
 * the index matches the words a reader sees and no result shows a bracket.
 */
export function stripAnnotations(text: string): string {
  return text.replace(TOKEN, (_, key: string, display?: string) =>
    display ?? GLOSSARY[key]?.term ?? key,
  )
}

/** Renders annotated prose. Plain runs stay plain; terms become <Gloss>. */
export function Annotated({ text }: { text: string }) {
  return (
    <>
      {parseAnnotated(text).map((part, i) =>
        typeof part === 'string' ? (
          <React.Fragment key={i}>{part}</React.Fragment>
        ) : (
          <Gloss key={i} entryKey={part.key}>
            {part.text}
          </Gloss>
        ),
      )}
    </>
  )
}
