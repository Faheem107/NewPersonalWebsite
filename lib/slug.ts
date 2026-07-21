/**
 * Shared by the search index and the MDX components, so an anchor generated at
 * render time and a link generated at build time always agree. Matches the ids
 * rehype-slug produces for ordinary markdown headings.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
