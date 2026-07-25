import React from 'react'
import Gloss from '@/components/gloss'
import { GLOSSARY } from '@/content/glossary'

/**
 * Inline annotation, as a syntax rather than as markup.
 *
 * `content/research.ts` and `content/thoughts.ts` hold prose as plain strings,
 * and `lib/search.ts` indexes those strings directly. Turning the bodies into
 * JSX to get glossed terms would make the content files `.tsx` and leave the
 * index holding React elements it cannot search, so the terms go in as a
 * syntax the prose can carry and both readers agree on:
 *
 *     [[key]]                 the entry's own term, as it reads in the glossary
 *     [[key|as it reads here]]   when the sentence needs different words
 *
 * Everything that reads that syntax lives in this file. Adding a third reader
 * later means calling `parseAnnotated`, not writing another regex.
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
 * The prose without the brackets.
 *
 * The search index runs everything through this, so a search for a glossed term
 * matches the words a reader actually sees and no result ever shows `[[`.
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
