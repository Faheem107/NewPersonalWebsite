/**
 * The searchable document shape and the matcher.
 *
 * Split out from lib/search.ts deliberately: that module reads the notes tree
 * off disk, so importing it from the client dialog pulled node:fs into the
 * browser bundle. Everything here is pure and runs on both sides.
 */

export type SearchSection = 'Notes' | 'Research' | 'Thoughts' | 'Pages'

export type SearchDoc = {
  href: string
  section: SearchSection
  title: string
  /** the line under the title: a subject, a lab, a date */
  context?: string
  /** searched but not displayed, so a match can come from the body text */
  body?: string
  /** a section within a longer document, shown indented */
  nested?: boolean
}

/**
 * Scores one document against a set of lowercased terms. Zero means no match.
 *
 * Deliberately not fuzzy. cmdk's fuzzy scorer, which this replaces, matched
 * "brewster" against "Probability Distributions" and then selected it, so
 * pressing Enter went to the wrong page. People searching a site like this type
 * real words, so every term has to appear somewhere. Ranking is by where the
 * terms landed: a title beats a context line, which beats body text.
 */
export function scoreDoc(doc: SearchDoc, terms: string[]): number {
  if (!terms.length) return 1

  const title = doc.title.toLowerCase()
  const context = (doc.context ?? '').toLowerCase()
  const body = (doc.body ?? '').toLowerCase()
  const all = `${title} ${context} ${body}`

  if (!terms.every(term => all.includes(term))) return 0

  let score = 0
  for (const term of terms) {
    if (title.startsWith(term)) score += 8
    else if (title.includes(term)) score += 6
    else if (context.includes(term)) score += 3
    else score += 1
  }

  // A whole document should outrank one of its own sections.
  if (doc.nested) score -= 0.5

  return score
}

export function searchDocs(docs: SearchDoc[], query: string): SearchDoc[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return []

  return docs
    .map(doc => ({ doc, score: scoreDoc(doc, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ doc }) => doc)
    .slice(0, 40)
}
