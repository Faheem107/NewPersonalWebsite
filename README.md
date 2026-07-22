# faheem.

Personal site: research, notes, photography and film.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; typecheck runs as part of it
npm run typecheck  # tsc --noEmit on its own
```

## Layout

```
app/                        routes
  notes/[subject]/[topic]/  note pages, generated from content/
components/
  backdrop/field-lines      the WebGL streamline backdrop
  mdx/                      the shared note vocabulary
  notes/                    the plate menu and note chrome
content/notes/              the notes themselves, as MDX
lib/
  notes.ts                  builds the note tree from the filesystem
  motion/                   pointer, magnetic and reveal primitives
```

## Adding a note

Drop an `.mdx` file into `content/notes/<subject>/` with frontmatter:

```mdx
---
title: Green's Functions
summary: Solve for a point source once, and every other source is an integral.
order: 2
updated: May 2026
---
```

The route, the entry in the notes menu, the prev/next links and the sitemap all
follow from the file being there. Nothing else needs editing.

Subject-level metadata lives in `content/notes/<subject>/_meta.json`: title,
blurb, sort order, and which backdrop field the subject uses.

Maths is written as `$inline$` and `$$display$$`, rendered to HTML at build time by
`remark-math` + `rehype-katex`. There is no maths runtime in the browser.

Components available inside a note: `<Figure>`, `<Diagram>`, `<Aside>`,
`<Definition>`, `<Theorem>`, `<Proof>`, `<Statement>`. See `components/mdx`.

## Notes on the design

The palette and type are built around the cyanotype, the one process that is both a
photographic print and the origin of the word blueprint. Cold paper, Prussian blue,
and content presented on "plates" (a framed field with a caption rail) rather than
cards.

Newsreader and Archivo are both variable fonts, and several interactions depend on
that: links and headings shift weight rather than colour on hover, and captions use
Archivo's width axis for a condensed cut instead of loading a second family.

`prefers-reduced-motion` is honoured throughout. The backdrop renders a single static
frame, smooth scrolling is not installed, and the custom cursor is disabled.
