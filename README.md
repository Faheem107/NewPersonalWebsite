# faheem.wiki

My personal site: coursework notes, research, photography and film, and some
short pieces.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run typecheck
```

## Where things are

| | |
|---|---|
| `app/` | routes |
| `components/` | UI, including the torus and the WebGL backdrop |
| `content/notes/<subject>/<topic>.mdx` | a note; the route, sidebar entry, prev/next links and search entries all follow from the file |
| `content/research.ts`, `content/thoughts.ts` | those pages and the search index |
| `content/glossary.ts` | terms that explain themselves, referred to in prose as `[[key]]` |
| `lib/` | notes tree, search, motion helpers |

Built with Next.js, Tailwind, GSAP, Motion, three.js and KaTeX.

Conventions worth knowing before changing anything are in
[CONVENTIONS.md](CONVENTIONS.md).
